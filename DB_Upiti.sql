CREATE DATABASE IF NOT EXISTS trailsync;
USE trailsync;

CREATE TABLE `ascents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `trail_id` int NOT NULL,
  `datum` date NOT NULL,
  `trajanje_min` int NOT NULL,
  `napomena` text,
  `ocena` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ascent_user` (`user_id`),
  KEY `fk_ascent_trail` (`trail_id`),
  CONSTRAINT `fk_ascent_trail` FOREIGN KEY (`trail_id`) REFERENCES `trails` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ascent_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `hike_participants` (
  `hike_id` int NOT NULL,
  `user_id` int NOT NULL,
  `status` enum('invited','confirmed','declined') NOT NULL DEFAULT 'invited',
  `responded_at` datetime DEFAULT NULL,
  PRIMARY KEY (`hike_id`,`user_id`),
  KEY `fk_hike_participants_user` (`user_id`),
  CONSTRAINT `fk_hike_participants_hike` FOREIGN KEY (`hike_id`) REFERENCES `hikes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_hike_participants_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `hikes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `organizator_id` int NOT NULL,
  `trail_id` int NOT NULL,
  `naziv` varchar(120) NOT NULL,
  `opis` text,
  `datum_vreme` datetime NOT NULL,
  `maksimalan_broj_ucesnika` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_hikes_user` (`organizator_id`),
  KEY `fk_hikes_trail` (`trail_id`),
  CONSTRAINT `fk_hikes_trail` FOREIGN KEY (`trail_id`) REFERENCES `trails` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_hikes_user` FOREIGN KEY (`organizator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `mountains` (
  `id` int NOT NULL AUTO_INCREMENT,
  `naziv` varchar(100) NOT NULL,
  `drzava` varchar(100) NOT NULL,
  `region` varchar(100) DEFAULT NULL,
  `visina` int NOT NULL,
  `opis` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `naziv` (`naziv`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `terrain_tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `naziv` varchar(50) NOT NULL,
  `opis` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `naziv` (`naziv`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `trail_tags` (
  `trail_id` int NOT NULL,
  `terrain_tag_id` int NOT NULL,
  PRIMARY KEY (`trail_id`,`terrain_tag_id`),
  KEY `terrain_tag_id` (`terrain_tag_id`),
  CONSTRAINT `trail_tags_ibfk_1` FOREIGN KEY (`trail_id`) REFERENCES `trails` (`id`) ON DELETE CASCADE,
  CONSTRAINT `trail_tags_ibfk_2` FOREIGN KEY (`terrain_tag_id`) REFERENCES `terrain_tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `trails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mountain_id` int NOT NULL,
  `naziv` varchar(100) NOT NULL,
  `opis` text,
  `duzina_km` decimal(6,2) NOT NULL,
  `tezina` enum('easy','moderate','hard','expert') NOT NULL,
  `trajanje_min` int NOT NULL,
  `visinski_uspon_m` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `slika_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_trails_mountain` (`mountain_id`),
  CONSTRAINT `fk_trails_mountain` FOREIGN KEY (`mountain_id`) REFERENCES `mountains` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_trails` (
  `user_id` int NOT NULL,
  `trail_id` int NOT NULL,
  `status` enum('want_to_hike','completed') NOT NULL DEFAULT 'want_to_hike',
  `added_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`trail_id`),
  KEY `fk_user_trails_trail` (`trail_id`),
  CONSTRAINT `fk_user_trails_trail` FOREIGN KEY (`trail_id`) REFERENCES `trails` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_trails_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `korisnickoIme` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `lozinka` varchar(255) NOT NULL,
  `uloga` varchar(20) NOT NULL DEFAULT 'hiker',
  `ime` varchar(50) NOT NULL,
  `prezime` varchar(50) NOT NULL,
  `bio` text,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `korisnickoIme` (`korisnickoIme`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
