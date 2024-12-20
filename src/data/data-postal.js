import { Candidats } from "./data-candidats.js";

let data = await fetch("./src/data/json/postal.json");
data = await data.json();

let Postal = {};

Postal.getAll = function () {
  return data;
};

Postal.getPostalCommune = function (dataPostal) {
  const postalCommune = {};
  dataPostal.forEach((postalEntry) => {
    if (postalEntry.code_postal && postalEntry.code_postal.endsWith("000")) {
      postalCommune[postalEntry.code_postal] = postalEntry;
    }
  });
  return postalCommune;
};

Postal.getPostalGeopoint = function (dataPostal, dataCandidatures) {
  const result = {};
  const candidaturesPostal = Candidats.getPostBac(dataCandidatures);
  const postalCommune = Postal.getPostalCommune(dataPostal);

  candidaturesPostal.forEach((code) => {
    const prefix = code.slice(0, 2);
    if (!result[prefix]) {
      let postalEntry = null;
      for (const key in postalCommune) {
        if (key.slice(0, 2) === prefix) {
          postalEntry = postalCommune[key];
          break;
        }
      }
      if (postalEntry && postalEntry._geopoint) {
        result[prefix] = {
          count: 0,
          geopoint: postalEntry._geopoint,
          nom_de_la_commune: postalEntry.nom_de_la_commune,
        };
      } else {
        return;
      }
    }
    result[prefix].count++;
  });
  return result;
};

export { Postal };
