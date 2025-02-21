import { ClientProxyRMQ, IUser, RabbitMQ, UserMsg } from '@app/shared';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FastifyRequest } from 'fastify';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';

@Injectable()
export class FileUploadService {

  private clientProxyCore: ClientProxy;
  constructor(private readonly clientProxy: ClientProxyRMQ) {
    this.clientProxyCore = this.clientProxy.clientProxyRMQ(RabbitMQ.CoreQueue);
  }

  async uploadSingleFile(req: FastifyRequest, user: IUser) {
    const file = await req.file();
    if (!file) {
      throw new BadRequestException('No File Found');
    }

    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
    const extension = extname(file.filename).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      throw new BadRequestException(
        `Only images allowed (${allowedExtensions.join(', ')})`,
      );
    }
    const filename = `${user.id}${extension}`

    this.ensureUploadsFolder();
    const savePath = join(process.cwd(), 'uploads', `${filename}`);

    const writeStream = createWriteStream(savePath);
    await file.file.pipe(writeStream);

    return this.clientProxyCore.send(UserMsg.UPDATE_AVATAR, { extension, userId: user.id });

  }

  private ensureUploadsFolder() {
    const uploadPath = join(process.cwd(), 'uploads');
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }
  }
}
