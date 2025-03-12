<script>
  import { onMount } from "svelte";
  import ProductCard from "./ProductCard.svelte";
  import FloatingQRButton from "./FloatingQRButton.svelte";
  import FloatingQrButton from "./FloatingQRButton.svelte";
  let products = [];
  let categories = [];
  let search = "";
  let selectedCategory = null;
  let loading = true;
  let showAll = false; // Thêm biến mới

  async function fetchProducts() {
    try {
      loading = true;
      const URL =
        "https://script.google.com/macros/s/AKfycbz1n9xzTw1M6hwQEjUGqN6S6nZnZi_Slm0zaXF3MldgwSKaWDOiCMkqoBmLoFI3J6u5/exec";
      const response = await fetch(URL);
      if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");
      products = await response.json();
    } catch (error) {
      console.error("fetchProducts error", error);
      products = [];
    } finally {
      loading = false;
    }
  }

  onMount(fetchProducts);

  $: categories = [...new Set(products.map((p) => p.category))];
  $: filteredProducts = (products || []).filter(
    (p) =>
      (!selectedCategory || p.category === selectedCategory) &&
      (p.name?.toLowerCase() || "").includes(search.toLowerCase())
  );
  $: displayedProducts = showAll
    ? filteredProducts
    : filteredProducts.slice(0, 20); // Thêm logic hiển thị
</script>

<div class="hitaocontaier container">
  <FloatingQrButton />
  <div class="box-stick">
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
      {#each displayedProducts as product (product.id)}
        <ProductCard {product} />
      {/each}
    </div>
    {#if filteredProducts.length === 0}
      <div class="empty"><p>Không tìm thấy sản phẩm nào!</p></div>
    {:else if filteredProducts.length > 20 && !showAll}
      <div class="show-more">
        <button on:click={() => (showAll = true)}>Xem toàn bộ</button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .show-more {
    text-align: center;
    margin-top: 20px;
  }
  .show-more button {
    padding: 10px 20px;
    background-color: orange;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  * {
    font-family:
      Helvetica Neue,
      Helvetica,
      Arial,
      SF Pro Display,
      sans-serif !important;
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
  }
  /* .container {
    max-width: 1080px;
    margin: auto;
  } */
  .box-stick {
    position: sticky;
    top: 8px;
    z-index: 1;
    background-color: #3e3e3f;
    border-radius: 12px;
  }

  .hitaocontaier {
    position: relative;
    overflow: visible !important;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    align-items: stretch;
  }

  .categories {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
    padding-bottom: 12px;
    justify-content: center;
    padding-left: 8px;
    padding-right: 8px;
  }
  .categories button {
    all: unset;
    padding: 10px;
    border: none;
    cursor: pointer;
    background: transparent;
    transition: 0.3;
    color: white;
    font-weight: 600;
  }

  .product-type {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 12px;
  }

  .product-type h5 {
    color: #ff6600 !important; /* Màu cam đậm hơn để tăng độ tương phản */
    font-size: 26px; /* Tăng nhẹ kích thước */
    font-weight: 700; /* Làm chữ đậm hơn */
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1.5px; /* Tạo khoảng cách chữ giúp dễ đọc hơn */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* Hiệu ứng đổ bóng */
    padding: 10px 0; /* Tạo khoảng cách trên dưới */
    background: linear-gradient(
      90deg,
      rgba(255, 102, 0, 0.2),
      transparent
    ); /* Tạo hiệu ứng nền nhẹ */
    display: inline-block; /* Giữ nền chỉ vừa với nội dung */
    border-radius: 5px; /* Làm mềm góc */
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

  @media (max-width: 768px) {
    .categories {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
    }

    .categories button {
      padding: 0px;
      font-size: 13px;
      text-align: center;
    }

    .product-type h5 {
      font-size: 22px; /* Tăng nhẹ kích thước */
    }
  }
</style>
