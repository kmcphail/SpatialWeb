package cranefinder.servlet;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import cranefinder.servlet.DBUtility;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
* Servlet implementation class HttpServlet
*/
@WebServlet("/HttpServlet")
public class HttpServlet extends javax.servlet.http.HttpServlet {
	private static final long serialVersionUID = 1L;
      
   /**
    * @see javax.servlet.http.HttpServlet#javax.servlet.http.HttpServlet()
    */
   public HttpServlet() {
       super();
       // TODO Auto-generated constructor stub
   }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		
		String tab_id = request.getParameter("tab_id");
		
		// create a report
		if (tab_id.equals("0")) {
			System.out.println("A report is submitted!");
			try {
				createReport(request, response);
			} catch (SQLException e) {
				e.printStackTrace();
			}
		} 
		
		// query reports
		else if (tab_id.equals("1")) {
			System.out.println("A report is queried!");
			try {
				queryReport(request, response);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	
	private void createReport(HttpServletRequest request, HttpServletResponse 
			response) throws SQLException, IOException {
		DBUtility dbutil = new DBUtility();		
		String sql;
		System.out.println("Getting a Story Submission");
		//create your Story
				int user_id = 0;
				String fname = request.getParameter("fname");
				String lname = request.getParameter("lname");
				String email = request.getParameter("email");
				String month = request.getParameter("omonth");
				String year = request.getParameter("oyear");
				String story = request.getParameter("story");
				String species = request.getParameter("species");
				String lon = request.getParameter("longitude");
				String lat = request.getParameter("latitude");
				System.out.println(lon+", "+lat);
				String shareable = request.getParameter("shareable");
				String addtolist = request.getParameter("addtolist");
				//need to add getter for sharable and add to list
				if (fname != null) {fname = "'" + fname + "'";}
				if (lname != null) {lname = "'" + lname + "'";}
				if (email != null) {email = "'" + email + "'";}
				if (month != null) {month = "'"+ month+"'";}
				if (year != null) {year = "'" + year + "'";}
				if (story != null) {story = "'" + story + "'";}
				if (species !=null){species="'" + species+"'";}
				//shareable and addtolist are checkboxes. 
				//Unchecked values return null and checked returns not null
				if (shareable !=null) { shareable="'yes'";}else {shareable="'no'";}
				if (addtolist !=null) { addtolist="'yes'";}else {addtolist="'no'";}
				
				//Set the query for insert
				sql = "insert into public.vol_stories(fname, lname, email, omonth, oyear, story," +
						" shareable, addtolist, species, geom) values (" + fname + "," + lname + "," 
						+ email+"," +month+ ","+year+","+story+","+shareable+","+addtolist+","+species+
						", ST_GeomFromText('POINT(" + lon + " " + lat + ")', 4326))";
				
				// Print the sql statement to the console for debugging
				//System.out.println(sql);
			
				dbutil.modifyDB(sql);
			
				System.out.println("Success! story created.");
	
	// response that the report submission is successful
			JSONObject data = new JSONObject();
			try {
				data.put("status", "success");
			} catch (JSONException e) {
				e.printStackTrace();
			}	
			response.getWriter().write(data.toString());
			
		}

	private void queryReport(HttpServletRequest request, HttpServletResponse 
			response) throws JSONException, SQLException, IOException {
		JSONArray list = new JSONArray();
		String sql;
		DBUtility dbutil = new DBUtility();

		//Getter for species - return either 'SACR' or 'WHCR'
		String species = request.getParameter("species");
		//String species = "WHCR"; //FOR TESTING
		
		//Getter for month - return integer month as string
		String month = request.getParameter("month");
		
		//Getter for How many locations to return - number
		String myCount = request.getParameter("myCount");
		//String myCount = "25";
		
		//Getter for Lat & Long
		//NEED TO BUILD
		String longitude = request.getParameter("longitude");
		String latitude = request.getParameter("latitude");
		//String longitude = "-100"; //FOR TESTING
		//String latitude = "40"; //FOR TESTING
		
		// request report sql statement
		sql = "select month, species, max_observed, avg_reports, d_des_tp,loc_nm, unit_nm, state_nm," + 
					"st_X(ST_CENTROID(geom)) as longitude, st_y(ST_CENTROID(geom)) as latitude "+ 
					"from public.rpt_cranes_in_pa where species = '"+ species + "' and month = "+ month +
					" ORDER BY geom <-> st_setsrid(st_makepoint("+longitude+","+latitude+"), 4326) LIMIT "+ myCount;
		
		// Print the sql statement to the console for debugging
		//System.out.println(sql);
		
		ResultSet res = dbutil.queryDB(sql);
		//Create the HashMap with the returned values to display.
		while (res.next()) {
			HashMap<String, String> m = new HashMap<String,String>();
			m.put("month", res.getString("month"));
			m.put("species", res.getString("species"));			
			m.put("max_observed", res.getString("max_observed"));
			m.put("avg_reports", res.getString("avg_reports"));
			m.put("d_des_tp", res.getString("d_des_tp"));
			m.put("loc_nm", res.getString("loc_nm"));
			m.put("unit_nm", res.getString("unit_nm"));
			m.put("state_nm", res.getString("state_nm"));
			m.put("latitude", res.getString("latitude"));
			m.put("longitude", res.getString("longitude"));
			list.put(m);
		}

	response.getWriter().write(list.toString());
	}


	public void main() throws JSONException {
	}

}
