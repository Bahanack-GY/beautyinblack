import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productsService.findAll({
      category,
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Public()
  @Get('best-sellers')
  async findBestSellers() {
    return this.productsService.findBestSellers();
  }

  @Public()
  @Get('search')
  async search(
    @Query('q') q: string,
    @Query('category') category?: string,
  ) {
    return this.productsService.search({ q, category });
  }

  @Public()
  @Get('category/:categoryName')
  async findByCategory(
    @Param('categoryName') categoryName: string,
    @Query('skinType') skinType?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.findByCategory(categoryName, { skinType, search });
  }

  @Public()
  @Get(':id/analytics')
  async getAnalytics(@Param('id') id: string) {
    return this.productsService.getProductAnalytics(id);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    console.log('=== PRODUCT CREATE REQUEST ===');
    console.log('Received data:', {
      name: createProductDto.name,
      category: createProductDto.category,
      description: createProductDto.description?.substring(0, 50) + '...',
      price: createProductDto.price,
      sizes: createProductDto.sizes,
      image: createProductDto.image ? `${createProductDto.image.substring(0, 50)}...` : 'missing',
      images: createProductDto.images ? `Array(${createProductDto.images.length})` : 'missing',
      skinTypes: createProductDto.skinTypes,
      rating: createProductDto.rating,
      deliveryInfo: createProductDto.deliveryInfo,
    });
    
    try {
      const result = await this.productsService.create(createProductDto);
      console.log('Product created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('=== PRODUCT CREATION ERROR ===');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      throw error;
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Put('bulk')
  @HttpCode(HttpStatus.OK)
  async bulkUpdate(@Body() body: { updates: any[] }) {
    return this.productsService.bulkUpdate(body.updates);
  }

  @Delete('bulk')
  @HttpCode(HttpStatus.OK)
  async bulkDelete(@Body() body: { ids: string[] }) {
    return this.productsService.bulkDelete(body.ids);
  }
}

