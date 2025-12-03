-- Add sequence order to dungeon levels
ALTER TABLE dungeon_levels ADD COLUMN sequence_order INTEGER DEFAULT NULL;

-- Create index for sequence ordering
CREATE INDEX IF NOT EXISTS idx_dungeon_levels_sequence ON dungeon_levels(sequence_order);
