/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
let map;

const customCoordinates = [
  [-85.734099, 39.155969],
  [-85.727942, 39.156159],
  [-85.72749, 39.156173],
  [-85.727507, 39.156762],
  [-85.724633, 39.156851],
  [-85.723091, 39.156819],
  [-85.723079, 39.156009],
  [-85.71991, 39.155977],
  [-85.719868, 39.152334],
  [-85.719787, 39.14532],
  [-85.72166, 39.14533],
  [-85.724472, 39.145306],
  [-85.725145, 39.145315],
  [-85.726039, 39.145286],
  [-85.7268, 39.145267],
  [-85.726867, 39.145265],
  [-85.726901, 39.147998],
  [-85.726912, 39.148901],
  [-85.72693, 39.150316],
  [-85.726993, 39.150315],
  [-85.727014, 39.151886],
  [-85.727162, 39.151884],
  [-85.727162, 39.151917],
  [-85.727592, 39.151913],
  [-85.728992, 39.151765],
  [-85.729975, 39.151743],
  [-85.72999, 39.152458],
  [-85.731691, 39.152408],
  [-85.734081, 39.152338],
  [-85.734099, 39.155969],
];

const centerCoordinates = {
  lat: customCoordinates[0][1],
  lng: customCoordinates[0][0],
};

const dataVar = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        color: "blue",
      },
      geometry: {
        type: "Polygon",
        coordinates: customCoordinates,
      },
    },
  ],
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: centerCoordinates,
  });
  map.data.setStyle({
    fillColor: "blue",
  });
  // NOTE: This uses cross-domain XHR, and may not work on older browsers.
  map.data.addGeoJson(
    //"https://storage.googleapis.com/mapsdevsite/json/google.json",
    dataVar,
  );
}

window.initMap = initMap;
