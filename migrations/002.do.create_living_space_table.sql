CREATE TABLE living_space (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    type TEXT NOT NULL,
    street_address TEXT NOT NULL,
    apt_num TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'USA' NOT NULL,
    zip_code TEXT NOT NULL,
    ac TEXT,
    cable TEXT,
    wifi TEXT,
    pets TEXT,
    parking TEXT [],
    price TEXT,
    deposit TEXT,
    bedrooms TEXT,
    bathrooms TEXT,
    squareft TEXT,
    washer TEXT,
    dryer TEXT,
    comments TEXT,
    posted BOOLEAN DEFAULT FALSE NOT NULL,
    lat DECIMAL,
    lng DECIMAL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_last_modified TIMESTAMP,
    email TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    images TEXT [],
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL
);