import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { FileUploadService } from './file-upload.service';
import { GetUserInfo, JwtAuthGuard } from '../../auth';
import { IUser } from '@app/shared';
@ApiTags('Upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) { }

  @Post('avatar')
  @ApiOperation({ summary: "Upload current user an avatar image" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    required: true,
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        }
      }
    }
  })
  async uploadSingle(@Req() request: FastifyRequest, @GetUserInfo() user: IUser) {
    return this.fileUploadService.uploadSingleFile(request, user);
  }
}
