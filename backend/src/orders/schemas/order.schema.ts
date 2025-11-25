import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop()
  image?: string;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ type: Types.ObjectId, ref: 'Address', required: true })
  addressId: Types.ObjectId;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop()
  paymentScreenshot?: string; // Capture d'écran de paiement encodée en base64

  @Prop({
    required: true,
    enum: ['en_cours', 'livraison', 'livre', 'annule'],
    default: 'en_cours',
  })
  status: string;

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  shipping: number;

  @Prop({ required: true })
  total: number;

  @Prop({ type: [Object], default: [] })
  trackingSteps: Array<{
    id: string;
    label: string;
    description: string;
    completed: boolean;
    completedAt?: Date;
  }>;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });

