import { Loader } from "@googlemaps/js-api-loader";

export function map() {
  var map;
  let service;
  let infowindow;
  const additionalOptions = {};
  const loader = new Loader({
    apiKey: "AIzaSyBUcw8F-SDRojtF1o075_uXKYtJsp24FHw",
    version: "weekly",
    libraries: ["places"],
    ...additionalOptions,
  });
  const request = {
    query: "restaurant",
    fields: ["name", "geometry"],
  };
  loader.load().then(() => {
    infowindow = new window.google.maps.InfoWindow();
    map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 10.3157, lng: 123.8854 }, //cebu city coordinates
      zoom: 13,
    });

    service = new window.google.maps.places.PlacesService(map);
    service.textSearch(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
        map.setCenter(results[0].geometry.location);
      }
    });
  });

  function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    //marker
    const marker = new window.google.maps.Marker({
      map,
      position: place.geometry.location,
    });

    window.google.maps.event.addListener(marker, "mouseover", () => {
      infowindow.setContent(place.name || "");
      infowindow.open(map, marker);
    });
  }

  return map;
}
