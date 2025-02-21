import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'title',
    example: 'title',
    maxLength: 255,
    minLength: 2,
    required: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  readonly title: string;

  @ApiProperty({
    description: 'content',
    example: 'content',
    maxLength: 2048,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  readonly content: string;

}
