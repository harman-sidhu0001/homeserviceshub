import HomeHero from "../view/homeView/HomeHero";
import ServiceCategories from "../view/homeView/ServiceCategories";
import TopProviders from "../view/homeView/TopProviders";
import Testimonials from "../view/homeView/Testimonials";
import HowItWorks from "../view/homeView/HowItWorks";
import WhyUs from "../view/homeView/WhyUs";
import AreYouProvider from "../view/homeView/AreYouProvider";
import ContactForm from "../view/homeView/ContactForm";
import TrendingServices from "../view/homeView/TrendingServices";

const HomePage = () => (
  <div className="flex flex-col gap-16">
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
