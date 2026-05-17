import React from "react";

import { Route, Routes } from "react-router-dom";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import Profile from "./Profile";

import Menu from "./Menu";

import { GeneralContextProvider } from "./GeneralContext";

import "./Dashboard.css";

const Dashboard = () => {

  return (

    <GeneralContextProvider>

      <div className="dashboard-layout">

        {/* ================= TOP NAVBAR ================= */}

        <Menu />



        {/* ================= MAIN SECTION ================= */}

        <div className="dashboard-main">

          {/* ================= WATCHLIST SIDEBAR ================= */}

          <aside className="watchlist-section">

            <WatchList />

          </aside>



          {/* ================= PAGE CONTENT ================= */}

          <main className="dashboard-content">

            <Routes>

              <Route
                path="/"
                element={<Summary />}
              />



              <Route
                path="/orders"
                element={<Orders />}
              />



              <Route
                path="/holdings"
                element={<Holdings />}
              />



              <Route
                path="/positions"
                element={<Positions />}
              />



              <Route
                path="/funds"
                element={<Funds />}
              />



              <Route
                path="/apps"
                element={<Apps />}
              />

              <Route 
                path="/profile" 
                element={<Profile />} 
              />

            </Routes>

          </main>

        </div>

      </div>

    </GeneralContextProvider>
  );
};

export default Dashboard;