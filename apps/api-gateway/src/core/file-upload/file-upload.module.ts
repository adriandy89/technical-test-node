import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { ProxyModule } from '@app/shared';

@Module({
  imports: [ProxyModule],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule { }
