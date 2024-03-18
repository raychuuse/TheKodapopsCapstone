import React, { useEffect, useState } from "react";
import {apiUrl} from "./utils";

export async function getDashboard() {
    const res = await fetch(`${apiUrl}/dashboard`);
    const body = await res.json();

    //check for db error
    if (body.Error) {
        console.log(body.Message);
        throw Error(`${body.Message}`);
    }

    return body.data;
}

export function filterByStatus(bins, query) {
    return bins.filter(bin => bin.statusID === query)
}

export async function getDashboardMetrics() {
    const res = await fetch(`${apiUrl}/bins`);
    const body = await res.json();

    //check for db error
    if (body.Error) {
        console.log(body.Message);
        throw Error(`${body.Message}`);
    }

    return {
        mill:{
            empty: filterByStatus(body.data, 1).length,
            full:  filterByStatus(body.data, 6).length
        },
        locos: {
            empty: filterByStatus(body.data, 2).length,
            full:  filterByStatus(body.data, 5).length
        },
        sidings: {
            empty: filterByStatus(body.data, 3).length,
            full:  filterByStatus(body.data, 4).length
        }
    };
}


