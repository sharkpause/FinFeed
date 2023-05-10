const usernameSection = document.getElementById('usernameSection');
const displayNameSection = document.getElementById('displayNameSection');
const bioSection = document.getElementById('bioSection');
const followCount = document.getElementById('followCount');
const numPosts = document.getElementById('numPosts');

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

			deleteButtonContainer.innerHTML = '<button class="post-interact-button" id="deleteButton"><i class="fa-solid fa-trash"></i></button>';
			editButtonContainer.innerHTML = '<button class="post-interact-button" id="editButton"><i class="fa-solid fa-pen-to-square"></i></button>';
		}
	} catch(err) {
		if(err.response.status === 404) {
			displayNameSection.textContent = 'User does not exist';
			displayNameSection.classList.add('is-red-color');
			usernameSection.textContent = 'Error 404';
			bioSection.textContent = 'Please check the url if the username is mispelled';
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

setInfo();
