CREATE TABLE images (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    url TEXT,
    image_name TEXT,
    user_id INTEGER NOT NULL,
    living_space_id INTEGER REFERENCES living_space(id) ON DELETE CASCADE NOT NULL
);