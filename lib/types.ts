
import { UserRole, PaymentStatus, FilePermission, NotificationType } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  unitNumber?: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  stripePaymentId?: string;
  description?: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileRecord {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: bigint;
  cloudStoragePath: string;
  folder: string;
  permission: FilePermission;
  uploadedById: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isUrgent: boolean;
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalResidents: number;
  totalPayments: number;
  overduePayments: number;
  monthlyRevenue: number;
  recentActivity: any[];
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

export interface FolderStructure {
  [key: string]: {
    name: string;
    permission: FilePermission;
    allowedRoles: UserRole[];
  };
}

export interface PropertyUnit {
  id: string;
  unitNumber: string;
  building?: string;
  floor?: number;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  squareFootage?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  storageUnit?: string;
  occupancyStatus?: string;
  monthlyDues?: number;
  notes?: string;
  isActive: boolean;
}

export const FOLDER_PERMISSIONS: FolderStructure = {
  "meeting-minutes": {
    name: "Meeting Minutes",
    permission: "RESIDENTS_ONLY",
    allowedRoles: ["ADMIN", "BOARD_MEMBER", "RESIDENT"]
  },
  "bylaws": {
    name: "Bylaws & Regulations",
    permission: "RESIDENTS_ONLY",
    allowedRoles: ["ADMIN", "BOARD_MEMBER", "RESIDENT"]
  },
  "financial-reports": {
    name: "Financial Reports",
    permission: "BOARD_ONLY",
    allowedRoles: ["ADMIN", "BOARD_MEMBER"]
  },
  "maintenance-records": {
    name: "Maintenance Records",
    permission: "BOARD_ONLY",
    allowedRoles: ["ADMIN", "BOARD_MEMBER"]
  },
  "purchase-records": {
    name: "Purchase Records",
    permission: "ADMIN_ONLY",
    allowedRoles: ["ADMIN"]
  },
  "resident-documents": {
    name: "Resident Documents",
    permission: "RESIDENTS_ONLY",
    allowedRoles: ["ADMIN", "BOARD_MEMBER", "RESIDENT"]
  },
  "board-documents": {
    name: "Board Documents",
    permission: "BOARD_ONLY",
    allowedRoles: ["ADMIN", "BOARD_MEMBER"]
  }
};
