import {generate} from '../lib/sudoku/batch';
import type {Request} from '../lib/sudoku/core';
let cancelled=false;
self.onmessage=async(event:MessageEvent<{type:'START'|'CANCEL';request?:Request}>)=>{if(event.data.type==='CANCEL'){cancelled=true;return}if(!event.data.request)return;cancelled=false;try{const book=await generate(event.data.request,report=>self.postMessage({type:'PROGRESS',report}),()=>cancelled);self.postMessage({type:'DONE',book})}catch(error){self.postMessage({type:'ERROR',message:error instanceof Error?error.message:String(error)})}};
