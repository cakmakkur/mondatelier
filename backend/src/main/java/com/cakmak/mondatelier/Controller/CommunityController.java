package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Service.CommunityService;
import com.cakmak.mondatelier.dto.CommunityDto;
import com.cakmak.mondatelier.util.AuthUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/community")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityDto> getCommunityById(@PathVariable Long id) {
        CommunityDto dto = communityService.getCommunityById(id);
        return ResponseEntity.ok().body(dto);
    }

    @GetMapping("/top")
    public ResponseEntity<List<CommunityDto>> getTopCommunities() {
        return ResponseEntity.ok().body(communityService.getTopCommunities());
    }

    @GetMapping("/me")
    public ResponseEntity<List<CommunityDto>> getMeCommunities() {
        User currentUser = AuthUtil.getCurrentUser();

        List<CommunityDto> response = communityService.getMyCommunities(currentUser.getProfile().getId());
        return ResponseEntity.ok().body(response);
    }
}
