const usernameSection = document.getElementById('usernameSection');
const displayNameSection = document.getElementById('displayNameSection');
const bioSection = document.getElementById('bioSection');
const followCount = document.getElementById('followCount');
const numPosts = document.getElementById('numPosts');
const mainUserInfo = document.getElementById('mainUserInfo');
const profileSection = document.getElementById('profileSection');

let username;

let beforeDisplayName;
let beforeBioSection;

async function setInfo() {
	try {
		const usernameURL = getLastPart(window.location.href);

		const user = (await axios.get('/api/' + usernameURL)).data;
		
		usernameSection.textContent += user.user.username;
		displayNameSection.textContent = user.user.displayName;
		bioSection.textContent = user.user.bio;
		followCount.textContent = user.user.follows.count;
		numPosts.textContent = user.numPosts;

		if(getCookie('username') === user.user.username) {
			const deleteButtonContainer = document.getElementById('deleteButtonContainer');
			const editButtonContainer = document.getElementById('editButtonContainer');

			username = user.user.username;

			addAccountInteractButtons(editButtonContainer, deleteButtonContainer);
		}

		
	} catch(err) {
		if(err.response) {
			if(err.response.status === 404) {
				displayNameSection.textContent = 'User does not exist';
				displayNameSection.classList.add('is-red-color');
				usernameSection.textContent = 'Error 404';
				bioSection.textContent = 'Please check the url if the username is mispelled';
			} else {
				alert('Something went wrong');
				console.log(err);
			}
		} else {
			alert('Something went wrong');
			console.log(err);
		}
	}
}

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

function getLastPart(url) {
	const parts = url.split('/');
	return (url.lastIndexOf('/') !== url.length - 1
	  ? parts[parts.length - 1]
	  : parts[parts.length - 2]);
}

function addAccountInteractButtons(editButtonContainer, deleteButtonContainer) {
	deleteButtonContainer.innerHTML = '<button class="post-interact-button subtitle is-white-text ml-3" id="deleteButton"><i class="fa-solid fa-trash"></i>&nbsp;Delete account</button>';

	const deleteButton = profileSection.querySelector('#deleteButton');
	
	deleteButton.addEventListener('click', e => {
		e.preventDefault();

		const deleteConfirmation = profileSection.querySelector('#deleteConfirmation');

		deleteConfirmation.classList.add('delete-confirmation', 'is-white-text');
		deleteConfirmation.innerHTML = `Are you sure you want to delete your account?
			<span class="is-pulled-right">
				<button id="confirmButton" class="is-white-text is-transparent-button clickable-button mr-2">
						<i class="fa-solid fa-check"></i>
						Yes
				</button>
				<button id="cancelButton" class="is-white-text is-transparent-button clickable-button">
						<i class="fa-solid fa-xmark"></i>
						No
				</button>
			</span>`;

		deleteConfirmation.querySelector('#confirmButton').addEventListener('click', e => {
			e.preventDefault();

			deleteAccount();
		});

		deleteConfirmation.querySelector('#cancelButton').addEventListener('click', e => {
			e.preventDefault();

			deleteConfirmation.innerHTML = '';
			deleteConfirmation.classList.remove('delete-confirmation');
		});
	});

	editButtonContainer.innerHTML = '<button class="post-interact-button subtitle is-white-text" id="editButton"><i class="fa-solid fa-pen-to-square"></i>&nbsp;Edit account</button>';
	const editButton = profileSection.querySelector('#editButton');

	editButton.addEventListener('click', e => {
		e.preventDefault();

		editAccount(editButtonContainer, deleteButtonContainer);
	});
}

async function deleteAccount() {
	try {
		await axios.delete('/api/' + username);

		const cookies = document.cookie.split(";");

		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i];
			const eqPos = cookie.indexOf("=");
			const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}

		location.reload();
	} catch(err) {
		if(err.response) {
			if(err.response.status === 401) {
				alert('You are not authorized to delete this account');
			}
		}

		console.log(err);
	}
}

function editAccount() {
	const beforeProfileSection = profileSection.innerHTML;

	const displayNameSection = profileSection.querySelector('#displayNameSection');
	const usernameSection = profileSection.querySelector('#usernameSection');
	const editButtonContainer = profileSection.querySelector('#editButtonContainer');
	const deleteButtonContainer = profileSection.querySelector('#deleteButtonContainer');
	const followAndNumPosts = profileSection.querySelector('#followAndNumPosts');

	beforeDisplayName = displayNameSection.textContent;
	beforeUsername = usernameSection.textContent.slice(1);
	beforeBioSection = bioSection.textContent;

	editButtonContainer.innerHTML = '';
	deleteButtonContainer.innerHTML = '';

	followAndNumPosts.innerHTML = '';

	profileSection.innerHTML = `

	<div>
		<strong class="title is-white-text">Edit account information</strong>

		<form id="editForm" method="post">
			<div class="field mt-6">

				<label class="label is-light-white-color">Display name</label>
				<input class="input input-transparent" placeholder="Display name" type="text" value="${displayNameSection.textContent}" id="displayNameInput">

				<label class="label is-light-white-color mt-5">Bio</label>
				<input class="input input-transparent" placeholder="Bio" type="text" value="${bioSection.textContent}" id="bioInput">

				<label class="label is-light-white-color mt-5">Password</label>
				<input class="input input-transparent" type="password" placeholder="Password (leave empty to not change)" id="passwordInput">

				<label class="label is-light-white-color mt-5">Confirm Password</label>
				<input class="input input-transparent" type="password" placeholder="Confirm password (this input will only function if the password input above is filled)" id="confirmPasswordInput"">
				<p id="passwordError"></p>

				<p class="control mt-6">
					<button type="submit" class="button is-blue-color is-transparent-button mr-2">
						<span class="icon mr-2">
							<i class="fa-solid fa-check"></i>
						</span>
						Confirm and edit account info
					</button>
					<button id="cancelButton" class="button is-blue-color is-transparent-button">
						<span class="icon mr-2">
							<i class="fa-solid fa-xmark"></i>
						</span>
						Cancel
					</button>
				</p>

			</div>
		</form>
	</div>`;

	const cancelButton = document.getElementById('cancelButton');
	cancelButton.addEventListener('click', e => {
		e.preventDefault();

		profileSection.innerHTML = beforeProfileSection;

		addAccountInteractButtons(editButtonContainer, deleteButtonContainer);
	});

	const editForm = profileSection.querySelector('#editForm');
	editForm.addEventListener('submit', async e => {
		e.preventDefault();

		const newDisplayName = editForm.querySelector('#displayNameInput').value;
		const newBio = editForm.querySelector('#bioInput').value;
		
		const newPassword = editForm.querySelector('#passwordInput').value;

		const requestBody = {};

		if(beforeDisplayName !== newDisplayName) {
			requestBody.displayName = newDisplayName;
		}
		if(beforeBioSection !== newBio) {
			requestBody.bio = newBio;
		}

		if(newPassword.length > 0) {
			const confirmPassword = editForm.querySelector('#confirmPasswordInput');

			if(newPassword === confirmPassword.value) {
				requestBody.password = newPassword;
			} else {
				confirmPassword.classList.add('input-error');

				const passwordError = editForm.querySelector('#passwordError');
				passwordError.classList.add('is-red-color');
				return passwordError.textContent = 'Password does not match, please try again';
			}
		}

		try {
			await axios.patch('/api/' + username, requestBody);
			location.reload();
		} catch(err) {
			alert('Something went wrong');
			console.log(err);
		}
	});
}

const loggedUser = getCookie('username');

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

	const cancelButton = mainContent.querySelector('#cancelButton');
	cancelButton.addEventListener('click', e => {
		e.preventDefault();

		mainContent.innerHTML = beforeHTML;

		addPostInteractButtons(postElem, postAuthor, postID);
	});

	const editForm = mainContent.querySelector('#editForm');
	editForm.addEventListener('submit', async e => {
		e.preventDefault();

		const editValue = mainContent.querySelector('#editPostInput').value;

		try {
			await axios.patch('/api/' + loggedUser + '/posts/' + postID, { content: editValue });

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
						<input type="text" class="input input-transparent" id="editPostInput" value="${beforeContent}">
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
					<div class="media-content media-background" id="mainContent">
						<div class="content">
							<p class="is-white-text" id="mediaContent">
								<strong class="is-white-text mr-2" id="displayName"></strong><a id="username">@</a>
								<span class="is-pulled-right" id="deleteButtonContainer"></span>
								<span class="is-pulled-right" id="editButtonContainer"></span>
								<span class="is-pulled-right is-gray-color" id="editedText"></span>
								<br>
								<span id="postContent"></span>
							</p>
						</div>
						<nav class="level is-mobile">
							<div class="level-left columns is-variable is-2">
								<a class="level-item column" id="commentButton">
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
								<span class="icon is-small"><i class="fas fa-thumbs-up"></i>&nbsp;${likeCount}</span>
							</a>
							<a class="level-item column" id="dislikeButton">
								<span class="icon is-small"><i class="fas fa-thumbs-down"></i>&nbsp;${dislikeCount}</span>
							</a>
						</div>
					</nav>
				</div>
			</article>
			<div id="underMedia"></div>
		</div>`
}

function addPostInteractButtons(postElem, postAuthor, postID) {
	const deleteButtonContainer = postElem.querySelector('#deleteButtonContainer');
	deleteButtonContainer.innerHTML = '<button class="post-interact-button" id="deleteButton"><i class="fa-solid fa-trash"></i></button>';

	const deleteButton = deleteButtonContainer.querySelector('#deleteButton');
	
	deleteButton.addEventListener('click', e => {
		e.preventDefault();

		const underMedia = postElem.querySelector('#underMedia');
		underMedia.classList.add('delete-confirmation', 'is-white-text');
		underMedia.innerHTML = `Are you sure you want to delete this post?
			<span class="is-pulled-right">
				<button id="confirmButton" class="is-white-text is-completely-transparent-button clickable-button mr-2">
						<i class="fa-solid fa-check"></i>
				</button>
				<button id="cancelButton" class="is-white-text is-completely-transparent-button clickable-button">
						<i class="fa-solid fa-xmark"></i>
				</button>
			</span>`;

		underMedia.querySelector('#confirmButton').addEventListener('click', e => {
			e.preventDefault();

			deletePost(postAuthor, postID);
		});

		underMedia.querySelector('#cancelButton').addEventListener('click', e => {
			e.preventDefault();

			underMedia.innerHTML = '';
			underMedia.classList.remove('delete-confirmation');
		});
	});

	const editButtonContainer = postElem.querySelector('#editButtonContainer');
	editButtonContainer.innerHTML = '<button class="post-interact-button" id="editButton"><i class="fa-solid fa-pen-to-square"></i></button>';

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
				<button id="confirmButton" class="is-white-text is-completely-transparent-button clickable-button mr-2">
						<i class="fa-solid fa-check"></i>
				</button>
				<button id="cancelButton" class="is-white-text is-completely-transparent-button clickable-button">
						<i class="fa-solid fa-xmark"></i>
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
		const posts = (await axios.get('/api/' + loggedUser + '/posts')).data.posts;

		const mediaContainer = document.getElementById('mediaContainer');

		for(let i = 0; i < posts.length; ++i) {
			const postElem = document.createElement('div');
			postElem.innerHTML = createMediaObject(posts[i].likes.count, posts[i].dislikes.count, posts[i]._id);

			const posterUsername = posts[i].author;
			const posterDisplayName = posts[i].authorDisplay;
			const postID = posts[i]._id;
			
			const mediaContent = postElem.querySelector('#mediaContent');
			
			const displayName = mediaContent.querySelector('#displayName');
			displayName.textContent = posterDisplayName;
			
			const username = mediaContent.querySelector('#username');
			username.textContent += posterUsername;
			username.href = '/' + posterUsername;
			
			const postContent = mediaContent.querySelector('#postContent');
			postContent.textContent = posts[i].content;

			if(posts[i].edited === true) {
				const editedText = mediaContent.querySelector('#editedText');
				editedText.textContent = '(edited)';

				if(loggedUser === posterUsername) {
					editedText.classList.add('mr-6');
				}
			}

			const likeButton = postElem.querySelector('#likeButton');
			likeButton.addEventListener('click', e => {
				e.preventDefault();

				if(typeof loggedUser === 'undefined') {
					return alert('You must be logged in to use this feature');
				}

				likePost(posterUsername, postID);
			});

			const dislikeButton = postElem.querySelector('#dislikeButton');
			dislikeButton.addEventListener('click', e => {
				e.preventDefault();

				if(typeof loggedUser === 'undefined') {
					return alert('You must be logged in to use this feature');
				}

				dislikePost(posterUsername, postID);
			});

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
								await axios.post('/api/' + posterUsername + '/posts/' + postID + '/comments', { commentator: loggedUser, content: commentInput });

								location.reload();
							} catch(err) {
								alert('Something went wrong');
								console.log(err);
							}
						}
					});


					const comments = (await axios.get('/api/' + posterUsername + '/posts/' + postID + '/comments')).data.comments; 

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

							if(loggedUser === posterUsername) {
								editedText.classList.add('mr-6');
							}
						}

						commentElem.querySelector('#likeButton').addEventListener('click', e => {
							e.preventDefault();

							if(typeof loggedUser === 'undefined') {
								return alert('You must be logged in to use this feature');
							}

							likeComment(posterUsername, postID, comments[i]._id);
						});

						commentElem.querySelector('#dislikeButton').addEventListener('click', e => {
							e.preventDefault();

							if(typeof loggedUser === 'undefined') {
								return alert('You must be logged in to use this feature');
							}

							dislikeComment(posterUsername, postID, comments[i]._id);
						});

						addCommentInteractButtons(commentElem, posterUsername, postID, comments[i]._id);

						commentSection.appendChild(commentElem);
					}
				} else {
					underMedia.classList.remove('delete-confirmation');
					underMedia.classList.remove('is-white-text');
					underMedia.innerHTML = '';
				}
			});

			if(loggedUser === posterUsername) {
				addPostInteractButtons(postElem, posterUsername, postID);
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

			await axios.post('/api/' + loggedUser + '/posts', { content: makePostInput.value });

			location.reload();

			makePostForm.reset();
		});
	} catch(err) {
		console.log(err);
	}
}

if(typeof loggedUser !== 'undefined') {
	getPosts();
}

setInfo();
