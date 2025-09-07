package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.community.PostMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostMediaRepository extends JpaRepository<PostMedia, Long> {
    PostMedia findByPostId(Long postId);
}
