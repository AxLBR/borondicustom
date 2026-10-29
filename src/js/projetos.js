/**
 * Conteúdo das páginas /customizacao e /revisao.
 *
 * Fotos: coloque os arquivos em /src/images/customizacao/<n>/ ou
 * /src/images/revisao/ e rode "npm run optimize-images". O script converte
 * para WebP com nome padronizado (ex.: "Escapamento Antes.png" vira
 * "escapamento-antes.webp") e gera a miniatura "<nome>-thumb.webp".
 */

const CUSTOM = "./src/images/customizacao/";
const OFICINA = "./src/images/revisao/";

// Customizações: cada projeto é uma pasta em /images/customizacao.
// - antes + depois: mostra o comparador arrastável
// - foto: projeto com uma foto só (sem comparação)
// - processo: fotos do passo a passo (abrem numa galeria)
let customizacoes = [
  {
    titulo: "Do clássico ao bobber em metal cru",
    categoria: "Customização completa",
    descricao:
      "A moto chegou com visual clássico e saiu irreconhecível. Toda a tinta foi removida até a chapa e protegida com verniz, criando o acabamento em metal cru que é a alma do projeto. Rodas, paralamas, farol, escapes e uma sissy bar feita sob medida completam a transformação, peça por peça.",
    modificacoes: [
      "Guidão, riser e cabos de comando novos",
      "Rodas dianteira e traseira substituídas",
      "Paralama dianteiro trocado",
      "Paralama traseiro encurtado",
      "Piscas e sinaleira traseira novos",
      "Farol circular trocado por um triangular",
      "Pintura removida até a chapa, com verniz de proteção",
      "Escapes substituídos",
      "Plataformas trocadas por pedaleiras",
      "Banco repaginado",
      "Sissy bar totalmente customizada",
    ],
    antes: CUSTOM + "0/antes.webp",
    depois: CUSTOM + "0/depois.webp",
    processo: [1, 2, 3, 4, 5, 6].map((n) => CUSTOM + `0/processo${n}.webp`),
  },
  {
    titulo: "Meteor com postura de chopper",
    categoria: "Royal Enfield Meteor",
    descricao:
      "A Royal Enfield Meteor ganhou atitude. Os alongadores de bengala levantaram a frente, o guidão customizado mudou a posição de pilotagem e o novo farol fechou o visual. Sem os mini piscas dianteiros, a frente ficou mais limpa e marcante.",
    modificacoes: [
      "Farol substituído",
      "Alongadores de bengala instalados",
      "Mini piscas dianteiros removidos",
      "Guidão customizado",
    ],
    antes: CUSTOM + "1/antes.webp",
    depois: CUSTOM + "1/depois.webp",
    processo: [1, 2, 3].map((n) => CUSTOM + `1/processo${n}.webp`),
  },
  {
    titulo: "Escapamento fishtail feito sob medida",
    categoria: "Peça exclusiva",
    descricao:
      "Aqui não é só trocar peça por peça. O escapamento fishtail foi projetado e criado especialmente para esta moto, mudando o desenho da traseira e dando uma personalidade que não se encontra pronta em loja.",
    modificacoes: ["Escapamento fishtail personalizado"],
    antes: CUSTOM + "2/escapamento-antes.webp",
    depois: CUSTOM + "2/escapamento-depois.webp",
  },
  {
    titulo: "Traseira mais baixa, visual mais agressivo",
    categoria: "Suspensão",
    descricao:
      "Com o kit rebaixador de suspensão traseira customizado, a moto ficou mais baixa e ganhou uma postura mais agressiva, mudando a silhueta sem perder o estilo original.",
    modificacoes: ["Kit rebaixador de suspensão traseira customizado"],
    foto: CUSTOM + "3/kit-rebaixador.webp",
  },
];

// Revisão: fotos gerais da oficina (colunas em movimento da seção "Na oficina")
let oficina = [
  {
    foto: OFICINA + "whatsapp-image-2026-08-11-at-19-50-12-2.webp",
    legenda: "Experiência de quem trabalha com motos desde 1999",
  },
  {
    foto: OFICINA + "whatsapp-image-2026-08-11-at-19-50-12-1.webp",
    legenda: "Atenção a cada detalhe",
  },
  {
    foto: OFICINA + "whatsapp-image-2026-08-11-at-19-50-12.webp",
    legenda: "Avaliação completa da moto",
  },
  {
    foto: OFICINA + "whatsapp-image-2026-08-11-at-19-50-13.webp",
    legenda: "Ferramentas certas para cada ajuste",
  },
  {
    foto: OFICINA + "whatsapp-image-2026-10-29-at-15-11-07.webp",
    legenda: "Motos de qualquer marca e cilindrada",
  },
];

// Miniatura gerada pelo optimize-images.js ("foto.webp" → "foto-thumb.webp")
function miniatura(foto) {
  return foto.replace(/\.webp$/, "-thumb.webp");
}
