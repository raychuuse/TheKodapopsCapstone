import React, { useEffect, useState } from "react";
import { ListGroup, ListInlineItem } from 'reactstrap';
import { serverUrl, postConfig, putConfig, Status, handleFetch, getConfig, deleteConfig } from './utils';
import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = `${serverUrl}/bins`;

export function getAllBins(){
    return handleFetch(fetch(`${apiUrl}`, getConfig()));
}

export function moveBin(binID, sidingID) {
    return handleFetch(fetch(`${apiUrl}/${binID}/move-bin/${sidingID}`, postConfig()), false);
}

export function getDashBins(){
    return handleFetch(fetch(`${apiUrl}/dash`, getConfig()));
}

export function getSidingBreakdown(id) {
    return fetch(`${apiUrl}/${id}/siding_breakdown`, getConfig())
        .then((body) => body.json())
        .then((data) =>{
            // Data formatting
            return data.map((transaction) => ({
                type: transaction.type,
                sidingName: transaction.sidingName == null ? "No Siding Listed" : transaction.sidingName,
            }))
        })
}

export function getBin(binID) {
    return handleFetch(fetch(`${apiUrl}/${binID}`, getConfig()), true);
}

export function createBin(code) {
    return handleFetch(fetch(`${apiUrl}/${code}`, postConfig()), false);
}

export function editBin(binID,code) {
    console.info(binID, code);
    return handleFetch(fetch(`${apiUrl}/${binID}/${code}`, putConfig()), false);
}

export function deleteBin(binID) {
    return handleFetch(fetch(`${apiUrl}/${binID}`, deleteConfig()), false);
}

export function getMaintenanceBreakdown() {
    return handleFetch(fetch(`${apiUrl}/maintenance_breakdown/stop-being-annoying`, getConfig()), true);
}

export function resolveBin(id) {
    return handleFetch(fetch(`${apiUrl}/bin-resolved/${id}`, putConfig()), false);
}
