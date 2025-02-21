import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 32)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 32)
  password: string;
}
