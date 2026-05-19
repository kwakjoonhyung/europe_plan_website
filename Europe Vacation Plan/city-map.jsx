// 도시별 Leaflet 지도 — Day 하이라이트 + 실제 교통경로 (Day 토글 없음)

function CityMap({ cityId, onBack, onDaySelect, preselectedDay }) {
  const city    = window.TRIP_DATA.cities[cityId];
  const allPois = window.TRIP_DATA.pois[cityId] || [];
  const [hoveredPoi, setHoveredPoi] = React.useState(null);
  const [showOutskirts, setShowOutskirts] = React.useState(true);
  const [tileStyle, setTileStyle] = React.useState('watercolor');
  const mapRef       = React.useRef(null);
  const markersRef   = React.useRef({});
  const routesRef    = React.useRef([]);
  const tileRefs     = React.useRef({ base: null });
  const containerRef = React.useRef(null);

  const activeDay     = preselectedDay || null;
  const activeDayData = window.TRIP_DATA.days.find(d => d.n === activeDay);

  const mainPois      = allPois.filter(p => !p.outskirts);
  const outskirtsPois = allPois.filter(p => p.outskirts);
  const visiblePois   = showOutskirts ? allPois : mainPois;

  const activeDayPoiIds = React.useMemo(() => {
    if (!activeDayData) return new Set();
    const ids = new Set();
    activeDayData.items.forEach(it => { if (it.poi) ids.add(it.poi); });
    return ids;
  }, [activeDay, cityId]);

  const cityHotel = allPois.find(p => p.kind === 'hotel');

  const tiles = {
    watercolor: { base:'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', attr:'© OpenStreetMap © CARTO', sub:'abcd' },
    toner:      { base:'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',           attr:'© OpenStreetMap © CARTO', sub:'abcd' },
    osm:        { base:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',                       attr:'© OpenStreetMap contributors', sub:'abc' }
  };

  React.useEffect(() => {
    if (!window.L || !containerRef.current) return;
    const map = L.map(containerRef.current, {
      center:[city.lat, city.lng], zoom:city.zoom,
      zoomControl:true, scrollWheelZoom:true,
    });
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 100);
    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      markersRef.current = {}; routesRef.current = []; tileRefs.current = { base:null };
    };
  }, [cityId]);

  React.useEffect(() => {
    const map = mapRef.current; if (!map) return;
    const t = tiles[tileStyle];
    if (tileRefs.current.base) { map.removeLayer(tileRefs.current.base); tileRefs.current.base = null; }
    tileRefs.current.base = L.tileLayer(t.base, { attribution:t.attr, subdomains:t.sub||'abc', maxZoom:20 }).addTo(map);
  }, [tileStyle, cityId]);

  React.useEffect(() => {
    const map = mapRef.current; if (!map) return;
    Object.values(markersRef.current).forEach(m => map.removeLayer(m));
    markersRef.current = {};

    visiblePois.forEach(poi => {
      const isHotel    = poi.kind === 'hotel';
      const isInActive = activeDay != null && activeDayPoiIds.has(poi.id);
      const isDimmed   = activeDay != null && !isInActive && !isHotel;
      const markerColor = isHotel ? '#1a1a1a' : city.color;
      const bgColor     = isHotel ? city.color : '#fff6e8';

      let cls = 'poi-marker-html';
      if (poi.outskirts) cls += ' outskirts';
      if (isInActive)    cls += ' active-day';
      if (isDimmed)      cls += ' dimmed';

      const html = `
        <div class="${cls}" data-id="${poi.id}">
          <div class="pm-bubble" style="background:${bgColor}; border-color:${markerColor}">
            ${window.iconHtml(poi.kind, markerColor, 2.2)}
          </div>
          <div class="pm-label">${poi.name.length > 14 ? poi.name.slice(0,14)+'…' : poi.name}</div>
          ${poi.day ? `<div class="pm-day" style="background:${city.color}">${poi.day}</div>` : ''}
          ${isInActive ? `<div class="pm-ring" style="border-color:${city.color}"></div>` : ''}
        </div>`;
      const icon = L.divIcon({ html, className:'poi-marker-leaflet', iconSize:[140,50], iconAnchor:[70,44] });
      const marker = L.marker([poi.lat, poi.lng], { icon, riseOnHover:true, zIndexOffset: isInActive ? 1000 : 0 }).addTo(map);
      marker.on('mouseover', () => setHoveredPoi(poi.id));
      marker.on('mouseout',  () => setHoveredPoi(null));
      markersRef.current[poi.id] = marker;
    });

    if (activeDay == null && visiblePois.length > 0) {
      const valid = visiblePois.filter(p => !(p.outskirts && p.kind === 'plane'));
      if (valid.length > 0) {
        const b = L.latLngBounds(valid.map(p => [p.lat, p.lng]));
        if (b.isValid()) map.fitBounds(b, { padding:[50,50], maxZoom:city.zoom+1 });
      }
    }
  }, [visiblePois.length, showOutskirts, cityId, activeDay]);

  React.useEffect(() => {
    const map = mapRef.current; if (!map) return;
    routesRef.current.forEach(r => map.removeLayer(r));
    routesRef.current = [];
    if (!activeDayData) return;

    const dayPois = activeDayData.items
      .filter(it => it.poi)
      .map(it => allPois.find(p => p.id === it.poi))
      .filter(Boolean);

    const walkPoints = [];
    if (cityHotel && activeDayData.city === cityId && dayPois.length > 0)
      walkPoints.push([cityHotel.lat, cityHotel.lng]);
    dayPois.forEach(p => walkPoints.push([p.lat, p.lng]));

    if (walkPoints.length >= 2) {
      routesRef.current.push(L.polyline(walkPoints, {
        color:city.color, weight:3, opacity:0.5, dashArray:'4 8', lineCap:'round'
      }).addTo(map));
    }

    if (activeDayData.toCity && activeDayData.toCity !== cityId) {
      const route = window.TRIP_DATA.transitRoutes.find(
        r => r.from === cityId && r.to === activeDayData.toCity
      );
      if (route) {
        routesRef.current.push(L.polyline(route.waypoints, {
          color:'#1a1a1a', weight:3.5, opacity:0.75,
          dashArray: route.mode === 'train' ? null : '8 5', lineCap:'round'
        }).addTo(map));
        const mid = route.waypoints[Math.floor(route.waypoints.length/2)];
        const nextCity = window.TRIP_DATA.cities[activeDayData.toCity];
        const modeEmoji = route.mode === 'train' ? '🚄' : '🚌';
        const badge = L.divIcon({
          html:`<div class="transit-badge"><span style="font-size:14px">${modeEmoji}</span><div class="tb-text">${route.label} → ${nextCity.name}</div></div>`,
          className:'transit-badge-leaflet', iconSize:[160,36], iconAnchor:[80,18]
        });
        routesRef.current.push(L.marker(mid, { icon:badge, interactive:false }).addTo(map));

        const all = [...walkPoints, ...route.waypoints];
        if (all.length > 0) {
          const b = L.latLngBounds(all);
          if (b.isValid()) map.flyToBounds(b, { padding:[60,60], maxZoom:10, duration:0.8 });
        }
      }
    } else if (dayPois.length > 0) {
      const b = L.latLngBounds(walkPoints.length > 0 ? walkPoints : dayPois.map(p => [p.lat, p.lng]));
      if (b.isValid()) map.flyToBounds(b, { padding:[80,80], maxZoom:14, duration:0.8 });
    }
  }, [activeDay, cityId]);

  React.useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement(); if (!el) return;
      el.classList.toggle('hovered', id === hoveredPoi);
    });
  }, [hoveredPoi]);

  function focusPoi(poi) {
    const map = mapRef.current; if (!map) return;
    map.flyTo([poi.lat, poi.lng], Math.max(map.getZoom(), 15), { duration:0.8 });
    setHoveredPoi(poi.id);
  }

  return (
    <div className="city-map-wrap">
      <div className="city-map-header">
        <button className="back-btn" onClick={onBack}><span>←</span><span>유럽 지도로</span></button>
        <div className="city-title-block">
          <div className="ct-tag" style={{ color:city.color }}>
            <span className="dot" style={{ background:city.color }}/>{city.country}
          </div>
          <h1 className="ct-name">
            <span className="ct-ko">{city.name}</span>
            <span className="ct-en serif">{city.nameEn}</span>
          </h1>
          <p className="ct-desc">{city.desc}</p>
        </div>

        {/* Day 선택된 경우 타임라인 스트립만 표시 (토글 없음) */}
        {activeDay != null && activeDayData && (
          <div className="day-timeline-strip" style={{ borderColor:city.color }}>
            <div className="dts-head">
              <span className="dts-tag" style={{ background:city.color }}>Day {activeDay}</span>
              <span className="dts-date">{activeDayData.dateLabel}</span>
              <button className="dts-open" onClick={() => onDaySelect(activeDay)}>상세 일정 →</button>
            </div>
            <div className="dts-title serif">{activeDayData.title}</div>
            <div className="dts-items">
              {activeDayData.items.map((it, i) => {
                const poiData = it.poi ? allPois.find(p => p.id === it.poi) : null;
                return (
                  <div key={i} className="dts-item"
                    style={{ cursor: poiData ? 'pointer' : 'default' }}
                    onClick={() => poiData && focusPoi(poiData)}>
                    <span className="dts-time">{it.time}</span>
                    <span className="dts-icon" style={{ color:city.color }}>
                      <PoiIcon kind={it.type==='train'?'train':it.type==='bus'?'bus':it.type==='flight'?'plane':it.type==='hotel'?'hotel':it.type==='spa'?'spa':it.type==='food'?'food':it.type==='shop'?'shop':(poiData?.kind||'sight')} color={city.color} size={15}/>
                    </span>
                    <span className="dts-label" style={{ fontWeight: poiData ? 500 : 400 }}>{it.label}</span>
                    {poiData && <span style={{ fontSize:'10px', color:city.color, marginLeft:'auto', flexShrink:0 }}>지도 ↗</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="city-map-toolbar">
        <div className="tile-switcher">
          <span className="ts-label">지도 스타일</span>
          <button className={`ts-btn ${tileStyle==='watercolor'?'active':''}`} onClick={() => setTileStyle('watercolor')}>컬러</button>
          <button className={`ts-btn ${tileStyle==='toner'?'active':''}`} onClick={() => setTileStyle('toner')}>라이트</button>
          <button className={`ts-btn ${tileStyle==='osm'?'active':''}`} onClick={() => setTileStyle('osm')}>표준</button>
        </div>
        {outskirtsPois.length > 0 && (
          <label className="outskirts-toggle">
            <input type="checkbox" checked={showOutskirts} onChange={e => setShowOutskirts(e.target.checked)}/>
            <span>근교 명소 포함 ({outskirtsPois.length})</span>
          </label>
        )}
      </div>

      <div ref={containerRef} className="leaflet-city"/>

      <div className="city-map-footer">
        <div className="legend-row">
          <div className="poi-count">
            <span className="count-num">{activeDay ? activeDayPoiIds.size : visiblePois.length}</span>
            <span className="count-lbl">{activeDay ? `Day ${activeDay} 방문지` : '곳 표시 중'}</span>
          </div>
        </div>
        <div className="poi-list">
          {visiblePois
            .filter(p => activeDay == null || activeDayPoiIds.has(p.id) || p.kind === 'hotel')
            .map(poi => (
            <div key={poi.id}
              className={`poi-row ${hoveredPoi===poi.id?'hover':''} ${poi.outskirts?'is-outskirts':''} ${activeDay!=null&&activeDayPoiIds.has(poi.id)?'is-active-day':''}`}
              onMouseEnter={() => setHoveredPoi(poi.id)}
              onMouseLeave={() => setHoveredPoi(null)}
              onClick={() => focusPoi(poi)}>
              <div className="poi-row-icon">
                <PoiIcon kind={poi.kind} color={poi.kind==='hotel'?'#1a1a1a':city.color} size={22}/>
              </div>
              <div className="poi-row-body">
                <div className="poi-row-name">{poi.name}</div>
                {poi.note && <div className="poi-row-note">{poi.note}</div>}
              </div>
              <div className="poi-row-day" style={{ color:city.color, borderColor:city.color+'40' }}>{poi.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.CityMap = CityMap;
