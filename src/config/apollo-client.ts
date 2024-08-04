'use client';

import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
// Function to create an Apollo Client instance and connect to the GraphQL backend
const gqlClientConnect = () => {
  // Create a new InMemoryCache instance
  const cache = new InMemoryCache({
    addTypename: false,
    typePolicies: {},
  });  
// Create an HttpLink instance to connect to the GraphQL server
  const httpLink = createHttpLink({
    uri: 'http://localhost:3002/graphql',
    useGETForQueries: false, // Use GET method for queries
  }); 

  const authLink = new ApolloLink((operation, forward) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    // Add the token to the headers if it exists
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });

    return forward(operation);
  });
  const link = ApolloLink.from([authLink, httpLink]);
// Create the ApolloClient instance
  const apolloClient: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    ssrMode: typeof window === 'undefined', // Set SSR mode based on whether the window object is available
    cache, // Assign the previously created InMemoryCache instance
    // link: httpLink, // Assign the HttpLink instance as the link for the ApolloClient
    link,
  });
  return apolloClient; // Return the ApolloClient instance
};
export default gqlClientConnect;