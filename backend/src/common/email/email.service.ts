import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendAdminSignupNotification(clientName: string, clientEmail: string) {
    console.log(`[EMAIL] To: admin@midlex.com`);
    console.log(`[EMAIL] Subject: New Client Signup - ${clientName}`);
    console.log(`[EMAIL] Body: A new client has joined Midlex LLP. 
      Name: ${clientName}
      Email: ${clientEmail}
      Please log in to the admin dashboard to assign a lead lawyer.`);

    // In production, integrate with SendGrid, Mailgun, or AWS SES
    return true;
  }

  async sendClientWelcomeEmail(params: {
    name: string;
    email: string;
    temporaryPassword: string;
  }) {
    console.log(`[EMAIL] To: ${params.email}`);
    console.log(`[EMAIL] Subject: Welcome to Midlex LLP`);
    console.log(`[EMAIL] Body: Hello ${params.name},
      Your client portal account has been created.

      Email: ${params.email}
      Temporary Password: ${params.temporaryPassword}

      Please log in and change your password immediately.`);

    return true;
  }

  async sendAdminInquiryNotification(params: {
    name: string;
    email: string;
    phone?: string;
    serviceNeeded?: string;
  }) {
    console.log(`[EMAIL] To: admin@midlex.com`);
    console.log(`[EMAIL] Subject: New Website Inquiry - ${params.name}`);
    console.log(`[EMAIL] Body: A new inquiry was submitted from the website.
      Name: ${params.name}
      Email: ${params.email}
      Phone: ${params.phone || '-'}
      Service: ${params.serviceNeeded || '-'}
      Please review it in the admin dashboard.`);

    return true;
  }

  async sendPasswordResetEmail(params: {
    email: string;
    resetUrl: string;
    expiresAt: Date;
  }) {
    console.log(`[EMAIL] To: ${params.email}`);
    console.log(`[EMAIL] Subject: Reset your Midlex LLP password`);
    console.log(`[EMAIL] Body: Use this secure link to reset your password.
      Link: ${params.resetUrl}
      Expires: ${params.expiresAt.toISOString()}

      If you did not request this, ignore this email.`);

    return true;
  }

  async sendChatMessageEmailNotification(params: {
    recipientEmail: string;
    recipientName: string;
    senderName: string;
    caseTitle: string;
    caseId: string;
    messageContent: string;
  }) {
    const frontendUrl =
      process.env.FRONTEND_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://midlex-llplawfirm.vercel.app';
    const caseUrl = `${frontendUrl.replace(/\/+$/, '')}/dashboard/cases/${params.caseId}`;

    console.log(`[EMAIL] To: ${params.recipientEmail}`);
    console.log(`[EMAIL] Subject: New Message on Case: ${params.caseTitle}`);
    console.log(`[EMAIL] Body: Hello ${params.recipientName},

${params.senderName} has sent a new message regarding case "${params.caseTitle}":

"${params.messageContent}"

Click here to view and respond in your Midlex portal:
${caseUrl}`);

    return true;
  }
}
