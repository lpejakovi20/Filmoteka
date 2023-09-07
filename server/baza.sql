CREATE TABLE IF NOT EXISTS `tip_korisnika` (
  `id` INTEGER NOT NULL PRIMARY KEY,
  `naziv` varchar(50) NOT NULL,
  `opis` varchar(100) DEFAULT NULL,
  UNIQUE(`naziv`)
);

CREATE TABLE IF NOT EXISTS `korisnik` (
  `id` INTEGER NOT NULL PRIMARY KEY,
  `ime` varchar(50) DEFAULT NULL,
  `prezime` varchar(100) DEFAULT NULL,
  `korime` varchar(50) NOT NULL,
  `lozinka` text NOT NULL,
  `token` text NOT NULL,
  `email` varchar(100) NOT NULL,
  `blokiran` tinyint NOT NULL DEFAULT '0',
  `aktivacijski_kod` varchar(10) DEFAULT NULL,
  `aktivan` tinyint NOT NULL DEFAULT '0',
  `tip_korisnika_id` INTEGER NOT NULL,
  UNIQUE(`korime`),
  UNIQUE(`email`),
  FOREIGN KEY(`tip_korisnika_id`) REFERENCES `tip_korisnika`(`id`)
);

CREATE TABLE `film` (
  `id` INTEGER NOT NULL PRIMARY KEY,
  `naziv_filma` varchar(100) NOT NULL,
  `datum_unosa` date NOT NULL,
  `datum_premijere` date NOT NULL,
  `trajanje` INTEGER NOT NULL,
  `radnja` text NOT NULL,
  `ocjena` INTEGER NOT NULL,
  `budzet` INTEGER UNSIGNED NOT NULL,
  `prihod` INTEGER UNSIGNED NOT NULL,
  `za_odrasle` tinyint NOT NULL,
  `status` varchar(45) NOT NULL,
  `poster_putanja` varchar(200) NOT NULL,
  `izvorni_jezik` varchar(50) NOT NULL,
  `odobren` tinyint NOT NULL DEFAULT '0',
  `tagline` text NOT NULL,
  `korisnik_id` INTEGER NOT NULL,
  FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik`(`id`) 
);

CREATE TABLE `slika` (
  `id` INTEGER NOT NULL PRIMARY KEY,
  `naziv` varchar(100) NOT NULL,
  `putanja` varchar(200) NOT NULL,
  `korisnik_id` INTEGER NOT NULL,
  `film_id` INTEGER NOT NULL,
  FOREIGN KEY(`korisnik_id`) REFERENCES `korisnik`(`id`),
  FOREIGN KEY(`film_id`) REFERENCES `film`(`id`)
);

CREATE TABLE `zanr` (
  `id` INTEGER NOT NULL PRIMARY KEY,
  `naziv` varchar(45) NOT NULL,
  UNIQUE(`naziv`)
);

CREATE TABLE `zanr_filma` (
  `film_id` INTEGER NOT NULL,
  `zanr_id` INTEGER NOT NULL,
   PRIMARY KEY (`film_id`,`zanr_id`),
   FOREIGN KEY (`film_id`) REFERENCES `film`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
   FOREIGN KEY (`zanr_id`) REFERENCES `zanr`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO `tip_korisnika` (`id`, `naziv`, `opis`) VALUES
(1, 'admin', 'administrator');
INSERT INTO `tip_korisnika` (`id`, `naziv`, `opis`) VALUES
(2, 'korisnik', 'korisnik');


INSERT INTO `korisnik` (`id`, `ime`, `prezime`, `korime`, `lozinka`, `token`, `email`, `blokiran`, `aktivacijski_kod`, `aktivan`, `tip_korisnika_id`) VALUES
(26, 'Lovro', 'Pejakovic', 'lpejakovi20', '9fafcaec3e0ee42cbbec3d1f8154a146006e76c5bb7fb20c0614bde64fd913cf', 'ARAACCAAAAAAABRDAIAACAAAA5ARTAABAEAAEAAEAAAAAAAHAAAROCIABEAAAAAIAABRAAAAARAAMAAAAEBRAAAAA5BARARIAEAAAAA', 'hiwef76714@harcity.com', 0, NULL, 0, 1);
INSERT INTO `korisnik` (`id`, `ime`, `prezime`, `korime`, `lozinka`, `token`, `email`, `blokiran`, `aktivacijski_kod`, `aktivan`, `tip_korisnika_id`) VALUES
(44, 'pero', 'peric', 'pero', '9fafcaec3e0ee42cbbec3d1f8154a146006e76c5bb7fb20c0614bde64fd913cf', 'AABAACICAAARRCIGARAAICIDAADRAAZAA5DRAAZEAMAAKBZGAAERRAIJARERABRAAAEAGAACAZERAAZAARAAGBACAMAAAAAAAAARGCI', 'kererab637@dmtubes.com', 0, '89923', 1, 1);
INSERT INTO `korisnik` (`id`, `ime`, `prezime`, `korime`, `lozinka`, `token`, `email`, `blokiran`, `aktivacijski_kod`, `aktivan`, `tip_korisnika_id`) VALUES
(45, 'ivica', 'ivic', 'ivica', '9fafcaec3e0ee42cbbec3d1f8154a146006e76c5bb7fb20c0614bde64fd913cf', 'AZAAABRAAABAABRAARCRABACAAAAABRAAAAAAAIJAICRRAZAARBAACACAIARTAAFAICRAAAAAMAAABRBAAEAAARAAMAAMAZCARDREAA', 'kipoj35998@fgvod.com', 0, '30118', 1, 1);
INSERT INTO `korisnik` (`id`, `ime`, `prezime`, `korime`, `lozinka`, `token`, `email`, `blokiran`, `aktivacijski_kod`, `aktivan`, `tip_korisnika_id`) VALUES
(46, 'lucija', 'lucic', 'lucija', '9fafcaec3e0ee42cbbec3d1f8154a146006e76c5bb7fb20c0614bde64fd913cf', 'AAAATBZEAAAAAAAAAAARAAAAAACRRAAHA5AAAAAAARAARAAAA5CROAAIAAAAACIJAACAEAIEAMDRTAIAAADRMAAIAAAAAARGARBRECI', 'mobipe1325@harcity.com', 0, '38430', 1, 1);
INSERT INTO `korisnik` (`id`, `ime`, `prezime`, `korime`, `lozinka`, `token`, `email`, `blokiran`, `aktivacijski_kod`, `aktivan`, `tip_korisnika_id`) VALUES
(47, 'danijel', 'dmi', 'dmiter', '9fafcaec3e0ee42cbbec3d1f8154a146006e76c5bb7fb20c0614bde64fd913cf', 'ARBRTAAAAREAIBIFAAEAKAACAZAAKAACAZCREAAEAACAACADBAAAABABAABAABAABAAAAAAHAEERACAABAEAOBIEAMEAGAAFAZAAKAA', 'dacacap621@harcity.com', 0, '59811', 1, 1);
INSERT INTO `korisnik` (`id`, `ime`, `prezime`, `korime`, `lozinka`, `token`, `email`, `blokiran`, `aktivacijski_kod`, `aktivan`, `tip_korisnika_id`) VALUES
(53, 'Admin', 'Istrator', 'administrator', '0eb39c56862db09c5fb763bb2f92d28ec19e674bd6847a44594b74144ae74186', 'BEAARBZDAAAARAAAAAAAAAICAAERMAAAAAAAKAABA5DAICIIAAARAAAGAAAAAAIABECAEAIAAADRTBZJAABRAAZDAEDAIBIJAAEARBI', 'recake8118@klblogs.com', 0, '78257', 1, 1);
INSERT INTO `korisnik` (`id`, `ime`, `prezime`, `korime`, `lozinka`, `token`, `email`, `blokiran`, `aktivacijski_kod`, `aktivan`, `tip_korisnika_id`) VALUES
(54, 'Obi', 'Chan', 'obican', '906a472189a22ab504c0ab208135954cd5e2873d76ef5b1d3873b60b1ff06cdd', 'AAERIAABAEAAAAAAAAAREAAEBEAAAAIAAACARAAFAIAATBAHAAAAAAZABAAAKAACAEBAEAAEAAEAKARHBEAAABIAAADRACIAAEAAIAA', 'pilolah298@klblogs.com', 0, '31528', 1, 2);


INSERT INTO `film` (`id`, `naziv_filma`, `datum_unosa`, `datum_premijere`, `trajanje`, `radnja`, `ocjena`, `budzet`, `prihod`, `za_odrasle`, `status`, `poster_putanja`, `izvorni_jezik`, `odobren`, `tagline`, `korisnik_id`) VALUES
(19995, 'Avatar', '2022-11-08', '2009-12-15', 162, 'In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.', 8, 237000000, 2920357254, 0, 'Released', '/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg', 'en', 0, 'Enter the world of Pandora.', 47);
INSERT INTO `film` (`id`, `naziv_filma`, `datum_unosa`, `datum_premijere`, `trajanje`, `radnja`, `ocjena`, `budzet`, `prihod`, `za_odrasle`, `status`, `poster_putanja`, `izvorni_jezik`, `odobren`, `tagline`, `korisnik_id`) VALUES
(436270, 'Black Adam', '2022-11-08', '2022-10-19', 125, 'Nearly 5,000 years after he was bestowed with the almighty powers of the Egyptian gods—and imprisoned just as quickly—Black Adam is freed from his earthly tomb, ready to unleash his unique form of justice on the modern world.', 7, 200000000, 319000000, 0, 'Released', '/3zXceNTtyj5FLjwQXuPvLYK5YYL.jpg', 'en', 0, 'The world needed a hero. It got Black Adam.', 47);
INSERT INTO `film` (`id`, `naziv_filma`, `datum_unosa`, `datum_premijere`, `trajanje`, `radnja`, `ocjena`, `budzet`, `prihod`, `za_odrasle`, `status`, `poster_putanja`, `izvorni_jezik`, `odobren`, `tagline`, `korisnik_id`) VALUES
(507086, 'Jurassic World Dominion', '2022-11-08', '2022-06-01', 147, 'Four years after the destruction of Isla Nublar, Biosyn operatives attempt to track down Maisie Lockwood, while Dr Ellie Sattler investigates a genetically engineered swarm of giant insects.', 7, 165000000, 1001000000, 0, 'Released', '/kAVRgw7GgK1CfYEJq8ME6EvRIgU.jpg', 'en', 0, 'The epic conclusion of the Jurassic era.', 47);
INSERT INTO `film` (`id`, `naziv_filma`, `datum_unosa`, `datum_premijere`, `trajanje`, `radnja`, `ocjena`, `budzet`, `prihod`, `za_odrasle`, `status`, `poster_putanja`, `izvorni_jezik`, `odobren`, `tagline`, `korisnik_id`) VALUES
(616037, 'Thor: Love and Thunder', '2022-11-08', '2022-07-06', 119, 'After his retirement is interrupted by Gorr the God Butcher, a galactic killer who seeks the extinction of the gods, Thor Odinson enlists the help of King Valkyrie, Korg, and ex-girlfriend Jane Foster, who now wields Mjolnir as the Mighty Thor. Together they embark upon a harrowing cosmic adventure to uncover the mystery of the God Butcher’s vengeance and stop him before it’s too late.', 7, 250000000, 760000000, 0, 'Released', '/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg', 'en', 0, 'The one is not the only.', 47);
INSERT INTO `film` (`id`, `naziv_filma`, `datum_unosa`, `datum_premijere`, `trajanje`, `radnja`, `ocjena`, `budzet`, `prihod`, `za_odrasle`, `status`, `poster_putanja`, `izvorni_jezik`, `odobren`, `tagline`, `korisnik_id`) VALUES
(900667, 'ONE PIECE FILM RED', '2022-11-08', '2022-08-06', 115, 'Uta — the most beloved singer in the world. Her voice, which she sings with while concealing her true identity, has been described as “otherworldly.” She will appear in public for the first time at a live concert. As the venue fills with all kinds of Uta fans — excited pirates, the Navy watching closely, and the Straw Hats led by Luffy who simply came to enjoy her sonorous performance — the voice that the whole world has been waiting for is about to resound.', 7, 0, 141000000, 0, 'Released', '/m80kPdrmmtEh9wlLroCp0bwUGH0.jpg', 'ja', 0, 'An almighty voice. With fiery red locks.', 47);

SELECT * FROM `film`;
SELECT * FROM `zanr`;
SELECT * FROM `zanr_filma`;
SELECT * FROM `korisnik`;


INSERT INTO `zanr` (`id`, `naziv`) VALUES
(28, 'Action');
INSERT INTO `zanr` (`id`, `naziv`) VALUES
(12, 'Adventure');
INSERT INTO `zanr` (`id`, `naziv`) VALUES
(16, 'Animation');
INSERT INTO `zanr` (`id`, `naziv`) VALUES
(35, 'Comedy');
INSERT INTO `zanr` (`id`, `naziv`) VALUES
(14, 'Fantasy');
INSERT INTO `zanr` (`id`, `naziv`) VALUES
(878, 'Science Fiction');
INSERT INTO `zanr` (`id`, `naziv`) VALUES
(53, 'Thriller');

SELECT * FROM `zanr`;

SELECT * FROM film JOIN zanr_filma ON film.id = zanr_filma.film_id JOIN zanr ON zanr_filma.zanr_id = zanr.id;

INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(19995, 12);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(507086, 12);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(900667, 12);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(19995, 14);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(436270, 14);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(616037, 14);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(900667, 14);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(900667, 16);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(19995, 28);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(436270, 28);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(507086, 28);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(616037, 28);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(900667, 28);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(616037, 35);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(19995, 878);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(436270, 878);
INSERT INTO `zanr_filma` (`film_id`, `zanr_id`) VALUES
(507086, 878);


