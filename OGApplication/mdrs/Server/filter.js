function filterById(bins, query) {
  return bins.filter((bin) => bin.statusID === query);
}

function getMetrics(bins) {
  const millBins = {
    empty: {
      bins: filterById(bins, 1),
      count: filterById(bins, 1).length,
    },
    full: {
      bins: filterById(bins, 6),
      count: filterById(bins, 6).length,
    },
  };
  const locoBins = {
    empty: {
      bins: filterById(bins, 2),
      count: filterById(bins, 2).length,
    },
    full: {
      bins: filterById(bins, 5),
      count: filterById(bins, 5).length,
    },
  };
  const sidingBins = {
    empty: {
      bins: filterById(bins, 3),
      count: filterById(bins, 3).length,
    },
    full: {
      bins: filterById(bins, 4),
      count: filterById(bins, 4).length,
    },
  };

  return {
    mill: millBins,
    locos: locoBins,
    sidings: sidingBins,
  };
}
function groupBins(bins, prop) {
  return bins.reduce((acc, obj) => {
    const key = obj[prop];
    const curGroup = acc[key] ?? [];

    return { ...acc, [key]: [...curGroup, obj] };
  }, {});
}

function sidingSort(grouped) {
  //group data based on property

  const data = []; // create empty array for mutliple siding objects
  for (let key in grouped) {
    const bins = grouped[key];
    const newObj = {
      sidingID: key,
      sidingName: bins[0].sidingName,
      total: filterById(bins, 4).length + filterById(bins, 3).length,
      full: filterById(bins, 4).length,
      empty: filterById(bins, 3).length,
      route: filterById(bins, 2).length,
    };
    data.push(newObj);
  }
  return data;
}

function harvesterSort(grouped) {
  const data = []; // create empty array for mutliple objects
  for (let key in grouped) {
    const bins = grouped[key];
    const newObj = {
      harvesterID: key,
      harvesterName: bins[0].harvesterName,
      total: filterById(bins, 4).length + filterById(bins, 3).length,
      full: filterById(bins, 4).length,
      empty: filterById(bins, 3).length,
      route: filterById(bins, 2).length,
    };
    data.push(newObj);
  }
  return data;
}

function dashSort(grouped, flag) {
  const data = []; // create empty array for mutliple siding objects
  for (let key in grouped) {
    const bins = grouped[key];

    //create locoObject
    if (flag === 0) {
      const newObj = {
        id:key,
        name: bins[0].locoName,
        mill: filterById(bins, 6).length,
        full: filterById(bins, 5).length,
        empty: filterById(bins, 2).length,
      };
      data.push(newObj);
    }
    //create siding object
    if (flag === 1) {
      const newObj = {
        id:key,
        name: bins[0].sidingName,
        mill: filterById(bins, 6).length,
        full: filterById(bins, 4).length,
        empty: filterById(bins, 3).length,
      };
      data.push(newObj);
    }

    //harvester 
    if (flag === 2) {
      const newObj = {
        id:key,
        name: bins[0].harvesterName,
        mill: filterById(bins, 6).length,
        full: filterById(bins, 4).length + filterById(bins, 5).length,
        empty: filterById(bins, 3).length,
      };
      data.push(newObj);
    }
  }
  return data;
}

module.exports = {
  filterById,
  getMetrics,
  groupBins,
  sidingSort,
  harvesterSort,
  dashSort,
};
