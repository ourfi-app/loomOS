
import { NextRequest } from "next/server";
import { validateAuth, createSuccessResponse, errorResponse, handleApiError, logApiRequest } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { FOLDER_PERMISSIONS } from "@/lib/types";
import { getCurrentOrganizationId } from '@/lib/tenant-context';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    logApiRequest('GET', '/api/documents');

    const auth = await validateAuth();
    const organizationId = await getCurrentOrganizationId();
    if (!auth) {
      return errorResponse('Unauthorized', 401);
    }

    const userRole = auth.user.role;

    // Get documents based on user permissions
    let documents: any[] = [];
    
    if (userRole === 'ADMIN') {
      // Admin can see all documents
      documents = await prisma.file.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: {
              name: true,
              unitNumber: true
            }
          }
        }
      });
    } else if (userRole === 'BOARD_MEMBER') {
      // Board members can see public, residents_only, and board_only documents
      documents = await prisma.file.findMany({
        where: {
        organizationId,
        permission: {
            in: ['PUBLIC', 'RESIDENTS_ONLY', 'BOARD_ONLY']
          
      }
        },
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: {
              name: true,
              unitNumber: true
            }
          }
        }
      });
    } else {
      // Residents can see public and residents_only documents
      documents = await prisma.file.findMany({
        where: {
        organizationId,
        permission: {
            in: ['PUBLIC', 'RESIDENTS_ONLY']
          
      }
        },
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: {
              name: true,
              unitNumber: true
            }
          }
        }
      });
    }

    // Convert BigInt to Number for serialization
    const serializedDocuments = documents.map(doc => ({
      ...doc,
      size: Number(doc.size)
    }));

    // Calculate folder counts
    const folderCounts: Record<string, number> = {};
    serializedDocuments.forEach(doc => {
      folderCounts[doc.folder] = (folderCounts[doc.folder] || 0) + 1;
    });

    // Build folder information
    const folders: Record<string, any> = {};
    Object.entries(FOLDER_PERMISSIONS).forEach(([key, folderInfo]) => {
      folders[key] = {
        ...folderInfo,
        count: folderCounts[key] || 0
      };
    });

    return createSuccessResponse({
      documents: serializedDocuments,
      folders
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/documents');
  }
}
