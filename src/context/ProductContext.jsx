import { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts, categories, colors, filterProducts, sortProducts, searchProducts } from '../data/products';

const ProductContext = createContext();

const PRODUCTS_STORAGE_KEY = 'saree_elegance_products';

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load products on mount
    useEffect(() => {
        const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (savedProducts) {
            try {
                setProducts(JSON.parse(savedProducts));
            } catch (error) {
                setProducts(initialProducts);
            }
        } else {
            setProducts(initialProducts);
        }
        setLoading(false);
    }, []);

    // Save products when they change
    useEffect(() => {
        if (products.length > 0) {
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
        }
    }, [products]);

    const getProductById = (id) => {
        return products.find(p => p.id === parseInt(id));
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
            p.description.toLowerCase().includes(lowercaseQuery) ||
            p.category.toLowerCase().includes(lowercaseQuery) ||
            p.fabric.toLowerCase().includes(lowercaseQuery)
        );
    };

    const filter = (filters) => {
        return products.filter(product => {
            if (filters.category && product.category !== filters.category) return false;
            if (filters.color && product.color !== filters.color) return false;
            if (filters.minPrice && product.discountPrice < filters.minPrice) return false;
            if (filters.maxPrice && product.discountPrice > filters.maxPrice) return false;
            if (filters.fabric && !product.fabric.toLowerCase().includes(filters.fabric.toLowerCase())) return false;
            return true;
        });
    };

    const sort = (productList, sortBy) => {
        const sorted = [...productList];
        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.discountPrice - b.discountPrice);
            case 'price-high':
                return sorted.sort((a, b) => b.discountPrice - a.discountPrice);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'newest':
                return sorted.sort((a, b) => b.id - a.id);
            case 'discount':
                return sorted.sort((a, b) => b.discount - a.discount);
            default:
                return sorted;
        }
    };

    // Admin functions
    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: Math.max(...products.map(p => p.id), 0) + 1,
            slug: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            rating: 0,
            reviews: 0,
        };
        setProducts([...products, newProduct]);
        return newProduct;
    };

    const updateProduct = (id, updates) => {
        setProducts(products.map(p =>
            p.id === id ? { ...p, ...updates } : p
        ));
    };

    const deleteProduct = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const value = {
        products,
        categories,
        colors,
        loading,
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
