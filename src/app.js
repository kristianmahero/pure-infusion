document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      {
        id: 1,
        name: "Kombucha",
        img: "kombucha.jpg",
        price: 30000,
      },
      {
        id: 2,
        name: "Chrysanthemum Tea",
        img: "chrys.jpg",
        price: 26000,
      },
      {
        id: 3,
        name: "Chamomile Tea",
        img: "chamomile.jpg",
        price: 27000,
      },
      {
        id: 4,
        name: "Infused Water",
        img: "infused-water.jpg",
        price: 28000,
      },
      {
        id: 5,
        name: "Elderberry",
        img: "elderberry.jpg",
        price: 29000,
      },
      {
        id: 6,
        name: "Turmeric Latte",
        img: "turmeric.jpg",
        price: 29000,
      },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // Cek Barang pada cart
      const cartItem = this.items.find((item) => item.id == newItem.id);

      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += newItem.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item berdasarkan id
      const cartItem = this.items.find((item) => item.id === id);

      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form validation

const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");
form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// Checkout Click
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  // Sent msg to WA
  // const message = formatMessage(objData);
  // window.open("http://wa.me/6282234958702?text=" + encodeURIComponent(message));
  // transaction token ajax / fetch
  try {
    const response = await fetch("php/placeOrder.php", {
      method: "POST",
      body: data,
    });
    const token = await response.text();
    // console.log(token);
    window.snap.pay(token);
  } catch (err) {
    console.log(err.message);
  }
});

// Format msg
const formatMessage = (obj) => {
  return `Data customer
  Nama : ${obj.name}
  Email : ${obj.email}
  No. Hp : ${obj.phone}
  Data pesanan
  ${JSON.parse(obj.items).map(
    (item) => `${item.name}(${item.quantity} x ${rupiah(item.total)}) \n`
  )}
  Total : ${rupiah(obj.total)}
  Terima Kasih.`;
};

// Konversi price to rupiah

const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
