import {
  Button,
  Checkbox,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import type { ProductRowProps } from "./ProductRow.interface";

const ProductRow: React.FC<ProductRowProps> = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product);
    toast.info(`Товар "${product.title}" добавлен в корзину`);
  };

  return (
    <TableRow
      sx={{
        position: "relative",
      }}
    >
      <TableCell padding="checkbox">
        <Checkbox size="small" />
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {product.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {product.brand}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {product.brand}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{product.sku}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: product.rating < 3 ? "error.main" : "text.primary",
          }}
        >
          {product.rating.toFixed(1)}/5
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {product.price.toLocaleString("ru-RU", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </Typography>
      </TableCell>
      <TableCell align="center" padding="checkbox">
        <Button
          size="small"
          variant="contained"
          sx={{
            minWidth: 32,
            px: 0,
            borderRadius: 999,
            backgroundColor: "#2f4cff",
            "&:hover": { backgroundColor: "#2238d4" },
          }}
          onClick={handleAddToCart}
        >
          +
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ProductRow;
