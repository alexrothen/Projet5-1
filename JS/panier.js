// ----------------------IMPORT
import { formatPrice } from "./main.js";

// -----------------------------------------RECUPERATION DU PANIER
const cart = JSON.parse(localStorage.getItem("itemCart"));

// -----------------------------------------VARIABLES (DOM)
const form = document.getElementById("form");
const formBlock = document.getElementById("formBlock");
const totalAmount = document.getElementById("totalAmount");
const orderBtn = document.getElementById("orderBtn");
const container = document.getElementById("mainBlock");
container.className = "container-fluid d-flex row mx-auto pb-5 col-12";

checkCart(); // VERIFICATION DU PANIER

for (const i in cart) {
  createCartBlock(cart[i]); // CREATION DES BLOCS ITEMS
}
sendData(); // ENVOI DES DONNEES

// ---------------------------------FONCTION : CREER LE BLOC ITEM
function createCartBlock(item) {
  const cartBlock = document.createElement("section");
  cartBlock.className =
    "row mx-auto pt-0 col-lg-10 col-md-11 shadow-sm pt-3 mb-5 bg-white rounded ";

  const imgBlock = document.createElement("div");
  imgBlock.className = "d-flex col-lg-6 col-md-6 align-items-start mx-auto";

  const asideBlock = document.createElement("aside");
  asideBlock.className = "col-lg-6 col-md-6 d-flex flex-column p-0";
  asideBlock.style.height = "fit-content";

  const asideList = document.createElement("ul");
  asideList.className = "d-flex list-group-flush row col-12 mb-0";

  const itemName = document.createElement("li");
  itemName.className = "text-left list-group-item col-12";

  const itemDescription = document.createElement("li");
  itemDescription.className = "text-justify list-group-item col-12";

  const itemPrice = document.createElement("li");
  itemPrice.className =
    "d-flex justify-content-end col-lg-8 col-md-8 pt-4 list-group-item";

  const itemOptions = document.createElement("li");
  itemOptions.className = "text-left list-group-item col-12";

  const itemQuantity = document.createElement("li");
  itemQuantity.className = "text-left list-group-item col-lg-4 col-md-4 ";

  const itemQuantitySelect = document.createElement("select");
  itemQuantitySelect.className = "form-control";

  let itemQuantityOption = document.createElement("option");
  itemQuantityOption.className = "option";

  const subTotal = document.createElement("li");
  subTotal.className =
    "subTotal text-right font-weight-bold list-group-item col-12";

  const removeBtn = document.createElement("button");
  removeBtn.className = "removeBtn close col-1 d-flex ml-auto p-4";

  setAttributes(removeBtn, {
    type: "button",
    "aria-label": "close",
  });

  itemName.textContent = item.name;
  itemPrice.textContent = `Prix: ${formatPrice(item.price)} €`;
  itemDescription.textContent = item.description;
  imgBlock.innerHTML = `<img src="${item.imageUrl}" class="img-fluid pb-3">`;
  subTotal.textContent = `Sous-total: ${formatPrice(item.subTotal)} €`;
  itemOptions.textContent = item.options;
  removeBtn.innerHTML = '<span class="pt-2" aria-hidden="true">&times;</span>';

  // LOOP DE LA QUANTITE
  for (let i = 1; i <= 20; i++) {
    itemQuantityOption = document.createElement("option");
    itemQuantityOption.setAttribute("value", i);
    itemQuantityOption.innerHTML = i;
    itemQuantitySelect.appendChild(itemQuantityOption);
  }
  // EVENT : CAPTURER LA QUANTITE SELECTIONNEE
  itemQuantitySelect.addEventListener("change", updateQuantity);

  // ARCHITECTURE
  container.appendChild(cartBlock);
  cartBlock.appendChild(imgBlock);
  cartBlock.appendChild(asideBlock);
  asideBlock.appendChild(asideList);
  asideList.appendChild(itemName);
  asideList.appendChild(itemOptions);
  asideList.appendChild(itemQuantity);
  itemQuantity.appendChild(itemQuantitySelect);
  asideList.appendChild(itemPrice);
  asideList.appendChild(subTotal);
  asideList.appendChild(removeBtn);
  retrieveQt(item);
  removeItem(item);

  // ------------------------FONCTION : RECUPERER LA DERNIERE QUANTITE CHOISIE
  function updateQuantity() {
    const quantitySelected =
      itemQuantitySelect.options[itemQuantitySelect.selectedIndex].value; // ...RECUPERATION DE LA QUANTITE SELECTIONNEE
    item.quantity = quantitySelected; // ...LA REMPLACER DANS LE PANIER
    item.subTotal = quantitySelected * item.price; // ...RECALCULER LE SOUS-TOTAL
    localStorage.setItem("itemCart", JSON.stringify(cart)); // ...ENVOYER NOUVELLES DONNEES VERS LE LOCALSTORAGE
    total(); // ...RECALCUL DU TOTAL GENERAL
    totalAmount.textContent = `total : ${formatPrice(total())} €`; // AFFICHAGE DU TOTAL GENERAL
    subTotal.textContent = `Sous-total: ${formatPrice(item.subTotal)} €`;
    console.log(
      `Quantité mise à jour : ${item.quantity} ${item.name} option ${
        item.options
      } ${formatPrice(item.subTotal)} €`
    );
  }

  // ------------------------------FONCTION : SUPPRIMER LE BLOC AU CLICK
  function removeItem(item) {
    removeBtn.addEventListener("click", (e) => {
      e.preventDefault;
      cartBlock.remove(); // SUPPRESSION DU BLOC ITEM...
      cart.splice(cart.indexOf(item), 1); // ... ET DE L'ITEM DANS LE PANIER
      console.log("article supprimé du panier");
      localStorage.setItem("itemCart", JSON.stringify(cart));

      // EN CAS DE SUPPRESSION DE TOUS LES BLOCS :
      if (cart.length === 0) {
        localStorage.removeItem("itemCart"); // ...SUPPRIMER L'ARRAY VIDE DANS LE LOCALSTORAGE
        console.log("Panier vide");
        emptyCart(); // ...PUIS AFFICHER 'PANIER VIDE'
      }
      total(); // RECALCUL DU TOTAL A CHAQUE SUPPRESSION
      totalAmount.textContent = `total : ${formatPrice(total())} €`;
      subTotal.textContent = `Sous-total: ${formatPrice(item.subTotal)} €`;
    });
  }

  // ---------------------------FONCTION : RECUPERER LA QUANTITE CHOISIE SUR LA PAGE PRODUIT
  function retrieveQt(item) {
    // RECUPERATION DE LA QUANTITE SELECTIONNEE SUR LA PAGE PRODUIT...
    const chosenQuantity = itemQuantitySelect.querySelector(
      `[value="${item.quantity}"`
    );
    console.log(
      `Quantité récupérée pour ${item.name} ${item.options}: ${chosenQuantity.value}`
    );

    // ...PUIS L'INTEGRER DANS L'OPTION CORRESPONDANTE VIA L'ATTRIBUT 'SELECTED'
    chosenQuantity.setAttribute("selected", "");
  }
}

// ---------------------------FONCTION : ENVOYER LES DONNEES
function sendData() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const contact = {
      // OBJET CONTACT
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      zip: document.getElementById("zip").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
    };
    const products = []; // ARRAY PRODUITS SELECTIONNES
    cart.forEach((item) => {
      products.push(item._id);
    });

    const order = {
      contact,
      products,
    }; // OBJET COMPLET

    fetch("http://localhost:3000/api/cameras/order/", {
      // REQUETE
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      mode: "cors",
      body: JSON.stringify(order),
    })
      .then((response) => response.json())
      .then((response) => {
        const { orderId } = response; // RECUPERATION DE L'ID DE COMMANDE
        localStorage.setItem("orderId", orderId);
        localStorage.setItem("itemCart", JSON.stringify(cart));
        localStorage.setItem("contact", JSON.stringify(contact));
        localStorage.setItem("totalAmount", formatPrice(total())); // ENVOI DU TOTAL

        form.setAttribute("action", `${window.location.replace("conf.html")}`);
      });
    e.stopPropagation();
  });
}

// --------------------------------FONCTION : VERIFIER L'ETAT DU PANIER
function checkCart() {
  if (!cart) {
    // SI LE PANIER EST VIDE...
    emptyCart(); // ...AFFICHER 'PANIER VIDE !'
  } else {
    total();
    totalAmount.textContent = `total : ${formatPrice(total())} €`; // AFFICHAGE DU TOTAL GENERAL
  }
}

// ---------------------------------FONCTION : AFFICHER 'PANIER VIDE !'
function emptyCart() {
  formBlock.remove();
  const emptyCart = document.createElement("h2");
  emptyCart.className =
    "text-center display-4 mt-5 pt-5 ml-3 col-11 d-flex p-2 justify-content-center";
  emptyCart.textContent = "Panier vide !";
  container.appendChild(emptyCart);
}

// ---------------------------------FONCTION : CALCUL DU TOTAL
function total() {
  let total = 0;
  for (const i in cart) {
    total += cart[i].subTotal;
  }
  return total;
}

// -----------------------------------FONCTION : INTEGRER PLUSIEURS ATTRIBUTS A LA FOIS
function setAttributes(element, options) {
  Object.keys(options).forEach((attribute) => {
    element.setAttribute(attribute, options[attribute]);
  });
}

// -------------------------------------BOUTON : DESACTIVÉ SI LE FORMULAIRE EST INCOMPLET
form.addEventListener("change", () => {
  if (form.checkValidity() === true) {
    orderBtn.removeAttribute("disabled");
  } else {
    orderBtn.setAttribute("disabled", "");
  }
});
