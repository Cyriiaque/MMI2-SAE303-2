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

Candidats.getDepartementcandidatures = function (dataCandidatures) {
  let DepartementCandidatures = [];
  dataCandidatures.forEach((candidature) => {
    for (let i = 0; i < candidature.Scolarite.length; i++) {
      if (
        candidature.Scolarite[i].CommuneEtablissementOrigineCodePostal &&
        candidature.Baccalaureat.TypeDiplomeLibelle ==
          "Baccalauréat en préparation"
      ) {
        candidature.Scolarite[i].CommuneEtablissementOrigineCodePostal =
          candidature.Scolarite[i].CommuneEtablissementOrigineCodePostal.slice(
            0,
            2
          );
        DepartementCandidatures.push(
          candidature.Scolarite[i].CommuneEtablissementOrigineCodePostal
        );
        break;
      }
    }
  });
  return DepartementCandidatures;
};

Candidats.getSeriecandidatDepartement = function (dataCandidatures) {
  let DepartementCandidatures =
    Candidats.getDepartementcandidatures(dataCandidatures);
  let result = [];
  let countMap = {};

  dataCandidatures.forEach((candidature, index) => {
    if (!DepartementCandidatures[index]) {
      return;
    }
    let key = `${DepartementCandidatures[index]}_${candidature.Baccalaureat.SerieDiplomeCode}`;
    if (!countMap[key]) {
      let serieDiplomeCode = candidature.Baccalaureat.SerieDiplomeCode;
      if (serieDiplomeCode !== "Générale" && serieDiplomeCode !== "STI2D") {
        serieDiplomeCode = "Autres";
      }
      countMap[key] = {
        Departement: DepartementCandidatures[index],
        SerieDiplomeCode: serieDiplomeCode,
        count: 0,
      };
    }
    countMap[key].count++;
  });

  for (let key in countMap) {
    result.push(countMap[key]);
  }
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
