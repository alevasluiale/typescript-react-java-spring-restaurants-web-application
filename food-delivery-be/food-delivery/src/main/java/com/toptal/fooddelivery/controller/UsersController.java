package com.toptal.fooddelivery.controller;

import com.toptal.fooddelivery.enums.RoleEnum;
import com.toptal.fooddelivery.model.Role;
import com.toptal.fooddelivery.model.RoleEnum;
import com.toptal.fooddelivery.model.User;
import com.toptal.fooddelivery.repository.UserRepository;
import com.toptal.fooddelivery.request.SignupRequest;
import com.toptal.fooddelivery.request.UpdateUserRequest;
import com.toptal.fooddelivery.response.MessageResponse;
import com.toptal.fooddelivery.response.UsersInfoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
public class UsersController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;


    @GetMapping("/getAll")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<UsersInfoResponse> getAllUsers() {
        return userRepository.findBy();
    }
    @PostMapping("/addUser")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> addUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));


        Role role = new Role();

        if(signUpRequest.getRole().equals(RoleEnum.ROLE_USER)
                || signUpRequest.getRole().isEmpty()
                    || signUpRequest.getRole().isBlank()) role.setName(RoleEnum.ROLE_USER);
        else if(signUpRequest.getRole().equals(RoleEnum.ROLE_OWNER)) role.setName(RoleEnum.ROLE_OWNER);
        else if(signUpRequest.getRole().equals(RoleEnum.ROLE_ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Error: Admin user cannot be created by other admin"));
        }
        else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Invalid role"));
        }

        user.setRole(role);
        userRepository.save(user);

        return ResponseEntity.ok("User added successfully");
    }

    @PutMapping("/deleteUser")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @ResponseBody
    public ResponseEntity<?> deleteUser(@RequestParam(name="userId") Long userId) {
        if(userRepository.existsById(userId)) {
            User toBeDeleted = userRepository.getOne(userId);
            if(toBeDeleted.getRole().getName().equals(RoleEnum.ROLE_ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Error: Admin users cannot be deleted"));
            }

            userRepository.deleteById(userId);
            return ResponseEntity.ok("User deleted successfully.");
        }
        else return ResponseEntity.badRequest().body("User does not exist.");
    }

    @PostMapping("/updateUser")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @ResponseBody
    public ResponseEntity<?> updateUser(@Valid @RequestBody UpdateUserRequest updateUserRequest,@RequestParam(name="userId") Long userId) {

        if(userRepository.existsById(userId)) {
            User toBeUpdated = userRepository.getOne(userId);
            if(toBeUpdated.getRole().getName().equals(RoleEnum.ROLE_ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Error: Admin users cannot be updated"));
            }


            User adminUser = userRepository.getOne(updateUserRequest.getRequestingUserid());
            if(!adminUser.getRole().getName().equals(RoleEnum.ROLE_ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Error: Requesting user is not admin"));
            }

            if(updateUserRequest.getRole() != null) {
                Role role = new Role();
                if(updateUserRequest.getRole().equals(RoleEnum.ROLE_USER)) role.setName(RoleEnum.ROLE_USER);
                else if(updateUserRequest.getRole().equals(RoleEnum.ROLE_OWNER)) role.setName(RoleEnum.ROLE_OWNER);
                else if(updateUserRequest.getRole().equals(RoleEnum.ROLE_ADMIN)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Error: Admin user cannot be created by other admin"));
                }
                else return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Error: Role is invalid"));
            }
            if(updateUserRequest.getEmail() != null) {
                toBeUpdated.setEmail(updateUserRequest.getEmail());
            }
            if(updateUserRequest.getPassword() != null && !updateUserRequest.getPassword().isBlank() && !updateUserRequest.getPassword().isEmpty() ) {
                if(updateUserRequest.getPassword().length()<6) {
                    return ResponseEntity.badRequest().body("Password has length less than 6.");
                }
                toBeUpdated.setPassword(encoder.encode(updateUserRequest.getPassword()));
            }
            if(updateUserRequest.getUsername() != null) {
                toBeUpdated.setUsername(updateUserRequest.getUsername());
            }

            userRepository.save(toBeUpdated);
            return ResponseEntity.ok("User updated successfully");
        }
        else return ResponseEntity.badRequest().body("User does not exist.");
    }
}
