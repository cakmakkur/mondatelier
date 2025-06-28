DROP TABLE IF EXISTS users;

CREATE TABLE users (
                       id TEXT PRIMARY KEY,
                       email VARCHAR(255),
                       password VARCHAR(255),
                       created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                       active BOOLEAN NOT NULL DEFAULT TRUE
);