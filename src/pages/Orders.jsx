import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

export default function Orders({ orders = [], onBack, onDeleteOrder }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const filteredOrders = useMemo(() => {
    const list = [...orders].filter((o) =>
      (o.customer_name || "Walk-in")
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
    );

    if (sortBy === "latest") {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    if (sortBy === "high") {
      list.sort((a, b) => Number(b.total || 0) - Number(a.total || 0));
    }

    if (sortBy === "low") {
      list.sort((a, b) => Number(a.total || 0) - Number(b.total || 0));
    }

    return list;
  }, [orders, search, sortBy]);

  const handleDeleteClick = (id) => {
    setSelectedOrderId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedOrderId) {
      onDeleteOrder?.(selectedOrderId);
    }
    setConfirmOpen(false);
    setSelectedOrderId(null);
  };

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2 }, pb: 6, maxWidth: 980, mx: "auto" }}>
      <Paper sx={{ p: 1.5, mb: 2, borderRadius: 2, bgcolor: "#f9fafb" }}>
        <Stack spacing={1.25}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
              variant="outlined"
              size="small"
            >
              Back
            </Button>

            <Typography variant="h6" fontWeight={800}>
              Orders History
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search by customer name"
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

            <Select
              size="small"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 210 } }}
            >
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="high">High Amount</MenuItem>
              <MenuItem value="low">Low Amount</MenuItem>
            </Select>
          </Stack>
        </Stack>
      </Paper>

      {filteredOrders.length === 0 && (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">No orders found</Typography>
        </Paper>
      )}

      <Stack spacing={1.25}>
        {filteredOrders.map((o, index) => {
          const isHighValue = Number(o.total || 0) > 2000;

          return (
            <Accordion key={o.id} disableGutters sx={{ borderRadius: 2, overflow: "hidden" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack sx={{ width: "100%" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight={800}>
                      #{filteredOrders.length - index} – {o.customer_name || "Walk-in"}
                    </Typography>
                    {isHighValue && <Chip size="small" color="success" label="High Value" />}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(o.created_at).toLocaleString()}
                  </Typography>
                </Stack>
              </AccordionSummary>

              <AccordionDetails>
                <Stack spacing={1.2}>
                  {(o.order_items || []).map((it, i) => (
                    <Typography key={i} fontSize={14}>
                      {i + 1}. {it.product_name} — <b>{it.qty} {it.unit_name}</b> × ₹{it.price}
                    </Typography>
                  ))}

                  <Stack direction="row" justifyContent="space-between" alignItems="center" mt={0.5}>
                    <Typography fontWeight={800} fontSize={16}>
                      Total: ₹{o.total}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(o.id)}
                      >
                        Delete
                      </Button>

                      <Button
                        size="small"
                        startIcon={<WhatsAppIcon />}
                        sx={{
                          bgcolor: "#16a34a",
                          color: "#fff",
                          "&:hover": { bgcolor: "#15803d" },
                        }}
                        onClick={() => {
                          let msg = `*MANGALYA AGENCIES*\n\n`;
                          msg += `Customer: ${o.customer_name || "Walk-in"}\n`;
                          msg += `Date: ${new Date(o.created_at).toLocaleString()}\n\n`;

                          (o.order_items || []).forEach((it, i) => {
                            msg += `${i + 1}) ${it.product_name}\n`;
                            msg += `   ${it.qty} ${it.unit_name} × ₹${it.price} = ₹${
                              it.qty * it.price * (it.unit_multiplier || 1)
                            }\n\n`;
                          });

                          msg += `------------------\nTotal: ₹${o.total}`;

                          window.open(
                            "https://wa.me/?text=" + encodeURIComponent(msg),
                            "_blank",
                          );
                        }}
                      >
                        WhatsApp
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Order?</DialogTitle>
        <DialogContent>
          Are you sure you want to permanently delete this order?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
