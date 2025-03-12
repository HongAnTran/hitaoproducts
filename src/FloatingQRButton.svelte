<script>
  let isPopupOpen = false; // Trạng thái để kiểm soát popup

  // Hàm mở/đóng popup
  function togglePopup() {
    isPopupOpen = !isPopupOpen;
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    }
  }

  // Đóng popup khi click bên ngoài
  function closePopup(event) {
    if (event.target.classList.contains("popup-overlay")) {
      isPopupOpen = false;
      document.body.style.overflow = "auto";
    }
  }
</script>

<div class="floating-button">
  <button on:click={togglePopup} title="QR code thanh toán" class="ping">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <path d="M10 3v4M14 10v4M10 14v7M3 10h7M14 3h7" />
    </svg>
  </button>

  {#if isPopupOpen}
    <div class="popup-overlay" on:click={closePopup}>
      <div class="popup-content">
        <img
          src="https://hitaothom.com/wp-content/uploads/2025/02/5F3886C2-40BE-4278-A27E-718CBC060E18-removebg-preview.png"
          alt="QR Code"
        />
      </div>
    </div>
  {/if}
</div>

<style>
  .floating-button {
    position: fixed;
    bottom: 140px;
    right: -10px;
    z-index: 1000; /* Đảm bảo nút luôn nằm trên cùng */
  }

  .floating-button button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #323232;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;
  }

  /* .floating-button button:hover {
    background-color: #0056b3;
  } */

  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* Nền mờ */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }

  .popup-content {
    background: white;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  .popup-content img {
    max-width: 100%;
    height: auto;
  }

  .close-button {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .close-button:hover {
    background-color: #c82333;
  }

  @keyframes ping {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }

  .ping {
    position: relative;
    /* width: 20px;
    height: 20px;
    border-radius: 50%; */
  }

  .ping::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: orange;
    border-radius: 50%;
    opacity: 0.75;
    animation: ping 1s infinite ease-out;
  }
</style>
