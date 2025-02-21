import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule, ProxyModule } from '@app/shared';

@Module({
  imports: [PrismaModule, ProxyModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule { }
