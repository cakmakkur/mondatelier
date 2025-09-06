package com.cakmak.mondatelier.dto;

import java.util.Date;

public record PostDto(
        Long id,
        Long communityId,
        Long profileId,
        Long parentPostId,
        String title,
        String content,
        Date createdAt,
        Date editedAt
) {
}
