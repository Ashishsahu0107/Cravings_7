import React from "react";
import Address from "./Address";
import BankingDocs from "./BankingDocs";
import SocialMedia from "./SocialMedia";

const Index = () => {
  return (
    <div className="flex flex-col h-full gap-2">
      <Address />
      <BankingDocs />
      <SocialMedia />
    </div>
  );
};

export default Index;
