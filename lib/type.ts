// User Types
export type UserRole = 'student' | 'company' | 'admin';

export interface User {
  id: string;
  email: string;
  role: string | UserRole;
  createdAt: string;
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
  role: UserRole;
}

// Student Profile Types
export type ExperienceLevel = 'intern' | 'junior';

export interface Education {
  school: string;
  degree: string;
  year: number;
}

export interface StudentProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  skills: string[];
  cvUrl?: string;
  bio?: string;
  experienceLevel?: ExperienceLevel;
  education?: Education[];
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
  updatedAt: string;
}

// Job Types
export type JobStatus = 'open' | 'closed';

export interface Job {
  id: string;
  companyProfileId: string;
  title: string;
  description?: string;
  type: ExperienceLevel;
  requiredSkills: string[];
  location?: string;
  salaryRange?: string;
  status: JobStatus;
  postedAt: string;
  company?: CompanyProfile;
}

// Application Types
export type ApplicationStatus = 'applied' | 'reviewing' | 'interview_scheduled' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  jobId: string;
  studentProfileId: string;
  status: ApplicationStatus;
  coverLetter?: string;
  matchScore: number;
  appliedAt: string;
  job?: Job;
  student?: StudentProfile;
}

// Input Types
export interface StudentProfileInput {
  firstName?: string;
  lastName?: string;
  skills?: string[];
  cvUrl?: string;
  bio?: string;
  experienceLevel?: ExperienceLevel;
  education?: Education[];
}

export interface CompanyProfileInput {
  companyName: string;
  description?: string;
  industry?: string;
  location?: string;
  logoUrl?: string;
  website?: string;
}

export interface JobInput {
  title: string;
  description?: string;
  type: ExperienceLevel;
  requiredSkills?: string[];
  location?: string;
  salaryRange?: string;
  status?: JobStatus;
}

// Admin Stats Types
export type StatsPeriod = 'DAILY' | 'WEEKLY';

export interface GrowthData {
  name: string;
  users: number;
  apps: number;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  type: string;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalCompanies: number;
  activeJobs: number;
  totalApplications: number;
  pendingVerifications: number;
  newUsersToday: number;
  growthData: GrowthData[];
  recentActivities: RecentActivity[];
}
