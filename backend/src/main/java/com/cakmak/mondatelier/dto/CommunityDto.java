package com.cakmak.mondatelier.dto;

import java.util.Date;

public record CommunityDto (
        Long id,
        String name,
        String description,
        Date createdAt,
        String logoImgPath,
        String profileId,
        Integer followerAmount
) {
}
