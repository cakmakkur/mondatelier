package com.cakmak.mondatelier.util;

import com.cakmak.mondatelier.Model.Log;
import com.cakmak.mondatelier.Repository.LogRepository;
import com.cakmak.mondatelier.enums.LogTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Logger {

    private final LogRepository logRepository;

    @Autowired
    public Logger(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    public void log(LogTypes type, String message) {
        Log log = new Log();
        log.setType(type);
        log.setMessage(message);
        logRepository.save(log);
    }
}
