import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { EditUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('one/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('one/:id')
  update(@Param('id') id: string, @Body() updateUserDto: EditUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete('one/:id')
  remove(@Param('id') id: string) {
    console.log(id);

    return this.userService.remove(+id);
  }
}
