#!/usr/bin/env python3
"""
AI 리포트 생성기 백엔드 API 서버 실행 스크립트
"""

import os
import sys
from dotenv import load_dotenv

# 환경 변수 로딩
load_dotenv()

# 필요한 환경 변수 확인
required_env_vars = [
    "OPENAI_API_KEY",
    "PINECONE_API_KEY", 
    "PINECONE_ENV"
]

missing_vars = []
for var in required_env_vars:
    if not os.getenv(var):
        missing_vars.append(var)

if missing_vars:
    print("❌ 다음 환경 변수가 설정되지 않았습니다:")
    for var in missing_vars:
        print(f"   - {var}")
    print("\n.env 파일을 확인하고 필요한 API 키를 설정해주세요.")
    sys.exit(1)

print("✅ 환경 변수 확인 완료")

# API 서버 실행
if __name__ == "__main__":
    try:
        from api.report_generator import app
        print("🚀 AI 리포트 생성기 API 서버를 시작합니다...")
        print("📍 서버 주소: http://localhost:5001")
        print("📋 API 엔드포인트:")
        print("   - POST /api/analyze-document: PDF 문서 분석")
        print("   - POST /api/generate-report: 보고서 생성")
        print("   - GET  /api/health: 서버 상태 확인")
        print("\n프론트엔드에서 http://localhost:5173 으로 접속하세요.")
        print("\n서버를 중지하려면 Ctrl+C를 누르세요.")
        
        app.run(debug=True, port=5001, host='0.0.0.0')
        
    except ImportError as e:
        print(f"❌ 모듈 import 오류: {e}")
        print("필요한 패키지를 설치해주세요:")
        print("pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"❌ 서버 실행 오류: {e}")
        sys.exit(1) 