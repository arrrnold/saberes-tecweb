drop database if exists car_voting;
CREATE DATABASE car_voting;
USE car_voting;

CREATE TABLE cars
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    # image in base64
    image      TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE votes
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    car_id     INT NOT NULL,
    vote_count INT       DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars (id)
);