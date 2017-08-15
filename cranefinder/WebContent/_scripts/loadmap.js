var map;
var place;
var autocomplete;
var infowindow = new google.maps.InfoWindow();

function initialization() {
	test();
	
	showAllReports();
	//initAutocomplete();
	
}

function test() {
	map = new google.maps.Map(document.getElementById('map-canvas'),{
		center :{lat: 43.45, lng: -89.75},
		zoom: 10
	});
}

function showAllReports() {
	  $.ajax({
	    url: 'HttpServlet',
	    type: 'POST',
	    data: { "tab_id": "1"},
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
	  var long = Number(e['longitude']);
	  var lat = Number(e['latitude']);
	  //Assign the icon variable
	  var latlng = new google.maps.LatLng(lat, long);
	    
	  var bounds = new google.maps.LatLngBounds ();
	  
	  $.each(reports, function(i, e) {

		    // Create the infoWindow content
		    var contentStr = '<h4>Location Details</h4><hr>';
		    
		    //used the line below to test if the request type was coming through.
		    //contentStr += '<p><b>' + icons[report_type].icon + '</b></p>';
		    
		    contentStr += '<p><b>' + 'Unit Name' + ':</b>&nbsp' + e['unit_nm'] + '</p>';
		    contentStr += '<p><b>' + 'Month' + ':</b>&nbsp' + e['month'] + 
		      '</p>';
		    contentStr += '<p><b>' + 'Max Observed' + ':</b>&nbsp' + e['max_observed'] + 
		      '</p>';

		    // Create the marker
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

//Execute our 'initialization' function once the page has loaded.
google.maps.event.addDomListener(window, 'load', initialization);
