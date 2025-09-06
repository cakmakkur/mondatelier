package com.cakmak.mondatelier.Controller;

import com.cakmak.mondatelier.Model.art.Artwork;
import com.cakmak.mondatelier.Model.community.Post;
import com.cakmak.mondatelier.Service.PostService;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.ArtworkDTO;
import com.cakmak.mondatelier.dto.CommunityDto;
import com.cakmak.mondatelier.dto.PostDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/post")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }


    @GetMapping("/feed/recent")
    public ResponseEntity<List<PostDto>> getRecentPosts() {

    }



}
