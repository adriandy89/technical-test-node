import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ProxyModule } from '@app/shared';

@Module({
  imports: [ProxyModule],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
