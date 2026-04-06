import { apiService } from "./api";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: "student" | "counsellor" | "admin";
  is_anonymous: boolean;
  anon_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminBooking {
  id: string;
  student: string;
  student_name: string;
  student_email: string;
  counsellor: string;
  counsellor_name: string;
  counsellor_specialty: string;
  date: string;
  time: string;
  session_type: "video" | "in-person" | "phone";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes: string;
  created_at: string;
}

export interface AdminResource {
  id: string;
  title: string;
  description: string;
  type: "article" | "video" | "document" | "link" | "audio";
  url: string;
  category: string;
  duration: string;
  rating: number;
  created_at: string;
  created_by: string;
  created_by_name: string;
}

export interface AdminAssessment {
  id: string;
  user: string;
  user_name: string;
  user_email: string;
  assessment_type: "phq9" | "gad7" | "psqi";
  score: number;
  max_score: number;
  severity: string;
  answers: number[];
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  actor_email: string;
  actor_name: string;
  action: "create" | "update" | "delete" | "approve" | "cancel" | "login" | "logout";
  target_type: string;
  target_id: string;
  details: Record<string, unknown>;
  ip_address: string;
  user_agent: string;
  timestamp: string;
}

export interface AdminStats {
  users: {
    total: number;
    students: number;
    counsellors: number;
    admins: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    this_week: number;
  };
  resources: number;
  assessments: {
    total: number;
    this_week: number;
  };
  recent_activity: {
    bookings: number;
    assessments: number;
  };
}

export interface AssessmentStats {
  total_submissions: number;
  by_type: Array<{ assessment_type: string; count: number }>;
  recent_submissions: number;
  average_scores: Record<string, number>;
}

export type UserFilters = {
  role?: string;
  is_active?: boolean;
  search?: string;
};

export type BookingFilters = {
  status?: string;
  counsellor_id?: string;
  student_id?: string;
};

export type ResourceFilters = {
  category?: string;
};

export type AuditLogFilters = {
  actor_id?: string;
  target_type?: string;
  action?: string;
};

// ─── Service ───────────────────────────────────────────────────────────────────

class AdminService {
  // Stats
  async getStats(): Promise<AdminStats> {
    return apiService.get<AdminStats>("/admin/stats/");
  }

  // Users
  async getUsers(params?: UserFilters): Promise<AdminUser[]> {
    const query = new URLSearchParams();
    if (params?.role) query.set("role", params.role);
    if (params?.is_active !== undefined)
      query.set("is_active", String(params.is_active));
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    return apiService.get<AdminUser[]>(`/admin/users/${qs ? `?${qs}` : ""}`);
  }

  async getUser(id: string): Promise<AdminUser> {
    return apiService.get<AdminUser>(`/admin/users/${id}/`);
  }

  async updateUser(
    id: string,
    data: Partial<AdminUser>
  ): Promise<AdminUser> {
    return apiService.patch<AdminUser>(`/admin/users/${id}/`, data);
  }

  async deleteUser(id: string): Promise<void> {
    return apiService.delete<void>(`/admin/users/${id}/`);
  }

  // Bookings
  async getBookings(params?: BookingFilters): Promise<AdminBooking[]> {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.counsellor_id) query.set("counsellor_id", params.counsellor_id);
    if (params?.student_id) query.set("student_id", params.student_id);
    const qs = query.toString();
    return apiService.get<AdminBooking[]>(`/admin/bookings/${qs ? `?${qs}` : ""}`);
  }

  async updateBooking(
    id: string,
    data: { status: string }
  ): Promise<AdminBooking> {
    return apiService.patch<AdminBooking>(`/admin/bookings/${id}/`, data);
  }

  // Resources
  async getResources(params?: ResourceFilters): Promise<AdminResource[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== "all")
      query.set("category", params.category);
    const qs = query.toString();
    return apiService.get<AdminResource[]>(
      `/admin/resources/${qs ? `?${qs}` : ""}`
    );
  }

  async createResource(data: Partial<AdminResource>): Promise<AdminResource> {
    return apiService.post<AdminResource>("/admin/resources/", data);
  }

  async updateResource(
    id: string,
    data: Partial<AdminResource>
  ): Promise<AdminResource> {
    return apiService.patch<AdminResource>(`/admin/resources/${id}/`, data);
  }

  async deleteResource(id: string): Promise<void> {
    return apiService.delete<void>(`/admin/resources/${id}/`);
  }

  // Assessments
  async getAssessmentStats(): Promise<AssessmentStats> {
    return apiService.get<AssessmentStats>("/admin/assessments/stats/");
  }

  async getAssessments(
    assessment_type?: string
  ): Promise<AdminAssessment[]> {
    const qs = assessment_type ? `?assessment_type=${assessment_type}` : "";
    return apiService.get<AdminAssessment[]>(`/admin/assessments/${qs}`);
  }

  // Audit Logs
  async getAuditLogs(params?: AuditLogFilters): Promise<AuditLog[]> {
    const query = new URLSearchParams();
    if (params?.actor_id) query.set("actor_id", params.actor_id);
    if (params?.target_type) query.set("target_type", params.target_type);
    if (params?.action) query.set("action", params.action);
    const qs = query.toString();
    return apiService.get<AuditLog[]>(`/admin/audit-logs/${qs ? `?${qs}` : ""}`);
  }
}

export const adminService = new AdminService();
