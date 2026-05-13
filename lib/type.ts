// CV Review Types
export interface CVSectionFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
}

export interface CVReviewResult {
  overallScore: number;
  overallSummary: string;
  sections: {
    contact: CVSectionFeedback;
    summary: CVSectionFeedback;
    experience: CVSectionFeedback;
    education: CVSectionFeedback;
    skills: CVSectionFeedback;
    format: CVSectionFeedback;
  };
  topRecommendations: string[];
  atsScore: number;
  verdict: string;
}

// User Types
export type UserRole = 'student' | 'company' | 'admin';

export interface User {
  id: string;
  email: string;
  role: string | UserRole;
  phoneNumber?: string;
  themeColor?: string;
  emailNotifications?: boolean;
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

export interface SocialLoginInput {
  email: string;
  socialId: string;
  provider: 'google' | 'github';
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
}

// Student Profile Types
export type ExperienceLevel = 'intern';

export interface Education {
  school: string;
  degree: string;
  year: number;
  status?: "studying" | "graduated";
}

export interface StudentProfile {
  id: string;
  userId: string;
  user?: User;
  firstName?: string;
  lastName?: string;
  skills: string[];
  cvUrl?: string;
  profilePictureUrl?: string;
  bio?: string;
  experienceLevel?: ExperienceLevel;
  isActivelyLooking?: boolean;
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
  foundedYear?: number;
  employeeCount?: number;
  slogan?: string;
  updatedAt: string;
}

// Job Types
export type JobStatus = 'open' | 'closed' | 'draft';

export interface Job {
  id: string;
  companyProfileId: string;
  title: string;
  description?: string;
  type: ExperienceLevel;
  requiredSkills: string[];
  location?: string;
  salaryRange?: string;
  responsibilities?: string;
  requirements?: string;
  additionalInfo?: string;
  deadline?: string;
  maxParticipants?: number;
  applicationCount: number;
  status: JobStatus;
  postedAt: string;
  company?: CompanyProfile;
  matchScore?: number;
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

// Invitation Types
export type InvitationStatus = 'pending' | 'accepted' | 'rejected';

export interface Invitation {
  id: string;
  companyProfileId: string;
  studentProfileId: string;
  message?: string;
  status: InvitationStatus;
  sentAt: string;
  respondedAt?: string;
  company?: CompanyProfile;
  student?: StudentProfile;
}

// Input Types
export interface StudentProfileInput {
  firstName?: string;
  lastName?: string;
  skills?: string[];
  cvUrl?: string;
  profilePictureUrl?: string;
  bio?: string;
  experienceLevel?: ExperienceLevel;
  isActivelyLooking?: boolean;
  education?: Education[];
}

export interface CompanyProfileInput {
  companyName: string;
  description?: string;
  industry?: string;
  location?: string;
  logoUrl?: string;
  website?: string;
  foundedYear?: number;
  employeeCount?: number;
  slogan?: string;
}

export interface JobInput {
  title?: string;
  description?: string;
  type?: ExperienceLevel;
  requiredSkills?: string[];
  location?: string;
  salaryRange?: string;
  responsibilities?: string;
  requirements?: string;
  additionalInfo?: string;
  deadline?: string;
  maxParticipants?: number;
  status?: JobStatus;
}

// CV Parse Result
export interface CVParseResult {
  firstName?: string;
  lastName?: string;
  bio?: string;
  skills: string[];
  education: Education[];
  experienceLevel?: ExperienceLevel;
}

// AI Match Result
export type AIMatchRecommendation = 'hire' | 'maybe' | 'pass';

export interface AIMatchResult {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendation: AIMatchRecommendation;
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
