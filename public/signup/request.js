const form = document.getElementById('signupForm');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');

const usernameError = document.getElementById('usernameError');

form.addEventListener('submit', async e => {
	e.preventDefault();

	const username = usernameInput.value;
	const password = passwordInput.value;

	try {
		await axios.post('/api/signup', { username, password });
	} catch(err) {
		if(err.response.status === 409) {
			usernameError.textContent = 'Username is unavailable';
			usernameInput.classList.add('input-error');
		}
	}
});
