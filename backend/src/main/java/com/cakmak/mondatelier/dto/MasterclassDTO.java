package com.cakmak.mondatelier.dto;

import java.util.Date;

public record MasterclassDTO (
        String id,
        String profileId,
        String title,
        String description,
        Integer sessions,
        Integer sessionDuration,
        Integer sessionPrice,
        Date createdAt,
        String artCategory,
        String city
) {}
