import ProviderLoginForm from "../view/authView/ProviderLoginForm";
import SeoHelmet from "../seo/SeoHelmet";

const ProviderLoginPage = () => {
  return (
    <>
      <SeoHelmet
        title="Provider Login - HomeServicesHub"
        description="Login to your provider account to manage your services and connect with customers."
      />
      <ProviderLoginForm />
    </>
  );
};

export default ProviderLoginPage;
