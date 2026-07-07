import rawCatalog from "./catalog-data.json";
import type { Catalog, Product } from "../types/domain";

const catalog = rawCatalog as Catalog;

export function getCatalog(): Catalog {
  return catalog;
}

export function getAllProducts(): Product[] {
  return [...catalog.camada1, ...catalog.camada2, ...catalog.camada3];
}
