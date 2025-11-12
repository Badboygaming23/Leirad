import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="aspect-w-1 aspect-h-1 h-60 bg-gray-200 animate-pulse" />
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
        <div className="flex flex-1 flex-col justify-end pt-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;