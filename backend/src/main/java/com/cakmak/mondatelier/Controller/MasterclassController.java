package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Service.MasterclassService;
import com.cakmak.mondatelier.dto.MasterclassDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/masterclass")
public class MasterclassController {

    private final MasterclassService masterclassService;

    public MasterclassController(MasterclassService masterclassService) {
        this.masterclassService = masterclassService;
    }

    @GetMapping
    public ResponseEntity<List<MasterclassDTO>> getMasterclass(
            @RequestParam(required = false) String profileId,
            @RequestParam(required = false) String masterclassId
    ) {
        return ResponseEntity.ok(masterclassService.getMasterclass(profileId, masterclassId));
    }
}
