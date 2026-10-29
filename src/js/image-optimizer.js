/**
 * image-optimizer.js
 * Utilitários para gerenciar imagens responsivas em todo o site
 * Suporta: backgrounds, logos, certificados e outras imagens
 */

// Função geral para gerar srcset de qualquer imagem
function getResponsiveImageSrcSet(imagePath) {
  const nameWithoutExt = imagePath.replace(/\.[^.]+$/, "");
  return {
    thumb: `${nameWithoutExt}-thumb.webp`,
    medium: `${nameWithoutExt}-medium.webp`,
    original: `${nameWithoutExt}-original.webp`,
    fallback: `${imagePath}`,
  };
}

// Função para gerar srcset string
function generateResponsiveSrcSet(imagePath) {
  const urls = getResponsiveImageSrcSet(imagePath);
  return `${urls.thumb} 300w, ${urls.medium} 454w`;
}

// Função para otimizar backgrounds dinamicamente
function optimizeBackgroundImages() {
  const elements = document.querySelectorAll("[data-bg-image]");

  elements.forEach((el) => {
    const imagePath = el.getAttribute("data-bg-image");
    const urls = getResponsiveImageSrcSet(imagePath);

    // Usar Media Query para carregar imagem correta
    if (window.matchMedia("(max-width: 480px)").matches) {
      el.style.backgroundImage = `url('${urls.thumb}')`;
    } else {
      el.style.backgroundImage = `url('${urls.medium}')`;
    }
  });
}

// Função para otimizar imagens img responsivas dinamicamente
function optimizeImageTags() {
  const images = document.querySelectorAll('img[data-responsive="true"]');

  images.forEach((img) => {
    const src = img.src;
    const urls = getResponsiveImageSrcSet(src);

    if (!img.srcset) {
      img.srcset = generateResponsiveSrcSet(src);
      img.sizes = "(max-width: 802px) 100vw, 454px";
      img.loading = "lazy";
      img.decoding = "async";
    }
  });
}

// Executar otimizações quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  optimizeBackgroundImages();
  optimizeImageTags();
});

// Re-executar em mudanças de viewport
window.addEventListener("resize", () => {
  optimizeBackgroundImages();
});

// Exportar para uso externo
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getResponsiveImageSrcSet,
    generateResponsiveSrcSet,
    optimizeBackgroundImages,
    optimizeImageTags,
  };
}
