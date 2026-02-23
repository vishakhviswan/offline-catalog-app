import { useMemo, useState } from "react";
import {
  AppBar,
  Badge,
  Box,
  Chip,
  ClickAwayListener,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TuneIcon from "@mui/icons-material/Tune";

import CustomerSelect from "./CustomerSelect";

export default function NavBar({
  search,
  setSearch,
  cartCount,
  cartTotal,
  customerName,
  setCustomerName,
  customers,
  setCustomers,
  onCartClick,
  onOrdersClick,
  onFilterClick,
  products = [],
  setViewProduct,
}) {
  const [searchFocused, setSearchFocused] = useState(false);

  const suggestions = useMemo(() => {
    if (!search || search.trim().length < 2) return [];
    return products
      .filter((p) => p?.name)
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 8);
  }, [search, products]);

  const showSuggestions = searchFocused && suggestions.length > 0;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,0.9)",
        color: "#0f172a",
        borderBottom: "1px solid rgba(148,163,184,0.2)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar
        sx={{
          px: { xs: 1.5, sm: 2.5 },
          py: 1,
          alignItems: "stretch",
        }}
      >
        <Stack spacing={1.1} sx={{ width: "100%" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              sx={{
                fontFamily: '"Poppins", "Inter", sans-serif',
                fontWeight: 800,
                fontSize: { xs: "1.2rem", sm: "1.35rem" },
                letterSpacing: -0.2,
              }}
            >
              Mangalya Agencies
            </Typography>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <Tooltip title="Orders">
                <IconButton onClick={onOrdersClick} size="small" sx={{ color: "#334155" }}>
                  <Inventory2Icon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Filters">
                <IconButton onClick={onFilterClick} size="small" sx={{ color: "#334155" }}>
                  <TuneIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Cart">
                <IconButton onClick={onCartClick} size="small" sx={{ color: "#334155" }}>
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Chip
                label={`Rs ${Number(cartTotal || 0).toFixed(0)}`}
                size="small"
                sx={{
                  ml: 0.25,
                  fontWeight: 800,
                  bgcolor: "#ecfdf3",
                  color: "#15803d",
                  border: "1px solid #bbf7d0",
                }}
              />
            </Stack>
          </Stack>

          <ClickAwayListener onClickAway={() => setSearchFocused(false)}>
            <Box sx={{ position: "relative" }}>
              <Paper
                sx={{
                  px: 1.3,
                  py: 0.7,
                  borderRadius: 99,
                  border: "1px solid rgba(148,163,184,0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  boxShadow: searchFocused ? "0 8px 22px rgba(37,99,235,0.12)" : "none",
                  transition: "all 220ms ease",
                }}
              >
                <SearchIcon fontSize="small" sx={{ color: "#64748b" }} />
                <InputBase
                  value={search}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products"
                  sx={{ flex: 1, fontSize: 15 }}
                />
                {search ? (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearch("");
                      setSearchFocused(false);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                ) : null}
              </Paper>

              {showSuggestions && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: "108%",
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid rgba(148,163,184,0.25)",
                  }}
                >
                  <List dense disablePadding>
                    {suggestions.map((p) => (
                      <ListItemButton
                        key={p.id}
                        onClick={() => {
                          setViewProduct(p);
                          setSearch("");
                          setSearchFocused(false);
                        }}
                      >
                        <ListItemText
                          primary={p.name}
                          secondary={`Rs ${p.price}`}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          </ClickAwayListener>

          <CustomerSelect
            customers={customers}
            setCustomers={setCustomers}
            customerName={customerName}
            setCustomerName={setCustomerName}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
