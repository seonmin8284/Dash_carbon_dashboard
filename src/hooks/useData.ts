import { useState, useEffect } from "react";
import { EmissionData, MarketData } from "../types";

// CSV 데이터를 파싱하는 함수
const parseCSVData = (csvText: string): MarketData[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  const data: MarketData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // CSV 파싱 (쉼표로 구분하되, 따옴표 안의 쉼표는 무시)
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);

    // KAU24 데이터만 필터링
    if (values[1] === 'KAU24' && values[2] !== '0') {
      const 일자 = new Date(values[0]);
      const 종가 = parseInt(values[2].replace(/"/g, '').replace(/,/g, ''));
      const 시가 = parseInt(values[5].replace(/"/g, '').replace(/,/g, ''));
      const 고가 = parseInt(values[6].replace(/"/g, '').replace(/,/g, ''));
      const 저가 = parseInt(values[7].replace(/"/g, '').replace(/,/g, ''));
      const 거래량 = parseInt(values[8].replace(/"/g, '').replace(/,/g, ''));
      const 거래대금 = parseInt(values[9].replace(/"/g, '').replace(/,/g, ''));

      // 유효한 데이터만 추가
      if (!isNaN(종가) && !isNaN(시가) && !isNaN(고가) && !isNaN(저가) && !isNaN(거래량)) {
        data.push({
          일자,
          종목명: 'KAU24',
          시가,
          고가,
          저가,
          종가,
          거래량,
          거래대금,
          연도: 일자.getFullYear(),
          월: 일자.getMonth() + 1,
          연월: `${일자.getFullYear()}-${String(일자.getMonth() + 1).padStart(2, '0')}`,
          추천: 종가 > 시가 ? '매수' : 종가 < 시가 ? '매도' : '관망'
        });
      }
    }
  }

  // 날짜순으로 정렬 (최신순)
  return data.sort((a, b) => b.일자.getTime() - a.일자.getTime());
};

// 환경부 온실가스 배출량 데이터 타입 정의
export interface GreenhouseEmissionData {
  year: number;
  totalEmission: number;
  energyEmission: number;
  otherEmission: number;
}

// 환경부 온실가스 배출량 데이터 로드 함수
export const loadEmissionData = async (): Promise<GreenhouseEmissionData[]> => {
  try {
    const response = await fetch('/환경부 온실가스종합정보센터_국가 온실가스 인벤토리 배출량_20250103.csv');
    const csvText = await response.text();
    
    // CSV 파싱 (간단한 구현)
    const lines = csvText.split('\n');
    const data: GreenhouseEmissionData[] = [];
    
    // 첫 번째 줄은 헤더이므로 건너뛰기
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = line.split(',');
      if (columns.length < 3) continue;
      
      const year = parseInt(columns[0]);
      const totalEmission = parseFloat(columns[1]) || 0;
      const energyEmission = parseFloat(columns[2]) || 0;
      
      if (year && totalEmission > 0) {
        data.push({
          year,
          totalEmission,
          energyEmission,
          otherEmission: totalEmission - energyEmission
        });
      }
    }
    
    return data.sort((a, b) => a.year - b.year);
  } catch (error) {
    console.error('환경부 배출량 데이터 로드 실패:', error);
    // 더미 데이터 반환
    return [
      { year: 1990, totalEmission: 310578, energyEmission: 271615, otherEmission: 38963 },
      { year: 1995, totalEmission: 464498, energyEmission: 431236, otherEmission: 33262 },
      { year: 2000, totalEmission: 533453, energyEmission: 473061, otherEmission: 60392 },
      { year: 2005, totalEmission: 594422, energyEmission: 536942, otherEmission: 57480 },
      { year: 2010, totalEmission: 689789, energyEmission: 632428, otherEmission: 57361 },
      { year: 2015, totalEmission: 726105, energyEmission: 678332, otherEmission: 47773 },
      { year: 2020, totalEmission: 712959, energyEmission: 674120, otherEmission: 38839 },
      { year: 2022, totalEmission: 724294, energyEmission: 686462, otherEmission: 37832 }
    ];
  }
};

export function useData() {
  // 더미 배출량 데이터
  const [emissionsData] = useState<EmissionData[]>([
    { 연도: 2017, 총배출량: 709.1, 에너지: 567.3, 산업공정: 89.2, 농업: 25.8, 폐기물: 26.8 },
    { 연도: 2018, 총배출량: 727.6, 에너지: 582.1, 산업공정: 91.5, 농업: 26.2, 폐기물: 27.8 },
    { 연도: 2019, 총배출량: 701.3, 에너지: 560.8, 산업공정: 88.9, 농업: 25.5, 폐기물: 26.1 },
    { 연도: 2020, 총배출량: 648.7, 에너지: 518.2, 산업공정: 82.3, 농업: 23.8, 폐기물: 24.4 },
    { 연도: 2021, 총배출량: 676.2, 에너지: 540.1, 산업공정: 85.7, 농업: 24.9, 폐기물: 25.5 },
    { 연도: 2022, 총배출량: 658.9, 에너지: 526.3, 산업공정: 83.4, 농업: 24.2, 폐기물: 25.0 },
    { 연도: 2023, 총배출량: 642.1, 에너지: 512.8, 산업공정: 81.2, 농업: 23.6, 폐기물: 24.5 },
    { 연도: 2024, 총배출량: 625.8, 에너지: 499.5, 산업공정: 79.1, 농업: 23.0, 폐기물: 24.2 },
    { 연도: 2025, 총배출량: 610.2, 에너지: 487.2, 산업공정: 77.3, 농업: 22.5, 폐기물: 23.2 },
  ]);

  // 실제 시장 데이터 (CSV에서 로드)
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  // CSV 파일 로드
  useEffect(() => {
    const loadCSVData = async () => {
      try {
        const response = await fetch('/배출권_거래데이터.csv');
        const csvText = await response.text();
        const parsedData = parseCSVData(csvText);
        setMarketData(parsedData);
      } catch (error) {
        console.error('CSV 파일 로드 실패:', error);
        // 에러 발생 시 더미 데이터 사용
        setMarketData([]);
      } finally {
        setLoading(false);
      }
    };

    loadCSVData();
  }, []);

  // ESG 등급 추세 더미 데이터 추가
  const [esgTrendData] = useState([
    { year: 2020, grade: "A" },
    { year: 2021, grade: "A+" },
    { year: 2022, grade: "AA" },
    { year: 2023, grade: "AA+" },
    { year: 2024, grade: "AAA" },
  ]);

  // 4가지 ESG 기준별 추세 데이터
  const [esgMultiStandardData] = useState([
    {
      year: 2020,
      gri: { grade: "C", score: 65.2 },
      sasb: { grade: "B", score: 72.1 },
      djsi: { grade: "C+", score: 68.5 },
      kEsg: { grade: "D", score: 58.3 }
    },
    {
      year: 2021,
      gri: { grade: "C+", score: 68.7 },
      sasb: { grade: "B+", score: 75.3 },
      djsi: { grade: "B", score: 71.2 },
      kEsg: { grade: "C", score: 62.1 }
    },
    {
      year: 2022,
      gri: { grade: "B", score: 72.1 },
      sasb: { grade: "A", score: 81.4 },
      djsi: { grade: "B+", score: 78.0 },
      kEsg: { grade: "C", score: 63.3 }
    },
    {
      year: 2023,
      gri: { grade: "B+", score: 75.8 },
      sasb: { grade: "A+", score: 88.2 },
      djsi: { grade: "A", score: 82.5 },
      kEsg: { grade: "C+", score: 67.9 }
    },
    {
      year: 2024,
      gri: { grade: "A", score: 79.3 },
      sasb: { grade: "AA", score: 92.1 },
      djsi: { grade: "A+", score: 86.7 },
      kEsg: { grade: "B", score: 71.4 }
    }
  ]);

  return { emissionsData, marketData, esgTrendData, esgMultiStandardData, loading };
} 