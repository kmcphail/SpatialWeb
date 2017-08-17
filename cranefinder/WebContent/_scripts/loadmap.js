var map;
var place;
var autocomplete;
var infowindow = new google.maps.InfoWindow();

//months translator dictionary
var months = {
	'1':'January',
	'2':'February',
	'3':'March',
	'4':'April',
	'5':'May',
	'6':'June',
	'7':'July',
	'8':'August',
	'9':'September',
	'10':'October',
	'11':'November',
	'12':'December'
};

function initialization() {
	mapClear();
	//showAllReports();
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
	    data: { "tab_id": "1","species":"WHCR","month":"1","myCount":"20"},
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
	
	//CREATE THE bounds
	var bounds = new google.maps.LatLngBounds ();

  $.each(reports, function(i, e) {
	  // Create the infoWindow content 
	  
	  //Get the Integer value for the month and populate string month
	  var month= months[e["month"]];
	  
	  //Change the displayed name for the species
	  if (e["species"]="SACR") {
		  var species = "Sandhill crane"
	  } 
	  if (e["species"]="WHCR") {
		  var species = "Whooping crane"
	  }
	  //Make species name plural if you see more than 1
	  if (parseInt(e["max_observed"])>1){
		  species +="s"
	  }

	// Create the infoWindow Output
	//NOTE: align = "center" is not supported in HTML5, Use CSS
	
	//Protected Area Name
	var contentStr = '<h4>'+ e['unit_nm']+'</h4><hr>';
	//Where sightings are Rare
	if (parseFloat(e["avg_reports"]) < 5 ) {
		contentStr += '<h6>In '+'&nbsp' +month+'&nbsp'+'it is rare to see'+ '&nbsp'+
		//contentStr += '<p>' + 'It is rare to see' + '</p>';
		 'as many as' + '&nbsp' + e["max_observed"]+ '&nbsp'+
		 species + '&nbsp' + 'here' + '</h6>';
		contentStr+= '<p>'+'If you plan to see cranes, contact the area to varify that<br/>'+
		'the cranes are in the area and easy to see'+'</p>';
	  }
	//Where sigtings are likely
	if (5<=parseFloat(e["avg_reports"]) && parseFloat(e["avg_reports"])<=25 ) {
		contentStr += '<h6>In '+'&nbsp' +month+'&nbsp'+'it is likely to see'+ '&nbsp'+
		//contentStr += '<p>' + 'It is to see' + '</p>';
		 'as many as' + '&nbsp' + e['max_observed']+ '&nbsp'+
		 species + '&nbsp' + 'here' + '</h6>';
		contentStr+= '<p>'+'If you plan to see cranes, contact the area to varify that<br/>'+
		'the cranes are in the area and easy to see'+'</p>'
	  }
	//Where sightins are very likely
	if (parseFloat(e['avg_reports'])> 25  ) {
		contentStr += '<h6>In '+'&nbsp' +month+'&nbsp'+'it is highly likely to see'+ '&nbsp'+
		//contentStr += '<p>' + 'It is  to see' + '</p>';
		 'as many as' + '&nbsp' + e['max_observed']+ '&nbsp'+
		 species + '&nbsp' + 'here' + '</h6>';
		contentStr+= '<p>'+'If you plan to see cranes, contact the area to varify that<br/>'+
		'the cranes are in the area and easy to see'+'</p>'
	  }
	
	// Create the marker
	var long = Number(e['longitude']);
	var lat = Number(e['latitude']);
	var latlng = new google.maps.LatLng(lat, long);
	//update the bounds
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
  //Reposition the map and zoom level
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
