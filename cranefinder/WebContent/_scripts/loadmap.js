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
		  	//NOTE: align = "center" is not supported in HTML5, Use CSS
		    var contentStr = '<h4 align = "center">'+ e['unit_nm']+'</h4><hr>';
		    if (e['avg_reports'] < 10 ) {
		    	contentStr += '<p align = "center">In '+'&nbsp' +e['month']+'&nbsp'+'it is unlikly to see'+ '&nbsp'+
		    	//contentStr += '<p>' + 'It is rare to see' + '</p>';
		    	 'as many as' + '&nbsp' + e['max_observed']+ '&nbsp'+
		    	 e['species'] + '&nbsp' + 'here' + '</p>';
		    	contentStr+= '<h6 align = "center">'+'If you plan to see cranes, contact the area to varify that<br/>'+
		    	'the cranes are in the area and easy to see'+'</h6>';
		      }
		    else if (10<=e['avg_reports'] && e['avg_reports'>=75]  ) {
		    	contentStr += '<p>In '+'&nbsp' +e['month']+'&nbsp'+'it is possible to see'+ '&nbsp'+
		    	//contentStr += '<p>' + 'It is  to see' + '</p>';
		    	 'as many as' + '&nbsp' + e['max_observed']+ '&nbsp'+
		    	 e['species'] + '&nbsp' + 'here' + '</p>';
		    	contentStr+= '<h6 align = "center">'+'If you plan to see cranes, contact the area to varify that<br/>'+
		    	'the cranes are in the area and easy to see'+'</h6>'
		      }
		    
		    else if (e['avg_reports'< 75]  ) {
		    	contentStr += '<p>In '+'&nbsp' +e['month']+'&nbsp'+'it is highly likely to see'+ '&nbsp'+
		    	//contentStr += '<p>' + 'It is  to see' + '</p>';
		    	 'as many as' + '&nbsp' + e['max_observed']+ '&nbsp'+
		    	 e['species'] + '&nbsp' + 'here' + '</p>';
		    	contentStr+= '<h6 align = "center">'+'If you plan to see cranes, contact the area to varify that<br/>'+
		    	'the cranes are in the area and easy to see'+'</h6>'
		      }
		    
		    //used the line below to test if the request type was coming through.
		    //contentStr += '<p><b>' + icons[report_type].icon + '</b></p>';
		    //contentStr += '<p><b>' + 'Species' + ':</b>&nbsp' + e['avg_reports'] + '</p>';
		    //contentStr += '<p><b>' + 'Unit Name' + ':</b>&nbsp' + e['unit_nm'] + '</p>';
		    //contentStr += '<p><b>' + 'Month' + ':</b>&nbsp' + e['month'] + 
		     // '</p>';
		    //contentStr += '<p><b>' + 'Max Observed' + ':</b>&nbsp' + e['max_observed'] + 
		     // '</p>';

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

//Execute our 'initialization' function once the page has loaded.
google.maps.event.addDomListener(window, 'load', initialization);
