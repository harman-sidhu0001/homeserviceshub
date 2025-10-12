import React from "react";
import ProviderProfileView from "../view/providerProfileView/ProviderProfileView";
import SEO from "../components/SEO";
import { useProviderProfileViewModel } from "../viewModel/providerProfileViewModel";

const ProviderProfilePage = () => {
  const vm = useProviderProfileViewModel();
  const provider = vm.provider?.data;

  const seoTitle = provider
    ? `${
        provider.businessName
      } - Service Provider in ${provider.serviceAreas?.join(", ")}`
    : "Service Provider Profile";

  const seoDescription = provider
    ? `Book ${provider.businessName} for ${provider.services
        ?.map((s) => s.name)
        .join(", ")}. ${
        provider.verification?.status === "verified" ? "Verified provider" : ""
      } serving ${provider.serviceAreas?.join(", ")}. ${provider.intro?.slice(
        0,
        100
      )}...`
    : "View detailed profile, services, reviews and book trusted service providers in Amritsar";

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        image={provider?.profileImage}
        type="profile"
      />
      <ProviderProfileView />
    </>
  );
};

export default ProviderProfilePage;
