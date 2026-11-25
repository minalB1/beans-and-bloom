/* Beans & Bloom performance charts — standalone, no external libraries needed. */
(() => {
  'use strict';

  const metrics = {
    profit: {
      label: 'Weekly Net Profit', tab: 'Net Profit',
      values: [-4092,4343,4415,5030,6964,10320,12029,15260,6509,2868],
      min:-5000, max:20000, step:5000, format:v=>'$'+v.toLocaleString('en-US'),
      caption:'Week 1 was a loss. Weekly profit peaked in Week 8 before declining in Weeks 9 and 10.'
    },
    customer: {
      label:'Customer Satisfaction', tab:'Customer Satisfaction',
      values:[37.2,57,58.9,65,69.9,61.9,70.3,75.1,75.6,80.6],
      min:30,max:90,step:15, format:v=>v.toFixed(1),
      caption:'Customer satisfaction increased from 37.2 in Week 1 to 80.6 in Week 10.'
    },
    community: {
      label:'Community Reputation', tab:'Community Reputation',
      values:[75,78,85,86,87,87,88,89,89,90],
      min:70,max:100,step:10, format:v=>v+'%',
      caption:'The y-axis starts at 70% to make the 75% to 90% rise clear. Values are unchanged.'
    },
    carbon: {
      label:'Carbon Footprint', tab:'Carbon Footprint',
      values:[474,945,1350,1223,1698,2237,1906,1983,1956,1760],
      min:0,max:2500,step:500,format:v=>v.toLocaleString('en-GB'),
      caption:'Reported simulation carbon footprint: it peaked in Week 6, then reduced by Week 10. Lower is better; the overall footprint remained above Week 1.'
    },
    awareness: {
      label:'Brand Awareness',tab:'Brand Awareness',
      values:[5.1,14.4,25.6,38.9,47.8,64.8,85.8,85.9,90.4,98.1],
      min:0,max:100,step:20,format:v=>v.toFixed(1),
      caption:'Brand awareness increased alongside our branding and wider marketing activity.'
    }
  };

  const SVG_NS = 'http://www.w3.org/2000/svg';
  function node(tag, attributes = {}, text) {
    const el = document.createElementNS(SVG_NS,tag);
    for(const [key,value] of Object.entries(attributes)) el.setAttribute(key,String(value));
    if(text!==undefined) el.textContent=text;
    return el;
  }
  function drawGraph(host,metric) {
    host.replaceChildren();
    const width=720,height=305,left=67,right=20,top=20,bottom=45;
    const gw=width-left-right,gh=height-top-bottom;
    const x=i=>left+(i/9)*gw;
    const y=v=>top+(metric.max-v)/(metric.max-metric.min)*gh;
    const svg=node('svg',{viewBox:`0 0 ${width} ${height}`,class:'bb-graph',role:'img', 'aria-label':`${metric.label}, weeks 1 through 10`});
    for(let v=metric.min;v<=metric.max+metric.step/2;v+=metric.step){
      svg.append(node('line',{x1:left,x2:width-right,y1:y(v),y2:y(v),class:'bb-grid'}));
      svg.append(node('text',{x:left-12,y:y(v)+4,'text-anchor':'end',class:'bb-axis-label'},metric.format(v)));
    }
    if(metric.min<0&&metric.max>0)svg.append(node('line',{x1:left,x2:width-right,y1:y(0),y2:y(0),class:'bb-zero'}));
    metric.values.forEach((v,i)=>svg.append(node('text',{x:x(i),y:height-14,'text-anchor':'middle',class:'bb-axis-label'},String(i+1))));
    const points=metric.values.map((v,i)=>[x(i),y(v)]);
    const path=node('path',{d:points.map(([px,py],i)=>`${i?'L':'M'}${px.toFixed(2)} ${py.toFixed(2)}`).join(' '),class:'bb-line',pathLength:100});
    svg.append(path);
    metric.values.forEach((v,i)=>{
      const circle=node('circle',{cx:x(i),cy:y(v),r:5,class:'bb-dot',tabindex:0});
      circle.append(node('title',{},`Week ${i+1}: ${metric.format(v)}`));
      svg.append(circle);
    });
    host.append(svg);
  }

  const finale=document.getElementById('finale');
  const results=finale?.querySelector('.results-story');
  if(results){
    const box=document.createElement('section');box.className='bb-performance';box.setAttribute('aria-label','Explore our performance over ten weeks');
    box.innerHTML=`<p class="bb-kicker">TEN WEEKS · FOUR PERSPECTIVES</p>
      <h3>More than just profit.</h3>
      <div class="bb-tabs" role="tablist" aria-label="Choose a performance graph"></div>
      <div class="bb-chart-top"><h4 class="bb-chart-title"></h4><span class="bb-keyvalue"></span></div>
      <div class="bb-chart-area"></div><p class="bb-caption"></p>`;
    results.insertAdjacentElement('afterend',box);
    const tabs=box.querySelector('.bb-tabs');
    function selectMetric(key){
      const metric=metrics[key];
      tabs.querySelectorAll('button').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.metric===key)));
      box.querySelector('.bb-chart-title').textContent=metric.label;
      box.querySelector('.bb-keyvalue').textContent=`Week 10: ${metric.format(metric.values[9])}`;
      box.querySelector('.bb-caption').textContent=metric.caption;
      drawGraph(box.querySelector('.bb-chart-area'),metric);
    }
    ['profit','customer','community','carbon'].forEach(key=>{
      const b=document.createElement('button');b.type='button';b.role='tab';b.dataset.metric=key;b.textContent=metrics[key].tab;
      b.addEventListener('click',()=>selectMetric(key));tabs.append(b);
    });
    selectMetric('profit');
  }

  const identity=document.getElementById('identity');
  if(identity){
    const trigger=document.createElement('button');trigger.type='button';trigger.className='bb-brand-trigger';trigger.textContent='VIEW OUR BRAND AWARENESS ↗';
    const footer=identity.querySelector('.section-footer');
    if(footer)identity.insertBefore(trigger,footer);else identity.append(trigger);
    const modal=document.createElement('div');modal.className='bb-modal';modal.hidden=true;
    modal.innerHTML=`<section class="bb-modal-panel" role="dialog" aria-modal="true" aria-label="Brand awareness over time">
      <button class="bb-modal-close" type="button" aria-label="Close brand awareness graph">×</button>
      <p class="bb-kicker">OUR IDENTITY · A MEASURABLE CHANGE</p>
      <h3>From blending in to standing out.</h3>
      <p class="bb-keyvalue">Week 1: 5.1 &nbsp; → &nbsp; Week 10: 98.1</p>
      <div class="bb-chart-area"></div><p class="bb-caption"></p>
    </section>`;
    document.body.append(modal);
    const close=modal.querySelector('.bb-modal-close');
    function hide(){modal.hidden=true;document.body.style.overflow='';trigger.focus();}
    trigger.addEventListener('click',()=>{
      drawGraph(modal.querySelector('.bb-chart-area'),metrics.awareness);
      modal.querySelector('.bb-caption').textContent=metrics.awareness.caption;
      modal.hidden=false;document.body.style.overflow='hidden';close.focus();
    });
    close.addEventListener('click',hide);
    modal.addEventListener('click',e=>{if(e.target===modal)hide();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)hide();});
  }
})();
