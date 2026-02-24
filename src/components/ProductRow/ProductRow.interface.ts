import type { ProductRow as ProductRowType } from "../../features/products/AddProductButton.interface";

export interface ProductRowProps {
  product: ProductRowType;
  onAddToCart: (product: ProductRowType) => void;
}
