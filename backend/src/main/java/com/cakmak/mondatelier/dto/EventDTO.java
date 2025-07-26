package com.cakmak.mondatelier.dto;

import java.util.Date;

public record EventDTO (
        String id,
        String title,
        Long type,
        String city,
        String description,
        Date createdAt,
        Date date,
        String profileId,
        String thumbnail_url
) {
}
