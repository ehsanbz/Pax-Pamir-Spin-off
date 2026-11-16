function groupProfileRelationships(edges, cardId) {
  const groups = new Map();
  for (const edge of edges) {
    if (edge.source !== cardId && edge.target !== cardId) continue;
    const otherId = edge.source === cardId ? edge.target : edge.source;
    if (!groups.has(otherId)) groups.set(otherId, []);
    groups.get(otherId).push(edge);
  }
  return groups;
}

// These records have no counterpart written from the target's perspective.
const reverseRelationshipLabels = {
  '1:40': ['Mohan Lal worked within the British mission’s intelligence network.', 'موهن لعل در شبکهٔ اطلاعاتی هیئت بریتانیا فعالیت می‌کرد.'],
  '5:24': ['Allied with Shah Shuja in the plan to restore him to the throne.', 'در طرح بازگرداندن شاه شجاع به تخت با او متحد شد.'],
  '6:7': ['After his return and consolidation of power, this figure was imprisoned.', 'پس از بازگشت و تحکیم قدرت دوست‌محمد خان، این شخص زندانی شد.'],
  '21:23': ['Alexander Burnes served under him in a political role.', 'الکساندر برنز در مقام سیاسی زیر نظر او خدمت کرد.'],
  '25:5': ['Had ties to this figure while claiming the throne as a Sadozai.', 'در دوران ادعای سلطنت به‌عنوان مدعی سدوزایی با این شخص ارتباط داشت.'],
  '25:24': ['This figure served in his establishment.', 'این شخص در دستگاه او خدمت کرد.'],
  '25:7': ['Had ties to this figure through his military service.', 'از طریق خدمت نظامی این شخص با او ارتباط داشت.'],
  '41:72': ['This figure had ties to his political network.', 'این شخص با شبکهٔ سیاسی او ارتباط داشت.'],
  '45:7': ['This figure was involved in the power networks of the emir and his Barakzai rivals.', 'این شخص در شبکه‌های قدرت امیر و رقیبان بارکزایی او نقش داشت.'],
  '45:5': ['This figure joined him and the invading forces in 1839.', 'این شخص در ۱۸۳۹ به او و نیروهای مهاجم پیوست.'],
  '51:5': ['Returned with the help of this commander’s army.', 'با کمک سپاه این فرمانده بازگشت.'],
  '51:40': ['His political mission cooperated with this military commander.', 'هیئت سیاسی او با این فرمانده نظامی همکاری داشت.'],
  '56:77': ['His siege of Herat shaped his changing political relationship with this figure.', 'محاصرهٔ هرات بر رابطهٔ سیاسی در حال تغییر او با این شخص اثر گذاشت.'],
  '20:77': ['The British military training mission operated in Iran during his reign.', 'هیئت آموزش نظامی بریتانیا در دورهٔ سلطنت او در ایران فعالیت داشت.'],
  '68:77': ['This minister helped secure his throne and was killed on his orders in 1835.', 'این وزیر در تثبیت سلطنت او نقش داشت و در ۱۸۳۵ به فرمان او کشته شد.'],
  '69:86': ['His mission formed part of the Russian network between Iran and Afghanistan.', 'مأموریت او بخشی از شبکهٔ روسیه میان ایران و افغانستان بود.'],
  '70:75': ['Negotiated the Treaty of Turkmenchay with this envoy.', 'با این فرستاده بر سر عهدنامهٔ ترکمانچای مذاکره کرد.'],
  '70:76': ['The embassy crisis occurred during his reign and was followed by a mission of apology.', 'بحران سفارت در دورهٔ سلطنت او رخ داد و پس از آن هیئتی برای عذرخواهی اعزام شد.'],
  '72:5': ['While in exile at Ludhiana, he was under Claude Wade’s political supervision.', 'در تبعید در لودیانا زیر نظر سیاسی کلود وید بود.'],
  '72:24': ['Dealt with Britain through Claude Wade as an intermediary.', 'کلود وید در روابط او با بریتانیا میانجی بود.'],
  '72:7': ['Faced the 1839 invasion, whose Khyber axis involved Claude Wade.', 'در ۱۸۳۹ با تهاجمی روبه‌رو شد که کلود وید در محور خیبر آن نقش داشت.'],
  '23:24': ['His power shaped the context of Henry Pottinger’s diplomacy in Sind.', 'قدرت او بر زمینهٔ فعالیت دیپلماتیک هنری پاتینجر در سند اثر گذاشت.'],
  '33:24': ['This commander was linked to his Sikh state through Gulab Singh of Jammu.', 'این فرمانده از طریق گلاب سینگ جامو با دولت سیک او پیوند داشت.'],
  '35:7': ['Clashed with Sikh forces under Hari Singh Nalwa over Jamrud and the western frontier.', 'بر سر جمرود و مرز غربی با نیروهای سیک به فرماندهی هری سینگ نالوا درگیر شد.'],
  '35:3': ['Opposed Hari Singh Nalwa’s Sikh forces at Jamrud in 1837.', 'در ۱۸۳۷ در جمرود با نیروهای سیک هری سینگ نالوا روبه‌رو شد.'],
  '22:20': ['Rawlinson supported his journey through institutional channels and received his medal on his behalf.', 'راولینسون از سفر او در چارچوب نهادی حمایت کرد و مدالش را به نمایندگی از او دریافت کرد.'],
  '86:21': ['His British mission in Kabul rivalled Witkiewicz’s Russian mission.', 'هیئت بریتانیایی او در کابل با هیئت روسی ویتکویچ رقابت داشت.'],
  '89:39': ['Saw this figure as a commercial and intelligence rival. A meeting is unconfirmed.', 'این شخص را رقیب تجاری و اطلاعاتی می‌دانست. دیدار حضوری آن‌ها تأیید نشده است.'],
  '89:24': ['This figure carried letters for him on a Russian commercial mission.', 'این شخص در مأموریتی تجاری از سوی روسیه نامه‌هایی برای او حمل کرد.'],
  '27:39': ['Corresponded with Ahmad Shah of Baltistan in 1822.', 'در ۱۸۲۲ با احمد شاه بلتستان مکاتبه کرد.'],
  '38:24': ['Cooperated militarily with the Akali Sikhs, who retained some independence from his court.', 'با سیک‌های اکالی همکاری نظامی داشت و آنان تا حدی از دربار او مستقل بودند.'],
};

function reverseRelationshipLabel(edge) {
  const labels = reverseRelationshipLabels[`${edge.source}:${edge.target}`];
  return labels?.[document.documentElement.lang === 'en' ? 0 : 1] ?? edge.label;
}

function renderRelationshipDetails(edges, sourceLabel, perspective = false) {
    const bySource = new Map();
    for (const { source, type, label, url, year } of edges) {
      if (!bySource.has(url)) bySource.set(url, []);
      const details = bySource.get(url);
      if (!details.some(detail => detail.type === type && detail.label === label && detail.year === year && (!perspective || detail.source === source))) {
        details.push({ source, type, label, year });
      }
    }
    return [...bySource].map(([url, rows]) => `
      <div class="relation-details">
        ${rows.map(({ source, type, label, year }) => `<div>${perspective ? `<b>${esc(C.get(source).fa)}</b> ` : ''}<span class="pill">${esc(type)}</span> ${esc(label)}${year ? ` <span class="pill">${fa(year)}</span>` : ''}</div>`).join('')}
        ${url ? `<a class="source" href="${safeurl(url)}" target="_blank" rel="noopener">${esc(sourceLabel)} ↗</a>` : ''}
      </div>`).join('');
}

function relatedCardButton(id) {
  const card = C.get(id);
  return `<button class="related-card" data-card="${id}"><img src="${esc(card.image)}" alt="" width="44" loading="lazy">${esc(card.fa)}</button>`;
}

function renderProfileRelationships(groups, cardId, sourceLabel) {
  return [...groups].map(([otherId, edges]) => {
    const relatedPerspective = edges.find(edge => edge.source === otherId);
    const selectedPerspective = edges.find(edge => edge.source === cardId);
    const description = relatedPerspective || {
      ...selectedPerspective,
      label: reverseRelationshipLabel(selectedPerspective),
    };
    return `<div class="relation">${relatedCardButton(otherId)}${renderRelationshipDetails([description], sourceLabel)}</div>`;
  }).join('');
}

function groupNetworkRelationships(edges) {
  const pairs = new Map();
  for (const edge of edges) {
    const source = Math.min(edge.source, edge.target);
    const target = Math.max(edge.source, edge.target);
    const key = `${source}:${target}`;
    if (!pairs.has(key)) pairs.set(key, { source, target, records: [] });
    pairs.get(key).records.push(edge);
  }
  return [...pairs.values()];
}
