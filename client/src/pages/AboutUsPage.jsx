import AboutUsView from "../view/homeView/AboutUsView";
import SEO from "../components/SEO";

const AboutUsPage = () => {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Home Services Hub's mission to connect quality service providers with customers in Amritsar. Discover our commitment to reliable home services."
        type="website"
      />
      <AboutUsView />
    </>
  );
};

export default AboutUsPage;
