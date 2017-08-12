import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DBUtility {
	private static final String Driver = "org.postgresql.Driver";
	private static final String ConnUrl = "jdbc:postgresql://52.173.88.140:5432/disastermngt";
	private static final String Username = "geog576_ro";
	private static final String Password = "Y%tezcNnjb!6Gzz4";

	String sql = "WITH local_sp AS ( SELECT eb.geom FROM ebd_cranes.ebird AS eb " +
						 "JOIN census.county AS cn ON ST_INTERSECTS(eb.geom, cn.geom) " +
						 "WHERE cn.name = 'Dane' AND cn.state = 'WI' AND " +
						 	"eb.common_name = 'Sandhill Crane') " +
						 "SELECT up.unit_nm AS protected_area, ac.d_access AS access_type " +
						 "FROM usgs_pad.area AS up " +
						 "JOIN local_sp ON ST_INTERSECTS(local_sp.geom, up.geom) " +
						 "JOIN usgs_pad.access AS ac ON up.access=ac.access " +
						 "WHERE up.access NOT IN ('UK','XA') " +
						 "GROUP BY up.unit_nm, ac.d_access " +
						 "ORDER BY ac.d_access, up.unit_nm";
	
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
			System.out.println(res.getString("protected_area"));
		}
		
		
	}

}
