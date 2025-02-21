// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { Inject, Logger } from '@nestjs/common';
// import {
//   SubscribeMessage,
//   WebSocketGateway,
//   OnGatewayInit,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Socket, Server } from 'socket.io';
// import { AuthService } from '../auth';
// import { RedisClientType } from 'redis';
// import { Device, SensorData } from '@prisma/client';
// import * as session from 'express-session';
// import RedisStore from 'connect-redis';

// interface IMessage<T> {
//   topic: string;
//   payload: T;
// }

// interface IMessageNewTrack {
//   topic: string;
//   payload: { device: Device; track?: any };
// }

// interface CustomSocket extends Socket {
//   customId?: number;
//   metadata?: {
//     connectedAt?: Date;
//   };
// }

// @WebSocketGateway({
//   namespace: '/api/ws',
// })
// export class WebsocketsGateway
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
// {
//   private readonly logger = new Logger(WebsocketsGateway.name);
//   private clients: Set<CustomSocket> = new Set();
//   private rooms: Map<string, Set<string>> = new Map();

//   constructor(private readonly authService: AuthService) {}

//   @WebSocketServer() server: Server;

//   afterInit(server: Server) {
//     this.logger.log('WebSocket Gateway initialized');
//   }

//   async handleConnection(client: CustomSocket) {
//     const sessionMiddleware = session({
//       store: new RedisStore({
//         client: this.redisClient,
//         prefix: 'auth-home:',
//       }),
//       secret: process.env.SESSION_SECRET || 'Y0y-sUp-*U*er-secret0', // Strong secret for cookie encryption
//       resave: false, // Don't resave sessions if nothing changed
//       saveUninitialized: false, // Don't create sessions for unauthenticated users
//       cookie: {
//         maxAge: 1000 * 60 * 60 * 24, // 1 day
//         httpOnly: true, // Prevents JavaScript access to cookies
//         secure: process.env.NODE_ENV === 'production', // Set secure cookies in production
//         sameSite: 'lax', // Helps with CSRF protection
//       },
//     });
//     // Crear una "request" ficticia para que el middleware de sesión pueda funcionar
//     const fakeReq: any = {
//       headers: {
//         cookie: client.handshake.headers.cookie,
//       },
//       method: 'GET',
//       url: client.handshake.url, // Necesario para parsear la URL correctamente
//     };
//     const fakeRes: any = {
//       getHeader: () => {},
//       setHeader: () => {},
//       end: () => {},
//     };
//     const next = (err) => {
//       if (err) {
//         client.disconnect(); // Desconectar en caso de error en la sesión
//         this.logger.error(`WS error: ${err}`);
//       } else {
//         if (fakeReq?.session?.passport?.user) {
//           const user = fakeReq.session.passport.user;
//           this.logger.verbose(`Client connected: ${client.id}`);
//           client.customId = user.id;
//           // client.join(user.userId);
//           this.clients.add(client);
//         } else {
//           this.logger.error(`No session for client: ${client.id}`);
//           client.disconnect(); // Puedes desconectar si no se encuentra la sesión
//         }
//       }
//     };
//     // Aplicar el middleware de sesión con el objeto fakeReq
//     sessionMiddleware(fakeReq, fakeRes, next);
//   }

//   handleDisconnect(client: Socket) {
//     this.logger.verbose(`Client disconnected: ${client.id}`);
//     this.clients.delete(client);
//     this.removeClientFromRooms(client);
//   }

//   // broadcast(event: string, message: IMessage) {
//   //   this.server.emit(event, message);
//   // }

//   @SubscribeMessage('joinDeviceRoom')
//   handleJoinDeviceRoom(client: Socket, deviceId: string) {
//     client.join(deviceId);
//     console.log(`Client ${client.id} joined device room: ${deviceId}`);

//     if (!this.rooms.has(deviceId)) {
//       this.rooms.set(deviceId, new Set<string>());
//     }
//     this.rooms.get(deviceId).add(client.id);
//   }

//   @SubscribeMessage('leaveDeviceRoom')
//   handleLeaveDeviceRoom(client: Socket, deviceId: string) {
//     client.leave(deviceId);
//     console.log(`Client ${client.id} left device room: ${deviceId}`);

//     if (this.rooms.has(deviceId)) {
//       const clients = this.rooms.get(deviceId);
//       clients.delete(client.id);
//       if (clients.size === 0) {
//         this.rooms.delete(deviceId);
//         console.log(
//           `Room ${deviceId} deleted because no clients are connected`,
//         );
//       }
//     }
//   }

//   private removeClientFromRooms(client: Socket) {
//     this.rooms.forEach((clients, deviceId) => {
//       if (clients.has(client.id)) {
//         clients.delete(client.id);
//         if (clients.size === 0) {
//           this.rooms.delete(deviceId);
//           console.log(
//             `Room ${deviceId} deleted because no clients are connected`,
//           );
//         }
//       }
//     });
//   }

//   // ? Sensor Data --------------------------------------------------------------

//   async sendNewSensorDataToClients(
//     event: string,
//     message: IMessage<SensorData>,
//   ) {
//     if (this.clients.size === 0) return;
//     const clients = Array.from(this.clients);
//     for (const client of clients) {
//       try {
//         const userId = client.customId;
//         if (!userId) {
//           this.logger.error(
//             `No user ID found in websocket client: ${client.id}`,
//           );
//           continue;
//         }
//         const redisKeyHomesIds = `h-user-id:${userId}:homes-id`;
//         const homesIds = await this.redisClient.sMembers(redisKeyHomesIds);
//         if (!homesIds) continue;
//         for (const homeId of homesIds) {
//           const redisKeyHomeDevices = `h-home-id:${homeId}:devices-id`;
//           const exists = await this.redisClient.sIsMember(
//             redisKeyHomeDevices,
//             message.payload.deviceId.toString(),
//           );
//           if (exists) {
//             client.emit(event, message);
//             break; // Salir del bucle interno y continuar con el siguiente cliente
//           }
//         }
//       } catch (error) {
//         this.logger.error(`Error sending message to client: ${error}`);
//       }
//     }
//   }

//   // ? Home Status --------------------------------------------------------------

//   async updateHomeStatusWebSocket(
//     event: string,
//     message: IMessage<{ homeId: number; connected: boolean }>,
//   ) {
//     if (this.clients.size === 0) return;
//     const clients = Array.from(this.clients);
//     for (const client of clients) {
//       try {
//         const userId = client.customId;
//         if (!userId) {
//           this.logger.error(
//             `No user ID found in websocket client: ${client.id}`,
//           );
//           continue;
//         }
//         const redisKeyHomesIds = `h-user-id:${userId}:homes-id`;
//         const homesIds = await this.redisClient.sMembers(redisKeyHomesIds);
//         if (!homesIds) continue;
//         if (homesIds.includes(message.payload.homeId.toString())) {
//           client.emit(event, message);
//         }
//       } catch (error) {
//         this.logger.error(`Error sending message to client: ${error}`);
//       }
//     }
//   }
// }
