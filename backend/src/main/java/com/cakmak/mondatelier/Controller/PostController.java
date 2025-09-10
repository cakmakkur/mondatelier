package com.cakmak.mondatelier.Controller;


import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Service.PostService;
import com.cakmak.mondatelier.dto.PostDto;
import com.cakmak.mondatelier.util.AuthUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/post")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("{id}")
    public PostDto getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    // returns most recent 15 posts
    // after the last post sent in the feed
    // limit is defined in the service method
    @GetMapping("/recent")
    public ResponseEntity<List<PostDto>> getRecentPosts(
            @RequestParam(required = false) String lastCreatedAt,
            @RequestParam(required = false) Long lastId)
    {
        LocalDateTime lastCreatedAtLDT = null;

        if (!lastCreatedAt.isEmpty() && !lastCreatedAt.isBlank()) {
            String iso = lastCreatedAt.replace("Z", "");
            lastCreatedAtLDT = LocalDateTime.parse(iso);
        }

        List<PostDto> posts = postService.getFeed(lastCreatedAtLDT, lastId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/me")
    public ResponseEntity<List<PostDto>> getMyPosts()
    {
        User user = AuthUtil.getCurrentUser();

        List<PostDto> posts = postService.getMyFeed(user.getProfile().getId());
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/by-community/{communityId}")
    public ResponseEntity<List<PostDto>> getMyPostsByCommunity(
            @PathVariable Long communityId) {
        List<PostDto> posts = postService.getByCommunityId(communityId);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostDto>> searchPosts(
            @RequestParam String query,
            @RequestParam int page) {

        int PAGE_SIZE = 6;

        Page<PostDto> cp = postService.query(query, page, PAGE_SIZE);

        return ResponseEntity.ok().body(cp);

    }

}
