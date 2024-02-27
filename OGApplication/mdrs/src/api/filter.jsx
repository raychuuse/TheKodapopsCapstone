import React, { useEffect, useState } from "react";

export function filterByStatus(bins, query) {
  return bins.filter((bin) => bin.statusID === query);
}

export function filterByLoco(bins) {
  const locoBins = {
    empty: filterByStatus(bins, 2).length,
    full: filterByStatus(bins, 5).length,
  };
}

export function groupBy(bins, prop) {
  return bins.reduce((acc, obj) => {
    const key = obj[prop];
    const curGroup = acc[key] ?? [];

    return { ...acc, [key]: [...curGroup, obj] };
  }, {});
}


