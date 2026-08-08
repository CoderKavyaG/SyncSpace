"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Home,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Check,
  Building,
  Loader2,
  Layers,
  FileText,
  Zap,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SyncSpaceLogo } from "@/components/ui/syncspace-logo";

type UseCaseType = "work" | "personal" | "school";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useCurrentUser();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseType>("work");
  const [workspaceName, setWorkspaceName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enableLocalCache, setEnableLocalCache] = useState(true);

  // Set default workspace name when user loads
  React.useEffect(() => {
    if (user?.name && !workspaceName) {
      setWorkspaceName(`${user.name}'s Workspace`);
    }
  }, [user?.name, workspaceName]);

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else {
      handleCompleteOnboarding();
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsSubmitting(true);
    try {
      // 1. Fetch current workspace ID
      const wsRes = await fetch("/api/workspaces");
      if (wsRes.ok) {
        const workspaces = await wsRes.json();
        if (workspaces.length > 0) {
          const currentWsId = workspaces[0].id;

          // 2. Call setup API endpoint with custom name, use case, and seed templates
          await fetch("/api/onboarding/setup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              workspaceId: currentWsId,
              workspaceName: workspaceName.trim() || `${user?.name || "My"}'s Workspace`,
              useCase: selectedUseCase,
              enableLocalCache,
            }),
          });
        }
      }

      // 3. Navigate into the freshly customized workspace
      window.location.href = "/workspace";
    } catch (err) {
      console.error("Onboarding completion error:", err);
      window.location.href = "/workspace";
    }
  };

  const useCases = [
    {
      id: "work" as UseCaseType,
      title: "For work & engineering",
      subtitle: "Track roadmaps, sprint tasks, meeting notes, and architecture docs",
      icon: <Briefcase className="w-5 h-5 text-[#0070F3]" />,
      templates: ["Welcome Guide", "Product Roadmap & OKRs", "Weekly Team Sync"],
    },
    {
      id: "personal" as UseCaseType,
      title: "For personal life",
      subtitle: "Write better, think more clearly, organize daily thoughts and habits",
      icon: <Home className="w-5 h-5 text-emerald-600" />,
      templates: ["Welcome Guide", "Daily Notes & Journal", "Reading List & References"],
    },
    {
      id: "school" as UseCaseType,
      title: "For school & research",
      subtitle: "Keep lecture notes, research papers, and assignments in one place",
      icon: <GraduationCap className="w-5 h-5 text-amber-600" />,
      templates: ["Welcome Guide", "Course Notes & Research", "Assignments & Deadlines"],
    },
  ];

  return (
    <div className="min-h-screen w-screen bg-[#FAF9F6] text-[#14171A] flex flex-col justify-between font-body antialiased selection:bg-primary/20 select-none">
      {/* Top Header / Progress Bar (Notion Light) */}
      <header className="w-full border-b border-[#E2E4E9] bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SyncSpaceLogo size={28} />
            <span className="font-display font-bold text-base tracking-tight text-[#14171A]">
              SyncSpace
            </span>
          </div>

          {/* Stepper Pill */}
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-[#E2E4E9] text-xs font-mono font-medium text-[#626875]">
              Step <span className="text-[#0070F3] font-bold">{step}</span> / 2
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            /* STEP 1: Choose Use Case */
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-8 text-center"
            >
              {/* Header Icon */}
              <div className="inline-flex p-3 rounded-2xl bg-blue-50 border border-blue-200 text-[#0070F3] shadow-xs">
                <Zap className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-[#14171A] font-display">
                  How do you want to use SyncSpace?
                </h1>
                <p className="text-sm text-[#626875]">
                  This personalizes your initial workspace layout and starter documents.
                </p>
              </div>

              {/* Use Case Cards */}
              <div className="space-y-3 text-left">
                {useCases.map((uc) => {
                  const isSelected = selectedUseCase === uc.id;
                  return (
                    <div
                      key={uc.id}
                      onClick={() => setSelectedUseCase(uc.id)}
                      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#0070F3] bg-blue-50/50 ring-2 ring-[#0070F3]/20 shadow-xs"
                          : "border-[#E2E4E9] bg-white hover:border-[#CBD0DC] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-xl border flex-shrink-0 ${
                          isSelected
                            ? "border-blue-200 bg-white shadow-xs"
                            : "border-[#E2E4E9] bg-[#FAF9F6]"
                        }`}
                      >
                        {uc.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-[#14171A] font-display">
                            {uc.title}
                          </h3>
                          {isSelected && <Check className="w-4 h-4 text-[#0070F3]" />}
                        </div>
                        <p className="text-xs text-[#626875] mt-0.5 leading-relaxed">
                          {uc.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0070F3] hover:bg-[#0060DF] text-white py-3.5 text-sm font-bold shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            /* STEP 2: Name Workspace */
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-8 text-center"
            >
              {/* Header Icon */}
              <div className="inline-flex p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 shadow-xs">
                <Building className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-[#14171A] font-display">
                  Name your workspace
                </h1>
                <p className="text-sm text-[#626875]">
                  You can always change this or invite team members later from workspace settings.
                </p>
              </div>

              {/* Workspace Input Card */}
              <div className="rounded-2xl border border-[#E2E4E9] bg-white p-6 space-y-5 text-left shadow-xs">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8A8F98] mb-2 font-display">
                    Workspace Name
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0070F3] text-white font-bold font-display flex items-center justify-center text-sm shadow-xs flex-shrink-0">
                      {workspaceName ? workspaceName.substring(0, 2).toUpperCase() : "WS"}
                    </div>
                    <input
                      type="text"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      placeholder="e.g. Acme Studio, Product Lab"
                      required
                      autoFocus
                      className="w-full rounded-xl border border-[#E2E4E9] bg-white py-2.5 px-3.5 text-sm text-[#14171A] placeholder:text-[#8A8F98]/60 focus:border-[#0070F3] focus:outline-none focus:ring-2 focus:ring-[#0070F3]/20 transition-all font-body font-medium"
                    />
                  </div>
                </div>

                {/* Templates Preview Pills */}
                <div className="pt-2 border-t border-[#E2E4E9] space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#8A8F98]">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Starter document bundle included:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {useCases
                      .find((u) => u.id === selectedUseCase)
                      ?.templates.map((tpl) => (
                        <div
                          key={tpl}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF9F6] border border-[#E2E4E9] text-[11px] font-semibold text-[#14171A]"
                        >
                          <FileText className="w-3 h-3 text-[#0070F3]" />
                          <span>{tpl}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Local-First Storage Checkbox */}
              <div className="flex items-center gap-2.5 text-left text-xs text-[#626875] px-1">
                <input
                  type="checkbox"
                  id="enableLocalCache"
                  checked={enableLocalCache}
                  onChange={(e) => setEnableLocalCache(e.target.checked)}
                  className="rounded border-[#E2E4E9] text-[#0070F3] focus:ring-[#0070F3] cursor-pointer"
                />
                <label htmlFor="enableLocalCache" className="cursor-pointer">
                  Enable offline IndexedDB persistence & zero-latency local keystroke caching
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="px-5 py-3.5 rounded-xl border border-[#E2E4E9] bg-white text-xs font-semibold text-[#14171A] hover:bg-[#FAF9F6] transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleCompleteOnboarding}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#0070F3] hover:bg-[#0060DF] text-white py-3.5 text-sm font-bold shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Provisioning Local-First Workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>Launch Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 border-t border-[#E2E4E9] text-xs text-[#8A8F98] font-mono">
        SyncSpace • Local-First Architecture • Yjs CRDTs • IndexedDB Storage
      </footer>
    </div>
  );
}
