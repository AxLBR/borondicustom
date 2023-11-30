function createItens (item, index){
    //Clona o modelo de itens e preenche com os dados
    let itemMoto = document.querySelector('.itemMoto').cloneNode(true);
    let newPrice = item.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

    itemMoto.setAttribute('data-key', item.id);
    itemMoto.querySelector('.itemMoto div img').src = './src/images/motos/'+ item.id + '/1.webp';
    itemMoto.querySelector('.itemMoto div img').setAttribute('title', item.model);
    itemMoto.querySelector('.itemMoto div img').setAttribute('alt', item.model);
    itemMoto.querySelector('.itemMoto div button').setAttribute('id', item.id);
    itemMoto.querySelector('.itemMoto div button').setAttribute('onclick', 'openItem(' + item.id + ')');
    itemMoto.querySelector('.motoModel').innerHTML = item.model + ' ('+ item.year +')';
    itemMoto.querySelector('.motoPrice').textContent  = 'R$'+ newPrice;
    itemMoto.querySelector('.motoDescription').innerHTML = item.description;
    itemMoto.querySelector('#openItem').setAttribute('onclick', 'openItem(' + item.id + ')');
    
    if(item.sell == 'yes'){
        itemMoto.className  = 'motoVendida';
        itemMoto.querySelector('.motoPrice').textContent  = 'VENDIDO';
        itemMoto.querySelector('.motoPrice').className  = 'vendido';
    }
    
    //Preenche os videos na página
    document.querySelector('.produtos').append(itemMoto);
}

//Listagem dos vídeos
let reverseMotosJson = motosJson.reverse();

reverseMotosJson.map((item, index) => {
    createItens(reverseMotosJson[index], index);
})


$(document).ready(function(){
    $('.produtos').slick({
    dots: false,
    infinite: false,
    rows: 2,
    slidesToShow: 3,
    slidesToScroll: 3,

    responsive: [{
            breakpoint: 1015,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            }
        },
        {
            breakpoint: 1260,
            settings: {
                slidesToShow: 2,
                rows: 2,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 900,
            settings: {
                slidesToShow: 1,
                rows: 2,
                slidesToScroll: 1
            }
        }]
    });
});