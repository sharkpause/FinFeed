require('express-async-errors');

const express = require('express');
const app = express();

const connect = require('./db/connect');

const signup = require('./routes/signup');
const login = require('./routes/login');
const posts = require('./routes/posts');
const comments = require('./routes/comments');

require('dotenv').config();

app.use([express.json(), express.urlencoded({ extended: true })]);

app.use('/', [posts, comments]);
app.use('/signup', signup);
app.use('/login', login);

app.get('/', (req, res) => {
	res.send('Hello');
});

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		console.log(await connect(process.env.MONGO_URI));
		app.listen(PORT, () => {
			console.log('Server listening on port ' + PORT);
		});
	} catch(err) {
		console.log(err);
	}
}

start();

// TODO:
// 		- Sign up add security measure to prevent spammers
// 		- Edit account
// 		- Account profile: - display name, bio, account creation date
// 		- Delete Account: also deletes all posts and comments made from user
