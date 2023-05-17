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

	//	const cookies = document.cookie.split(";");

	//	for (let i = 0; i < cookies.length; i++) {
	//	  const cookie = cookies[i];
	//	  const eqPos = cookie.indexOf("=");
	//	  const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
	//	  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
	//	}
		//
		//	TODO: Make this shit work

		await axios.delete('/api/' + loggedUser + '/logout');

		location.reload();
	});
} else {
	logoutButton.classList.remove('button');
	logoutButton.classList.remove('is-white');
	logoutButton.style.visibility = 'hidden';
}
