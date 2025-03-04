<script>
  import ProductCard from "./ProductCard.svelte";
  let products = [];
  async function fetchProducts() {
    const URL =
      "https://script.google.com/macros/s/AKfycbx7fE9dPi-Ul8t-upsOsH2xg4G7sxnrj_tI6yGySKzhIVKr9JRMfYy2AM7hC-geR0Q-/exec";
    const response = await fetch(URL);
    products = await response.json();
  }
  fetchProducts();
</script>

<main>
  <div class="container">
    {#each products as product}
      <ProductCard {product} />
    {/each}
  </div>
</main>

<style>
  * {
    font-family: monospace, sans-serif;
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
  }
  .container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    max-width: 800px;
    align-items: stretch;
    margin: auto;
  }

  @media (max-width: 768px) {
    .container {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
