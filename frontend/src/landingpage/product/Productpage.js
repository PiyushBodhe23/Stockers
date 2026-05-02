import React from "react";
import Hero from "../product/hero";
import LeftSection from "../product/leftsection";
import RightSection from "../product/rightsection";
import Universe from "../product/universe";

function ProductPage() {
  return (
    <div style={{ background: "#020617", color: "#f1f5f9" }}>

      <Hero />

      <LeftSection
        imageURL="media/images/kite.png"
        productName="Kite"
        productDescription="Our ultra-fast flagship trading platform with real-time data, advanced charts, and a clean, intuitive interface."
        tryDemo="#"
        learnMore="#"
        googlePlay="#"
        appStore="#"
      />

      <RightSection
        imageURL="media/images/console.png"
        productName="Console"
        productDescription="A powerful dashboard to track, analyze, and understand your investments with detailed insights and reports."
        learnMore="/homepage"
        googlePlay="/homepage"
        appStore="/homepage"
      />

      <LeftSection
        imageURL="media/images/coin.png"
        productName="Coin"
        productDescription="Invest in direct mutual funds with zero commission, directly from your demat account."
        tryDemo="#"
        learnMore="#"
        googlePlay="#"
        appStore="#"
      />

      <RightSection
        imageURL="media/images/kiteconnect.png"
        productName="Kite Connect API"
        productDescription="Build trading platforms and automate strategies using our simple and powerful APIs."
        learnMore="#"
        googlePlay="#"
        appStore="#"
      />

      <LeftSection
        imageURL="media/images/varsity.png"
        productName="Learnexa"
        productDescription="Learn stock markets with structured lessons, real-world examples, and simple explanations."
        tryDemo="/homepage"
        learnMore="/homepage"
        googlePlay="/homepage"
        appStore="/homepage"
      />

      {/* TECH CTA */}
      <div className="text-center py-5">
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
          Want to explore how we build our products?
        </p>

        <a
          href="https://zite-stockers-dashboard.vercel.app/login"
          style={{
            color: "#3b82f6",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Visit Stockers.tech →
        </a>
      </div>

      <Universe />

    </div>
  );
}

export default ProductPage;