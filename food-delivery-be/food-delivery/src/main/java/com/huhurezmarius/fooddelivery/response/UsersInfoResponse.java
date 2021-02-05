package com.huhurezmarius.fooddelivery.response;

import com.huhurezmarius.fooddelivery.model.Role;

import java.util.Set;

public interface UsersInfoResponse {
    Long getId();
    String getUsername();
    String getEmail();
    boolean getBlocked();
    String getPhotoUrl();
    Set<Role> getRoles();
}
