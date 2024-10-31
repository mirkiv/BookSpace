let mode = 0;
// if (window.location.pathname === "/register.html") {
// 	mode = 3;
// 	console.log(mode);
// 	let emailInput = document.querySelector("#emailInput"); // ваш input для email
// 	let passwordInput = document.querySelector("#passwordInput");
// 	let submitBtn = document.querySelector("#submitBtn");

// 	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// 	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

// 	submitBtn.addEventListener("click", () => {
// 		const email = emailInput.value;
// 		const password = passwordInput.value;

// 		if (emailRegex.test(email)) {
// 			// alert("Валидный email");
// 			if (passwordRegex.test(password)) {
// 				localStorage.setItem("authorized", "1");
// 				localStorage.setItem("email", email);
// 				localStorage.setItem("password", password);
// 			}
// 		} else {
// 			if (passwordRegex.test(password)) {
// 				alert("Невалидный password");
// 			}
// 			alert("Невалидный email");
// 		}
// 	});
// } else {
let navBtns = document.querySelector("#genres");
navBtns.addEventListener("click", function (event) {
	if (event.target.classList.contains("navBtn")) {
		if (mode !== 1) {
			selectGenreFn(event.target);
		} else {
			filterFoundBooks(event.target);
		}
	}
});

let searchBtn = document.querySelector("#searchButton");
searchBtn.addEventListener("click", searchBook);
let searchInput = document.querySelector("#searchInput");

let body = document.body;

let booksCount = 0;

const API_KEY = "AIzaSyD8nEk0fJUSefkamYMfn5Z9894taXD60e0";
let foundBooksData;
let bookTittle;
let bestSellers;
let foundBooks;
const bestSellersCategories = [
	"fantasy",
	"fantasy",
	"drama",
	"humor",
	"horror",
	"mystery",
	"adventure",
	"romance",
	"historical",
];
let randomCategory = "";
let bestSellersCategory;

//
async function getBestsellers(genre) {
	const API_URL = `https://openlibrary.org/subjects/${genre}.json?limit=30`;

	const response = await fetch(API_URL);
	if (response.status === 200) {
		const data = await response.json();
		bestSellers = data.works;
		console.log(bestSellers);
	} else {
		console.error("Ошибка:", response.status);
	}
}

function getRandomCategory() {
	const randomIndex = Math.floor(Math.random() * bestSellersCategories.length);
	randomCategory = bestSellersCategories[randomIndex];
	return randomCategory;
}

getBestsellers(getRandomCategory())
	.then(() => {
		getBookInfo(bestSellers);
	})
	.then(() => {
		showCategory(getRandomCategory());
	});
function createCards(bookInfo) {
	let cardsContainer = document.querySelector(".bestsellers_cards");
	let createCard = document.createElement("div");
	createCard.classList.add("bestseller_card", `index${bookInfo[4]}`);
	if (mode === 0) {
		createCard.innerHTML = `							<div class="book_cover">
	<img
	class="book_cover_img"
	src="${bookInfo[0]}"
	alt=""
	/>
	
	<button class="favorite_add_btn index${bookInfo[4]}" onclick="addFavorite(this)" >
	<img
	class="favorite_add_icon"
	src="https://www.svgrepo.com/show/13666/heart.svg"
	
	alt="like"
	/>
	</button>
	</div>
	<div class="author poppins-regular">${bookInfo[1]}</div>
	<a href="https://openlibrary.org/${bookInfo[3]}" target="_blank" class="title poppins-bold">
	${bookInfo[2]}
	</a>`;
	} else {
		createCard.innerHTML = `
    <div class="book_cover">
        <img class="book_cover_img" src="${bookInfo[0]}" alt="" />
        
        <button class="favorite_add_btn" onclick="addFavorite(this)">
            <img class="favorite_add_icon index${bookInfo[4]}"  src="https://www.svgrepo.com/show/13666/heart.svg" alt="like" />
        </button>
    </div>
    <div class="author poppins-regular">${bookInfo[1]}</div>
    <a href="https://openlibrary.org/${bookInfo[3]}" target="_blank" class="title poppins-bold">
        ${bookInfo[2]}
    </a>`;
	}

	cardsContainer.append(createCard);
}
function addFavorite(button) {
	if (!localStorage.getItem("favorite")) {
		localStorage.setItem("favorite", "");
	}
	const icon = button.querySelector(".favorite_add_icon");
	let bookIndex = button.classList;

	// if (
	// 	localStorage.getItem("userLogined") &&
	// 	localStorage.getItem("userEmail") &&
	// 	localStorage.getItem("userPassword")
	// ) {
	if (icon.src.includes("heart.svg")) {
		icon.src = "https://www.svgrepo.com/show/449779/heart-s.svg";
		let object = {};
	} else {
		icon.src = "https://www.svgrepo.com/show/13666/heart.svg";
	}

	// } else {
	// 	alert(
	// 		"Зарегистрируйтесь чтобы получить возможность сохранять книги в избранных "
	// 	);
	// }
}
function getBookInfo(bookInfo) {
	if (mode === 1) {
		countText.innerHTML = `(${bookInfo.length}) Книг`;
	}
	console.log(randomCategory);

	clearCards();

	if (mode === 0) {
		for (let i = 0; i < bookInfo.length; i++) {
			let filteredBooks = [];
			filteredBooks.push(
				` https://covers.openlibrary.org/b/id/${bookInfo[i].cover_id}-L.jpg`
			);
			filteredBooks.push(bookInfo[i].authors[0].name || "Автор неизвестен");
			filteredBooks.push(bookInfo[i].title || "Название неизвестно");
			filteredBooks.push(bookInfo[i].key);
			filteredBooks.push(i);
			createCards(filteredBooks);
		}
		booksCount = bookInfo.length;
	} else {
		if (foundBooksData.totalItems === 0) {
			countText.innerHTML = `(0) Книг`;
		}
		console.log(bookInfo);

		for (let i = 0; i < bookInfo.length; i++) {
			booksCount++;
			let filteredBooks = [];

			const imageLink = bookInfo[i].volumeInfo.imageLinks;
			const thumbnail =
				(imageLink && imageLink.thumbnail) ||
				"https://thumbs.dreamstime.com/b/%D0%BE%D1%88%D0%B8%D0%B1%D0%BA%D0%B0-%D0%BA%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D0%BE%D1%80%D0%B0-%D0%B8%D0%BB%D0%BB%D1%8E%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8F-%D0%BA%D0%BE%D0%BD%D1%86%D0%B5%D0%BF%D1%86%D0%B8%D1%86%D0%B8%D1%8F-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%B0-%D0%B4%D0%BB%D1%8F-%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B-234657013.jpg";

			filteredBooks.push(thumbnail);

			const authors = bookInfo[i].volumeInfo.authors;
			const authorName =
				authors && authors.length > 0 ? authors[0] : "Автор неизвестен";

			filteredBooks.push(authorName);
			filteredBooks.push(bookInfo[i].volumeInfo.title || "Название неизвестно");
			filteredBooks.push(bookInfo[i].volumeInfo.previewLink || "");
			createCards(filteredBooks);
		}
	}
}
function showCategory(randomCategory) {
	navBtns.querySelectorAll(".navBtn").forEach((btn) => {
		btn.classList.remove("active");
	});
	if (mode === 0) {
		let randomNumber = Math.floor(Math.random() * 2) + 1;
		switch (randomCategory) {
			case "fantasy":
				let navButton1 = document.querySelector("#fantasy1");
				let navButton2 = document.querySelector("#fantasy2");
				if (randomNumber === 1) {
					navButton1.classList.add("active");
				} else {
					navButton2.classList.add("active");
				}
				break;
			case "drama":
				let navButton3 = document.querySelector("#drama");

				navButton3.classList.add("active");
				break;
			case "humor":
				let navButton4 = document.querySelector("#humor");

				navButton4.classList.add("active");
				break;
			case "horror":
				let navButton5 = document.querySelector("#horror");

				navButton5.classList.add("active");
				break;
			case "mystery":
				let navButton6 = document.querySelector("#mystery");

				navButton6.classList.add("active");
				break;
			case "adventure":
				let navButton7 = document.querySelector("#adventure");

				navButton7.classList.add("active");
				break;
			case "romance":
				let navButton8 = document.querySelector("#romance");

				navButton8.classList.add("active");
				break;
			case "historical":
				let navButton9 = document.querySelector("#historical");

				navButton9.classList.add("active");
				break;
			case "all":
				let navButton10 = document.querySelector("#all");
				navButton10.classList.add("active");
				break;

			default:
				break;
		}
	} else {
		switch (randomCategory) {
			case "Fiction":
				let navButton1 = document.querySelector("#fantasy1");
				navButton1.classList.add("active");

				break;
			case "Fantasy":
				let navButton2 = document.querySelector("#fantasy2");

				navButton2.classList.add("active");
				break;
			case "Drama":
				let navButton3 = document.querySelector("#drama");

				navButton3.classList.add("active");
				break;
			case "Humor":
				let navButton4 = document.querySelector("#humor");

				navButton4.classList.add("active");
				break;
			case "Horror":
				let navButton5 = document.querySelector("#horror");

				navButton5.classList.add("active");
				break;
			case "Mystery":
				let navButton6 = document.querySelector("#mystery");

				navButton6.classList.add("active");
				break;
			case "Adventure":
				let navButton7 = document.querySelector("#adventure");

				navButton7.classList.add("active");
				break;
			case "Romance":
				let navButton8 = document.querySelector("#romance");

				navButton8.classList.add("active");
				break;
			case "Historical":
				let navButton9 = document.querySelector("#historical");

				navButton9.classList.add("active");
				break;
			case "all":
				let navButton10 = document.querySelector("#all");
				navButton10.classList.add("active");
				break;

			default:
				break;
		}
	}
}
function selectGenreFn(btn) {
	clearCards();
	randomCategory = btn.value;
	console.log(randomCategory);
	getBestsellers(randomCategory)
		.then(() => {
			getBookInfo(bestSellers);
		})
		.then(() => {
			showCategory(randomCategory);
		});
}
function clearCards() {
	let cardsContainer = document.querySelector(".bestsellers_cards");
	cardsContainer.innerHTML = "";
}
//

let section1 = document.querySelector("#section1");
let resultText = document.querySelector(".s2_text");
let countText = document.querySelector(".s2_text2");
let foundContainer = document.querySelector(".bestsellers_cards");
function searchBook() {
	let bookTitle = document.querySelector("#searchInput").value;
	console.log(bookTitle);

	if (bookTitle !== "") {
		if (mode === 0) {
			changeModeToFind();
			mode = 1;
		}
		findBooksFn(bookTitle).then(() => {
			getBookInfo(foundBooksData.items);
		});
	} else {
		alert("Поле для поиска не может быть пустым");
	}
}
async function findBooksFn(tittle) {
	let findBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${tittle}&maxResults=40&key=${API_KEY}`;
	const response = await fetch(findBooksUrl);
	if (response.status === 200) {
		foundBooksData = await response.json();
		console.log(foundBooksData);
	} else {
		console.error("Ошибка:", response.status);
		alert("Книги не найдены");
	}
}
function changeModeToFind() {
	if (mode !== 1) {
		section1.remove();
		resultText.textContent = "Результаты";
		countText.textContent = "() Книг";
		foundContainer.innerHTML = "";
		let genres = document.querySelector("#genres");
		let createAllBtn = document.createElement("li");
		createAllBtn.classList.add("genre");
		createAllBtn.innerHTML = `
	<button class="navBtn" value="all" id="all">
				Все
		</button>`;
		navBtns.append(createAllBtn);
		randomCategory = "all";
		showCategory(randomCategory);
		let btn1 = document.querySelector("#fantasy1");
		let btn2 = document.querySelector("#fantasy2");
		let btn3 = document.querySelector("#drama");
		let btn4 = document.querySelector("#humor");
		let btn5 = document.querySelector("#horror");
		let btn6 = document.querySelector("#mystery");
		let btn7 = document.querySelector("#adventure");
		let btn8 = document.querySelector("#romance");
		let btn9 = document.querySelector("#historical");
		btn1.value = "Fiction";
		btn2.value = "Fantasy";
		btn3.value = "Drama";
		btn4.value = "Humor";
		btn5.value = "Horror";
		btn6.value = "Mystery";
		btn7.value = "Adventure";
		btn8.value = "Romance";
		btn9.value = "Historical";
	}
}
//
function filterFoundBooks(btn) {
	if (randomCategory !== btn.value) {
		showCategory(btn.value);
		randomCategory = btn.value;
		let filteredBooks = [];

		if (randomCategory === "all") {
			getBookInfo(foundBooksData.items);
			return foundBooksData.items;
		} else {
			for (let i = 0; i < foundBooksData.items.length; i++) {
				const book = foundBooksData.items[i];
				console.log(book);

				// Проверяем, существует ли categories и не пустой ли он
				if (
					book.volumeInfo.categories &&
					book.volumeInfo.categories.length > 0
				) {
					// Используем includes для проверки наличия жанра
					if (book.volumeInfo.categories[0].includes(randomCategory)) {
						filteredBooks.push(book);
					}
				}
			}
			console.log(filteredBooks);

			getBookInfo(filteredBooks);
		}
	}
}
// }
