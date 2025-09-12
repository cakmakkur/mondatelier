package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Exception.CommunityNotFoundException;
import com.cakmak.mondatelier.Exception.PostNotFoundException;
import com.cakmak.mondatelier.Exception.ProfileNotFoundException;
import com.cakmak.mondatelier.Model.Profile;
import com.cakmak.mondatelier.Model.community.Community;
import com.cakmak.mondatelier.Model.community.CommunityProfile;
import com.cakmak.mondatelier.Model.community.Post;
import com.cakmak.mondatelier.Model.community.PostMedia;
import com.cakmak.mondatelier.Repository.CommunityProfileRepository;
import com.cakmak.mondatelier.Repository.CommunityRepository;
import com.cakmak.mondatelier.Repository.PostMediaRepository;
import com.cakmak.mondatelier.Repository.PostRepository;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.PostDto;
import jakarta.transaction.Transactional;
import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Service
public class PostService {

    private final PostRepository postRepository;
    private final CommunityProfileRepository communityProfileRepository;
    private final CommunityRepository communityRepository;

    private final int FEED_LIMIT = 15;
    private final PostMediaRepository postMediaRepository;


    public PostService(
            PostRepository postRepository,
            CommunityProfileRepository communityProfileRepository,
            CommunityRepository communityRepository, PostMediaRepository postMediaRepository) {
        this.postRepository = postRepository;
        this.communityProfileRepository = communityProfileRepository;
        this.communityRepository = communityRepository;
        this.postMediaRepository = postMediaRepository;
    }

    public List<PostDto> getRecentPosts(
            LocalDateTime lastCreatedAt,
            Long lastId) {

        List<Post> nextBatch;

        if (lastId == null || lastCreatedAt == null) {
            nextBatch = postRepository.findFirstBatchOfRecentPosts(FEED_LIMIT);
        } else {
            nextBatch = postRepository.findNextBatchOfRecentPosts(lastCreatedAt, lastId, FEED_LIMIT);
        }

        if(nextBatch.isEmpty()) throw new PostNotFoundException();

        List<PostDto> postDtos = new ArrayList<>();
        for (Post post : nextBatch) {
            postDtos.add(DTOMappers.toPostDTO(post));
        }

        return postDtos;
    }

    public List<PostDto> getPostsFromMyCommunities(

            String profileId,
            Long lastId,
            LocalDateTime lastCreatedAt) {


        List<CommunityProfile> communities = communityProfileRepository.findByProfile_Id(profileId);

        List<Long> communityIds = communities.stream()
                .map(cp -> cp.getCommunity().getId())
                .toList();

        List<Post> nextBatch = new ArrayList<>();

        // if user follows communities and requests the first batch of posts
        if (!communities.isEmpty() && (lastId == 0 || lastCreatedAt == null)) {
            for (Long communityId : communityIds) {
                nextBatch.addAll(postRepository.findFirstBatchOfPostsFromMyCommunities(
                        communityId,
                        FEED_LIMIT
                ));
            }
        }
        // if user follows communities and requests the subsequent batch of posts
        else if (!communities.isEmpty()) {
            for (Long communityId : communityIds) {
                nextBatch.addAll(postRepository.findNextBatchOfPostsFromMyCommunities(
                        communityId,
                        lastCreatedAt,
                        lastId,
                        FEED_LIMIT
                ));
            }
        }

        if (nextBatch.isEmpty()) throw new PostNotFoundException();

        return nextBatch.stream()
                .map(DTOMappers::toPostDTO)
                .toList();
    }

    public PostDto getPostById(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(PostNotFoundException::new);
        return DTOMappers.toPostDTO(post);
    }

    public List<PostDto> getPostsByCommunity(Long communityId, Long lastId, LocalDateTime lastCreatedAt) {
        Community c = communityRepository.findById(communityId).orElse(null);
        if (c == null) throw new CommunityNotFoundException();

        List<Post> posts = postRepository.findByCommunity(c);
        if (posts.isEmpty()) throw new PostNotFoundException();

        List<PostDto> postDtos = new ArrayList<>();
        for (Post post : posts) {
            postDtos.add(DTOMappers.toPostDTO(post));
        }

        return postDtos;
    }

    @Transactional
    public Page<PostDto> query(String query, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Page<Post> posts = postRepository.findByTitleContainingIgnoreCase(query, pageable);

        if (posts.isEmpty()) {
            throw new PostNotFoundException("Post not found");
        }

        return posts.map(DTOMappers::toPostDTO);
    }

    @Transactional
    public void createNewPost(Profile profile, PostDto postDto, List<MultipartFile> files) {

        if (!profile.getId().equals(postDto.profileId())) {
            throw new ProfileNotFoundException();
        }

        Community community = communityRepository.findById(postDto.communityId()).orElseThrow(CommunityNotFoundException::new);

        // TODO: process the media here
        PostMedia postMedia = new PostMedia();
        postMedia = null;

        Post newPost = new Post();

        if (postDto.parentPostId() != null) {
            Post parent = postRepository.findById(postDto.parentPostId()).orElse(null);
            newPost.setParent(parent);
        }

        newPost.setTitle(postDto.title());
        newPost.setContent(postDto.content());
        newPost.setProfile(profile);
        newPost.setCommunity(community);
        newPost.getPostMediaList().add(postMedia);

        postRepository.save(newPost);
        // postMediaRepository.save(postMedia);
    }

    @Transactional
    public void deletePost(String profileId, PostDto postDto) {
        Post post = postRepository.findById(postDto.id()).orElseThrow(PostNotFoundException::new);

        if (!postDto.profileId().equals(profileId)) {
            throw new ProfileNotFoundException();
        }

        postRepository.delete(post);
    }
}
