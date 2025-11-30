import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatChangeIndicatorProps {
  statName: string;
  oldValue: number;
  newValue: number;
}

export const StatChangeIndicator: React.FC<StatChangeIndicatorProps> = ({ statName, oldValue, newValue }) => {
  const change = newValue - oldValue;

  if (change === 0) return null;

  const isPositive = change > 0;
  const percentage = Math.abs(((change / oldValue) * 100)).toFixed(0);

  return (
    <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
      <span>{statName}: {oldValue} → {newValue}</span>
      <span className="text-xs opacity-75">({isPositive ? '+' : ''}{change}, {isPositive ? '+' : ''}{percentage}%)</span>
    </div>
  );
};

interface StatChangesDisplayProps {
  originalStats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  newStats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  originalTypes?: string[];
  newTypes?: string[];
}

export const StatChangesDisplay: React.FC<StatChangesDisplayProps> = ({
  originalStats,
  newStats,
  originalTypes,
  newTypes
}) => {
  const statLabels = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    specialAttack: 'SP.ATK',
    specialDefense: 'SP.DEF',
    speed: 'SPD'
  };

  const hasTypeChange = originalTypes && newTypes &&
    (originalTypes.length !== newTypes.length ||
     !originalTypes.every((type, idx) => type === newTypes[idx]));

  return (
    <div className="mt-3 p-3 bg-purple-50 border-2 border-purple-300 rounded-lg">
      <h5 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
        ⚡ Mega Evolution Stat Changes
      </h5>

      {/* Type Changes */}
      {hasTypeChange && (
        <div className="mb-2 text-sm">
          <span className="font-semibold text-purple-700">Type:</span>{' '}
          <span className="capitalize">{originalTypes?.join('/') || ''}</span>
          {' → '}
          <span className="capitalize font-bold text-purple-800">{newTypes?.join('/') || ''}</span>
        </div>
      )}

      {/* Stat Changes Grid */}
      <div className="grid grid-cols-2 gap-1">
        {Object.entries(statLabels).map(([key, label]) => (
          <StatChangeIndicator
            key={key}
            statName={label}
            oldValue={originalStats[key as keyof typeof originalStats]}
            newValue={newStats[key as keyof typeof newStats]}
          />
        ))}
      </div>
    </div>
  );
};
