import { gql } from '@apollo/client';

export const SEND_INVITATION = gql`
  mutation SendInvitation($studentProfileId: ID!, $message: String) {
    sendInvitation(studentProfileId: $studentProfileId, message: $message) {
      id
      status
      sentAt
    }
  }
`;

export const RESPOND_TO_INVITATION = gql`
  mutation RespondToInvitation($id: ID!, $status: InvitationStatus!) {
    respondToInvitation(id: $id, status: $status) {
      id
      status
      respondedAt
    }
  }
`;
