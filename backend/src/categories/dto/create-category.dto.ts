import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { IsBase64Image } from '../../common/validators/is-base64-image.validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  @IsBase64Image({ message: 'Category image must be a valid base64 encoded image' })
  image: string;

  @IsString()
  @IsOptional()
  color?: string;
}




