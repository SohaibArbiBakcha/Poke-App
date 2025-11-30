import React from 'react';
import { Heart, Sword, Shield, Sparkles, Eye, Zap } from 'lucide-react';

interface BattleStatsDisplayProps {
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  compact?: boolean;
}

export const BattleStatsDisplay: React.FC<BattleStatsDisplayProps> = ({ stats, compact = false }) => {
  const statInfo = [
    { key: 'hp', label: 'HP', value: stats.hp, icon: Heart, color: 'text-red-600' },
    { key: 'attack', label: 'ATK', value: stats.attack, icon: Sword, color: 'text-orange-600' },
    { key: 'defense', label: 'DEF', value: stats.defense, icon: Shield, color: 'text-blue-600' },
    { key: 'specialAttack', label: 'SP.A', value: stats.specialAttack, icon: Sparkles, color: 'text-purple-600' },
    { key: 'specialDefense', label: 'SP.D', value: stats.specialDefense, icon: Eye, color: 'text-green-600' },
    { key: 'speed', label: 'SPD', value: stats.speed, icon: Zap, color: 'text-yellow-600' }
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-2 text-xs">
        {statInfo.map(({ key, label, value, color }) => (
          <div key={key} className="flex items-center gap-1">
            <span className={`font-semibold ${color}`}>{label}</span>
            <span className="text-gray-700">{value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200">
      <h5 className="text-sm font-bold mb-2 text-gray-700">Battle Stats</h5>
      <div className="grid grid-cols-2 gap-2">
        {statInfo.map(({ key, label, value, icon: Icon, color }) => (
          <div key={key} className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1">
            <Icon size={14} className={color} />
            <span className="text-xs font-semibold text-gray-600">{label}</span>
            <span className="text-xs font-bold ml-auto">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
