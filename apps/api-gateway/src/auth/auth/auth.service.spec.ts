import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ClientProxyRMQ, RabbitMQ } from '@app/shared';
import { of } from 'rxjs';

describe('AuthService', () => {
    let authService: AuthService;
    let clientProxyRMQ: ClientProxyRMQ;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: ClientProxyRMQ,
                    useValue: {
                        clientProxyRMQ: jest.fn().mockReturnValue({
                            send: jest.fn().mockImplementation((pattern, data) => {
                                if (pattern === 'VALID_USER') {
                                    return of({ id: 1, username: 'testUser' });
                                }
                                return of(null);
                            }),
                        }),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        clientProxyRMQ = module.get<ClientProxyRMQ>(ClientProxyRMQ);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return user if valid', async () => {
            const loginDto = { username: 'testUser', password: 'testPass' };
            const user = await authService.validateUser(loginDto);
            expect(user).toEqual({ id: 1, username: 'testUser' });
        });

        it('should return null if invalid', async () => {
            jest.spyOn(clientProxyRMQ.clientProxyRMQ(RabbitMQ.CoreQueue), 'send').mockReturnValue(of(null));
            const loginDto = { username: 'invalidUser', password: 'invalidPass' };
            const user = await authService.validateUser(loginDto);
            expect(user).toBeNull();
        });
    });
});