package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
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

@WebServlet(name = "AddToCart", urlPatterns = {"/AddToCart"})
public class AddToCart extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        System.out.println("cart");

      String prId = request.getParameter("prId");
        String qty = request.getParameter("qty");

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        // Validate product id and quantity
        if (!Util.isInteger(prId)) {
            responseObject.addProperty("message", "Invalid product ID!");
        } else if (!Util.isInteger(qty)) {
            responseObject.addProperty("message", "Invalid quantity!");
        } else {
            HttpSession session = request.getSession(false);
            User user = (session != null) ? (User) session.getAttribute("user") : null;

            if (user == null) {
                // User not logged in - disallow adding to cart
                responseObject.addProperty("message", "Please log in to add products to the cart.");
            } else {
                // User is logged in - proceed to add to DB cart
                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session hibSession = sf.openSession();
                Transaction tr = null;

                try {
                    Product product = (Product) hibSession.get(Product.class, Integer.valueOf(prId));
                    if (product == null) {
                        responseObject.addProperty("message", "Product not found.");
                    } else {
                        tr = hibSession.beginTransaction();

                        // Reload managed user and product
                        User managedUser = (User) hibSession.get(User.class, user.getId());
                        Product managedProduct = (Product) hibSession.get(Product.class, product.getId());

                        Criteria c1 = hibSession.createCriteria(Cart.class);
                        c1.add(Restrictions.eq("user", managedUser));
                        c1.add(Restrictions.eq("product", managedProduct));

                        Cart cartItem = (Cart) c1.uniqueResult();

                        int qtyInt = Integer.parseInt(qty);

                        if (cartItem == null) {
                            // Add new cart item
                            if (qtyInt <= product.getQty()) {
                                Cart cart = new Cart();
                                cart.setUser(managedUser);
                                cart.setProduct(managedProduct);
                                cart.setQty(qtyInt);

                                hibSession.save(cart);
                                tr.commit();
                                responseObject.addProperty("status", true);
                                responseObject.addProperty("message", "Product added to cart successfully.");
                            } else {
                                responseObject.addProperty("message", "Insufficient product quantity.");
                            }
                        } else {
                            // Update existing cart quantity
                            int newQty = cartItem.getQty() + qtyInt;
                            if (newQty <= product.getQty()) {
                                cartItem.setQty(newQty);
                                hibSession.update(cartItem);
                                tr.commit();
                                responseObject.addProperty("status", true);
                                responseObject.addProperty("message", "Cart updated successfully.");
                            } else {
                                responseObject.addProperty("message", "Insufficient product quantity.");
                            }
                        }
                    }
                } catch (Exception e) {
                    if (tr != null && tr.isActive()) tr.rollback();
                    e.printStackTrace();
                    responseObject.addProperty("message", "Server error occurred.");
                } finally {
                    if (hibSession.isOpen()) hibSession.close();
                }
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
    }
}