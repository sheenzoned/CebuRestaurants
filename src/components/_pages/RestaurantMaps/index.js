import React from "react";
import "./index.scss";
import { Loader } from "@googlemaps/js-api-loader";

//draw
import EditLocationIcon from "@material-ui/icons/EditLocation";
let rectangle;
const bounds = {
  north: 10.3919,
  south: 10.2995,
  east: 123.951,
  west: 123.8378,
};
// 10.3919, 10.2995;
// 123.9518, 123.8378;

let map;
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

//draw
let isDrawShown = false;
const doAction = (e) => {
  // Define the rectangle and set its editable property to true.
  rectangle = new window.google.maps.Rectangle({
    bounds: bounds,
    editable: true,
    draggable: true,
  });
  if (isDrawShown) {
    isDrawShown = false;
    console.log("hide");
    rectangle.setMap(null);
  } else {
    // isDrawShown = false;
    // console.log("hide");
    // rectangle.setMap(null);
    isDrawShown = true;
    rectangle.setMap(map);
    // Add an event listener on the rectangle.
    rectangle.addListener("bounds_changed", showRestaurants);
    console.log("shown");
  }
};

/** Show the new coordinates for the rectangle in an info window. */
function showRestaurants() {
  const ne = rectangle.getBounds().getNorthEast();
  const sw = rectangle.getBounds().getSouthWest();
  console.log("ne: " + ne);
  console.log("sw: " + sw);
  //insert method here
}

const RestaurantMaps = () => {
  return (
    <div>
      <div id="map"></div>
      <div className="draw">
        <button onClick={(e) => doAction(e)}>
          <EditLocationIcon fontSize="large" />
        </button>
      </div>
    </div>
  );
};

export default RestaurantMaps;
