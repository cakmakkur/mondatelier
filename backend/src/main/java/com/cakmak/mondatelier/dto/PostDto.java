package com.cakmak.mondatelier.dto;

import java.util.Date;
import java.util.List;

public record PostDto(
        Long id,
        Long communityId,
        String profileId,
        Long parentPostId,
        String title,
        String content,
        Date createdAt,
        Date editedAt,
        List<String> postMediaPathList
) {
}
