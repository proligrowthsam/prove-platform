'use client';

import { useState, useEffect, useRef } from "react";

const C = {
  ink:"#04080F", navy:"#070C18", card:"#0B1220", cardHi:"#0E1628",
  border:"#141E30", borderHi:"#1C2A40", green:"#00E87A",
  greenGlow:"#00E87A25", greenFaint:"#00E87A0A", near:"#EBF0FF",
  text:"#C4CBDF", muted:"#556070", dim:"#1A2035",
  amber:"#FFB800", red:"#FF4444", sky:"#38BDF8", purple:"#A78BFA",
  // workspace tones
  wbg:"#0F1117", wsidebar:"#0C0E14", wcard:"#161B27", wborder:"#222840",
};
const F = {
  display:"'Bebas Neue',Impact,sans-serif",
  head:"'Syne',sans-serif", body:"'DM Sans',sans-serif",
  mono:"'JetBrains Mono',monospace",
};
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}body{background:${C.ink};overflow-x:hidden;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:${C.ink};}::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.2;}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
@keyframes glow{0%,100%{box-shadow:0 0 40px ${C.green}15;}50%{box-shadow:0 0 80px ${C.green}38;}}
@keyframes scan{0%{top:-30%;}100%{top:130%;}}
@keyframes marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
@keyframes rankIn{from{opacity:0;transform:scale(.88);}to{opacity:1;transform:scale(1);}}
@keyframes codeScroll{0%{transform:translateY(0);}100%{transform:translateY(-60%)}}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes ping{0%{transform:scale(1);opacity:1;}100%{transform:scale(2.2);opacity:0;}}
@keyframes feedIn{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}
`;

/* ── RANKS ── */
const RANKS=[
  {level:1,name:"Recruit",icon:"◈",color:"#4A5568",xp:0,pct:"100%",feel:"You just showed up."},
  {level:2,name:"Scout",icon:"◇",color:"#718096",xp:200,pct:"80%",feel:"Moving. Watching. Learning."},
  {level:3,name:"Corporal",icon:"▲",color:"#90CDF4",xp:500,pct:"65%",feel:"First blood. You are real."},
  {level:4,name:"Sergeant",icon:"⬡",color:"#63B3ED",xp:1000,pct:"50%",feel:"Trusted. Steady. Reliable."},
  {level:5,name:"Lieutenant",icon:"✦",color:"#4FC3F7",xp:2000,pct:"38%",feel:"You lead with your work."},
  {level:6,name:"Captain",icon:"⬟",color:"#48BB78",xp:3500,pct:"28%",feel:"Others follow your standard."},
  {level:7,name:"Commander",icon:"⬢",color:C.green,xp:5500,pct:"18%",feel:"You change how teams operate."},
  {level:8,name:"Ronin",icon:"⚔",color:"#F6AD55",xp:8000,pct:"12%",feel:"Elite. Independent. Unstoppable."},
  {level:9,name:"General",icon:"★",color:C.amber,xp:11000,pct:"7%",feel:"You move companies."},
  {level:10,name:"Shogun",icon:"⛩",color:"#FC8181",xp:15000,pct:"4%",feel:"Ancient mastery. Modern precision."},
  {level:11,name:"Emperor",icon:"♛",color:"#E84393",xp:20000,pct:"1%",feel:"You built empires of value."},
  {level:12,name:"Pirate",icon:"☠",color:C.red,xp:30000,pct:"0.1%",feel:"No rules. Only results."},
];
const getRank=xp=>{let r=RANKS[0];for(const rk of RANKS){if(xp>=rk.xp)r=rk;}return r;};
const getNext=xp=>{for(const r of RANKS){if(xp<r.xp)return r;}return null;};

/* ── MOCK USER ── */
const DEMO_USER={name:"Alex Chen",role:"Full Stack Developer",company:"TechCorp",email:"alex@techcorp.com",xp:3820,streak:11,metrics:{cost:91,risk:87,quality:94,value:96,comm:88,vi:94},
impactLog:[
  {week:"This week",pillar:"Eliminate",color:C.green,item:"Cancelled unused APM tool",value:"$240/mo · recurring forever",score:96},
  {week:"This week",pillar:"Raise",color:C.purple,item:"Resolved auth timeout — 18min",value:"Risk score +18pts",score:91},
  {week:"Last week",pillar:"Create",color:C.amber,item:"Built deploy automation",value:"Saves 3.2hrs/week · $5,760/yr",score:94},
  {week:"Last week",pillar:"Eliminate",color:C.green,item:"Removed deprecated endpoints",value:"Tech debt -40% in auth service",score:88},
]};
const TEAM=[
  {name:"Maria Santos",role:"Frontend",rank:"Commander",xp:5820,color:C.green,status:"active",activity:"Merging PR · component library v2",vi:97,comm:95,trend:"+0.5",avatar:"MS"},
  {name:"Alex Chen",role:"Full Stack",rank:"Captain",xp:3820,color:C.green,status:"active",activity:"You · reviewing code",vi:94,comm:88,trend:"+0.3",avatar:"AC",isYou:true},
  {name:"Sarah Kim",role:"DevOps",rank:"Lieutenant",xp:2100,color:"#4FC3F7",status:"active",activity:"Deploying to staging",vi:86,comm:82,trend:"+0.1",avatar:"SK"},
  {name:"James Okafor",role:"Backend",rank:"Corporal",xp:480,color:C.red,status:"away",activity:"Last seen 3h ago",vi:48,comm:51,trend:"-0.4",avatar:"JO"},
  {name:"Priya Mehta",role:"Mobile",rank:"Sergeant",xp:1200,color:"#63B3ED",status:"active",activity:"Writing unit tests",vi:78,comm:74,trend:"+0.2",avatar:"PM"},
];

/* ── HELPERS ── */
function useInView(ref,t=.1){const[v,sv]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)sv(true);},{threshold:t});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);return v;}
function useCount(target,ms=1800,go=true){const[n,sn]=useState(0);useEffect(()=>{if(!go)return;let raf,t0=null;const tick=ts=>{if(!t0)t0=ts;const p=Math.min((ts-t0)/ms,1);sn(Math.round(target*(1-Math.pow(1-p,3))));if(p<1)raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);},[target,go]);return n;}

/* ── SHARED UI ── */
function Logo({size=22,light=false}){return<span style={{fontFamily:F.head,fontWeight:900,fontSize:size,letterSpacing:"-.03em",userSelect:"none"}}><span style={{color:C.green,textShadow:`0 0 18px ${C.green}88`}}>PRO</span><span style={{color:light?"#E8ECF8":C.near}}>VE</span></span>;}
function Tag({children,color=C.green,small}){return<span style={{background:`${color}12`,color,border:`1px solid ${color}28`,padding:small?"2px 8px":"4px 12px",borderRadius:100,fontSize:small?9:11,fontWeight:700,fontFamily:F.mono,letterSpacing:".09em",whiteSpace:"nowrap"}}>{children}</span>;}
function Pill({children,color=C.green}){return<span style={{background:`${color}15`,color,border:`1px solid ${color}30`,padding:"3px 10px",borderRadius:100,fontSize:10,fontWeight:700,fontFamily:F.mono,letterSpacing:".08em",whiteSpace:"nowrap"}}>{children}</span>;}
function Bar({value,color,height=6}){return<div style={{height,background:C.dim,borderRadius:100,overflow:"hidden"}}><div style={{height:"100%",width:`${value}%`,background:`linear-gradient(to right,${color}88,${color})`,borderRadius:100,boxShadow:`0 0 6px ${color}55`,transition:"width 1s ease"}}/></div>;}
function Label({children,color=C.muted}){return<div style={{fontSize:10,color,fontFamily:F.mono,letterSpacing:".1em",fontWeight:700,marginBottom:6}}>{children}</div>;}
function Avatar({initials,color,size=34,ring}){return<div style={{width:size,height:size,borderRadius:"50%",background:`${color}20`,border:`${ring?2:1}px solid ${color}${ring?"66":"30"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.28,fontWeight:800,color,flexShrink:0,fontFamily:F.head}}>{initials}</div>;}
function StatusDot({s}){const col=s==="active"?C.green:s==="away"?C.amber:C.muted;return<div style={{position:"relative",width:8,height:8,flexShrink:0}}><div style={{width:8,height:8,borderRadius:"50%",background:col}}/>{s==="active"&&<div style={{position:"absolute",inset:0,borderRadius:"50%",background:col,animation:"ping 2s ease infinite",opacity:.4}}/>}</div>;}
function Btn({children,onClick,v="green",sm,lg,full,icon}){
  const[h,sh]=useState(false);
  const m={
    green:{bg:h?"#07FF8C":C.green,fg:C.ink,bd:"none",sh:h?`0 6px 24px ${C.green}44`:`0 2px 12px ${C.green}22`},
    outline:{bg:h?`${C.green}10`:"transparent",fg:h?C.green:C.near,bd:`1px solid ${h?C.green+"44":C.border}`,sh:"none"},
    ghost:{bg:h?C.cardHi:"transparent",fg:C.muted,bd:"none",sh:"none"},
    amber:{bg:h?"#FFD044":C.amber,fg:C.ink,bd:"none",sh:h?`0 6px 24px ${C.amber}44`:`0 2px 12px ${C.amber}22`},
    sky:{bg:h?"#60CEFF":C.sky,fg:C.ink,bd:"none",sh:"none"},
    red:{bg:h?"#FF6677":C.red,fg:"#fff",bd:"none",sh:"none"},
  };
  const s=m[v]||m.green;
  return<button onClick={onClick} onMouseEnter={()=>sh(true)} onMouseLeave={()=>sh(false)} style={{background:s.bg,color:s.fg,border:s.bd||"none",boxShadow:s.sh,padding:lg?"14px 32px":sm?"6px 12px":"9px 20px",borderRadius:8,cursor:"pointer",fontSize:lg?16:sm?11:13,fontWeight:700,fontFamily:F.body,transition:"all .15s",transform:h&&v!=="ghost"?"translateY(-1px)":"none",width:full?"100%":"auto",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:icon?6:0}}>{icon&&<span>{icon}</span>}{children}</button>;
}
function WCard({children,style={},glow,color}){return<div style={{background:C.wcard,border:`1px solid ${glow?color+"33":C.wborder}`,borderRadius:14,padding:"20px",boxShadow:glow?`0 0 28px ${color}10`:"none",...style}}>{children}</div>;}

/* ══════════════════════════════
   MARKETING SITE
══════════════════════════════ */
function Nav({onNav,scrolled}){
  return<nav style={{position:"fixed",top:0,left:0,right:0,zIndex:999,height:66,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 48px",background:scrolled?"rgba(4,8,15,.95)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid ${C.border}`:"none",transition:"all .3s"}}>
    <Logo/>
    <div style={{display:"flex",gap:36}}>{[["How It Works","#how"],["Ranks","#ranks"],["For Developers","#dev"],["Pricing","#price"]].map(([l,h])=><a key={l} href={h} style={{color:C.muted,fontSize:14,fontWeight:500,textDecoration:"none",fontFamily:F.body,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color=C.near} onMouseLeave={e=>e.target.style.color=C.muted}>{l}</a>)}</div>
    <div style={{display:"flex",gap:10}}><Btn v="outline" onClick={()=>onNav("workspace")}>Sign In</Btn><Btn onClick={()=>onNav("onboard")}>Get Started Free</Btn></div>
  </nav>;
}

function Hero({onNav}){
  const[mx,smx]=useState(50);const[my,smy]=useState(40);
  const tv=useCount(127400,2400,true);
  useEffect(()=>{const h=e=>{smx((e.clientX/window.innerWidth)*100);smy((e.clientY/window.innerHeight)*100);};window.addEventListener("mousemove",h);return()=>window.removeEventListener("mousemove",h);},[]);
  return<section style={{minHeight:"100vh",background:C.ink,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",padding:"100px 24px 80px"}}>
    <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at ${mx}% ${my}%, ${C.greenGlow} 0%, transparent 58%)`,transition:"background .4s",pointerEvents:"none"}}/>
    <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${C.border} 1px,transparent 1px)`,backgroundSize:"32px 32px",opacity:.5,pointerEvents:"none"}}/>
    <div style={{position:"absolute",left:0,right:0,height:"20%",background:`linear-gradient(to bottom,transparent,${C.green}04,transparent)`,animation:"scan 12s linear infinite",pointerEvents:"none"}}/>
    <div style={{position:"absolute",top:"6%",left:"3%",width:360,height:360,borderRadius:"50%",background:`radial-gradient(circle,${C.green}07 0%,transparent 70%)`,animation:"float 10s ease-in-out infinite",pointerEvents:"none"}}/>
    <div style={{position:"absolute",bottom:"8%",right:"3%",width:280,height:280,borderRadius:"50%",background:`radial-gradient(circle,${C.amber}06 0%,transparent 70%)`,animation:"float 13s ease-in-out infinite 4s",pointerEvents:"none"}}/>
    <div style={{position:"relative",zIndex:1,textAlign:"center",maxWidth:960}}>
      <div style={{display:"inline-flex",alignItems:"center",gap:8,background:`${C.green}0C`,border:`1px solid ${C.green}22`,padding:"6px 18px",borderRadius:100,marginBottom:28,animation:"fadeUp .5s ease both"}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:C.green,boxShadow:`0 0 8px ${C.green}`,animation:"pulse 2s infinite"}}/>
        <span style={{color:C.green,fontSize:11,fontWeight:700,fontFamily:F.mono,letterSpacing:".12em"}}>PERFORMANCE MANAGEMENT FOR REMOTE DEVELOPERS</span>
      </div>
      <h1 style={{fontFamily:F.display,fontSize:"clamp(58px,10vw,128px)",lineHeight:.9,letterSpacing:".025em",color:C.near,animation:"fadeUp .55s .08s ease both",marginBottom:8}}>KNOW EXACTLY</h1>
      <h1 style={{fontFamily:F.display,fontSize:"clamp(58px,10vw,128px)",lineHeight:.9,letterSpacing:".025em",animation:"fadeUp .55s .14s ease both",marginBottom:8}}><span style={{color:C.green,textShadow:`0 0 80px ${C.green}66`}}>WHO YOU'RE</span></h1>
      <h1 style={{fontFamily:F.display,fontSize:"clamp(58px,10vw,128px)",lineHeight:.9,letterSpacing:".025em",color:C.near,animation:"fadeUp .55s .2s ease both",marginBottom:28}}>PAYING FOR.</h1>
      <p style={{fontFamily:F.body,fontSize:"clamp(16px,2vw,20px)",color:C.muted,lineHeight:1.65,maxWidth:520,margin:"0 auto 40px",animation:"fadeUp .55s .28s ease both"}}>We eliminate the 80% of work that brings nothing. We focus everything on the 20% of input that brings 80% of impact. For every remote developer. Every week.</p>
      <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",animation:"fadeUp .55s .36s ease both"}}>
        <Btn lg onClick={()=>onNav("onboard")}>I Have a Remote Team →</Btn>
        <Btn lg v="outline" onClick={()=>onNav("onboard")}>I'm a Developer</Btn>
      </div>
    </div>
    <div style={{position:"relative",zIndex:1,marginTop:64,animation:"fadeUp .8s .5s ease both, float 8s 2s ease-in-out infinite",maxWidth:460,width:"100%"}}>
      <div style={{position:"absolute",inset:"-16px",borderRadius:28,background:`radial-gradient(ellipse,${C.green}14 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{background:`linear-gradient(150deg,${C.card} 0%,${C.navy} 100%)`,border:`1px solid ${C.green}38`,borderRadius:22,padding:"20px",animation:"glow 5s ease-in-out infinite",overflow:"hidden",position:"relative"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:130,height:130,borderRadius:"50%",background:`radial-gradient(circle,${C.green}12 0%,transparent 70%)`,pointerEvents:"none"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div><div style={{fontSize:10,color:C.muted,fontFamily:F.mono,letterSpacing:".1em",marginBottom:3}}>TEAM MONTHLY VALUE</div><div style={{fontSize:36,fontWeight:900,color:C.green,fontFamily:F.head,lineHeight:1,textShadow:`0 0 28px ${C.green}55`}}>${tv.toLocaleString()}</div></div>
          <Tag>LIVE</Tag>
        </div>
        {[{name:"Alex Chen",rank:"Captain",vi:94,col:C.green,live:"committed 2s ago"},{name:"Maria Santos",rank:"Commander",vi:97,col:C.green,live:"active now"},{name:"James Okafor",rank:"Corporal",vi:48,col:C.red,live:"last seen 3h ago"},{name:"Sarah Kim",rank:"Lieutenant",vi:86,col:C.green,live:"reviewing PR"}].map((d,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<3?`1px solid ${C.border}`:"none"}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:`${d.col}18`,border:`1px solid ${d.col}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:d.col,flexShrink:0}}>{d.name.split(" ").map(n=>n[0]).join("")}</div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.near,fontFamily:F.body}}>{d.name}</div><div style={{fontSize:10,color:C.muted,fontFamily:F.mono}}>{d.rank}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:800,color:d.col,fontFamily:F.mono}}>{d.vi}%</div><div style={{fontSize:9,color:C.muted,fontFamily:F.mono}}>{d.live}</div></div>
          </div>
        ))}
        <div style={{marginTop:10,padding:"10px 12px",background:`${C.red}0A`,border:`1px solid ${C.red}20`,borderRadius:10}}><div style={{fontSize:11,color:C.red,fontFamily:F.mono,fontWeight:700}}>ALERT · James Okafor</div><div style={{fontSize:11,color:C.muted,fontFamily:F.body,marginTop:2}}>Input quality 48%. 3 low-impact commits flagged.</div></div>
      </div>
    </div>
  </section>;
}

function Strip(){
  const tools=["GitHub","GitLab","Jira","Linear","PagerDuty","AWS","Datadog","Slack","Vercel","Zendesk","New Relic","Asana"];
  return<div style={{background:C.navy,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:"18px 0",overflow:"hidden"}}>
    <div style={{display:"flex",animation:"marquee 24s linear infinite",whiteSpace:"nowrap"}}>
      {[...tools,...tools].map((t,i)=><div key={i} style={{padding:"0 36px",fontSize:12,fontWeight:600,color:C.dim,fontFamily:F.body,flexShrink:0,borderRight:`1px solid ${C.border}`}}>{t}</div>)}
    </div>
  </div>;
}

function Problem({onNav}){
  const ref=useRef();const v=useInView(ref);const[tab,sTab]=useState("employer");
  const P={employer:[
    {head:"You pay every month. You see nothing.",body:"Your developer is remote. You transfer the salary. But you cannot see what they actually did. You rely on standups and Slack messages. That is not management."},
    {head:"The 80% problem is invisible.",body:"80% of what most developers do has almost no impact. You are paying full price for 20% of the output. You do not know which 20% it is."},
    {head:"Work and value are disconnected.",body:"A developer can commit 50 times and move nothing forward. Another commits 5 times and saves $8,000 a month. You cannot tell the difference."},
    {head:"When they leave, you have nothing.",body:"No record of what they built. No verified proof of what it was worth. Just a gap in your team and years of salary with nothing to show."},
  ],developer:[
    {head:"You deliver real work. Nobody sees it.",body:"You fixed the thing costing $2,000 a month. You prevented the outage. But from your employer's side, you are just a Slack avatar and a salary."},
    {head:"You are measured on the wrong things.",body:"Commits, hours, tickets closed. None of these are value. You can be busy all day and irrelevant. PROVE measures the 20% that changes everything."},
    {head:"You have no way to prove your impact.",body:"Your resume says you are good. But anyone can write that. You have no verified record of what you delivered and what it was worth in real money."},
    {head:"You cannot take your record with you.",body:"You leave a company and start from zero. Every proof of performance stays with the employer. PROVE gives you a verified history that is yours. Forever."},
  ]};
  return<section ref={ref} style={{background:"#080E1C",padding:"100px 48px",borderTop:`1px solid ${C.border}`}}>
    <div style={{maxWidth:1040,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:44,opacity:v?1:0,transition:"all .6s"}}>
        <Tag color={C.red}>THE PROBLEM</Tag>
        <h2 style={{fontFamily:F.display,fontSize:"clamp(44px,6vw,80px)",color:C.near,letterSpacing:".02em",marginTop:16,lineHeight:.92}}>REMOTE WORK IS BROKEN<br/><span style={{color:C.red}}>FOR BOTH SIDES.</span></h2>
      </div>
      <div style={{display:"flex",justifyContent:"center",marginBottom:32,opacity:v?1:0,transition:"all .6s .1s"}}>
        <div style={{display:"inline-flex",background:C.card,border:`1px solid ${C.border}`,borderRadius:100,padding:"4px"}}>
          {[["employer","I'm an Employer"],["developer","I'm a Developer"]].map(([id,label])=>(
            <button key={id} onClick={()=>sTab(id)} style={{background:tab===id?C.green:"transparent",color:tab===id?C.ink:C.muted,border:"none",padding:"8px 24px",borderRadius:100,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:F.body,transition:"all .2s"}}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:28}}>
        {P[tab].map((p,i)=>(
          <div key={`${tab}${i}`} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"24px",opacity:v?1:0,transform:v?"none":"translateY(16px)",transition:`all .5s ${i*.08}s ease`,cursor:"default"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=`${C.red}33`;e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:C.red,boxShadow:`0 0 8px ${C.red}`,marginBottom:12}}/>
            <div style={{fontFamily:F.head,fontWeight:800,fontSize:16,color:C.near,marginBottom:8,lineHeight:1.2}}>{p.head}</div>
            <div style={{fontFamily:F.body,fontSize:13,color:C.muted,lineHeight:1.65}}>{p.body}</div>
          </div>
        ))}
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,overflow:"hidden",opacity:v?1:0,transition:"all .7s .3s"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
          <div style={{padding:"24px 28px",borderRight:`1px solid ${C.border}`}}>
            <div style={{fontSize:11,color:C.red,fontFamily:F.mono,fontWeight:700,letterSpacing:".1em",marginBottom:14}}>BEFORE PROVE</div>
            {["Pay $12,000/month. Hope for results.","Ask for updates. Get 'all good' replies.","Find out 6 months later a tool cost $800/mo unused.","Developer leaves. You have nothing verified."].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:10}}><span style={{color:C.red,fontSize:14,flexShrink:0}}>✕</span><span style={{fontSize:13,color:C.muted,fontFamily:F.body,lineHeight:1.5}}>{t}</span></div>
            ))}
          </div>
          <div style={{padding:"24px 28px",background:`${C.green}05`}}>
            <div style={{fontSize:11,color:C.green,fontFamily:F.mono,fontWeight:700,letterSpacing:".1em",marginBottom:14}}>AFTER PROVE</div>
            {["See verified dollar value delivered every week.","Know which commits moved the needle.","PROVE flags the unused tool in week 2.","Developer's verified history. Always on record."].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:10}}><span style={{color:C.green,fontSize:14,flexShrink:0}}>✓</span><span style={{fontSize:13,color:C.muted,fontFamily:F.body,lineHeight:1.5}}>{t}</span></div>
            ))}
          </div>
        </div>
        <div style={{borderTop:`1px solid ${C.border}`,padding:"18px 28px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:14,color:C.muted,fontFamily:F.body}}>See it working for a real team.</span>
          <Btn onClick={()=>onNav("workspace")}>See Live Workspace →</Btn>
        </div>
      </div>
    </div>
  </section>;
}

function HowItWorks(){
  const ref=useRef();const v=useInView(ref);
  const steps=[
    {n:"01",big:"Connect. We find your level.",body:"Link your tools. PROVE reads your existing systems and tells you where you actually stand. No self-assessment.",color:C.sky},
    {n:"02",big:"Check in. Five minutes. Every week.",body:"Four questions. One per pillar — cost, risk, quality, value. The 20% of inputs that drive 80% of impact.",color:C.green},
    {n:"03",big:"AI validates what you put in.",body:"Every claim cross-referenced against your connected systems. High impact or noise. The system knows.",color:C.purple},
    {n:"04",big:"Manager approves. Score locks.",body:"One click. Both sides agreed. The number is certified. Evidence — not gut feeling.",color:C.amber},
    {n:"05",big:"You see the dollar value. Both sides.",body:"Employer sees verified team value. Developer sees rank and impact. All measured through value innovation.",color:C.green},
    {n:"06",big:"PROVE tells you what to fix next week.",body:"Not a report. A coaching system. Finds the waste, the risk, the opportunity. Tells you what to do.",color:C.sky},
  ];
  return<section id="how" ref={ref} style={{background:C.ink,padding:"100px 48px",borderTop:`1px solid ${C.border}`}}>
    <div style={{maxWidth:1040,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:60,opacity:v?1:0,transition:"all .6s"}}>
        <Tag>HOW IT WORKS</Tag>
        <h2 style={{fontFamily:F.display,fontSize:"clamp(44px,6vw,76px)",color:C.near,letterSpacing:".02em",marginTop:16,lineHeight:.95}}>SIX STEPS.<br/><span style={{color:C.green}}>ONE CLEAR PICTURE.</span></h2>
        <p style={{color:C.muted,fontSize:16,maxWidth:380,margin:"16px auto 0",fontFamily:F.body,lineHeight:1.6}}>Connect once. Runs every week. Forever.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {steps.map((s,i)=>(
          <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"26px",position:"relative",overflow:"hidden",transition:"all .2s",opacity:v?1:0,transform:v?"none":"translateY(20px)",transitionDelay:`${i*.07}s`}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=`${s.color}35`} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{position:"absolute",top:-8,right:-4,fontSize:68,fontFamily:F.display,color:`${s.color}07`,lineHeight:1,pointerEvents:"none"}}>{s.n}</div>
            <div style={{width:6,height:6,borderRadius:"50%",background:s.color,boxShadow:`0 0 8px ${s.color}`,marginBottom:12}}/>
            <div style={{fontFamily:F.head,fontWeight:800,fontSize:18,color:C.near,marginBottom:8,lineHeight:1.2}}>{s.big}</div>
            <div style={{fontFamily:F.body,fontSize:13,color:C.muted,lineHeight:1.65}}>{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  </section>;
}

function RankSection({onNav}){
  const ref=useRef();const v=useInView(ref);const[active,sActive]=useState(6);const r=RANKS[active];
  return<section id="ranks" ref={ref} style={{background:"#070C18",padding:"100px 48px",borderTop:`1px solid ${C.border}`}}>
    <div style={{maxWidth:1100,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:52,opacity:v?1:0,transition:"all .6s"}}>
        <Tag color={C.amber}>RANK SYSTEM</Tag>
        <h2 style={{fontFamily:F.display,fontSize:"clamp(44px,6vw,78px)",color:C.near,letterSpacing:".02em",marginTop:16,lineHeight:.95}}>PERFORMANCE IS A<br/><span style={{color:C.amber}}>RANK YOU EARN.</span></h2>
        <p style={{color:C.muted,fontSize:16,maxWidth:480,margin:"16px auto 0",fontFamily:F.body,lineHeight:1.65}}>Connect your systems. We find where you actually are. Then we help you climb based on real impact.</p>
      </div>
      <div style={{display:"flex",gap:24}}>
        <div style={{width:196,flexShrink:0,display:"flex",flexDirection:"column",gap:5}}>
          {RANKS.map((rk,i)=>(
            <div key={rk.level} onClick={()=>sActive(i)} style={{padding:"9px 14px",borderRadius:10,cursor:"pointer",background:active===i?`${rk.color}18`:"transparent",border:`1px solid ${active===i?rk.color+"44":C.border}`,display:"flex",alignItems:"center",gap:10,transition:"all .16s",opacity:v?1:0,transitionDelay:`${i*.03}s`}}
              onMouseEnter={e=>{if(active!==i){e.currentTarget.style.background=`${rk.color}09`;e.currentTarget.style.borderColor=`${rk.color}28`;}}}
              onMouseLeave={e=>{if(active!==i){e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=C.border;}}}>
              <span style={{fontSize:13,color:rk.color,textShadow:active===i?`0 0 10px ${rk.color}`:"none",transition:"all .2s"}}>{rk.icon}</span>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:active===i?rk.color:C.muted,fontFamily:F.body}}>{rk.name}</div><div style={{fontSize:10,color:C.dim,fontFamily:F.mono}}>LVL {rk.level}</div></div>
            </div>
          ))}
        </div>
        <div style={{flex:1,opacity:v?1:0,transition:"all .6s .3s"}}>
          <div key={r.level} style={{animation:"rankIn .35s ease both"}}>
            <div style={{background:`linear-gradient(145deg,${C.card},${C.navy})`,border:`1px solid ${r.color}44`,borderRadius:20,padding:"32px",marginBottom:12,position:"relative",overflow:"hidden",boxShadow:`0 0 60px ${r.color}10`}}>
              <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${r.color}12 0%,transparent 70%)`,pointerEvents:"none"}}/>
              <div style={{position:"absolute",bottom:-16,left:-8,fontFamily:F.display,fontSize:130,color:`${r.color}06`,lineHeight:1,pointerEvents:"none"}}>{String(r.level).padStart(2,"0")}</div>
              <div style={{display:"flex",alignItems:"flex-start",gap:20,marginBottom:22}}>
                <span style={{fontSize:52,color:r.color,textShadow:`0 0 28px ${r.color}99`,lineHeight:1}}>{r.icon}</span>
                <div>
                  <div style={{fontSize:11,color:C.muted,fontFamily:F.mono,letterSpacing:".1em",marginBottom:4}}>LEVEL {r.level} · {r.pct} OF ALL DEVELOPERS</div>
                  <div style={{fontFamily:F.display,fontSize:"clamp(38px,5vw,62px)",color:r.color,letterSpacing:".03em",lineHeight:.9,textShadow:`0 0 40px ${r.color}55`}}>{r.name.toUpperCase()}</div>
                  <div style={{fontSize:15,color:C.muted,fontFamily:F.body,marginTop:8,fontStyle:"italic"}}>"{r.feel}"</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                {[["XP Required",`${r.xp.toLocaleString()} XP`,r.color],["Global Pool",r.pct,r.color],["Next",r.level<12?RANKS[r.level].name:"MAX",C.muted]].map(([l,val,col])=>(
                  <div key={l} style={{background:`${r.color}09`,border:`1px solid ${r.color}20`,borderRadius:12,padding:"12px 14px"}}>
                    <div style={{fontSize:10,color:C.muted,fontFamily:F.mono,letterSpacing:".08em",marginBottom:4}}>{l}</div>
                    <div style={{fontSize:18,fontWeight:800,color:col,fontFamily:F.head}}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 22px"}}>
              <div style={{height:7,background:C.dim,borderRadius:100,overflow:"hidden",marginBottom:8}}>
                <div style={{height:"100%",width:r.level<12?"62%":"100%",background:`linear-gradient(to right,${r.color},${r.level<12?RANKS[r.level].color:r.color})`,borderRadius:100,boxShadow:`0 0 10px ${r.color}77`}}/>
              </div>
              <div style={{fontSize:13,color:C.muted,fontFamily:F.body,lineHeight:1.6}}>{r.level===12?"The rarest rank. These developers rewrite the rules — they do not follow them.":"Your rank moves when your verified impact moves. Connect your systems and find where you actually stand."}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{textAlign:"center",marginTop:44}}><Btn lg onClick={()=>onNav("onboard")}>Connect Your Systems. Find Your Rank. →</Btn></div>
    </div>
  </section>;
}

function ForDevelopers({onNav}){
  const ref=useRef();const v=useInView(ref);
  const codeLines=[
    {t:"→ commit: fix memory leak in auth service",c:C.green},{t:"  PROVE: Cost impact -$180/mo recurring",c:C.muted},
    {t:"  Value innovation: Eliminate ✓",c:C.green},{t:"→ commit: add unit tests for payment flow",c:C.sky},
    {t:"  PROVE: Risk reduced · Coverage +12%",c:C.muted},{t:"  Value innovation: Raise ✓",c:C.sky},
    {t:"→ resolved: production incident 14min",c:C.green},{t:"  PROVE: Risk score +18pts",c:C.muted},
    {t:"  Weekly index: 7.8 → 8.4",c:C.green},{t:"→ cancelled: unused APM tool $240/mo",c:C.purple},
    {t:"  PROVE: Elimination logged",c:C.muted},{t:"  Compounds: $2,880/year saved",c:C.purple},
  ];
  return<section id="dev" ref={ref} style={{background:C.ink,padding:"100px 48px",borderTop:`1px solid ${C.border}`,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",right:0,top:0,width:"36%",height:"100%",overflow:"hidden",pointerEvents:"none",opacity:.15}}>
      <div style={{animation:"codeScroll 18s linear infinite",paddingTop:40}}>
        {[...codeLines,...codeLines].map((l,i)=><div key={i} style={{fontSize:11,fontFamily:F.mono,color:l.c,padding:"3px 24px",whiteSpace:"nowrap"}}>{l.t}</div>)}
      </div>
    </div>
    <div style={{maxWidth:1040,margin:"0 auto",position:"relative",zIndex:1}}>
      <div style={{maxWidth:580}}>
        <div style={{opacity:v?1:0,transform:v?"none":"translateY(24px)",transition:"all .7s"}}>
          <Tag color={C.green}>FOR DEVELOPERS</Tag>
          <h2 style={{fontFamily:F.display,fontSize:"clamp(44px,6vw,76px)",color:C.near,letterSpacing:".02em",marginTop:16,lineHeight:.95,marginBottom:20}}>NOT JUST PROVING.<br/><span style={{color:C.green}}>IMPROVING.</span></h2>
          <p style={{fontFamily:F.body,fontSize:16,color:C.muted,lineHeight:1.7,marginBottom:28}}>PROVE is your workspace and your coach. It connects to your tools, reads your work in real time, and tells you exactly which 20% of what you do is bringing 80% of the impact — and what to change next week.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:28}}>
          {[
            {big:"Your rank. Earned.",body:"12 levels. Climb by delivering work that matters. You cannot fake it.",color:C.amber},
            {big:"Real-time visibility.",body:"Every commit, every incident, every cost saved — scored as it happens.",color:C.green},
            {big:"AI coaching weekly.",body:"After every check-in, PROVE tells you exactly what to focus on next.",color:C.purple},
            {big:"A record that is yours.",body:"Verified performance history. Every company. Follows you forever.",color:C.sky},
          ].map((f,i)=>(
            <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px",transition:"all .2s",opacity:v?1:0,transform:v?"none":"translateY(12px)",transitionDelay:`${i*.08}s`}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=`${f.color}33`;e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="none";}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:f.color,boxShadow:`0 0 8px ${f.color}`,marginBottom:10}}/>
              <div style={{fontSize:15,fontWeight:800,color:C.near,fontFamily:F.head,marginBottom:6}}>{f.big}</div>
              <div style={{fontSize:12,color:C.muted,fontFamily:F.body,lineHeight:1.6}}>{f.body}</div>
            </div>
          ))}
        </div>
        <Btn lg onClick={()=>onNav("onboard")}>Connect Your Stack. Get Your Rank. →</Btn>
      </div>
    </div>
  </section>;
}

function Pricing({onNav}){
  const ref=useRef();const v=useInView(ref);const[ann,sAnn]=useState(true);
  const plans=[
    {name:"Developer",tag:"ALWAYS FREE",price:0,color:C.green,desc:"For individual remote developers and IT workers.",features:["Full PROVE score — updated weekly","12-rank system Recruit to Pirate","AI coaching after every check-in","Connect GitHub, Jira, and more","Real-time work visibility","1 employer verifier","Performance history — yours forever"],cta:"Start Free",v:"outline"},
    {name:"Team",tag:"FOR EMPLOYERS",price:29,annual:23,color:C.green,hot:true,desc:"For companies managing remote developers.",features:["Everything in Developer","Up to 10 team members","Full team performance dashboard","Set what your company values most","AI validates every claim","All integrations unlocked","Weekly reports and alerts","Two-sided verification"],cta:"Start 14-Day Trial",v:"green"},
    {name:"Enterprise",tag:"LARGE TEAMS",price:null,color:C.amber,desc:"For organisations with 10+ remote workers.",features:["Everything in Team","Unlimited team members","Multiple departments","Single sign-on","Custom integrations","Dedicated account manager","Board-level reporting"],cta:"Talk to Us",v:"amber"},
  ];
  return<section id="price" ref={ref} style={{background:"#070C18",padding:"100px 48px",borderTop:`1px solid ${C.border}`}}>
    <div style={{maxWidth:1000,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:48,opacity:v?1:0,transition:"all .6s"}}>
        <Tag>PRICING</Tag>
        <h2 style={{fontFamily:F.display,fontSize:"clamp(44px,6vw,78px)",color:C.near,letterSpacing:".02em",marginTop:16,lineHeight:.95}}>PAY FOR RESULTS.<br/><span style={{color:C.green}}>NOT PROMISES.</span></h2>
        <p style={{color:C.muted,fontSize:15,fontFamily:F.body,marginTop:14,marginBottom:22}}>Developers are free. You pay when you want your team managed.</p>
        <div style={{display:"inline-flex",background:C.card,border:`1px solid ${C.border}`,borderRadius:100,padding:"4px"}}>
          {["Monthly","Annual"].map(t=><button key={t} onClick={()=>sAnn(t==="Annual")} style={{background:(t==="Annual")===ann?C.green:"transparent",color:(t==="Annual")===ann?C.ink:C.muted,border:"none",padding:"7px 22px",borderRadius:100,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.body,transition:"all .2s"}}>{t}{t==="Annual"?" — Save 20%":""}</button>)}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
        {plans.map((p,i)=>(
          <div key={i} style={{background:p.hot?`linear-gradient(160deg,${C.card} 0%,${C.navy} 100%)`:C.card,border:`1px solid ${p.hot?C.green+"44":C.border}`,borderRadius:20,padding:"28px",position:"relative",overflow:"hidden",boxShadow:p.hot?`0 0 60px ${C.green}10`:"none",opacity:v?1:0,transform:v?"none":"translateY(24px)",transition:`all .6s ${i*.1}s ease`}}>
            {p.hot&&<div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:`radial-gradient(circle,${C.green}18 0%,transparent 70%)`,pointerEvents:"none"}}/>}
            {p.hot&&<div style={{position:"absolute",top:14,right:14}}><Tag color={C.amber}>MOST USED</Tag></div>}
            <div style={{marginBottom:16}}><div style={{fontFamily:F.head,fontWeight:900,fontSize:22,color:C.near}}>{p.name}</div><div style={{fontSize:10,color:p.color,fontFamily:F.mono,letterSpacing:".1em",marginTop:3}}>{p.tag}</div></div>
            <div style={{marginBottom:8}}>{p.price===null?<div style={{fontSize:40,fontWeight:900,color:p.color,fontFamily:F.head}}>Custom</div>:p.price===0?<div style={{fontSize:40,fontWeight:900,color:p.color,fontFamily:F.head}}>$0</div>:<div style={{display:"flex",alignItems:"baseline",gap:4}}><span style={{fontSize:40,fontWeight:900,color:p.color,fontFamily:F.head}}>${ann?p.annual:p.price}</span><span style={{color:C.muted,fontSize:13,fontFamily:F.body}}>/dev/mo</span></div>}</div>
            <p style={{fontSize:13,color:C.muted,fontFamily:F.body,lineHeight:1.55,marginBottom:20}}>{p.desc}</p>
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:16,marginBottom:20}}>{p.features.map((f,j)=><div key={j} style={{display:"flex",gap:9,marginBottom:8}}><span style={{color:p.color,fontSize:12,flexShrink:0,marginTop:2}}>✓</span><span style={{fontSize:13,color:C.muted,fontFamily:F.body,lineHeight:1.45}}>{f}</span></div>)}</div>
            <Btn v={p.v} full onClick={()=>onNav(p.price===0?"onboard":p.price===null?"onboard":"onboard")}>{p.cta}</Btn>
          </div>
        ))}
      </div>
    </div>
  </section>;
}

function Footer(){
  return<footer style={{background:C.ink,borderTop:`1px solid ${C.border}`,padding:"52px 48px 28px"}}>
    <div style={{maxWidth:1040,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,marginBottom:44}}>
        <div><Logo size={26}/><p style={{fontSize:13,color:C.muted,fontFamily:F.body,lineHeight:1.65,marginTop:14,maxWidth:240}}>Performance management for remote developers. Built for employers. Free for developers.</p></div>
        {[{h:"Product",l:["How It Works","Rank System","For Developers","For Employers","Pricing"]},{h:"Connect",l:["GitHub","GitLab","Jira","PagerDuty","Slack","Datadog"]},{h:"Company",l:["About","Blog","Careers","Privacy","Terms","Contact"]}].map(({h,l})=>(
          <div key={h}><div style={{fontSize:11,fontWeight:700,color:C.near,fontFamily:F.mono,letterSpacing:".1em",marginBottom:14}}>{h.toUpperCase()}</div>{l.map(x=><div key={x} style={{fontSize:13,color:C.muted,fontFamily:F.body,marginBottom:8,cursor:"pointer",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color=C.near} onMouseLeave={e=>e.target.style.color=C.muted}>{x}</div>)}</div>
        ))}
      </div>
      <div style={{borderTop:`1px solid ${C.border}`,paddingTop:22,display:"flex",justifyContent:"space-between"}}>
        <div style={{fontSize:12,color:C.dim,fontFamily:F.body}}>© 2026 PROVE. All rights reserved.</div>
        <div style={{fontSize:11,color:C.dim,fontFamily:F.mono}}>prove.com · Built for the future of remote work</div>
      </div>
    </div>
  </footer>;
}

/* ══════════════════════════════
   ONBOARDING
══════════════════════════════ */
function Onboarding({onDone}){
  const[step,sStep]=useState(0);
  const[data,sData]=useState({name:"",email:"",company:"",role:"",github:""});
  useEffect(()=>{if(step===3){const t=setTimeout(()=>sStep(4),3400);return()=>clearTimeout(t);}},[step]);
  const devRoles=["Full Stack Developer","Frontend Developer","Backend Developer","DevOps Engineer","System Administrator","Mobile Developer","Data Engineer","Security Engineer"];
  const inp={width:"100%",background:C.cardHi,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.near,fontSize:14,fontFamily:F.body,outline:"none",transition:"border-color .2s"};
  const lbl={display:"block",fontSize:10,color:C.muted,fontWeight:700,letterSpacing:".1em",marginBottom:5,fontFamily:F.mono};
  const steps=[
    <div key={0} style={{animation:"fadeUp .4s ease"}}>
      <h2 style={{fontFamily:F.head,fontWeight:900,fontSize:24,color:C.near,marginBottom:6}}>What is your role?</h2>
      <p style={{color:C.muted,fontSize:13,fontFamily:F.body,marginBottom:24}}>We calibrate benchmarks and AI coaching to your specific role.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:24}}>
        {devRoles.map(r=><div key={r} onClick={()=>sData({...data,role:r})} style={{background:data.role===r?`${C.green}15`:C.cardHi,border:`1px solid ${data.role===r?C.green+"55":C.border}`,borderRadius:10,padding:"11px 14px",cursor:"pointer",fontSize:13,color:data.role===r?C.green:C.muted,fontFamily:F.body,fontWeight:data.role===r?600:400,transition:"all .15s"}} onMouseEnter={e=>{if(data.role!==r){e.currentTarget.style.borderColor=`${C.green}33`;e.currentTarget.style.color=C.near;}}} onMouseLeave={e=>{if(data.role!==r){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted;}}}>{r}</div>)}
      </div>
      <Btn full onClick={()=>data.role&&sStep(1)}>Continue →</Btn>
    </div>,
    <div key={1} style={{animation:"fadeUp .4s ease"}}>
      <h2 style={{fontFamily:F.head,fontWeight:900,fontSize:24,color:C.near,marginBottom:6}}>Your details</h2>
      <p style={{color:C.muted,fontSize:13,fontFamily:F.body,marginBottom:24}}>Personalises your workspace and rank profile.</p>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
        <div><label style={lbl}>FULL NAME</label><input value={data.name} onChange={e=>sData({...data,name:e.target.value})} placeholder="Alex Chen" style={inp} onFocus={e=>e.target.style.borderColor=`${C.green}44`} onBlur={e=>e.target.style.borderColor=C.border}/></div>
        <div><label style={lbl}>WORK EMAIL</label><input value={data.email} onChange={e=>sData({...data,email:e.target.value})} placeholder="alex@company.com" style={inp} onFocus={e=>e.target.style.borderColor=`${C.green}44`} onBlur={e=>e.target.style.borderColor=C.border}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><label style={lbl}>COMPANY</label><input value={data.company} onChange={e=>sData({...data,company:e.target.value})} placeholder="TechCorp" style={inp} onFocus={e=>e.target.style.borderColor=`${C.green}44`} onBlur={e=>e.target.style.borderColor=C.border}/></div>
          <div><label style={lbl}>GITHUB USERNAME</label><input value={data.github} onChange={e=>sData({...data,github:e.target.value})} placeholder="alexchen-dev" style={inp} onFocus={e=>e.target.style.borderColor=`${C.green}44`} onBlur={e=>e.target.style.borderColor=C.border}/></div>
        </div>
      </div>
      <div style={{display:"flex",gap:10}}><Btn v="ghost" onClick={()=>sStep(0)}>← Back</Btn><Btn full onClick={()=>data.name&&data.email&&sStep(2)}>Continue →</Btn></div>
    </div>,
    <div key={2} style={{animation:"fadeUp .4s ease"}}>
      <h2 style={{fontFamily:F.head,fontWeight:900,fontSize:24,color:C.near,marginBottom:6}}>Connect your stack</h2>
      <p style={{color:C.muted,fontSize:13,fontFamily:F.body,marginBottom:24}}>PROVE reads these to verify your work. Connect what you use.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
        {[["GitHub","Connected ✓",true,C.green],["Jira","Connect",false,C.sky],["PagerDuty","Connect",false,C.red],["Slack","Connect",false,"#E01E5A"],["Datadog","Connect",false,C.purple],["Linear","Connect",false,C.near]].map(([name,label,done,col])=>(
          <div key={name} style={{background:done?`${col}10`:C.cardHi,border:`1px solid ${done?col+"33":C.border}`,borderRadius:10,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=`${col}44`} onMouseLeave={e=>e.currentTarget.style.borderColor=done?`${col}33`:C.border}>
            <span style={{fontSize:13,fontWeight:600,color:done?col:C.muted,fontFamily:F.body}}>{name}</span>
            <span style={{fontSize:11,color:done?col:C.muted,fontFamily:F.mono,fontWeight:700}}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10}}><Btn v="ghost" onClick={()=>sStep(1)}>← Back</Btn><Btn full onClick={()=>sStep(3)}>Connect and Find My Rank →</Btn></div>
    </div>,
    <div key={3} style={{textAlign:"center",padding:"20px 0",animation:"fadeUp .4s ease"}}>
      <div style={{width:48,height:48,border:`3px solid ${C.green}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 20px"}}/>
      <div style={{fontSize:14,color:C.near,fontFamily:F.body,fontWeight:600,marginBottom:10}}>Scanning your systems...</div>
      {["Reading GitHub commit history","Analysing input quality patterns","Calibrating benchmarks for your role","Finding your starting rank"].map((t,i)=>(
        <div key={i} style={{fontSize:12,color:C.muted,fontFamily:F.mono,marginBottom:4,animation:`fadeUp .4s ${i*.3}s ease both`}}>{t}</div>
      ))}

    </div>,
    <div key={4} style={{textAlign:"center",animation:"fadeUp .5s ease"}}>
      <Tag color={C.green}>RANK FOUND</Tag>
      <div style={{fontFamily:F.display,fontSize:64,color:"#4FC3F7",letterSpacing:".03em",marginTop:16,marginBottom:4,textShadow:"0 0 30px #4FC3F788"}}>LIEUTENANT</div>
      <div style={{fontSize:13,color:C.muted,fontFamily:F.mono,marginBottom:24}}>Level 5 · 2,100 XP · Top 38%</div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px",marginBottom:20,textAlign:"left"}}>
        <Label color={C.green}>WHAT WE FOUND</Label>
        {["Strong GitHub commit history — quality signals detected","2 incident responses logged — good risk awareness","No recurring cost eliminations in 30 days — opportunity","Communication score moderate — documentation gap"].map((f,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:8}}><span style={{color:i>=2?C.amber:C.green,fontSize:12,flexShrink:0}}>{i>=2?"→":"✓"}</span><span style={{fontSize:12,color:C.text,fontFamily:F.body,lineHeight:1.5}}>{f}</span></div>
        ))}
      </div>
      <Btn full lg onClick={onDone}>Enter My Workspace →</Btn>
    </div>,
  ];
  return<div style={{minHeight:"100vh",background:C.ink,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${C.border} 1px,transparent 1px)`,backgroundSize:"28px 28px",opacity:.3,pointerEvents:"none"}}/>
    <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 30%,${C.greenGlow} 0%,transparent 55%)`,pointerEvents:"none"}}/>
    <div style={{padding:"20px 36px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:1}}>
      <Logo size={20}/>
      <div style={{height:2,background:C.border,borderRadius:2,width:200}}><div style={{height:"100%",width:`${Math.min(((step)/4)*100,100)}%`,background:C.green,borderRadius:2,transition:"width .4s ease"}}/></div>
      <span style={{fontSize:10,color:C.muted,fontFamily:F.mono,letterSpacing:".1em"}}>STEP {Math.min(step+1,4)} OF 4</span>
    </div>
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px 40px",position:"relative",zIndex:1}}>
      <div style={{width:"100%",maxWidth:480}}>{steps[step]}</div>
    </div>
  </div>;
}

/* ══════════════════════════════
   WORKSPACE NAV ITEMS
══════════════════════════════ */
const NAV=[
  {id:"home",label:"Home",icon:"⌂"},
  {id:"checkin",label:"Weekly Check-in",icon:"✎",badge:"DUE"},
  {id:"coach",label:"AI Coach",icon:"◎"},
  {id:"value",label:"Value Innovation",icon:"◈"},
  {id:"communication",label:"Communication",icon:"◫"},
  {id:"rank",label:"Rank Progress",icon:"★"},
  {id:"impact",label:"Impact Log",icon:"▣"},
  {id:"employer",label:"Employer View",icon:"👁"},
  {id:"team",label:"Team View",icon:"⬡"},
  {id:"goals",label:"Goals",icon:"◉"},
  {id:"integrations",label:"Integrations",icon:"⬢"},
  {id:"notifications",label:"Alerts",icon:"◆",badge:"3"},
];

function Sidebar({active,onNav,user,onExit}){
  const rank=getRank(user.xp);
  return<div style={{width:216,background:C.wsidebar,borderRight:`1px solid ${C.wborder}`,display:"flex",flexDirection:"column",flexShrink:0,height:"100vh",position:"sticky",top:0}}>
    <div style={{padding:"16px",borderBottom:`1px solid ${C.wborder}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <Logo size={18}/>
      <button onClick={onExit} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:11,fontFamily:F.body}}>← Site</button>
    </div>
    <div style={{padding:"12px 14px",borderBottom:`1px solid ${C.wborder}`}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <Avatar initials={user.name.split(" ").map(n=>n[0]).join("")} color={rank.color} size={32} ring/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,fontWeight:700,color:C.near,fontFamily:F.head,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name.split(" ")[0]}</div>
          <div style={{fontSize:10,color:rank.color,fontFamily:F.mono}}>{rank.icon} {rank.name}</div>
        </div>
        <StatusDot s="active"/>
      </div>
      <div style={{marginTop:10}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
          <span style={{fontSize:9,color:C.muted,fontFamily:F.mono}}>{user.xp.toLocaleString()} XP</span>
          <span style={{fontSize:9,color:rank.color,fontFamily:F.mono}}>🔥{user.streak}wk</span>
        </div>
        <div style={{height:3,background:C.dim,borderRadius:100,overflow:"hidden"}}><div style={{height:"100%",width:"62%",background:rank.color,borderRadius:100,boxShadow:`0 0 6px ${rank.color}88`}}/></div>
      </div>
    </div>
    <div style={{flex:1,overflow:"auto",padding:"6px 8px"}}>
      {NAV.map(item=>(
        <div key={item.id} onClick={()=>onNav(item.id)}
          style={{display:"flex",alignItems:"center",gap:9,padding:"8px 10px",borderRadius:8,cursor:"pointer",background:active===item.id?`${C.green}10`:"transparent",border:`1px solid ${active===item.id?C.green+"22":"transparent"}`,marginBottom:2,transition:"all .15s"}}
          onMouseEnter={e=>{if(active!==item.id)e.currentTarget.style.background=C.cardHi;}} onMouseLeave={e=>{if(active!==item.id)e.currentTarget.style.background="transparent";}}>
          <span style={{fontSize:12,color:active===item.id?C.green:C.muted,width:14,textAlign:"center"}}>{item.icon}</span>
          <span style={{fontSize:12,fontWeight:active===item.id?700:400,color:active===item.id?C.near:C.muted,fontFamily:F.body,flex:1}}>{item.label}</span>
          {item.badge&&<span style={{background:item.badge==="DUE"?`${C.amber}22`:`${C.red}22`,color:item.badge==="DUE"?C.amber:C.red,fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:100,fontFamily:F.mono}}>{item.badge}</span>}
        </div>
      ))}
    </div>
    <div style={{padding:"10px 14px",borderTop:`1px solid ${C.wborder}`}}>
      <div style={{fontSize:11,color:C.muted,fontFamily:F.body}}>{user.company}</div>
      <div style={{fontSize:10,color:C.dim,fontFamily:F.mono}}>{user.role}</div>
    </div>
  </div>;
}

/* ── WORKSPACE SCREENS ── */
function HomeScreen({user,onNav}){
  const rank=getRank(user.xp);const next=getNext(user.xp);
  const pct=next?Math.round(((user.xp-rank.xp)/(next.xp-rank.xp))*100):100;
  return<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
      {[["PROVE INDEX","8.4","↑ +0.3 this week",C.green],["VALUE INNOVATION",`${user.metrics.vi}%`,"Top 28% globally",C.green],["COMMUNICATION",`${user.metrics.comm}%`,"Visibility score",C.sky],["STREAK",`${user.streak} wks`,"Consistent delivery",C.amber]].map(([l,v,s,col])=>(
        <WCard key={l} glow color={col}><Label color={col}>{l}</Label><div style={{fontSize:26,fontWeight:900,color:col,fontFamily:F.head,marginBottom:2}}>{v}</div><div style={{fontSize:11,color:C.muted,fontFamily:F.body}}>{s}</div></WCard>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <WCard glow color={rank.color}>
        <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:14}}>
          <div style={{fontSize:36,color:rank.color,textShadow:`0 0 20px ${rank.color}88`,lineHeight:1}}>{rank.icon}</div>
          <div><Label color={rank.color}>YOUR RANK</Label><div style={{fontFamily:F.display,fontSize:34,color:rank.color,letterSpacing:".03em",lineHeight:1}}>{rank.name.toUpperCase()}</div><div style={{fontSize:12,color:C.muted,fontFamily:F.body,marginTop:4}}>Level {rank.level} · {user.xp.toLocaleString()} XP</div></div>
        </div>
        {next&&<><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:C.muted,fontFamily:F.mono}}>To {next.name}</span><span style={{fontSize:11,color:rank.color,fontFamily:F.mono}}>{pct}%</span></div><Bar value={pct} color={rank.color} height={7}/></>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}><span style={{fontSize:12,color:C.muted,fontFamily:F.body}}>{next?`${(next.xp-user.xp).toLocaleString()} XP to ${next.name}`:""}</span><Btn sm v="outline" onClick={()=>onNav("rank")}>View Path</Btn></div>
      </WCard>
      <WCard>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <Label>LIVE ACTIVITY</Label>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 2s infinite"}}/><span style={{fontSize:10,color:C.green,fontFamily:F.mono}}>LIVE</span></div>
        </div>
        {[{col:C.green,msg:"Commit verified · auth/token-refresh · Quality 96%",t:"2s ago"},{col:C.sky,msg:"PR #147 merged · component-library-v2",t:"14m ago"},{col:C.purple,msg:"Deploy to production · 0 errors · 4min",t:"1h ago"},{col:C.amber,msg:"PROVE Coach: Focus on Cost pillar this week",t:"3h ago"}].map((f,i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:10}}><div style={{width:5,height:5,borderRadius:"50%",background:f.col,flexShrink:0,marginTop:5}}/><div style={{flex:1}}><div style={{fontSize:12,color:C.text,fontFamily:F.body,lineHeight:1.4}}>{f.msg}</div><div style={{fontSize:10,color:C.muted,fontFamily:F.mono,marginTop:1}}>{f.t}</div></div></div>
        ))}
      </WCard>
    </div>
    <WCard>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <Label>VALUE INNOVATION PILLARS</Label><Btn sm v="ghost" onClick={()=>onNav("value")}>View Detail →</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:16}}>
        {[["COST","Eliminated",user.metrics.cost,C.green,"$240/mo saved"],["RISK","Reduced",user.metrics.risk,C.sky,"0 incidents"],["QUALITY","Raised",user.metrics.quality,C.purple,"API +74%"],["VALUE","Created",user.metrics.value,C.amber,"Deploy automation"]].map(([l,s,v,col,d])=>(
          <div key={l}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><div><div style={{fontSize:10,color:col,fontFamily:F.mono,fontWeight:700}}>{l}</div><div style={{fontSize:9,color:C.muted,fontFamily:F.mono}}>{s}</div></div><div style={{fontSize:19,fontWeight:900,color:col,fontFamily:F.head}}>{v}%</div></div><Bar value={v} color={col}/><div style={{fontSize:10,color:C.muted,fontFamily:F.body,marginTop:4}}>{d}</div></div>
        ))}
      </div>
    </WCard>
    <div style={{background:`${C.amber}0F`,border:`1px solid ${C.amber}30`,borderRadius:12,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontSize:14,fontWeight:800,color:C.near,fontFamily:F.head,marginBottom:3}}>Weekly check-in due Friday.</div><div style={{fontSize:12,color:C.muted,fontFamily:F.body}}>5 minutes. 4 questions. Score updates automatically.</div></div>
      <Btn v="amber" onClick={()=>onNav("checkin")}>Start Check-in →</Btn>
    </div>
  </div>;
}

function CheckInScreen(){
  const[step,sStep]=useState(0);const[ans,sAns]=useState({cost:"",risk:"",quality:"",value:""});const[done,sDone]=useState(false);const[score,sScore]=useState(null);
  useEffect(()=>{if(done&&!score){const t=setTimeout(()=>sScore({cost:94,risk:88,quality:96,value:91}),2000);return()=>clearTimeout(t);}},[done,score]);
  const Q=[
    {key:"cost",pillar:"ELIMINATE",color:C.green,title:"What did you eliminate or cancel this week?",placeholder:"e.g. Cancelled unused APM tool ($240/mo). Removed deprecated API endpoints."},
    {key:"risk",pillar:"REDUCE",color:C.sky,title:"What risk did you reduce or prevent?",placeholder:"e.g. Fixed memory leak before production. Resolved auth issue in 18min."},
    {key:"quality",pillar:"RAISE",color:C.purple,title:"What did you raise the quality of?",placeholder:"e.g. API response 340ms → 89ms. Added unit tests to payment module."},
    {key:"value",pillar:"CREATE",color:C.amber,title:"What did you create or build?",placeholder:"e.g. Built deploy automation saving 3hrs/week. Discovered AWS cost saving."},
  ];
  const q=Q[step];
  if(done)return<div style={{maxWidth:560,margin:"0 auto",paddingTop:32}}>
    {!score?<div style={{textAlign:"center",padding:48}}><div style={{width:40,height:40,border:`3px solid ${C.green}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 16px"}}/><div style={{fontSize:13,color:C.muted,fontFamily:F.body}}>PROVE AI is verifying your inputs...</div></div>
    :<div style={{animation:"fadeUp .5s ease"}}>
      <div style={{textAlign:"center",marginBottom:24}}><Pill color={C.green}>VERIFIED</Pill><div style={{fontFamily:F.display,fontSize:68,color:C.green,letterSpacing:".03em",marginTop:10,textShadow:`0 0 40px ${C.green}55`}}>8.7</div><div style={{fontSize:13,color:C.muted,fontFamily:F.body}}>PROVE Index · ↑ +0.3 from last week</div></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[["COST",94,C.green],["RISK",88,C.sky],["QUALITY",96,C.purple],["VALUE",91,C.amber]].map(([l,v,col])=>(
          <WCard key={l} glow color={col}><Label color={col}>{l}</Label><div style={{fontSize:26,fontWeight:900,color:col,fontFamily:F.head,marginBottom:6}}>{v}%</div><Bar value={v} color={col} height={5}/></WCard>
        ))}
      </div>
      <WCard style={{background:`${C.green}09`,border:`1px solid ${C.green}25`,marginBottom:12}}>
        <Label color={C.green}>AI COACH — NEXT WEEK</Label>
        <div style={{fontSize:13,color:C.text,fontFamily:F.body,lineHeight:1.7}}>Your Cost pillar is strong. Risk at 88% is your growth lever. Set up one proactive alert next week. Document the deploy automation — your Communication score will increase 10 points immediately.</div>
      </WCard>
      <Btn full onClick={()=>sDone(false)}>Done</Btn>
    </div>}
  </div>;
  return<div style={{maxWidth:560,margin:"0 auto",animation:"fadeUp .4s ease"}}>
    <div style={{marginBottom:20}}><div style={{display:"flex",gap:6,marginBottom:14}}>{Q.map((qq,i)=><div key={i} style={{flex:1,height:3,borderRadius:100,background:i<=step?qq.color:C.dim,transition:"background .3s"}}/>)}</div><Pill color={q.color}>{q.pillar} · {step+1} OF 4</Pill></div>
    <h2 style={{fontFamily:F.head,fontWeight:900,fontSize:20,color:C.near,marginBottom:20,lineHeight:1.2}}>{q.title}</h2>
    <textarea value={ans[q.key]} onChange={e=>sAns({...ans,[q.key]:e.target.value})} placeholder={q.placeholder} style={{width:"100%",minHeight:130,background:C.wcard,border:`1px solid ${ans[q.key]?q.color+"44":C.wborder}`,borderRadius:12,padding:"14px",color:C.near,fontSize:13,fontFamily:F.body,resize:"vertical",outline:"none",lineHeight:1.65,transition:"border-color .2s"}}/>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:14}}>
      {step>0?<Btn v="ghost" sm onClick={()=>sStep(step-1)}>← Back</Btn>:<div/>}
      {step<3?<Btn onClick={()=>sStep(step+1)}>Next →</Btn>:<Btn onClick={()=>sDone(true)}>Submit →</Btn>}
    </div>
  </div>;
}

function CoachScreen(){
  return<div style={{maxWidth:660,margin:"0 auto"}}>
    <WCard style={{background:`${C.green}08`,border:`1px solid ${C.green}22`,marginBottom:14}}>
      <Label color={C.green}>PROVE AI COACH · WEEK 11</Label>
      <div style={{fontSize:14,color:C.text,fontFamily:F.body,lineHeight:1.7,marginTop:6}}>Alex, your PROVE Index moved from 8.1 to 8.4 this week. Highest ever. Here is what is working and exactly what to do next week.</div>
    </WCard>
    {[{col:C.green,t:"Your Cost elimination is compounding.",b:"The $240/mo tool you cancelled adds to $2,880/year. You have now eliminated $680/mo in 6 weeks. One cancellation saves money every single month forever."},
      {col:C.sky,t:"Risk score needs one specific action.",b:"Set up one proactive alert before something breaks. Developers in the top 15% spend 20 minutes per week reviewing error rates before incidents happen."},
      {col:C.purple,t:"Document the deploy automation.",b:"Write 3 sentences: what it does, what it replaced, what it saves. Your Communication score increases 8-12 points immediately. Visible work is valuable work."},
      {col:C.amber,t:"340 XP from Commander.",b:"At your current weekly rate you reach Commander in 5 weeks. One user-facing feature this week, documented and verified, adds ~200 bonus XP."},
    ].map((ins,i)=>(
      <WCard key={i} style={{marginBottom:10}}>
        <div style={{display:"flex",gap:3}}><div style={{width:4,borderRadius:2,background:ins.col,alignSelf:"stretch"}}/><div style={{paddingLeft:12}}><div style={{fontSize:14,fontWeight:800,color:C.near,fontFamily:F.head,marginBottom:6}}>{ins.t}</div><div style={{fontSize:13,color:C.text,fontFamily:F.body,lineHeight:1.7}}>{ins.b}</div></div></div>
      </WCard>
    ))}
  </div>;
}

function ValueScreen({user}){
  const pillars=[
    {label:"COST ELIMINATED",color:C.green,score:user.metrics.cost,desc:"Every recurring cost you remove saves money every month forever. This compounds.",items:["Cancelled APM tool · $240/mo","Removed unused Lambda functions · $80/mo","Eliminated manual report · 2hrs/week"]},
    {label:"RISK REDUCED",color:C.sky,score:user.metrics.risk,desc:"Every incident prevented protects the company from real damage. One outage can cost more than your annual salary.",items:["Auth timeout resolved · 18min response","Memory leak caught before production","Payment flow monitoring added"]},
    {label:"QUALITY RAISED",color:C.purple,score:user.metrics.quality,desc:"Quality improvements raise the floor for everyone. These compound across the whole team.",items:["API response 340ms → 89ms · 74% improvement","Unit test coverage +12%","Onboarding docs published"]},
    {label:"VALUE CREATED",color:C.amber,score:user.metrics.value,desc:"New things that did not exist before. The Amazon AWS story started as an internal tool. Value comes from invention.",items:["Deploy automation · saves 3.2hrs/week","Component library v2 · team saves 4hrs/week","S3 lifecycle rules · $120/mo cloud saving"]},
  ];
  return<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
    {pillars.map((p,i)=>(
      <WCard key={i} glow color={p.color}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <div><Label color={p.color}>{p.label}</Label><div style={{fontSize:30,fontWeight:900,color:p.color,fontFamily:F.head,lineHeight:1}}>{p.score}%</div></div>
          <Pill color={p.color}>{p.score>=90?"HIGH IMPACT":p.score>=75?"GOOD":"NEEDS WORK"}</Pill>
        </div>
        <Bar value={p.score} color={p.color} height={6}/>
        <p style={{fontSize:12,color:C.muted,fontFamily:F.body,lineHeight:1.6,margin:"12px 0 10px"}}>{p.desc}</p>
        <div style={{borderTop:`1px solid ${C.wborder}`,paddingTop:10}}>
          {p.items.map((item,j)=><div key={j} style={{display:"flex",gap:8,marginBottom:6}}><span style={{color:p.color,fontSize:10,flexShrink:0,marginTop:2}}>✓</span><span style={{fontSize:11,color:C.text,fontFamily:F.body,lineHeight:1.5}}>{item}</span></div>)}
        </div>
      </WCard>
    ))}
  </div>;
}

function ImpactScreen({user}){
  return<div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:16}}>
      {[["MONTHLY VALUE","$8,400/mo",C.green],["RECURRING SAVES","$680/mo",C.green],["INCIDENTS PREVENTED","3 this month",C.sky],["XP THIS WEEK","340",C.amber]].map(([l,v,col])=>(
        <WCard key={l} glow color={col}><Label color={col}>{l}</Label><div style={{fontSize:22,fontWeight:900,color:col,fontFamily:F.head}}>{v}</div></WCard>
      ))}
    </div>
    <WCard>
      <Label>VERIFIED IMPACT LOG</Label>
      {user.impactLog.map((e,i)=>(
        <div key={i} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:i<user.impactLog.length-1?`1px solid ${C.wborder}`:"none"}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:e.color,flexShrink:0,marginTop:6,boxShadow:`0 0 5px ${e.color}`}}/>
          <div style={{flex:1}}><div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}><Pill color={e.color}>{e.pillar}</Pill><span style={{fontSize:10,color:C.muted,fontFamily:F.mono}}>{e.week}</span></div><div style={{fontSize:13,fontWeight:600,color:C.near,fontFamily:F.body,marginBottom:2}}>{e.item}</div><div style={{fontSize:11,color:C.muted,fontFamily:F.body}}>{e.value}</div></div>
          <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:16,fontWeight:800,color:e.color,fontFamily:F.mono}}>{e.score}%</div></div>
        </div>
      ))}
    </WCard>
  </div>;
}

function RankScreen({user}){
  const rank=getRank(user.xp);const next=getNext(user.xp);const pct=next?Math.round(((user.xp-rank.xp)/(next.xp-rank.xp))*100):100;
  return<div style={{display:"flex",flexDirection:"column",gap:12}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <WCard glow color={rank.color}>
        <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16}}><span style={{fontSize:44,color:rank.color,textShadow:`0 0 24px ${rank.color}88`}}>{rank.icon}</span><div><Label color={rank.color}>CURRENT</Label><div style={{fontFamily:F.display,fontSize:38,color:rank.color,letterSpacing:".03em",lineHeight:1}}>{rank.name.toUpperCase()}</div><div style={{fontSize:12,color:C.muted,fontFamily:F.body}}>Level {rank.level} · {user.xp.toLocaleString()} XP</div></div></div>
        {next&&<><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,color:C.muted,fontFamily:F.mono}}>To {next.name}</span><span style={{fontSize:11,color:rank.color,fontFamily:F.mono}}>{(next.xp-user.xp).toLocaleString()} XP</span></div><Bar value={pct} color={rank.color} height={8}/><div style={{fontSize:12,color:C.muted,fontFamily:F.body,marginTop:8}}>At current rate — <strong style={{color:rank.color}}>5 weeks to {next.name}</strong></div></>}
      </WCard>
      <WCard><Label>TO REACH {next?.name.toUpperCase()}</Label>{["Maintain check-in streak 3 more weeks","Eliminate 2 more recurring costs","Raise Communication above 92%","Document everything you ship this week","Get employer verification on next check-in"].map((r,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:9}}><div style={{width:16,height:16,borderRadius:"50%",border:`1px solid ${C.wborder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:8,color:C.muted}}>○</div><span style={{fontSize:12,color:C.text,fontFamily:F.body,lineHeight:1.5}}>{r}</span></div>)}</WCard>
    </div>
    <WCard><Label>ALL 12 RANKS</Label><div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginTop:8}}>{RANKS.map(rk=><div key={rk.level} style={{background:rk.level===rank.level?`${rk.color}15`:rk.xp<=user.xp?`${rk.color}08`:C.dim+"33",border:`1px solid ${rk.level===rank.level?rk.color+"55":rk.xp<=user.xp?rk.color+"20":C.wborder}`,borderRadius:10,padding:"10px 6px",textAlign:"center"}}><div style={{fontSize:16,color:rk.color,marginBottom:3}}>{rk.icon}</div><div style={{fontSize:10,fontWeight:700,color:rk.level===rank.level?rk.color:rk.xp<=user.xp?C.text:C.muted,fontFamily:F.body}}>{rk.name}</div><div style={{fontSize:9,color:C.muted,fontFamily:F.mono,marginTop:1}}>{rk.level===rank.level?"YOU":rk.xp<=user.xp?"✓":rk.xp.toLocaleString()}</div></div>)}</div></WCard>
  </div>;
}

function EmployerViewScreen({user}){
  const rank=getRank(user.xp);
  return<div style={{maxWidth:640,margin:"0 auto"}}>
    <WCard style={{background:`${C.sky}09`,border:`1px solid ${C.sky}20`,marginBottom:14,fontSize:12,color:C.muted,fontFamily:F.body}}>This is exactly what your employer sees. No surprises.</WCard>
    <WCard glow color={rank.color} style={{marginBottom:12}}>
      <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:18}}><Avatar initials={user.name.split(" ").map(n=>n[0]).join("")} color={rank.color} size={44} ring/><div><div style={{fontSize:17,fontWeight:900,color:C.near,fontFamily:F.head}}>{user.name}</div><div style={{fontSize:13,color:rank.color,fontFamily:F.mono}}>{rank.icon} {rank.name} · Level {rank.level}</div></div><div style={{marginLeft:"auto"}}><Pill color={C.green}>VERIFIED ✓</Pill></div></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>{[["VALUE INNOVATION",`${user.metrics.vi}%`,C.green],["COMMUNICATION",`${user.metrics.comm}%`,C.sky],["MONTHLY VALUE","$22,500",C.amber]].map(([l,v,col])=><div key={l} style={{background:`${col}10`,border:`1px solid ${col}20`,borderRadius:10,padding:"12px"}}><Label color={col}>{l}</Label><div style={{fontSize:20,fontWeight:900,color:col,fontFamily:F.head}}>{v}</div></div>)}</div>
      {[["Cost",user.metrics.cost,C.green],["Risk",user.metrics.risk,C.sky],["Quality",user.metrics.quality,C.purple],["Value",user.metrics.value,C.amber]].map(([l,v,col])=><div key={l} style={{marginBottom:9}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:C.text,fontFamily:F.body}}>{l}</span><span style={{fontSize:12,fontWeight:800,color:col,fontFamily:F.mono}}>{v}%</span></div><Bar value={v} color={col} height={5}/></div>)}
    </WCard>
  </div>;
}

function TeamScreen(){
  const[sel,sSel]=useState(null);const[msg,sMsg]=useState("");const[msgs,sMsgs]=useState([{from:"Maria Santos",text:"Just merged the component library. Check when you can.",time:"2m ago",col:C.green},{from:"Sarah Kim",text:"Staging deploy is done. All green.",time:"9m ago",col:"#4FC3F7"}]);
  const[voice,sVoice]=useState(false);const[video,sVideo]=useState(false);const[feed]=useState([{dev:"Maria Santos",col:C.green,msg:"Merged PR #147 · component-library-v2",time:"2s ago"},{dev:"Sarah Kim",col:"#4FC3F7",msg:"Deploy complete · staging · 0 errors",time:"45s ago"},{dev:"Alex Chen",col:C.green,msg:"Commit: fix/auth-token-refresh · Quality 96%",time:"3m ago"},{dev:"Priya Mehta",col:"#63B3ED",msg:"Unit tests added · payment module",time:"12m ago"},{dev:"James Okafor",col:C.amber,msg:"Incident #8 opened · API timeout",time:"1h ago"}]);
  const send=()=>{if(!msg.trim())return;sMsgs([...msgs,{from:"You",text:msg,time:"now",col:C.green}]);sMsg("");};
  return<div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 48px)",gap:0}}>
    <div style={{flex:1,overflow:"auto",padding:"0 0 80px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:14}}>
        {TEAM.map((m,i)=>(
          <div key={i} onClick={()=>sSel(sel===i?null:i)} style={{background:sel===i?`${m.color}12`:C.wcard,border:`1px solid ${sel===i?m.color+"44":C.wborder}`,borderRadius:14,padding:"14px",cursor:"pointer",transition:"all .2s",position:"relative"}} onMouseEnter={e=>{if(sel!==i)e.currentTarget.style.borderColor=`${m.color}30`;}} onMouseLeave={e=>{if(sel!==i)e.currentTarget.style.borderColor=C.wborder;}}>
            {m.isYou&&<div style={{position:"absolute",top:8,right:8}}><Pill color={C.green}>YOU</Pill></div>}
            <div style={{position:"relative",marginBottom:8,display:"inline-block"}}><Avatar initials={m.avatar} color={m.color} size={36}/><div style={{position:"absolute",bottom:0,right:0}}><StatusDot s={m.status}/></div></div>
            <div style={{fontSize:12,fontWeight:700,color:C.near,fontFamily:F.head,marginBottom:2}}>{m.name.split(" ")[0]}</div>
            <div style={{fontSize:10,color:m.color,fontFamily:F.mono,marginBottom:6}}>{m.rank}</div>
            <div style={{fontSize:11,color:C.muted,fontFamily:F.body,lineHeight:1.4,marginBottom:8}}>{m.activity}</div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,fontWeight:800,color:m.vi>=80?C.green:m.vi>=60?C.amber:C.red,fontFamily:F.mono}}>{m.vi}%</span><span style={{fontSize:10,color:m.trend[0]==="-"?C.red:C.green,fontFamily:F.mono}}>{m.trend}</span></div>
            <Bar value={m.vi} color={m.vi>=80?C.green:m.vi>=60?C.amber:C.red} height={3}/>
            {sel===i&&!m.isYou&&<div style={{marginTop:10,display:"flex",gap:6}}><Btn sm v="outline" onClick={e=>{e.stopPropagation();}}>Chat</Btn><Btn sm v="sky" onClick={e=>{e.stopPropagation();sVoice(true);}}>Voice</Btn><Btn sm v="green" onClick={e=>{e.stopPropagation();sVideo(true);}}>Video</Btn></div>}
          </div>
        ))}
      </div>
      <WCard><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><Label>TEAM LIVE FEED</Label><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 2s infinite"}}/><span style={{fontSize:10,color:C.green,fontFamily:F.mono}}>LIVE</span></div></div>
        {feed.map((f,i)=><div key={i} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:i<feed.length-1?`1px solid ${C.wborder}`:"none"}}><div style={{width:5,height:5,borderRadius:"50%",background:f.col,flexShrink:0,marginTop:5}}/><div style={{flex:1}}><span style={{fontSize:12,fontWeight:700,color:f.col,fontFamily:F.body}}>{f.dev}</span><span style={{fontSize:12,color:C.muted,fontFamily:F.body}}> · {f.msg}</span></div><span style={{fontSize:10,color:C.dim,fontFamily:F.mono,flexShrink:0}}>{f.time}</span></div>)}
      </WCard>
    </div>
    {/* Toolbar */}
    <div style={{position:"fixed",bottom:0,left:216,right:0,background:"rgba(12,14,20,.96)",backdropFilter:"blur(20px)",borderTop:`1px solid ${C.wborder}`,padding:"9px 20px",display:"flex",alignItems:"center",gap:12,zIndex:100}}>
      {[["👋","Tap",false,null],["🎤",voice?"On":"Mic",voice,()=>sVoice(!voice)],["📹",video?"Live":"Video",video,()=>sVideo(!video)]].map(([ic,label,on,fn])=>(
        <div key={label} style={{display:"flex",alignItems:"center",gap:6}}><button onClick={fn} style={{width:34,height:34,borderRadius:"50%",background:on?`${C.green}20`:C.cardHi,border:`1px solid ${on?C.green+"44":C.wborder}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,transition:"all .15s"}}>{ic}</button><span style={{fontSize:11,color:on?C.green:C.muted,fontFamily:F.body}}>{label}</span></div>
      ))}
      <div style={{width:1,height:24,background:C.wborder}}/>
      <div style={{flex:1,display:"flex",gap:8}}>
        <input value={msg} onChange={e=>sMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message the team..." style={{flex:1,background:C.cardHi,border:`1px solid ${C.wborder}`,borderRadius:8,padding:"7px 12px",color:C.near,fontSize:13,fontFamily:F.body,outline:"none"}} onFocus={e=>e.target.style.borderColor=`${C.green}44`} onBlur={e=>e.target.style.borderColor=C.wborder}/>
        <Btn sm v="green" onClick={send}>Send</Btn>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
        {TEAM.filter(t=>t.status==="active").map((t,i)=><div key={i} style={{width:20,height:20,borderRadius:"50%",background:`${t.color}20`,border:`2px solid ${C.wsidebar}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:t.color,marginLeft:i>0?-5:0}}>{t.avatar[0]}</div>)}
        <span style={{fontSize:10,color:C.green,fontFamily:F.mono}}>{TEAM.filter(t=>t.status==="active").length} online</span>
      </div>
    </div>
  </div>;
}

function GoalsScreen(){
  return<div style={{display:"flex",flexDirection:"column",gap:12}}>
    {[{t:"Eliminate 2 more recurring costs this month",p:50,col:C.green,d:"2 weeks"},{t:"Reach Commander rank",p:62,col:C.amber,d:"5 weeks"},{t:"Raise Communication score to 92%",p:76,col:C.sky,d:"3 weeks"},{t:"Zero incidents for 4 consecutive weeks",p:75,col:C.purple,d:"1 week"}].map((g,i)=>(
      <WCard key={i}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div style={{fontSize:14,fontWeight:700,color:C.near,fontFamily:F.head,flex:1,marginRight:12,lineHeight:1.3}}>{g.t}</div><div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:18,fontWeight:900,color:g.col,fontFamily:F.head}}>{g.p}%</div><div style={{fontSize:10,color:C.muted,fontFamily:F.mono}}>{g.d} left</div></div></div><Bar value={g.p} color={g.col} height={8}/></WCard>
    ))}
  </div>;
}

function IntegrationsScreen(){
  const[conn,sConn]=useState(["github","jira"]);
  const tools=[{id:"github",name:"GitHub",col:C.near,cat:"Dev"},{id:"gitlab",name:"GitLab",col:C.amber,cat:"Dev"},{id:"jira",name:"Jira",col:C.sky,cat:"Project"},{id:"linear",name:"Linear",col:C.purple,cat:"Project"},{id:"pagerduty",name:"PagerDuty",col:C.red,cat:"Ops"},{id:"datadog",name:"Datadog",col:C.purple,cat:"Ops"},{id:"slack",name:"Slack",col:"#E01E5A",cat:"Comms"},{id:"aws",name:"AWS",col:C.amber,cat:"Infra"},{id:"vercel",name:"Vercel",col:C.near,cat:"Dev"},{id:"zendesk",name:"Zendesk",col:C.green,cat:"Ops"}];
  return<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
    {tools.map(t=>(
      <div key={t.id} style={{background:C.wcard,border:`1px solid ${conn.includes(t.id)?t.col+"33":C.wborder}`,borderRadius:12,padding:"14px",display:"flex",gap:12,alignItems:"center"}}>
        <div style={{width:34,height:34,borderRadius:9,background:`${t.col}15`,border:`1px solid ${t.col}25`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:13,color:t.col,fontWeight:800,fontFamily:F.mono}}>{t.name[0]}</span></div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.near,fontFamily:F.body}}>{t.name}</div><div style={{fontSize:10,color:C.muted,fontFamily:F.mono}}>{t.cat}</div></div>
        <button onClick={()=>sConn(conn.includes(t.id)?conn.filter(c=>c!==t.id):[...conn,t.id])} style={{background:conn.includes(t.id)?`${C.green}20`:C.cardHi,border:`1px solid ${conn.includes(t.id)?C.green+"44":C.wborder}`,color:conn.includes(t.id)?C.green:C.muted,padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:F.mono,whiteSpace:"nowrap",transition:"all .15s"}}>{conn.includes(t.id)?"Connected":"Connect"}</button>
      </div>
    ))}
  </div>;
}

function CommunicationScreen({user}){
  return<div style={{display:"flex",flexDirection:"column",gap:12}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
      {[["SCORE",`${user.metrics.comm}%`,C.sky,"Multiplier on VI"],["DOCS THIS MONTH","4 docs",C.purple,"Team visibility +"],["RESPONSE TIME","12min",C.green,"Benchmark: 45min"]].map(([l,v,col,s])=>(
        <WCard key={l} glow color={col}><Label color={col}>{l}</Label><div style={{fontSize:26,fontWeight:900,color:col,fontFamily:F.head,marginBottom:2}}>{v}</div><div style={{fontSize:11,color:C.muted,fontFamily:F.body}}>{s}</div></WCard>
      ))}
    </div>
    <WCard><Label>INCREASE YOUR COMMUNICATION SCORE</Label><div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
      {[{a:"Document what you cancelled this week",pts:"+6",done:false},{a:"Write a 3-sentence summary of your deploy automation",pts:"+10",done:false},{a:"Review one teammate's PR with written feedback",pts:"+8",done:true},{a:"Update the incident runbook you use most",pts:"+5",done:true}].map((item,i)=>(
        <div key={i} style={{display:"flex",gap:12,alignItems:"center",padding:"9px 12px",background:item.done?`${C.green}08`:C.cardHi,border:`1px solid ${item.done?C.green+"20":C.wborder}`,borderRadius:10}}>
          <span style={{color:item.done?C.green:C.muted,fontSize:13}}>{item.done?"✓":"○"}</span>
          <span style={{flex:1,fontSize:13,color:item.done?C.muted:C.text,fontFamily:F.body,textDecoration:item.done?"line-through":"none"}}>{item.a}</span>
          <span style={{fontSize:11,color:item.done?C.muted:C.sky,fontFamily:F.mono,fontWeight:700}}>{item.pts} pts</span>
        </div>
      ))}
    </div></WCard>
  </div>;
}

function NotificationsScreen({onNav}){
  return<div style={{display:"flex",flexDirection:"column",gap:12}}>
    {[{type:"DUE",col:C.amber,t:"Weekly check-in due Friday",b:"Complete your check-in to keep your 11-week streak.",nav:"checkin",a:"Start Check-in"},
      {type:"RANK",col:C.green,t:"340 XP from Commander",b:"Focus on the Create pillar this week.",nav:"rank",a:"View Rank Path"},
      {type:"ALERT",col:C.red,t:"Unused tool detected · $180/mo",b:"A tool in your GitHub Actions has not been used in 6 weeks. Cancel it for +12 XP.",nav:"integrations",a:"View Tool"}].map((al,i)=>(
      <WCard key={i} glow color={al.col}>
        <div style={{display:"flex",gap:12}}>
          <Pill color={al.col}>{al.type}</Pill>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:800,color:C.near,fontFamily:F.head,marginBottom:5}}>{al.t}</div><div style={{fontSize:13,color:C.muted,fontFamily:F.body,lineHeight:1.6,marginBottom:10}}>{al.b}</div><Btn sm onClick={()=>onNav(al.nav)}>{al.a} →</Btn></div>
        </div>
      </WCard>
    ))}
  </div>;
}

/* ══════════════════════════════
   WORKSPACE SHELL
══════════════════════════════ */
function Workspace({user,onExit}){
  const[nav,sNav]=useState("home");
  const u=user||DEMO_USER;
  return<div style={{display:"flex",height:"100vh",overflow:"hidden",background:C.wbg}}>
    <Sidebar active={nav} onNav={sNav} user={u} onExit={onExit}/>
    <div style={{flex:1,overflow:"auto",background:C.wbg,display:"flex",flexDirection:"column"}}>
      <div style={{height:48,background:C.wsidebar,borderBottom:`1px solid ${C.wborder}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",flexShrink:0,position:"sticky",top:0,zIndex:50}}>
        <div style={{fontSize:14,fontWeight:700,color:C.near,fontFamily:F.head}}>{NAV.find(n=>n.id===nav)?.label}</div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{fontSize:11,color:C.muted,fontFamily:F.mono}}>{u.company}</div><Avatar initials={u.name.split(" ").map(n=>n[0]).join("")} color={getRank(u.xp).color} size={26}/></div>
      </div>
      <div style={{padding:nav==="team"?"20px 24px 0":"22px",flex:1}}>
        {nav==="home"&&<HomeScreen user={u} onNav={sNav}/>}
        {nav==="checkin"&&<CheckInScreen/>}
        {nav==="coach"&&<CoachScreen/>}
        {nav==="value"&&<ValueScreen user={u}/>}
        {nav==="communication"&&<CommunicationScreen user={u}/>}
        {nav==="rank"&&<RankScreen user={u}/>}
        {nav==="impact"&&<ImpactScreen user={u}/>}
        {nav==="employer"&&<EmployerViewScreen user={u}/>}
        {nav==="team"&&<TeamScreen/>}
        {nav==="goals"&&<GoalsScreen/>}
        {nav==="integrations"&&<IntegrationsScreen/>}
        {nav==="notifications"&&<NotificationsScreen onNav={sNav}/>}
      </div>
    </div>
  </div>;
}

/* ══════════════════════════════
   ROOT APP
══════════════════════════════ */
export default function App(){
  const[screen,sScreen]=useState("site");
  const[scrolled,sScrolled]=useState(false);
  const[user,sUser]=useState(null);

  useEffect(()=>{
    const h=()=>sScrolled(window.scrollY>50);
    window.addEventListener("scroll",h);
    return()=>window.removeEventListener("scroll",h);
  },[]);

  const go=s=>{sScreen(s);window.scrollTo(0,0);};

  if(screen==="onboard") return<><style>{CSS}</style><Onboarding onDone={()=>{sUser(DEMO_USER);go("workspace");}}/></>;
  if(screen==="workspace") return<><style>{CSS}</style><Workspace user={user||DEMO_USER} onExit={()=>go("site")}/></>;

  return<div>
    <style>{CSS}</style>
    <Nav onNav={go} scrolled={scrolled}/>
    <Hero onNav={go}/>
    <Strip/>
    <Problem onNav={go}/>
    <HowItWorks/>
    <RankSection onNav={go}/>
    <ForDevelopers onNav={go}/>
    <Pricing onNav={go}/>
    <Footer/>
  </div>;
}
