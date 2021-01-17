package com.toptal.fooddelivery.controller;


import com.toptal.fooddelivery.model.Restaurant;
import com.toptal.fooddelivery.repository.RestaurantRepository;
import com.toptal.fooddelivery.request.RestaurantRequest;
import com.toptal.fooddelivery.request.UpdateUserRequest;
import com.toptal.fooddelivery.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/restaurants")
public class RestaurantController {
    @Autowired
    private RestaurantRepository restaurantRepository;

    @GetMapping("/getAll")
    List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    @GetMapping("/addRestaurant")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
    public ResponseEntity<?> addRestaurant(@Valid @RequestBody RestaurantRequest restaurantRequest) {
        if(restaurantRepository.existsByName(restaurantRequest.getName())){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Name of restaurant is already used!"));
        }

        Restaurant restaurant = new Restaurant();
        restaurant.setName(restaurantRequest.getName());
        restaurant.setDescription(restaurantRequest.getDescription());

        restaurantRepository.save(restaurant);

        return ResponseEntity.ok("Restaurant added successfully");
    }

    @GetMapping("/updateRestaurant")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
    public ResponseEntity<?> updateRestaurant(@Valid @RequestBody RestaurantRequest restaurantRequest, @RequestParam(name="restaurantId") Long restaurantId) {
        if(!restaurantRepository.existsById(restaurantId)){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Restaurant does not exists!"));
        }

        Restaurant restaurant = restaurantRepository.getOne(restaurantId);

        restaurant.setName(restaurantRequest.getName());
        restaurant.setDescription(restaurantRequest.getDescription());

        restaurantRepository.save(restaurant);

        return ResponseEntity.ok("Restaurant updated successfully");
    }

    @GetMapping("/deleteRestaurant")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
    public ResponseEntity<?> updateRestaurant(@RequestParam(name="restaurantId") Long restaurantId) {
        if (!restaurantRepository.existsById(restaurantId)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Restaurant does not exists!"));
        }

        restaurantRepository.deleteById(restaurantId);
        return ResponseEntity.ok("Restaurant deleted successfully");
    }
}
