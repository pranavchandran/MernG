const { AuthenticationError } = require('apollo-server');

const Client = require('../../models/Clients');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query:{
        async getClients(){
            try{
                const client = await Client.find().sort({createdAt:-1});
                return client;
            }catch(err){
                throw new Error(err);
            }
        },
        async getClient(_,{ clientId }){
            try{
                const client = await Client.findById(clientId);
                if(client){
                    return client;
                }else{
                    throw new Error('Client not found')
                }
            }catch(err){
                throw new Error(err)
            }
        }
    },
    Mutation:{
        async createClient(_, { name , email }, context ){
            const user = checkAuth(context)

            if(name.trim() === ''){
                throw new Error('Client Name must  not be empty')
            }
            if(email.trim() === ''){
                throw new Error('Client Email must  not be empty')
            }
            const newClient = new Client({
                name,
                email,
                activated: true,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString() 

            });
            const client = await newClient.save();
            
            // context.client.publish('New_CLIENT',{
            //      newClient: client
            // })
            return client
        },
        async updateClient(_, { clientId, activated }, context){
            const user = checkAuth(context);

            try{
                const client = await Client.findById(clientId)
    

                if (user.username === client.username){

                    const  client= await Client.findByIdAndUpdate(clientId,{activated:activated},{new : true});
                    return client
                    
                }else{
                    throw new AuthenticationError('Action not allowed');
                }
            }catch(err){
                throw new Error(err);
            }
        }       
    },
    // Subscription:{
    //     newClient:{
    //         subscribe:(_,__,{pubsub}) => pubsub.AsyncIterator('New_CLIENT')
    //     }
    // }
}