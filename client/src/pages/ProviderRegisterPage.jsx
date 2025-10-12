import ProviderRegisterForm from "../view/authView/ProviderRegisterForm";
import SEO from "../components/SEO";

const ProviderRegisterPage = () => {
  return (
    <>
      <SEO
        title="Register as Service Provider"
        description="Join Home Services Hub's network of trusted service providers in Amritsar. Grow your business by connecting with customers looking for quality services."
        type="website"
      />
      <ProviderRegisterForm />
    </>
  );
};

export default ProviderRegisterPage;
