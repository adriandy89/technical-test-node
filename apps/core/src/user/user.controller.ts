import {
  CreateUserDto,
  handleError,
  IUser,
  LoginDto,
  UserMsg,
} from '@app/shared';
import { UserService } from './user.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserMsg.VALID_USER)
  async validateUser(@Payload() payload: LoginDto) {
    return await this.userService.validateUser(payload);
  }

  @MessagePattern(UserMsg.CREATE)
  create(@Payload() payload: CreateUserDto) {
    return this.userService.create(payload).catch((error) => {
      handleError(
        error.code === 11000
          ? { code: 409, message: 'Duplicate, already exist' }
          : undefined,
      );
    });
  }
}
