import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Upload } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import './Products.css';

const AdminProducts = () => {
    const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        discount: '',
        category: '',
        fabric: '',
        color: '',
        images: [''],
        inStock: true
    });

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            price: '',
            discount: '',
            category: '',
            fabric: '',
            color: '',
            images: [''],
            inStock: true
        });
        setEditingProduct(null);
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                slug: product.slug,
                description: product.description,
                price: product.price.toString(),
                discount: product.discount.toString(),
                category: product.category,
                fabric: product.fabric,
                color: product.color,
                images: product.images,
                inStock: product.inStock
            });
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
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    };

    const removeImageField = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            discount: parseFloat(formData.discount) || 0,
            discountPrice: parseFloat(formData.price) * (1 - (parseFloat(formData.discount) || 0) / 100),
            images: formData.images.filter(img => img.trim() !== ''),
            slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')
        };

        if (editingProduct) {
            updateProduct(editingProduct.id, productData);
        } else {
            addProduct(productData);
        }

        closeModal();
    };

    const handleDelete = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(productId);
        }
    };

    return (
        <div className="admin-products">
            <div className="admin-products__header">
                <div>
                    <h1 className="admin-products__title">Products</h1>
                    <p className="admin-products__subtitle">Manage your product catalog</p>
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
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                                        <img src={product.images[0]} alt={product.name} />
                                        <div>
                                            <span className="admin-products__product-name">{product.name}</span>
                                            <span className="admin-products__product-fabric">{product.fabric}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="admin-products__category">{product.category}</span>
                                </td>
                                <td>
                                    <div className="admin-products__price">
                                        <span>₹{product.discountPrice.toLocaleString()}</span>
                                        {product.discount > 0 && (
                                            <span className="admin-products__original-price">₹{product.price.toLocaleString()}</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    {product.discount > 0 && (
                                        <span className="admin-products__discount">{product.discount}% OFF</span>
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
                                    <label>Price (₹) *</label>
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
                                    <label>Discount (%)</label>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
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
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="admin-products__field">
                                    <label>Fabric *</label>
                                    <input
                                        type="text"
                                        name="fabric"
                                        value={formData.fabric}
                                        onChange={handleChange}
                                        placeholder="e.g., Pure Silk"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="admin-products__field">
                                <label>Product Images (URLs)</label>
                                {formData.images.map((img, index) => (
                                    <div key={index} className="admin-products__image-input">
                                        <input
                                            type="url"
                                            value={img}
                                            onChange={(e) => handleImageChange(index, e.target.value)}
                                            placeholder="Enter image URL"
                                        />
                                        {formData.images.length > 1 && (
                                            <button
                                                type="button"
                                                className="admin-products__remove-image"
                                                onClick={() => removeImageField(index)}
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="admin-products__add-image"
                                    onClick={addImageField}
                                >
                                    <Plus size={16} /> Add another image
                                </button>
                            </div>

                            <div className="admin-products__field admin-products__field--checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="inStock"
                                        checked={formData.inStock}
                                        onChange={handleChange}
                                    />
                                    <span>In Stock</span>
                                </label>
                            </div>

                            <div className="admin-products__form-actions">
                                <button type="button" className="btn btn-ghost" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingProduct ? 'Update Product' : 'Add Product'}
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
