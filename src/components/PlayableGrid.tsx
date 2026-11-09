'use client';
import {useState} from 'react';
import type {Board} from '../lib/sudoku/core';

type Props={puzzle:Board;entries:Board;solution:Board;selected:number|null;checked:boolean;highlightMatches:boolean;highlightLines:boolean;onSelect:(cell:number)=>void;onInput:(digit:number,cell:number)=>void};

export function PlayableGrid({puzzle,entries,solution,selected,checked,highlightMatches,highlightLines,onSelect,onInput}:Props){
  const [hovered,setHovered]=useState<number|null>(null);
  const active=hovered??selected;
  const activeValue=active===null?0:puzzle[active]||entries[active];
  return <div className="sudoku-grid playable-grid" role="grid" aria-label="풀 수 있는 스도쿠 문제" onPointerLeave={()=>setHovered(null)}>
    {puzzle.map((given,i)=>{
      const value=given||entries[i];
      const sameLine=highlightLines&&active!==null&&(Math.floor(active/9)===Math.floor(i/9)||active%9===i%9);
      const matching=highlightMatches&&activeValue!==0&&value===activeValue;
      return <button type="button" className={`sudoku-cell ${given?'given':'editable'} ${sameLine?'related':''} ${selected===i?'selected':''} ${matching?'matching':''} ${checked&&!given&&value&&value!==solution[i]?'incorrect':''}`} data-cell={i} aria-label={`${Math.floor(i/9)+1}행 ${i%9+1}열, ${given?`주어진 숫자 ${given}`:value?`입력한 숫자 ${value}`:'빈칸'}`} onPointerEnter={()=>setHovered(i)} onClick={()=>onSelect(i)} onKeyDown={event=>{
        setHovered(null);
        if(/^[1-9]$/.test(event.key)){event.preventDefault();onSelect(i);onInput(Number(event.key),i);return}
        if(['Backspace','Delete','0'].includes(event.key)){event.preventDefault();onSelect(i);onInput(0,i);return}
        const step:Record<string,number>={ArrowRight:1,ArrowLeft:-1,ArrowDown:9,ArrowUp:-9};
        if(!(event.key in step))return;
        event.preventDefault();
        const next=(i+step[event.key]+81)%81;
        onSelect(next);
        event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-cell="${next}"]`)?.focus();
      }} key={i}>{value||''}</button>;
    })}
  </div>;
}
