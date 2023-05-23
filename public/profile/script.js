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

		if(usernameURL === 'undefined') {
			displayNameSection.textContent = 'User does not exist';
			displayNameSection.classList.add('is-red-color');
			usernameSection.textContent = 'Error 404';
			return bioSection.textContent = 'Please check the url if the username is mispelled';
		}

		const getPosts = document.createElement('script')
		getPosts.src = '/modules/getPosts.js';
		document.head.appendChild(getPosts);

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
				<button id="confirmButton" class="is-white-text is-completely-transparent-button clickable-button mr-4">
						<i class="fa-solid fa-check m-1"></i>
						Yes
				</button>
				<button id="cancelButton" class="is-white-text is-completely-transparent-button clickable-button">
						<i class="fa-solid fa-xmark mr-1"></i>
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

setInfo();
