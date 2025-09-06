package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.community.Community;
import com.cakmak.mondatelier.Model.community.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query(value = "SELECT community_id AS id, COUNT(*) AS postCount " +
            "FROM posts " +
            "GROUP BY community_id " +
            "ORDER BY postCount DESC " +
            "LIMIT 10", nativeQuery = true)
    List<Community> findTop10Communities();

    @Query(value = "SELECT * FROM posts ORDER BY created_at DESC LIMIT 200", nativeQuery = true)
    List<Post> findMostRecent200Posts();}
