package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.OrderItems;
import hibernate.Orders;
import hibernate.User;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadUserOrderItem", urlPatterns = {"/LoadUserOrderItem"})
public class LoadUserOrderItem extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        JsonObject responseObject = new JsonObject();
        response.setContentType("application/json");
        Gson gson = new Gson();

        HttpSession httpSession = request.getSession(false);
        if (httpSession == null || httpSession.getAttribute("user") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            responseObject.addProperty("status", false);
            responseObject.addProperty("message", "User not logged in");
            response.getWriter().write(gson.toJson(responseObject));
            return;
        }

        User user = (User) httpSession.getAttribute("user");

        try {
            Session hibSession = HibernateUtil.getSessionFactory().openSession();

            // Step 1: Get all Orders of this user
            Criteria orderCriteria = hibSession.createCriteria(Orders.class);
            orderCriteria.add(Restrictions.eq("user", user));
            List<Orders> userOrders = orderCriteria.list();

            if (userOrders.isEmpty()) {
                responseObject.addProperty("status", true);
    responseObject.add("orderList", gson.toJsonTree(new java.util.ArrayList<>()));
                response.getWriter().write(gson.toJson(responseObject));
                return;
            }

            // Step 2: Get OrderItems where orders in user's order list
            Criteria orderItemsCriteria = hibSession.createCriteria(OrderItems.class);
            orderItemsCriteria.add(Restrictions.in("orders", userOrders));
            List<OrderItems> orderList = orderItemsCriteria.list();

            responseObject.addProperty("status", true);
            responseObject.add("orderList", gson.toJsonTree(orderList));
            response.getWriter().write(gson.toJson(responseObject));

        } catch (Exception e) {
            responseObject.addProperty("status", false);
            responseObject.addProperty("message", "Error loading order items: " + e.getMessage());
            response.getWriter().write(gson.toJson(responseObject));
        }
    }
}
