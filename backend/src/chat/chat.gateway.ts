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

  @SubscribeMessage('takeoverChat')
  async handleTakeoverChat(
    @MessageBody() data: { caseId: string; userRole: string; userName: string },
  ) {
    const takeoverNotice = {
      id: `sys-${Date.now()}`,
      content: `👨‍⚖️ ${data.userName || 'Legal Counsel'} (${data.userRole || 'LAWYER'}) has officially taken over this chat. Midlex AI Assistant is now paused.`,
      senderId: 'system',
      caseId: data.caseId,
      createdAt: new Date().toISOString(),
      sender: { name: 'System Notice', role: 'ADMIN' },
    };

    this.server.to(data.caseId).emit('message', takeoverNotice);
    this.server.to(data.caseId).emit('aiModeChanged', { aiMode: false, takenOverBy: data.userName });
    return takeoverNotice;
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: {
      caseId: string;
      senderId: string;
      content: string;
      fileUrl?: string;
      aiMode?: boolean;
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

    // AI Assistant Auto-Reply (runs if AI mode is enabled and message is from client)
    const isClientSender = data.senderId !== 'system' && (message.sender as any)?.role === 'CLIENT';

    if (isClientSender && data.aiMode !== false) {
      setTimeout(async () => {
        try {
          const aiText = this.generateAiLegalReply(data.content);
          const aiMessage = {
            id: `ai-${Date.now()}`,
            content: aiText,
            caseId: data.caseId,
            senderId: 'ai-assistant',
            createdAt: new Date().toISOString(),
            sender: { id: 'ai-assistant', name: 'Midlex AI Legal Assistant', role: 'AI' },
          };
          this.server.to(data.caseId).emit('message', aiMessage);
        } catch (err) {
          console.warn('[ChatGateway] AI auto-reply error:', err);
        }
      }, 1200);
    }

    // Auto-dispatch Email & System Notifications
    try {
      const caseData = await this.prisma.case.findUnique({
        where: { id: data.caseId },
        include: { client: true, lawyer: true },
      });

      if (caseData) {
        const sender = (message as any).sender;

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
        } else if (sender?.role !== 'AI' && data.senderId !== 'system') {
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

  private generateAiLegalReply(userPrompt: string): string {
    const text = (userPrompt || '').toLowerCase();

    if (text.includes('cost') || text.includes('fee') || text.includes('price') || text.includes('charge')) {
      return `🤖 **Midlex AI Assistant**: Our legal fees depend on the case category (e.g. litigation retainer, property search, or corporate filing). Our legal team will provide a formal fee estimate during your consultation. You can also view fee structures in your dashboard payments tab.`;
    }

    if (text.includes('document') || text.includes('file') || text.includes('upload') || text.includes('proof') || text.includes('paper')) {
      return `🤖 **Midlex AI Assistant**: You can securely upload relevant case files, contracts, or court documents directly using the **Document Manager** section below on this page. All uploaded files are instantly encrypted and accessible to your assigned lawyer.`;
    }

    if (text.includes('court') || text.includes('date') || text.includes('hearing') || text.includes('judge')) {
      return `🤖 **Midlex AI Assistant**: Scheduled court appearances and hearing dates are tracked under the **Court Dates** widget on your dashboard. Your lead counsel will update you as court proceedings progress.`;
    }

    return `🤖 **Midlex AI Assistant**: Thank you for your message! I have logged this update for your legal team. Barristers at Midlex LLP have been notified. Is there any document or specific detail you would like to add while a lawyer connects to this chat?`;
  }
}
