const usernameSection = document.getElementById('usernameSection');
const displayNameSection = document.getElementById('displayNameSection');
const bioSection = document.getElementById('bioSection');
const followCount = document.getElementById('followCount');
const numPosts = document.getElementById('numPosts');
const mainUserInfo = document.getElementById('mainUserInfo');
const profileSection = document.getElementById('profileSection');
const deleteButtonContainer = document.getElementById('deleteButtonContainer');
const editButtonContainer = document.getElementById('editButtonContainer');
const profilePicture = document.getElementById('profilePicture');

let username;

let beforeDisplayName;
let beforeBioSection;

const lineBreak = document.getElementById('lineBreak');

const onMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if(onMobile){
	lineBreak.classList.add('line-break');
	document.getElementById('numPostsText').classList.remove('ml-6');
}

function addDropdown() {
	const dropdown = document.querySelector('.dropdown');
	dropdown.addEventListener('click', e => {
		e.preventDefault();

		dropdown.classList.toggle('is-active');
	});
}

async function setInfo() {
	try {
		const usernameURL = getLastPart(window.location.href);

		if(usernameURL === 'undefined') {
			displayNameSection.textContent = 'User does not exist';
			displayNameSection.classList.add('is-red-color');
			usernameSection.textContent = 'Error 404';
			profilePicture.src = '/profilePictures/default.png';
			return bioSection.textContent = 'Please check the url if the username is mispelled';
		}

		const getPosts = document.createElement('script')
		getPosts.src = '/modules/getPosts.js';
		document.head.appendChild(getPosts);

		const user = (await axios.get(apiURL + 'user/' + usernameURL)).data;

		username = user.user.username;

		usernameSection.textContent += username;
		displayNameSection.textContent = user.user.displayName;
		bioSection.textContent = user.user.bio;
		followCount.textContent = user.user.follows.count;
		numPosts.textContent = user.numPosts;

		if(imageExist('/profilePictures/' + username + '.jpeg')) {
			profilePicture.src = '/profilePictures/' + username + '.jpeg';
		} else {
			profilePicture.src = '/profilePictures/default.png';
		}

		addDropdown();

		if(loggedUser !== username) {
			const isFollowing = (await axios.get(apiURL + 'user/' + username)).data.user.follows.followers.includes(loggedUser);

			if(isFollowing) {
				followButtonContainer.innerHTML = '<button class="post-interact-button is-white-text dropdown-item-big" id="followButton"><i class="fa-solid fa-user-minus mr-1"></i>Unfollow account</button>';

				followButtonContainer.querySelector('#followButton').addEventListener('click', async e => {
					e.preventDefault();

					try {
						await axios.patch(apiURL + 'user/' + username + '/follow', { follower: loggedUser });

						location.reload();
					} catch(err) {
						console.log(err);
						alert('Something went wrong');
					}
				});
			} else {
				followButtonContainer.innerHTML = '<button class="post-interact-button is-white-text dropdown-item-big" id="followButton"><i class="fa-solid fa-user-plus mr-1"></i>Follow account</button>';

				followButtonContainer.querySelector('#followButton').addEventListener('click', async e => {
					e.preventDefault();

					try {
						await axios.patch(apiURL + 'user/' + username + '/follow', { follower: loggedUser });
					} catch(err) {
						console.log(err);
						alert('Something went wrong');
					}

					location.reload();
				});
			}
		} else {
			followButtonContainer.outerHTML = '';
		}	

		if(loggedUser === user.user.username) {
			addAccountInteractButtons();
		} else {
			editButtonContainer.outerHTML = '';
			deleteButtonContainer.outerHTML = '';
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

async function addAccountInteractButtons() {
	deleteButtonContainer.innerHTML = '<button class="post-interact-button is-white-text dropdown-item-big" id="deleteButton"><i class="fa-solid fa-trash mr-1"></i>Delete account</button>';

	const deleteButton = profileSection.querySelector('#deleteButton');
	
	deleteButton.addEventListener('click', e => {
		e.preventDefault();

		const deleteConfirmation = profileSection.querySelector('#deleteConfirmation');

		deleteConfirmation.classList.add('delete-confirmation', 'is-white-text', 'mb-6', 'mt-6');

		if(onMobile) {
			deleteConfirmation.innerHTML = `
				<span>Are you sure you want to delete your account?</span>
				<span class="line-break"></span>
				<button id="cancelButton" class="is-white-text is-completely-transparent-button button mr-6">
						<i class="fa-solid fa-xmark mr-1"></i>
						No
				</button>
				<button id="confirmButton" class="is-white-text is-completely-transparent-button button">
						<i class="fa-solid fa-check mr-1"></i>
						Yes
				</button>
			`;
		} else {
			deleteConfirmation.innerHTML = `
				Are you sure you want to delete your account?
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
		}

		deleteConfirmation.querySelector('#confirmButton').addEventListener('click', e => {
			e.preventDefault();

			deleteAccount();
		});

		deleteConfirmation.querySelector('#cancelButton').addEventListener('click', e => {
			e.preventDefault();

			deleteConfirmation.innerHTML = '';
			deleteConfirmation.classList.remove('delete-confirmation', 'mt-6', 'mb-6');
		});
	});

	editButtonContainer.innerHTML = '<button class="post-interact-button is-white-text dropdown-item-big" id="editButton"><i class="fa-solid fa-pen-to-square mr-1"></i>Edit account</button>';
	const editButton = profileSection.querySelector('#editButton');

	editButton.addEventListener('click', e => {
		e.preventDefault();

		editAccount(editButtonContainer, deleteButtonContainer);
	});
}

async function deleteAccount() {
	try {
		await axios.delete(apiURL + 'user/' + username);

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

async function editAccount() {
	try {
		const beforeProfileSection = profileSection.innerHTML;

		const displayNameSection = profileSection.querySelector('#displayNameSection');
		const usernameSection = profileSection.querySelector('#usernameSection');
		const editButtonContainer = profileSection.querySelector('#editButtonContainer');
		const deleteButtonContainer = profileSection.querySelector('#deleteButtonContainer');
		const followAndNumPosts = profileSection.querySelector('#followAndNumPosts');

		beforeDisplayName = displayNameSection.textContent;
		beforeUsername = usernameSection.textContent.slice(1);
		beforeBioSection = bioSection.textContent;
		
		const email = (await axios.get(apiURL + 'user/' + beforeUsername)).data.user.email;

		editButtonContainer.innerHTML = '';
		deleteButtonContainer.innerHTML = '';

		followAndNumPosts.innerHTML = '';

		let profilePictureURL;

		if(imageExist('/profilePictures/' + beforeUsername + '.jpeg')) {
			profilePictureURL = '/profilePictures/' + beforeUsername + '.jpeg';
		} else if(imageExist('/profilePictures/' + beforeUsername + '.jpg')) {
			profilePictureURL = '/profilePictures/' + beforeUsername + '.jpg';
		} else {
			profilePictureURL = '/profilePictures/default.png';
		}

		profileSection.innerHTML = `
		<div>
			<strong class="title is-white-text">Edit account information</strong>

			<form id="editForm" method="post" action="/api/user/${beforeUsername}/edit" enctype="multipart/form-data">
				<div class="field mt-6">

					<div class="columns profilePictureForm">
						<div class="column is-narrow">
							<figure class="image is-128x128">
								<img src="${profilePictureURL}" id="profilePictureElem">
							</figure>
						</div>

						<div class="file has-name column mt-6 is-fullwidth is-narrow">
							<label class="file-label">
							<input class="file-input" type="file" name="profilePicture" id="fileInput" accept="image/*">
							<span class="file-cta is-blue-background-color is-blue-border">
								<span class="file-icon">
									<i class="fas fa-upload"></i>
								</span>
								<span class="file-label is-white-text">
									Choose an image file
								</span>
							</span>
							</label>
						</div>
					</div>

					<label class="label is-light-white-color mt-5">Email</label>
					<input class="input input-transparent" placeholder="Email" type="text" value="${email}" id="emailInput" name="email">

					<label class="label is-light-white-color mt-5">Display name</label>
					<input class="input input-transparent" placeholder="Display name" type="text" value="${displayNameSection.textContent}" id="displayNameInput" maxlength="50" name="displayName">

					<label class="label is-light-white-color mt-5">Bio</label>
					<textarea class="input input-transparent auto-resize-textarea" id="bioInput" placeholder="Bio" wrap="soft" maxlength="100" type="text" name="bio">${bioSection.textContent}</textarea>

					<label class="label is-light-white-color mt-5">Password</label>
					<input class="input input-transparent" type="password" placeholder="Password (leave empty to not change)" id="passwordInput" name="password">

					<label class="label is-light-white-color mt-5">Confirm Password</label>
					<input class="input input-transparent" type="password" placeholder="Confirm password (this input will only function if the password input above is filled)" id="confirmPasswordInput"">
					<p id="passwordError"></p>

					<p class="control mt-6">
						<button type="submit" class="button is-blue-color is-transparent-button mr-2 mb-4">
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

		profileSection.querySelector('#bioInput').addEventListener('input', function() { autoGrow(this) });

		profileSection.querySelector('#fileInput').addEventListener('change', e => {
			const selectedImage = e.target.files[0];
			const reader = new FileReader();

			reader.onload = e => {
				profileSection.querySelector('#profilePictureElem').src = e.target.result;
			};

			reader.readAsDataURL(selectedImage);
		})

		const cancelButton = document.getElementById('cancelButton');
		cancelButton.addEventListener('click', e => {
			e.preventDefault();

			location.reload();
		});
	} catch(err) {
		console.log(err);
	}
}

setInfo();
