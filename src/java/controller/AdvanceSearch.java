package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Product;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "AdvanceSearch", urlPatterns = {"/AdvanceSearch"})
public class AdvanceSearch extends HttpServlet {

    private static final int MAX_RESULT = 6;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Session session = null;
        try {
            Gson gson = new Gson();
            JsonObject requestJson = gson.fromJson(request.getReader(), JsonObject.class);
            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("status", false);

            SessionFactory sf = HibernateUtil.getSessionFactory();
            session = sf.openSession();

            // Create optimized criteria with JOINs to avoid N+1 query problem
            Criteria criteria = session.createCriteria(Product.class, "p");
            criteria.createAlias("p.model", "m");
            criteria.createAlias("m.brand", "b");
            criteria.createAlias("p.category", "cat");
            criteria.createAlias("p.color", "col");
            criteria.createAlias("p.status", "st");

            // Filter by brand - OPTIMIZED (no separate queries needed)
            if (requestJson.has("brandName") && !requestJson.get("brandName").getAsString().trim().isEmpty()) {
                String brandName = requestJson.get("brandName").getAsString().trim();
                criteria.add(Restrictions.eq("b.name", brandName));
            }

            // Filter by category - OPTIMIZED
            if (requestJson.has("categoryName") && !requestJson.get("categoryName").getAsString().trim().isEmpty()) {
                String categoryName = requestJson.get("categoryName").getAsString().trim();
                criteria.add(Restrictions.eq("cat.value", categoryName));
            }

            // Filter by color - OPTIMIZED
            if (requestJson.has("colorName") && !requestJson.get("colorName").getAsString().trim().isEmpty()) {
                String colorName = requestJson.get("colorName").getAsString().trim();
                criteria.add(Restrictions.eq("col.value", colorName));
            }

            // Filter by price range
            if (requestJson.has("priceStart") && requestJson.has("priceEnd")) {
                double priceStart = requestJson.get("priceStart").getAsDouble();
                double priceEnd = requestJson.get("priceEnd").getAsDouble();
                criteria.add(Restrictions.ge("p.price", priceStart));
                criteria.add(Restrictions.le("p.price", priceEnd));
            }

            // Add text search capability (bonus feature)
            if (requestJson.has("searchText") && !requestJson.get("searchText").getAsString().trim().isEmpty()) {
                String searchText = "%" + requestJson.get("searchText").getAsString().trim().toLowerCase() + "%";
                criteria.add(Restrictions.ilike("p.title", searchText));
            }

            // Apply sorting
            if (requestJson.has("sortValue") && !requestJson.get("sortValue").getAsString().trim().isEmpty()) {
                String sortValue = requestJson.get("sortValue").getAsString().trim();
                switch (sortValue) {
                    case "Sort by Latest":
                        criteria.addOrder(Order.desc("p.id"));
                        break;
                    case "Sort by Oldest":
                        criteria.addOrder(Order.asc("p.id"));
                        break;
                    case "Sort by Name":
                        criteria.addOrder(Order.asc("p.title"));
                        break;
                    case "Sort by Price":
                        criteria.addOrder(Order.asc("p.price"));
                        break;
                    default:
                        criteria.addOrder(Order.desc("p.id"));
                        break;
                }
            } else {
                // Default sorting when no sort specified
                criteria.addOrder(Order.desc("p.id"));
            }

            // Filter by status (only active products)
            criteria.add(Restrictions.eq("st.id", 1));

            // OPTIMIZED: Get total count efficiently using separate count query
            Criteria countCriteria = session.createCriteria(Product.class, "p");
            countCriteria.createAlias("p.model", "m");
            countCriteria.createAlias("m.brand", "b");
            countCriteria.createAlias("p.category", "cat");
            countCriteria.createAlias("p.color", "col");
            countCriteria.createAlias("p.status", "st");

            // Apply same filters to count query
            if (requestJson.has("brandName") && !requestJson.get("brandName").getAsString().trim().isEmpty()) {
                String brandName = requestJson.get("brandName").getAsString().trim();
                countCriteria.add(Restrictions.eq("b.name", brandName));
            }
            if (requestJson.has("categoryName") && !requestJson.get("categoryName").getAsString().trim().isEmpty()) {
                String categoryName = requestJson.get("categoryName").getAsString().trim();
                countCriteria.add(Restrictions.eq("cat.value", categoryName));
            }
            if (requestJson.has("colorName") && !requestJson.get("colorName").getAsString().trim().isEmpty()) {
                String colorName = requestJson.get("colorName").getAsString().trim();
                countCriteria.add(Restrictions.eq("col.value", colorName));
            }
            if (requestJson.has("priceStart") && requestJson.has("priceEnd")) {
                double priceStart = requestJson.get("priceStart").getAsDouble();
                double priceEnd = requestJson.get("priceEnd").getAsDouble();
                countCriteria.add(Restrictions.ge("p.price", priceStart));
                countCriteria.add(Restrictions.le("p.price", priceEnd));
            }
            if (requestJson.has("searchText") && !requestJson.get("searchText").getAsString().trim().isEmpty()) {
                String searchText = "%" + requestJson.get("searchText").getAsString().trim().toLowerCase() + "%";
                countCriteria.add(Restrictions.ilike("p.title", searchText));
            }
            countCriteria.add(Restrictions.eq("st.id", 1));

            // Execute count query efficiently
            Long totalCount = (Long) countCriteria.setProjection(Projections.rowCount()).uniqueResult();
            responseJson.addProperty("allProductCount", totalCount.intValue());

            // Apply pagination
            if (requestJson.has("firstResult")) {
                int firstResult = requestJson.get("firstResult").getAsInt();
                criteria.setFirstResult(firstResult);
                criteria.setMaxResults(MAX_RESULT);
            } else {
                criteria.setMaxResults(MAX_RESULT);
            }

            // Execute main query and get results
            List<Product> productList = criteria.list();

            // Clean up products for JSON serialization
            for (Product p : productList) {
                p.setAdmin(null); // avoid lazy loading issues and security
            }

            // Build successful response
            responseJson.add("productList", gson.toJsonTree(productList));
            responseJson.addProperty("status", true);

            // Send response
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(gson.toJson(responseJson));

        } catch (Exception e) {
            e.printStackTrace();

            // Return structured JSON error response instead of HTTP 500
            JsonObject errorResponse = new JsonObject();
            errorResponse.addProperty("status", false);
            errorResponse.addProperty("error", "Search failed: " + e.getMessage());
            errorResponse.addProperty("allProductCount", 0);
            errorResponse.add("productList", new Gson().toJsonTree(new Object[0]));

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(new Gson().toJson(errorResponse));

        } finally {
            // Always close the Hibernate session to prevent memory leaks
            if (session != null && session.isOpen()) {
                session.close();
            }
        }
    }
}
