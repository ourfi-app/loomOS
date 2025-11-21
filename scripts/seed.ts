
import { PrismaClient, UserRole, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {

  // Create default organization first
  const organization = await prisma.organization.upsert({
    where: { slug: 'demo' },
    update: {
      name: 'Demo Condo Association',
      subdomain: 'demo',
      isActive: true,
    },
    create: {
      id: 'default-org',
      name: 'Demo Condo Association',
      slug: 'demo',
      subdomain: 'demo',
      isActive: true,
    },
  });


  // Create admin user (required for testing)
  const adminPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'changeme-admin-dev', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: adminPassword,
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      role: UserRole.ADMIN,
      unitNumber: 'ADMIN',
      isActive: true,
      organizationId: organization.id,
      onboardingCompleted: true,
    },
  });


  // Create sample board member
  const boardPassword = await bcrypt.hash(process.env.SEED_BOARD_PASSWORD || 'changeme-board-dev', 12);
  const boardMember = await prisma.user.upsert({
    where: { email: 'sarah.board@condoassoc.com' },
    update: {},
    create: {
      email: 'sarah.board@condoassoc.com',
      password: boardPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      name: 'Sarah Johnson',
      role: UserRole.BOARD_MEMBER,
      unitNumber: '301B',
      phone: '+1234567890',
      isActive: true,
      organizationId: organization.id,
      onboardingCompleted: true,
    },
  });


  // Create sample residents
  const residentPassword = await bcrypt.hash(process.env.SEED_RESIDENT_PASSWORD || 'changeme-resident-dev', 12);
  
  const residents = [
    {
      email: 'mike.resident@email.com',
      firstName: 'Mike',
      lastName: 'Wilson',
      unitNumber: '101A',
      phone: '+1234567891'
    },
    {
      email: 'lisa.tenant@email.com',
      firstName: 'Lisa',
      lastName: 'Chen',
      unitNumber: '205C',
      phone: '+1234567892'
    },
    {
      email: 'robert.owner@email.com',
      firstName: 'Robert',
      lastName: 'Garcia',
      unitNumber: '502A',
      phone: '+1234567893'
    }
  ];

  for (const resident of residents) {
    const user = await prisma.user.upsert({
      where: { email: resident.email },
      update: {},
      create: {
        email: resident.email,
        password: residentPassword,
        firstName: resident.firstName,
        lastName: resident.lastName,
        name: `${resident.firstName} ${resident.lastName}`,
        role: UserRole.RESIDENT,
        unitNumber: resident.unitNumber,
        phone: resident.phone,
        isActive: true,
        organizationId: organization.id,
        onboardingCompleted: true,
      },
    });
  }

  // Create dues settings
  await prisma.duesSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      organizationId: organization.id,
      monthlyAmount: 350.00,
      dueDay: 1,
      lateFee: 25.00,
      gracePeriod: 5,
      isActive: true,
    },
  });


  // Create sample payments for residents
  const allUsers = await prisma.user.findMany({
    where: { role: UserRole.RESIDENT }
  });

  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  for (const user of allUsers) {
    // Current month - pending
    await prisma.payment.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        amount: 350.00,
        dueDate: currentMonth,
        status: PaymentStatus.PENDING,
        description: `Monthly dues for ${currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
        type: 'monthly_dues',
      },
    });

    // Last month - paid
    await prisma.payment.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        amount: 350.00,
        dueDate: lastMonth,
        paidDate: new Date(lastMonth.getTime() + 2 * 24 * 60 * 60 * 1000), // paid 2 days later
        status: PaymentStatus.PAID,
        description: `Monthly dues for ${lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
        type: 'monthly_dues',
      },
    });

    // Two months ago - some paid, some overdue
    const isOverdue = Math.random() > 0.7; // 30% chance of overdue
    await prisma.payment.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        amount: 350.00,
        dueDate: twoMonthsAgo,
        paidDate: isOverdue ? null : new Date(twoMonthsAgo.getTime() + 3 * 24 * 60 * 60 * 1000),
        status: isOverdue ? PaymentStatus.OVERDUE : PaymentStatus.PAID,
        description: `Monthly dues for ${twoMonthsAgo.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
        type: 'monthly_dues',
      },
    });
  }


  // Create sample announcements
  await prisma.announcement.create({
    data: {
      title: 'Building Maintenance Notice',
      content: 'The elevator will be under maintenance on Saturday from 9 AM to 3 PM. Please plan accordingly.',
      priority: 'normal',
      authorId: boardMember.id,
      organizationId: organization.id,
      isActive: true,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'Monthly Association Meeting',
      content: 'The monthly association meeting is scheduled for next Thursday at 7 PM in the community room. All residents are welcome to attend.',
      priority: 'normal',
      authorId: admin.id,
      organizationId: organization.id,
      isActive: true,
    },
  });

  // Create committees
  const boardOfDirectors = await prisma.committee.upsert({
    where: { name: 'Board of Directors' },
    update: {},
    create: {
      name: 'Board of Directors',
      description: 'The governing body of the condominium association, responsible for making decisions and setting policies.',
      type: 'board',
      email: 'board@condoassoc.com',
      displayOrder: 1,
      organizationId: organization.id,
    },
  });

  const architecturalCommittee = await prisma.committee.upsert({
    where: { name: 'Architectural Committee' },
    update: {},
    create: {
      name: 'Architectural Committee',
      description: 'Reviews and approves all construction and renovation projects to maintain community standards.',
      type: 'architectural',
      email: 'architectural@condoassoc.com',
      displayOrder: 2,
      organizationId: organization.id,
    },
  });

  const welcomingCommittee = await prisma.committee.upsert({
    where: { name: 'Welcoming Committee' },
    update: {},
    create: {
      name: 'Welcoming Committee',
      description: 'Welcomes new residents and helps them integrate into the community.',
      type: 'welcoming',
      email: 'welcoming@condoassoc.com',
      displayOrder: 3,
      organizationId: organization.id,
    },
  });

  const waterCommittee = await prisma.committee.upsert({
    where: { name: 'Water Committee' },
    update: {},
    create: {
      name: 'Water Committee',
      description: 'Oversees water management, conservation efforts, and related infrastructure.',
      type: 'water',
      email: 'water@condoassoc.com',
      displayOrder: 4,
      organizationId: organization.id,
    },
  });

  const socialCommittee = await prisma.committee.upsert({
    where: { name: 'Social Committee' },
    update: {},
    create: {
      name: 'Social Committee',
      description: 'Organizes community events, social gatherings, and activities to foster neighborhood connections.',
      type: 'social',
      email: 'social@condoassoc.com',
      displayOrder: 5,
      organizationId: organization.id,
    },
  });

  // Add committee members
  const mikeUser = await prisma.user.findUnique({ where: { email: 'mike.resident@email.com' } });
  const lisaUser = await prisma.user.findUnique({ where: { email: 'lisa.tenant@email.com' } });
  const robertUser = await prisma.user.findUnique({ where: { email: 'robert.owner@email.com' } });

  if (mikeUser && lisaUser && robertUser) {
    // Board of Directors
    await prisma.committeeMember.upsert({
      where: { 
        organizationId_committeeId_userId: { 
          organizationId: organization.id,
          committeeId: boardOfDirectors.id, 
          userId: boardMember.id 
        } 
      },
      update: {},
      create: {
        organizationId: organization.id,
        committeeId: boardOfDirectors.id,
        userId: boardMember.id,
        position: 'President',
        bio: 'Leading the board with 5 years of experience in community management.',
        displayOrder: 1,
      },
    });

    await prisma.committeeMember.upsert({
      where: { 
        organizationId_committeeId_userId: { 
          organizationId: organization.id,
          committeeId: boardOfDirectors.id, 
          userId: mikeUser.id 
        } 
      },
      update: {},
      create: {
        organizationId: organization.id,
        committeeId: boardOfDirectors.id,
        userId: mikeUser.id,
        position: 'Treasurer',
        bio: 'Managing our finances with expertise in accounting and budgeting.',
        displayOrder: 2,
      },
    });

    // Architectural Committee
    await prisma.committeeMember.upsert({
      where: { 
        organizationId_committeeId_userId: { 
          organizationId: organization.id,
          committeeId: architecturalCommittee.id, 
          userId: robertUser.id 
        } 
      },
      update: {},
      create: {
        organizationId: organization.id,
        committeeId: architecturalCommittee.id,
        userId: robertUser.id,
        position: 'Chair',
        bio: 'Professional architect with passion for preserving our building\'s character.',
        displayOrder: 1,
      },
    });

    // Welcoming Committee
    await prisma.committeeMember.upsert({
      where: { 
        organizationId_committeeId_userId: { 
          organizationId: organization.id,
          committeeId: welcomingCommittee.id, 
          userId: lisaUser.id 
        } 
      },
      update: {},
      create: {
        organizationId: organization.id,
        committeeId: welcomingCommittee.id,
        userId: lisaUser.id,
        position: 'Chair',
        bio: 'Dedicated to making every new resident feel at home.',
        displayOrder: 1,
      },
    });

    // Water Committee
    await prisma.committeeMember.upsert({
      where: { 
        organizationId_committeeId_userId: { 
          organizationId: organization.id,
          committeeId: waterCommittee.id, 
          userId: mikeUser.id 
        } 
      },
      update: {},
      create: {
        organizationId: organization.id,
        committeeId: waterCommittee.id,
        userId: mikeUser.id,
        position: 'Member',
        bio: 'Committed to sustainable water management practices.',
        displayOrder: 1,
      },
    });

    // Social Committee
    await prisma.committeeMember.upsert({
      where: { 
        organizationId_committeeId_userId: { 
          organizationId: organization.id,
          committeeId: socialCommittee.id, 
          userId: lisaUser.id 
        } 
      },
      update: {},
      create: {
        organizationId: organization.id,
        committeeId: socialCommittee.id,
        userId: lisaUser.id,
        position: 'Chair',
        bio: 'Love bringing neighbors together through fun events!',
        displayOrder: 1,
      },
    });

    await prisma.committeeMember.upsert({
      where: { 
        organizationId_committeeId_userId: { 
          organizationId: organization.id,
          committeeId: socialCommittee.id, 
          userId: robertUser.id 
        } 
      },
      update: {},
      create: {
        organizationId: organization.id,
        committeeId: socialCommittee.id,
        userId: robertUser.id,
        position: 'Member',
        bio: 'Helping create memorable community experiences.',
        displayOrder: 2,
      },
    });
  }

  // Seed Tasks
  const sampleTasks = [
    {
      organizationId: organization.id,
      title: 'Review monthly budget report',
      description: 'Review and approve the monthly financial report for the association',
      status: 'TODO' as const,
      priority: 'HIGH' as const,
      category: 'work',
      tags: ['finance', 'admin'],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      userId: admin.id,
      isFavorite: true,
    },
    {
      organizationId: organization.id,
      title: 'Schedule building maintenance',
      description: 'Contact vendors and schedule quarterly maintenance for building systems',
      status: 'IN_PROGRESS' as const,
      priority: 'MEDIUM' as const,
      category: 'household',
      tags: ['maintenance', 'vendors'],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Due in 3 days
      userId: admin.id,
    },
    {
      organizationId: organization.id,
      title: 'Organize community BBQ event',
      description: 'Plan and coordinate the summer community BBQ event for residents',
      status: 'TODO' as const,
      priority: 'MEDIUM' as const,
      category: 'community',
      tags: ['event', 'social'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Due in 14 days
      userId: boardMember.id,
      isFavorite: true,
    },
    {
      organizationId: organization.id,
      title: 'Update emergency contact list',
      description: 'Update the building emergency contact list with new vendor information',
      status: 'TODO' as const,
      priority: 'URGENT' as const,
      category: 'general',
      tags: ['urgent', 'safety'],
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Due tomorrow
      userId: admin.id,
    },
    {
      organizationId: organization.id,
      title: 'Complete insurance paperwork',
      description: 'Fill out and submit annual insurance renewal forms',
      status: 'COMPLETED' as const,
      priority: 'HIGH' as const,
      category: 'work',
      tags: ['admin', 'legal'],
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Completed 2 days ago
      userId: admin.id,
    },
    {
      organizationId: organization.id,
      title: 'Research new landscaping options',
      description: 'Find and evaluate potential landscaping companies for spring renovation',
      status: 'IN_PROGRESS' as const,
      priority: 'LOW' as const,
      category: 'personal',
      tags: ['landscaping', 'research'],
      userId: boardMember.id,
    },
  ];

  for (const taskData of sampleTasks) {
    await prisma.task.create({
      data: taskData,
    });
  }

  // Seed Notes
  const sampleNotes = [
    {
      organizationId: organization.id,
      title: 'Board Meeting Notes - October 2025',
      content: `Key Discussion Points:
- Budget review and approval for Q4
- New security system installation timeline
- Holiday decorations committee volunteers needed
- Parking policy updates for resident feedback

Action Items:
- Follow up with security vendor (John)
- Draft parking policy memo (Sarah)
- Send holiday decoration sign-up sheet (Lisa)`,
      category: 'work',
      tags: ['meeting', 'board', 'action-items'],
      userId: admin.id,
      isPinned: true,
      isFavorite: true,
    },
    {
      organizationId: organization.id,
      title: 'Vendor Contact Information',
      content: `Emergency Contacts:
- Plumber: ABC Plumbing - (555) 123-4567
- Electrician: Quick Electric - (555) 234-5678
- HVAC: Cool Comfort - (555) 345-6789
- Locksmith: 24/7 Locks - (555) 456-7890

Regular Maintenance:
- Landscaping: Green Thumb - (555) 567-8901
- Cleaning: Sparkle Clean - (555) 678-9012`,
      category: 'work',
      tags: ['vendors', 'contacts', 'emergency'],
      userId: admin.id,
      isPinned: true,
    },
    {
      organizationId: organization.id,
      title: 'Community Event Ideas',
      content: `Ideas for upcoming community events:

Summer:
- BBQ and Pool Party (July)
- Outdoor Movie Night (August)
- Ice Cream Social (June)

Fall:
- Halloween Costume Contest
- Thanksgiving Potluck
- Fall Festival with Games

Winter:
- Holiday Light Contest
- New Year's Party
- Winter Wonderland Theme`,
      category: 'ideas',
      tags: ['events', 'community', 'planning'],
      userId: boardMember.id,
      isFavorite: true,
    },
    {
      organizationId: organization.id,
      title: 'Building Improvement Projects',
      content: `Proposed improvements for 2025-2026:

High Priority:
- Lobby renovation and modernization
- Parking lot resurfacing
- Elevator modernization

Medium Priority:
- Gym equipment upgrade
- Common area furniture replacement
- Energy-efficient lighting installation

Low Priority:
- Rooftop garden expansion
- Guest suite renovation
- Additional bike storage`,
      category: 'work',
      tags: ['improvements', 'planning', 'budget'],
      userId: admin.id,
    },
    {
      organizationId: organization.id,
      title: 'Personal To-Do List',
      content: `Things to remember:
- Schedule annual unit inspection
- Review and update insurance policy
- Submit maintenance request for kitchen faucet
- Attend next board meeting on the 15th
- Pick up packages from front desk`,
      category: 'personal',
      tags: ['todo', 'reminders'],
      userId: boardMember.id,
    },
    {
      organizationId: organization.id,
      title: 'Recipe: Community Potluck Favorite',
      content: `Sarah's Famous Lasagna Recipe

Ingredients:
- 1 lb ground beef
- 1 jar marinara sauce
- 1 box lasagna noodles
- 16 oz ricotta cheese
- 2 cups mozzarella cheese
- 1 cup parmesan cheese
- Italian seasoning

Instructions:
1. Brown the ground beef
2. Cook lasagna noodles
3. Layer ingredients in baking dish
4. Bake at 375°F for 45 minutes
5. Let cool for 10 minutes before serving

Serves 8-10 people. Always a hit at community events!`,
      category: 'home',
      tags: ['recipe', 'cooking', 'community'],
      userId: boardMember.id,
    },
  ];

  for (const noteData of sampleNotes) {
    await prisma.note.create({
      data: noteData,
    });
  }

  // Seed Calendar Events
  const today = new Date();
  const sampleEvents = [
    {
      organizationId: organization.id,
      title: 'Monthly Board Meeting',
      description: 'Regular monthly board meeting to discuss association business, review finances, and address resident concerns.',
      location: 'Community Room, 2nd Floor',
      startDate: new Date(today.getFullYear(), today.getMonth(), 15),
      endDate: new Date(today.getFullYear(), today.getMonth(), 15),
      startTime: '7:00 PM',
      endTime: '9:00 PM',
      type: 'MEETING' as const,
      color: 'from-purple-600 to-purple-700',
      category: 'work',
      isRecurring: true,
      recurrence: 'MONTHLY' as const,
      userId: admin.id,
      isFavorite: true,
      attendeeCount: 8,
    },
    {
      organizationId: organization.id,
      title: 'Building Fire Drill',
      description: 'Mandatory building-wide fire drill. Please participate and evacuate via nearest stairwell when alarm sounds.',
      location: 'Entire Building',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      type: 'EVENT' as const,
      color: 'from-red-500 to-red-600',
      category: 'community',
      userId: admin.id,
      attendeeCount: 150,
    },
    {
      organizationId: organization.id,
      title: 'Pool Opening Day',
      description: 'Official opening of the community pool for the summer season! Come celebrate with refreshments and pool games.',
      location: 'Rooftop Pool Area',
      startDate: new Date(today.getFullYear(), today.getMonth() + 1, 1),
      endDate: new Date(today.getFullYear(), today.getMonth() + 1, 1),
      startTime: '12:00 PM',
      endTime: '4:00 PM',
      type: 'EVENT' as const,
      color: 'from-blue-500 to-cyan-600',
      category: 'community',
      userId: boardMember.id,
      isFavorite: true,
      attendeeCount: 75,
    },
    {
      organizationId: organization.id,
      title: 'Landscaping Maintenance',
      description: 'Scheduled landscaping maintenance - lawn mowing, trimming, and seasonal plantings.',
      location: 'Building Grounds',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      startTime: '8:00 AM',
      endTime: '2:00 PM',
      type: 'REMINDER' as const,
      color: 'from-green-500 to-green-600',
      category: 'work',
      userId: admin.id,
    },
    {
      organizationId: organization.id,
      title: 'Community Book Club',
      description: 'Monthly book club meeting. This month we\'re discussing "The Night Circus" by Erin Morgenstern.',
      location: 'Library/Reading Room',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12),
      startTime: '6:30 PM',
      endTime: '8:00 PM',
      type: 'EVENT' as const,
      color: 'from-amber-500 to-orange-600',
      category: 'personal',
      isRecurring: true,
      recurrence: 'MONTHLY' as const,
      userId: boardMember.id,
      attendeeCount: 12,
    },
    {
      organizationId: organization.id,
      title: 'Sarah Johnson\'s Birthday',
      description: 'Happy Birthday Sarah! 🎂🎉',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8),
      startTime: '12:00 AM',
      endTime: '11:59 PM',
      isAllDay: true,
      type: 'BIRTHDAY' as const,
      color: 'from-pink-500 to-pink-600',
      category: 'personal',
      isRecurring: true,
      recurrence: 'YEARLY' as const,
      userId: boardMember.id,
      isFavorite: true,
    },
    {
      organizationId: organization.id,
      title: 'Thanksgiving Day',
      description: 'Thanksgiving Holiday - Building office closed',
      startDate: new Date(today.getFullYear(), 10, 28), // November 28
      endDate: new Date(today.getFullYear(), 10, 28),
      startTime: '12:00 AM',
      endTime: '11:59 PM',
      isAllDay: true,
      type: 'HOLIDAY' as const,
      color: 'from-orange-600 to-red-600',
      category: 'community',
      userId: admin.id,
    },
    {
      organizationId: organization.id,
      title: 'Elevator Maintenance - North Tower',
      description: 'Annual elevator inspection and maintenance. North tower elevators will be out of service.',
      location: 'North Tower',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      type: 'REMINDER' as const,
      color: 'from-yellow-500 to-amber-600',
      category: 'work',
      userId: admin.id,
    },
    {
      organizationId: organization.id,
      title: 'Package Delivery - Bulk Shipment',
      description: 'Large package delivery expected. Please pick up packages from front desk promptly.',
      location: 'Front Desk',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      startTime: '2:00 PM',
      endTime: '4:00 PM',
      type: 'REMINDER' as const,
      color: 'from-indigo-500 to-purple-600',
      category: 'personal',
      userId: admin.id,
    },
  ];

  for (const eventData of sampleEvents) {
    await prisma.calendarEvent.create({
      data: eventData,
    });
  }

}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
