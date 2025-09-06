package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Model.community.Post;
import com.cakmak.mondatelier.Repository.PostRepository;
import com.cakmak.mondatelier.dto.CommunityDto;
import com.cakmak.mondatelier.dto.PostDto;
import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    private PostRepository postRepository;

    private List<Post> feed = new ArrayList<>();

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Scheduled(cron = "0 */10 * * * *")
    public void updateTopCommunities() {
        List<Post> recentPosts = postRepository.findMostRecent200Posts();
        this.feed.clear();
        this.feed.addAll(recentPosts);
    }


/*
    public Page<PostDto> getPostFeed(String profileId, int page, int size) {
        List<Post> sortedFeed = new ArrayList<>(feed);

        sortedFeed.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

        int start = page * size;
        int end = Math.min(start + size, sortedFeed.size());
        if (start > end) {
            return new PageImpl<>(new ArrayList<>(), PageRequest.of(page, size), sortedFeed.size());
        }

        List<PostDto> pageContent = sortedFeed.subList(start, end).stream()
                .map(post -> new PostDto(post)) // map Post -> PostDto
                .toList();

        Pageable pageable = PageRequest.of(page, size);
        return new PageImpl<>(pageContent, pageable, sortedFeed.size());
    }
*/

}
