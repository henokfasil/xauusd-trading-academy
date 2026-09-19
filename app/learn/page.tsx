"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAcademy } from "@/lib/store";
import { Card, Button, Icon, Badge, ClientOnly, EditableText } from "@/components/ui";

const lessonHref = (moduleId: string, lessonId: string) => `/learn?m=${moduleId}&l=${lessonId}`;

function LessonInner({ moduleId, lessonId }: { moduleId: string; lessonId: string }) {
  const router = useRouter();
  const { modules, lessons, glossary, quizzes, updateLesson, deleteLesson, reorderLesson, toggleComplete, setLessonStatus, addLesson, setLastLessonRoute, recordQuiz } = useAcademy();

  const lesson = lessons.find((l) => l.id === lessonId);
  const mod = modules.find((m) => m.id === moduleId);
  const modLessons = useMemo(() => lessons.filter((l) => l.moduleId === moduleId).sort((a, b) => a.order - b.order), [lessons, moduleId]);
  const globalOrdered = useMemo(() => [...lessons].sort((a, b) => a.order - b.order), [lessons]);

  const [editing, setEditing] = useState(false);
  const [draftBody, setDraftBody] = useState("");
  const [notesEditing, setNotesEditing] = useState(false);
  const [draftNotes, setDraftNotes] = useState("");
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    if (lesson) {
      setDraftBody(lesson.body);
      setDraftNotes(lesson.notes);
      setLastLessonRoute(lessonHref(moduleId, lessonId));
      if (lesson.status === "unseen") setLessonStatus(lesson.id, "learning");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  if (!lesson || !mod) {
    return (
      <div className="text-center py-20">
        <p className="text-muted">Lesson not found. It may have been deleted, or the link is incomplete.</p>
        <Link href="/" className="mt-3 inline-block text-accent hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const idx = globalOrdered.findIndex((l) => l.id === lessonId);
  const prev = globalOrdered[idx - 1];
  const nextL = globalOrdered[idx + 1];
  const lessonConcepts = glossary.filter((g) => lesson.concepts.includes(g.id));
  const lessonQuiz = quizzes.filter((q) => q.lessonId === lesson.id);

  const saveBody = () => { updateLesson(lesson.id, { body: draftBody }); setEditing(false); };
  const saveNotes = () => { updateLesson(lesson.id, { notes: draftNotes }); setNotesEditing(false); };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
      <div className="min-w-0">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted">
            <Link href="/" className="hover:text-fg">Academy</Link>
            <Icon name="ChevronRight" size={14} />
            <span>{mod.title}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="ghost" title="Move up" onClick={() => reorderLesson(lesson.id, -1)}><Icon name="ArrowUp" size={14} /></Button>
            <Button size="sm" variant="ghost" title="Move down" onClick={() => reorderLesson(lesson.id, 1)}><Icon name="ArrowDown" size={14} /></Button>
            {!editing ? (
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}><Icon name="Pencil" size={14} /> Edit</Button>
            ) : (
              <>
                <Button size="sm" variant="ghost" onClick={() => { setDraftBody(lesson.body); setEditing(false); }}>Cancel</Button>
                <Button size="sm" variant="primary" onClick={saveBody}><Icon name="Check" size={14} /> Save</Button>
              </>
            )}
            <Button
              size="sm" variant="danger" title="Delete lesson"
              onClick={() => { if (confirm(`Delete "${lesson.title}"? This cannot be undone.`)) { deleteLesson(lesson.id); router.push("/"); } }}
            >
              <Icon name="Trash2" size={14} />
            </Button>
          </div>
        </div>

        <div className="mb-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            <EditableText value={lesson.title} onChange={(v) => updateLesson(lesson.id, { title: v })} inputClassName="text-3xl font-semibold" />
          </h1>
        </div>
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
          <Badge tone="accent">{mod.title}</Badge>
          <span className="flex items-center gap-1"><Icon name="Clock" size={13} /> ~{lesson.estMinutes} min</span>
          <StatusPill status={lesson.status} />
        </div>

        {editing ? (
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-subtle">
              <Icon name="Info" size={13} /> Markdown supported (headings, **bold**, lists, tables, &gt; quotes, `code`).
            </div>
            <textarea
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              className="min-h-[60vh] w-full resize-y rounded-xl border border-border bg-elevated p-4 font-mono text-sm leading-relaxed outline-none focus:border-accent/60"
            />
          </div>
        ) : (
          <article className="prose-academy max-w-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.body}</ReactMarkdown>
          </article>
        )}

        {lessonQuiz.length > 0 && !editing && (
          <div className="mt-8">
            {!quizOpen ? (
              <Button variant="outline" onClick={() => setQuizOpen(true)}><Icon name="HelpCircle" size={16} /> Check your understanding ({lessonQuiz.length})</Button>
            ) : (
              <Quiz questions={lessonQuiz} onComplete={(c, t) => recordQuiz(lesson.id, c, t)} />
            )}
          </div>
        )}

        <Card className="mt-8 p-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2"><Icon name="StickyNote" size={16} className="text-accent" /><h3 className="font-semibold">My notes</h3></div>
            {!notesEditing ? (
              <Button size="sm" variant="ghost" onClick={() => setNotesEditing(true)}><Icon name="Pencil" size={13} /> {lesson.notes ? "Edit" : "Add note"}</Button>
            ) : (
              <div className="flex gap-1.5">
                <Button size="sm" variant="ghost" onClick={() => { setDraftNotes(lesson.notes); setNotesEditing(false); }}>Cancel</Button>
                <Button size="sm" variant="primary" onClick={saveNotes}>Save</Button>
              </div>
            )}
          </div>
          {notesEditing ? (
            <textarea
              value={draftNotes}
              onChange={(e) => setDraftNotes(e.target.value)}
              placeholder="Your own observations, chart examples, questions, links…"
              className="min-h-[120px] w-full resize-y rounded-lg border border-border bg-elevated p-3 text-sm outline-none focus:border-accent/60"
            />
          ) : lesson.notes ? (
            <article className="prose-academy text-sm"><ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.notes}</ReactMarkdown></article>
          ) : (
            <p className="text-sm text-subtle italic">No personal notes yet. Capture your own examples and questions here — they're saved locally.</p>
          )}
        </Card>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
          {prev ? (
            <Link href={lessonHref(prev.moduleId, prev.id)} className="group flex-1">
              <div className="text-xs text-subtle">← Previous</div>
              <div className="text-sm font-medium group-hover:text-accent">{prev.title}</div>
            </Link>
          ) : <div className="flex-1" />}
          {nextL ? (
            <Link href={lessonHref(nextL.moduleId, nextL.id)} className="group flex-1 text-right">
              <div className="text-xs text-subtle">Next →</div>
              <div className="text-sm font-medium group-hover:text-accent">{nextL.title}</div>
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-8 space-y-4">
          <Card className="p-4">
            <button
              onClick={() => toggleComplete(lesson.id)}
              className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                lesson.completed ? "border-bull/40 bg-bull/10 text-bull" : "border-border hover:bg-elevated"
              }`}
            >
              <Icon name={lesson.completed ? "CheckCircle2" : "Circle"} size={16} />
              {lesson.completed ? "Completed" : "Mark complete"}
            </button>
            <div className="mt-3">
              <div className="mb-1.5 text-xs font-medium text-subtle">Mastery status</div>
              <div className="grid grid-cols-3 gap-1">
                {(["learning", "review", "mastered"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setLessonStatus(lesson.id, st)}
                    className={`rounded-md border px-1 py-1.5 text-[11px] capitalize transition-colors ${
                      lesson.status === st ? "border-accent/50 bg-accent/10 text-accent" : "border-border text-muted hover:bg-elevated"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {lessonConcepts.length > 0 && (
            <Card className="p-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-subtle">
                <Icon name="BookA" size={13} /> Concepts here
              </div>
              <div className="space-y-2">
                {lessonConcepts.map((c) => (
                  <details key={c.id} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium hover:text-accent">
                      {c.term}
                      <Icon name="ChevronDown" size={13} className="text-subtle transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-1 text-xs text-muted">{c.definition}</p>
                    {c.example && <p className="mt-1 text-xs italic text-subtle">e.g. {c.example}</p>}
                  </details>
                ))}
              </div>
              <Link href="/glossary" className="mt-3 block text-xs text-accent hover:underline">Full glossary →</Link>
            </Card>
          )}

          {lesson.toolRoute && (
            <Link href={lesson.toolRoute}>
              <Card className="border-accent/30 bg-accent/[0.05] p-4 transition-colors hover:bg-accent/10">
                <div className="flex items-center gap-2 text-accent">
                  <Icon name="Wand2" size={16} />
                  <span className="text-sm font-medium">Practise this interactively →</span>
                </div>
              </Card>
            </Link>
          )}

          <Card className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wide text-subtle">{mod.title}</div>
              <button onClick={() => { const id = addLesson(mod.id, "New lesson"); router.push(lessonHref(mod.id, id)); }} title="Add lesson" className="text-subtle hover:text-accent">
                <Icon name="Plus" size={15} />
              </button>
            </div>
            <div className="space-y-0.5">
              {modLessons.map((l) => (
                <Link
                  key={l.id}
                  href={lessonHref(l.moduleId, l.id)}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${l.id === lessonId ? "bg-accent/10 text-accent" : "text-muted hover:bg-elevated hover:text-fg"}`}
                >
                  <Icon name={l.completed ? "CheckCircle2" : "Circle"} size={13} className={l.completed ? "text-bull" : "text-subtle"} />
                  <span className="truncate">{l.title}</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </aside>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: any = {
    unseen: { tone: "muted", label: "New" },
    learning: { tone: "accent", label: "Learning" },
    review: { tone: "warn", label: "Review" },
    mastered: { tone: "bull", label: "Mastered" },
  };
  const s = map[status] ?? map.unseen;
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

function Quiz({ questions, onComplete }: { questions: any[]; onComplete: (correct: number, total: number) => void }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const correct = questions.filter((q) => answers[q.id] === q.correctIndex).length;

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2"><Icon name="HelpCircle" size={16} className="text-accent" /><h3 className="font-semibold">Check your understanding</h3></div>
      <div className="space-y-5">
        {questions.map((q, qi) => (
          <div key={q.id}>
            <div className="mb-2 text-sm font-medium">{qi + 1}. {q.prompt}</div>
            <div className="space-y-1.5">
              {q.options.map((opt: string, oi: number) => {
                const chosen = answers[q.id] === oi;
                const isCorrect = oi === q.correctIndex;
                let cls = "border-border hover:bg-elevated";
                if (submitted) {
                  if (isCorrect) cls = "border-bull/50 bg-bull/10 text-bull";
                  else if (chosen) cls = "border-bear/50 bg-bear/10 text-bear";
                } else if (chosen) cls = "border-accent/50 bg-accent/10";
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${cls}`}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[10px]">{String.fromCharCode(65 + oi)}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && <p className="mt-2 text-xs text-muted"><b>Why:</b> {q.explanation}</p>}
          </div>
        ))}
      </div>
      {!submitted ? (
        <Button className="mt-4" variant="primary" disabled={Object.keys(answers).length < questions.length} onClick={() => { setSubmitted(true); onComplete(correct, questions.length); }}>
          Submit answers
        </Button>
      ) : (
        <div className="mt-4 flex items-center gap-3">
          <Badge tone={correct === questions.length ? "bull" : "warn"}>Score: {correct}/{questions.length}</Badge>
          <Button size="sm" variant="ghost" onClick={() => { setSubmitted(false); setAnswers({}); }}>Retry</Button>
        </div>
      )}
    </Card>
  );
}

function LearnRouter() {
  const params = useSearchParams();
  const moduleId = params.get("m") ?? "";
  const lessonId = params.get("l") ?? "";
  if (!moduleId || !lessonId) {
    return (
      <div className="text-center py-20">
        <p className="text-muted">Pick a lesson from the sidebar to begin.</p>
        <Link href="/" className="mt-3 inline-block text-accent hover:underline">Back to dashboard</Link>
      </div>
    );
  }
  return <LessonInner moduleId={moduleId} lessonId={lessonId} />;
}

export default function LessonPage() {
  return (
    <ClientOnly fallback={<div className="text-muted">Loading lesson…</div>}>
      <Suspense fallback={<div className="text-muted">Loading lesson…</div>}>
        <LearnRouter />
      </Suspense>
    </ClientOnly>
  );
}
