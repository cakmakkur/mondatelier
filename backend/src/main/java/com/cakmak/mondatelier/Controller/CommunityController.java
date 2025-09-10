package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Service.CommunityService;
import com.cakmak.mondatelier.dto.CommunityDto;
import com.cakmak.mondatelier.util.AuthUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/follow/{communityId}")
    public ResponseEntity<Void> followCommunity(@PathVariable Long communityId) {
        User user = AuthUtil.getCurrentUser();

        communityService.followCommunity(communityId, user);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/unfollow/{communityId}")
    public ResponseEntity<Void> unfollowCommunity(@PathVariable Long communityId) {
        User user = AuthUtil.getCurrentUser();

        communityService.unfollowCommunity(communityId, user);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<CommunityDto>> searchCommunities(
            @RequestParam String query,
            @RequestParam int page) {

        int PAGE_SIZE = 6;

        Page<CommunityDto> cp = communityService.query(query, page, PAGE_SIZE);

        return ResponseEntity.ok().body(cp);
    }
}
