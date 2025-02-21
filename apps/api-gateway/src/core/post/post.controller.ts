import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RabbitMQ, ClientProxyRMQ, PostMsg, CreatePostDto, PostPageOptionsDto, PostApiPaginatedResponse, UpdatePostDto, IUser } from '@app/shared';
import { GetUserInfo, JwtAuthGuard } from '../../auth';
import { ClientProxy } from '@nestjs/microservices';

@ApiTags('Post')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('post')
export class PostController {
  private clientProxyCore: ClientProxy;
  constructor(private readonly clientProxy: ClientProxyRMQ) {
    this.clientProxyCore = this.clientProxy.clientProxyRMQ(RabbitMQ.CoreQueue);
  }

  @Post()
  @ApiOperation({ summary: "Create a Post by current user author" })
  async create(@Body() postDTO: CreatePostDto, @GetUserInfo() user: IUser) {
    return this.clientProxyCore.send(PostMsg.CREATE, { postDTO, userId: user.id });
  }

  @Get('list')
  @ApiOperation({ summary: "Paginated List of Posts" })
  @PostApiPaginatedResponse()
  findAll(
    @Query() optionsDto: PostPageOptionsDto,
  ) {
    return this.clientProxyCore.send(PostMsg.FIND_ALL, optionsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get Post by Id" })
  @ApiParam({ name: 'id', type: String, required: true })
  findOne(
    @Param('id') id: string,
  ) {
    return this.clientProxyCore.send(PostMsg.FIND_ONE, {
      id,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: "Update Post of current user by id" })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({})
  update(
    @Param('id') id: string,
    @Body() postDTO: UpdatePostDto,
    @GetUserInfo() user: IUser

  ) {
    return this.clientProxyCore
      .send(PostMsg.UPDATE, {
        id,
        postDTO,
        userId: user.id,
      })
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete Post of current user by id" })
  @ApiParam({ name: 'id', type: String, required: true })
  delete(
    @Param('id') id: string,
    @GetUserInfo() user: IUser
  ) {
    return this.clientProxyCore.send(PostMsg.DELETE, { id, userId: user.id });
  }
}
