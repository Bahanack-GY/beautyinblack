import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Favorite, FavoriteDocument } from './schemas/favorite.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { AddFavoriteDto } from './dto/add-favorite.dto';
import { MoveToCartDto } from './dto/move-to-cart.dto';
import { CartService } from '../cart/cart.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private cartService: CartService,
  ) {}

  async findAll(userId: string) {
    const favorites = await this.favoriteModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('productId')
      .exec();

    const formattedFavorites = await Promise.all(
      favorites.map(async (favorite) => {
        const product = await this.productModel.findById(favorite.productId);
        if (!product) return null;

        return {
          id: favorite._id.toString(),
          productId: product._id.toString(),
          name: product.name,
          price: this.formatPrice(product.price),
          details: product.description,
          image: product.image,
          category: product.category,
          size: favorite.size || product.sizes[0] || '',
        };
      }),
    );

    return {
      favorites: formattedFavorites.filter((f) => f !== null),
      count: formattedFavorites.filter((f) => f !== null).length,
    };
  }

  async add(userId: string, addFavoriteDto: AddFavoriteDto) {
    const product = await this.productModel.findById(addFavoriteDto.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.favoriteModel.findOne({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(addFavoriteDto.productId),
    });

    if (existing) {
      throw new ConflictException('Product already in favorites');
    }

    const favorite = await this.favoriteModel.create({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(addFavoriteDto.productId),
    });

    return {
      message: 'Product added to favorites',
      favorite: {
        id: favorite._id.toString(),
        productId: favorite.productId.toString(),
      },
    };
  }

  async remove(userId: string, productId: string) {
    const favorite = await this.favoriteModel.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    return { message: 'Product removed from favorites' };
  }

  async moveToCart(userId: string, productId: string, moveToCartDto: MoveToCartDto) {
    const favorite = await this.favoriteModel.findOne({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    // Ajouter au panier
    await this.cartService.addToCart(userId, {
      productId: productId,
      size: moveToCartDto.size,
      quantity: moveToCartDto.quantity,
    });

    // Optionnellement retirer des favoris
    // await this.remove(userId, productId);

    return { message: 'Item moved to cart' };
  }

  private formatPrice(price: number): string {
    return `${(price / 100).toFixed(2)} €`;
  }
}

