import { ForbiddenException, Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role, Status } from 'src/auth/dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: id },
        select: {
          id: true,
          email: true,
        },
      });
      return user;
    } catch (error) {
      throw new ForbiddenException(Error);
    }
  }

  async update(id: number, updateUserDto: EditUserDto) {
    try {
      if (updateUserDto?.password) {
        const hash = await argon.hash(updateUserDto.password);
        updateUserDto.password = hash;
      }

      const newUser = await this.prisma.user.update({
        where: { id: id },
        data: {
          ...updateUserDto,
          role: Role.USER,
          status: Status.ACTIVE,
        },
        select: {
          id: true,
          email: true,
        },
      });

      return newUser;
    } catch (error) {
      throw new ForbiddenException(Error);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.user.delete({
        where: { id: id },
        select: {
          id: true,
          email: true,
        },
      });

      return user;
    } catch (error) {
      throw new ForbiddenException(Error);
    }
  }
}
