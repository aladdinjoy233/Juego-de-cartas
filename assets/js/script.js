// Card template
let cardTemplate = {
	nombreCompleto: "",
	color: "",
	img: "",
	isVisible: false,
}

let app = new Vue({
	el: "#app",
	data: {
		cards: []
	},
	methods: {
		darVuelta: (card) => {
			card.isVisible = !card.isVisible;
		}
	}
})

fetch('http://hp-api.herokuapp.com/api/characters')
	.then(res => res.json())
	.then(res => {

		console.log(res);

		// Duplicar la cantidad de elementos retornadas
		res = res.concat(res);

		// Darle un orden "random" a los elementos
		shuffle(res);

		res.forEach(element => {

			if (element.image.length === 0) {
				return;
			}

			let card = structuredClone(cardTemplate);
			card.nombreCompleto = element.name;
			card.img = element.image;

			switch (element.house) {
				case "Gryffindor":
					card.color = "#A44A3F";
					break;
				case "Slytherin":
					card.color = "#4a7946";
					break;
				case "Hufflepuff":
					card.color = "#E89C5A";
					break;
				case "Ravenclaw":
					card.color = "#4E598C";
					break;
				default:
					card.color = "#616161";
					break;
			}

			app.cards.push(card)
		});

	});

function shuffle(array) {
	let currentIndex = array.length
	let randomIndex;

	while (currentIndex != 0) {

		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}