import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

const StorePageSkeleton: React.FC = () => {
    return (
        <div>
            {/* Breadcrumb Skeleton */}
            <div className="bg-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
            </div>
            <div className="bg-white">
                {/* Store Header Skeleton */}
                <div className="bg-gray-100 py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse mx-auto mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
                        <div className="mt-4 h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                    </div>
                </div>

                {/* Products Grid Skeleton */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse mb-8"></div>
                    <div className="mt-8 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StorePageSkeleton;