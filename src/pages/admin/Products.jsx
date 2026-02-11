import { useState, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, X, Upload, Image } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import './Products.css';

const AdminProducts = () => {
    const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, useAPI } = useProducts();
    const { settings } = useOrders();
    const membershipPlans = settings?.membershipPlans || [];
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        material: '',
        color: '',
        weight: '',
        length: '',
        blouse: '',
        features: '',
        care: '',
        existingImages: [],
        inStock: true,
        featured: false,
        bestseller: false,
        applicablePlans: [],
        hideFromShop: false
    });

    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const filteredProducts = products.filter(product => {
        const matchesSearch = !searchTerm || (product.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            price: '',
            originalPrice: '',
            category: '',
            material: '',
            color: '',
            weight: '',
            length: '',
            blouse: '',
            features: '',
            care: '',
            existingImages: [],
            inStock: true,
            featured: false,
            bestseller: false,
            applicablePlans: [],
            hideFromShop: false
        });
        setEditingProduct(null);
        setImageFiles([]);
        setImagePreviewUrls([]);
        setShowNewCategoryInput(false);
        setNewCategoryName('');
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name || '',
                slug: product.slug || '',
                description: product.description || '',
                price: (product.price || product.discountPrice || '').toString(),
                originalPrice: (product.originalPrice || product.price || '').toString(),
                category: product.category || '',
                material: product.material || product.fabric || '',
                color: product.color || '',
                weight: product.weight || '',
                length: product.length || '',
                blouse: product.blouse || '',
                features: Array.isArray(product.features) ? product.features.join(', ') : (product.features || ''),
                care: product.care || '',
                existingImages: product.images || [],
                inStock: product.inStock !== false,
                featured: product.featured || false,
                bestseller: product.bestseller || false,
                applicablePlans: product.applicablePlans || [],
                hideFromShop: product.hideFromShop || false
            });
            setImagePreviewUrls(product.images || []);
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'category' && value === 'new') {
            setShowNewCategoryInput(true);
            setFormData(prev => ({ ...prev, category: '' }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Add new files
        setImageFiles(prev => [...prev, ...files]);

        // Create preview URLs
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrls(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        // Check if it's an existing image or a new file
        const existingCount = formData.existingImages.length;

        if (index < existingCount) {
            // Remove from existing images
            setFormData(prev => ({
                ...prev,
                existingImages: prev.existingImages.filter((_, i) => i !== index)
            }));
        } else {
            // Remove from new files
            const fileIndex = index - existingCount;
            setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
        }

        setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let categoryToUse = formData.category;

            // Handle new category creation
            if (showNewCategoryInput && newCategoryName.trim()) {
                const newCat = await addCategory({
                    name: newCategoryName.trim(),
                    description: `Category for ${newCategoryName.trim()}`,
                    order: categories.length + 1
                });
                categoryToUse = newCat.id || newCat.slug;
            }

            const productData = {
                name: formData.name,
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                description: formData.description,
                price: parseFloat(formData.price),
                originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
                category: categoryToUse,
                material: formData.material,
                fabric: formData.material, // Alias for compatibility with ProductDetail
                color: formData.color,
                weight: formData.weight,
                length: formData.length,
                blouse: formData.blouse,
                features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [],
                care: formData.care,
                inStock: formData.inStock,
                featured: formData.featured,
                bestseller: formData.bestseller,
                applicablePlans: formData.applicablePlans,
                hideFromShop: formData.hideFromShop || (formData.applicablePlans?.length > 0),
                images: formData.existingImages
            };

            if (editingProduct) {
                await updateProduct(editingProduct.id, productData, imageFiles);
            } else {
                await addProduct(productData, imageFiles);
            }

            closeModal();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId);
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product.');
            }
        }
    };

    const getDisplayPrice = (product) => {
        return product.price || product.discountPrice || 0;
    };

    const getOriginalPrice = (product) => {
        return product.originalPrice || product.price || 0;
    };

    const getDiscountPercent = (product) => {
        const original = getOriginalPrice(product);
        const current = getDisplayPrice(product);
        if (original > current) {
            return Math.round(((original - current) / original) * 100);
        }
        return product.discount || 0;
    };

    return (
        <div className="admin-products">
            <div className="admin-products__header">
                <div>
                    <h1 className="admin-products__title">Products</h1>
                    <p className="admin-products__subtitle">
                        Manage your product catalog
                        {useAPI && <span className="admin-products__api-badge">● Live</span>}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="admin-products__filters">
                <div className="admin-products__search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="admin-products__select"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id || cat.slug}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Products Table */}
            <div className="admin-products__table-wrapper">
                <table className="admin-products__table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <div className="admin-products__product-info">
                                        <img
                                            src={product.images?.[0] || 'https://via.placeholder.com/60'}
                                            alt={product.name}
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/60'}
                                        />
                                        <div>
                                            <span className="admin-products__product-name">{product.name}</span>
                                            <span className="admin-products__product-fabric">{product.material || product.fabric}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="admin-products__category">{product.category}</span>
                                </td>
                                <td>
                                    <div className="admin-products__price">
                                        <span>₹{getDisplayPrice(product).toLocaleString()}</span>
                                        {getOriginalPrice(product) > getDisplayPrice(product) && (
                                            <span className="admin-products__original-price">
                                                ₹{getOriginalPrice(product).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    {getDiscountPercent(product) > 0 && (
                                        <span className="admin-products__discount">{getDiscountPercent(product)}% OFF</span>
                                    )}
                                </td>
                                <td>
                                    <span className={`admin-products__stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td>
                                    <div className="admin-products__actions">
                                        <button
                                            className="admin-products__action-btn admin-products__action-btn--edit"
                                            onClick={() => openModal(product)}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="admin-products__action-btn admin-products__action-btn--delete"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="admin-products__empty">
                        <p>No products found</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="admin-products__modal-overlay" onClick={closeModal}>
                    <div className="admin-products__modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-products__modal-header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="admin-products__modal-close" onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <form className="admin-products__form" onSubmit={handleSubmit}>
                            <div className="admin-products__form-row">
                                <div className="admin-products__field">
                                    <label>Product Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="admin-products__field">
                                    <label>Slug (URL)</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="auto-generated if left empty"
                                    />
                                </div>
                            </div>

                            <div className="admin-products__field">
                                <label>Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="admin-products__form-row">
                                <div className="admin-products__field">
                                    <label>Selling Price (₹) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="admin-products__field">
                                    <label>Original Price (₹)</label>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="For showing discount"
                                    />
                                </div>
                            </div>

                            <div className="admin-products__form-row">
                                <div className="admin-products__field">
                                    <label>Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id || cat.slug}>{cat.name}</option>
                                        ))}
                                        <option value="new">+ Add New Category...</option>
                                    </select>
                                    {showNewCategoryInput && (
                                        <div className="admin-products__new-category">
                                            <input
                                                type="text"
                                                placeholder="Enter new category name"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-sm"
                                                onClick={() => {
                                                    setShowNewCategoryInput(false);
                                                    setNewCategoryName('');
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="admin-products__field">
                                    <label>Material *</label>
                                    <input
                                        type="text"
                                        name="material"
                                        value={formData.material}
                                        onChange={handleChange}
                                        placeholder="e.g., Pure Silk"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="admin-products__form-row">
                                <div className="admin-products__field">
                                    <label>Color</label>
                                    <input
                                        type="text"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        placeholder="e.g., Red, Blue"
                                    />
                                </div>
                                <div className="admin-products__field">
                                    <label>Weight</label>
                                    <input
                                        type="text"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        placeholder="e.g., 500g"
                                    />
                                </div>

                            </div>

                            <div className="admin-products__section-divider">
                                <span>Additional Details</span>
                            </div>

                            <div className="admin-products__form-row">
                                <div className="admin-products__field">
                                    <label>Saree Length</label>
                                    <input
                                        type="text"
                                        name="length"
                                        value={formData.length}
                                        onChange={handleChange}
                                        placeholder="e.g., 6.3 meters"
                                    />
                                </div>
                                <div className="admin-products__field">
                                    <label>Blouse Piece</label>
                                    <input
                                        type="text"
                                        name="blouse"
                                        value={formData.blouse}
                                        onChange={handleChange}
                                        placeholder="e.g., 0.8 meters"
                                    />
                                </div>
                            </div>

                            <div className="admin-products__field">
                                <label>Features (Comma separated)</label>
                                <textarea
                                    name="features"
                                    value={formData.features}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="e.g., Pure silk, Handwoven, Zari border"
                                />
                            </div>

                            <div className="admin-products__field">
                                <label>Available for Membership Plans</label>
                                <div className="admin-products__plans-selection">
                                    {membershipPlans.map(plan => (
                                        <label key={plan.id} className="admin-products__plan-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={formData.applicablePlans?.includes(plan.id)}
                                                onChange={(e) => {
                                                    const newPlans = e.target.checked
                                                        ? [...(formData.applicablePlans || []), plan.id]
                                                        : (formData.applicablePlans || []).filter(id => id !== plan.id);
                                                    setFormData({ ...formData, applicablePlans: newPlans });
                                                }}
                                            />
                                            <span>{plan.name}</span>
                                        </label>
                                    ))}
                                    {membershipPlans.length === 0 && (
                                        <p className="admin-products__hint">No membership plans configured in Settings</p>
                                    )}
                                </div>
                            </div>

                            <div className="admin-products__field">
                                <label>Care Instructions</label>
                                <textarea
                                    name="care"
                                    value={formData.care}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="e.g., Dry clean only, Do not bleach"
                                />
                            </div>

                            {/* Image Upload Section */}
                            <div className="admin-products__field">
                                <label>Product Images</label>
                                <div className="admin-products__image-upload">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*"
                                        multiple
                                        style={{ display: 'none' }}
                                    />
                                    <button
                                        type="button"
                                        className="admin-products__upload-btn"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload size={20} />
                                        Upload Images
                                    </button>
                                    <span className="admin-products__upload-hint">
                                        {useAPI ? 'Images will be uploaded to cloud storage' : 'Supports JPG, PNG, WebP'}
                                    </span>
                                </div>

                                {/* Image Previews */}
                                {imagePreviewUrls.length > 0 && (
                                    <div className="admin-products__image-previews">
                                        {imagePreviewUrls.map((url, index) => (
                                            <div key={index} className="admin-products__image-preview">
                                                <img src={url} alt={`Preview ${index + 1}`} />
                                                <button
                                                    type="button"
                                                    className="admin-products__image-remove"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {imagePreviewUrls.length === 0 && (
                                    <div className="admin-products__no-images">
                                        <Image size={32} />
                                        <p>No images added yet</p>
                                    </div>
                                )}
                            </div>

                            <div className="admin-products__checkboxes">
                                <label className="admin-products__checkbox">
                                    <input
                                        type="checkbox"
                                        name="inStock"
                                        checked={formData.inStock}
                                        onChange={handleChange}
                                    />
                                    <span>In Stock</span>
                                </label>
                                <label className="admin-products__checkbox">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                    />
                                    <span>Featured</span>
                                </label>
                                <label className="admin-products__checkbox">
                                    <input
                                        type="checkbox"
                                        name="bestseller"
                                        checked={formData.bestseller}
                                        onChange={handleChange}
                                    />
                                    <span>Bestseller</span>
                                </label>
                                <label className="admin-products__checkbox">
                                    <input
                                        type="checkbox"
                                        name="hideFromShop"
                                        checked={formData.hideFromShop}
                                        onChange={handleChange}
                                    />
                                    <span>Hide from Shop (Exclusive)</span>
                                </label>
                            </div>

                            <div className="admin-products__form-actions">
                                <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={isSubmitting}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
