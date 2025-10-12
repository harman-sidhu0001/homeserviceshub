import ServicesView from "../view/servicesView/ServicesPage";
import SEO from "../components/SEO";

const ServicesPage = () => {
  return (
    <>
      <SEO
        title="Our Services"
        description="Explore our wide range of home services in Amritsar. Find professional service providers for plumbing, electrical work, carpentry, cleaning, and more."
        type="website"
      />
      <ServicesView />
    </>
  );
};

export default ServicesPage;
