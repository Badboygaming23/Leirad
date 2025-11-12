import React from 'react';

const ProductDetailPageSkeleton: React.FC = () => {
  return (
    <div>
      {/* Breadcrumb Skeleton */}
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
      </div>
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Image Gallery Skeleton */}
            <div>
              <div className="w-full aspect-square bg-gray-200 rounded-lg shadow-lg animate-pulse"></div>
              <div className="mt-4 grid grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="aspect-square w-full rounded-md bg-gray-200 animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Details Skeleton */}
            <div className="space-y-6">
              <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-9 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="space-y-2 pt-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded-md w-full animate-pulse mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPageSkeleton;