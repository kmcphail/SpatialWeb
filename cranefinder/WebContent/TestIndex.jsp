<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Web Project</title>
<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
</head>
<body>
	<script>
	
	window.onload = initialize();
	function initialize() {
		$.ajax({
		    url: 'HttpServlet',
		    type: 'POST',
		    success: function(data){ 
		    	$.each(data, function(i, name) {
		    		alert("key: " + i + ", value: " + name);
		    	});
		    },
		    error: function(xhr, status, error) {
			    alert("An AJAX error occured: " + status + "\nError: " + error);
			  }
		});
	}
	
	window.onload = tests();
	function tests() {
		//test_report_submission();
		//test_query_report();
	}
	
	function test_report_submission() {
		$.ajax({
		    url: 'HttpServlet',
		    type: 'POST',
		    data: { "tab_id": "0", "fN": "Jason", "lN": "Zhou",  "is_male": "t", 
		    	"age": "30", "blood_type": "AB", "tel": "928-777-8856", "email":
		    	"jasonzhou@gmail.com", "contact_fN": "Bill", "contact_lN": "Huang", 
		    	"contact_tel": "608-888-9876", "contact_email": "billh@gmail.com", 
		    	"report_type": "request", "disaster_type": "wildfire", "longitude": 
		    	"-87", "latitude": "33", "message": "request rescue!!!", 
		    	"additional_message": "rescue/volunteer"},
		    success: function(data){ 
		    	$.each(data, function(i, name) {
		    		alert("key: " + i + ", value: " + name);
		    	});
		    },
		    error: function(xhr, status, error) {
			    alert("An AJAX error occured: " + status + "\nError: " + error);
			  }
		});
	}
	
	function test_query_report() {
		$.ajax({
		    url: 'HttpServlet',
		    type: 'POST',
		    //data: { "tab_id": "1","species":"WHCR"},
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