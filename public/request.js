async function getPosts() {
	try {
		const posts = (await axios.get('/api/posts'));

		console.log(posts);
	} catch(err) {
		console.log(err);
	}
}

getPosts();
