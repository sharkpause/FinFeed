const signupButton = document.getElementById('signupButton');
const loginButton = document.getElementById('loginButton');

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

if(typeof getCookie('username') !== 'undefined') {
	signupButton.innerHTML = '';
	signupButton.outerHTML = '';
	loginButton.innerHTML = '';
	loginButton.outerHTML = '';
}
