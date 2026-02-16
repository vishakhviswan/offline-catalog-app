import {
  Drawer,
  Box,
  Typography,
  Stack,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

export default function FilterDrawer({
  open,
  onClose,
  imageFilter,
  setImageFilter,
  sortOption,
  setSortOption,
  layoutMode,
  setLayoutMode,
}) {
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box sx={{ p: 3 }}>
        <Typography fontWeight={800}>Image Filter</Typography>
        <RadioGroup
          value={imageFilter}
          onChange={(e) => setImageFilter(e.target.value)}
        >
          <FormControlLabel value="all" control={<Radio />} label="All" />
          <FormControlLabel
            value="with"
            control={<Radio />}
            label="With Image"
          />
          <FormControlLabel
            value="without"
            control={<Radio />}
            label="Without Image"
          />
        </RadioGroup>

        <Typography fontWeight={800} mt={2}>
          Sort
        </Typography>
        <RadioGroup
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <FormControlLabel
            value="default"
            control={<Radio />}
            label="Default"
          />
          <FormControlLabel
            value="price-low"
            control={<Radio />}
            label="Price Low → High"
          />
          <FormControlLabel
            value="price-high"
            control={<Radio />}
            label="Price High → Low"
          />
          <FormControlLabel value="az" control={<Radio />} label="A → Z" />
        </RadioGroup>

        <Typography fontWeight={800} mt={2}>
          Layout
        </Typography>
        <RadioGroup
          value={layoutMode}
          onChange={(e) => setLayoutMode(e.target.value)}
        >
          <FormControlLabel value="list" control={<Radio />} label="List" />
          <FormControlLabel
            value="grid-2"
            control={<Radio />}
            label="2 Column"
          />
          <FormControlLabel
            value="grid-3"
            control={<Radio />}
            label="3 Column"
          />
          <FormControlLabel
            value="grid-4"
            control={<Radio />}
            label="4 Column"
          />
        </RadioGroup>

        <Button fullWidth variant="contained" onClick={onClose}>
          Apply
        </Button>
      </Box>
    </Drawer>
  );
}
