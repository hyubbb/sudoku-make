import {digitCounts,emptyEntries} from '../lib/sudoku/play';
import type {Board} from '../lib/sudoku/core';

export function DigitTracker({puzzle,entries}: {puzzle:Board;entries?:Board}){
  const playing=entries!==undefined;
  const counts=playing?digitCounts(puzzle,entries):digitCounts(puzzle,emptyEntries());
  return <div className={`digit-tracker ${playing?'live':''}`} aria-label={playing?'숫자별 채운 개수':'숫자별 체크란'}>
    {counts.map((count,index)=><div className={`digit-track-item ${playing&&count===9?'complete':''}`} key={index} aria-label={playing?`${index+1}: ${count}/9칸 채움`:`${index+1} 체크란`}>
      <span className="digit-track-circle">{index+1}</span>
      {playing&&<span className="digit-track-count">{count===9?'✓':`${count}/9`}</span>}
    </div>)}
  </div>;
}
