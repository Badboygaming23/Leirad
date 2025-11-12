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
    <div className="space-y-6">
      {/* Search */}
      <div className="border-b border-slate-200 pb-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Search Products</h3>
        <div className="relative">
            <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        </div>
      </div>
      
      {/* Sorting */}
      <div className="border-b border-slate-200 pb-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Sort By</h3>
          <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
          >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
          </select>
      </div>

      {/* Categories */}
      <div className="border-b border-slate-200 pb-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Product Category</h3>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
          {uniqueCategories.map(category => (
            <label key={category} htmlFor={`category-${category}`} className="flex items-center cursor-pointer">
              <input
                id={`category-${category}`}
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-slate-100"
              />
              <span className="ml-3 text-sm text-slate-600 hover:text-slate-800">{category}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Stores */}
      {!hideStoreFilter && (
        <div className="border-b border-slate-200 pb-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Store</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {stores.map(store => (
              <label key={store.id} htmlFor={`store-${store.id}`} className="flex items-center cursor-pointer">
                <input
                  id={`store-${store.id}`}
                  type="checkbox"
                  checked={selectedStores.includes(store.id)}
                  onChange={() => handleStoreChange(store.id)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-slate-100"
                />
                <span className="ml-3 text-sm text-slate-600 hover:text-slate-800">{store.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      {/* Reset Button */}
      <div>
          <button 
            onClick={resetFilters} 
            className="w-full py-2 px-4 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
              Reset All Filters
          </button>
      </div>
    </div>
  );
};

export default ProductFilterSidebar;
