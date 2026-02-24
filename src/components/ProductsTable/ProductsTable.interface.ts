import type { ProductRow as ProductRowType } from "../../features/products/AddProductButton.interface";

export type SortKey = "title" | "brand" | "sku" | "rating" | "price";
export type SortOrder = "asc" | "desc";

export interface ProductsTableProps {
  products: ProductRowType[];
  sortKey: SortKey;
  sortOrder: SortOrder;
  loading: boolean;
  onSortChange: (key: SortKey) => void;
  onAddToCart: (product: ProductRowType) => void;
}
