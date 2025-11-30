import React from 'react';
import { typeColors, typeAbbreviations, calculateCombinedDefenses } from '../utils/typeEffectiveness';

interface TypeDefensesProps {
  types: string[];
}

export const TypeDefenses: React.FC<TypeDefensesProps> = ({ types }) => {
  const { weak4x, weak2x, resist2x, resist4x, immune } = calculateCombinedDefenses(types);

  const TypeBadge: React.FC<{ type: string; multiplier: string }> = ({ type, multiplier }) => (
    <div className="flex flex-col items-center">
      <div
        className="px-2 py-1 rounded text-white text-xs font-bold min-w-[45px] text-center"
        style={{ backgroundColor: typeColors[type] }}
      >
        {typeAbbreviations[type]}
      </div>
      <div className="text-xs font-semibold mt-1">{multiplier}</div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
      <h3 className="text-lg font-bold mb-4">Type Defenses</h3>
      <p className="text-xs text-gray-600 mb-4">The effectiveness of each type on {types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join('/')}.</p>

      <div className="space-y-4">
        {/* Weak 4x */}
        {weak4x.length > 0 && (
          <div>
            <div className="flex gap-2 flex-wrap">
              {weak4x.map(type => (
                <TypeBadge key={type} type={type} multiplier="4" />
              ))}
            </div>
          </div>
        )}

        {/* Weak 2x */}
        {weak2x.length > 0 && (
          <div>
            <div className="flex gap-2 flex-wrap">
              {weak2x.map(type => (
                <TypeBadge key={type} type={type} multiplier="2" />
              ))}
            </div>
          </div>
        )}

        {/* Resist 2x (½) */}
        {resist2x.length > 0 && (
          <div>
            <div className="flex gap-2 flex-wrap">
              {resist2x.map(type => (
                <TypeBadge key={type} type={type} multiplier="½" />
              ))}
            </div>
          </div>
        )}

        {/* Resist 4x (¼) */}
        {resist4x.length > 0 && (
          <div>
            <div className="flex gap-2 flex-wrap">
              {resist4x.map(type => (
                <TypeBadge key={type} type={type} multiplier="¼" />
              ))}
            </div>
          </div>
        )}

        {/* Immune (0) */}
        {immune.length > 0 && (
          <div>
            <div className="flex gap-2 flex-wrap">
              {immune.map(type => (
                <TypeBadge key={type} type={type} multiplier="0" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
