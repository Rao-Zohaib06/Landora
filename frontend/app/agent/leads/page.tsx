"use client";

import { useState } from "react";
import { Paperclip, UploadCloud, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ModuleHeader } from "@/components/agent/module-header";
import { LeadStatus, useAgentStore } from "@/hooks/use-agent-store";
import { LeadTimeline } from "@/components/agent/lead-timeline";

export default function AgentLeadsPage() {
  const { leads, updateLeadStatus, addLeadNote } = useAgentStore();
  const [note, setNote] = useState("");
  const [activeLead, setActiveLead] = useState(leads[0]);

  const handleSubmitNote = () => {
    if (!note.trim()) return;
    addLeadNote(activeLead.id, note);
    setNote("");
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
      <ModuleHeader
        title="Lead Management"
        subtitle="Track prospects, update their status, review timeline, and keep notes."
        actions={
          <Button variant="gradient" className="rounded-full">
            New Lead
          </Button>
        }
      />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <AnimatedSection
          variant="slideUp"
          className="lg:col-span-1 glass rounded-3xl border border-white/10 divide-y divide-white/5"
        >
          {leads.map((lead) => (
            <button
              key={lead.id}
              onClick={() => setActiveLead(lead)}
              className={`w-full text-left px-4 py-4 transition ${
                activeLead.id === lead.id ? "bg-white/8" : "hover:bg-white/5"
              }`}
            >
              <p className="text-lg font-semibold">{lead.name}</p>
              <p className="text-sm text-white/60">{lead.plot}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-white/50">
                <span>{lead.channel}</span>
                <span>{lead.updatedAt}</span>
              </div>
            </button>
          ))}
        </AnimatedSection>

        <AnimatedSection
          variant="slideUp"
          className="lg:col-span-2 glass rounded-3xl border border-white/10 p-6 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs text-white/60">{activeLead.id}</p>
              <h2 className="text-2xl font-semibold">{activeLead.name}</h2>
              <p className="text-sm text-white/60">{activeLead.plot}</p>
            </div>
            <div className="flex items-center gap-3">
              {(["new", "in-progress", "won", "lost"] as LeadStatus[]).map(
                (status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={
                      activeLead.status === status ? "gradient" : "outline"
                    }
                    className="capitalize"
                    onClick={() => updateLeadStatus(activeLead.id, status)}
                  >
                    {status.replace("-", " ")}
                  </Button>
                ),
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="glass rounded-2xl border border-white/5 p-4 space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Notes
              </p>
              {activeLead.notes.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="p-3 rounded-xl bg-white/5 text-sm text-white/80"
                >
                  {item}
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add note"
                  className="flex-1 rounded-xl bg-transparent border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[#6139DB]"
                />
                <Button
                  variant="gradient"
                  size="icon"
                  onClick={handleSubmitNote}
                >
                  <MessageSquarePlus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="glass rounded-2xl border border-white/5 p-4 space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Documents
              </p>
              <div className="border border-dashed border-white/20 rounded-xl p-4 text-center text-sm text-white/70">
                <UploadCloud className="w-6 h-6 mx-auto mb-2 text-[#6139DB]" />
                Drag & drop files or{" "}
                <span className="text-[#6139DB] font-semibold cursor-pointer">
                  browse
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Paperclip className="w-4 h-4" />
                Accepted: PDF, DOCX, PNG
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">
              Timeline
            </p>
            <LeadTimeline lead={activeLead} />
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
