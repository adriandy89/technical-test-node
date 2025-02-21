import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginDto, PrismaService, UpdateUserDto, UserPageMetaDto, UserPageOptionsDto } from '@app/shared';
import { Prisma } from '@prisma/client';
import { excludeUndefinedFromDto } from '@app/shared/utils/exclude-from-dto';

@Injectable()
export class UserService {
  readonly prismaUserSelect: Prisma.UserSelect = {
    id: true,
    username: true,
    name: true,
    avatar: true,
    role: true,
    enabled: true,
  };

  constructor(private prismaService: PrismaService) { }

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

  async uploadAvatar({ extension, userId }: { extension: string, userId: string }) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { avatar: extension },
    });
    return { ok: true };
  }


  async findAll(optionsDto: UserPageOptionsDto) {
    const { search, take, page, orderBy, sortOrder } = optionsDto;
    const skip = (page - 1) * take;

    const where: Prisma.UserWhereInput = search ? {
      OR: [
        { username: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ],
    } : {};

    const [itemCount, users] = await this.prismaService.$transaction([
      this.prismaService.user.count({ where }),
      this.prismaService.user.findMany({
        skip,
        take,
        select: { ...this.prismaUserSelect, enabled: true, createdAt: true, updatedAt: true },
        where,
        orderBy:
          orderBy === 'id' ||
            orderBy === 'name' ||
            orderBy === 'username' ||
            orderBy === 'enabled' ||
            orderBy === 'createdAt' ||
            orderBy === 'updatedAt' ||
            orderBy === 'role'
            ? { [orderBy]: <Prisma.SortOrder>sortOrder }
            : undefined,
      }),
    ]);

    const userPaginatedMeta = new UserPageMetaDto({
      itemCount,
      pageOptions: optionsDto,
    });
    return { data: users, meta: userPaginatedMeta };
  }

  async findOne(id: string) {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: { ...this.prismaUserSelect, enabled: true, createdAt: true, updatedAt: true }
    });
  }

  async update(id: string, userDTO: UpdateUserDto) {
    const cleanUpdateUser = excludeUndefinedFromDto(userDTO); // exclude possible undefined value to avoid conflict prisma
    const { ...cleanData } = cleanUpdateUser;
    if (cleanData.password) cleanData.password = await this.hashPassword(cleanData.password);
    const data: Prisma.UserUpdateInput = {
      ...cleanData,
    };
    return await this.prismaService.user.update({
      data,
      select: { ...this.prismaUserSelect, enabled: true, createdAt: true, updatedAt: true },
      where: { id },
    });
  }

  async delete(id: string) {
    return await this.prismaService.user.delete({
      where: { id },
      select: this.prismaUserSelect,
    });
  }
}
