// Sidebar collapse animation
$(function(){
  $(".sidebar-left .slide-sidebar").on("click",function() {
    var thisElement = $(this);
    thisElement.closest(".sidebar-body").fadeOut("slide",function(){
      $(".sidebar-collapsed-left").fadeIn();
    });
  });
  
  $(".sidebar-collapsed").on("click",function() {
    var thisElement = $(this);
    $(".sidebar-left .sidebar-body").toggle("slide");
    thisElement.hide();
  });
});


// Set default options to current month & year
$(document).ready(function() {
  var date = new Date();
  //we need to send the integer value for the month to the query 
  //So we add 1 to the index value returned by the getMonth() function
  var month = date.getMonth()+1;
  var year = date.getFullYear();
  document.getElementById("month").value = month;
  document.getElementById("year").value = year;
  });



//ON HOLD: Incorporate location query type
// Hidden field selector for location query type 
/*
function onSelectLocationType(ele) {
  var form = $(ele).parent().parent();
  var label = $(form).find("location_field_label");
  var select = $(form).find("location_field_select");
  var input = $(form).find("location_field_input");
  
  switch (ele.value) {
    case "query_addr":
      label.text("Address: ");
      select.find("option").remove();
      select.append($("<input></input>")
        .attr("value", "")
        .text("Enter your address"));
      break;
    case "query_latlng":
      label.text("Coordinates: ");
      select.find("option").remove();
      select.append($("<input></input>")
        .attr("value", "")
        .text("Latitude..."));
      select.append($("<input></input>")
        .attr("value", "")
        .text("Longitude..."));
      break;
    case "query_state":
      label.text("State: ");
      select.find("option").remove();
      select.append($("<option></option>")
        .attr("value", "")
        .text("Choose a State"));
      selectValues = ["AL", "AK", "AL", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", 
                      "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", 
                      "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", 
                      "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", 
                      "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];
      $.each(selectValues, function(index, value) {
        select.append($("<option></option>")
          .attr("value", value)
          .text(value));
      });
      break;
    case "query_currloc":
    default:
      $(form).find(".location_field_div").css("visibility", "hidden");
      return;
  }
  $(form).find(".location_field_div").css("visibility", "visible");
}


function queryProtectedAreas(event) {
    
}
*/

// Query function
function queryReport(event) {
  event.preventDefault(); // Stop form from submitting normally
  
  var a = $("#query_report_form").serializeArray();
  a.push({ name: "tab_id", value: "1" });
  a.push({name: "longitude", value: locMarker.getPosition().lng()});
  a.push({name: "latitude", value: locMarker.getPosition().lat()});
  a = a.filter(function(item){return item.value != '';});
  $.ajax({
    url: 'HttpServlet',
    type: 'POST',
    data: a,
    success: function(reports) {
        mapInitialization(reports);
    },
    error: function(xhr, status, error) {
        alert("Status: " + status + "\Error: " + error);
    }
  });
}

$("#query_report_form").on("submit", queryReport);

function createReport(event){
	event.preventDefault();// // stop form from submitting normally
	//create variable and assign as a serialized array
	var a = $("#create_report_form").serializeArray();
	a.push({name: "tab_id", value: "0"});//push the items to make sure create a report is ran in the servlett
	// push to a the long and lat of the location selected by user
	  a.push({name: "longitude", value: locMarker.getPosition().lng()});
	  a.push({name: "latitude", value: locMarker.getPosition().lat()});
	a = a.filter(function(item){return item.value !='';}); //filter out items that do not have values
	$.ajax({//ajax command to get data together
		url: 'HttpServlet',
		type: 'POST',
		data: a,
		success: function (reports){
			alert("The Report is successfully submitted!");
			//mapInitialiazion(reports); 
			//reset the form
			resetForm();
			
		},
		error: function(xhr, status, error){
			alert("Status: " + status+"\nError: "+error);
		}
	});
}

$("#create_report_form").on("submit",createReport);