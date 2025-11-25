import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from './dto/add-favorite.dto';
import { MoveToCartDto } from './dto/move-to-cart.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.favoritesService.findAll(user.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async add(
    @CurrentUser() user: any,
    @Body() addFavoriteDto: AddFavoriteDto,
  ) {
    return this.favoritesService.add(user.userId, addFavoriteDto);
  }

  @Delete(':productId')
  async remove(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
  ) {
    return this.favoritesService.remove(user.userId, productId);
  }

  @Post(':productId/move-to-cart')
  @HttpCode(HttpStatus.OK)
  async moveToCart(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
    @Body() moveToCartDto: MoveToCartDto,
  ) {
    return this.favoritesService.moveToCart(user.userId, productId, moveToCartDto);
  }
}

