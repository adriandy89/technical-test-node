import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();

    const token = client.handshake?.headers?.token as string;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {

      const payload = await this.jwtService.verifyAsync(token);

      client.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
