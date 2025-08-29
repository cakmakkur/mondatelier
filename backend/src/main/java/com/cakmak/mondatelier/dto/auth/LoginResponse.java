package com.cakmak.mondatelier.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String token;
    private long expiresIn;
    private String userId;
    private String profileId;
    private String profileType;
    private String userType;
}