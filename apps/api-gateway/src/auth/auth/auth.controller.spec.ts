import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards';
import { UserDto } from '@app/shared';

describe('AuthController', () => {
    let authController: AuthController;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn().mockResolvedValue('mockToken'),
                    },
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('login', () => {
        it('should return user and accessToken', async () => {
            const req = { user: { username: 'testUser' } };
            const result = await authController.login(req);
            expect(result).toEqual({
                user: req.user,
                accessToken: 'mockToken',
            });
            expect(jwtService.signAsync).toHaveBeenCalledWith(req.user, {
                secret: process.env.JWT_SECRET,
            });
        });
    });

    describe('getProfile', () => {
        it('should return user profile', async () => {
            const user = { username: 'testUser' };
            const result = await authController.getProfile(user);
            expect(result).toEqual({ user });
        });
    });
});