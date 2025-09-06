CREATE TABLE communities (
                             id INT PRIMARY KEY,
                             name VARCHAR(120) UNIQUE NOT NULL,
                             description TEXT,
                             created_at TIMESTAMP DEFAULT NOW(),
                             logo_img_path TEXT,
                             profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE threads (
                         id INT PRIMARY KEY,
                         community_id INT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
                         profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
                         title VARCHAR(255) NOT NULL,
                         created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
                       id INT PRIMARY KEY,
                       thread_id INT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
                       profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
                       parent_post_id INT REFERENCES posts(id) ON DELETE CASCADE,
                       content TEXT NOT NULL,
                       created_at TIMESTAMP DEFAULT NOW(),
                       edited_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE votes (
                       id INT PRIMARY KEY,
                       profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
                       post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
                       vote SMALLINT NOT NULL,
                       created_at TIMESTAMP DEFAULT NOW(),
                       UNIQUE (profile_id, post_id)
);

CREATE INDEX idx_posts_thread_id ON posts(thread_id);

CREATE INDEX idx_votes_post_id ON votes(post_id);