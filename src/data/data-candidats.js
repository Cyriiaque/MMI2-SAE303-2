let data = await fetch("./src/data/json/candidatures.json");
data = await data.json();

data.sort();

let Candidats = {};

Candidats.getAll = function () {
  return data;
};

export { Candidats };
