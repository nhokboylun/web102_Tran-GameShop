/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
 */

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from "./games.js";

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 */

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
  // loop over each item in the data
  games.forEach((item) => {
    // create a new div element, which will become the game card
    const gameCard = document.createElement("div");
    // add the class game-card to the list\
    gameCard.className = "game-card";
    // set the inner HTML using a template literal to display some info
    // about each game
    const imgPath = item.img.length !== 0 ? item.img : " ";

    gameCard.innerHTML = `
        <img src="${imgPath}" alt="${item.name} game-image" class="game-img">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p>Backers: ${item.backers}</p>
        <p>Goal: ${item.goal}</p>
        <p>Pledged: ${item.pledged}</p>
    `;
    // TIP: if your images are not displaying, make sure there is space
    // between the end of the src attribute and the end of the tag ("/>")
    // append the game to the games-container
    gamesContainer.appendChild(gameCard);
  });
  displayGamesNumbers(games);
  displayRaised(games);
  displayContributions(games);
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
 */

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

function displayContributions(games) {
  // use reduce() to count the number of total contributions by summing the backers

  const totalContributions = games.reduce(
    (prevVal, curVal) => curVal.backers + prevVal,
    0
  );

  // set the inner HTML using a template literal and toLocaleString to get a number with commas
  contributionsCard.innerHTML = `
    ${totalContributions.toLocaleString()}
`;
}

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

function displayRaised(games) {
  const totalRaised = games.reduce(
    (prevVal, curVal) => curVal.pledged + prevVal,
    0
  );

  // set inner HTML using template literal

  raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;
}

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

function displayGamesNumbers(games) {
  gamesCard.innerHTML = `${games.length}`;
}

// For first render only.
showAllGames();

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
 */

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have not yet met their goal
  const unfundedGame = GAMES_JSON.filter((n) => n.pledged < n.goal);

  // use the function we previously created to add the unfunded games to the DOM
  addGamesToPage(unfundedGame);
}

// show only games that are fully funded
function filterFundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have met or exceeded their goal
  const fundedGame = GAMES_JSON.filter((n) => n.pledged >= n.goal);

  // use the function we previously created to add unfunded games to the DOM
  addGamesToPage(fundedGame);
}

// show all games
function showAllGames() {
  deleteChildElements(gamesContainer);

  // add all games from the JSON data to the DOM
  addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", () => filterUnfundedOnly());
fundedBtn.addEventListener("click", () => filterFundedOnly());
allBtn.addEventListener("click", () => showAllGames());

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
 */

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames = GAMES_JSON.filter((n) => n.pledged < n.goal);
const total = GAMES_JSON.reduce(
  (prevVal, curVal) => curVal.pledged + prevVal,
  0
);

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `
    <p>A total of $${total.toLocaleString()} has been raised for ${
  GAMES_JSON.length
} ${GAMES_JSON.length > 1 ? "games" : "game"}. Currently, ${
  unfundedGames.length
} ${
  unfundedGames.length > 1 ? "games" : "game"
} remains unfunded. We need your help to fund these amazing games</p>
`;

// create a new DOM element containing the template string and append it to the description container
const element = document.createElement("div");
element.innerHTML = displayStr;
descriptionContainer.appendChild(element);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
  return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [first, second] = sortedGames;
// create a new element to hold the name of the top pledge game, then append it to the correct element
const topFundedGame = document.createElement("div");
topFundedGame.innerHTML = `${first.name}`;
firstGameContainer.appendChild(topFundedGame);

// do the same for the runner up item
const runnerUp = document.createElement("div");
runnerUp.innerHTML = `${second.name}`;
secondGameContainer.appendChild(runnerUp);

// Bonus for search function
const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", () => {
  const searchInput = document.getElementById("search-input").value;
  filterGamesBySearch(searchInput);
});

function filterGamesBySearch(searchQuery) {
  const filteredGames = GAMES_JSON.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  deleteChildElements(gamesContainer);
  addGamesToPage(filteredGames);
}
