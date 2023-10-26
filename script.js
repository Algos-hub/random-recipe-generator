"use strict";

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

const openModal = (data) => {
  recipe.classList.remove("hidden");
  overlay.classList.remove("hidden");
  const recipeName = data.strMeal;
  const imgURL = data.strMealThumb;
  const YT = data.strYoutube.slice(-11);
  const instructions = data.strInstructions.replaceAll("\r\n", "<br/>");
  const country = data.strArea;
  thumbnail.src = imgURL;
  youtubeURL.src = `https://www.youtube.com/embed/${YT}`;
  title.textContent = recipeName;
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
  recipeSteps.innerHTML = instructions;
  countryRecipe.innerHTML = `(${country})`;
};

const closeModal = () => {
  recipe.classList.add("hidden");
  overlay.classList.add("hidden");
};

for (let i = 0; i < btnsGenerateRecipe.length; i++) {
  btnsGenerateRecipe[i].addEventListener("click", function () {
    getData();
  });
}

btnCloseRecipe.addEventListener("click", function () {
  closeModal();
  document.querySelector(".list").innerHTML = "";
});

overlay.addEventListener("click", function () {
  closeModal();
  document.querySelector(".list").innerHTML = "";
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !recipe.classList.contains("hidden")) {
    closeModal();
    document.querySelector(".list").innerHTML = "";
  }
});

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
    openModal(data[0].meals[0]);
    return data[0].meals[0];
  } catch (error) {
    console.log(error);
  }
};
