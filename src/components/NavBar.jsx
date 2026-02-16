import { useState, useMemo } from "react";
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
      sx={{ background: "#fff", color: "#000" }}
    >
      <Toolbar sx={{ flexDirection: "column", gap: 1 }}>
        {/* TOP ROW */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography fontWeight={900}>🧹 Mangalya Agencies</Typography>

          <Stack direction="row" spacing={1}>
            <IconButton onClick={onOrdersClick}>
              <Inventory2Icon />
            </IconButton>

            <IconButton onClick={onFilterClick}>
              <TuneIcon />
            </IconButton>

            <IconButton onClick={onCartClick}>
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <Typography fontWeight={800} color="green">
              ₹{cartTotal}
            </Typography>
          </Stack>
        </Box>

        {/* SEARCH */}
        <Box sx={{ width: "100%", position: "relative" }}>
          {!searchOpen ? (
            <Paper
              onClick={() => setSearchOpen(true)}
              sx={{ p: 1.2, cursor: "pointer" }}
            >
              <SearchIcon fontSize="small" /> Search products
            </Paper>
          ) : (
            <Paper sx={{ p: 1.2, display: "flex", alignItems: "center" }}>
              <InputBase
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                  sx={{ p: 1, cursor: "pointer" }}
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
