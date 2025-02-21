import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxyRMQ, LoginDto, RabbitMQ, UserMsg } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private clientProxyCore: ClientProxy;

  constructor(private readonly clientProxy: ClientProxyRMQ) {
    this.clientProxyCore = this.clientProxy.clientProxyRMQ(RabbitMQ.CoreQueue);
  }

  private;

  async validateUser(loginDto: LoginDto): Promise<any> {
    const r = this.clientProxyCore.send(UserMsg.VALID_USER, loginDto);
    const user = await firstValueFrom(r);

    if (user) return user;

    return null;
  }
}
