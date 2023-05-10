const form = document.getElementById('signupForm');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');

const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');

const successText = document.getElementById('successText');

form.addEventListener('submit', async e => {
	e.preventDefault();

	const username = usernameInput.value;
	const password = passwordInput.value;

	usernameError.textContent = '';
	usernameInput.classList.remove('input-error');

	passwordError.textContent = '';
	passwordInput.classList.remove('input-error');

	successText.textContent = '';

	if(username === '') {
		usernameError.textContent = 'Please provide username';
		return usernameInput.classList.add('input-error');
	}

	if(password === '') {
		passwordError.textContent = 'Please provide password';
		return passwordInput.classList.add('input-error');
	}

	if(username.length < 3 || username.length > 30) {
		usernameError.textContent = 'Username must be longer or equal to 3 characters and less than or equal to 30 characters';
		return usernameInput.classList.add('input-error');
	}

	if(!/^[a-zA-Z0-9_]+$/.test(username)) {
		usernameError.textContent = 'Username may only contain uppercase amd lowercase letters and underscores';
		return usernameInput.classList.add('input-error');
	};

	try {
		await axios.post('/api/signup', { username, password });

		successText.textContent = 'Account successfully created!';
	} catch(err) {
		if(err.response.status === 409) {
			usernameError.textContent = 'Username is unavailable';
			return usernameInput.classList.add('input-error');
		}

		passwordError.textContent = 'Something went wrong, please try again later';
	}
});
