import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import Problem from './sections/Problem'
import Solutions from './sections/Solutions'
import Process from './sections/Process'
import CaseStudies from './sections/CaseStudies'
import WhyUs from './sections/WhyUs'
import About from './sections/About'
import Engagement from './sections/Engagement'
import FinalCTA from './sections/FinalCTA'
import Footer from './sections/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solutions />
        <Process />
        <CaseStudies />
        <WhyUs />
        <About />
        <Engagement />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
