import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // Get all board members and admins
  const boardMembers = await prisma.user.findMany({
    where: {
      OR: [
        { role: 'ADMIN' },
        { role: 'BOARD_MEMBER' },
      ],
    },
  });

  if (boardMembers.length < 2) {
    return;
  }

  const sender = boardMembers[0];
  const recipients = boardMembers.slice(1);

  // Create sample messages
  const messages = [
    {
      subject: 'Monthly Board Meeting Agenda',
      body: `Dear Board Members,

Please find attached the agenda for our upcoming monthly board meeting scheduled for next Tuesday at 7 PM.

Key discussion items:
- Q4 Financial Review
- Proposed Landscaping Improvements
- Parking Policy Updates
- Holiday Decorations Guidelines

Please review the materials and come prepared with questions.

Best regards,
${sender.name}`,
      priority: 'HIGH' as const,
    },
    {
      subject: 'Elevator Maintenance Schedule',
      body: `Hello Team,

This is to inform you that the elevator maintenance has been scheduled for this Saturday from 9 AM to 3 PM. Please communicate this to residents in your buildings.

The maintenance company will be performing routine inspections and repairs. Access to stairs will remain available throughout the day.

Thank you,
${sender.name}`,
      priority: 'NORMAL' as const,
    },
    {
      subject: 'URGENT: Water Main Repair',
      body: `URGENT NOTICE

A water main break has been detected in Building A. The water will be shut off tomorrow morning at 8 AM for emergency repairs. Expected completion time is 2 PM.

Please notify all residents immediately. Bottled water will be provided in the lobby.

Emergency Contact: (555) 123-4567

${sender.name}`,
      priority: 'URGENT' as const,
    },
    {
      subject: 'Welcome Committee Update',
      body: `Hi Everyone,

Just wanted to share that our welcome committee has successfully onboarded 5 new families this month! Thank you all for your support in making them feel at home.

The welcome packets have been well-received. If you have any suggestions for improvements, please let me know.

Warm regards,
${sender.name}`,
      priority: 'LOW' as const,
    },
    {
      subject: 'Budget Review Meeting Notes',
      body: `Attached are the notes from last week's budget review meeting. Please review and provide any feedback by end of week.

Key takeaways:
- Reserve fund is healthy
- Projected increase in utilities
- Upcoming capital improvements

Let's discuss in our next meeting.

Thanks,
${sender.name}`,
      priority: 'NORMAL' as const,
    },
  ];

  for (const msgData of messages) {
    await prisma.message.create({
      data: {
        subject: msgData.subject,
        body: msgData.body,
        senderId: sender.id,
        priority: msgData.priority,
        sentAt: new Date(),
        recipients: {
          create: recipients.map((recipient) => ({
            userId: recipient.id,
          })),
        },
      },
    });
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
