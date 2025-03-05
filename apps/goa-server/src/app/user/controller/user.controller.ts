import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../../auth/decorator';
import { JwtGuard } from '../../auth/guard';
import { UserService } from '../service/user.service';

@UseGuards(JwtGuard) // The bearer token is required Globaly
@Controller('user')
@ApiBearerAuth() // Swagger decorater to identify this module is protected with bearer token
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get the details of user
   * @param user
   * @returns
   */
  @Get('details')
  @ApiCreatedResponse({ description: 'User Details' }) // Swager decorater to add description to api
  getUserDetails(@GetUser() user: User) {
    return user;
  }
}
