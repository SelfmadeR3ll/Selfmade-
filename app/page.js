import AnnouncementBar   from '../components/AnnouncementBar';
import Navbar            from '../components/Navbar';
import HeroSection       from '../components/HeroSection';
import FeaturedProduct   from '../components/FeaturedProduct';
import ProductGrid       from '../components/ProductGrid';
import WhySFX            from '../components/WhySFX';
import MaterialsSection  from '../components/MaterialsSection';
import DropCountdown     from '../components/DropCountdown';
import Testimonials      from '../components/Testimonials';
import SocialGallery     from '../components/SocialGallery';
import EmailSignup       from '../components/EmailSignup';
import FAQ               from '../components/FAQ';
import Footer            from '../components/Footer';

export default function Home() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <HeroSection />
      <FeaturedProduct />
      <ProductGrid />
      <WhySFX />
      <MaterialsSection />
      <DropCountdown />
      <Testimonials />
      <SocialGallery />
      <EmailSignup />
      <FAQ />
      <Footer />
    </main>
  );
}
