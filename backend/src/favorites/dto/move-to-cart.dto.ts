import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class MoveToCartDto {
  @IsString()
  @IsNotEmpty()
  size: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}

