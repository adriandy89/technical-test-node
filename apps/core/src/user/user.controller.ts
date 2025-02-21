import {
  CreateUserDto,
  handleError,
  LoginDto,
  UpdateUserDto,
  UserMsg,
  UserPageOptionsDto,
} from '@app/shared';
import { UserService } from './user.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @MessagePattern(UserMsg.VALID_USER)
  async validateUser(@Payload() payload: LoginDto) {
    return await this.userService.validateUser(payload);
  }

  @MessagePattern(UserMsg.CREATE)
  async create(@Payload() payload: CreateUserDto) {
    try {
      return await this.userService.create(payload);
    } catch (error) {
      handleError(
        error.code === 11000
          ? { code: 409, message: 'Duplicate, already exist' }
          : undefined);
    }
  }

  @MessagePattern(UserMsg.UPDATE_AVATAR)
  async uploadAvatar(@Payload() payload: { extension: string, userId: string }) {
    try {
      return await this.userService.uploadAvatar(payload);
    } catch (error) {
      handleError();
    }
  }

  @MessagePattern(UserMsg.FIND_ALL)
  findAll(
    @Payload()
    payload: {
      optionsDto: UserPageOptionsDto;
    },
  ) {
    return this.userService.findAll(payload.optionsDto);
  }

  @MessagePattern(UserMsg.FIND_ONE)
  async findOne(@Payload() payload: { id: string }) {
    const found = await this.userService.findOne(payload.id);
    if (!found) {
      handleError({ code: 404, message: 'Not Found' });
    }
    return found;
  }

  @MessagePattern(UserMsg.UPDATE)
  async update(
    @Payload()
    payload: {
      id: string;
      userDTO: UpdateUserDto;
    },
  ) {
    try {
      return await this.userService.update(payload.id, payload.userDTO);
    } catch (error) {
      handleError(
        error.code === 11000
          ? { code: 409, message: 'Duplicate, already exist' }
          : error.code === 'P2025'
            ? { code: 404, message: 'Not Found' }
            : undefined);
    }
  }

  @MessagePattern(UserMsg.DELETE)
  async delete(@Payload() payload: { id: string }) {
    try {
      return await this.userService.delete(payload.id);
    } catch (error) {
      handleError(
        error.code === 'P2025'
          ? { code: 404, message: 'Not Found' }
          : undefined);
    }
  }
}
