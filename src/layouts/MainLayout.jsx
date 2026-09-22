import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen pt-35">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
