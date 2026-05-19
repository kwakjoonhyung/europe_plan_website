// 유럽 전체 지도 — 실제 waypoint 경로 + Leaflet

function EuropeMap({ onCityClick }) {
  const mapRef = React.useRef(null);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (!window.L || !containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [47.5, 6.0], zoom: 5,
      zoomControl: true, scrollWheelZoom: true,
    });
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 100);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO', subdomains: 'abcd', maxZoom: 20,
    }).addTo(map);

    const cities = Object.values(window.TRIP_DATA.cities);

    // 실제 경로 waypoints 그리기
    window.TRIP_DATA.transitRoutes.forEach(route => {
      const latlngs = route.waypoints;
      const fromCity = window.TRIP_DATA.cities[route.from];
      const toCity = window.TRIP_DATA.cities[route.to];

      // 경로 라인
      const line = L.polyline(latlngs, {
        color: route.color || '#1a1a1a',
        weight: 3,
        opacity: 0.7,
        dashArray: route.mode === 'train' ? null : '8 5',
        lineCap: 'round',
      }).addTo(map);

      // 교통편 뱃지 (중간지점)
      const mid = latlngs[Math.floor(latlngs.length / 2)];
      const modeIcon = route.mode === 'train' ? '🚄' : '🚌';
      const badge = L.divIcon({
        html: `<div class="transit-badge" style="background:#1a1a1a">
          <span style="font-size:13px">${modeIcon}</span>
          <div class="tb-text">${route.from === 'paris' ? '파리→안시' : route.from === 'annecy' ? '안시→샤모니' : '샤모니→밀라노'}</div>
        </div>`,
        className: 'transit-badge-leaflet',
        iconSize: [120, 32], iconAnchor: [60, 16]
      });
      L.marker(mid, { icon: badge, interactive: false }).addTo(map);
    });

    // 도시 마커
    cities.forEach(city => {
      const html = `
        <div class="city-marker" style="--c:${city.color}">
          <div class="cm-pin"><div class="cm-inner"></div></div>
          <div class="cm-label">
            <div class="cm-name">${city.name}</div>
            <div class="cm-en">${city.nameEn}</div>
            <div class="cm-days">Day ${city.days.join(', ')}</div>
          </div>
        </div>`;
      const icon = L.divIcon({ html, className:'city-marker-wrap', iconSize:[120,70], iconAnchor:[60,35] });
      L.marker([city.lat, city.lng], { icon }).addTo(map).on('click', () => onCityClick(city.id));
    });

    const bounds = L.latLngBounds(cities.map(c => [c.lat, c.lng]));
    map.fitBounds(bounds, { padding:[80,80] });

    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [onCityClick]);

  return (
    <div className="europe-map-wrap">
      <div className="europe-map-header">
        <div className="em-tag">Trip Overview</div>
        <h2 className="em-title">유럽 <span className="serif">itinerary</span></h2>
        <p className="em-sub">2026 · 5월 22일 – 31일 · 10일 · 4개 도시 · 마커 클릭 시 상세 지도</p>
      </div>
      <div ref={containerRef} className="leaflet-europe"/>
      <div className="europe-legend">
        {Object.values(window.TRIP_DATA.cities).map(c => (
          <button key={c.id} className="legend-chip" onClick={() => onCityClick(c.id)}>
            <span className="chip-dot" style={{ background:c.color }}/>
            <span className="chip-name">{c.name}</span>
            <span className="chip-en">{c.nameEn}</span>
            <span className="chip-days">D{c.days[0]}–{c.days[c.days.length-1]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

window.EuropeMap = EuropeMap;
