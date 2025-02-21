import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetUserInfo } from './decorators';
import { UserDto } from '@app/shared';
import { JwtAuthGuard } from './guards';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@GetUserInfo() user) {
    return { user };
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'username',
        },
        password: {
          type: 'string',
          example: 'As-123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: [UserDto],
  })
  async login(@Req() req) {
    const user = req.user;
    return {
      user,
      accessToken: await this.jwtService.signAsync(user, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('test')
  accessWithToken(@Request() req) {
    console.log(req.user);
    return { message: 'Access Ok! ', user: req.user };
  }
}
