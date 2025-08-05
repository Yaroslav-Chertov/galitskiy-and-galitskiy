export const overflow = {
	elements : [document.body],

	on: () => {
		const scrollWidth = window.innerWidth - document.documentElement.clientWidth;

		if (scrollWidth > 0){
			document.body.classList.add('is-fake-scroll');

			overflow.elements.forEach((el) => {
				el.style.setProperty('padding-right', `${scrollWidth}px`);
			});
		}

		document.body.classList.add('is-overflow');
	},
	off: () => {
		if (document.body.classList.contains('is-fake-scroll')) {
			document.body.classList.remove('is-fake-scroll');

			overflow.elements.forEach((el) => {
				el.style.removeProperty('padding-right');
			});
		}

		document.body.classList.remove('is-overflow');
	}
}
