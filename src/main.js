import { Leaflet } from "./ui/map/index.js";
import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";
import "./index.css";

let C = {};

function getUAIcandidatures(dataCandidatures) {
  return dataCandidatures.map((candidature) => {
    for (let i = 0; i < candidature.Scolarite.length; i++) {
      if (candidature.Scolarite[i].UAIEtablissementorigine) {
        return candidature.Scolarite[i].UAIEtablissementorigine.toUpperCase();
      }
    }
  });
}

function getSeriecandidat(dataCandidatures) {
  let UAIcandidatures = getUAIcandidatures(dataCandidatures);
  return dataCandidatures.map((candidature, index) => {
    let result = { UAI: UAIcandidatures[index] };
    if (candidature.Baccalaureat && candidature.Baccalaureat.SerieDiplomeCode) {
      result.SerieDiplomeCode = candidature.Baccalaureat.SerieDiplomeCode;
    }
    return result;
  });
}

C.loadData = function () {
  let dataLycee = Lycees.getAll();
  let dataCandidatures = Candidats.getAll();
  let UAIcandidatures = getUAIcandidatures(dataCandidatures);
  let Seriecandidats = getSeriecandidat(dataCandidatures);
  V.renderMap(UAIcandidatures, dataLycee, Seriecandidats);
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

V.renderMap = function (UAIcandidatures, dataLycee, Seriecandidats) {
  Leaflet.render(UAIcandidatures, dataLycee, Seriecandidats);
};

C.init();
