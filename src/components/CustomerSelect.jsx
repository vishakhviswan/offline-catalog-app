import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const API_BASE = "https://offline-catalog-backend-production.up.railway.app";

export default function CustomerSelect({
  customers = [],
  setCustomers,
  customerName,
  setCustomerName,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;

    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        (c.mobile || "").includes(search.trim()),
    );
  }, [customers, search]);

  const quickCustomers = useMemo(() => customers.slice(0, 3), [customers]);

  async function addCustomer() {
    const safeName = newName.trim();
    if (!safeName) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: safeName,
          mobile: newMobile.trim() || null,
        }),
      });

      if (!res.ok) {
        throw new Error("API failed");
      }

      const savedCustomer = await res.json();
      setCustomers([savedCustomer, ...customers]);
      setCustomerName(savedCustomer.name);
      setNewName("");
      setNewMobile("");
      setSearch("");
      setOpen(false);
    } catch (err) {
      alert("Failed to add customer");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Paper
        onClick={() => setOpen(true)}
        sx={{
          px: 1.4,
          py: 0.95,
          borderRadius: 99,
          border: "1px solid rgba(148,163,184,0.28)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          transition: "all 220ms ease",
          "&:hover": { borderColor: "#93c5fd" },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: "#e2e8f0", color: "#0f172a" }}>
            <PersonOutlineIcon fontSize="small" />
          </Avatar>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {customerName ? `Customer: ${customerName}` : "Select Customer"}
          </Typography>
        </Stack>

        {customerName && (
          <Chip
            size="small"
            label="Selected"
            sx={{ bgcolor: "#ecfdf3", color: "#15803d", fontWeight: 700 }}
          />
        )}
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: { xs: "18px 18px 0 0", sm: 3 },
            m: { xs: 0, sm: 2 },
            mt: { xs: "auto", sm: 2 },
          },
        }}
      >
        <DialogContent sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={800}>
                Select Customer
              </Typography>
              <IconButton onClick={() => setOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Stack>

            <TextField
              size="small"
              placeholder="Search by name or mobile"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {!search && quickCustomers.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                {quickCustomers.map((c) => (
                  <Chip
                    key={`quick-${c.id}`}
                    label={c.name}
                    onClick={() => {
                      setCustomerName(c.name);
                      setOpen(false);
                    }}
                    clickable
                    sx={{ fontWeight: 600 }}
                  />
                ))}
              </Stack>
            )}

            <Paper
              variant="outlined"
              sx={{ borderRadius: 2, maxHeight: 220, overflowY: "auto" }}
            >
              <List dense disablePadding>
                {filtered.map((c) => (
                  <ListItemButton
                    key={c.id}
                    onClick={() => {
                      setCustomerName(c.name);
                      setOpen(false);
                    }}
                  >
                    <ListItemText
                      primary={c.name}
                      secondary={c.mobile || "No mobile"}
                      primaryTypographyProps={{ fontWeight: 700 }}
                    />
                  </ListItemButton>
                ))}
                {filtered.length === 0 && (
                  <Box sx={{ py: 3, textAlign: "center", color: "text.secondary" }}>
                    No customers found
                  </Box>
                )}
              </List>
            </Paper>

            <Divider />

            <Typography fontWeight={800}>Add New Customer</Typography>

            <TextField
              size="small"
              label="Customer Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <TextField
              size="small"
              label="Mobile (optional)"
              value={newMobile}
              onChange={(e) => setNewMobile(e.target.value)}
              inputMode="numeric"
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addCustomer}
              disabled={loading || !newName.trim()}
              sx={{ borderRadius: 2, py: 1.1, fontWeight: 700 }}
            >
              {loading ? "Saving..." : "Add & Select"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
