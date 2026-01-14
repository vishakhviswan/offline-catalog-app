// src/importProducts.js

const importedProducts = [
  {
    id: 101,
    name: "Floor Mop",
    price: 120,
    categoryId: "c2", // 🔥 MUST MATCH categories
    units: [{ name: "Piece", multiplier: 1 }],
    image: null,
  },
  {
    id: 102,
    name: "Plastic Bucket",
    price: 180,
    categoryId: "c3",
    units: [{ name: "Piece", multiplier: 1 }],
    image: null,
  },
];

export default importedProducts;