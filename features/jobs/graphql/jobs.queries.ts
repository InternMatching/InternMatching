import { gql } from '@apollo/client';

// Lightweight query for job list (no heavy text fields)
export const GET_JOBS_LIST = gql`
  query GetJobsList($companyProfileId: ID, $status: JobStatus) {
    getAllJobs(companyProfileId: $companyProfileId, status: $status) {
      id
      title
      type
      location
      salaryRange
      deadline
      maxParticipants
      applicationCount
      requiredSkills
      matchScore
      status
      postedAt
      company {
        companyName
        description
        industry
        logoUrl
        location
        foundedYear
        employeeCount
        slogan
        website
      }
    }
  }
`;

// Full query for job detail
export const GET_JOB_DETAIL = gql`
  query GetJobDetail($id: ID!) {
    getJob(id: $id) {
      id
      title
      description
      type
      location
      salaryRange
      responsibilities
      requirements
      additionalInfo
      deadline
      maxParticipants
      applicationCount
      requiredSkills
      matchScore
      status
      postedAt
      company {
        companyName
        description
        industry
        logoUrl
        location
        foundedYear
        employeeCount
        slogan
        website
      }
    }
  }
`;

export const GET_AI_MATCH_SCORE = gql`
  query GetAIMatchScore($jobId: ID!) {
    getAIMatchScore(jobId: $jobId) {
      score
      summary
      strengths
      gaps
      recommendation
    }
  }
`;

export const GET_ALL_JOBS = gql`
  query GetAllJobs($companyProfileId: ID, $status: JobStatus) {
    getAllJobs(companyProfileId: $companyProfileId, status: $status) {
      id
      title
      description
      type
      location
      salaryRange
      responsibilities
      requirements
      additionalInfo
      deadline
      maxParticipants
      applicationCount
      requiredSkills
      matchScore
      status
      postedAt
      company {
        companyName
        description
        industry
        logoUrl
        location
        foundedYear
        employeeCount
        slogan
        website
      }
    }
  }
`;
