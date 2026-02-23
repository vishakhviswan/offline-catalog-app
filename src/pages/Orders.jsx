import { useCallback, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import TableViewIcon from "@mui/icons-material/TableView";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsightsIcon from "@mui/icons-material/Insights";

const PAGE_SIZE = 30;

export default function Orders({
  orders = [],
  loading = false,
  onBack,
  onDeleteOrder,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [highValueThreshold, setHighValueThreshold] = useState("2000");
  const [paginationState, setPaginationState] = useState({
    key: "init",
    count: PAGE_SIZE,
  });

  const amountFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [],
  );

  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [],
  );

  const formatAmount = (value) => {
    const n = Number(value || 0);
    return `Rs ${amountFormatter.format(Number.isFinite(n) ? n : 0)}`;
  };

  const formatDateTime = useCallback(
    (value) => {
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? "-" : dateTimeFormatter.format(d);
    },
    [dateTimeFormatter],
  );

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const escapeCsv = (value) => {
    const text = String(value ?? "");
    if (text.includes('"') || text.includes(",") || text.includes("\n")) {
      return `"${text.replaceAll('"', '""')}"`;
    }
    return text;
  };

  const highValueLimit = Number(highValueThreshold || 0);

  const customerOptions = useMemo(() => {
    const names = new Set();
    orders.forEach((o) => names.add(o.customer_name || "Walk-in"));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    const minTotalValue = Number(minTotal || 0);
    const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const toDate = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    const list = [...orders].filter((o) => {
      const customerName = o.customer_name || "Walk-in";
      const orderId = String(o.id ?? "");
      const customerMobile = String(
        o.customer_mobile || o.mobile || o.customer?.mobile || "",
      );
      const productNames = (o.order_items || [])
        .map((it) => it.product_name || "")
        .join(" ")
        .toLowerCase();

      if (searchText) {
        const haystack = `${customerName.toLowerCase()} ${orderId} ${customerMobile} ${productNames}`;
        if (!haystack.includes(searchText)) return false;
      }

      if (customerFilter !== "all" && customerName !== customerFilter) {
        return false;
      }

      if (minTotalValue > 0 && Number(o.total || 0) < minTotalValue) {
        return false;
      }

      const createdAt = new Date(o.created_at);
      if (fromDate && createdAt < fromDate) return false;
      if (toDate && createdAt > toDate) return false;

      return true;
    });

    if (sortBy === "latest") {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "high") {
      list.sort((a, b) => Number(b.total || 0) - Number(a.total || 0));
    } else if (sortBy === "low") {
      list.sort((a, b) => Number(a.total || 0) - Number(b.total || 0));
    }

    return list;
  }, [orders, search, sortBy, customerFilter, dateFrom, dateTo, minTotal]);

  const summary = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalValue = filteredOrders.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0,
    );
    const avgTicket = totalOrders ? totalValue / totalOrders : 0;

    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const todayEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
    );
    const todayOrders = filteredOrders.filter((o) => {
      const d = new Date(o.created_at);
      return d >= todayStart && d <= todayEnd;
    }).length;

    return { totalOrders, totalValue, avgTicket, todayOrders };
  }, [filteredOrders]);

  const filterKey = useMemo(
    () =>
      JSON.stringify({
        search: search.trim().toLowerCase(),
        sortBy,
        customerFilter,
        dateFrom,
        dateTo,
        minTotal,
        ordersCount: orders.length,
      }),
    [search, sortBy, customerFilter, dateFrom, dateTo, minTotal, orders.length],
  );

  const visibleCount =
    paginationState.key === filterKey ? paginationState.count : PAGE_SIZE;
  const visibleOrders = filteredOrders.slice(0, visibleCount);
  const hasMore = visibleCount < filteredOrders.length;

  const exportRows = useMemo(() => {
    const rows = [];

    filteredOrders.forEach((order) => {
      const items = Array.isArray(order.order_items) ? order.order_items : [];
      if (items.length === 0) {
        rows.push({
          orderId: order.id ?? "",
          date: formatDateTime(order.created_at),
          customer: order.customer_name || "Walk-in",
          mobile:
            order.customer_mobile || order.mobile || order.customer?.mobile || "",
          total: Number(order.total || 0).toFixed(2),
          itemIndex: "",
          productName: "",
          qty: "",
          unitName: "",
          unitPrice: "",
          unitMultiplier: "",
          lineTotal: "",
        });
        return;
      }

      items.forEach((item, idx) => {
        const qty = Number(item.qty || 0);
        const unitPrice = Number(item.price || 0);
        const unitMultiplier = Number(item.unit_multiplier || 1);
        rows.push({
          orderId: order.id ?? "",
          date: formatDateTime(order.created_at),
          customer: order.customer_name || "Walk-in",
          mobile:
            order.customer_mobile || order.mobile || order.customer?.mobile || "",
          total: Number(order.total || 0).toFixed(2),
          itemIndex: idx + 1,
          productName: item.product_name || "",
          qty,
          unitName: item.unit_name || "",
          unitPrice: unitPrice.toFixed(2),
          unitMultiplier,
          lineTotal: (qty * unitPrice * unitMultiplier).toFixed(2),
        });
      });
    });

    return rows;
  }, [filteredOrders, formatDateTime]);

  const exportCsv = () => {
    if (exportRows.length === 0) {
      alert("No orders to export");
      return;
    }

    const headers = [
      "Order ID",
      "Date",
      "Customer",
      "Mobile",
      "Order Total",
      "Item #",
      "Product",
      "Qty",
      "Unit",
      "Unit Price",
      "Unit Multiplier",
      "Line Total",
    ];

    const lines = [
      headers.join(","),
      ...exportRows.map((row) =>
        [
          row.orderId,
          row.date,
          row.customer,
          row.mobile,
          row.total,
          row.itemIndex,
          row.productName,
          row.qty,
          row.unitName,
          row.unitPrice,
          row.unitMultiplier,
          row.lineTotal,
        ]
          .map(escapeCsv)
          .join(","),
      ),
    ];

    const csv = `\uFEFF${lines.join("\n")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    if (exportRows.length === 0) {
      alert("No orders to export");
      return;
    }

    const htmlRows = exportRows
      .map(
        (row) => `
          <tr>
            <td>${escapeHtml(row.orderId)}</td>
            <td>${escapeHtml(row.date)}</td>
            <td>${escapeHtml(row.customer)}</td>
            <td>${escapeHtml(row.mobile)}</td>
            <td>${escapeHtml(row.total)}</td>
            <td>${escapeHtml(row.itemIndex)}</td>
            <td>${escapeHtml(row.productName)}</td>
            <td>${escapeHtml(row.qty)}</td>
            <td>${escapeHtml(row.unitName)}</td>
            <td>${escapeHtml(row.unitPrice)}</td>
            <td>${escapeHtml(row.unitMultiplier)}</td>
            <td>${escapeHtml(row.lineTotal)}</td>
          </tr>
        `,
      )
      .join("");

    const printHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Orders Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { margin: 0 0 8px; font-size: 20px; }
            p { margin: 0 0 16px; color: #444; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>Orders Export</h1>
          <p>Generated on ${escapeHtml(formatDateTime(new Date().toISOString()))}</p>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Mobile</th>
                <th>Order Total</th>
                <th>Item #</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Unit Price</th>
                <th>Unit Multiplier</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>${htmlRows}</tbody>
          </table>
        </body>
      </html>
    `;

    const w = window.open("", "_blank");
    if (!w) {
      alert("Popup blocked. Please allow popups and try again.");
      return;
    }

    w.document.open();
    w.document.write(printHtml);
    w.document.close();

    const triggerPrint = () => {
      try {
        w.focus();
        w.print();
      } catch (error) {
        console.error("Print trigger failed:", error);
      }
    };

    if (w.document.readyState === "complete") {
      setTimeout(triggerPrint, 500);
    } else {
      w.onload = () => {
        setTimeout(triggerPrint, 500);
      };
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedOrderId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedOrderId) {
      setDeletingOrderId(selectedOrderId);
      await onDeleteOrder?.(selectedOrderId);
      setDeletingOrderId(null);
    }
    setConfirmOpen(false);
    setSelectedOrderId(null);
  };

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2.5 }, pb: 6, maxWidth: 1120, mx: "auto" }}>
      <Paper
        sx={{
          p: 2,
          mb: 1.5,
          borderRadius: 2.5,
          border: "1px solid rgba(148,163,184,0.22)",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <Stack spacing={1.5}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                variant="outlined"
                size="small"
                aria-label="Go back to catalog"
              >
                Back
              </Button>
              <Typography variant="h5" fontWeight={800}>
                Orders
              </Typography>
            </Stack>
            <Chip
              icon={<InsightsIcon />}
              label={`${summary.totalOrders} matched`}
              color="primary"
              variant="outlined"
            />
          </Stack>

          <Divider />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              size="small"
              fullWidth
              label="Search"
              placeholder="Customer, order id, mobile, product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              aria-label="Search orders"
            />
            <TextField
              select
              size="small"
              label="Sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 180 } }}
            >
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="high">High Amount</MenuItem>
              <MenuItem value="low">Low Amount</MenuItem>
            </TextField>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              select
              size="small"
              label="Customer"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              fullWidth
            >
              <MenuItem value="all">All Customers</MenuItem>
              {customerOptions.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              label="Min Amount"
              type="number"
              value={minTotal}
              onChange={(e) => setMinTotal(e.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 150 } }}
              inputProps={{ min: 0 }}
            />
            <TextField
              size="small"
              label="High Value Tag"
              type="number"
              value={highValueThreshold}
              onChange={(e) => setHighValueThreshold(e.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 170 } }}
              inputProps={{ min: 0 }}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              size="small"
              label="From"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              size="small"
              label="To"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              variant="outlined"
              startIcon={<TableViewIcon />}
              onClick={exportCsv}
              aria-label="Export filtered orders as CSV"
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<PictureAsPdfIcon />}
              onClick={exportPdf}
              aria-label="Export filtered orders as PDF"
            >
              Export PDF
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Box
        sx={{
          mb: 1.5,
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 1,
        }}
      >
        <Paper sx={{ p: 1.25, borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Orders
          </Typography>
          <Typography fontWeight={800}>{summary.totalOrders}</Typography>
        </Paper>
        <Paper sx={{ p: 1.25, borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Total Value
          </Typography>
          <Typography fontWeight={800}>{formatAmount(summary.totalValue)}</Typography>
        </Paper>
        <Paper sx={{ p: 1.25, borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Avg Ticket
          </Typography>
          <Typography fontWeight={800}>{formatAmount(summary.avgTicket)}</Typography>
        </Paper>
        <Paper sx={{ p: 1.25, borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Today
          </Typography>
          <Typography fontWeight={800}>{summary.todayOrders}</Typography>
        </Paper>
      </Box>

      {loading && (
        <Paper sx={{ p: 3, textAlign: "center", mb: 1.25 }}>
          <Stack spacing={1} alignItems="center">
            <CircularProgress size={24} />
            <Typography color="text.secondary">Loading orders...</Typography>
          </Stack>
        </Paper>
      )}

      {!loading && filteredOrders.length === 0 && (
        <Paper sx={{ p: 3, textAlign: "center", mb: 1.25 }}>
          <Typography color="text.secondary">No orders found</Typography>
        </Paper>
      )}

      <Stack spacing={1.25}>
        {!loading &&
          visibleOrders.map((o, index) => {
            const isHighValue = Number(o.total || 0) > highValueLimit;

            return (
              <Accordion
                key={o.id}
                disableGutters
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid rgba(148,163,184,0.2)",
                  "&::before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-label={`Expand order ${o.id}`}
                >
                  <Stack sx={{ width: "100%" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography fontWeight={800}>
                        #{filteredOrders.length - index} - {o.customer_name || "Walk-in"}
                      </Typography>
                      {isHighValue && <Chip size="small" color="success" label="High Value" />}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(o.created_at)}
                    </Typography>
                  </Stack>
                </AccordionSummary>

                <AccordionDetails>
                  <Stack spacing={1.2}>
                    {(o.order_items || []).map((it, i) => (
                      <Typography
                        key={`${o.id}-${it.product_id || it.product_name}-${it.unit_name || "unit"}-${i}`}
                        fontSize={14}
                      >
                        {i + 1}. {it.product_name} -{" "}
                        <b>
                          {it.qty} {it.unit_name}
                        </b>{" "}
                        x {formatAmount(it.price)}
                      </Typography>
                    ))}

                    <Stack direction="row" justifyContent="space-between" alignItems="center" mt={0.5}>
                      <Typography fontWeight={800} fontSize={16}>
                        Total: {formatAmount(o.total)}
                      </Typography>

                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(o.id)}
                          disabled={deletingOrderId === o.id}
                          aria-label={`Delete order ${o.id}`}
                        >
                          {deletingOrderId === o.id ? "Deleting..." : "Delete"}
                        </Button>

                        <Button
                          size="small"
                          startIcon={<WhatsAppIcon />}
                          sx={{
                            bgcolor: "#16a34a",
                            color: "#fff",
                            "&:hover": { bgcolor: "#15803d" },
                          }}
                          aria-label={`Share order ${o.id} on WhatsApp`}
                          onClick={() => {
                            let msg = `*MANGALYA AGENCIES*\n\n`;
                            msg += `Customer: ${o.customer_name || "Walk-in"}\n`;
                            msg += `Date: ${formatDateTime(o.created_at)}\n\n`;

                            (o.order_items || []).forEach((it, idx) => {
                              msg += `${idx + 1}) ${it.product_name}\n`;
                              msg += `   ${it.qty} ${it.unit_name} x ${formatAmount(it.price)} = ${formatAmount(
                                it.qty * it.price * (it.unit_multiplier || 1),
                              )}\n\n`;
                            });

                            msg += `------------------\nTotal: ${formatAmount(o.total)}`;

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

      {!loading && hasMore && (
        <Box sx={{ mt: 1.5, textAlign: "center" }}>
          <Button
            variant="outlined"
            onClick={() =>
              setPaginationState({
                key: filterKey,
                count: visibleCount + PAGE_SIZE,
              })
            }
            aria-label="Load more orders"
          >
            Load More
          </Button>
        </Box>
      )}

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="delete-order-title"
        aria-describedby="delete-order-description"
      >
        <DialogTitle id="delete-order-title">Delete Order?</DialogTitle>
        <DialogContent id="delete-order-description">
          Are you sure you want to permanently delete this order?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={Boolean(deletingOrderId)}
          >
            {deletingOrderId ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
