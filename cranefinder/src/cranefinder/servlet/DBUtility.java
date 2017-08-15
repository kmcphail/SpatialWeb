package cranefinder.servlet;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DBUtility {
	private static final String Driver = "org.postgresql.Driver";
	private static final String ConnUrl = "jdbc:postgresql://52.173.88.140:5432/geog574project";
	private static final String Username = "geog576_ro";
	private static final String Password = "Y%tezcNnjb!6Gzz4";
	/**
	//temp sql statment, sql statment will reside in servlet(backend)
	static String sql = "SELECT *, ST_AsGeoJson(geom) as geojason FROM public.rpt_cranes_in_pa WHERE species ='SACR'" + 
		"and month=8 ORDER BY geom <-> st_setsrid(st_makepoint(-90,45),4326) LIMIT 10";
	**/
	// This is a constructor
	public DBUtility() {
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

	/**
	 * @param args
	 * @throws SQLException 
	 */
	public static void main(String[] args) throws SQLException {
		// You can test the methods you created here
		DBUtility util = new DBUtility();
		
		
		//1. query the database
		ResultSet res = util.queryDB(sql);
		while (res.next()) {
			System.out.println(res.getString("unit_nm"));
		}
		
		
	}

}