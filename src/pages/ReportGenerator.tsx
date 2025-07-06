import React, { useState, useRef } from "react";
import { FileText, Download, Upload, BookOpen, FileDown } from "lucide-react";

interface ExtractedData {
  text: string;
  toc: string;
  structure: string;
}

const ReportGenerator: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [topic, setTopic] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 업로드 처리
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      setExtractedData(null);
      setGeneratedReport("");
    }
  };

  // 문서 분석
  const analyzeDocument = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);

    try {
      // 파일을 Base64로 변환
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;

        const response = await fetch(
          "http://localhost:5001/api/analyze-document",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pdf_data: base64Data,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          setExtractedData({
            text: "PDF 텍스트 추출 완료",
            toc: data.toc,
            structure: data.structure,
          });
        } else {
          alert(`분석 오류: ${data.error}`);
        }
      };

      reader.readAsDataURL(uploadedFile);
    } catch (error) {
      alert(`서버 연결 오류: ${error}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 보고서 생성
  const generateReport = async () => {
    if (!extractedData || !topic || !uploadedFile) return;

    setIsGenerating(true);

    try {
      // 파일을 Base64로 변환
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;

        const response = await fetch(
          "http://localhost:5001/api/generate-report",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              topic: topic,
              pdf_data: base64Data,
            }),
          }
        );

        const data = await response.json();

        if (data.success) {
          setGeneratedReport(data.report);
        } else {
          alert(`보고서 생성 오류: ${data.error}`);
        }
      };

      reader.readAsDataURL(uploadedFile);
    } catch (error) {
      alert(`서버 연결 오류: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Word 문서 다운로드
  const downloadReport = async () => {
    if (!generatedReport || !topic || !uploadedFile) return;

    try {
      // 파일을 Base64로 변환
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;

        const response = await fetch(
          "http://localhost:5001/api/generate-report",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              topic: topic,
              pdf_data: base64Data,
            }),
          }
        );

        const data = await response.json();

        if (data.success && data.docx_data) {
          // Base64를 Blob으로 변환
          const byteCharacters = atob(data.docx_data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });

          // 다운로드
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${topic}_보고서.docx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          alert("Word 문서 생성에 실패했습니다.");
        }
      };

      reader.readAsDataURL(uploadedFile);
    } catch (error) {
      alert(`다운로드 오류: ${error}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📄 AI 기반 보고서 생성기
        </h1>
        <p className="text-gray-600">
          PDF 문서를 업로드하여 AI가 분석하고 새로운 주제의 보고서를 자동으로
          생성합니다.
        </p>
      </div>

      {/* 파일 업로드 섹션 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Upload className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            PDF 문서 업로드
          </h2>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          {!uploadedFile ? (
            <div>
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                PDF 파일을 선택하거나 여기에 드래그하세요
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                파일 선택
              </button>
            </div>
          ) : (
            <div>
              <FileText className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-800 font-medium mb-2">
                {uploadedFile.name}
              </p>
              <p className="text-gray-600 mb-4">
                파일이 성공적으로 업로드되었습니다.
              </p>
              <button
                onClick={analyzeDocument}
                disabled={isAnalyzing}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? "분석 중..." : "문서 분석 시작"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 분석 결과 섹션 */}
      {extractedData && (
        <div className="space-y-6">
          {/* 목차 추출 결과 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">
                문서 목차 자동 추출
              </h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {extractedData.toc}
              </pre>
            </div>
          </div>

          {/* 문서 형식 요약 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">
                문서 형식 요약
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {extractedData.structure}
            </p>
          </div>

          {/* 새 보고서 주제 입력 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">
                새 보고서 주제 입력
              </h3>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 탄소중립 추진 전략"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={generateReport}
                disabled={!topic || isGenerating}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isGenerating ? "보고서 생성 중..." : "보고서 생성"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 생성된 보고서 섹션 */}
      {generatedReport && (
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileDown className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-800">
                생성된 보고서
              </h3>
            </div>
            <button
              onClick={downloadReport}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>다운로드</span>
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {generatedReport}
            </pre>
          </div>
        </div>
      )}

      {/* 사용 가이드 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          📋 사용 가이드
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">1. 문서 업로드</h4>
            <p>
              참고할 PDF 문서를 업로드하세요. 보고서 형식의 문서가 가장
              좋습니다.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">2. 문서 분석</h4>
            <p>AI가 문서의 목차와 구조를 자동으로 분석합니다.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">3. 주제 입력</h4>
            <p>새로 작성할 보고서의 주제를 입력하세요.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">4. 보고서 생성</h4>
            <p>
              AI가 참고 문서의 형식을 학습하여 새로운 주제의 보고서를
              생성합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
