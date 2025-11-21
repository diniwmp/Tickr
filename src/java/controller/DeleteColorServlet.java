/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
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
import org.hibernate.Transaction;


@WebServlet(name = "DeleteColorServlet", urlPatterns = {"/DeleteColorServlet"})
public class DeleteColorServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String catIdStr = request.getParameter("catId");

        JsonObject json = new JsonObject();

        if (catIdStr == null || catIdStr.isEmpty()) {
            json.addProperty("status", false);
            json.addProperty("message", "Color ID must be provided.");
            return;

        } else {

            Session session = HibernateUtil.getSessionFactory().openSession();
            int catId = Integer.parseInt(catIdStr);

            Color color = (Color) session.get(Color.class, catId);
            if (color == null) {
                json.addProperty("status", false);
                json.addProperty("message", "Color not found.");
                return;
            }

            Transaction tx = session.beginTransaction();
            session.delete(color);
            tx.commit();

            json.addProperty("status", true);
            json.addProperty("message", "Color deleted successfully.");
        }
        Gson gson = new Gson();
        String toJson = gson.toJson(json);
        response.setContentType("application/json");
        response.getWriter().write(toJson);

    }
}
