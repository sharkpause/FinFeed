const resetForm = document.getElementById('resetForm');

resetForm.addEventListener('submit', async e => {
	e.preventDefault();

	const password = resetForm.querySelector('#passwordInput').value;
	const confirmPassword = resetForm.querySelector('#confirmPasswordInput').value;

	resetForm.querySelector('#confirmPasswordError').innerText = '';

	if(confirmPassword !== password) {
		return resetForm.querySelector('#confirmPasswordError').innerText = 'Passwords does not match!';
	}

	if(password.length < 3) {
		return resetForm.querySelector('#confirmPasswordError').innerText = 'Password must be equal or longer than 3 characters!';
	}

	const response = await axios.post(apiURL + 'login/reset/success', { password });

	if(response.status === 200) window.location.href = '/login';
});
