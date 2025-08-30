package com.cakmak.mondatelier.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

public class UploadImage {

    // returns the name of the saved file
    public static String upload(MultipartFile imageFile, String uploadDir, String uploadSubDir) {
        try {
            String fileName = System.currentTimeMillis() + "_" + Objects.requireNonNull(imageFile.getOriginalFilename()).replaceAll("[^A-Za-z]", "");;
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
