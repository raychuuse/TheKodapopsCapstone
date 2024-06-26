import React, { useEffect, useState } from "react";
import { getConfig, serverUrl } from './utils';

export async function getDashboard() {
    const res = await fetch(`${serverUrl}/dashboard`, getConfig());
    const body = await res.json();

    //check for db error
    if (body.Error) {
        console.log(body.Message);
        throw Error(`${body.Message}`);
    }

    return body.data;
}

export function filterByStatus(bins, isFull,) {
    if (isFull) {
        return bins.filter(bin => bin.full);
    }
    else {
        return bins.filter(bin => !bin.full);
    }
}

export async function getDashboardMetrics() {
    const res = await fetch(`${serverUrl}/bins`, getConfig());
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


