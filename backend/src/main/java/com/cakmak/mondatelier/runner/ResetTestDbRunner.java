package com.cakmak.mondatelier.runner;

import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.boot.CommandLineRunner;

import java.io.*;
import java.nio.file.Files;

@Component
@Profile("test")
public class ResetTestDbRunner implements CommandLineRunner {

    @Override
    public void run(String... args) throws IOException, InterruptedException {
        ClassPathResource resource = new ClassPathResource("scripts/reset-test-db.sh");

        File tempScript = Files.createTempFile("reset-test-db", ".sh").toFile();
        try (InputStream in = resource.getInputStream();
             OutputStream out = new FileOutputStream(tempScript)) {
            in.transferTo(out);
        }
        tempScript.setExecutable(true);

        ProcessBuilder pb = new ProcessBuilder("bash", tempScript.getAbsolutePath());
        pb.inheritIO();
        Process process = pb.start();
        int exitCode = process.waitFor();

        tempScript.delete();

        if (exitCode != 0) {
            throw new RuntimeException("reset-test-db.sh failed with exit code " + exitCode);
        }
    }
}
