import { getAllProducts } from "../../catalog/catalog-service";
import type { IntentClassification, Product } from "../../types/domain";

const intentToTags: Record<IntentClassification["label"], string[]> = {
  financas: ["financas", "investimento", "trading", "bitcoin", "cripto", "bolsa", "acoes"],
  tech: ["ia", "tech", "digital", "web", "software"],
  saude: ["saude", "fitness", "bemestar", "emagrecimento", "pilates"],
  carreira: ["carreira", "negocio", "coaching", "empreendedorismo", "sucesso"],
  marketing: ["marketing", "social", "afiliado", "automacao", "email"],
  mindset: ["mindset", "autoconhecimento", "desenvolvimento", "produtividade"],
  geral: []
};

export function matchProducts(intent: IntentClassification, limit = 5): Product[] {
  const allProducts = getAllProducts();
  const desiredTags = intentToTags[intent.label];

  const rankedProducts = allProducts
    .map((product) => {
      const score = product.nicho.filter((tag) => desiredTags.includes(tag)).length;
      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return right.product.comissao - left.product.comissao;
    })
    .map((entry) => entry.product);

  if (rankedProducts.length === 0) {
    return allProducts.slice(0, limit);
  }

  return rankedProducts.slice(0, limit);
}
