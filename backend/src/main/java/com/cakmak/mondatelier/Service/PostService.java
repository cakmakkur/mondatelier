package com.cakmak.mondatelier.Service;

import com.cakmak.mondatelier.Exception.types.CommunityNotFoundException;
import com.cakmak.mondatelier.Exception.types.PostNotFoundException;
import com.cakmak.mondatelier.Exception.types.ProfileNotFoundException;
import com.cakmak.mondatelier.Exception.types.UserProfileMismatchException;
import com.cakmak.mondatelier.Model.Profile;
import com.cakmak.mondatelier.Model.User;
import com.cakmak.mondatelier.Model.community.*;
import com.cakmak.mondatelier.Repository.*;
import com.cakmak.mondatelier.converter.DTOMappers;
import com.cakmak.mondatelier.dto.NewPostDto;
import com.cakmak.mondatelier.dto.PostDto;
import com.cakmak.mondatelier.util.UploadImage;
import jakarta.transaction.Transactional;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Getter
@Service
public class PostService {

    private final PostLikesRepository postLikesRepository;
    @Value("${app.community.feed-limit}")
    private int FEED_LIMIT;

    @Value("${app.community.comment-limit}")
    private int COMMENT_LIMIT;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private final PostRepository postRepository;
    private final CommunityRepository communityRepository;
    private final PostMediaRepository postMediaRepository;


    public PostService(
            PostRepository postRepository,
            CommunityRepository communityRepository, PostMediaRepository postMediaRepository, PostLikesRepository postLikesRepository) {
        this.postRepository = postRepository;
        this.communityRepository = communityRepository;
        this.postMediaRepository = postMediaRepository;
        this.postLikesRepository = postLikesRepository;
    }

    public List<PostDto> getRecentPosts(
            String lastCreatedAt,
            Long lastId) {

        List<Post> nextBatch;

        LocalDateTime lastCreatedAtLDT = parseCursorDate(lastCreatedAt);

        if (isFirstPage(lastId, lastCreatedAtLDT)) {
            nextBatch = postRepository.findFirstBatchOfRecentPosts(FEED_LIMIT);
        } else {
            nextBatch = postRepository.findNextBatchOfRecentPosts(lastCreatedAtLDT, lastId, FEED_LIMIT);
        }

        return nextBatch.stream()
                .map(DTOMappers::toPostDTO)
                .toList();
    }

    public List<PostDto> getPostsFromMyCommunities(

            String profileId,
            Long lastId,
            String lastCreatedAt) {

        LocalDateTime lastCreatedAtLDT = parseCursorDate(lastCreatedAt);

        List<Post> nextBatch = isFirstPage(lastId, lastCreatedAtLDT)
                ? postRepository.findFirstBatchForProfile(profileId, FEED_LIMIT)
                : postRepository.findNextBatchForProfile(
                        profileId,
                        lastCreatedAtLDT,
                        lastId,
                        FEED_LIMIT);

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

        LocalDateTime lastCreatedAtLDT = parseCursorDate(lastCreatedAt);

        if (isFirstPage(lastId, lastCreatedAtLDT)) {
            nextBatch = postRepository.findFirstBatchOfPostsByCommunity(communityId, COMMENT_LIMIT);
        } else {
            nextBatch = postRepository.findNextBatchOfPostsByCommunity(communityId, lastCreatedAtLDT, lastId, COMMENT_LIMIT);
        }

        return nextBatch.stream()
                .map(DTOMappers::toPostDTO)
                .toList();
    }

    public List<PostDto> getComments (
            Long postId,
            Long lastId,
            String lastCreatedAt) {

        List<Post> nextBatch;

        LocalDateTime lastCreatedAtLDT = parseCursorDate(lastCreatedAt);

        if (isFirstPage(lastId, lastCreatedAtLDT)) {
            nextBatch = postRepository.getFirstBatchOfComments(postId, COMMENT_LIMIT);
        } else {
            nextBatch = postRepository.getNextBatchOfComments(postId, lastId, lastCreatedAtLDT, COMMENT_LIMIT);
        }

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

        return posts.map(DTOMappers::toPostDTO);
    }

    @Transactional
    public void createNewPost(
            Profile profile,
            NewPostDto newPostDto,
            List<MultipartFile> files) {

        if (!profile.getId().equals(newPostDto.profileId())) {
            throw new ProfileNotFoundException();
        }

        Community community = communityRepository.findById(newPostDto.communityId()).orElseThrow(CommunityNotFoundException::new);

        Post newPost = new Post();

        if (newPostDto.parentPostId() != null) {
            Post parent = postRepository.findById(newPostDto.parentPostId())
                    .orElseThrow(PostNotFoundException::new);
            if (!parent.getCommunity().getId().equals(community.getId())) {
                throw new IllegalArgumentException("Reply and parent post must belong to the same community");
            }
            newPost.setParent(parent);
            parent.setChildrenPostsAmount(valueOrZero(parent.getChildrenPostsAmount()) + 1);
        }

        newPost.setTitle(newPostDto.title());
        newPost.setContent(newPostDto.content());
        newPost.setProfile(profile);
        newPost.setCommunity(community);
        newPost.setChildrenPostsAmount(0);
        newPost.setLikesAmount(0);

        postRepository.save(newPost);

        if (files != null) {
            for (MultipartFile file : files) {
                if (file == null || file.isEmpty()) continue;
                String fileName = UploadImage.upload(file, uploadDir, "posts");
                PostMedia media = new PostMedia();
                media.setPost(newPost);
                media.setPath("/posts/" + fileName);
                postMediaRepository.save(media);
            }
        }
    }

    @Transactional
    public void deletePost(String profileId, PostDto postDto) {
        Post post = postRepository.findById(postDto.id()).orElseThrow(PostNotFoundException::new);

        if (!post.getProfile().getId().equals(profileId)) {
            throw new UserProfileMismatchException();
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

        postLikesRepository.save(pl);
        post.setLikesAmount(valueOrZero(post.getLikesAmount()) + 1);
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

        postLikesRepository.delete(pl);
        post.setLikesAmount(Math.max(0, valueOrZero(post.getLikesAmount()) - 1));
    }

    public List<PostDto> getMyLikes(User user) {
        Profile profile = user.getProfile();

        List<PostLikes> postLikes = postLikesRepository.findByProfile_Id(profile.getId());
        List<PostDto> postDtos = new ArrayList<>();
        for (PostLikes postLike : postLikes) {
            Post post = postLike.getPost();
            postDtos.add(DTOMappers.toPostDTO(post));
        }

        return postDtos;
    }

    private boolean isFirstPage(Long lastId, LocalDateTime lastCreatedAt) {
        return lastId == null || lastId == 0 || lastCreatedAt == null;
    }

    private LocalDateTime parseCursorDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        try {
            return OffsetDateTime.parse(value)
                    .withOffsetSameInstant(ZoneOffset.UTC)
                    .toLocalDateTime();
        } catch (DateTimeParseException ignored) {
            try {
                return LocalDateTime.parse(value);
            } catch (DateTimeParseException invalidCursor) {
                throw new IllegalArgumentException("Invalid feed cursor", invalidCursor);
            }
        }
    }

    private int valueOrZero(Integer value) {
        return value == null ? 0 : value;
    }
}
