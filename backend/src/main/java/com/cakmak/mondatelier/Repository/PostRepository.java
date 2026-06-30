package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.community.Post;
import com.cakmak.mondatelier.converter.CommunityPostCount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query(value = "SELECT community_id AS communityId, COUNT(*) AS postCount " +
            "FROM posts " +
            "GROUP BY community_id " +
            "ORDER BY postCount DESC " +
            "LIMIT 10", nativeQuery = true)
    List<CommunityPostCount> findTop10Communities();

    // find first page from all posts
    @Query(value = "SELECT * FROM posts " +
            "WHERE parent_post_id IS NULL " +
            "ORDER BY created_at DESC, id DESC LIMIT :limit", nativeQuery = true)
    List<Post> findFirstBatchOfRecentPosts(
            @Param("limit") int limit);

    // find subsequent pages from all posts
    @Query(value = "SELECT * FROM posts " +
            "WHERE parent_post_id IS NULL " +
            "AND (created_at < :lastCreatedAt " +
            "OR (created_at = :lastCreatedAt AND id < :lastId)) " +
            "ORDER BY created_at DESC, id DESC LIMIT :limit",
            nativeQuery = true)
    List<Post> findNextBatchOfRecentPosts(
            @Param("lastCreatedAt") LocalDateTime lastCreatedAt,
            @Param("lastId") Long lastId,
            @Param("limit") int limit
    );

    @Query(value = "SELECT DISTINCT p.* FROM posts p " +
            "JOIN community_profile cp ON cp.community_id = p.community_id " +
            "WHERE cp.profile_id = :profileId " +
            "AND p.parent_post_id IS NULL " +
            "ORDER BY p.created_at DESC, p.id DESC LIMIT :limit",
            nativeQuery = true)
    List<Post> findFirstBatchForProfile(
            @Param("profileId") String profileId,
            @Param("limit") int limit
    );

    @Query(value = "SELECT DISTINCT p.* FROM posts p " +
            "JOIN community_profile cp ON cp.community_id = p.community_id " +
            "WHERE cp.profile_id = :profileId " +
            "AND p.parent_post_id IS NULL " +
            "AND (p.created_at < :lastCreatedAt " +
            "OR (p.created_at = :lastCreatedAt AND p.id < :lastId)) " +
            "ORDER BY p.created_at DESC, p.id DESC LIMIT :limit",
            nativeQuery = true)
    List<Post> findNextBatchForProfile(
            @Param("profileId") String profileId,
            @Param("lastCreatedAt") LocalDateTime lastCreatedAt,
            @Param("lastId") Long lastId,
            @Param("limit") int limit
    );

    // find first page of parent by community
    @Query(value = "SELECT * FROM posts " +
            "WHERE (posts.community_id = :communityId)" +
            "AND parent_post_id IS NULL " +
            "ORDER BY created_at DESC, id DESC LIMIT :limit ", nativeQuery = true)
    List<Post> findFirstBatchOfPostsByCommunity(
            @Param("communityId") Long communityId,
            @Param("limit") int limit
    );

    // find subsequent pages of parent posts by communities
    @Query(value = "SELECT * FROM posts " +
            "WHERE community_id = :communityId " +
            "AND parent_post_id IS NULL " +
            "AND (created_at < :lastCreatedAt OR (created_at = :lastCreatedAt AND id < :lastId)) " +
            "ORDER BY created_at DESC, id DESC LIMIT :limit",
            nativeQuery = true)
    List<Post> findNextBatchOfPostsByCommunity(
            @Param("communityId") Long communityId,
            @Param("lastCreatedAt") LocalDateTime lastCreatedAt,
            @Param("lastId") Long lastId,
            @Param("limit") int limit
    );

    // find first page of child posts of by parent post
    @Query(value = "SELECT * FROM posts " +
            "WHERE parent_post_id = :postId " +
            "ORDER BY created_at DESC, id DESC LIMIT :limit",
            nativeQuery = true)
    List<Post> getFirstBatchOfComments(
            @Param("postId") Long postId,
            @Param("limit") int limit
    );

    // find subsequent pages of child posts of by parent post
    @Query(value =
            "SELECT * FROM posts " +
            "WHERE parent_post_id = :postId " +
            "AND (created_at < :lastCreatedAt OR (created_at = :lastCreatedAt AND id < :lastId)) " +
            "ORDER BY created_at DESC, id DESC LIMIT :limit",
            nativeQuery = true)
    List<Post> getNextBatchOfComments(
            @Param("postId") Long postId,
            @Param("lastId") Long lastId,
            @Param("lastCreatedAt") LocalDateTime lastCreatedAt,
            @Param("limit") int limit
    );

    Page<Post> findByTitleContainingIgnoreCase(String query, Pageable pageable);

}
