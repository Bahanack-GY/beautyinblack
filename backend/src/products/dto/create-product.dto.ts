import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { IsBase64Image } from '../../common/validators/is-base64-image.validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsEnum(['Homme', 'Femme', 'Enfant', 'Mixte'])
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  sizes?: string[];

  @IsString()
  @IsNotEmpty()
  @IsBase64Image({ message: 'Main image must be a valid base64 encoded image' })
  image: string;

  @IsArray()
  @IsOptional()
  @IsBase64Image({ message: 'Each image in the array must be a valid base64 encoded image' })
  images?: string[];

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  deliveryInfo?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skinTypes?: string[];
}

