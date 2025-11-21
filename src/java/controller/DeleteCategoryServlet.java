/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.Category;
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
@WebServlet(name = "DeleteCategoryServlet", urlPatterns = {"/DeleteCategoryServlet"})
public class DeleteCategoryServlet extends HttpServlet {

   
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String catIdStr = request.getParameter("catId");

        JsonObject json = new JsonObject();

        if (catIdStr == null || catIdStr.isEmpty()) {
            json.addProperty("status", false);
            json.addProperty("message", "Category ID must be provided.");
            return;
        } else {

            Session session = HibernateUtil.getSessionFactory().openSession();
            int catId = Integer.parseInt(catIdStr);

            Category cat = (Category) session.get(Category.class, catId);
            if (cat == null) {
                json.addProperty("status", false);
                json.addProperty("message", "Category not found.");
                return;
            }

            Transaction tx = session.beginTransaction();
            session.delete(cat);
            tx.commit();

            json.addProperty("status", true);
            json.addProperty("message", "Category deleted successfully.");
        }
        Gson gson = new Gson();
        String toJson = gson.toJson(json);
        response.setContentType("application/json");
        response.getWriter().write(toJson);

    }
}
