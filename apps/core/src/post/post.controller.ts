import {
  CreatePostDto,
  handleError,
  UpdatePostDto,
  PostMsg,
  PostPageOptionsDto,
} from '@app/shared';
import { PostService } from './post.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) { }

  @MessagePattern(PostMsg.CREATE)
  async create(@Payload() payload: { postDTO: CreatePostDto, userId: string }) {
    try {
      return await this.postService.create(payload);
    } catch (error) {
      handleError(
        error.code === 11000
          ? { code: 409, message: 'Duplicate, already exist' }
          : undefined);
    }
  }

  @MessagePattern(PostMsg.FIND_ALL)
  findAll(
    @Payload()
    payload: PostPageOptionsDto,
  ) {
    return this.postService.findAll(payload);
  }

  @MessagePattern(PostMsg.FIND_ONE)
  async findOne(@Payload() payload: { id: string }) {
    const found = await this.postService.findOne(payload.id);
    if (!found) {
      handleError({ code: 404, message: 'Not Found' });
    }
    return found;
  }

  @MessagePattern(PostMsg.UPDATE)
  async update(
    @Payload()
    payload: { id: string, postDTO: UpdatePostDto, userId: string },
  ) {
    try {
      return await this.postService.update(payload);
    } catch (error) {
      handleError(
        error.code === 11000
          ? { code: 409, message: 'Duplicate, already exist' }
          : error.code === 'P2025'
            ? { code: 404, message: 'Not Found' }
            : undefined);
    }
  }

  @MessagePattern(PostMsg.DELETE)
  async delete(@Payload() payload: { id: string, userId: string }) {
    try {
      return await this.postService.delete(payload);
    } catch (error) {
      handleError(
        error.code === 'P2025'
          ? { code: 404, message: 'Not Found' }
          : undefined);
    }
  }
}
