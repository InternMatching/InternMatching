import { gql } from '@apollo/client';

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
