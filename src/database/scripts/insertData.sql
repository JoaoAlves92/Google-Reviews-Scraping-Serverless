INSERT INTO reviews (
    author_name,
    language,
    original_language,
    rating,
    relative_time_description,
    text,
    time
) VALUES (
    'Apostolos Mintzis (Apo)',
    'en',
    'en',
    5,
    'a year ago',
    'The nutella sonho is by far the best sweet in a 1km radius. 😋😋 It’s like a donut filled with nutella and glazed with sugar. One is never enough.',
    TIMESTAMP 'epoch' + 1659292341 * INTERVAL '1 second'
);