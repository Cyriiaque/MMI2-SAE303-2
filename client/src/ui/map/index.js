import { data } from "autoprefixer";
import * as L from "leaflet";

let Leaflet = {};

function countUAIcandidatures(dataCandidatures, UAI) {
  const Candidatures = dataCandidatures.filter((element) => element === UAI);
  return Candidatures.length;
}

Leaflet.render = function (UAIcandidatures, dataLycee) {
  var map = L.map("map").setView([45.835, 1.255], 15);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const uniqueUAIcandidatures = [...new Set(UAIcandidatures)];

  for (let i = 0; i < uniqueUAIcandidatures.length; i++) {
    for (let j = 1; j < dataLycee.length; j++) {
      if (uniqueUAIcandidatures[i] == dataLycee[j].numero_uai) {
        if (dataLycee[j].latitude != "" && dataLycee[j].longitude != "") {
          var marker = L.marker([
            parseFloat(dataLycee[j].latitude),
            parseFloat(dataLycee[j].longitude),
          ]).addTo(map);
          marker
            .bindPopup(
              "<b>" +
                dataLycee[j].appellation_officielle +
                "</b><br>" +
                countUAIcandidatures(UAIcandidatures, dataLycee[j].numero_uai) +
                " candidats"
            )
            .openPopup();
        }
      }
    }
  }

  // var circle = L.circle([45.835, 1.255], {
  //   color: "red",
  //   fillColor: "#f03",
  //   fillOpacity: 0.5,
  //   radius: 500,
  // }).addTo(map);

  // var polygon = L.polygon([
  //   [51.509, -0.08],
  //   [51.503, -0.06],
  //   [51.51, -0.047],
  // ]).addTo(map);

  // marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
  // circle.bindPopup("I am a circle.");
  // polygon.bindPopup("I am a polygon.");

  // var popup = L.popup();

  // function onMapClick(e) {
  //   popup
  //     .setLatLng(e.latlng)
  //     .setContent("You clicked the map at " + e.latlng.toString())
  //     .openOn(map);
  // }

  // map.on("click", onMapClick);
};

export { Leaflet };
