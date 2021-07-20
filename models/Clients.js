const { model , Schema } = require('mongoose');

const ClientSchema = new Schema({
    name: String,
    username: String,
    email: String,
    createdAt:String,
    activated: Boolean,
    messages:[
        {
          subject: String,
          body: String,
          username: String,
          createdAt: String,
        }
    ],
    user:{
        type: Schema.Types.ObjectId,
        ref:'users',
    }
});

module.exports = model('Client', ClientSchema);