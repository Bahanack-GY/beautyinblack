import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderItem } from './schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { Address, AddressDocument } from '../user/schemas/address.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(userId: string, status?: string, page?: number, limit?: number, isAdmin: boolean = false) {
    // L'admin peut voir toutes les commandes, les utilisateurs réguliers voient seulement les leurs
    const filter: any = isAdmin ? {} : { userId: new Types.ObjectId(userId) };
    if (status) {
      filter.status = status;
    }

    let query = this.orderModel.find(filter).sort({ createdAt: -1 });
    
    if (page && limit) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const [orders, total] = await Promise.all([
      query.exec(),
      this.orderModel.countDocuments(filter),
    ]);

    const result: any = {
      orders: await Promise.all(orders.map((order) => this.formatOrder(order, isAdmin))),
    };

    if (page && limit) {
      result.total = total;
      result.page = page;
      result.limit = limit;
      result.totalPages = Math.ceil(total / limit);
    }

    return result;
  }

  async getStats(userId: string, isAdmin: boolean = false) {
    const filter = isAdmin ? {} : { userId: new Types.ObjectId(userId) };
    const orders = await this.orderModel.find(filter);
    
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'en_cours').length,
      processing: orders.filter((o) => o.status === 'en_cours').length,
      shipped: orders.filter((o) => o.status === 'livraison').length,
      delivered: orders.filter((o) => o.status === 'livre').length,
    };
  }

  async findOne(userId: string, orderId: string, isAdmin: boolean = false) {
    // Admin peut voir toutes les commandes, les utilisateurs réguliers ne voient que les leurs
    const filter: any = { _id: orderId };
    if (!isAdmin) {
      filter.userId = new Types.ObjectId(userId);
    }

    const order = await this.orderModel.findOne(filter);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.formatOrderDetails(order, isAdmin);
  }

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const address = await this.addressModel.findOne({
      _id: createOrderDto.addressId,
      userId: new Types.ObjectId(userId),
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const itemDto of createOrderDto.items) {
      const product = await this.productModel.findById(itemDto.productId);
      if (!product) {
        throw new NotFoundException(`Product ${itemDto.productId} not found`);
      }

      orderItems.push({
        productId: new Types.ObjectId(itemDto.productId),
        name: product.name,
        size: itemDto.size,
        quantity: itemDto.quantity,
        price: product.price,
        image: product.image,
      });

      subtotal += product.price * itemDto.quantity;
    }

    const shipping = subtotal > 5000 ? 0 : 500; // Livraison gratuite au-dessus de 50€, sinon 5€
    const total = subtotal + shipping;

    const trackingSteps = this.getInitialTrackingSteps();

    const order = await this.orderModel.create({
      userId: new Types.ObjectId(userId),
      items: orderItems,
      addressId: new Types.ObjectId(createOrderDto.addressId),
      paymentMethod: createOrderDto.paymentMethod,
      status: 'en_cours',
      subtotal,
      shipping,
      total,
      trackingSteps,
    });

    return {
      orderId: order._id.toString(),
      message: 'Order created successfully',
      order: {
        id: order._id.toString(),
        status: order.status,
        total: order.total,
      },
    };
  }

  async createFromCart(
    userId: string,
    cart: CartDocument,
    addressId: string,
    paymentMethod: string,
    paymentScreenshot?: string,
  ) {
    const address = await this.addressModel.findOne({
      _id: addressId,
      userId: new Types.ObjectId(userId),
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    const orderItems: OrderItem[] = [];

    for (const cartItem of cart.items) {
      const product = await this.productModel.findById(cartItem.productId);
      if (product) {
        orderItems.push({
          productId: cartItem.productId,
          name: product.name,
          size: cartItem.size,
          quantity: cartItem.quantity,
          price: product.price,
          image: product.image,
        });
      }
    }

    const trackingSteps = this.getInitialTrackingSteps();

    const order = await this.orderModel.create({
      userId: new Types.ObjectId(userId),
      items: orderItems,
      addressId: new Types.ObjectId(addressId),
      paymentMethod,
      paymentScreenshot,
      status: 'en_cours',
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      total: cart.total,
      trackingSteps,
    });

    return order;
  }

  private getInitialTrackingSteps() {
    return [
      {
        id: '1',
        label: 'Commande confirmée',
        description: 'Votre commande a été confirmée',
        completed: true,
        completedAt: new Date(),
      },
      {
        id: '2',
        label: 'En préparation',
        description: 'Votre commande est en cours de préparation',
        completed: false,
      },
      {
        id: '3',
        label: 'Expédiée',
        description: 'Votre commande a été expédiée',
        completed: false,
      },
      {
        id: '4',
        label: 'En livraison',
        description: 'Votre commande est en cours de livraison',
        completed: false,
      },
      {
        id: '5',
        label: 'Livrée',
        description: 'Votre commande a été livrée',
        completed: false,
      },
    ];
  }

  private async formatOrder(order: OrderDocument, includeUser: boolean = false) {
    const orderObj = order.toObject();
    const result: any = {
      id: orderObj._id.toString(),
      date: orderObj.createdAt.toISOString(),
      status: orderObj.status,
      statusText: this.getStatusText(orderObj.status),
      total: orderObj.total,
      items: orderObj.items.map((item) => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        image: item.image,
      })),
    };

    // Inclure les informations utilisateur pour l'admin
    if (includeUser) {
      const user = await this.userModel.findById(orderObj.userId).select('name email phone');
      if (user) {
        result.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
        };
        result.customer = result.user; // Alias pour compatibilité
      }
    }

    return result;
  }

  private async formatOrderDetails(order: OrderDocument, includeUser: boolean = false) {
    const orderObj = order.toObject();
    const address = await this.addressModel.findById(orderObj.addressId);

    const result: any = {
      id: orderObj._id.toString(),
      date: orderObj.createdAt.toISOString(),
      status: orderObj.status,
      statusText: this.getStatusText(orderObj.status),
      total: orderObj.total,
      subtotal: orderObj.subtotal,
      shipping: orderObj.shipping,
      paymentMethod: orderObj.paymentMethod,
      paymentScreenshot: orderObj.paymentScreenshot,
      items: orderObj.items.map((item, index) => ({
        id: index + 1,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      address: address
        ? {
            id: address._id.toString(),
            street: address.street,
            city: address.city,
            country: address.country,
            fullAddress: `${address.street}, ${address.city}, ${address.country}`,
          }
        : null,
      trackingSteps: orderObj.trackingSteps.map((step) => ({
        id: step.id,
        label: step.label,
        description: step.description,
        completed: step.completed,
        completedAt: step.completedAt?.toISOString(),
      })),
    };

    // Inclure les informations client pour l'admin
    if (includeUser) {
      const user = await this.userModel.findById(orderObj.userId).select('name email phone');
      if (user) {
        result.customer = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
        };
      }
    }

    return result;
  }

  async update(userId: string, orderId: string, updateDto: any, isAdmin: boolean = false) {
    // Admin peut modifier toutes les commandes
    const filter: any = { _id: orderId };
    if (!isAdmin) {
      filter.userId = new Types.ObjectId(userId);
    }

    const order = await this.orderModel.findOneAndUpdate(
      filter,
      updateDto,
      { new: true },
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.formatOrder(order, isAdmin);
  }

  async updateStatus(userId: string, orderId: string, status: string, isAdmin: boolean = false) {
    // Admin peut modifier le statut de toutes les commandes
    const filter: any = { _id: orderId };
    if (!isAdmin) {
      filter.userId = new Types.ObjectId(userId);
    }

    const order = await this.orderModel.findOneAndUpdate(
      filter,
      { status },
      { new: true },
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.formatOrder(order, isAdmin);
  }

  async cancel(userId: string, orderId: string) {
    const order = await this.orderModel.findOneAndUpdate(
      { _id: orderId, userId: new Types.ObjectId(userId) },
      { status: 'annule' },
      { new: true },
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      message: 'Order cancelled successfully',
      order: this.formatOrder(order),
    };
  }

  private getStatusText(status: string): string {
    const statusMap = {
      en_cours: 'En cours',
      livraison: 'En livraison',
      livre: 'Livrée',
      annule: 'Annulée',
    };
    return statusMap[status] || status;
  }
}

