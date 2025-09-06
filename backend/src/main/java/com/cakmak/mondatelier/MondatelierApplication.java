package com.cakmak.mondatelier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MondatelierApplication {

    public static void main(String[] args) {
        SpringApplication.run(MondatelierApplication.class, args);
    }

}
