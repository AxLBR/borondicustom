//Abre video na modal
function openItem (key){
  let fullScreen = document.querySelector('.fullScreen');
  let moto;

  reverseMotosJson.map((item, index) => {
    if (item.id == key){
      moto = item;
    }
})

  let newPrice = moto.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

  document.querySelector('.motoHead p').innerHTML = moto.model + ' ('+ moto.year +')';

  if (moto.sell == 'yes'){
    document.querySelector('.motoHead button').textContent  = 'VENDIDO';
    document.querySelector('.motoHead button').className  = 'vendido';
  } else{
    document.querySelector('.motoHead button').textContent  = 'R$'+ newPrice;
  }
  
  document.querySelector('.motoOther').innerHTML = moto.kms;
  document.querySelector('.motoText').innerHTML = moto.description;

  for(let i=1; i<=4; i++){
    document.querySelector(".motoPictures").innerHTML += `<div class="carrosselFullscreen"><img src="./src/images/motos/${key}/foto${i}.webp"/></div>`;
  }

  $(document).ready(function(){
    $('.motoPictures').slick({
    dots: true,
    infinite: false,
    rows: 1,
    slidesToShow: 3,
    slidesToScroll: 3,

    responsive: [{
            breakpoint: 1660,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
            }
        },
        {
          breakpoint: 1015,
          settings: {
              slidesToShow: 2,
              rows: 1,
              slidesToScroll: 1
          }
      },
        {
            breakpoint: 802,
            settings: {
                slidesToShow: 1,
                rows: 1,
                slidesToScroll: 1
            }
        }]
    });
});

  $('html').css({overflowY: 'hidden'});
  fullScreen.style.display = 'block';  
}

//Fecha modal
function closeModal (){
  let fullScreen = document.querySelector('.fullScreen');

  document.querySelector('.motoHead p').innerHTML = '';
  document.querySelector('.motoHead button').textContent  = '';
  document.querySelector('.motoOther').innerHTML = '';
  document.querySelector('.motoText').innerHTML = '';
  document.querySelector(".motoPictures").innerHTML = '';
  document.querySelector(".motoPictures").className = 'motoPictures';
  document.querySelector('.motoHead button').classList.remove('vendido');

  $('html').css({overflowY: 'scroll'});
  fullScreen.style.display = 'none';
}

//Adiciona ano nos rodapés
document.querySelectorAll('.year').forEach(rodape => {
  const d = new Date();
  let year = d.getFullYear();

  rodape.innerHTML = year;
})

//Revela objetos conforme scroll da página
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

//Botões de navegação
$(document).ready(function() {
  const menuBtn = $('.scroll');
  menuBtn.click(() => {
    setTimeout(() => {
      let downArrowButton = document.querySelector('.downArrow');
      let upArrowButton = document.querySelector('.upArrow');

      if(downArrowButton.style.display != 'none'){
        downArrowButton.style.display = 'none';
        upArrowButton.style.display = 'block';
      } else {
        downArrowButton.style.display = 'block';
        upArrowButton.style.display = 'none';
      }

      removeHash();      
    }, 5);
  })
});

//Da o scroll de forma suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

//Remove o # do link da página
function removeHash (){
  history.pushState("", document.title, window.location.pathname + window.location.search);
}

window.onload = function() {
  removeHash();
};

//Reseta medidas da página para o mobile
function resetHeight(){
  document.body.style.height = window.innerHeight + "px";
}

window.addEventListener("resize", resetHeight);
resetHeight();

//Previne que o usuario dê zoom na página pelo scroll do mouse
document.addEventListener("wheel",
  function touchHandler(e) {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  },
  { passive: false }
);



