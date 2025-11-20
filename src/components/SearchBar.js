import React from 'react';
import './SearchBar.css';

function SearchBar({ searchTerm, onSearchChange }) {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input"
            />
            <button className="search-button">
                🔍
            </button>
        </div>
    );
}

export default SearchBar;