import Footer from "../components/common/Footer";
import IntroHeader from "../components/common/IntroHeader";

const IntroLayout = ({ children }) => {
  return (
    <div className="flex flex-col">
      <IntroHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default IntroLayout;
