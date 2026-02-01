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
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import CustomerSelect from "./CustomerSelect";

/* ======================================================
   NAV BAR – PREMIUM CATALOG
====================================================== */

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
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        color: "#0f172a",
      }}
    >
      <Toolbar sx={{ flexDirection: "column", alignItems: "stretch", gap: 1 }}>
        {/* ================= TOP ROW ================= */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* BRAND */}
          <Box>
            <Typography fontWeight={900} fontSize={18} color="primary.main">
              🧹 Mangalya Agencies
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              Wholesale Sales Catalog
            </Typography>
          </Box>

          {/* ACTION ICONS */}
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={onOrdersClick}>
              <Inventory2Icon />
            </IconButton>

            <IconButton onClick={onCartClick}>
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <Typography fontWeight={800} fontSize={13} color="success.main">
              ₹{cartTotal}
            </Typography>

            <IconButton
              onClick={() =>
                (window.location.href =
                  "https://vishakhviswan.github.io/offline-catalog-admin/")
              }
            >
              <AdminPanelSettingsIcon />
            </IconButton>
          </Stack>
        </Box>

        {/* ================= SEARCH + CUSTOMER ================= */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* SEARCH */}
          <Box sx={{ flex: 3, position: "relative" }}>
            {!searchOpen ? (
              <Paper
                onClick={() => setSearchOpen(true)}
                sx={{
                  px: 2,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  borderRadius: 3,
                  background: "#f8fafc",
                }}
              >
                <SearchIcon fontSize="small" />
                <Typography color="text.secondary" fontSize={14}>
                  Search products
                </Typography>
              </Paper>
            ) : (
              <Paper
                sx={{
                  px: 1.5,
                  py: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: 3,
                }}
              >
                <SearchIcon fontSize="small" />
                <InputBase
                  autoFocus
                  placeholder="Search product name…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ flex: 1, fontSize: 14 }}
                />
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearch("");
                    setSearchOpen(false);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Paper>
            )}

            {/* SUGGESTIONS */}
            {searchOpen && suggestions.length > 0 && (
              <Paper
                sx={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  right: 0,
                  zIndex: 20,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
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
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      "&:hover": { background: "#f1f5f9" },
                    }}
                  >
                    <Typography fontWeight={600} fontSize={14}>
                      {p.name}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      ₹{p.price}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            )}
          </Box>

          {/* CUSTOMER */}
          <Box sx={{ flex: 1 }}>
            <CustomerSelect
              customers={customers}
              setCustomers={setCustomers}
              customerName={customerName}
              setCustomerName={setCustomerName}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
