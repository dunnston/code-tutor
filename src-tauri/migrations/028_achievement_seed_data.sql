-- Migration 028: Achievement Seed Data
-- All 110+ achievement definitions

-- ============================================================================
-- LEARNING ACHIEVEMENTS
-- ============================================================================

-- Lesson Completion (Tiered)
INSERT OR IGNORE INTO achievements VALUES
('lessons-bronze', 'learning', 'Scholar', 'Complete 50 lessons', '📚', 'bronze', 'count', 50, NULL, 500, 500, 0, NULL, NULL, FALSE, 1, NULL, 0, FALSE, 'lessons_completed', CURRENT_TIMESTAMP),
('lessons-silver', 'learning', 'Dedicated Student', 'Complete 100 lessons', '📖', 'silver', 'count', 100, NULL, 1500, 1500, 0, NULL, NULL, FALSE, 1, NULL, 1, FALSE, 'lessons_completed', CURRENT_TIMESTAMP),
('lessons-gold', 'learning', 'Master Scholar', 'Complete 250 lessons', '📕', 'gold', 'count', 250, NULL, 5000, 5000, 0, NULL, NULL, FALSE, 1, NULL, 2, FALSE, 'lessons_completed', CURRENT_TIMESTAMP),
('lessons-platinum', 'learning', 'Eternal Student', 'Complete 500 lessons', '📜', 'platinum', 'count', 500, NULL, 15000, 15000, 0, 'legendary_scholar_crown', 'cosmetic', FALSE, 1, NULL, 3, FALSE, 'lessons_completed', CURRENT_TIMESTAMP);

-- Perfect Lessons (Mastery)
INSERT OR IGNORE INTO achievements VALUES
('perfectionist-bronze', 'mastery', 'Getting the Hang of It', 'Complete 10 lessons perfectly (no hints, first try)', '✨', 'bronze', 'count', 10, NULL, 750, 500, 0, NULL, NULL, FALSE, 1, NULL, 0, FALSE, 'lessons_perfect', CURRENT_TIMESTAMP),
('perfectionist-silver', 'mastery', 'Rising Perfectionist', 'Complete 50 lessons perfectly', '💫', 'silver', 'count', 50, NULL, 3000, 3000, 0, NULL, NULL, FALSE, 5, NULL, 1, FALSE, 'lessons_perfect', CURRENT_TIMESTAMP),
('perfectionist-gold', 'mastery', 'Flawless Execution', 'Complete 100 lessons perfectly', '⭐', 'gold', 'count', 100, NULL, 8000, 8000, 0, NULL, NULL, FALSE, 10, NULL, 2, FALSE, 'lessons_perfect', CURRENT_TIMESTAMP),
('perfect-course', 'mastery', 'Perfect Course', 'Complete an entire course without using a single hint', '👑', 'gold', 'custom', 1, '{"type":"perfect_course"}', 10000, 10000, 100, 'crown_of_mastery', 'cosmetic', FALSE, 5, NULL, 3, FALSE, NULL, CURRENT_TIMESTAMP);

-- Speed Achievements
INSERT OR IGNORE INTO achievements VALUES
('speed-demon', 'mastery', 'Speed Demon', 'Complete 10 lessons in under 5 minutes each', '⚡', 'silver', 'custom', 10, '{"type":"speed_lesson","max_time":300}', 2000, 2000, 0, NULL, NULL, FALSE, 5, NULL, 0, FALSE, NULL, CURRENT_TIMESTAMP),
('lightning-coder', 'mastery', 'Lightning Coder', 'Complete a challenge lesson in under 3 minutes', '🌩️', 'gold', 'custom', 1, '{"type":"speed_challenge","max_time":180}', 3000, 3000, 0, NULL, NULL, FALSE, 10, NULL, 1, FALSE, NULL, CURRENT_TIMESTAMP);

-- Course Mastery
INSERT OR IGNORE INTO achievements VALUES
('first-course', 'learning', 'Course Complete', 'Complete your first course', '🎓', 'bronze', 'count', 1, NULL, 1000, 1000, 0, NULL, NULL, FALSE, 1, NULL, 4, FALSE, 'courses_completed', CURRENT_TIMESTAMP),
('triple-threat', 'learning', 'Triple Threat', 'Complete courses in all 3 categories (Backend, Game Dev, Frontend)', '🎯', 'gold', 'custom', 3, '{"type":"course_categories","categories":["backend","gamedev","frontend"]}', 10000, 10000, 100, NULL, NULL, FALSE, 15, NULL, 5, FALSE, NULL, CURRENT_TIMESTAMP),
('polyglot-master', 'learning', 'Polyglot Master', 'Complete a course in all 4 languages', '🌐', 'platinum', 'custom', 4, '{"type":"course_languages","count":4}', 20000, 20000, 200, 'polyglot_legendary_badge', 'cosmetic', FALSE, 20, NULL, 6, FALSE, NULL, CURRENT_TIMESTAMP),
('all-advanced', 'learning', 'Advanced Mastery', 'Complete all 3 advanced courses', '🏆', 'platinum', 'custom', 3, '{"type":"advanced_courses"}', 25000, 25000, 250, NULL, NULL, FALSE, 25, NULL, 7, FALSE, NULL, CURRENT_TIMESTAMP);

-- ============================================================================
-- PUZZLE ACHIEVEMENTS
-- ============================================================================

-- Puzzle Count (Tiered)
INSERT OR IGNORE INTO achievements VALUES
('puzzles-bronze', 'puzzles', 'Puzzle Solver', 'Solve 10 puzzles', '🧩', 'bronze', 'count', 10, NULL, 500, 500, 0, NULL, NULL, FALSE, 1, NULL, 0, FALSE, 'puzzles_solved', CURRENT_TIMESTAMP),
('puzzles-silver', 'puzzles', 'Puzzle Enthusiast', 'Solve 100 puzzles', '🎲', 'silver', 'count', 100, NULL, 2000, 2000, 0, NULL, NULL, FALSE, 5, NULL, 1, FALSE, 'puzzles_solved', CURRENT_TIMESTAMP),
('puzzles-gold', 'puzzles', 'Puzzle Master', 'Solve 250 puzzles', '🎮', 'gold', 'count', 250, NULL, 8000, 8000, 0, NULL, NULL, FALSE, 10, NULL, 2, FALSE, 'puzzles_solved', CURRENT_TIMESTAMP),
('puzzles-platinum', 'puzzles', 'Puzzle Legend', 'Solve 500 puzzles', '🏅', 'platinum', 'count', 500, NULL, 20000, 20000, 200, NULL, NULL, FALSE, 20, NULL, 3, FALSE, 'puzzles_solved', CURRENT_TIMESTAMP);

-- Difficulty Mastery
INSERT OR IGNORE INTO achievements VALUES
('expert-complete', 'puzzles', 'Expert Complete', 'Solve all Expert puzzles in any category', '💎', 'gold', 'custom', 1, '{"type":"expert_category_complete"}', 8000, 8000, 0, NULL, NULL, FALSE, 15, NULL, 4, FALSE, NULL, CURRENT_TIMESTAMP),
('puzzle-perfectionist', 'mastery', 'Puzzle Perfectionist', 'Solve 50 puzzles without using any hints', '✨', 'gold', 'count', 50, NULL, 7500, 7500, 0, NULL, NULL, FALSE, 10, NULL, 4, FALSE, 'puzzles_perfect', CURRENT_TIMESTAMP),
('category-champion', 'puzzles', 'Category Champion', 'Complete all puzzles in any single category (all difficulties)', '🏆', 'gold', 'custom', 1, '{"type":"category_complete"}', 10000, 10000, 100, NULL, NULL, FALSE, 15, NULL, 5, FALSE, NULL, CURRENT_TIMESTAMP);

-- Optimization Challenges
INSERT OR IGNORE INTO achievements VALUES
('optimizer-bronze', 'mastery', 'Code Optimizer', 'Achieve optimal solution on 10 puzzles', '⚙️', 'bronze', 'count', 10, NULL, 1000, 1000, 0, NULL, NULL, FALSE, 5, NULL, 5, FALSE, 'optimal_solutions', CURRENT_TIMESTAMP),
('optimizer-master', 'mastery', 'The Optimizer', 'Achieve optimal solution on 50 puzzles', '🔧', 'gold', 'count', 50, NULL, 10000, 10000, 100, NULL, NULL, FALSE, 15, NULL, 6, FALSE, 'optimal_solutions', CURRENT_TIMESTAMP),
('code-golf-champion', 'mastery', 'Code Golf Champion', 'Rank in top 10 on 25 different code golf leaderboards', '⛳', 'platinum', 'custom', 25, '{"type":"leaderboard_rank","board_type":"golf","rank":10}', 15000, 15000, 150, NULL, NULL, FALSE, 20, NULL, 7, FALSE, NULL, CURRENT_TIMESTAMP),
('speed-solver', 'mastery', 'Speed Solver', 'Rank in top 10 on 25 different speed leaderboards', '🏃', 'platinum', 'custom', 25, '{"type":"leaderboard_rank","board_type":"speed","rank":10}', 15000, 15000, 150, NULL, NULL, FALSE, 20, NULL, 8, FALSE, NULL, CURRENT_TIMESTAMP);

-- ============================================================================
-- STREAK ACHIEVEMENTS
-- ============================================================================

INSERT OR IGNORE INTO achievements VALUES
('first-streak', 'streaks', 'Starting Strong', 'Maintain a 3-day streak', '🔥', 'bronze', 'streak', 3, NULL, 200, 200, 0, NULL, NULL, FALSE, 1, NULL, 0, FALSE, 'current_streak', CURRENT_TIMESTAMP),
('streak-week', 'streaks', 'Week Warrior', 'Maintain a 7-day streak', '🔥', 'bronze', 'streak', 7, NULL, 500, 500, 0, NULL, NULL, FALSE, 1, NULL, 1, FALSE, 'current_streak', CURRENT_TIMESTAMP),
('streak-bronze', 'streaks', 'Building Habits', 'Maintain a 30-day streak', '🔥', 'bronze', 'streak', 30, NULL, 1000, 1000, 0, NULL, NULL, FALSE, 1, NULL, 2, FALSE, 'current_streak', CURRENT_TIMESTAMP),
('streak-silver', 'streaks', 'Dedicated Learner', 'Maintain a 100-day streak', '🔥', 'silver', 'streak', 100, NULL, 5000, 5000, 50, NULL, NULL, FALSE, 5, NULL, 3, FALSE, 'current_streak', CURRENT_TIMESTAMP),
('streak-gold', 'streaks', 'Unstoppable', 'Maintain a 365-day streak', '🔥', 'gold', 'streak', 365, NULL, 25000, 25000, 250, 'eternal_flame_badge', 'cosmetic', FALSE, 10, NULL, 4, FALSE, 'current_streak', CURRENT_TIMESTAMP),
('streak-platinum', 'streaks', 'Eternal Dedication', 'Maintain a 1000-day streak', '🔥', 'platinum', 'streak', 1000, NULL, 100000, 100000, 1000, 'immortal_flame_crown', 'cosmetic', FALSE, 25, NULL, 5, FALSE, 'current_streak', CURRENT_TIMESTAMP);

-- Comeback Achievement
INSERT OR IGNORE INTO achievements VALUES
('comeback-king', 'streaks', 'Comeback King', 'Rebuild a 50+ day streak after breaking it', '💪', 'silver', 'custom', 1, '{"type":"streak_rebuild","threshold":50}', 3000, 3000, 0, NULL, NULL, FALSE, 5, NULL, 6, FALSE, NULL, CURRENT_TIMESTAMP);

-- ============================================================================
-- XP & LEVELING ACHIEVEMENTS
-- ============================================================================

INSERT OR IGNORE INTO achievements VALUES
('level-5', 'progression', 'Rising Star', 'Reach level 5', '⭐', 'bronze', 'level', 5, NULL, 500, 500, 0, NULL, NULL, FALSE, 1, NULL, 0, FALSE, 'current_level', CURRENT_TIMESTAMP),
('level-10', 'progression', 'Double Digits', 'Reach level 10', '⭐', 'bronze', 'level', 10, NULL, 1000, 1000, 0, NULL, NULL, FALSE, 1, NULL, 1, FALSE, 'current_level', CURRENT_TIMESTAMP),
('level-25', 'progression', 'Quarter Century', 'Reach level 25', '🌟', 'gold', 'level', 25, NULL, 10000, 10000, 100, NULL, NULL, FALSE, 1, NULL, 2, FALSE, 'current_level', CURRENT_TIMESTAMP),
('level-50', 'progression', 'Half Century', 'Reach level 50', '💫', 'platinum', 'level', 50, NULL, 25000, 25000, 250, 'legendary_hero_badge', 'cosmetic', FALSE, 1, NULL, 3, FALSE, 'current_level', CURRENT_TIMESTAMP),
('level-100', 'progression', 'Centurion', 'Reach level 100', '✨', 'platinum', 'level', 100, NULL, 50000, 50000, 500, NULL, NULL, FALSE, 1, NULL, 4, FALSE, 'current_level', CURRENT_TIMESTAMP);

-- XP Milestones
INSERT OR IGNORE INTO achievements VALUES
('xp-10k', 'progression', 'XP Collector', 'Earn 10,000 total XP', '💰', 'bronze', 'count', 10000, NULL, 1000, 1000, 0, NULL, NULL, FALSE, 1, NULL, 5, FALSE, 'total_xp_earned', CURRENT_TIMESTAMP),
('xp-50k', 'progression', 'XP Accumulator', 'Earn 50,000 total XP', '💎', 'silver', 'count', 50000, NULL, 5000, 5000, 0, NULL, NULL, FALSE, 5, NULL, 6, FALSE, 'total_xp_earned', CURRENT_TIMESTAMP),
('xp-hoarder-gold', 'progression', 'XP Hoarder', 'Earn 100,000 total XP', '👑', 'gold', 'count', 100000, NULL, 10000, 10000, 100, NULL, NULL, FALSE, 10, NULL, 7, FALSE, 'total_xp_earned', CURRENT_TIMESTAMP),
('xp-legend', 'progression', 'XP Legend', 'Earn 1,000,000 total XP', '🏆', 'platinum', 'count', 1000000, NULL, 50000, 50000, 500, NULL, NULL, FALSE, 25, NULL, 8, FALSE, 'total_xp_earned', CURRENT_TIMESTAMP);

-- ============================================================================
-- PLAYGROUND ACHIEVEMENTS
-- ============================================================================

INSERT OR IGNORE INTO achievements VALUES
('first-project', 'playground', 'First Creation', 'Create your first playground project', '🎨', 'bronze', 'count', 1, NULL, 250, 250, 0, NULL, NULL, FALSE, 1, NULL, 0, FALSE, 'projects_created', CURRENT_TIMESTAMP),
('prolific-creator-bronze', 'playground', 'Budding Creator', 'Create 10 playground projects', '🖌️', 'bronze', 'count', 10, NULL, 1000, 1000, 0, NULL, NULL, FALSE, 5, NULL, 1, FALSE, 'projects_created', CURRENT_TIMESTAMP),
('prolific-creator-silver', 'playground', 'Active Creator', 'Create 25 playground projects', '🎭', 'silver', 'count', 25, NULL, 3000, 3000, 0, NULL, NULL, FALSE, 10, NULL, 2, FALSE, 'projects_created', CURRENT_TIMESTAMP),
('prolific-creator-gold', 'playground', 'Prolific Creator', 'Create 50 playground projects', '🎪', 'gold', 'count', 50, NULL, 5000, 5000, 50, NULL, NULL, FALSE, 15, NULL, 3, FALSE, 'projects_created', CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO achievements VALUES
('code-architect', 'playground', 'Code Architect', 'Create a project with 500+ lines of code', '🏗️', 'gold', 'custom', 1, '{"type":"project_lines","min_lines":500}', 5000, 5000, 50, NULL, NULL, FALSE, 10, NULL, 4, FALSE, NULL, CURRENT_TIMESTAMP),
('multi-language-creator', 'playground', 'Multi-Language Creator', 'Create 10 projects in each of the 5 languages (50 total)', '🌍', 'platinum', 'custom', 50, '{"type":"multi_language_projects","per_language":10}', 15000, 15000, 150, NULL, NULL, FALSE, 20, NULL, 5, FALSE, NULL, CURRENT_TIMESTAMP);

-- Community Achievements
INSERT OR IGNORE INTO achievements VALUES
('first-like', 'social', 'Popular Debut', 'Get your first like on a project', '👍', 'bronze', 'count', 1, NULL, 100, 100, 0, NULL, NULL, FALSE, 1, NULL, 0, FALSE, 'projects_likes_received', CURRENT_TIMESTAMP),
('influencer-bronze', 'social', 'Rising Influencer', 'Get 50 total likes across all your projects', '💫', 'bronze', 'count', 50, NULL, 1000, 1000, 0, NULL, NULL, FALSE, 5, NULL, 1, FALSE, 'projects_likes_received', CURRENT_TIMESTAMP),
('influencer-silver', 'social', 'Code Influencer', 'Get 500 total likes across all your projects', '🌟', 'gold', 'count', 500, NULL, 10000, 10000, 100, NULL, NULL, FALSE, 15, NULL, 2, FALSE, 'projects_likes_received', CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO achievements VALUES
('viral-coder', 'social', 'Viral Coder', 'Get 1000 views on a single project', '🚀', 'platinum', 'custom', 1, '{"type":"project_views","min_views":1000}', 15000, 15000, 150, NULL, NULL, FALSE, 20, NULL, 3, FALSE, NULL, CURRENT_TIMESTAMP),
('fork-king', 'social', 'Fork King', 'Have one of your projects forked 100 times', '🍴', 'platinum', 'custom', 1, '{"type":"project_forks","min_forks":100}', 20000, 20000, 200, NULL, NULL, FALSE, 25, NULL, 4, FALSE, NULL, CURRENT_TIMESTAMP);

-- ============================================================================
-- DUNGEON ACHIEVEMENTS
-- ============================================================================

-- Combat Mastery
INSERT OR IGNORE INTO achievements VALUES
('first-victory', 'dungeon', 'First Blood', 'Defeat your first enemy', '⚔️', 'bronze', 'count', 1, NULL, 100, 100, 0, NULL, NULL, FALSE, 1, NULL, 0, FALSE, 'enemies_defeated', CURRENT_TIMESTAMP),
('slayer-bronze', 'dungeon', 'Slayer', 'Defeat 50 enemies', '🗡️', 'bronze', 'count', 50, NULL, 1000, 1000, 0, NULL, NULL, FALSE, 5, NULL, 1, FALSE, 'enemies_defeated', CURRENT_TIMESTAMP),
('hundred-slayer', 'dungeon', 'Hundred Slayer', 'Defeat 100 enemies', '⚔️', 'silver', 'count', 100, NULL, 3000, 3000, 0, NULL, NULL, FALSE, 10, NULL, 2, FALSE, 'enemies_defeated', CURRENT_TIMESTAMP),
('thousand-slayer', 'dungeon', 'Thousand Slayer', 'Defeat 1000 enemies', '🏆', 'platinum', 'count', 1000, NULL, 25000, 25000, 250, NULL, NULL, FALSE, 25, NULL, 3, FALSE, 'enemies_defeated', CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO achievements VALUES
('first-boss', 'dungeon', 'Boss Slayer', 'Defeat your first boss', '👑', 'bronze', 'count', 1, NULL, 500, 500, 0, NULL, NULL, FALSE, 5, NULL, 4, FALSE, 'bosses_defeated', CURRENT_TIMESTAMP),
('boss-hunter', 'dungeon', 'Boss Hunter', 'Defeat 25 bosses', '👹', 'gold', 'count', 25, NULL, 10000, 10000, 100, NULL, NULL, FALSE, 15, NULL, 5, FALSE, 'bosses_defeated', CURRENT_TIMESTAMP);

-- Difficulty Challenges
INSERT OR IGNORE INTO achievements VALUES
('no-damage-boss', 'mastery', 'Untouchable', 'Defeat a boss without taking any damage', '🛡️', 'gold', 'custom', 1, '{"type":"boss_no_damage"}', 10000, 10000, 100, NULL, NULL, FALSE, 15, NULL, 9, FALSE, NULL, CURRENT_TIMESTAMP),
('low-level-boss', 'mastery', 'David vs Goliath', 'Defeat a floor 3+ boss while under-leveled (5+ levels below recommended)', '🎯', 'platinum', 'custom', 1, '{"type":"underleveled_boss","floor_min":3,"level_diff":5}', 15000, 15000, 150, NULL, NULL, FALSE, 20, NULL, 10, FALSE, NULL, CURRENT_TIMESTAMP),
('no-healing', 'mastery', 'Iron Will', 'Clear an entire floor without using healing items or heal ability', '💪', 'gold', 'custom', 1, '{"type":"floor_no_healing"}', 8000, 8000, 80, NULL, NULL, FALSE, 15, NULL, 11, FALSE, NULL, CURRENT_TIMESTAMP);

-- Deep Delving
INSERT OR IGNORE INTO achievements VALUES
('floor-5', 'dungeon', 'Delver', 'Reach floor 5', '🏰', 'bronze', 'count', 5, NULL, 1000, 1000, 0, NULL, NULL, FALSE, 5, NULL, 6, FALSE, 'max_floor_reached', CURRENT_TIMESTAMP),
('floor-10', 'dungeon', 'Deep Delver', 'Reach floor 10', '🏯', 'gold', 'count', 10, NULL, 10000, 10000, 100, NULL, NULL, FALSE, 15, NULL, 7, FALSE, 'max_floor_reached', CURRENT_TIMESTAMP),
('floor-25', 'dungeon', 'Abyss Walker', 'Reach floor 25', '🌋', 'platinum', 'count', 25, NULL, 30000, 30000, 300, 'abyss_walker_armor', 'equipment', FALSE, 25, NULL, 8, FALSE, 'max_floor_reached', CURRENT_TIMESTAMP);

-- Perfect Combat
INSERT OR IGNORE INTO achievements VALUES
('perfect-combat-bronze', 'mastery', 'Combat Precision', 'Win 10 combats with perfect coding accuracy (100% challenges correct)', '🎯', 'bronze', 'count', 10, NULL, 1000, 1000, 0, NULL, NULL, FALSE, 5, NULL, 12, FALSE, 'perfect_combats', CURRENT_TIMESTAMP),
('perfect-combat-master', 'mastery', 'Combat Perfectionist', 'Win 50 combats with perfect coding accuracy (100% challenges correct)', '💎', 'gold', 'count', 50, NULL, 12000, 12000, 120, NULL, NULL, FALSE, 15, NULL, 13, FALSE, 'perfect_combats', CURRENT_TIMESTAMP);

-- ============================================================================
-- ECONOMIC ACHIEVEMENTS
-- ============================================================================

INSERT OR IGNORE INTO achievements VALUES
('gold-1000', 'economic', 'Gold Finder', 'Earn 1,000 gold (lifetime)', '💰', 'bronze', 'count', 1000, NULL, 200, 200, 0, NULL, NULL, FALSE, 1, NULL, 0, FALSE, 'lifetime_gold_earned', CURRENT_TIMESTAMP),
('gold-10000', 'economic', 'Gold Collector', 'Earn 10,000 gold (lifetime)', '💰', 'silver', 'count', 10000, NULL, 1000, 1000, 0, NULL, NULL, FALSE, 5, NULL, 1, FALSE, 'lifetime_gold_earned', CURRENT_TIMESTAMP),
('gold-100000', 'economic', 'Wealthy', 'Earn 100,000 gold (lifetime)', '💰', 'gold', 'count', 100000, NULL, 10000, 10000, 0, NULL, NULL, FALSE, 15, NULL, 2, FALSE, 'lifetime_gold_earned', CURRENT_TIMESTAMP),
('millionaire', 'economic', 'Millionaire', 'Earn 1,000,000 total gold (lifetime)', '👑', 'platinum', 'count', 1000000, NULL, 25000, 25000, 500, NULL, NULL, FALSE, 25, NULL, 3, FALSE, 'lifetime_gold_earned', CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO achievements VALUES
('gem-collector-bronze', 'economic', 'Gem Finder', 'Earn 100 total gems (lifetime)', '💎', 'bronze', 'count', 100, NULL, 500, 500, 0, NULL, NULL, FALSE, 5, NULL, 4, FALSE, 'lifetime_gems_earned', CURRENT_TIMESTAMP),
('gem-collector', 'economic', 'Gem Collector', 'Earn 1000 total gems (lifetime)', '💎', 'gold', 'count', 1000, NULL, 10000, 10000, 0, NULL, NULL, FALSE, 15, NULL, 5, FALSE, 'lifetime_gems_earned', CURRENT_TIMESTAMP);

-- Shopping Achievements
INSERT OR IGNORE INTO achievements VALUES
('first-purchase', 'economic', 'First Purchase', 'Make your first shop purchase', '🛒', 'bronze', 'count', 1, NULL, 100, 100, 0, NULL, NULL, FALSE, 1, NULL, 6, FALSE, 'shop_purchases_made', CURRENT_TIMESTAMP),
('savvy-shopper', 'economic', 'Savvy Shopper', 'Make 100 shop purchases', '🛍️', 'silver', 'count', 100, NULL, 2000, 2000, 0, NULL, NULL, FALSE, 10, NULL, 7, FALSE, 'shop_purchases_made', CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO achievements VALUES
('collector', 'economic', 'The Collector', 'Own all common and uncommon cosmetics', '🎨', 'gold', 'custom', 1, '{"type":"collection","rarities":["common","uncommon"]}', 8000, 8000, 80, NULL, NULL, FALSE, 15, NULL, 8, FALSE, NULL, CURRENT_TIMESTAMP),
('legendary-collector', 'economic', 'Legendary Collector', 'Own all legendary items', '👑', 'platinum', 'custom', 1, '{"type":"collection","rarities":["legendary"]}', 20000, 20000, 200, NULL, NULL, FALSE, 25, NULL, 9, FALSE, NULL, CURRENT_TIMESTAMP);

-- ============================================================================
-- SOCIAL ACHIEVEMENTS
-- ============================================================================

INSERT OR IGNORE INTO achievements VALUES
('helpful', 'social', 'Helpful', 'Help 5 other users in community (comments, tips)', '🤝', 'bronze', 'count', 5, NULL, 500, 500, 0, NULL, NULL, FALSE, 5, NULL, 5, FALSE, 'users_helped', CURRENT_TIMESTAMP),
('mentor', 'social', 'Mentor', 'Help 10 other users in community', '👨‍🏫', 'silver', 'count', 10, NULL, 2000, 2000, 0, NULL, NULL, FALSE, 10, NULL, 6, FALSE, 'users_helped', CURRENT_TIMESTAMP),
('sage', 'social', 'The Sage', 'Help 100 other users', '🧙', 'gold', 'count', 100, NULL, 10000, 10000, 100, NULL, NULL, FALSE, 20, NULL, 7, FALSE, 'users_helped', CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO achievements VALUES
('teacher', 'social', 'Teacher', 'Create 10 custom lessons that others complete', '📚', 'gold', 'count', 10, NULL, 10000, 10000, 100, NULL, NULL, FALSE, 20, NULL, 8, FALSE, 'custom_lessons_created', CURRENT_TIMESTAMP);

-- ============================================================================
-- SECRET ACHIEVEMENTS
-- ============================================================================

INSERT OR IGNORE INTO achievements VALUES
('secret-room', 'secret', 'Secret Finder', 'Discover the secret room', '🔍', 'gold', 'custom', 1, '{"type":"secret_room"}', 5000, 5000, 50, NULL, NULL, TRUE, 1, NULL, 0, FALSE, NULL, CURRENT_TIMESTAMP),
('konami-code', 'secret', 'Classic Gamer', 'Enter the Konami code', '🎮', 'secret', 'custom', 1, '{"type":"konami_code"}', 1000, 1000, 10, NULL, NULL, TRUE, 1, NULL, 1, FALSE, NULL, CURRENT_TIMESTAMP),
('easter-egg', 'secret', 'Egg Hunter', 'Find all 10 easter eggs', '🥚', 'platinum', 'custom', 10, '{"type":"easter_eggs"}', 15000, 15000, 150, NULL, NULL, TRUE, 15, NULL, 2, FALSE, NULL, CURRENT_TIMESTAMP);

-- Silly/Fun Secret Achievements
INSERT OR IGNORE INTO achievements VALUES
('night-owl', 'secret', 'Night Owl', 'Complete a lesson between 2am and 5am', '🦉', 'bronze', 'custom', 1, '{"type":"time_range","start":2,"end":5}', 500, 500, 0, NULL, NULL, TRUE, 1, NULL, 3, FALSE, NULL, CURRENT_TIMESTAMP),
('speedrun-fail', 'secret', 'Measure Twice, Cut Once', 'Fail the same lesson 10 times in a row', '🤦', 'bronze', 'custom', 1, '{"type":"consecutive_fails","count":10}', 100, 100, 0, NULL, NULL, TRUE, 1, NULL, 4, FALSE, NULL, CURRENT_TIMESTAMP),
('time-traveler', 'secret', 'Time Traveler', 'Use the app on your birthday', '🎂', 'secret', 'custom', 1, '{"type":"birthday"}', 2000, 2000, 20, NULL, NULL, TRUE, 1, NULL, 5, FALSE, NULL, CURRENT_TIMESTAMP);

-- ============================================================================
-- PRESTIGE ACHIEVEMENTS (For future prestige system)
-- ============================================================================

INSERT OR IGNORE INTO achievements VALUES
('prestige-1', 'progression', 'Prestige Beginner', 'Reach Prestige 1', '⭐', 'gold', 'custom', 1, '{"type":"prestige","level":1}', 10000, 10000, 100, NULL, NULL, FALSE, 50, NULL, 9, FALSE, NULL, CURRENT_TIMESTAMP),
('prestige-5', 'progression', 'Prestige Master', 'Reach Prestige 5', '🌟', 'platinum', 'custom', 5, '{"type":"prestige","level":5}', 50000, 50000, 500, 'prestige_master_crown', 'cosmetic', FALSE, 50, NULL, 10, FALSE, NULL, CURRENT_TIMESTAMP),
('prestige-10', 'progression', 'Eternal Coder', 'Reach Prestige 10', '✨', 'platinum', 'custom', 10, '{"type":"prestige","level":10}', 100000, 100000, 1000, 'eternal_coder_throne', 'cosmetic', FALSE, 50, NULL, 11, FALSE, NULL, CURRENT_TIMESTAMP);
