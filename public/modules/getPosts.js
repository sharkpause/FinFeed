async function likePost(username, postID) {
	try {
		await axios.patch(apiURL + 'user/' + username + '/posts/' + postID + '/like', { liker: loggedUser });

		location.reload();
	} catch(err) {
		console.log(err);
		alert('Something went wrong');
	}
}

async function likeComment(username, postID, commentID) {
	try {
		await axios.patch(apiURL + 'user/' + username + '/posts/' + postID + '/comments/' + commentID + '/like', { liker: loggedUser });

		location.reload();
	} catch(err) {
		console.log(err);
		alert('Something went wrong');
	}
}

async function dislikePost(username, postID) {
	try {
		await axios.patch(apiURL + 'user/' + username + '/posts/' + postID + '/dislike', { disliker: loggedUser });

		location.reload();
	} catch(err) {
		console.log(err);
		alert('Something went wrong');
	}
}

async function dislikeComment(username, postID, commentID) {
	try {
		await axios.patch(apiURL + 'user/' + username + '/posts/' + postID + '/comments/' + commentID + '/dislike', { disliker: loggedUser });

		location.reload();
	} catch(err) {
		console.log(err);
		alert('Something went wrong');
	}
}

async function deletePost(username, postID) {
	try {
		await axios.delete(apiURL + 'user/' + username + '/posts/' + postID);

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
		await axios.delete(apiURL + 'user/' + username + '/posts/' + postID + '/comments/' + commentID);

		location.reload();
	} catch(err) {
		if(err.response.status === 401) {
			alert('You are not authorized to delete this comment');
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

		mainContent.querySelector('#likeButton').addEventListener('click', e => {
			e.preventDefault();

			likePost(postAuthor, postID);
		});

		mainContent.querySelector('#dislikeButton').addEventListener('click', e => {
			e.preventDefault();

			dislikePost(postAuthor, postID);
		});

		addPostInteractButtons(postElem, postAuthor, postID);
		addCommentButton(postElem, postAuthor, postID);
	});

	const editForm = mainContent.querySelector('#editForm');
	editForm.addEventListener('submit', async e => {
		e.preventDefault();

		try {
			await axios.patch(apiURL + 'user/' + loggedUser + '/posts/' + postID, { content: editPostInput.value });

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
			await axios.patch(apiURL + 'user/' + loggedUser + '/posts/' + postID + '/comments/' + commentID, { content: editValue });

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
						<textarea class="input input-transparent auto-resize-textarea" id="editPostInput" wrap="soft" maxlength="1000" type="text">${beforeContent}</textarea>
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

function createMediaObject(likeCount, dislikeCount, postID, profileURL) {
	return `<div class="mt-6" id="${postID}">
				<article class="media media-background">
					<figure class="media-left">
						<p class="image is-48x48">
							<img src="${profileURL}">
						</p>
					</figure>
					<div class="media-content visible-overflow" id="mainContent">
						<div class="content">
							<p class="is-white-text" id="mediaContent">
								<strong class="is-white-text mr-2" id="displayName"></strong>
								<a id="username" class="mr-2">@</a>
								<span id="creationDate" class="is-gray-color"></span>
								
								<span class="dropdown is-right is-pulled-right" id="dropdownMenu"></span>

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

function createCommentObject(likeCount, dislikeCount, commentID, profileURL) {
return `<div class="mt-6" id="${commentID}">
			<article class="media media-background">
				<figure class="media-left">
						<p class="image is-48x48">
							<img src="${profileURL}">
						</p>
					</figure>
				<div class="media-content" id="mainContent">
					<div class="content">
						<p class="is-white-text" id="mediaContent">
							<strong class="is-white-text mr-2" id="displayName"></strong>
							<a id="username">@</a>
							<span id="creationDate" class="is-gray-color"></span>

							<span class="dropdown is-right is-pulled-right" id="dropdownMenu"></span>

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
	addDropDown(postElem);

	const deleteButtonContainer = postElem.querySelector('#deleteButtonContainer');
	deleteButtonContainer.innerHTML = '<button class="post-interact-button dropdown-item-big" id="deleteButton"><i class="fa-solid fa-trash mr-1"></i>Delete Post</button>';

	const deleteButton = deleteButtonContainer.querySelector('#deleteButton');
	
	deleteButton.addEventListener('click', e => {
		e.preventDefault();

		const underMedia = postElem.querySelector('#underMedia');
		underMedia.classList.add('delete-confirmation', 'is-white-text');
		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
			underMedia.innerHTML = `Are you sure you want to delete this post?
			<div>
				<button id="cancelButton" class="is-white-text is-completely-transparent-button mr-6">
						<i class="fa-solid fa-xmark mr-1"></i>
						No
				</button>
				<button id="confirmButton" class="is-white-text is-completely-transparent-button">
						<i class="fa-solid fa-check mr-1"></i>
						Yes
				</button>
			</div>`;
		} else {
			underMedia.innerHTML = `Are you sure you want to delete this post?
			<span class="is-pulled-right">
				<button id="cancelButton" class="is-white-text is-completely-transparent-button mr-6">
						<i class="fa-solid fa-xmark mr-1"></i>
						No
				</button>
				<button id="confirmButton" class="is-white-text is-completely-transparent-button">
						<i class="fa-solid fa-check mr-1"></i>
						Yes
				</button>
			</span>`;
		}

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
	addDropDown(commentElem);

	const deleteButtonContainer = commentElem.querySelector('#deleteButtonContainer');
	deleteButtonContainer.innerHTML = '<button class="post-interact-button dropdown-item-big" id="deleteButton"><i class="fa-solid fa-trash mr-1"></i>Delete comment</button>';

	const deleteButton = deleteButtonContainer.querySelector('#deleteButton');
	
	deleteButton.addEventListener('click', e => {
		e.preventDefault();

		const underMedia = commentElem.querySelector('#underMedia');
		underMedia.classList.add('delete-confirmation', 'is-white-text');
		underMedia.innerHTML = `Are you sure you want to delete this comment?
			<span class="is-pulled-right">
				<button id="cancelButton" class="is-white-text is-completely-transparent-button clickable-button mr-6">
						<i class="fa-solid fa-xmark mr-1"></i>
						No
				</button>
				<button id="confirmButton" class="is-white-text is-completely-transparent-button clickable-button">
						<i class="fa-solid fa-check mr-1"></i>
						Yes
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
	editButtonContainer.innerHTML = '<button class="post-interact-button dropdown-item-big" id="editButton"><i class="fa-solid fa-pen-to-square mr-1"></i>Edit comment</button>';

	const editButton = editButtonContainer.querySelector('#editButton');

	editButton.addEventListener('click', e => {
		e.preventDefault();

		editComment(commentElem, postAuthor, postID, commentID);
	});
}

function addDropDown(elem) {
	elem.querySelector('#dropdownMenu').innerHTML = `
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

	const dropdown = elem.querySelector('.dropdown');
	dropdown.addEventListener('click', e => {
		e.preventDefault();

		dropdown.classList.toggle('is-active');
	});
}

async function getPosts(queryString) {
	try {
		const url = window.location.href;
		let posts;

		const mediaContainer = document.getElementById('mediaContainer');

		const loaderElem = document.createElement('div');
		loaderElem.innerHTML = '<div class="columns is-centered mt-6" id="loader"><div class="column is-narrow has-text-centered"><div class="loader"></div></div></div>';
		mediaContainer.appendChild(loaderElem);

		if(/^.+\/user\/\w+$/.test(url)) {
			let username = url.split('/');
			username = url.lastIndexOf('/') !== url.length - 1
				? username[username.length - 1]
				: username[username.length - 2];

			posts = (await axios.get(apiURL + 'user/' + username + '/posts' + queryString)).data.posts;
		} else {
			posts = (await axios.get(apiURL + 'posts' + queryString)).data.posts;
		}

		if(posts) {
			const loader = mediaContainer.querySelector('#loader');
			if(loader) {
				loader.outerHTML = '';
			}
		}

		for(let i = 0; i < posts.length; ++i) {
			const postAuthor = posts[i].author;
			let profileURL;

			if(imageExist('/profilePictures/' + postAuthor + '.jpeg')) {
				profileURL = '/profilePictures/' + postAuthor + '.jpeg';
			} else {
				profileURL = '/profilePictures/default.png';
			}
		
			const postElem = document.createElement('div');
			postElem.innerHTML = createMediaObject(posts[i].likes.count, posts[i].dislikes.count, posts[i]._id, profileURL);

			const posterDisplayName = posts[i].authorDisplay;
			const postID = posts[i]._id;

			const mediaContent = postElem.querySelector('#mediaContent');
			
			const displayName = mediaContent.querySelector('#displayName');
			displayName.textContent = posterDisplayName;
			
			const username = mediaContent.querySelector('#username');
			username.textContent += postAuthor;
			username.href = '/user/' + postAuthor;

			const creationDate = mediaContent.querySelector('#creationDate');
			const dateObject = (new Date(posts[i].createdAt));
			const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			creationDate.textContent = `${dateObject.getDate()} ${monthNames[dateObject.getMonth()]} ${dateObject.getFullYear()}`;
			
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

				await axios.post(apiURL + 'user/' + loggedUser + '/posts', { content: makePostInput.value });

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

		const underMedia = postElem.querySelector('#underMedia');

		if(underMedia.innerHTML === '') {
			underMedia.innerHTML = `
				<div class="media-background">
					<form method="post" id="commentForm">
						<div class="field is-grouped">
							<p class="control is-expanded">
								<textarea class="input input-transparent auto-resize-textarea" id="commentInput" wrap="soft" maxlength="1000" type="text" placeholder="What's on your mind?"></textarea>
							</p>
							<p class="control">
								<button type="submit" class="button is-blue-color is-transparent-button" id="commentSubmit">
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

			commentInput.addEventListener('input', function(e) {
				e.preventDefault();

				autoGrow(this);
			});

			commentInput.addEventListener('keypress', e => {
				if(e.key === 'Enter' && !e.shiftKey) {
					e.preventDefault();

					document.getElementById('commentSubmit').click();
				}
			});

			const commentForm = underMedia.querySelector('#commentForm');
			commentForm.addEventListener('submit', async e => {
				e.preventDefault();

				const commentInput = commentForm.querySelector('#commentInput').value;

				if(typeof loggedUser === 'undefined') {
					return alert('You must be logged into use this feature');
				}

				if(commentInput.length > 0) {
					try {
						await axios.post(apiURL + 'user/' + postAuthor + '/posts/' + postID + '/comments', { commentator: loggedUser, content: commentInput });

						location.reload();
					} catch(err) {
						alert('Something went wrong');
						console.log(err);
					}
				}
			});

			const commentSection = underMedia.querySelector('#commentSection');
			commentSection.innerHTML = '<div class="loader mt-4"></div>';

			const comments = (await axios.get(apiURL +  'user/' + postAuthor + '/posts/' + postID + '/comments')).data.comments; 

			if(comments) {
				commentSection.innerHTML = '';
			}

			for(let i = 0; i < comments.length; ++i) {
				const commentAuthor = comments[i].author;
				let profileURL;

				if(imageExist('/profilePictures/' + commentAuthor + '.jpeg')) {
					profileURL = '/profilePictures/' + commentAuthor + '.jpeg';
				} else {
					profileURL = '/profilePictures/default.png';
				}

				const commentElem = document.createElement('div');
				commentElem.innerHTML = createCommentObject(comments[i].likes.count, comments[i].dislikes.count, comments[i]._id, profileURL);

				const displayNameComment = commentElem.querySelector('#displayName');
				displayNameComment.textContent = comments[i].authorDisplay;

				const usernameComment = commentElem.querySelector('#username');
				usernameComment.textContent = '@' + commentAuthor;
				usernameComment.href = '/' + commentAuthor;

				const contentComment = commentElem.querySelector('#commentContent');
				contentComment.textContent = comments[i].content;

				const creationDate = commentElem.querySelector('#creationDate');
				const dateObject = (new Date(comments[i].createdAt));
				const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				creationDate.textContent = `${dateObject.getDate()} ${monthNames[dateObject.getMonth()]} ${dateObject.getFullYear()}`;
				
				if(comments[i].edited === true) {
					const editedText = commentElem.querySelector('#editedText');
					editedText.textContent = '(edited)';

					if(loggedUser === postAuthor) {
						editedText.classList.add('mr-6');
					}
				}

				addCommentLikeDislike(commentElem, postAuthor, postID, comments[i]._id);

				if(loggedUser === comments[i].author) {
					addCommentInteractButtons(commentElem, postAuthor, postID, comments[i]._id);
				}

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

getPosts('?from=0');

let fromCount = 10;

window.addEventListener('scroll', e => {
	if(document.body.scrollTop + document.body.clientHeight === document.body.scrollHeight) {
		getPosts('?from=' + fromCount);

		fromCount += 10;
    }
}, true);
