import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../common/email/email.module';

@Module({
  imports: [PrismaModule, NotificationsModule, EmailModule],
  providers: [ChatGateway],
})
export class ChatModule {}

