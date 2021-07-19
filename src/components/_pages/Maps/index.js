import React from "react";
import "./index.scss";
import { Loader } from "@googlemaps/js-api-loader";
let map;
const additionalOptions = {};
const loader = new Loader({
  apiKey: "AIzaSyBUcw8F-SDRojtF1o075_uXKYtJsp24FHw",
  version: "weekly",
  ...additionalOptions,
});
loader.load().then(() => {
  map = new window.google.maps.Map(document.getElementById("map"), {
    center: { lat: 10.3157, lng: 123.8854 }, //cebu city coordinates
    zoom: 12,
  });
});

const RestaurantMaps = () => {
  return (
    <div>
      <div id="map"></div>
    </div>
  );
};

export default RestaurantMaps;
