import React, { useState } from 'react';
import './FilterSidebar.css';

function FilterSidebar({ 
    categories, 
    selectedCategory, 
    onCategoryChange,
    sortBy,
    onSortChange
}) {
    // state สำหรับ collapsible บนมือถือ
    const [collapsedSections, setCollapsedSections] = useState({
        category: false,
        sort: false
    });

    const toggleSection = (section) => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div className="filter-sidebar">
            <div className={`filter-section collapsible`}>
                <h3 onClick={() => toggleSection('category')}>
                    หมวดหมู่
                    <span className="collapse-icon">
                        {collapsedSections.category ? '▲' : '▼'}
                    </span>
                </h3>
                <div 
                    className="filter-options"
                    style={{ maxHeight: collapsedSections.category ? '500px' : '0' }}
                >
                    <label className="filter-option">
                        <input
                            type="radio"
                            name="category"
                            value=""
                            checked={selectedCategory === ''}
                            onChange={(e) => onCategoryChange(e.target.value)}
                        />
                        <span>ทั้งหมด</span>
                    </label>
                    {categories.map(cat => (
                        <label key={cat.name} className="filter-option">
                            <input
                                type="radio"
                                name="category"
                                value={cat.name}
                                checked={selectedCategory === cat.name}
                                onChange={(e) => onCategoryChange(e.target.value)}
                            />
                            <span>{cat.name} ({cat.count})</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className={`filter-section collapsible`}>
                <h3 onClick={() => toggleSection('sort')}>
                    เรียงตาม
                    <span className="collapse-icon">
                        {collapsedSections.sort ? '▲' : '▼'}
                    </span>
                </h3>
                <div 
                    className="filter-options"
                    style={{ maxHeight: collapsedSections.sort ? '500px' : '0' }}
                >
                    <label className="filter-option">
                        <input
                            type="radio"
                            name="sort"
                            value=""
                            checked={sortBy === ''}
                            onChange={(e) => onSortChange(e.target.value)}
                        />
                        <span>ใหม่ล่าสุด</span>
                    </label>
                    <label className="filter-option">
                        <input
                            type="radio"
                            name="sort"
                            value="price"
                            checked={sortBy === 'price'}
                            onChange={(e) => onSortChange(e.target.value)}
                        />
                        <span>ราคา: ต่ำ - สูง</span>
                    </label>
                    <label className="filter-option">
                        <input
                            type="radio"
                            name="sort"
                            value="-price"
                            checked={sortBy === '-price'}
                            onChange={(e) => onSortChange(e.target.value)}
                        />
                        <span>ราคา: สูง - ต่ำ</span>
                    </label>
                    <label className="filter-option">
                        <input
                            type="radio"
                            name="sort"
                            value="name"
                            checked={sortBy === 'name'}
                            onChange={(e) => onSortChange(e.target.value)}
                        />
                        <span>ชื่อ: A - Z</span>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default FilterSidebar;
