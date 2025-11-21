/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Address;
import hibernate.City;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Dini
 */
@WebServlet(name = "SaveUserChanges", urlPatterns = {"/SaveUserChanges"})
public class SaveUserChanges extends HttpServlet {

    /**
     *
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject userData = gson.fromJson(request.getReader(), JsonObject.class);

        String firstName = userData.get("firstName").getAsString();
        String lastName = userData.get("lastName").getAsString();
        String email = userData.get("email").getAsString();
        String phone = userData.get("phone").getAsString();
        String lineOne = userData.get("lineOne").getAsString();
        String lineTwo = userData.get("lineTwo").getAsString();
        String postalCode = userData.get("postalCode").getAsString();
        int cityId = userData.get("cityId").getAsInt();
        String currentPassword = userData.get("currentPassword").getAsString();
        String newPassword = userData.get("newPassword").getAsString();
        String confirmPassword = userData.get("confirmPassword").getAsString();

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        // Validation
        if (firstName.isEmpty()) {
            responseObject.addProperty("message", "First Name cannot be empty!");
        } else if (lastName.isEmpty()) {
            responseObject.addProperty("message", "Last Name cannot be empty!");
        } else if (email.isEmpty()) {
            responseObject.addProperty("message", "Email cannot be empty!");
        } else if (!Util.isEmailValid(email)) {
            responseObject.addProperty("message", "Please enter a valid email!");
        } else if (phone.isEmpty()) {
            responseObject.addProperty("message", "Mobile Number cannot be empty!");
        } else if (!Util.isMobileValid(phone)) {
            responseObject.addProperty("message", "Please enter a valid Mobile Number!");
        } else if (lineOne.isEmpty()) {
            responseObject.addProperty("message", "Line One cannot be empty!");
        } else if (lineTwo.isEmpty()) {
            responseObject.addProperty("message", "Line Two cannot be empty!");
        } else if (postalCode.isEmpty()) {
            responseObject.addProperty("message", "Postal Code cannot be empty!");
        } else if (!Util.isCodeValid(postalCode)) {
            responseObject.addProperty("message", "Postal Code must be 4–5 digits.");
        } else if (cityId == 0) {
            responseObject.addProperty("message", "Select a valid city.");
        } else if (currentPassword.isEmpty()) {
            responseObject.addProperty("message", "Enter your current password.");
        } else if (!newPassword.isEmpty() && Util.isPasswordValid(newPassword)) {
            responseObject.addProperty("message", "New password must contain a-A * 123.");
        } else if (!newPassword.isEmpty() && newPassword.equals(currentPassword)) {
            responseObject.addProperty("message", "New password cannot match current password.");
        } else if (!confirmPassword.equals(newPassword)) {
            responseObject.addProperty("message", "Confirm password does not match new password.");
        } else {

            HttpSession ses = request.getSession();
            User sessionUser = (User) ses.getAttribute("user");

            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session hibSession = sf.openSession();
            org.hibernate.Transaction tx = hibSession.beginTransaction();

            User dbUser = (User) hibSession.get(User.class, sessionUser.getId());

            if (dbUser != null && dbUser.getPassword().equals(currentPassword)) {

                // Update user
                dbUser.setFirst_name(firstName);
                dbUser.setLast_name(lastName);
                dbUser.setEmail(email);
                dbUser.setMobile(phone);

                if (!newPassword.isEmpty()) {
                    dbUser.setPassword(newPassword);
                }

                // Update or create address
                Criteria ac = hibSession.createCriteria(Address.class);
                ac.add(Restrictions.eq("user", dbUser));
                Address address;

                if (!ac.list().isEmpty()) {
                    address = (Address) ac.list().get(0);
                } else {
                    address = new Address();
                    address.setUser(dbUser);
                }

                City city = (City) hibSession.get(City.class, cityId);
                address.setLineOne(lineOne);
                address.setLineTwo(lineTwo);
                address.setPostalCode(postalCode);
                address.setCity(city);

                // Save changes
                hibSession.update(dbUser);
                hibSession.saveOrUpdate(address);

                tx.commit();
                hibSession.close();

                // Update session user
                ses.setAttribute("user", dbUser);

                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "User profile details updated successfully.");
            } else {
                responseObject.addProperty("message", "Invalid current password.");
            }
        }

        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);
    }
}
