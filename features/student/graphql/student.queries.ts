import { gql } from '@apollo/client';

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
      isActivelyLooking
      education {
        school
        degree
        year
        status
      }
    }
  }
`;

export const GET_ALL_STUDENT_PROFILES = gql`
  query GetAllStudentProfiles {
    getAllStudentProfiles {
      id
      userId
      user {
        id
        email
        phoneNumber
      }
      firstName
      lastName
      skills
      bio
      profilePictureUrl
      experienceLevel
      isActivelyLooking
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
