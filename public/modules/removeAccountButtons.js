const signupButton = document.getElementById('signupButton');
const loginButton = document.getElementById('loginButton');

if(typeof loggedUser !== 'undefined') {
	signupButton.innerHTML = '';
	signupButton.outerHTML = '';
	loginButton.innerHTML = '';
	loginButton.outerHTML = '';
	
	const logoutButton = document.getElementById('logoutButton');
	logoutButton.textContent = 'Log out';
	logoutButton.addEventListener('click', async e => {
		e.preventDefault();

		console.log('/api/' + loggedUser + '/logout');

		await axios.delete('/api/' + loggedUser + '/logout');

		window.location.href = '/login';
	});
} else {
	logoutButton.classList.remove('button');
	logoutButton.classList.remove('is-white');
	logoutButton.style.visibility = 'hidden';
}
