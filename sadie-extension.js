/* Beans & Bloom — Sadie's Turning Point chapter.
   This add-on extends the existing site without changing its Home or Identity HTML/CSS. */
(() => {
  if (document.getElementById('sadie')) return;
  const finale = document.getElementById('finale');
  const identity = document.getElementById('identity');
  const headerNav = document.querySelector('.site-header nav');
  if (!finale || !identity || !headerNav || typeof showScreen !== 'function' || !Array.isArray(screenIds)) {
    console.warn('Pivot: existing website layout not found.');
    return;
  }

  const page = document.createElement('section');
  page.id = 'sadie';
  page.className = 'screen sadie-page';
  page.hidden = true;
  page.setAttribute('aria-labelledby', 'sadie-title');
  page.innerHTML = `
    <div class="sadie-inner">
      <div class="sadie-topline"><span>CHAPTER 03 / PIVOT</span><span class="sadie-badge">OPERATIONS · OUR TURNING POINT</span></div>
      <p class="sadie-eyebrow">BIGGEST CHALLENGES &amp; HOW WE PIVOTED</p>
      <h2 id="sadie-title">We noticed the drift.<br><em>Then changed direction.</em></h2>
      <p class="sadie-lede">Growing a café was never just about the numbers. We had to notice when our decisions were moving away from the values we started with — and work together to respond.</p>
      <div class="sadie-comparison" aria-label="From challenges to actions">
        <article class="sadie-panel sadie-challenges">
          <div class="sadie-panel-heading"><span class="sadie-count">01</span><h3>Where we had drifted</h3></div>
          <ul>
            <li>Profit and ethos felt in competition</li>
            <li>Employee and community engagement weakened</li>
            <li>Daily decisions no longer fully matched our original goals</li>
          </ul>
        </article>
        <div class="sadie-arrow" aria-hidden="true">➜</div>
        <article class="sadie-panel sadie-pivot pivot-hidden">
          <div class="sadie-panel-heading"><span class="sadie-count">02</span><h3>How we pivoted</h3></div>
          <ul>
            <li>Introduced the local high school band</li>
            <li>Staffed to meet demand without unnecessary pressure</li>
            <li>Maximised employee benefits</li>
            <li>Reconnected profitability with long-term values</li>
          </ul>
        </article>
      </div>
      <button type="button" class="pivot-reveal-btn">
    REVEAL HOW WE PIVOTED →
</button>
      <article class="sadie-takeaway">
        <div class="sadie-takeaway-head">
          <div><span class="sadie-pill">OUR TURNING POINT</span><h3>What changed?</h3></div>
          <span class="sadie-smallnote">THE LESSON BEHIND THE DECISION</span>
        </div>
        <ul class="sadie-keypoints" id="sadie-keypoints">
          <li><strong>Recognition:</strong> our actions had drifted from our original ethos</li>
          <li><strong>People:</strong> stronger staffing and maximised employee benefits</li>
          <li><strong>Community:</strong> introduced the local high school band</li>
          <li><strong>Customer experience:</strong> better-supported employees could provide better service</li>
          <li><strong>Long-term lesson:</strong> profitability and company values did not have to compete</li>
        </ul>
        <div class="sadie-edit-row"><button type="button" id="sadie-edit" class="sadie-edit">Key points</button><span id="sadie-edit-status"></span></div>
      </article>
      <div class="sadie-footer-nav">
        <button type="button" class="sadie-back">← OUR IDENTITY</button>
        <span>BEANS &amp; BLOOM · TEAM JOURNEY</span>
        <button type="button" class="sadie-next">FINANCE →</button>
      </div>
    </div>`;
  finale.parentNode.insertBefore(page, finale);

/* Reveal our pivot */

const pivotButton = page.querySelector('.pivot-reveal-btn');
const pivotPanel = page.querySelector('.sadie-pivot');

pivotButton.addEventListener('click', () => {
    pivotPanel.classList.remove('pivot-hidden');
    pivotPanel.classList.add('pivot-visible');

    pivotButton.hidden = true;
});


  const finaleIndex = screenIds.indexOf('finale');
  if (!screenIds.includes('sadie')) screenIds.splice(finaleIndex >= 0 ? finaleIndex : screenIds.length, 0, 'sadie');

  // Add a navigation item and attach its listener explicitly (original script binds nav at load).
  const nav = document.createElement('button');
  nav.type = 'button';
  nav.className = 'nav-link';
  nav.dataset.target = 'sadie';
  nav.textContent = "Pivot";
  const finaleNav = headerNav.querySelector('[data-target="finale"]');
  headerNav.insertBefore(nav, finaleNav);
  nav.addEventListener('click', () => showScreen('sadie'));

  // Make the page part of the speaking flow; preserve all other existing sections.
  const identityNext = identity.querySelector('.section-footer [data-target="finale"]');
  if (identityNext) {
    identityNext.dataset.target = 'sadie';
    identityNext.innerHTML = 'OUR TURNING POINT <span>↗</span>';
  }
  const finaleBack = finale.querySelector('.section-footer [data-target="identity"]');
  if (finaleBack) {
    finaleBack.dataset.target = 'sadie';
    finaleBack.textContent = '← OUR TURNING POINT';
  }
  page.querySelector('.sadie-back').addEventListener('click', () => showScreen('identity'));
  page.querySelector('.sadie-next').addEventListener('click', () => showScreen('finale'));

  // Optional on-device note editor (not synced to GitHub or another laptop).
  const keypointList = page.querySelector('#sadie-keypoints');
  const editButton = page.querySelector('#sadie-edit');
  const editStatus = page.querySelector('#sadie-edit-status');
  const storageKey = 'beans-and-bloom-sadie-points-v1';
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (Array.isArray(saved) && saved.length === 5 && saved.every(x => typeof x === 'string')) {
      keypointList.querySelectorAll('li').forEach((li, index) => { li.textContent = saved[index]; });
    }
  } catch (_) { /* Private browsing or local-file contexts may not allow storage. */ }
  let editing = false;
  editButton.addEventListener('click', () => {
    editing = !editing;
    keypointList.querySelectorAll('li').forEach(li => {
      li.contentEditable = String(editing);
      li.setAttribute('spellcheck', 'true');
    });
    keypointList.classList.toggle('editing', editing);
    editButton.textContent = editing ? 'Save key points' : 'Key points';
    if (editing) {
      editStatus.textContent = '';
      keypointList.querySelector('li')?.focus();
    } else {
      try {
        localStorage.setItem(storageKey, JSON.stringify([...keypointList.querySelectorAll('li')].map(li => li.innerText)));
        editStatus.textContent = '';
      } catch (_) { editStatus.textContent = 'Browser storage unavailable; changes may be temporary'; }
    }
  });
  if (location.hash === '#sadie') showScreen('sadie');
})();
