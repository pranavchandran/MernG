const { UserInputError, AuthenticationError } = require('apollo-server');
const Client = require('../../models/Clients');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Mutation:{
        createMessage: async (_,{clientId,subject,body}, context) =>{
            const { username } =checkAuth(context);

            if(subject.trim() ===''){
                throw new UserInputError('Empty Subject',{
                    errors:{
                        body:'Message Subject must not empty'
                    }
                })
            }

            if(body.trim() ===''){
                throw new UserInputError('Empty Message',{
                    errors:{
                        body:'Message body must not empty'
                    }
                })
            }


            const client = await Client.findById(clientId);

            if(client){
                client.messages.unshift({
                    subject,
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await client.save();
                return client
            }else throw new UserInputError("Client Not found")
        },
        deleteMessage: async (_,{clientId,messageId},context) =>{
            const {username} = checkAuth(context);
            
            const client = await Client.findById(clientId);
            

            if(client){
                const messageIndex = client.messages.findIndex(m => m.id === messageId);
                if(client.messages[messageIndex].username === username){
                    client.messages.splice(messageIndex,1); 
                    await client.save();
                    return client;
                }else{
                    throw new AuthenticationError('Action not Allowed')
                }
            }else{
                throw new UserInputError('User not Found')
            }
        }
    }
}