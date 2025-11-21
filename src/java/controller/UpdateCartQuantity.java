/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import hibernate.Cart;
import hibernate.HibernateUtil;
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
@WebServlet(name = "UpdateCartQuantity", urlPatterns = {"/UpdateCartQuantity"})
public class UpdateCartQuantity extends HttpServlet {

 
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
            try {
            int cartId = Integer.parseInt(request.getParameter("cartId"));
            int qty = Integer.parseInt(request.getParameter("qty"));

            if (qty < 1) {
                response.getWriter().write("error");
                return;
            }

            Session session = HibernateUtil.getSessionFactory().openSession();
            Transaction tx = session.beginTransaction();

            Cart cart = (Cart) session.get(Cart.class, cartId);

            if (cart != null) {
                cart.setQty(qty);
                session.update(cart);
                tx.commit();
                response.getWriter().write("success");
            } else {
                response.getWriter().write("error");
            }

            session.close();

        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().write("error");
        }
    }
}
   