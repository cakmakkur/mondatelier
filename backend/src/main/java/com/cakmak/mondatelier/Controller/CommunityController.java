package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Service.CommunityService;
import com.cakmak.mondatelier.dto.CommunityDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/community")
public class CommunityController {

    private CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping("/top")
    public ResponseEntity<List<CommunityDto>> getTopCommunities() {
        return ResponseEntity.ok().body(communityService.getTopCommunities());
    }
}
