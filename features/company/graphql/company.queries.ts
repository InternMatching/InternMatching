import { gql } from '@apollo/client';

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
