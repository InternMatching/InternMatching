// User Types
export type UserRole = 'STUDENT' | 'COMPANY' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  studentProfile?: StudentProfile;
  companyProfile?: CompanyProfile;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password?: string;
}

export interface SignupInput {
  email: string;
  password?: string;
  role: string;
}

// Student Profile Types
export type ExperienceLevel = 'NO_EXPERIENCE' | 'SOME_EXPERIENCE' | 'EXPERIENCED';

export interface StudentProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  skills: string[];
  cvUrl?: string;
  bio?: string;
  experienceLevel: ExperienceLevel;
  education?: string;
  createdAt: string;
  updatedAt: string;
}

// Company Profile Types
export interface CompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  description?: string;
  industry?: string;
  location?: string;
  logoUrl?: string;
  isVerified: boolean;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

// Job Types
export type JobStatus = 'OPEN' | 'CLOSED' | 'DRAFT';
export type JobType = 'INTERNSHIP' | 'JUNIOR' | 'ENTRY_LEVEL';

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  type: JobType;
  status: JobStatus;
  salary?: string;
  applicationDeadline?: string;
  createdAt: string;
  updatedAt: string;
  company?: CompanyProfile;
  applicationsCount?: number;
}

// Application Types
export type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  status: ApplicationStatus;
  coverLetter?: string;
  matchScore?: number;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  student?: StudentProfile;
}

// Dashboard Stats
export interface StudentDashboardStats {
  appliedJobs: number;
  suggestedMatches: number;
  profileCompletion: number;
}

export interface CompanyDashboardStats {
  activeJobs: number;
  totalApplicants: number;
  pendingReviews: number;
}

// Password Reset Types
export interface RequestPasswordResetData {
  requestPasswordReset: boolean;
}

export interface ResetPasswordData {
  resetPassword: boolean;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}
