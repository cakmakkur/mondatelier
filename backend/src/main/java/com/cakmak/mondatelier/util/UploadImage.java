package com.cakmak.mondatelier.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

public class UploadImage {
    private static final long MAX_IMAGE_SIZE_BYTES = 10L * 1024 * 1024;

    public static String upload(MultipartFile imageFile, String uploadDir, String uploadSubDir) {
        try {
            if (imageFile.isEmpty() || imageFile.getSize() > MAX_IMAGE_SIZE_BYTES) {
                throw new IllegalArgumentException("Image must be between 1 byte and 10 MB");
            }

            byte[] content = imageFile.getBytes();
            String extension = detectImageExtension(content);
            if (extension == null) {
                throw new IllegalArgumentException("Only JPEG, PNG, GIF, and WebP images are supported");
            }

            String fileName = UUID.randomUUID() + extension;
            Path uploadPath = Paths.get(uploadDir, uploadSubDir).toAbsolutePath().normalize();

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName).normalize();
            if (!filePath.startsWith(uploadPath)) {
                throw new IllegalArgumentException("Invalid upload path");
            }
            Files.write(filePath, content);

            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image file", e);
        }
    }

    private static String detectImageExtension(byte[] content) {
        if (content.length >= 3
                && (content[0] & 0xFF) == 0xFF
                && (content[1] & 0xFF) == 0xD8
                && (content[2] & 0xFF) == 0xFF) {
            return ".jpg";
        }

        if (content.length >= 8
                && (content[0] & 0xFF) == 0x89
                && content[1] == 0x50
                && content[2] == 0x4E
                && content[3] == 0x47
                && content[4] == 0x0D
                && content[5] == 0x0A
                && content[6] == 0x1A
                && content[7] == 0x0A) {
            return ".png";
        }

        if (content.length >= 6
                && content[0] == 'G'
                && content[1] == 'I'
                && content[2] == 'F'
                && content[3] == '8'
                && (content[4] == '7' || content[4] == '9')
                && content[5] == 'a') {
            return ".gif";
        }

        if (content.length >= 12
                && content[0] == 'R'
                && content[1] == 'I'
                && content[2] == 'F'
                && content[3] == 'F'
                && content[8] == 'W'
                && content[9] == 'E'
                && content[10] == 'B'
                && content[11] == 'P') {
            return ".webp";
        }

        return null;
    }
}
