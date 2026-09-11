package com.spring.boot.model;

import com.spring.boot.converter.StringListConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID id;

    private String name;

    private Double price;

    private Integer durationInDays;

    @Convert(converter = StringListConverter.class)
    @Column(length = 4000)
    private ArrayList<String> features;

    private Boolean isActive=true;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Integer productLimit;

    private Boolean popular;


}
