import { gql } from '@apollo/client';

export const UPDATE_COMPANY_PROFILE = gql`
  mutation UpdateCompanyProfile($input: CompanyProfileInput!) {
    updateCompanyProfile(input: $input) {
      id
      companyName
      description
      industry
      location
      foundedYear
      employeeCount
      slogan
    }
  }
`;

export const CREATE_COMPANY_PROFILE = gql`
  mutation CreateCompanyProfile($input: CompanyProfileInput!) {
    createCompanyProfile(input: $input) {
      id
      companyName
    }
  }
`;

export const UPLOAD_COMPANY_LOGO = gql`
  mutation UploadCompanyLogo($base64Image: String!) {
    uploadCompanyLogo(base64Image: $base64Image) {
      id
      logoUrl
    }
  }
`;
