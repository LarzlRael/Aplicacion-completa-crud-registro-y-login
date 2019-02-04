create database database_links
use database_links
/* users tables */
create table users(
    id int PRIMARY key auto_increment,
    username VARCHAR(16) not null,
    passwod varchar(60) not null,
    fullname VARCHAR(100) not null
);
desc users;

CREATE TABLE links(
    id int PRIMARY key,
    title varchar(150) not null,
    url VARCHAR(255) not null,
    DESCRIPTION text,
    user_id int,
    created_at TIMESTAMP not null DEFAULT CURRENT_timestamp,
    CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users(id)
);