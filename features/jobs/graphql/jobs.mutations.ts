import { gql } from '@apollo/client';

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
