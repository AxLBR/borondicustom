# 📸 Guia de Otimização de Imagens - Borondi Custom

Este guia explica como adicionar novas motos ao site e otimizar as imagens para garantir melhor performance e economia de dados do Firebase.

---

## 📋 Índice

1. [Como Adicionar uma Nova Moto](#-como-adicionar-uma-nova-moto)
2. [Como Otimizar as Imagens](#-como-otimizar-as-imagens)
3. [Estrutura de Pastas](#-estrutura-de-pastas)
4. [Benefícios da Otimização](#-benefícios-da-otimização)
5. [Troubleshooting](#-troubleshooting)

---

## 🏍️ Como Adicionar uma Nova Moto

### Passo 1: Criar a pasta da moto

1. Navegue até: `public/src/images/motos/`
2. Crie uma nova pasta com o **número sequencial** da moto (ex: `9`, `10`, `11`, etc.)
3. A numeração deve seguir a ordem existente

**Exemplo:**

```
public/src/images/motos/
├── 0/
├── 1/
├── 2/
...
├── 8/
└── 9/  ← Nova moto
```

### Passo 2: Adicionar as imagens

1. Coloque as fotos da moto na pasta criada
2. Nomeie as imagens como: `1.jpg`, `2.png`, `3.webp`, etc. (ordem numérica)
3. A primeira imagem (`1.*`) será exibida no carrossel principal

**Formatos aceitos:**

- ✅ **JPG/JPEG** - Será convertido automaticamente para WEBP
- ✅ **PNG** - Será convertido automaticamente para WEBP
- ✅ **WEBP** - Formato ideal (já otimizado)
- ❌ **GIF/BMP/TIFF** - Não suportados

**Configuração recomendada:**

- Tamanho: Qualquer (o script otimizará automaticamente)
- Resolução: Quanto maior melhor (recomendado: 1080x1080 ou superior)
- **Dica:** Você pode adicionar JPG/PNG direto que o script converte!

**Exemplo:**

```
public/src/images/motos/9/
├── 1.jpg   ← Será convertido para 1.webp
├── 2.png   ← Será convertido para 2.webp
├── 3.webp  ← Já está no formato correto
├── 4.jpg
└── 5.png
```

**Após otimização:**

```
public/src/images/motos/9/
├── optimized/
│   ├── 1-thumb.webp   (gerado)
│   ├── 1-medium.webp  (gerado)
│   └── ...
├── 1.webp  ← Convertido + otimizado
├── 2.webp  ← Convertido + otimizado
├── 3.webp  ← Otimizado
├── 4.webp  ← Convertido + otimizado
└── 5.webp  ← Convertido + otimizado
```

> 💡 **Importante:** Os arquivos JPG/PNG originais são **deletados automaticamente** após conversão para WEBP!

### Passo 3: Atualizar o arquivo motos.js

1. Abra: `public/src/js/motos.js`
2. Adicione um novo objeto no array `motosJson` com os dados da moto:

```javascript
{
    id: 9,  // Mesmo número da pasta
    model: 'Harley-Davidson Street 750',
    year: '2020',
    price: '45000',
    kms: '12 mil km rodados',
    description: 'Toda original • Pneus novos • Revisões em dia',
    sell: 'no',  // 'yes' se vendida, 'no' se disponível
    credit: 'AVALIAMOS TROCA | Entrada facilitada em até 18x | Parcelamos sua moto em até 48x',
}
```

### Passo 4: Otimizar as imagens

Execute o script de otimização (veja próxima seção)

---

## ⚡ Como Otimizar as Imagens

### Pré-requisitos

Certifique-se de que as dependências estão instaladas:

```bash
npm install
```

### Executar a Otimização

No terminal, na raiz do projeto, execute:

```bash
npm run optimize-images
```

### O que acontece durante a otimização?

O script irá:

1. **Detectar imagens** (JPG, JPEG, PNG, WEBP)
2. **Converter JPG/PNG → WEBP** automaticamente
3. **Deletar arquivos JPG/PNG originais** após conversão
4. **Gerar 3 versões de cada imagem:**
   - `optimized/1-thumb.webp` (300x300) - Carrossel
   - `optimized/1-medium.webp` (800x800) - Modal/detalhes
   - `1.webp` (original otimizada) - Backup/qualidade máxima

5. **Exibir progresso no terminal:**

```
🏍️ Processando 10 motos...

📁 Moto 9:
  📸 1.jpg (1080x1080 - 450.50KB)
    🔄 Convertendo JPG → WEBP...
    ✓ Convertido: 1.webp (180.40KB - 60.0% menor)
    ✓ Arquivo .jpg original removido
    ✓ thumb: optimized/1-thumb.webp (28.30KB)
    ✓ medium: optimized/1-medium.webp (85.20KB)
    ✓ original: 1.webp (180.40KB - 0.0% menor)
    ✓ Original substituido pela versao otimizada

  📸 2.png (1200x1200 - 890.20KB)
    🔄 Convertendo PNG → WEBP...
    ✓ Convertido: 2.webp (220.60KB - 75.2% menor)
    ✓ Arquivo .png original removido
    ✓ thumb: optimized/2-thumb.webp (30.10KB)
    ✓ medium: optimized/2-medium.webp (88.40KB)
    ✓ original: 2.webp (220.60KB - 0.0% menor)
    ✓ Original substituido pela versao otimizada

  📸 3.webp (1080x1080 - 200.30KB)
    ✓ thumb: optimized/3-thumb.webp (25.80KB)
    ✓ medium: optimized/3-medium.webp (82.10KB)
    ✓ original: 3.webp (150.20KB - 25.0% menor)
    ✓ Original substituido pela versao otimizada

✨ Imagens de motos otimizadas!
✨ Otimização completa!
```

---

## 📂 Estrutura de Pastas

### Antes da otimização:

```
public/src/images/motos/9/
├── 1.webp  (450 KB)
├── 2.webp  (420 KB)
└── 3.webp  (380 KB)
```

### Depois da otimização:

```
public/src/images/motos/9/
├── optimized/
│   ├── 1-thumb.webp   (28 KB)  ← Carrossel
│   ├── 1-medium.webp  (85 KB)  ← Modal
│   ├── 2-thumb.webp   (26 KB)
│   ├── 2-medium.webp  (82 KB)
│   ├── 3-thumb.webp   (25 KB)
│   └── 3-medium.webp  (80 KB)
├── 1.webp  (180 KB - otimizada!)
├── 2.webp  (170 KB - otimizada!)
└── 3.webp  (160 KB - otimizada!)
```

---

## 💰 Benefícios da Otimização

### Conversão Automática JPG/PNG → WEBP

| Formato | Tamanho Médio | WEBP Equivalente | Economia |
| ------- | ------------- | ---------------- | -------- |
| **JPG** | 450 KB        | 180 KB           | **60%**  |
| **PNG** | 890 KB        | 220 KB           | **75%**  |

**Vantagens do WEBP:**

- 🔥 **25-35% menor** que JPG com mesma qualidade
- 🔥 **60-80% menor** que PNG com mesma qualidade
- ✅ Suportado em **95%+ dos navegadores** modernos
- ⚡ Carregamento **mais rápido** em conexões lentas

### Economia de Dados Firebase

| Versão             | Dados/visita | Visitas/mês (Spark) |
| ------------------ | ------------ | ------------------- |
| **Sem otimização** | ~2.5 MB      | ~4,000              |
| **Com otimização** | ~0.25 MB     | **~40,000**         |

**Resultado: 10x mais visitas sem pagar nada! 🎉**

### Performance do Site

- ⚡ **90% menos dados** carregados no carrossel
- 🚀 **Carregamento mais rápido** da página
- 📱 **Melhor experiência mobile**
- 🌐 **Menor consumo de internet do usuário**
- 🎯 **Conversão automática** de JPG/PNG sem esforço manual

### Armazenamento Firebase

- **Aumento de storage:** ~6.5 MB total (uma única vez)
- **Limite Spark:** 1 GB (você usará apenas ~2%)
- ✅ **Totalmente viável** no plano gratuito

---

## 🔧 Troubleshooting

### Problema: "sharp" não está instalado

**Solução:**

```bash
npm install
```

### Problema: Script não encontra as imagens

**Verifique:**

- As imagens estão em formato suportado? (`.jpg`, `.jpeg`, `.png`, `.webp`)
- O nome da pasta é um número? (ex: `9`, não `moto-9`)
- As imagens estão nomeadas corretamente? (`1.jpg`, `2.png`, `3.webp`, etc.)

### Problema: Imagem em formato não suportado (GIF, BMP, TIFF)

**Solução:** Converta manualmente para JPG ou PNG primeiro:

- Use um editor de imagem (Paint, Photoshop, GIMP, etc.)
- Salve como `.jpg` ou `.png`
- O script converterá automaticamente para WEBP

### Problema: "Não foi possivel substituir original (em uso)"

**Não é um erro grave!** O script mantém uma cópia otimizada como `1.optimized.webp`.

**Solução:**

1. Feche programas que possam estar usando a imagem
2. Execute novamente: `npm run optimize-images`

### Problema: Imagens ficaram muito comprimidas

**Ajuste a qualidade no arquivo `optimize-images.js`:**

```javascript
// Linha ~90 - Qualidade do thumb/medium
.webp({ quality: 85 })  // Aumente para 90 se necessário

// Linha ~106 - Qualidade da original
.webp({ quality: 90 })  // Aumente para 95 se necessário
```

---

## 📝 Checklist Completo

Ao adicionar uma nova moto, siga esta ordem:

- [ ] 1. Criar pasta numerada em `public/src/images/motos/`
- [ ] 2. Adicionar imagens em formato `.webp` (1.webp, 2.webp, etc.)
- [ ] 3. Atualizar `public/src/js/motos.js` com dados da moto
- [ ] 4. Executar `npm run optimize-images`
- [ ] 5. Verificar no terminal que todas as imagens foram otimizadas
- [ ] 6. Testar localmente: `npm run serve`
- [ ] 7. Deploy para produção: `npm run deploy`

---

## 🆘 Suporte

Se tiver dúvidas ou problemas, verifique:

1. **Console do terminal** - erros aparecem aqui
2. **Estrutura de pastas** - deve seguir o padrão exato
3. **Formato das imagens** - apenas `.webp` é suportado

---

**Desenvolvido para Borondi Custom** 🏍️
