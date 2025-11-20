-- Migration: Add solution_viewed tracking to user_puzzle_progress
-- Date: 2025-11-20
-- Description: Adds fields to track when users view puzzle solutions

-- Add solution_viewed column
ALTER TABLE user_puzzle_progress ADD COLUMN solution_viewed BOOLEAN DEFAULT FALSE;

-- Add solution_viewed_at timestamp column
ALTER TABLE user_puzzle_progress ADD COLUMN solution_viewed_at TIMESTAMP;
