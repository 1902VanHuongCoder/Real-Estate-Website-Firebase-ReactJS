// import hooks
import { useContext, useEffect } from "react";

// import components
import { Hero, MainContent } from "./Components/Middle";
import Transitions from "./Components/Partials/Transition";
import { AppContext } from "./Context/AppContext";

const Home = () => {
  const { session } = useContext(AppContext);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      window.location.href = "/real+estate/signin";
    }
  }, []);
  return (
    <Transitions>
      <div className="relative max-w-[1200px] mx-auto overflow-hidden">
        <Hero />
        <MainContent />
      </div>
    </Transitions>
  );
};
export default Home;
