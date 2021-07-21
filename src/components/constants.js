import { Loader } from "@googlemaps/js-api-loader";

export const map = new window.google.maps.Map(document.getElementById("map"), {
  center: { lat: 10.3157, lng: 123.8854 }, //cebu city coordinates
  zoom: 13,
});
