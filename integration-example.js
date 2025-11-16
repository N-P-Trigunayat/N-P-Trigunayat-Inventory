// Example: How to use the API Client in your React components

import apiClient from './apiClient';

// ============== USAGE EXAMPLES ==============

// 1. LOGIN
async function handleLogin(email, password) {
  try {
    const response = await apiClient.login(email, password);
    console.log('Logged in as:', response.user.name);
    // Redirect to dashboard
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

// 2. GET ALL PRODUCTS
async function loadProducts() {
  try {
    const products = await apiClient.getProducts();
    console.log('Products:', products);
    // Update UI with products
  } catch (error) {
    console.error('Failed to load products:', error.message);
  }
}

// 3. CREATE NEW PRODUCT
async function addProduct() {
  try {
    const newProduct = {
      name: 'New Product',
      sku: 'PROD-001',
      category: 'Electronics',
      description: 'A great product',
      price: 5000,
      costPrice: 3000,
      stock: 10,
      reorderLevel: 5,
      featured: true,
    };
    const result = await apiClient.createProduct(newProduct);
    console.log('Product created:', result);
  } catch (error) {
    console.error('Failed to create product:', error.message);
  }
}

// 4. UPDATE PRODUCT
async function updateProduct(productId) {
  try {
    const updated = {
      name: 'Updated Name',
      stock: 20,
    };
    const result = await apiClient.updateProduct(productId, updated);
    console.log('Product updated:', result);
  } catch (error) {
    console.error('Failed to update product:', error.message);
  }
}

// 5. DELETE PRODUCT
async function removeProduct(productId) {
  try {
    await apiClient.deleteProduct(productId);
    console.log('Product deleted');
  } catch (error) {
    console.error('Failed to delete product:', error.message);
  }
}

// 6. CREATE INVOICE
async function generateInvoice() {
  try {
    const invoice = {
      invoiceNo: 'INV-2025-101',
      items: [
        { productId: 1, qty: 2, price: 5000 },
        { productId: 2, qty: 1, price: 3000 },
      ],
      total: 13000,
      discount: 1000,
      tax: 2160,
      finalAmount: 14160,
      customerName: 'John Doe',
      customerContact: 'john@example.com',
    };
    const result = await apiClient.createInvoice(invoice);
    console.log('Invoice created:', result);
  } catch (error) {
    console.error('Failed to create invoice:', error.message);
  }
}

// 7. GET ALL CATEGORIES
async function loadCategories() {
  try {
    const categories = await apiClient.getCategories();
    console.log('Categories:', categories);
  } catch (error) {
    console.error('Failed to load categories:', error.message);
  }
}

// 8. LOGOUT
function handleLogout() {
  apiClient.logout();
  console.log('Logged out');
  // Redirect to login page
}
