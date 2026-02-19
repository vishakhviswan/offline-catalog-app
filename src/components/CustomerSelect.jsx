import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

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

  useEffect(() => {
    if (open) {
      setSearch("");
      setNewName("");
      setNewMobile("");
    }
  }, [open]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.mobile?.includes(search),
    );
  }, [customers, search]);

  async function addCustomer() {
    if (!newName.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          mobile: newMobile.trim() || null,
        }),
      });

      if (!res.ok) {
        throw new Error("API failed");
      }

      const savedCustomer = await res.json();

      setCustomers([savedCustomer, ...customers]);
      setCustomerName(savedCustomer.name);
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
      <Button
        fullWidth
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{
          justifyContent: "flex-start",
          textTransform: "none",
          borderRadius: 2,
          fontWeight: 700,
          py: 1.1,
        }}
      >
        👤 {customerName || "Select Customer"}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: { xs: "16px 16px 0 0", sm: 3 },
            m: { xs: 0, sm: 2 },
            alignSelf: { xs: "flex-end", sm: "center" },
            maxHeight: { xs: "88vh", sm: "85vh" },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Select Customer</DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={1.2}>
            <TextField
              placeholder="Search customer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              size="small"
            />

            <List
              dense
              sx={{
                maxHeight: 220,
                overflowY: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
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
                    secondary={c.mobile || undefined}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItemButton>
              ))}
              {filtered.length === 0 && (
                <Typography sx={{ py: 1.5, textAlign: "center" }} color="text.secondary">
                  No customers
                </Typography>
              )}
            </List>

            <Divider sx={{ my: 0.5 }} />

            <Typography fontWeight={700}>Add New Customer</Typography>

            <TextField
              placeholder="Customer name *"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
              size="small"
            />

            <TextField
              placeholder="Mobile (optional)"
              value={newMobile}
              onChange={(e) => setNewMobile(e.target.value)}
              fullWidth
              size="small"
            />

            <Button
              fullWidth
              variant="contained"
              onClick={addCustomer}
              disabled={loading}
              sx={{ textTransform: "none", borderRadius: 2, py: 1.2, fontWeight: 700 }}
            >
              {loading ? "Saving..." : "➕ Add & Select"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
