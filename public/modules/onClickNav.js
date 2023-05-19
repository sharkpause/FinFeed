const homeNav = document.getElementById('homeNav');
const profileNav = document.getElementById('profileNav');

homeNav.addEventListener('click', e => {
	e.preventDefault();

	homeNav.classList.add('navbar-on-click');

	window.location.href = '/';
});

profileNav.addEventListener('click', e => {
	e.preventDefault();
	
	profileNav.classList.add('navbar-on-click');

	window.location.href = loggedUser;
});
