export type ProductType = 'PDV' | 'SITE_INSTITUCIONAL' | 'LOJA_ONLINE' | string;

export interface Product {
  id: string;
  name: string;
  price: number;
  type: ProductType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  price: number;
  type: ProductType;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  type?: ProductType;
}
