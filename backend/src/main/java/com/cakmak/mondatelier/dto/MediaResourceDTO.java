package com.cakmak.mondatelier.dto;

import org.springframework.core.io.Resource;

public record MediaResourceDTO (
        Resource resource,
        String contentType,
        String filename
) {}
