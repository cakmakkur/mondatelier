package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Service.MasterclassService;
import com.cakmak.mondatelier.dto.MasterclassDTO;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/masterclasses")
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

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createEvent(
            @RequestPart("masterclass") MasterclassDTO masterClassDTO,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        masterclassService.createMasterclass(masterClassDTO, imageFile);
        return ResponseEntity.ok().build();
    }
}
