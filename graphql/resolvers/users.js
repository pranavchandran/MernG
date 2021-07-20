const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators')
const { SECRET_KEY } = require('../../config')
const User = require('../../models/User');

function generateToken(user){
     return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
    }, SECRET_KEY, { expiresIn: '1h'});
}

module.exports ={
    Mutation:{
        async login(_,{ username, password }){
            const { errors,valid } = validateLoginInput(username, password);
            if(!valid){
                throw new UserInputError('Errors', { errors });
            }
            const user = await User.findOne({username});
            if(!user){
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }
            const match = await bcrypt.compare(password,user.password);
            if(!match){
                errors.general = 'Wrong Credentials';
                throw new UserInputError('Wrong Credentials', { errors });
            }

            //Creating a Token 
            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
       async register(_, { registerInput : {username,email,password,confirmPassword} } ,){

            //Validate User data
            const {valid,errors}=validateRegisterInput(username,email,password,confirmPassword);
            if(!valid){
                throw new UserInputError('Error', { errors });
            }

            // Make sure username doesnt already exist
            const user = await User.findOne({ username });
            if(user){
                throw new UserInputError('Username is already taken!',{
                    errors:{
                        username: 'This username is taken'
                    }
                })
            }

            //Encryption
            password = await bcrypt.hash(password, 12);

            //Creating New User
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            //Saving...
            const res = await newUser.save();

            //Creating new Token
            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
};