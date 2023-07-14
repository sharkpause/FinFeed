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

const fileUpload = document.getElementById('file-upload');
fileUpload.addEventListener('change', e => {
	if(!userLoggedIn) {
		e.preventDefault();
		return alert('You must be logged in to use this feature');
	}

	const pictureContainer = document.getElementById('pictureContainer');
	pictureContainer.classList.add('image', 'is-512x512');

	const picture = document.getElementById('picture');
	
	const selectedImage = e.target.files[0];
	const reader = new FileReader();

	reader.onload = e => {
		picture.src = e.target.result;

		makePostForm.classList.remove('mt-5');
	}

	reader.readAsDataURL(selectedImage);

	const cancelButton = document.createElement('span');
	cancelButton.innerHTML = `
		<button id="cancelButton" class="button is-blue-color is-transparent-button ml-3" style="margin-top: 6rem;">
			<span class="icon">
				<i class="fa-solid fa-xmark"></i>
			</span>
		</button>
	`;

	uploadContainer.appendChild(cancelButton);
	cancelButton.addEventListener('click', e => {
		picture.src = '';
		pictureContainer.classList.remove('image', 'is-512x512');
		cancelButton.remove();
	});
});
