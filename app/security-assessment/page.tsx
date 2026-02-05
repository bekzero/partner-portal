"use client";

import { useEffect, useRef } from "react";

export default function SecurityAssessmentPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "assessmentComplete") {
        console.log("Assessment completed");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)]">
      <iframe
        ref={iframeRef}
        src="/security-assessment.html"
        className="w-full h-full rounded-lg border border-zinc-800/60"
        style={{ minHeight: "800px" }}
        title="Security Assessment Tool"
      />
    </div>
  );
}
