import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  user: {
    upsert: jest.fn().mockImplementation(({ where, update, create }) =>
      Promise.resolve({ id: where.id, ...create }) // возвращаем fake user
    ),
  },
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(() => 'fake-jwt-token') }, // мок JWT
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('generateJwt should create/update user and return token', async () => {
    const fakeUser = { id: 123, first_name: 'Test', username: 'tester' };
    const result = await service.generateJwt(fakeUser as any);

    expect(result).toEqual({
      access_token: 'fake-jwt-token',
      user: expect.objectContaining({
        id: 123,
        first_name: 'Test',
        username: 'tester',
      }),
    });

    expect(mockPrismaService.user.upsert).toHaveBeenCalledWith({
      where: { id: 123 },
      update: expect.objectContaining({
        id: 123,
        first_name: 'Test',
        username: 'tester',
        last_login: expect.any(Date)
      }),
      create: expect.objectContaining({
        id: 123,
        first_name: 'Test',
        username: 'tester',
      }),
    });
  });


});

