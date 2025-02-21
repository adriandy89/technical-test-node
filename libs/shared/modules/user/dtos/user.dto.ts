import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums';

export class UserDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly role: Role;

  @ApiProperty()
  enabled: boolean;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt?: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
