import { Module } from '@nestjs/common';
import { WebsocketsGateway } from './websockets.gateway';
import { WsJwtGuard } from './ws-jwt.guard';
import { AuthModule } from '../auth';

@Module({
    imports: [AuthModule],
    providers: [WebsocketsGateway, WsJwtGuard],
    exports: [WebsocketsGateway],
})
export class WebsocketModule { }
