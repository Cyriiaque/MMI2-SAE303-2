import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

let Leaflet = {};

Leaflet.countUAIcandidatures = function (dataCandidatures, UAI) {
  const Candidatures = dataCandidatures.filter((element) => element === UAI);
  return Candidatures.length;
};

Leaflet.countSeries = function (Seriecandidats, UAI) {
  let countGenerale = 0;
  let countSTI2D = 0;
  let countAutres = 0;

  const Series = Seriecandidats.filter((element) => element.UAI === UAI);
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
};

Leaflet.binarySearch = function (arr, x) {
  let start = 0;
  let end = arr.length - 1;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);

    if (arr[mid].numero_uai === x) return mid;
    else if (arr[mid].numero_uai < x) start = mid + 1;
    else end = mid - 1;
  }

  return -1;
};

Leaflet.processLyceeData = function (
  dataLycee,
  UAIcandidatures,
  Seriecandidats,
  markers
) {
  const uniqueUAIcandidatures = [...new Set(UAIcandidatures)];

  for (let i = 0; i < uniqueUAIcandidatures.length; i++) {
    const index = Leaflet.binarySearch(dataLycee, uniqueUAIcandidatures[i]);
    if (index !== -1) {
      const lycee = dataLycee[index];
      var seriescountlycee = Leaflet.countSeries(
        Seriecandidats,
        uniqueUAIcandidatures[i]
      );
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
            Leaflet.countUAIcandidatures(
              UAIcandidatures,
              uniqueUAIcandidatures[i]
            ) +
            " candidatures <br>" +
            "Série Générale : " +
            seriescountlycee[0] +
            "<br>STI2D : " +
            seriescountlycee[1] +
            "<br>Autres : " +
            seriescountlycee[2]
        );
        // Ajouter le marqueur au groupe de clusters
        markers.addLayer(marker);
      }
    }
  }
};

Leaflet.render = function (
  UAIcandidatures,
  dataLycee,
  Seriecandidats,
  PostalGeopoint
) {
  var map = L.map("map").setView([45.835, 1.255], 15);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Créer un groupe de clusters
  var markers = L.markerClusterGroup({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false, // Empêche le zoom au clic
  });

  // Traiter les données de dataLycee
  Leaflet.processLyceeData(dataLycee, UAIcandidatures, Seriecandidats, markers);

  // Ajouter les marqueurs post-bac au groupe de clusters
  for (const departmentCode in PostalGeopoint) {
    var totalPostBac = 0;
    const markerData = PostalGeopoint[departmentCode];
    markerData.geopoint = markerData.geopoint.toString();
    var [lat, lng] = markerData.geopoint.split(",");
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    var marker = L.circleMarker([lat, lng], {
      color: "red", // Change la couleur du marqueur
      radius: 12, // Taille du marqueur
    });
    marker.bindPopup(
      "<b>" +
        markerData.nom_de_la_commune +
        "</b><br>" +
        "Post-bac:<br>" +
        markerData.count +
        " candidatures<br>"
    );
    totalPostBac += markerData.count;
    markers.addLayer(marker);
  }

  // Ajouter le groupe de clusters à la carte
  map.addLayer(markers);

  // Gérer le clic sur un cluster pour afficher la somme des candidats
  markers.on("clusterclick", function (event) {
    const cluster = event.layer;
    const childMarkers = cluster.getAllChildMarkers();

    // Calculer la somme des candidatures pour tous les marqueurs du cluster
    let totalCandidatures = 0;
    let totalGenerale = 0;
    let totalSTI2D = 0;
    let totalAutres = 0;

    childMarkers.forEach((marker) => {
      totalCandidatures += Leaflet.countUAIcandidatures(
        UAIcandidatures,
        marker.UAI
      );
      const seriesCounts = Leaflet.countSeries(Seriecandidats, marker.UAI);
      totalGenerale += seriesCounts[0];
      totalSTI2D += seriesCounts[1];
      totalAutres += seriesCounts[2];
    });

    // Afficher la popup avec la somme totale
    const popupContent = `
      <b>Total de candidatures :</b> ${totalCandidatures}<br>
      - Série Générale : ${totalGenerale}<br>
      - STI2D : ${totalSTI2D}<br>
      - Post-bac : ${totalPostBac}<br>
      - Autres : ${totalAutres}
    `;
    L.popup()
      .setLatLng(cluster.getLatLng())
      .setContent(popupContent)
      .openOn(map);
  });
};

export { Leaflet };
