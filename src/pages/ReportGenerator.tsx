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
        display: "inline-block",
        cursor: "grab",
        marginRight: 8,
        verticalAlign: "middle",
        userSelect: "none",
        color: "#888",
      }}
      title="드래그로 순서 변경"
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="6" cy="6" r="1.5" fill="currentColor" />
        <circle cx="6" cy="10" r="1.5" fill="currentColor" />
        <circle cx="6" cy="14" r="1.5" fill="currentColor" />
        <circle cx="14" cy="6" r="1.5" fill="currentColor" />
        <circle cx="14" cy="10" r="1.5" fill="currentColor" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" />
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
      marginBottom: 4,
      padding: 8,
      borderRadius: 6,
      boxShadow: isDragging
        ? "0 2px 8px rgba(59,130,246,0.15)"
        : "0 1px 2px rgba(0,0,0,0.03)",
      display: "flex",
      alignItems: "center",
      border: isDragging ? "2px solid #2563eb" : "1px solid #e5e7eb",
      cursor: "grab",
    } as React.CSSProperties;
    return (
      <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <DragHandle />
        <input
          value={node.title}
          onChange={(e) => onEdit(node.id, e.target.value)}
          style={{
            fontSize: 15,
            marginRight: 8,
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />
        <button onClick={() => onAdd(node.id)} style={{ marginRight: 4 }}>
          하위 추가
        </button>
        <button onClick={() => onDelete(node.id)} style={{ color: "red" }}>
          삭제
        </button>
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
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        보고서 주제 입력
      </h2>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="보고서 주제를 입력하세요"
        style={{ width: "100%", padding: 8, marginBottom: 12, fontSize: 16 }}
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !topic}
        style={{
          padding: "8px 20px",
          fontSize: 16,
          fontWeight: 600,
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: loading || !topic ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "생성 중..." : "보고서 목차 생성"}
      </button>
      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}

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
