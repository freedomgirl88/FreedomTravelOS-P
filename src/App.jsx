import { useCallback, useEffect, useMemo, useState } from "react";
import BottomNav from "./components/BottomNav";
import SplashScreen from "./components/SplashScreen";
import CreateTrip from "./screens/CreateTrip";
import Dashboard from "./screens/Dashboard";
import Flight from "./screens/Flight";
import Hotel from "./screens/Hotel";
import Packing from "./screens/Packing";
import Budget from "./screens/Budget";
import Explore from "./screens/Explore";
import Booking from "./screens/Booking";
import More from "./screens/More";
import Settings from "./screens/Settings";
import Memories from "./screens/Memories";
import { useTripStore } from "./hooks/useTripStore";

const VALID_PAGES = new Set(["dashboard","flight","hotel","packing","budget","explore","booking","more","settings","memories"]);
function pageFromLocation(){const page=new URLSearchParams(window.location.search).get("page");return VALID_PAGES.has(page)?page:"dashboard";}
function initialPageForLaunch(){const entry=window.performance?.getEntriesByType?.("navigation")?.[0];if(entry?.type==="reload")return pageFromLocation();const url=new URL(window.location.href);url.searchParams.delete("page");window.history.replaceState({page:"dashboard"},"",`${url.pathname}${url.search}${url.hash}`);return "dashboard";}

export default function App(){
  const [activePage,setActivePageState]=useState(initialPageForLaunch);
  const [theme,setTheme]=useState(()=>localStorage.getItem("ftos-p-theme-v1")||"system");
  const [toast,setToast]=useState(null);
  const [showSplash,setShowSplash]=useState(()=>sessionStorage.getItem("ftos-p-splash-seen")!=="1");
  const store=useTripStore();
  const finishSplash=useCallback(()=>{sessionStorage.setItem("ftos-p-splash-seen","1");setShowSplash(false);},[]);

  useEffect(()=>{const apply=()=>{const resolved=theme==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):theme;document.body.dataset.theme=resolved;document.body.dataset.themePreference=theme;};apply();localStorage.setItem("ftos-p-theme-v1",theme);const media=window.matchMedia("(prefers-color-scheme: dark)");media.addEventListener?.("change",apply);return()=>media.removeEventListener?.("change",apply);},[theme]);
  useEffect(()=>{window.ftosToast=(message,type="success")=>{setToast({message,type,id:Date.now()});clearTimeout(window.__ftosToastTimer);window.__ftosToastTimer=setTimeout(()=>setToast(null),2400);};return()=>{delete window.ftosToast;};},[]);
  const setActivePage=useCallback((nextPage,options={})=>{const page=VALID_PAGES.has(nextPage)?nextPage:"dashboard";setActivePageState(page);const url=new URL(window.location.href);if(page==="dashboard")url.searchParams.delete("page");else url.searchParams.set("page",page);window.history[options.replace?"replaceState":"pushState"]({page},"",`${url.pathname}${url.search}${url.hash}`);},[]);
  useEffect(()=>{const sync=()=>setActivePageState(pageFromLocation());window.addEventListener("popstate",sync);return()=>window.removeEventListener("popstate",sync);},[]);
  useEffect(()=>{const current=pageFromLocation();if(current!==activePage)setActivePage(activePage,{replace:true});},[activePage,setActivePage]);
  useEffect(()=>{document.querySelector(".page")?.scrollTo?.({top:0,behavior:"instant"});window.scrollTo?.({top:0,behavior:"instant"});},[activePage]);

  const sharedProps=useMemo(()=>({store,theme,setTheme,setActivePage}),[store,theme,setTheme,setActivePage]);
  const screen=activePage==="dashboard"?<Dashboard {...sharedProps}/>:activePage==="flight"?<Flight store={store}/>:activePage==="hotel"?<Hotel store={store}/>:activePage==="packing"?<Packing store={store}/>:activePage==="budget"?<Budget store={store}/>:activePage==="explore"?<Explore store={store}/>:activePage==="booking"?<Booking store={store}/>:activePage==="more"?<More setActivePage={setActivePage} theme={theme} setTheme={setTheme}/>:activePage==="settings"?<Settings store={store} theme={theme} setTheme={setTheme}/>:activePage==="memories"?<Memories store={store}/>:<Dashboard {...sharedProps}/>;

  if(!store.trip.isConfigured)return <div className={`app-shell${showSplash?" splash-active":""}`}><div className={`phone-frame${showSplash?" splash-active":""}`}>{showSplash&&<SplashScreen onDone={finishSplash}/>}<CreateTrip store={store}/>{toast&&<div className={`toast toast-${toast.type}`}>{toast.message}</div>}</div></div>;
  return <div className={`app-shell${showSplash?" splash-active":""}`}><a className="skip-link" href="#main-content">Skip to content</a><div className={`phone-frame${showSplash?" splash-active":""}`}>{showSplash&&<SplashScreen onDone={finishSplash}/>}<div id="main-content" className="screen-transition" key={activePage}>{screen}</div><BottomNav activePage={activePage} setActivePage={setActivePage}/>{toast&&<div className={`toast toast-${toast.type}`} key={toast.id}>{toast.message}</div>}</div></div>;
}
