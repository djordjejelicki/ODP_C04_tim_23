CREATE DATABASE IF NOT EXISTS trailsync;
USE trailsync;

-- =========================
-- USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    korisnickoIme VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    lozinka VARCHAR(255) NOT NULL,
    uloga VARCHAR(20) NOT NULL DEFAULT 'hiker',
    ime VARCHAR(50) NOT NULL,
    prezime VARCHAR(50) NOT NULL,
    bio TEXT NULL,
    avatar_url VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- MOUNTAINS
-- =========================
CREATE TABLE IF NOT EXISTS mountains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL UNIQUE,
    drzava VARCHAR(100) NOT NULL,
    region VARCHAR(100) NULL,
    visina INT NOT NULL,
    opis TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TRAILS
-- =========================
CREATE TABLE IF NOT EXISTS trails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mountain_id INT NOT NULL,
    naziv VARCHAR(100) NOT NULL,
    opis TEXT NULL,
    duzina_km DECIMAL(6,2) NOT NULL,
    tezina VARCHAR(20) NOT NULL,
    trajanje_min INT NOT NULL,
    visinski_uspon_m INT NOT NULL,
    pocetna_tacka VARCHAR(100) NOT NULL,
    zavrsna_tacka VARCHAR(100) NOT NULL,
    signalizovana BOOLEAN NOT NULL DEFAULT FALSE,
    kruzna BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_trails_mountain
        FOREIGN KEY (mountain_id) REFERENCES mountains(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- =========================
-- TERRAIN TAGS
-- =========================
CREATE TABLE IF NOT EXISTS terrain_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    naziv VARCHAR(50) NOT NULL UNIQUE,
    opis TEXT NULL
);

-- =========================
-- TRAIL_TAGS (M:N trails <-> terrain_tags)
-- =========================
CREATE TABLE IF NOT EXISTS trail_tags (
    trail_id INT NOT NULL,
    terrain_tag_id INT NOT NULL,

    PRIMARY KEY (trail_id, terrain_tag_id),

    CONSTRAINT fk_trail_tags_trail
        FOREIGN KEY (trail_id) REFERENCES trails(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_trail_tags_terrain_tag
        FOREIGN KEY (terrain_tag_id) REFERENCES terrain_tags(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- USER_TRAILS (M:N users <-> trails)
-- =========================
CREATE TABLE IF NOT EXISTS user_trails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    trail_id INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'planned',
    added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT NULL,

    CONSTRAINT uq_user_trail UNIQUE (user_id, trail_id),

    CONSTRAINT fk_user_trails_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_user_trails_trail
        FOREIGN KEY (trail_id) REFERENCES trails(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- ASCENTS
-- =========================
CREATE TABLE IF NOT EXISTS ascents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    trail_id INT NOT NULL,
    datum_uspona DATE NOT NULL,
    trajanje_min INT NOT NULL,
    vremenski_uslovi VARCHAR(100) NULL,
    tezina_utisak VARCHAR(50) NULL,
    ocena INT NULL,
    beleska TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_ascents_ocena
        CHECK (ocena IS NULL OR (ocena BETWEEN 1 AND 5)),

    CONSTRAINT fk_ascents_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_ascents_trail
        FOREIGN KEY (trail_id) REFERENCES trails(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- =========================
-- HIKES
-- =========================
CREATE TABLE IF NOT EXISTS hikes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trail_id INT NOT NULL,
    organizator_id INT NOT NULL,
    naziv VARCHAR(100) NOT NULL,
    opis TEXT NULL,
    datum_vreme DATETIME NOT NULL,
    maksimalan_broj_ucesnika INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hikes_trail
        FOREIGN KEY (trail_id) REFERENCES trails(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_hikes_organizator
        FOREIGN KEY (organizator_id) REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- =========================
-- HIKE_PARTICIPANTS (M:N users <-> hikes)
-- =========================
CREATE TABLE IF NOT EXISTS hike_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hike_id INT NOT NULL,
    user_id INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'joined',
    joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_hike_participant UNIQUE (hike_id, user_id),

    CONSTRAINT fk_hike_participants_hike
        FOREIGN KEY (hike_id) REFERENCES hikes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_hike_participants_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =========================
-- AUDIT LOGS
-- =========================
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    akcija VARCHAR(100) NOT NULL,
    entitet VARCHAR(50) NOT NULL,
    entitet_id INT NOT NULL,
    detalji TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_logs_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);