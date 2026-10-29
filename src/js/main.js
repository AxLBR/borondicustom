//Controlador do menuMobile
document.addEventListener("DOMContentLoaded", () => {
  const menuMobile = document.querySelector(".menuMobile");
  const botaoAbrir = menuMobile.querySelector(".menuMobileBotao");

  function toggleMenu(aberto) {
    menuMobile.classList.toggle("aberto", aberto);
    botaoAbrir.setAttribute("aria-expanded", aberto);
  }

  botaoAbrir.addEventListener("click", () => toggleMenu(true));

  // Fecha ao clicar no X, fora da gaveta ou em qualquer link
  menuMobile
    .querySelectorAll(".menuMobileFechar, .menuMobileFundo, .menuMobilePainel a")
    .forEach((el) => el.addEventListener("click", () => toggleMenu(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleMenu(false);
  });
});

// Função para gerar URLs de imagens em múltiplos tamanhos
function getImageSrcSet(motoId, imageNumber) {
  const basePath = `./src/images/motos/${motoId}/optimized/${imageNumber}`;
  return {
    thumb: `${basePath}-thumb.webp`,
    medium: `${basePath}-medium.webp`,
  };
}

// Função para gerar srcset responsivo
function generateSrcSet(motoId, imageNumber) {
  const urls = getImageSrcSet(motoId, imageNumber);
  return `${urls.thumb} 300w, ${urls.medium} 454w`;
}

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

  // Enviar dados para o Google Tag Manager
  window.dataLayer = window.dataLayer || [];
  const kmsValue = moto.kms.match(/\d+/)
    ? moto.kms.match(/\d+/)[0] + "km"
    : "sem-info";
  window.dataLayer.push({
    event: "product_click",
    ecommerce: {
      items: [
        {
          item_id: `${moto.model.replace(/\s+/g, "-")}-${moto.year}-${kmsValue}`,
          item_name: `${moto.model} (${moto.year})`,
          item_category: "Motos",
          item_variant: moto.year,
          price: parseFloat(moto.price),
          quantity: 1,
        },
      ],
    },
    // Dados adicionais para análise customizada
    product_slot_id: moto.id,
    product_model: moto.model,
    product_year: moto.year,
    product_kms: moto.kms,
    product_status: moto.sell,
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
    document.querySelector(".motoHead button").className = "motoPrice-modal";
  }

  document.querySelector(".motoOther").innerHTML = moto.kms;
  document.querySelector(".motoText").innerHTML = moto.description;
  document.querySelector(".motoPayment").innerHTML = moto.credit;

  if (moto.sell == "yes") {
    document.querySelector(".proposalButton").style.display = "none";
  } else {
    document.querySelector(".proposalButton").style.display = "block";
    const whatsappUrl =
      "https://wa.me/5551991353965?text=Olá, gostaria de informações sobre a " +
      moto.model +
      " (" +
      moto.year +
      ")";
    document.querySelector(".proposalButton").href = whatsappUrl;

    // Adicionar evento de clique para rastreamento GTM
    document.querySelector(".proposalButton").onclick = function () {
      const kmsValue = moto.kms.match(/\d+/)
        ? moto.kms.match(/\d+/)[0] + "km"
        : "sem-info";

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "whatsapp_proposal",
        product_id: `${moto.model.replace(/\s+/g, "-")}-${moto.year}-${kmsValue}`,
        product_name: `${moto.model} (${moto.year})`,
      });
    };
  }

  const imageElements = [];
  const motoPicturesElement = document.querySelector(".motoPictures");

  // Carregar imagens dinamicamente baseado no campo totalImages de cada moto
  const maxImages = moto.totalImages || 5;
  for (let i = 1; i <= maxImages; i++) {
    const currentUrls = getImageSrcSet(key, i);
    const srcSet = generateSrcSet(key, i);
    const loading = i > 3 ? 'loading="lazy"' : "";

    imageElements.push(
      `<div class="carrosselFullscreen"><img class="moto-image" src="${currentUrls.medium}" srcset="${srcSet}" sizes="(max-width: 768px) 100vw, 454px" ${loading} decoding="async" onerror="this.parentElement.style.display='none'" onload="this.classList.add('loaded')" title="${moto.model}" alt="Foto ${i} da ${moto.model}"/></div>`,
    );
  }

  motoPicturesElement.innerHTML = imageElements.join("");

  if (imageElements.length > 0) {
    // Verificar se jQuery e Slick estão carregados antes de inicializar
    if (
      typeof jQuery !== "undefined" &&
      typeof jQuery.fn.slick !== "undefined"
    ) {
      $(motoPicturesElement).slick({
        dots: true,
        infinite: true,
        rows: 1,
        slidesToShow: 3,
        slidesToScroll: 3,
        lazyLoad: "ondemand",
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
      console.error("jQuery ou Slick não está carregado ainda");
    }
  }

  $("html").css({ overflowY: "hidden" });
  fullScreen.style.display = "block";
  fullScreenContainer.classList.add("active");
  main.style.filter = "blur(1px)";
}

// Função para fechar modal

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

// No desktop (mesmo breakpoint do menu completo), clicar fora da modal fecha;
// no mobile não, para evitar fechamentos acidentais ao rolar/tocar
const fullScreenFundo = document.querySelector(".fullScreen");
const desktopQuery = window.matchMedia("(min-width: 1016px)");

if (fullScreenFundo) {
  fullScreenFundo.addEventListener("click", (e) => {
    if (e.target === fullScreenFundo && desktopQuery.matches) {
      closeModal();
    }
  });
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

// Botão de voltar ao topo: aparece só depois que a página é rolada
const voltarTopo = document.querySelector(".voltarTopo");

function toggleVoltarTopo() {
  voltarTopo.classList.toggle("visivel", window.scrollY > 50);
}

window.addEventListener("scroll", toggleVoltarTopo);
toggleVoltarTopo();

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
    window.location.pathname + window.location.search,
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
  { passive: false },
);
