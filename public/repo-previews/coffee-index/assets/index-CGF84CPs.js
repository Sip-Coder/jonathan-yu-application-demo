(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const l=3.5,g=3.69,m=[{city:"San Francisco",state:"CA",region:"West",price:4.65,rent:"very high",notes:"Dense cafe corridors and premium retail rents push the index well above baseline."},{city:"New York",state:"NY",region:"Northeast",price:4.5,rent:"very high",notes:"High labor and lease costs make a solo espresso one of the priciest everyday rituals."},{city:"Seattle",state:"WA",region:"West",price:4.35,rent:"high",notes:"Specialty coffee density keeps quality high, while wages and rents hold prices elevated."},{city:"Los Angeles",state:"CA",region:"West",price:4.3,rent:"high",notes:"A large specialty scene and high operating costs lift the market above the national baseline."},{city:"Boston",state:"MA",region:"Northeast",price:4.15,rent:"high",notes:"Compact urban demand and high storefront costs keep the index in the premium tier."},{city:"Denver",state:"CO",region:"Mountain",price:3.95,rent:"medium-high",notes:"Strong independent coffee demand puts Denver above the national espresso baseline."},{city:"Chicago",state:"IL",region:"Midwest",price:3.85,rent:"medium-high",notes:"Large-city costs and a deep cafe market keep prices moderately above baseline."},{city:"Miami",state:"FL",region:"South",price:3.8,rent:"medium-high",notes:"Tourism, service labor, and premium neighborhoods pull the index higher."},{city:"Austin",state:"TX",region:"South",price:3.75,rent:"medium-high",notes:"Rapid growth and a strong independent cafe culture keep prices slightly above baseline."},{city:"Phoenix",state:"AZ",region:"Southwest",price:3.6,rent:"medium",notes:"A spread-out metro and mixed chain-independent market lands close to the baseline."},{city:"Atlanta",state:"GA",region:"South",price:3.55,rent:"medium",notes:"Urban neighborhood cafes average just above the national estimate."},{city:"Nashville",state:"TN",region:"South",price:3.45,rent:"medium",notes:"Growing cafe demand is balanced by lower average operating costs than coastal markets."},{city:"Detroit",state:"MI",region:"Midwest",price:3.25,rent:"medium-low",notes:"Lower storefront costs keep the espresso index below the national baseline."},{city:"Kansas City",state:"MO",region:"Midwest",price:3.15,rent:"medium-low",notes:"A competitive local market creates a lower-cost counter experience."},{city:"Omaha",state:"NE",region:"Midwest",price:3.05,rent:"low",notes:"Lower rent and labor pressure place Omaha among the most affordable sampled markets."}],o=e=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(e),h=e=>Math.round(e/l*100),p=[...m].sort((e,a)=>a.price-e.price),d=p[p.length-1],c=p[0],b=c.price-d.price,v=Object.values(m.reduce((e,a)=>(e[a.region]??={region:a.region,total:0,count:0},e[a.region].total+=a.price,e[a.region].count+=1,e),{})).map(e=>({region:e.region,price:e.total/e.count,count:e.count})).sort((e,a)=>a.price-e.price),w=document.querySelector("#app");w.innerHTML=`
  <main class="site-shell">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__copy">
        <p class="eyebrow">Coffee Index / United States</p>
        <h1 id="hero-title">What a solo espresso costs across the country.</h1>
        <p class="lede">
          A local-first Vite dashboard for comparing cafe espresso prices against a national
          single-shot baseline. The city prices are modeled estimates for demo use, anchored to
          current public coffee pricing context.
        </p>
        <div class="hero__actions" aria-label="Primary insights">
          <a class="button" href="#markets">Explore markets</a>
          <a class="button button--ghost" href="#methodology">See methodology</a>
        </div>
      </div>
      <div class="hero-card" aria-label="National espresso benchmark">
        <div class="cup-orbit" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p class="hero-card__label">National baseline</p>
        <strong>${o(l)}</strong>
        <span>modeled average solo espresso</span>
      </div>
    </section>

    <section class="stats-grid" aria-label="Index summary">
      <article class="stat-card stat-card--ink">
        <span>Highest sampled market</span>
        <strong>${c.city}</strong>
        <p>${o(c.price)} per solo shot, index ${h(c.price)}</p>
      </article>
      <article class="stat-card">
        <span>Lowest sampled market</span>
        <strong>${d.city}</strong>
        <p>${o(d.price)} per solo shot, index ${h(d.price)}</p>
      </article>
      <article class="stat-card">
        <span>Sample spread</span>
        <strong>${o(b)}</strong>
        <p>Difference between the modeled high and low markets</p>
      </article>
      <article class="stat-card">
        <span>Regular coffee context</span>
        <strong>${o(g)}</strong>
        <p>Toast March 2026 median regular hot coffee benchmark</p>
      </article>
    </section>

    <section class="panel" id="markets">
      <div class="section-heading">
        <p class="eyebrow">Market Ranking</p>
        <h2>Coffee Index Ranking</h2>
        <p>
          Index value compares each city to the ${o(l)}
          national espresso baseline. Baseline equals 100.
        </p>
      </div>
      <div class="toolbar" role="search">
        <label for="market-search">Search city, state, or region</label>
        <input id="market-search" type="search" placeholder="Try Seattle, TX, Midwest..." autocomplete="off" />
      </div>
      <div class="market-list" id="market-list"></div>
    </section>

    <section class="split-panel">
      <article class="panel panel--compact">
        <div class="section-heading">
          <p class="eyebrow">Regional Signal</p>
          <h2>Average by region</h2>
        </div>
        <div class="region-bars">
          ${v.map(e=>`
                <div class="region-row">
                  <div>
                    <strong>${e.region}</strong>
                    <span>${e.count} sampled market${e.count===1?"":"s"}</span>
                  </div>
                  <div class="region-meter" aria-label="${e.region} average ${o(e.price)}">
                    <span style="width: ${Math.max(24,e.price/c.price*100)}%"></span>
                  </div>
                  <b>${o(e.price)}</b>
                </div>
              `).join("")}
        </div>
      </article>

      <article class="panel panel--compact roaster-note">
        <p class="eyebrow">Counter Economics</p>
        <h2>What moves the espresso tab?</h2>
        <p>
          A tiny cup carries a full shop model: green coffee, roast loss, barista labor, milk-adjacent
          menu pricing, rent, equipment, utilities, card fees, and local taxes. That is why espresso
          can feel cheap in volume and expensive at the register.
        </p>
        <div class="factor-grid" aria-label="Main price factors">
          <span>Rent</span>
          <span>Labor</span>
          <span>Bean cost</span>
          <span>Demand</span>
          <span>Taxes</span>
          <span>Equipment</span>
        </div>
      </article>
    </section>

    <section class="methodology" id="methodology">
      <p class="eyebrow">Methodology</p>
      <h2>Transparent by design</h2>
      <p>
        This first version ships with a static, modeled U.S. city sample so it works instantly on localhost.
        The national espresso anchor uses a current public cafe espresso estimate of ${o(l)}
        for a single shot. The regular hot coffee benchmark uses Toast's March 2026 median of
        ${o(g)} as a broader cafe-price context point.
      </p>
      <div class="source-links">
        <a href="https://latestcost.com/average-coffee-price-cost/" target="_blank" rel="noreferrer">
          Espresso cafe estimate source
        </a>
        <a href="https://pos.toasttab.com/blog/data/coffee-prices" target="_blank" rel="noreferrer">
          Toast coffee price benchmark
        </a>
      </div>
    </section>
  </main>
`;const u=document.querySelector("#market-list"),f=document.querySelector("#market-search");function y(e){if(!e.length){u.innerHTML=`
      <div class="empty-state">
        <strong>No market found.</strong>
        <span>Try a broader city, state, or region search.</span>
      </div>
    `;return}const a=Math.max(...m.map(t=>t.price));u.innerHTML=e.map((t,i)=>{const s=h(t.price),r=t.price-l,n=r===0?"at baseline":`${r>0?"+":""}${o(r)} vs baseline`;return`
        <article class="market-card" style="--delay: ${i*45}ms">
          <div class="market-card__rank">${String(i+1).padStart(2,"0")}</div>
          <div class="market-card__body">
            <div class="market-card__header">
              <div>
                <h3>${t.city}</h3>
                <p>${t.state} / ${t.region} / ${t.rent} operating-cost pressure</p>
              </div>
              <strong>${o(t.price)}</strong>
            </div>
            <div class="index-track" aria-label="${t.city} espresso index ${s}">
              <span style="width: ${t.price/a*100}%"></span>
            </div>
            <div class="market-card__footer">
              <span>Index ${s}</span>
              <span>${n}</span>
            </div>
            <p class="market-card__notes">${t.notes}</p>
          </div>
        </article>
      `}).join("")}function k(){const e=f.value.trim().toLowerCase(),a=p.filter(t=>[t.city,t.state,t.region,t.rent,t.notes].join(" ").toLowerCase().includes(e));y(a)}f.addEventListener("input",k);y(p);
