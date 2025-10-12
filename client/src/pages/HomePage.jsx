import HomeHero from "../view/homeView/HomeHero";
import ServiceCategories from "../view/homeView/ServiceCategories";
import TopProviders from "../view/homeView/TopProviders";
import Testimonials from "../view/homeView/Testimonials";
import HowItWorks from "../view/homeView/HowItWorks";
import WhyUs from "../view/homeView/WhyUs";
import AreYouProvider from "../view/homeView/AreYouProvider";
import ContactForm from "../view/homeView/ContactForm";
import TrendingServices from "../view/homeView/TrendingServices";
import SEO from "../components/SEO";

const HomePage = () => (
  <div className="flex flex-col gap-16">
    <SEO
      title="Home Services Hub - Find Verified Service Providers in Amritsar"
      description="Connect with trusted and verified home service providers in Amritsar. Book services like plumbing, electrical work, carpentry, cleaning, and more with ease."
    />
    <HomeHero />
    <TrendingServices />
    <TopProviders />
    <ServiceCategories />
    <HowItWorks />

    <ContactForm />

    <WhyUs />
    <Testimonials />
    <AreYouProvider />
  </div>
);

export default HomePage;
