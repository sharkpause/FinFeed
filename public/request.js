function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

async function likePost(username, postID) {
	try {
		await axios.patch('/api/' + username + '/posts/' + postID + '/like', { liker: getCookie('username') });

		location.reload();
	} catch(err) {
		console.log(err);
		alert(err);a
	}
}

async function dislikePost(username, postID) {
	try {
		await axios.patch('/api/' + username + '/posts/' + postID + '/dislike', { disliker: getCookie('username') });

		location.reload();
	} catch(err) {
		console.log(err);
		alert(err);
	}
}

async function deletePost(username, postID) {
	try {
		await axios.delete('/api/' + username + '/posts/' + postID);

		location.reload();
	} catch(err) {
		if(err.response.status === 401) {
			alert('You are not authorized to delete this post');
		} else {
			alert('Something went wrong');
		}
	}
}

async function editPost(postElem, postID) {
	const mainContent = postElem.querySelector('#mainContent');

	const beforeMainContent = postElem.querySelector('#mainContent').dataset.originalContent;
	const beforeContent = postElem.querySelector('#postContent').textContent;

	mainContent.innerHTML = createEditInput(beforeContent);

	const cancelButton = mainContent.querySelector('#cancelButton');

	cancelButton.addEventListener('click', e => {
		e.preventDefault();

		mainContent.innerHTML = beforeMainContent.innerHTML;
	});
}

function createEditInput(beforeContent) {
	return `
			<form method="post">
				<div class="field is-grouped">
					<p class="control is-expanded">
						<input type="text" class="input input-transparent" id="makePostInput" value="${beforeContent}">
					</p>
					<p class="control">
						<button type="submit" class="button is-blue-color is-transparent-button">
							<span class="icon">
								<i class="fa-solid fa-check"></i>
							</span>
						</button>
						<button id="cancelButton" class="button is-blue-color is-transparent-button">
							<span class="icon">
								<i class="fa-solid fa-xmark"></i>
							</span>
						</button>
					</p>
				</div>
			</form>
			`;
}

function createMediaObject(likeCount, dislikeCount, postID) {
	return `<div class="mt-6" id="${postID}">
				<article class="media">
					<div class="media-content media-left media-background" id="mainContent">
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
					<div>
						<div class="media-right" id="deleteButtonContainer"></div>
						<div class="media-right" id="editButtonContainer"></div>
					</div>
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

			const likeButton = postElem.querySelector('#likeButton');
			likeButton.addEventListener('click', e => {
				e.preventDefault();

				if(typeof loggedUser === 'undefined') {
					return alert('You must be logged in to use this feature');
				}

				likePost(posts[i].author, posts[i]._id);
			});

			const dislikeButton = postElem.querySelector('#dislikeButton');
			dislikeButton.addEventListener('click', e => {
				e.preventDefault();

				if(typeof loggedUser === 'undefined') {
					return alert('You must be logged in to use this feature');
				}

				dislikePost(posts[i].author, posts[i]._id);
			});

			if(loggedUser === posts[i].author) {
				const deleteButtonContainer = postElem.querySelector('#deleteButtonContainer');
				deleteButtonContainer.innerHTML = '<button class="post-interact-button" id="deleteButton"><i class="fa-solid fa-trash"></i></button>';

				const deleteButton = deleteButtonContainer.querySelector('#deleteButton');
				
				deleteButton.addEventListener('click', e => {
					e.preventDefault();

					deletePost(posts[i].author, posts[i]._id);
				});

				const editButtonContainer = postElem.querySelector('#editButtonContainer');
				editButtonContainer.innerHTML = '<button class="post-interact-button" id="editButton"><i class="fa-solid fa-pen-to-square"></i></button>';

				const editButton = editButtonContainer.querySelector('#editButton');

				editButton.addEventListener('click', e => {
					e.preventDefault();
					
					editPost(postElem, posts[i]._id);
				});
			}
			
			mediaContainer.appendChild(postElem);
		}

		const makePostForm = document.getElementById('makePostForm');

		makePostForm.addEventListener('submit', async e => {
			e.preventDefault();

			if(typeof loggedUser === 'undefined') {
				return alert('You must be logged in to use this feature');
			}

			const makePostInput = document.getElementById('makePostInput');

			if(makePostInput.value.length > 300) {
				return alert('Post length exceeds 300 letter limit');
			}

			await axios.post('/api/' + getCookie('username') + '/posts', { content: makePostInput.value });

			location.reload();

			makePostForm.reset();
		});
	} catch(err) {
		console.log(err);
	}
}

getPosts();
