//TO-DO: REFACTOR

import React, { useState } from "react";
import "./index.scss";
import { Loader } from "@googlemaps/js-api-loader";
import HighlightAltIcon from "@material-ui/icons/HighlightAlt";
import FilterAltIcon from "@material-ui/icons/FilterAlt";
import { restaurants } from "../../../components/_api/data";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

let map;
let rectangle;
let infowindow;
let rectangleWindow;
let locationWindow;
let directionsService;
let directionsDisplay;
let markers = [];
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
    }
    map.setCenter(restaurants[0].geometry.location);
  });
}

let mark;
function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  //marker
  const marker = new window.google.maps.Marker({
    map,
    position: place.geometry.location,
    type: place.type,
    name: place.name,
  });
  markers.push(marker);

  window.google.maps.event.addListener(marker, "click", () => {
    const foods = place.foodSpecialty.join(", ");
    const infoContent =
      "<b>" +
      place.name +
      "</b><br/>Specialty: " +
      foods +
      "<br><br><button id='getDirections' onclick='getDirections()'>Get directions</button>";
    infowindow.setContent(infoContent);
    infowindow.open(map, marker);
    mark = marker;
  });

  window.google.maps.event.addListener(infowindow, "domready", function () {
    document.getElementById("getDirections").onclick = getDirectionsClick;
  });
}

function getDirectionsClick() {
  // //to avoid overlapping directions
  if (directionsDisplay) {
    locationWindow.close();
    directionsDisplay.set("directions", null);
  }
  getLocation(); //getting directions
}

//update marker visibility
function filterMarkers(type, checked) {
  for (let i = 0; i < markers.length; i++) {
    if (type === markers[i].type) {
      markers[i].setVisible(checked);
    }
  }
}

//directions
//destination info
function getLocation() {
  locationWindow = new window.google.maps.InfoWindow();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        let origin = new window.google.maps.LatLng(pos.lat, pos.lng);
        let destination = new window.google.maps.LatLng(
          mark.position.lat(),
          mark.position.lng()
        );

        // get route from current location to the restaurant
        calculateAndDisplayRoute(origin, destination, mark.name);
      },
      () => {
        handleLocationError(true, locationWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, locationWindow, map.getCenter());
  }
}

function calculateAndDisplayRoute(origin, destination, name) {
  directionsService = new window.google.maps.DirectionsService();
  directionsDisplay = new window.google.maps.DirectionsRenderer({
    map: map,
  });
  directionsService.route(
    {
      origin: origin,
      destination: destination,
      avoidTolls: true,
      avoidHighways: false,
      travelMode: window.google.maps.TravelMode.DRIVING,
    },
    function (response, status) {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);

        let duration = response.routes[0].legs[0].duration.text;
        let distance = response.routes[0].legs[0].distance.text;
        infowindow.close();
        locationWindow.setContent(
          "<b>" +
            name +
            "</b><br/><i>Distance: " +
            distance +
            "<br/>Travel time by car: " +
            duration +
            "</i>"
        );
        locationWindow.open(map, mark);
      } else {
        locationWindow.setPosition(map.getCenter());
        locationWindow.setContent("Directions request failed due to " + status);
      }
    }
  );
}

function handleLocationError(browserHasGeolocation, locationWindow, pos) {
  locationWindow.setPosition(pos);
  locationWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
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

//count number of restaurant inside the rectangle
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
  const [state, setState] = React.useState({
    FINE_DINING: true,
    CASUAL_DINING: true,
    BUFFET: true,
    CAFE: true,
    FAST_FOOD: true,
  });

  const filterChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    filterMarkers(event.target.name, event.target.checked);
  };

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
          {filterState ? (
            <Card>
              {/* {cardContent} */}
              <CardContent>
                <FormGroup>
                  <FormControlLabel
                    key={"FINE_DINING"}
                    control={
                      <Checkbox
                        key={"FINE_DINING"}
                        checked={state.FINE_DINING}
                        onChange={filterChange}
                        name="FINE_DINING"
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Fine Dining"
                  />
                  <FormControlLabel
                    key={"CASUAL_DINING"}
                    control={
                      <Checkbox
                        key={"CASUAL_DINING"}
                        checked={state.CASUAL_DINING}
                        onChange={filterChange}
                        name="CASUAL_DINING"
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Casual Dining"
                  />
                  <FormControlLabel
                    key={"BUFFET"}
                    control={
                      <Checkbox
                        key={"BUFFET"}
                        checked={state.BUFFET}
                        onChange={filterChange}
                        name="BUFFET"
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Buffet"
                  />
                  <FormControlLabel
                    key={"CAFE"}
                    control={
                      <Checkbox
                        key={"CAFE"}
                        checked={state.CAFE}
                        onChange={filterChange}
                        name="CAFE"
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Cafe"
                  />
                  <FormControlLabel
                    key={"FAST_FOOD"}
                    control={
                      <Checkbox
                        key={"FAST_FOOD"}
                        checked={state.FAST_FOOD}
                        onChange={filterChange}
                        name="FAST_FOOD"
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label="Fastfood"
                  />
                </FormGroup>
              </CardContent>
            </Card>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};
export default RestaurantMaps;
