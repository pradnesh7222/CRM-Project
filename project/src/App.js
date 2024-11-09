import React, {  useState, createContext } from "react";
import "./App.css";
import './index.css';
import RouterComponent from "./app/RouterComponent/RouterComponent";

export const SidebarContext = createContext();


function App() {

  const [ activeSidebar, setActiveSidebar ] = useState("");
  return (
    <SidebarContext.Provider value={{  activeSidebar, setActiveSidebar }}>
    <div className="App">
      <RouterComponent />
    </div>
    </SidebarContext.Provider>
  );
}

export default App;
