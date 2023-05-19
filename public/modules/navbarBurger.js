document.getElementById('navbarBurger').addEventListener('click', e => {
	const navbarMenu = document.querySelector('.navbar-menu')
	navbarMenu.classList.toggle('is-active')
	navbarMenu.classList.add('is-navbar-transparent');
	
	document.querySelector('.navbar-burger').classList.toggle('is-active');

	const makePostForm = document.getElementById('makePostForm')
	if(makePostForm) makePostForm.classList.toggle('form-top-margin');
});
