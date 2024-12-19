let data = await fetch("./src/data/json/candidatures.json");
data = await data.json();

let Candidats = {};

Candidats.getAll = function () {
  return data;
};

Candidats.getUAIcandidatures = function (dataCandidatures) {
  let UAIcandidatures = [];
  dataCandidatures.forEach((candidature) => {
    for (let i = 0; i < candidature.Scolarite.length; i++) {
      if (
        candidature.Scolarite[i].UAIEtablissementorigine &&
        candidature.Baccalaureat.TypeDiplomeLibelle ==
          "Baccalauréat en préparation"
      ) {
        UAIcandidatures.push(
          candidature.Scolarite[i].UAIEtablissementorigine.toUpperCase()
        );
        break;
      }
    }
  });
  return UAIcandidatures;
};

Candidats.getSeriecandidat = function (dataCandidatures) {
  let UAIcandidatures = Candidats.getUAIcandidatures(dataCandidatures);
  let result = [];
  dataCandidatures.forEach((candidature, index) => {
    let item = { UAI: UAIcandidatures[index] };
    if (candidature.Baccalaureat && candidature.Baccalaureat.SerieDiplomeCode) {
      item.SerieDiplomeCode = candidature.Baccalaureat.SerieDiplomeCode;
    }
    result.push(item);
  });
  return result;
};

Candidats.getPostBac = function (dataCandidatures) {
  let postalCandidatures = [];
  dataCandidatures.forEach((candidature) => {
    if (candidature.Baccalaureat.TypeDiplomeLibelle === "Baccalauréat obtenu") {
      for (let i = 0; i < 2; i++) {
        if (candidature.Scolarite[i].CommuneEtablissementOrigineCodePostal) {
          let dpt = candidature.Scolarite[
            i
          ].CommuneEtablissementOrigineCodePostal.slice(0, 2);
          postalCandidatures.push(dpt);
          break;
        }
      }
    }
  });
  return postalCandidatures;
};

export { Candidats };
