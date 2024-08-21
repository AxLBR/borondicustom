//Controlador do menuMobile
document.addEventListener('DOMContentLoaded', () => {
  const menuIcon = document.querySelector('.menuMobile > ul > li > img');
  const dropdownMenu = document.querySelector('.menuMobile ul ul');
  
  menuIcon.addEventListener('click', () => {
      dropdownMenu.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
      if (!menuIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
          dropdownMenu.classList.remove('open');
      }
  });

  dropdownMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
          dropdownMenu.classList.remove('open');
          isDropdownOpen = false;
      });
  });
});

// Função para pré-carregar imagens
function preloadImagesForMoto(motoId) {
  let index = 1;
  let imgSrc = `./src/images/motos/${motoId}/${index}.webp`;

  const checkImages = () => {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
          // Incrementa o índice para verificar a próxima imagem
          index++;
          imgSrc = `./src/images/motos/${motoId}/${index}.webp`;
          checkImages(); // Continua carregando as próximas imagens
      };
      img.onerror = () => {
          // Finaliza o loop quando não há mais imagens
          console.log(`Pré-carregamento de imagens da moto ${motoId} concluído.`);
      };
  };

  checkImages();
}

// Pré-carregar imagens ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  reverseMotosJson.forEach(moto => {
      preloadImagesForMoto(moto.id);
  });
});

// Abre moto na modal
function openItem(key) {
  let fullScreen = document.querySelector(".fullScreen");
  let fullScreenContainer = document.querySelector(".fullScreenContainer");
  let main = document.querySelector("main");
  let moto;

  reverseMotosJson.map((item) => {
      if (item.id == key) {
          moto = item;
      }
  });

  let newPrice = moto.price
      .toString()
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

  document.querySelector(".motoHead p").innerHTML =
      moto.model + " (" + moto.year + ")";

  if (moto.sell == "yes") {
      document.querySelector(".motoHead button").textContent = "VENDIDO";
      document.querySelector(".motoHead button").className = "vendido";
  } else {
      document.querySelector(".motoHead button").textContent = "R$" + newPrice;
  }

  document.querySelector(".motoOther").innerHTML = moto.kms;
  document.querySelector(".motoText").innerHTML = moto.description;
  document.querySelector(".motoPayment").innerHTML = moto.credit;
  document.querySelector(".proposalButton").href = "https://wa.me/5191353965?text=Olá, gostaria de informações sobre a " + moto.model + ' (' + moto.year + ')';

  const imageElements = [];
  let index = 1;
  let imgSrc = `./src/images/motos/${key}/${index}.webp`;

  const motoPicturesElement = document.querySelector(".motoPictures");

  // Carregar todas as imagens para o carrossel
  const addImagesToCarousel = () => {
      imageExists(imgSrc, (exists) => {
          if (exists) {
              imageElements.push(
                  `<div class="carrosselFullscreen"><img src="${imgSrc}" title="${moto.model}" alt="Foto ${index} da ${moto.model}"/></div>`
              );
              index++;
              imgSrc = `./src/images/motos/${key}/${index}.webp`;
              addImagesToCarousel();
          } else {
              motoPicturesElement.innerHTML = imageElements.join("");

              if (imageElements.length > 0) {
                  $(motoPicturesElement).slick({
                      dots: true,
                      infinite: true,
                      rows: 1,
                      slidesToShow: 3,
                      slidesToScroll: 3,
                      responsive: [
                          {
                              breakpoint: 1660,
                              settings: {
                                  slidesToShow: 2,
                                  slidesToScroll: 2,
                              },
                          },
                          {
                              breakpoint: 1015,
                              settings: {
                                  rows: 1,
                                  slidesToShow: 2,
                                  slidesToScroll: 2,
                              },
                          },
                          {
                              breakpoint: 802,
                              settings: {
                                  rows: 1,
                                  slidesToShow: 1,
                                  slidesToScroll: 1,
                              },
                          },
                      ],
                  });
              } else {
                  console.error("Nenhuma imagem encontrada para inicializar o slick.");
              }
          }
      });
  };

  addImagesToCarousel();

  $("html").css({ overflowY: "hidden" });
  fullScreen.style.display = "block";
  fullScreenContainer.classList.add("active");
  main.style.filter = "blur(1px)";
}

// Função para verificar a existência da imagem
function imageExists(src, callback) {
  const img = new Image();
  img.onload = () => callback(true);
  img.onerror = () => callback(false);
  img.src = src;
}

// Fecha modal
function closeModal() {
  let fullScreen = document.querySelector(".fullScreen");
  let main = document.querySelector("main");

  document.querySelector(".motoHead p").innerHTML = "";
  document.querySelector(".motoHead button").textContent = "";
  document.querySelector(".motoOther").innerHTML = "";
  document.querySelector(".motoText").innerHTML = "";
  document.querySelector(".motoPayment").innerHTML = "";
  document.querySelector(".motoPictures").innerHTML = "";
  document.querySelector(".motoPictures").className = "motoPictures";
  document.querySelector(".motoHead button").classList.remove("vendido");

  $("html").css({ overflowY: "scroll" });
  fullScreen.style.display = "none";
  main.style.filter = "";
}

// Adiciona ano nos rodapés
document.querySelectorAll(".year").forEach((rodape) => {
  const d = new Date();
  let year = d.getFullYear();

  rodape.innerHTML = year;
});

// Revela objetos conforme scroll da página
function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
      } else {
          reveals[i].classList.remove("active");
      }
  }
}

window.addEventListener("scroll", reveal);

// Botões de navegação
$(document).ready(function () {
  const menuBtn = $(".scroll");
  menuBtn.click(() => {
      setTimeout(() => {
          let downArrowButton = document.querySelector(".downArrow");
          let upArrowButton = document.querySelector(".upArrow");

          if (downArrowButton.style.display != "none") {
              downArrowButton.style.display = "none";
              upArrowButton.style.display = "block";
          } else {
              downArrowButton.style.display = "block";
              upArrowButton.style.display = "none";
          }

          removeHash();
      }, 5);
  });
});

// Dá o scroll de forma suave
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth",
      });
  });
});

// Remove o # do link da página
function removeHash() {
  history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search
  );
}

window.onload = function () {
  removeHash();
};

// Reseta medidas da página para o mobile
function resetHeight() {
  document.body.style.height = window.innerHeight + "px";
}

window.addEventListener("resize", resetHeight);
resetHeight();

// Previne que o usuário dê zoom na página pelo scroll do mouse
document.addEventListener(
  "wheel",
  function touchHandler(e) {
      if (e.ctrlKey) {
          e.preventDefault();
      }
  },
  { passive: false }
);
