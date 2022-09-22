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

		titulo: "Juego de cartas <em>Harry Potter</em>",
		subtitlo: "Tenes que combinar las cartas que aparecen en menos de 5 minutos",

		cards: [],
		cardsCorrectas: [],
		cantidadFlipped: 0,
		puedeVoltear: true,
		intentos: 0,
		isLoading: true,
		isPlaying: false,
		isDone: false,
		totalCards: 0,

		timerCount: 300,
		// timerCount: 10,
		intervalTimer: null

	},

	methods: {
		darVuelta: (card) => {
			if (!app.isPlaying) {
				return;
			}

			if (app.isDone) {
				return;
			}

			if (card.guessed) {
				return;
			}

			if (card.isFlipped) {
				return;
			}

			if (app.puedeVoltear) {
				card.isFlipped = !card.isFlipped;
				app.cantidadFlipped++;
			}
		},

		jugar: () => {
			app.isPlaying = !app.isPlaying;
			app.startTimer();
		},

		startTimer() {
			this.intervalTimer = setInterval(() => {this.timerCount -= 1}, 1000);
    }
	},

	watch: {
		cantidadFlipped: (cantidadNueva, cantidadVieja) => {
			if (cantidadNueva > 2) {
				app.puedeVoltear = false;
				alert("Hubo un error, recargue la pagina");
			}
			if (cantidadNueva == 2) {
				app.intentos++;
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
		},

		cardsCorrectas: (nuevo, viejo) => {
			if (nuevo.length == app.cards.length / 2) {
				app.isDone = !app.isDone;
				clearInterval(app.intervalTimer);
				app.titulo = "Juego finalizado! Felicitaciones!";
				app.subtitlo = `Cantidad de intentos: ${app.intentos} / Para jugar de nuevo, recargue la pagina!`;
			}
		},

		cards: (nuevo, viejo) => {
			if (nuevo.length === app.totalCards) {
				const imgArray = app.cards.map(card => card.img);

				const images = imgArray.map(imageSrc => {
					return new Promise((resolve, reject) => {
						const img = new Image();
						img.src = imageSrc;
						img.onload = resolve;
						img.onerror = reject;
					});
				});
		
				Promise.all(images).then(() => { 
					console.log("Images loaded!");
					app.isLoading = false;
				}).catch(error => {
					console.error("Some image(s) failed loading!");
					console.error(error.message)
				});

			}
		},

		timerCount: (nuevo, viejo) => {
			if (nuevo == 0) {
				clearInterval(app.intervalTimer);
				app.isDone = !app.isDone;

				if (app.cardsCorrectas.length == app.cards.length / 2) {
					app.titulo = "Juego finalizado! Felicitaciones!";
					app.subtitlo = `Cantidad de intentos: ${app.intentos} / Para jugar de nuevo, recargue la pagina!`;
				} else {
					app.titulo = "Juego finalizado! Has perdido 😞";
					app.subtitlo = `Cantidad de intentos: ${app.intentos} / Para jugar de nuevo, recargue la pagina!`;
				}
			}
		}
	},

	computed: {
    formattedTimeLeft() {
      const timeLeft = this.timerCount
			
      const minutes = Math.floor(timeLeft / 60)
			
      let seconds = timeLeft % 60
			
      if (seconds < 10) {
        seconds = `0${seconds}`
      }
			
      return `${minutes}:${seconds}`
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

		app.totalCards = res.filter(elem => elem.image.length !== 0).length;

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