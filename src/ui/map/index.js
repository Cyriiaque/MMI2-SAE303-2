import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

let Leaflet = {};

function countUAIcandidatures(dataCandidatures, UAI) {
  const Candidatures = dataCandidatures.filter((element) => element === UAI);
  return Candidatures.length;
}

function countSeries(Seriecandidats, Serie) {
  var countGenerale = 0;
  var countSTI2D = 0;
  var countAutres = 0;

  const Series = Seriecandidats.filter((element) => element.UAI === Serie);
  for (let i = 0; i < Series.length; i++) {
    if (Series[i].SerieDiplomeCode === "Générale") {
      countGenerale++;
    } else if (Series[i].SerieDiplomeCode === "STI2D") {
      countSTI2D++;
    } else {
      countAutres++;
    }
  }
  return [countGenerale, countSTI2D, countAutres];
}

function binarySearch(arr, x) {
  let start = 0;
  let end = arr.length - 1;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);

    if (arr[mid].numero_uai === x) return mid;
    else if (arr[mid].numero_uai < x) start = mid + 1;
    else end = mid - 1;
  }

  return -1;
}

Leaflet.render = function (UAIcandidatures, dataLycee, Seriecandidats) {
  var map = L.map("map").setView([45.835, 1.255], 15);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const uniqueUAIcandidatures = [...new Set(UAIcandidatures)];

  // Créer un groupe de clusters
  var markers = L.markerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false, // Empêche le zoom au clic
  });

  for (let i = 0; i < uniqueUAIcandidatures.length; i++) {
    const index = binarySearch(dataLycee, uniqueUAIcandidatures[i]);
    if (index !== -1) {
      const lycee = dataLycee[index];
      if (lycee.latitude != "" && lycee.longitude != "") {
        var marker = L.marker([
          parseFloat(lycee.latitude),
          parseFloat(lycee.longitude),
        ]);
        marker.UAI = uniqueUAIcandidatures[i]; // Stocke l'UAI dans le marqueur

        marker.bindPopup(
          "<b>" +
            lycee.appellation_officielle +
            "</b><br>" +
            countUAIcandidatures(UAIcandidatures, uniqueUAIcandidatures[i]) +
            " candidatures :<br>" +
            "- Série Générale : " +
            countSeries(Seriecandidats, uniqueUAIcandidatures[i])[0] +
            "<br>- STI2D : " +
            countSeries(Seriecandidats, uniqueUAIcandidatures[i])[1] +
            "<br>- Autres : " +
            countSeries(Seriecandidats, uniqueUAIcandidatures[i])[2]
        );
        markers.addLayer(marker);
      }
    }
  }

  // Ajouter le groupe de clusters à la carte
  map.addLayer(markers);

  // Gérer le clic sur un cluster pour afficher la somme des candidats
  markers.on("clusterclick", function (event) {
    const cluster = event.layer;
    const childMarkers = cluster.getAllChildMarkers();

    // Calculer la somme des candidatures pour tous les marqueurs du cluster
    let totalCandidatures = 0;
    childMarkers.forEach((marker) => {
      totalCandidatures += countUAIcandidatures(UAIcandidatures, marker.UAI);
    });

    // Afficher la popup avec la somme totale
    const popupContent = `<b>Total de candidatures :</b> ${totalCandidatures}`;
    L.popup()
      .setLatLng(cluster.getLatLng())
      .setContent(popupContent)
      .openOn(map);
  });
};

export { Leaflet };
