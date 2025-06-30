import React from 'react';
import { Link } from 'react-router-dom';
import { EvolutionNode } from '../types/pokemon';

interface EvolutionChainProps {
  chain: EvolutionNode | null; // null while loading / not available
  megaForms?: { spriteUrl: string; detailsText: string }[];
}

/**
 * Displays all possible evolution paths in rows.
 * Each path is rendered left-to-right with arrows and requirement captions.
 */
export const EvolutionChain: React.FC<EvolutionChainProps> = ({ chain, megaForms = [] }) => {
  if (!chain) return null;

  // Collect every possible path from root to leaves
  const paths: EvolutionNode[][] = [];
  const dfs = (node: EvolutionNode, current: EvolutionNode[]) => {
    const next = [...current, node];
    if (node.evolvesTo.length === 0) {
      paths.push(next);
    } else {
      node.evolvesTo.forEach((child) => dfs(child, next));
    }
  };
  dfs(chain, []);

  return (
    <div className="flex flex-col gap-4 items-start">
      {paths.map((path, rowIdx) => (
        <div key={rowIdx} className="flex items-center gap-2 flex-wrap">
          {path.map((node, idx) => (
            <React.Fragment key={`${rowIdx}-${node.speciesName}`}> 
              <Link to={`/pokemon/${node.speciesName}`} className="flex flex-col items-center group">
                <img
                  src={node.spriteUrl}
                  alt={node.speciesName}
                  className="w-20 h-20 object-contain transition-transform group-hover:scale-110"
                />
                <span className="capitalize text-sm mt-1 group-hover:underline">{node.speciesName}</span>
              </Link>
              {idx < path.length - 1 && (
                <div className="flex flex-col items-center">
                  <span className="text-xl">→</span>
                  {path[idx + 1].requirements?.detailsText && (
                    <span className="text-[10px] text-gray-600 whitespace-nowrap">
                      {path[idx + 1].requirements!.detailsText}
                    </span>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      ))}
      {megaForms.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-4">
          {(() => {
            // pick the base (first path's leaf) as the origin for mega
            const baseNode = paths[0][paths[0].length - 1];
            return (
              <>
                <div className="flex flex-col items-center">
                  <img
                    src={baseNode.spriteUrl}
                    alt={baseNode.speciesName}
                    className="w-20 h-20 object-contain"
                  />
                  <span className="capitalize text-sm mt-1">{baseNode.speciesName}</span>
                </div>
                {megaForms.map((mf, idx) => (
                  <React.Fragment key={`mega-${idx}`}>
                    <div className="flex flex-col items-center">
                      <span className="text-xl ml-2 mr-2">→</span>
                      <span className="text-[10px] text-gray-600 whitespace-nowrap">{mf.detailsText}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src={mf.spriteUrl}
                        alt="mega form"
                        className="w-20 h-20 object-contain"
                      />
                      <span className="capitalize text-sm mt-1">Mega</span>
                    </div>
                  </React.Fragment>
                ))}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
