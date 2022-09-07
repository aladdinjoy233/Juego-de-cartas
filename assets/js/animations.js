function waitForElm(selector) {
	return new Promise(resolve => {
			if (document.querySelector(selector)) {
					return resolve(document.querySelector(selector));
			}

			const observer = new MutationObserver(mutations => {
					if (document.querySelector(selector)) {
							resolve(document.querySelector(selector));
							observer.disconnect();
					}
			});

			observer.observe(document.body, {
					childList: true,
					subtree: true
			});
	});
}

const svgContainer = document.querySelector("#svg");
const animItem = bodymovin.loadAnimation({
	wrapper: svgContainer,
	animType: 'svg',
	loop: false,
	autoplay: false,
	path: './assets/animations/sparkles.json'
})

const button = document.querySelector("button");

button.addEventListener('click', () => {
	animItem.goToAndPlay(0, true);
})