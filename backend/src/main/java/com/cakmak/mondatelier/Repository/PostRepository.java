package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.community.Post;
import com.cakmak.mondatelier.converter.CommunityPostCount;
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

    // First page
    @Query(value = "SELECT * FROM posts ORDER BY created_at DESC, id DESC LIMIT :limit", nativeQuery = true)
    List<Post> findFirstBatch(@Param("limit") int limit);

    // Subsequent pages
    @Query(value = "SELECT * FROM posts " +
            "WHERE created_at < :lastCreatedAt OR (created_at = :lastCreatedAt AND id < :lastId) " +
            "ORDER BY created_at DESC, id DESC LIMIT :limit", nativeQuery = true)
    List<Post> findNextBatch(
            @Param("lastCreatedAt") LocalDateTime lastCreatedAt,
            @Param("lastId") Long lastId,
            @Param("limit") int limit
    );


    @Query(
            value = "SELECT * FROM posts WHERE community_id = :communityId ORDER BY created_at DESC LIMIT 25",
            nativeQuery = true
    )    List<Post> findMostRecent25FromMyCommunities(@Param("communityId") Long communityId);


}
