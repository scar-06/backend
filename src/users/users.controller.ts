import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('admin')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req, @Body() _body: LoginDto) {
    const user = req.user;
    const payload = { sub: user.id, email: user.email, isAdmin: user.isAdmin };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  @Post('users')
  @UseGuards(AuthGuard('jwt'))
  async createAdmin(@Body() dto: CreateUserDto) {
    const user = await this.usersService.createAdmin(dto);
    return { id: user.id, email: user.email, isAdmin: user.isAdmin, createdAt: user.createdAt };
  }

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async listAdmins() {
    const users = await this.usersService.findAllAdmins();
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      isAdmin: u.isAdmin,
      createdAt: u.createdAt,
    }));
  }
}
