function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

let profileLink = document.getElementById('profileNav');

profileLink.href = '/user/' + getCookie('username');;
