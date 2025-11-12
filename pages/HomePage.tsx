import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Store, Gift, ShieldCheck, Truck, ArrowRight, Briefcase } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/products/ProductCard';
import AnimatedPage from '../components/ui/AnimatedPage';
import HomePageSkeleton from '../components/skeletons/HomePageSkeleton';
import ArticleCard from '../components/articles/ArticleCard';
import AnnouncementBanner from '../components/ui/AnnouncementBanner';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

// New variants for store carousel
const storeCarouselVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    position: 'absolute',
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    position: 'relative',
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    position: 'absolute',
  }),
};


const iconMap: { [key: string]: React.ReactNode } = {
  Gift: <Gift className="h-8 w-8 text-white" />,
  ShieldCheck: <ShieldCheck className="h-8 w-8 text-white" />,
  Truck: <Truck className="h-8 w-8 text-white" />,
};

const HomePage: React.FC = () => {
  const { products, stores, carouselSlides, advertisements, isLoading, valuePropositions, articles, user } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  
  // State for store carousel
  const [storePage, setStorePage] = useState(0);
  const [storeDirection, setStoreDirection] = useState(1);

  const STORES_PER_PAGE = 3;
  const totalStorePages = Math.ceil(stores.length / STORES_PER_PAGE);

  const paginateStores = (newDirection: number) => {
    setStoreDirection(newDirection);
    setStorePage(prev => prev + newDirection);
  };
  
  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentSlide(prev => (prev + newDirection + carouselSlides.length) % carouselSlides.length);
  };

  useEffect(() => {
    if (carouselSlides.length > 1) {
      const slideInterval = setInterval(() => paginate(1), 5000);
      return () => clearInterval(slideInterval);
    }
  }, [carouselSlides]);

  if (isLoading) {
    return <HomePageSkeleton />;
  }

  const featuredProducts = products.slice(0, 4);
  const featuredArticles = articles.slice(0, 3);
  const currentCarouselSlide = carouselSlides[currentSlide];

  return (
    <AnimatedPage>
      {/* Hero Carousel */}
      {carouselSlides.length > 0 && (
        <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
          <AnimatePresence custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              style={{ backgroundImage: `url(${currentCarouselSlide.imageUrl})` }}
              className="absolute inset-0 bg-cover bg-center"
            >
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-center text-white p-4">
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{currentCarouselSlide.title}</h1>
                  <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">{currentCarouselSlide.subtitle}</p>
                  <Link to={currentCarouselSlide.link}>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300">
                      {currentCarouselSlide.buttonText}
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
          {carouselSlides.length > 1 && (
            <>
              <button onClick={() => paginate(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors">
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button onClick={() => paginate(1)} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors">
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </>
          )}
        </div>
      )}
      
      {/* Announcement Banner */}
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
         <AnnouncementBanner />
       </div>

       {/* Value Propositions Section */}
      <section>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
           <div className="bg-slate-100/50 backdrop-blur-sm rounded-lg p-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {valuePropositions.map((prop, index) => (
                <motion.div 
                  key={prop.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex flex-col items-center"
                >
                  <div className="bg-indigo-600 rounded-full p-4 mb-4">
                    {iconMap[prop.icon]}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{prop.title}</h3>
                  <p className="mt-2 text-base text-slate-500">{prop.description}</p>
                </motion.div>
              ))}
            </div>
           </div>
        </div>
      </section>

      {/* Stores Section */}
      {stores.length > 0 && (
        <section className="py-16 sm:py-24 bg-slate-50/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 className="text-3xl font-extrabold tracking-tight text-center text-slate-900">Discover Our Stores</h2>
              <p className="mt-4 max-w-2xl mx-auto text-center text-lg text-slate-500">Shop from our curated collection of independent resellers.</p>
            </motion.div>
            <div className="mt-12 relative h-[270px]">
                <AnimatePresence initial={false} custom={storeDirection}>
                    <motion.div
                        key={storePage}
                        custom={storeDirection}
                        variants={storeCarouselVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                        className="w-full h-full top-0 left-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {stores.slice(storePage * STORES_PER_PAGE, storePage * STORES_PER_PAGE + STORES_PER_PAGE).map((store) => (
                            <div key={store.id}>
                                <Link to={`/store/${store.id}`} className="group block h-full">
                                    <div className="flex flex-col items-center text-center p-6 bg-slate-100/80 backdrop-blur-md rounded-lg shadow-md hover:shadow-xl transition-shadow border border-slate-200/50 h-full">
                                        <img src={store.logoUrl} alt={`${store.name} logo`} className="w-24 h-24 rounded-full object-cover mb-4 flex-shrink-0"/>
                                        <div className="flex flex-col flex-grow">
                                            <h3 className="text-lg font-bold text-slate-800">{store.name}</h3>
                                            <p className="text-sm text-slate-500 mt-1 flex-grow">{store.description}</p>
                                            <span className="mt-4 text-sm font-semibold text-indigo-600 group-hover:underline">Visit Store &rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {totalStorePages > 1 && (
                    <>
                        <button
                            onClick={() => paginateStores(-1)}
                            disabled={storePage === 0}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Previous stores"
                        >
                            <ChevronLeft className="h-6 w-6 text-slate-800" />
                        </button>
                        <button
                            onClick={() => paginateStores(1)}
                            disabled={storePage >= totalStorePages - 1}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Next stores"
                        >
                            <ChevronRight className="h-6 w-6 text-slate-800" />
                        </button>
                    </>
                )}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-extrabold tracking-tight text-center">Featured Products</h2>
            <p className="mt-4 max-w-2xl mx-auto text-center text-lg text-slate-500">Curated for excellence. Discover our most popular items.</p>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/products">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-indigo-600 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 shadow-md"
              >
                View All Products
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Become a Reseller Section */}
      {user?.role === 'customer' && (
         <section className="py-16 sm:py-24 bg-indigo-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <Briefcase className="mx-auto h-12 w-12 text-white opacity-80" />
                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
                        Ready to Sell With Us?
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-indigo-200">
                        Join our community of resellers and start your own store on the Luxe platform. Reach new customers and grow your business.
                    </p>
                    <Link to="/become-a-reseller">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-8 inline-block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-indigo-600 hover:bg-indigo-50 shadow-md"
                        >
                            Become a Reseller
                        </motion.div>
                    </Link>
                </motion.div>
            </div>
         </section>
      )}

       {/* Articles Section */}
      <section className="py-16 sm:py-24 bg-slate-50/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-extrabold tracking-tight text-center text-slate-900">From The Journal</h2>
            <p className="mt-4 max-w-2xl mx-auto text-center text-lg text-slate-500">Insights, trends, and stories from our world.</p>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {featuredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>
           <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="#">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-transparent border border-indigo-600 rounded-md py-3 px-8 text-base font-medium text-indigo-600 hover:bg-indigo-50"
              >
                View All Articles
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Advertisements Section */}
      {advertisements.length > 0 && (
         <section className="py-16 sm:py-24">
           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                  <h2 className="text-3xl font-extrabold tracking-tight text-center text-slate-900">Special Promotions</h2>
                  <p className="mt-4 max-w-2xl mx-auto text-center text-lg text-slate-500">Don't miss out on these exclusive deals and offers.</p>
              </motion.div>
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {advertisements.map((ad, index) => (
                      <motion.div 
                          key={ad.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.2 }}
                      >
                          <Link to={ad.link} className="group block relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 aspect-video">
                              <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"/>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/60 transition-colors duration-300"></div>
                              <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white">
                                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{ad.title}</h3>
                                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                      <span>Shop The Sale</span>
                                      <ArrowRight size={18} />
                                  </div>
                              </div>
                          </Link>
                      </motion.div>
                  ))}
              </div>
           </div>
         </section>
      )}
    </AnimatedPage>
  );
};

export default HomePage;
