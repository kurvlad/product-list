import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Divider,
  LinearProgress,
  Typography,
  Alert,
} from "@mui/material";
import AddProductButton from "../features/products/AddProductButton";
import { useProducts } from "../hooks/useProducts";
import SearchBar from "../components/SearchBar/SearchBar";
import ProductsTable from "../components/ProductsTable/ProductsTable";
import Pagination from "../components/Pagination/Pagination";
import LogoutButton from "../components/LogoutButton/LogoutButton";

const ProductsPage: React.FC = () => {
  const {
    loading,
    error,
    sortKey,
    sortOrder,
    page,
    pageCount,
    pagedRows,
    sortedRows,
    from,
    to,
    total,
    handleSortChange,
    handleSearchChange,
    handleProductAdded,
    handleAddToCart,
    handlePageChange,
  } = useProducts();

  const [searchInput, setSearchInput] = useState("");

  // Дебаунс поиска
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      handleSearchChange(searchInput);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput, handleSearchChange]);

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
      }}
    >
      <Box maxWidth="lg" mx="auto">
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Товары
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2.5,
            gap: 2,
          }}
        >
          <SearchBar value={searchInput} onChange={setSearchInput} />
          <AddProductButton onProductAdded={handleProductAdded} />
          <LogoutButton />
        </Box>

        <Box
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "#ffffff",
            boxShadow: "0 18px 60px rgba(15, 23, 42, 0.08)",
          }}
        >
          {loading && <LinearProgress />}

          <Box sx={{ px: 3, pt: 2, pb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Все позиции
            </Typography>
          </Box>

          {error && (
            <Box sx={{ px: 3, pb: 1 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          <Divider />

          <ProductsTable
            products={pagedRows}
            sortKey={sortKey}
            sortOrder={sortOrder}
            loading={loading}
            onSortChange={handleSortChange}
            onAddToCart={handleAddToCart}
          />

          <Divider />

          <Pagination
            page={page}
            pageCount={pageCount}
            from={from}
            to={to}
            total={sortedRows.length || total}
            onPageChange={handlePageChange}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default ProductsPage;
