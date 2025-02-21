import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth';
import { PostModule, UserModule } from './core';
import { FileUploadModule } from './core/file-upload';
import { WebsocketModule } from './websocket';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    FileUploadModule,
    PostModule,
    WebsocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
