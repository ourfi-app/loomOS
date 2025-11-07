
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get organization ID for tenant isolation
    const organizationId = await getCurrentOrganizationId();

    const isAdmin = (session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN');

    // Fetch all residents with enhanced information
    const residents = await prisma.user.findMany({
      where: {
        organizationId,
        isActive: true
      
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        unitNumber: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
        committeeMemberships: {
          include: {
            committee: {
              select: {
                id: true,
                name: true,
                type: true
              }
            }
          }
        }
      },
      orderBy: { unitNumber: 'asc' }
    });

    // Fetch household data for each unit
    const unitNumbers = [...new Set(residents.map(r => r.unitNumber).filter(Boolean))];
    
    const [pets, children, additionalResidents, propertyUnits] = await Promise.all([
      prisma.pet.findMany({
        where: {
        organizationId,
        unitNumber: { in: unitNumbers as string[] 
      } }
      }),
      prisma.child.findMany({
        where: {
        organizationId,
        unitNumber: { in: unitNumbers as string[] 
      } }
      }),
      prisma.additionalResident.findMany({
        where: {
        organizationId,
        unitNumber: { in: unitNumbers as string[] 
      } }
      }),
      prisma.propertyUnit.findMany({
        where: {
        organizationId,
        unitNumber: { in: unitNumbers as string[] 
      } }
      })
    ]);

    // Map household data by unit number
    const petsByUnit = pets.reduce((acc, pet) => {
      if (!acc[pet.unitNumber]) acc[pet.unitNumber] = [];
      const unitPets = acc[pet.unitNumber];
      if (unitPets) {
        unitPets.push(pet);
      }
      return acc;
    }, {} as Record<string, typeof pets>);

    const childrenByUnit = children.reduce((acc, child) => {
      if (!acc[child.unitNumber]) acc[child.unitNumber] = [];
      const unitChildren = acc[child.unitNumber];
      if (unitChildren) {
        unitChildren.push(child);
      }
      return acc;
    }, {} as Record<string, typeof children>);

    const additionalResidentsByUnit = additionalResidents.reduce((acc, resident) => {
      if (!acc[resident.unitNumber]) acc[resident.unitNumber] = [];
      const unitResidents = acc[resident.unitNumber];
      if (unitResidents) {
        unitResidents.push(resident);
      }
      return acc;
    }, {} as Record<string, typeof additionalResidents>);

    const propertyUnitsByUnitNumber = propertyUnits.reduce((acc, unit) => {
      acc[unit.unitNumber] = unit;
      return acc;
    }, {} as Record<string, typeof propertyUnits[0]>);

    // Enhance residents with household data
    const enhancedResidents = residents.map(resident => {
      const unitNumber = resident.unitNumber || '';
      const propertyUnit = propertyUnitsByUnitNumber[unitNumber];
      
      return {
        ...resident,
        pets: petsByUnit[unitNumber] || [],
        children: childrenByUnit[unitNumber] || [],
        additionalResidents: isAdmin 
          ? additionalResidentsByUnit[unitNumber] || []
          : (additionalResidentsByUnit[unitNumber] || []).map(r => ({
              ...r,
              phone: undefined, // Hide phone for non-admins
              email: undefined  // Hide email for non-admins
            })),
        propertyUnit: propertyUnit ? {
          building: propertyUnit.building,
          floor: propertyUnit.floor,
          squareFootage: propertyUnit.squareFootage,
          bedrooms: propertyUnit.bedrooms,
          bathrooms: propertyUnit.bathrooms
        } : null
      };
    });

    return NextResponse.json({ residents: enhancedResidents });
  } catch (error) {
    console.error('Error fetching residents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch residents' },
      { status: 500 }
    );
  }
}
