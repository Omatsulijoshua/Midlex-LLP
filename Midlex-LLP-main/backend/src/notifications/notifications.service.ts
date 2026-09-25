import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type NotificationType = string;

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  entityType?: string;
  entityId?: string;
  href?: string;
  link?: string;
  recipientId?: string;
  recipientUserId?: string;
  recipientRole?: Role;
  isRead: boolean;
  readAt?: Date | null;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationPayload {
  title: string;
  message: string;
  type: NotificationType;
  entityType?: string;
  entityId?: string;
  href?: string;
  metadata?: Record<string, any>;
}

interface NotificationRecipient {
  recipientId?: string;
  recipientUserId?: string;
  recipientRole?: Role;
}

type CreateNotificationInput = {
  recipientId: string;
  title: string;
  message: string;
  type?: string;
  link?: string;
  href?: string;
  createdById?: string;
};

type BroadcastInput = {
  title: string;
  message: string;
  targetRole?: 'ALL' | Role;
  targetUserId?: string;
  link?: string;
  href?: string;
  createdById?: string;
};

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(params: {
    userId: string;
    role: Role;
    unreadOnly?: boolean;
    limit?: number;
  }) {
    const rows = (await this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    })) as NotificationRecord[];

    const visible = rows
      .filter((notification) =>
        this.canUserAccessNotification(notification, params.userId, params.role),
      )
      .map((notification) => this.normalize(notification));
    const unreadCount = visible.filter((notification) => !notification.isRead).length;
    const filtered = params.unreadOnly
      ? visible.filter((notification) => !notification.isRead)
      : visible;

    return {
      items:
        typeof params.limit === 'number'
          ? filtered.slice(0, params.limit)
          : filtered,
      unreadCount,
    };
  }

  async create(input: CreateNotificationInput) {
    if (!input.recipientId) throw new BadRequestException('Recipient is required');
    if (!input.title?.trim()) throw new BadRequestException('Title is required');
    if (!input.message?.trim()) throw new BadRequestException('Message is required');

    return this.prisma.notification.create({
      data: {
        recipientId: input.recipientId,
        recipientUserId: input.recipientId,
        title: input.title.trim(),
        message: input.message.trim(),
        type: input.type || 'INFO',
        link: input.link || input.href,
        href: input.href || input.link,
        isRead: false,
        readAt: null,
        createdById: input.createdById,
      },
    });
  }

  async notifyRole(role: Role, input: Omit<CreateNotificationInput, 'recipientId'>) {
    const users = await this.prisma.user.findMany({ where: { role } });
    return Promise.all(
      users.map((user: any) => this.create({ ...input, recipientId: user.id })),
    );
  }

  async notifyAdmins(input: Omit<CreateNotificationInput, 'recipientId'>) {
    return this.notifyRole(Role.ADMIN, input);
  }

  async broadcast(input: BroadcastInput) {
    if (input.targetUserId) {
      return [
        await this.create({
          recipientId: input.targetUserId,
          title: input.title,
          message: input.message,
          link: input.link || input.href,
          createdById: input.createdById,
          type: 'MANUAL',
        }),
      ];
    }

    const where =
      input.targetRole && input.targetRole !== 'ALL'
        ? { role: input.targetRole }
        : undefined;
    const users = await this.prisma.user.findMany({ where });
    return Promise.all(
      users.map((user: any) =>
        this.create({
          recipientId: user.id,
          title: input.title,
          message: input.message,
          link: input.link || input.href,
          createdById: input.createdById,
          type: 'MANUAL',
        }),
      ),
    );
  }

  async markRead(id: string, params: { userId: string; role: Role }) {
    const notification = (await this.prisma.notification.findUnique({
      where: { id },
    })) as NotificationRecord | null;
    if (!notification) throw new NotFoundException('Notification not found');
    if (!this.canUserAccessNotification(notification, params.userId, params.role)) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.isRead) return notification;

    return (await this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })) as NotificationRecord;
  }

  async markAllRead(params: { userId: string; role: Role }) {
    const rows = (await this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    })) as NotificationRecord[];

    const targets = rows.filter(
      (notification) =>
        !notification.isRead &&
        this.canUserAccessNotification(notification, params.userId, params.role),
    );

    await Promise.all(
      targets.map((notification) =>
        this.prisma.notification.update({
          where: { id: notification.id },
          data: {
            isRead: true,
            readAt: new Date(),
          },
        }),
      ),
    );

    return { updated: targets.length };
  }

  async createForRecipients(
    recipients: NotificationRecipient[],
    payload: NotificationPayload,
  ) {
    const uniqueRecipients = recipients.filter((recipient, index) => {
      const key = recipient.recipientUserId
        ? `user:${recipient.recipientUserId}`
        : `role:${recipient.recipientRole ?? 'ALL'}`;

      return (
        index ===
        recipients.findIndex((candidate) => {
          const candidateKey = candidate.recipientUserId
            ? `user:${candidate.recipientUserId}`
            : `role:${candidate.recipientRole ?? 'ALL'}`;
          return candidateKey === key;
        })
      );
    });

    return Promise.all(
      uniqueRecipients.map((recipient) =>
        this.prisma.notification.create({
          data: {
            ...payload,
            ...recipient,
            recipientId: recipient.recipientId || recipient.recipientUserId,
            link: payload.href,
            isRead: false,
            readAt: null,
          },
        }),
      ),
    );
  }

  private canUserAccessNotification(
    notification: NotificationRecord,
    userId: string,
    role: Role,
  ) {
    const recipientUserId = notification.recipientUserId || notification.recipientId;
    if (recipientUserId && recipientUserId !== userId) {
      return false;
    }

    if (notification.recipientRole && notification.recipientRole !== role) {
      return false;
    }

    return true;
  }

  private normalize(notification: NotificationRecord) {
    return {
      ...notification,
      href: notification.href || notification.link,
      link: notification.link || notification.href,
      isRead: notification.isRead ?? Boolean(notification.readAt),
    };
  }
}
