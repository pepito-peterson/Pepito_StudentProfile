-- Database setup for the Student Profile app (Activity 7)
-- Run this once in MySQL Workbench (or the mysql command line) before starting the server.

CREATE DATABASE IF NOT EXISTS student_profile_db;
USE student_profile_db;

CREATE TABLE IF NOT EXISTS students (
    id              INT NOT NULL AUTO_INCREMENT,
    student_id      VARCHAR(50)  NOT NULL,
    email           VARCHAR(100) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,   -- bcrypt hash, never the plain password
    full_name       VARCHAR(100) NOT NULL,
    course          VARCHAR(100) NOT NULL,
    year_level      VARCHAR(20)  NOT NULL,
    about_me        TEXT,
    skills          TEXT,
    profile_picture LONGTEXT,                -- Base64 image from the camera
    PRIMARY KEY (id),
    UNIQUE KEY student_id (student_id),
    UNIQUE KEY email (email)
);
