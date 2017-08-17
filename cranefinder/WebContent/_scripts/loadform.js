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



// Hidden field selector for location query type 

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

function submitQry(event) {
  event.preventDefault(); // Stop form from submitting normally
	
  var a = $("#qry_form").serializeArray();
  a.push({ name: "tab_id", value: "1" });
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

$("#qry_form").on("submit", submitQry);
$("#obs_form").on("submit", submitObs);