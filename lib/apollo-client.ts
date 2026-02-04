import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
// || 'http://localhost:4000/graphql'
const httpLink = new HttpLink({
  uri:  process.env.NEXT_PUBLIC_GRAPHQL_URL ,
});
export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
