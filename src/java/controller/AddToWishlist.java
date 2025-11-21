package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.User;
import hibernate.Wishlist;
import java.io.IOException;
import java.util.ArrayList;
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
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "AddToWishlist", urlPatterns = {"/AddToWishlist"})
public class AddToWishlist extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

//       System.out.println("Wishlist servlet called");

        String prId = request.getParameter("prId");
        
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (prId == null || !prId.matches("\\d+")) {
            responseObject.addProperty("message", "Invalid or missing product ID!");
        } else {

            HttpSession session = request.getSession(false);
            User user = (session != null) ? (User) session.getAttribute("user") : null;

            if (user == null) {
                responseObject.addProperty("message", "Please log in to add products to wishlist.");
            } else {
                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session s = sf.openSession();
                Transaction tr = null;

                try {
                    Product product = (Product) s.get(Product.class, Integer.valueOf(prId));
                    if (product == null) {
                        responseObject.addProperty("message", "Product not found.");
                    } else {
                        tr = s.beginTransaction();

                        // Reload user and product in current session to get managed entities
                        User managedUser = (User) s.get(User.class, user.getId());
                        Product managedProduct = (Product) s.get(Product.class, product.getId());

                        Criteria c1 = s.createCriteria(Wishlist.class);
                        c1.add(Restrictions.eq("user", managedUser));
                        c1.add(Restrictions.eq("product", managedProduct));

                        if (c1.list().isEmpty()) {
                            Wishlist wishlist = new Wishlist();
                            wishlist.setUser(managedUser);
                            wishlist.setProduct(managedProduct);

                            s.save(wishlist);
                            s.flush();
                            tr.commit();

                            responseObject.addProperty("status", true);
                            responseObject.addProperty("message", "Product added to wishlist successfully.");
                        } else {
                            responseObject.addProperty("message", "Product already in wishlist.");
                            tr.rollback();
                        }
                    }
                } catch (Exception e) {
                    if (tr != null && tr.isActive()) tr.rollback();
                    e.printStackTrace();
                    responseObject.addProperty("message", "Server error occurred.");
                } finally {
                    if (s.isOpen()) s.close();
                }
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
    }
}