package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.User;
import hibernate.Wishlist;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Dini
 */
@WebServlet(name = "LoadWishlistItems", urlPatterns = {"/LoadWishlistItems"})
public class LoadWishlistItems extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

       response.setContentType("application/json");
        Gson gson = new Gson();
        JsonObject json = new JsonObject();

        User user = (User) request.getSession().getAttribute("user");

        if (user == null) {
            // User not logged in - 401 Unauthorized
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            json.addProperty("status", false);
            json.addProperty("message", "User not logged in");
//            response.getWriter().write(gson.toJson(json));
            return;
        }else{

        Session session = HibernateUtil.getSessionFactory().openSession();
        List<Wishlist> wishList = null;

        try {
            Criteria criteria = session.createCriteria(Wishlist.class);
            criteria.add(Restrictions.eq("user", user));
            wishList = criteria.list();

            // Initialize product info (to avoid lazy loading issues)
            for (Wishlist wish : wishList) {
                if (wish.getProduct() != null) {
                    wish.getProduct().getTitle();
                }
                wish.setUser(null); // avoid cyclic JSON references
            }

            if (wishList.isEmpty()) {
                json.addProperty("status", false);
                json.addProperty("message", "Your wishlist is empty");
            } else {
                json.addProperty("status", true);
                json.addProperty("message", "Wishlist loaded successfully");
                json.add("wishItems", gson.toJsonTree(wishList));
            }

        } catch (Exception e) {
            e.printStackTrace();
            json.addProperty("status", false);
            json.addProperty("message", "Error loading wishlist");
        } finally {
            session.close();
        }

        response.getWriter().write(gson.toJson(json));
    }
}}