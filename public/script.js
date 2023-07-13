const makePostInput = document.getElementById('makePostInput');

makePostInput.addEventListener('input', function(e) {
	e.preventDefault();

	autoGrow(this);
});

makePostInput.addEventListener('keypress', e => {
	if(e.key === 'Enter' && !e.shiftKey) {
		e.preventDefault();

		document.getElementById('makePostSubmit').click();
	}
});

const makePostForm = document.getElementById('makePostForm');

makePostForm.action = apiURL + 'user/' + loggedUser + '/posts';

makePostForm.addEventListener('submit', async e => {
	if(typeof loggedUser === 'undefined') {
		return alert('You must be logged in to use this feature');
	}

	//await axios.post(apiURL + 'user/' + loggedUser + '/posts', { content: makePostInput.value });

	location.reload();

	makePostForm.reset();
});
