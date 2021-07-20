const clientsResolvers = require('./clients');
const usersResolvers = require('./users');
const messagesResolvers = require('./messages');

module.exports ={
    Client:{
        messageCount:(parent) => parent.messages.length
    },
    Query: {
    ...clientsResolvers.Query
    },
    Mutation:{
        ...usersResolvers.Mutation,
        ...clientsResolvers.Mutation,
        ...messagesResolvers.Mutation,
    },
}
