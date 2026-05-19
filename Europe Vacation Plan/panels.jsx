// 패널들: 전체 일정표, 숙소(PDF 뷰어), 체크리스트, 회화

function OverviewPanel({ onDayClick, onCityClick }) {
  const data = window.TRIP_DATA;
  const cities = Object.values(data.cities);
  return (
    <div className="overview-wrap">
      <div className="ov-header">
        <div className="em-tag">All Days</div>
        <h2 className="em-title">전체 <span className="serif">일정표</span></h2>
        <p className="em-sub">10일 · 4개 도시 · 일정을 클릭하면 지도에서 해당 위치를 확인할 수 있어요</p>
      </div>

      <div className="ov-cities-strip">
        {cities.map(c => (
          <div key={c.id} className="ov-city-block" style={{ borderTopColor:c.color }}>
            <div className="ov-city-head">
              <span className="ov-city-name">{c.name}</span>
              <span className="ov-city-en serif">{c.nameEn}</span>
            </div>
            <div className="ov-city-days">
              {c.days.map(n => {
                const d = data.days.find(x => x.n === n);
                return (
                  <button key={n} className="ov-day-btn" onClick={() => onDayClick(c.id, n)}>
                    <span className="ov-day-num" style={{ color:c.color }}>D{n}</span>
                    <span className="ov-day-title">{d.title}</span>
                    <span className="ov-day-date">{d.dateLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="ov-table-wrap">
        <table className="ov-table">
          <thead>
            <tr><th>Day</th><th>날짜</th><th>도시</th><th>주제</th><th>주요 일정</th><th></th></tr>
          </thead>
          <tbody>
            {data.days.map(d => {
              const c = data.cities[d.city];
              const tc = d.toCity ? data.cities[d.toCity] : null;
              return (
                <tr key={d.n} onClick={() => onDayClick(c.id, d.n)} style={{ cursor:'pointer' }}>
                  <td><span className="ov-td-day serif" style={{ color:c.color }}>{String(d.n).padStart(2,'0')}</span></td>
                  <td>{d.dateLabel}</td>
                  <td>
                    <span className="ov-td-city">
                      <span className="dot" style={{ background:c.color }}/>{c.name}
                      {tc && <><span className="arrow">→</span><span className="dot" style={{ background:tc.color }}/>{tc.name}</>}
                    </span>
                  </td>
                  <td className="ov-td-title">{d.title}</td>
                  <td className="ov-td-sum">{d.summary}</td>
                  <td><span className="ov-td-arrow">지도 →</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// PDF 뷰어 모달
function PdfModal({ hotel, onClose }) {
  React.useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="pdf-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pdf-modal">
        <div className="pdf-modal-header">
          <div>
            <div className="pdf-modal-title">{hotel.name}</div>
            <div className="pdf-modal-sub">{hotel.nights} · {hotel.district}</div>
          </div>
          <button className="pdf-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="pdf-modal-body">
          <iframe
            src={hotel.pdfFile}
            title={hotel.name}
            className="pdf-iframe"
          />
        </div>
        <div className="pdf-modal-footer">
          <a href={hotel.pdfFile} download target="_blank" rel="noopener noreferrer" className="pdf-download-btn">
            ↓ 확정서 다운로드
          </a>
        </div>
      </div>
    </div>
  );
}

function HotelsPanel({ onBack }) {
  const data = window.TRIP_DATA;
  const [openHotel, setOpenHotel] = React.useState(null);

  return (
    <div className="hotels-wrap">
      {openHotel && <PdfModal hotel={openHotel} onClose={() => setOpenHotel(null)}/>}

      <div className="ov-header">
        <button className="back-btn" onClick={onBack}><span>←</span><span>돌아가기</span></button>
        <div className="em-tag">Accommodations</div>
        <h2 className="em-title">숙소 <span className="serif">정보</span></h2>
        <p className="em-sub">확정된 4개 숙소 · 카드를 클릭하면 확정서를 볼 수 있어요</p>
      </div>

      <div className="hotels-grid">
        {data.hotels.map((h, i) => {
          const c = data.cities[h.city];
          return (
            <div key={i} className="hotel-card clickable" style={{ borderTopColor:c.color }}
              onClick={() => setOpenHotel(h)}>
              <div className="hc-head">
                <span className="hc-city" style={{ color:c.color }}>
                  <span className="dot" style={{ background:c.color }}/>{c.name}
                </span>
                <span className="hc-type">{h.type}</span>
              </div>
              <div className="hc-name">{h.name}</div>
              <div className="hc-en serif">{h.nameEn}</div>
              <div className="hc-meta">
                <div>{h.nights}</div>
                <div>{h.district}</div>
              </div>
              <div className="hc-footer">
                <div className="hc-status">✓ 확정</div>
                <div className="hc-pdf-hint">확정서 보기 →</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChecklistPanel({ onBack }) {
  const [state, setState] = React.useState(() => {
    const saved = localStorage.getItem('__tripChecklist_v3');
    if (saved) return JSON.parse(saved);
    return window.TRIP_DATA.checklist;
  });
  React.useEffect(() => { localStorage.setItem('__tripChecklist_v3', JSON.stringify(state)); }, [state]);

  function toggle(section, idx) {
    const copy = { ...state };
    copy[section] = [...copy[section]];
    copy[section][idx] = { ...copy[section][idx], done: !copy[section][idx].done };
    setState(copy);
  }

  const totalCount = Object.values(state).flat().length;
  const doneCount = Object.values(state).flat().filter(x => x.done).length;

  return (
    <div className="checklist-wrap">
      <div className="ov-header">
        <button className="back-btn" onClick={onBack}><span>←</span><span>돌아가기</span></button>
        <div className="em-tag">Pre-trip Checklist</div>
        <h2 className="em-title">여행 <span className="serif">준비</span></h2>
        <p className="em-sub">{doneCount} / {totalCount} 완료 · 자동 저장</p>
        <div className="cl-progress"><div className="cl-bar" style={{ width:`${(doneCount/totalCount)*100}%` }}/></div>
      </div>
      <div className="checklist-grid">
        {Object.entries(state).map(([section, items]) => (
          <div key={section} className="cl-section">
            <h3 className="cl-section-h">{section}</h3>
            <ul className="cl-list">
              {items.map((item, i) => (
                <li key={i} className={`cl-item ${item.done?'done':''}`} onClick={() => toggle(section, i)}>
                  <span className="cl-box">{item.done?'✓':''}</span>
                  <span className="cl-text">{item.t}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhrasesPanel({ onBack }) {
  return (
    <div className="phrases-wrap">
      <div className="ov-header">
        <button className="back-btn" onClick={onBack}><span>←</span><span>돌아가기</span></button>
        <div className="em-tag">Essential Phrases</div>
        <h2 className="em-title">여행 <span className="serif">회화</span></h2>
        <p className="em-sub">프랑스어 · 이탈리아어 핵심 표현</p>
      </div>
      <div className="phrases-table-wrap">
        <table className="phrases-table">
          <thead><tr><th>한국어</th><th>🇫🇷 프랑스어</th><th>🇮🇹 이탈리아어</th></tr></thead>
          <tbody>
            {window.TRIP_DATA.phrases.map((p, i) => (
              <tr key={i}>
                <td className="ph-ko">{p.ko}</td>
                <td className="ph-fr">{p.fr}</td>
                <td className="ph-it">{p.it}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransportPanel({ onBack }) {
  const [openDoc, setOpenDoc] = React.useState(null);

  const flights = [
    {
      id: "dep",
      icon: "✈",
      type: "항공",
      label: "출국 — 아시아나 OZ501",
      date: "2026.05.22 (금)",
      route: "인천 ICN → 파리 CDG",
      time: "10:00 → 17:20 (현지)",
      note: "참좋은여행 패키지 항공",
      status: "확정",
      docs: [
        { name: "곽재섭 e-티켓", file: "uploads/eticket_\uacfd\uc7ac\uc12d.pdf" },
        { name: "변선영 e-티켓", file: "uploads/eticket_\ubcc0\uc120\uc601.pdf" },
        { name: "예약현황 (참좋은여행)", file: "uploads/\ud56d\uacf5\uad8c \uc608\uc57d\ud604\ud669_\ucc38\uc88b\uc740\uc5ec\ud589.pdf" },
      ]
    },
    {
      id: "ret",
      icon: "✈",
      type: "항공",
      label: "귀국 — 밀라노 말펜사 출발",
      date: "2026.05.30 (토)",
      route: "밀라노 MXP → 인천 ICN",
      time: "22:00 → 익일 16:45",
      note: "5/31(일) 16:45 인천 도착",
      status: "확정",
      docs: [
        { name: "곽재섭 e-티켓", file: "uploads/eticket_\uacfd\uc7ac\uc12d.pdf" },
        { name: "변선영 e-티켓", file: "uploads/eticket_\ubcc0\uc120\uc601.pdf" },
      ]
    },
    {
      id: "tgv",
      icon: "🚄",
      type: "TGV",
      label: "TGV — 파리 리옹역 → 안시",
      date: "2026.05.26 (화)",
      route: "Paris Gare de Lyon → Annecy",
      time: "18:46 → 22:33",
      note: "예약 필요 — SNCF 홈페이지",
      status: "예약필요",
      docs: []
    },
    {
      id: "bus1",
      icon: "🚌",
      type: "버스",
      label: "블라블라카 버스 — 안시 → 샤모니",
      date: "2026.05.27 (수)",
      route: "Annecy → Chamonix",
      time: "17:35 → 19:00",
      note: "BlaBlaBus 예약 필요",
      status: "예약필요",
      docs: []
    },
    {
      id: "bus2",
      icon: "🚌",
      type: "버스",
      label: "버스 — 샤모니 → 밀라노",
      date: "2026.05.29 (금)",
      route: "Chamonix → Milano (몽블랑 터널 경유)",
      time: "15:25 → 18:45",
      note: "Flixbus 또는 SAT 버스",
      status: "예약필요",
      docs: []
    },
  ];

  const statusColor = { "확정":"#2a6b3a", "예약필요":"#B8873E", "예정":"#2E7D9A" };

  return (
    <div className="transport-panel-wrap">
      {openDoc && (
        <div className="pdf-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setOpenDoc(null); }}>
          <div className="pdf-modal">
            <div className="pdf-modal-header">
              <div>
                <div className="pdf-modal-title">{openDoc.name}</div>
              </div>
              <button className="pdf-modal-close" onClick={() => setOpenDoc(null)}>✕</button>
            </div>
            <div className="pdf-modal-body">
              <iframe src={openDoc.file} title={openDoc.name} className="pdf-iframe"/>
            </div>
            <div className="pdf-modal-footer">
              <a href={openDoc.file} download target="_blank" rel="noopener noreferrer" className="pdf-download-btn">↓ 다운로드</a>
            </div>
          </div>
        </div>
      )}

      <div className="ov-header">
        <button className="back-btn" onClick={onBack}><span>←</span><span>돌아가기</span></button>
        <div className="em-tag">Transportation</div>
        <h2 className="em-title">교통편 <span className="serif">정보</span></h2>
        <p className="em-sub">항공 · TGV · 버스 · 티켓 확인</p>
      </div>

      <div className="transport-cards">
        {flights.map(f => (
          <div key={f.id} className="tp-card">
            <div className="tp-card-head">
              <span className="tp-card-icon">{f.icon}</span>
              <div className="tp-card-info">
                <div className="tp-card-label">{f.label}</div>
                <div className="tp-card-date">{f.date}</div>
              </div>
              <span className="tp-status-badge" style={{ background: statusColor[f.status]+'18', color: statusColor[f.status], border:`1px solid ${statusColor[f.status]}40` }}>
                {f.status === "확정" ? "✓ " : ""}{f.status}
              </span>
            </div>
            <div className="tp-card-route">
              <div className="tp-route-main">{f.route}</div>
              <div className="tp-route-time">{f.time}</div>
            </div>
            {f.note && <div className="tp-card-note">{f.note}</div>}
            {f.docs.length > 0 && (
              <div className="tp-docs">
                {f.docs.map((d, i) => (
                  <button key={i} className="tp-doc-btn" onClick={() => setOpenDoc(d)}>
                    <span>📄</span> {d.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketsPanel({ onBack }) {
  const [openDoc, setOpenDoc] = React.useState(null);

  const tickets = [
    {
      id: "orsay",
      icon: "🎨",
      name: "오르세 미술관",
      nameEn: "Musée d'Orsay",
      day: "Day 2 · 2026.05.23 (토)",
      time: "09:30 ~ 13:00",
      status: "확정",
      note: "인상주의 컬렉션. M8 Invalides역",
      docs: [
        { name: "오르세 미술관 바우처", file: "uploads/\uc624\ub974\uc138\ubbf8\uc220\uad00 \ubc14\uc6b0\ucc98.pdf" }
      ]
    },
    {
      id: "aiguille",
      icon: "🏔",
      name: "에귀 뒤 미디 케이블카",
      nameEn: "Aiguille du Midi",
      day: "Day 7 · 2026.05.28 (목)",
      time: "09:00 ~ 12:00",
      status: "확정",
      note: "왕복. 해발 3,842m. 호텔 도보 6분",
      docs: [
        { name: "곽재섭 QR티켓", file: "uploads/\uacfd\uc7ac\uc12d_\uc5d0\uadc0\ubbf8\ub514\uc804\ub9dd\ub300qr.pdf" },
        { name: "변선영 QR티켓", file: "uploads/\ubcc0\uc120\uc601_\uc5d0\uadc0\ubbf8\ub514\uc804\ub9dd\ub300qr.pdf" },
      ]
    },
    {
      id: "versailles",
      icon: "🏰",
      name: "베르사유 궁전",
      nameEn: "Château de Versailles",
      day: "Day 3 · 2026.05.24 (일)",
      time: "09:00 ~",
      status: "예정",
      note: "월요일 휴관. RER C 오르세역 → 1시간",
      docs: []
    },
    {
      id: "giverny",
      icon: "🌸",
      name: "모네의 정원 (지베르니)",
      nameEn: "Fondation Monet, Giverny",
      day: "Day 4 · 2026.05.25 (월)",
      time: "09:00 ~",
      status: "예정",
      note: "5월 꽃이 만개. 생라자르역 → 베르농 50분",
      docs: []
    },
    {
      id: "duomo",
      icon: "⛪",
      name: "두오모 성당",
      nameEn: "Duomo di Milano",
      day: "Day 9 · 2026.05.30 (토)",
      time: "13:30 ~",
      status: "예정",
      note: "옥상 테라스 예약 권장",
      docs: []
    },
  ];

  const statusColor = { "확정":"#2a6b3a", "예약필요":"#B8873E", "예정":"#9a9080" };

  return (
    <div className="tickets-panel-wrap">
      {openDoc && (
        <div className="pdf-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setOpenDoc(null); }}>
          <div className="pdf-modal">
            <div className="pdf-modal-header">
              <div><div className="pdf-modal-title">{openDoc.name}</div></div>
              <button className="pdf-modal-close" onClick={() => setOpenDoc(null)}>✕</button>
            </div>
            <div className="pdf-modal-body">
              <iframe src={openDoc.file} title={openDoc.name} className="pdf-iframe"/>
            </div>
            <div className="pdf-modal-footer">
              <a href={openDoc.file} download target="_blank" rel="noopener noreferrer" className="pdf-download-btn">↓ 다운로드</a>
            </div>
          </div>
        </div>
      )}

      <div className="ov-header">
        <button className="back-btn" onClick={onBack}><span>←</span><span>돌아가기</span></button>
        <div className="em-tag">Admission Tickets</div>
        <h2 className="em-title">입장권 <span className="serif">관리</span></h2>
        <p className="em-sub">확정된 티켓 · 추후 추가 예정 항목 포함</p>
      </div>

      <div className="tickets-grid">
        {tickets.map(tk => (
          <div key={tk.id} className={`ticket-card ${tk.docs.length > 0 ? 'has-doc' : ''}`}>
            <div className="ticket-card-head">
              <span className="ticket-icon">{tk.icon}</span>
              <div className="ticket-info">
                <div className="ticket-name">{tk.name}</div>
                <div className="ticket-name-en serif">{tk.nameEn}</div>
              </div>
              <span className="ticket-status" style={{ color: statusColor[tk.status] }}>
                {tk.status === "확정" ? "✓ 확정" : tk.status === "예약필요" ? "예약 필요" : "추후 추가"}
              </span>
            </div>
            <div className="ticket-meta">
              <span className="ticket-day">{tk.day}</span>
              <span className="ticket-time">{tk.time}</span>
            </div>
            {tk.note && <div className="ticket-note">{tk.note}</div>}
            {tk.docs.length > 0 ? (
              <div className="ticket-docs">
                {tk.docs.map((d, i) => (
                  <button key={i} className="ticket-doc-btn" onClick={() => setOpenDoc(d)}>
                    <span>🎫</span> {d.name} <span className="ticket-doc-arrow">→</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="ticket-placeholder">티켓 파일 추후 추가 예정</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

window.TransportPanel = TransportPanel;
window.TicketsPanel = TicketsPanel;
window.HotelsPanel = HotelsPanel;
window.ChecklistPanel = ChecklistPanel;
window.PhrasesPanel = PhrasesPanel;
