package com.cakmak.mondatelier.util;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class UploadImageTests {
    @TempDir
    Path uploadDirectory;

    @Test
    void storesRecognizedImageUsingServerGeneratedName() {
        byte[] png = {
                (byte) 0x89, 0x50, 0x4E, 0x47,
                0x0D, 0x0A, 0x1A, 0x0A,
                0x00
        };
        MockMultipartFile image = new MockMultipartFile(
                "image",
                "../../untrusted-name.svg",
                "image/svg+xml",
                png);

        String filename = UploadImage.upload(
                image,
                uploadDirectory.toString(),
                "events");

        assertTrue(filename.endsWith(".png"));
        assertTrue(Files.exists(uploadDirectory.resolve("events").resolve(filename)));
    }

    @Test
    void rejectsActiveContentEvenWhenContentTypeClaimsImage() {
        MockMultipartFile image = new MockMultipartFile(
                "image",
                "payload.png",
                "image/png",
                "<svg><script>alert(1)</script></svg>".getBytes());

        assertThrows(
                IllegalArgumentException.class,
                () -> UploadImage.upload(
                        image,
                        uploadDirectory.toString(),
                        "events"));
    }
}
