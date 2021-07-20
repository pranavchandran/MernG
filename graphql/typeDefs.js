const { gql } = require('apollo-server');

 
module.exports = gql`
    type Client{
        id:ID!
        name:String!
        email: String!
        createdAt:String!
        username:String!
        activated:Boolean!
        messages:[Message]!
        messageCount:Int!
    }
    type Message{
        id:ID!
        subject: String!
        username: String!
        body: String!
        createdAt: String!
    }
    type User{
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }
    input RegisterInput{
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query{
        getClients:[Client] 
        getClient(clientId: ID!): Client
    }
    type Mutation {
        register(registerInput : RegisterInput ):User!
        login(username: String!, password: String!):User!
        createClient(name: String! , email: String!): Client!
        updateClient(clientId:String, activated:Boolean!):Client
        createMessage(clientId:String!,body:String!,subject:String!):Client!
        deleteMessage(clientId:ID!,messageId: ID!):Client!
    }

`