import { gql } from '@apollo/client';

export const ME = gql`
  query Me {
    me {
      id
      email
      role
      phoneNumber
      themeColor
      emailNotifications
    }
  }
`;
