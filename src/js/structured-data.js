/**
 * Dados Estruturados JSON-LD para SEO
 * Carrega automaticamente ao inicializar a página
 */

function loadStructuredData() {
  // 1. Schema de Organização
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MotorcycleDealer",
    "@id": "https://www.borondicustom.com.br/#organization",
    name: "Borondi Custom",
    description:
      "Customização, revisão e revenda de motos em Canoas/RS. Projetos custom exclusivos, revisão para todas as marcas e Harley-Davidson seminovas desde 1999. Atendimento exclusivo com hora marcada.",
    url: "https://www.borondicustom.com.br/",
    logo: "https://www.borondicustom.com.br/src/assets/logo/logo-1400.webp",
    image:
      "https://www.borondicustom.com.br/src/assets/logo/logo-1400.webp",
    telephone: "+5551991353965",
    address: {
      "@type": "PostalAddress",
      streetAddress: "R. Berto Círio, 329 - São Luís",
      addressLocality: "Canoas",
      addressRegion: "RS",
      postalCode: "92420-030",
      addressCountry: "BR",
    },
    sameAs: [
      "https://www.facebook.com/borondicustom",
      "https://www.instagram.com/borondicustom",
    ],
    priceRange: "R$ 20000 - R$ 100000",
    knowsAbout: [
      "Harley-Davidson",
      "Motos Customizadas",
      "Customização de Motos",
      "Revisão de Motos",
      "Venda de Motos",
      "Kawasaki",
      "Yamaha",
      "Honda",
    ],
  };

  // 2. Schema WebSite com Navegação
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.borondicustom.com.br/#website",
    url: "https://www.borondicustom.com.br/",
    name: "Borondi Custom",
    description:
      "Customização, revisão e revenda de motos em Canoas/RS. Projetos custom exclusivos, revisão para todas as marcas e Harley-Davidson seminovas desde 1999. Atendimento exclusivo com hora marcada.",
    publisher: {
      "@id": "https://www.borondicustom.com.br/#organization",
    },
  };

  // 3. Schema de Serviços Oferecidos (venda, customização e revisão)
  const provider = {
    "@id": "https://www.borondicustom.com.br/#organization",
  };
  const areaServed = {
    "@type": "State",
    name: "Rio Grande do Sul",
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://www.borondicustom.com.br/#venda",
        serviceType: "Venda e Avaliação de Motocicletas",
        url: "https://www.borondicustom.com.br/#produtos",
        provider: provider,
        areaServed: areaServed,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Motos à venda",
          itemListElement: [
            {
              "@type": "OfferCatalog",
              name: "Harley-Davidson",
            },
            {
              "@type": "OfferCatalog",
              name: "Kawasaki",
            },
            {
              "@type": "OfferCatalog",
              name: "Yamaha",
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": "https://www.borondicustom.com.br/#customizacao",
        serviceType: "Customização de Motocicletas",
        name: "Customização de motos",
        description:
          "Desde mudanças pontuais até projetos completos de customização, sempre a partir da ideia do cliente. Peças como escapamentos projetadas e criadas sob medida.",
        url: "https://www.borondicustom.com.br/#customizacao",
        provider: provider,
        areaServed: areaServed,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Serviços de customização",
          itemListElement: [
            "Troca de guidão e escapamento",
            "Modificações estéticas",
            "Instalação e substituição de acessórios",
            "Alterações de componentes",
            "Projetos de customização completos",
          ].map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: name },
          })),
        },
      },
      {
        "@type": "Service",
        "@id": "https://www.borondicustom.com.br/#revisao",
        serviceType: "Revisão de Motocicletas",
        name: "Revisão preventiva e avaliação técnica",
        description:
          "Revisão preventiva e avaliação técnica para motos de baixa, média e alta cilindrada, de qualquer marca.",
        url: "https://www.borondicustom.com.br/#revisao",
        provider: provider,
        areaServed: areaServed,
      },
    ],
  };

  // 5. Função para gerar schemas de Produtos (Motos)
  function generateProductSchema(moto) {
    const priceFloat = parseFloat(moto.price);
    const availability =
      moto.sell === "yes"
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock";
    const sellStatus = moto.sell === "yes" ? "Sold Out" : "For Sale";

    return {
      "@type": "Product",
      "@id": `https://www.borondicustom.com.br/#product-${moto.id}`,
      name: `${moto.model} ${moto.year}`,
      description: moto.description,
      offers: {
        "@type": "Offer",
        url: "https://www.borondicustom.com.br/",
        priceCurrency: "BRL",
        price: priceFloat.toString(),
        availability: availability,
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        seller: {
          "@type": "LocalBusiness",
          "@id": "https://www.borondicustom.com.br/#organization",
        },
        inventoryLevel: {
          "@type": "QuantitativeValue",
          value: moto.sell === "yes" ? 0 : 1,
        },
      },
      category: "Motorcycle",
      brand: {
        "@type": "Brand",
        name: moto.model.split(" ")[0]
      },
      mileageFromOdometer: {
        "@type": "QuantitativeValue",
        unitCode: "KMT",
        value: moto.kms.match(/\d+/)[0],
      },
      vehicleModelDate: `${moto.year}-01-01`,
      productionDate: `${moto.year}-01-01`,
      image: `https://www.borondicustom.com.br/src/images/motos/${moto.id}/optimized/1-medium.webp`,
    };
  }

  // NOTA: FAQ Schema removido pois o site não possui uma seção de FAQ.
  // Para melhor SEO, adicione uma seção FAQ real na página antes de incluir o schema.

  // 6. Criar um objeto com todos os schemas
  const allSchemas = {
    organization: organizationSchema,
    website: websiteSchema,
    services: servicesSchema,
    generateProduct: generateProductSchema,
  };

  // 7. Injetar os schemas no HEAD
  function injectSchemas() {
    // Injetar Organization
    let script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(organizationSchema, null, 2);
    document.head.appendChild(script);

    // Injetar Website
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(websiteSchema, null, 2);
    document.head.appendChild(script);

    // Injetar Services
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(servicesSchema, null, 2);
    document.head.appendChild(script);

    // Injetar produtos (motos) - será feito após carregar motos.js
    if (typeof motosJson !== "undefined" && motosJson.length > 0) {
      const products = motosJson.map((moto) => generateProductSchema(moto));
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: product,
          })),
        },
        null,
        2,
      );
      document.head.appendChild(script);
    }

    console.log("✓ Dados estruturados carregados com sucesso!");
  }

  // Executar ao carregar o DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectSchemas);
  } else {
    injectSchemas();
  }

  return allSchemas;
}

// Exportar função para uso em context do navegador
if (typeof window !== "undefined") {
  window.loadStructuredData = loadStructuredData;
  // Carregar automaticamente
  loadStructuredData();
}
