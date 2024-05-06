import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css'; // Optional theme CSS

import { ErrorAlert } from "./Alerts";
import LoadingSpinner from "./LoadingSpinner";

import { getDashboardMetrics } from "../api/dashboard"

const Metric = ({ count, text, }) => {

    return (
        <div className="col">
            <section className="metric">
                {/* content for the hero */}
                <div className="hero__content">
                    {count ? 
                        <h1 className="hero__title">{count}</h1> 
                        : null
                    }
                    <p className="hero__subtitle">{text}</p>

                </div>
            </section>
        </div>
    )
}

export const DashboardMetrics = () => {
    const [{ locos, sidings, mill, error }, setState] = useState({
        locos: [],
        sidings: [],
        mill: [],
        error: null,
    });
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const data = await getDashboardMetrics();
            setState({ locos: data.locos, sidings: data.sidings, mill: data.mill, error: null });
        } catch (err) {
            setState({ locos: null, sidings: null, mill: null, error: err });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);



    return (
        <>
            {loading && <LoadingSpinner />}
            {error && <ErrorAlert message={error.message} />}
            {!loading && !error && (
                <div className="row">
                    <Metric
                        count={mill.empty}
                        text="Empty at Mill"
                    />
                    <Metric
                        count={mill.full}
                        text="Full at Mill"
                    />
                    <Metric
                        count={locos.empty}
                        text="Empty bins on Locos"
                    />
                    <Metric
                        count={locos.full}
                        text="Full bins on Locos"
                    />
                    <Metric
                        count={sidings.empty}
                        text="Empty bins at Sidings"
                    />
                    <Metric
                        count={sidings.full}
                        text="Full bins at Sidings"
                    />
                </div>
            )}
        </>
    );
};