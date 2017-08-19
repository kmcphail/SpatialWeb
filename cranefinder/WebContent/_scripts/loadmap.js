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
	mapStart();
	initAutocomplete();
}

function mapStart() {
	map = new google.maps.Map(document.getElementById('map-canvas'),{
		center :{lat: 40, lng: -100},
		zoom: 5
	});
	
	//Code from: https://developers.google.com/maps/documentation/javascript/geolocation
	// Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        //Center the map and Zoom
        map.setCenter(pos);
        map.setZoom(8);
        //Call the function to add the marker
        addLocMarker(pos);
        
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
}

function addLocMarker(location){
	var locMarker = new google.maps.Marker({ // Set the marker
		  position : location, // Position marker to coordinates
		  icon : '_assets/mm_20_red.png',
		  map : map, // assign the marker to our map variable
		});
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

function showAllReports() {
	  $.ajax({
	    url: 'HttpServlet',
	    type: 'POST',
	    data: { "tab_id": "1",},
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
	  var r_month= months[e["month"]];
	  
	  //Change the displayed name for the species
	  if (e["species"]=="SACR") {
		  var r_species = "Sandhill crane"
	  } 
	  if (e["species"]=="WHCR") {
		  var r_species = "Whooping crane";
	  }
	
	  var p_species = r_species+'s';
	  var max_observed=e['max_observed'];
	  var myUnit =  e['unit_nm'];
	  
	  if (max_observed>1){
		  r_species += 's';
	  }

	// Create the infoWindow Output
	//NOTE: align = "center" is not supported in HTML5, Use CSS
	
	//Protected Area Name
	var contentStr = '<h4>'+ myUnit+'</h4>';
	//Where sightings are Rare
	if (parseFloat(e["avg_reports"]) < 1 ) {
		contentStr += '<h6>Sightings of '+p_species+' are uncommon here.'+
		'<br/>On average, eBird volunteers report less than one sighting'+
		' of '+p_species+' per year in '+r_month+'.</h6> <h6>When '+p_species+
		' are here, the largest number seen at one time is '+max_observed+' '+r_species+'.</h6>';
	  }
	//Where sightings are likely
	if (1<=parseFloat(e["avg_reports"]) && parseFloat(e["avg_reports"])<=30 ) {
		contentStr += '<h5>Sightings of '+ p_species + ' are often seen here.</h5> <h6>On average, eBird '+
		'volunteers report sightings here up to once per day in'+ r_month+
		'. </h6> <h6>The largest number of '+p_species+' seen here in '+
		r_month +' at one time is '+max_observed+' '+r_species+'.</h6>';
	  }
	//Where sightings are very likely
	if (parseFloat(e['avg_reports'])> 30  ) {
		contentStr += '<h4>This is a hot spot for '+p_species+'!</h4><h6>On average, '+
		'eBird volunteers report sightings more thant once per day. </h6><h6>The '+
		'largest number of '+p_species+' seen here in '+r_month+' at one time is '+
		max_observed + ' ' + r_species + '.</h6>';
	  }
	contentStr+= '<p>If you plan to see cranes, contact the protected area to verify that<br/>'+
	'the cranes are easy to find.</p>';
	
	/** the following icon code is set up to accept custom icons if the foundation chooses to use
	  custom icons, it is set up so that minimal changes in code are needed. 
	 */
	//set the icon base where the png icons reside
    //var iconBase = 'C:/programming/workspace/WebProject/WebContent/img/';
    
    
    //icon container to assign the icon to damage type
    var icon = {uncommon:{url: '_assets/mm_20_purple.png'},
    					//scaledSize:new google.maps.Size(10,10)},//resize the marker to be smaller
    			often:{url:'_assets/mm_20_purple.png',
    					scaledSize:new google.maps.Size(20,30)},
    			hot:{url:'_assets/mm_20_purple.png',
    					scaledSize:new google.maps.Size(30,40)},
    };
    
    
    // assign feature array container to hold the icon types
    var sighting  = [{type:'uncommon'},{type:'often'},{type:'hot'}];
    
    //if statements to assign the report icon type to report type. 
    if (parseFloat(e["avg_reports"]) < 1 ) {
    	sighting.type = 'uncommon'
    };
    if (1<=parseFloat(e["avg_reports"]) && parseFloat(e["avg_reports"])<=30 ){
    	 sighting.type = 'often'
     };
     
     if (parseFloat(e['avg_reports'])> 30){
    	 sighting.type = 'hot'
     };
	
	// Create the marker
	var long = Number(e['longitude']);
	var lat = Number(e['latitude']);
	var latlng = new google.maps.LatLng(lat, long);
	//update the bounds
	bounds.extend(latlng);
	
	var marker = new google.maps.Marker({ // Set the marker
	  position : latlng, // Position marker to coordinates
	  icon : icon[sighting.type],
	  //icon:'_assets/mm_20_purple.png',
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
  showMyLocation();

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
	  map.fitBounds(place.geometry.viewport);
	  //map.setZoom(14);
	  addLocMarker(place.geometry.location);
	}


//if (!place.geometry) {
	  // User entered the name of a Place that was not suggested and
    // pressed the Enter key, or the Place Details request failed.
  //  window.alert("No details available for input: '" + place.name + "'");
   // return;
   // }
// If the place has a geometry, then present it on a map.
	//if (place.geometry.viewport) {
	//	map.fitBounds(place.geometry.viewport);
    //} else {
      //map.setCenter(place.geometry.location);
      //map.setZoom(17);  // Why 17? Because it looks good.
    //}
    //marker.setPosition(place.geometry.location);
    //marker.setVisible(true);

    //var address = '';
    //if (place.address_components) {
    //  address = [
    //    (place.address_components[0] && place.address_components[0].short_name || ''),
    //    (place.address_components[1] && place.address_components[1].short_name || ''),
    //    (place.address_components[2] && place.address_components[2].short_name || '')
    //  ].join(' ');
     // }
    //}


	//}
//Execute our 'initialization' function once the page has loaded.
google.maps.event.addDomListener(window, 'load', initialization);
