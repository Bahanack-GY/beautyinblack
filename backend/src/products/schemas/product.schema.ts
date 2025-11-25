import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number; // Stocké comme nombre (dans la plus petite unité monétaire)

  @Prop({ required: true, enum: ['Homme', 'Femme', 'Enfant', 'Mixte'] })
  category: string;

  @Prop({ type: [String], default: [] })
  sizes: string[];

  @Prop({ required: true })
  image: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: 0, min: 0, max: 5 })
  rating: number;

  @Prop()
  deliveryInfo?: string;

  @Prop({ default: 0 })
  salesCount: number; // Pour le calcul des meilleures ventes

  @Prop({ type: [String], default: [] })
  skinTypes: string[]; // sèche, grasse, mixte, sensible, normale

  @Prop({ default: 100 })
  stock: number; // Niveau de stock d'inventaire
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Index pour de meilleures performances de requête
ProductSchema.index({ category: 1 });
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ salesCount: -1 });

