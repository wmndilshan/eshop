import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  category: string;
  imageUrl?: string;
}

export function ProductsView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Omit<Product, 'id'>>();

  // Load products from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('seller_products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        // use default mock items if corrupted
        initializeDefaultProducts();
      }
    } else {
      initializeDefaultProducts();
    }
  }, []);

  const initializeDefaultProducts = () => {
    const defaults: Product[] = [
      {
        id: '1',
        name: 'Organic Ceylon Cinnamon Quills',
        price: 1850,
        description: 'Grade ALBA Premium organic cinnamon quills harvested directly from Ceylon plantations.',
        stock: 50,
        category: 'groceries',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr5smipJJb9ffNMFo6M_SQIAeGzz62mY70pIB8URLDAqb2rDJKcPkk7uSeQd1LiqqrTy3a3GCCqCMh53k-dWWocm6q78FfWXmCSX2YGTDyr6TEB91eOPPiWhpCfVjMPUHeCfGzT0LiK-Iqw44IuWm7zWQbcSCsYzwW9XKDqytgtHEIuKh5NSrBkA0VUZyHbTGiq7sinehyo5ZiBbp2iKZ4QQSzxCmJ1Gl8uReTThB7k84uWwg6pq6a9yjiZpzUEccGPBhOgc1To2Q',
      },
      {
        id: '2',
        name: 'Handcrafted Coconut Shell Teacup Set',
        price: 4200,
        description: 'Set of 4 hand-polished eco-friendly teacups crafted from natural coconut shells in Galle.',
        stock: 12,
        category: 'crafts',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr5smipJJb9ffNMFo6M_SQIAeGzz62mY70pIB8URLDAqb2rDJKcPkk7uSeQd1LiqqrTy3a3GCCqCMh53k-dWWocm6q78FfWXmCSX2YGTDyr6TEB91eOPPiWhpCfVjMPUHeCfGzT0LiK-Iqw44IuWm7zWQbcSCsYzwW9XKDqytgtHEIuKh5NSrBkA0VUZyHbTGiq7sinehyo5ZiBbp2iKZ4QQSzxCmJ1Gl8uReTThB7k84uWwg6pq6a9yjiZpzUEccGPBhOgc1To2Q',
      },
    ];
    setProducts(defaults);
    localStorage.setItem('seller_products', JSON.stringify(defaults));
  };

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('seller_products', JSON.stringify(newProducts));
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    reset({
      name: '',
      price: 0,
      description: '',
      stock: 0,
      category: '',
      imageUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setValue('name', product.name);
    setValue('price', product.price);
    setValue('description', product.description);
    setValue('stock', product.stock);
    setValue('category', product.category);
    setValue('imageUrl', product.imageUrl || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: Omit<Product, 'id'>) => {
    if (editingProduct) {
      // Edit
      const updated = products.map((p) =>
        p.id === editingProduct.id ? { ...p, ...data, price: Number(data.price), stock: Number(data.stock) } : p
      );
      saveProducts(updated);
      toast.success('Product updated successfully');
    } else {
      // Create
      const newProduct: Product = {
        id: Date.now().toString(),
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        imageUrl: data.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr5smipJJb9ffNMFo6M_SQIAeGzz62mY70pIB8URLDAqb2rDJKcPkk7uSeQd1LiqqrTy3a3GCCqCMh53k-dWWocm6q78FfWXmCSX2YGTDyr6TEB91eOPPiWhpCfVjMPUHeCfGzT0LiK-Iqw44IuWm7zWQbcSCsYzwW9XKDqytgtHEIuKh5NSrBkA0VUZyHbTGiq7sinehyo5ZiBbp2iKZ4QQSzxCmJ1Gl8uReTThB7k84uWwg6pq6a9yjiZpzUEccGPBhOgc1To2Q',
      };
      saveProducts([newProduct, ...products]);
      toast.success('Product added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDeleteProduct = () => {
    if (deleteConfirmId) {
      const filtered = products.filter((p) => p.id !== deleteConfirmId);
      saveProducts(filtered);
      toast.success('Product deleted successfully');
      setDeleteConfirmId(null);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Top action bar */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--spanish-gray)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            className="field pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Add Product Button */}
        <Button onClick={handleOpenAddModal} variant="primary" className="flex items-center gap-2">
          <span>➕</span> Add Product
        </Button>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--cultured)] text-[var(--sonic-silver)] font-bold">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[var(--sonic-silver)]">
                    No products found. Add a listing to get started!
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-[var(--cultured)] hover:bg-slate-50/50 transition-colors">
                    {/* Item */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded bg-[var(--cultured)] overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr5smipJJb9ffNMFo6M_SQIAeGzz62mY70pIB8URLDAqb2rDJKcPkk7uSeQd1LiqqrTy3a3GCCqCMh53k-dWWocm6q78FfWXmCSX2YGTDyr6TEB91eOPPiWhpCfVjMPUHeCfGzT0LiK-Iqw44IuWm7zWQbcSCsYzwW9XKDqytgtHEIuKh5NSrBkA0VUZyHbTGiq7sinehyo5ZiBbp2iKZ4QQSzxCmJ1Gl8uReTThB7k84uWwg6pq6a9yjiZpzUEccGPBhOgc1To2Q';
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[var(--eerie-black)] max-w-sm truncate">{product.name}</p>
                          <p className="text-xs text-[var(--sonic-silver)] max-w-xs truncate">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="py-3.5 px-4 text-[var(--davys-gray)] capitalize font-semibold">
                      {product.category}
                    </td>
                    {/* Price */}
                    <td className="py-3.5 px-4 font-bold text-[var(--eerie-black)]">
                      LKR {product.price.toLocaleString()}
                    </td>
                    {/* Stock */}
                    <td className="py-3.5 px-4">
                      {product.stock <= 5 ? (
                        <span className="badge badge-alert">Low Stock ({product.stock})</span>
                      ) : (
                        <span className="badge badge-success">In Stock ({product.stock})</span>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <Button
                        onClick={() => handleOpenEditModal(product)}
                        variant="secondary"
                        className="!h-8 !px-3 text-xs"
                      >
                        Edit
                      </Button>
                      <button
                        onClick={() => setDeleteConfirmId(product.id)}
                        className="btn-outline !h-8 !px-3 text-xs !border-red-100 hover:!border-[var(--bittersweet)] hover:!color-[var(--bittersweet)] text-[var(--bittersweet)]"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[var(--white)] border border-[var(--cultured)] max-w-md w-full p-6 rounded-xl shadow-lg space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--cultured)]">
              <h3 className="font-bold text-lg text-[var(--eerie-black)]">
                {editingProduct ? 'Edit Product Item' : 'Add New Product Listing'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--sonic-silver)] hover:text-[var(--eerie-black)] text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <Input
                label="Product Name"
                type="text"
                placeholder="Pure Ceylon Tea Box"
                error={errors.name?.message}
                {...register('name', { required: 'Name is required' })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (LKR)"
                  type="number"
                  placeholder="2500"
                  error={errors.price?.message}
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 1, message: 'Must be greater than 0' },
                  })}
                />
                <Input
                  label="Available Stock"
                  type="number"
                  placeholder="20"
                  error={errors.stock?.message}
                  {...register('stock', {
                    required: 'Stock count is required',
                    min: { value: 0, message: 'Cannot be negative' },
                  })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[var(--davys-gray)]">
                  Product Category
                </label>
                <select
                  className="field w-full rounded-md border-[var(--cultured)] text-[var(--onyx)] px-3 focus:outline-none focus:border-[var(--salmon-pink)] focus:ring-1 focus:ring-[var(--salmon-pink)]"
                  {...register('category', { required: 'Category is required' })}
                >
                  <option value="">Select a category...</option>
                  <option value="groceries">Ceylon Tea & Groceries</option>
                  <option value="crafts">Handicrafts & Arts</option>
                  <option value="electronics">Electronics & Gadgets</option>
                  <option value="fashion">Fashion & Clothing</option>
                  <option value="health">Health & Beauty</option>
                  <option value="other">Other Accessories</option>
                </select>
                {errors.category && (
                  <p className="text-xs text-[var(--bittersweet)] mt-1">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[var(--davys-gray)]">
                  Description
                </label>
                <textarea
                  className="w-full min-h-[70px] p-3 border border-[var(--cultured)] rounded-md text-[var(--onyx)] focus:outline-none focus:border-[var(--salmon-pink)] focus:ring-1 focus:ring-[var(--salmon-pink)] text-sm"
                  placeholder="Describe your product details, materials, weights..."
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && (
                  <p className="text-xs text-[var(--bittersweet)] mt-1">{errors.description.message}</p>
                )}
              </div>

              <Input
                label="Product Image URL (Optional)"
                type="url"
                placeholder="https://example.com/product-image.jpg"
                error={errors.imageUrl?.message}
                {...register('imageUrl')}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingProduct ? 'Save Changes' : 'Create Listing'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[var(--white)] border border-[var(--cultured)] max-w-sm w-full p-6 rounded-xl shadow-lg space-y-4">
            <h3 className="font-bold text-lg text-[var(--eerie-black)]">Delete Product Listing?</h3>
            <p className="text-sm text-[var(--sonic-silver)] leading-relaxed">
              Are you sure you want to delete this listing? This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <button
                onClick={handleDeleteProduct}
                className="btn-primary !bg-[var(--bittersweet)] hover:!bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
