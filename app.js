const { useState, useEffect, useContext, createContext, useRef } = React;

// ==================== IN-MEMORY STORAGE SERVICE ====================
// Using in-memory storage instead of localStorage for sandboxed environment
const inMemoryStorage = {};

const StorageService = {
  get: (key) => {
    try {
      const item = inMemoryStorage[key];
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      inMemoryStorage[key] = JSON.stringify(value);
    } catch (error) {
      console.error('Error writing to storage:', error);
    }
  },
  remove: (key) => {
    try {
      delete inMemoryStorage[key];
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  },
  clear: () => {
    try {
      Object.keys(inMemoryStorage).forEach(key => delete inMemoryStorage[key]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};

// ==================== SEED DATA ====================
const SEED_DATA = {
  categories: [
    { id: 1, name: "Electronics", description: "Electronic components and devices" },
    { id: 2, name: "Mechanical", description: "Mechanical parts and assemblies" },
    { id: 3, name: "Software", description: "Software and licenses" },
    { id: 4, name: "Hardware", description: "Hardware components" },
    { id: 5, name: "Accessories", description: "Accessories and add-ons" }
  ],
  products: [
    { id: 1, name: "Laptop HP Pavilion 15", sku: "ELEC-0001", category: "Electronics", description: "15-inch laptop with Intel i7 processor", price: 75000, costPrice: 65000, stock: 12, reorderLevel: 5, featured: true, images: [], createdAt: "2025-11-01" },
    { id: 2, name: "Monitor Dell 24 inch", sku: "ELEC-0002", category: "Electronics", description: "Full HD 24-inch monitor", price: 15000, costPrice: 12000, stock: 3, reorderLevel: 5, featured: false, images: [], createdAt: "2025-11-02" },
    { id: 3, name: "USB Cable Type-C", sku: "ACCS-0001", category: "Accessories", description: "High-speed USB 3.0 Type-C cable, 2 meters", price: 299, costPrice: 150, stock: 45, reorderLevel: 20, featured: false, images: [], createdAt: "2025-11-03" },
    { id: 4, name: "Mechanical Keyboard RGB", sku: "ACCS-0002", category: "Accessories", description: "Mechanical keyboard with RGB backlight", price: 5999, costPrice: 3500, stock: 8, reorderLevel: 5, featured: true, images: [], createdAt: "2025-11-04" },
    { id: 5, name: "Wireless Mouse Logitech", sku: "ACCS-0003", category: "Accessories", description: "Wireless mouse with ergonomic design", price: 2499, costPrice: 1200, stock: 0, reorderLevel: 10, featured: false, images: [], createdAt: "2025-11-05" },
    { id: 6, name: "Processor Intel i7-12700K", sku: "HARD-0001", category: "Hardware", description: "High-performance desktop processor", price: 35000, costPrice: 28000, stock: 6, reorderLevel: 3, featured: true, images: [], createdAt: "2025-11-06" },
    { id: 7, name: "RAM DDR5 32GB", sku: "HARD-0002", category: "Hardware", description: "DDR5 memory 32GB dual channel", price: 18000, costPrice: 14000, stock: 15, reorderLevel: 8, featured: false, images: [], createdAt: "2025-11-07" },
    { id: 8, name: "SSD Samsung 1TB", sku: "HARD-0003", category: "Hardware", description: "NVMe SSD 1TB storage", price: 8500, costPrice: 6500, stock: 22, reorderLevel: 10, featured: false, images: [], createdAt: "2025-11-08" },
    { id: 9, name: "Power Supply 850W Gold", sku: "HARD-0004", category: "Hardware", description: "80+ Gold certified 850W power supply", price: 9999, costPrice: 7000, stock: 4, reorderLevel: 3, featured: false, images: [], createdAt: "2025-11-09" },
    { id: 10, name: "Graphics Card RTX 4070", sku: "HARD-0005", category: "Hardware", description: "NVIDIA RTX 4070 graphics card", price: 65000, costPrice: 55000, stock: 2, reorderLevel: 2, featured: true, images: [], createdAt: "2025-11-10" },
    { id: 11, name: "Monitor Arm Stand", sku: "MECH-0001", category: "Mechanical", description: "Adjustable monitor arm for dual monitors", price: 3500, costPrice: 2000, stock: 18, reorderLevel: 8, featured: false, images: [], createdAt: "2025-11-11" },
    { id: 12, name: "Laptop Cooling Pad", sku: "ACCS-0004", category: "Accessories", description: "Dual fan cooling pad for laptops", price: 1999, costPrice: 1000, stock: 7, reorderLevel: 5, featured: false, images: [], createdAt: "2025-11-12" },
    { id: 13, name: "Windows 11 Pro License", sku: "SOFT-0001", category: "Software", description: "Windows 11 Professional license key", price: 15000, costPrice: 8000, stock: 50, reorderLevel: 20, featured: false, images: [], createdAt: "2025-11-13" },
    { id: 14, name: "Cable Organizer Kit", sku: "MECH-0002", category: "Mechanical", description: "Complete cable management kit", price: 1299, costPrice: 600, stock: 25, reorderLevel: 15, featured: false, images: [], createdAt: "2025-11-13" },
    { id: 15, name: "Office Chair Pro", sku: "MECH-0003", category: "Mechanical", description: "Ergonomic office chair with lumbar support", price: 18999, costPrice: 12000, stock: 5, reorderLevel: 2, featured: true, images: [], createdAt: "2025-11-13" }
  ],
  invoices: [
    { id: 1, invoiceNo: "INV-2025-001", items: [{ productId: 1, qty: 1, price: 75000 }, { productId: 3, qty: 2, price: 299 }], total: 75598, discount: 0, tax: 13607.64, finalAmount: 89205.64, customerName: "Tech Solutions Pvt Ltd", customerContact: "contact@techsol.com", createdAt: "2025-11-10" },
    { id: 2, invoiceNo: "INV-2025-002", items: [{ productId: 4, qty: 3, price: 5999 }, { productId: 5, qty: 2, price: 2499 }], total: 22497, discount: 2000, tax: 3689.46, finalAmount: 24186.46, customerName: "Digital Hub India", customerContact: "sales@digitalhub.in", createdAt: "2025-11-11" }
  ],
  catalogues: [
    { id: 1, name: "General Product Catalogue 2025", products: [1, 2, 3, 4, 6, 7, 8, 10, 12, 13, 15], createdBy: "Admin User", createdAt: "2025-11-12" }
  ],
  users: [
    { id: 1, name: "Admin User", email: "admin@np.com", role: "Super Admin", password: "admin123", createdAt: "2025-01-01", lastLogin: null, activityLog: [] }
  ],
  logs: [],
  settings: {
    companyName: "N.P. Trigunayat Systems",
    gstRate: 18,
    currency: "₹",
    invoiceNumberFormat: "INV-YYYY-NNN",
    sessionTimeoutMinutes: 15
  }
};

// ==================== DATA SERVICE ====================
class DataService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    if (!StorageService.get('appInitialized')) {
      StorageService.set('categories', SEED_DATA.categories);
      StorageService.set('products', SEED_DATA.products);
      StorageService.set('invoices', SEED_DATA.invoices);
      StorageService.set('catalogues', SEED_DATA.catalogues);
      StorageService.set('users', SEED_DATA.users);
      StorageService.set('logs', SEED_DATA.logs);
      StorageService.set('settings', SEED_DATA.settings);
      StorageService.set('appInitialized', true);
    }
  }

  // Categories
  getCategories() { return StorageService.get('categories') || []; }
  saveCategories(categories) { StorageService.set('categories', categories); }

  // Products
  getProducts() { return StorageService.get('products') || []; }
  saveProducts(products) { StorageService.set('products', products); }

  // Invoices
  getInvoices() { return StorageService.get('invoices') || []; }
  saveInvoices(invoices) { StorageService.set('invoices', invoices); }

  // Catalogues
  getCatalogues() { return StorageService.get('catalogues') || []; }
  saveCatalogues(catalogues) { StorageService.set('catalogues', catalogues); }

  // Users
  getUsers() { return StorageService.get('users') || []; }
  saveUsers(users) { StorageService.set('users', users); }

  // Logs
  getLogs() { return StorageService.get('logs') || []; }
  saveLogs(logs) { StorageService.set('logs', logs); }
  addLog(log) {
    const logs = this.getLogs();
    logs.push({ ...log, id: Date.now(), timestamp: new Date().toISOString() });
    this.saveLogs(logs);
  }

  // Settings
  getSettings() { return StorageService.get('settings') || SEED_DATA.settings; }
  saveSettings(settings) { StorageService.set('settings', settings); }

  // Stock movements
  getStockMovements() { return StorageService.get('stockMovements') || []; }
  saveStockMovements(movements) { StorageService.set('stockMovements', movements); }
  addStockMovement(movement) {
    const movements = this.getStockMovements();
    movements.push({ ...movement, id: Date.now(), timestamp: new Date().toISOString() });
    this.saveStockMovements(movements);
  }
}

const dataService = new DataService();

// ==================== AUTH CONTEXT ====================
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimer = useRef(null);

  useEffect(() => {
    const token = StorageService.get('authToken');
    const userData = StorageService.get('userData');
    if (token && userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      resetInactivityTimer();
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
      events.forEach(event => window.addEventListener(event, resetInactivityTimer));
      return () => {
        events.forEach(event => window.removeEventListener(event, resetInactivityTimer));
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      };
    }
  }, [user]);

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      logout();
      alert('Session expired due to inactivity');
    }, 15 * 60 * 1000); // 15 minutes
  };

  const login = (email, password) => {
    const users = dataService.getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userData = { id: foundUser.id, name: foundUser.name, email: foundUser.email, role: foundUser.role };
      const token = `token_${Date.now()}_${foundUser.id}`;
      StorageService.set('authToken', token);
      StorageService.set('userData', userData);
      setUser(userData);
      
      // Update last login
      const updatedUsers = users.map(u => u.id === foundUser.id ? { ...u, lastLogin: new Date().toISOString() } : u);
      dataService.saveUsers(updatedUsers);
      
      // Add log
      dataService.addLog({
        userId: foundUser.id,
        action: 'Login',
        entity: 'User',
        details: `${foundUser.name} logged in`
      });
      
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    if (user) {
      dataService.addLog({
        userId: user.id,
        action: 'Logout',
        entity: 'User',
        details: `${user.name} logged out`
      });
    }
    StorageService.remove('authToken');
    StorageService.remove('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// ==================== TOAST CONTEXT ====================
const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✗' : 'ℹ'}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => useContext(ToastContext);

// ==================== LOGIN PAGE ====================
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>N.P. Trigunayat Systems</h1>
          <p>Admin-Only Core Inventory Management Platform This is just a Demo</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@np.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember">Remember me</label>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="demo-credentials">
          <strong>Demo Credentials:</strong><br />
          Email: admin@np.com<br />
          Password: admin123
        </div>
      </div>
    </div>
  );
};

// ==================== DASHBOARD PAGE ====================
const DashboardPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [logs, setLogs] = useState([]);
  const chartRefs = useRef({});

  useEffect(() => {
    setProducts(dataService.getProducts());
    setInvoices(dataService.getInvoices());
    setLogs(dataService.getLogs());
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      renderCharts();
    }
  }, [products, invoices]);

  const getLowStockCount = () => products.filter(p => p.stock <= p.reorderLevel).length;
  const getMonthlyRevenue = () => {
    const thisMonth = new Date().getMonth();
    return invoices
      .filter(inv => new Date(inv.createdAt).getMonth() === thisMonth)
      .reduce((sum, inv) => sum + inv.finalAmount, 0);
  };
  const getInventoryValue = () => products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);

  const renderCharts = () => {
    // Stock Status Distribution
    if (chartRefs.current.stockStatus) {
      const ctx = chartRefs.current.stockStatus.getContext('2d');
      const inStock = products.filter(p => p.stock > p.reorderLevel).length;
      const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.reorderLevel).length;
      const outOfStock = products.filter(p => p.stock === 0).length;
      
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['In Stock', 'Low Stock', 'Out of Stock'],
          datasets: [{
            label: 'Products',
            data: [inStock, lowStock, outOfStock],
            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true, ticks: { color: '#b0b0b0' }, grid: { color: '#404040' } },
            x: { ticks: { color: '#b0b0b0' }, grid: { color: '#404040' } }
          }
        }
      });
    }

    // Category Distribution
    if (chartRefs.current.categoryDist) {
      const ctx = chartRefs.current.categoryDist.getContext('2d');
      const categories = dataService.getCategories();
      const data = categories.map(cat => products.filter(p => p.category === cat.name).length);
      
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: categories.map(c => c.name),
          datasets: [{
            data: data,
            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#b0b0b0' } }
          }
        }
      });
    }
  };

  return (
    <div className="page-content">
      <div className="welcome-card">
        <h2>Welcome back, {user?.name}!</h2>
        <p>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Products</span>
            <div className="kpi-icon">📦</div>
          </div>
          <div className="kpi-value">{products.length}</div>
          <div className="kpi-trend">↗ Active inventory</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Stock Levels</span>
            <div className="kpi-icon">📊</div>
          </div>
          <div className="kpi-value">{products.reduce((sum, p) => sum + p.stock, 0)}</div>
          <div className="kpi-trend">Total units in stock</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Low Stock Alerts</span>
            <div className="kpi-icon">⚠️</div>
          </div>
          <div className="kpi-value" style={{color: '#FFC185'}}>{getLowStockCount()}</div>
          <div className="kpi-trend">Items need restocking</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Invoices</span>
            <div className="kpi-icon">🧾</div>
          </div>
          <div className="kpi-value">{invoices.length}</div>
          <div className="kpi-trend">All time invoices</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Monthly Revenue</span>
            <div className="kpi-icon">💰</div>
          </div>
          <div className="kpi-value">₹{Math.round(getMonthlyRevenue()).toLocaleString()}</div>
          <div className="kpi-trend">This month</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Inventory Value</span>
            <div className="kpi-icon">💎</div>
          </div>
          <div className="kpi-value">₹{Math.round(getInventoryValue()).toLocaleString()}</div>
          <div className="kpi-trend">Total cost value</div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Stock Status Distribution</h3>
          <div className="chart-container">
            <canvas ref={el => chartRefs.current.stockStatus = el}></canvas>
          </div>
        </div>

        <div className="chart-card">
          <h3>Products by Category</h3>
          <div className="chart-container">
            <canvas ref={el => chartRefs.current.categoryDist = el}></canvas>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Recent Activity</h3>
        </div>
        <div style={{padding: '24px'}}>
          {logs.slice(-5).reverse().map(log => (
            <div key={log.id} className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <p>{log.details}</p>
                <span>{new Date(log.timestamp).toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
          {logs.length === 0 && <div className="table-empty">No activity recorded yet</div>}
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Recent Invoices</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoices.slice(-5).reverse().map(inv => (
              <tr key={inv.id}>
                <td>{inv.invoiceNo}</td>
                <td>{inv.customerName}</td>
                <td>{new Date(inv.createdAt).toLocaleDateString('en-IN')}</td>
                <td>₹{inv.finalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && <div className="table-empty">No invoices created yet</div>}
      </div>
    </div>
  );
};

// ==================== PRODUCTS PAGE ====================
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    loadProducts();
    setCategories(dataService.getCategories());
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterCategory, filterStock]);

  const loadProducts = () => {
    setProducts(dataService.getProducts());
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterCategory) {
      filtered = filtered.filter(p => p.category === filterCategory);
    }
    
    if (filterStock === 'low') {
      filtered = filtered.filter(p => p.stock <= p.reorderLevel && p.stock > 0);
    } else if (filterStock === 'out') {
      filtered = filtered.filter(p => p.stock === 0);
    } else if (filterStock === 'in') {
      filtered = filtered.filter(p => p.stock > p.reorderLevel);
    }
    
    setFilteredProducts(filtered);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      dataService.saveProducts(updatedProducts);
      loadProducts();
      dataService.addLog({
        userId: user.id,
        action: 'Delete',
        entity: 'Product',
        details: `Deleted product ID ${productId}`
      });
      showToast('Product deleted successfully', 'success');
    }
  };

  const getStockStatus = (product) => {
    if (product.stock === 0) return { label: 'Out of Stock', class: 'error' };
    if (product.stock <= product.reorderLevel) return { label: 'Low Stock', class: 'warning' };
    return { label: 'In Stock', class: 'success' };
  };

  const exportToCSV = () => {
    const headers = ['Name', 'SKU', 'Category', 'Price', 'Cost Price', 'Stock', 'Reorder Level'];
    const rows = filteredProducts.map(p => [
      p.name, p.sku, p.category, p.price, p.costPrice, p.stock, p.reorderLevel
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${Date.now()}.csv`;
    a.click();
    showToast('Products exported to CSV', 'success');
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Products</h1>
        <p>Manage your product inventory</p>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Category</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Stock Status</label>
          <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)}>
            <option value="">All Stock</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
        
        <div className="filter-group" style={{display: 'flex', alignItems: 'flex-end', gap: '12px'}}>
          <button className="btn btn-success" onClick={handleAddProduct}>
            ➕ Add Product
          </button>
          <button className="btn btn-secondary" onClick={exportToCSV}>
            📥 Export CSV
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => {
              const status = getStockStatus(product);
              return (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    {product.featured && <span style={{marginLeft: '8px', fontSize: '16px'}}>⭐</span>}
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>₹{product.price.toLocaleString()}</td>
                  <td><span className={`status-badge ${status.class}`}>{status.label}</span></td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => handleEditProduct(product)} style={{marginRight: '8px'}}>✏️ Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(product.id)}>🗑️ Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredProducts.length === 0 && <div className="table-empty">No products found</div>}
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSave={() => {
            loadProducts();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

const ProductModal = ({ product, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState(product || {
    name: '',
    sku: '',
    category: '',
    description: '',
    price: 0,
    costPrice: 0,
    stock: 0,
    reorderLevel: 0,
    featured: false,
    images: []
  });
  const { user } = useAuth();
  const { showToast } = useToast();

  const generateSKU = () => {
    if (!formData.category) {
      alert('Please select a category first');
      return;
    }
    const prefix = formData.category.substring(0, 4).toUpperCase();
    const products = dataService.getProducts();
    const categoryProducts = products.filter(p => p.category === formData.category);
    const nextNum = String(categoryProducts.length + 1).padStart(4, '0');
    setFormData({ ...formData, sku: `${prefix}-${nextNum}` });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const products = dataService.getProducts();
    
    if (product) {
      // Edit existing
      const updated = products.map(p => p.id === product.id ? { ...formData, id: p.id, updatedAt: new Date().toISOString() } : p);
      dataService.saveProducts(updated);
      dataService.addLog({
        userId: user.id,
        action: 'Update',
        entity: 'Product',
        details: `Updated product: ${formData.name}`
      });
      showToast('Product updated successfully', 'success');
    } else {
      // Add new
      const newProduct = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      dataService.saveProducts([...products, newProduct]);
      dataService.addLog({
        userId: user.id,
        action: 'Create',
        entity: 'Product',
        details: `Created product: ${formData.name}`
      });
      showToast('Product created successfully', 'success');
    }
    
    onSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>SKU *</label>
                <div style={{display: 'flex', gap: '8px'}}>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    required
                    style={{flex: 1}}
                  />
                  <button type="button" className="btn btn-secondary" onClick={generateSKU}>
                    🔄 Generate
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                style={{width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #404040', borderRadius: '8px', color: 'white', fontFamily: 'inherit', fontSize: '14px'}}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Purchase Price *</label>
                <input
                  type="number"
                  value={formData.costPrice}
                  onChange={e => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label>Selling Price *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label>Reorder Level *</label>
                <input
                  type="number"
                  value={formData.reorderLevel}
                  onChange={e => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                />
              </div>
            </div>
            
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={e => setFormData({ ...formData, featured: e.target.checked })}
              />
              <label htmlFor="featured">Mark as Featured Product</label>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-success">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== INVENTORY PAGE ====================
const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState('');
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProducts(dataService.getProducts());
    setMovements(dataService.getStockMovements());
  };

  const handleStockAdjustment = (e) => {
    e.preventDefault();
    
    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (!product) return;
    
    const previousStock = product.stock;
    const newStock = adjustmentType === 'add' 
      ? previousStock + quantity 
      : Math.max(0, previousStock - quantity);
    
    // Update product stock
    const updatedProducts = products.map(p => 
      p.id === product.id ? { ...p, stock: newStock } : p
    );
    dataService.saveProducts(updatedProducts);
    
    // Add stock movement
    dataService.addStockMovement({
      productId: product.id,
      productName: product.name,
      action: adjustmentType === 'add' ? 'Added' : 'Reduced',
      quantity: quantity,
      previousStock: previousStock,
      newStock: newStock,
      reason: reason,
      userId: user.id,
      userName: user.name
    });
    
    // Add log
    dataService.addLog({
      userId: user.id,
      action: 'Stock Adjustment',
      entity: 'Inventory',
      details: `${adjustmentType === 'add' ? 'Added' : 'Reduced'} ${quantity} units of ${product.name}`
    });
    
    showToast(`Stock ${adjustmentType === 'add' ? 'added' : 'reduced'} successfully`, 'success');
    
    // Reset form
    setSelectedProduct('');
    setQuantity(0);
    setReason('');
    loadData();
  };

  const lowStockProducts = products.filter(p => p.stock <= p.reorderLevel);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Inventory Management</h1>
        <p>Track and adjust stock levels</p>
      </div>

      <div className="stock-form">
        <h3 style={{marginBottom: '20px'}}>Stock Adjustment</h3>
        <form onSubmit={handleStockAdjustment}>
          <div className="form-row">
            <div className="form-group">
              <label>Select Product *</label>
              <select
                value={selectedProduct}
                onChange={e => setSelectedProduct(e.target.value)}
                required
              >
                <option value="">Choose a product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - Current Stock: {p.stock}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Adjustment Type *</label>
              <select
                value={adjustmentType}
                onChange={e => setAdjustmentType(e.target.value)}
                required
              >
                <option value="add">Add Stock</option>
                <option value="reduce">Reduce Stock</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value) || 0)}
                required
                min="1"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Reason / Notes</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows="2"
              placeholder="Enter reason for stock adjustment..."
              style={{width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #404040', borderRadius: '8px', color: 'white', fontFamily: 'inherit', fontSize: '14px'}}
            />
          </div>
          
          <button type="submit" className="btn btn-success">Update Stock</button>
        </form>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="table-container">
          <div className="table-header">
            <h3>Low Stock Alerts</h3>
            <span className="status-badge warning">{lowStockProducts.length} items</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.stock}</td>
                  <td>{p.reorderLevel}</td>
                  <td>
                    <span className={`status-badge ${p.stock === 0 ? 'error' : 'warning'}`}>
                      {p.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="table-container">
        <div className="table-header">
          <h3>Stock Movement History</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date &amp; Time</th>
              <th>Product</th>
              <th>Action</th>
              <th>Quantity</th>
              <th>Previous Stock</th>
              <th>New Stock</th>
              <th>User</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {movements.slice().reverse().map(m => (
              <tr key={m.id}>
                <td>{new Date(m.timestamp).toLocaleString('en-IN')}</td>
                <td>{m.productName}</td>
                <td>
                  <span className={`status-badge ${m.action === 'Added' ? 'success' : 'warning'}`}>
                    {m.action}
                  </span>
                </td>
                <td>{m.quantity}</td>
                <td>{m.previousStock}</td>
                <td>{m.newStock}</td>
                <td>{m.userName}</td>
                <td>{m.reason || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {movements.length === 0 && <div className="table-empty">No stock movements recorded</div>}
      </div>
    </div>
  );
};

// ==================== INVOICES PAGE ====================
const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    setInvoices(dataService.getInvoices());
  }, []);

  const handleDeleteInvoice = (invoiceId) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      const updated = invoices.filter(inv => inv.id !== invoiceId);
      dataService.saveInvoices(updated);
      setInvoices(updated);
      showToast('Invoice deleted', 'success');
    }
  };

  const downloadInvoicePDF = (invoice) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const products = dataService.getProducts();
    
    // Header
    doc.setFontSize(20);
    doc.text('N.P. Trigunayat Systems', 20, 20);
    doc.setFontSize(12);
    doc.text('INVOICE', 20, 30);
    
    // Invoice details
    doc.setFontSize(10);
    doc.text(`Invoice No: ${invoice.invoiceNo}`, 20, 45);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}`, 20, 52);
    doc.text(`Customer: ${invoice.customerName}`, 20, 59);
    doc.text(`Contact: ${invoice.customerContact}`, 20, 66);
    
    // Items table
    let y = 85;
    doc.text('Item', 20, y);
    doc.text('Qty', 100, y);
    doc.text('Price', 130, y);
    doc.text('Total', 160, y);
    
    y += 7;
    doc.line(20, y, 190, y);
    
    y += 7;
    invoice.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      doc.text(product?.name || 'Unknown', 20, y);
      doc.text(String(item.qty), 100, y);
      doc.text(`₹${item.price}`, 130, y);
      doc.text(`₹${item.qty * item.price}`, 160, y);
      y += 7;
    });
    
    // Totals
    y += 7;
    doc.line(20, y, 190, y);
    y += 7;
    doc.text(`Subtotal: ₹${invoice.total.toFixed(2)}`, 130, y);
    y += 7;
    doc.text(`Discount: ₹${invoice.discount.toFixed(2)}`, 130, y);
    y += 7;
    doc.text(`Tax (18%): ₹${invoice.tax.toFixed(2)}`, 130, y);
    y += 7;
    doc.setFontSize(12);
    doc.text(`TOTAL: ₹${invoice.finalAmount.toFixed(2)}`, 130, y);
    
    doc.save(`${invoice.invoiceNo}.pdf`);
    showToast('Invoice PDF downloaded', 'success');
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Invoices</h1>
        <p>Manage customer invoices</p>
      </div>

      <div style={{marginBottom: '20px'}}>
        <button className="btn btn-success" onClick={() => setShowCreateModal(true)}>
          ➕ Create New Invoice
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td><strong>{inv.invoiceNo}</strong></td>
                <td>{new Date(inv.createdAt).toLocaleDateString('en-IN')}</td>
                <td>{inv.customerName}</td>
                <td>{inv.items.length} items</td>
                <td>₹{inv.finalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => setViewInvoice(inv)} style={{marginRight: '8px'}}>👁️ View</button>
                  <button className="btn btn-sm btn-success" onClick={() => downloadInvoicePDF(inv)} style={{marginRight: '8px'}}>📥 PDF</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteInvoice(inv.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && <div className="table-empty">No invoices created yet</div>}
      </div>

      {showCreateModal && (
        <CreateInvoiceModal
          onClose={() => setShowCreateModal(false)}
          onSave={() => {
            setInvoices(dataService.getInvoices());
            setShowCreateModal(false);
          }}
        />
      )}

      {viewInvoice && (
        <ViewInvoiceModal
          invoice={viewInvoice}
          onClose={() => setViewInvoice(null)}
        />
      )}
    </div>
  );
};

const CreateInvoiceModal = ({ onClose, onSave }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [items, setItems] = useState([{ productId: '', qty: 1, price: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const { showToast } = useToast();
  const settings = dataService.getSettings();

  useEffect(() => {
    setProducts(dataService.getProducts());
  }, []);

  const addItem = () => {
    setItems([...items, { productId: '', qty: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    
    if (field === 'productId') {
      const product = products.find(p => p.id === parseInt(value));
      if (product) {
        updated[index].price = product.price;
      }
    }
    
    setItems(updated);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.qty * item.price);
    }, 0);
    const afterDiscount = subtotal - discount;
    const tax = (afterDiscount * settings.gstRate) / 100;
    const final = afterDiscount + tax;
    return { subtotal, tax, final };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (items.some(item => !item.productId)) {
      alert('Please select products for all items');
      return;
    }
    
    const totals = calculateTotals();
    const invoices = dataService.getInvoices();
    const invoiceNo = `INV-2025-${String(invoices.length + 1).padStart(3, '0')}`;
    
    const newInvoice = {
      id: Date.now(),
      invoiceNo,
      items: items.map(item => ({
        productId: parseInt(item.productId),
        qty: item.qty,
        price: item.price
      })),
      total: totals.subtotal,
      discount,
      tax: totals.tax,
      finalAmount: totals.final,
      customerName,
      customerContact,
      createdAt: new Date().toISOString()
    };
    
    // Update stock for each item
    const currentProducts = dataService.getProducts();
    const updatedProducts = currentProducts.map(p => {
      const invoiceItem = items.find(item => parseInt(item.productId) === p.id);
      if (invoiceItem) {
        return { ...p, stock: Math.max(0, p.stock - invoiceItem.qty) };
      }
      return p;
    });
    dataService.saveProducts(updatedProducts);
    
    // Save invoice
    dataService.saveInvoices([...invoices, newInvoice]);
    
    // Add log
    dataService.addLog({
      userId: user.id,
      action: 'Create',
      entity: 'Invoice',
      details: `Created invoice ${invoiceNo} for ${customerName}`
    });
    
    showToast('Invoice created successfully', 'success');
    onSave();
  };

  const totals = calculateTotals();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth: '800px'}}>
        <div className="modal-header">
          <h2>Create New Invoice</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <h4 style={{marginBottom: '16px'}}>Customer Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact</label>
                <input
                  type="text"
                  value={customerContact}
                  onChange={e => setCustomerContact(e.target.value)}
                />
              </div>
            </div>

            <h4 style={{marginTop: '24px', marginBottom: '16px'}}>Invoice Items</h4>
            {items.map((item, index) => (
              <div key={index} className="form-row" style={{marginBottom: '12px', alignItems: 'flex-end'}}>
                <div className="form-group" style={{flex: 2}}>
                  <label>Product *</label>
                  <select
                    value={item.productId}
                    onChange={e => updateItem(index, 'productId', e.target.value)}
                    required
                  >
                    <option value="">Select product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={e => updateItem(index, 'qty', parseInt(e.target.value) || 1)}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={e => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total</label>
                  <input
                    type="text"
                    value={`₹${(item.qty * item.price).toFixed(2)}`}
                    disabled
                    style={{background: '#1a1a1a'}}
                  />
                </div>
                {items.length > 1 && (
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(index)}>🗑️</button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>➕ Add Item</button>

            <div className="form-row" style={{marginTop: '24px'}}>
              <div className="form-group">
                <label>Discount (₹)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div style={{marginTop: '24px', padding: '16px', background: '#1a1a1a', borderRadius: '8px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <span>Subtotal:</span>
                <strong>₹{totals.subtotal.toFixed(2)}</strong>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <span>Discount:</span>
                <strong>₹{discount.toFixed(2)}</strong>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <span>Tax ({settings.gstRate}%):</span>
                <strong>₹{totals.tax.toFixed(2)}</strong>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #404040', fontSize: '18px'}}>
                <span>TOTAL:</span>
                <strong style={{color: '#ff9800'}}>₹{totals.final.toFixed(2)}</strong>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-success">Create Invoice</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewInvoiceModal = ({ invoice, onClose }) => {
  const products = dataService.getProducts();
  const settings = dataService.getSettings();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth: '800px'}}>
        <div className="modal-header">
          <h2>Invoice Details</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="invoice-preview">
            <div className="invoice-header">
              <div>
                <h2 style={{color: '#ff9800', marginBottom: '8px'}}>{settings.companyName}</h2>
                <p style={{color: '#666'}}>Inventory Management System</p>
              </div>
              <div style={{textAlign: 'right'}}>
                <h3 style={{color: '#333', marginBottom: '8px'}}>INVOICE</h3>
                <p style={{color: '#666'}}>{invoice.invoiceNo}</p>
                <p style={{color: '#666'}}>{new Date(invoice.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            <div style={{marginBottom: '30px'}}>
              <h4 style={{color: '#333', marginBottom: '8px'}}>Bill To:</h4>
              <p style={{color: '#666', margin: 0}}>{invoice.customerName}</p>
              <p style={{color: '#666', margin: 0}}>{invoice.customerContact}</p>
            </div>

            <table style={{width: '100%', marginBottom: '30px'}}>
              <thead style={{background: '#f5f5f5'}}>
                <tr>
                  <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0'}}>Item</th>
                  <th style={{padding: '12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0'}}>Qty</th>
                  <th style={{padding: '12px', textAlign: 'right', borderBottom: '2px solid #e0e0e0'}}>Price</th>
                  <th style={{padding: '12px', textAlign: 'right', borderBottom: '2px solid #e0e0e0'}}>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <tr key={idx}>
                      <td style={{padding: '12px', color: '#333', borderBottom: '1px solid #e0e0e0'}}>{product?.name || 'Unknown'}</td>
                      <td style={{padding: '12px', textAlign: 'center', color: '#333', borderBottom: '1px solid #e0e0e0'}}>{item.qty}</td>
                      <td style={{padding: '12px', textAlign: 'right', color: '#333', borderBottom: '1px solid #e0e0e0'}}>₹{item.price.toFixed(2)}</td>
                      <td style={{padding: '12px', textAlign: 'right', color: '#333', borderBottom: '1px solid #e0e0e0'}}>₹{(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{textAlign: 'right'}}>
              <div style={{marginBottom: '8px', color: '#666'}}>
                <span>Subtotal: </span>
                <strong>₹{invoice.total.toFixed(2)}</strong>
              </div>
              <div style={{marginBottom: '8px', color: '#666'}}>
                <span>Discount: </span>
                <strong>₹{invoice.discount.toFixed(2)}</strong>
              </div>
              <div style={{marginBottom: '16px', color: '#666'}}>
                <span>Tax ({settings.gstRate}%): </span>
                <strong>₹{invoice.tax.toFixed(2)}</strong>
              </div>
              <div style={{fontSize: '20px', color: '#333', paddingTop: '16px', borderTop: '2px solid #e0e0e0'}}>
                <span>TOTAL: </span>
                <strong style={{color: '#ff9800'}}>₹{invoice.finalAmount.toFixed(2)}</strong>
              </div>
            </div>

            <div style={{marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e0e0e0', textAlign: 'center', color: '#999', fontSize: '12px'}}>
              <p>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ==================== CATALOGUES PAGE ====================
const CataloguesPage = () => {
  const [catalogues, setCatalogues] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setCatalogues(dataService.getCatalogues());
  }, []);

  const handleDelete = (id) => {
    if (confirm('Delete this catalogue?')) {
      const updated = catalogues.filter(c => c.id !== id);
      dataService.saveCatalogues(updated);
      setCatalogues(updated);
      showToast('Catalogue deleted', 'success');
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Catalogues</h1>
        <p>Generate product catalogues</p>
      </div>

      <div style={{marginBottom: '20px'}}>
        <button className="btn btn-success" onClick={() => setShowCreateModal(true)}>
          ➕ Create New Catalogue
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Products</th>
              <th>Created By</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {catalogues.map(cat => (
              <tr key={cat.id}>
                <td><strong>{cat.name}</strong></td>
                <td>{cat.products.length} items</td>
                <td>{cat.createdBy}</td>
                <td>{new Date(cat.createdAt).toLocaleDateString('en-IN')}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {catalogues.length === 0 && <div className="table-empty">No catalogues created yet</div>}
      </div>

      {showCreateModal && (
        <CreateCatalogueModal
          onClose={() => setShowCreateModal(false)}
          onSave={() => {
            setCatalogues(dataService.getCatalogues());
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

const CreateCatalogueModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    setProducts(dataService.getProducts());
  }, []);

  const toggleProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const catalogues = dataService.getCatalogues();
    const newCatalogue = {
      id: Date.now(),
      name,
      products: selectedProducts,
      createdBy: user.name,
      createdAt: new Date().toISOString()
    };
    
    dataService.saveCatalogues([...catalogues, newCatalogue]);
    dataService.addLog({
      userId: user.id,
      action: 'Create',
      entity: 'Catalogue',
      details: `Created catalogue: ${name}`
    });
    
    showToast('Catalogue created successfully', 'success');
    onSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth: '600px'}}>
        <div className="modal-header">
          <h2>Create New Catalogue</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Catalogue Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="e.g., Electronics Catalogue 2025"
              />
            </div>

            <div className="form-group">
              <label>Select Products ({selectedProducts.length} selected)</label>
              <div style={{maxHeight: '300px', overflowY: 'auto', border: '1px solid #404040', borderRadius: '8px', padding: '12px', background: '#1a1a1a'}}>
                {products.map(p => (
                  <div key={p.id} className="checkbox-group" style={{marginBottom: '12px'}}>
                    <input
                      type="checkbox"
                      id={`prod-${p.id}`}
                      checked={selectedProducts.includes(p.id)}
                      onChange={() => toggleProduct(p.id)}
                    />
                    <label htmlFor={`prod-${p.id}`} style={{flex: 1, margin: 0}}>
                      {p.name} - {p.category} (₹{p.price})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-success" disabled={selectedProducts.length === 0}>
              Create Catalogue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== REPORTS PAGE ====================
const ReportsPage = () => {
  const [reportType, setReportType] = useState('products');
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setProducts(dataService.getProducts());
    setInvoices(dataService.getInvoices());
    setCategories(dataService.getCategories());
  }, []);

  const renderProductReport = () => {
    const categoryBreakdown = categories.map(cat => ({
      category: cat.name,
      count: products.filter(p => p.category === cat.name).length
    }));

    return (
      <div>
        <div className="report-summary">
          <div className="summary-card">
            <h4>Total Products</h4>
            <p>{products.length}</p>
          </div>
          <div className="summary-card">
            <h4>Categories</h4>
            <p>{categories.length}</p>
          </div>
          <div className="summary-card">
            <h4>Featured Products</h4>
            <p>{products.filter(p => p.featured).length}</p>
          </div>
        </div>

        <div className="table-container">
          <div className="table-header">
            <h3>Category Breakdown</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Product Count</th>
              </tr>
            </thead>
            <tbody>
              {categoryBreakdown.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.category}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderStockReport = () => {
    const inStock = products.filter(p => p.stock > p.reorderLevel).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.reorderLevel).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);

    return (
      <div>
        <div className="report-summary">
          <div className="summary-card">
            <h4>In Stock</h4>
            <p style={{color: '#1FB8CD'}}>{inStock}</p>
          </div>
          <div className="summary-card">
            <h4>Low Stock</h4>
            <p style={{color: '#FFC185'}}>{lowStock}</p>
          </div>
          <div className="summary-card">
            <h4>Out of Stock</h4>
            <p style={{color: '#B4413C'}}>{outOfStock}</p>
          </div>
          <div className="summary-card">
            <h4>Total Stock Value</h4>
            <p>₹{Math.round(totalValue).toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderInvoiceReport = () => {
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.finalAmount, 0);
    const avgInvoice = invoices.length > 0 ? totalRevenue / invoices.length : 0;

    return (
      <div>
        <div className="report-summary">
          <div className="summary-card">
            <h4>Total Invoices</h4>
            <p>{invoices.length}</p>
          </div>
          <div className="summary-card">
            <h4>Total Revenue</h4>
            <p>₹{Math.round(totalRevenue).toLocaleString()}</p>
          </div>
          <div className="summary-card">
            <h4>Average Invoice</h4>
            <p>₹{Math.round(avgInvoice).toLocaleString()}</p>
          </div>
        </div>

        <div className="table-container">
          <div className="table-header">
            <h3>All Invoices</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td>{inv.invoiceNo}</td>
                  <td>{inv.customerName}</td>
                  <td>{new Date(inv.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>₹{inv.finalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Reports &amp; Analytics</h1>
        <p>View business insights and reports</p>
      </div>

      <div className="report-controls">
        <div className="form-group">
          <label>Report Type</label>
          <select value={reportType} onChange={e => setReportType(e.target.value)}>
            <option value="products">Product Count Summary</option>
            <option value="stock">Stock Status Overview</option>
            <option value="invoices">Invoice &amp; Revenue Report</option>
          </select>
        </div>
      </div>

      {reportType === 'products' && renderProductReport()}
      {reportType === 'stock' && renderStockReport()}
      {reportType === 'invoices' && renderInvoiceReport()}
    </div>
  );
};

// ==================== USERS PAGE ====================
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    setUsers(dataService.getUsers());
  }, []);

  if (user?.role !== 'Super Admin') {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1>Access Denied</h1>
          <p>Only Super Admins can access user management</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage user accounts and roles</p>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td><span className="status-badge success">{u.role}</span></td>
                <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleString('en-IN') : 'Never'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==================== SETTINGS PAGE ====================
const SettingsPage = () => {
  const [settings, setSettings] = useState(dataService.getSettings());
  const { showToast } = useToast();

  const handleSave = () => {
    dataService.saveSettings(settings);
    showToast('Settings saved successfully', 'success');
  };

  const handleBackup = () => {
    const data = {
      products: dataService.getProducts(),
      categories: dataService.getCategories(),
      invoices: dataService.getInvoices(),
      catalogues: dataService.getCatalogues(),
      users: dataService.getUsers(),
      logs: dataService.getLogs(),
      settings: dataService.getSettings()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${Date.now()}.json`;
    a.click();
    showToast('Backup downloaded successfully', 'success');
  };

  const handleReset = () => {
    if (confirm('This will reset all data to initial seed data. Are you sure?')) {
      StorageService.clear();
      dataService.initializeData();
      window.location.reload();
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure system settings</p>
      </div>

      <div className="table-container" style={{marginBottom: '20px'}}>
        <div className="table-header">
          <h3>General Settings</h3>
        </div>
        <div style={{padding: '24px'}}>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={e => setSettings({ ...settings, companyName: e.target.value })}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>GST Rate (%)</label>
              <input
                type="number"
                value={settings.gstRate}
                onChange={e => setSettings({ ...settings, gstRate: parseFloat(e.target.value) || 0 })}
                min="0"
                max="100"
              />
            </div>
            
            <div className="form-group">
              <label>Currency Symbol</label>
              <input
                type="text"
                value={settings.currency}
                onChange={e => setSettings({ ...settings, currency: e.target.value })}
              />
            </div>
          </div>
          
          <button className="btn btn-success" onClick={handleSave}>Save Settings</button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Backup &amp; Data</h3>
        </div>
        <div style={{padding: '24px'}}>
          <div style={{marginBottom: '16px'}}>
            <button className="btn btn-secondary" onClick={handleBackup} style={{marginRight: '12px'}}>
              📥 Download Full Backup
            </button>
            <button className="btn btn-danger" onClick={handleReset}>
              🔄 Reset to Seed Data
            </button>
          </div>
          <p style={{color: '#b0b0b0', fontSize: '14px', margin: 0}}>
            Download a complete backup of all data in JSON format, or reset the system to initial seed data.
          </p>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================
const App = () => {
  const { user, loading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>Loading...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'inventory', label: 'Inventory', icon: '📊' },
    { id: 'invoices', label: 'Invoices', icon: '🧾' },
    { id: 'catalogues', label: 'Catalogues', icon: '📁' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'users', label: 'Users & Roles', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'products': return <ProductsPage />;
      case 'inventory': return <InventoryPage />;
      case 'invoices': return <InvoicesPage />;
      case 'catalogues': return <CataloguesPage />;
      case 'reports': return <ReportsPage />;
      case 'users': return <UsersPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="app-container">
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>{sidebarCollapsed ? 'NP' : 'N.P. Trigunayat'}</h2>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-text">{item.label}</span>
            </div>
          ))}
          <div className="nav-item" onClick={logout}>
            <span className="nav-item-icon">🚪</span>
            <span className="nav-item-text">Logout</span>
          </div>
        </nav>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <div className="top-bar-left">
            <button className="menu-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              ☰
            </button>
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          <div className="top-bar-right">
            <button className="btn-icon">
              🔔
              <span className="badge">3</span>
            </button>
            <div className="user-profile">
              <div className="user-avatar">{user.name.charAt(0)}</div>
              <div className="user-info">
                <h4>{user.name}</h4>
                <p>{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        {renderPage()}
      </div>
    </div>
  );
};

// ==================== RENDER ====================
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </AuthProvider>
);