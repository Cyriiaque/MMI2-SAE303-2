import { Leaflet } from "./ui/map/index.js";
import { Graph } from "./ui/graph/index.js";
import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";
import { Postal } from "./data/data-postal.js";
import "./index.css";

let C = {};

C.loadMap = function (
  UAIcandidatures,
  dataLycee,
  Seriecandidats,
  PostalGeopoint
) {
  V.renderMap(UAIcandidatures, dataLycee, Seriecandidats, PostalGeopoint);
};

C.loadGraph = function (
  UAIcandidatures,
  dataLycee,
  Seriecandidats,
  PostalGeopoint
) {
  V.renderGraph(UAIcandidatures, dataLycee, Seriecandidats, PostalGeopoint);
};

C.loadData = function () {
  let dataLycee = Lycees.getAll();
  let dataCandidatures = Candidats.getAll();
  let dataPostal = Postal.getAll();

  let UAIcandidatures = Candidats.getUAIcandidatures(dataCandidatures);
  let Seriecandidats = Candidats.getSeriecandidat(dataCandidatures);
  let PostalGeopoint = Postal.getPostalGeopoint(dataPostal, dataCandidatures);

  C.loadMap(UAIcandidatures, dataLycee, Seriecandidats, PostalGeopoint);

  C.loadGraph(UAIcandidatures, dataLycee, Seriecandidats, PostalGeopoint);
};

C.init = async function () {
  V.init();
};

let V = {
  map: document.querySelector("#map"),
  graph: document.querySelector("#graph"),
};

V.init = function () {
  C.loadData();
};

V.renderMap = function (
  UAIcandidatures,
  dataLycee,
  Seriecandidats,
  PostalGeopoint
) {
  V.map = Leaflet.render(
    UAIcandidatures,
    dataLycee,
    Seriecandidats,
    PostalGeopoint
  );
};

V.renderGraph = function (
  UAIcandidatures,
  dataLycee,
  Seriecandidats,
  PostalGeopoint
) {
  console.log(UAIcandidatures, dataLycee, Seriecandidats, PostalGeopoint);
  V.graph = Graph.render(
    UAIcandidatures,
    dataLycee,
    Seriecandidats,
    PostalGeopoint
  );
};

C.init();
