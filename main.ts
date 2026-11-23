// Tiny stack VM (make.fun tiny-stack-vm-01-run-20261122), from the kit's ISA.md.
import{mkdirSync as M,readdirSync as R,readFileSync as f,writeFileSync as W}from'node:fs';
import{join as J}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
const G={16:(a,b)=>(a+b)|0,17:(a,b)=>(a-b)|0,18:Math.imul,19:(a,b)=>(a/b)|0,20:(a,b)=>a%b,21:(a,b)=>((a>>>0)/(b>>>0))|0,22:(a,b)=>((a>>>0)%(b>>>0))|0,24:(a,b)=>a&b,25:(a,b)=>a|b,26:(a,b)=>a^b,28:(a,b)=>a<<(b&31),29:(a,b)=>a>>(b&31),30:(a,b)=>(a>>>(b&31))|0,32:(a,b)=>a===b?1:0,33:(a,b)=>a<b?1:0,34:(a,b)=>(a>>>0)<(b>>>0)?1:0};
function V(p,q){
 const s=new Int32Array(256),c=new Int32Array(64),m=new Int32Array(256),o=new Uint8Array(65536),n=p.length;
 let a=0,d=0,e=0,g=0,h=0,t=0;
 const F=x=>[Buffer.from(o.subarray(0,h)),x];
 for(;;){
  if(t===1e6)return F(10);
  if(e<0||e>=n)return F(9);
  const k=p[e];
  if(!(k<8||k>15&&k<31||k>31&&k<35||k>47&&k<53||k>63&&k<66||k>79&&k<84))return F(5);
  const l=k===1?1:k===2?4:k>47&&k<52?2:0;
  if(e+1+l>n)return F(9);
  t++;const x=e+1+l;
  if(k===0)return F(0);
  if(k===1){if(a===256)return F(3);s[a++]=(p[e+1]<<24)>>24;}
  else if(k===2){if(a===256)return F(3);s[a++]=p[e+1]|p[e+2]<<8|p[e+3]<<16|p[e+4]<<24;}
  else if(k===3){if(a<1)return F(2);a--;}
  else if(k===4){if(a<1)return F(2);if(a===256)return F(3);s[a]=s[a-1];a++;}
  else if(k===5){if(a<2)return F(2);const z=s[a-1];s[a-1]=s[a-2];s[a-2]=z;}
  else if(k===6){if(a<2)return F(2);if(a===256)return F(3);s[a]=s[a-2];a++;}
  else if(k===7){if(a<3)return F(2);const z=s[a-3];s[a-3]=s[a-2];s[a-2]=s[a-1];s[a-1]=z;}
  else if(k>15&&k<35&&k!==23&&k!==27&&k!==31){
   if(a<2)return F(2);
   const b=s[--a],y=s[--a];
   if(k>18&&k<23&&b===0)return F(4);
   s[a++]=G[k](y,b);
  }
  else if(k===23){if(a<1)return F(2);s[a-1]=(-s[a-1])|0;}
  else if(k===27){if(a<1)return F(2);s[a-1]=~s[a-1];}
  else if(k===48){e=x+((p[e+1]|p[e+2]<<8)<<16>>16);continue;}
  else if(k===49||k===50){
   if(a<1)return F(2);
   const z=s[--a],v=(p[e+1]|p[e+2]<<8)<<16>>16;
   e=(k===49?z===0:z!==0)?x+v:x;continue;
  }
  else if(k===51){if(d===64)return F(7);c[d++]=x;e=p[e+1]|p[e+2]<<8;continue;}
  else if(k===52){if(d===0)return F(8);e=c[--d];continue;}
  else if(k===64){if(a<1)return F(2);const z=s[a-1];if(z<0||z>255)return F(6);s[a-1]=m[z];}
  else if(k===65){if(a<2)return F(2);const z=s[--a],y=s[--a];if(z<0||z>255)return F(6);m[z]=y;}
  else if(k===80){
   if(a<1)return F(2);
   const z=String(s[--a]);
   if(h+z.length>65536)return F(11);
   for(let i=0;i<z.length;i++)o[h++]=z.charCodeAt(i);
  }
  else if(k===81){if(a<1)return F(2);if(h+1>65536)return F(11);o[h++]=s[--a]&255;}
  else if(k===82){if(a===256)return F(3);s[a++]=g<q.length?q[g++]:-1;}
  else if(k===83){if(a<1)return F(2);return F(s[--a]&255);}
  e=x;
 }
}
for(const id of R(I).sort()){
 const P=f(J(I,id,'program.bin')),Q=f(J(I,id,'input.bin')),[B,C]=V(P,Q);
 M(J(O,id),{recursive:true});
 W(J(O,id,'stdout.bin'),B);W(J(O,id,'exit.txt'),C+'\n');
}
