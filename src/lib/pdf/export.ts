import {PDFDocument,StandardFonts,rgb,type PDFPage} from 'pdf-lib';
import {PAPER,PAGE_CHROME,makePages,answerLayout,digitTrackerLayout} from '../book/pages';
import type {Book} from '../sudoku/batch';
import type {Board} from '../sudoku/core';

const mm=(n:number)=>n*72/25.4;

export async function exportPdf(book:Book,print=false):Promise<Uint8Array>{
  const doc=await PDFDocument.create();
  const font=await doc.embedFont(StandardFonts.Helvetica);
  const bold=await doc.embedFont(StandardFonts.HelveticaBold);
  const p=PAPER[book.request.paper],offset=print?8:0;
  const ink=rgb(.08,.08,.08),muted=rgb(.42,.42,.42);
  const inset=p.width*PAGE_CHROME.headerInset;
  for(const [number,data] of makePages(book.items).entries()){
    const page=doc.addPage([mm(p.width+offset*2),mm(p.height+offset*2)]);
    if(print){
      page.setTrimBox(mm(8),mm(8),mm(p.width),mm(p.height));
      page.setBleedBox(mm(5),mm(5),mm(p.width+6),mm(p.height+6));
      crop(page,p.width,p.height);
    }
    const x=(v:number)=>mm(offset+v),y=(v:number)=>mm(offset+p.height-v);
    const line=(x1:number,y1:number,x2:number,y2:number,thickness=.25,color=ink)=>page.drawLine({start:{x:x(x1),y:y(y1)},end:{x:x(x2),y:y(y2)},thickness,color});
    const label=(value:string,xv:number,yv:number,size=8,strong=false)=>page.drawText(value,{x:x(xv),y:y(yv),font:strong?bold:font,size,color:ink});
    const labelRight=(value:string,rightMm:number,yv:number,size=8)=>label(value,rightMm-font.widthOfTextAtSize(value,size)/mm(1),yv,size);
    const grid=(board:Board|undefined,xv:number,yv:number,size:number,digitSize:number)=>{
      for(let i=0;i<=9;i++){
        const d=size*i/9,thickness=i%3===0?.8:.22;
        line(xv+d,yv,xv+d,yv+size,thickness);
        line(xv,yv+d,xv+size,yv+d,thickness);
      }
      board?.forEach((n,i)=>{
        if(!n)return;
        const value=String(n),cx=xv+(i%9+.5)*size/9,cy=yv+(Math.floor(i/9)+.5)*size/9;
        page.drawText(value,{x:x(cx)-font.widthOfTextAtSize(value,digitSize)/2,y:y(cy)-digitSize*.34,font,size:digitSize,color:ink});
      });
    };
    const headerY=p.height*PAGE_CHROME.headerText;
    line(inset,p.height*PAGE_CHROME.headerLine,p.width-inset,p.height*PAGE_CHROME.headerLine,.35,muted);
    if(data.kind==='puzzle'){
      const item=book.items[data.index];
      label('SUDOKU',inset,headerY,9,true);
      labelRight(`NO. ${String(data.index+1).padStart(2,'0')}`,p.width-inset,headerY,7);
      label(item.difficulty.toUpperCase(),inset,p.height*PAGE_CHROME.difficultyText,7);
      grid(item.puzzle,(p.width-p.puzzleGrid)/2,p.puzzleY,p.puzzleGrid,11);
      const tracker=digitTrackerLayout(book.request.paper);
      for(let digit=1;digit<=9;digit++){
        const centerX=x(tracker.x+(digit-.5)*tracker.width/9),centerY=y(tracker.y+2.5);
        page.drawCircle({x:centerX,y:centerY,size:mm(2.5),borderWidth:.45,borderColor:ink});
        const value=String(digit),size=7;
        page.drawText(value,{x:centerX-font.widthOfTextAtSize(value,size)/2,y:centerY-size*.34,font,size,color:ink});
      }
      labelRight(String(number+1),p.width-inset,p.height-PAGE_CHROME.footerBottomMm,7);
    }else{
      const item=book.items[data.index],answer=answerLayout(book.request.paper);
      label('NOTES',inset,headerY,9,true);
      grid(undefined,(p.width-p.grid)/2,p.notesY,p.grid,0);
      grid(item.solution,answer.x,answer.y,answer.size,5.3);
      label(String(number+1),inset,p.height-PAGE_CHROME.footerBottomMm,7);
    }
  }
  doc.setTitle(book.request.title||'Sudoku Notebook');
  doc.setSubject(`Validated Sudoku notebook ${book.algorithmVersion}`);
  return doc.save();
}

function crop(page:PDFPage,w:number,h:number){
  const gray=rgb(.74,.74,.74),x=(v:number)=>mm(8+v),y=(v:number)=>mm(8+h-v);
  for(const cx of [0,w])for(const cy of [0,h]){
    const sx=cx===0?-1:1,sy=cy===0?-1:1;
    page.drawLine({start:{x:x(cx+sx*3),y:y(cy)},end:{x:x(cx+sx*7),y:y(cy)},thickness:.25,color:gray});
    page.drawLine({start:{x:x(cx),y:y(cy+sy*3)},end:{x:x(cx),y:y(cy+sy*7)},thickness:.25,color:gray});
  }
}
