package com.example.employee_management.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private Long expiration;

    public String generateToken(UserDetails userDetails) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withSubject(userDetails.getUsername())
                    .withIssuer("employee-management")
                    .withIssuedAt(new Date())
                    .withExpiresAt(new Date(System.currentTimeMillis() + expiration))
                    .withClaim("authorities", userDetails.getAuthorities().iterator().next().getAuthority())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Error creating JWT token", exception);
        }
    }

    public String extractUsername(String token) {
        return getDecodedJWT(token).getSubject();
    }

    public Date extractExpiration(String token) {
        return getDecodedJWT(token).getExpiresAt();
    }

    public String extractAuthority(String token) {
        return getDecodedJWT(token).getClaim("authorities").asString();
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (JWTVerificationException e) {
            return false;
        }
    }

    private DecodedJWT getDecodedJWT(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer("employee-management")
                    .build();
            return verifier.verify(token);
        } catch (JWTVerificationException exception) {
            throw new RuntimeException("Invalid JWT token", exception);
        }
    }
}