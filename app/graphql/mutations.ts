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

export const SOCIAL_LOGIN = gql`
  mutation SocialLogin($input: SocialLoginInput!) {
    socialLogin(input: $input) {
      token
      user { id email role }
    }
  }
`;

export const GITHUB_LOGIN = gql`
  mutation GithubLogin($code: String!, $role: UserRole) {
    githubLogin(code: $code, role: $role) {
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
      profilePictureUrl
      experienceLevel
      education {
        school
        degree
        year
        status
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
      profilePictureUrl
      experienceLevel
      education {
        school
        degree
        year
        status
      }
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
      profilePictureUrl
      experienceLevel
      education {
        school
        degree
        year
        status
      }
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
      foundedYear
      employeeCount
      slogan
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
      foundedYear
      employeeCount
      slogan
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
      userId
      firstName
      lastName
      skills
      bio
      profilePictureUrl
      experienceLevel
      updatedAt
      education {
        school
        degree
        year
        status
      }
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
      responsibilities
      requirements
      additionalInfo
      deadline
      maxParticipants
      applicationCount
      status
      postedAt
      company {
        companyName
        logoUrl
        location
        foundedYear
        employeeCount
        slogan
      }
    }
  }
`;

export const CREATE_JOB = gql`
  mutation CreateJob($input: JobInput!) {
    createJob(input: $input) {
      id
      title
      maxParticipants
      applicationCount
    }
  }
`;

export const UPDATE_JOB = gql`
  mutation UpdateJob($id: ID!, $input: JobInput!) {
    updateJob(id: $id, input: $input) {
      id
      title
      description
      type
      requiredSkills
      location
      salaryRange
      responsibilities
      requirements
      additionalInfo
      deadline
      maxParticipants
      status
    }
  }
`;

export const DELETE_JOB = gql`
  mutation DeleteJob($id: ID!) {
    deleteJob(id: $id)
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
        description
        type
        location
        salaryRange
        responsibilities
        requirements
        additionalInfo
        deadline
        postedAt
        company {
          companyName
          industry
          location
          description
          logoUrl
          website
          foundedYear
          employeeCount
          slogan
        }
      }
      student {
        id
        firstName
        lastName
        profilePictureUrl
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

export const UPLOAD_COMPANY_LOGO = gql`
  mutation UploadCompanyLogo($base64Image: String!) {
    uploadCompanyLogo(base64Image: $base64Image) {
      id
      logoUrl
    }
  }
`;

export const UPLOAD_STUDENT_PROFILE_PICTURE = gql`
  mutation UploadStudentProfilePicture($base64Image: String!) {
    uploadStudentProfilePicture(base64Image: $base64Image) {
      id
      profilePictureUrl
    }
  }
`;
