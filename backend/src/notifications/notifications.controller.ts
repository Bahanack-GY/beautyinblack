import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('unread') unread?: string,
  ) {
    const unreadFilter = unread === 'true' ? true : undefined;
    return this.notificationsService.findAll(user.userId, unreadFilter);
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser() user: any) {
    return this.notificationsService.getUnreadCount(user.userId);
  }

  @Get(':notificationId')
  async findOne(
    @CurrentUser() user: any,
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationsService.findOne(user.userId, notificationId);
  }

  @Put(':notificationId/read')
  async markAsRead(
    @CurrentUser() user: any,
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationsService.markAsRead(user.userId, notificationId);
  }

  @Put('read-all')
  async markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.userId);
  }

  @Delete(':notificationId')
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentUser() user: any,
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationsService.remove(user.userId, notificationId);
  }

  @Delete('all')
  @HttpCode(HttpStatus.OK)
  async removeAll(@CurrentUser() user: any) {
    return this.notificationsService.removeAll(user.userId);
  }
}

