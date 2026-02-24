import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type { ProductRow } from "../features/products/AddProductButton.interface";

type SortKey = "title" | "brand" | "sku" | "rating" | "price";
type SortOrder = "asc" | "desc";

interface DummyJsonProductsResponse {
  products: Array<{
    id: number;
    title: string;
    brand?: string;
    sku?: string;
    rating: number;
    price: number;
  }>;
  total: number;
}

const ROWS_PER_PAGE = 20;

export const useProducts = () => {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);

  // Используем ref для отслеживания монтирования компонента
  const isMounted = useRef(true);

  // Загрузка товаров
  useEffect(() => {
    const controller = new AbortController();
    isMounted.current = true;

    async function loadProducts() {
      // Не показываем загрузку при первом монтировании если есть данные
      if (rows.length === 0) {
        setLoading(true);
      }
      setError(null);

      try {
        // Формируем URL в зависимости от поискового запроса
        let url = "https://dummyjson.com/products";
        if (searchQuery && searchQuery.trim() !== "") {
          url = `https://dummyjson.com/products/search?q=${encodeURIComponent(
            searchQuery.trim(),
          )}`;
        }

        const response = await fetch(url, {
          signal: controller.signal,
          // Добавляем заголовки для избежания кэширования
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error("Не удалось загрузить товары");
        }

        const data: DummyJsonProductsResponse = await response.json();

        const mapped: ProductRow[] = data.products.map((p) => ({
          id: p.id,
          title: p.title,
          brand: p.brand ?? "—",
          sku: p.sku ?? "—",
          rating: p.rating,
          price: p.price,
        }));

        // Проверяем, что компонент все еще смонтирован
        if (isMounted.current) {
          setRows(mapped);
          setTotal(data.total ?? mapped.length);
        }
      } catch (e) {
        // Игнорируем ошибки отмены запроса
        if (e instanceof Error && e.name === "AbortError") {
          return;
        }

        // Проверяем, что компонент все еще смонтирован
        if (isMounted.current) {
          setError("Ошибка при загрузке товаров. Попробуйте позже.");
          console.error("Error loading products:", e);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted.current = false;
      controller.abort();
    };
  }, [searchQuery]); // Убираем rows.length из зависимостей

  // Сортировка с правильной типизацией
  const sortedRows = useMemo(() => {
    const copy = [...rows];

    return copy.sort((a, b) => {
      const dir = sortOrder === "asc" ? 1 : -1;

      // Для числовых полей
      if (sortKey === "price" || sortKey === "rating") {
        return (a[sortKey] - b[sortKey]) * dir;
      }

      // Для строковых полей с проверкой на null/undefined
      const aValue = a[sortKey] ?? "";
      const bValue = b[sortKey] ?? "";

      // Убеждаемся, что значения - строки
      return String(aValue).localeCompare(String(bValue)) * dir;
    });
  }, [rows, sortKey, sortOrder]);

  // Пагинация
  const pagedRows = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return sortedRows.slice(start, start + ROWS_PER_PAGE);
  }, [sortedRows, page]);

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / ROWS_PER_PAGE));

  const from = sortedRows.length === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1;
  const to = Math.min(page * ROWS_PER_PAGE, sortedRows.length);

  // Обработчики с правильными зависимостями
  const handleSortChange = useCallback((key: SortKey) => {
    setPage(1);
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
        return prevKey;
      }
      setSortOrder("asc");
      return key;
    });
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    // Обновляем поисковый запрос только если он изменился
    setSearchQuery((prev) => {
      const trimmed = value.trim();
      if (prev === trimmed) return prev;
      return trimmed;
    });
    setPage(1);
  }, []);

  const handleProductAdded = useCallback((product: ProductRow) => {
    setRows((prev) => [product, ...prev]);
    setTotal((prev) => prev + 1);
    setPage(1);
  }, []);

  const handleAddToCart = useCallback((product: ProductRow) => {
    console.log(`Товар "${product.title}" добавлен в корзину`);
    // Здесь можно добавить уведомление пользователя
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return {
    rows,
    total,
    loading,
    error,
    searchQuery,
    sortKey,
    sortOrder,
    page,
    pageCount,
    pagedRows,
    sortedRows,
    from,
    to,
    handleSortChange,
    handleSearchChange,
    handleProductAdded,
    handleAddToCart,
    handlePageChange,
  };
};
