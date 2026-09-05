import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

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
    return message;
  }
}
