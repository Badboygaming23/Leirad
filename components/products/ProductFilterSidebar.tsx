import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search } from 'lucide-react';

interface ProductFilterSidebarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStores?: string[];
  setSelectedStores?: React.Dispatch<React.SetStateAction<string[]>>;
  sortBy: string;
  setSortBy: (sort: string) => void;
  resetFilters: () => void;
  hideStoreFilter?: boolean;
}

const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  searchTerm, setSearchTerm,
  selectedCategories, setSelectedCategories,
  selectedStores = [], setSelectedStores = () => {},
  sortBy, setSortBy,
  resetFilters,
  hideStoreFilter = false
}) => {
  const { products, stores } = useAppContext();

  const uniqueCategories = useMemo(() => {
    const categories = new Set(products.map(p => p.category));
    return Array.from(categories);
  }, [products]);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleStoreChange = (storeId: string) => {
    setSelectedStores(prev =>
      prev.includes(storeId)
        ? prev.filter(s => s !== storeId)
        : [...prev, storeId]
    );
  };
  
  return (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Search Products</h3>
        <div className="relative">
            <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {/* Sorting */}
      <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Sort By</h3>
          <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
          </select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Categories</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {uniqueCategories.map(category => (
            <div key={category} className="flex items-center">
              <input
                id={`category-${category}`}
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 bg-gray-100"
              />
              <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-600">{category}</label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Stores */}
      {!hideStoreFilter && (
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Stores</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {stores.map(store => (
              <div key={store.id} className="flex items-center">
                <input
                  id={`store-${store.id}`}
                  type="checkbox"
                  checked={selectedStores.includes(store.id)}
                  onChange={() => handleStoreChange(store.id)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 bg-gray-100"
                />
                <label htmlFor={`store-${store.id}`} className="ml-3 text-sm text-gray-600">{store.name}</label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Reset Button */}
      <div>
          <button 
            onClick={resetFilters} 
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
              Reset Filters
          </button>
      </div>
    </div>
  );
};

export default ProductFilterSidebar;