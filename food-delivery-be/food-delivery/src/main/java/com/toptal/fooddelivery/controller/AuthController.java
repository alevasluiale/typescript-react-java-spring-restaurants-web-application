package com.toptal.fooddelivery.controller;

import com.toptal.fooddelivery.enums.RoleEnum;
import com.toptal.fooddelivery.enums.TypeEnum;
import com.toptal.fooddelivery.jwtutil.JwtUtils;
import com.toptal.fooddelivery.model.*;
import com.toptal.fooddelivery.repository.UserRepository;
import com.toptal.fooddelivery.request.LoginRequest;
import com.toptal.fooddelivery.request.SignupRequest;
import com.toptal.fooddelivery.response.JwtResponse;
import com.toptal.fooddelivery.response.MessageResponse;
import com.toptal.fooddelivery.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/authenticate")
    public ResponseEntity<?> checkIfUserIsStillLoggedIn(@Valid @RequestBody String username)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication != null && authentication.getName().equals(username)) {
            return ResponseEntity.ok("User is logged in");
        }
        else return ResponseEntity.badRequest().body("User is not logged in");
    }
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));


        Set<Role> roles = new HashSet<Role>();
        Set<Type> types = new HashSet<Type>();

        roles.add(new Role(RoleEnum.ROLE_USER));
        types.add(new Type(TypeEnum.EMAIL));

        user.setRoles(roles);
        user.setTypes(types);
        userRepository.save(user);

        return authenticateUser(new LoginRequest(signUpRequest.getUsername(),signUpRequest.getPassword()));
    }
}
