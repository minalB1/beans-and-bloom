/* EDIT THIS FIRST: replace the placeholder café name with your actual name. */
const CAFE_NAME = 'BEANS & BLOOM';

/* TEMPLATE DATA: These choices are examples, NOT your actual BizCafe decisions.
   Once you send your real decisions/scores, replace each round with those details. */
const rounds = [
  {title:'Setting the scene',description:'What kind of café should we create?',choices:['Modern & organic','Cosy & traditional'],selected:0,reason:'EXAMPLE ONLY: This is where we explain why we chose a modern and organic direction, and what happened next.'},
  {title:'Finding our customers',description:'Who did we want our café to appeal to?',choices:['Students & commuters','Premium coffee lovers'],selected:0,reason:'Placeholder: explain the market segment you targeted and why.'},
  {title:'Building the menu',description:'Which direction did we take with our product offering?',choices:['Focused menu','Expanded selection'],selected:1,reason:'Placeholder: add your actual product or menu decision.'},
  {title:'The price of a coffee',description:'How did we balance customer demand and margins?',choices:['Competitive pricing','Premium pricing'],selected:0,reason:'Placeholder: explain your pricing strategy and sales impact.'},
  {title:'Getting noticed',description:'How did we decide to attract new customers?',choices:['Digital promotion','Local advertising'],selected:0,reason:'Placeholder: add your actual marketing decision and its effect.'},
  {title:'The people behind the counter',description:'How did we approach staffing our café?',choices:['Increase staffing','Maintain staffing'],selected:1,reason:'Placeholder: explain service quality, staffing cost and demand.'},
  {title:'Quality or quantity?',description:'What was our operational priority?',choices:['Quality first','Faster throughput'],selected:0,reason:'Placeholder: describe the trade-off you faced.'},
  {title:'Reacting to the numbers',description:'What did we change after reviewing performance?',choices:['Adjust prices','Adjust spending'],selected:1,reason:'Placeholder: show how the prior round’s results influenced you.'},
  {title:'Our final push',description:'Which lever did we prioritise near the end?',choices:['Invest for growth','Protect profit'],selected:1,reason:'Placeholder: add your actual late-stage strategy.'},
  {title:'The final decision',description:'How did we bring everything together?',choices:['Stay the course','Make a bold change'],selected:0,reason:'Placeholder: reveal your last decision, its result and lesson.'}
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
  document.getElementById('decision-hint').textContent='Select either option to reveal our choice.';
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
