import { Box, IconButton, Typography } from "@mui/material";
import type { PaginationProps } from "./Pagination.interface";

const Pagination: React.FC<PaginationProps> = ({
  page,
  pageCount,
  from,
  to,
  total,
  onPageChange,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 1.5,
      }}
    >
      <Typography variant="caption" color="text.secondary">
        Показано {from}-{to} из {total}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          size="small"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          ‹
        </IconButton>
        <Typography variant="body2">{page}</Typography>
        <Typography variant="body2" color="text.secondary">
          / {pageCount}
        </Typography>
        <IconButton
          size="small"
          disabled={page >= pageCount}
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        >
          ›
        </IconButton>
      </Box>
    </Box>
  );
};

export default Pagination;
