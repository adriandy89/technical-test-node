import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PostPageMetaDto } from './post-page-meta.dto';
import { PostDto } from './post.dto';

export class PostPageDto {
  @IsArray()
  @ApiProperty()
  readonly data: PostDto[];

  @ApiProperty({ type: () => PostPageMetaDto })
  readonly meta: PostPageMetaDto;

  constructor(data: PostDto[], meta: PostPageMetaDto) {
    this.meta = meta;
    this.data = data;
  }
}
