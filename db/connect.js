const mongoose = require('mongoose');

async function connect(url) {
	return mongoose.connect(url, {
		useNewUrlParser: true
	});
}

module.exports = connect;
