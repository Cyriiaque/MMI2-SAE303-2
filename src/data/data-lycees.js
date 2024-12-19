let data = await fetch("./src/data/json/lycees.json");
data = await data.json();

data.shift(); // Supprimer la première ligne du fichier CSV

data.sort((a, b) =>
  a.numero_uai < b.numero_uai ? -1 : a.numero_uai > b.numero_uai ? 1 : 0
);

let Lycees = {};

Lycees.getAll = function () {
  return data;
};

export { Lycees };
