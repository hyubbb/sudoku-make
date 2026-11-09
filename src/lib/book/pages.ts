import type {Item,Paper} from '../sudoku/core';

export const PAPER:Record<Paper,{width:number;height:number;contentWidth:number;contentHeight:number;grid:number;puzzleGrid:number;answer:number;notesY:number;puzzleY:number}>={
  a7:{width:74,height:105,contentWidth:64,contentHeight:95,grid:52,puzzleGrid:52,answer:26,notesY:17,puzzleY:24},
  'card-75x117':{width:75,height:117,contentWidth:65,contentHeight:100,grid:49,puzzleGrid:49,answer:25,notesY:20,puzzleY:27},
  'card-65x100':{width:65,height:100,contentWidth:55,contentHeight:90,grid:49,puzzleGrid:55,answer:25,notesY:16,puzzleY:20},
};

// Shared trim-relative positions for browser preview and PDF pages.
export const PAGE_CHROME={headerInset:.07,headerTop:.06,headerLine:.11,headerText:.095,difficultyTop:.14,difficultyText:.17,footerBottomMm:5} as const;

export function answerLayout(paper:Paper){const p=PAPER[paper],bottom=paper==='card-75x117'?10:6;return {x:p.width-6-p.answer,y:p.height-bottom-p.answer,size:p.answer}}
export function digitTrackerLayout(paper:Paper){const p=PAPER[paper],width=Math.min(p.contentWidth,54);return {x:(p.width-width)/2,y:p.puzzleY+p.puzzleGrid+8,width}}
export type Page={kind:'puzzle'|'answer-notes';index:number};
export function makePages(items:Item[]):Page[]{return items.flatMap((_,index)=>[{kind:'puzzle' as const,index},{kind:'answer-notes' as const,index}])}
