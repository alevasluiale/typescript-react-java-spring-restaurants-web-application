package com.toptal.fooddelivery.controller;


import com.toptal.fooddelivery.enums.StatusEnum;
import com.toptal.fooddelivery.model.*;
import com.toptal.fooddelivery.repository.*;
import com.toptal.fooddelivery.request.MealRequest;
import com.toptal.fooddelivery.request.OrderRequest;
import com.toptal.fooddelivery.request.UpdateUserRequest;
import com.toptal.fooddelivery.response.MessageResponse;
import com.toptal.fooddelivery.response.OrderResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderStatusRepository orderStatusRepository;
    @Autowired
    private MealRepository mealRepository;
    @Autowired
    private OrderMealRepository orderMealRepository;
    @Autowired
    private StatusRepository statusRepository;
    @GetMapping("/getAll")
    List<OrderResponse> getAllOrders() {
        return orderRepository.findBy();
    }

    @PostMapping("/addOrder")
    public ResponseEntity<?> addOrder(@Valid @RequestBody OrderRequest orderRequest) {

        if(orderRequest.getMeals().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: An order needs at least 1 meal!"));
        }
        Order order = new Order();
        order.setDate(new Date());
        order.setTotalAmount(orderRequest.getAmount());

        Set<Restaurant> restaurantSet = new HashSet<Restaurant>();
        restaurantSet.add(orderRequest.getRestaurant());
        order.setRestaurants(restaurantSet);

        Order savedOrder = orderRepository.save(order);

        for(MealRequest mealRequest : orderRequest.getMeals()) {
            if(!mealRepository.existsById(mealRequest.getId())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Meal with id "+mealRequest.getId()+" doesn't exist"));
            }
            OrderMeal orderMeal = new OrderMeal(new OrderMealPK(order.getId(),mealRequest.getId()));
            orderMeal.setMeal(mealRepository.getOne(mealRequest.getId()));
            orderMeal.setOrder(order);
            orderMeal.setQuantity(mealRequest.getQuantity());
            orderMealRepository.save(orderMeal);
        }
        Status status = statusRepository.findByName(StatusEnum.RECEIVED);
        OrderStatus orderStatus = new OrderStatus(new OrderStatusPK(savedOrder.getId(),status.getId()));
        orderStatus.setOrder(savedOrder);
        orderStatus.setStatus(status);
        orderStatus.setDate(new Date());
        orderStatusRepository.save(orderStatus);

        return ResponseEntity.ok("Order added successfully");
    }

//    @PostMapping("/updateOrder")
//    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
//    public ResponseEntity<?> updateOrder(@Valid @RequestBody OrderRequest orderRequest, @RequestParam(name="orderId") Long orderId) {
//        if(!orderRepository.existsById(orderId)){
//            return ResponseEntity
//                    .badRequest()
//                    .body(new MessageResponse("Error: Order does not exists!"));
//        }
//
//        Order order = orderRepository.getOne(orderId);
//
//        if(orderRequest.getName() != null && !orderRequest.getName().isEmpty() && !orderRequest.getName().isBlank()) {
//            order.setName(orderRequest.getName());
//        }
//        if(orderRequest.getDescription() != null && !orderRequest.getDescription().isEmpty() && !orderRequest.getDescription().isBlank()) {
//            order.setDescription(orderRequest.getDescription());
//        }
//        if(orderRequest.getPrice() != null ) {
//            order.setPrice(orderRequest.getPrice().doubleValue());
//        }
//        orderRepository.save(order);
//
//        return ResponseEntity.ok("Order updated successfully");
//    }
//
//    @PutMapping("/deleteOrder")
//    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
//    public ResponseEntity<?> updateOrder(@RequestParam(name="orderId") Long orderId) {
//        if (!orderRepository.existsById(orderId)) {
//            return ResponseEntity
//                    .badRequest()
//                    .body(new MessageResponse("Error: Order does not exists!"));
//        }
//
//        orderRepository.deleteById(orderId);
//        return ResponseEntity.ok("Order deleted successfully");
//    }
}
