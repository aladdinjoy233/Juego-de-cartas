fetch('http://hp-api.herokuapp.com/api/characters')
	.then(res => res.json())
	.then(res => {

		console.log(res);


		res.forEach(obj => {
		
			let i = 0;
			if (obj.image.length !== 0) {
				let namePara = document.createElement("p");
				namePara.innerHTML = obj.name;
				namePara.setAttribute("data-card-id", i);
				document.body.appendChild(namePara);

				i++;
			}
					
		});

		let cards = document.querySelectorAll("[data-card-id]");

		cards.forEach(card => card.addEventListener("click", e => {

			let elem = e.target;
			
			if (elem.classList.contains("clicked")) {
				elem.classList.remove("clicked");
			} else {
				elem.classList.add("clicked");
			}

		}));

	});

function cardClicked() {
	console.log(this);
}