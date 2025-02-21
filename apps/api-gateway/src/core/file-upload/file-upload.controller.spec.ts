import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../../auth';
import { IUser } from '@app/shared';
import { FastifyRequest } from 'fastify';

describe('FileUploadController', () => {
    let fileUploadController: FileUploadController;
    let fileUploadService: FileUploadService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FileUploadController],
            providers: [
                {
                    provide: FileUploadService,
                    useValue: {
                        uploadSingleFile: jest.fn().mockResolvedValue('file uploaded'),
                    },
                },
            ],
        }).compile();

        fileUploadController = module.get<FileUploadController>(FileUploadController);
        fileUploadService = module.get<FileUploadService>(FileUploadService);
    });

    it('should be defined', () => {
        expect(fileUploadController).toBeDefined();
    });

    describe('uploadSingle', () => {
        it('should upload a file and return the result', async () => {
            const request = {} as FastifyRequest;
            const user = { id: '1', username: 'testUser' } as IUser;
            const result = await fileUploadController.uploadSingle(request, user);
            expect(result).toBe('file uploaded');
            expect(fileUploadService.uploadSingleFile).toHaveBeenCalledWith(request, user);
        });
    });
});