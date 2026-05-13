import { gql } from '@apollo/client';

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

export const SUGGEST_SKILLS_FOR_MY_PROFILE = gql`
  mutation SuggestSkillsForMyProfile {
    suggestSkillsForMyProfile
  }
`;

export const PARSE_CV = gql`
  mutation ParseCV($base64PDF: String!) {
    parseCV(base64PDF: $base64PDF) {
      firstName
      lastName
      bio
      skills
      education {
        school
        degree
        year
        status
      }
      experienceLevel
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
