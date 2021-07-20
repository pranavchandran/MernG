import React from 'react';
import { Button, Form, Card } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';


import { useForm } from '../util/hooks';
import { FETCH_CLIENTS_QUERY } from '../util/graphql';

function ClientForm() {

    const { values, onChange, onSubmit } = useForm(createClientCallback, {
        name: '',
        email:''
    });

    const [createClient] = useMutation(CREATE_CLIENT_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_CLIENTS_QUERY
            });
            data.getClients = [result.data.createClient, ...data.getClients];
            proxy.writeQuery({ query: FETCH_CLIENTS_QUERY, data });
            values.name = '';
            values.email = '';
        }
    });
    

    function createClientCallback() {
        createClient();
    }

    return (
        <Card fluid>
            <Card.Content>
                <Form onSubmit={onSubmit}>
                    <h2>Create a client:</h2>
                    <Form.Field>
                        <Form.Input
                            placeholder="Name"
                            name="name"
                            onChange={onChange}
                            value={values.name}
                        />
                        <Form.Input
                            placeholder="Email"
                            name="email"
                            onChange={onChange}
                            value={values.email}
                        />
                        <Button type="submit" color="teal" >
                            Submit
                        </Button>
                    </Form.Field>
                </Form>
            </Card.Content>
        </Card>
    );
}

const CREATE_CLIENT_MUTATION = gql`
  mutation createClient($name: String!, $email: String!) {
    createClient(name: $name,email: $email) {
      id
      name
      email
      createdAt
      username
      messages {
        id
        subject
        body
        username
        createdAt
      }
      messageCount
    }
  }
`;

export default ClientForm;