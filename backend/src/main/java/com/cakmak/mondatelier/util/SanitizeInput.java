package com.cakmak.mondatelier.util;

public class SanitizeInput {
    public static String sanitize(String input) {
        return input == null ? null : input.trim().replaceAll("<[^>]*>", "");
    }
}
