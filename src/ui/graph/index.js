import * as JSC from "jscharting";

const templateFilehistorytype = await fetch("src/ui/graph/template.html");
const templatehistorytype = await templateFilehistorytype.text();
document.getElementById("graph").innerHTML = templatehistorytype;

let Graph = {};

Graph.logTotalsByDepartment = function (PostalGeopoint) {
  var res = [];
  for (const departmentCode in PostalGeopoint) {
    const markerData = PostalGeopoint[departmentCode];
    res.push({
      Departement: "(" + departmentCode + ")",
      SerieDiplomeCode: "Post-Bac",
      count: markerData.count,
    });
  }
  return res;
};

Graph.render = function (DepartementCandidatures, PostalGeopoint) {
  var resultat = Graph.logTotalsByDepartment(PostalGeopoint);
  DepartementCandidatures = DepartementCandidatures.map((item) => ({
    Departement: "(" + item.Departement + ")",
    SerieDiplomeCode: item.SerieDiplomeCode,
    count: item.count,
  }));
  var data = [...resultat, ...DepartementCandidatures];

  var departmentTotals = {};
  data.forEach((item) => {
    if (!departmentTotals[item.Departement]) {
      departmentTotals[item.Departement] = 0;
    }
    departmentTotals[item.Departement] += item.count;
  });
  var sortedDepartmentTotals = [];
  var departmentTotalsEntries = Object.entries(departmentTotals);
  for (var i = 0; i < departmentTotalsEntries.length; i++) {
    var maxIndex = i;
    for (var j = i + 1; j < departmentTotalsEntries.length; j++) {
      if (
        departmentTotalsEntries[j][1] > departmentTotalsEntries[maxIndex][1]
      ) {
        maxIndex = j;
      }
    }
    var temp = departmentTotalsEntries[i];
    departmentTotalsEntries[i] = departmentTotalsEntries[maxIndex];
    departmentTotalsEntries[maxIndex] = temp;
    var entry = {};
    entry[departmentTotalsEntries[i][0]] = departmentTotalsEntries[i][1];
    sortedDepartmentTotals.push(entry);
  }

  var sortedDepartmentTotalsObj = {};
  sortedDepartmentTotals.forEach((item) => {
    Object.assign(sortedDepartmentTotalsObj, item);
  });

  var datainit;
  datainit = [];
  Object.keys(departmentTotals).forEach((department) => {
    datainit.push({
      Departement: department,
      SerieDiplomeCode: "Post-Bac",
      count: 0,
    });
    datainit.push({
      Departement: department,
      SerieDiplomeCode: "Générale",
      count: 0,
    });
    datainit.push({
      Departement: department,
      SerieDiplomeCode: "STI2D",
      count: 0,
    });
    datainit.push({
      Departement: department,
      SerieDiplomeCode: "Autres",
      count: 0,
    });
  });

  datainit.forEach((initItem) => {
    const existingItem = data.find(
      (dataItem) =>
        dataItem.Departement === initItem.Departement &&
        dataItem.SerieDiplomeCode === initItem.SerieDiplomeCode
    );
    if (existingItem) {
      initItem.count = existingItem.count;
    }
  });
  datainit.sort((a, b) => {
    const indexA = Object.keys(sortedDepartmentTotalsObj).indexOf(
      a.Departement
    );
    const indexB = Object.keys(sortedDepartmentTotalsObj).indexOf(
      b.Departement
    );
    return indexA - indexB;
  });

  //le tri des data fonctionne mais l'affichage se fait mal à cause de JS charting

  JSC.chart("mapgraph", {
    debug: false,
    axisToZoom: "x",
    title_label_text: "Nombre de candidatures par département",
    type: "horizontal column",
    legend: {
      template: "%icon,%name",
    },
    legend_visible: true,
    palette: [
      "#9fa8da",
      "#f48fb1",
      "#ffab91",
      "#ffe082",
      "#c5e1a5",
      "#80cbc4",
      "#81d4fa",
    ],
    defaultPoint_tooltip:
      "<b>Département: %name</b><br>%value candidats en %seriesname (%percentOfGroup%)",
    xAxis: {
      scale: {
        range: [0, 85],
      },
    },
    yAxis: {
      scale_type: "stacked",
      alternateGridFill: "none",
    },
    series: JSC.nest()
      .key("SerieDiplomeCode")
      .key("Departement")
      .rollup("count")
      .series(datainit.map((item) => item)),
  });
};

export { Graph };
