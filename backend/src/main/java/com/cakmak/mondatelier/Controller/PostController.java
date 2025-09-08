package com.cakmak.mondatelier.Controller;


import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Service.PostService;
import com.cakmak.mondatelier.dto.PostDto;
import com.cakmak.mondatelier.util.AuthUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/post")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // returns most recent 10 (defined currently in the repository) posts
    // after the last post sent in the feed
    @GetMapping("/recent")
    public ResponseEntity<List<PostDto>> getRecentPosts(
            @RequestParam(required = false) String lastCreatedAt,
            @RequestParam(required = false) Long lastId)
    {
        String iso = lastCreatedAt.replace("Z", "");
        LocalDateTime lastCreatedAtLDT = LocalDateTime.parse(iso);

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

}
