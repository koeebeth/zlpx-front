import "./App.css";

import { useState } from "react";

import { Loader } from "./components/Loader";
import { TabsEnum } from "./lib/constants";
import { AuthPage } from "./pages/Auth/Auth";
import { MainPage } from "./pages/Main/Main";

function App() {
  const [activeTab, setActiveTab] = useState(TabsEnum.AUTH);
  const [isLoading, setIsLoading] = useState(false);

  const onAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(TabsEnum.MAIN);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <>
      {isLoading && <Loader />}
      {activeTab === TabsEnum.AUTH && <AuthPage onChangeTab={onAuth} />}
      {activeTab === TabsEnum.MAIN && <MainPage />}
    </>
  );
}

export default App;
