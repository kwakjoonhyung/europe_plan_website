// 여행 데이터 v2 — 2026.05.22-05.31 최신 스케줄 기반
window.TRIP_DATA = {
  title: "엄마 아빠의 30년 만의 유럽 여행",
  subtitle: "Paris · Annecy · Chamonix · Milano",
  dateRange: "2026.05.22 — 2026.05.31",

  cities: {
    paris: { id:"paris", name:"파리", nameEn:"Paris", country:"France", lat:48.8566, lng:2.3522, zoom:12, color:"#D94F3A", desc:"예술과 낭만의 도시. 오르세미술관부터 몽마르트르, 베르사유까지.", days:[1,2,3,4,5] },
    annecy: { id:"annecy", name:"안시", nameEn:"Annecy", country:"France", lat:45.8992, lng:6.1294, zoom:13, color:"#2E7D9A", desc:"알프스의 베네치아. 에메랄드빛 호수와 중세 골목.", days:[5,6] },
    chamonix: { id:"chamonix", name:"샤모니", nameEn:"Chamonix", country:"France", lat:45.9237, lng:6.8694, zoom:12, color:"#4A6B3A", desc:"몽블랑 기슭의 알프스 마을. 케이블카·산악열차·온천.", days:[6,7,8] },
    milano: { id:"milano", name:"밀라노", nameEn:"Milano", country:"Italy", lat:45.4642, lng:9.1900, zoom:13, color:"#B8873E", desc:"브레라·두오모·나빌리오. 이탈리아 북부 관문.", days:[8,9,10] }
  },

  // 실제 교통경로 waypoints (도시간 이동)
  transitRoutes: [
    {
      from:"paris", to:"annecy", day:5, mode:"train",
      label:"TGV 18:46 → 22:33",
      color:"#D94F3A",
      waypoints:[
        [48.8443,2.3737],[48.5754,2.6567],[48.0983,2.9884],
        [47.3220,3.5120],[46.9827,4.8265],[45.7610,4.8596],
        [45.6888,5.9129],[45.7897,5.9712],[45.9022,6.1236]
      ]
    },
    {
      from:"annecy", to:"chamonix", day:6, mode:"bus",
      label:"블라블라카 17:35 → 19:00",
      color:"#2E7D9A",
      waypoints:[
        [45.9022,6.1236],[45.9236,6.1730],[46.0133,6.2580],
        [46.0825,6.4080],[46.0612,6.5803],[45.9341,6.6343],
        [45.8948,6.7960],[45.9237,6.8694]
      ]
    },
    {
      from:"chamonix", to:"milano", day:8, mode:"bus",
      label:"버스 15:25 → 18:45",
      color:"#4A6B3A",
      waypoints:[
        [45.9237,6.8694],[45.8760,6.9080],[45.8140,6.9680],
        [45.7969,7.0411],[45.7574,7.0025],[45.7370,7.3153],
        [45.5986,7.7943],[45.4663,7.8741],[45.4654,9.1859]
      ]
    }
  ],

  days: [
    {
      n:1, date:"2026-05-22", dateLabel:"5월 22일 (금)", city:"paris",
      title:"인천 → 파리", summary:"출국 · CDG 도착 · 바토무슈 야경",
      items:[
        { time:"06:00", label:"동탄 출발", type:"depart" },
        { time:"10:00", label:"인천 공항 (아시아나)", type:"flight", note:"아시아나 OZ501" },
        { time:"17:20", label:"샤를드골 공항 도착", type:"arrive", poi:"cdg" },
        { time:"19:00", label:"호텔 체크인", type:"hotel", poi:"hotel", note:"홀리데이인 파리 오페라 그랑 블루바르" },
        { time:"20:30", label:"센강 유람선 바토무슈", type:"sight", poi:"batobus", note:"~22:00 · M9 Grands Boulevards→Alma-Marceau 20분" },
      ]
    },
    {
      n:2, date:"2026-05-23", dateLabel:"5월 23일 (토)", city:"paris",
      title:"오르세 · 몽마르트르", summary:"인상주의 거장들 → 언덕 위 보헤미안",
      items:[
        { time:"09:30", label:"오르세 미술관", type:"sight", poi:"orsay", note:"~13:00 · M8 Grands Boulevards→Invalides 20분" },
        { time:"13:00", label:"점심", type:"food" },
        { time:"15:30", label:"몽마르트르 언덕 · 사크레쾨르 성당", type:"sight", poi:"montmartre", note:"~18:30 · M12 Assemblé Nationale→Abbesses 25분" },
        { time:"18:30", label:"저녁", type:"food" },
        { time:"20:00", label:"호텔 복귀", type:"hotel", poi:"hotel" },
      ]
    },
    {
      n:3, date:"2026-05-24", dateLabel:"5월 24일 (일)", city:"paris",
      title:"베르사유 · 개선문", summary:"근교 궁전 당일치기 → 파리 야경",
      items:[
        { time:"09:00", label:"베르사유 궁전", type:"sight", poi:"versailles", note:"~13:00 · RER C 오르세역→베르사유 약 1시간" },
        { time:"13:00", label:"점심 (베르사유)", type:"food" },
        { time:"14:30", label:"베르사유 정원 산책", type:"sight", poi:"versailles", note:"~15:30" },
        { time:"15:30", label:"파리 복귀", type:"train", note:"RER C→RER A 환승 → 개선문역 50분" },
        { time:"17:00", label:"저녁", type:"food" },
        { time:"18:00", label:"개선문 전망대", type:"sight", poi:"arc", note:"~19:00 · 1 Av. de Wagram · M1·2·6 개선문역" },
      ]
    },
    {
      n:4, date:"2026-05-25", dateLabel:"5월 25일 (월)", city:"paris",
      title:"모네의 정원 · 센강 산책", summary:"지베르니 당일치기 → 파리 저녁 산책",
      items:[
        { time:"09:00", label:"모네의 정원 (지베르니)", type:"sight", poi:"giverny", note:"~12:00 · 생라자르역→베르농 50분→셔틀 15분" },
        { time:"12:00", label:"점심 (지베르니)", type:"food" },
        { time:"13:00", label:"모네의 정원 (오후)", type:"sight", poi:"giverny", note:"~14:00" },
        { time:"14:00", label:"파리 복귀", type:"train", note:"셔틀→기차 생라자르역 약 1시간" },
        { time:"15:30", label:"선택 일정", type:"sight", note:"~18:00" },
        { time:"19:00", label:"센강 산책", type:"sight", poi:"seine_walk", note:"~20:00" },
      ]
    },
    {
      n:5, date:"2026-05-26", dateLabel:"5월 26일 (화)", city:"paris", toCity:"annecy",
      title:"아울렛 · 갤러리 라파예트 → 안시",
      summary:"쇼핑 → 리옹역 TGV 출발",
      items:[
        { time:"09:00", label:"라발레빌리지 아울렛 쇼핑", type:"shop", poi:"outlet", note:"~12:00 · Auber역→RER A→Val d'Europe 50분" },
        { time:"12:00", label:"점심", type:"food" },
        { time:"13:30", label:"호텔 복귀", type:"hotel", poi:"hotel", note:"~14:30 · RER A 복귀" },
        { time:"14:30", label:"갤러리 라파예트 백화점", type:"shop", poi:"galeries_lafayette", note:"~16:30" },
        { time:"16:30", label:"호텔 복귀 후 리옹역으로 이동", type:"train", note:"~17:30" },
        { time:"18:46", label:"파리 리옹역 출발 (TGV)", type:"train", poi:"gare_lyon" },
        { time:"22:33", label:"안시 도착 · 체크인", type:"arrive", note:"아파트호텔 아다지오 안시센터" },
      ]
    },
    {
      n:6, date:"2026-05-27", dateLabel:"5월 27일 (수)", city:"annecy", toCity:"chamonix",
      title:"안시 구시가 · 호수 → 샤모니",
      summary:"중세 수로 산책 → 몽블랑 마을 이동",
      items:[
        { time:"09:00", label:"안시 구시가 · 수중감옥 · 안시성", type:"sight", poi:"annecy_old", note:"~12:00" },
        { time:"12:00", label:"점심", type:"food" },
        { time:"13:30", label:"안시 호수 패들보트 · 피크닉", type:"sight", poi:"annecy_lake", note:"~16:00" },
        { time:"16:30", label:"호텔 복귀 및 버스터미널 이동", type:"hotel", note:"~17:00" },
        { time:"17:35", label:"블라블라카 버스 탑승 (안시→샤모니)", type:"bus" },
        { time:"19:00", label:"샤모니 도착 · 체크인", type:"arrive", note:"샬레호텔 르 프리와르" },
      ]
    },
    {
      n:7, date:"2026-05-28", dateLabel:"5월 28일 (목)", city:"chamonix",
      title:"에귀 뒤 미디 · 온천",
      summary:"몽블랑 전망 케이블카 → 트레킹 → QC TERME",
      items:[
        { time:"09:00", label:"에귀 뒤 미디 케이블카", type:"sight", poi:"aiguille", note:"~12:00 · 호텔 도보 6분 · 하산 후 폴랑드레기 트레킹 2시간30분" },
        { time:"12:00", label:"점심", type:"food" },
        { time:"13:30", label:"QC TERME 온천", type:"spa", poi:"therme", note:"~15:30 · 호텔 도보 20분" },
        { time:"15:30", label:"샤모니 시내 관광", type:"sight", poi:"chamonix_town", note:"~18:00" },
        { time:"19:30", label:"선택 일정", type:"sight", note:"~21:00" },
      ]
    },
    {
      n:8, date:"2026-05-29", dateLabel:"5월 29일 (금)", city:"chamonix", toCity:"milano",
      title:"몽탕베르 · 밀라노 이동",
      summary:"빙하동굴 산악열차 → 버스로 이탈리아 국경 통과",
      items:[
        { time:"09:00", label:"몽탕베르 산악열차 · 얼음동굴", type:"sight", poi:"montenvers", note:"~12:00 · 샤모니-몽탕베르 20분 · 곤돌라·얼음동굴" },
        { time:"12:00", label:"점심", type:"food" },
        { time:"15:25", label:"블라블라카 버스 (샤모니→밀라노)", type:"bus", note:"~18:45 · 몽블랑 터널 경유" },
        { time:"18:45", label:"밀라노 도착 · 호텔 이동", type:"arrive", note:"~19:30 · M1 Lampugnano→Duomo, M3 Duomo→Sondrio" },
        { time:"19:30", label:"호텔 체크인", type:"hotel", poi:"hotel", note:"베스트웨스턴 호텔 메디슨" },
        { time:"20:00", label:"저녁", type:"food", note:"~21:00" },
      ]
    },
    {
      n:9, date:"2026-05-30", dateLabel:"5월 30일 (토)", city:"milano",
      title:"브레라 · 두오모 · 나빌리오",
      summary:"밀라노 하이라이트 → 공항버스 탑승",
      items:[
        { time:"09:00", label:"브레라 미술관 · 수목원 · 브레라 거리", type:"sight", poi:"brera", note:"~12:00" },
        { time:"12:00", label:"점심", type:"food" },
        { time:"13:30", label:"두오모 성당 · 나빌리오 운하", type:"sight", poi:"duomo", note:"~17:00" },
        { time:"17:00", label:"저녁", type:"food" },
        { time:"18:00", label:"호텔", type:"hotel", poi:"hotel", note:"~19:00" },
        { time:"19:00", label:"중앙역 옆 공항버스 탑승", type:"bus", poi:"centrale", note:"1시간 소요" },
        { time:"22:00", label:"밀라노 말펜사 공항 출발", type:"flight", poi:"malpensa" },
      ]
    },
    {
      n:10, date:"2026-05-31", dateLabel:"5월 31일 (일)", city:"milano",
      title:"귀국 · 인천 도착",
      summary:"비행 → 인천 16:45 도착",
      items:[
        { time:"16:45", label:"인천 공항 도착", type:"arrive", note:"5월 31일 (한국 시간)" },
      ]
    }
  ],

  hotels: [
    {
      city:"paris", nights:"5/22 – 5/26 (4박)", name:"홀리데이 인 파리 오페라 그랑 블루바르",
      nameEn:"Holiday Inn Paris Opera Grands Boulevards", district:"9구", type:"호텔", status:"확정",
      lat:48.8724, lng:2.3456, pdfFile:"uploads/hotel_paris.pdf"
    },
    {
      city:"annecy", nights:"5/26 – 5/27 (1박)", name:"아파트호텔 아다지오 안시센터",
      nameEn:"Aparthotel Adagio Annecy Centre", district:"시내", type:"레지던스", status:"확정",
      lat:45.9022, lng:6.1236, pdfFile:"uploads/hotel_annecy.pdf"
    },
    {
      city:"chamonix", nights:"5/27 – 5/29 (2박)", name:"샬레 호텔 르 프리와르",
      nameEn:"Chalet Hotel Le Prieuré", district:"샤모니 중심", type:"호텔", status:"확정",
      lat:45.9237, lng:6.8694, pdfFile:"uploads/hotel_chamonix.pdf"
    },
    {
      city:"milano", nights:"5/29 – 5/31 (2박)", name:"베스트웨스턴 호텔 메디슨",
      nameEn:"Best Western Hotel Madison", district:"중앙역 인근", type:"호텔", status:"확정",
      lat:45.4851, lng:9.1989, pdfFile:"uploads/hotel_milano.pdf"
    },
  ],

  pois: {
    paris: [
      { id:"hotel", name:"홀리데이인 오페라 (숙소)", lat:48.8724, lng:2.3456, kind:"hotel", day:"숙소" },
      { id:"batobus", name:"바토무슈 승선장 (알마마르소)", lat:48.8637, lng:2.3013, kind:"canal", day:"Day 1" },
      { id:"cdg", name:"파리 CDG 공항", lat:49.0097, lng:2.5479, kind:"plane", day:"Day 1", outskirts:true },
      { id:"orsay", name:"오르세 미술관", lat:48.8600, lng:2.3266, kind:"museum", day:"Day 2" },
      { id:"montmartre", name:"몽마르트르 · 사크레쾨르", lat:48.8867, lng:2.3431, kind:"hill", day:"Day 2" },
      { id:"versailles", name:"베르사유 궁전", lat:48.8049, lng:2.1204, kind:"palace", day:"Day 3", outskirts:true },
      { id:"arc", name:"개선문 전망대", lat:48.8738, lng:2.2950, kind:"monument", day:"Day 3" },
      { id:"giverny", name:"모네의 정원 (지베르니)", lat:49.0758, lng:1.5336, kind:"garden", day:"Day 4", outskirts:true },
      { id:"seine_walk", name:"센강 산책로", lat:48.8600, lng:2.3400, kind:"bridge", day:"Day 4" },
      { id:"outlet", name:"라발레빌리지 아울렛", lat:48.8479, lng:2.7842, kind:"shop", day:"Day 5", outskirts:true },
      { id:"galeries_lafayette", name:"갤러리 라파예트", lat:48.8736, lng:2.3325, kind:"shop", day:"Day 5" },
      { id:"gare_lyon", name:"파리 리옹역 (TGV)", lat:48.8443, lng:2.3737, kind:"train", day:"Day 5" },
      { id:"eiffel", name:"에펠탑", lat:48.8584, lng:2.2945, kind:"tower", day:"Day 1" },
    ],
    annecy: [
      { id:"hotel", name:"아다지오 안시센터 (숙소)", lat:45.9022, lng:6.1236, kind:"hotel", day:"숙소" },
      { id:"annecy_old", name:"안시 구시가 · 수중감옥 · 안시성", lat:45.8990, lng:6.1279, kind:"castle", day:"Day 6" },
      { id:"annecy_lake", name:"안시 호수 (패들보트)", lat:45.8700, lng:6.1600, kind:"lake", day:"Day 6" },
      { id:"pont", name:"사랑의 다리 (Pont des Amours)", lat:45.9015, lng:6.1342, kind:"bridge", day:"Day 6" },
      { id:"station", name:"안시역 (SNCF)", lat:45.9021, lng:6.1206, kind:"train", day:"도착" },
    ],
    chamonix: [
      { id:"hotel", name:"샬레 르 프리외르 (숙소)", lat:45.9237, lng:6.8694, kind:"hotel", day:"숙소" },
      { id:"aiguille", name:"에귀 뒤 미디 전망대", lat:45.8786, lng:6.8878, kind:"summit", day:"Day 7", note:"해발 3,842m" },
      { id:"therme", name:"QC TERME 온천", lat:45.7614, lng:6.9881, kind:"spa", day:"Day 7", note:"도보 20분" },
      { id:"chamonix_town", name:"샤모니 시내", lat:45.9240, lng:6.8690, kind:"old", day:"Day 7" },
      { id:"montenvers", name:"몽탕베르 · 빙하동굴", lat:45.9312, lng:6.9081, kind:"glacier", day:"Day 8", note:"산악열차 20분" },
      { id:"station", name:"샤모니 몽블랑역", lat:45.9237, lng:6.8700, kind:"train", day:"이동" },
    ],
    milano: [
      { id:"hotel", name:"베스트웨스턴 메디슨 (숙소)", lat:45.4851, lng:9.1989, kind:"hotel", day:"숙소" },
      { id:"brera", name:"브레라 미술관 · 거리", lat:45.4720, lng:9.1882, kind:"museum", day:"Day 9" },
      { id:"duomo", name:"두오모 성당", lat:45.4642, lng:9.1918, kind:"cathedral", day:"Day 9" },
      { id:"navigli", name:"나빌리오 운하", lat:45.4509, lng:9.1745, kind:"canal", day:"Day 9" },
      { id:"centrale", name:"밀라노 중앙역 (공항버스)", lat:45.4864, lng:9.2045, kind:"train", day:"Day 9" },
      { id:"malpensa", name:"말펜사 공항", lat:45.6306, lng:8.7281, kind:"plane", day:"Day 9", outskirts:true },
    ]
  },

  checklist: {
    "필수 준비물 (티켓·서류)": [
      { t:"여권 + 여권 복사본", done:false },
      { t:"e-티켓(항공권) 출력 또는 폰 저장", done:false },
      { t:"신용카드(외화) & 체크카드(트레블월렛)", done:false },
      { t:"현지화폐(유로) — 현금:카드 = 5:5", done:false },
      { t:"여행자보험 이메일/파일로 폰 저장", done:false },
      { t:"주민등록증 + 국제면허증 or 국제학생증", done:false },
      { t:"예약한 곳 티켓(박물관·공연 등) + 숙소 바우처", done:false },
      { t:"뮤지엄패스 (구매 시)", done:false },
    ],
    "생활용품": [
      { t:"세탁소 옷걸이 + 면봉", done:false },
      { t:"접이식 우산 or 판초·우비", done:false },
      { t:"와이어(짐보관용) + 크로스백 자물쇠", done:false },
      { t:"지퍼백 크기별 여러 개", done:false },
      { t:"종이세제·빨래비누 등", done:false },
      { t:"슬리퍼(조리·샌들) + 손톱깎이", done:false },
      { t:"보스턴백 + 폴딩백", done:false },
    ],
    "약품": [
      { t:"두통약·진통제", done:false },
      { t:"감기약·해열제", done:false },
      { t:"멀미약 + 지사제", done:false },
      { t:"소화제 (기내용 소분)", done:false },
      { t:"알레르기약 + 벌레퇴치제", done:false },
      { t:"연고·밴드 + 비타민", done:false },
      { t:"파스·휴족시간", done:false },
    ],
    "여행 관련": [
      { t:"여행지도(어웨이크) 파리·런던", done:false },
      { t:"핸드폰 목걸이케이스 + 방수팩", done:false },
      { t:"일정표 출력", done:false },
      { t:"러닝벨트(힙색) + 보조가방 + 필기도구", done:false },
      { t:"이어폰·헤드폰 + 목베개", done:false },
      { t:"스노우쿨링·방수백 + 귀마개·안대", done:false },
    ],
    "의류": [
      { t:"자켓·경량패딩", done:false },
      { t:"속옷·양말·잠옷", done:false },
      { t:"긴팔·긴바지", done:false },
      { t:"반팔·반바지", done:false },
      { t:"운동화 + 편한 구두", done:false },
      { t:"모자·선글라스·바람막이", done:false },
      { t:"수영복·후드집업·원피스", done:false },
      { t:"스카프·목도리 + 크로스백", done:false },
    ],
    "식품": [
      { t:"컵라면·햇반", done:false },
      { t:"젓가락·일회용수저", done:false },
      { t:"통조림식품·볶음고추장·김", done:false },
    ],
    "미용·세면도구": [
      { t:"기초화장품·선크림·색조화장품", done:false },
      { t:"드라이기·고데기·머리끈·구루프·실뻔", done:false },
      { t:"여성용품(생리대) + 면봉", done:false },
      { t:"물티슈·휴지", done:false },
      { t:"샴푸·린스·바디워시·칫솔·치약", done:false },
      { t:"면도기·눈썹칼·쪽집게 + 수건", done:false },
    ],
    "전자용품": [
      { t:"스마트폰 + 보조배터리 + 충전기", done:false },
      { t:"유럽 유심칩/ESIM", done:false },
      { t:"유럽형멀티탭·멀티콘센트(여러구)", done:false },
      { t:"메모리카드 + 셀카봉", done:false },
      { t:"애플워치 충전기 + 필름카메라·필름", done:false },
      { t:"접이식 전자포트 + 휴대용 스팀다리미", done:false },
      { t:"여행용 가슴기", done:false },
    ],
  },

  phrases: [
    { ko:"안녕하세요", fr:"Bonjour (봉쥬르)", it:"Buongiorno (부온조르노)" },
    { ko:"감사합니다", fr:"Merci (메르시)", it:"Grazie (그라치에)" },
    { ko:"죄송합니다", fr:"Pardon (파르동)", it:"Scusi (스쿠지)" },
    { ko:"얼마예요?", fr:"C'est combien? (세 콩비앙)", it:"Quanto costa? (콴토 코스타)" },
    { ko:"물 한 잔 주세요", fr:"Une carafe d'eau, s'il vous plaît", it:"Un bicchiere d'acqua, per favore" },
    { ko:"계산서 주세요", fr:"L'addition, s'il vous plaît", it:"Il conto, per favore" },
    { ko:"화장실 어디에요?", fr:"Où sont les toilettes?", it:"Dov'è il bagno?" },
    { ko:"도와주세요", fr:"Aidez-moi, s'il vous plaît", it:"Aiuto, per favore" },
    { ko:"영어 하세요?", fr:"Parlez-vous anglais?", it:"Parla inglese?" },
  ]
};
