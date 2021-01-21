package com.toptal.fooddelivery.response;

import com.toptal.fooddelivery.model.Role;

import java.util.Set;

public interface UsersInfoResponse {
    Long getId();
    String getUsername();
    String getEmail();
    Set<Role> getRoles();
}
