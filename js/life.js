/* «Сферы жизни по домам» (18.10.2026, Алина): работа и заработок, бизнес и большие деньги, где деньги и как увеличить доход,
   партнёр и брак, дети, дом, машина, здоровье. Для каждой сферы — знак на куспиде её дома, управители дома (современный и традиционный:
   где стоят, достоинство, ретро), их мажорные аспекты (с какими планетами и какими домами те управляют), планеты в доме, дополнительные
   точки (MC, 8 и 11 дома, Венера, Парс фортуны, Юпитер, управитель Асцендента) и советы «как усилить».
   NLife.build(chart, lang, gender) → { ok, topics:[…] } (ok: false — нет времени рождения, домов нет). Тексты — js/life-texts.js. */
(function (root) {
  'use strict';
  const AC = root.AstroCore;
  const TOPICS = [['work', 6], ['business', 10], ['money', 2], ['partner', 7], ['children', 5], ['home', 4], ['car', 3], ['health', 6]];
  const PL = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  const ASP_PTS = PL.concat(['asc', 'mc', 'node']);
  const MAJOR = ['conj', 'sextile', 'square', 'trine', 'opp'];
  const G = { sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂', jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '⯓', node: '☊', asc: 'AC', mc: 'MC' };
  const AG = { conj: '☌', sextile: '⚹', square: '□', trine: '△', opp: '☍' };
  const GOOD = ['venus', 'jupiter', 'sun'], HARD = ['mars', 'saturn', 'pluto', 'uranus', 'neptune'];

  /** Управители знака: современный и (если другой) традиционный — у Скорпиона Плутон и Марс, у Водолея Уран и Сатурн, у Рыб Нептун и Юпитер. */
  function rulersOf(sign) { const m = AC.RULER[sign], tr = AC.TRAD_RULER[sign]; return m === tr ? [m] : [m, tr]; }
  /** Какими домами управляет точка (по знакам на куспидах, оба управителя). */
  function ruledBy(chart, id) {
    const out = [];
    for (let i = 0; i < 12; i++) { const s = AC.signOf(chart.houses.cusps[i]); if (AC.RULER[s] === id || AC.TRAD_RULER[s] === id) out.push(i + 1); }
    return out;
  }
  function houseOf(chart, id) {
    if (id === 'asc') return 1; if (id === 'mc') return 10;
    const b = chart.byId[id]; return b ? b.house || AC.houseOf(b.lon, chart.houses.cusps) : null;
  }
  /** Характер аспекта: s — гармония, h — напряжение, c — соединение; вес для общего тона (соединение — по второй планете). */
  function natureOf(a, other) {
    if (a.type === 'trine' || a.type === 'sextile') return { n: 's', soft: 1, hard: 0 };
    if (a.type === 'square' || a.type === 'opp') return { n: 'h', soft: 0, hard: 1 };
    return { n: 'c', soft: GOOD.includes(other) ? 1 : 0.3, hard: HARD.includes(other) ? 0.8 : 0 };
  }

  function build(chart, lang, gender) {
    const T = root.NTexts[lang] || root.NTexts.ru, L = (root.NLifeTexts || {})[lang] || (root.NLifeTexts || {}).ru;
    if (!L || !chart || !chart.houses) return { ok: false, topics: [] };
    const g = (s) => T.gend(String(s || ''), gender);
    const by = chart.byId, cusps = chart.houses.cusps;
    const pn = (id) => (T.P[id] ? T.P[id].name : id);
    const area = (n) => (T.H[n] ? T.H[n].area : '');

    // аспекты точки id к планетам и углам (мажорные, сильные первыми)
    const aspOf = (id, topicHouse) => chart.aspects
      .filter((a) => MAJOR.includes(a.type) && (a.a === id || a.b === id))
      .map((a) => ({ a, o: a.a === id ? a.b : a.a }))
      .filter(({ o }) => ASP_PTS.includes(o) && o !== id)
      .sort((x, y) => y.a.strength - x.a.strength)
      .slice(0, 5)
      .map(({ a, o }) => {
        const nt = natureOf(a, o);
        const rules = PL.includes(o) ? ruledBy(chart, o).filter((h) => h !== topicHouse) : [];
        const oh = houseOf(chart, o);
        const areas = rules.slice(0, 2).map((n) => L.f.q((L.lbl.hs || {})[n] || area(n))).filter(Boolean);
        return {
          o, type: a.type, n: nt.n, w: a.strength, soft: nt.soft * a.strength, hard: nt.hard * a.strength, orb: a.orb,
          glyph: `${G[id] || ''}${AG[a.type]}${G[o] || ''}`, name: pn(o), aspName: T.ASP[a.type] ? T.ASP[a.type].name : a.type,
          rules, house: o === 'asc' || o === 'mc' ? null : oh,
          text: g((L.asp[nt.n] || {})[o] || ''), connect: areas.length ? L.f.connect[nt.n](L.f.and(areas)) : '',
        };
      });

    const rulerInfo = (id, topic, topicHouse) => {
      const b = by[id]; if (!b) return null;
      const h = houseOf(chart, id);
      const asps = aspOf(id, topicHouse);
      const notes = [];
      if (b.dignity && L.lbl.dign[b.dignity]) notes.push(L.lbl.dign[b.dignity]);
      if (b.retro) notes.push(L.lbl.retro);
      return {
        id, glyph: G[id], name: pn(id), sign: b.sign, house: h, retro: !!b.retro, dignity: b.dignity || null,
        head: L.f.rulerHead(pn(id), T.S[b.sign].in, h), notes: notes.map(g),
        text: g(L.planet[topic][id] || ''), houseText: g((L.house[topic] || {})[h] || ''), asps,
        rules: ruledBy(chart, id),
      };
    };

    const topics = TOPICS.map(([id, h]) => {
      const tt = L.topic[id];
      const sign = AC.signOf(cusps[h - 1]);
      const rIds = rulersOf(sign);
      const rulers = rIds.map((r) => rulerInfo(r, id, h)).filter(Boolean);
      const main = rulers[0];
      const tenants = chart.points.filter((p) => PL.includes(p.id) && p.house === h && !rIds.includes(p.id))
        .map((p) => ({ id: p.id, glyph: G[p.id], name: pn(p.id), head: `${pn(p.id)} ${T.S[p.sign].in}${p.retro ? ' R' : ''}`, text: g(L.planet[id][p.id] || '') }));
      // ещё и управители, которые сами стоят в своём доме, считаются «жильцами» — их текст уже есть в блоке управителя
      // общий тон: по аспектам главного управителя (второй — с половинным весом)
      let soft = 0, hard = 0;
      rulers.forEach((r, i) => r.asps.forEach((x) => { soft += x.soft * (i ? 0.5 : 1); hard += x.hard * (i ? 0.5 : 1); }));
      const tone = soft + hard < 0.25 ? 'none' : soft > hard * 1.6 ? 'soft' : hard > soft * 1.6 ? 'hard' : 'mix';
      // дополнительные точки
      const extras = [];
      const H = (n) => T.H[n] || {};
      if (id === 'work' && by.mc && T.mc && T.mc[by.mc.sign]) extras.push({ label: L.lbl.mc, text: g(T.mc[by.mc.sign]) });
      if (id === 'business') {
        const s8 = AC.signOf(cusps[7]), r8 = rulersOf(s8)[0], h8 = houseOf(chart, r8);
        const t8 = chart.points.filter((p) => PL.includes(p.id) && p.house === 8).map((p) => pn(p.id));
        extras.push({ label: L.lbl.big, text: g([L.big.sign[s8], L.f.bigRuler(pn(r8), h8) + ' ' + (L.big.house[h8] || ''), t8.length ? L.f.tenant8(L.f.and(t8)) : ''].filter(Boolean).join(' ')) });
        const s11 = AC.signOf(cusps[10]);
        extras.push({ label: L.lbl.profit, text: g(L.f.profit(T.S[s11].in, T.S[s11].money || '')) });
      }
      if (id === 'money') {
        if (by.jupiter) extras.push({ label: L.lbl.jupiter, text: g(L.f.jup(houseOf(chart, 'jupiter'), area(houseOf(chart, 'jupiter')))) });
        if (by.fortune) { const fh = houseOf(chart, 'fortune'); extras.push({ label: L.lbl.fortune, text: g(L.f.fort(fh, H(fh).where || '')) }); }
      }
      if (id === 'partner' && by.venus && T.venus && T.venus[by.venus.sign]) extras.push({ label: L.lbl.venus, text: g(T.venus[by.venus.sign]) });
      if (id === 'health' && by.asc) {
        const ar = AC.RULER[by.asc.sign], ah = houseOf(chart, ar);
        if (by[ar]) extras.push({ label: L.lbl.vital, text: g(L.f.vital(pn(ar), T.S[by[ar].sign].in, ah, H(ah).where || '')) });
      }
      // советы: где ключ, на что опереться (гармоничные аспекты управителей), чего остерегаться (напряжённые)
      const advice = [];
      if (main && main.house) advice.push(g(L.f.grow(main.house, H(main.house).with || '')));
      if (id === 'money' && L.moneyUp && L.moneyUp[sign]) advice.push(g(L.moneyUp[sign]));
      const all = rulers.flatMap((r) => r.asps);
      const seen = new Set();
      const helpers = all.filter((x) => x.n === 's' || (x.n === 'c' && GOOD.includes(x.o))).sort((a, b) => b.w - a.w).filter((x) => !seen.has(x.o) && seen.add(x.o)).slice(0, 2);
      for (const x of helpers) advice.push(g(L.f.helper(x.name, x.house, (L.asp.s || {})[x.o] || x.text, x.house ? H(x.house).to : '')));
      if (id === 'money') {
        const jh = houseOf(chart, 'jupiter'), fh = by.fortune ? houseOf(chart, 'fortune') : null;
        if (jh && !helpers.some((x) => x.o === 'jupiter')) advice.push(g(L.f.jupAct(H(jh).to || '')));
        if (fh && fh !== main.house) advice.push(g(L.f.fortAct(H(fh).where || '')));
      }
      const cautions = all.filter((x) => x.n === 'h' || (x.n === 'c' && HARD.includes(x.o))).sort((a, b) => b.w - a.w).filter((x) => !seen.has('h' + x.o) && seen.add('h' + x.o)).slice(0, 2)
        .map((x) => g(L.f.caution(x.name, (L.asp.h || {})[x.o] || x.text)));
      return {
        id, house: h, title: tt.title, what: tt.sub, icon: tt.icon, sign, signName: T.S[sign].name,
        summary: main ? L.f.sub(T.S[sign].name, main.name, main.house) : '',
        lead: g(L.sign[id][sign] || ''), tone, toneText: (id === 'health' && L.lbl.toneHealth ? L.lbl.toneHealth : L.lbl.tone)[tone] || '', rulers, tenants, extras, advice, cautions,
        adviceTitle: id === 'money' ? L.lbl.moneyUp : L.lbl.advice, note: id === 'health' ? L.lbl.health : '',
      };
    });
    return { ok: true, topics, lbl: L.lbl, f: L.f };
  }

  root.NLife = { build, rulersOf, ruledBy, TOPICS };
})(typeof window !== 'undefined' ? window : globalThis);
