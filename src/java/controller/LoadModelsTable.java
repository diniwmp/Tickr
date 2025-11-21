/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Model;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

/**
 *
 * @author Dini
 */
@WebServlet(name = "LoadModelsTable", urlPatterns = {"/LoadModelsTable"})
public class LoadModelsTable extends HttpServlet {

  
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {



        JsonObject responseObj = new JsonObject();
        responseObj.addProperty("status", false);

        
                SessionFactory sf = HibernateUtil.getSessionFactory();
             Session s = sf.openSession();

            Criteria c = s.createCriteria(Model.class);
            List<Model> modelList = c.list();

            JsonArray modelArray = new JsonArray();

            for (Model model : modelList) {
                JsonObject modelJson = new JsonObject();
                modelJson.addProperty("id", model.getId());
                modelJson.addProperty("modelName", model.getName());
                modelJson.addProperty("brandName", model.getBrand().getName());

                modelArray.add(modelJson);
            }

            responseObj.addProperty("status", true);
            responseObj.add("models", modelArray);

       

        response.setContentType("application/json");
        response.getWriter().write(new Gson().toJson(responseObj));
    }
}