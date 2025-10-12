import HomeNavbar from "./components/layout/HomeNavbar";
import HomeFooter from "./components/layout/HomeFooter";
import AppRouter from "./router/AppRouter";
import { useAuthCheck } from "./viewModel/authViewModel";
import SEO from "./components/SEO";

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
    </div>
  );
};

export default App;
