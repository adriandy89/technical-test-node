import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserOrderBy } from '../enums/user-order-by.enum';
import { PageOptionsDto } from '@app/shared/pagination';

export class UserPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: UserOrderBy,
    default: UserOrderBy.createdAt,
  })
  @IsEnum(UserOrderBy)
  @IsOptional()
  readonly orderBy: UserOrderBy = UserOrderBy.createdAt;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly search?: string;
}
