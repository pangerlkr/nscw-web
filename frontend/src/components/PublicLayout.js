import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import Footer from "./Footer";
import FloatingSocials from "./FloatingSocials";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-body">
      <TopNav />
      <main className="flex-1 w-full"><Outlet /></main>
      <Footer />
      <FloatingSocials />
    </div>
  );
}
