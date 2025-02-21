/* eslint-disable @typescript-eslint/no-unused-vars */
import { IUser } from '@app/shared';
import { Logger, UseGuards } from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WsJwtGuard } from './ws-jwt.guard';
import { JwtService } from '@nestjs/jwt';

interface CustomSocket extends Socket {
    user: IUser;
}

@WebSocketGateway({
    namespace: '/api/ws',
})
export class WebsocketsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(WebsocketsGateway.name);


    constructor(private readonly jwtService: JwtService) { }

    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        this.logger.log('WebSocket Gateway initialized');
        // simulate broadcasting messages
        this.startBroadcasting();
    }

    handleConnection(client: CustomSocket) {
        try {
            // verify client token
            const token = client.handshake?.headers?.token as string;

            if (!token) {
                client.disconnect();
                return;
            }
            // verify jwt token
            const payload = this.jwtService.verify(token);
            client.user = payload;
            this.logger.verbose(`Client connected: ${client.id}, user: ${client.user?.username}`);
        } catch (error) {
            client.disconnect();
            return;
        }
    }

    handleDisconnect(client: CustomSocket) {
        this.logger.verbose(`Client disconnected: ${client.id}, user: ${client.user?.username}`);
    }

    private startBroadcasting() {
        // simulate broadcasting messages every 15 seconds
        setInterval(() => {
            const message = { data: 'Simulated data' };
            this.logger.log('Broadcasting message to all clients event: "broadcast"');
            this.server.emit('broadcast', message);
        }, 15_000);
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('message')
    handleMessage(@ConnectedSocket() client: CustomSocket, @MessageBody() data: any) {

        console.log('Data:', data);
        console.log('User:', client.user?.username);

        return { event: 'events', data: 'Message received Ok.' };
    }

}
