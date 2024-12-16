import { Leaflet } from "./ui/map/index.js";
import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";
import "./index.css";

let C = {};

function getUAIcandidatures(dataCandidatures) {
  const uaiList = [];
  dataCandidatures.forEach((candidature) => {
    if (candidature.Scolarite) {
      candidature.Scolarite.forEach((scolarite) => {
        if (scolarite.UAIEtablissementorigine) {
          uaiList.push(scolarite.UAIEtablissementorigine.toUpperCase());
        }
      });
    }
  });
  return uaiList;
}

C.loadData = function () {
  let dataLycee = Lycees.getAll();
  let dataCandidatures = Candidats.getAll();
  let UAIcandidatures = getUAIcandidatures(dataCandidatures);
  V.renderMap(UAIcandidatures, dataLycee);
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

V.renderMap = function (UAIcandidatures, dataLycee) {
  Leaflet.render(UAIcandidatures, dataLycee);
};

C.init();
