import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth';
import { UserModule } from './core';
// import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    // WebsocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
