import { IsString, IsOptional } from 'class-validator';
import { IsBase64Image } from '../../common/validators/is-base64-image.validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  @IsBase64Image({ message: 'Profile image must be a valid base64 encoded image' })
  profileImage?: string;
}

