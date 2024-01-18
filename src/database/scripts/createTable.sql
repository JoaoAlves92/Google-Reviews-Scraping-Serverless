CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    author_name VARCHAR(255),
    language VARCHAR(10),
    original_language VARCHAR(10),
    rating INTEGER,
    relative_time_description VARCHAR(50),
    text TEXT,
    time TIMESTAMP
);
