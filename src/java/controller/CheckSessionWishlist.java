/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.User;
import hibernate.Wishlist;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Dini
 */
@WebServlet(name = "CheckSessionWishlist", urlPatterns = {"/CheckSessionWishlist"})
public class CheckSessionWishlist extends HttpServlet {


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
     User user = (User) request.getSession().getAttribute("user");

        if (user != null) {
            ArrayList<Wishlist> sessionWishs = (ArrayList<Wishlist>) request.getSession().getAttribute("sessionWish");

            if (sessionWishs != null && !sessionWishs.isEmpty()) {
                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session session = sf.openSession();
                Transaction tr = session.beginTransaction();

                for (Wishlist sessionWish : sessionWishs) {
                    Product product = (Product) session.get(Product.class, sessionWish.getProduct().getId());

                    // Create a fresh criteria inside the loop to avoid stacking restrictions
                    Criteria criteria = session.createCriteria(Wishlist.class);
                    criteria.add(Restrictions.eq("user", user));
                    criteria.add(Restrictions.eq("product", product));

                    boolean alreadyExists = !criteria.list().isEmpty();

                    if (!alreadyExists) {
                        sessionWish.setUser(user);
                        sessionWish.setProduct(product); // make sure product is attached
                        session.save(sessionWish);
                    }
                }

                tr.commit();
                session.close();

                // Clear session wishlist after saving
                request.getSession().setAttribute("sessionWish", null);
            }
        }
    }
}