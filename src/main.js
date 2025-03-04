import App from "./App.svelte";

const target = document.getElementById("hitaoproducts");

if (target) {
  new App({ target });
}
