import { memo, useState, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Badge,
  InputBase,
  Paper,
  Stack,
  Chip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TuneIcon from "@mui/icons-material/Tune";

import CustomerSelect from "./CustomerSelect";

function NavBar({
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
  const [searchOpen, setSearchOpen] = useState(false);

  const suggestions = useMemo(() => {
    if (!search || search.length < 2) return [];
    return products
      .filter((p) => p?.name)
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 6);
  }, [search, products]);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(244,253,251,0.95) 100%)",
        color: "#0f172a",
        borderBottom: "1px solid rgba(148,163,184,0.2)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar sx={{ flexDirection: "column", gap: 1.2, py: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box>
            <Typography fontWeight={900} sx={{ letterSpacing: 0.2 }}>
              🧹 Mangalya Agencies
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              Smart Offline Catalog
            </Typography>
          </Box>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton onClick={onOrdersClick} sx={{ background: "rgba(148,163,184,0.12)" }}>
              <Inventory2Icon />
            </IconButton>

            <IconButton onClick={onFilterClick} sx={{ background: "rgba(148,163,184,0.12)" }}>
              <TuneIcon />
            </IconButton>

            <IconButton onClick={onCartClick} sx={{ background: "rgba(20,184,166,0.12)" }}>
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <Chip
              label={`₹${cartTotal}`}
              color="success"
              size="small"
              sx={{ fontWeight: 800 }}
            />
          </Stack>
        </Box>

        <Box sx={{ width: "100%", position: "relative" }}>
          {!searchOpen ? (
            <Paper
              onClick={() => setSearchOpen(true)}
              sx={{
                p: 1.2,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                borderRadius: 3,
                border: "1px solid rgba(148,163,184,0.25)",
              }}
            >
              <SearchIcon fontSize="small" /> Search products
            </Paper>
          ) : (
            <Paper
              sx={{
                p: 1.2,
                display: "flex",
                alignItems: "center",
                borderRadius: 3,
                border: "1px solid rgba(20,184,166,0.35)",
              }}
            >
              <InputBase
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products"
                sx={{ flex: 1 }}
              />
              <IconButton
                onClick={() => {
                  setSearch("");
                  setSearchOpen(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Paper>
          )}

          {searchOpen && suggestions.length > 0 && (
            <Paper
              sx={{
                position: "absolute",
                top: "110%",
                left: 0,
                right: 0,
                zIndex: 50,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {suggestions.map((p) => (
                <Box
                  key={p.id}
                  onClick={() => {
                    setViewProduct(p);
                    setSearch("");
                    setSearchOpen(false);
                  }}
                  sx={{
                    p: 1,
                    cursor: "pointer",
                    "&:hover": { background: "rgba(148,163,184,0.12)" },
                  }}
                >
                  {p.name} – ₹{p.price}
                </Box>
              ))}
            </Paper>
          )}
        </Box>

        <CustomerSelect
          customers={customers}
          setCustomers={setCustomers}
          customerName={customerName}
          setCustomerName={setCustomerName}
        />
      </Toolbar>
    </AppBar>
  );
}

export default memo(NavBar);
