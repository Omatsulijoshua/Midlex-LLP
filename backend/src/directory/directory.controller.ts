import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { DirectoryService } from './directory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('directory')
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Get('courts')
  async getCourts() {
    return this.directoryService.getCourts();
  }

  @Post('courts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async addCourt(@Body('name') name: string) {
    return this.directoryService.addCourt(name);
  }

  @Delete('courts/:name')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async removeCourt(@Param('name') name: string) {
    return this.directoryService.removeCourt(name);
  }

  @Get('teams')
  async getTeams() {
    return this.directoryService.getTeams();
  }

  @Post('teams')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async addTeam(@Body('name') name: string) {
    return this.directoryService.addTeam(name);
  }

  @Delete('teams/:name')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async removeTeam(@Param('name') name: string) {
    return this.directoryService.removeTeam(name);
  }
}
