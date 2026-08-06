'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  Upload,
  Package,
  AlertTriangle,
  Check,
} from 'lucide-react';
import Button from '@/components/shop/Button';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: 'active' | 'inactive';
  sku: string;
}

const initialProducts: Product[] = [
  { id: '1', name: 'Premium Chocolate Box', category: 'Chocolates', price: 1299, stock: 45, image: 'https://placehold.co/80x80/2a1f35/f5a623?text=CB', status: 'active', sku: 'GF-CHO-001' },
  { id: '2', name: 'Rose Gold Watch', category: 'Accessories', price: 4999, stock: 12, image: 'https://placehold.co/80x80/2a1f35/f5a623?text=RW', status: 'active', sku: 'GF-ACC-002' },
  { id: '3', name: 'Aromatherapy Candle Set', category: 'Home Decor', price: 899, stock: 78, image: 'https://placehold.co/80x80/2a1f35/f5a623?text=AC', status: 'active', sku: 'GF-HOM-003' },
  { id: '4', name: 'Silk Flower Bouquet', category: 'Flowers', price: 1999, stock: 5, image: 'https://placehold.co/80x80/2a1f35/f5a623?text=SB', status: 'active', sku: 'GF-FLO-004' },
  { id: '5', name: 'Personalized Photo Frame', category: 'Personalized', price: 799, stock: 0, image: 'https://placehold.co/80x80/2a1f35/f5a623?text=PF', status: 'inactive', sku: 'GF-PER-005' },
  { id: '6', name: 'Gourmet Tea Collection', category: 'Food & Beverages', price: 1499, stock: 34, image: 'https://placehold.co/80x80/2a1f35/f5a623?text=TC', status: 'active', sku: 'GF-FOO-006' },
  { id: '7', name: 'Crystal Perfume Bottle', category: 'Accessories', price: 3499, stock: 8, image: 'https://placehold.co/80x80/2a1f35/f5a623?text=CP', status: 'active', sku: 'GF-ACC-007' },
  { id: '8', name: 'Leather Journal Set', category: 'Stationery', price: 699, stock: 56, image: 'https://placehold.co/80x80/2a1f35/f5a623?text=LJ', status: 'active', sku: 'GF-STA-008' },
  { id: '9', name: 'Wedding Gift Hamper', category: 'Hampers', price: 5999, stock: 3, image: 'https://placehold.co/80x80/2a1f35/f5a623?text=WH', status: 'active', sku: 'GF-HAM-009' },
  { id: '10', name: 'Baby Shower Bundle', category: 'Baby', price: 2499, stock: 15, image: 'https://placehold.co/80x80/2a1f35/f5a623?text=BS', status: 'inactive', sku: 'GF-BAB-010' },
];

const categories = ['All', 'Chocolates', 'Accessories', 'Home Decor', 'Flowers', 'Personalized', 'Food & Beverages', 'Stationery', 'Hampers', 'Baby'];

interface FormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  image: string;
}

const emptyForm: FormData = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: 'Chocolates',
  image: '',
};

export default function InventoryPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;

      const matchStock =
        stockFilter === 'all' ||
        (stockFilter === 'low' && p.stock > 0 && p.stock < 10) ||
        (stockFilter === 'out' && p.stock === 0);

      return matchSearch && matchCategory && matchStock;
    });
  }, [products, searchQuery, categoryFilter, stockFilter]);

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      image: product.image,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.stock) return;

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                price: Number(formData.price),
                stock: Number(formData.stock),
                category: formData.category,
                image: formData.image || p.image,
              }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: `${Date.now()}`,
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.image || `https://placehold.co/80x80/2a1f35/f5a623?text=${formData.name.substring(0, 2).toUpperCase()}`,
        status: 'active',
        sku: `GF-NEW-${(products.length + 1).toString().padStart(3, '0')}`,
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    setModalOpen(false);
    setFormData(emptyForm);
    setEditingProduct(null);
  };

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
          : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Inventory</h1>
          <p className="text-[#6b5f7a] text-sm mt-1">
            {products.length} total products · {lowStockCount} low stock · {outOfStockCount} out of stock
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openAddModal}>
          <Plus size={16} />
          Add Product
        </Button>
      </div>

      {/* Stat Badges */}
      <div className="flex gap-3 flex-wrap">
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <Package size={14} className="text-[#f5a623]" />
          <span className="text-white text-sm font-medium">{products.length}</span>
          <span className="text-[#6b5f7a] text-xs">Total</span>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <AlertTriangle size={14} className="text-amber-400" />
          <span className="text-amber-400 text-sm font-medium">{lowStockCount}</span>
          <span className="text-[#6b5f7a] text-xs">Low Stock</span>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-400" />
          <span className="text-red-400 text-sm font-medium">{outOfStockCount}</span>
          <span className="text-[#6b5f7a] text-xs">Out of Stock</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5f7a]" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#f5a623]/40 transition-all appearance-none cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat} className="bg-[#1a1025]">
              {cat}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          {(['all', 'low', 'out'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStockFilter(f)}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                stockFilter === f
                  ? 'bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/30'
                  : 'bg-white/5 text-[#a89bb5] border border-white/10 hover:bg-white/10'
              }`}
            >
              {f === 'all' ? 'All Stock' : f === 'low' ? 'Low Stock' : 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b5f7a] uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b5f7a] uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b5f7a] uppercase tracking-wider">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b5f7a] uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b5f7a] uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#6b5f7a] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  {/* Product */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://placehold.co/80x80/2a1f35/f5a623?text=${product.name.substring(0, 2)}`;
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{product.name}</p>
                        <p className="text-[#6b5f7a] text-xs">{product.sku}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 text-[#a89bb5] text-sm hidden md:table-cell">
                    {product.category}
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-medium ${
                        product.stock === 0
                          ? 'text-red-400'
                          : product.stock < 10
                          ? 'text-amber-400'
                          : 'text-white'
                      }`}
                    >
                      {product.stock}
                    </span>
                    {product.stock > 0 && product.stock < 10 && (
                      <span className="ml-1.5 text-[10px] text-amber-400 font-medium">LOW</span>
                    )}
                    {product.stock === 0 && (
                      <span className="ml-1.5 text-[10px] text-red-400 font-medium">OUT</span>
                    )}
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 text-[#f5a623] text-sm font-semibold">
                    ₹{product.price.toLocaleString('en-IN')}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <button
                      onClick={() => toggleStatus(product.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        product.status === 'active' ? 'bg-green-500' : 'bg-[#6b5f7a]/30'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          product.status === 'active' ? 'translate-x-4' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 rounded-lg text-[#a89bb5] hover:text-[#f5a623] hover:bg-white/5 transition-all"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      {deleteConfirm === product.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-all"
                            title="Confirm delete"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="p-2 rounded-lg text-[#6b5f7a] hover:bg-white/5 transition-all"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 rounded-lg text-[#a89bb5] hover:text-red-400 hover:bg-red-400/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Search size={32} className="text-[#6b5f7a]/30 mx-auto mb-2" />
                    <p className="text-[#6b5f7a] text-sm">No products found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== ADD/EDIT MODAL ===== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-lg glass-modal p-6 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[#6b5f7a] hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-[#a89bb5] text-xs font-medium mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-[#a89bb5] text-xs font-medium mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description"
                  rows={3}
                  className="w-full px-4 py-3 glass-input text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a89bb5] text-xs font-medium mb-1.5">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 glass-input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#a89bb5] text-xs font-medium mb-1.5">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 glass-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a89bb5] text-xs font-medium mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#f5a623]/40 transition-all appearance-none cursor-pointer"
                >
                  {categories.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat} className="bg-[#1a1025]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#a89bb5] text-xs font-medium mb-1.5">
                  Image URL
                </label>
                <div className="relative">
                  <Upload size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5f7a]" />
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-10 pr-4 py-3 glass-input text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="ghost"
                size="md"
                className="flex-1"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={handleSave}
                disabled={!formData.name || !formData.price || !formData.stock}
              >
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
