import { useState, useEffect, useRef, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";

// ═══════════════════════════════════════════════════════════════════════════
// INSTABILITY WATCH v7 — full union + Execution Layer (#146-148) — 145-idea framework, mock data throughout
// New in v5: Vol Complex page · Private Credit category · Contradictory Ledger
// Status updates: Group B split internals · 30Y threshold touch · breadth verified
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  bg:"#07090b", panel:"#0e1216", panel2:"#131820", elevated:"#1a212b",
  border:"#1d2732", border2:"#2a3a4a",
  ink:"#d6dfe8", ink2:"#7d92a4", ink3:"#41556a", ink4:"#22303e",
  red:"#e25c3d", redDim:"#38160d", amber:"#cf9430", amberDim:"#382a0e",
  green:"#3fa572", greenDim:"#0e3322", blue:"#6da3d8", blueDim:"#0e2236",
  purple:"#a184dc", purpleDim:"#221238", cyan:"#4fc3c8",
  mono:"'IBM Plex Mono','SF Mono',Menlo,monospace",
  sans:"'Space Grotesk','Inter',system-ui,sans-serif",
  body:"'Inter',system-ui,sans-serif",
};
const STATUS = {
  RED:{bg:T.redDim,b:T.red,t:T.red,label:"Red"},
  AMBER:{bg:T.amberDim,b:T.amber,t:T.amber,label:"Amber"},
  GREEN:{bg:T.greenDim,b:T.green,t:T.green,label:"Green"},
  SPLIT:{bg:T.amberDim,b:T.amber,t:T.amber,label:"Split"},
  GREY:{bg:"#182028",b:T.ink3,t:T.ink3,label:"N/A"},
  BULL:{bg:T.greenDim,b:T.green,t:T.green,label:"Bull"},
  BEAR:{bg:T.redDim,b:T.red,t:T.red,label:"Bear"},
};

function synth(seed,n,base,vol,drift=0,floor=-Infinity){
  const out=[];let v=base;
  for(let i=0;i<n;i++){
    const r=Math.sin(seed*997+i*.61)*.6+Math.sin(seed*131+i*.173)*.4;
    v=Math.max(floor,v*(1+r*vol+drift));
    const d=new Date(2026,6,12);d.setDate(d.getDate()-(n-i));
    out.push({i,d:d.toISOString().slice(5,10),v:+v.toFixed(2)});
  }return out;
}

// ── CANARY CATEGORIES (updated to 12 July 2026 state) ────────────────────────
const CATS=[
 {id:0,name:"Leverage & Speculation Velocity",group:"A",status:"RED",added:true,speed:"Monthly",
  note:"All four verified rows red. 2007 signature: leverage extreme while credit calm — equivalent of mid-2006. Master ideas #8, #20-22, #25.",
  rows:[
   {n:"Margin debt YoY",th:"Watch >25% · Canary >40%",cur:"+53.7%",s:"RED",v:1,spark:{seed:3,base:22,vol:.012,drift:.011,unit:"%",thLine:40}},
   {n:"Margin debt / GDP",th:"Avg 3.0% · Canary >3.5%",cur:"4.1% — ATH",s:"RED",v:1,spark:{seed:5,base:3.1,vol:.004,drift:.0028,unit:"%",thLine:3.5}},
   {n:"Real margin debt vs mkt growth ('97)",th:"Canary >1.3×",cur:"1.54×",s:"RED",v:1},
   {n:"Single-stock leveraged ETF AUM",th:"Rapid AUM in narrow names",cur:"Elevated — SK Hynix 2× ep.",s:"AMBER",v:1},
   {n:"Tranched-round opacity",th:"Blended valuations unreported",cur:"Widespread",s:"AMBER",v:1},
   {n:"Sector-concentrated direct credit",th:"SaaS $8B→$538B (67×)",cur:"67× / 10yr — collateral now impaired (#109)",s:"RED",v:1}]},
 {id:1,name:"Volatility & Dispersion Complex",group:"D",status:"RED",speed:"Daily",
  note:"UPGRADED green→red. The vol quartet (#110/#114/#118/#133) all at late-cycle extremes: index calm is a dispersion artifact, not quiet. See Vol Complex page.",
  rows:[
   {n:"VIX level",th:"Elev 20-30 · Canary >30",cur:"17.3 — calm on its face",s:"GREEN",v:1,spark:{seed:11,base:19,vol:.05,drift:-.001,unit:"",thLine:30}},
   {n:"VIX term structure",th:"Canary on backwardation",cur:"Normal contango",s:"GREEN",v:1},
   {n:"VXN−VIX spread (#110)",th:"Canary >90th %ile since '01",cur:"+11.8 — widest ex-crisis in 25yr",s:"RED",v:1,spark:{seed:14,base:6,vol:.03,drift:.008,unit:"",thLine:10}},
   {n:"VIXEQ−VIX spread (#114)",th:"Canary at series highs",cur:"~33 — highest in 2015-26 series",s:"RED",v:1,spark:{seed:15,base:14,vol:.03,drift:.007,unit:"",thLine:25}},
   {n:"Convergence VIX (#118)",th:"Latent VIX at crisis corr 0.8-0.9",cur:"~35-40 implied vs 17 spot",s:"RED",v:1},
   {n:"Skew inversion (#133)",th:"Canary: call IV > put IV",cur:"INVERTED — 1st time in 39yr structure",s:"RED",v:1,spark:{seed:16,base:-4,vol:.15,drift:.05,unit:"",thLine:0}},
   {n:"NDX−SPX correlation spread (#111)",th:"Canary on bifurcation",cur:"NDX high / SPX low — one AI trade",s:"RED",v:1},
   {n:"IV vs fwd realized (NDX) (#112)",th:"Canary <-10pts during strength",cur:"Serial underpricing — 2000-only precedent",s:"RED",v:1},
   {n:"MOVE (bond vol)",th:"Canary >140",cur:"Not verified",s:"GREY",v:0}]},
 {id:2,name:"Public Credit",group:"B",status:"GREEN",speed:"Daily",
  note:"HY ~270bps, near 30-yr lows — the LAST calm gauge in Group B. Private half already stressed (Cat 10). Sequence at step 3 of 4: public equity losers → alt-mgr equity → private marks/gatings → HY. This category is the step-4 tripwire.",
  rows:[
   {n:"HY OAS level",th:"Canary >500bps",cur:"~270bps",s:"GREEN",v:1,spark:{seed:21,base:290,vol:.012,drift:-.0006,unit:"bps",thLine:500}},
   {n:"HY OAS 10-day RoC",th:"Canary >100bps/10d",cur:"+11bps off low",s:"GREEN",v:1},
   {n:"Alt-manager equity (KKR -24%, ARES -23%)",th:">3% below seasonal median",cur:"FIRED early — repricing outright (#58/#109)",s:"RED",v:1},
   {n:"Insurer IG underperformance (#139)",th:"Sector worst in IG index",cur:"Worst IG segment early '26",s:"AMBER",v:1},
   {n:"IG OAS / CDX HY",th:"IG >150 · CDX >50bps/5d",cur:"Not verified",s:"GREY",v:0}]},
 {id:3,name:"Market Breadth",group:"D",status:"AMBER",speed:"Daily",
  note:"%>200dMA now VERIFIED at 61% — GREEN on level, honestly logged against my earlier expectation. But it's a dispersion regime not broad health: concentration red, loser-decile carnage in software (#109). Mixed internals.",
  rows:[
   {n:"% S&P above 200dMA",th:"Canary <40% · velocity >10pp/5d",cur:"61% ($S5TH) — VERIFIED GREEN",s:"GREEN",v:1,spark:{seed:31,base:57,vol:.015,drift:.001,unit:"%",thLine:40}},
   {n:"Sector concentration (Mag-7 share)",th:"Canary top-5 >35% sector cap",cur:"Mag-7 >30% of S&P — extreme",s:"RED",v:1},
   {n:"Loser-decile composition (#109)",th:"Sector clustering in worst decile",cur:"~20 of 52 = software/IT, -25 to -59%",s:"RED",v:1},
   {n:"Old/New Era rotation (#115/#120)",th:"Liquidation = both falling",cur:"ROTATION quadrant — benign so far",s:"GREEN",v:1},
   {n:"Meme reactivation (price/volume)",th:">15% on <$5M volume",cur:"Wendy's +26% on $2.2M",s:"AMBER",v:1},
   {n:"NH/NL · EW-vs-CW",th:"<1:1 · >3% EW underperf/20d",cur:"Not verified",s:"GREY",v:0}]},
 {id:4,name:"Price Structure & Sequencing",group:"X",status:"RED",speed:"Daily",
  note:"AI complex cracking in predicted order: robotics (-17%) first, then memory/semis together — high downside correlation (#122). KOSDAQ -35% = peripheral-first pattern (#134). Contagion clock running (#117/#126).",
  rows:[
   {n:"SOX extension vs 200dMA percentile",th:"Above dot-com peak %ile",cur:"Most overbought since 2000 → rolling over",s:"RED",v:1},
   {n:"Disruptors bubble percentile",th:"Above any prior peak",cur:"~975 vs prior max 650",s:"RED",v:1},
   {n:"AI sub-theme rollover order (#117)",th:"Narrative-first cracking",cur:"Robotics -17% leading, all 4 down together",s:"RED",v:1},
   {n:"Peripheral-market crack (#134)",th:"Outside-in sequencing",cur:"KOSDAQ -35% in weeks; US core holds",s:"RED",v:1,spark:{seed:44,base:1200,vol:.03,drift:-.012,unit:"",thLine:900}},
   {n:"Theme-peak lag compression (#126)",th:"Compressing lags = accelerating",cur:"First lags measurable — building",s:"AMBER",v:1},
   {n:"Trend-variance distance-to-cascade (#146)",th:"Decline that flips all monthly models",cur:"-7% to -9% — inside SpotGamma\u2019s 10% forecast",s:"AMBER",v:1},
   {n:"SPX drawdown",th:"Canary >10%",cur:"<5%",s:"GREEN",v:1}]},
 {id:5,name:"Yield Curve & Rates",group:"C",status:"AMBER",speed:"Daily",
  note:"30Y TOUCHED 5.18% — long-end threshold breached at the 30Y point. Both ends now rising = BEAR steepener (#121): term-premium/fiscal composition, historically the worst post-inversion configuration. Secular recalibration flagged (#116).",
  rows:[
   {n:"30Y level",th:"Canary >5.0%",cur:"Touched 5.18%, ~4.99 now",s:"RED",v:1,spark:{seed:51,base:4.72,vol:.008,drift:.0012,unit:"%",thLine:5.0}},
   {n:"10Y level",th:"Canary >5.0%",cur:"4.3-4.7% approaching",s:"AMBER",v:1},
   {n:"Steepener composition (#121)",th:"Bear steepener = worst config",cur:"BEAR — both ends rising, TP-led",s:"RED",v:1},
   {n:"T-bill direction",th:"Rising = cuts priced out",cur:"3.52→3.72% — turned up",s:"AMBER",v:1},
   {n:"Stock-bond correlation (#129)",th:"Positive regime breaks 60/40 hedge",cur:"0.72 peak (97yr high) → 0.53, oscillating",s:"AMBER",v:1,spark:{seed:53,base:.35,vol:.06,drift:.006,unit:"",thLine:.6}},
   {n:"10Y 60d velocity / acceleration",th:">+100bps/60d · 3 larger rises",cur:"Not verified — top priority",s:"GREY",v:0},
   {n:"r* decomposition",th:"TP-side widening = canary",cur:"Term premium rising",s:"AMBER",v:1}]},
 {id:6,name:"Funding & Liquidity",group:"B",status:"AMBER",speed:"Mo/Qtr",
  note:"M2 ESCALATED: largest monthly increase in 5 years (#Part XVI evidence) — the 12-18mo inflation clock starts now; mid/late-2027 convergence window. Bank NDFI disclosure (Q1 '26) converted TBD rows into a live quarterly feed (#138).",
  rows:[
   {n:"M2 monthly change",th:"Canary on extreme re-accel",cur:"Largest monthly rise in 5yrs",s:"RED",v:1,spark:{seed:61,base:40,vol:.4,drift:.05,unit:"$B",thLine:200}},
   {n:"Bank NDFI drawn exposure (#138)",th:"New: Q1'26 granular disclosure",cur:"$1.14T drawn · ~$3T EAD · 11% of books",s:"AMBER",v:1},
   {n:"SLOOS C&I / NDFI standards",th:"Sharp tightening jump",cur:"C&I modest · NDFI tighter all cats",s:"AMBER",v:1},
   {n:"Cash-competition (#125)",th:"Bill RoC↑ + MMF growth↑",cur:"Bills turning up — building",s:"AMBER",v:1},
   {n:"TED / FRA-OIS / xccy basis",th:"TED >50 · crisis >100",cur:"Not verified",s:"GREY",v:0}]},
 {id:7,name:"Cross-Asset & Regime",group:"X",status:"AMBER",speed:"Daily",
  note:"Commodity roll-yield regime (#131): 5yrs oil backwardation — the session's one genuine income idea, and the natural asset for a positive stock-bond-correlation world. Retail duration flows = wrong-way positioning (#124).",
  rows:[
   {n:"Oil curve regime (#131)",th:"Backwardation = scarcity carry",cur:"5yrs backwardation · roll +222% vs spot +0.6%",s:"AMBER",v:1},
   {n:"Gold regime flag",th:"Above 200dMA + rising = fear mode",cur:"At 200dMA — transition",s:"AMBER",v:1},
   {n:"Central bank gold buying",th:"Sustained = de-dollarisation",cur:"Elevated since 2022",s:"AMBER",v:1},
   {n:"Retail duration flows (#124)",th:"Heavy buying into rising secular yields",cur:"TLT/BLV retail bid vs secular turn",s:"AMBER",v:1},
   {n:"USD/JPY carry · DXY stress",th:"JPY +5%/10d",cur:"Not verified",s:"GREY",v:0}]},
 {id:8,name:"Positioning & Sentiment",group:"D",status:"RED",speed:"Weekly",
  note:"Dealer gamma PARTIALLY VERIFIED via SpotGamma: NDX short gamma (amplifying) vs SPX long gamma (dampening) — asymmetric jump risk. Skew inversion says nobody is hedged. Insider-vs-buyback divergence added (#144).",
  rows:[
   {n:"Dealer gamma — NDX",th:"Short gamma = self-amplifying",cur:"SHORT (SpotGamma) — verified",s:"RED",v:1},
   {n:"Dealer gamma — SPX/singles",th:"Long gamma = dampening",cur:"LONG — crowded vol-selling",s:"AMBER",v:1},
   {n:"Hedging existence (#133)",th:"Skew inversion = unhedged market",cur:"Greed premium — puts cheap, unbought",s:"RED",v:1},
   {n:"Retail content vs macro-risk ratio",th:"Rising buy-X : risk content",cur:"Pattern active — '99-'00 analogue",s:"RED",v:1},
   {n:"Insider sell vs corp buyback (#144)",th:"Divergence: weight the personal account",cur:"Insiders record sellers vs record buybacks",s:"AMBER",v:1},
   {n:"AAII · put/call",th:"Complacency >3.0 · P/C >1.2",cur:"Not verified",s:"GREY",v:0}]},
 {id:9,name:"Inflation & Expectations",group:"C",status:"AMBER",speed:"Monthly",
  note:"P/E gap (#127) at record wides in the EUPHORIA variant (record trailing earnings). But #143: revision regime is UP (16%→25%) — the benign closing path is ACTIVE. The bear trigger (#128) is inverted, honestly logged.",
  rows:[
   {n:"Trailing-vs-forward P/E gap (#127)",th:"Record wide + record trailing E = euphoria variant",cur:"Widest in history ex-2000/2022",s:"RED",v:1},
   {n:"Revision breadth (#128/#143)",th:"Negative at record wides = trigger",cur:"INVERTED — revisions UP 16%→25%",s:"BULL",v:1,spark:{seed:91,base:16,vol:.01,drift:.004,unit:"%",thLine:25}},
   {n:"Guidance-language NLP",th:"Hedging phrases accelerating",cur:"Red — vs rising estimates: divergence",s:"RED",v:1},
   {n:"Unit labor costs vs productivity",th:"Productivity > wages = disinflationary",cur:"Productivity leading in AI sectors",s:"GREEN",v:1},
   {n:"M2→CPI lag clock (#9 escalated)",th:"12-18mo from extreme M2 print",cur:"Clock started — window mid/late 2027",s:"AMBER",v:1},
   {n:"CPI level / acceleration streak",th:"3 consecutive higher prints",cur:"Not verified",s:"GREY",v:0}]},
 {id:10,name:"Private Credit & NDFI",group:"B",status:"RED",added:true,speed:"Qtr/Event",
  note:"NEW CATEGORY (#135-140, #145). The private half of Group B — already stressed while HY sleeps. Gatings HAVE fired. True defaults 5.8% vs 1-2% headline. This is where the framework's predicted sequence currently lives.",
  rows:[
   {n:"True default rate (Fitch broad) (#135)",th:"Broad incl. PIK/selective — vs headline",cur:"5.8% (highest ever tracked) vs 1-2% headline",s:"RED",v:1,spark:{seed:101,base:2.8,vol:.02,drift:.011,unit:"%",thLine:5}},
   {n:"PIK concealment (#136)",th:"PIK share of defaults · neg-FCF borrowers",cur:"60% of defaults PIK · 40% borrowers neg-FCF",s:"RED",v:1},
   {n:"Gating / redemption events (#137)",th:"Requests > caps = mismatch fired",cur:"BCRED 8% vs 5% cap · CTAC 15.7% · Blue Owl gated",s:"RED",v:1},
   {n:"Bank NDFI exposure & losses (#138)",th:"Loss rates rising in disclosures",cur:"Losses still muted — the step-4 bridge",s:"AMBER",v:1},
   {n:"Insurer PC concentration (#139)",th:">10% of life-insurer assets",cur:">10% (>15% PE-affiliated) · Treasury team stood up",s:"AMBER",v:1},
   {n:"Retailization — 401(k) channel (#140)",th:"Illiquid assets → retail late-cycle",cur:"Fidelity/Vanguard partnerships, DOL support",s:"AMBER",v:1},
   {n:"Official reassurance vs action (#145)",th:"Words dovish while supervision escalates",cur:"'Not systemic' + Fed queries + FSB report",s:"AMBER",v:1}]},
];

// ── DIVERGENCE HISTORY (B now transitioning) ─────────────────────────────────
const DIV_HISTORY=(()=>{const m=[];const start=new Date(2024,0,1);
 const gA=[0,0,0,0,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2];
 const gB=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1];
 const gC=[1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
 const gD=[0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,2,2];
 for(let i=0;i<31;i++){const d=new Date(start);d.setMonth(d.getMonth()+i);
  m.push({m:d.toLocaleString("en",{month:"short"})+"'"+String(d.getFullYear()).slice(2),A:gA[i],B:gB[i],C:gC[i],D:gD[i],gap:gA[i]-gD[i]});}
 return m;})();

// ── MOCK SERIES ──────────────────────────────────────────────────────────────
const SKEW=[{m:"'22",v:-8},{m:"'23",v:-7},{m:"'24",v:-5},{m:"Q1'25",v:-4},{m:"Q3'25",v:-2},{m:"Q1'26",v:0.5},{m:"Jul'26",v:1.8}];
const PC_DEFAULT=[{q:"Q1'25",head:1.2,broad:2.1},{q:"Q2'25",head:1.4,broad:2.8},{q:"Q3'25",head:1.6,broad:3.6},{q:"Q4'25",head:1.8,broad:4.6},{q:"Q1'26",head:2.0,broad:5.4},{q:"Jul'26",head:2.1,broad:5.8}];
const BUYBACK_BREADTH=[{q:"Q3'24",v:10},{q:"Q4'24",v:14},{q:"Q1'25",v:20},{q:"Q2'25",v:27},{q:"Q3'25",v:34},{q:"Q4'25",v:41},{q:"Q1'26",v:49},{q:"Q2'26",v:56}];
const REVISIONS=[{m:"Jan",v:15.8},{m:"Feb",v:17},{m:"Mar",v:19},{m:"Apr",v:21.5},{m:"May",v:23.5},{m:"Jun",v:25}];
const VOLQUAD=synth(77,120,10,.02,.006).map((d,i)=>({...d,vxn:+(d.v+1.5+Math.sin(i*.2)*.6).toFixed(1),vixeq:+(d.v*2.6+Math.sin(i*.15)*2).toFixed(1)}));

// ── SHARED ───────────────────────────────────────────────────────────────────
function Dot({s,size=8}){const c=STATUS[s]||STATUS.GREY;
 return <span style={{width:size,height:size,borderRadius:"50%",background:c.t,display:"inline-block",flexShrink:0,boxShadow:s!=="GREY"?`0 0 ${size}px ${c.t}55`:"none"}}/>;}
function Badge({s,children}){const c=STATUS[s]||STATUS.GREY;
 return <span style={{display:"inline-flex",alignItems:"center",gap:5,background:c.bg,border:`1px solid ${c.b}`,borderRadius:3,padding:"2px 8px",fontSize:9.5,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:c.t,fontFamily:T.mono,whiteSpace:"nowrap"}}><Dot s={s} size={5}/>{children||c.label}</span>;}
function Card({children,style={},onClick,accent}){const[h,setH]=useState(false);
 return <div onClick={onClick} onMouseEnter={()=>onClick&&setH(true)} onMouseLeave={()=>setH(false)}
  style={{background:T.panel,border:`1px solid ${h?T.border2:T.border}`,borderTop:accent?`2px solid ${accent}`:`1px solid ${h?T.border2:T.border}`,borderRadius:6,padding:"15px 17px",transition:"border-color .15s",cursor:onClick?"pointer":"default",...style}}>{children}</div>;}
function Eyebrow({children,color=T.ink3}){return <div style={{fontSize:9.5,letterSpacing:".13em",textTransform:"uppercase",color,fontFamily:T.mono,marginBottom:10}}>{children}</div>;}
function Spark({cfg,height=100}){
 const data=useMemo(()=>synth(cfg.seed,90,cfg.base,cfg.vol,cfg.drift||0),[cfg]);
 const last=data[data.length-1].v;
 const breach=cfg.thLine!=null&&((cfg.drift||0)>=0?last>cfg.thLine:last<cfg.thLine);
 return(<div><ResponsiveContainer width="100%" height={height}>
  <AreaChart data={data} margin={{top:4,right:6,bottom:0,left:-14}}>
   <defs><linearGradient id={"g"+cfg.seed} x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor={breach?T.red:T.blue} stopOpacity={.35}/><stop offset="95%" stopColor={breach?T.red:T.blue} stopOpacity={0}/></linearGradient></defs>
   <XAxis dataKey="d" tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} interval={20} axisLine={false} tickLine={false}/>
   <YAxis tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false} domain={["auto","auto"]}/>
   {cfg.thLine!=null&&<ReferenceLine y={cfg.thLine} stroke={T.amber} strokeDasharray="4 3"/>}
   <Tooltip content={({active,payload})=>active&&payload?.[0]?<div style={{background:T.elevated,border:`1px solid ${T.border2}`,borderRadius:4,padding:"6px 10px",fontFamily:T.mono,fontSize:10,color:T.ink}}>{payload[0].payload.d}: <b>{payload[0].value}{cfg.unit}</b></div>:null}/>
   <Area type="monotone" dataKey="v" stroke={breach?T.red:T.blue} strokeWidth={1.4} fill={"url(#g"+cfg.seed+")"} dot={false}/>
  </AreaChart></ResponsiveContainer>
  <div style={{fontSize:9.5,color:T.ink3,fontFamily:T.mono,marginTop:2}}>mock series · last {last}{cfg.unit}{breach?" · IN BREACH":""}</div></div>);}

function SignalField({groups}){
 const ref=useRef(null);
 useEffect(()=>{const cv=ref.current;if(!cv)return;const ctx=cv.getContext("2d");let f=0;
  const colors={RED:T.red,AMBER:T.amber,GREEN:T.green,SPLIT:T.amber};
  const id=setInterval(()=>{ctx.clearRect(0,0,cv.width,cv.height);const w=cv.width,h=cv.height;
   groups.forEach((g,gi)=>{const x0=(gi/groups.length)*w,xw=w/groups.length;
    const col=colors[g.s]||T.ink3;
    const amp=g.s==="RED"?20:(g.s==="AMBER"||g.s==="SPLIT")?13:7;
    const freq=g.s==="RED"?3:(g.s==="AMBER"||g.s==="SPLIT")?2.1:1.4;
    ctx.globalAlpha=.12;ctx.fillStyle=col;ctx.fillRect(x0,0,xw-1,h);
    ctx.globalAlpha=.9;ctx.beginPath();ctx.strokeStyle=col;ctx.lineWidth=1.4;
    for(let px=0;px<xw;px++){const t=(px/xw)*Math.PI*2*freq+f*.045;
     let y=h/2+Math.sin(t)*amp+Math.sin(t*2.7+gi)*amp*.3;
     if(g.s==="SPLIT")y=h/2+(px%14<7?Math.sin(t)*6:Math.sin(t)*19);
     px===0?ctx.moveTo(x0+px,y):ctx.lineTo(x0+px,y);}
    ctx.stroke();
    ctx.globalAlpha=1;ctx.fillStyle=col;ctx.font=`700 9px ${T.mono}`;ctx.fillText(g.label,x0+8,14);
    ctx.fillStyle=T.ink2;ctx.font=`500 8px ${T.mono}`;ctx.fillText(g.sub,x0+8,26);});f++;},40);
  return()=>clearInterval(id);},[groups]);
 return <canvas ref={ref} width={900} height={62} style={{width:"100%",height:62,display:"block"}}/>;}

// ── PAGE: OVERVIEW ───────────────────────────────────────────────────────────
function Overview({go}){
 const groups=[
  {label:"A — LEVERAGE",sub:"RED · ATH extremes",s:"RED"},
  {label:"B — CREDIT",sub:"SPLIT · HY green / private red",s:"SPLIT"},
  {label:"C — RATES & INFL",sub:"AMBER · bear steepener",s:"AMBER"},
  {label:"D — VOL & SENT",sub:"RED · calm is artifact",s:"RED"}];
 const all=CATS.flatMap(c=>c.rows);
 const red=all.filter(r=>r.s==="RED"&&r.v).length,amber=all.filter(r=>r.s==="AMBER"&&r.v).length;
 return(<div style={{display:"flex",flexDirection:"column",gap:18}}>
  <div>
   <Eyebrow>Live signal field — 12 Jul 2026 · 145-idea framework · sequence at step 3 of 4</Eyebrow>
   <div style={{background:T.panel,border:`1px solid ${T.border}`,borderRadius:6,padding:12}}><SignalField groups={groups}/></div>
   <div style={{marginTop:10,padding:"12px 16px",background:T.panel,borderLeft:`3px solid ${T.red}`,border:`1px solid ${T.red}33`,borderRadius:6,fontSize:12.5,color:T.ink,lineHeight:1.7,fontFamily:T.body}}>
    <b style={{color:T.red}}>Regime shift since v4:</b> Group D upgraded green→red — the vol quartet (#110/114/118/133) shows index calm is a dispersion artifact with ~30 pts of latent VIX convergence behind a 17 handle. Group B now <b style={{color:T.amber}}>SPLIT</b>: HY sleeps at 270bps while private credit shows 5.8% true defaults and fired gatings (Cat 10). <b>The step-4 tripwire is HY OAS RoC.</b> Against this: the contradictory ledger (#141-143) is genuinely strong and currently winning — see its page before concluding anything.
   </div>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
   {[{n:red,l:"Canaries red",s:"RED"},{n:amber,l:"Canaries amber",s:"AMBER"},{n:"145",l:"Master ideas",s:"GREEN"},
     {n:"3/4",l:"Sequence step",s:"AMBER"},{n:"Aug-Oct",l:"Adjudication window",s:"RED"}].map((x,i)=>(
    <Card key={i}><div style={{fontSize:26,fontFamily:T.sans,fontWeight:700,color:STATUS[x.s].t}}>{x.n}</div>
     <div style={{fontSize:10,color:T.ink2,fontFamily:T.mono,textTransform:"uppercase",letterSpacing:".06em",marginTop:2}}>{x.l}</div></Card>))}
  </div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
   <Card><Eyebrow>Private credit defaults — headline vs true (#135)</Eyebrow>
    <ResponsiveContainer width="100%" height={120}><LineChart data={PC_DEFAULT} margin={{top:2,right:4,bottom:0,left:-18}}>
     <XAxis dataKey="q" tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
     <YAxis tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
     <Line dataKey="head" stroke={T.green} strokeWidth={1.4} dot={false} name="headline"/>
     <Line dataKey="broad" stroke={T.red} strokeWidth={1.8} dot={false} name="true"/>
    </LineChart></ResponsiveContainer>
    <div style={{fontSize:9.5,color:T.red,fontFamily:T.mono,marginTop:4}}>Gap itself = opacity canary · green 2.1% vs red 5.8%</div></Card>
   <Card><Eyebrow>Skew: call IV − put IV (#133)</Eyebrow>
    <ResponsiveContainer width="100%" height={120}><BarChart data={SKEW} margin={{top:2,right:4,bottom:0,left:-18}}>
     <XAxis dataKey="m" tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
     <YAxis tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
     <ReferenceLine y={0} stroke={T.ink3}/>
     <Bar dataKey="v" radius={[2,2,0,0]}>{SKEW.map((e,i)=><Cell key={i} fill={e.v>0?T.red:T.blue+"99"}/>)}</Bar>
    </BarChart></ResponsiveContainer>
    <div style={{fontSize:9.5,color:T.red,fontFamily:T.mono,marginTop:4}}>Inverted — first breach of 39-yr put premium structure</div></Card>
   <Card><Eyebrow>Contradictory: revision regime (#143)</Eyebrow>
    <ResponsiveContainer width="100%" height={120}><AreaChart data={REVISIONS} margin={{top:2,right:4,bottom:0,left:-18}}>
     <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.green} stopOpacity={.3}/><stop offset="95%" stopColor={T.green} stopOpacity={0}/></linearGradient></defs>
     <XAxis dataKey="m" tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
     <YAxis domain={[14,27]} tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
     <Area dataKey="v" stroke={T.green} strokeWidth={1.6} fill="url(#rev)" dot={false}/>
    </AreaChart></ResponsiveContainer>
    <div style={{fontSize:9.5,color:T.green,fontFamily:T.mono,marginTop:4}}>2026 EPS est: 16%→25% — benign gap-closing path ACTIVE</div></Card>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
   {[["volcomplex","Vol Complex","The quartet: VXN−VIX · VIXEQ−VIX · Convergence VIX · skew",T.red],
     ["ledger","Contradictory Ledger","Bull vs bear evidence, weighted honestly — the page that keeps us honest",T.green],
     ["canary","Canary Matrix","11 categories incl. NEW Private Credit & NDFI (Cat 10)",T.amber],
     ["divergence","Divergence Engine","B transitioning · A−D gap 20mo · resolution patterns",T.purple]].map(([id,t,d,c],i)=>(
    <Card key={i} onClick={()=>go(id)} accent={c}>
     <div style={{fontSize:13,fontWeight:700,fontFamily:T.sans,color:T.ink,marginBottom:4}}>{t} →</div>
     <div style={{fontSize:10.5,color:T.ink2,fontFamily:T.body,lineHeight:1.5}}>{d}</div></Card>))}
  </div>
 </div>);}

// ── PAGE: VOL COMPLEX ────────────────────────────────────────────────────────
function VolComplex(){
 return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
  <Card accent={T.red}>
   <Eyebrow color={T.red}>The quartet — four independent lenses, all at late-cycle extremes</Eyebrow>
   <div style={{fontSize:12.5,color:T.ink,lineHeight:1.7,fontFamily:T.body,maxWidth:900}}>
    Index-level calm (VIX 17) is mechanically manufactured by a record dispersion regime, not by quiet underneath. Each lens measures a different facet: <b>#110</b> cross-index (VXN−VIX +11.8, 90th %ile since '01) · <b>#114</b> single-stock-vs-index (VIXEQ−VIX ~33, series high) · <b>#118</b> the latent convergence number · <b>#133</b> skew inversion (nobody hedged). The July 2024 template: record-low correlation in early July → −9.5% and VIX 60 by Aug 5. Only prior instance of #112's vol-premium inversion during strength: the internet bubble.
   </div>
  </Card>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
   <Card><Eyebrow>VXN−VIX & VIXEQ−VIX spreads (mock)</Eyebrow>
    <ResponsiveContainer width="100%" height={180}><LineChart data={VOLQUAD} margin={{top:4,right:6,bottom:0,left:-14}}>
     <XAxis dataKey="d" tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} interval={20} axisLine={false} tickLine={false}/>
     <YAxis tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
     <ReferenceLine y={10} stroke={T.amber} strokeDasharray="4 3"/>
     <ReferenceLine y={25} stroke={T.red} strokeDasharray="4 3"/>
     <Tooltip content={({active,payload})=>active&&payload?.length?<div style={{background:T.elevated,border:`1px solid ${T.border2}`,borderRadius:4,padding:"6px 10px",fontFamily:T.mono,fontSize:10}}>{payload.map((p,i)=><div key={i} style={{color:p.color}}>{p.name}: {p.value}</div>)}</div>:null}/>
     <Line dataKey="vxn" stroke={T.amber} strokeWidth={1.4} dot={false} name="VXN−VIX"/>
     <Line dataKey="vixeq" stroke={T.red} strokeWidth={1.4} dot={false} name="VIXEQ−VIX"/>
    </LineChart></ResponsiveContainer>
    <div style={{fontSize:9.5,color:T.ink3,fontFamily:T.mono,marginTop:4}}>Both above canary reference lines · widest ex-crisis readings on record</div></Card>
   <Card><Eyebrow>Convergence VIX calculator (#118)</Eyebrow>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
     {[["Spot VIX","17.3",T.green],["Avg single-stock IV","~48",T.red],["Current implied corr","~0.13",T.blue],["Crisis corr assumption","0.85",T.amber]].map(([l,v,c],i)=>(
      <div key={i} style={{background:T.panel2,borderRadius:5,padding:"9px 11px",border:`1px solid ${T.border}`}}>
       <div style={{fontSize:9,color:T.ink3,fontFamily:T.mono,textTransform:"uppercase",letterSpacing:".07em"}}>{l}</div>
       <div style={{fontSize:18,fontFamily:T.sans,fontWeight:700,color:c}}>{v}</div></div>))}
    </div>
    <div style={{background:T.redDim,border:`1px solid ${T.red}`,borderRadius:6,padding:"12px 14px",textAlign:"center"}}>
     <div style={{fontSize:9.5,color:T.red,fontFamily:T.mono,textTransform:"uppercase",letterSpacing:".1em",marginBottom:2}}>Convergence VIX — index vol at crisis correlation</div>
     <div style={{fontSize:32,fontFamily:T.sans,fontWeight:700,color:T.red}}>≈ 38</div>
     <div style={{fontSize:10,color:T.ink2,fontFamily:T.body,marginTop:2}}>~21 points of latent convergence behind the 17 handle. Standing number, recomputed daily; σ²ᵢₙdₑₓ = Σwᵢwⱼσᵢσⱼρ.</div>
    </div></Card>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
   {[["Why the gamma map makes it asymmetric","NDX dealers short gamma (verified, SpotGamma) amplify moves; SPX dealers long gamma dampen. Same shock arrives sharper in the concentrated index — and the crowded dispersion trade (long NDX vol / short SPX & single vol) unwinds into it.",T.red],
     ["The correlation snap mechanism","Correlation mean-reverts violently: Jul '24 lows → VIX 60 in four weeks; 2018's Volmageddon is the one negative VIXEQ−VIX print in the series. Volume co-movement (#54) leads the snap by 1-2 days.",T.amber],
     ["What flips this back to green","Skew re-normalising (puts > calls), VIXEQ−VIX back under ~20, and implied correlation lifting WITHOUT a vol spike — an orderly re-hedging. That combination would be the all-clear; a vol spike that closes the spreads is the opposite.",T.green]].map(([t,d,c],i)=>(
    <Card key={i} accent={c}><div style={{fontSize:12,fontWeight:700,fontFamily:T.sans,color:T.ink,marginBottom:6}}>{t}</div>
     <div style={{fontSize:11,color:T.ink2,lineHeight:1.6,fontFamily:T.body}}>{d}</div></Card>))}
  </div>
 </div>);}

// ── PAGE: CONTRADICTORY LEDGER ───────────────────────────────────────────────
function Ledger(){
 const rows=[
  {side:"BULL",n:"Upward revision regime (#143)",w:"Very high",d:"2026 EPS growth revised 16%→25% during the year; Q1 delivered above every cautious forecast. The #128 bear trigger is INVERTED. The benign P/E-gap-closing path (1996-98 outcome) is the one operating.",kill:"Flips when revision breadth turns negative at record gap wides."},
  {side:"BULL",n:"Buyback breadth (#141)",w:"Very high",d:"> $1T annualised and broadening: daily active programs 10→50-60, industrials joining, funded by +12.8% profits (mfg +31%). The one buyer that never panics — the demand pillar the exhaustion thesis missed.",kill:"Pauses in blackout windows; breaks on profit rollover or credit-funded-buyback stress."},
  {side:"BULL",n:"Absorption test passed (#142)",w:"High",d:"June's $140B of equity supply (largest back-to-back raises in US history) absorbed without disruption, buybacks as structural bid. Direct negative result on the fire-hose-becomes-vacuum thesis at current flow rates.",kill:"Retest at each fast-entry inclusion; fails if a mega-IPO trades heavy despite index buying."},
  {side:"BULL",n:"Recession odds low / banks robust",w:"Medium",d:"OFR: median PC fund net leverage ~1.0; Fed stress test shows banks absorb severe nonbank stress; closed-end lockups ≠ runnable deposits; PC CLOs only ~3% of assets — 2008 chains absent at scale.",kill:"NDFI loss rates rising in bank disclosures (#138) would invalidate."},
  {side:"BEAR",n:"Private credit stress observed (#135-137)",w:"Very high",d:"True defaults 5.8% (highest ever), 60% PIK-concealed, 40% borrowers negative-FCF, gatings FIRED (BCRED/CTAC/Blue Owl). Not forecast — observed. Sequence at step 3 of 4.",kill:"Would fade if defaults roll over and gates reopen at full redemption."},
  {side:"BEAR",n:"Vol quartet at extremes (#110/114/118/133)",w:"Very high",d:"Index calm is a dispersion artifact; ~21pts latent VIX convergence; nobody hedged (skew inverted, 39-yr first); NDX short gamma amplifies. 2000-only precedents on two of four lenses.",kill:"Orderly re-hedging (skew normal, spreads narrow, no spike) defuses it."},
  {side:"BEAR",n:"Leverage at ATH extremes (Cat 0)",w:"Very high",d:"Margin debt 4.1% GDP, +53.7% YoY; $538B sector-concentrated direct credit with collateral now impaired by the software drawdown (#109).",kill:"Deceleration while market cap rises — the gap closing benignly."},
  {side:"BEAR",n:"Insider vs buyback divergence (#144)",w:"Medium",d:"Insiders record sellers while their corporates record buyers; insider ratios out-predict at 12mo; corporates historically buy high. Weight the personal account.",kill:"Insider buying resuming would neutralise."}];
 return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
  <Card accent={T.green}>
   <Eyebrow color={T.green}>The honest ledger — both sides at full weight (12 Jul 2026)</Eyebrow>
   <div style={{fontSize:12.5,color:T.ink,lineHeight:1.7,fontFamily:T.body,maxWidth:920}}>
    A warning framework only earns the right to be believed when it shouts by carrying its contradictory evidence at full weight in the meantime. <b>Falsifiable statement of the moment:</b> the bear resolution requires #143 to invert and/or #141 to pause <i>while</i> private-credit stress reaches public HY. Until then the divergences persist rather than resolve. <b style={{color:T.amber}}>Q3 2026 earnings season (Aug-Oct) adjudicates most of this in one window</b> — hyperscaler FCF/capex crossing, revision breadth, buyback guidance, NDFI loss disclosure, all at once.
   </div>
  </Card>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
   <Card><Eyebrow>Buyback breadth — daily active programs (#141, mock)</Eyebrow>
    <ResponsiveContainer width="100%" height={130}><BarChart data={BUYBACK_BREADTH} margin={{top:2,right:4,bottom:0,left:-18}}>
     <XAxis dataKey="q" tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
     <YAxis tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
     <Bar dataKey="v" radius={[2,2,0,0]}>{BUYBACK_BREADTH.map((e,i)=><Cell key={i} fill={T.green+"aa"}/>)}</Bar>
    </BarChart></ResponsiveContainer>
    <div style={{fontSize:9.5,color:T.green,fontFamily:T.mono,marginTop:4}}>10 → 56 daily programs · industrials joining · the structural bid</div></Card>
   <Card><Eyebrow>Derived temporal canary — blackout windows</Eyebrow>
    <div style={{fontSize:11.5,color:T.ink,lineHeight:1.7,fontFamily:T.body}}>The stronger and broader the corporate bid (#141), the more vulnerable the market becomes during <b>earnings-blackout windows</b> when that bid legally pauses — a temporal overlay like the OpEx amplifier (#52). With 50-60 programs active, blackout weeks are now the most bid-less periods of each quarter. Next mass blackout: <b style={{color:T.amber}}>mid-July → early August 2026</b>, overlapping the adjudication window's first earnings.</div></Card>
  </div>
  {rows.map((r,i)=>(
   <Card key={i} style={{borderLeft:`3px solid ${STATUS[r.side].t}`}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
     <div style={{flex:1,minWidth:0}}>
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:5}}>
       <span style={{fontSize:12.5,fontWeight:700,fontFamily:T.sans,color:T.ink}}>{r.n}</span>
       <span style={{fontSize:9,color:T.ink3,fontFamily:T.mono}}>weight: {r.w}</span></div>
      <div style={{fontSize:11,color:T.ink2,lineHeight:1.55,fontFamily:T.body,marginBottom:5}}>{r.d}</div>
      <div style={{fontSize:10,color:T.ink3,fontFamily:T.mono}}>↯ invalidation: {r.kill}</div></div>
     <Badge s={r.side}/></div></Card>))}
 </div>);}

// ── PAGE: DIVERGENCE ─────────────────────────────────────────────────────────
function Divergence(){
 const grpColor=v=>v===2?T.red:v===1?T.amber:T.green;
 return(<div style={{display:"flex",flexDirection:"column",gap:16}}>
  <Card accent={T.amber}>
   <Eyebrow color={T.amber}>Group B is transitioning — the moment the framework was built for</Eyebrow>
   <div style={{fontSize:12.5,color:T.ink,lineHeight:1.7,fontFamily:T.body,maxWidth:900}}>
    The 2006-07 template: A red ~19 months with D green, then B flipped (TED &gt;100bps, Aug '07) and the fastest warning window opened. Today: A red ~20 months, D just upgraded to red (dispersion artifact exposed), and B's <i>private half</i> is already stressed while HY sleeps — B shown as split/amber in the strip below since early '26. <b>The step-4 tripwire: HY OAS 10-day RoC &gt;100bps.</b> Watch it weekly.
   </div>
  </Card>
  <Card>
   <Eyebrow>31-month group history (mock) — Jan '24 → Jul '26 · B and D now moving</Eyebrow>
   <div style={{overflowX:"auto"}}>
    <table style={{borderCollapse:"collapse",width:"100%"}}><tbody>
     {["A","B","C","D"].map(g=>(<tr key={g}>
      <td style={{fontFamily:T.mono,fontSize:10,color:T.ink2,padding:"3px 10px 3px 0",whiteSpace:"nowrap"}}>Group {g}</td>
      {DIV_HISTORY.map((m,i)=>(<td key={i} title={`${m.m}: ${["GREEN","AMBER","RED"][m[g]]}`} style={{padding:1}}>
       <div style={{width:"100%",minWidth:16,height:18,borderRadius:2,background:grpColor(m[g]),opacity:m[g]===0?.45:.9}}/></td>))}</tr>))}
     <tr><td style={{fontFamily:T.mono,fontSize:10,color:T.amber,padding:"6px 10px 3px 0"}}>A−D gap</td>
      {DIV_HISTORY.map((m,i)=>(<td key={i} style={{padding:1,textAlign:"center"}}>
       <div style={{fontFamily:T.mono,fontSize:9,fontWeight:m.gap===2?700:400,color:m.gap===2?T.red:m.gap===1?T.amber:T.ink4}}>{m.gap>0?m.gap:"·"}</div></td>))}</tr>
    </tbody></table></div>
   <div style={{fontSize:11,color:T.ink2,fontFamily:T.body,lineHeight:1.6,marginTop:12,borderTop:`1px solid ${T.border}`,paddingTop:10}}>
    Note the gap COLLAPSING at the right edge — not because leverage improved, but because <b style={{color:T.red}}>D caught down to A</b> (the vol quartet exposed the calm as artifact). Per #105's resolution-cause taxonomy, gaps that close via the calm side deteriorating — rather than the stressed side healing — resolved via correction in every historical episode logged. Half-life note (#104): this A-D episode is at the ~100th percentile of its own type's duration distribution.
   </div>
  </Card>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
   {[["Then: B flips while A red","Aug 2007 — TED >100bps 13 months pre-Lehman while equities made highs. HY RoC is the modern equivalent tripwire.","AMBER"],
     ["Now: D caught down to A","Vol quartet exposed the dispersion artifact; gap closing from the wrong side. Historically the correction-path signature.","RED"],
     ["The bull escape path","Revisions keep rising (#143), buybacks keep broadening (#141), private stress stays gated, spreads never move — divergences fade as fundamentals grow into them. It has happened (1996-98). It requires everything on the ledger's bull side to keep winning.","GREEN"]].map(([t,d,s],i)=>(
    <Card key={i} accent={STATUS[s].t}>
     <div style={{fontSize:12,fontWeight:700,fontFamily:T.sans,color:T.ink,marginBottom:6}}>{t}</div>
     <div style={{fontSize:11,color:T.ink2,lineHeight:1.6,fontFamily:T.body}}>{d}</div></Card>))}
  </div>
 </div>);}

// ── PAGE: CANARY MATRIX ──────────────────────────────────────────────────────
function Canary(){
 const[openCat,setOpenCat]=useState(10);
 const[drill,setDrill]=useState(null);
 const[grp,setGrp]=useState("ALL");
 const cats=grp==="ALL"?CATS:CATS.filter(c=>c.group===grp);
 const drillRow=drill!=null?CATS.find(c=>c.id===drill.catId)?.rows[drill.rowIdx]:null;
 return(<div style={{display:"flex",gap:14,height:"100%"}}>
  <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:10,overflowY:"auto"}}>
   <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
    {["ALL","A","B","C","D","X"].map(g=>(
     <button key={g} onClick={()=>setGrp(g)} style={{background:grp===g?T.elevated:T.panel,border:`1px solid ${grp===g?T.blue:T.border}`,borderRadius:4,padding:"5px 12px",cursor:"pointer",color:grp===g?T.blue:T.ink2,fontFamily:T.mono,fontSize:10.5}}>{g==="ALL"?"All":`Group ${g}`}</button>))}
   </div>
   {cats.map(cat=>(
    <div key={cat.id} style={{background:openCat===cat.id?T.panel2:T.panel,border:`1px solid ${T.border}`,borderLeft:`3px solid ${STATUS[cat.status].t}`,borderRadius:6}}>
     <div onClick={()=>setOpenCat(openCat===cat.id?-1:cat.id)} style={{padding:"11px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",gap:9,alignItems:"center",minWidth:0}}>
       <span style={{fontSize:9.5,color:T.ink3,fontFamily:T.mono}}>C{cat.id}</span>
       <span style={{fontSize:12.5,fontWeight:600,fontFamily:T.sans,color:T.ink,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{cat.name}</span>
       {cat.added&&<span style={{fontSize:8.5,background:T.purpleDim,border:`1px solid ${T.purple}`,color:T.purple,borderRadius:3,padding:"1px 5px",fontFamily:T.mono}}>NEW</span>}
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
       <span style={{fontSize:9,color:T.ink3,fontFamily:T.mono}}>{cat.speed}</span><Badge s={cat.status}/>
      </div>
     </div>
     {openCat===cat.id&&(
      <div style={{padding:"0 14px 12px"}}>
       <div style={{fontSize:11,color:T.ink2,lineHeight:1.55,fontFamily:T.body,padding:"8px 10px",background:T.panel,borderRadius:4,marginBottom:10,borderLeft:`2px solid ${T.border2}`}}>{cat.note}</div>
       <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["Indicator","Threshold","Current",""].map(h=><th key={h} style={{textAlign:"left",fontSize:8.5,textTransform:"uppercase",letterSpacing:".07em",color:T.ink3,fontFamily:T.mono,padding:"4px 8px 6px 0",borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
        <tbody>{cat.rows.map((r,ri)=>(
         <tr key={ri} onClick={()=>r.spark&&setDrill({catId:cat.id,rowIdx:ri})}
          style={{borderBottom:`1px solid ${T.border}`,cursor:r.spark?"pointer":"default",background:drill?.catId===cat.id&&drill?.rowIdx===ri?T.elevated:"none"}}>
          <td style={{padding:"6px 8px 6px 0",fontSize:11,color:T.ink,fontWeight:600,fontFamily:T.body}}>{r.n}{r.spark&&<span style={{color:T.blue,fontSize:9,marginLeft:6,fontFamily:T.mono}}>▸ drill</span>}</td>
          <td style={{padding:"6px 8px 6px 0",fontSize:10,color:T.ink3,fontFamily:T.body,lineHeight:1.4}}>{r.th}</td>
          <td style={{padding:"6px 8px 6px 0",fontSize:10.5,color:STATUS[r.s].t,fontFamily:T.mono,fontWeight:r.s!=="GREY"?700:400}}>{r.cur}</td>
          <td style={{padding:"6px 0"}}><Badge s={r.s}>{r.v?STATUS[r.s].label:"Unverified"}</Badge></td>
         </tr>))}</tbody>
       </table>
      </div>)}
    </div>))}
  </div>
  <div style={{width:300,flexShrink:0}}>
   <Card accent={drillRow?STATUS[drillRow.s].t:T.border} style={{position:"sticky",top:0}}>
    {drillRow?(<>
     <Eyebrow color={STATUS[drillRow.s].t}>Drill-down · mock series</Eyebrow>
     <div style={{fontSize:12.5,fontWeight:700,fontFamily:T.sans,color:T.ink,marginBottom:2}}>{drillRow.n}</div>
     <div style={{fontSize:10,color:T.ink3,fontFamily:T.mono,marginBottom:10}}>{drillRow.th}</div>
     <Spark cfg={drillRow.spark}/>
     <div style={{marginTop:12,padding:"8px 10px",background:T.panel2,borderRadius:4,fontSize:10.5,color:T.ink2,lineHeight:1.55,fontFamily:T.body}}>
      Current: <b style={{color:STATUS[drillRow.s].t}}>{drillRow.cur}</b>. Rate-of-change primary — slope and change-of-slope over level. Production wiring: FRED/FINRA/Fitch/CBOE per the master doc.</div>
    </>):(<>
     <Eyebrow>Drill-down panel</Eyebrow>
     <div style={{fontSize:11.5,color:T.ink2,fontFamily:T.body,lineHeight:1.65}}>Click any <span style={{color:T.blue,fontFamily:T.mono,fontSize:10}}>▸ drill</span> row for a 90-day mock series with its threshold overlaid.<br/><br/>Cat 10 (Private Credit & NDFI) is new — open it first; it is where the sequence currently lives.</div>
    </>)}
   </Card>
  </div>
 </div>);}

// ── PAGE: CORRELATIONS (extended) ────────────────────────────────────────────
function Correlations(){
 const CORR=[
  {n:"Semiconductor Book-to-Bill",dom:"Tech Mfg",lead:"2-3 qtrs",cost:"Free (SEMI)",s:"RED",m:"Orders/billings falling toward 1.0 led semi earnings misses by 2-3 quarters."},
  {n:"Guidance Language NLP (RoC)",dom:"Earnings Quality",lead:"2-3 qtrs",cost:"Free",s:"RED",m:"Hedging phrases accelerating while results still good — now DIVERGING from upward revisions (#143): known resolution direction."},
  {n:"VC Down-Round Frequency",dom:"Private Mkts",lead:"6-18 mo",cost:"PitchBook",s:"RED",m:"Loaded further by tranched-round opacity masking true marks."},
  {n:"AQR Factor Health (QMJ/BAB/TSMOM)",dom:"Factor Regime",lead:"1-3 mo",cost:"Free (AQR)",s:"AMBER",m:"3+ factors in bottom decile = crowded unwind in progress. QMJ compressing = late-cycle."},
  {n:"Baltic Dry Index",dom:"Trade",lead:"3-6 mo",cost:"Free",s:"AMBER",m:"Falling hard while equities at highs led earnings deterioration incl. 2008."},
  {n:"Insurer IG spread underperformance (#139)",dom:"Transmission",lead:"1-2 qtrs",cost:"Free",s:"AMBER",m:"Advance market estimate of private credit marks via the holder, not the asset."},
  {n:"Prime-Cohort Card Delinquency",dom:"Consumer",lead:"2-4 qtrs",cost:"Free",s:"GREY",m:"Prime missing payments = stress climbing the quality ladder."},
  {n:"Google Trends Distress Queries",dom:"Behavioral",lead:"4-8 wks",cost:"Free",s:"GREY",m:"Refinance/forbearance/layoff volumes lead credit data by 1-2 cycles."},
  {n:"CEO/CFO Resignation RoC",dom:"Insider",lead:"1-3 qtrs",cost:"Free (EDGAR)",s:"GREY",m:"Executives exit with the most information."},
  {n:"Buyback blackout calendar (derived, #141)",dom:"Temporal",lead:"Scheduled",cost:"Free",s:"AMBER",m:"With 50-60 daily programs, blackout weeks are the quarter's most bid-less periods. Next: mid-Jul→early Aug '26."},
  {n:"Fast-entry absorption test (#119/#142)",dom:"Flow Experiment",lead:"Per event",cost:"Free",s:"GREEN",m:"First result PASSED ($140B absorbed). Reruns at every fast-entry inclusion incl. any Anthropic/OpenAI IPO."},
  {n:"Industrial Power Consumption",dom:"Real Economy",lead:"1-2 mo",cost:"Free (EIA)",s:"GREY",m:"Hard to fake; divergence from GDP flags revisions."}];
 const[sel,setSel]=useState(null);
 return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
  <Card><Eyebrow>Layer 6 — extended correlation network (updated)</Eyebrow>
   <div style={{fontSize:12,color:T.ink,lineHeight:1.65,fontFamily:T.body,maxWidth:880}}>
    Scored on causal distance × lead time × frequency × uniqueness. New since v4: insurer transmission (#139), buyback blackout calendar, and the absorption test with its first (passed) result — a green row kept deliberately visible.</div></Card>
  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
   {CORR.map((c,i)=>(
    <div key={i} onClick={()=>setSel(sel===i?null:i)} style={{background:sel===i?T.elevated:T.panel,border:`1px solid ${sel===i?T.border2:T.border}`,borderLeft:`3px solid ${STATUS[c.s].t}`,borderRadius:6,padding:"10px 12px",cursor:"pointer"}}>
     <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:3}}>
      <span style={{fontSize:11.5,fontWeight:600,fontFamily:T.sans,color:T.ink,lineHeight:1.35}}>{c.n}</span><Badge s={c.s}/></div>
     <div style={{fontSize:9.5,color:T.ink3,fontFamily:T.mono,marginBottom:sel===i?6:0}}>{c.dom} · lead {c.lead} · {c.cost}</div>
     {sel===i&&<div style={{paddingTop:6,borderTop:`1px solid ${T.border}`,fontSize:10.5,color:T.ink2,lineHeight:1.55,fontFamily:T.body}}>{c.m}</div>}
    </div>))}
  </div>
 </div>);}

// ── PAGE: CALENDAR ───────────────────────────────────────────────────────────
function Calendar(){
 const items=[
  {d:"Mid-Jul → early Aug '26",e:"Mass buyback blackout window",why:"The structural bid (#141) legally pauses while the vol quartet sits at extremes. Most bid-less weeks of the quarter.",s:"AMBER"},
  {d:"Aug–Oct 2026",e:"Q3 earnings — THE adjudication window",why:"Hyperscaler FCF/capex crossing (BIS) · revision breadth (#143) test · buyback guidance · first NDFI loss disclosures (#138) · AI GAAP-vs-run-rate language. Most of the ledger resolves here.",s:"RED"},
  {d:"Sep 19 2026",e:"Quarterly OpEx (triple witching)",why:"~10× monthly gamma into an unhedged (skew-inverted) market with NDX short gamma. Post-expiry 5-10 days = one canary level higher (#52).",s:"RED"},
  {d:"Weekly",e:"HY OAS 10-day RoC — the step-4 tripwire",why:"Sequence at 3 of 4. >100bps/10d widening = the Aug-'07 moment. FRED, daily, free.",s:"AMBER"},
  {d:"Per fast-entry inclusion",e:"Absorption test rerun (#119)",why:"Each mega-inclusion is a natural experiment; first result passed (#142). Watch for expected Anthropic/OpenAI IPOs per SpotGamma (unconfirmed).",s:"GREEN"},
  {d:"Mid/late 2027",e:"M2→inflation convergence window",why:"12-18mo clock from the 5-yr-record M2 print; converges with term-premium pressure (#28) and the Cat-9 canaries.",s:"AMBER"}];
 return(<div style={{display:"flex",flexDirection:"column",gap:12}}>
  <Card accent={T.amber}><Eyebrow color={T.amber}>Dated catalysts and standing cadences</Eyebrow>
   <div style={{fontSize:12,color:T.ink,lineHeight:1.65,fontFamily:T.body}}>Everything below expires or fires on a schedule. The framework's rare property right now: it is unusually <i>testable</i> — the next 90 days adjudicate most of the ledger.</div></Card>
  {items.map((x,i)=>(
   <Card key={i} style={{borderLeft:`3px solid ${STATUS[x.s].t}`}}>
    <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
     <div style={{minWidth:150,fontSize:11,fontFamily:T.mono,fontWeight:700,color:STATUS[x.s].t}}>{x.d}</div>
     <div style={{flex:1}}>
      <div style={{fontSize:12.5,fontWeight:600,fontFamily:T.sans,color:T.ink,marginBottom:3}}>{x.e}</div>
      <div style={{fontSize:11,color:T.ink2,lineHeight:1.55,fontFamily:T.body}}>{x.why}</div></div>
     <Badge s={x.s}/></div></Card>))}
 </div>);}

// ── NAV / ROOT ───────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// v4-PORTED PAGES (Bubble · Macro · Structure · Conviction · Cases · Research)
// ═══════════════════════════════════════════════════════════════════════════
const BUBBLES=[
 {name:"Gold '79-80",peak:500,trough:120,dd:76},{name:"Japan '89",peak:450,trough:110,dd:76},
 {name:"Asia '97",peak:320,trough:90,dd:72},{name:"Tech '00",peak:650,trough:130,dd:80},
 {name:"Housing '07",peak:640,trough:180,dd:72},{name:"China '07",peak:380,trough:120,dd:68},
 {name:"Biotech '15",peak:540,trough:200,dd:63},{name:"Disruptors '26 ◄ NOW",peak:975,trough:null,dd:null,now:true}];
const BUBBLE_TRAJ=(()=>{const mk=(peak,seed)=>Array.from({length:37},(_,i)=>{const t=i/36;
 return +(100+(peak-100)*Math.pow(t,2.1)*(1+Math.sin(seed+i)*.05)).toFixed(0);});
 const tech=mk(650,1),housing=mk(640,2),disr=mk(975,3),bio=mk(540,4);
 return Array.from({length:37},(_,i)=>({m:i-36,Tech00:tech[i],Housing07:housing[i],Biotech15:bio[i],Disruptors26:disr[i]}));})();
const MACRO=[
 {g:"Neutral Rate & Productivity (#28-29, #32)",rows:[
  {l:"Estimated r* (HLW)",v:"~1.5–2.0%",s:"AMBER"},{l:"Real Fed Funds",v:"~1.5%",s:"AMBER"},
  {l:"Policy vs r* gap",v:"Near neutral",s:"AMBER"},{l:"AI-sector productivity",v:">5% YoY",s:"GREEN"},
  {l:"Economy-wide productivity",v:"~2.5%",s:"GREEN"}],
  note:"If r* rose with productivity, a 5% 10Y is near-neutral, not tight — and CPI canaries over-flag. Ground truth: unit labor costs (#29). Wages lagging productivity = pressure lower than headline."},
 {g:"Fiscal & Term Premium (#28, #116)",rows:[
  {l:"US deficit / GDP",v:"6–7%",s:"RED"},{l:"10Y term premium (ACM)",v:"Rising",s:"AMBER"},
  {l:"Yield-move source",v:"Partly fiscal",s:"AMBER"},{l:"Steepener composition (#121)",v:"BEAR",s:"RED"}],
  note:"Yields rising from term premium ≠ from r*. The former tightens conditions without a stronger economy. Decompose every Cat-5 move before acting: r*-side benign, TP-side canary. Secular context (#116): if 2020 was the generational low, >5% becomes normal."},
 {g:"AI Earnings Quality (#30, #47-48)",rows:[
  {l:"Hyperscaler FCF vs capex (Q3'26)",v:"Crossing",s:"RED"},{l:"OAI/Anthropic % of RPOs",v:"~50% ($748B)",s:"RED"},
  {l:"GAAP AI segment disclosure",v:"Zero",s:"RED"},{l:"SDLLMTK",v:"$1.66 · -20%",s:"AMBER"}],
  note:">70% of return from P/E expansion = asymmetric compression risk (#30). Run-rate-only disclosure is itself a degradation canary (#47). Q3'26 earnings = first hard data point (#43)."}];
const SDLLMTK=[
 {m:"J'25",v:1.05},{m:"F",v:1.75},{m:"M",v:1.30},{m:"A",v:1.42},{m:"M",v:1.55},{m:"J",v:1.60},
 {m:"J",v:1.65},{m:"A",v:1.70},{m:"S",v:1.75},{m:"O",v:1.72},{m:"N",v:1.78},{m:"D",v:1.85},
 {m:"J'26",v:1.90},{m:"F",v:1.82},{m:"M",v:1.88},{m:"A",v:1.95},{m:"M",v:2.00},{m:"J",v:1.66}];
const BIG_PREMIUM=[
 {y:"'15",v:2.9},{y:"'16",v:-1.3},{y:"'17",v:1.7},{y:"'18",v:3.3},{y:"'19",v:.5},{y:"'20",v:2.9},
 {y:"'21",v:3.8},{y:"'22",v:-5.6},{y:"'23",v:10.2},{y:"'24",v:10.1},{y:"'25",v:4.8},{y:"Q1'26",v:-4.5}];

function Bubble(){
 return(<div style={{display:"flex",flexDirection:"column",gap:16}}>
  <Card accent={T.purple}>
   <Eyebrow color={T.purple}>Layer 2 — magnitude, not timing (#62-65)</Eyebrow>
   <div style={{fontSize:12.5,color:T.ink,lineHeight:1.7,fontFamily:T.body,maxWidth:880}}>
    BofA/Bloomberg standardised bubble index, 1977–2026, base 100. Every prior bubble peaked 320–650 and reverted 63–80%. The Disruptors composite sits at <b style={{color:T.red}}>~975</b> — 50% above the highest prior peak. Reaching the average historical trough (~150) implies <b style={{color:T.red}}>~85% reversion</b> (#63). This layer sets the <i>weight</i> on every canary below it: red at the 99th percentile ≠ red at the 50th. Greenwood-Shleifer-You (#64): cap doubling in 2yrs ⇒ ~40% crash probability within 2yrs, rising with speed.
   </div>
  </Card>
  <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:14}}>
   <Card><Eyebrow>Peak levels — all major bubbles since 1977 (#62)</Eyebrow>
    <ResponsiveContainer width="100%" height={280}>
     <BarChart data={BUBBLES} layout="vertical" margin={{left:118,right:40,top:2,bottom:2}}>
      <XAxis type="number" domain={[0,1050]} tick={{fill:T.ink3,fontSize:9,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
      <YAxis type="category" dataKey="name" width={118} tick={{fill:T.ink2,fontSize:9.5,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
      <Tooltip cursor={false} content={({active,payload})=>active&&payload?.[0]?(()=>{const d=payload[0].payload;return(
       <div style={{background:T.elevated,border:`1px solid ${T.border2}`,borderRadius:5,padding:"9px 12px",fontFamily:T.mono,fontSize:10.5}}>
        <div style={{color:d.now?T.red:T.ink,fontWeight:700}}>{d.name}</div>
        <div style={{color:T.ink2,marginTop:3}}>Peak {d.peak}{d.dd?` · Trough ${d.trough} · -${d.dd}%`:" · unresolved"}</div>
       </div>);})():null}/>
      <Bar dataKey="peak" radius={[0,3,3,0]}>{BUBBLES.map((e,i)=><Cell key={i} fill={e.now?T.red:e.peak>600?T.amber:T.blue+"99"}/>)}</Bar>
     </BarChart></ResponsiveContainer></Card>
   <Card><Eyebrow>Ascent trajectories — 36 months into peak (#64)</Eyebrow>
    <ResponsiveContainer width="100%" height={280}>
     <LineChart data={BUBBLE_TRAJ} margin={{top:4,right:8,bottom:0,left:-14}}>
      <XAxis dataKey="m" tick={{fill:T.ink3,fontSize:8.5,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
      <YAxis tick={{fill:T.ink3,fontSize:8.5,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
      <Tooltip content={({active,payload,label})=>active&&payload?.length?(
       <div style={{background:T.elevated,border:`1px solid ${T.border2}`,borderRadius:5,padding:"8px 11px",fontFamily:T.mono,fontSize:10}}>
        <div style={{color:T.ink3,marginBottom:3}}>m{label}</div>
        {payload.map((p,i)=><div key={i} style={{color:p.color}}>{p.name}: {p.value}</div>)}
       </div>):null}/>
      <Line dataKey="Tech00" stroke={T.blue} strokeWidth={1.2} dot={false}/>
      <Line dataKey="Housing07" stroke={T.green} strokeWidth={1.2} dot={false}/>
      <Line dataKey="Biotech15" stroke={T.cyan} strokeWidth={1.2} dot={false}/>
      <Line dataKey="Disruptors26" stroke={T.red} strokeWidth={2} dot={false}/>
     </LineChart></ResponsiveContainer></Card>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
   {[["Reversion distance (#63)","Prior bubbles reverted 63-80%. At ~975, reaching any prior trough requires a larger fall than any prior bubble experienced from its own peak. The outcome distribution is not symmetric.",T.red],
     ["Velocity of ascent (#64)","Cap doubling in 2yrs → 40% crash probability within 2yrs, rising with speed. Disruptors survived the '22 halving then tripled — each recovery lengthens the ultimate reversion.",T.amber],
     ["How this layer is used (#63)","It calibrates urgency, not timing. Canary weights scale with bubble percentile: the same Group-B flip is worth 2-3× the de-risking response at the 99th percentile vs the 50th.",T.purple]].map(([t,d,c],i)=>(
    <Card key={i} accent={c}><div style={{fontSize:12,fontWeight:700,fontFamily:T.sans,color:T.ink,marginBottom:6}}>{t}</div>
     <div style={{fontSize:11,color:T.ink2,lineHeight:1.6,fontFamily:T.body}}>{d}</div></Card>))}
  </div></div>);}

function Macro(){
 return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
   {MACRO.map((col,i)=>(
    <Card key={i} accent={T.blue}><Eyebrow color={T.blue}>{col.g}</Eyebrow>
     {col.rows.map((r,ri)=>(
      <div key={ri} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.border}`,gap:8}}>
       <span style={{fontSize:10.5,color:T.ink2,fontFamily:T.body}}>{r.l}</span>
       <span style={{fontSize:10.5,color:STATUS[r.s].t,fontFamily:T.mono,fontWeight:700,flexShrink:0}}>{r.v}</span></div>))}
     <div style={{fontSize:10.5,color:T.ink3,lineHeight:1.55,fontFamily:T.body,marginTop:8,paddingTop:8,borderTop:`1px solid ${T.border}`}}>{col.note}</div>
    </Card>))}
  </div>
  <Card><Eyebrow>Macro layer vs regime layer — the same number, two meanings (#17)</Eyebrow>
   <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
    <div><div style={{fontSize:12,fontWeight:700,color:T.blue,fontFamily:T.sans,marginBottom:6}}>Macro — descriptive</div>
     <div style={{fontSize:11.5,color:T.ink2,lineHeight:1.7,fontFamily:T.body}}>"The 10Y is 4.5%." With r* at 0.5% that's very tight; with r* at 2.0% it's roughly neutral. This layer decides which interpretation applies — it changes the <i>weight</i>, never fires a canary itself.</div></div>
    <div><div style={{fontSize:12,fontWeight:700,color:T.red,fontFamily:T.sans,marginBottom:6}}>Regime — actionable</div>
     <div style={{fontSize:11.5,color:T.ink2,lineHeight:1.7,fontFamily:T.body}}>"The 10Y rose +280bps in 9 months, each 30-day window larger than the last." The 2022 acceleration streak fired <b>January 2022 — before the Jan 4 equity peak</b>. Same instrument; completely different information.</div></div>
   </div></Card>
  <Card><Eyebrow>Productivity scenarios — where the framework itself can break (#31-32)</Eyebrow>
   <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
    {[["A — Inflationary","Gains stay narrow; wages broaden; ULC rises; CPI accelerates. Standard canaries fire correctly.","Framework applies as calibrated"],
      ["B — Disinflationary","Productivity broadens; wages lag; real output outruns prices; r* rises. CPI canaries over-flag.","Raise CPI thresholds; treat 5% 10Y as neutral"],
      ["C — Deflationary shock (#31)","1870-1900 analogue: falling price level, strong real growth, savage asset deflation in disrupted sectors.","Category 9 uncalibrated — flagged as open risk"]].map(([t,d,s],i)=>(
     <div key={i} style={{background:T.panel2,borderRadius:6,padding:"11px 13px",border:`1px solid ${T.border}`}}>
      <div style={{fontSize:11.5,fontWeight:700,color:T.ink,fontFamily:T.sans,marginBottom:5}}>{t}</div>
      <div style={{fontSize:10.5,color:T.ink2,lineHeight:1.55,fontFamily:T.body,marginBottom:7}}>{d}</div>
      <div style={{fontSize:9.5,color:T.amber,fontFamily:T.mono}}>{s}</div></div>))}
   </div></Card></div>);}

function Structure(){
 const[tab,setTab]=useState("passive");
 const tabs=[["passive","Passive Flows"],["ai","AI Supply Chain"],["opex","OpEx Mechanics"],["capital","Capital Discipline"]];
 return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
  <div style={{display:"flex",gap:4,borderBottom:`1px solid ${T.border}`}}>
   {tabs.map(([id,l])=>(
    <button key={id} onClick={()=>setTab(id)} style={{background:"none",border:"none",borderBottom:`2px solid ${tab===id?T.green:"transparent"}`,padding:"8px 14px",cursor:"pointer",color:tab===id?T.ink:T.ink2,fontFamily:T.sans,fontSize:12,fontWeight:tab===id?600:400,marginBottom:-1}}>{l}</button>))}
  </div>
  {tab==="passive"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
   <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
    <Card accent={T.green}><Eyebrow color={T.green}>BIG cap-weight premium (#33)</Eyebrow>
     <ResponsiveContainer width="100%" height={140}><BarChart data={BIG_PREMIUM} margin={{top:2,right:4,bottom:0,left:-16}}>
      <XAxis dataKey="y" tick={{fill:T.ink3,fontSize:8.5,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
      <YAxis tick={{fill:T.ink3,fontSize:8.5,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
      <ReferenceLine y={0} stroke={T.ink4}/>
      <Bar dataKey="v" radius={[2,2,0,0]}>{BIG_PREMIUM.map((e,i)=><Cell key={i} fill={e.v<0?T.red:T.blue+"99"}/>)}</Bar>
     </BarChart></ResponsiveContainer>
     <div style={{fontSize:10.5,color:T.ink2,fontFamily:T.body,lineHeight:1.55,marginTop:6}}>Trend slope +0.33%/yr² (t=+2.79) — accelerating. Q1'26 partial -4.5% is the first significant negative since 2022. <b style={{color:T.amber}}>Canary: two consecutive negative years.</b> Counterweight: the buyback bid (#141) and passed absorption test (#142) — see Ledger.</div></Card>
    <Card accent={T.green}><Eyebrow color={T.green}>Inelastic markets — Gabaix-Koijen (#34-35)</Eyebrow>
     <div style={{fontSize:12,color:T.ink,lineHeight:1.7,fontFamily:T.body}}><b>$1 of flow ≈ $5 of market value.</b> Passive buying is price-insensitive and cap-weight-proportional, so the largest names receive the largest mechanical bid — which raises their weight, which raises the next dollar's allocation (#34). It runs identically in reverse: redemption selling is cap-weight-proportional, into whatever liquidity exists.</div>
     <div style={{marginTop:8,fontSize:9.5,color:T.ink3,fontFamily:T.mono}}>NBER w28967 · free</div></Card>
   </div>
   {[["Net 401K flow direction (#36)","Boomer decumulation underway; labor force -700K Jun '26. The 40-year accumulation tailwind is ending at the margin. ICI quarterly, free.","AMBER"],
     ["IPO float supply vs passive absorption (#37/#119)","SpaceX $86B IPO + $25B bond = mandatory index buying. Canary: quarterly float supply > marginal passive inflows. First live test PASSED (#142) — logged honestly.","AMBER"],
     ["Unwind channel map (#40)","(A) IPO supply overwhelm · (B) redemption proportional selling · (C) simultaneous misses in the concentrated few · (D) demographic bleed. Japan 1989-90 is the closest analogue.","AMBER"]].map(([t,d,s],i)=>(
    <Card key={i} style={{borderLeft:`3px solid ${STATUS[s].t}`}}>
     <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
      <div><div style={{fontSize:12,fontWeight:600,fontFamily:T.sans,color:T.ink,marginBottom:4}}>{t}</div>
       <div style={{fontSize:11,color:T.ink2,lineHeight:1.55,fontFamily:T.body}}>{d}</div></div>
      <Badge s={s}/></div></Card>))}
  </div>}
  {tab==="ai"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
   <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
    <Card accent={T.red}><Eyebrow color={T.red}>The circular revenue identity (#42)</Eyebrow>
     <div style={{fontSize:11.5,color:T.ink,lineHeight:1.7,fontFamily:T.body}}>
      Hyperscalers fund OpenAI/Anthropic → labs spend it on hyperscaler compute → hyperscalers book AI revenue. <b>Same dollar, counted twice, travelling in a circle.</b> Labs ≈ 68-75% of reported ecosystem "AI revenue" and ~50% of hyperscaler RPOs (~$748B). Analogue: telecom vendor finance 1999-2000 — both sides collapse together.</div>
     <div style={{marginTop:8,padding:"7px 10px",background:T.redDim,borderRadius:4,fontSize:10,color:T.red,fontFamily:T.mono}}>Q3'26 earnings (Aug-Oct) = FCF/capex crossing, first hard data point (#43)</div></Card>
    <Card accent={T.red}><Eyebrow color={T.red}>SDLLMTK — the demand truth serum (#48)</Eyebrow>
     <ResponsiveContainer width="100%" height={120}><AreaChart data={SDLLMTK.slice(-12)} margin={{top:2,right:4,bottom:0,left:-16}}>
      <defs><linearGradient id="sd2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.red} stopOpacity={.3}/><stop offset="95%" stopColor={T.red} stopOpacity={0}/></linearGradient></defs>
      <XAxis dataKey="m" tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
      <YAxis domain={[1.4,2.15]} tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
      <Area type="monotone" dataKey="v" stroke={T.red} strokeWidth={1.4} fill="url(#sd2)" dot={false}/>
     </AreaChart></ResponsiveContainer>
     <div style={{fontSize:10,color:T.ink2,fontFamily:T.body,lineHeight:1.5,marginTop:4}}>$1.66/M tokens, -20% off May high — amber/red boundary. Jevons (price↓ volume↑ = bullish infra) vs plateau (price↓ volume flat = capex justification breaks); the frontier/open-weight split distinguishes them. Compute futures (#49) will sharpen this once liquid.</div></Card>
   </div>
   {[["Oracle — existential single-counterparty bet (#45)","$129.5B debt · -$23.7B FCF · $260B unsigned leases · $340B Stargate build for one customer. If OpenAI can't pay, the leverage has no second buyer.","RED"],
     ["CoreWeave — 65% single-customer revenue (#45)","65% of revenue from Microsoft-for-OpenAI. Concentration plus debt = structurally more fragile than any diversified peer at the same leverage.","RED"],
     ["SoftBank — collateral refused (#46)","Banks declined a $6B margin loan against a >$100B paper OpenAI stake. Rule: unfinanceable at any meaningful LTV ⇒ the stated valuation is not the true valuation.","RED"],
     ["Disclosure degradation (#47) · RPO watch (#44)","Zero GAAP AI segment disclosure across Mag-7; run-rate language only. Count run-rate vs GAAP language per season; any RPO renegotiation converts backlog into headline risk.","RED"],
     ["Infra narrative contagion with the lag (#50)","Telecom-1999 structure: power/pipeline infra peaks 6-18mo AFTER tech — early 'safe haven' rotations there can be the second-order drawdown. CEG -30% is a live test of the lag.","AMBER"]].map(([t,d,s],i)=>(
    <Card key={i} style={{borderLeft:`3px solid ${STATUS[s].t}`}}>
     <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
      <div><div style={{fontSize:12,fontWeight:600,fontFamily:T.sans,color:T.ink,marginBottom:4}}>{t}</div>
       <div style={{fontSize:11,color:T.ink2,lineHeight:1.55,fontFamily:T.body}}>{d}</div></div>
      <Badge s={s}/></div></Card>))}
  </div>}
  {tab==="opex"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
   <Card accent={T.green}><Eyebrow color={T.green}>The OpEx cycle (#51-52)</Eyebrow>
    {[["Into expiry — pinning","Dealer delta-hedging pulls price toward max-pain strikes; volume collapses in the last 2-3 days, confirming the move is mechanical."],
      ["Expiry — release","Hedging pressure vanishes. Day-1 move on moderate volume = mechanical. Day-2/3 volume acceleration = real participants joined."],
      ["Post-OpEx window (5-10d)","Highest-risk window when GEX was negative going in — the release re-exposes the mis-hedge rather than relieving it."],
      ["Quarterly (triple witching)","Mar/Jun/Sep/Dec 3rd Fridays; ~10× monthly gamma. Sep 19 2026 is the flagged window (#52) given NDX short gamma."]].map(([t,d],i)=>(
     <div key={i} style={{padding:"8px 10px",background:T.panel2,borderRadius:4,borderLeft:`2px solid ${T.green}44`,marginBottom:7}}>
      <div style={{fontSize:11,fontWeight:700,fontFamily:T.sans,color:T.ink,marginBottom:2}}>{t}</div>
      <div style={{fontSize:10.5,color:T.ink2,lineHeight:1.5,fontFamily:T.body}}>{d}</div></div>))}
   </Card>
   <div style={{display:"flex",flexDirection:"column",gap:12}}>
    <Card accent={T.green}><Eyebrow color={T.green}>Volume pattern taxonomy (#54)</Eyebrow>
     {[["Volume collapse into expiry","Pinning confirmation",T.ink2],
       ["Options-to-stock volume spike","Derivatives-driven price action",T.ink2],
       ["Day-2/3 volume acceleration","Conviction joining (2022 legs)",T.ink2],
       ["Dark-pool share rising into OpEx (Mag-7)","Institutional distribution using the mechanical bid as cover — FINRA ATS, free, lagged",T.amber]].map(([l,d,c],i)=>(
      <div key={i} style={{display:"flex",gap:10,padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
       <span style={{fontSize:10.5,color:T.ink,fontFamily:T.body,fontWeight:600,minWidth:170}}>{l}</span>
       <span style={{fontSize:10.5,color:c,lineHeight:1.5,fontFamily:T.body}}>{d}</span></div>))}
    </Card>
    <Card><Eyebrow>Temporal amplifier rule (#52) + blackout overlay (#141)</Eyebrow>
     <div style={{fontSize:11,color:T.ink2,lineHeight:1.6,fontFamily:T.body}}>Negative dealer gamma + flat/inverted term structure into quarterly OpEx ⇒ treat the following 5-10 days one canary level higher. NEW overlay: buyback blackout windows (mid-Jul→early-Aug now) remove the one buyer that never panics — stack both clocks on the Calendar page.</div></Card>
   </div>
  </div>}
  {tab==="capital"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
   {[["Multi-instrument rapid raising (#27)","SpaceX: $86B IPO then $25B bond inside 90 days — 'bubble territory' (Allianz CIO). Marquee-name equity+debt in one window marks peak funding indiscriminateness.","RED"],
     ["Collateral refusal — revealed preference (#46)","When major lenders won't finance a stated private valuation at any meaningful LTV, the stated valuation is not the true valuation. SoftBank/OpenAI is the live instance.","RED"],
     ["Tranched-round opacity (#25)","$11M at $55M pre, then $1.1B at $4B pre, one month apart — only the second tranche makes headlines. Track >10× intra-round step-ups.","AMBER"],
     ["Index-methodology loosening (#113)","Fast-entry 15-day seasoning + float multipliers: the benchmark itself relaxing standards to chase the theme — same family as #25/#47. SPCX in; expected mega-IPOs would rerun it.","AMBER"],
     ["Retailization of private credit (#140)","Fidelity/Vanguard placing PC inside 401(k)s with DOL support — illiquid, stale-marked assets distributed to retail late-cycle.","AMBER"]].map(([t,d,s],i)=>(
    <Card key={i} style={{borderLeft:`3px solid ${STATUS[s].t}`}}>
     <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
      <div><div style={{fontSize:12,fontWeight:600,fontFamily:T.sans,color:T.ink,marginBottom:4}}>{t} <span style={{fontSize:8.5,background:T.blueDim,border:`1px solid ${T.blue}`,color:T.blue,borderRadius:3,padding:"1px 5px",fontFamily:T.mono,marginLeft:6}}>QUALITATIVE</span></div>
       <div style={{fontSize:11,color:T.ink2,lineHeight:1.55,fontFamily:T.body}}>{d}</div></div>
      <Badge s={s}/></div></Card>))}
  </div>}
 </div>);}

const LENS_TICKERS={
 NVDA:{color:"#76b900",sector:"Semis",seed:7,catalysts:[
  {day:8,type:"EPS",dir:1,label:"Q4 beat +18%"},{day:22,type:"OpEx",dir:0,label:"Mar quarterly OpEx"},
  {day:47,type:"Macro",dir:-1,label:"DeepSeek efficiency shock"},{day:84,type:"OpEx",dir:0,label:"Jun quarterly OpEx"},
  {day:97,type:"EPS",dir:1,label:"Q1 beat — Blackwell"},{day:108,type:"Macro",dir:-1,label:"SK Hynix selloff"}]},
 ORCL:{color:"#f0483e",sector:"AI Infra",seed:13,catalysts:[
  {day:11,type:"Debt",dir:-1,label:"$10B bond — AI capex"},{day:35,type:"EPS",dir:-1,label:"FCF -$23.7B"},
  {day:49,type:"Macro",dir:-1,label:"SDLLMTK -20%"},{day:84,type:"OpEx",dir:0,label:"Jun OpEx"},
  {day:99,type:"Guide",dir:-1,label:"Stargate delay"}]},
 KKR:{color:"#31a8e0",sector:"Alt Assets",seed:19,catalysts:[
  {day:6,type:"Macro",dir:1,label:"HY tightens to 270"},{day:33,type:"EPS",dir:1,label:"AUM record $650B"},
  {day:52,type:"Macro",dir:-1,label:"NDFI tightening"},{day:102,type:"Macro",dir:-1,label:"July seasonal miss"}]}};
const CAT_COLORS={EPS:T.green,OpEx:T.blue,Macro:T.amber,Guide:T.purple,Debt:T.red};
function lensData(seed){
 const days=120;const out=[];let price=100+(seed%10)*30;const baseVol=3e6+(seed%7)*1e6;
 for(let i=0;i<days;i++){
  const r=Math.sin(seed*997+i*.6)*.5+Math.sin(seed*53+i*.19)*.5;
  price*=1+r*.022;
  const volume=baseVol*(.6+Math.abs(Math.sin(seed*31+i*.7))*1.6);
  out.push({i,price:+price.toFixed(2),volume:Math.round(volume)});}
 return out.map((d,i)=>{
  const w=out.slice(Math.max(0,i-19),i+1);
  const avgVol=w.reduce((s,x)=>s+x.volume,0)/w.length;
  const volRatio=d.volume/avgVol;
  const p5=out[Math.max(0,i-5)].price;
  const mom5=((d.price-p5)/p5)*100;
  const vci=+(mom5*Math.log(volRatio+1)).toFixed(2);
  const dt=new Date(2026,2,1);dt.setDate(dt.getDate()+i);
  return{...d,d:dt.toISOString().slice(5,10),volRatio:+volRatio.toFixed(2),mom5:+mom5.toFixed(2),vci};});}

function Conviction(){
 const[tk,setTk]=useState("NVDA");
 const[hover,setHover]=useState(null);
 const cfg=LENS_TICKERS[tk];
 const data=useMemo(()=>lensData(cfg.seed),[cfg.seed]);
 const hoverD=hover!=null?data[hover]:null;
 const hoverCat=hover!=null?cfg.catalysts.find(c=>c.day===hover):null;
 return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
   {Object.entries(LENS_TICKERS).map(([k,v])=>(
    <button key={k} onClick={()=>{setTk(k);setHover(null);}} style={{background:tk===k?v.color+"1e":T.panel,border:`1px solid ${tk===k?v.color:T.border}`,borderRadius:4,padding:"6px 14px",cursor:"pointer",color:tk===k?v.color:T.ink2,fontFamily:T.mono,fontSize:11.5,fontWeight:tk===k?700:400}}>{k} <span style={{opacity:.6,fontSize:9.5}}>· {v.sector}</span></button>))}
   <div style={{marginLeft:"auto",display:"flex",gap:10,fontSize:9.5,fontFamily:T.mono,color:T.ink3,flexWrap:"wrap"}}>
    {Object.entries(CAT_COLORS).map(([k,c])=><span key={k} style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:2,background:c+"55",border:`1px solid ${c}`}}/>{k}</span>)}
   </div></div>
  <Card style={{padding:10}}>
   <ResponsiveContainer width="100%" height={170}>
    <ComposedChart data={data} margin={{top:18,right:6,bottom:0,left:-12}}
     onMouseMove={s=>s?.activeTooltipIndex!=null&&setHover(s.activeTooltipIndex)} onMouseLeave={()=>setHover(null)}>
     <XAxis dataKey="d" tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} interval={14} axisLine={false} tickLine={false}/>
     <YAxis domain={["auto","auto"]} tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
     {cfg.catalysts.map(c=><ReferenceLine key={c.day} x={data[c.day]?.d} stroke={CAT_COLORS[c.type]} strokeDasharray="3 3"
      label={{value:c.type+(c.dir>0?" ▲":c.dir<0?" ▼":""),fill:CAT_COLORS[c.type],fontSize:8,position:"top",fontFamily:T.mono}}/>)}
     <Tooltip content={()=>null} cursor={{stroke:"#ffffff22"}}/>
     <Line dataKey="price" stroke={cfg.color} strokeWidth={1.6} dot={false} name="price"/>
    </ComposedChart></ResponsiveContainer>
   <ResponsiveContainer width="100%" height={64}>
    <BarChart data={data} margin={{top:2,right:6,bottom:0,left:-12}} syncId="lens">
     <XAxis dataKey="d" hide/><YAxis tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
     <Bar dataKey="volume">{data.map((d,i)=><Cell key={i} fill={d.volRatio>1.5?(d.mom5>=0?T.green+"aa":T.red+"aa"):T.ink4}/>)}</Bar>
    </BarChart></ResponsiveContainer>
   <ResponsiveContainer width="100%" height={64}>
    <BarChart data={data} margin={{top:2,right:6,bottom:0,left:-12}} syncId="lens">
     <XAxis dataKey="d" hide/><YAxis tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
     <ReferenceLine y={0} stroke={T.ink4}/>
     <Bar dataKey="vci">{data.map((d,i)=><Cell key={i} fill={d.vci>=0?T.green:T.red} opacity={Math.min(1,Math.abs(d.vci)/6+.25)}/>)}</Bar>
    </BarChart></ResponsiveContainer>
   <div style={{display:"flex",gap:18,fontSize:9,color:T.ink3,fontFamily:T.mono,padding:"6px 4px 2px"}}>
    <span>ROW 1 — PRICE + CATALYSTS (#55)</span><span>ROW 2 — VOLUME (colored &gt;1.5× 20d avg)</span><span>ROW 3 — VCI = mom5% × ln(volRatio+1) (#53)</span></div>
  </Card>
  <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:12}}>
   <Card><Eyebrow>Catalyst log — hover chart or rows (#55)</Eyebrow>
    <table style={{width:"100%",borderCollapse:"collapse"}}>
     <thead><tr>{["Day","Type","Event","Dir","VolRatio","VCI"].map(h=><th key={h} style={{textAlign:"left",fontSize:8.5,textTransform:"uppercase",color:T.ink3,fontFamily:T.mono,padding:"4px 8px 6px 0",borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
     <tbody>{cfg.catalysts.map(c=>{const m=data[c.day];return(
      <tr key={c.day} onMouseEnter={()=>setHover(c.day)} onMouseLeave={()=>setHover(null)} style={{borderBottom:`1px solid ${T.border}`,background:hover===c.day?T.elevated:"none"}}>
       <td style={{padding:"5px 8px 5px 0",fontSize:10,color:T.ink3,fontFamily:T.mono}}>{m.d}</td>
       <td style={{padding:"5px 8px 5px 0",fontSize:10,color:CAT_COLORS[c.type],fontFamily:T.mono}}>{c.type}</td>
       <td style={{padding:"5px 8px 5px 0",fontSize:11,color:T.ink,fontFamily:T.body}}>{c.label}</td>
       <td style={{padding:"5px 8px 5px 0",fontSize:11,color:c.dir>0?T.green:c.dir<0?T.red:T.ink3}}>{c.dir>0?"▲":c.dir<0?"▼":"→"}</td>
       <td style={{padding:"5px 8px 5px 0",fontSize:10.5,color:m.volRatio>1.5?T.amber:T.ink3,fontFamily:T.mono}}>{m.volRatio}×</td>
       <td style={{padding:"5px 0",fontSize:10.5,fontWeight:700,color:Math.abs(m.vci)>1.5?(m.vci>0?T.green:T.red):T.ink3,fontFamily:T.mono}}>{m.vci>0?"+":""}{m.vci}</td>
      </tr>);})}</tbody></table></Card>
   <Card accent={hoverD?cfg.color:T.border}><Eyebrow>Inspector</Eyebrow>
    {hoverD?(<div style={{display:"flex",flexDirection:"column",gap:7}}>
     {[["Date",hoverD.d,T.ink],["Price","$"+hoverD.price,cfg.color],["Volume",(hoverD.volume/1e6).toFixed(1)+"M",T.ink],
       ["Vol ratio",hoverD.volRatio+"×",hoverD.volRatio>1.5?T.amber:T.ink2],
       ["Momentum 5d",(hoverD.mom5>0?"+":"")+hoverD.mom5+"%",hoverD.mom5>=0?T.green:T.red],
       ["VCI",(hoverD.vci>0?"+":"")+hoverD.vci,Math.abs(hoverD.vci)>1.5?(hoverD.vci>0?T.green:T.red):T.ink2]].map(([l,v,c],i)=>(
      <div key={i} style={{display:"flex",justifyContent:"space-between"}}>
       <span style={{fontSize:9.5,color:T.ink3,fontFamily:T.mono,textTransform:"uppercase"}}>{l}</span>
       <span style={{fontSize:11.5,color:c,fontFamily:T.mono,fontWeight:600}}>{v}</span></div>))}
     {hoverCat&&<div style={{marginTop:4,padding:"7px 9px",background:T.panel2,borderRadius:4,borderLeft:`2px solid ${CAT_COLORS[hoverCat.type]}`}}>
      <div style={{fontSize:10,color:CAT_COLORS[hoverCat.type],fontFamily:T.mono,fontWeight:700}}>[{hoverCat.type}] {hoverCat.label}</div></div>}
    </div>):<div style={{fontSize:11,color:T.ink3,fontFamily:T.body,lineHeight:1.6}}>Hover the chart or catalyst rows.<br/><br/>Reading (#53/#56): big move at near-zero VCI = mechanical, likely to fade. Same move with VCI accelerating days 2-3 = conviction, likely to persist — and high negative VCI is respected as trend (hold-the-dip discipline), not auto-faded.</div>}
   </Card></div></div>);}

const CASES=[
 {id:"gfc",title:"2007–08 GFC — The Year of Ignored Canaries (#98)",window:"13 months of warning",
  lesson:"Every credit and funding canary fired 10-14 months before Lehman while equities made new highs. Level-waiters lost the entire window; rate-of-change was visible Feb–Aug 2007.",
  match:"Current match: A-red with surface calm = the mid-2006 configuration — and Group B's private half (Cat 10) is already stressed. The Aug-'07 analogue is HY RoC firing; that row is the step-4 tripwire.",
  events:[
   {t:"Feb '07",e:"HY spreads begin widening from ~250bps — RoC canary fires at moderate levels",g:"B",fired:true},
   {t:"Jun '07",e:"Bear Stearns hedge funds collapse — single-name canary",g:"B",fired:true},
   {t:"Aug '07",e:"TED crosses 100bps — crisis-level funding canary, 13 months pre-Lehman",g:"B",fired:true},
   {t:"Oct '07",e:"S&P 500 makes ALL-TIME HIGH — Group D green while B screams",g:"D",fired:false},
   {t:"Mar '08",e:"Bear Stearns rescue — FRA/OIS and xccy basis blow out",g:"B",fired:true},
   {t:"Sep '08",e:"Lehman. HY reaches 1,750bps by October — level confirms far too late",g:"ALL",fired:true}]},
 {id:"infl22",title:"2022 Rate Shock — The Acceleration Streak (#99)",window:"Fired before the equity peak",
  lesson:"The CPI acceleration-streak canary fired January 2022 — before the S&P peaked Jan 4. The 10Y's +280bps in 9 months, each 30-day window larger than the last, was the mechanism: pace, not level.",
  match:"Current match: the exact velocity rows that led 2022 remain grey (unwired) — still the top data gap. The M2 escalation (#9) starts the 12-18mo clock toward mid/late 2027.",
  events:[
   {t:"Oct '21",e:"CPI prints begin consecutive acceleration — streak building",g:"C",fired:true},
   {t:"Jan '22",e:"Acceleration-streak canary fires. S&P peaks Jan 4",g:"C",fired:true},
   {t:"Mar '22",e:"10Y acceleration canary: three consecutive larger 30-day rises",g:"C",fired:true},
   {t:"Jun '22",e:"CPI 9.1% peak — all inflation canaries simultaneously active",g:"C",fired:true},
   {t:"Oct '22",e:"Equity trough ~-25%. Acceleration extinguished — the tradeable turn",g:"C",fired:true}]},
 {id:"carry24",title:"Aug 2024 Yen Carry Unwind — Speed Kills (#100)",window:"3 days, -7% SPX",
  lesson:"JPY +10% in 20 days forced global carry unwinds; SPX -7% in 3 days with dealer gamma deeply negative amplifying every move. No credit event — pure positioning + funding-currency velocity.",
  match:"Current match: NDX dealers are short gamma NOW (verified) and the record-low SPX correlation setup of early-July '24 is rhymed by today's dispersion extremes (#111/#114). Same template, larger latent convergence.",
  events:[
   {t:"Jul 11 '24",e:"BoJ intervention + soft US CPI — JPY reverses",g:"X",fired:true},
   {t:"Jul 31",e:"BoJ hikes; carry funding cost jumps — JPY velocity canary",g:"X",fired:true},
   {t:"Aug 2",e:"Weak payrolls; VIX term structure flips to backwardation",g:"D",fired:true},
   {t:"Aug 5",e:"VIX 65 intraday; SPX -7% in 3 sessions; negative gamma amplifies",g:"D",fired:true},
   {t:"Aug 19",e:"Full recovery — A/B/C never fired, so the shock mean-reverted",g:"ALL",fired:false}]}];

function Cases(){
 const[open,setOpen]=useState("gfc");
 const G_COLOR={A:T.red,B:T.blue,C:T.amber,D:T.green,X:T.purple,ALL:T.ink2};
 return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
  <Card><Eyebrow>Why case studies live inside the platform (#19, #98-100)</Eyebrow>
   <div style={{fontSize:12,color:T.ink,lineHeight:1.65,fontFamily:T.body,maxWidth:880}}>
    Every threshold in the Canary Matrix was calibrated from these episodes. The core empirical claim: <b>rate-of-change fires while levels still look fine, and the warning windows were long</b> — 13 months in 2007, pre-peak in 2022, and (the counter-example) 3 days in 2024 when only the fast layer fired.</div></Card>
  {CASES.map(cs=>(
   <div key={cs.id} style={{background:T.panel,border:`1px solid ${T.border}`,borderRadius:6}}>
    <div onClick={()=>setOpen(open===cs.id?"":cs.id)} style={{padding:"13px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
     <div style={{fontSize:13.5,fontWeight:700,fontFamily:T.sans,color:T.ink}}>{cs.title}</div>
     <span style={{fontSize:10,color:T.amber,fontFamily:T.mono}}>{cs.window} {open===cs.id?"▾":"▸"}</span></div>
    {open===cs.id&&(<div style={{padding:"0 16px 16px"}}>
     <div style={{position:"relative",marginLeft:8,paddingLeft:18,borderLeft:`2px solid ${T.border2}`}}>
      {cs.events.map((e,i)=>(
       <div key={i} style={{position:"relative",paddingBottom:14}}>
        <span style={{position:"absolute",left:-25,top:3,width:11,height:11,borderRadius:"50%",background:e.fired?G_COLOR[e.g]:T.panel,border:`2px solid ${G_COLOR[e.g]}`}}/>
        <div style={{display:"flex",gap:10,alignItems:"baseline",flexWrap:"wrap"}}>
         <span style={{fontSize:10.5,fontFamily:T.mono,fontWeight:700,color:G_COLOR[e.g],minWidth:58}}>{e.t}</span>
         <span style={{fontSize:11.5,color:T.ink,fontFamily:T.body,lineHeight:1.5}}>{e.e}</span>
         <span style={{fontSize:8.5,fontFamily:T.mono,color:T.ink3}}>Group {e.g}{e.fired?" · FIRED":""}</span></div></div>))}
     </div>
     <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:6}}>
      <div style={{padding:"10px 12px",background:T.panel2,borderRadius:5,fontSize:11,color:T.ink2,lineHeight:1.6,fontFamily:T.body}}><b style={{color:T.ink}}>Lesson.</b> {cs.lesson}</div>
      <div style={{padding:"10px 12px",background:T.amberDim+"66",border:`1px solid ${T.amber}44`,borderRadius:5,fontSize:11,color:T.ink2,lineHeight:1.6,fontFamily:T.body}}><b style={{color:T.amber}}>Pattern match to now.</b> {cs.match}</div>
     </div></div>)}
   </div>))}</div>);}

const RESEARCH=[
 {r:"Markus Brunnermeier",inst:"Princeton",cat:"Systemic Risk (#82-83)",papers:[
  {t:"Market Liquidity and Funding Liquidity",y:2009,rel:"Liquidity-spiral mechanism — theoretical base of Cat-0 cascade and Cat-6 stress. Read first.",tier:1},
  {t:"CoVaR (w/ Adrian)",y:2016,rel:"Conditional systemic risk — what the Divergence Engine measures in spirit",tier:1}]},
 {r:"Hyun Song Shin",inst:"BIS",cat:"Systemic Risk (#84-85)",papers:[
  {t:"Procyclical Leverage & Endogenous Fragility",y:2013,rel:"Institutional-level Category 0",tier:1},
  {t:"BIS Annual Reports (free)",y:"Annual",rel:"Source of the hyperscaler FCF/capex crossing flag (#43)",tier:1}]},
 {r:"Robin Greenwood",inst:"Harvard",cat:"Bubbles (#87)",papers:[
  {t:"Bubbles for Fama (w/ Shleifer, You)",y:2018,rel:"Cap doubling in 2yrs → 40% crash prob — Layer-2 velocity logic (#64)",tier:1},
  {t:"Predictable Financial Crises",y:2022,rel:"Credit boom + lax standards predicts crises 2-4yrs out — validates cross-group divergence",tier:1}]},
 {r:"Xavier Gabaix",inst:"Harvard",cat:"Market Structure (#88)",papers:[
  {t:"Inelastic Markets Hypothesis (w/ Koijen)",y:2022,rel:"$1 flow → ~$5 market value — the passive-mechanics foundation (#35)",tier:1},
  {t:"Granular Origins of Aggregate Fluctuations",y:2011,rel:"Top-100 firm shocks = 1/3 of GDP vol — Mag-7 risk at macro level",tier:1}]},
 {r:"Robert Shiller",inst:"Yale",cat:"Valuation (#92, #65)",papers:[
  {t:"CAPE data (free, monthly)",y:"Monthly",rel:"US CAPE top-5% of post-1881 history — Layer-2 input",tier:1},
  {t:"Bubbles, Human Judgment & Expert Opinion",y:2001,rel:"Experts don't call bubbles in real time — why systematic canaries",tier:2}]},
 {r:"Jeremy Stein",inst:"Harvard",cat:"Monetary (#90)",papers:[
  {t:"Overheating in Credit Markets",y:2013,rel:"Risk-taking channel — why A-red/B-green is danger not comfort; why leverage migrates to NDFI",tier:1}]},
 {r:"Campbell Harvey",inst:"Duke",cat:"Rates (#91)",papers:[
  {t:"Yield Curve Recession Prediction",y:"1986→",rel:"3m10y called every recession since 1968 — Cat-5 calibration authority. CFO survey = bonus canary.",tier:1}]},
 {r:"Shleifer-Vishny",inst:"Harvard/Chicago",cat:"Fire Sales (#89)",papers:[
  {t:"Fire Sales in Finance and Macroeconomics",y:2011,rel:"Forced selling most severe exactly when most damaging — why margin unwinds cascade at extremes",tier:1}]},
 {r:"Fama-French / Pedersen / AQR",inst:"Chicago / AQR",cat:"Factors (#95-96, #81)",papers:[
  {t:"Ken French Data Library",y:"Monthly",rel:"60+ yrs global factor returns — threshold calibration spine",tier:1},
  {t:"AQR QMJ / BAB / TSMOM datasets",y:"Monthly",rel:"Live factor-health layer — 3+ factors in bottom decile = crowded-trade unwind (#81)",tier:1}]},
 {r:"O'Hara / Kyle",inst:"Cornell / Maryland",cat:"Microstructure (#94)",papers:[
  {t:"Market Microstructure Theory / Kyle Lambda",y:"1985→",rel:"Price impact per unit order flow — the theoretical basis of VCI (#53)",tier:2}]}];

function Research(){
 const[q,setQ]=useState("");
 const list=RESEARCH.map(r=>({...r,papers:r.papers.filter(p=>!q||(r.r+p.t+p.rel+r.cat).toLowerCase().includes(q.toLowerCase()))})).filter(r=>r.papers.length);
 return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
  <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search researchers, papers, concepts…"
   style={{background:T.panel,border:`1px solid ${T.border}`,borderRadius:5,padding:"8px 13px",color:T.ink,fontFamily:T.mono,fontSize:11.5,outline:"none"}}/>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
   {list.map((r,i)=>(
    <Card key={i} accent={T.blue}>
     <div style={{fontSize:12.5,fontWeight:700,fontFamily:T.sans,color:T.ink}}>{r.r}</div>
     <div style={{fontSize:9.5,color:T.ink3,fontFamily:T.mono,marginBottom:9}}>{r.inst} · {r.cat}</div>
     {r.papers.map((p,pi)=>(
      <div key={pi} style={{padding:"7px 10px",background:T.panel2,borderRadius:4,borderLeft:`2px solid ${p.tier===1?T.green:T.amber}`,marginBottom:6}}>
       <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
        <span style={{fontSize:11,fontWeight:600,color:T.blue,fontFamily:T.body}}>{p.t}</span>
        <span style={{fontSize:8.5,background:p.tier===1?T.greenDim:T.amberDim,border:`1px solid ${p.tier===1?T.green:T.amber}`,color:p.tier===1?T.green:T.amber,borderRadius:3,padding:"1px 5px",fontFamily:T.mono,flexShrink:0}}>T{p.tier}</span></div>
       <div style={{fontSize:9.5,color:T.ink3,fontFamily:T.mono,margin:"2px 0 3px"}}>{p.y}</div>
       <div style={{fontSize:10.5,color:T.ink2,lineHeight:1.5,fontFamily:T.body}}>{p.rel}</div></div>))}
    </Card>))}
  </div>
  <Card accent={T.purple}><Eyebrow color={T.purple}>Free repositories — the platform's data spine (#97)</Eyebrow>
   <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9}}>
    {[["Ken French Data Library","60+ yrs of global factor returns, monthly"],
      ["AQR Datasets","QMJ/BAB/TSMOM/VME — live factor-health layer (#81)"],
      ["FRED","HY & IG OAS, curves, M2, SLOOS, CPI — majority of Tier-1 wiring"],
      ["BIS WPs + Annual Report","Source of the FCF/capex crossing flag"],
      ["IMF GFSR (Apr & Oct)","The institutional twin of this dashboard"],
      ["NBER / SSRN / arXiv q-fin","Gabaix-Koijen, Greenwood, CoVaR all free"],
      ["Shiller CAPE (Yale)","Monthly since 1881 — longest Layer-2 series"],
      ["Bank 10-Qs (NEW)","Q1'26 granular NDFI disclosure — Cat-10 quarterly feed (#138)"],
      ["CBOE COR3M / SEMI B2B / EIA","WP-04, book-to-bill, industrial-load rows"]].map(([t,d],i)=>(
     <div key={i} style={{background:T.panel2,border:`1px solid ${T.border}`,borderRadius:5,padding:"9px 11px"}}>
      <div style={{fontSize:11,fontWeight:600,color:T.blue,fontFamily:T.sans,marginBottom:3}}>{t}</div>
      <div style={{fontSize:10,color:T.ink2,lineHeight:1.5,fontFamily:T.body}}>{d}</div></div>))}
   </div></Card></div>);}


// ── PAGE: EXECUTION LAYER (#146-148) ─────────────────────────────────────────
const DOW1929=[
 {d:"'28",v:200},{d:"Mar'29",v:308},{d:"Sep'29",v:381},{d:"Oct'29",v:273.5},{d:"Nov'29",v:238},
 {d:"Apr'30",v:294},{d:"Dec'30",v:164},{d:"Jun'31",v:150},{d:"Dec'31",v:77},{d:"Jul'32",v:41},
 {d:"Aug'32",v:73.2},{d:"Mar'33",v:55},{d:"Jul'33",v:105},{d:"'34",v:104},{d:"'35",v:144},{d:"'36",v:180}];
const IVY=[
 {a:"VTI — US Equity",m10:8.5,m12:10.1,s10:"INV",s12:"INV"},
 {a:"VEU — Intl Equity",m10:9.5,m12:12.1,s10:"INV",s12:"INV"},
 {a:"IEF — 10Y Treasuries",m10:-0.1,m12:0.3,s10:"CASH",s12:"INV",split:true},
 {a:"VNQ — REITs",m10:4.6,m12:6.2,s10:"INV",s12:"INV"},
 {a:"DBC — Commodities",m10:7.9,m12:9.4,s10:"INV",s12:"INV"}];
function Execution(){
 const sig=s=><span style={{fontSize:9.5,fontWeight:700,fontFamily:T.mono,letterSpacing:".06em",padding:"2px 8px",borderRadius:3,background:s==="INV"?T.greenDim:T.redDim,border:`1px solid ${s==="INV"?T.green:T.red}`,color:s==="INV"?T.green:T.red}}>{s==="INV"?"INVESTED":"CASH"}</span>;
 return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
  <Card accent={T.cyan}>
   <Eyebrow color={T.cyan}>Warning layer vs execution layer — the division of labor (#146-148)</Eyebrow>
   <div style={{fontSize:12.5,color:T.ink,lineHeight:1.7,fontFamily:T.body,maxWidth:920}}>
    Everything else in this platform says <b>"prepare."</b> This page says <b>"act."</b> Monthly trend signals are not early warnings — they are <b>tail-truncation and re-entry discipline</b>. In 2007 the canaries (TED &gt;100bps) fired four months before the 10-month cross broke; the right design is canaries compressing exposure as they accumulate (Kelly-style, #63), the trend break executing the remainder mechanically. Monthly-close discipline also correctly <i>ignores</i> Aug-2024-style intramonth D-only shocks — a feature, matching the case-study taxonomy by construction.
   </div>
  </Card>
  <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:12}}>
   <Card><Eyebrow>1929-36 — what the monthly cross actually did (honest version)</Eyebrow>
    <ResponsiveContainer width="100%" height={210}>
     <LineChart data={DOW1929} margin={{top:16,right:8,bottom:0,left:-10}}>
      <XAxis dataKey="d" tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
      <YAxis domain={[0,400]} tick={{fill:T.ink3,fontSize:8,fontFamily:T.mono}} axisLine={false} tickLine={false}/>
      <ReferenceLine x="Oct'29" stroke={T.red} strokeDasharray="3 3" label={{value:"SELL 273.51",fill:T.red,fontSize:9,fontFamily:T.mono,position:"top"}}/>
      <ReferenceLine x="Aug'32" stroke={T.green} strokeDasharray="3 3" label={{value:"BUY 73.16",fill:T.green,fontSize:9,fontFamily:T.mono,position:"top"}}/>
      <Tooltip content={({active,payload})=>active&&payload?.[0]?<div style={{background:T.elevated,border:`1px solid ${T.border2}`,borderRadius:4,padding:"6px 10px",fontFamily:T.mono,fontSize:10,color:T.ink}}>{payload[0].payload.d}: <b>{payload[0].value}</b></div>:null}/>
      <Line dataKey="v" stroke={T.ink} strokeWidth={1.6} dot={false}/>
     </LineChart></ResponsiveContainer>
    <div style={{fontSize:10.5,color:T.ink2,fontFamily:T.body,lineHeight:1.6,marginTop:6}}>
     The sell fired at the October close — <b style={{color:T.red}}>already −28% from the 381 peak</b>. It did not predict; it <b>truncated</b>: the signal holder skipped the further <b style={{color:T.red}}>−85% grind to 41</b>, then re-entered Aug '32 within months of the absolute bottom (whipsaws in '32-'33, '37, '39 — the fee for the insurance). Not a warning instrument. An execution instrument.</div></Card>
   <div style={{display:"flex",flexDirection:"column",gap:12}}>
    <Card accent={T.red}><Eyebrow color={T.red}>Distance-to-cascade (#146)</Eyebrow>
     <div style={{fontSize:30,fontFamily:T.sans,fontWeight:700,color:T.red}}>−7% to −9%</div>
     <div style={{fontSize:11,color:T.ink2,fontFamily:T.body,lineHeight:1.6,marginTop:4}}>
      The decline that flips <b>every</b> monthly trend model to Cash simultaneously. The cascade stack: SpotGamma's ~10% correction forecast · NDX dealers short gamma (amplifying) · buyback blackout (bid absent) · then the systematic sellers arrive at −7-9%. The variance column is the measured distance between "calm" and "everyone acts at once."</div></Card>
    <Card><Eyebrow>All-assets breadth (#148)</Eyebrow>
     <div style={{fontSize:11.5,color:T.ink,fontFamily:T.body,lineHeight:1.6}}><b>4/5 above trend</b> on the 10-month (5/5 on the 12-month), bonds marginal, international more extended than the US — the everything-up-except-bonds shape: one macro trade expressed across asset classes. Late-cycle configuration.</div></Card>
   </div>
  </div>
  <Card><Eyebrow>Ivy 5-asset monthly trend table — mock, calibrated to reported values (#146-148)</Eyebrow>
   <table style={{width:"100%",borderCollapse:"collapse"}}>
    <thead><tr>{["Asset","10-mo vs SMA","10-mo signal","12-mo vs SMA","12-mo signal",""].map(h=><th key={h} style={{textAlign:"left",fontSize:8.5,textTransform:"uppercase",color:T.ink3,fontFamily:T.mono,padding:"4px 10px 6px 0",borderBottom:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
    <tbody>{IVY.map((r,i)=>(
     <tr key={i} style={{borderBottom:`1px solid ${T.border}`,background:r.split?T.amberDim+"44":"none"}}>
      <td style={{padding:"8px 10px 8px 0",fontSize:11.5,color:T.ink,fontWeight:600,fontFamily:T.body}}>{r.a}</td>
      <td style={{padding:"8px 10px 8px 0",fontSize:11.5,fontFamily:T.mono,fontWeight:700,color:r.m10>=0?T.green:T.red}}>{r.m10>0?"+":""}{r.m10}%</td>
      <td style={{padding:"8px 10px 8px 0"}}>{sig(r.s10)}</td>
      <td style={{padding:"8px 10px 8px 0",fontSize:11.5,fontFamily:T.mono,fontWeight:700,color:r.m12>=0?T.green:T.red}}>{r.m12>0?"+":""}{r.m12}%</td>
      <td style={{padding:"8px 10px 8px 0"}}>{sig(r.s12)}</td>
      <td style={{padding:"8px 0",fontSize:9.5,color:T.amber,fontFamily:T.mono}}>{r.split?"◀ FAST-SLOW SPLIT (#147) — first asset off trend this cycle":""}</td>
     </tr>))}</tbody></table>
   <div style={{fontSize:10.5,color:T.ink2,fontFamily:T.body,lineHeight:1.6,marginTop:10,paddingTop:8,borderTop:`1px solid ${T.border}`}}>
    <b style={{color:T.amber}}>#147 — the regime-transition tell:</b> when the 10-month and 12-month disagree, the faster is announcing the regime change the slower confirms later. IEF sitting exactly on trend is the secular bond bear (#116), positive stock-bond correlation (#129) and the bear steepener (#121) expressed in one table row. <b>Monthly close dates are this page's only decision points</b> — next: Jul 31.</div></Card>
 </div>);}


const NAV=[
 {id:"overview",l:"Overview",i:"◈"},
 {id:"volcomplex",l:"Vol Complex",i:"≋"},
 {id:"ledger",l:"Contradictory Ledger",i:"⚖"},
 {id:"divergence",l:"Divergence Engine",i:"≷"},
 {id:"canary",l:"Canary Matrix",i:"⚠"},
 {id:"execution",l:"Execution Layer",i:"⎋"},
 {id:"bubble",l:"Bubble Percentile",i:"◉"},
 {id:"macro",l:"Macro Context",i:"⊞"},
 {id:"structure",l:"Market Structure",i:"⧖"},
 {id:"conviction",l:"Conviction Lens",i:"◫"},
 {id:"correlations",l:"Extended Correlations",i:"⋈"},
 {id:"cases",l:"Case Studies",i:"↻"},
 {id:"research",l:"Research Library",i:"⊗"},
 {id:"calendar",l:"Watch Calendar",i:"◷"}];
const SUBTITLES={
 overview:"145-idea framework · Group B split · D upgraded red · sequence 3 of 4",
 volcomplex:"The quartet: VXN−VIX · VIXEQ−VIX · Convergence VIX · skew inversion (#110/114/118/133)",
 ledger:"Bull and bear evidence at full weight · falsifiable statement · invalidation criteria (#141-145)",
 divergence:"31-month history · gap closing from the wrong side · resolution patterns (#3)",
 canary:"11 categories · NEW Cat 10 Private Credit & NDFI · drill-downs (#16, #135-140)",
 execution:"Canaries prepare · the monthly cross acts — distance-to-cascade −7-9% (#146-148)",
 bubble:"1977–2026 standardised · peaks, troughs, ascent trajectories (#62-65)",
 macro:"r* · productivity · fiscal · earnings quality — interpretive layer (#17, #28-32)",
 structure:"Passive flows · AI supply chain · OpEx · capital discipline (#33-52, #113, #140)",
 conviction:"Price × volume × catalyst × VCI — per-ticker conviction read (#53-56)",
 correlations:"Layer 6 network — insurer channel, blackout calendar, absorption test (#66-81)",
 cases:"2007 · 2022 · 2024 — replayed through the framework (#98-100)",
 research:"Every paper mapped to a platform component (#82-97)",
 calendar:"Dated catalysts — the next 90 days adjudicate most of the ledger (#103)"};

export default function App(){
 const[page,setPage]=useState("overview");
 const all=CATS.flatMap(c=>c.rows);
 const red=all.filter(r=>r.s==="RED"&&r.v).length;
 const PAGES={overview:<Overview go={setPage}/>,volcomplex:<VolComplex/>,ledger:<Ledger/>,divergence:<Divergence/>,canary:<Canary/>,execution:<Execution/>,bubble:<Bubble/>,macro:<Macro/>,structure:<Structure/>,conviction:<Conviction/>,correlations:<Correlations/>,cases:<Cases/>,research:<Research/>,calendar:<Calendar/>};
 return(<div style={{display:"flex",height:"100vh",background:T.bg,color:T.ink,fontFamily:T.body,overflow:"hidden"}}>
  <div style={{width:216,flexShrink:0,background:T.panel,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column"}}>
   <div style={{padding:"18px 16px 14px",borderBottom:`1px solid ${T.border}`}}>
    <div style={{fontSize:14.5,fontWeight:700,fontFamily:T.sans,color:T.ink}}>INSTABILITY</div>
    <div style={{fontSize:9,color:T.ink3,fontFamily:T.mono,letterSpacing:".12em"}}>WATCH · v7 · FABLE · 12 JUL 26</div>
    <div style={{marginTop:9,display:"flex",gap:5,flexWrap:"wrap"}}>
     <span style={{fontSize:8.5,background:T.redDim,border:`1px solid ${T.red}`,color:T.red,borderRadius:3,padding:"2px 6px",fontFamily:T.mono,fontWeight:700}}>{red} RED</span>
     <span style={{fontSize:8.5,background:T.amberDim,border:`1px solid ${T.amber}`,color:T.amber,borderRadius:3,padding:"2px 6px",fontFamily:T.mono,fontWeight:700}}>B SPLIT</span>
     <span style={{fontSize:8.5,background:T.redDim,border:`1px solid ${T.red}`,color:T.red,borderRadius:3,padding:"2px 6px",fontFamily:T.mono,fontWeight:700}}>STEP 3/4</span>
    </div>
   </div>
   <nav style={{flex:1,padding:"8px 7px",overflowY:"auto"}}>
    {NAV.map(n=>(
     <button key={n.id} onClick={()=>setPage(n.id)} style={{width:"100%",textAlign:"left",display:"flex",alignItems:"center",gap:9,padding:"7px 10px",borderRadius:5,marginBottom:2,cursor:"pointer",background:page===n.id?T.elevated:"none",border:`1px solid ${page===n.id?T.border2:"transparent"}`,color:page===n.id?T.ink:T.ink2,fontFamily:T.sans,fontSize:11.5,fontWeight:page===n.id?600:400}}>
      <span style={{fontSize:13,color:page===n.id?T.blue:T.ink3}}>{n.i}</span>{n.l}</button>))}
   </nav>
   <div style={{padding:"10px 14px",borderTop:`1px solid ${T.border}`,fontSize:9,color:T.ink3,fontFamily:T.mono,lineHeight:1.6}}>
    ~126 of 148 master ideas<br/>portrayed · mock data,<br/>calibrated to reported values.<br/>Not investment advice.
   </div>
  </div>
  <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
   <div style={{padding:"12px 22px",borderBottom:`1px solid ${T.border}`,background:T.panel,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
    <div>
     <div style={{fontSize:17,fontWeight:700,fontFamily:T.sans,color:T.ink}}>{NAV.find(n=>n.id===page)?.l}</div>
     <div style={{fontSize:10,color:T.ink3,fontFamily:T.mono,marginTop:1}}>{SUBTITLES[page]}</div>
    </div>
    <div style={{display:"flex",gap:9}}>
     {[["RED","A"],["SPLIT","B"],["AMBER","C"],["RED","D"]].map(([s,g],i)=>(
      <div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,fontFamily:T.mono}}>
       <Dot s={s} size={7}/><span style={{color:T.ink3}}>{g}</span></div>))}
    </div>
   </div>
   <div style={{flex:1,overflowY:"auto",padding:"18px 22px"}}>{PAGES[page]}</div>
  </div>
 </div>);}
