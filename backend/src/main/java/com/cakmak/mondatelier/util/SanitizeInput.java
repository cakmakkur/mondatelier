package com.cakmak.mondatelier.util;

import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;

public class SanitizeInput {
    public static String sanitize(String input) {
        if (input == null) return null;
        PolicyFactory policy = Sanitizers.FORMATTING.and(Sanitizers.LINKS);
        input = input.trim().replaceAll("<[^>]*>", "");
        return policy.sanitize(input);
    }
}

