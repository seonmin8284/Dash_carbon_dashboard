export interface EmissionData {
  연도: number;
  총배출량: number;
  에너지: number;
  산업공정: number;
  농업: number;
  폐기물: number;
}

export interface MarketData {
  일자: Date;
  종목명: string;
  시가: number;
  고가: number;
  저가: number;
  종가: number;
  거래량: number;
  거래대금: number;
  연도: number;
  월: number;
  연월: string;
  추천: string;
}

export interface AllocationData {
  연도: number;
  업체명: string;
  업종: string;
  대상년도별할당량: number;
}

export interface MapData {
  지역명: string;
  평균_이산화탄소_농도: number;
  위도: number;
  경도: number;
}

export interface GaugeData {
  연도: number;
  월: number;
  연월: string;
  탄소배출권_보유수량: number;
  현재_탄소배출량: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  visualization?: string;
}

// Leaflet 전역 타입 선언
declare global {
  interface Window {
    L: {
      map: (id: string) => {
        setView: (coords: [number, number], zoom: number) => any;
      };
      tileLayer: (url: string, options: any) => {
        addTo: (map: any) => any;
      };
      marker: (coords: [number, number], options?: any) => {
        addTo: (map: any) => any;
        bindPopup: (content: string) => any;
      };
      divIcon: (options: {
        className?: string;
        html?: string;
        iconSize?: [number, number];
        iconAnchor?: [number, number];
      }) => any;
      control: (options: { position: string }) => {
        onAdd: () => any;
        addTo: (map: any) => any;
      };
      DomUtil: {
        create: (tag: string, className: string) => HTMLElement;
      };
    };
    ApexCharts: any;
  }
}

// ApexCharts 타입 선언
declare global {
  interface Window {
    ApexCharts: any;
  }
}

export {}; 