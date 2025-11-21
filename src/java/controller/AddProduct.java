/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Admin;
import hibernate.Brand;
import hibernate.Category;
import hibernate.Color;
import hibernate.HibernateUtil;
import hibernate.Model;
import hibernate.Product;
import hibernate.Status;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

@MultipartConfig
@WebServlet(name = "AddProduct", urlPatterns = {"/AddProduct"})
public class AddProduct extends HttpServlet {

    private static final int PENDING_STATUS_ID = 1;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        System.out.println("ikk");

        String brandId = request.getParameter("brandId");
        String modelId = request.getParameter("modelId");
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        String colorId = request.getParameter("colorId");
        String categoryId = request.getParameter("categoryId");
        String price = request.getParameter("price");
        String qty = request.getParameter("qty");

        Part part1 = request.getPart("image1");
        Part part2 = request.getPart("image2");
        Part part3 = request.getPart("image3");

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        //validation
        if (request.getSession().getAttribute("admin") == null) {
            
            responseObject.addProperty("message", "Please Sign In!");

        } else if (!Util.isInteger(brandId)) {
            responseObject.addProperty("message", "Invalid Brand!");

        } else if (Integer.parseInt(brandId) == 0) {
            responseObject.addProperty("message", "Plese Select a Brand!");

        } else if (!Util.isInteger(modelId)) { //model eka int ekakda
            responseObject.addProperty("message", "Invalid model!");

        } else if (Integer.parseInt(modelId) == 0) { //model eka int ekakda
            responseObject.addProperty("message", "Plese Select a model!");

        } else if (title.isEmpty()) {
            responseObject.addProperty("message", "Product Title can not be empty!");

        } else if (description.isEmpty()) {
            responseObject.addProperty("message", "Product Description can not be empty!");

//       
        } else if (!Util.isInteger(colorId)) {
            responseObject.addProperty("message", "Invalid color!");

        } else if (Integer.parseInt(colorId) == 0) {
            responseObject.addProperty("message", "Plese Select a valid color!");

        } else if (!Util.isInteger(categoryId)) {
            responseObject.addProperty("message", "Invalid Category!");

        } else if (Integer.parseInt(categoryId) == 0) {
            responseObject.addProperty("message", "Plese Select a valid category!");

        } else if (!Util.isDouble(price)) {
            responseObject.addProperty("message", "Invalid price!");

        } else if (Double.parseDouble(price) <= 0) {
            responseObject.addProperty("message", "Price must be greater than 0");

        } else if (!Util.isInteger(qty)) {
            responseObject.addProperty("message", "Invalid quantity");

        } else if (Integer.parseInt(qty) <= 0) {
            responseObject.addProperty("message", "quantity must be greater than 0");

        } else if (part1.getSubmittedFileName() == null) {
            responseObject.addProperty("message", "product image one is required");

        } else if (part2.getSubmittedFileName() == null) {
            responseObject.addProperty("message", "product image two is required");

        } else if (part3.getSubmittedFileName() == null) {
            responseObject.addProperty("message", "product image three is required");

        } else { //attatama model ekak thiuenawada
            Brand brand = (Brand) s.get(Brand.class, Integer.valueOf(brandId));

            if (brand == null) {
                responseObject.addProperty("message", "plese select a valid Brand Name!");

            } else {
                Model model = (Model) s.load(Model.class, Integer.valueOf(modelId));

                if (model == null) {
                    System.out.println("ok");
                    responseObject.addProperty("message", "Please selet valid model Name!");

                } else {
                    if (model.getBrand().getId() != brand.getId()) {
                        responseObject.addProperty("message", "Plese select suitable Model");
                    } else {
                        Color color = (Color) s.load(Color.class, Integer.valueOf(colorId));
                        if (color == null) {
                            responseObject.addProperty("message", "Plese select valid color");

                        } else {
                            Category category = (Category) s.load(Category.class, Integer.valueOf(categoryId));
                            if (category == null) {
                                responseObject.addProperty("message", "Plese select valid Category");

                            } else {

                                Product p = new Product();
                                p.setModel(model);
                                p.setTitle(title);
                                p.setDescription(description);
                                p.setColor(color);
                                p.setCategory(category);
                                p.setPrice(Double.parseDouble(price));
                                p.setQty(Integer.parseInt(qty));

                                Status status = (Status) s.get(Status.class, AddProduct.PENDING_STATUS_ID);
                                p.setStatus(status);

                                Admin admin = (Admin) request.getSession().getAttribute("admin");
                                Criteria c1 = s.createCriteria(Admin.class);
                                c1.add(Restrictions.eq("email", admin.getEmail()));

                                Admin u1 = (Admin) c1.uniqueResult();
                                p.setAdmin(u1);

                                p.setCreated_at(new Date());

                                s.beginTransaction();
                                int id = (int) s.save(p);
                                s.getTransaction().commit();
                                s.close();

                                String appPath = getServletContext().getRealPath("");//Full Path pf the web pages folder

                                String newPath = appPath.replace("build\\web", "web\\product-images");

                                File productFolder = new File(newPath, String.valueOf(id));
                                productFolder.mkdir();

                                File file1 = new File(productFolder, "image1.jpeg");
                                Files.copy(part1.getInputStream(), file1.toPath(), StandardCopyOption.REPLACE_EXISTING);

                                File file2 = new File(productFolder, "image2.jpeg");
                                Files.copy(part2.getInputStream(), file2.toPath(), StandardCopyOption.REPLACE_EXISTING);

                                File file3 = new File(productFolder, "image3.jpeg");
                                Files.copy(part3.getInputStream(), file3.toPath(), StandardCopyOption.REPLACE_EXISTING);

                                responseObject.addProperty("status", true);
                                responseObject.addProperty("message", "Product added successfully");
                            }

                        }
                    }
                }
            }
        }

        Gson gson = new Gson();
        String toJson = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(toJson);

    }
}
