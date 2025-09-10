package com.cakmak.mondatelier.dto;

enum Type {
    COMMUNITY,
    POST
}

public class CommunitySearchResultDto {
    Type type;
    Long id;
    String name;
    String title;
}
