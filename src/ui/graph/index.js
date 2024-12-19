import * as JSC from "jscharting";

const templateFilehistorytype = await fetch("src/ui/graph/template.html");
const templatehistorytype = await templateFilehistorytype.text();
document.getElementById("graph").innerHTML = templatehistorytype;

let Graph = {};

Graph.render = function (
  UAIcandidatures,
  dataLycee,
  Seriecandidats,
  PostalGeopoint
) {
  // JSC.chart("mapgraph", {
  //   debug: false,
  //   type: "horizontal column",
  //   legend: {
  //     template: "%icon,%name,($%value)",
  //   },
  //   legend_visible: true,
  //   palette: [
  //     "#9fa8da",
  //     "#f48fb1",
  //     "#ffab91",
  //     "#ffe082",
  //     "#c5e1a5",
  //     "#80cbc4",
  //     "#81d4fa",
  //   ],
  //   defaultPoint_tooltip:
  //     "%seriesname %name<br><b>%value (%percentOfGroup%)</b>",
  //   yAxis: {
  //     scale_type: "stacked",
  //     alternateGridFill: "none",
  //   },
  //   series: JSC.nest()
  //     .key("genre")
  //     .key("month")
  //     .rollup("total")
  //     .series(data.map((item) => item))
  //     .reverse(),
  // });
};

export { Graph };
