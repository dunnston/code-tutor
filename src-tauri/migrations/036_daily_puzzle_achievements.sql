-- Daily Puzzle Achievements
-- Add achievements for daily puzzle completion milestones and streaks

INSERT OR IGNORE INTO achievements (id, category_id, name, description, icon, tier, requirement_type, requirement_value, xp_reward, gold_reward, gem_reward, tracking_key, display_order)
VALUES
  -- Completion Milestones
  ('daily_puzzle_first', 'puzzles', 'Daily Grind Begins', 'Complete your first daily puzzle challenge', '⭐', 'bronze', 'count', 1, 50, 10, 0, 'daily_puzzles_completed', 100),
  ('daily_puzzle_week', 'puzzles', 'Consistent Learner', 'Complete 7 daily puzzle challenges', '🌟', 'silver', 'count', 7, 150, 50, 5, 'daily_puzzles_completed', 101),
  ('daily_puzzle_month', 'puzzles', 'Daily Devotion', 'Complete 30 daily puzzle challenges', '✨', 'gold', 'count', 30, 300, 100, 10, 'daily_puzzles_completed', 102),
  ('daily_puzzle_hundred', 'puzzles', 'Century Club', 'Complete 100 daily puzzle challenges', '💯', 'platinum', 'count', 100, 1000, 500, 50, 'daily_puzzles_completed', 103),

  -- Streak Achievements
  ('daily_streak_3', 'puzzles', 'Three Day Streak', 'Complete daily challenges 3 days in a row', '🔥', 'bronze', 'count', 3, 75, 20, 2, 'daily_puzzle_streak', 110),
  ('daily_streak_7', 'puzzles', 'Weekly Warrior', 'Complete daily challenges 7 days in a row', '🔥🔥', 'silver', 'count', 7, 200, 75, 10, 'daily_puzzle_streak', 111),
  ('daily_streak_30', 'puzzles', 'Month-Long Marathon', 'Complete daily challenges 30 days in a row', '🔥🔥🔥', 'gold', 'count', 30, 500, 200, 25, 'daily_puzzle_streak', 112),
  ('daily_streak_100', 'puzzles', 'Unstoppable Force', 'Complete daily challenges 100 days in a row', '🔥🔥🔥🔥', 'platinum', 'count', 100, 2000, 1000, 100, 'daily_puzzle_streak', 113);
