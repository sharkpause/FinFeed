const mongoose = require('mongoose');

async function connect(url) {
	mongoose.connect(url, {
		useNewUrlParser: true
	});
}

module.exports = connect;
