import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/products/ProductCard';
import AnimatedPage from '../components/ui/AnimatedPage';
import Breadcrumb from '../components/ui/Breadcrumb';
import ProductsPageSkeleton from '../components/skeletons/ProductsPageSkeleton';
import toast from 'react-hot-toast';
import { Filter, X } from 'lucide-react';
import ProductFilterSidebar from '../components/products/ProductFilterSidebar';

const PRODUCTS_PER_PAGE = 8;

const getPaginationItems = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }
  if (currentPage > totalPages - 4) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

const ProductsPage: React.FC = () => {
  const { products, isLoading } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('default');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }
    // Store filter
    if (selectedStores.length > 0) {
      filtered = filtered.filter(p => selectedStores.includes(p.storeId));
    }

    // Sorting
    switch (sortBy) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategories, selectedStores, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(goToPage, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
      setGoToPage('');
    } else {
      toast.error(`Please enter a page number between 1 and ${totalPages}.`);
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedStores([]);
    setSortBy('default');
    setCurrentPage(1);
  };

  const containerVariants = {
    hidden: { opacity: 0, transition: { duration: 0.3 } },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1, duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (isLoading) {
    return <ProductsPageSkeleton />;
  }
  
  const paginationItems = getPaginationItems(currentPage, totalPages);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, filteredAndSortedProducts.length);

  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Shop', path: '/products' }];

  return (
    <AnimatedPage>
      <Breadcrumb crumbs={crumbs} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Our Collection</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
            Explore our wide range of high-quality products from all our stores.
          </p>
        </div>
        
        <div className="mt-8 lg:grid lg:grid-cols-4 lg:gap-x-8">
          <aside className="hidden lg:block bg-slate-100/50 backdrop-blur-sm p-6 rounded-lg self-start sticky top-24">
            <ProductFilterSidebar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedStores={selectedStores}
              setSelectedStores={setSelectedStores}
              sortBy={sortBy}
              setSortBy={setSortBy}
              resetFilters={resetFilters}
            />
          </aside>

          <main className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-slate-500">
                  Showing {paginatedProducts.length > 0 ? startIndex + 1 : 0} - {endIndex} of {filteredAndSortedProducts.length} products
              </p>
               <button onClick={() => setIsFilterOpen(true)} className="lg:hidden flex items-center gap-2 rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
                  <Filter size={16} /> Filter
               </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage + searchTerm + selectedCategories.join(',') + selectedStores.join(',') + sortBy}
                className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <h3 className="text-xl font-semibold text-slate-800">No products found</h3>
                    <p className="mt-2 text-slate-500">Try adjusting your filters or search terms.</p>
                    <button onClick={resetFilters} className="mt-4 text-indigo-600 font-semibold hover:underline">Reset Filters</button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
        
            {totalPages > 1 && (
              <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-sm text-slate-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{endIndex}</span> of{' '}
                    <span className="font-medium">{filteredAndSortedProducts.length}</span> results
                  </p>
                </div>

                <nav className="flex items-center justify-center" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    &lt;
                  </button>
                  {paginationItems.map((page, index) =>
                    typeof page === 'string' ? (
                      <span key={`${page}-${index}`} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === page
                            ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    &gt;
                  </button>
                </nav>

                <form onSubmit={handleGoToPage} className="hidden lg:flex items-center space-x-2">
                  <input
                      type="number"
                      value={goToPage}
                      onChange={(e) => setGoToPage(e.target.value)}
                      className="block w-20 rounded-md border-slate-300 p-2 text-center shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Page..."
                      min="1"
                      max={totalPages}
                  />
                  <button
                      type="submit"
                      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                      Go
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-80 bg-slate-100/80 backdrop-blur-md border-r border-slate-200 shadow-lg p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)}><X /></button>
              </div>
               <ProductFilterSidebar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedStores={selectedStores}
                setSelectedStores={setSelectedStores}
                sortBy={sortBy}
                setSortBy={setSortBy}
                resetFilters={resetFilters}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
};

export default ProductsPage;
