import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RabbitMQ, ClientProxyRMQ, UserMsg, CreateUserDto } from '@app/shared';
import { JwtAuthGuard } from '../../auth';
import { ClientProxy } from '@nestjs/microservices';

@ApiTags('user')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  private clientProxyCore: ClientProxy;
  constructor(private readonly clientProxy: ClientProxyRMQ) {
    this.clientProxyCore = this.clientProxy.clientProxyRMQ(RabbitMQ.CoreQueue);
  }

  @Post()
  async create(@Body() userDTO: CreateUserDto) {
    return this.clientProxyCore.send(UserMsg.CREATE, userDTO);
  }
}
