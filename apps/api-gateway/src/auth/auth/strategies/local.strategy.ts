import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    console.log('username', username);
    console.log('password', password);

    if (!(username && password)) throw new BadRequestException();
    const user = await this.authService.validateUser({
      username,
      password,
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
