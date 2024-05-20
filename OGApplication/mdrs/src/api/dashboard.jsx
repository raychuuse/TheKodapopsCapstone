import React, { useEffect, useState } from "react";
import {serverUrl} from "./utils";

export async function getDashboard() {
    const res = await fetch(`${serverUrl}/dashboard`);
    const body = await res.json();

    //check for db error
    if (body.Error) {
        console.log(body.Message);
        throw Error(`${body.Message}`);
    }

    return body.data;
}

// Have had no version provided with these modifications
/*
export function filterByStatus(bins, query) {
    return bins.filter(bin => bin.statusID === query)
}
*/

export function filterByStatus(bins, isFull,) {
    if (isFull) {
        return bins.filter(bin => bin.status == "FULL");
    }
    else {
        return bins.filter(bin => bin.status == "EMPTY");
    }
}

export async function getDashboardMetrics() {
    const res = await fetch(`${serverUrl}/bins`);
    const body = res.json();

    //check for db error
    if (body.Error) {
        //console.log(body.Message);
        throw Error(`${body.Message}`);
    }

    return {
        mill:{
            empty: filterByStatus(body.data, true).filter((bin => bin.sidingID === 1)).length,
            full:  filterByStatus(body.data, false).filter((bin => bin.sidingID === 1)).length
        },
        locos: {
            empty: filterByStatus(body.data, true).filter((bin => bin.locoID !== null)).length,
            full:  filterByStatus(body.data, false).filter((bin => bin.locoID !== null)).length
        },
        sidings: {
            empty: filterByStatus(body.data, true).filter((bin => bin.sidingID !== 1))
            .filter((bin => bin.sidingID !== null)).length,
            full:  filterByStatus(body.data, false).filter((bin => bin.sidingID !== 1))
            .filter((bin => bin.sidingID !== null)).length
        }
    };
}


