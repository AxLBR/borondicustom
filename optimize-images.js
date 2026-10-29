#!/usr/bin/env node

/**
 * Script para otimizar imagens em múltiplos tamanhos
 * Gera versões: thumb (300px) e medium (800px)
 * Uso: npm run optimize-images
 * SUPORTA: JPG, JPEG, PNG e WEBP (converte automaticamente para WEBP)
 * Otimiza: motos, bg, logos e outras imagens
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// No Windows o cache do sharp mantém os arquivos abertos e impede apagá-los
// (erro EBUSY). Desligamos o cache e lemos as imagens para a memória.
sharp.cache(false);

// Configuração de tamanhos
const SIZES = [
  { name: "thumb", width: 300, height: 300 },
  { name: "medium", width: 454, height: 454 },
];

// Formatos aceitos
const SUPPORTED_FORMATS = [".jpg", ".jpeg", ".png", ".webp"];

// Diretórios a processar
const MOTOS_DIR = path.join(__dirname, "public", "src", "images", "motos");
const IMAGES_DIR = path.join(__dirname, "public", "src", "images");
const OPTIMIZED_SUBDIR = "optimized"; // Pasta interna para imagens otimizadas
const LOGO_DIR = path.join(__dirname, "public", "src", "assets", "logo");
const LOGO_WIDTHS = [200, 485, 688, 857, 1010, 1222, 1400];
// Margem transparente do logo antigo, para o novo ter o mesmo tamanho visual:
// o desenho ocupava 87,8% da largura de uma imagem com proporção 1400x1038
const LOGO_ARTE_LARGURA = 0.878;
const LOGO_PROPORCAO = 1400 / 1038;
// Fotos das páginas /customizacao e /revisao (cada subpasta de customizacao
// é um projeto). Gera <nome>.webp (até 1200px) e <nome>-thumb.webp (500px)
const PAGINAS_DIRS = ["customizacao", "revisao"].map((dir) =>
  path.join(IMAGES_DIR, dir),
);
const PAGINAS_LARGURA = 1200;
const PAGINAS_THUMB = 500;

async function optimizeImages() {
  try {
    // Verificar se o diretório existe
    if (!fs.existsSync(MOTOS_DIR)) {
      console.error(`Diretório não encontrado: ${MOTOS_DIR}`);
      process.exit(1);
    }

    // Obter todos os diretórios de motos
    const motoDirs = fs.readdirSync(MOTOS_DIR).filter((dir) => {
      const fullPath = path.join(MOTOS_DIR, dir);
      return fs.statSync(fullPath).isDirectory() && !isNaN(dir);
    });

    console.log(`🏍️ Processando ${motoDirs.length} motos...`);

    for (const motoDir of motoDirs) {
      const motoPath = path.join(MOTOS_DIR, motoDir);
      console.log(`\n📁 Moto ${motoDir}:`);

      // Encontrar todas as imagens (JPG, JPEG, PNG, WEBP)
      const images = fs
        .readdirSync(motoPath)
        .filter((file) => {
          const ext = path.extname(file).toLowerCase();
          const isSupported = SUPPORTED_FORMATS.includes(ext);
          const isNotOptimized =
            !file.includes("-thumb") &&
            !file.includes("-medium") &&
            !file.includes("-temp") &&
            !file.includes(".optimized") &&
            !file.startsWith(".");
          return isSupported && isNotOptimized;
        })
        .sort((a, b) => {
          const numA = parseInt(a);
          const numB = parseInt(b);
          return numA - numB;
        });

      for (const image of images) {
        const inputPath = path.join(motoPath, image);
        const fileExt = path.extname(image).toLowerCase();
        const baseName = path.parse(image).name;
        const webpFileName = `${baseName}.webp`;
        const webpPath = path.join(motoPath, webpFileName);

        // Criar pasta optimized se não existir
        const optimizedPath = path.join(motoPath, OPTIMIZED_SUBDIR);
        if (!fs.existsSync(optimizedPath)) {
          fs.mkdirSync(optimizedPath, { recursive: true });
        }

        try {
          // Obter dados da imagem original
          const inputBuffer = fs.readFileSync(inputPath);
          const metadata = await sharp(inputBuffer).metadata();
          const originalSize = fs.statSync(inputPath).size;

          const squareSize = Math.min(metadata.width, metadata.height);
          const squareOptions = {
            left: Math.floor((metadata.width - squareSize) / 2),
            top: Math.floor((metadata.height - squareSize) / 2),
            width: squareSize,
            height: squareSize,
          };

          console.log(
            `  📸 ${image} (${metadata.width}x${metadata.height} - ${(originalSize / 1024).toFixed(2)}KB)`,
          );

          // Converter para WEBP se não for WEBP
          let processPath = inputPath;
          if (fileExt !== ".webp") {
            console.log(
              `    🔄 Convertendo ${fileExt.toUpperCase()} → WEBP...`,
            );

            await sharp(inputBuffer).webp({ quality: 90 }).toFile(webpPath);

            const webpSize = fs.statSync(webpPath).size;
            const savedPercent = ((1 - webpSize / originalSize) * 100).toFixed(
              1,
            );

            console.log(
              `    ✓ Convertido: ${webpFileName} (${(webpSize / 1024).toFixed(2)}KB - ${savedPercent}% menor)`,
            );

            // Deletar arquivo original (JPG/PNG)
            fs.unlinkSync(inputPath);
            console.log(`    ✓ Arquivo ${fileExt} original removido`);

            processPath = webpPath;
          }

          const squareBase = sharp(fs.readFileSync(processPath)).extract(
            squareOptions,
          );

          // Gerar versões redimensionadas
          for (const size of SIZES) {
            const outputName = `${baseName}-${size.name}.webp`;
            const outputPathFile = path.join(optimizedPath, outputName);

            await squareBase
              .clone()
              .resize(size.width, size.height)
              .webp({ quality: 85 })
              .toFile(outputPathFile);

            const fileSize = fs.statSync(outputPathFile).size;
            console.log(
              `    ✓ ${size.name}: optimized/${outputName} (${(fileSize / 1024).toFixed(2)}KB)`,
            );
          }

          // Remover arquivo original da raiz (não é mais necessário)
          if (fs.existsSync(processPath)) {
            fs.unlinkSync(processPath);
            console.log(`    ✓ Arquivo original removido: ${baseName}.webp`);
          }

          // Remover arquivos .optimized.webp temporários se existirem
          const tempFiles = fs
            .readdirSync(motoPath)
            .filter((file) => file.includes(".optimized.webp"));
          tempFiles.forEach((tempFile) => {
            const tempPath = path.join(motoPath, tempFile);
            fs.unlinkSync(tempPath);
            console.log(`    ✓ Arquivo temporário removido: ${tempFile}`);
          });
        } catch (error) {
          console.error(`    ❌ Erro ao processar ${image}:`, error.message);
        }
      }
    }

    console.log(`\n✨ Imagens de motos otimizadas!`);

    // Otimizar outras imagens (bg, logos, etc)
    console.log(`\n🖼️ Processando outras imagens...`);
    await optimizeOtherImages();

    // Gerar tamanhos do logo
    console.log(`\n🏷️ Processando logo...`);
    await optimizeLogo();

    // Fotos das páginas de customização e revisão
    console.log(`\n🛠️ Processando fotos de customização e revisão...`);
    for (const dir of PAGINAS_DIRS) {
      if (fs.existsSync(dir)) await optimizePaginas(dir);
    }

    // Limpeza de arquivos .optimized
    cleanOptimizedFiles();

    console.log(`\n✨ Otimização completa!`);
  } catch (error) {
    console.error("Erro geral:", error);
    process.exit(1);
  }
}

// Função para remover arquivos .optimized gerados
function cleanOptimizedFiles() {
  console.log(`\n🧹 Limpando arquivos .optimized...`);
  let removedCount = 0;

  // Limpar da pasta de motos
  const motoDirs = fs.readdirSync(MOTOS_DIR).filter((dir) => {
    const fullPath = path.join(MOTOS_DIR, dir);
    return fs.statSync(fullPath).isDirectory() && !isNaN(dir);
  });

  for (const motoDir of motoDirs) {
    const motoPath = path.join(MOTOS_DIR, motoDir);
    const files = fs.readdirSync(motoPath);

    for (const file of files) {
      if (file.includes(".optimized")) {
        const filePath = path.join(motoPath, file);
        try {
          fs.unlinkSync(filePath);
          console.log(`  ✓ Removido: moto/${motoDir}/${file}`);
          removedCount++;
        } catch (error) {
          console.error(`  ❌ Erro ao remover ${file}:`, error.message);
        }
      }
    }
  }

  // Limpar da pasta images geral
  const imageFiles = fs.readdirSync(IMAGES_DIR);
  for (const file of imageFiles) {
    if (file.includes(".optimized")) {
      const filePath = path.join(IMAGES_DIR, file);
      try {
        fs.unlinkSync(filePath);
        console.log(`  ✓ Removido: ${file}`);
        removedCount++;
      } catch (error) {
        console.error(`  ❌ Erro ao remover ${file}:`, error.message);
      }
    }
  }

  console.log(`✨ ${removedCount} arquivo(s) .optimized removido(s)!`);
}

// Nome de arquivo seguro para URL: "Escapamento Antes.png" → "escapamento-antes"
function slugify(nome) {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Converte as fotos de uma pasta (e subpastas) para WebP com nome
// padronizado, remove o original e gera a miniatura. Pode rodar de novo:
// fotos já convertidas só ganham a miniatura, se estiver faltando
async function optimizePaginas(dir) {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const caminho = path.join(dir, entrada.name);

    if (entrada.isDirectory()) {
      await optimizePaginas(caminho);
      continue;
    }

    const ext = path.extname(entrada.name).toLowerCase();
    const base = path.parse(entrada.name).name;
    if (!SUPPORTED_FORMATS.includes(ext) || base.endsWith("-thumb")) continue;

    const slug = slugify(base);
    const destino = path.join(dir, `${slug}.webp`);
    const relativo = path.relative(IMAGES_DIR, destino);

    try {
      if (caminho !== destino) {
        const original = fs.readFileSync(caminho);
        await sharp(original)
          .rotate()
          .resize({ width: PAGINAS_LARGURA, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(destino);
        fs.unlinkSync(caminho);
        console.log(
          `  ✓ ${relativo} (${(original.length / 1024).toFixed(0)}KB → ${(fs.statSync(destino).size / 1024).toFixed(0)}KB, original removido)`,
        );
      }

      const thumb = path.join(dir, `${slug}-thumb.webp`);
      if (!fs.existsSync(thumb)) {
        await sharp(fs.readFileSync(destino))
          .resize({ width: PAGINAS_THUMB, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(thumb);
        console.log(`    ✓ miniatura ${path.relative(IMAGES_DIR, thumb)}`);
      }
    } catch (error) {
      console.error(`  ❌ Erro ao processar ${entrada.name}:`, error.message);
    }
  }
}

// Função para gerar os tamanhos do logo usados nos srcset do site.
// Fonte: assets/logo/logo.(png|jpg|jpeg|webp), que é mantida como matriz.
// Saída: assets/logo/logo-<largura>.webp
async function optimizeLogo() {
  const source = fs
    .readdirSync(LOGO_DIR)
    .find((file) => /^logo\.(png|jpe?g|webp)$/i.test(file));

  if (!source) {
    console.log(`  Nenhum logo.(png|jpg|webp) encontrado em ${LOGO_DIR}`);
    return;
  }

  // Recorta bordas transparentes da matriz e centraliza o desenho numa
  // tela com a margem do logo antigo
  const { data: arte, info: arteInfo } = await sharp(
    fs.readFileSync(path.join(LOGO_DIR, source)),
  )
    .trim()
    .png()
    .toBuffer({ resolveWithObject: true });

  const canvasWidth = Math.round(arteInfo.width / LOGO_ARTE_LARGURA);
  const canvasHeight = Math.round(canvasWidth / LOGO_PROPORCAO);
  const padX = canvasWidth - arteInfo.width;
  const padY = Math.max(0, canvasHeight - arteInfo.height);
  const sourceBuffer = await sharp(arte)
    .extend({
      left: Math.floor(padX / 2),
      right: Math.ceil(padX / 2),
      top: Math.floor(padY / 2),
      bottom: Math.ceil(padY / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  console.log(
    `  📸 ${source} (desenho ${arteInfo.width}x${arteInfo.height} → com margem ${canvasWidth}x${arteInfo.height + padY})`,
  );

  for (const width of LOGO_WIDTHS) {
    const outputName = `logo-${width}.webp`;
    const outputPath = path.join(LOGO_DIR, outputName);

    const info = await sharp(sourceBuffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(outputPath);

    const fileSize = fs.statSync(outputPath).size;
    console.log(
      `    ✓ ${outputName} (${info.width}x${info.height} - ${(fileSize / 1024).toFixed(2)}KB)`,
    );
  }
}

// Função para otimizar outras imagens (bg, logos, etc)
async function optimizeOtherImages() {
  const imagesToOptimize = [
    { pattern: /^bg-.*/, desc: "Backgrounds" },
    { pattern: /^logo.*/, desc: "Logos" },
    { pattern: /^certificad.*/, desc: "Certificados" },
  ];

  for (const imageType of imagesToOptimize) {
    const files = fs.readdirSync(IMAGES_DIR).filter((file) => {
      const ext = path.extname(file).toLowerCase();
      const baseName = path.parse(file).name;
      const isSupported = SUPPORTED_FORMATS.includes(ext);
      const matchesPattern = imageType.pattern.test(file);
      const isNotOptimized =
        !file.includes("-thumb") &&
        !file.includes("-medium") &&
        !file.includes("-original");
      return isSupported && matchesPattern && isNotOptimized;
    });

    if (files.length === 0) continue;

    console.log(`\n${imageType.desc}:`);

    for (const file of files) {
      const inputPath = path.join(IMAGES_DIR, file);
      const fileExt = path.extname(file).toLowerCase();
      const baseName = path.parse(file).name;
      const webpFileName = `${baseName}.webp`;
      const webpPath = path.join(IMAGES_DIR, webpFileName);

      try {
        const inputBuffer = fs.readFileSync(inputPath);
        const metadata = await sharp(inputBuffer).metadata();
        const originalSize = fs.statSync(inputPath).size;
        console.log(
          `  📸 ${file} (${metadata.width}x${metadata.height} - ${(originalSize / 1024).toFixed(2)}KB)`,
        );

        // Converter para WEBP se não for WEBP
        let processPath = inputPath;
        if (fileExt !== ".webp") {
          console.log(`    🔄 Convertendo ${fileExt.toUpperCase()} → WEBP...`);

          await sharp(inputBuffer).webp({ quality: 88 }).toFile(webpPath);

          const webpSize = fs.statSync(webpPath).size;
          const savedPercent = ((1 - webpSize / originalSize) * 100).toFixed(1);

          console.log(
            `    ✓ Convertido: ${webpFileName} (${(webpSize / 1024).toFixed(2)}KB - ${savedPercent}% menor)`,
          );

          // Deletar arquivo original (JPG/PNG)
          fs.unlinkSync(inputPath);
          console.log(`    ✓ Arquivo ${fileExt} original removido`);

          processPath = webpPath;
        }

        // Criar versão medium (para dispositivos médios)
        const processBuffer = fs.readFileSync(processPath);
        const mediumPath = path.join(IMAGES_DIR, `${baseName}-medium.webp`);
        await sharp(processBuffer)
          .resize(1000, 1000, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 82 })
          .toFile(mediumPath);

        const mediumSize = fs.statSync(mediumPath).size;
        console.log(
          `    ✓ medium: ${baseName}-medium.webp (${(mediumSize / 1024).toFixed(2)}KB)`,
        );

        // Criar versão original otimizada
        const originalOptPath = path.join(
          IMAGES_DIR,
          `${baseName}-original.webp`,
        );
        await sharp(processBuffer)
          .webp({ quality: 88 })
          .toFile(originalOptPath);

        const originalOptSize = fs.statSync(originalOptPath).size;
        console.log(
          `    ✓ original: ${baseName}-original.webp (${(originalOptSize / 1024).toFixed(2)}KB)`,
        );
      } catch (error) {
        console.error(`    ❌ Erro ao processar ${file}:`, error.message);
      }
    }
  }
}

// Executar
optimizeImages();
