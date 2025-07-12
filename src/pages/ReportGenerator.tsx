import React, { useState } from "react";

// dnd-kit import 추가
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 목차 노드 타입 정의
type OutlineNode = {
  id: string;
  title: string;
  children?: OutlineNode[] | null;
};

const ReportGenerator: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [templateText, setTemplateText] = useState("");
  const [outline, setOutline] = useState<OutlineNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // id 부여 유틸
  const generateId = () => Math.random().toString(36).slice(2, 10);

  // 목차에 id 자동 부여 (재귀)
  function assignIds(nodes: any[]): OutlineNode[] {
    return nodes.map((n) => ({
      id: n.id || generateId(),
      title: n.title,
      children: n.children ? assignIds(n.children) : null,
    }));
  }

  // 드래그 핸들 아이콘 (SVG)
  const DragHandle = () => (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "grab",
        userSelect: "none",
        color: "#6b7280",
        width: "100%",
        height: "100%",
      }}
      title="드래그로 순서 변경"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M8 6h8M8 12h8M8 18h8" />
      </svg>
    </span>
  );

  // Sortable 아이템
  function SortableItem({
    node,
    onEdit,
    onAdd,
    onDelete,
    renderChildren,
  }: any) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: node.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      background: isDragging ? "#e0e7ff" : "#f9fafb",
      marginBottom: 12,
      padding: 16,
      borderRadius: 8,
      boxShadow: isDragging
        ? "0 4px 12px rgba(59,130,246,0.2)"
        : "0 2px 4px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      border: isDragging ? "2px solid #2563eb" : "1px solid #e5e7eb",
      cursor: "grab",
      minHeight: 60,
    } as React.CSSProperties;
    return (
      <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            background: "rgba(0,0,0,0.02)",
            borderRadius: 6,
            padding: "12px",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              background: "rgba(0,0,0,0.05)",
              borderRadius: 6,
              marginRight: 12,
              cursor: "grab",
            }}
          >
            <DragHandle />
          </div>
          <input
            value={node.title}
            onChange={(e) => onEdit(node.id, e.target.value)}
            style={{
              fontSize: 16,
              fontWeight: 500,
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#1f2937",
            }}
            placeholder="제목을 입력하세요"
          />
          <div style={{ display: "flex", gap: 6, marginLeft: 12 }}>
            <button
              onClick={() => onAdd(node.id)}
              style={{
                background: "rgba(5, 150, 105, 0.1)",
                border: "1px solid rgba(5, 150, 105, 0.2)",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#059669",
                transition: "all 0.2s",
                fontSize: 13,
                fontWeight: 500,
              }}
              title="하위 항목 추가"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(5, 150, 105, 0.15)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(5, 150, 105, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ marginRight: 4 }}
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              추가
            </button>
            <button
              onClick={() => onDelete(node.id)}
              style={{
                background: "rgba(220, 38, 38, 0.1)",
                border: "1px solid rgba(220, 38, 38, 0.2)",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#dc2626",
                transition: "all 0.2s",
                fontSize: 13,
                fontWeight: 500,
              }}
              title="삭제"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(220, 38, 38, 0.15)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ marginRight: 4 }}
              >
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              삭제
            </button>
          </div>
        </div>
        {node.children &&
          node.children.length > 0 &&
          renderChildren(node.children)}
      </li>
    );
  }

  // 트리 편집 + 드래그
  function DraggableOutlineTree({
    nodes,
    setNodes,
  }: {
    nodes: OutlineNode[];
    setNodes: (n: OutlineNode[]) => void;
  }) {
    const sensors = useSensors(useSensor(PointerSensor));
    // 노드 편집
    const handleEdit = (id: string, value: string) => {
      const update = (arr: OutlineNode[]): OutlineNode[] =>
        arr.map((n) =>
          n.id === id
            ? { ...n, title: value }
            : { ...n, children: n.children ? update(n.children) : n.children }
        );
      setNodes(update(nodes));
    };
    // 하위 추가
    const handleAdd = (id: string) => {
      const update = (arr: OutlineNode[]): OutlineNode[] =>
        arr.map((n) =>
          n.id === id
            ? {
                ...n,
                children: [
                  ...(n.children || []),
                  { id: generateId(), title: "새 항목", children: null },
                ],
              }
            : { ...n, children: n.children ? update(n.children) : n.children }
        );
      setNodes(update(nodes));
    };
    // 삭제
    const handleDelete = (id: string) => {
      const remove = (arr: OutlineNode[]): OutlineNode[] =>
        arr
          .filter((n) => n.id !== id)
          .map((n) => ({
            ...n,
            children: n.children ? remove(n.children) : n.children,
          }));
      setNodes(remove(nodes));
    };

    // 드래그 종료(동일 레벨 내 순서 변경만 지원, 계층 이동은 별도 구현 필요)
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      // 최상위 레벨만 예시 (중첩 계층 이동은 별도 구현 필요)
      const oldIndex = nodes.findIndex((n) => n.id === active.id);
      const newIndex = nodes.findIndex((n) => n.id === over.id);
      setNodes(arrayMove(nodes, oldIndex, newIndex));
    };

    // 재귀 렌더링
    const renderTree = (arr: OutlineNode[]) => (
      <SortableContext
        items={arr.map((n) => n.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul style={{ marginLeft: 16 }}>
          {arr.map((node) => (
            <SortableItem
              key={node.id}
              node={node}
              onEdit={handleEdit}
              onAdd={handleAdd}
              onDelete={handleDelete}
              renderChildren={(children: OutlineNode[]) => renderTree(children)}
            />
          ))}
        </ul>
      </SortableContext>
    );

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {renderTree(nodes)}
      </DndContext>
    );
  }

  // 목차 트리 재귀 렌더링 함수
  const renderOutline = (nodes: OutlineNode[]) => (
    <ul style={{ marginLeft: 16 }}>
      {nodes.map((node, idx) => (
        <li key={idx} style={{ marginBottom: 4 }}>
          {node.title}
          {node.children &&
            node.children.length > 0 &&
            renderOutline(node.children)}
        </li>
      ))}
    </ul>
  );

  // API 호출 함수 (fetch 사용)
  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "http://localhost:8000/generate-outline-from-topic",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ topic }),
        }
      );
      if (!res.ok) throw new Error("API 응답 오류");
      const data = await res.json();
      setTemplateText(data.template_text);
      setOutline(assignIds(data.outline.outline)); // id 부여
    } catch (e: any) {
      setError("API 호출 중 오류가 발생했습니다.");
    }
    setLoading(false);
  };

  // outline: [{ id, title, children: [...] }, ...] 형태를
  // chapters: [{ ...node, sections: [...] }, ...] 형태로 변환
  function convertOutlineKeys(nodes: OutlineNode[]): any[] {
    return nodes.map((node) => ({
      ...node,
      sections: node.children ? convertOutlineKeys(node.children) : undefined,
      children: undefined, // children 키 제거
    }));
  }

  // SSE를 이용한 보고서 본문 생성 함수
  const handleGenerateReport = () => {
    setReportContent("");
    setIsGeneratingReport(true);

    // outline 변환: children -> sections, 최상위는 chapters
    const convertedOutline = convertOutlineKeys(outline);

    const eventSource = new EventSourcePolyfill(
      "http://localhost:8000/generate-report",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        payload: JSON.stringify({
          topic,
          outline: { chapters: convertedOutline }, // 서버가 chapters를 기대할 때
        }),
        method: "POST",
      }
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "done") {
          setIsGeneratingReport(false);
          eventSource.close();
        } else if (data.payload) {
          setReportContent((prev) => prev + data.payload);
        }
      } catch (e) {
        setIsGeneratingReport(false);
        eventSource.close();
      }
    };
    eventSource.onerror = () => {
      setIsGeneratingReport(false);
      eventSource.close();
      setError("보고서 생성 중 오류가 발생했습니다.");
    };
  };

  // EventSource Polyfill (fetch-sse 방식)
  // 브라우저 기본 EventSource는 POST를 지원하지 않으므로 polyfill 필요
  type EventSourcePolyfillOptions = {
    headers?: Record<string, string>;
    payload?: string;
    method?: string;
  };
  class EventSourcePolyfill {
    controller: AbortController;
    onmessage: ((event: { data: string }) => void) | null;
    onerror: ((err: any) => void) | null;
    constructor(url: string, options: EventSourcePolyfillOptions) {
      this.controller = new AbortController();
      this.onmessage = null;
      this.onerror = null;
      fetch(url, {
        method: options.method || "GET",
        headers: options.headers,
        body: options.payload,
        signal: this.controller.signal,
      })
        .then(async (res) => {
          if (!res.body) throw new Error("No response body");
          const reader = res.body.getReader();
          let buffer = "";
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += new TextDecoder().decode(value);
            let lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              if (line.startsWith("data:")) {
                const data = line.replace(/^data:\s*/, "");
                if (this.onmessage) this.onmessage({ data });
              }
            }
          }
        })
        .catch((err) => {
          if (this.onerror) this.onerror(err);
        });
    }
    close() {
      this.controller.abort();
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <div
        style={{
          background: "#f8fafc",
          padding: 24,
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 20,
            color: "#1e293b",
          }}
        >
          📝 보고서 주제 입력
        </h2>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              color: "#475569",
              marginBottom: 8,
            }}
          >
            보고서 주제
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="예: 기업 ESG 경영 전략 분석, 탄소중립 정책 현황 및 전망..."
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: 16,
              border: "2px solid #e2e8f0",
              borderRadius: 8,
              outline: "none",
              transition: "all 0.2s",
              background: "white",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
              e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || !topic}
          style={{
            padding: "12px 24px",
            fontSize: 16,
            fontWeight: 600,
            background: loading || !topic ? "#94a3b8" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: loading || !topic ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          onMouseEnter={(e) => {
            if (!loading && topic) {
              e.currentTarget.style.background = "#1d4ed8";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && topic) {
              e.currentTarget.style.background = "#2563eb";
              e.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          {loading ? (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              생성 중...
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              보고서 목차 생성
            </>
          )}
        </button>
        {error && (
          <div
            style={{
              color: "#dc2626",
              marginTop: 12,
              padding: "8px 12px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            ⚠️ {error}
          </div>
        )}
      </div>

      {outline && outline.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
            목차 트리(드래그/수정 가능)
          </h3>
          <DraggableOutlineTree nodes={outline} setNodes={setOutline} />
          <button
            onClick={handleGenerateReport}
            disabled={isGeneratingReport || !topic || outline.length === 0}
            style={{
              marginTop: 16,
              padding: "8px 20px",
              fontSize: 16,
              fontWeight: 600,
              background: "#059669",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: isGeneratingReport ? "not-allowed" : "pointer",
            }}
          >
            {isGeneratingReport ? "보고서 생성 중..." : "보고서 본문 생성"}
          </button>
        </div>
      )}
      {reportContent && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
            보고서 본문
          </h3>
          <pre
            style={{
              background: "#f4f4f4",
              padding: 16,
              borderRadius: 6,
              whiteSpace: "pre-wrap",
            }}
          >
            {reportContent}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
