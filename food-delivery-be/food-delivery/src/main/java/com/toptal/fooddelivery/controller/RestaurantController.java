package com.toptal.fooddelivery.controller;


import com.toptal.fooddelivery.model.Meal;
import com.toptal.fooddelivery.model.Restaurant;
import com.toptal.fooddelivery.model.User;
import com.toptal.fooddelivery.repository.MealRepository;
import com.toptal.fooddelivery.repository.RestaurantRepository;
import com.toptal.fooddelivery.repository.UserRepository;
import com.toptal.fooddelivery.request.RestaurantRequest;
import com.toptal.fooddelivery.request.UpdateUserRequest;
import com.toptal.fooddelivery.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/restaurants")
public class RestaurantController {
    @Autowired
    private RestaurantRepository restaurantRepository;
    @Autowired
    private MealRepository mealRepository;
    @Autowired
    private UserRepository userRepository;
    @GetMapping("/getAll")
    List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    @PostMapping("/addRestaurant")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
    public ResponseEntity<?> addRestaurant(@Valid @RequestBody RestaurantRequest restaurantRequest,@RequestParam("userId") Long userId) {
        if(restaurantRepository.existsByName(restaurantRequest.getName())){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Name of restaurant is already used!"));
        }

        Restaurant restaurant = new Restaurant();
        restaurant.setName(restaurantRequest.getName());
        restaurant.setDescription(restaurantRequest.getDescription());

        Set<Meal> meals = new HashSet<>();
        if(restaurantRequest.getMealsIds() != null && restaurantRequest.getMealsIds().size() > 0) {
            for(Long mealId : restaurantRequest.getMealsIds()) {
                if(!mealRepository.existsById(mealId)) {
                    return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Error: Meal with id "+mealId.toString()+"doesn't exist!"));
                }
                meals.add(mealRepository.getOne(mealId));
            }
        }
        restaurant.setMeals(meals);
        User user = userRepository.getOne(userId);

        user.addRestaurant(restaurantRepository.save(restaurant));

        userRepository.save(user);
        return ResponseEntity.ok("Restaurant added successfully");
    }

    @PostMapping("/updateRestaurant")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
    public ResponseEntity<?> updateRestaurant(@Valid @RequestBody RestaurantRequest restaurantRequest, @RequestParam(name="restaurantId") Long restaurantId) {
        if(!restaurantRepository.existsById(restaurantId)){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Restaurant does not exists!"));
        }

        Restaurant restaurant = restaurantRepository.getOne(restaurantId);

        if(restaurantRequest.getName() != null && !restaurantRequest.getName().isEmpty() && !restaurantRequest.getName().isBlank()) {
            restaurant.setName(restaurantRequest.getName());
        }
        if(restaurantRequest.getDescription() != null && !restaurantRequest.getDescription().isEmpty() && !restaurantRequest.getDescription().isBlank()) {
            restaurant.setDescription(restaurantRequest.getDescription());
        }

        if(restaurantRequest.getMealsIds() != null && restaurantRequest.getMealsIds().size() > 0) {
            Set<Meal> meals = new HashSet<>();
            for(Long mealId : restaurantRequest.getMealsIds()) {
                if(!mealRepository.existsById(mealId)) {
                    return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Error: Meal with id "+mealId.toString()+"doesn't exist!"));
                }
                meals.add(mealRepository.getOne(mealId));
            }
            restaurant.setMeals(meals);
        }
        restaurantRepository.save(restaurant);

        return ResponseEntity.ok("Restaurant updated successfully");
    }

    @PutMapping("/deleteRestaurant")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
    public ResponseEntity<?> deleteRestaurant(@RequestParam(name="restaurantId") Long restaurantId) {
        if (!restaurantRepository.existsById(restaurantId)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Restaurant does not exists!"));
        }

        restaurantRepository.deleteById(restaurantId);
        return ResponseEntity.ok("Restaurant deleted successfully");
    }

}
