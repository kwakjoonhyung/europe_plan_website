// Day별 상세 일정 뷰 — POI 클릭 시 지도 이동

function DayView({ dayN, onBack, onCityJump }) {
  const day = window.TRIP_DATA.days.find(d => d.n === dayN);
  if (!day) return null;
  const city    = window.TRIP_DATA.cities[day.city];
  const toCity  = day.toCity ? window.TRIP_DATA.cities[day.toCity] : null;
  const hotel   = window.TRIP_DATA.hotels.find(h => h.city === (toCity?.id || city.id));
  const allPois = window.TRIP_DATA.pois[city.id] || [];

  const totalDays = window.TRIP_DATA.days.length;
  const prev = dayN > 1 ? dayN - 1 : null;
  const next = dayN < totalDays ? dayN + 1 : null;

  const typeLabel = {
    flight:"항공", train:"기차", bus:"버스", arrive:"도착", depart:"출발",
    hotel:"숙소", sight:"관광", food:"식사", shop:"쇼핑", spa:"온천"
  };

  // POI가 있는 항목 클릭 → 도시 지도 + 해당 day 하이라이트
  function handleItemClick(item) {
    if (item.poi) {
      onCityJump(city.id, dayN);
    }
  }

  return (
    <div className="day-view-wrap">
      <div className="dv-header">
        <button className="back-btn" onClick={onBack}><span>←</span><span>전체 일정</span></button>
        <div className="dv-nav">
          {prev && <button className="dv-nav-btn" onClick={() => window.__goDay(prev)}>← Day {prev}</button>}
          {next && <button className="dv-nav-btn" onClick={() => window.__goDay(next)}>Day {next} →</button>}
        </div>
      </div>

      <div className="dv-hero" style={{ background:`linear-gradient(135deg, ${city.color}14, ${city.color}04)` }}>
        <div className="dv-hero-left">
          <div className="dv-day-num serif" style={{ color:city.color }}>
            Day <span className="big">{String(day.n).padStart(2,'0')}</span>
          </div>
          <div className="dv-date">{day.dateLabel}</div>
          <h1 className="dv-title">{day.title}</h1>
          <p className="dv-summary">{day.summary}</p>
          <div className="dv-city-chips">
            <button className="dv-city-chip" onClick={() => onCityJump(city.id, dayN)} style={{ borderColor:city.color }}>
              <span className="dot" style={{ background:city.color }}/>
              {city.name} 지도에서 보기
            </button>
            {toCity && (
              <>
                <span className="arrow">→</span>
                <button className="dv-city-chip" onClick={() => onCityJump(toCity.id, null)} style={{ borderColor:toCity.color }}>
                  <span className="dot" style={{ background:toCity.color }}/>
                  {toCity.name} 지도 보기
                </button>
              </>
            )}
          </div>
        </div>
        <div className="dv-hero-right">
          <DayProgressDots totalDays={totalDays} currentDay={day.n}/>
        </div>
      </div>

      <div className="dv-body">
        <div className="dv-timeline">
          <h3 className="section-h">타임라인</h3>
          <p className="section-hint">📍 명소가 있는 항목을 클릭하면 지도로 이동해요</p>
          <div className="timeline">
            {day.items.map((item, i) => {
              const hasPoi = !!item.poi;
              const poiData = item.poi ? allPois.find(p => p.id === item.poi) : null;
              return (
                <div key={i}
                  className={`tl-item type-${item.type} ${hasPoi ? 'has-poi' : ''}`}
                  onClick={() => hasPoi && handleItemClick(item)}
                  style={{ cursor: hasPoi ? 'pointer' : 'default' }}>
                  <div className="tl-time">{item.time}</div>
                  <div className="tl-dot-col">
                    <div className="tl-dot" style={{ background:city.color }}/>
                    {i < day.items.length - 1 && <div className="tl-line"/>}
                  </div>
                  <div className="tl-card">
                    <div className="tl-card-head">
                      <span className="tl-label">{item.label}</span>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span className="tl-type-tag">{typeLabel[item.type] || item.type}</span>
                        {hasPoi && <span className="tl-map-hint" style={{ color:city.color }}>지도 ↗</span>}
                      </div>
                    </div>
                    {item.note && <div className="tl-note">{item.note}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dv-side">
          {hotel && (
            <div className="dv-hotel-card">
              <div className="card-tag">오늘 밤 숙소</div>
              <PoiIcon kind="hotel" color="#1a1a1a" size={36}/>
              <div className="hotel-name">{hotel.name}</div>
              <div className="hotel-en serif">{hotel.nameEn}</div>
              <div className="hotel-meta">
                <span>{hotel.nights}</span><span>·</span><span>{hotel.district}</span>
              </div>
              <div className="hotel-status">✓ 확정</div>
            </div>
          )}
          <TransportCard day={day}/>
          <TipsCard day={day}/>
        </div>
      </div>
    </div>
  );
}

function DayProgressDots({ totalDays, currentDay }) {
  return (
    <div className="day-dots-wrap">
      <div className="day-dots-label">진행</div>
      <div className="day-dots">
        {Array.from({ length:totalDays }, (_, i) => {
          const n = i + 1;
          const state = n < currentDay ? 'past' : n === currentDay ? 'now' : 'future';
          return (
            <div key={n} className={`day-dot ${state}`} onClick={() => window.__goDay(n)}>
              <span>{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TransportCard({ day }) {
  const transports = day.items.filter(i => ['flight','train','bus'].includes(i.type));
  if (transports.length === 0) return null;
  const icons = { flight:'✈', train:'🚄', bus:'🚌' };
  return (
    <div className="dv-transport-card">
      <div className="card-tag">교통편</div>
      {transports.map((t, i) => (
        <div key={i} className="transport-item">
          <div className="tp-icon">{icons[t.type] || '→'}</div>
          <div>
            <div className="tp-time">{t.time}</div>
            <div className="tp-label">{t.label}</div>
            {t.note && <div className="tp-note">{t.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function TipsCard({ day }) {
  const tips = {
    1: "장시간 비행 후 저녁 바토무슈로 파리 첫 인상을 강으로 느껴보세요.",
    2: "오르세는 오전 일찍 입장하면 한산해요. 몽마르트 소매치기 조심!",
    3: "베르사유 오전 9시 개장에 맞춰 입장하면 줄이 짧아요. 월요일 휴관.",
    4: "지베르니는 5월이 꽃이 가장 만발하는 최적 시기예요. 예약 필수!",
    5: "TGV는 출발 30분 전 승강장 확인. 리옹역은 규모가 크니 여유롭게.",
    6: "블라블라카 짐 규정 확인. 안시→샤모니 약 1시간 20분 소요.",
    7: "에귀 뒤 미디는 기온이 낮으니 패딩 필수. 고산증 주의 (3,842m).",
    8: "몽탕베르 빙하동굴은 미끄러우니 운동화. 버스 짐칸 크기 확인.",
    9: "브레라→두오모→나빌리오 순서로 걸어다닐 수 있어요. 저녁 아페리티보!",
    10: "귀국 당일 수하물 무게 꼭 확인하세요."
  };
  const tip = tips[day.n];
  if (!tip) return null;
  return (
    <div className="dv-tips-card">
      <div className="card-tag">오늘의 팁</div>
      <p className="tip-text">{tip}</p>
    </div>
  );
}

window.DayView = DayView;
