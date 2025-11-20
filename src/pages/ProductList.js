import React, { useState, useEffect, useRef } from 'react';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import RecentlyViewed from '../components/RecentlyViewed';
import './ProductList.css';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('');
    
    // สำหรับ debounce
    const searchTimeout = useRef(null);

    useEffect(() => {
        loadCategories();
    }, []);

    // Debounce search term
    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [searchTerm]);

    useEffect(() => {
        loadProducts();
    }, [debouncedSearchTerm, selectedCategory, sortBy]);

    const loadCategories = async () => {
        const data = await getCategories();
        setCategories(data);
    };

    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const params = {};
            
            if (debouncedSearchTerm) {
                params.search = debouncedSearchTerm;
            }
            
            if (selectedCategory) {
                params.category = selectedCategory;
            }
            
            if (sortBy) {
                params.ordering = sortBy;
            }

            const data = await getProducts(params);
            console.log('Products data:', data);
            
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                console.error('Data is not an array:', data);
                setProducts([]);
                setError('ข้อมูลไม่ถูกต้อง');
            }
        } catch (err) {
            console.error('Error loading products:', err);
            setError('ไม่สามารถโหลดสินค้าได้');
            setProducts([]);
        }
        
        setLoading(false);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleSortChange = (sort) => {
        setSortBy(sort);
    };

    if (loading && products.length === 0) {
        return <div className="loading">กำลังโหลดสินค้า...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={loadProducts}>ลองใหม่อีกครั้ง</button>
            </div>
        );
    }

    return (
        <div className="product-list-container">
            <h1>สินค้าทั้งหมด</h1>
            
            {/* เพิ่ม RecentlyViewed */}
            <RecentlyViewed />
            
            <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
            />

            <div className="product-list-content">
                <FilterSidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                />

                <div className="products-section">
                    {loading ? (
                        <div className="searching-indicator">
                            <p>กำลังค้นหา...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="empty-products">
                            <p>ไม่พบสินค้าที่ค้นหา</p>
                            {(searchTerm || selectedCategory) && (
                                <button 
                                    onClick={() => {
                                        setSearchTerm('');
                                        setDebouncedSearchTerm('');
                                        setSelectedCategory('');
                                    }}
                                    className="reset-filter-btn"
                                >
                                    ล้างการค้นหา
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="products-header">
                                <p>พบ {products.length} สินค้า</p>
                                {(searchTerm || selectedCategory) && (
                                    <button 
                                        onClick={() => {
                                            setSearchTerm('');
                                            setDebouncedSearchTerm('');
                                            setSelectedCategory('');
                                        }}
                                        className="clear-filters-btn"
                                    >
                                        ล้างตัวกรอง
                                    </button>
                                )}
                            </div>
                            <div className="product-grid">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductList;