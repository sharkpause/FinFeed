const usernameSection = document.getElementById('usernameSection');
const displayNameSection = document.getElementById('displayNameSection');
const bioSection = document.getElementById('bioSection');
const followCount = document.getElementById('followCount');
const numPosts = document.getElementById('numPosts');
const deleteConfirmation = document.getElementById('deleteConfirmation');

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

			addAccountInteractButtons(editButtonContainer, deleteButtonContainer, deleteConfirmation, user.user.username);
		}
	} catch(err) {
		if(err.response) {
			if(err.response.status === 404) {
				displayNameSection.textContent = 'User does not exist';
				displayNameSection.classList.add('is-red-color');
				usernameSection.textContent = 'Error 404';
				bioSection.textContent = 'Please check the url if the username is mispelled';
			}
		}

		console.log(err);
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

function addAccountInteractButtons(editButtonContainer, deleteButtonContainer, deleteConfirmation, username) {
	deleteButtonContainer.innerHTML = '<button class="post-interact-button subtitle is-white-text ml-3" id="deleteButton"><i class="fa-solid fa-trash"></i>&nbsp;Delete account</button>';

	const deleteButton = deleteButtonContainer.querySelector('#deleteButton');
	
	deleteButton.addEventListener('click', e => {
		e.preventDefault();

		deleteConfirmation.classList.add('delete-confirmation', 'is-white-text');
		deleteConfirmation.innerHTML = `Are you sure you want to delete your account?
			<span class="is-pulled-right">
				<button id="confirmButton" class="is-white-text is-completely-transparent-button clickable-button mr-2">
						<i class="fa-solid fa-check"></i>
				</button>
				<button id="cancelButton" class="is-white-text is-completely-transparent-button clickable-button">
						<i class="fa-solid fa-xmark"></i>
				</button>
			</span>`;

		deleteConfirmation.querySelector('#confirmButton').addEventListener('click', e => {
			e.preventDefault();

			deleteAccount(username);
		});

		deleteConfirmation.querySelector('#cancelButton').addEventListener('click', e => {
			e.preventDefault();

			deleteConfirmation.innerHTML = '';
			deleteConfirmation.classList.remove('delete-confirmation');
		});
	});

	editButtonContainer.innerHTML = '<button class="post-interact-button subtitle is-white-text" id="editButton"><i class="fa-solid fa-pen-to-square"></i>&nbsp;Edit account</button>';
	const editButton = editButtonContainer.querySelector('#editButton');

	editButton.addEventListener('click', e => {
		e.preventDefault();
		
		editAccount(usernameContainer, displayContainer, bioContainer);
	});
}

async function deleteAccount(username) {
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

async function editAccount() {
	// TODO: make this (t)werk
}

setInfo();
