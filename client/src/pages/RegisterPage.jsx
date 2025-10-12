import RegisterForm from "../view/authView/RegisterForm";
import SEO from "../components/SEO";

const RegisterPage = () => {
  return (
    <>
      <SEO
        title="Create an Account"
        description="Sign up for Home Services Hub to access trusted home service providers, manage bookings, and get reliable services in Amritsar."
        type="website"
      />
      <RegisterForm />
    </>
  );
};

export default RegisterPage;
