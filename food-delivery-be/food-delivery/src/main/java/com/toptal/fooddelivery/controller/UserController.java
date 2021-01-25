package com.toptal.fooddelivery.controller;

import com.toptal.fooddelivery.enums.RoleEnum;
import com.toptal.fooddelivery.model.Role;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
public class UserController {
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


        Set<Role> roles = new HashSet<Role>();
        if(signUpRequest.getRole().equals(RoleEnum.ROLE_USER.name())
                || signUpRequest.getRole().isEmpty()
                || signUpRequest.getRole().isBlank()) roles.add(new Role(RoleEnum.ROLE_USER));
        else if(signUpRequest.getRole().equals(RoleEnum.ROLE_OWNER.name())) roles.add(new Role(RoleEnum.ROLE_OWNER));
        else if(signUpRequest.getRole().equals(RoleEnum.ROLE_ADMIN.name())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Error: Admin user cannot be created by other admin"));
        }
        else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Invalid role"));
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok("User added successfully");
    }

    @PutMapping("/deleteUser")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @ResponseBody
    public ResponseEntity<?> deleteUser(@RequestParam(name="userId") Long userId) {
        if(userRepository.existsById(userId)) {
            User toBeDeleted = userRepository.getOne(userId);
            if(toBeDeleted.getRoles().iterator().next().getName().equals(RoleEnum.ROLE_ADMIN)) {
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

        if(userRepository.existsById(updateUserRequest.getId())) {
            User userToBeUpdated = userRepository.getOne(updateUserRequest.getId());
            if(userToBeUpdated.getRoles().iterator().next().getName().equals(RoleEnum.ROLE_ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Error: Admin users cannot be updated"));
            }


            User adminUser = userRepository.getOne(userId);
            if(!adminUser.getRoles().iterator().next().getName().equals(RoleEnum.ROLE_ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Error: Requesting user is not admin"));
            }

            if(updateUserRequest.getRole() != null) {
                Set<Role> newRoles = new HashSet<Role>();
                if(updateUserRequest.getRole().equals(RoleEnum.ROLE_USER.name())) newRoles.add(new Role(RoleEnum.ROLE_USER));
                else if(updateUserRequest.getRole().equals(RoleEnum.ROLE_OWNER.name())) newRoles.add(new Role(RoleEnum.ROLE_OWNER));
                else if(updateUserRequest.getRole().equals(RoleEnum.ROLE_ADMIN.name())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Error: Admin user cannot be created by other admin"));
                }
                else return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Error: Role is invalid"));
                userToBeUpdated.setRoles(newRoles);
            }
            if(updateUserRequest.getEmail() != null) {
                userToBeUpdated.setEmail(updateUserRequest.getEmail());
            }
            if(updateUserRequest.getPassword() != null && !updateUserRequest.getPassword().isBlank() && !updateUserRequest.getPassword().isEmpty() ) {
                if(updateUserRequest.getPassword().length()<6) {
                    return ResponseEntity.badRequest().body("Password has length less than 6.");
                }
                userToBeUpdated.setPassword(encoder.encode(updateUserRequest.getPassword()));
            }
            if(updateUserRequest.getUsername() != null) {
                userToBeUpdated.setUsername(updateUserRequest.getUsername());
            }

            userRepository.save(userToBeUpdated);
            return ResponseEntity.ok("User updated successfully");
        }
        else return ResponseEntity.badRequest().body("User does not exist.");
    }
}
