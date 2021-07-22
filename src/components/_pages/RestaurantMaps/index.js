//TO-DO: REFACTOR

import React, { useState } from "react";
import "./index.scss";
import { Loader } from "@googlemaps/js-api-loader";
import HighlightAltIcon from "@material-ui/icons/HighlightAlt";
import FilterAltIcon from "@material-ui/icons/FilterAlt";
// import { DrawRectangle } from "../../../components/_ui";
import { restaurants, restaurantType } from "../../../components/_api/data";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

let map;
let infowindow;
let rectangle;
let rectangleWindow;
// let markers = [];
const additionalOptions = {};
const loader = new Loader({
  apiKey: "AIzaSyBUcw8F-SDRojtF1o075_uXKYtJsp24FHw",
  version: "weekly",
  libraries: ["places"],
  ...additionalOptions,
});

//initial bounds for rectangle
const bounds = {
  north: 10.3919,
  south: 10.2995,
  east: 123.951,
  west: 123.8378,
};

initMap(); //initialize maps

//FUNCTIONS
function initMap() {
  loader.load().then(() => {
    infowindow = new window.google.maps.InfoWindow();
    map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 10.3157, lng: 123.8854 }, //cebu city coordinates
      zoom: 13,
    });

    //create markers for all restaurants
    for (let i = 0; i < restaurants.length; i++) {
      createMarker(restaurants[i]);
      console.log(restaurants[i]);
    }
    map.setCenter(restaurants[0].geometry.location);
  });
}

// function filterMarker(filters) {
//   // for (let i = 0; i < restaurants.length; i++) {
// }

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  //marker
  const marker = new window.google.maps.Marker({
    map,
    position: place.geometry.location,
  });
  // markers.push(marker);
  // marker.setVisible(true); //set visibility

  window.google.maps.event.addListener(marker, "mouseover", () => {
    const foods = place.foodSpecialty.join(", ");
    const infoContent = "<b>" + place.name + "</b><br/>Specialty: " + foods;
    infowindow.setContent(infoContent);
    infowindow.open(map, marker);
  });
}

//FUNCTIONS for rectangle
function createRectangle() {
  // Define the rectangle and set its editable property to true.
  rectangle = new window.google.maps.Rectangle({
    bounds: bounds,
    editable: true,
    draggable: true,
  });

  rectangle.setMap(map);
  // Add an event listener on the rectangle.
  rectangle.addListener("bounds_changed", rectangleChange);
  rectangleWindow = new window.google.maps.InfoWindow();
  console.log("shown");

  let contentString = countMarkers();
  // Set the info window's content and position.
  rectangleWindow.setContent(contentString);
  rectangleWindow.setPosition(rectangle.getBounds().getNorthEast());
  rectangleWindow.open(map);
}

function removeRectangle() {
  if (rectangle) {
    rectangle.setVisible(false);
    rectangleWindow.close();
  }
}

/** Show the new coordinates for the rectangle in an info window. */
function rectangleChange() {
  let contentString = countMarkers();
  // Set the info window's content and position.
  rectangleWindow.setContent(contentString);
  rectangleWindow.setPosition(rectangle.getBounds().getNorthEast());
}

function countMarkers() {
  const ne = rectangle.getBounds().getNorthEast();
  const sw = rectangle.getBounds().getSouthWest();
  let bounds = new window.google.maps.LatLngBounds(sw, ne);
  let count = 0;
  for (let i = 0; i < restaurants.length; i++) {
    let loc = restaurants[i].geometry.location;
    if (bounds.contains(new window.google.maps.LatLng(loc.lat, loc.lng))) {
      count++;
    }
  }
  return "<b>" + count + " restaurant/s in this area.</b><br>";
}

const RestaurantMaps = () => {
  const [filterState, setfilterState] = useState(false);
  const [rectangleState, setrectangleState] = useState(false);
  // const [state, setState] = React.useState({
  //   FINE_DINING: true,
  //   CASUAL_DINING: true,
  //   BUFFET: true,
  //   CAFE: true,
  //   FAST_FOOD: true,
  // });

  // const { FINE_DINING, CASUAL_DINING, BUFFET, CAFE, FAST_FOOD } = state;
  // const filterChange = (event) => {
  //   setState({ ...state, [event.target.name]: event.target.checked });
  // };

  const filterAction = (e) => {
    filterState ? setfilterState(false) : setfilterState(true);
  };

  const rectangleAction = (e) => {
    if (rectangleState) {
      removeRectangle();
      setrectangleState(false);
    } else {
      createRectangle();
      setrectangleState(true);
    }
  };

  return (
    <div>
      <div id="map"></div>
      <div className="controls">
        <div className="main">
          <div className="filter">
            <Button
              key="filter"
              variant="contained"
              className="btn"
              onClick={(e) => filterAction(e)}
            >
              <FilterAltIcon fontSize="large" />
            </Button>
          </div>
          <div className="draw">
            <Button
              key="rectangle"
              className="btn"
              variant="contained"
              onClick={(e) => rectangleAction(e)}
            >
              <HighlightAltIcon fontSize="large" />
            </Button>
          </div>
        </div>
        <div className="filter-sub">
          {filterState ? <Card>{cardContent}</Card> : ""}
        </div>
      </div>
    </div>
  );
};

const cardContent = (
  <CardContent>
    <FormGroup>
      {restaurantType
        ? restaurantType.map((type) => {
            return (
              <FormControlLabel
                key={type.id}
                control={
                  <Checkbox
                    key={type.id}
                    checked={type.checked}
                    // onChange={filterChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={type.name}
              />
            );
          })
        : `Can't Load This Component`}
    </FormGroup>
  </CardContent>
);

export default RestaurantMaps;
