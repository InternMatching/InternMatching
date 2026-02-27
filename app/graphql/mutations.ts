import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user { id email role }
    }
  }
`;

export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;
export const SIGNUP = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      user { id email role }
    }
  }
`;

export const ADMIN_STATS = gql`
  query AdminStats($period: StatsPeriod) {
    adminStats(period: $period) {
      totalUsers
      totalStudents
      totalCompanies
      activeJobs
      totalApplications
      pendingVerifications
      newUsersToday
      growthData {
        name
        users
        apps
      }
      recentActivities {
        id
        user
        action
        timestamp
        type
      }
    }
  }
`
export const ME = gql`
  query Me {
    me {
      id
      email
      role
      phoneNumber
      themeColor
      emailNotifications
    }
  }
`;

export const GET_STUDENT_PROFILE = gql`
  query GetStudentProfile($userId: ID) {
    getStudentProfile(userId: $userId) {
      id
      userId
      firstName
      lastName
      bio
      skills
      experienceLevel
      education {
        school
        degree
        year
      }
    }
  }
`;

export const UPDATE_STUDENT_PROFILE = gql`
  mutation UpdateStudentProfile($input: StudentProfileInput!) {
    updateStudentProfile(input: $input) {
      id
      firstName
      lastName
      bio
      skills
    }
  }
`;

export const CREATE_STUDENT_PROFILE = gql`
  mutation CreateStudentProfile($input: StudentProfileInput!) {
    createStudentProfile(input: $input) {
      id
      firstName
      lastName
      bio
      skills
    }
  }
`;

export const GET_COMPANY_PROFILE = gql`
  query GetCompanyProfile($userId: ID) {
    getCompanyProfile(userId: $userId) {
      id
      userId
      companyName
      description
      industry
      location
      logoUrl
      website
      isVerified
    }
  }
`;

export const UPDATE_COMPANY_PROFILE = gql`
  mutation UpdateCompanyProfile($input: CompanyProfileInput!) {
    updateCompanyProfile(input: $input) {
      id
      companyName
      description
      industry
      location
    }
  }
`;

export const CREATE_COMPANY_PROFILE = gql`
  mutation CreateCompanyProfile($input: CompanyProfileInput!) {
    createCompanyProfile(input: $input) {
      id
      companyName
    }
  }
`;

export const GET_ALL_STUDENT_PROFILES = gql`
  query GetAllStudentProfiles {
    getAllStudentProfiles {
      id
      firstName
      lastName
      skills
      bio
      experienceLevel
    }
  }
`;

export const GET_ALL_JOBS = gql`
  query GetAllJobs($companyProfileId: ID, $status: JobStatus) {
    getAllJobs(companyProfileId: $companyProfileId, status: $status) {
      id
      title
      description
      type
      location
      salaryRange
      status
      postedAt
      company {
        companyName
      }
    }
  }
`;

export const CREATE_JOB = gql`
  mutation CreateJob($input: JobInput!) {
    createJob(input: $input) {
      id
      title
    }
  }
`;

export const GET_APPLICATIONS = gql`
  query GetAllApplications($jobId: ID, $studentProfileId: ID) {
    getAllApplications(jobId: $jobId, studentProfileId: $studentProfileId) {
      id
      status
      matchScore
      appliedAt
      job {
        id
        title
        company {
          companyName
        }
      }
      student {
        id
        firstName
        lastName
      }
    }
  }
`;

export const CREATE_APPLICATION = gql`
  mutation CreateApplication($jobId: ID!, $coverLetter: String) {
    createApplication(jobId: $jobId, coverLetter: $coverLetter) {
      id
      status
    }
  }
`;

export const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateApplicationStatus($id: ID!, $status: ApplicationStatus!) {
    updateApplicationStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;
