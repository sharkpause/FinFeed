async function likePost(username, postID) {
	try {
		await axios.patch('/api/' + username + '/posts/' + postID + '/like', { liker: loggedUser });

		location.reload();
	} catch(err) {
		console.log(err);
		alert('Something went wrong');
	}
}

async function likeComment(username, postID, commentID) {
	try {
		await axios.patch('/api/' + username + '/posts/' + postID + '/comments/' + commentID + '/like', { liker: loggedUser });

		location.reload();
	} catch(err) {
		console.log(err);
		alert('Something went wrong');
	}
}

async function dislikePost(username, postID) {
	try {
		await axios.patch('/api/' + username + '/posts/' + postID + '/dislike', { disliker: loggedUser });

		location.reload();
	} catch(err) {
		console.log(err);
		alert('Something went wrong');
	}
}

async function dislikeComment(username, postID, commentID) {
	try {
		await axios.patch('/api/' + username + '/posts/' + postID + '/comments/' + commentID + '/dislike', { disliker: loggedUser });

		location.reload();
	} catch(err) {
		console.log(err);
		alert('Something went wrong');
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
			console.log(err);
			alert('Something went wrong');
		}
	}
}

async function deleteComment(username, postID, commentID) {
	try {
		await axios.delete('/api/' + username + '/posts/' + postID + '/comments/' + commentID);

		location.reload();
	} catch(err) {
		if(err.response.status === 401) {
			alert('You are not authorized to delete this post');
		} else {
			console.log(err);
			alert('Something went wrong');
		}
	}
}

function editPost(postElem, postAuthor, postID) {
	const mainContent = postElem.querySelector('#mainContent');

	const beforeHTML = mainContent.innerHTML;
	const beforeContent = postElem.querySelector('#postContent').textContent;

	mainContent.innerHTML = createEditInput(beforeContent);

	const editPostInput = mainContent.querySelector('#editPostInput');
	autoGrow(editPostInput);
	autoGrow(editPostInput);

	const cancelButton = mainContent.querySelector('#cancelButton');
	cancelButton.addEventListener('click', e => {
		e.preventDefault();

		mainContent.innerHTML = beforeHTML;

		const dropdownTrigger = mainContent.querySelector('.dropdown-trigger');
		dropdownTrigger.innerHTML = '';
		dropdownTrigger.outerHTML = '';

		const dropdownMenu = mainContent.querySelector('.dropdown-menu');
		dropdownMenu.innerHTML = '';
		dropdownMenu.outerHTML = '';

		addPostInteractButtons(postElem, postAuthor, postID);
		addCommentButton(postElem, postAuthor, postID);
	});

	const editForm = mainContent.querySelector('#editForm');
	editForm.addEventListener('submit', async e => {
		e.preventDefault();

		try {
			await axios.patch('/api/' + loggedUser + '/posts/' + postID, { content: editPostInput.value });

			location.reload();
		} catch(err) {
			console.log(err);
			alert(err);
		}
	});
}

function editComment(commentElem, postAuthor, postID, commentID) {
	const mainContent = commentElem.querySelector('#mainContent');

	const beforeHTML = mainContent.innerHTML;
	const beforeContent = commentElem.querySelector('#commentContent').textContent;

	mainContent.innerHTML = createEditInput(beforeContent);

	const cancelButton = mainContent.querySelector('#cancelButton');
	cancelButton.addEventListener('click', e => {
		e.preventDefault();

		mainContent.innerHTML = beforeHTML;

		addCommentInteractButtons(commentElem, postAuthor, postID, commentID);
		addCommentLikeDislike(commentElem, postAuthor, postID, commentID);
	});

	const editForm = mainContent.querySelector('#editForm');
	editForm.addEventListener('submit', async e => {
		e.preventDefault();

		const editValue = mainContent.querySelector('#editPostInput').value;

		try {
			await axios.patch('/api/' + loggedUser + '/posts/' + postID + '/comments/' + commentID, { content: editValue });

			location.reload();
		} catch(err) {
			console.log(err);
			alert(err);
		}
	});
}

function createEditInput(beforeContent) {
	return `
			<form method="post" id="editForm">
				<div class="field is-grouped">
					<p class="control is-expanded">
						<textarea class="input input-transparent auto-resize-textarea" id="editPostInput" wrap="soft" maxlength="1000" type="text" oninput="autoGrow(this)">${beforeContent}</textarea>
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
					<div class="media-content media-background visible-overflow" id="mainContent">
						<div class="content">
							<p class="is-white-text" id="mediaContent">
								<strong class="is-white-text mr-2" id="displayName"></strong><a id="username">@</a>
								
								<span class="dropdown is-right is-pulled-right" id="postMenu">
								</span>

								<span class="is-pulled-right is-gray-color mr-3" id="editedText"></span>
								<br>
								<span id="postContent" class="is-white-text"></span>
							</p>
						</div>
						<nav class="level is-mobile">
							<div class="level-left columns is-variable is-2">
								<a class="level-item column" id="commentButton">
									<span class="icon is-small"><i class="fas fa-comment"></i></span>
								</a>
								<a class="level-item column" id="likeButton">
									<span class="icon is-small"><i class="fas fa-thumbs-up mr-1"></i>${likeCount}</span>
								</a>
								<a class="level-item column" id="dislikeButton">
									<span class="icon is-small"><i class="fas fa-thumbs-down mr-1"></i>${dislikeCount}</span>
								</a>
							</div>
						</nav>
					</div>
				</article>
				<div id="underMedia"></div>
			</div>`
}

function createCommentObject(likeCount, dislikeCount, commentID) {
return `<div class="mt-6" id="${commentID}">
			<article class="media">
				<div class="media-content media-background" id="mainContent">
					<div class="content">
						<p class="is-white-text" id="mediaContent">
							<strong class="is-white-text mr-2" id="displayName"></strong><a id="username">@</a>
							<span class="is-pulled-right" id="deleteButtonContainer"></span>
							<span class="is-pulled-right" id="editButtonContainer"></span>
							<span class="is-pulled-right is-gray-color" id="editedText"></span>
							<br>
							<span id="commentContent"></span>
						</p>
					</div>
					<nav class="level is-mobile">
						<div class="level-left columns is-variable is-2 ml-0">
							<a class="level-item column" id="likeButton">
								<span class="icon is-small"><i class="fas fa-thumbs-up mr-1"></i>${likeCount}</span>
							</a>
							<a class="level-item column" id="dislikeButton">
								<span class="icon is-small"><i class="fas fa-thumbs-down mr-1"></i>${dislikeCount}</span>
							</a>
						</div>
					</nav>
				</div>
			</article>
			<div id="underMedia"></div>
		</div>`
}

function addPostInteractButtons(postElem, postAuthor, postID) {
	postElem.querySelector('#postMenu').innerHTML = `
		<span class="dropdown-trigger">
			<button class="button transparent-dropdown-trigger" aria-haspopup="true" aria-controls="dropdown-menu">
				<i class="fa-solid fa-ellipsis-vertical"></i>
			</button>
		</span>
		
		<span class="dropdown-menu dropdown-menu-background" id="dropdown-menu" role="menu">
			<span class="dropdown-content">
				<span class="dropdown-item" id="editButtonContainer"></span>
				<span class="dropdown-item" id="deleteButtonContainer"></span>
			</span>
		</span>`;
	
	const dropdown = postElem.querySelector('.dropdown');
	dropdown.addEventListener('click', e => {
		e.preventDefault();

		dropdown.classList.toggle('is-active');
	});

	const deleteButtonContainer = postElem.querySelector('#deleteButtonContainer');
	deleteButtonContainer.innerHTML = '<button class="post-interact-button dropdown-item-big" id="deleteButton"><i class="fa-solid fa-trash mr-1"></i>Delete Post</button>';

	const deleteButton = deleteButtonContainer.querySelector('#deleteButton');
	
	deleteButton.addEventListener('click', e => {
		e.preventDefault();

		const underMedia = postElem.querySelector('#underMedia');
		underMedia.classList.add('delete-confirmation', 'is-white-text');
		underMedia.innerHTML = `Are you sure you want to delete this post?
			<div>
				<button id="confirmButton" class="is-white-text is-completely-transparent-button mr-6">
						<i class="fa-solid fa-check mr-1"></i>
						Yes
				</button>
				<button id="cancelButton" class="is-white-text is-completely-transparent-button">
						<i class="fa-solid fa-xmark mr-1"></i>
						No
				</button>
			</div>`;

		const confirmButton = underMedia.querySelector('#confirmButton');
		const cancelButton = underMedia.querySelector('#cancelButton');

		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
			confirmButton.classList.add('button');
			confirmButton.classList.add('is-danger');

			cancelButton.classList.add('button');
			cancelButton.classList.add('is-danger');
		} else {
			confirmButton.classList.add('clickable-button');
			cancelButton.classList.add('clickable-button');
		}

		confirmButton.addEventListener('click', e => {
			e.preventDefault();

			deletePost(postAuthor, postID);
		});

		cancelButton.addEventListener('click', e => {
			e.preventDefault();

			underMedia.innerHTML = '';
			underMedia.classList.remove('delete-confirmation');
		});
	});

	const editButtonContainer = postElem.querySelector('#editButtonContainer');
	editButtonContainer.innerHTML = '<button class="post-interact-button dropdown-item-big mb-1" id="editButton"><i class="fa-solid fa-pen-to-square mr-1"></i>Edit Post</button>';

	const editButton = editButtonContainer.querySelector('#editButton');

	editButton.addEventListener('click', e => {
		e.preventDefault();
		
		editPost(postElem, postAuthor, postID);
	});
}

function addCommentInteractButtons(commentElem, postAuthor, postID, commentID) {
	const deleteButtonContainer = commentElem.querySelector('#deleteButtonContainer');
	deleteButtonContainer.innerHTML = '<button class="post-interact-button" id="deleteButton"><i class="fa-solid fa-trash"></i></button>';

	const deleteButton = deleteButtonContainer.querySelector('#deleteButton');
	
	deleteButton.addEventListener('click', e => {
		e.preventDefault();

		const underMedia = commentElem.querySelector('#underMedia');
		underMedia.classList.add('delete-confirmation', 'is-white-text');
		underMedia.innerHTML = `Are you sure you want to delete this comment?
			<span class="is-pulled-right">
				<button id="confirmButton" class="is-white-text is-completely-transparent-button clickable-button mr-6">
						<i class="fa-solid fa-check mr-1"></i>
						Yes
				</button>
				<button id="cancelButton" class="is-white-text is-completely-transparent-button clickable-button">
						<i class="fa-solid fa-xmark mr-1"></i>
						No
				</button>
			</span>`;

		underMedia.querySelector('#confirmButton').addEventListener('click', e => {
			e.preventDefault();

			deleteComment(postAuthor, postID, commentID);
		});

		underMedia.querySelector('#cancelButton').addEventListener('click', e => {
			e.preventDefault();

			underMedia.innerHTML = '';
			underMedia.classList.remove('delete-confirmation');
		});
	});

	const editButtonContainer = commentElem.querySelector('#editButtonContainer');
	editButtonContainer.innerHTML = '<button class="post-interact-button" id="editButton"><i class="fa-solid fa-pen-to-square"></i></button>';

	const editButton = editButtonContainer.querySelector('#editButton');

	editButton.addEventListener('click', e => {
		e.preventDefault();

		editComment(commentElem, postAuthor, postID, commentID);
	});
}

async function getPosts() {
	try {
		const url = window.location.href;
		let posts;

		if(/^.+\/\w+$/.test(url)) {
			let username = url.split('/');
			username = url.lastIndexOf('/') !== url.length - 1
				? username[username.length - 1]
				: username[username.length - 2];

			posts = (await axios.get('/api/' + username + '/posts')).data.posts;
		} else {
			posts = (await axios.get('/api/posts')).data.posts;
		}

		const mediaContainer = document.getElementById('mediaContainer');

		for(let i = 0; i < posts.length; ++i) {
			const postElem = document.createElement('div');
			postElem.innerHTML = createMediaObject(posts[i].likes.count, posts[i].dislikes.count, posts[i]._id);

			const postAuthor = posts[i].author;
			const posterDisplayName = posts[i].authorDisplay;
			const postID = posts[i]._id;

			const mediaContent = postElem.querySelector('#mediaContent');
			
			const displayName = mediaContent.querySelector('#displayName');
			displayName.textContent = posterDisplayName;
			
			const username = mediaContent.querySelector('#username');
			username.textContent += postAuthor;
			username.href = '/' + postAuthor;
			
			const postContent = postElem.querySelector('#postContent');
			postContent.textContent = posts[i].content;

			if(posts[i].edited === true) {
				const editedText = postElem.querySelector('#editedText');
				editedText.textContent = '(edited)';

				if(loggedUser === postAuthor) {
					editedText.classList.add('mr-6');
				}
			}

			const likeButton = postElem.querySelector('#likeButton');
			likeButton.addEventListener('click', e => {
				e.preventDefault();

				if(typeof loggedUser === 'undefined') {
					return alert('You must be logged in to use this feature');
				}

				likePost(postAuthor, postID);
			});

			const dislikeButton = postElem.querySelector('#dislikeButton');
			dislikeButton.addEventListener('click', e => {
				e.preventDefault();

				if(typeof loggedUser === 'undefined') {
					return alert('You must be logged in to use this feature');
				}

				dislikePost(postAuthor, postID);
			});

			addCommentButton(postElem, postAuthor, postID);

			if(loggedUser === postAuthor) {
				addPostInteractButtons(postElem, postAuthor, postID);
			}
			
			mediaContainer.appendChild(postElem);
		}

		const makePostForm = document.getElementById('makePostForm');

		if(makePostForm) {
			makePostForm.addEventListener('submit', async e => {
				e.preventDefault();

				if(typeof loggedUser === 'undefined') {
					return alert('You must be logged in to use this feature');
				}

				const makePostInput = document.getElementById('makePostInput');

				if(makePostInput.value.length > 1000) {
					return alert('Post length exceeds 1000 letter limit');
				}

				await axios.post('/api/' + loggedUser + '/posts', { content: makePostInput.value });

				location.reload();

				makePostForm.reset();
			});
		}
	} catch(err) {
		console.log(err);
	}
}

function addCommentButton(postElem, postAuthor, postID) {
	const commentButton = postElem.querySelector('#commentButton');
	commentButton.addEventListener('click', async e => {
		e.preventDefault();

		if(typeof loggedUser === 'undefined') {
			return alert('You must be logged into use this feature');
		}

		const underMedia = postElem.querySelector('#underMedia');

		if(underMedia.innerHTML === '') {
			underMedia.innerHTML = `
				<div class="media-background">
					<form method="post" id="commentForm">
						<div class="field is-grouped">
							<p class="control is-expanded">
								<input class="input input-transparent" placeholder="What do you think about this post?" id="commentInput">
							</p>
							<p class="control">
								<button type="submit" class="button is-blue-color is-transparent-button">
									<span class="icon">
										<i class="fas fa-paper-plane"></i>
									</span>
								</button>
							</p>
						</div>
					</form>
					<div id="commentSection">
					</div>
				</div>
			`;

			const commentForm = underMedia.querySelector('#commentForm');
			commentForm.addEventListener('submit', async e => {
				e.preventDefault();

				const commentInput = commentForm.querySelector('#commentInput').value;
				if(commentInput.length > 0) {
					try {
						await axios.post('/api/' + postAuthor + '/posts/' + postID + '/comments', { commentator: loggedUser, content: commentInput });

						location.reload();
					} catch(err) {
						alert('Something went wrong');
						console.log(err);
					}
				}
			});


			const comments = (await axios.get('/api/' + postAuthor + '/posts/' + postID + '/comments')).data.comments; 

			const commentSection = underMedia.querySelector('#commentSection');

			for(let i = 0; i < comments.length; ++i) {
				const commentElem = document.createElement('div');
				commentElem.innerHTML = createCommentObject(comments[i].likes.count, comments[i].dislikes.count, comments[i]._id);

				const displayNameComment = commentElem.querySelector('#displayName');
				displayNameComment.textContent = comments[i].authorDisplay;

				const usernameComment = commentElem.querySelector('#username');
				usernameComment.textContent = '@' + comments[i].author;
				usernameComment.href = '/' + comments[i].author;

				const contentComment = commentElem.querySelector('#commentContent');
				contentComment.textContent = comments[i].content;
				
				if(comments[i].edited === true) {
					const editedText = commentElem.querySelector('#editedText');
					editedText.textContent = '(edited)';

					if(loggedUser === postAuthor) {
						editedText.classList.add('mr-6');
					}
				}

				addCommentLikeDislike(commentElem, postAuthor, postID, comments[i]._id);

				addCommentInteractButtons(commentElem, postAuthor, postID, comments[i]._id);

				commentSection.appendChild(commentElem);
			}
		} else {
			underMedia.classList.remove('delete-confirmation');
			underMedia.classList.remove('is-white-text');
			underMedia.innerHTML = '';
		}
	});
}

function addCommentLikeDislike(commentElem, postAuthor, postID, commentID) {
	commentElem.querySelector('#likeButton').addEventListener('click', e => {
		e.preventDefault();

		if(typeof loggedUser === 'undefined') {
			return alert('You must be logged in to use this feature');
		}

		likeComment(postAuthor, postID, commentID);
	});

	commentElem.querySelector('#dislikeButton').addEventListener('click', e => {
		e.preventDefault();

		if(typeof loggedUser === 'undefined') {
			return alert('You must be logged in to use this feature');
		}

		dislikeComment(postAuthor, postID, commentID);
	});
}

function autoGrow(element) {
	element.style.height = '5px';
	element.style.height = (element.scrollHeight) + 'px';
}

getPosts();
