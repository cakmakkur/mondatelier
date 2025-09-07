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

import java.util.List;

@RestController
@RequestMapping("/api/post")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/recent")
    public ResponseEntity<List<PostDto>> getRecentPosts(
            @RequestParam(defaultValue = "0") int page)
    {
        int defaultPageSize = 25;
        Page<PostDto> postPage = postService.getFeed(page, defaultPageSize);
        return ResponseEntity.ok(postPage.getContent());
    }

    @GetMapping("/me")
    public ResponseEntity<List<PostDto>> getMyPosts()
    {
        User user = AuthUtil.getCurrentUser();

        List<PostDto> postPage = postService.getMyFeed(user.getProfile().getId());
        return ResponseEntity.ok(postPage);

        // return also recent if myfeed is empty
    }

}
