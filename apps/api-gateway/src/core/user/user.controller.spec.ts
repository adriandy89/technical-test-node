import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { ClientProxyRMQ, RabbitMQ, UserMsg, CreateUserDto, UserPageOptionsDto, UpdateUserDto, Role, SortOrderEnum } from '@app/shared';
import { JwtAuthGuard, PermissionsGuard } from '../../auth';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, of } from 'rxjs';

describe('UserController', () => {
    let controller: UserController;
    let clientProxyRMQ: ClientProxyRMQ;

    beforeEach(async () => {
        clientProxyRMQ = {
            clientProxyRMQ: jest.fn().mockReturnValue({
                send: jest.fn().mockImplementation(() => of(true)),
            }),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                { provide: ClientProxyRMQ, useValue: clientProxyRMQ },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideGuard(PermissionsGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a user', async () => {
            const userDTO: CreateUserDto = { username: 'testuser', password: 'password', enabled: true, role: Role.ADMIN, name: 'Test User' };

            await expect(firstValueFrom(await controller.create(userDTO))).resolves.toEqual(true);
            expect(clientProxyRMQ.clientProxyRMQ(RabbitMQ.CoreQueue).send).toHaveBeenCalledWith(
                UserMsg.CREATE,
                userDTO,
            );
        });
    });

    describe('findAll', () => {
        it('should return paginated list of users', async () => {
            const optionsDto: UserPageOptionsDto = { page: 1, take: 10, orderBy: 'createdAt', sortOrder: SortOrderEnum.DESC, search: undefined };

            await expect(controller.findAll(optionsDto).toPromise()).resolves.toEqual(true);
            expect(clientProxyRMQ.clientProxyRMQ(RabbitMQ.CoreQueue).send).toHaveBeenCalledWith(
                UserMsg.FIND_ALL,
                { optionsDto },
            );
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            const id = '1';

            await expect(controller.findOne(id).toPromise()).resolves.toEqual(true);
            expect(clientProxyRMQ.clientProxyRMQ(RabbitMQ.CoreQueue).send).toHaveBeenCalledWith(
                UserMsg.FIND_ONE,
                { id },
            );
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const id = '1';
            const userDTO: UpdateUserDto = { username: 'updateduser', password: 'newpassword' };

            await expect(controller.update(id, userDTO).toPromise()).resolves.toEqual(true);
            expect(clientProxyRMQ.clientProxyRMQ(RabbitMQ.CoreQueue).send).toHaveBeenCalledWith(
                UserMsg.UPDATE,
                { id, userDTO },
            );
        });
    });

    describe('delete', () => {
        it('should delete a user', async () => {
            const id = '1';

            await expect(controller.delete(id).toPromise()).resolves.toEqual(true);
            expect(clientProxyRMQ.clientProxyRMQ(RabbitMQ.CoreQueue).send).toHaveBeenCalledWith(
                UserMsg.DELETE,
                { id },
            );
        });
    });
});