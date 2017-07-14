import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class JDBCDemo_Cranes {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		Connection conn;
		Statement stmt;
		try {
			// Load JDBC driver
			Class.forName("org.postgresql.Driver");
			
			// Establish connection
			String url = "jdbc:postgresql://52.173.88.140:5432/geog574project";
			conn = DriverManager.getConnection(url, "geog576_ro", "Y%tezcNnjb!6Gzz4");
			
			// Query database
			/*
			String sql = "SELECT name " + 
						 "FROM census.state " +
						 "ORDER BY name";
			*/
			
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

			stmt = conn.createStatement();
			ResultSet res = stmt.executeQuery(sql);
			
			// Print result
			if (res != null) {
				while (res.next()) {
					System.out.println("Protected area: " + res.getString("protected_area"));
					System.out.println("Access type: " + res.getString("access_type"));
				}
			}
			
			// Close out
			stmt.close();
			conn.close();
		}
		catch (Exception e) {
			e.printStackTrace();
		}

	}

}
