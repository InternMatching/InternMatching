import { gql } from '@apollo/client';

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
`;
