package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Model.community.PostLikes;
import com.cakmak.mondatelier.Service.PostService;
import com.cakmak.mondatelier.dto.NewPostDto;
import com.cakmak.mondatelier.dto.PostDto;
import com.cakmak.mondatelier.util.AuthUtil;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/post")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/get-post/{id}")
    public PostDto getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<PostDto>> getRecentPosts(
            @RequestParam(required = false) String lastCreatedAt,
            @RequestParam(required = false) Long lastId
    )
    {
        List<PostDto> posts = postService.getRecentPosts(lastCreatedAt, lastId);
        return ResponseEntity.ok(posts);
    }


    @GetMapping("/from-my-communities")
    public ResponseEntity<List<PostDto>> getPostsFromMyCommunities(
            @RequestParam(required = false) String lastCreatedAt,
            @RequestParam(required = false) Long lastId
    )
    {
        User user = AuthUtil.getCurrentUser();

        List<PostDto> posts = postService.getPostsFromMyCommunities(user.getProfile().getId(), lastId, lastCreatedAt);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/by-community")
    public ResponseEntity<List<PostDto>> getPostsByCommunity(
            @RequestParam Long communityId,
            @RequestParam(required = false) Long lastId,
            @RequestParam(required = false) String lastCreatedAt ) {

        List<PostDto> posts = postService.getPostsByCommunity(communityId, lastId, lastCreatedAt);
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

    @GetMapping("comments")
    public ResponseEntity<List<PostDto>> getChildrenPosts(
            @RequestParam Long postId,
            @RequestParam(required = false) Long lastId,
            @RequestParam(required = false) String lastCreatedAt
    ) {

        List<PostDto> posts = postService.getComments(postId, lastId, lastCreatedAt);
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createPost(
            @RequestPart("post") NewPostDto newPost,
            @RequestPart(value="images", required = false) List<MultipartFile> files) {

        User user = AuthUtil.getCurrentUser();

        postService.createNewPost(user.getProfile(), newPost, files);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deletePost(@RequestBody PostDto postDto) {
        User user = AuthUtil.getCurrentUser();

        postService.deletePost(user.getProfile().getId(), postDto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/like/{postId}")
    public ResponseEntity<Void> followCommunity(@PathVariable Long postId) {
        User user = AuthUtil.getCurrentUser();

        postService.likePost(postId, user);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/unlike/{postId}")
    public ResponseEntity<Void> unfollowCommunity(@PathVariable Long postId) {
        User user = AuthUtil.getCurrentUser();

        postService.unlikePost(postId, user);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-liked")
    public ResponseEntity<List<PostDto>> getMyLikedPosts() {
        User user = AuthUtil.getCurrentUser();
        List<PostDto> likes = postService.getMyLikes(user);
        return ResponseEntity.ok(likes);
    }

}
