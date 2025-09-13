package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.community.Community;
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

    List<Post> findByCommunity(Community community);

    @Query(value = "SELECT community_id AS communityId, COUNT(*) AS postCount " +
            "FROM posts " +
            "GROUP BY community_id " +
            "ORDER BY postCount DESC " +
            "LIMIT 10", nativeQuery = true)
    List<CommunityPostCount> findTop10Communities();

    // find first page of recent parent posts
    @Query(value = "SELECT * FROM posts " +
            "WHERE parent_post_id IS NULL " +
            "ORDER BY created_at DESC, id DESC LIMIT :limit", nativeQuery = true)
    List<Post> findFirstBatchOfRecentPosts(
            @Param("limit") int limit);

    // old query that worked before
/*    @Query(value = "SELECT * FROM posts " +
            "WHERE created_at < :lastCreatedAt OR (created_at = :lastCreatedAt AND id < :lastId) " +
            "ORDER BY created_at DESC, id DESC LIMIT :limit", nativeQuery = true)*/

    // find subsequent pages of recent parent posts
    @Query(value = """
    SELECT *
    FROM posts
    WHERE parent_post_id IS NULL
      AND (
        created_at < :lastCreatedAt
        OR (created_at = :lastCreatedAt AND id < :lastId)
      )
    ORDER BY created_at DESC, id DESC
    LIMIT :limit
    """,
            nativeQuery = true
    )
    List<Post> findNextBatchOfRecentPosts(
            @Param("lastCreatedAt") LocalDateTime lastCreatedAt,
            @Param("lastId") Long lastId,
            @Param("limit") int limit
    );


    // find first page of parent posts from my communities
    @Query(value = "SELECT * FROM posts " +
            "WHERE (posts.community_id = :communityId)" +
            "AND parent_post_id IS NULL " +
            "ORDER BY created_at DESC, id DESC LIMIT :limit ", nativeQuery = true)
    List<Post> findFirstBatchOfPostsFromMyCommunities(
            @Param("communityId") Long communityId,
            @Param("limit") int limit
    );

    // find subsequent pages of parent posts from my communities
    @Query(value = "SELECT * FROM posts " +
            "WHERE community_id = :communityId " +
            "AND parent_post_id IS NULL " +
            "AND (created_at < :lastCreatedAt OR (created_at = :lastCreatedAt AND id < :lastId)) " +
            "ORDER BY created_at DESC, id DESC LIMIT :limit",
            nativeQuery = true)
    List<Post> findNextBatchOfPostsFromMyCommunities(
            @Param("communityId") Long communityId,
            @Param("lastCreatedAt") LocalDateTime lastCreatedAt,
            @Param("lastId") Long lastId,
            @Param("limit") int limit
    );

    Page<Post> findByTitleContainingIgnoreCase(String query, Pageable pageable);

    @Query(value = " SELECT * FROM posts p WHERE community_id = :communityId AND p.parent_post_id IS NULL ORDER BY created_at DESC ", nativeQuery = true)
    Page<Post> findByCommunityWithChildrenCount(@Param("communityId") Long communityId, Pageable pageable);

}
