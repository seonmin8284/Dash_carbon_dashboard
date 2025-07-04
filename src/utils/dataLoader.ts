import Papa from 'papaparse';

export const loadEmissionsData = async (): Promise<EmissionData[]> => {
  try {
    // 실제 환경에서는 API 호출 또는 파일 로드
    // 여기서는 샘플 데이터 생성
    const emissionsData: EmissionData[] = [];
    
    for (let year = 1990; year <= 2021; year++) {
      const baseEmission = 600000 + (year - 1990) * 5000 + Math.random() * 50000;
      emissionsData.push({
        연도: year,
        총배출량: baseEmission,
        에너지: baseEmission * 0.7,
        산업공정: baseEmission * 0.15,
        농업: baseEmission * 0.1,
        폐기물: baseEmission * 0.05
      });
    }
    
    return emissionsData;
  } catch (error) {
    console.error('배출량 데이터 로드 오류:', error);
    return [];
  }
};

export const loadMarketData = async (): Promise<MarketData[]> => {
  try {
    const marketData: MarketData[] = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const basePrice = 8770 + Math.sin((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365) * 2 * Math.PI) * 500;
      marketData.push({
        일자: new Date(d),
        종목명: 'KAU24',
        시가: basePrice + (Math.random() - 0.5) * 400,
        거래량: Math.floor(Math.random() * 9000) + 1000,
        거래대금: Math.floor(Math.random() * 90000000) + 10000000,
        연도: d.getFullYear(),
        월: d.getMonth() + 1,
        연월: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        추천: Math.random() > 0.7 ? '매수' : '관망'
      });
    }
    
    return marketData;
  } catch (error) {
    console.error('시장 데이터 로드 오류:', error);
    return [];
  }
};

export const loadAllocationData = async (): Promise<AllocationData[]> => {
  try {
    const allocationData: AllocationData[] = [];
    const companies = ['삼성전자', 'LG화학', 'SK하이닉스', 'POSCO', '현대자동차', 'LG전자', 'KB금융', '신한금융'];
    const industries = ['전자', '화학', '반도체', '철강', '자동차', '전자', '금융', '금융'];
    
    for (let year = 2021; year <= 2025; year++) {
      companies.forEach((company, index) => {
        allocationData.push({
          연도: year,
          업체명: company,
          업종: industries[index],
          대상년도별할당량: Math.floor(Math.random() * 500000) + 100000
        });
      });
    }
    
    return allocationData;
  } catch (error) {
    console.error('할당량 데이터 로드 오류:', error);
    return [];
  }
}; 