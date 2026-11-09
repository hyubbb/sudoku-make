import {describe,it,expect} from 'vitest';
import {solution,valid,carve,countSolutions,exactCover} from './core';
import {classify,solveLogical} from './logical';
import {makePages,PAPER,PAGE_CHROME,answerLayout} from '../book/pages';
import {generate} from './batch';
import {exportPdf} from '../pdf/export';
import {PDFDocument} from 'pdf-lib';
import {seedForNextRun} from './run-seed';
describe('Sudoku publication checks',()=>{
  it('changes the seed on a repeated generation and preserves a manually entered seed',()=>{
    expect(seedForNextRun('manual',null,'abcdefgh')).toBe('manual');
    expect(seedForNextRun('manual','manual','abcdefgh')).toBe('manual-abcdefgh');
    expect(seedForNextRun('manual','manual-abcdefgh','abcdefgh')).toBe('manual');
    expect(seedForNextRun('x'.repeat(100),'x'.repeat(100),'abcdefgh')).toHaveLength(100);
  });
  it('reproduces valid complete boards',()=>{expect(solution('same')).toEqual(solution('same'));for(let i=0;i<100;i++)expect(valid(solution(`s${i}`),true)).toBe(true)});
  it('agrees on zero, one, and multiple solutions',()=>{const solved=solution('fixture'),one=[...solved],zero=[...solved],many=Array(81).fill(0);one[0]=0;zero[0]=zero[1];for(const board of [zero,one,many])expect(exactCover(board).count).toBe(countSolutions(board));expect(exactCover(one).first).toEqual(solved)});
  it('only classifies a logically solved unique puzzle',()=>{const draft=carve('known',40,true);expect(countSolutions(draft.puzzle)).toBe(1);expect(exactCover(draft.puzzle).count).toBe(1);expect(solveLogical(draft.puzzle,'easy').status).toBe('solved');expect(classify(draft.puzzle)).toBe('easy')});
  it('exports only alternating puzzle and answer pages',()=>{const dummy=Array.from({length:31},()=>({})) as never[];const pages=makePages(dummy);expect(pages).toHaveLength(62);expect(pages[0]).toEqual({kind:'puzzle',index:0});expect(pages[1]).toEqual({kind:'answer-notes',index:0});expect(pages[2]).toEqual({kind:'puzzle',index:1});expect(makePages(dummy.slice(0,30))).toHaveLength(60)});
  it('exports vector PDF with expected page boxes',async()=>{const book=await generate({seed:'pdf',quantities:{easy:1,medium:0,hard:0},symmetry180:false,paper:'card-75x117',title:'PDF'});const pdf=await PDFDocument.load(await exportPdf(book,true));expect(pdf.getPageCount()).toBe(2);const page=pdf.getPage(0);expect(page.getWidth()).toBeCloseTo(91*72/25.4);expect(page.getHeight()).toBeCloseTo(133*72/25.4);expect(page.getTrimBox().width).toBeCloseTo(75*72/25.4);expect(PAPER['card-75x117'].contentWidth).toBe(65);expect(PAPER['card-75x117'].contentHeight).toBe(100)});
  it('exports the 65 by 100 mm notebook size',async()=>{const book=await generate({seed:'small',quantities:{easy:1,medium:0,hard:0},symmetry180:false,paper:'card-65x100',title:'Small'});const pdf=await PDFDocument.load(await exportPdf(book,true));const page=pdf.getPage(0);expect(page.getWidth()).toBeCloseTo(81*72/25.4);expect(page.getHeight()).toBeCloseTo(116*72/25.4);expect(page.getTrimBox().width).toBeCloseTo(65*72/25.4);expect(page.getTrimBox().height).toBeCloseTo(100*72/25.4)});
  it('keeps the answer below notes and the page number beside it',()=>{for(const paper of ['a7','card-75x117','card-65x100'] as const){const p=PAPER[paper],a=answerLayout(paper);expect(a.y).toBeGreaterThan(p.notesY+p.grid);expect(p.width*PAGE_CHROME.headerInset).toBeLessThan(a.x);expect(a.y+a.size).toBeLessThanOrEqual(p.height)}});
});
