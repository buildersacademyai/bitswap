import ButtonGradient from "./assets/svg/ButtonGradient.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";

const App = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Footer />
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
