import React, {  useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import { Button, Card, Grid, Image, Icon, Label, Form, TextArea, Input } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import ActivateButton from '../components/ActivateButton';
import DeleteButton from '../components/DeleteMessage';
import { useForm } from '../util/hooks';



function SingleClient(props) {

    
    const clientId = props.match.params.clientId;


    const { onChange, onSubmit, values } = useForm(createMessage, {
        clientId:clientId,
        subject: '',
        body: '',
    });

    function createMessage() {
        sendMessage();
    }

    const [sendMessage] = useMutation(CREATE_MESSAGE_MUTATION, {
        update(_, result) {
            props.history.push(`/clients/${clientId}`);
        },
        onError(err) {
            // setErrors(err.graphQLErrors[0].extensions.exception.errors);
            console.log(err)
        },
        variables: values
    });

    const { user } = useContext(AuthContext);


    const {
        data
    } = useQuery(FETCH_CLIENT_QUERY, {
        variables: {
            clientId
        }
    });

    function activateClientCallback() {
        props.history.push(`/clients/${clientId}`);
    }

    let clientMarkup;
    if (!data) {
        clientMarkup = <p>Loading client..</p>;
    } else {
        const {
            id,
            name,
            createdAt,
            username,
            activated,
            email,
            messages,
            messageCount
        } = data.getClient;


        clientMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                            size="small"
                            float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{name}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{email}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <Button
                                    as="div"
                                    labelPosition="right"
                                    onClick={() => console.log('Comment on client')}
                                >
                                    <Button basic color="blue">
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {messageCount}
                                    </Label>
                                </Button>
                                {user && user.username === username && (
                                    <ActivateButton clientId={id} activated={activated} callback={activateClientCallback} />
                                )}
                            </Card.Content>
                        </Card>

                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Text a message</p>
                                    <Form onSubmit={onSubmit}>
                                                <Form.Field
                                                    control={Input}
                                                    name="subject"
                                                    label='Subject:'
                                                    placeholder='Subject'
                                                    value={values.subject}
                                                    onChange={onChange}
                                                />
                                                {/* <input
                                                type="text"
                                                placeholder="Comment.."
                                                name="comment"
                                                value={comment}
                                                onChange={(event) => setComment(event.target.value)}
                                                ref={commentInputRef}
                                            /> */}
                                                <Form.Field
                                                    control={TextArea}
                                                    name="body"
                                                    label='Message:'
                                                    placeholder='Contents....'
                                                    value={values.body}
                                                    onChange={onChange}
                                                />
                                                <button
                                                    type="submit"
                                                    className="ui button teal"
                                                    disabled={values.subject.trim() === ''}
                                                    value={clientId}
                                                // onClick={submitComment}
                                                >
                                                    Submit
                                                </button>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}

                        {user && user.username === username && (messages.map(message => (
                            <Card fluid key={message.id}>
                                <Card.Content>
                                    <DeleteButton clientId={id} messageId={message.id} />
                                    <Card.Header>Send by: {message.username}</Card.Header>
                                    <Card.Meta>{moment(message.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>Subject : {message.subject}</Card.Description>
                                    <Card.Description>Content : {message.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        )))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
    return clientMarkup;
}


const CREATE_MESSAGE_MUTATION = gql`
                mutation($clientId: String!, $subject: String!,$body: String!) {
                    createMessage(clientId: $clientId, subject: $subject,body:$body) {
                    id
      messages {
                    id
        subject
                body
                createdAt
                username
      }
                messageCount
    }
  }
                `;

const FETCH_CLIENT_QUERY = gql`
                query($clientId: ID!) {
                    getClient(clientId: $clientId) {
                    id
      name
                email
                createdAt
                username
                activated
                messageCount
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

export default SingleClient;