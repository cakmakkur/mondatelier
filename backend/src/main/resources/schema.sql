DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS art_types;

CREATE TABLE users (
                       id TEXT PRIMARY KEY,
                       email VARCHAR(255),
                       password VARCHAR(255),
                       created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                       active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE art_types (
                     id SERIAL PRIMARY KEY,
                     category VARCHAR(50) NOT NULL,
                     name VARCHAR(100) NOT NULL
);
