const result = document.getElementById("result");
const searchBtn = document.getElementById("search-btn");
const cocktailInput = document.getElementById("cocktail");
const examplesList = document.getElementById("examples-list");
const apiUrl = "https://thecocktaildb.com/api/json/v1/1/search.php?s=";

const searchCocktail = () => {
  const userInput = cocktailInput.value.trim();
  if (!userInput) {
    displayMessage("The input field cannot be empty");
    return;
  }
  searchBtn.disabled = true;
  fetchData(apiUrl + userInput);
};

const displayMessage = (message) => {
  result.innerHTML = `<h3 class="msg">${message}</h3>`;
  const showExamplesList =
    message === "No cocktail found" ||
    message === "The input field cannot be empty";
  examplesList.style.display = showExamplesList ? "block" : "none";
};

const displayCocktailInfo = (data) => {
  const drink = data.drinks ? data.drinks[0] : null;
  if (!drink) {
    displayMessage("No cocktail found");
    return;
  }
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];
    if (ingredient) {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }
  result.innerHTML = `
        <img src="${drink.strDrinkThumb}">
        <h2>${drink.strDrink}</h2>
        <h3>Ingredients:</h3>
        <ul>${ingredients.map((ing) => `<li>${ing}</li>`).join("")}</ul>
        <h3>Instructions:</h3>
        <p>${drink.strInstructions}</p>
    `;
  examplesList.style.display = "none";
};

const fetchData = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      result.innerHTML = "";
      displayCocktailInfo(data);
      searchBtn.disabled = false;
    })
    .catch(() => {
      displayMessage("Error fetching data. Please try again later.");
      searchBtn.disabled = false;
    });
};

const fetchDrinksABC = () => {
  const baseUrl = "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=";
  const letters = ["a", "b", "c"];
  const fetchRequests = letters.map((letter) =>
    fetch(baseUrl + letter).then((response) => response.json())
  );

  return Promise.all(fetchRequests)
    .then((responses) => {
      const drinks = responses.flatMap((response) => response.drinks || []);
      return drinks.map((drink) => drink.strDrink);
    })
    .catch((error) => {
      console.error("Error fetching drinks:", error);
      return [];
    });
};

const displayDrinks = (drinkNames) => {
  const examplesListUl = document.querySelector("#examples-list ul");

  examplesListUl.innerHTML = "";

  drinkNames.forEach((drinkName) => {
    const li = document.createElement("li");
    li.textContent = drinkName;
    examplesListUl.appendChild(li);
  });

  document.getElementById("examples-list").style.display = "block";
};

searchBtn.addEventListener("click", searchCocktail);

fetchDrinksABC().then(displayDrinks);
