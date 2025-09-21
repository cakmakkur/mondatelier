package com.cakmak.mondatelier.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

public class UploadImage {

    public static String upload(MultipartFile imageFile, String uploadDir, String uploadSubDir) {
        try {
            String originalName = Objects.requireNonNull(imageFile.getOriginalFilename());
            String extension = "";

            int dotIndex = originalName.lastIndexOf('.');
            if (dotIndex >= 0) {
                extension = originalName.substring(dotIndex); // includes the "."
                originalName = originalName.substring(0, dotIndex);
            }

            String safeBase = originalName.replaceAll("[^A-Za-z]", "");

            String fileName = System.currentTimeMillis() + "_" + safeBase + extension;

            Path uploadPath = Paths.get(uploadDir, uploadSubDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image file", e);
        }
    }

}
