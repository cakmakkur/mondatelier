package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Service.FreelanceService;
import com.cakmak.mondatelier.dto.FreelanceDTO;
import com.cakmak.mondatelier.util.AuthUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/freelance")
public class FreelanceController {

    private final FreelanceService freelanceService;

    public FreelanceController(FreelanceService freelanceService) {
        this.freelanceService = freelanceService;
    }

    @GetMapping
    public ResponseEntity<List<FreelanceDTO>> getFreelance(
            @RequestParam(required = false) String profileId,
            @RequestParam(required = false) String freelanceId) {
        return ResponseEntity.ok(freelanceService.getFreelance(
                profileId,
                freelanceId
        ));
    }

    @PostMapping
    public ResponseEntity<Void> createFreelance(@RequestBody FreelanceDTO freelanceDTO) {
        User currentUser = AuthUtil.getCurrentUser();
        freelanceService.createFreelance(freelanceDTO, currentUser.getProfile());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
