import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async findAll(userId: string, unread?: boolean) {
    const filter: any = { userId: new Types.ObjectId(userId) };
    if (unread !== undefined) {
      filter.read = !unread;
    }

    const notifications = await this.notificationModel
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();

    const unreadCount = await this.notificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      read: false,
    });

    return {
      notifications: notifications.map((notif) => ({
        id: notif._id.toString(),
        title: notif.title,
        message: notif.message,
        type: notif.type,
        read: notif.read,
        createdAt: (notif as any).createdAt?.toISOString() || new Date().toISOString(),
      })),
      unreadCount,
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.notificationModel.findOneAndUpdate(
      {
        _id: notificationId,
        userId: new Types.ObjectId(userId),
      },
      { read: true },
      { new: true },
    );

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return { message: 'Notification marked as read' };
  }

  async markAllAsRead(userId: string) {
    await this.notificationModel.updateMany(
      { userId: new Types.ObjectId(userId), read: false },
      { read: true },
    );

    return { message: 'All notifications marked as read' };
  }

  async findOne(userId: string, notificationId: string) {
    const notification = await this.notificationModel.findOne({
      _id: notificationId,
      userId: new Types.ObjectId(userId),
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return {
      id: notification._id.toString(),
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: notification.read,
      createdAt: (notification as any).createdAt?.toISOString() || new Date().toISOString(),
    };
  }

  async getUnreadCount(userId: string) {
    const unreadCount = await this.notificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      read: false,
    });

    return { unreadCount };
  }

  async remove(userId: string, notificationId: string) {
    const notification = await this.notificationModel.findOneAndDelete({
      _id: notificationId,
      userId: new Types.ObjectId(userId),
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return {
      message: 'Notification deleted successfully',
      id: notificationId,
    };
  }

  async removeAll(userId: string) {
    const result = await this.notificationModel.deleteMany({
      userId: new Types.ObjectId(userId),
    });

    return {
      message: 'All notifications deleted successfully',
      count: result.deletedCount,
    };
  }
}

