import coffee1 from "@/assets/coffee-1.jpg";
import coffee2 from "@/assets/coffee-2.jpg";
import coffee3 from "@/assets/coffee-3.jpg";

export type TasteProfile = {
  acidity: number;     // 산미
  sweetness: number;   // 단맛
  body: number;        // 바디
  bitterness: number;  // 쓴맛
  cleanliness: number; // 깔끔함
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
  beanName: string;
  roastery: string;
  method: string;          // 추출 방식
  temperature: "hot" | "iced";
  dose: number;            // g
  water: number;           // g
  waterTemp: number;       // °C
  grinder: string;
  grindSize: string;
  brewTime: string;        // mm:ss
  taste: TasteProfile;
  gear: Gear[];
  saves: number;
  tastingNotes: string[];
  review: string;
  steps: string[];
  saved?: boolean;
};

export const mockRecipes: Recipe[] = [
  {
    id: "1",
    image: coffee1,
    title: "에티오피아 예가체프 라이트 V60",
    author: "barista_jun",
    beanName: "Ethiopia Yirgacheffe Konga",
    roastery: "프릳츠 커피",
    method: "V60 푸어오버",
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
    saved: true,
  },
  {
    id: "2",
    image: coffee2,
    title: "콜드브루 라떼 데일리 레시피",
    author: "morning_cup",
    beanName: "Colombia Geisha Natural",
    roastery: "센터커피",
    method: "콜드브루 라떼",
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
  },
  {
    id: "3",
    image: coffee3,
    title: "케냐 AA 에스프레소 진한 한 잔",
    author: "espresso_lab",
    beanName: "Kenya AA Nyeri",
    roastery: "테라로사",
    method: "에스프레소",
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
  },
];
