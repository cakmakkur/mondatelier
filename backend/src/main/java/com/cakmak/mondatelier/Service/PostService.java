package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Model.community.CommunityProfile;
import com.cakmak.mondatelier.Model.community.Post;
import com.cakmak.mondatelier.Repository.CommunityProfileRepository;
import com.cakmak.mondatelier.Repository.PostRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.PostDto;
import lombok.Getter;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Getter
@Service
public class PostService {

    private final PostRepository postRepository;
    private final CommunityProfileRepository communityProfileRepository;

    private List<Post> feed = new ArrayList<>();

    public PostService(
            PostRepository postRepository,
            CommunityProfileRepository communityProfileRepository) {
        this.postRepository = postRepository;
        this.communityProfileRepository = communityProfileRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        updateTopCommunities();
    }

    @Scheduled(cron = "0 */10 * * * *")
    public void updateTopCommunities() {
        List<Post> recentPosts = postRepository.findMostRecent200Posts();
        this.feed.clear();
        this.feed.addAll(recentPosts);
    }


    public Page<PostDto> getFeed(int page, int size) {
        List<Post> sortedFeed = new ArrayList<>(feed);

        sortedFeed.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

        int start = page * size;
        int end = Math.min(start + size, sortedFeed.size());
        if (start > end) {
            return new PageImpl<>(new ArrayList<>(), PageRequest.of(page, size), sortedFeed.size());
        }

        List<PostDto> pageContent = sortedFeed.subList(start, end).stream()
                .map(DTOMappers::toPostDTO)
                .toList();

        Pageable pageable = PageRequest.of(page, size);
        return new PageImpl<>(pageContent, pageable, sortedFeed.size());
    }

    public List<PostDto> getMyFeed(String profileId) {
        List<CommunityProfile> communities = communityProfileRepository.findByProfile_Id(profileId);

        List<Long> communityIds = communities.stream()
                .map(cp -> cp.getCommunity().getId())
                .toList();

        List<Post> posts = new ArrayList<>();
        for (Long communityId : communityIds) {
            posts.addAll(postRepository.findMostRecent25FromMyCommunities(communityId));
        }

        return posts.stream()
                .map(DTOMappers::toPostDTO)
                .toList();
    }

}
