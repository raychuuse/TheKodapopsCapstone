import React, { useEffect, useState } from "react";

export async function getDashboard() {
    const res = await fetch("http://localhost:8080/dashboard");
    const res_1 = await res.json();
    //check for db error
    if (res_1.Error) {
        console.log(res_1.Message);
        throw Error(`${res_1.Message}`);
    }
    return res_1.data;
}

export function filterByStatus(bins, query) {
    return bins.filter(bin => bin.statusID === query)
}

export async function getDashboardMetrics() {
    const res = await fetch("http://localhost:8080/bins");
    const res_1 = await res.json();
    //check for db error
    if (res_1.Error) {
        console.log(res_1.Message);
        throw Error(`${res_1.Message}`);
    }
    return {
        mill:{
            empty:  filterByStatus(res_1.data, 1).length,
            full:filterByStatus(res_1.data, 6).length
        },
        locos: {
            empty:  filterByStatus(res_1.data, 2).length,
            full:filterByStatus(res_1.data, 5).length
        },
        sidings: {
            empty:  filterByStatus(res_1.data, 3).length,
            full:filterByStatus(res_1.data, 4).length
        }
    };
}


