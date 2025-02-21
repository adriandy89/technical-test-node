import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'username',
    example: 'username',
    maxLength: 32,
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  readonly username: string;

  @ApiProperty({
    description: 'name',
    example: 'John Doe',
    maxLength: 124,
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(124)
  readonly name: string;

  @ApiProperty({
    description: 'password',
    example: 'As-123456',
    maxLength: 32,
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/)
  readonly password: string;

  @ApiProperty({
    description: `Enable/Disable`,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly enabled: boolean = true;

  @ApiProperty({
    description: 'role',
    example: Role.USER,
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role)
  readonly role?: Role;
}
