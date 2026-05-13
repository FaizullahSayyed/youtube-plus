-- server/db/seed.sql

-- 1. Insert Users (Passwords are hashed versions of "password123")
INSERT INTO users (id, username, email, password_hash, avatar_url) VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'TechGuru', 'tech@example.com', '$2a$10$FakeHashForDevPurposesOnly1234567890123456789012345678', 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechGuru'),
('a1b2c3d4-0002-4000-8000-000000000002', 'MusicLover', 'music@example.com', '$2a$10$FakeHashForDevPurposesOnly1234567890123456789012345678', 'https://api.dicebear.com/7.x/avataaars/svg?seed=MusicLover'),
('a1b2c3d4-0003-4000-8000-000000000003', 'CodeMaster', 'code@example.com', '$2a$10$FakeHashForDevPurposesOnly1234567890123456789012345678', 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMaster');

-- 2. Insert Channels
INSERT INTO channels (id, user_id, name, description, subscriber_count) VALUES
('b1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'Tech Reviews', 'Latest tech reviews and unboxings', 14520),
('b1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0002-4000-8000-000000000002', 'LoFi Beats', 'Chill beats to study to', 89000);

-- 3. Insert Videos
INSERT INTO videos (id, channel_id, title, description, video_url, thumbnail_url, like_count, comment_count, view_count, duration) VALUES
('c1b2c3d4-0001-4000-8000-000000000001', 'b1b2c3d4-0001-4000-8000-000000000001', 'iPhone 20 Review', 'Is it worth the upgrade?', 'https://storage.example.com/vid1.mp4', 'https://storage.example.com/thumb1.jpg', 1500, 120, 45000, 900),
('c1b2c3d4-0002-4000-8000-000000000002', 'b1b2c3d4-0001-4000-8000-000000000001', 'Best Mechanical Keyboards', 'Top 5 keyboards of 2026', 'https://storage.example.com/vid2.mp4', 'https://storage.example.com/thumb2.jpg', 890, 45, 21000, 600),
('c1b2c3d4-0003-4000-8000-000000000003', 'b1b2c3d4-0002-4000-8000-000000000002', 'Beats to relax/study to', '2 hours of chill beats', 'https://storage.example.com/vid3.mp4', 'https://storage.example.com/thumb3.jpg', 45000, 1200, 1500000, 7200);

-- 4. Insert Subscriptions (User 3 subscribes to both channels)
INSERT INTO subscriptions (user_id, channel_id) VALUES
('a1b2c3d4-0003-4000-8000-000000000003', 'b1b2c3d4-0001-4000-8000-000000000001'),
('a1b2c3d4-0003-4000-8000-000000000003', 'b1b2c3d4-0002-4000-8000-000000000002');

-- 5. Insert Likes (User 3 likes Video 1 and 3)
INSERT INTO likes (user_id, video_id) VALUES
('a1b2c3d4-0003-4000-8000-000000000003', 'c1b2c3d4-0001-4000-8000-000000000001'),
('a1b2c3d4-0003-4000-8000-000000000003', 'c1b2c3d4-0003-4000-8000-000000000003');

-- 6. Insert Comments
INSERT INTO comments (user_id, video_id, text) VALUES
('a1b2c3d4-0003-4000-8000-000000000003', 'c1b2c3d4-0001-4000-8000-000000000001', 'Great review! Totally agree with your points.'),
('a1b2c3d4-0002-4000-8000-000000000002', 'c1b2c3d4-0003-4000-8000-000000000003', 'This saved my study session, thanks!');