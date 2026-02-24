import { Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { SearchBarProps } from "./SearchBar.interface";

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "relative",
      }}
    >
      <TextField
        placeholder="Найти"
        size="small"
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <SearchIcon
              sx={{ mr: 1.5, ml: 1, color: "text.disabled" }}
              fontSize="small"
            />
          ),
          sx: {
            borderRadius: 3,
            backgroundColor: "#ffffff",
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
