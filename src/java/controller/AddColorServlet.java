
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Category;
import hibernate.Color;
import hibernate.HibernateUtil;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

/**
 *
 * @author Dini
 */
@WebServlet(name = "AddColorServlet", urlPatterns = {"/AddColorServlet"})
public class AddColorServlet extends HttpServlet {

     @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String catName = request.getParameter("catName");

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (catName == null || catName.trim().isEmpty()) {
            responseObject.addProperty("message", "Color name cannot be empty.");
        } else {

            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();
            Transaction tx = s.beginTransaction();
            Color color = new Color();
            color.setValue(catName.trim());
            s.save(color);
            tx.commit();

            responseObject.addProperty("status", true);
            responseObject.addProperty("message", "Color added successfully.");

        }

        Gson gson = new Gson();
        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);

    }
}
