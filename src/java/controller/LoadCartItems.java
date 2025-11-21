package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.User;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import org.hibernate.*;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadCartItems", urlPatterns = {"/LoadCartItems"})
public class LoadCartItems extends HttpServlet {

  
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
      
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        User user = (User) request.getSession().getAttribute("user");

        if (user == null) {
            // Not logged in, send 401 Unauthorized
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            responseObject.addProperty("status", false);
            responseObject.addProperty("message", "Unauthorized: Please log in first.");
            response.getWriter().write(gson.toJson(responseObject));
            return;
        }

        try {
                Session session = HibernateUtil.getSessionFactory().openSession();
            Criteria criteria = session.createCriteria(Cart.class);
            criteria.add(Restrictions.eq("user", user));
            List<Cart> cartList = criteria.list();

            if (cartList != null && !cartList.isEmpty()) {
                for (Cart cart : cartList) {
                    cart.setUser(null);
                }
                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "Cart loaded successfully.");
                responseObject.add("cartList", gson.toJsonTree(cartList));
            } else {
                responseObject.addProperty("status", false);
                responseObject.addProperty("message", "Your cart is empty.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            responseObject.addProperty("status", false);
            responseObject.addProperty("message", "Server error: " + e.getMessage());
        }

        response.getWriter().write(gson.toJson(responseObject));
    }
}