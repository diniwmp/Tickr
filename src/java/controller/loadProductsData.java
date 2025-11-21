package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.Category;
import hibernate.Color;
import hibernate.HibernateUtil;
import hibernate.Model;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

/**
 *
 * @author Dini
 */
@WebServlet(name = "loadProductsData", urlPatterns = {"/loadProductsData"})
public class loadProductsData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        System.out.println("ok");

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        //get Brands
        Criteria c1 = s.createCriteria(Brand.class);
        List<Brand> brandList = c1.list();

        //get models
        Criteria c2 = s.createCriteria(Model.class);
        List<Model> modelList = c2.list();

        //get color
        Criteria c3 = s.createCriteria(Color.class);
        List<Color> colorList = c3.list();

        //get Category
        Criteria c4 = s.createCriteria(Category.class);
        List<Category> categoryList = c4.list();

        Gson gson = new Gson();
        responseObject.addProperty("status", true);

        responseObject.add("brandList", gson.toJsonTree(brandList));
        responseObject.add("modelList", gson.toJsonTree(modelList));
        responseObject.add("colorList", gson.toJsonTree(colorList));
        responseObject.add("categoryList", gson.toJsonTree(categoryList));

        response.setContentType("application/java");
        response.getWriter().write(gson.toJson(responseObject));
    }

}
