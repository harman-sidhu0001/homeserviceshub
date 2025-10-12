import ContactUsView from "../view/homeView/ContactUsView";
import SEO from "../components/SEO";

const ContactUsPage = () => {
  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Home Services Hub. We're here to help you find the right service providers or join our network of professionals in Amritsar."
        type="website"
      />
      <ContactUsView />
    </>
  );
};

export default ContactUsPage;
