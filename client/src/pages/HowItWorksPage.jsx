import React from "react";
import SEO from "../components/SEO";
import HowItWorksView from "../view/homeView/HowItWorks";

const HowItWorksPage = () => {
  return (
    <>
      <SEO
        title="How It Works - Home Services Hub"
        description="Understand the simple 3-step process to book verified home service providers in Amritsar. Post a job, hire a pro, and get it done."
        type="website"
      />
      <div className="pt-10">
        <HowItWorksView />
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-primary">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">
                  Is it free to post a job?
                </h3>
                <p className="text-gray-600">
                  Yes, posting a service request on Home Services Hub is
                  completely free for customers. You only pay the service provider
                  directly for the work done.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">
                  How do I know the providers are trusted?
                </h3>
                <p className="text-gray-600">
                  We verify our "Ace" providers through a rigorous process that
                  includes ID checks and background verification. Look for the
                  Verified badge on their profiles.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">
                  What if I'm not satisfied with the service?
                </h3>
                <p className="text-gray-600">
                  We encourage you to leave a review. While we connect you with
                  providers, we also take feedback seriously and investigate any
                  reports of poor service to maintain our platform's quality.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HowItWorksPage;
