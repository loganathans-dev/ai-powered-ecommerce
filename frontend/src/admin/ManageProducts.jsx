import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Check } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'react-toastify';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', brand: '', category: 'mens', price: '', imageUrl: '', imageFile: null, sizes: [] });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isAddingNewBrand, setIsAddingNewBrand] = useState(false);
  const [customBrands, setCustomBrands] = useState([]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));
  const allBrands = Array.from(new Set([...uniqueBrands, ...customBrands]));

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteProduct(deleteConfirmId);
      setProducts(products.filter(p => p.id !== deleteConfirmId));
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleOpenModal = (product = null) => {
    setIsAddingNewBrand(false);
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        imageUrl: product.images[0],
        imageFile: null,
        sizes: product.sizes || []
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', brand: '', category: 'mens', price: '', imageUrl: '', imageFile: null, sizes: [] });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const finalImageUrl = formData.imageFile ? URL.createObjectURL(formData.imageFile) : formData.imageUrl;

    const payload = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      price: Number(formData.price),
      sizes: formData.sizes.length > 0 ? formData.sizes : [8, 9, 10],
      images: [finalImageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800'],
      colors: ['#000000', '#ffffff'],
      description: 'New product description.',
      featured: false,
      offer: 0
    };

    try {
      if (editingProduct) {
        const updated = await api.updateProduct(editingProduct.id, {
          ...payload,
          images: [finalImageUrl, ...(editingProduct.images.slice(1))]
        });
        setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
        toast.success('Product updated');
      } else {
        const created = await api.createProduct(payload);
        setProducts([created, ...products]);
        toast.success('Product created');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Products</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your store catalog</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm shadow-indigo-600/20"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{product.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 capitalize">{product.category}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">₹{product.price}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            No products found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Brand</label>
                  {isAddingNewBrand ? (
                    <div className="flex gap-2">
                      <input 
                        required 
                        autoFocus
                        type="text" 
                        placeholder="Enter new brand name..."
                        value={formData.brand} 
                        onChange={e => setFormData({...formData, brand: e.target.value})} 
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white" 
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          if (formData.brand.trim()) {
                            setCustomBrands([...customBrands, formData.brand.trim()]);
                            setIsAddingNewBrand(false);
                          }
                        }}
                        className="p-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors"
                        title="Confirm new brand"
                      >
                        <Check size={20} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsAddingNewBrand(false);
                          setFormData({...formData, brand: ''});
                        }}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors"
                        title="Cancel adding new brand"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <select 
                      required 
                      value={allBrands.includes(formData.brand) ? formData.brand : (formData.brand ? 'ADD_NEW' : '')} 
                      onChange={e => {
                        if (e.target.value === 'ADD_NEW') {
                          setIsAddingNewBrand(true);
                          setFormData({...formData, brand: ''});
                        } else {
                          setFormData({...formData, brand: e.target.value});
                        }
                      }} 
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                    >
                      <option value="" disabled>Select a brand</option>
                      {allBrands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                      <option value="ADD_NEW">+ Add New Brand</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price (₹)</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white">
                  <option value="mens">Men's</option>
                  <option value="womens">Women's</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Upload Image</label>
                <input type="file" accept="image/*" onChange={e => setFormData({...formData, imageFile: e.target.files[0]})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Available Sizes</label>
                <div className="flex flex-wrap gap-3">
                  {[6, 7, 8, 9, 10, 11, 12].map(size => (
                    <label key={size} className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.sizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, sizes: [...formData.sizes, size].sort((a,b)=>a-b)});
                          } else {
                            setFormData({...formData, sizes: formData.sizes.filter(s => s !== size)});
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-900 dark:border-slate-600"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Product?</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)} 
                className="flex-1 py-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-sm shadow-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
