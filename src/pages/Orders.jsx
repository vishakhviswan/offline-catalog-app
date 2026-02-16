import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

export default function Orders({ orders = [], onBack, onDeleteOrder }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

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
    <Box sx={{ px: 2, pb: 6, maxWidth: 900, mx: "auto" }}>
      {/* HEADER */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
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

      {orders.length === 0 && (
        <Card sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">No orders yet</Typography>
        </Card>
      )}

      <Stack spacing={2}>
        {orders.map((o, index) => {
          const isHighValue = Number(o.total || 0) > 2000;

          return (
            <Card
              key={o.id}
              sx={{
                p: 2,
                borderRadius: 3,
                background: isHighValue
                  ? "linear-gradient(135deg,#ecfeff,#ffffff)"
                  : "#ffffff",
              }}
            >
              {/* HEADER */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={1}
              >
                <Box>
                  <Typography fontWeight={800}>
                    #{orders.length - index} – {o.customer_name || "Walk-in"}
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    {new Date(o.created_at).toLocaleString()}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  {isHighValue && (
                    <Chip size="small" color="success" label="High Value" />
                  )}

                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(o.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>

              <Divider sx={{ my: 1 }} />

              {/* ITEMS */}
              <Stack spacing={0.6} mb={1}>
                {(o.order_items || []).map((it, i) => (
                  <Typography key={i} fontSize={14}>
                    {i + 1}. {it.product_name} —{" "}
                    <b>
                      {it.qty} {it.unit_name}
                    </b>{" "}
                    × ₹{it.price}
                  </Typography>
                ))}
              </Stack>

              <Divider sx={{ my: 1 }} />

              {/* FOOTER */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight={800} fontSize={16}>
                  Total: ₹{o.total}
                </Typography>

                <Button
                  size="small"
                  startIcon={<WhatsAppIcon />}
                  sx={{
                    background: "linear-gradient(135deg,#22c55e,#16a34a)",
                    color: "#fff",
                    "&:hover": {
                      background: "linear-gradient(135deg,#16a34a,#15803d)",
                    },
                  }}
                  onClick={() => {
                    let msg = `*MANGALYA AGENCIES*\n\n`;
                    msg += `Customer: ${o.customer_name || "Walk-in"}\n`;
                    msg += `Date: ${new Date(
                      o.created_at,
                    ).toLocaleString()}\n\n`;

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
            </Card>
          );
        })}
      </Stack>

      {/* CONFIRM DIALOG */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Order?</DialogTitle>
        <DialogContent>
          Are you sure you want to permanently delete this order?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
