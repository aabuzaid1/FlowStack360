import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AdminService } from '@gitroom/nestjs-libraries/database/prisma/admin/admin.service';
import { GetUserFromRequest } from '@gitroom/nestjs-libraries/user/user.from.request';

@ApiTags('Admin')
@Controller('/admin')
export class AdminController {
  constructor(private readonly _adminService: AdminService) {}

  @Get('/dashboard')
  dashboard(@GetUserFromRequest() user: User) {
    this.assertAdmin(user);
    return this._adminService.getDashboard();
  }

  @Get('/users')
  users(
    @GetUserFromRequest() user: User,
    @Query()
    query: {
      page?: string;
      limit?: string;
      search?: string;
      tier?: string;
      admin?: string;
    }
  ) {
    this.assertAdmin(user);
    return this._adminService.listUsers(query);
  }

  @Get('/users/:id')
  user(@GetUserFromRequest() user: User, @Param('id') id: string) {
    this.assertAdmin(user);
    return this._adminService.getUser(id);
  }

  @Post('/users/:id/upgrade')
  upgradeUser(
    @GetUserFromRequest() user: User,
    @Param('id') id: string,
    @Body()
    body: {
      organizationId?: string;
      tier?: string;
      period?: string;
      totalChannels?: number;
    }
  ) {
    this.assertAdmin(user);
    return this._adminService.changeUserSubscription(id, body);
  }

  @Post('/users/:id/email')
  sendUserEmail(
    @GetUserFromRequest() user: User,
    @Param('id') id: string,
    @Body() body: { subject?: string; html?: string; replyTo?: string }
  ) {
    this.assertAdmin(user);
    return this._adminService.sendUserEmail(id, body);
  }

  @Post('/users/:id/toggle-admin')
  toggleAdmin(
    @GetUserFromRequest() user: User,
    @Param('id') id: string,
    @Body() body: { isSuperAdmin?: boolean }
  ) {
    this.assertAdmin(user);
    return this._adminService.toggleAdmin(id, body);
  }

  @Post('/email/broadcast')
  broadcastEmail(
    @GetUserFromRequest() user: User,
    @Body()
    body: {
      audience?: 'ALL' | 'TIER' | 'USER';
      tier?: string;
      email?: string;
      subject?: string;
      html?: string;
      replyTo?: string;
    }
  ) {
    this.assertAdmin(user);
    return this._adminService.broadcastEmail(body);
  }

  @Get('/subscriptions')
  subscriptions(@GetUserFromRequest() user: User) {
    this.assertAdmin(user);
    return this._adminService.getSubscriptions();
  }

  @Get('/pricing')
  pricing(@GetUserFromRequest() user: User) {
    this.assertAdmin(user);
    return this._adminService.getPricing();
  }

  @Post('/pricing')
  updatePricing(
    @GetUserFromRequest() user: User,
    @Body()
    body: {
      tier?: string;
      monthPrice?: number;
      yearPrice?: number;
      totalChannels?: number | null;
    }
  ) {
    this.assertAdmin(user);
    return this._adminService.updatePricing(body);
  }

  @Get('/discounts')
  discounts(@GetUserFromRequest() user: User) {
    this.assertAdmin(user);
    return this._adminService.getDiscounts();
  }

  @Post('/discounts')
  createDiscount(
    @GetUserFromRequest() user: User,
    @Body()
    body: {
      code?: string;
      type?: string;
      value?: number;
      maxUses?: number | null;
      expiresAt?: string | null;
      active?: boolean;
    }
  ) {
    this.assertAdmin(user);
    return this._adminService.createDiscount(body);
  }

  @Put('/discounts/:id')
  updateDiscount(
    @GetUserFromRequest() user: User,
    @Param('id') id: string,
    @Body()
    body: {
      code?: string;
      type?: string;
      value?: number;
      maxUses?: number | null;
      expiresAt?: string | null;
      active?: boolean;
    }
  ) {
    this.assertAdmin(user);
    return this._adminService.updateDiscount(id, body);
  }

  @Delete('/discounts/:id')
  deleteDiscount(@GetUserFromRequest() user: User, @Param('id') id: string) {
    this.assertAdmin(user);
    return this._adminService.deleteDiscount(id);
  }

  @Get('/errors')
  errors(
    @GetUserFromRequest() user: User,
    @Query()
    query: {
      page?: string;
      limit?: string;
      search?: string;
      platform?: string;
    }
  ) {
    this.assertAdmin(user);
    return this._adminService.getErrors(query);
  }

  @Get('/reviews')
  reviews(
    @GetUserFromRequest() user: User,
    @Query() query: { page?: string; limit?: string; rating?: string }
  ) {
    this.assertAdmin(user);
    return this._adminService.getReviews(query);
  }

  @Get('/stats')
  stats(
    @GetUserFromRequest() user: User,
    @Query() query: { days?: string }
  ) {
    this.assertAdmin(user);
    return this._adminService.getStats(query);
  }

  private assertAdmin(user: User) {
    if (!user?.isSuperAdmin) {
      throw new HttpException('Unauthorized', 403);
    }
  }
}
