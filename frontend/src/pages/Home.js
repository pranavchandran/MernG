import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Grid } from 'semantic-ui-react'

import { AuthContext } from '../context/auth'
import ClientList from '../components/ClientList'
import ClientForm from '../components/ClientForm'


function Home() {
    const { user } = useContext(AuthContext)
    const { loading, data } = useQuery(FETCH_CLIENTS_QUERY);

    

    return (
        <Grid columns={3} divided  >
            <Grid.Row >
                {user && (
                    <Grid.Column style={{ marginBottom: 25 }}>
                        <ClientForm />
                    </Grid.Column>
                )} 
                {loading ? (
                    <h1>Loading.........</h1>)
                    : (
                        data.getClients && data.getClients.map((client) => (
                            <Grid.Column key={client.id} style={{ marginBottom: 30 }}>
                                <ClientList client={client} />
                            </Grid.Column>
                        ))
                    )
                }
            </Grid.Row>
        </Grid>
    )
}
const FETCH_CLIENTS_QUERY = gql`
    query{
        getClients{
            id
            name
            email
            createdAt
            activated
            username
            messageCount
            messages{
                id
            subject
            body
            username
            createdAt
        }
    }
    }
            `;
export default Home;