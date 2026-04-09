import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Dashboard from "../pages/Dashboard";
import POS from "../pages/POS";
import ProductPage from "../products/productPage";

export default function AppLayout() {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Navbar */}
        <Navbar active={active} />

        {/* Page Content */}
        <div className="p-6 overflow-y-auto">
          {active === "Dashboard" && <Dashboard />}
          {/* {active === "Users" && <UsersPage />} */}
          {active === "Products" && <ProductPage />}
          {/* {active === "Orders" && <OrdersPage />}
          {active === "Inventory" && <InventoryPage />}
          {active === "Settings" && <SettingsPage />}
          {active === "POS" && <POSPage />} */}
          {active === "POS" && <POS />}
        </div>
      </div>
    </div>
  );
}