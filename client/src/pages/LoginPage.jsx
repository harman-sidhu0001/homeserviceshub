import LoginForm from "../view/authView/LoginForm";
import SEO from "../components/SEO";

const LoginPage = () => {
  return (
    <>
      <SEO
        title="Login to Your Account"
        description="Access your Home Services Hub account to manage your service requests, view bookings, and connect with service providers in Amritsar."
        type="website"
      />
      <LoginForm />
    </>
  );
};

export default LoginPage;
