require('express-async-errors');

const express = require('express');
const app = express();

const rateLimiter = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { StatusCodes } = require('http-status-codes');

const path = require('path');

const connect = require('./db/connect');

const signup = require('./routes/signup');
const login = require('./routes/login');
const posts = require('./routes/posts');
const comments = require('./routes/comments');
const accounts = require('./routes/accounts');
const accountProfile = require('./routes/accountProfile');

const { getHomePosts } = require('./controllers/posts');

require('dotenv').config();

app.set('trust proxy', 1);

app.use([express.json(), express.urlencoded({ extended: true }), express.static('public'), cookieParser()]);

app.use('/api/signup', [signup, rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })]
);
app.use('/api/login', login);
app.use('/api/posts', getHomePosts);
app.use('/api/user', accounts);
app.use('/api/:username/posts', posts);
app.use('/api/:username/posts/:postID/comments', comments);

app.use('/:username', accountProfile);

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		//console.log(await connect(process.env.MONGO_URI)); // Connect to online database
		console.log(await connect('mongodb://127.0.0.1/finfeed')); // Connect to local database
		app.listen(PORT, () => {
			console.log('Server listening on port ' + PORT);
		});
	} catch(err) {
		console.log(err);
	}
}

start();
