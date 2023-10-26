"use strict";

// Assigning constants

const recipe = document.querySelector(".recipe");
const overlay = document.querySelector(".overlay");
const btnCloseRecipe = document.querySelector(".close-recipe");
const btnsGenerateRecipe = document.querySelectorAll(".generate-recipe");
const thumbnail = document.querySelector(".thumbnail");
const youtubeURL = document.querySelector(".youtube");
const title = document.querySelector(".title");
const listItem = document.querySelector(".list");
const countryRecipe = document.querySelector(".country");
const recipeSteps = document.querySelector(".steps");

// Functions

// Fetching API data

function getJSON(url, errorMsg = "Something went wrong!") {
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`${errorMsg} (${res.status})`);
    }
    return res.json();
  });
}

const getData = async () => {
  try {
    const data = await Promise.all([
      getJSON(`https://www.themealdb.com/api/json/v1/1/random.php`),
    ]);
    openRecipe(data[0].meals[0]);
    return data[0].meals[0];
  } catch (error) {
    console.log(error);
  }
};

function openRecipe(data) {
  // Picking and assigning relevant data from API response: type Object

  const recipeName = data.strMeal;
  const imgURL = data.strMealThumb;
  const YT = data.strYoutube.slice(-11);
  const instructions = data.strInstructions.replaceAll("\r\n", "<br/>");
  const country = data.strArea;

  // Rendering

  // Uncover popup and overlay
  recipe.classList.remove("hidden");
  overlay.classList.remove("hidden");

  // Render data

  thumbnail.src = imgURL;
  youtubeURL.src = `https://www.youtube.com/embed/${YT}`;
  title.textContent = recipeName;
  recipeSteps.innerHTML = instructions;
  countryRecipe.innerHTML = country;

  // Scrolling and filtering relevant data from strIngredient1 to strIngredient20

  for (let i = 1; i <= 20; i++) {
    if (
      data[`strIngredient${i}`] !== "" &&
      data[`strIngredient${i}`] !== null
    ) {
      listItem.innerHTML += `<li> ${data[`strIngredient${i}`]} : ${
        data[`strMeasure${i}`]
      }</li>`;
    }
  }
}

// Hide popup and overlay

function closeRecipe() {
  recipe.classList.add("hidden");
  overlay.classList.add("hidden");
}

// Assigning actions to buttons

//Open popup

for (let i = 0; i < btnsGenerateRecipe.length; i++) {
  btnsGenerateRecipe[i].addEventListener("click", function () {
    getData();
  });
}

//Close popup

btnCloseRecipe.addEventListener("click", function () {
  closeRecipe();
  listItem.innerHTML = "";
});

overlay.addEventListener("click", function () {
  closeRecipe();
  listItem.innerHTML = "";
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !recipe.classList.contains("hidden")) {
    closeRecipe();
    listItem.innerHTML = "";
  }
});
