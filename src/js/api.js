function createItens(item, index) {
  //Clona o modelo de itens e preenche com os dados
  let itemMoto = document.querySelector(".itemMoto").cloneNode(true);
  let newPrice = item.price
    .toString()
    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

  itemMoto.setAttribute("data-key", item.id);

  const imgElement = itemMoto.querySelector(".itemMoto div img");
  imgElement.src = "./src/images/motos/" + item.id + "/optimized/1-thumb.webp";
  imgElement.setAttribute("title", item.model);
  imgElement.setAttribute("alt", item.model);
  imgElement.setAttribute("decoding", "async");

  itemMoto.querySelector(".itemMoto div button").setAttribute("id", item.id);
  itemMoto
    .querySelector(".itemMoto div button")
    .setAttribute("onclick", "openItem(" + item.id + ")");
  itemMoto.querySelector(".motoModel").innerHTML =
    item.model + " (" + item.year + ")";
  itemMoto.querySelector(".motoPrice").textContent = "R$" + newPrice;
  itemMoto.querySelector(".motoDescription").innerHTML = item.description;
  itemMoto
    .querySelector("#openItem")
    .setAttribute("onclick", "openItem(" + item.id + ")");

  if (item.sell == "yes") {
    itemMoto.className = "motoVendida";
    itemMoto.querySelector(".motoPrice").textContent = "VENDIDO";
    itemMoto.querySelector(".motoPrice").className = "vendido-out";
    itemMoto.querySelector("#openItem").onclick = null;
    itemMoto.querySelector("#openItem").style.cursor = "default";

    const linkImgElement = itemMoto.querySelector(".linkImg");
    linkImgElement.onclick = null;
    linkImgElement.style.cursor = "default";
  }

  //Preenche as motos na página
  document.querySelector(".produtos").append(itemMoto);
}

//Listagem das motos
let reverseMotosJson = motosJson;

reverseMotosJson.map((item, index) => {
  createItens(reverseMotosJson[index], index);
});

// Só abre a modal com clique único: se o ponteiro andou mais de 5px entre
// apertar e soltar (arrastou o carrossel), o clique é descartado. O listener
// em captura roda antes do onclick dos cards
const produtosElement = document.querySelector(".produtos");
let inicioClique = null;

produtosElement.addEventListener("pointerdown", (e) => {
  inicioClique = { x: e.clientX, y: e.clientY };
});

produtosElement.addEventListener(
  "click",
  (e) => {
    // detail 0 = clique pelo teclado (Enter/Espaço), sem ponteiro
    if (e.detail === 0 || !inicioClique) return;

    const distancia = Math.hypot(
      e.clientX - inicioClique.x,
      e.clientY - inicioClique.y,
    );
    inicioClique = null;

    if (distancia > 5) {
      e.stopPropagation();
      e.preventDefault();
    }
  },
  true,
);

$(document).ready(function () {
  $(".produtos").slick({
    dots: false,
    infinite: false,
    // Uma linha só: slidesPerRow só vale com rows > 1, então a quantidade
    // por tela é definida com slidesToShow
    slidesToShow: 3,
    slidesToScroll: 3,
    lazyLoad: "ondemand",
    waitForAnimate: false,

    responsive: [
      {
        // 3 por linha em telas de 1280px, com folga para a barra de rolagem
        breakpoint: 1240,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1020,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
});
