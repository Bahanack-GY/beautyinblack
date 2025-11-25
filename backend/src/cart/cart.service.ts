import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private ordersService: OrdersService,
  ) {}

  async getCart(userId: string) {
    let cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
    
    if (!cart) {
      cart = await this.cartModel.create({
        userId: new Types.ObjectId(userId),
        items: [],
      });
    }

    await this.calculateTotals(cart);
    return this.formatCart(cart);
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const product = await this.productModel.findById(addToCartDto.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.sizes.includes(addToCartDto.size)) {
      throw new BadRequestException('Invalid size for this product');
    }

    let cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
    
    if (!cart) {
      cart = await this.cartModel.create({
        userId: new Types.ObjectId(userId),
        items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === addToCartDto.productId.toString() &&
        item.size === addToCartDto.size,
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += addToCartDto.quantity;
    } else {
      cart.items.push({
        productId: new Types.ObjectId(addToCartDto.productId),
        size: addToCartDto.size,
        quantity: addToCartDto.quantity,
      });
    }

    await this.calculateTotals(cart);
    await cart.save();

    return {
      message: 'Item added to cart',
      cart: {
        items: cart.items,
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    };
  }

  async updateCartItem(userId: string, itemId: string, updateDto: UpdateCartItemDto) {
    const cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = (cart.items as any).id(itemId);
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    item.quantity = updateDto.quantity;
    await this.calculateTotals(cart);
    await cart.save();

    return { message: 'Cart item updated' };
  }

  async removeCartItem(userId: string, itemId: string) {
    const cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => (item._id?.toString() || item.id?.toString()) === itemId,
    );
    if (itemIndex === -1) {
      throw new NotFoundException('Cart item not found');
    }

    cart.items.splice(itemIndex, 1);
    await this.calculateTotals(cart);
    await cart.save();

    return { message: 'Item removed from cart' };
  }

  async checkout(userId: string, checkoutDto: CheckoutDto) {
    const cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Créer la commande depuis le panier
    const order = await this.ordersService.createFromCart(
      userId,
      cart,
      checkoutDto.addressId,
      checkoutDto.paymentMethod,
      checkoutDto.paymentScreenshot,
    );

    // Vider le panier
    cart.items = [];
    cart.subtotal = 0;
    cart.shipping = 0;
    cart.total = 0;
    await cart.save();

    return {
      orderId: order.id,
      message: 'Order created successfully',
    };
  }

  private async calculateTotals(cart: CartDocument) {
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await this.productModel.findById(item.productId);
      if (product) {
        subtotal += product.price * item.quantity;
      }
    }

    const shipping = subtotal > 5000 ? 0 : 500; // Livraison gratuite au-dessus de 50€, sinon 5€
    const total = subtotal + shipping;

    cart.subtotal = subtotal;
    cart.shipping = shipping;
    cart.total = total;
  }

  private async formatCart(cart: CartDocument) {
    const items = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.productModel.findById(item.productId);
        return {
          id: (item as any)._id?.toString() || (item as any).id?.toString() || '',
          productId: item.productId,
          name: product?.name || '',
          price: product?.price || 0,
          size: item.size,
          quantity: item.quantity,
          image: product?.image || '',
        };
      }),
    );

    return {
      items,
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      total: cart.total,
    };
  }
}

