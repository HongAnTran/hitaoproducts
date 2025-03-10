<script>
  export let product;
  let activeVariant = product.variants[0]; // Mặc định lấy variant đầu tiên
  function formatCurrency(price) {
    if (!Number(price)) {
      return price;
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  let options = [];
  options[0] = [...new Set(product.variants.map((v) => v.option_1))]; // Lấy danh sách option_1

  options[1] = [
    ...new Set(
      product.variants
        .filter((v) => v.option_1 === activeVariant.option_1)
        .map((v) => v.option_2)
    ),
  ];

  let selectedOptions = {
    option_1: activeVariant.option_1,
    option_2: activeVariant.option_2,
  };

  function selectOption(type, value) {
    selectedOptions[type] = value;

    if (type === "option_1") {
      const validOption2 = product.variants
        .filter((v) => v.option_1 === value)
        .map((v) => v.option_2);

      options[1] = [...new Set(validOption2)];

      if (!options[1].includes(selectedOptions.option_2)) {
        selectedOptions.option_2 = options[1][0];
      }
    }
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
  <div class=" product-image-contaner">
    {#key activeVariant.image}
      <img class="product-image" src={activeVariant.image} alt={product.name} />
    {/key}
  </div>
  <div class="options">
    {#each options as optionRow, i}
      <div class="option-row {i === 1 ? 'no-wrap' : ''}">
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

  <div class="product-content">
    <h3 class="product-name">{product.name} {product.type}</h3>
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
  </div>

  {#if activeVariant.status}
    <span class="badge-hitao">{activeVariant.status}</span>
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
    color: white !important;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    transition: 0.3s ease;
  }
  .product-card:hover {
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
    /* transform: scale(1.01); */
    background: #2c2c2c;
  }

  .product-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: auto;
  }

  .product-image-contaner {
    width: 100%;
    max-width: 265px;
    max-height: 265px;
    min-height: 265px;
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
    margin-bottom: 10px;
  }

  .option-btn {
    all: unset;
    background: #333;
    color: white;
    border: 1px solid #444;
    padding: 10px;
    cursor: pointer;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.3s ease;
    min-width: 42px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .option-btn.active {
    /* background: #fff;
      color: black; */
    border: 1px solid orange;
  }

  .mt-auto {
    margin-top: auto;
  }
  .product-name {
    font-size: 18px;
    font-weight: 500;
    margin-top: 12px;
    color: white !important;
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
    font-size: 16px;

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
    flex-wrap: wrap;
    gap: 8px;
  }

  .badge-hitao {
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 50px;
    background-color: orange;
    border: 2px solid orange;
    color: white;
    padding: 4px 6px;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .product-image-contaner {
      min-height: 155px;
    }
    .product-card {
      padding: 12px;
    }
    .product-name {
      font-size: 14px;
    }
    .price {
      font-size: 14px;
      font-weight: 600;
    }

    .compare-price {
      font-size: 14px;
    }
    .option-btn {
      font-size: 10px;
      padding: 4px;
    }
    .badge-hitao {
      font-size: 10px;
      font-weight: 500;
      padding: 2px 4px;
    }
    .no-wrap {
      overflow-x: auto;
      white-space: nowrap;
      display: flex;
      padding-bottom: 5px;
      justify-content: start;
      max-width: 155px;
      flex-wrap: nowrap;
    }
  }

  @media (max-width: 400px) {
    .product-image-contaner {
      min-height: 135px;
    }
    .no-wrap {
      overflow-x: auto;
      white-space: nowrap;
      display: flex;
      padding-bottom: 5px;
      justify-content: start;
      max-width: 110px;
      flex-wrap: nowrap;
    }
  }
</style>
