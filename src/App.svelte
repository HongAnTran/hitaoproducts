<script>
  import { onMount } from "svelte";
  import ProductCard from "./ProductCard.svelte";
  let products = [];
  let categories = [];
  let search = "";
  let selectedCategory = null;
  let loading = true;
  async function fetchProducts() {
    try {
      loading = true;
      const URL =
        "https://script.google.com/macros/s/AKfycbzd8UxotHsnVbJThY3mJNLQX3P6qDTBkyjesPMcFPTyDU2f0VZZKDMIghSZExVdyisO/exec";
      const response = await fetch(URL);
      products = await response.json();
    } catch (error) {
      console.error("fetchProducts error", error);
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    await fetchProducts();
    categories = [...new Set(products.map((p) => p.category))];
  });

  $: filteredProducts = products.filter(
    (p) =>
      (!selectedCategory || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );
</script>

<main>
  <div class="container">
    <div class="input-container">
      <input type="text" placeholder="Tìm sản phẩm..." bind:value={search} />
    </div>
    <div class="categories">
      <button
        on:click={() => (selectedCategory = null)}
        class:selected={!selectedCategory}
      >
        Tất cả
      </button>
      {#each categories as cate}
        <button
          on:click={() => (selectedCategory = cate)}
          class:selected={selectedCategory === cate}
        >
          {cate}
        </button>
      {/each}
    </div>
    {#if loading}
      <div class="grid">
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
      </div>
    {:else}
      <div class="grid">
        {#each filteredProducts as product}
          {#key product.id}
            <ProductCard {product} />
          {/key}
        {/each}
      </div>
      {#if filteredProducts.length === 0}
        <div class="empty"><p>Không tìm thấy sản phẩm nào!</p></div>
      {/if}
    {/if}
  </div>
</main>

<style>
  * {
    font-family: monospace, sans-serif;
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
  }
  /* .container {
    max-width: 1080px;
    margin: auto;
  } */
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    align-items: stretch;
  }
  @media (max-width: 768px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .categories {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  button {
    padding: 10px;
    border: none;
    cursor: pointer;
    background: transparent;
    transition: 0.3;
    color: white;
    /* text-transform: uppercase; */
    font-weight: 600;
  }
  button.selected {
    border-bottom: 1px solid orange;
    color: white;
  }
  button:hover {
    border-bottom: 1px solid orange;

    color: white;
  }
  .input-container {
    padding: 12px;
  }

  .input-container input {
    padding: 12px;
    border-radius: 5px;
    margin-bottom: 10px;
    outline: none;
    width: 100%;
    background-color: transparent;
    border: 1px solid orange;
    color: white;
  }

  .input-container input::placeholder {
    color: white;
  }

  .empty {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 500px;
  }

  .empty p {
    color: white;
    font-size: 20px;
    font-weight: 600;
  }

  .skeleton-card {
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    animation: pulse 1.5s infinite ease-in-out;
    min-height: 300px;
    width: 100%;
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    background: #323232;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  }
  @keyframes pulse {
    0% {
      background: #323232; /* Màu tối */
    }
    100% {
      background: #4f4f4f;
    }
  }
</style>
