import {describe,expect,it} from 'vitest';
import {checkEntries,digitCounts,emptyEntries,placeEntry} from './play';

describe('playing a puzzle',()=>{
  const solution=Array.from({length:81},(_,i)=>i%9+1);
  const puzzle=[...solution];
  puzzle[0]=0;
  puzzle[10]=0;

  it('only changes empty cells and allows erasing',()=>{
    const blank=emptyEntries();
    expect(placeEntry(puzzle,blank,1,5)).toBe(blank);
    expect(placeEntry(puzzle,blank,0,10)).toBe(blank);
    const entered=placeEntry(puzzle,blank,0,1);
    expect(entered[0]).toBe(1);
    expect(blank[0]).toBe(0);
    expect(placeEntry(puzzle,entered,0,0)[0]).toBe(0);
  });

  it('reports incorrect, remaining, and completed cells',()=>{
    const wrong=placeEntry(puzzle,emptyEntries(),0,2);
    expect(checkEntries(puzzle,solution,wrong)).toEqual({wrong:1,remaining:1,complete:false});
    const correct=placeEntry(puzzle,emptyEntries(),0,1);
    const complete=placeEntry(puzzle,correct,10,2);
    expect(checkEntries(puzzle,solution,complete)).toEqual({wrong:0,remaining:0,complete:true});
  });

  it('counts given and entered digits without double counting givens',()=>{
    const entries=placeEntry(puzzle,emptyEntries(),0,1);
    entries[1]=9;
    expect(digitCounts(puzzle,entries)[0]).toBe(9);
    expect(digitCounts(puzzle,entries)[8]).toBe(9);
    expect(digitCounts(puzzle,entries)[1]).toBe(8);
  });
});
