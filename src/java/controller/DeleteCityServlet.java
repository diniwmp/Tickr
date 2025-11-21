/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Category;
import hibernate.City;
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

/**
 *
 * @author Dini
 */
@WebServlet(name = "DeleteCityServlet", urlPatterns = {"/DeleteCityServlet"})
public class DeleteCityServlet extends HttpServlet {

   
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String catIdStr = request.getParameter("catId");

        JsonObject json = new JsonObject();

        if (catIdStr == null || catIdStr.isEmpty()) {
            json.addProperty("status", false);
            json.addProperty("message", "City ID must be provided.");
            return;
        } else {

            Session session = HibernateUtil.getSessionFactory().openSession();
            int catId = Integer.parseInt(catIdStr);

            City cat = (City) session.get(City.class, catId);
            if (cat == null) {
                json.addProperty("status", false);
                json.addProperty("message", "City not found.");
                return;
            }

            Transaction tx = session.beginTransaction();
            session.delete(cat);
            tx.commit();

            json.addProperty("status", true);
            json.addProperty("message", "City deleted successfully.");
        }
        Gson gson = new Gson();
        String toJson = gson.toJson(json);
        response.setContentType("application/json");
        response.getWriter().write(toJson);

    }
}
