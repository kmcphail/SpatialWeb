package cranefinder.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cranefinder.servlet.DBUtility;


/**
 * Servlet implementation class DBUtility
 */
@WebServlet("/DBUtility")
public class DBUtility extends HttpServlet {
	private static final String Driver = "org.postgresql.Driver";
	private static final String ConnUrl = "jdbc:postgresql://52.173.88.140:5432/geog574project";
	private static final String Username = "geog576_ro";
	private static final String Password = "Y%tezcNnjb!6Gzz4";

	private static final long serialVersionUID = 1L;

    public DBUtility() {
        super();
        // TODO Auto-generated constructor stub
    }
    
// create a Connection to the database
    private Connection connectDB() {
    	Connection conn = null;
 		try {
 			Class.forName(Driver);
 			conn = DriverManager.getConnection(ConnUrl, Username, Password);
 			return conn;
 		} catch (Exception e) {
 			e.printStackTrace();
 		}
 		return conn;
 	}
 	
// execute a sql query (e.g. SELECT) and return a ResultSet
 	public ResultSet queryDB(String sql) {
 		Connection conn = connectDB();
 		ResultSet res = null;
 		try {
 			if (conn != null) {
 				Statement stmt = conn.createStatement();
 				res = stmt.executeQuery(sql);
 				conn.close();
 			}
 		} catch (Exception e) {
 			e.printStackTrace();
 		}
 		return res;
 	}
 	
 	// execute a sql query (e.g. INSERT) to modify the database; 
 	// no return value needed
 	public void modifyDB(String sql) {
 		Connection conn = connectDB();
 		try {
 			if (conn != null) {
 				Statement stmt = conn.createStatement();
 				stmt.execute(sql);
 				stmt.close();
 				conn.close();
 			}
 		} catch (Exception e) {
 			e.printStackTrace();
 		}
 	}
	
	public static void main(String[] args) throws SQLException {
		
		String sql = "select month, species, max_observed, avg_reports, d_des_tp,loc_nm, unit_nm, state_nm, "+
				"st_X(ST_CENTROID(geom)) as longitude, st_y(ST_CENTROID(geom)) as latitude from public.rpt_cranes_in_pa "+ 
				"Where species = 'WHCR' and Month = 3Order by geom <-> st_setsrid(st_makepoint(-90,45),4326) LIMIT 10";

		// You can test the methods you created here
		DBUtility util = new DBUtility();
		
		
		//1. query the database
		ResultSet res = util.queryDB(sql);
		while (res.next()) {
			System.out.println(res.getString("longitude"));
		}
	}
}
