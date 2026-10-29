/**
 * Monta as páginas /customizacao e /revisao a partir de projetos.js
 * - Customização: comparador de antes/depois arrastável + fotos do processo
 * - Revisão: mosaico de fotos da oficina
 * Nas duas, as fotos abrem numa galeria em tela cheia
 */

const WHATSAPP = "https://wa.me/5551991353965?text=";

// Evita que textos do projetos.js sejam interpretados como HTML
function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function linkWhatsapp(mensagem) {
  return WHATSAPP + encodeURIComponent(mensagem);
}

function listaChecklist(itens) {
  return itens
    .map(
      (item) =>
        `<li><i class="fas fa-circle-check" aria-hidden="true"></i>${escapar(item)}</li>`,
    )
    .join("");
}

// Ativa as animações .reveal já visíveis sem precisar rolar (main.js)
function revelarVisiveis() {
  if (typeof reveal === "function") reveal();
}

/* CUSTOMIZAÇÃO */
function midiaProjeto(projeto) {
  // Só uma foto: mostra o resultado, sem comparador
  if (!projeto.antes || !projeto.depois) {
    return `
        <div class="comparador comparadorUnico">
          <img src="${projeto.foto}" alt="${escapar(projeto.titulo)}" loading="lazy" />
          <span class="comparadorRotulo comparadorRotuloDepois">Resultado</span>
        </div>`;
  }

  // Cada rótulo fica na camada da sua foto: o recorte (--pos) esconde a
  // foto e o rótulo juntos, como uma máscara
  return `
        <div class="comparador" style="--pos: 50%">
          <div class="comparadorCamada comparadorCamadaDepois">
            <img src="${projeto.depois}" alt="Depois: ${escapar(projeto.titulo)}" loading="lazy" />
            <span class="comparadorRotulo comparadorRotuloDepois">Depois</span>
          </div>
          <div class="comparadorCamada comparadorCamadaAntes">
            <img src="${projeto.antes}" alt="Antes: ${escapar(projeto.titulo)}" loading="lazy" />
            <span class="comparadorRotulo comparadorRotuloAntes">Antes</span>
          </div>
          <div class="comparadorLinha" aria-hidden="true">
            <span class="comparadorAlca"><i class="fas fa-left-right"></i></span>
          </div>
          <input type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois: ${escapar(projeto.titulo)}" />
        </div>`;
}

function montarCustomizacoes(lista) {
  const container = document.querySelector("#listaCustomizacoes");
  if (!container) return;

  container.innerHTML = lista
    .map((projeto, i) => {
      const numero = String(i + 1).padStart(2, "0");
      const processo = projeto.processo || [];
      const longa = projeto.modificacoes.length > 5 ? " checklistDupla" : "";

      const botaoProcesso = processo.length
        ? `<button class="botaoProcesso" data-projeto="${i}">
            <span class="botaoProcessoFotos" aria-hidden="true">
              ${processo
                .slice(0, 3)
                .map((foto) => `<img src="${miniatura(foto)}" alt="" loading="lazy" />`)
                .join("")}
            </span>
            Ver o processo <small>${processo.length} fotos</small>
          </button>`
        : "";

      return `
      <article class="projeto reveal">
        ${midiaProjeto(projeto)}

        <div class="projetoInfo">
          <span class="projetoNumero">${numero}</span>
          <span class="projetoCategoria">${escapar(projeto.categoria)}</span>
          <h3>${escapar(projeto.titulo)}</h3>
          <p class="projetoDescricao">${escapar(projeto.descricao)}</p>
          <h4 class="projetoSubtitulo">O que foi feito</h4>
          <ul class="revisaoChecklist${longa}">${listaChecklist(projeto.modificacoes)}</ul>
          <div class="projetoAcoes">
            <a class="servicoButton" target="_blank" href="${linkWhatsapp(`Olá, vi o projeto "${projeto.titulo}" e quero customizar minha moto!`)}">
              <i class="fab fa-whatsapp"></i>
              QUERO UM PROJETO ASSIM
            </a>
            ${botaoProcesso}
          </div>
        </div>
      </article>`;
    })
    .join("");

  container.querySelectorAll(".comparador:not(.comparadorUnico)").forEach((comparador) => {
    const controle = comparador.querySelector("input");

    controle.addEventListener("input", () => {
      comparador.style.setProperty("--pos", controle.value + "%");
      // Ao interagir, interrompe a animação de dica
      comparador.classList.add("tocado");
    });
  });

  container.querySelectorAll(".botaoProcesso").forEach((botao) => {
    const projeto = lista[botao.dataset.projeto];
    botao.addEventListener("click", () =>
      abrirGaleria({
        rotulo: "PROCESSO",
        titulo: projeto.titulo,
        descricao: projeto.descricao,
        itens: projeto.modificacoes,
        fotos: [projeto.antes || projeto.foto, ...projeto.processo, projeto.depois].filter(Boolean),
      }),
    );
  });
}

/* REVISÃO: duas colunas de fotos da oficina rolando sem parar, em sentidos
   opostos. Cada coluna é repetida uma vez para o loop não ter emenda; a
   cópia fica oculta para leitores de tela */
function montarOficina(lista) {
  const container = document.querySelector("#oficinaFotos");
  if (!container) return;

  const colunas = [
    lista.filter((_, i) => i % 2 === 0),
    lista.filter((_, i) => i % 2 === 1),
  ];

  const foto = (item, copia) => `
        <figure class="oficinaFoto"${copia ? ' aria-hidden="true"' : ""}>
          <img src="${miniatura(item.foto)}" alt="${copia ? "" : escapar(item.legenda)}" loading="lazy" />
          <figcaption>${escapar(item.legenda)}</figcaption>
        </figure>`;

  container.innerHTML = colunas
    .map(
      (coluna) => `
      <div class="oficinaColuna">
        <div class="oficinaTrilho">
          ${coluna.map((item) => foto(item, false)).join("")}
          ${coluna.map((item) => foto(item, true)).join("")}
        </div>
      </div>`,
    )
    .join("");
}

/* GALERIA em tela cheia (dialog), usada pelas duas páginas */
const galeria = document.querySelector(".galeria");
let galeriaAtual = null;
let fotoAtual = 0;

function mostrarFoto(indice) {
  const fotos = galeriaAtual.fotos;
  fotoAtual = (indice + fotos.length) % fotos.length;

  const imagem = galeria.querySelector(".galeriaImagem");
  const legenda = galeriaAtual.legendas ? galeriaAtual.legendas[fotoAtual] : "";
  imagem.classList.add("trocando");
  setTimeout(() => {
    imagem.src = fotos[fotoAtual];
    imagem.alt = legenda || `Foto ${fotoAtual + 1}: ${galeriaAtual.titulo}`;
    imagem.classList.remove("trocando");
  }, 150);

  galeria.querySelector(".galeriaLegenda").textContent = legenda;
  galeria.querySelector(".galeriaContador").textContent =
    `${fotoAtual + 1} / ${fotos.length}`;
  galeria.querySelectorAll(".galeriaMiniaturas button").forEach((mini, i) => {
    mini.classList.toggle("ativa", i === fotoAtual);
  });
}

function abrirGaleria(conteudo) {
  galeriaAtual = conteudo;

  galeria.querySelector(".galeriaInfo .paginaRotulo").textContent = conteudo.rotulo;
  galeria.querySelector(".galeriaInfo h3").textContent = conteudo.titulo;
  galeria.querySelector(".galeriaInfo p").textContent = conteudo.descricao;
  galeria.querySelector(".galeriaInfo .revisaoChecklist").innerHTML = listaChecklist(
    conteudo.itens || [],
  );

  galeria.querySelector(".galeriaMiniaturas").innerHTML = conteudo.fotos
    .map(
      (foto, i) =>
        `<button aria-label="Foto ${i + 1}"><img src="${miniatura(foto)}" alt="" loading="lazy" /></button>`,
    )
    .join("");
  galeria.querySelectorAll(".galeriaMiniaturas button").forEach((mini, i) => {
    mini.addEventListener("click", () => mostrarFoto(i));
  });

  // Uma foto só: esconde setas e miniaturas
  galeria.classList.toggle("fotoUnica", conteudo.fotos.length < 2);

  mostrarFoto(conteudo.inicio || 0);
  document.documentElement.style.overflow = "hidden";
  galeria.showModal();
}

if (galeria) {
  galeria
    .querySelector(".galeriaAnterior")
    .addEventListener("click", () => mostrarFoto(fotoAtual - 1));
  galeria
    .querySelector(".galeriaProxima")
    .addEventListener("click", () => mostrarFoto(fotoAtual + 1));
  galeria
    .querySelector(".galeriaFechar")
    .addEventListener("click", () => galeria.close());

  galeria.addEventListener("close", () => {
    document.documentElement.style.overflow = "";
  });

  galeria.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") mostrarFoto(fotoAtual - 1);
    if (e.key === "ArrowRight") mostrarFoto(fotoAtual + 1);
  });

  // Desktop: clicar fora do conteúdo fecha (mesma regra da modal das motos)
  galeria.addEventListener("click", (e) => {
    if (e.target === galeria && window.matchMedia("(min-width: 1016px)").matches) {
      galeria.close();
    }
  });

  // Celular: deslizar o dedo troca de foto
  const palco = galeria.querySelector(".galeriaPalco");
  let inicioToque = null;
  palco.addEventListener("pointerdown", (e) => (inicioToque = e.clientX));
  palco.addEventListener("pointerup", (e) => {
    if (inicioToque === null) return;
    const distancia = e.clientX - inicioToque;
    inicioToque = null;
    if (Math.abs(distancia) > 50) {
      mostrarFoto(fotoAtual + (distancia < 0 ? 1 : -1));
    }
  });
}

montarCustomizacoes(typeof customizacoes !== "undefined" ? customizacoes : []);
montarOficina(typeof oficina !== "undefined" ? oficina : []);
revelarVisiveis();
window.addEventListener("load", revelarVisiveis);
