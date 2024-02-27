import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import { BinAllocationTable } from "../components/BinTable";

export default function BinAllocation() {
  return (
    <main>
      <div className="container-fluid">
        <section className="hero">
          {/* content for the hero */}
          <div className="hero__content">
            <h1 className="hero__title">Bin Allocation</h1>
            <hr></hr>
            <BinAllocationTable />
          </div>
        </section>
      </div>
    </main>
  );
}

