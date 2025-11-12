import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

const ProductsPageSkeleton: React.FC = () => {
  return (
    <div>
      {/* Breadcrumb Skeleton */}
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
      </div>
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
            <div className="mt-4 h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPageSkeleton;