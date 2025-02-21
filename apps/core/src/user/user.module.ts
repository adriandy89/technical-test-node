import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule, ProxyModule } from '@app/shared';

@Module({
  imports: [PrismaModule, ProxyModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
