import { ShopProvider } from './context/ShopContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/Categories'
import FeaturedPlants from './components/FeaturedPlants'
import About from './components/About'
import WhyChooseUs from './components/WhyChooseUs'
import CareTips from './components/CareTips'
import Reviews from './components/Reviews'
import Newsletter from './components/Newsletter'
import Contact from './components/Contact'
import Footer from './components/Footer'
import {
  AmbientLeaves,
  CartDrawer,
  CustomCursor,
  Marquee,
  Preloader,
  ScrollVine,
  SearchOverlay,
  ToastStack,
  WishlistDrawer,
} from './components/Overlays'

export default function App() {
  return (
    <ShopProvider>
      <div className="has-custom-cursor relative w-full max-w-full overflow-x-clip bg-cream">
        <CustomCursor />
        <Preloader />
        <AmbientLeaves />
        <ScrollVine />
        <Navbar />
        <main>
          <Hero />
          <Marquee />
          <Categories />
          <FeaturedPlants />
          <About />
          <WhyChooseUs />
          <CareTips />
          <Reviews />
          <Newsletter />
          <Contact />
        </main>
        <Footer />
        <CartDrawer />
        <WishlistDrawer />
        <SearchOverlay />
        <ToastStack />
      </div>
    </ShopProvider>
  )
}
