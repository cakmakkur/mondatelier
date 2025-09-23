package com.cakmak.mondatelier.dto;

public record NewPostDto (
    String title,
    String content,
    String profileId,
    Long communityId,
    Long parentPostId
    ){}