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

makePostForm.reset();

makePostForm.action = apiURL + 'user/' + loggedUser + '/posts';

makePostForm.addEventListener('submit', async e => {
	if(typeof loggedUser === 'undefined') {
		return alert('You must be logged in to use this feature');
	}

	location.reload();
});

const fileUpload = document.getElementById('file-upload');
fileUpload.addEventListener('change', e => {
	const selectedImage = e.target.files[0];
	const reader = new FileReader();

	reader.onload = e => {
		document.getElementById('pictureContainer').src = e.target.result;

		makePostForm.classList.remove('mt-5');
	}

	reader.readAsDataURL(selectedImage);

	const deleteButton = document.createElement('span');
	deleteButton.innerHTML = `
		<button id="cancelButton" class="button is-blue-color is-transparent-button ml-3" style="margin-top: 6rem;">
			<span class="icon">
				<i class="fa-solid fa-xmark"></i>
			</span>
		</button>
	`;
	document.getElementById('uploadContainer').appendChild(deleteButton);
});
