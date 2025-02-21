import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RabbitMQ, ClientProxyRMQ, UserMsg, CreateUserDto, Role, UserPageOptionsDto, UserApiPaginatedResponse, UpdateUserDto } from '@app/shared';
import { JwtAuthGuard, Permissions, PermissionsGuard } from '../../auth';
import { ClientProxy } from '@nestjs/microservices';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  private clientProxyCore: ClientProxy;
  constructor(private readonly clientProxy: ClientProxyRMQ) {
    this.clientProxyCore = this.clientProxy.clientProxyRMQ(RabbitMQ.CoreQueue);
  }

  @Post()
  @ApiOperation({ summary: "Create new User" })
  @Permissions([Role.MANAGER])
  @UseGuards(PermissionsGuard)
  async create(@Body() userDTO: CreateUserDto) {
    return this.clientProxyCore.send(UserMsg.CREATE, userDTO);
  }

  @Get('list')
  @ApiOperation({ summary: "Paginated List of Users" })
  @Permissions([Role.MANAGER])
  @UseGuards(PermissionsGuard)
  @UserApiPaginatedResponse()
  findAll(
    @Query() optionsDto: UserPageOptionsDto,
  ) {
    return this.clientProxyCore.send(UserMsg.FIND_ALL, {
      optionsDto,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: "Get User by Id" })
  @ApiParam({ name: 'id', type: String, required: true })
  @Permissions([Role.MANAGER])
  @UseGuards(PermissionsGuard)
  findOne(
    @Param('id') id: string,
  ) {
    return this.clientProxyCore.send(UserMsg.FIND_ONE, {
      id,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: "Update User by Id" })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({})
  @Permissions([Role.MANAGER])
  @UseGuards(PermissionsGuard)
  update(
    @Param('id') id: string,
    @Body() userDTO: UpdateUserDto,
  ) {
    return this.clientProxyCore
      .send(UserMsg.UPDATE, {
        id,
        userDTO,
      })
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete User by Id" })
  @ApiParam({ name: 'id', type: String, required: true })
  @Permissions([Role.ADMIN])
  @UseGuards(PermissionsGuard)
  delete(
    @Param('id') id: string,
  ) {
    return this.clientProxyCore.send(UserMsg.DELETE, { id })
  }
}
