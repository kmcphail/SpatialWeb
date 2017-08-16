<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>GoogleMap</title>
</head>
<!-- Custom styles -->
  <link rel="stylesheet" href="css/styles.css">
  <style>
  #map-canvas{
  	height: 100%;
  }
  
  html,body{
  	height: 100%;
  	margin: 0;
  	padding: 0;
  	}</style>

  <!-- jQuery -->
  <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
  <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>

  <!-- Bootstrap -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

  <!-- Google Map js libraries-->
  <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&key=AIzaSyB8Woz2WyIajSRO89Lk3pfpgZrqvjIpZe8&signed_in=true&libraries=places,visualization"></script>
<body>
<div id="map-canvas"></div>

<script src="_scripts/loadmap.js"></script> 

<script>
function test_query_report() {
		$.ajax({
		    url: 'HttpServlet',
		    type: 'POST',
		    data: { "tab_id": "1","species":"wild"},
		    success: function(data){ 
		    	$.each(data, function(i, e) {
		    		alert(JSON.stringify(e));
		    	});
		    },
		    error: function(xhr, status, error) {
			    alert("An AJAX error occured: " + status + "\nError: " + error);
			  }
		});
	}
	</script>
</body>
</html>