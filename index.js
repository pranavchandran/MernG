const { ApolloServer  } = require('apollo-server');
const mongoose = require('mongoose');  
// const  { PubSub } = require('graphql-subscriptions');

 
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const{ MONGODB } = require('./config');

// const pubsub = new PubSub()

const PORT = process.env.port || 5000;
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:( {req} ) =>({ req })
});

mongoose.connect(MONGODB,{useUnifiedTopology: true, useNewUrlParser: true}).then(()=>{
    console.log("MongoDB Connected");
}).catch(err => {
    console.error(err)
})
server.listen({ port: PORT }).then(res => {
    console.log(`Server running at ${res.url}`)
    
})