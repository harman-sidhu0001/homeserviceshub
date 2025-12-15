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
      <div className="container mx-auto px-4 py-8 text-center">
        {/* Manual Ad Unit */}
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-1323077682489157"
          data-ad-slot="1234567890" // Replace with actual slot ID if available, or keep generic
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>
    </>
  );
};

export default ServicesPage;
