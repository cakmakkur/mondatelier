package com.cakmak.mondatelier.task;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;

@Component
@Profile("test")
public class ResetTestDbRunner implements CommandLineRunner {

    @Value("${project.basedir:.}") // fallback to current dir if not set
    private String projectBaseDir;

    @Override
    public void run(String... args) throws IOException, InterruptedException {
        File scriptFile = new File(projectBaseDir, "reset-test-db.sh");
        ProcessBuilder pb = new ProcessBuilder("bash", scriptFile.getAbsolutePath());
        pb.inheritIO();
        Process process = pb.start();
        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("reset-test-db.sh failed with exit code " + exitCode);
        }
    }
}