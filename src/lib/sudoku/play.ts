import type {Board} from './core';

export function emptyEntries():Board{return Array(81).fill(0)}

export function digitCounts(puzzle:Board,entries:Board):number[]{
  const counts=Array(9).fill(0);
  for(let i=0;i<81;i++){
    const digit=puzzle[i]||entries[i];
    if(digit>=1&&digit<=9)counts[digit-1]++;
  }
  return counts;
}

export function placeEntry(puzzle:Board,entries:Board,cell:number,digit:number):Board{
  if(cell<0||cell>=81||puzzle[cell]!==0||!Number.isInteger(digit)||digit<0||digit>9)return entries;
  const next=[...entries];
  next[cell]=digit;
  return next;
}

export function checkEntries(puzzle:Board,solution:Board,entries:Board){
  let wrong=0,remaining=0;
  for(let i=0;i<81;i++){
    if(puzzle[i]!==0)continue;
    if(!entries[i])remaining++;
    else if(entries[i]!==solution[i])wrong++;
  }
  return {wrong,remaining,complete:wrong===0&&remaining===0};
}
