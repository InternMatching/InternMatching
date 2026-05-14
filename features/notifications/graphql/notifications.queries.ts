import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($limit: Int) {
    getNotifications(limit: $limit) {
      id
      type
      title
      message
      data
      read
      createdAt
    }
  }
`;

export const GET_UNREAD_COUNT = gql`
  query GetUnreadNotificationCount {
    getUnreadNotificationCount
  }
`;

export const MARK_READ = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id)
  }
`;

export const MARK_ALL_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id)
  }
`;
