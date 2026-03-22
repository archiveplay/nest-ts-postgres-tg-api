import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '@/user/user.service';

const mockUserService = {
  findOrCreate: jest.fn().mockImplementation(
    (dto) =>
      Promise.resolve({
        id: dto.id,
        ...dto,
      })
  ),
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: UserService,
            useValue: mockUserService,
          },
          {
            provide: JwtService,
            useValue: {
              sign: jest.fn(
                () => 'fake-jwt-token'
              ),
            },
          },
        ],
      }).compile();

    service =
      module.get<AuthService>(AuthService);
    jwtService =
      module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('generateJwt should create/update user and return token', async () => {
    const fakeUser = {
      id: 123,
      first_name: 'Test',
      username: 'tester',
    };
    const result = await service.generateJwt(
      fakeUser as any
    );

    expect(result).toEqual({
      access_token: 'fake-jwt-token',
      user: expect.objectContaining({
        id: 123,
        first_name: 'Test',
        username: 'tester',
      }),
    });

    expect(
      mockUserService.findOrCreate
    ).toHaveBeenCalledWith(fakeUser);
  });
});
