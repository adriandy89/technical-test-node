import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadService } from './file-upload.service';
import { ClientProxyRMQ, IUser, RabbitMQ, UserMsg } from '@app/shared';
import { BadRequestException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

jest.mock('fs', () => ({
    createWriteStream: jest.fn(),
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
}));

describe('FileUploadService', () => {
    let service: FileUploadService;
    let clientProxyRMQ: ClientProxyRMQ;

    beforeEach(async () => {
        clientProxyRMQ = {
            clientProxyRMQ: jest.fn().mockReturnValue({
                send: jest.fn().mockResolvedValue(true),
            }),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FileUploadService,
                { provide: ClientProxyRMQ, useValue: clientProxyRMQ },
            ],
        }).compile();

        service = module.get<FileUploadService>(FileUploadService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('uploadSingleFile', () => {
        let req: FastifyRequest;
        let user: IUser;

        beforeEach(() => {
            req = {
                file: jest.fn(),
            } as any;
            user = { id: '123' } as IUser;
        });

        it('should throw BadRequestException if no file is provided', async () => {
            req.file = jest.fn().mockResolvedValue(null);

            await expect(service.uploadSingleFile(req, user)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should throw BadRequestException if file extension is not allowed', async () => {
            req.file = jest.fn().mockResolvedValue({ filename: 'test.txt' });

            await expect(service.uploadSingleFile(req, user)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should save the file and send message if file is valid', async () => {
            const mockFile = {
                filename: 'test.png',
                file: {
                    pipe: jest.fn(),
                },
            };
            req.file = jest.fn().mockResolvedValue(mockFile);

            const result = await service.uploadSingleFile(req, user);

            expect(createWriteStream).toHaveBeenCalledWith(
                join(process.cwd(), 'uploads', '123.png'),
            );
            expect(mockFile.file.pipe).toHaveBeenCalled();
            expect(clientProxyRMQ.clientProxyRMQ(RabbitMQ.CoreQueue).send).toHaveBeenCalledWith(
                UserMsg.UPDATE_AVATAR,
                { extension: '.png', userId: '123' },
            );
            expect(result).toBe(true);
        });
    });

    describe('ensureUploadsFolder', () => {
        it('should create uploads folder if it does not exist', () => {
            (existsSync as jest.Mock).mockReturnValue(false);

            service['ensureUploadsFolder']();

            expect(mkdirSync).toHaveBeenCalledWith(join(process.cwd(), 'uploads'));
        });

    });
});