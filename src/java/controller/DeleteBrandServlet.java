
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.HibernateUtil;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Session;
import org.hibernate.Transaction;


@WebServlet(name = "DeleteBrandServlet", urlPatterns = {"/DeleteBrandServlet"})
public class DeleteBrandServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String brandIdStr = request.getParameter("brandId");

        JsonObject json = new JsonObject();

        if (brandIdStr == null || brandIdStr.isEmpty()) {
            json.addProperty("status", false);
            json.addProperty("message", "Brand ID must be provided.");
            return;
        } else {

            Session session = HibernateUtil.getSessionFactory().openSession();
            int brandId = Integer.parseInt(brandIdStr);

            Brand brand = (Brand) session.get(Brand.class, brandId);
            if (brand == null) {
                json.addProperty("status", false);
                json.addProperty("message", "Brand not found.");
                return;
            }

            Transaction tx = session.beginTransaction();
            session.delete(brand);
            tx.commit();

            json.addProperty("status", true);
            json.addProperty("message", "Brand deleted successfully.");
        }
        Gson gson = new Gson();
        String toJson = gson.toJson(json);
        response.setContentType("application/json");
        response.getWriter().write(toJson);

    }
}
