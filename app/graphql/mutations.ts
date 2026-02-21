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
