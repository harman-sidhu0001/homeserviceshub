import ProviderRegisterForm from "../view/authView/ProviderRegisterForm";
import SeoHelmet from "../seo/SeoHelmet";

const ProviderRegisterPage = () => {
  return (
    <>
      <SeoHelmet
        title="Provider Registration - HomeServicesHub"
        description="Join our network of service providers and grow your business by connecting with customers."
      />
      <ProviderRegisterForm />
    </>
  );
};

export default ProviderRegisterPage;
