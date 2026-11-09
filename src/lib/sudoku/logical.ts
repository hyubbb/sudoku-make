import {groups,peers,valid,type Board,type Difficulty,type Technique} from './core';
const bit=(n:number)=>1<<(n-1);const digits=(m:number)=>Array.from({length:9},(_,i)=>i+1).filter(n=>m&bit(n));
const policies:Record<Difficulty,Technique[]>={easy:['naked-single','hidden-single'],medium:['naked-single','hidden-single','locked-candidate'],hard:['naked-single','hidden-single','locked-candidate','naked-pair','hidden-pair'],'super-hard':['naked-single','hidden-single','locked-candidate','naked-pair','hidden-pair','x-wing']};
export function solveLogical(input:Board,level:Difficulty){if(!valid(input))return {status:'contradiction' as const,techniques:[] as Technique[]};const board=[...input], masks=board.map((v,i)=>v?0:511&~peers[i].reduce((m,p)=>m|bit(board[p]||0),0)),used:Technique[]=[];const allowed=policies[level];
  const remove=(i:number,m:number)=>{const next=masks[i]&~m;if(next===masks[i])return false;masks[i]=next;return true};
  const place=(i:number,n:number,t:Technique)=>{board[i]=n;masks[i]=0;for(const p of peers[i])if(!board[p])remove(p,bit(n));used.push(t)};
  for(let cycle=0;cycle<2000;cycle++){
    if(board.every(Boolean))return {status:valid(board,true)?'solved' as const:'contradiction' as const,techniques:used};
    if(board.some((v,i)=>!v&&!masks[i]))return {status:'contradiction' as const,techniques:used};
    let changed=false;
    for(let i=0;i<81&&!changed;i++)if(!board[i]&&digits(masks[i]).length===1){place(i,digits(masks[i])[0],'naked-single');changed=true}
    if(changed)continue;
    outer:for(const group of groups)for(let n=1;n<=9;n++){if(group.some(i=>board[i]===n))continue;const cells=group.filter(i=>!board[i]&&(masks[i]&bit(n)));if(!cells.length)return {status:'contradiction' as const,techniques:used};if(cells.length===1){place(cells[0],n,'hidden-single');changed=true;break outer}}
    if(changed)continue;
    if(allowed.includes('locked-candidate')){
      outerLocked:for(let b=18;b<27;b++)for(let n=1;n<=9;n++){const cells=groups[b].filter(i=>!board[i]&&(masks[i]&bit(n)));if(cells.length<2)continue;for(const axis of [0,1]){const line=(i:number)=>axis?i%9:Math.floor(i/9);if(cells.every(i=>line(i)===line(cells[0]))){const g=groups[(axis?9:0)+line(cells[0])];for(const i of g)if(!groups[b].includes(i)&&remove(i,bit(n))){changed=true;break}if(changed)break outerLocked}}}
      if(changed){used.push('locked-candidate');continue}
    }
    if(allowed.includes('naked-pair')){outerPair:for(const group of groups){const pairs=group.filter(i=>!board[i]&&digits(masks[i]).length===2);for(const i of pairs){const same=pairs.filter(j=>masks[j]===masks[i]);if(same.length!==2||same[0]!==i)continue;for(const j of group)if(!same.includes(j)&&remove(j,masks[i])){changed=true;break}if(changed)break outerPair}}if(changed){used.push('naked-pair');continue}}
    if(allowed.includes('hidden-pair')){outerHidden:for(const group of groups)for(let a=1;a<=8;a++)for(let b=a+1;b<=9;b++){const ca=group.filter(i=>!board[i]&&(masks[i]&bit(a))),cb=group.filter(i=>!board[i]&&(masks[i]&bit(b)));if(ca.length===2&&cb.length===2&&ca[0]===cb[0]&&ca[1]===cb[1])for(const i of ca)if(remove(i,~(bit(a)|bit(b)))){changed=true;break outerHidden}}if(changed){used.push('hidden-pair');continue}}
    if(allowed.includes('x-wing')){outerWing:for(let n=1;n<=9;n++)for(let axis=0;axis<2;axis++){const line=(k:number)=>axis?groups[9+k]:groups[k];for(let a=0;a<8;a++){const ca=line(a).filter(i=>!board[i]&&(masks[i]&bit(n))).map(i=>axis?Math.floor(i/9):i%9);if(ca.length!==2)continue;for(let b=a+1;b<9;b++){const cb=line(b).filter(i=>!board[i]&&(masks[i]&bit(n))).map(i=>axis?Math.floor(i/9):i%9);if(cb.length!==2||ca[0]!==cb[0]||ca[1]!==cb[1])continue;for(let k=0;k<9;k++)if(k!==a&&k!==b)for(const cross of ca){const i=axis?cross*9+k:k*9+cross;if(!board[i]&&remove(i,bit(n)))changed=true}if(changed)break outerWing}}}if(changed){used.push('x-wing');continue}}
    return {status:'stuck' as const,techniques:used};
  }
  return {status:'stuck' as const,techniques:used};
}
export function classify(board:Board):Difficulty|'unsupported'{for(const level of ['easy','medium','hard','super-hard'] as const)if(solveLogical(board,level).status==='solved')return level;return 'unsupported'}
