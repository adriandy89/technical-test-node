import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PostOrderBy } from '../enums/post-order-by.enum';
import { PageOptionsDto } from '@app/shared/pagination';

export class PostPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: PostOrderBy,
    default: PostOrderBy.createdAt,
  })
  @IsEnum(PostOrderBy)
  @IsOptional()
  readonly orderBy: PostOrderBy = PostOrderBy.createdAt;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly search: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly authorId: string;
}
