<script>
  export let product;
  let activeVariant = product.variants[0]; // Mặc định lấy variant đầu tiên
  function formatCurrency(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  let options = [];
  product.variants.forEach((variant) => {
    if (!options[0]) options[0] = new Set();
    if (!options[1]) options[1] = new Set();

    options[0].add(variant.option_1);
    options[1].add(variant.option_2);
  });

  options = options.map((option) => [...option]);

  let selectedOptions = {
    option_1: activeVariant.option_1,
    option_2: activeVariant.option_2,
  };

  function selectOption(type, value) {
    selectedOptions[type] = value;

    const foundVariant = product.variants.find(
      (v) =>
        v.option_1 === selectedOptions.option_1 &&
        v.option_2 === selectedOptions.option_2
    );

    if (foundVariant) {
      activeVariant = foundVariant;
    }
  }
</script>

<div class="product-card">
  {#key activeVariant.image}
    <img class="product-image" src={activeVariant.image} alt={product.name} />
  {/key}
  <div class="options">
    {#each options as optionRow, i}
      <div class="option-row">
        {#each optionRow as option}
          <button
            class="option-btn {selectedOptions[
              i === 0 ? 'option_1' : 'option_2'
            ] === option
              ? 'active'
              : ''}"
            on:click={() =>
              selectOption(i === 0 ? "option_1" : "option_2", option)}
          >
            {option}
          </button>
        {/each}
      </div>
    {/each}
  </div>

  <h3 class="product-name">{product.name}</h3>
  <p class="price">
    {formatCurrency(activeVariant.price)}
    {#if activeVariant.compare_price}
      <span class="compare-price"
        >{formatCurrency(activeVariant.compare_price)}</span
      >
      <span class="discount"
        >-{Math.round(
          (1 - activeVariant.price / activeVariant.compare_price) * 100
        )}%</span
      >
    {/if}
  </p>
  {#if product.description}
    <p class="promo-text">{product.description}</p>
  {/if}

  {#if product.status}
    <span class="badge">{product.status}</span>
  {/if}
</div>

<style>
  .product-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    position: relative;
    background: #323232;
    padding: 24px;
    border-radius: 12px;
    text-align: center;
    color: white;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    transition: 0.3s ease;
  }
  .product-card:hover {
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
    transform: scale(1.01);
    background: #2c2c2c;
  }

  .product-image {
    width: 100%;
    max-width: 265px;
    max-height: 265px;
    object-fit: contain;
    border-radius: 8px;
    transition: all;
    opacity: 0;
    animation: fadeIn 0.3s ease-in forwards;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .options {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }

  .option-btn {
    background: #333;
    color: white;
    border: 1px solid #444;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .option-btn.active {
    /* background: #fff;
      color: black; */
    border: 1px solid orange;
  }

  .product-name {
    font-size: 18px;
    font-weight: bold;
    margin-top: 12px;
  }

  .price {
    margin-top: 12px;
    font-size: 20px;
    font-weight: bold;
    color: orange;
  }

  .compare-price {
    text-decoration: line-through;
    color: #bbb;
    margin-left: 8px;
  }

  .discount {
    color: orange;
    font-size: 14px;
    margin-left: 6px;
  }

  .promo-text {
    color: orange;
    font-size: 14px;
    margin-top: 5px;
  }
  .option-row {
    justify-content: center;
    display: flex;
    gap: 8px;
  }

  .badge {
    position: absolute;
    top: 10px;
    left: 10px;
    border-radius: 50px;
    background-color: orange;
    border: 2px solid orange;
    color: white;
    padding: 4px 6px;
    text-transform: uppercase;
  }
</style>
