/* «Лучшие часы для этого» — подробнее (18.10.2026, Алина: «в описании дня — возможность читать подробнее про лучшие часы»).
   ruler[планета] — что это за час; todo[сфера][планета] — что делать в этот час именно для этой сферы (пары — как в NScore.HOUR_PREF);
   lbl / f — подписи и шаблоны. Окно часа собирает js/pages/today.js → hoursMore / hourDetail. Тексты новые. */
(function (root) {
  'use strict';
  const ru = {
    ruler: {
      sun: 'Час Солнца — время показать себя: встречи с теми, кто решает, выступления, важные решения, старт личных проектов.',
      moon: 'Час Луны — время для людей, дома и чувств: семья, забота, покупки для дома, спокойные разговоры.',
      mercury: 'Час Меркурия — время слов и связей: звонки, переписка, договоры, учёба, поездки, публикации.',
      venus: 'Час Венеры — время любви, красоты и удовольствия: свидания, покупки, подарки, творчество, примирение.',
      mars: 'Час Марса — время действия: спорт, смелые шаги, сложные задачи, где нужен напор. Не для споров.',
      jupiter: 'Час Юпитера — время роста и удачи: просьбы, разговоры о деньгах, учёба, обращение к покровителям, старт крупных дел.',
      saturn: 'Час Сатурна — время серьёзного и долгого: планы, документы, дисциплина, работа на результат. Не для праздника.',
    },
    todo: {
      love: {
        venus: 'Самое время для свидания, комплимента, подарка, первого шага или примирения.',
        moon: 'Хорошо для тёплого разговора по душам, домашнего вечера, заботы о близком человеке.',
        jupiter: 'Хорошо для серьёзного шага: знакомство с родными, предложение, общие планы на будущее.',
      },
      money: {
        jupiter: 'Проси повышение, обсуждай гонорар, подписывай выгодное, делай крупные покупки.',
        venus: 'Хорошо для покупок, продаж, выставления цен и переговоров с клиентами.',
        sun: 'Хорошо для встреч с теми, кто решает: руководство, инвесторы, крупные клиенты.',
      },
      career: {
        sun: 'Покажи результат, выступи, проведи важную встречу — тебя заметят.',
        jupiter: 'Хорошо для собеседования, разговора о должности, просьб к руководству.',
        saturn: 'Хорошо для серьёзной работы: планы, отчёты, документы, долгие задачи.',
      },
      launch: {
        jupiter: 'Лучшее время, чтобы запустить новое — проект, продукт, публикацию — с прицелом на рост.',
        sun: 'Хорошо запускать то, что связано с тобой лично: бренд, выступление, анонс.',
        venus: 'Хорошо запускать красивое и приятное: коллекции, творческие проекты, продажи.',
        mercury: 'Хорошо для анонсов, рассылок, публикаций, запуска сайта или рекламы.',
      },
      talk: {
        mercury: 'Лучшее время для звонков, писем, переговоров, экзаменов и выступлений.',
        jupiter: 'Хорошо для переговоров с выгодой, обучения, консультаций, разговоров о планах.',
        moon: 'Хорошо для мягких, личных разговоров и общения с семьёй.',
      },
      energy: {
        mars: 'Пиковое время для спорта, тяжёлых задач и рывка.',
        sun: 'Хорошо для активности на свежем воздухе и дел, где нужна бодрость.',
      },
      rest: {
        venus: 'Хорошо для красоты, ухода за собой, музыки, прогулки и удовольствия.',
        moon: 'Хорошо для сна, ванны, домашнего уюта и тишины.',
        jupiter: 'Хорошо для путешествий, вдохновения, хобби и встреч с друзьями.',
      },
    },
    lbl: {
      more: 'подробнее', what: 'Что делать в этот час', hour: 'Что за час', sky: 'Небо в эти часы', you: 'Для тебя',
      calm: 'Точных аспектов в эти часы нет — фон ровный, всё решают Луна и сам час.',
      strong: 'В твоей карте эта планета сильная — час работает на тебя особенно хорошо.',
      weak: 'В твоей карте эта планета ослаблена — час помогает, но лучше подготовиться заранее.',
      howT: 'Как выбраны эти часы', moreAll: 'Подробнее про лучшие часы',
    },
    f: {
      head: (gen) => `Час ${gen}`,
      dayRuler: (gen) => `Сегодня ещё и день ${gen} — его часы звучат сильнее обычного.`,
      cut: (a, b) => `Сам планетный час длится ${a}–${b}; показана его часть без Луны без курса и в пределах 7:00–23:00.`,
      natal: (pl, sin, n, w) => `${pl} в твоей карте — ${sin}, ${n} дом: в этот час легче всего даются дела, связанные ${w}.`,
      natalNoH: (pl, sin) => `${pl} в твоей карте — ${sin}.`,
      trOk: (x) => `Сегодня: ${x} — это усиливает час.`,
      trBad: (x) => `Сегодня: ${x} — в этот час действуй аккуратнее.`,
      retro: (pl) => `${pl} сейчас в ретроградном движении: в этот час хорошо возвращаться к старому и доделывать, а новое — с перепроверкой.`,
      how: (list) => `Сутки делятся на 12 «часов» от восхода до заката и 12 — от заката до восхода, поэтому днём и ночью они разной длины. Каждым часом по очереди управляет планета: Сатурн, Юпитер, Марс, Солнце, Венера, Меркурий, Луна. Для этой сферы подходят часы: ${list}. Время Луны без курса вырезано, показаны окна с 7:00 до 23:00 по городу, где ты сейчас.`,
    },
  };
  const en = {
    ruler: {
      sun: 'The hour of the Sun is the time to show yourself: meetings with decision-makers, speeches, important decisions, launching personal projects.',
      moon: 'The hour of the Moon is for people, home and feelings: family, care, shopping for the home, calm conversations.',
      mercury: 'The hour of Mercury is for words and connections: calls, messages, contracts, study, trips, publishing.',
      venus: 'The hour of Venus is for love, beauty and pleasure: dates, shopping, gifts, creativity, making up.',
      mars: 'The hour of Mars is for action: sport, bold steps, hard tasks that need drive. Not for arguments.',
      jupiter: 'The hour of Jupiter is for growth and luck: requests, money talks, study, approaching patrons, starting big things.',
      saturn: 'The hour of Saturn is for serious, long-term work: plans, paperwork, discipline, working towards results. Not for celebrations.',
    },
    todo: {
      love: {
        venus: 'The perfect time for a date, a compliment, a gift, a first step or making up.',
        moon: 'Good for a warm heart-to-heart, an evening at home, caring for someone close.',
        jupiter: 'Good for a serious step: meeting the family, a proposal, shared plans for the future.',
      },
      money: {
        jupiter: 'Ask for a raise, discuss your fee, sign profitable deals, make big purchases.',
        venus: 'Good for shopping, sales, setting prices and talking to clients.',
        sun: 'Good for meetings with decision-makers: management, investors, big clients.',
      },
      career: {
        sun: 'Show your results, speak up, hold an important meeting — you’ll be noticed.',
        jupiter: 'Good for a job interview, a talk about a position, requests to management.',
        saturn: 'Good for serious work: plans, reports, paperwork, long tasks.',
      },
      launch: {
        jupiter: 'The best time to launch something new — a project, product or publication — aiming for growth.',
        sun: 'Good for launching what’s tied to you personally: a brand, a speech, an announcement.',
        venus: 'Good for launching something beautiful and pleasant: collections, creative projects, sales.',
        mercury: 'Good for announcements, newsletters, posts, launching a website or ads.',
      },
      talk: {
        mercury: 'The best time for calls, emails, negotiations, exams and speeches.',
        jupiter: 'Good for profitable negotiations, teaching, consulting, talking about plans.',
        moon: 'Good for gentle, personal conversations and time with family.',
      },
      energy: {
        mars: 'Peak time for sport, heavy tasks and a push.',
        sun: 'Good for outdoor activity and tasks that need energy.',
      },
      rest: {
        venus: 'Good for beauty, self-care, music, a walk and pleasure.',
        moon: 'Good for sleep, a bath, home comfort and quiet.',
        jupiter: 'Good for travel, inspiration, hobbies and meeting friends.',
      },
    },
    lbl: {
      more: 'more', what: 'What to do in this hour', hour: 'What this hour is', sky: 'The sky in these hours', you: 'For you',
      calm: 'No exact aspects in these hours — the background is even; the Moon and the hour itself set the tone.',
      strong: 'This planet is strong in your chart — the hour works especially well for you.',
      weak: 'This planet is weak in your chart — the hour helps, but prepare in advance.',
      howT: 'How these hours are chosen', moreAll: 'More about the best hours',
    },
    f: {
      head: (gen) => `Hour of ${gen}`,
      dayRuler: (gen) => `Today is also the day of ${gen} — its hours ring louder than usual.`,
      cut: (a, b) => `The planetary hour itself runs ${a}–${b}; shown is the part without the void-of-course Moon, between 7:00 and 23:00.`,
      natal: (pl, sin, n, w) => `${pl} in your chart — ${sin}, ${ord(n)} house: in this hour, matters connected ${w} come easiest.`,
      natalNoH: (pl, sin) => `${pl} in your chart — ${sin}.`,
      trOk: (x) => `Today: ${x} — this strengthens the hour.`,
      trBad: (x) => `Today: ${x} — act carefully in this hour.`,
      retro: (pl) => `${pl} is retrograde now: its hour is good for returning to old matters and finishing things; anything new — double-check.`,
      how: (list) => `The day is split into 12 “hours” from sunrise to sunset and 12 from sunset to sunrise, so day and night hours differ in length. Each hour is ruled in turn by a planet: Saturn, Jupiter, Mars, the Sun, Venus, Mercury, the Moon. For this area the hours of ${list} suit best. Void-of-course Moon time is cut out; windows from 7:00 to 23:00 in the city where you are now are shown.`,
    },
  };
  function ord(n) { n = +n; const s = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' })[n % 10] || 'th'; return n + s; }
  root.NHourTexts = { ru, en };
})(typeof window !== 'undefined' ? window : globalThis);
