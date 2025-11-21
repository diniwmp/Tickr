/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Admin;
import hibernate.HibernateUtil;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Malindu
 */
@WebServlet(name = "AdminSignIn", urlPatterns = {"/AdminSignIn"})
public class AdminSignIn extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject jsonRequest = gson.fromJson(req.getReader(), JsonObject.class);

        JsonObject jsonResponse = new JsonObject();
        jsonResponse.addProperty("success", false); // default false

        String email = jsonRequest.get("adminemail").getAsString();
        String password = jsonRequest.get("adminpassword").getAsString();

        if (email == null || email.isEmpty()) {
            jsonResponse.addProperty("message", "Email cannot be empty!");
        } else if (password == null || password.isEmpty()) {
            jsonResponse.addProperty("message", "Password cannot be empty!");
        } else {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();

            Criteria c = s.createCriteria(Admin.class);
            c.add(Restrictions.eq("email", email));
            c.add(Restrictions.eq("password", password));

            Admin admin = (Admin) c.uniqueResult();

            if (admin == null) {
                jsonResponse.addProperty("message", "Invalid credentials!");

            } else {
                // success
                HttpSession session = req.getSession();
                session.setAttribute("admin", admin);

                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Login successful. Redirecting...");
            }

            s.close();
        }
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(jsonResponse));

    }

}