import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon } from 'semantic-ui-react';

import { FETCH_CLIENTS_QUERY } from '../util/graphql';

function DeleteMessage({ clientId, messageId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = DELETE_MESSAGE_MUTATION;

  const [deleteClientOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!messageId) {
        const data = proxy.readQuery({
          query: FETCH_CLIENTS_QUERY
        });
        data.getClients = data.getClients.filter((p) => p.id !== clientId);
        proxy.writeQuery({ query: FETCH_CLIENTS_QUERY, data });
      }
      if (callback) callback();
    },
    variables: {
      clientId,
      messageId
    }
  });
  return (
    <>
      <Button
        as="div"
        color="red"
        floated="right"
        onClick={() => setConfirmOpen(true)}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteClientOrMutation}
      />
    </>
  );
}



const DELETE_MESSAGE_MUTATION = gql`
  mutation deleteMessage($clientId: ID!, $messageId: ID!) {
    deleteMessage(clientId: $clientId, messageId: $messageId) {
      id
      messages {
        id
        username
        createdAt
        body
      }
      messageCount
    }
  }
`;

export default DeleteMessage;