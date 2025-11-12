import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

const HomePageSkeleton: React.FC = () => {
  return (
    <div>
      {/* Hero Skeleton */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden bg-gray-200 animate-pulse"></div>

      {/* Value Propositions Skeleton */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-gray-200 rounded-full p-4 mb-4 w-16 h-16 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stores Skeleton */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto animate-pulse"></div>
          <div className="mt-4 h-5 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Skeleton */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto animate-pulse"></div>
          <div className="mt-4 h-5 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Articles Skeleton */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto animate-pulse"></div>
          <div className="mt-4 h-5 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="flex flex-1 flex-col p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                  <div className="flex items-center pt-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                    <div className="ml-3 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageSkeleton;
