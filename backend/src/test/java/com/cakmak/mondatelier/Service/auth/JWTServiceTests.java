package com.cakmak.mondatelier.Service.auth;

import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.enums.UserTypes;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JWTServiceTests {
    private static final String ACCESS_KEY =
            "dGVzdC1hY2Nlc3Mta2V5LW11c3QtYmUtYXQtbGVhc3QtMzItYnl0ZXM=";
    private static final String REFRESH_KEY =
            "dGVzdC1yZWZyZXNoLWtleS1tdXN0LWJlLWF0LWxlYXN0LTMyLWJ5dGVz";

    private JWTService jwtService;
    private User user;

    @BeforeEach
    void setUp() {
        jwtService = new JWTService();
        ReflectionTestUtils.setField(jwtService, "secretKey", ACCESS_KEY);
        ReflectionTestUtils.setField(jwtService, "refreshSecretKey", REFRESH_KEY);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 60_000L);
        ReflectionTestUtils.setField(jwtService, "refreshExpirationTime", 120_000L);

        user = new User();
        user.setEmail("artist@example.com");
        user.setUserType(UserTypes.PERSONAL);
        user.setIsActive(true);
    }

    @Test
    void validatesEachTokenWithItsOwnPurposeAndKey() {
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        assertTrue(jwtService.isTokenValid(accessToken, user));
        assertTrue(jwtService.isRefreshTokenValid(refreshToken, user));
        assertThrows(JwtException.class, () -> jwtService.isTokenValid(refreshToken, user));
        assertThrows(JwtException.class, () -> jwtService.isRefreshTokenValid(accessToken, user));
    }

    @Test
    void tokenTypeStillPreventsInterchangeWhenKeysMatch() {
        ReflectionTestUtils.setField(jwtService, "refreshSecretKey", ACCESS_KEY);
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        assertFalse(jwtService.isTokenValid(refreshToken, user));
    }
}
