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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const isAdmin = user.role === 'admin';
    return this.ordersService.findAll(
      user.userId, 
      status,
      page ? parseInt(page) : undefined,
      limit ? parseInt(limit) : undefined,
      isAdmin,
    );
  }

  @Get('stats')
  async getStats(@CurrentUser() user: any) {
    const isAdmin = user.role === 'admin';
    return this.ordersService.getStats(user.userId, isAdmin);
  }

  @Get(':orderId')
  async findOne(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
  ) {
    const isAdmin = user.role === 'admin';
    return this.ordersService.findOne(user.userId, orderId, isAdmin);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: any,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(user.userId, createOrderDto);
  }

  @Put(':orderId')
  @HttpCode(HttpStatus.OK)
  async update(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: any,
  ) {
    const isAdmin = user.role === 'admin';
    return this.ordersService.update(user.userId, orderId, updateOrderDto, isAdmin);
  }

  @Put(':orderId/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
    @Body() body: { status: string },
  ) {
    const isAdmin = user.role === 'admin';
    return this.ordersService.updateStatus(user.userId, orderId, body.status, isAdmin);
  }

  @Delete(':orderId')
  @HttpCode(HttpStatus.OK)
  async cancel(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
  ) {
    return this.ordersService.cancel(user.userId, orderId);
  }
}

