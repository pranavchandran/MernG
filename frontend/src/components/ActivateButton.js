import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button } from 'semantic-ui-react';



function ActivateButton({ clientId,activated, callback }) {

  //for updating
  const toUpadateData = activated ? false : true

  // const [updateClient] = useMutation(UPDATE_CLIENT_MUTATION);
  
  
  // const mutation = UPDATE_CLIENT_MUTATION;
  const [updateClient] = useMutation(UPDATE_CLIENT_MUTATION, {
    update(proxy) {

      if (!activated || activated) {
        if (callback) callback();
      }
      
    },
    variables: {
      clientId,
      activated
    }
  });

  const updateData = ()=>{
    updateClient({variables: {clientId:clientId, activated:toUpadateData}})
    
  }

  return (
    <>
      <Button 
        inverted
        color={activated ? 'red' : 'green'} 
        as="div"
        floated="right"
        onClick={updateData}
        content={activated ? 'Deactivate' : 'Activate'}
      /> 
    </>
  );
}

const UPDATE_CLIENT_MUTATION = gql`
  mutation updateClient($clientId: String!,$activated: Boolean!) {
    updateClient(clientId: $clientId, activated:$activated){
        activated
        id
    }
  }
`;

export default ActivateButton;