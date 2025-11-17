# Fix Stock Object Handling in React Components

## Information Gathered
- product.stock is an object: {quantity, unit, lowStockThreshold}
- Components treat stock as number, causing "Objects are not valid as a React child" error
- API expects stock.quantity for updates
- Need to access product.stock.quantity everywhere stock is used as number

## Plan
- Update ProductManagement.js:
  - Change formData to use stockQuantity instead of stock
  - In handleEdit, set stockQuantity: product.stock.quantity
  - Form input: value={formData.stockQuantity}, onChange sets stockQuantity
  - In handleSubmit, send { stock: parseInt(formData.stockQuantity) } (API expects quantity)
  - Table rendering: {product.stock.quantity}
  - Comparisons: product.stock.quantity > 10 etc.
- Update StockManagement.js:
  - updateStock: send { stock: parseInt(newStock) } (API expects quantity)
  - getStockStatus(product.stock.quantity)
  - Rendering: {product.stock.quantity}
  - setNewStock(product.stock.quantity.toString())
- Update ProductCard.js:
  - getStockStatus: use product.stock.quantity
  - Button disabled: product.stock.quantity === 0
- Update Cart.js:
  - Quantity limit: item.quantity >= product.stock.quantity
  - Warning: Only {product.stock.quantity} left in stock

## Completed Tasks
- [x] Update ProductManagement.js: Changed formData to stockQuantity, updated handleEdit, form input, table rendering, and comparisons
- [x] Update StockManagement.js: Updated getStockStatus to use product.stock.quantity, rendering, and setNewStock
- [x] Update ProductCard.js: Updated getStockStatus and button disabled logic to use product.stock.quantity
- [x] Update Cart.js: Updated quantity limit and stock warning to use product.stock.quantity

## Dependent Files to be edited
- eGrocery/client/src/components/admin/ProductManagement.js
- eGrocery/client/src/components/admin/StockManagement.js
- eGrocery/client/src/components/common/ProductCard.js
- eGrocery/client/src/components/customer/Cart.js

## Followup steps
- Test the application to ensure no React errors
- Verify stock updates work correctly
- Check that stock displays properly in all components
