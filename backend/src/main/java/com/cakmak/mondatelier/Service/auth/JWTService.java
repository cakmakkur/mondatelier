package com.cakmak.mondatelier.Service.auth;

import com.cakmak.mondatelier.Model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService {
    private static final String TOKEN_TYPE_CLAIM = "tokenType";
    private static final String ACCESS_TOKEN_TYPE = "access";
    private static final String REFRESH_TOKEN_TYPE = "refresh";

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.refresh-secret-key}")
    private String refreshSecretKey;

    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration;

    @Value("${security.jwt.refresh-expiration-time}")
    private long refreshExpirationTime;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject, getAccessSignInKey());
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return extractClaim(token, claimsResolver, getAccessSignInKey());
    }

    private <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver,
            Key signingKey) {
        final Claims claims = extractAllClaims(token, signingKey);
        return claimsResolver.apply(claims);
    }

    public String generateToken(User user) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userType", user.getUserType().name());
        extraClaims.put(TOKEN_TYPE_CLAIM, ACCESS_TOKEN_TYPE);
        if (user.getProfile() != null) {
            extraClaims.put("profileType", user.getProfile().getType().name());
        }
        return generateToken(extraClaims, user);
    }

    public String generateToken(Map<String, Object> extraClaims, User user) {
        return buildToken(extraClaims, user, jwtExpiration);
    }

    public long getExpirationTime() {
        return jwtExpiration;
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            User user,
            long expiration
    ) {
        return Jwts
                .builder()
                .addClaims(extraClaims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getAccessSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        final String tokenType = extractClaim(token, claims -> claims.get(TOKEN_TYPE_CLAIM, String.class));
        return ACCESS_TOKEN_TYPE.equals(tokenType)
                && username.equals(userDetails.getUsername())
                && !isTokenExpired(token, getAccessSignInKey());
    }

    private boolean isTokenExpired(String token, Key signingKey) {
        return extractExpiration(token, signingKey).before(new Date());
    }

    private Date extractExpiration(String token, Key signingKey) {
        return extractClaim(token, Claims::getExpiration, signingKey);
    }

    private Claims extractAllClaims(String token, Key signingKey) {
        return Jwts
                .parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getAccessSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Key getRefreshSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(refreshSecretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateRefreshToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(TOKEN_TYPE_CLAIM, REFRESH_TOKEN_TYPE);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpirationTime))
                .signWith(getRefreshSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractRefreshUsername(String token) {
        return extractClaim(token, Claims::getSubject, getRefreshSignInKey());
    }

    public boolean isRefreshTokenValid(String token, UserDetails userDetails) {
        final Key signingKey = getRefreshSignInKey();
        final String username = extractClaim(token, Claims::getSubject, signingKey);
        final String tokenType = extractClaim(
                token,
                claims -> claims.get(TOKEN_TYPE_CLAIM, String.class),
                signingKey);
        return REFRESH_TOKEN_TYPE.equals(tokenType)
                && username.equals(userDetails.getUsername())
                && !isTokenExpired(token, signingKey);
    }
}
