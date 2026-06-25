import coffee1 from "@/assets/coffee-1.jpg";
import coffee2 from "@/assets/coffee-2.jpg";
import coffee3 from "@/assets/coffee-3.jpg";
import coffee4 from "@/assets/coffee-4.jpg";
import coffee5 from "@/assets/coffee-5.jpg";
import coffee6 from "@/assets/coffee-6.jpg";
import bean1 from "@/assets/bean-1.jpg";
import bean2 from "@/assets/bean-2.jpg";
import bean3 from "@/assets/bean-3.jpg";

export type TasteProfile = {
  acidity: number;
  sweetness: number;
  body: number;
  bitterness: number;
  cleanliness: number;
};

export type Gear = {
  type: "dripper" | "grinder" | "kettle" | "scale";
  name: string;
};

export type Recipe = {
  id: string;
  image: string;
  title: string;
  author: string;
  beanId?: string;
  beanName: string;
  roastery: string;
  method: string;
  category: "pourover" | "espresso" | "coldbrew" | "latte" | "other";
  temperature: "hot" | "iced";
  dose: number;
  water: number;
  waterTemp: number;
  grinder: string;
  grindSize: string;
  brewTime: string;
  taste: TasteProfile;
  gear: Gear[];
  saves: number;
  tastingNotes: string[];
  review: string;
  steps: string[];
  createdAt: string;
  isMine?: boolean;
};

export type Bean = {
  id: string;
  name: string;
  roastery: string;
  image: string;
  origin: string;
  region?: string;
  process: string;
  variety?: string;
  roastLevel: "라이트" | "라이트 미디엄" | "미디엄" | "미디엄 다크" | "다크";
  altitude?: string;
  tastingNotes: string[];
  description: string;
  community?: boolean;
};

export const mockBeans: Bean[] = [
  {
    id: "b1",
    name: "Ethiopia Yirgacheffe Konga",
    roastery: "프릳츠 커피",
    image: bean2,
    origin: "에티오피아",
    region: "예가체프 콩가",
    process: "내추럴",
    variety: "Heirloom",
    roastLevel: "라이트",
    altitude: "1,900 ~ 2,100m",
    tastingNotes: ["자스민", "복숭아", "베르가못", "꿀"],
    description:
      "예가체프 콩가 마을의 내추럴 가공 원두. 화사한 꽃향과 잘 익은 과실미가 깔끔하게 떨어집니다. 라이트 로스팅으로 향미를 살렸어요.",
  },
  {
    id: "b2",
    name: "Colombia Geisha Natural",
    roastery: "센터커피",
    image: bean1,
    origin: "콜롬비아",
    region: "Huila",
    process: "내추럴",
    variety: "Geisha",
    roastLevel: "라이트 미디엄",
    altitude: "1,750m",
    tastingNotes: ["초콜릿", "캐러멜", "오렌지", "흑설탕"],
    description:
      "콜롬비아 게이샤를 내추럴로 가공한 원두. 부드러운 단맛과 시트러스 향이 균형있게 어울립니다. 콜드브루 / 라떼에 추천.",
  },
  {
    id: "b3",
    name: "Kenya AA Nyeri",
    roastery: "테라로사",
    image: bean3,
    origin: "케냐",
    region: "Nyeri",
    process: "워시드",
    variety: "SL28 · SL34",
    roastLevel: "미디엄 다크",
    altitude: "1,700 ~ 1,800m",
    tastingNotes: ["블랙커런트", "다크초콜릿", "와인", "토마토"],
    description:
      "묵직한 바디감과 와인 같은 산미가 특징인 케냐 AA. 에스프레소와 진한 푸어오버 모두에 잘 어울리는 클래식.",
  },
  {
    id: "b4",
    name: "Panama Esmeralda Geisha",
    roastery: "모모스 커피",
    image: bean1,
    origin: "파나마",
    region: "Boquete",
    process: "워시드",
    variety: "Geisha",
    roastLevel: "라이트",
    altitude: "1,650m",
    tastingNotes: ["라벤더", "베르가못", "꿀", "복숭아"],
    description:
      "파나마 게이샤의 정수. 우아한 꽃향과 길게 이어지는 단맛, 끝에 남는 차같은 깔끔함이 일품입니다.",
  },
  {
    id: "b5",
    name: "Brazil Cerrado Pulped Natural",
    roastery: "커피 리브레",
    image: bean3,
    origin: "브라질",
    region: "Cerrado",
    process: "펄프드 내추럴",
    variety: "Catuai",
    roastLevel: "미디엄",
    altitude: "1,100m",
    tastingNotes: ["헤이즐넛", "밀크초콜릿", "캐러멜"],
    description:
      "데일리로 즐기기 좋은 브라질 세하도. 견과류와 초콜릿 노트가 진하고 안정적인 단맛이 특징.",
  },
  {
    id: "b6",
    name: "Guatemala Antigua La Bolsa",
    roastery: "안트러사이트",
    image: bean2,
    origin: "과테말라",
    region: "Antigua",
    process: "워시드",
    variety: "Bourbon",
    roastLevel: "미디엄",
    altitude: "1,500 ~ 1,700m",
    tastingNotes: ["다크초콜릿", "오렌지필", "헤이즐넛"],
    description:
      "과테말라 안티구아의 클래식. 부드러운 산미와 진한 초콜릿 바디가 균형을 이룹니다.",
    community: true,
  },
];

export const mockRecipes: Recipe[] = [
  {
    id: "1",
    image: coffee1,
    title: "에티오피아 예가체프 라이트 V60",
    author: "barista_jun",
    beanId: "b1",
    beanName: "Ethiopia Yirgacheffe Konga",
    roastery: "프릳츠 커피",
    method: "V60 푸어오버",
    category: "pourover",
    temperature: "hot",
    dose: 15,
    water: 240,
    waterTemp: 92,
    grinder: "코만단테 C40",
    grindSize: "22 클릭",
    brewTime: "2:45",
    taste: { acidity: 5, sweetness: 4, body: 2, bitterness: 1, cleanliness: 5 },
    gear: [
      { type: "dripper", name: "Hario V60" },
      { type: "grinder", name: "Comandante C40" },
      { type: "kettle", name: "Fellow Stagg EKG" },
      { type: "scale", name: "Timemore Black Mirror" },
    ],
    saves: 128,
    tastingNotes: ["자스민", "복숭아", "베르가못"],
    review: "꽃향과 시트러스가 깔끔하게 떨어지는 한 잔. 라이트 로스팅에 잘 맞는 레시피.",
    steps: [
      "0:00 ~ 0:30 — 30g 뜸들이기",
      "0:30 ~ 1:15 — 120g까지 부드럽게 푸어",
      "1:15 ~ 2:00 — 240g까지 천천히 푸어",
      "2:00 ~ 2:45 — 드립 완료까지 대기",
    ],
    createdAt: "2026-06-20",
  },
  {
    id: "2",
    image: coffee2,
    title: "콜드브루 라떼 데일리 레시피",
    author: "morning_cup",
    beanId: "b2",
    beanName: "Colombia Geisha Natural",
    roastery: "센터커피",
    method: "콜드브루 라떼",
    category: "coldbrew",
    temperature: "iced",
    dose: 25,
    water: 250,
    waterTemp: 4,
    grinder: "1Zpresso JX-Pro",
    grindSize: "3.0.0",
    brewTime: "12:00:00",
    taste: { acidity: 3, sweetness: 5, body: 4, bitterness: 2, cleanliness: 4 },
    gear: [
      { type: "dripper", name: "Hario Mizudashi" },
      { type: "grinder", name: "1Zpresso JX-Pro" },
      { type: "scale", name: "Acaia Pearl" },
    ],
    saves: 342,
    tastingNotes: ["초콜릿", "캐러멜", "오렌지"],
    review: "12시간 침출 후 우유 150ml. 단맛이 진하게 올라옵니다.",
    steps: [
      "원두 25g 굵게 분쇄",
      "정수 250g과 함께 침출병에 넣기",
      "냉장 12시간 침출",
      "필터로 거른 후 우유 150ml에 부어내기",
    ],
    createdAt: "2026-06-22",
  },
  {
    id: "3",
    image: coffee3,
    title: "케냐 AA 에스프레소 진한 한 잔",
    author: "espresso_lab",
    beanId: "b3",
    beanName: "Kenya AA Nyeri",
    roastery: "테라로사",
    method: "에스프레소",
    category: "espresso",
    temperature: "hot",
    dose: 18,
    water: 36,
    waterTemp: 93,
    grinder: "Mazzer Mini",
    grindSize: "2.5",
    brewTime: "0:28",
    taste: { acidity: 4, sweetness: 3, body: 5, bitterness: 3, cleanliness: 3 },
    gear: [
      { type: "dripper", name: "La Marzocco Linea Mini" },
      { type: "grinder", name: "Mazzer Mini" },
      { type: "scale", name: "Acaia Lunar" },
    ],
    saves: 89,
    tastingNotes: ["블랙커런트", "다크초콜릿", "와인"],
    review: "1:2 비율 정통 추출. 묵직한 바디감과 과실미의 균형.",
    steps: [
      "원두 18g 도징 후 레벨링",
      "탬핑 30lb",
      "93°C 9bar 추출",
      "28초간 36g 추출 완료",
    ],
    createdAt: "2026-06-15",
  },
  {
    id: "4",
    image: coffee5,
    title: "칼리타 웨이브 게이샤 하리하리",
    author: "wave_pour",
    beanId: "b4",
    beanName: "Panama Esmeralda Geisha",
    roastery: "모모스 커피",
    method: "Kalita Wave 푸어오버",
    category: "pourover",
    temperature: "hot",
    dose: 16,
    water: 256,
    waterTemp: 90,
    grinder: "EK43",
    grindSize: "8.5",
    brewTime: "3:10",
    taste: { acidity: 4, sweetness: 5, body: 3, bitterness: 1, cleanliness: 5 },
    gear: [
      { type: "dripper", name: "Kalita Wave 185" },
      { type: "grinder", name: "Mahlkönig EK43" },
      { type: "kettle", name: "Brewista Artisan" },
    ],
    saves: 211,
    tastingNotes: ["라벤더", "꿀", "복숭아"],
    review: "꽃향이 폭발하는 게이샤. 낮은 온도로 단맛을 길게.",
    steps: [
      "0:00 ~ 0:45 — 50g 뜸들이기",
      "0:45 ~ 1:30 — 150g까지 푸어",
      "1:30 ~ 2:15 — 256g까지 푸어",
      "2:15 ~ 3:10 — 드립 완료",
    ],
    createdAt: "2026-06-18",
  },
  {
    id: "5",
    image: coffee6,
    title: "아이스 아메리카노 황금비율",
    author: "ice_americano",
    beanId: "b5",
    beanName: "Brazil Cerrado Pulped Natural",
    roastery: "커피 리브레",
    method: "에스프레소 + 얼음물",
    category: "espresso",
    temperature: "iced",
    dose: 20,
    water: 180,
    waterTemp: 93,
    grinder: "Niche Zero",
    grindSize: "13",
    brewTime: "0:30",
    taste: { acidity: 2, sweetness: 4, body: 4, bitterness: 2, cleanliness: 4 },
    gear: [
      { type: "dripper", name: "Breville Dual Boiler" },
      { type: "grinder", name: "Niche Zero" },
      { type: "scale", name: "Acaia Lunar" },
    ],
    saves: 502,
    tastingNotes: ["헤이즐넛", "초콜릿", "캐러멜"],
    review: "리스트레토 40g + 얼음물 140g. 단맛이 시원하게 퍼져요.",
    steps: [
      "원두 20g 도징",
      "리스트레토로 40g 추출",
      "얼음 가득 채운 잔에 정수 140g",
      "에스프레소를 천천히 부어 완성",
    ],
    createdAt: "2026-06-24",
  },
  {
    id: "6",
    image: coffee4,
    title: "프렌치프레스 안티구아 4분",
    author: "press_master",
    beanId: "b6",
    beanName: "Guatemala Antigua La Bolsa",
    roastery: "안트러사이트",
    method: "프렌치프레스",
    category: "other",
    temperature: "hot",
    dose: 30,
    water: 500,
    waterTemp: 94,
    grinder: "Comandante C40",
    grindSize: "30 클릭",
    brewTime: "4:00",
    taste: { acidity: 3, sweetness: 4, body: 5, bitterness: 3, cleanliness: 2 },
    gear: [
      { type: "dripper", name: "Bodum Chambord" },
      { type: "grinder", name: "Comandante C40" },
      { type: "kettle", name: "Hario V60 Buono" },
    ],
    saves: 64,
    tastingNotes: ["다크초콜릿", "오렌지필", "헤이즐넛"],
    review: "묵직한 바디로 마시는 클래식 침지식 추출.",
    steps: [
      "30g 굵게 분쇄, 프레스에 투입",
      "94°C 물 500g 부어 4분 침지",
      "표면 크러스트 걷어내기",
      "플런저 천천히 내려 완료",
    ],
    createdAt: "2026-06-10",
  },
];

export type Notification = {
  id: string;
  type: "save" | "follow" | "comment";
  actor: string;
  text: string;
  time: string;
};

export const mockNotifications: Notification[] = [
  { id: "n1", type: "save", actor: "morning_cup", text: "님이 회원님의 V60 레시피를 저장했어요", time: "방금 전" },
  { id: "n2", type: "follow", actor: "wave_pour", text: "님이 회원님을 팔로우합니다", time: "1시간 전" },
  { id: "n3", type: "comment", actor: "ice_americano", text: '님이 댓글: "그라인더 클릭 다시 확인 부탁드려요!"', time: "어제" },
];
