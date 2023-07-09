const form = document.getElementById('signupForm');
const usernameInput = document.getElementById('usernameInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const confirmPasswordInput = document.getElementById('confirmPasswordInput');

const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const emailError = document.getElementById('emailError');

const successText = document.getElementById('successText');

form.addEventListener('submit', async e => {
	e.preventDefault();

	const username = usernameInput.value;
	const password = passwordInput.value;
	const confirmedPassword = confirmPasswordInput.value;
	const email = emailInput.value;

	usernameError.textContent = '';
	usernameInput.classList.remove('input-error');
	
	emailError.textContent = '';
	emailError.classList.remove('input-error');

	passwordError.textContent = '';
	passwordInput.classList.remove('input-error');

	successText.textContent = '';

	if(username === '') {
		usernameError.textContent = 'Please provide username';
		return usernameInput.classList.add('input-error');
	}

	if(email === '') {
		emailError.textContent = 'Please provide email';
		return emailInput.classList.add('input-error');
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
	
	if(!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/gm.test(email)) {
		emailError.textContent = 'Invalid email';
		return emailInput.classList.add('input-error');
	}

	if(confirmedPassword !== password) {
		passwordError.textContent = "Password and confirmed password does not match!";
		passwordInput.classList.add('input-error');
		return confirmPasswordInput.classList.add('input-error');
	}

	try {
		const res = await axios.post(apiURL + 'signup', { username, email, password });

		if(res.data.emailSent === 'Email sent') {
			document.getElementById('signupSection').remove();

			document.getElementById('confirmEmailSection').innerHTML = `<div class="columns is-centered confirm-email-margin">
				<div class="column is-narrow has-text-centered">
					<div class="is-white-text is-size-3 mb-6">Please check your email inbox to confirm your email...</div>
					<a class="is-size-4">Resend email</a>
				</div>
			</div>`;
		}
	} catch(err) {
		if(err.response) {
			if(err.response.data.errorCode === 1) {
				usernameError.textContent = 'Username is unavailable';
				return usernameInput.classList.add('input-error');
			} else if(err.response.data.errorCode === 2) {
				emailError.textContent = 'Email is already in use';
				return emailInput.classList.add('input-error');
			}
		}

		console.log(err);

		passwordError.textContent = 'Something went wrong, please try again later';
	}
});
