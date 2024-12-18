import { Leaflet } from "./ui/map/index.js";
import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";
import { Postal } from "./data/data-postal.js";
import "./index.css";

let C = {};

C.loadData = function () {
  let dataLycee = Lycees.getAll();
  let dataCandidatures = Candidats.getAll();
  let dataPostal = Postal.getAll();

  let UAIcandidatures = Candidats.getUAIcandidatures(dataCandidatures);
  let Seriecandidats = Candidats.getSeriecandidat(dataCandidatures);
  let PostalGeopoint = Postal.getPostalGeopoint(dataPostal, dataCandidatures);

  V.renderMap(UAIcandidatures, dataLycee, Seriecandidats, PostalGeopoint);
};

C.init = async function () {
  V.init();
};

let V = {
  map: document.querySelector("#map"),
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
  Leaflet.render(UAIcandidatures, dataLycee, Seriecandidats, PostalGeopoint);
};

C.init();
