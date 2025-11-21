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
@WebServlet(name = "UpdateCityServlet", urlPatterns = {"/UpdateCityServlet"})
public class UpdateCityServlet extends HttpServlet {

  @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String catIdStr = request.getParameter("catId");
        String catName = request.getParameter("catName");

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (catIdStr == null || catIdStr.isEmpty() || catName == null || catName.trim().isEmpty()) {
            responseObject.addProperty("message", "City ID and name must be provided.");
            return;
        } else {

            Session session = HibernateUtil.getSessionFactory().openSession();
            int catId = Integer.parseInt(catIdStr);

            City category = (City) session.get(City.class, catId);
            if (category == null) {
                responseObject.addProperty("status", false);
                responseObject.addProperty("message", "City not found.");
                return;
            }

            Transaction tx = session.beginTransaction();
            category.setName(catName.trim());
            session.update(category);
            tx.commit();

            responseObject.addProperty("status", true);
            responseObject.addProperty("message", "City updated successfully.");
        }

        Gson gson = new Gson();
        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);

    }
}
