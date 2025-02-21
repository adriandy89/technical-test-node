import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { ProxyModule } from '@app/shared';

@Module({
  imports: [ProxyModule],
  controllers: [PostController],
  providers: [],
})
export class PostModule { }
