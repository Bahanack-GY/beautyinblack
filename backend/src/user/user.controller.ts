import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoints admin pour gérer tous les utilisateurs
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.userService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      role,
    });
  }

  @Get('stats')
  async getStats() {
    return this.userService.getStats();
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.userService.getProfile(user.userId);
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(user.userId, updateProfileDto);
  }

  @Get('addresses')
  async getAddresses(@CurrentUser() user: any) {
    return this.userService.getAddresses(user.userId);
  }

  @Post('addresses')
  async createAddress(
    @CurrentUser() user: any,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.userService.createAddress(user.userId, createAddressDto);
  }

  @Put('addresses/:addressId')
  async updateAddress(
    @CurrentUser() user: any,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.userService.updateAddress(user.userId, addressId, updateAddressDto);
  }

  @Delete('addresses/:addressId')
  async deleteAddress(
    @CurrentUser() user: any,
    @Param('addressId') addressId: string,
  ) {
    return this.userService.deleteAddress(user.userId, addressId);
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Put(':userId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('userId') userId: string,
    @Body() updateDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(userId, updateDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('userId') userId: string) {
    return this.userService.remove(userId);
  }

  @Get(':userId/addresses')
  async getUserAddresses(@Param('userId') userId: string) {
    return this.userService.getAddresses(userId);
  }
}

