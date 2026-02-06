import { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts, categories as fallbackCategories, colors } from '../data/products';
import { productsAPI, categoriesAPI } from '../services/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState(fallbackCategories);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [useAPI, setUseAPI] = useState(true);

    // Load products and categories on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Load products and categories in parallel
            const [apiProducts, apiCategories] = await Promise.all([
                productsAPI.getAll().catch(() => null),
                categoriesAPI.getAll().catch(() => null)
            ]);

            // Helper to normalize product data fields
            const normalizeProduct = (p) => ({
                ...p,
                // Ensure price is MRP and discountPrice is sale price
                // If only price exists, both are same
                discountPrice: p.discountPrice || p.price || 0,
                price: p.originalPrice || p.price || p.discountPrice || 0,
                fabric: p.fabric || p.material || '',
                material: p.material || p.fabric || '',
                images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
                features: Array.isArray(p.features) ? p.features : [],
                tags: Array.isArray(p.tags) ? p.tags : []
            });

            // Set products
            if (apiProducts && apiProducts.length > 0) {
                setProducts(apiProducts.map(normalizeProduct));
                setUseAPI(true);
            } else {
                setProducts(initialProducts.map(normalizeProduct));
                setUseAPI(false);
            }

            // Set categories
            if (apiCategories && apiCategories.length > 0) {
                setCategories(apiCategories);
            } else {
                setCategories(fallbackCategories);
            }
        } catch (err) {
            console.warn('API unavailable, using local data:', err.message);
            setProducts(initialProducts.map(p => ({
                ...p,
                discountPrice: p.discountPrice || p.price || 0,
                price: p.price || p.originalPrice || 0,
            })));
            setCategories(fallbackCategories);
            setUseAPI(false);
        }

        setLoading(false);
    };

    const getProductById = (id) => {
        return products.find(p => p.id === id || p.id === parseInt(id) || p.id === String(id));
    };

    const getProductBySlug = (slug) => {
        return products.find(p => p.slug === slug);
    };

    const getProductsByCategory = (category) => {
        return products.filter(p => p.category === category);
    };

    const getFeaturedProducts = () => {
        return products.filter(p => p.featured);
    };

    const getBestsellers = () => {
        return products.filter(p => p.bestseller);
    };

    const search = (query) => {
        const lowercaseQuery = query.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lowercaseQuery) ||
            (p.description && p.description.toLowerCase().includes(lowercaseQuery)) ||
            (p.category && p.category.toLowerCase().includes(lowercaseQuery)) ||
            (p.material && p.material.toLowerCase().includes(lowercaseQuery))
        );
    };

    const filter = (filters) => {
        return products.filter(product => {
            if (filters.category && product.category !== filters.category) return false;
            if (filters.color && product.color !== filters.color) return false;
            const price = product.price || product.discountPrice || 0;
            if (filters.minPrice && price < filters.minPrice) return false;
            if (filters.maxPrice && price > filters.maxPrice) return false;
            if (filters.material && product.material && !product.material.toLowerCase().includes(filters.material.toLowerCase())) return false;
            return true;
        });
    };

    const sort = (productList, sortBy) => {
        const sorted = [...productList];
        const getPrice = (p) => p.price || p.discountPrice || 0;

        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => getPrice(a) - getPrice(b));
            case 'price-high':
                return sorted.sort((a, b) => getPrice(b) - getPrice(a));
            case 'rating':
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            case 'discount':
                return sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
            default:
                return sorted;
        }
    };

    // Admin functions - use API if available
    const addProduct = async (productData, files = []) => {
        if (useAPI) {
            try {
                const formData = new FormData();
                Object.keys(productData).forEach(key => {
                    if (key === 'features' && Array.isArray(productData[key])) {
                        formData.append(key, JSON.stringify(productData[key]));
                    } else if (productData[key] !== undefined && productData[key] !== null) {
                        formData.append(key, productData[key]);
                    }
                });
                files.forEach(file => formData.append('images', file));

                const newProduct = await productsAPI.create(formData);
                setProducts(prev => [...prev, newProduct]);
                return newProduct;
            } catch (err) {
                console.error('Error adding product:', err);
                throw err;
            }
        } else {
            // Local fallback
            const newProduct = {
                ...productData,
                id: Math.max(...products.map(p => typeof p.id === 'number' ? p.id : 0), 0) + 1,
                slug: productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                rating: 0,
                reviews: 0,
                createdAt: new Date().toISOString()
            };
            setProducts(prev => [...prev, newProduct]);
            return newProduct;
        }
    };

    const updateProduct = async (id, updates, files = []) => {
        if (useAPI) {
            try {
                const formData = new FormData();
                Object.keys(updates).forEach(key => {
                    if (key === 'images' && Array.isArray(updates[key])) {
                        formData.append('existingImages', JSON.stringify(updates[key]));
                    } else if (key === 'features' && Array.isArray(updates[key])) {
                        formData.append(key, JSON.stringify(updates[key]));
                    } else if (updates[key] !== undefined && updates[key] !== null) {
                        formData.append(key, updates[key]);
                    }
                });
                files.forEach(file => formData.append('images', file));

                const updatedProduct = await productsAPI.update(id, formData);
                setProducts(prev => prev.map(p => (p.id === id || p.id === String(id)) ? updatedProduct : p));
                return updatedProduct;
            } catch (err) {
                console.error('Error updating product:', err);
                throw err;
            }
        } else {
            setProducts(prev => prev.map(p =>
                p.id === id ? { ...p, ...updates } : p
            ));
        }
    };

    const deleteProduct = async (id) => {
        if (useAPI) {
            try {
                await productsAPI.delete(id);
                setProducts(prev => prev.filter(p => p.id !== id && p.id !== String(id)));
            } catch (err) {
                console.error('Error deleting product:', err);
                throw err;
            }
        } else {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    const refreshProducts = () => {
        loadData();
    };

    const value = {
        products,
        categories,
        colors,
        loading,
        error,
        useAPI,
        getProductById,
        getProductBySlug,
        getProductsByCategory,
        getFeaturedProducts,
        getBestsellers,
        search,
        filter,
        sort,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};

export default ProductContext;
