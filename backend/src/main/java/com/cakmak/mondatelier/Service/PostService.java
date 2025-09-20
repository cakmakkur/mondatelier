package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Exception.CommunityNotFoundException;
import com.cakmak.mondatelier.Exception.PostNotFoundException;
import com.cakmak.mondatelier.Exception.ProfileNotFoundException;
import com.cakmak.mondatelier.Model.Profile;
import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Model.community.*;
import com.cakmak.mondatelier.Repository.*;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.PostDto;
import jakarta.transaction.Transactional;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Getter
@Service
public class PostService {

    private final PostLikesRepository postLikesRepository;
    @Value("${app.community.feed-limit}")
    private int FEED_LIMIT;

    @Value("${app.community.comment-limit}")
    private int COMMENT_LIMIT;

    private final PostRepository postRepository;
    private final CommunityProfileRepository communityProfileRepository;
    private final CommunityRepository communityRepository;
    private final PostMediaRepository postMediaRepository;


    public PostService(
            PostRepository postRepository,
            CommunityProfileRepository communityProfileRepository,
            CommunityRepository communityRepository, PostMediaRepository postMediaRepository, PostLikesRepository postLikesRepository) {
        this.postRepository = postRepository;
        this.communityProfileRepository = communityProfileRepository;
        this.communityRepository = communityRepository;
        this.postMediaRepository = postMediaRepository;
        this.postLikesRepository = postLikesRepository;
    }

    public List<PostDto> getRecentPosts(
            String lastCreatedAt,
            Long lastId) {

        List<Post> nextBatch;

        LocalDateTime lastCreatedAtLDT = null;
        if (!lastCreatedAt.isEmpty() && !lastCreatedAt.isBlank()) {
            String iso = lastCreatedAt.replace("Z", "");
            lastCreatedAtLDT = LocalDateTime.parse(iso);
        }

        if (lastId == 0 || lastCreatedAtLDT == null) {
            nextBatch = postRepository.findFirstBatchOfRecentPosts(FEED_LIMIT);
        } else {
            nextBatch = postRepository.findNextBatchOfRecentPosts(lastCreatedAtLDT, lastId, FEED_LIMIT);
        }

        if(nextBatch.isEmpty()) throw new PostNotFoundException();

        return nextBatch.stream()
                .map(DTOMappers::toPostDTO)
                .toList();
    }

    public List<PostDto> getPostsFromMyCommunities(

            String profileId,
            Long lastId,
            String lastCreatedAt) {

        LocalDateTime lastCreatedAtLDT = null;
        if (!lastCreatedAt.isEmpty() && !lastCreatedAt.isBlank()) {
            String iso = lastCreatedAt.replace("Z", "");
            lastCreatedAtLDT = LocalDateTime.parse(iso);
        }

        List<CommunityProfile> communities = communityProfileRepository.findByProfile_Id(profileId);
        if (communities.isEmpty()) throw new CommunityNotFoundException();

        List<Long> communityIds = communities.stream()
                .map(cp -> cp.getCommunity().getId())
                .toList();

        List<Post> nextBatch = new ArrayList<>();

        if (lastId == 0 || lastCreatedAtLDT == null) {
            for (Long communityId : communityIds) {
                nextBatch.addAll(postRepository.findFirstBatchOfPostsByCommunity(
                        communityId,
                        FEED_LIMIT
                ));
            }
        }
        else {
            for (Long communityId : communityIds) {
                nextBatch.addAll(postRepository.findNextBatchOfPostsByCommunity(
                        communityId,
                        lastCreatedAtLDT,
                        lastId,
                        FEED_LIMIT
                ));
            }
        }

        if (nextBatch.isEmpty()) throw new PostNotFoundException();


        nextBatch.sort(Comparator
                .comparing(Post::getCreatedAt)
                .thenComparing(Post::getId)
                .reversed());

        return nextBatch.stream()
                .map(DTOMappers::toPostDTO)
                .toList();
    }

    public PostDto getPostById(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(PostNotFoundException::new);
        return DTOMappers.toPostDTO(post);
    }

    public List<PostDto> getPostsByCommunity(
            Long communityId,
            Long lastId,
            String lastCreatedAt) {

        List<Post> nextBatch;

        LocalDateTime lastCreatedAtLDT = null;
        if (!lastCreatedAt.isEmpty() && !lastCreatedAt.isBlank()) {
            String iso = lastCreatedAt.replace("Z", "");
            lastCreatedAtLDT = LocalDateTime.parse(iso);
        }

        if (lastId == 0 || lastCreatedAtLDT == null) {
            nextBatch = postRepository.findFirstBatchOfPostsByCommunity(communityId, COMMENT_LIMIT);
        } else {
            nextBatch = postRepository.findNextBatchOfPostsByCommunity(communityId, lastCreatedAtLDT, lastId, COMMENT_LIMIT);
        }

        if (nextBatch.isEmpty()) throw new PostNotFoundException();

        return nextBatch.stream()
                .map(DTOMappers::toPostDTO)
                .toList();
    }

    public List<PostDto> getComments (
            Long postId,
            Long lastId,
            String lastCreatedAt) {

        List<Post> nextBatch;

        LocalDateTime lastCreatedAtLDT = null;
        if (!lastCreatedAt.isEmpty() && !lastCreatedAt.isBlank()) {
            String iso = lastCreatedAt.replace("Z", "");
            lastCreatedAtLDT = LocalDateTime.parse(iso);
        }

        if (lastId == 0 || lastCreatedAtLDT == null) {
            nextBatch = postRepository.getFirstBatchOfComments(postId, COMMENT_LIMIT);
        } else {
            nextBatch = postRepository.getNextBatchOfComments(postId, lastId, lastCreatedAtLDT, COMMENT_LIMIT);
        }

        if (nextBatch.isEmpty()) throw new PostNotFoundException();

        return nextBatch.stream()
                .map(DTOMappers::toPostDTO)
                .toList();
    }

    @Transactional
    public Page<PostDto> query(
            String query,
            int pageNumber,
            int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Page<Post> posts = postRepository.findByTitleContainingIgnoreCase(query, pageable);

        if (posts.isEmpty()) throw new PostNotFoundException();

        return posts.map(DTOMappers::toPostDTO);
    }

    @Transactional
    public void createNewPost(
            Profile profile,
            PostDto postDto,
            List<MultipartFile> files) {

        if (!profile.getId().equals(postDto.profileId())) {
            throw new ProfileNotFoundException();
        }

        Community community = communityRepository.findById(postDto.communityDto().id()).orElseThrow(CommunityNotFoundException::new);

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


    @Transactional
    public void likePost(Long postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(PostNotFoundException::new);

        Profile profile = user.getProfile();

        PostLikes plExists = postLikesRepository.findByProfile_IdAndPost_Id(profile.getId(), post.getId());
        if (plExists != null) {
            throw new RuntimeException("Like already exists");
        }

        PostLikes pl = new PostLikes();
        pl.setProfile(profile);
        pl.setPost(post);

        post.getPostLikes().add(pl);
        profile.getPostLikes().add(pl);
        postLikesRepository.save(pl);
    }

    @Transactional
    public void unlikePost(Long postId, User user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(PostNotFoundException::new);

        Profile profile = user.getProfile();

        PostLikes pl = postLikesRepository.findByProfile_IdAndPost_Id(profile.getId(), post.getId());

        if (pl == null) {
            throw new RuntimeException("Post like already does not exists");
        }

        profile.getPostLikes().remove(pl);
        post.getPostLikes().remove(pl);

        postLikesRepository.delete(pl);
    }

    public List<Long> getMyLikes(User user) {
        Profile profile = user.getProfile();

        List<PostLikes> postLikes = postLikesRepository.findByProfile_Id(profile.getId());
        List<Long> likedPostIds = new ArrayList<>();

        for (PostLikes postLike : postLikes) {
            likedPostIds.add(postLike.getPost().getId());
        }

        return likedPostIds;
    }
}
