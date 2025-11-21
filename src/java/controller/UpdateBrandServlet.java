/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
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

/**
 *
 * @author Dini
 */
@WebServlet(name = "UpdateBrandServlet", urlPatterns = {"/UpdateBrandServlet"})
public class UpdateBrandServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String brandIdStr = request.getParameter("brandId");
        String brandName = request.getParameter("brandName");

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (brandIdStr == null || brandIdStr.isEmpty() || brandName == null || brandName.trim().isEmpty()) {
            responseObject.addProperty("message", "Brand ID and name must be provided.");
            return;
        } else {

            Session session = HibernateUtil.getSessionFactory().openSession();
            int brandId = Integer.parseInt(brandIdStr);

            Brand brand = (Brand) session.get(Brand.class, brandId);
            if (brand == null) {
                responseObject.addProperty("status", false);
                responseObject.addProperty("message", "Brand not found.");
                return;
            }

            Transaction tx = session.beginTransaction();
            brand.setName(brandName.trim());
            session.update(brand);
            tx.commit();

            responseObject.addProperty("status", true);
            responseObject.addProperty("message", "Brand updated successfully.");
        }

        Gson gson = new Gson();
        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);

    }
}
