import { Injectable } from '@nestjs/common';
import { CreatePostDto, LoginDto, PrismaService, UpdatePostDto, PostPageMetaDto, PostPageOptionsDto } from '@app/shared';
import { Prisma } from '@prisma/client';
import { excludeUndefinedFromDto } from '@app/shared/utils/exclude-from-dto';

@Injectable()
export class PostService {
  readonly prismaPostSelect: Prisma.PostSelect = {
    id: true,
    title: true,
    content: true,
    authorId: true,
    author: {
      select: {
        name: true,
      }
    }
  }

  constructor(private prismaService: PrismaService) { }

  async create({ postDTO, userId }: { postDTO: CreatePostDto, userId: string }) {
    const { ...newPost } = await this.prismaService.post.create({
      data: {
        ...postDTO,
        authorId: userId,
      },
    });
    return { post: newPost };
  }

  async findAll(optionsDto: PostPageOptionsDto) {
    const { search, take, page, orderBy, sortOrder } = optionsDto;
    const skip = (page - 1) * take;

    const where: Prisma.PostWhereInput = search ? { title: { contains: search, mode: 'insensitive' } } : {};
    if (optionsDto.authorId) where.authorId = optionsDto.authorId;

    const [itemCount, posts] = await this.prismaService.$transaction([
      this.prismaService.post.count({ where }),
      this.prismaService.post.findMany({
        skip,
        take,
        select: { ...this.prismaPostSelect, createdAt: true, updatedAt: true },
        where,
        orderBy:
          orderBy === 'id' ||
            orderBy === 'title' ||
            orderBy === 'content' ||
            orderBy === 'authorId' ||
            orderBy === 'createdAt' ||
            orderBy === 'updatedAt'
            ? { [orderBy]: <Prisma.SortOrder>sortOrder }
            : undefined,
      }),
    ]);

    const postPaginatedMeta = new PostPageMetaDto({
      itemCount,
      pageOptions: optionsDto,
    });
    return { data: posts, meta: postPaginatedMeta };
  }

  async findOne(id: string) {
    return await this.prismaService.post.findUnique({
      where: { id },
      select: { ...this.prismaPostSelect, createdAt: true, updatedAt: true }
    });
  }

  async update({ id, postDTO, userId }: { id: string, postDTO: UpdatePostDto, userId: string }) {
    const cleanUpdatePost = excludeUndefinedFromDto(postDTO); // exclude possible undefined value to avoid conflict prisma
    const data: Prisma.PostUpdateInput = {
      ...cleanUpdatePost,
    };
    return await this.prismaService.post.update({
      data,
      select: { ...this.prismaPostSelect, createdAt: true, updatedAt: true },
      where: { id, authorId: userId },
    });
  }

  async delete({ id, userId }: { id: string, userId: string }) {
    return await this.prismaService.post.delete({
      where: { id, authorId: userId },
      select: this.prismaPostSelect,
    });
  }
}
