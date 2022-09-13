// card template
let cardTemplate = {
	nombreCompleto: "",
	color: "",
	img: "",
	isFlipped: false,
	guessed: false,
}

let app = new Vue({
	el: "#app",
	data: {
		cards: [],
		cardsCorrectas: [],
		cantidadFlipped: 0,
		puedeVoltear: true
	},

	methods: {
		darVuelta: (card) => {
			if (card.guessed) {
				return;
			}

			if (app.puedeVoltear) {
				card.isFlipped = !card.isFlipped;
				app.cantidadFlipped++;
			}
		}
	},

	watch: {
		cantidadFlipped: (cantidadNueva, cantidadVieja) => {
			if (cantidadNueva > 2) {
				app.puedeVoltear = false;
				alert("Hubo un error, recargue la pagina");
			}
			if (cantidadNueva == 2) {
				app.puedeVoltear = false;

				setTimeout(() => {
					let flippedCards = app.cards.filter(card => card.isFlipped && !card.guessed);

					if (cartasIguales(flippedCards[0], flippedCards[1])) {
						app.cardsCorrectas.push(flippedCards[0]);
						flippedCards.forEach(card => card.guessed = true)
					} else {
						flippedCards.forEach(card => card.isFlipped = false);
					}
					
					app.cantidadFlipped = 0;
					app.puedeVoltear = true;
				}, 1000)

			} else {
				app.puedeVoltear = true;
			}

			console.log(app.cantidadFlipped);
			console.log(app.cardsCorrectas);
		}
	}
})

fetch('http://hp-api.herokuapp.com/api/characters')
	.then(res => res.json())
	.then(res => {

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

function cartasIguales(cartaUno, cartaDos) {
	if (
		cartaUno.nombreCompleto === cartaDos.nombreCompleto &&
		cartaUno.color === cartaDos.color &&
		cartaUno.img === cartaDos.img
		) {
			return true;
		}
	return false;
}