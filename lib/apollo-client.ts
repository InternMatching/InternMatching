import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
// || 'http://localhost:4001/graphql';
const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL 
console.log("🌐 Using GraphQL Endpoint:", graphqlUrl);

const httpLink = new HttpLink({
  uri: graphqlUrl,
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
