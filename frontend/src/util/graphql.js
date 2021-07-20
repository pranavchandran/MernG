import gql from 'graphql-tag';

export const FETCH_CLIENTS_QUERY = gql`
  {
    getClients {
      id
      createdAt
      username
      messageCount
      activated
      messages {
        id
        subject
        username
        createdAt
        body
      }
    }
  }
`;