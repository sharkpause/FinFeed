require('express-async-errors');

const express = require('express');
const app = express();

const rateLimiter = require('express-rate-limit');
const { StatusCodes } = require('http-status-codes');

const path = require('path');

const connect = require('./db/connect');

const signup = require('./routes/signup');
const login = require('./routes/login');
const posts = require('./routes/posts');
const comments = require('./routes/comments');
const accounts = require('./routes/accounts');

require('dotenv').config();

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

app.use([express.json(), express.urlencoded({ extended: true })]);

app.use(express.static('public'));

app.use('/api/signup', signup);
app.use('/api/login', login);
app.use('/api/:username', accounts);
app.use('/api/:username/posts', posts);
app.use('/api/:username/posts/:postID/comments', comments);

app.get('/', (req, res) => {
	res.status(StatusCodes.OK).sendFile(path.resolve(__dirname, 'public', 'home', 'index.html'));
});

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		//console.log(await connect(process.env.MONGO_URI));
		console.log(await connect('mongodb://127.0.0.1/finfeed'));
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
