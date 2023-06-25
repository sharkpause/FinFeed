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
