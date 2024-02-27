import React, { useState } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import { TransactionTable } from "../components/TransactionTable";

export default function TransactionLog() {
  return (
    <main>
      <div className="container-fluid">
        <section className="hero">
          {/* content for the hero */}
          <div className="hero__content">
          <h1 className="hero__title">Transaction Log</h1>
            <hr></hr>
            <TransactionTable />
          </div>
        </section>
      </div>
    </main>
  );
}

