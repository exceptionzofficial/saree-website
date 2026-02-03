import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Filter,
    X,
    ChevronDown,
    Grid,
    List,
    SlidersHorizontal
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from '../../components/common/ProductCard';
import './Shop.css';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { products, categories, colors, filter, sort, search } = useProducts();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        color: searchParams.get('color') || '',
        minPrice: '',
        maxPrice: '',
        fabric: ''
    });
    const [sortBy, setSortBy] = useState('newest');
    const [filteredProducts, setFilteredProducts] = useState([]);

    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        let result = [...products];

        // Apply search if exists
        if (searchQuery) {
            result = search(searchQuery);
        }

        // Apply filters
        if (filters.category || filters.color || filters.minPrice || filters.maxPrice || filters.fabric) {
            result = result.filter(product => {
                if (filters.category && product.category !== filters.category) return false;
                if (filters.color && product.color !== filters.color) return false;
                const currentPrice = product.discountPrice || product.price || 0;
                if (filters.minPrice && currentPrice < parseInt(filters.minPrice)) return false;
                if (filters.maxPrice && currentPrice > parseInt(filters.maxPrice)) return false;
                if (filters.fabric && !((product.fabric || product.material || '').toLowerCase().includes(filters.fabric.toLowerCase()))) return false;
                return true;
            });
        }

        // Apply sorting
        result = sort(result, sortBy);

        setFilteredProducts(result);
    }, [products, filters, sortBy, searchQuery, filter, sort, search]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));

        // Update URL params
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            color: '',
            minPrice: '',
            maxPrice: '',
            fabric: ''
        });
        setSearchParams({});
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== '');

    const priceRanges = [
        { label: 'Under ₹3,000', min: 0, max: 3000 },
        { label: '₹3,000 - ₹5,000', min: 3000, max: 5000 },
        { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
        { label: 'Above ₹10,000', min: 10000, max: 100000 },
    ];

    return (
        <main className="shop">
            {/* Header */}
            <div className="shop__header">
                <div className="container">
                    <h1 className="shop__title">
                        {searchQuery ? `Search: "${searchQuery}"` : 'Our Collection'}
                    </h1>
                    <p className="shop__subtitle">
                        {filteredProducts.length} sarees found
                    </p>
                </div>
            </div>

            <div className="shop__content container">
                {/* Mobile Filter Toggle */}
                <button
                    className="shop__filter-toggle"
                    onClick={() => setIsFilterOpen(true)}
                >
                    <Filter size={20} />
                    Filters
                    {hasActiveFilters && <span className="shop__filter-badge"></span>}
                </button>

                {/* Toolbar */}
                <div className="shop__toolbar">
                    <div className="shop__toolbar-left">
                        <button
                            className="shop__filter-btn hide-mobile"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <SlidersHorizontal size={18} />
                            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>

                    <div className="shop__toolbar-right">
                        {/* Sort */}
                        <div className="shop__sort">
                            <label className="shop__sort-label">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="shop__sort-select"
                            >
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                                <option value="discount">Best Discount</option>
                            </select>
                        </div>

                        {/* View Mode - Desktop */}
                        <div className="shop__view-mode hide-mobile">
                            <button
                                className={`shop__view-btn ${viewMode === 'grid' ? 'shop__view-btn--active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                className={`shop__view-btn ${viewMode === 'list' ? 'shop__view-btn--active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="shop__main">
                    {/* Sidebar Filters */}
                    <aside className={`shop__sidebar ${isFilterOpen ? 'shop__sidebar--open' : ''}`}>
                        <div className="shop__sidebar-header">
                            <h3 className="shop__sidebar-title">Filters</h3>
                            <button
                                className="shop__sidebar-close"
                                onClick={() => setIsFilterOpen(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {hasActiveFilters && (
                            <button className="shop__clear-filters" onClick={clearFilters}>
                                Clear All Filters
                            </button>
                        )}

                        {/* Category Filter */}
                        <div className="shop__filter-group">
                            <h4 className="shop__filter-title">Category</h4>
                            <div className="shop__filter-options">
                                <label className="shop__filter-option">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={filters.category === ''}
                                        onChange={() => handleFilterChange('category', '')}
                                    />
                                    <span>All Categories</span>
                                </label>
                                {categories.map(cat => (
                                    <label key={cat.id} className="shop__filter-option">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={filters.category === cat.id}
                                            onChange={() => handleFilterChange('category', cat.id)}
                                        />
                                        <span>{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="shop__filter-group">
                            <h4 className="shop__filter-title">Price Range</h4>
                            <div className="shop__filter-options">
                                <label className="shop__filter-option">
                                    <input
                                        type="radio"
                                        name="price"
                                        checked={!filters.minPrice && !filters.maxPrice}
                                        onChange={() => {
                                            handleFilterChange('minPrice', '');
                                            handleFilterChange('maxPrice', '');
                                        }}
                                    />
                                    <span>All Prices</span>
                                </label>
                                {priceRanges.map((range, index) => (
                                    <label key={index} className="shop__filter-option">
                                        <input
                                            type="radio"
                                            name="price"
                                            checked={filters.minPrice === String(range.min) && filters.maxPrice === String(range.max)}
                                            onChange={() => {
                                                setFilters(prev => ({
                                                    ...prev,
                                                    minPrice: String(range.min),
                                                    maxPrice: String(range.max)
                                                }));
                                            }}
                                        />
                                        <span>{range.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Color Filter */}
                        <div className="shop__filter-group">
                            <h4 className="shop__filter-title">Color</h4>
                            <div className="shop__color-options">
                                {colors.map(color => (
                                    <button
                                        key={color.id}
                                        className={`shop__color-btn ${filters.color === color.id ? 'shop__color-btn--active' : ''}`}
                                        style={{ backgroundColor: color.hex }}
                                        onClick={() => handleFilterChange('color', filters.color === color.id ? '' : color.id)}
                                        title={color.name}
                                    >
                                        {filters.color === color.id && <span className="shop__color-check">✓</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Apply Button - Mobile */}
                        <button
                            className="shop__apply-filters btn btn-primary btn-block"
                            onClick={() => setIsFilterOpen(false)}
                        >
                            Apply Filters
                        </button>
                    </aside>

                    {/* Products Grid */}
                    <div className="shop__products">
                        {filteredProducts.length > 0 ? (
                            <div className={`shop__products-grid ${viewMode === 'list' ? 'shop__products-grid--list' : ''}`}>
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="shop__empty">
                                <div className="shop__empty-icon">🔍</div>
                                <h3 className="shop__empty-title">No sarees found</h3>
                                <p className="shop__empty-text">
                                    Try adjusting your filters or search terms
                                </p>
                                <button className="btn btn-primary" onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isFilterOpen && (
                <div
                    className="shop__overlay"
                    onClick={() => setIsFilterOpen(false)}
                ></div>
            )}
        </main>
    );
};

export default Shop;
