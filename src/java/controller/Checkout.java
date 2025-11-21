/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Address;
import hibernate.Cart;
import hibernate.City;
import hibernate.DeliveryType;
import hibernate.HibernateUtil;
import hibernate.OrderItems;
import hibernate.OrderStatus;
import hibernate.Orders;
import hibernate.Product;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.PayHere;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Dini
 */
@WebServlet(name = "Checkout", urlPatterns = {"/Checkout"})
public class Checkout extends HttpServlet {

    private static final int SELECTOR_DEFAULT_VALUE = 0;
    private static final int ORDER_PENDING = 5;
    private static final int WITHIN_COLOMBO = 1;
    private static final int OUT_OF_COLOMBO = 2;
    private static final int RATING_DEFAULT_VALUE = 0;

    /**
     *
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject reqJsonObject = gson.fromJson(request.getReader(), JsonObject.class);

        boolean isCurrentAddress = reqJsonObject.get("isCurrentAddress").getAsBoolean();
        String firstName = reqJsonObject.get("firstName").getAsString();
        String lastName = reqJsonObject.get("lastName").getAsString();
        String citySelect = reqJsonObject.get("citySelect").getAsString();
        String lineOne = reqJsonObject.get("lineOne").getAsString();
        String lineTwo = reqJsonObject.get("lineTwo").getAsString();
        String postalCode = reqJsonObject.get("postalCode").getAsString();
        String mobile = reqJsonObject.get("mobile").getAsString();
        String email = reqJsonObject.get("email").getAsString();

        Session s = HibernateUtil.getSessionFactory().openSession();
        Transaction tr = s.beginTransaction();

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        User user = (User) request.getSession().getAttribute("user");
        if (user == null) {
            responseObject.addProperty("message", "Session expired! Please log in again");
        } else {

            if (isCurrentAddress) {
                Criteria c1 = s.createCriteria(Address.class);
                c1.add(Restrictions.eq("user", user));

                c1.addOrder(Order.desc("id"));
                if (c1.list().isEmpty()) {
                    responseObject.addProperty("message", "Your current address is not found. Please add a new address ");
                } else {
                    Address address = (Address) c1.list().get(0);
                    // List<Address> addressList = c1.list();
                    processCheckout(s, tr, user, address, responseObject);
                }

            } else {

                if (firstName.isEmpty()) {
                    responseObject.addProperty("message", "First name is required");
                } else if (lastName.isEmpty()) {
                    responseObject.addProperty("message", "Last name is required");
                } else if (!Util.isInteger(citySelect)) {
                    responseObject.addProperty("message", "Invalid City");
                } else if (Integer.parseInt(citySelect) == Checkout.SELECTOR_DEFAULT_VALUE) {
                    responseObject.addProperty("message", "Invalid City");
                } else {
                    City city = (City) s.get(City.class, Integer.valueOf(citySelect));

                    if (city == null) {
                        responseObject.addProperty("message", "Invalid City name");
                    } else {

                        if (lineOne.isEmpty()) {
                            responseObject.addProperty("message", "Line one is required");
                        } else if (lineTwo.isEmpty()) {
                            responseObject.addProperty("message", "Line two is required");
                        } else if (postalCode.isEmpty()) {

                            responseObject.addProperty("message", "Postalcode is required");
                        } else if (!Util.isCodeValid(postalCode)) {
                            responseObject.addProperty("message", "Invalid Postalcode");
                        } else if (mobile.isEmpty()) {
                            responseObject.addProperty("message", "Mobile number is required");
                        } else if (!Util.isMobileValid(mobile)) {
                            responseObject.addProperty("message", "Invalid Mobile number");
                        } else if (email.isEmpty()) {
                            responseObject.addProperty("message", "Email is required");
                        } else if (!Util.isEmailValid(email)) {
                            responseObject.addProperty("message", "Invalid Email ");
                        } else {

                            // update user object
                            user.setFirst_name(firstName);
                            user.setLast_name(lastName);
                            user.setMobile(mobile);
                            user.setEmail(email);
                            s.update(user);

                            Address address = new Address();
                            address.setLineOne(lineOne);
                            address.setLineTwo(lineTwo);
                            address.setCity(city);
                            address.setPostalCode(postalCode);
                            address.setUser(user);

                            s.save(address);

                            processCheckout(s, tr, user, address, responseObject);

                        }
                    }

                }

            }

        }

        // responseObject.addProperty("status", true);
        response.setContentType("application/json");

        response.getWriter().write(gson.toJson(responseObject));

    }

    private void processCheckout(Session s,
            Transaction tr,
            User user,
            Address address,
            JsonObject responseObject) {

        try {

            Orders orders = new Orders();
            orders.setAddress(address);
            orders.setCreated_at(new Date());
            orders.setUser(user);

            int orderId = (int) s.save(orders);

            Criteria c1 = s.createCriteria(Cart.class);
            c1.add(Restrictions.eq("user", user));
            List<Cart> cartList = c1.list();

            OrderStatus orderStatus = (OrderStatus) s.get(OrderStatus.class, Checkout.ORDER_PENDING);
            DeliveryType withinColombo = (DeliveryType) s.get(DeliveryType.class, Checkout.WITHIN_COLOMBO);
            DeliveryType outOfColombo = (DeliveryType) s.get(DeliveryType.class, Checkout.OUT_OF_COLOMBO);
//            double amount = 0;
            String items = "";
            double subtotal = 0;

            for (Cart cart : cartList) {

//                amount += cart.getQty() * cart.getProduct().getPrice();
                double productTotal = cart.getQty() * cart.getProduct().getPrice();
                subtotal += productTotal;

                OrderItems orderItems = new OrderItems();
                orderItems.setOrderStatus(orderStatus);
                orderItems.setOrders(orders);
                orderItems.setProduct(cart.getProduct());
                orderItems.setQty(cart.getQty());
                orderItems.setRating(RATING_DEFAULT_VALUE);
                orderItems.setAmount(productTotal); // store only product total

                if (address.getCity().getName().equalsIgnoreCase("Colombo")) {
                    orderItems.setDeliveryType(withinColombo);
                } else {
                    orderItems.setDeliveryType(outOfColombo);
                }

                s.save(orderItems);

                // update product qty
                Product product = cart.getProduct();
                product.setQty(product.getQty() - cart.getQty());
                s.update(product);

                // delete cart item
                s.delete(cart);

                items += cart.getProduct().getTitle() + " x " + cart.getQty() + ", ";
            }

// Determine shipping cost ONCE
            double shippingCost;
            if (address.getCity().getName().equalsIgnoreCase("Colombo")) {
                shippingCost = withinColombo.getPrice();
            } else {
                shippingCost = outOfColombo.getPrice();
            }

// Final amount for payment
            double finalAmount = subtotal + shippingCost;

            tr.commit();

            //payhere process
            String merchantID = "1224059";

            String merchantSecret = "MjY4ODkxMjgyMjEzMDU5MTUyNTkzMTg4NzI0NjYwMzc4NzUzNTExMA==";
            String orderID = "#000" + orderId;

            String currency = "LKR";

            String formattedAmount = new DecimalFormat("0.00").format(finalAmount);
            // String formattedAmount = String.format("%.2f", amount);

            String merchantSecretMD5 = PayHere.generateMD5(merchantSecret);
            String hash = PayHere.generateMD5(merchantID + orderID + formattedAmount + currency + merchantSecretMD5);

            JsonObject payHereJson = new JsonObject();

            payHereJson.addProperty("sandbox", true);
            payHereJson.addProperty("merchant_id", merchantID);

            payHereJson.addProperty("return_url", "");
            payHereJson.addProperty("cancel_url", "");
//              payHereJson.addProperty("notify_url", "https://f5049b396cfd.ngrok-free.app/Tickr/VerifyPayments");

            payHereJson.addProperty("notify_url", "http://localhost:8080/Tickr/VerifyPayments");

            payHereJson.addProperty("order_id", orderID);
            payHereJson.addProperty("items", items);
            payHereJson.addProperty("amount", formattedAmount);
            payHereJson.addProperty("currency", currency);
            payHereJson.addProperty("hash", hash);

            payHereJson.addProperty("first_name", user.getFirst_name());
            payHereJson.addProperty("last_name", user.getLast_name());
            payHereJson.addProperty("email", user.getEmail());

            payHereJson.addProperty("phone", user.getMobile());
            payHereJson.addProperty("address", address.getLineOne() + ", " + address.getLineTwo());
            payHereJson.addProperty("city", address.getCity().getName());
            payHereJson.addProperty("country", "Sri Lanka");

            responseObject.addProperty("status", true);
            responseObject.addProperty("message", "Checkout Complete");
            responseObject.add("payhereJson", new Gson().toJsonTree(payHereJson));

        } catch (Exception e) {

            tr.rollback();
            responseObject.addProperty("message", "An error occurred during checkout.");

        }

    }

}
