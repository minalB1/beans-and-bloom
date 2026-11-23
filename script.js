/* EDIT THIS FIRST: replace the placeholder café name with your actual name. */
const CAFE_NAME = 'BEANS & BLOOM';

/* Real selected decisions from the team report; alternatives are illustrative audience prompts. */
const rounds = [
  {title:'Launching Beans & Bloom',description:'How should we position the café at launch?',choices:['Fair-trade organic coffee','Standard coffee'],selected:0,reason:'We chose fair-trade organic coffee with green furniture and an Auto-Four machine. Week 1 ended with a $4,092 loss — an early reality check.'},
  {title:'Responding to early feedback',description:'Should we invest in baked goods?',choices:['Purchase an oven','Keep coffee only'],selected:0,reason:'We invested $4,000 in an oven, reduced medium coffee pricing and extended opening hours. Week 2 returned a $4,343 net profit.'},
  {title:'Investing in the experience',description:'Would extra staff training be worthwhile?',choices:['Buy a training programme','Skip training'],selected:0,reason:'We purchased a $1,200 training programme and offered free high-speed internet. Week 3 customer satisfaction was 58.9.'},
  {title:'Making more responsible choices',description:'How should we handle organic waste?',choices:['Separate for composting','No additional separation'],selected:0,reason:'We chose collection for composting. We also deferred selling sandwiches. Week 4 weekly profit was $5,030.'},
  {title:'Taking the expansion decision',description:'Should we expand café capacity?',choices:['Rent space and add machine','Stay at existing capacity'],selected:0,reason:'We rented additional space and bought another Auto-Four machine. Weekly profit grew to $6,964 in Week 5.'},
  {title:'A bigger customer opportunity',description:'How could we reach demand outside the café?',choices:['Use a mobile coffee cart','Stay inside the café'],selected:0,reason:'We obtained a vendor licence and rented a mobile cart. Week 6 revenue was $32,260, our highest weekly revenue.'},
  {title:'Protecting customer relationships',description:'How should we handle an irate customer?',choices:['Apologise and offer coffee','Ignore the complaint'],selected:0,reason:'We apologised and offered a complimentary coffee. This round also included buying a coffee roaster and updating our brand. Week 7 profit reached $12,029.'},
  {title:'Learning to stand by decisions',description:'Should we change our supplier?',choices:['Keep our existing supplier','Switch supplier'],selected:0,reason:'We stayed with our existing supplier. Week 8 delivered our highest weekly net income: $15,260. This does not prove any single decision caused that result.'},
  {title:'Creating a memorable experience',description:'Should we host live entertainment?',choices:['Host a local jazz band','No live entertainment'],selected:0,reason:'We chose the local high-school jazz band and updated our Christmas branding. Weekly net income dropped to $6,509 in Week 9, reminding us to watch the costs of growth.'},
  {title:'Our last trading decisions',description:'How should we approach staff benefits?',choices:['Comprehensive Care','Maintain previous cover'],selected:0,reason:'We selected Comprehensive Care for servers and adjusted wages and coffee prices. Week 10 customer satisfaction reached 80.6 and awareness 98.1, but weekly net income fell to $2,868.'}
];

const screenIds=['home','journey','identity','finale'];
const navButtons=[...document.querySelectorAll('[data-target]')];
let currentScreen=0;
let selectedRound=0;

function showScreen(id){
  if(!screenIds.includes(id))return;
  currentScreen=screenIds.indexOf(id);
  screenIds.forEach(screenId=>{
    const el=document.getElementById(screenId);
    const active=screenId===id;
    el.hidden=!active;
    el.classList.toggle('active',active);
  });
  document.querySelectorAll('.nav-link').forEach(btn=>btn.classList.toggle('active',btn.dataset.target===id));
  window.scrollTo({top:0,behavior:'instant'});
  history.replaceState(null,'','#'+id);
}

function showRound(index){
  selectedRound=index;
  const round=rounds[index];
  document.querySelectorAll('.round-btn').forEach((btn,i)=>{
    btn.classList.toggle('active',i===index);
    btn.setAttribute('aria-pressed',String(i===index));
  });
  document.getElementById('round-label').textContent=`DECISION ROUND ${String(index+1).padStart(2,'0')} / 10`;
  document.getElementById('round-title').textContent=round.title;
  const phase=index<3?['THE BEGINNING · FINDING OUR FEET','Early on, it took us longer to agree on our decisions.']:index<7?['THE MIDDLE · FINDING OUR RHYTHM','As the rounds went on, we were learning how to discuss options and reach a conclusion.']:['THE END · GROWING IN CONFIDENCE','Towards the end, our team was reaching decisions much more quickly.'];
  const context=document.getElementById('round-context');
  context.replaceChildren();
  const phaseLabel=document.createElement('strong');phaseLabel.textContent=phase[0];
  const phaseDescription=document.createElement('span');phaseDescription.textContent=phase[1];
  context.append(phaseLabel,phaseDescription);
  document.getElementById('round-description').textContent=round.description;
  document.getElementById('decision-hint').textContent='Audience options are illustrative; click to reveal the recorded decision.';
  const container=document.getElementById('decision-buttons');
  container.replaceChildren();
  round.choices.forEach((choice,choiceIndex)=>{
    const btn=document.createElement('button');
    btn.className='choice-btn';
    btn.textContent=choice;
    btn.addEventListener('click',()=>revealChoice(choiceIndex));
    container.appendChild(btn);
  });
  const panel=document.getElementById('decision-reveal');
  panel.className='reveal-empty';
  panel.replaceChildren();
  const symbol=document.createElement('span');symbol.className='big-symbol';symbol.textContent='?';
  const message=document.createElement('p');message.textContent='Make your choice to reveal our team’s decision and reasoning.';
  panel.append(symbol,message);
}

function revealChoice(choiceIndex){
  const round=rounds[selectedRound];
  document.querySelectorAll('.choice-btn').forEach((btn,i)=>btn.classList.toggle('selected',i===choiceIndex));
  document.getElementById('decision-hint').textContent=choiceIndex===round.selected?'You picked the same option as our team.':'You picked a different option — here is what our team chose.';
  const panel=document.getElementById('decision-reveal');
  panel.className='';
  panel.replaceChildren();
  const tag=document.createElement('p');tag.className='chosen';tag.textContent='OUR TEAM CHOSE';
  const title=document.createElement('h4');title.textContent=round.choices[round.selected];
  const body=document.createElement('p');body.className='explain';body.textContent=round.reason;
  panel.append(tag,title,body);
}

function init(){
  document.getElementById('brand-name').textContent=CAFE_NAME;
  const picker=document.getElementById('round-picker');
  rounds.forEach((_,i)=>{
    const btn=document.createElement('button');btn.className='round-btn';
    btn.textContent=String(i+1).padStart(2,'0');
    btn.setAttribute('aria-label',`Decision round ${i+1}`);
    btn.addEventListener('click',()=>showRound(i));
    picker.appendChild(btn);
  });
  navButtons.forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();showScreen(btn.dataset.target)}));
  document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();showScreen('home')});
  document.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'&&currentScreen<screenIds.length-1)showScreen(screenIds[currentScreen+1]);
    if(e.key==='ArrowLeft'&&currentScreen>0)showScreen(screenIds[currentScreen-1]);
  });
  showRound(0);
  const hash=location.hash.slice(1);
  showScreen(screenIds.includes(hash)?hash:'home');
}
init();

// Flashback intro — a self-contained transition, suitable for GitHub Pages and offline browsers.
let flashbackBusy=false;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function startFlashback(){
  if(flashbackBusy)return;
  flashbackBusy=true;
  const overlay=document.getElementById('rewind-overlay');
  const counter=document.getElementById('rewind-number');
  const progress=document.getElementById('rewind-progress');
  const overline=document.getElementById('rewind-overline');
  const heading=document.getElementById('rewind-title');
  overlay.classList.remove('cream');
  overlay.classList.add('playing');
  overlay.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  await delay(reduced?150:330);
  for(let number=10;number>=1;number--){
    counter.textContent=number;
    progress.style.width=`${(11-number)*10}%`;
    await delay(reduced?25:115);
  }
  overlay.classList.add('cream');
  overline.textContent='BACK TO WHERE IT ALL BEGAN';
  heading.textContent='WEEK ONE · THE FIRST BREW';
  counter.textContent='01';
  showScreen('journey');
  showRound(0);
  await delay(reduced?120:850);
  overlay.classList.remove('playing');
  overlay.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  flashbackBusy=false;
}
document.getElementById('open-story').addEventListener('click',startFlashback);
document.getElementById('open-campaign').addEventListener('click',()=>{document.getElementById('campaign-detail').hidden=false});
document.getElementById('close-campaign').addEventListener('click',()=>{document.getElementById('campaign-detail').hidden=true});
