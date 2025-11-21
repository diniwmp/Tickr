/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.HibernateUtil;
import hibernate.Model;
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
@WebServlet(name = "AddModel", urlPatterns = {"/AddModel"})
public class AddModel extends HttpServlet {


  @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String modelName = request.getParameter("modelName");
        String brandIdStr = request.getParameter("brandId");

        JsonObject responseObj = new JsonObject();
        response.setContentType("application/json");

        if (modelName == null || brandIdStr == null || modelName.isEmpty() || brandIdStr.isEmpty()) {
            responseObj.addProperty("status", false);
            responseObj.addProperty("message", "Missing model name or brand.");
            response.getWriter().write(responseObj.toString());
            return;
        }

        try {
            int brandId = Integer.parseInt(brandIdStr);

            Session session = HibernateUtil.getSessionFactory().openSession();
            Transaction tx = session.beginTransaction();

            Brand brand = (Brand) session.get(Brand.class, brandId);
            if (brand == null) {
                responseObj.addProperty("status", false);
                responseObj.addProperty("message", "Brand not found.");
                response.getWriter().write(responseObj.toString());
                session.close();
                return;
            }

            Model model = new Model();
            model.setName(modelName);
            model.setBrand(brand);

            session.save(model);
            tx.commit();
            session.close();

            responseObj.addProperty("status", true);
            responseObj.addProperty("message", "Model added successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            responseObj.addProperty("status", false);
            responseObj.addProperty("message", "Error occurred while saving model.");
        }

        response.getWriter().write(responseObj.toString());
    }
}