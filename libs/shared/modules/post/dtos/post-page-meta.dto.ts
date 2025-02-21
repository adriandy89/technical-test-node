import { ApiProperty } from '@nestjs/swagger';
import { PostOrderBy } from '../enums/post-order-by.enum';
import { IPostPageMetaParametersDto } from '../interfaces/post-page-meta-parameters.interface';
import { PageMetaDto } from '@app/shared/pagination';
import { Prisma } from '@prisma/client';

export class PostPageMetaDto extends PageMetaDto {
  @ApiProperty({ enum: PostOrderBy })
  readonly orderBy: PostOrderBy;

  @ApiProperty({ enum: Prisma.SortOrder })
  readonly sortOrder: Prisma.SortOrder;

  constructor({ pageOptions, itemCount }: IPostPageMetaParametersDto) {
    super({ pageOptions, itemCount });
    this.orderBy = pageOptions.orderBy;
    this.sortOrder = pageOptions.sortOrder || Prisma.SortOrder.asc;
  }
}
