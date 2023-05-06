function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

async function likePost(username, postID) {
	try {
		await axios.patch('/api/' + username + '/posts/' + postID + '/like', { liker: getCookie('username') });

		alert('Liked');
	} catch(err) {
		console.log(err);
		alert(err);
	}
}

async function dislikePost(username, postID) {
	try {
		await axios.patch('/api/' + username + '/posts/' + postID + '/dislike', { disliker: getCookie('username') });

		alert('Disliked');
	} catch(err) {
		console.log(err);
		alert(err);
	}
}

async function deletePost(username, postID) {
	try {
		await axios.delete('/api/' + username + '/posts/' + postID);

		alert('Deleted');
	} catch(err) {
		if(err.response.status === 401) {
			alert('You are not authorized to delete this post');
		}
	}
}

function createMediaObject(likeCount, dislikeCount, postID) {
	return `<div class="mt-6" id="${postID}">
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
							<div class="level-left columns is-variable is-2">
								<a class="level-item column">
									<span class="icon is-small"><i class="fas fa-comment"></i></span>
								</a>
								<a class="level-item column" id="likeButton">
									<span class="icon is-small"><i class="fas fa-thumbs-up"></i>&nbsp;${likeCount}</span>
								</a>
								<a class="level-item column" id="dislikeButton">
									<span class="icon is-small"><i class="fas fa-thumbs-down"></i>&nbsp;${dislikeCount}</span>
								</a>
							</div>
						</nav>
					</div>
					<div class="media-right" id="deleteButtonContainer"></div>
				</article>
			</div>`
}

async function getPosts() {
	try {
		const posts = (await axios.get('/api/posts')).data.posts;

		const mediaContainer = document.getElementById('mediaContainer');

		for(let i = 0; i < posts.length; ++i) {
			const postElem = document.createElement('div');
			postElem.innerHTML = createMediaObject(posts[i].likes.count, posts[i].dislikes.count, posts[i]._id);
			
			// check if logged in
			const mediaContent = postElem.querySelector('#mediaContent');
			
			const displayName = mediaContent.querySelector('#displayName');
			displayName.textContent = posts[i].authorDisplay;
			
			const username = mediaContent.querySelector('#username');
			username.textContent += posts[i].author;
			
			const postContent = mediaContent.querySelector('#postContent');
			postContent.textContent = posts[i].content;

			const loggedUser = getCookie('username');

			if(loggedUser) {
				const likeButton = postElem.querySelector('#likeButton');
				likeButton.addEventListener('click', e => {
					e.preventDefault();

					likePost(posts[i].author, posts[i]._id);
				});

				const dislikeButton = postElem.querySelector('#dislikeButton');
				dislikeButton.addEventListener('click', e => {
					e.preventDefault();

					dislikePost(posts[i].author, posts[i]._id);
				});

				if(loggedUser === posts[i].author) {
					const deleteButtonContainer = postElem.querySelector('#deleteButtonContainer');
					deleteButtonContainer.innerHTML = '<button class="delete" id="deleteButton"></button>';

					const deleteButton = deleteButtonContainer.querySelector('#deleteButton');
					
					deleteButton.addEventListener('click', e => {
						e.preventDefault();

						deletePost(posts[i].author, posts[i]._id);
					});
				}
			}
			
			mediaContainer.appendChild(postElem);
		}

		const makePostForm = document.getElementById('makePostForm');

		makePostForm.addEventListener('submit', async e => {
			e.preventDefault();

			const makePostInput = document.getElementById('makePostInput');
			await axios.post('/api/' + getCookie('username') + '/posts', { content: makePostInput.value });

			location.reload();

			makePostForm.reset();
		});
	} catch(err) {
		console.log(err);
	}
}

getPosts();
