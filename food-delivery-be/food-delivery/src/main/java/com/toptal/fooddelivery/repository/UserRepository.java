package com.toptal.fooddelivery.repository;

import com.toptal.fooddelivery.model.User;
import com.toptal.fooddelivery.response.UsersInfoResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    User findByEmailIgnoreCase(String email);

    User findByRestaurantsId(Long restaurantId);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    List<UsersInfoResponse> findBy();
}
