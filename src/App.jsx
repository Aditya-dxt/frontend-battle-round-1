import Navbar from './components/Navbar'
import Hero from './components/Hero'
import BentoAccordion from './components/BentoAccordion'
import PricingMatrix from './components/PricingMatrix'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <BentoAccordion />
        <Testimonials />
        <PricingMatrix />
      </main>
      <Footer />
    </>
  )
}