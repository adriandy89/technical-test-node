import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly content: string;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt?: Date;

  constructor(partial: Partial<PostDto>) {
    Object.assign(this, partial);
  }
}
