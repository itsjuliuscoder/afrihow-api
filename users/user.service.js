const config = require('config.json');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const emailservice_1 = require('./email.service');
const User = db.User;
const Token = db.Token;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    confirmation,
    resend,
    delete: _delete
};

//authenticates / logs in users
async function authenticate({ email, password }) {
    
    //check if user exists
    const user = await User.findOne({ email });

    //make sure the user has been verified
    if (!user.isVerified) return res.status(401).send({ type: 'not-verified', msg: 'Your account has not been verified.' });

    //compare password
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '3d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

//gets all users 
async function getAll() {
    return await User.find();
}

//get user by id
async function getById(id) {
    return await User.findById(id);
}

//registers a new users
async function create(userParam) {
    // validate
    if (await User.findOne({ email: userParam.email })) {
        throw 'Email Address "' + userParam.email + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
    
    //generate a token for this new user
    const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

    // Save the verification token
    token.save(function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        // Send the email
        emailservice_1.sendMail("confirmation", user.email, token.token);
        res.status(200).send('A verification email has been sent to ' + user.email + '.');
    });
}

//confirms user email
async function confirmation(userParam){
    // Find a matching token
    Token.findOne({ token: req.body.token }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token may have expired.' });
 
        // If we found a token, find a matching user
        User.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
 
            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
}

//resends user email
async function resend(userParam){

    //Check and finds user
    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });
 
        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
 
        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            
            // Send the email
            emailservice_1.sendMail("resend", user.email, token.token);
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(200).send('A verification email has been sent to ' + user.email + '.');
        });
 
    });
}

//update user 
async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

//delete user
async function _delete(id) {
    await User.findByIdAndRemove(id);
}