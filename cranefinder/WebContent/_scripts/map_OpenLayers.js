// TO DO: Clean up & consolidate functions

// Reposition zoom toolbar
function applyMargins() {
  var sidebarLeft = $(".sidebar-collapsed");
  if (sidebarLeft.is(":visible")) {
    $("#map .ol-zoom")
      .css("margin-left", 0)
      .removeClass("zoom-top-opened-sidebar")
      .addClass("zoom-top-collapsed");
  } else {
    $("#map .ol-zoom")
      .css("margin-left", $(".sidebar-left").width())
      .removeClass("zoom-top-opened-sidebar")
      .removeClass("zoom-top-collapsed");
  }
}

function isConstrained() {
  return $(".sidebar").width() == $(window).width();
}
function applyInitialUIState() {
  if (isConstrained()) {
    $(".sidebar-left .sidebar-body").fadeOut("slide");
    $(".sidebar-collapsed-left").fadeIn();
  }
}

// Sidebar collapse animation
$(function(){
  $(".sidebar-left .slide-sidebar").on("click",function() {
    var thisElement = $(this);
    thisElement.closest(".sidebar-body").fadeOut("slide",function(){
      $(".sidebar-collapsed-left").fadeIn();
      applyMargins();
    });
  });
  
  $(".sidebar-collapsed").on("click",function() {
    var thisElement = $(this);
    $(".sidebar-left .sidebar-body").toggle("slide");
    thisElement.hide();
    applyMargins();
  });
  
  $(window).on("resize", applyMargins);
  
  applyInitialUIState();
  applyMargins();
});


// TO DO: Create current date function
$(document).ready(function() {
  var date = new Date();
  var month = date.getMonth();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  document.getElementById("month").innerHTML = months[month];
  
  //$("#months option:eq("+month+")").val("selected", true);
  //$("#month").val("selected", true);
});


// Vector style definition (plain view)
var style = new ol.style.Style({
  // Polygon inner fill
  fill: new ol.style.Fill({
    color: "rgba(255, 255, 255, 0.6)"
  }),
  // Polygon outer edge
  stroke: new ol.style.Stroke({
    color: "teal",
    lineDash: [4],
    width: 1
  }),
  // Polygon text label
  text: new ol.style.Text({
    font: "12px Calibri, sans-serif",
    fill: new ol.style.Fill({
      color: "#000"
    }),
    stroke: new ol.style.Stroke({
      color: "#FFF",
      width: 2
    })
  })
});

// Vector layer definition
// TO DO: Retrieve GeoJSON file containing relevant protected areas via query
var vectorLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url:
    // Example file contains polygon coordinates & field values
    //"https://openlayers.org/en/v4.2.0/examples/data/geojson/countries.geojson",
    	"_scripts/whoopers.geojson",
    // Potential files to test? Replace as necessary (comment out the rest to test)
      //"_scripts/state_geojson.geojson",
      //"_scripts/county_geojson.geojson",
      //"_scripts/padus_geojson.geojson",
    format: new ol.format.GeoJSON()
  }),
  // Polygon text label (name) shows up at a certain extent (5000)
  style: function(feature, resolution) {
    style.getText().setText(resolution < 5000 ? feature.get("name") : "");
    return style;
  }
});

// Map base definition
var map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    vectorLayer
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-110, 40]),
    zoom: 4
  })
});

var highlightStyleCache = {};

// Feature layer definition (highlighted view)
var featureOverlay = new ol.layer.Vector({
  source: new ol.source.Vector(),
  map: map,
  style: function(feature, resolution) {
    var text = resolution < 5000 ? feature.get("name") : "";
    if (!highlightStyleCache[text]) {
      highlightStyleCache[text] = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "#FFF",
          width: 1
        }),
        fill: new ol.style.Fill({
          color: "rgba(0,255,0,0.1)"
        }),
        text: new ol.style.Text({
          font: "12px Calibri,sans-serif",
          text: text,
          fill: new ol.style.Fill({
            color: "#000"
          }),
          stroke: new ol.style.Stroke({
            color: "FFF",
            width: 3
          })
        })
      });
    }
    return highlightStyleCache[text];
  }
});

var highlight;
var displayFeatureInfo = function(pixel) {
  
  var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
    return feature;
  });
  
  // This text is linked to the Details panel
  // TO DO: Get feature name from protected area GeoJSON
  var info = document.getElementById("map_info");
  if (feature) {
    // Example file contains country field (name) values
    info.innerHTML = feature.getId() + ": " + feature.get("name");
    // Potential files to test? Replace as necessary (comment out the rest to test)
      //info.innerHTML = feature.get("STUSPS") + ": " + feature.get("NAME");
      //info.innerHTML = "County: " + feature.get("NAME");
      //info.innerHTML = "Protected area: " + feature.get("NAME");
  } else {
    info.innerHTML = "&nbsp;";
  }
  
  if (feature !== highlight) {
    if (highlight) {
    featureOverlay.getSource().removeFeature(highlight);
    }
    if (feature) {
      featureOverlay.getSource().addFeature(feature);
    }
    highlight = feature;
  }
  
};

map.on("pointermove", function(evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel);
});

map.on("click", function(evt) {
  displayFeatureInfo(evt.pixel);
});
