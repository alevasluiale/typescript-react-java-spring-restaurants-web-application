package com.huhurezmarius.fooddelivery.repository;

import com.huhurezmarius.fooddelivery.model.EmailConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailConfirmationTokenRepository extends JpaRepository<EmailConfirmationToken,Long> {
    EmailConfirmationToken findByConfirmationToken(String confirmationToken);
}
