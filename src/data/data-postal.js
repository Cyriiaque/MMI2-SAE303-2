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
  // Créer un objet pour stocker les résultats par préfixe de code postal
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
  console.log(result);
  return result;
};

export { Postal };

// // fais moi la fonction Postal.getPostalGeopoint qui prend en paramètre: dataPostal qui a cette structure: [
//     {"code_commune_insee":"01001","nom_de_la_commune":"L ABERGEMENT CLEMENCIAT","code_postal":"01400","libelle_d_acheminement":"L ABERGEMENT CLEMENCIAT","_geopoint":"46.1517018,4.9306005"},
//     {"code_commune_insee":"01002","nom_de_la_commune":"L ABERGEMENT DE VAREY","code_postal":"01640","libelle_d_acheminement":"L ABERGEMENT DE VAREY","_geopoint":"46.007131,5.4246442"}] , et dataCandidatures qui a cette structure: ['35', '17', '44', '87', '87', '16', '17', '56', '34', …]. pour chaque valeur de dataCandidatures, fait correspondre les 2 premiers chiffres de code_postal (de dataPostal) et retourne le compteur qui correspond au nombre d'éléments dans dataCandidatures, _geopoint (de dataPostal), et nom_de_la_commune (de dataPostal)
