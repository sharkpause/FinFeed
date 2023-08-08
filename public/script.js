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

const userLoggedIn = typeof loggedUser !== 'undefined';

makePostForm.reset();

makePostForm.action = apiURL + 'user/' + loggedUser + '/posts';

makePostForm.addEventListener('submit', async e => {
	if(!userLoggedIn) {
		e.preventDefault();
		return alert('You must be logged in to use this feature');
	}

	location.reload();
});

const uploadContainer = document.getElementById('uploadContainer');

const fileUpload = document.getElementById('file-upload');
fileUpload.addEventListener('change', e => {
	if(!userLoggedIn) {
		e.preventDefault();
		return alert('You must be logged in to use this feature');
	}

	const picture = document.getElementById('picture');
	picture.classList.add('is-post-picture-size');
	
	const selectedImage = e.target.files[0];
	const reader = new FileReader();

	reader.onload = e => {
		picture.src = e.target.result;

		makePostForm.classList.remove('mt-5');
	}

	reader.readAsDataURL(selectedImage);

	const cancelButton = document.createElement('button');
	cancelButton.classList.add('button', 'is-blue-color', 'is-transparent-button', 'mt-11', 'ml-1');
	cancelButton.innerHTML = `
		<span class="icon">
			<i class="fa-solid fa-xmark"></i>
		</span>
	`;

	cancelButton.addEventListener('click', e => {
		picture.src = '';
		picture.classList.remove('is-post-picture-size');
		cancelButton.remove();
	});

	uploadContainer.appendChild(cancelButton);
	uploadContainer.classList.add('mb-5');
});

