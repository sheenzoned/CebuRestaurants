import React from "react";
import "./index.scss";
import EditLocationIcon from "@material-ui/icons/EditLocation";
// import { map } from "../../../components/constants";

const DrawRectangle = (map) => {
  console.log("map: " + map);
  let rectangle;
  let rectangleWindow;
  // let map;
  const bounds = {
    north: 10.3919,
    south: 10.2995,
    east: 123.951,
    west: 123.8378,
  };
  let isDrawShown = false;
  const doAction = (e) => {
    // Define the rectangle and set its editable property to true.
    rectangle = new window.google.maps.Rectangle({
      bounds: bounds,
      editable: true,
      draggable: true,
    });
    // map = new window.google.maps.Map(document.getElementById("map"), {
    //   center: { lat: 10.3157, lng: 123.8854 }, //cebu city coordinates
    //   zoom: 13,
    // });
    if (isDrawShown) {
      isDrawShown = false;
      console.log("hide");
      rectangle.setMap(null);
    } else {
      isDrawShown = true;
      rectangle.setMap(map);
      // Add an event listener on the rectangle.
      rectangle.addListener("bounds_changed", showRestaurants);
      rectangleWindow = new window.google.maps.InfoWindow();
      console.log("shown");
      const contentString = "<b> # of restaurants in this area.</b><br>";
      // Set the info window's content and position.
      rectangleWindow.setContent(contentString);
      rectangleWindow.setPosition(rectangle.getBounds().getNorthEast());
      rectangleWindow.open(map);
    }
  };

  /** Show the new coordinates for the rectangle in an info window. */
  function showRestaurants() {
    const ne = rectangle.getBounds().getNorthEast();
    const sw = rectangle.getBounds().getSouthWest();
    console.log("ne: " + ne);
    console.log("sw: " + sw);
    rectangleWindow.setPosition(rectangle.getBounds().getNorthEast());
    //insert method here
  }
  return (
    <div className="draw">
      <button onClick={(e) => doAction(e)}>
        <EditLocationIcon fontSize="large" />
      </button>
    </div>
  );
};

export default DrawRectangle;
