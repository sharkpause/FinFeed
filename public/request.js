function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

async function likePost(username, postID) {
	const result = await axios.patch(`/api/${username}/posts/${postID}/like`, { liker: getCookie('username') });
	alert(result);
}

function createMediaObject(likeCount, postID) {
	return `<div class="media-margin" id="${postID}">
				<article class="media">
					<div class="media-content media-left media-background">
						<div class="content">
							<p class="is-white-text" id="mediaContent">
								<strong class="is-white-text mr-2" id="displayName"></strong><small id="username">@</small>
								<br>
								<span id="postContent"></span>
							</p>
						</div>
						<nav class="level is-mobile">
							<div class="level-left">
								<a class="level-item">
									<span class="icon is-small"><i class="fas fa-comment"></i></span>
								</a>
								<a class="level-item" id="likeButton">
									<span class="icon is-small"><i class="fas fa-thumbs-up"></i>&nbsp;${likeCount}</span>
								</a>
							</div>
						</nav>
					</div>
				</article>
			</div>`
}

async function getPosts() {
	try {
		const posts = (await axios.get('/api/posts')).data.posts;

		const mediaContainer = document.getElementById('mediaContainer');

		for(let i = 0; i < posts.length; ++i) {
			mediaContainer.innerHTML += createMediaObject(posts[i].likes.count, posts[i]._id);

			// check if logged in
			const post = document.getElementById(posts[i]._id);

			const mediaContent = post.querySelector('#mediaContent');

			const displayName = mediaContent.querySelector('#displayName');
			displayName.textContent = posts[i].authorDisplay;

			const username = mediaContent.querySelector('#username');
			username.textContent += posts[i].author;

			const postContent = mediaContent.querySelector('#postContent');
			postContent.textContent = posts[i].content;

			const likeButton = post.querySelector('#likeButton');

			likeButton.addEventListener('click', e => {
				e.preventDefault();
				likePost(getCookie('username'), posts[i]._id);
			});
		}
	} catch(err) {
		console.log(err);
	}
}

getPosts();
