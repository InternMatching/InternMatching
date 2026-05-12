import { gql } from '@apollo/client';

export const GET_INVITATIONS = gql`
  query GetInvitations($companyProfileId: ID, $studentProfileId: ID) {
    getInvitations(companyProfileId: $companyProfileId, studentProfileId: $studentProfileId) {
      id
      companyProfileId
      studentProfileId
      message
      status
      sentAt
      respondedAt
      company {
        id
        companyName
        logoUrl
        industry
        location
      }
      student {
        id
        firstName
        lastName
        profilePictureUrl
        skills
        experienceLevel
      }
    }
  }
`;
