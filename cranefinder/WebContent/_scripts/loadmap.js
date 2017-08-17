var map;
var place;
var autocomplete;
var infowindow = new google.maps.InfoWindow();

function initialization() {
	mapClear();
	initAutocomplete();
	
}

function mapClear() {
	map = new google.maps.Map(document.getElementById('map-canvas'),{
		center :{lat: 40, lng: -100},
		zoom: 5
	});
}

function showAllReports() {
	  $.ajax({
	    url: 'HttpServlet',
	    type: 'POST',
	    data: { "tab_id": "1","species":"WHCR","month":"8"},
	    success: function(reports) {
	    	mapInitialization(reports);
	    },
	    error: function(xhr, status, error) {
	      alert("An AJAX error occured: " + status + "\nError: " + error);
	    }
	  });
	}


function mapInitialization(reports) {
	var mapOptions = {
			mapTypeId : google.maps.MapTypeId.ROADMAP, // Set the type of Map
	};
	  
	// Render the map within the empty div
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	
	//Assign the icon variable
	
	var bounds = new google.maps.LatLngBounds ();

	  $.each(reports, function(i, e) {

		    // Create the infoWindow content
		  
		    var contentStr = '<h4>Location Details</h4><hr>';
		    
		    //used the line below to test if the request type was coming through.
		    //contentStr += '<p><b>' + icons[report_type].icon + '</b></p>';
		    contentStr += '<p><b>' + 'Species' + ':</b>&nbsp' + e['species'] + '</p>';
		    contentStr += '<p><b>' + 'Unit Name' + ':</b>&nbsp' + e['unit_nm'] + '</p>';
		    contentStr += '<p><b>' + 'Month' + ':</b>&nbsp' + e['month'] + 
		      '</p>';
		    contentStr += '<p><b>' + 'Max Observed' + ':</b>&nbsp' + e['max_observed'] + 
		      '</p>';

		    // Create the marker
		    var long = Number(e['longitude']);
			var lat = Number(e['latitude']);
			var latlng = new google.maps.LatLng(lat, long);
			bounds.extend(latlng);
			
		    var marker = new google.maps.Marker({ // Set the marker
		      position : latlng, // Position marker to coordinates
		      //icon : icons[report_type].icon,
		      map : map, // assign the marker to our map variable
		      customInfo: contentStr,
		    });
		    
		    // Add a Click Listener to the marker
		    google.maps.event.addListener(marker, 'click', function() { 
		      // use 'customInfo' to customize infoWindow
		      infowindow.setContent(marker['customInfo']);
		      infowindow.open(map, marker); // Open InfoWindow
		    });
		    
		  });
		  
		  map.fitBounds (bounds);

		}

function initAutocomplete() {
	  // Create the autocomplete object
	  autocomplete = new google.maps.places.Autocomplete(document
	    .getElementById('autocomplete'));

	  // When the user selects an address from the dropdown, show the place selected
	  autocomplete.addListener('place_changed', onPlaceChanged);
	}

function onPlaceChanged() {
place = autocomplete.getPlace();
if (!place.geometry) {
	  // User entered the name of a Place that was not suggested and
    // pressed the Enter key, or the Place Details request failed.
    window.alert("No details available for input: '" + place.name + "'");
    return;
    }
// If the place has a geometry, then present it on a map.
	if (place.geometry.viewport) {
		map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
      }
    }

//Execute our 'initialization' function once the page has loaded.
google.maps.event.addDomListener(window, 'load', initialization);
