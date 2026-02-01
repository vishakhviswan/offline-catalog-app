import {
  Drawer,
  Box,
  Typography,
  Stack,
  IconButton,
  Button,
  TextField,
  Card,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function CartSheet({
  open = true,
  cart = [],
  updateCartItem,
  removeFromCart,
  onClose,
  onCheckout,
  customerName,
}) {
  /* ================= TOTAL ================= */
  const total = cart.reduce((s, i) => {
    const qty = Number(i.qty || 0);
    const price = Number(i.price || 0);
    return s + qty * price * (i.unitMultiplier || 1);
  }, 0);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: "85vh",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          fontFamily: "Inter, sans-serif",
        },
      }}
    >
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography fontWeight={800} fontSize={18}>
            🛒 Cart
          </Typography>
          <Typography fontSize={13} color="primary.main">
            👤 {customerName || "No customer selected"}
          </Typography>
        </Box>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* ================= ITEMS ================= */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {cart.length === 0 && (
          <Typography color="text.secondary" textAlign="center" mt={6}>
            Cart is empty
          </Typography>
        )}

        <Stack spacing={2}>
          {cart.map((c) => (
            <Card
              key={c.productId}
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              }}
            >
              <Typography fontWeight={700} mb={1}>
                {c.name}
              </Typography>

              {/* INPUT ROW */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                {/* PRICE */}
                <TextField
                  label="Rate"
                  value={c.price ?? ""}
                  inputMode="decimal"
                  onChange={(e) =>
                    updateCartItem(c.productId, {
                      price: e.target.value, // 🔥 string allow
                    })
                  }
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    updateCartItem(c.productId, {
                      price: val > 0 ? val : 0,
                    });
                  }}
                  size="small"
                  sx={{ width: 90 }}
                />

                <Typography>×</Typography>

                {/* QTY */}
                <TextField
                  label="Qty"
                  value={c.qty ?? ""}
                  inputMode="numeric"
                  onChange={(e) =>
                    updateCartItem(c.productId, {
                      qty: e.target.value, // 🔥 allow empty
                    })
                  }
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    updateCartItem(c.productId, {
                      qty: val > 0 ? val : 1,
                    });
                  }}
                  size="small"
                  sx={{ width: 80 }}
                />

                {/* ITEM TOTAL */}
                <Typography
                  sx={{ ml: "auto" }}
                  fontWeight={800}
                  color="success.main"
                >
                  ₹
                  {Number(c.qty || 0) *
                    Number(c.price || 0) *
                    (c.unitMultiplier || 1)}
                </Typography>

                {/* REMOVE */}
                <IconButton
                  onClick={() => removeFromCart(c.productId)}
                  color="error"
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* ================= FOOTER ================= */}
      {cart.length > 0 && (
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e5e7eb",
            background: "#fff",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography fontSize={14} color="text.secondary">
              Grand Total
            </Typography>
            <Typography fontSize={20} fontWeight={800}>
              ₹{total}
            </Typography>
          </Stack>

          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={onCheckout}
            sx={{
              borderRadius: 3,
              py: 1.4,
              fontSize: 16,
              fontWeight: 800,
            }}
          >
            Checkout / WhatsApp
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
