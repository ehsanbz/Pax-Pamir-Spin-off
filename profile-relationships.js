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

function renderProfileRelationships(groups, sourceLabel) {
  return [...groups].map(([otherId, edges]) => {
    const bySource = new Map();
    for (const { type, label, url } of edges) {
      if (!bySource.has(url)) bySource.set(url, []);
      const details = bySource.get(url);
      if (!details.some(detail => detail.type === type && detail.label === label)) {
        details.push({ type, label });
      }
    }
    const details = [...bySource].map(([url, rows]) => `
      <div class="relation-details">
        ${rows.map(({ type, label }) => `<div><span class="pill">${esc(type)}</span> ${esc(label)}</div>`).join('')}
        ${url ? `<a class="source" href="${safeurl(url)}" target="_blank" rel="noopener">${esc(sourceLabel)} ↗</a>` : ''}
      </div>`).join('');
    return `<div class="relation"><button data-card="${otherId}">${esc(C.get(otherId).fa)}</button>${details}</div>`;
  }).join('');
}
