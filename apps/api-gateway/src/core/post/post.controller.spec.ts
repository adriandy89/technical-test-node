import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { ClientProxyRMQ, RabbitMQ, PostMsg, CreatePostDto, PostPageOptionsDto, UpdatePostDto, IUser, SortOrderEnum } from '@app/shared';
import { JwtAuthGuard } from '../../auth';
import { firstValueFrom, of } from 'rxjs';

describe('PostController', () => {
    let controller: PostController;
    let clientProxyRMQ: ClientProxyRMQ;

    beforeEach(async () => {
        clientProxyRMQ = {
            clientProxyRMQ: jest.fn().mockReturnValue({
                send: jest.fn().mockImplementation(() => of(true)),
            }),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            controllers: [PostController],
            providers: [
                { provide: ClientProxyRMQ, useValue: clientProxyRMQ },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<PostController>(PostController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a post', async () => {
            const postDTO: CreatePostDto = { title: 'Test Post', content: 'Test Content' };
            const user: IUser = { id: '123', username: 'test@example.com' } as IUser;

            await expect(firstValueFrom(await controller.create(postDTO, user))).resolves.toEqual(true);
            expect(clientProxyRMQ.clientProxyRMQ(RabbitMQ.CoreQueue).send).toHaveBeenCalledWith(
                PostMsg.CREATE,
                { postDTO, userId: user.id },
            );
        });
    });

    describe('findAll', () => {
        it('should return paginated list of posts', async () => {
            const optionsDto: PostPageOptionsDto = { page: 1, take: 10, sortOrder: SortOrderEnum.DESC, orderBy: 'createdAt', authorId: undefined, search: undefined };

            await expect(controller.findAll(optionsDto).toPromise()).resolves.toEqual(true);
            expect(clientProxyRMQ.clientProxyRMQ(RabbitMQ.CoreQueue).send).toHaveBeenCalledWith(
                PostMsg.FIND_ALL,
                optionsDto,
            );
        });
    });

    describe('findOne', () => {
        it('should return a post by id', async () => {
            const id = '1';

            await expect(controller.findOne(id).toPromise()).resolves.toEqual(true);
            expect(clientProxyRMQ.clientProxyRMQ(RabbitMQ.CoreQueue).send).toHaveBeenCalledWith(
                PostMsg.FIND_ONE,
                { id },
            );
        });
    });

    describe('update', () => {
        it('should update a post', async () => {
            const id = '1';
            const postDTO: UpdatePostDto = { title: 'Updated Post', content: 'Updated Content' };
            const user: IUser = { id: '123', username: 'test@example.com' } as IUser;

            await expect(controller.update(id, postDTO, user).toPromise()).resolves.toEqual(true);
            expect(clientProxyRMQ.clientProxyRMQ(RabbitMQ.CoreQueue).send).toHaveBeenCalledWith(
                PostMsg.UPDATE,
                { id, postDTO, userId: user.id },
            );
        });
    });

    describe('delete', () => {
        it('should delete a post', async () => {
            const id = '1';
            const user: IUser = { id: '123', username: 'test@example.com' } as IUser;

            await expect(controller.delete(id, user).toPromise()).resolves.toEqual(true);
            expect(clientProxyRMQ.clientProxyRMQ(RabbitMQ.CoreQueue).send).toHaveBeenCalledWith(
                PostMsg.DELETE,
                { id, userId: user.id },
            );
        });
    });
});