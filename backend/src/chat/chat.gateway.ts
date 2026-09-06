import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../common/email/email.service';
import { NotificationsService } from '../notifications/notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private notificationsService: NotificationsService,
  ) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { caseId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.caseId);
    return { event: 'joined', data: data.caseId };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: {
      caseId: string;
      senderId: string;
      content: string;
      fileUrl?: string;
    },
  ) {
    const message = await this.prisma.message.create({
      data: {
        content: data.content,
        fileUrl: data.fileUrl,
        caseId: data.caseId,
        senderId: data.senderId,
      },
      include: { sender: true },
    });

    this.server.to(data.caseId).emit('message', message);

    // Auto-dispatch Email & System Notifications
    try {
      const caseData = await this.prisma.case.findUnique({
        where: { id: data.caseId },
        include: { client: true, lawyer: true },
      });

      if (caseData) {
        const sender = (message as any).sender;
        const isClientSender = data.senderId === caseData.clientId;

        if (isClientSender) {
          // Client sent message -> Notify Lawyer / Admin
          const recipientEmail =
            caseData.lawyer?.email || 'midlexllp01@gmail.com';
          const recipientName = caseData.lawyer?.name || 'Midlex Legal Counsel';

          await this.emailService.sendChatMessageEmailNotification({
            recipientEmail,
            recipientName,
            senderName: sender?.name || 'Client',
            caseTitle: caseData.title,
            caseId: caseData.id,
            messageContent: data.content || 'Sent a document attachment',
          });

          if (caseData.lawyerId) {
            await this.notificationsService.create({
              recipientId: caseData.lawyerId,
              title: `New message from ${sender?.name || 'Client'}`,
              message: data.content || 'Attached a document file',
              link: `/dashboard/cases/${caseData.id}`,
              type: 'CHAT_MESSAGE',
            });
          } else {
            await this.notificationsService.notifyAdmins({
              title: `New client message for ${caseData.title}`,
              message: `${sender?.name || 'Client'}: ${data.content || 'Attached a document'}`,
              link: `/dashboard/cases/${caseData.id}`,
              type: 'CHAT_MESSAGE',
            });
          }
        } else {
          // Lawyer/Admin sent message -> Notify Client
          if (caseData.client?.email) {
            await this.emailService.sendChatMessageEmailNotification({
              recipientEmail: caseData.client.email,
              recipientName: caseData.client.name,
              senderName: sender?.name || 'Legal Counsel',
              caseTitle: caseData.title,
              caseId: caseData.id,
              messageContent: data.content || 'Sent a document attachment',
            });
          }

          if (caseData.clientId) {
            await this.notificationsService.create({
              recipientId: caseData.clientId,
              title: `New update from ${sender?.name || 'Legal Counsel'}`,
              message: data.content || 'Attached a document file',
              link: `/dashboard/cases/${caseData.id}`,
              type: 'CHAT_MESSAGE',
            });
          }
        }
      }
    } catch (err) {
      console.warn('[ChatGateway] Error sending email notification:', err);
    }

    return message;
  }
}
