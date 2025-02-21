/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, IUser, LoginDto, PrismaService } from '@app/shared';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  readonly prismaUserSelect: Prisma.UserSelect = {
    id: true,
    username: true,
    name: true,
    role: true,
  };

  constructor(private prismaService: PrismaService) {}

  async validateUser({ username, password }: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
      select: { ...this.prismaUserSelect, password: true },
    });
    if (!user) return null;

    const isValidPassword = await this.checkPassword(password, user.password);

    if (user && isValidPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async checkPassword(password: string, passwordDB: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordDB);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async create(userDTO: CreateUserDto) {
    const hash = await this.hashPassword(userDTO.password);
    const { password, ...newUser } = await this.prismaService.user.create({
      data: {
        ...userDTO,
        password: hash,
      },
    });
    return { user: newUser };
  }
}
