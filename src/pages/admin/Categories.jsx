import { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import './Categories.css';

const AdminCategories = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        order: '0'
    });

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            order: '0'
        });
        setEditingCategory(null);
        setImageFile(null);
        setImagePreviewUrl('');
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name || '',
                description: category.description || '',
                order: (category.order || 0).toString()
            });
            setImagePreviewUrl(category.image || '');
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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const categoryData = {
                name: formData.name,
                description: formData.description,
                order: parseInt(formData.order) || 0
            };

            if (editingCategory) {
                if (editingCategory.image) {
                    categoryData.image = editingCategory.image;
                }
                await updateCategory(editingCategory.id, categoryData, imageFile);
            } else {
                await addCategory(categoryData, imageFile);
            }

            closeModal();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category? All products in this category will still exist but will be uncategorized.')) {
            try {
                await deleteCategory(categoryId);
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Failed to delete category.');
            }
        }
    };

    return (
        <div className="admin-categories">
            <div className="admin-categories__header">
                <div>
                    <h1 className="admin-categories__title">Categories</h1>
                    <p className="admin-categories__subtitle">Manage product categories and their display images</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} />
                    Add Category
                </button>
            </div>

            <div className="admin-categories__grid">
                {categories.map(category => (
                    <div key={category.id} className="admin-categories__card">
                        <div className="admin-categories__card-image">
                            {category.image ? (
                                <img src={category.image} alt={category.name} />
                            ) : (
                                <div className="admin-categories__no-image">
                                    <ImageIcon size={32} />
                                </div>
                            )}
                            <div className="admin-categories__card-actions">
                                <button
                                    className="admin-categories__action-btn admin-categories__action-btn--edit"
                                    onClick={() => openModal(category)}
                                    title="Edit Category"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className="admin-categories__action-btn admin-categories__action-btn--delete"
                                    onClick={() => handleDelete(category.id)}
                                    title="Delete Category"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="admin-categories__card-content">
                            <div className="admin-categories__card-header">
                                <h3 className="admin-categories__card-title">{category.name}</h3>
                                <span className="admin-categories__card-order">Order: {category.order || 0}</span>
                            </div>
                            <p className="admin-categories__card-description">{category.description || 'No description'}</p>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="admin-categories__empty">
                    <p>No categories found. Add your first category to get started.</p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="admin-categories__modal-overlay" onClick={closeModal}>
                    <div className="admin-categories__modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-categories__modal-header">
                            <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                            <button className="admin-categories__modal-close" onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <form className="admin-categories__modal-form" onSubmit={handleSubmit}>
                            <div className="admin-categories__modal-body">
                                <div className="admin-categories__field">
                                    <label>Category Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Silk Sarees"
                                    />
                                </div>

                                <div className="admin-categories__field">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Broad description of the category"
                                    />
                                </div>

                                <div className="admin-categories__field">
                                    <label>Display Order</label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>

                                <div className="admin-categories__field">
                                    <label>Category Image</label>
                                    <div className="admin-categories__image-upload">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                        <button
                                            type="button"
                                            className="admin-categories__upload-btn"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload size={18} />
                                            {imagePreviewUrl ? 'Change Image' : 'Upload Image'}
                                        </button>
                                        {imagePreviewUrl && (
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setImagePreviewUrl('');
                                                }}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    {imagePreviewUrl && (
                                        <div className="admin-categories__image-preview">
                                            <img src={imagePreviewUrl} alt="Preview" />
                                        </div>
                                    )}

                                    {!imagePreviewUrl && (
                                        <div className="admin-categories__no-image-placeholder">
                                            <ImageIcon size={32} />
                                            <p>No image selected</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="admin-categories__form-actions">
                                <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={isSubmitting}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : (editingCategory ? 'Update Category' : 'Add Category')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
