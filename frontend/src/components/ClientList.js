import React, { useContext } from 'react';


import { AuthContext } from '../context/auth';
import { Card, Icon, Image, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import moment from 'moment'
import ActivateButton from './ActivateButton';

function ClientList({ client: { name, email, createdAt, id, username, messageCount, activated } }) {

    const { user } = useContext(AuthContext)
    
    function text() {
        console.log('Message Me......')
    }
    return (
        <Card fluid as={Link} to={`/clients/${id}`}>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/elliot.jpg'
                />
                <Card.Header>{name}</Card.Header>
                <Card.Meta>{email}</Card.Meta>
                <Card.Description>
                    <Card.Meta as={Link} to={`/clients/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button animated='vertical' color='teal' basic onClick={text}>
                    <Button.Content hidden>Text</Button.Content>
                    <Button.Content visible>
                        <Icon name='comments' />
                    </Button.Content>
                </Button>
                { user && user.username === username && (
                  <ActivateButton clientId={id} activated={activated} />)}

            </Card.Content>
        </Card>
    )
}


export default ClientList;