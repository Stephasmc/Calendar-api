import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthDtoSignIn, AuthDtoSignUp, Role, Status } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signIn(data: AuthDtoSignIn) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const valid = await argon.verify(user.password, data.password);
    if (!valid) {
      throw new ForbiddenException('Invalid credentials');
    }

    const token = await this.signToken(user.id, user.email);
    return { token };
  }

  async signUp(data: AuthDtoSignUp) {
    try {
      const hash = await argon.hash(data.password);
      delete data.password;
      const user = await this.prisma.user.create({
        data: {
          ...data,
          role: Role.USER,
          status: Status.ACTIVE,
          password: hash,
        },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      const token = await this.signToken(user.id, user.email);

      return { user, token };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already in use');
        }
      }
      throw new Error(error);
    }
  }

  private async signToken(userId: number, email: string) {
    const data = {
      sub: userId,
      email,
    };
    return this.jwt.signAsync(data, {
      expiresIn: '1d',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
