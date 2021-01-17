package com.toptal.fooddelivery.response;

import com.toptal.fooddelivery.enums.RoleEnum;

public interface UsersInfoResponse {
    Long getId();
    String getUsername();
    String getEmail();
    RoleEnum getRole();
}
