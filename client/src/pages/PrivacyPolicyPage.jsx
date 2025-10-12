import React from "react";
import SEO from "../components/SEO";

const PrivacyPolicyPage = () => {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Learn about how Home Services Hub collects, uses, and protects your personal information. Our comprehensive privacy policy for users and service providers in India."
        type="legal"
      />

      <main
        style={{
          maxWidth: "800px",
          margin: "auto",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.6,
        }}
      >
        <h1>Privacy Policy</h1>
        <p>
          <strong>Effective Date:</strong> December 2024
          <br />
          <strong>Last Updated:</strong> December 2024
        </p>

        <p>
          This Privacy Policy ("Policy") explains how Home Services Hub ("Home
          Services Hub", "we", "us", or "our") collects, uses, shares, and
          protects your personal information when you access or use our
          platform, including our website, mobile application, or any related
          services (collectively, the "Platform").
        </p>

        <p>
          By accessing or using our Platform, you agree to the terms of this
          Privacy Policy and consent to the handling of your personal
          information as described herein. If you do not agree with this Policy,
          please do not use the Platform.
        </p>

        <h2>1. Scope</h2>
        <p>
          This Policy applies only to users located in India and currently only
          to services offered in the state of Punjab. We reserve the right to
          update this policy as we expand to other regions.
        </p>

        <h2>2. Definitions</h2>
        <ul>
          <li>
            <strong>Users:</strong> Individuals using our Platform to find
            service providers.
          </li>
          <li>
            <strong>Ace(s):</strong> Service providers who offer their services
            on our Platform.
          </li>
          <li>
            <strong>Personal Information:</strong> Any information that relates
            to an identified or identifiable individual.
          </li>
        </ul>

        <h2>3. Information We Collect</h2>
        <p>
          We collect personal information directly from you and through third
          parties or automated means, including:
        </p>

        <h3>From Users:</h3>
        <ul>
          <li>Name, address, phone number, and email</li>
          <li>Location and service preferences</li>
          <li>Ratings, reviews, and feedback</li>
          <li>IP address and device information</li>
          <li>Communication and service request details</li>
        </ul>

        <h3>From Aces:</h3>
        <ul>
          <li>Business name, identity proof (e.g., Aadhaar, PAN)</li>
          <li>Service areas and offerings</li>
          <li>Certifications/licenses (if applicable)</li>
          <li>Contact and banking details for payouts</li>
          <li>Ratings and customer reviews</li>
        </ul>

        <h2>4. Use of Information</h2>
        <p>We use personal information to:</p>
        <ul>
          <li>Facilitate connections between users and Aces</li>
          <li>Verify Ace identities and service credibility</li>
          <li>Improve user experience and functionality</li>
          <li>Provide customer support and resolve disputes</li>
          <li>Send notifications, promotions, and service-related updates</li>
          <li>Prevent fraud, abuse, or illegal activity</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>5. Sharing of Information</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>Other users (only necessary details)</li>
          <li>Aces, if you're a customer submitting a request</li>
          <li>Payment processors (for transactions)</li>
          <li>Service providers helping with operations (e.g., analytics)</li>
          <li>Law enforcement or regulators when required</li>
        </ul>
        <p>We do not sell your personal information.</p>

        <h2>6. Cookies and Tracking</h2>
        <p>We use cookies, pixels, and similar technologies to:</p>
        <ul>
          <li>Store your preferences</li>
          <li>Analyze Platform usage</li>
          <li>Provide a personalized experience</li>
          <li>Run targeted ads</li>
        </ul>
        <p>You can manage cookies through your browser settings.</p>

        <h2>7. Data Security</h2>
        <p>
          We take reasonable steps to protect your personal data. However, no
          platform is 100% secure. Please protect your credentials and report
          any suspicious activity.
        </p>

        <h2>8. Data Retention</h2>
        <p>
          We retain your data as long as necessary for our business and legal
          obligations.
        </p>

        <h2>9. Your Rights (Indian Users)</h2>
        <p>You may request to:</p>
        <ul>
          <li>Access or correct your data</li>
          <li>Withdraw your consent</li>
          <li>Request deletion (subject to legal exceptions)</li>
        </ul>
        <p>
          To make a request, email us at:{" "}
          <strong>privacy@homeserviceshub.in</strong>
        </p>

        <h2>10. Children's Privacy</h2>
        <p>
          Our Platform is not for use by individuals under 18. We do not
          knowingly collect information from minors.
        </p>

        <h2>11. Third-Party Links</h2>
        <p>
          We are not responsible for privacy practices on external websites.
          Review their policies before providing personal data.
        </p>

        <h2>12. Updates to This Policy</h2>
        <p>
          We may update this policy periodically. Continued use of the Platform
          after updates means you accept the new terms.
        </p>

        <h2>13. Contact Us</h2>
        <p>
          If you have any questions or requests regarding your personal
          information, please contact us at:
        </p>
        <p>
          <strong>Home Services Hub</strong>
          <br />
          Email: privacy@homeserviceshub.in
          <br />
          Address: Punjab, India
        </p>
      </main>
    </>
  );
};

export default PrivacyPolicyPage;
