package com.spring.boot.config.jwt;

import com.spring.boot.dto.UserDto;
import com.spring.boot.helper.JwtToken;
import com.spring.boot.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Duration;
import java.util.Date;
import java.util.Objects;

@Component
public class TokenHandler {
    private String secret;

    private Duration time;

    private JwtBuilder jwtBuilder;

    private JwtParser jwtParser;

    private UserService userService;


    @Autowired
    public TokenHandler(JwtToken jwtToken, UserService userService){
        this.userService = userService;

        this.secret = jwtToken.getSecret();
        this.time = jwtToken.getTime();

        Key key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        jwtBuilder = Jwts.builder().signWith(key);
        jwtParser = Jwts.parserBuilder().setSigningKey(key).build();
    }

    public String createToken(UserDto userDto) {
        Date issuedAt = new Date();
        Date expiryAt = Date.from(issuedAt.toInstant().plus(time));

        Key key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .setSubject(userDto.getName())
                .setIssuedAt(issuedAt)
                .setExpiration(expiryAt)
                .claim("role", userDto.getRole())
                .signWith(key)
                .compact();
    }

    public UserDto validateToken(String token) {
        try {
            Claims claims = jwtParser.parseClaimsJws(token).getBody();

            UserDto userDto = new UserDto();
            userDto.setName(claims.getSubject());
            userDto.setRole(claims.get("role", String.class));

            return userDto;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
