import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import ProductRow from "../ProductRow/ProductRow";
import type { ProductsTableProps, SortKey } from "./ProductsTable.interface";

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  sortKey,
  sortOrder,
  loading,
  onSortChange,
  onAddToCart,
}) => {
  const renderSortLabel = (key: SortKey, label: string) => (
    <TableSortLabel
      active={sortKey === key}
      direction={sortKey === key ? sortOrder : "asc"}
      onClick={() => onSortChange(key)}
    >
      {label}
    </TableSortLabel>
  );

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox size="small" />
          </TableCell>
          <TableCell>{renderSortLabel("title", "Наименование")}</TableCell>
          <TableCell>{renderSortLabel("brand", "Вендор")}</TableCell>
          <TableCell>{renderSortLabel("sku", "Артикул")}</TableCell>
          <TableCell align="right">
            {renderSortLabel("rating", "Оценка")}
          </TableCell>
          <TableCell align="right">
            {renderSortLabel("price", "Цена, ₽")}
          </TableCell>
          <TableCell align="center" padding="checkbox">
            Действия
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}

        {products.length === 0 && !loading && (
          <TableRow>
            <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Товары не найдены
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ProductsTable;
