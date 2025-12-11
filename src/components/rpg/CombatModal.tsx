import React, { useState, useEffect } from 'react';
import {
  startCombat,
  startBossCombat,
  executeCombatTurn,
  endCombatVictory,
  endCombatDefeat,
  getActiveAbilitiesForCombat,
  getChallengeForAction,
  recordChallengeAttempt,
  type ActiveCombat,
  type CombatTurnResult,
  type CombatRewards,
} from '../../lib/rpg';
import type { Ability, EnemyType, BossEnemy, DungeonChallenge } from '../../types/rpg';
import { CharacterStatsDisplay } from './CharacterStats';
import type { CharacterStats } from '../../types/rpg';
import { getEnemyImage } from '../../lib/enemyImages';
import { getPlayerAttackAnimation, getEnemyAttackAnimation } from '../../lib/combatAnimations';

interface CombatModalProps {
  userId: number;
  enemy: EnemyType | BossEnemy;
  isBoss: boolean;
  playerStats: CharacterStats;
  playerAvatar?: string; // Player's avatar image path
  floorNumber: number;
  onVictory: (rewards: CombatRewards) => void;
  onDefeat: () => void;
  onFlee: () => void;
}

type CombatPhase = 'ability-select' | 'challenge' | 'executing' | 'victory' | 'defeat' | 'flee-roll' | 'flee-challenge' | 'flee-result';

interface CombatLogEntry {
  turn: number;
  message: string;
  type: 'action' | 'damage' | 'heal' | 'status';
}

export function CombatModal({
  userId,
  enemy,
  isBoss,
  playerStats: initialPlayerStats,
  playerAvatar,
  floorNumber,
  onVictory,
  onDefeat,
  onFlee,
}: CombatModalProps) {
  const [combat, setCombat] = useState<ActiveCombat | null>(null);
  const [playerStats, setPlayerStats] = useState(initialPlayerStats);
  const [abilities, setAbilities] = useState<Ability[]>([]);

  // Convert cropped avatar to full-size version for combat
  const getFullAvatar = (croppedPath: string | undefined): string => {
    if (!croppedPath) return '/avatars/full/dragon-born.png';
    // Replace /avatars/ with /avatars/full/
    return croppedPath.replace('/avatars/', '/avatars/full/');
  };
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
  const [challenge, setChallenge] = useState<DungeonChallenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [phase, setPhase] = useState<CombatPhase>('ability-select');
  const [combatLog, setCombatLog] = useState<CombatLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fleeRoll, setFleeRoll] = useState<number | null>(null);
  const [fleeDamage, setFleeDamage] = useState<number>(0);

  // Animation state
  const [showPlayerAnimation, setShowPlayerAnimation] = useState(false);
  const [showEnemyAnimation, setShowEnemyAnimation] = useState(false);

  useEffect(() => {
    initializeCombat();
  }, []);

  async function initializeCombat() {
    try {
      setLoading(true);
      const [combatState, activeAbilities] = await Promise.all([
        isBoss ? startBossCombat(userId, enemy as BossEnemy) : startCombat(userId, enemy as EnemyType),
        getActiveAbilitiesForCombat(userId),
      ]);
      setCombat(combatState);
      setAbilities(activeAbilities);
      addLogEntry(0, `Combat begins with ${combatState.enemyName}!`, 'status');
    } catch (err) {
      console.error('Failed to initialize combat:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAbilitySelect(ability: Ability) {
    if (!combat) return;

    setSelectedAbility(ability);

    // Check if ability costs mana
    if (ability.manaCost > playerStats.currentMana) {
      addLogEntry(combat.combatTurn, 'Not enough mana!', 'status');
      return;
    }

    try {
      // Fetch a coding challenge for this ability
      // Map ability to challenge action_type
      let actionType: string;
      if (ability.id === 'basic_attack') {
        actionType = 'basic_attack';
      } else if (ability.id === 'fireball' || ability.id === 'power_strike') {
        actionType = 'spell';
      } else if (ability.type === 'heal') {
        actionType = 'heal';
      } else {
        actionType = 'basic_attack'; // Default fallback
      }

      const challengeData = await getChallengeForAction(actionType, floorNumber, undefined, userId);
      setChallenge(challengeData);
      setSelectedAnswer('');
      setPhase('challenge');
    } catch (err) {
      console.error('Failed to load challenge:', err);
      addLogEntry(combat.combatTurn, 'Error loading challenge!', 'status');
    }
  }

  async function handleChallengeSubmit() {
    if (!combat || !selectedAbility || !challenge || !selectedAnswer) return;

    setPhase('executing');

    // Check if the selected answer is correct (case-insensitive, trimmed comparison)
    const userAnswer = selectedAnswer.trim().toUpperCase();
    const correctAnswer = (challenge.correctAnswer || '').trim().toUpperCase();
    const challengeSuccess = userAnswer === correctAnswer;

    try {
      // Record challenge attempt
      const startTime = Date.now();
      await recordChallengeAttempt(userId, challenge.id, challengeSuccess, (Date.now() - startTime) / 1000);

      // Execute combat turn
      const result: CombatTurnResult = await executeCombatTurn(userId, selectedAbility.id, challengeSuccess);
      console.log('Combat turn result:', result);
      console.log('Enemy defeated?', result.enemyDefeated, 'Enemy HP:', result.enemyCurrentHealth);

      // Update turn number immediately
      if (combat) {
        setCombat({
          ...combat,
          combatTurn: result.turnNumber,
          enemyCurrentHealth: combat.enemyCurrentHealth, // Don't update health yet
        });
      }

      // Update mana immediately (consumed on attack)
      setPlayerStats({
        ...playerStats,
        currentMana: result.playerCurrentMana,
      });

      // Add answer feedback immediately
      console.log('DEBUG: About to show feedback, challengeSuccess =', challengeSuccess);
      if (challengeSuccess) {
        console.log('DEBUG: Showing CORRECT message');
        addLogEntry(
          result.turnNumber,
          `Correct! Your ${selectedAbility.name} succeeds!`,
          'status'
        );
      } else {
        console.log('DEBUG: Showing WRONG message');
        addLogEntry(
          result.turnNumber,
          `Wrong answer! The correct answer was ${challenge.correctAnswer}. Your attack fails!`,
          'status'
        );
      }

      // Determine if attacks happened
      const hasPlayerAttack = result.playerDamageDealt > 0;
      const hasEnemyAttack = result.playerDamageTaken > 0;

      // Play animations sequentially and sync damage/logs with animation timing
      if (hasPlayerAttack) {
        // Start player attack animation
        setShowPlayerAnimation(true);

        // Show damage log in middle of animation (1250ms)
        setTimeout(() => {
          const critText = result.isCritical ? ' Critical hit!' : '';
          addLogEntry(
            result.turnNumber,
            `You dealt ${result.playerDamageDealt} damage!${critText}`,
            'damage'
          );

          // Apply enemy damage
          if (combat) {
            setCombat({
              ...combat,
              enemyCurrentHealth: result.enemyCurrentHealth,
              combatTurn: result.turnNumber,
            });
          }
        }, 1250);

        // Wait for player animation to complete (2500ms)
        setTimeout(() => {
          setShowPlayerAnimation(false);

          // Check if enemy is defeated
          if (result.enemyDefeated) {
            console.log('VICTORY DETECTED! Ending combat...');
            setTimeout(async () => {
              setPhase('victory');
              const rewards = await endCombatVictory(
                userId,
                enemy as EnemyType,
                result.turnNumber,
                result.playerDamageDealt,
                result.playerDamageTaken
              );
              addLogEntry(result.turnNumber, `Victory! ${combat.enemyName} defeated!`, 'status');
              setTimeout(() => onVictory(rewards), 2000);
            }, 500);
            return;
          }

          // If enemy attacks, start enemy animation after a pause (1000ms)
          if (hasEnemyAttack) {
            setTimeout(() => {
              setShowEnemyAnimation(true);

              // Show damage log and apply damage in middle of animation (1250ms)
              setTimeout(() => {
                const dodgeText = result.isDodged ? ' You dodged!' : '';
                addLogEntry(
                  result.turnNumber,
                  `${combat.enemyName} dealt ${result.playerDamageTaken} damage!${dodgeText}`,
                  'damage'
                );

                // Apply player damage
                setPlayerStats({
                  ...playerStats,
                  currentHealth: result.playerCurrentHealth,
                  currentMana: result.playerCurrentMana,
                });
              }, 1250);

              // Wait for enemy animation to complete (2500ms)
              setTimeout(() => {
                setShowEnemyAnimation(false);

                // Check if player is defeated
                if (result.playerDefeated) {
                  setTimeout(async () => {
                    setPhase('defeat');
                    await endCombatDefeat(userId);
                    addLogEntry(result.turnNumber, 'You have been defeated...', 'status');
                    setTimeout(() => onDefeat(), 2000);
                  }, 500);
                } else {
                  // Reset for next turn after a brief delay
                  setTimeout(() => {
                    setPhase('ability-select');
                    setSelectedAbility(null);
                    setChallenge(null);
                    setSelectedAnswer('');
                  }, 500);
                }
              }, 2500);
            }, 1000);
          } else {
            // No enemy attack, just reset for next turn
            setTimeout(() => {
              setPhase('ability-select');
              setSelectedAbility(null);
              setChallenge(null);
              setSelectedAnswer('');
            }, 500);
          }
        }, 2500);
      } else if (hasEnemyAttack) {
        // Only enemy attacks (player missed or didn't attack)
        setShowEnemyAnimation(true);

        // Show damage log and apply damage in middle of animation (1250ms)
        setTimeout(() => {
          const dodgeText = result.isDodged ? ' You dodged!' : '';
          addLogEntry(
            result.turnNumber,
            `${combat.enemyName} dealt ${result.playerDamageTaken} damage!${dodgeText}`,
            'damage'
          );

          // Apply player damage
          setPlayerStats({
            ...playerStats,
            currentHealth: result.playerCurrentHealth,
            currentMana: result.playerCurrentMana,
          });
        }, 1250);

        // Wait for animation to complete
        setTimeout(() => {
          setShowEnemyAnimation(false);

          // Check if player is defeated
          if (result.playerDefeated) {
            setTimeout(async () => {
              setPhase('defeat');
              await endCombatDefeat(userId);
              addLogEntry(result.turnNumber, 'You have been defeated...', 'status');
              setTimeout(() => onDefeat(), 2000);
            }, 500);
          } else {
            // Reset for next turn
            setTimeout(() => {
              setPhase('ability-select');
              setSelectedAbility(null);
              setChallenge(null);
              setSelectedAnswer('');
            }, 500);
          }
        }, 2500);
      } else {
        // No attacks at all, just reset
        setTimeout(() => {
          setPhase('ability-select');
          setSelectedAbility(null);
          setChallenge(null);
          setSelectedAnswer('');
        }, 500);
      }
    } catch (err) {
      console.error('Combat turn failed:', err);
      addLogEntry(combat.combatTurn, 'Error executing combat turn!', 'status');
      setPhase('ability-select');
    }
  }

  function addLogEntry(turn: number, message: string, type: CombatLogEntry['type']) {
    setCombatLog((prev) => [...prev, { turn, message, type }]);
  }

  async function handleFleeAttempt() {
    if (!combat) return;

    // Roll d20 for dexterity check
    const roll = Math.floor(Math.random() * 20) + 1;
    setFleeRoll(roll);
    setPhase('flee-roll');

    addLogEntry(combat.combatTurn, `You attempt to flee! Rolling for dexterity check...`, 'action');
  }

  async function handleStartFleeChallenge() {
    try {
      // Try to load a dexterity/dodge challenge, fallback to basic_attack if none exist
      let challengeData;
      try {
        challengeData = await getChallengeForAction('dodge', floorNumber, undefined, userId);
      } catch (dodgeErr) {
        console.log('No dodge challenges found, using basic_attack as fallback');
        challengeData = await getChallengeForAction('basic_attack', floorNumber, undefined, userId);
      }
      setChallenge(challengeData);
      setSelectedAnswer('');
      setPhase('flee-challenge');
    } catch (err) {
      console.error('Failed to load flee challenge:', err);
      addLogEntry(combat?.combatTurn || 0, 'Error loading flee challenge!', 'status');
    }
  }

  async function handleFleeChallengeSubmit() {
    if (!combat || !challenge || !selectedAnswer || fleeRoll === null) return;

    // Check if answer is correct (case-insensitive, trimmed comparison)
    const userAnswer = selectedAnswer.trim().toUpperCase();
    const correctAnswer = (challenge.correctAnswer || '').trim().toUpperCase();
    const challengeSuccess = userAnswer === correctAnswer;

    // Simple modifier - dexterity stat value is the modifier
    const dexModifier = playerStats.dexterity;
    const appliedModifier = challengeSuccess ? dexModifier : 0;
    const total = fleeRoll + appliedModifier;

    // DC is 10 + enemy's damage (representing their speed/ability to catch you)
    const dc = 10 + Math.floor(combat.enemyDamage / 2);

    addLogEntry(
      combat.combatTurn,
      `Dexterity check: ${fleeRoll} + ${appliedModifier} = ${total} (DC ${dc})`,
      'action'
    );

    // Enemy gets a free attack (use enemy's damage with defense reduction)
    const enemyAttack = Math.max(0, combat.enemyDamage - Math.floor(playerStats.defense / 2));

    if (total >= dc) {
      // Success - dodge the attack!
      addLogEntry(combat.combatTurn, `Success! You dodge the enemy's attack and escape!`, 'status');
      setFleeDamage(0);
    } else {
      // Failure - take the attack
      const damage = Math.max(1, enemyAttack);
      setFleeDamage(damage);
      addLogEntry(combat.combatTurn, `Failed! The enemy lands a free attack for ${damage} damage!`, 'damage');

      // Update player health
      const newHealth = Math.max(0, playerStats.currentHealth - damage);
      setPlayerStats({
        ...playerStats,
        currentHealth: newHealth,
      });

      // Check if player died from the flee attack
      if (newHealth <= 0) {
        addLogEntry(combat.combatTurn, 'You were struck down while fleeing!', 'status');
        setPhase('defeat');
        await endCombatDefeat(userId);
        setTimeout(() => onDefeat(), 2000);
        return;
      }
    }

    setPhase('flee-result');

    // Show the result for 3 seconds then flee
    setTimeout(() => {
      onFlee();
    }, 3000);
  }

  if (loading || !combat) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-lg p-8 max-w-4xl w-full mx-4 animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-48 mb-6" />
          <div className="space-y-4">
            <div className="h-32 bg-slate-700 rounded" />
            <div className="h-32 bg-slate-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const enemyHealthPercent = (combat.enemyCurrentHealth / combat.enemyMaxHealth) * 100;
  const playerHealthPercent = (playerStats.currentHealth / playerStats.maxHealth) * 100;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg max-w-6xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 p-6">
          <h2 className="text-2xl font-bold text-orange-400">
            ⚔️ Combat - Turn {combat.combatTurn}
          </h2>
          <button
            onClick={handleFleeAttempt}
            disabled={phase === 'executing' || phase === 'victory' || phase === 'defeat' || phase === 'flee-roll' || phase === 'flee-challenge' || phase === 'flee-result'}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Flee
          </button>
        </div>

        {/* Combat Arena */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Enemy Side */}
            <div className="bg-red-900/20 border-2 border-red-700 rounded-lg p-4">
              <div className="text-center mb-4">
                <div className="mb-2 flex justify-center items-center mx-auto" style={{ width: '192px', height: '192px' }}>
                  {/* DEBUG: Log animation paths */}
                  {console.log('Enemy Animation Debug:', {
                    enemyId: enemy.id,
                    customAnimation: enemy.attackAnimation,
                    hardcodedAnimation: getEnemyAttackAnimation(enemy.id),
                    showEnemyAnimation,
                    finalPath: showEnemyAnimation && (enemy.attackAnimation || getEnemyAttackAnimation(enemy.id))
                      ? (enemy.attackAnimation || getEnemyAttackAnimation(enemy.id))
                      : getEnemyImage(enemy.id, enemy.icon)
                  })}
                  <img
                    src={showEnemyAnimation && (enemy.attackAnimation || getEnemyAttackAnimation(enemy.id))
                      ? (enemy.attackAnimation || getEnemyAttackAnimation(enemy.id))!
                      : getEnemyImage(enemy.id, enemy.icon)}
                    alt={combat.enemyName}
                    className="max-w-full max-h-full"
                    style={{ width: '192px', height: '192px', objectFit: 'contain' }}
                    key={showEnemyAnimation ? 'enemy-attack' : 'enemy-idle'}
                  />
                </div>
                <h3 className="text-xl font-bold text-red-400">{combat.enemyName}</h3>
                {combat.isBoss && (
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">BOSS</span>
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-400">HP</span>
                    <span className="text-gray-300">
                      {combat.enemyCurrentHealth}/{combat.enemyMaxHealth}
                    </span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-500"
                      style={{ width: `${enemyHealthPercent}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">⚔️ ATK:</span>
                    <span className="text-white">{combat.enemyDamage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">🛡️ DEF:</span>
                    <span className="text-white">{combat.enemyDefense}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Player Side */}
            <div className="bg-blue-900/20 border-2 border-blue-700 rounded-lg p-4">
              <div className="text-center mb-4">
                <div className="mb-2 flex justify-center items-center mx-auto" style={{ width: '192px', height: '192px' }}>
                  <img
                    src={showPlayerAnimation && getPlayerAttackAnimation(playerAvatar)
                      ? getPlayerAttackAnimation(playerAvatar)!
                      : getFullAvatar(playerAvatar)}
                    alt="Player"
                    className="max-w-full max-h-full"
                    style={{ width: '192px', height: '192px', objectFit: 'contain' }}
                    key={showPlayerAnimation ? 'player-attack' : 'player-idle'}
                  />
                </div>
                <h3 className="text-xl font-bold text-blue-400">You</h3>
                <span className="text-xs text-gray-400">Level {playerStats.level}</span>
              </div>
              <CharacterStatsDisplay stats={playerStats} compact />
            </div>
          </div>

          {/* Combat Log */}
          <div className="bg-slate-700/50 rounded-lg p-4 mb-6 max-h-40 overflow-y-auto">
            <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">Combat Log</h4>
            <div className="space-y-1 text-sm">
              {combatLog.slice(-8).map((entry, idx) => (
                <div
                  key={idx}
                  className={`${
                    entry.type === 'damage'
                      ? 'text-red-300'
                      : entry.type === 'heal'
                      ? 'text-green-300'
                      : entry.type === 'status'
                      ? 'text-yellow-300'
                      : 'text-gray-300'
                  }`}
                >
                  <span className="text-gray-500">[Turn {entry.turn}]</span> {entry.message}
                </div>
              ))}
            </div>
          </div>

          {/* Action Area */}
          {phase === 'ability-select' && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Choose Your Action</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {abilities.map((ability) => {
                  const canAfford = ability.manaCost <= playerStats.currentMana;
                  return (
                    <button
                      key={ability.id}
                      onClick={() => handleAbilitySelect(ability)}
                      disabled={!canAfford}
                      className={`bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed border-2 ${
                        canAfford ? 'border-orange-500' : 'border-gray-700'
                      } rounded-lg p-4 text-left transition-all`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{ability.icon}</span>
                        {ability.manaCost > 0 && (
                          <span
                            className={`text-sm ${
                              canAfford ? 'text-blue-400' : 'text-gray-500'
                            }`}
                          >
                            {ability.manaCost} MP
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-white">{ability.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{ability.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {phase === 'challenge' && challenge && (
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">{challenge.title}</h4>
                <p className="text-gray-300 text-sm whitespace-pre-line">{challenge.description}</p>
              </div>

              {/* Multiple Choice Options */}
              {challenge.choices && (
                <div className="space-y-3 mb-6">
                  {challenge.choices.map((choice, index) => {
                    const letter = choice.charAt(0); // Extract "A", "B", "C", or "D"
                    const isSelected = selectedAnswer === letter;
                    return (
                      <button
                        key={`${challenge.id}-${index}`}
                        onClick={() => setSelectedAnswer(letter)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'bg-orange-500 border-orange-400 text-white'
                            : 'bg-slate-700 border-slate-600 text-gray-300 hover:border-orange-500 hover:bg-slate-600'
                        }`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleChallengeSubmit}
                  disabled={!selectedAnswer}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Submit & Attack
                </button>
                <button
                  onClick={() => {
                    setPhase('ability-select');
                    setSelectedAbility(null);
                    setChallenge(null);
                    setSelectedAnswer('');
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {phase === 'executing' && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4 animate-pulse">⚡</div>
              <p className="text-white text-lg">Executing turn...</p>
            </div>
          )}

          {phase === 'victory' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-green-400 mb-2">Victory!</h3>
              <p className="text-gray-300">Calculating rewards...</p>
            </div>
          )}

          {phase === 'defeat' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💀</div>
              <h3 className="text-3xl font-bold text-red-400 mb-2">Defeated</h3>
              <p className="text-gray-300">You have been vanquished...</p>
            </div>
          )}

          {phase === 'flee-roll' && fleeRoll !== null && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎲</div>
              <h3 className="text-3xl font-bold text-blue-400 mb-2">Dexterity Check!</h3>
              <div className="bg-slate-700/50 rounded-lg p-6 mb-4 max-w-md mx-auto">
                <p className="text-gray-300 mb-4">
                  You rolled a <span className="text-orange-400 font-bold text-2xl">{fleeRoll}</span> on your d20!
                </p>
                <p className="text-sm text-gray-400">
                  Answer the coding challenge correctly to add your DEX modifier (+{playerStats.dexterity}) to the roll!
                </p>
              </div>
              <button
                onClick={handleStartFleeChallenge}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                💻 Start Coding Challenge
              </button>
            </div>
          )}

          {phase === 'flee-challenge' && challenge && (
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">{challenge.title}</h4>
                <p className="text-gray-300 text-sm whitespace-pre-line">{challenge.description}</p>
              </div>

              {/* Multiple Choice Options */}
              {challenge.choices && (
                <div className="space-y-3 mb-6">
                  {challenge.choices.map((choice, index) => {
                    const letter = choice.charAt(0);
                    const isSelected = selectedAnswer === letter;
                    return (
                      <button
                        key={`flee-${challenge.id}-${index}`}
                        onClick={() => setSelectedAnswer(letter)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'bg-orange-500 border-orange-400 text-white'
                            : 'bg-slate-700 border-slate-600 text-gray-300 hover:border-orange-500 hover:bg-slate-600'
                        }`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                onClick={handleFleeChallengeSubmit}
                disabled={!selectedAnswer}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Submit & Attempt Flee
              </button>
            </div>
          )}

          {phase === 'flee-result' && fleeRoll !== null && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🏃</div>
              <h3 className="text-3xl font-bold text-blue-400 mb-2">
                {fleeDamage === 0 ? 'Escaped!' : 'Hit While Fleeing!'}
              </h3>
              <p className="text-gray-300">
                {fleeDamage === 0
                  ? 'You successfully dodged the enemy\'s attack and escaped!'
                  : `You took ${fleeDamage} damage while fleeing!`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
