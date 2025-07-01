import HomeNavbar from "./components/layout/HomeNavbar";
import HomeFooter from "./components/layout/HomeFooter";
import AppRouter from "./router/AppRouter";
import { useAuthCheck } from "./viewModel/authViewModel";

const App = () => {
  useAuthCheck();

  return (
    <div className="flex flex-col min-h-screen">
      <HomeNavbar />
      <main className="flex-grow">
        <AppRouter />
      </main>
      <HomeFooter />
    </div>
  );
};

export default App;
