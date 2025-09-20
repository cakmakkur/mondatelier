package com.cakmak.mondatelier.Repository;

import com.cakmak.mondatelier.Model.community.PostLikes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostLikesRepository extends JpaRepository<PostLikes, Long> {
    PostLikes findByProfile_IdAndPost_Id(String profile_Id, Long post_Id);
    List<PostLikes> findByProfile_Id(String profile_Id);
}
