import HomeNavbar from "./components/layout/HomeNavbar";
import HomeFooter from "./components/layout/HomeFooter";
import AppRouter from "./router/AppRouter";
import { useAuthCheck } from "./viewModel/authViewModel";
import SEO from "./components/SEO";
import CookieConsent from "./components/common/CookieConsent";

const App = () => {
  useAuthCheck();

  return (
    <div className="flex flex-col min-h-screen">
      <SEO />
      <HomeNavbar />
      <main className="flex-grow">
        <AppRouter />
      </main>
      <HomeFooter />
      <CookieConsent />
    </div>
  );
};

export default App;
