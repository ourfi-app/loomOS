
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, hasAdminAccess } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !hasAdminAccess((session.user as any).role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { provider, apiKey, fromEmail, fromName } = body;

    // Test SendGrid connection
    if (provider === 'sendgrid') {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(apiKey);

      try {
        // Try to send a test email to the admin
        await sgMail.send({
          to: session.user.email,
          from: {
            email: fromEmail,
            name: fromName || 'Your Association',
          },
          subject: 'Email Configuration Test',
          text: 'This is a test email to confirm your email configuration is working correctly.',
          html: '<p>This is a test email to confirm your email configuration is working correctly.</p>',
        });

        return NextResponse.json({ success: true });
      } catch (error: any) {
        console.error('SendGrid test error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to send test email' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Unsupported email provider' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error testing email:', error);
    return NextResponse.json(
      { error: 'Failed to test email connection' },
      { status: 500 }
    );
  }
}
