import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user { id email role }
    }
  }
`;

export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;

export const SIGNUP = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      user { id email role }
    }
  }
`;

export const SOCIAL_LOGIN = gql`
  mutation SocialLogin($input: SocialLoginInput!) {
    socialLogin(input: $input) {
      token
      user { id email role }
    }
  }
`;

export const GITHUB_LOGIN = gql`
  mutation GithubLogin($code: String!, $role: UserRole) {
    githubLogin(code: $code, role: $role) {
      token
      user { id email role }
    }
  }
`;
