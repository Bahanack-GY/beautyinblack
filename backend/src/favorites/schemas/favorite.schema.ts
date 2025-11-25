import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FavoriteDocument = Favorite & Document;

@Schema({ timestamps: true })
export class Favorite {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop()
  size?: string;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

// S'assurer d'un seul favori par combinaison utilisateur-produit
FavoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

