const form = document.getElementById('loginForm');
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
		const response = await axios.post(apiURL + 'login', { username, password });

		successText.textContent = 'Succesfully logged into account';

		window.location.href = '/';
	} catch(err) {
		if(err.response.status === 401) {
			return passwordError.textContent = 'Either username or password is wrong, please try again';
		}

		passwordError.textContent = 'Something went wrong, please try again later';
	}
});

const forgotPasswordLink = document.getElementById('forgotPasswordLink');

forgotPasswordLink.addEventListener('click', async e => {
	document.getElementById('loginSection').remove();

	const confirmEmailSection = document.getElementById('confirmEmailSection');

	confirmEmailSection.innerHTML = `
		<section class="hero mt-6">
		<div class="hero-body">
			<div class="columns is-centered is-vcentered">
				<div class="column is-5">
					<form id="resetForm" method="post">
						<div class="field">
							<label class="label is-light-white-color" id="emailLabel">Email</label>
							<div class="control has-icons-left">
								<input class="input input-transparent" type="text" placeholder="JohnDoe" name="email" id="emailInput" required>
								<span class="icon is-small is-left">
									<i class="fa-solid fa-envelope" id="emailIcon"></i>
								</span>
								<p class="help is-danger is-size-6 white-icon" id="emailError"></p>
							</div>
						</div>

						<div class="field mt-6 has-text-centered">
							<div class="control has-icons-left">
								<input type="submit" class="button is-medium submit-input" id="submitInput" value="Send email">
							</div>
						</div>

						<p class="is-size-3 has-text-centered" id="loader"></p>
					</form>
				</div>
			</div>
		</div>
	</section>
	`;

	confirmEmailSection.querySelector('#resetForm').addEventListener('submit', async e => {
		e.preventDefault();

		const loader = document.getElementById('loader');
		loader.innerHTML = '<div class="loader"></div>';

		const email = resetForm.querySelector('#emailInput').value;

		await axios.post(apiURL + 'login/reset', { email });

		loader.innerHTML = '';

		const checkEmail = document.createElement('div')
		checkEmail.innerHTML = `
		<div class="columns is-centered confirm-email-margin">
			<div class="column is-narrow has-text-centered">
				<div class="is-white-text is-size-3 mb-6">Please check your email inbox to confirm your email...</div>
			</div>
		</div>`;

		document.getElementById('confirmEmailSection').appendChild(checkEmail);
	});
});
