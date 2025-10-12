import ServiceProvidersView from "../view/serviceProvidersView/ServiceProvidersPage";
import SEO from "../components/SEO";
import { useLocation } from "react-router-dom";

const ServiceProvidersPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const service = searchParams.get("service");
  const area = searchParams.get("area");

  const seoTitle = service
    ? `${service} Service Providers in ${area || "Amritsar"}`
    : "Find Local Service Providers in Amritsar";

  const seoDescription = service
    ? `Browse and book verified ${service.toLowerCase()} service providers in ${
        area || "Amritsar"
      }. Compare ratings, reviews, and book services online.`
    : "Discover trusted and verified local service providers in Amritsar. Compare service providers, read reviews, and book services instantly.";

  return (
    <>
      <SEO title={seoTitle} description={seoDescription} type="website" />
      <ServiceProvidersView />
    </>
  );
};

export default ServiceProvidersPage;
