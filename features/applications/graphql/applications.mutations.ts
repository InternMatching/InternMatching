import { gql } from '@apollo/client';

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
