"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, Edit3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkdownContent } from "@/components/markdown-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BattleCardFormProps {
  initialData?: {
    id: string;
    title: string;
    summary: string;
    competitor: string;
    industry: string;
    contentMarkdown: string;
    published: boolean;
    tags: string[];
  };
  allTags: { id: string; name: string }[];
}

export function BattleCardForm({ initialData, allTags }: BattleCardFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    summary: initialData?.summary || "",
    competitor: initialData?.competitor || "",
    industry: initialData?.industry || "",
    contentMarkdown: initialData?.contentMarkdown || "",
    published: initialData?.published ?? true,
    tags: initialData?.tags || [],
  });
  const [newTag, setNewTag] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = initialData
      ? `/api/battle-cards/${initialData.id}`
      : "/api/battle-cards";
    const method = initialData ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/app/battle-cards/${data.id || initialData?.id}`);
        router.refresh();
      } else {
        console.error("Failed to save battle card");
      }
    } catch (error) {
      console.error("Error saving battle card:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-zinc-800/60 bg-zinc-900/50">
        <CardContent className="pt-6 space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-300">
              Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Kzero vs Competitor: Enterprise Positioning"
              required
              className="border-zinc-800/60 bg-zinc-950/50 text-zinc-100"
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-zinc-300">
              Summary <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Brief description of the battle card content..."
              required
              rows={2}
              className="border-zinc-800/60 bg-zinc-950/50 text-zinc-100"
            />
          </div>

          {/* Competitor & Industry */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="competitor" className="text-zinc-300">
                Competitor <span className="text-red-400">*</span>
              </Label>
              <Input
                id="competitor"
                value={formData.competitor}
                onChange={(e) => setFormData({ ...formData, competitor: e.target.value })}
                placeholder="e.g., AcmeCloud"
                required
                className="border-zinc-800/60 bg-zinc-950/50 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-zinc-300">
                Industry <span className="text-red-400">*</span>
              </Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g., SaaS"
                required
                className="border-zinc-800/60 bg-zinc-950/50 text-zinc-100"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-zinc-300">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-zinc-800/60 text-zinc-300 cursor-pointer hover:bg-red-950/30 hover:text-red-400"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                className="border-zinc-800/60 bg-zinc-950/50 text-zinc-100"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-xs text-zinc-500">Existing tags:</span>
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    if (!formData.tags.includes(tag.name)) {
                      setFormData({ ...formData, tags: [...formData.tags, tag.name] });
                    }
                  }}
                  className="text-xs text-zinc-600 hover:text-kzOrange transition-colors"
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Published */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-kzOrange focus:ring-kzOrange"
            />
            <Label htmlFor="published" className="text-zinc-300 cursor-pointer">
              Published (visible to all users)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Content Editor with Preview */}
      <Card className="border-zinc-800/60 bg-zinc-900/50">
        <CardContent className="pt-6">
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="bg-zinc-950 border border-zinc-800/60 mb-4">
              <TabsTrigger value="edit" className="data-[state=active]:bg-zinc-800">
                <Edit3 className="mr-2 h-4 w-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-zinc-800">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="edit" className="mt-0">
              <div className="space-y-2">
                <Label htmlFor="content" className="text-zinc-300">
                  Content (Markdown) <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={formData.contentMarkdown}
                  onChange={(e) => setFormData({ ...formData, contentMarkdown: e.target.value })}
                  placeholder="# Battle Card Content&#10;&#10;## TL;DR&#10;- Key point 1&#10;- Key point 2&#10;&#10;## Discovery Questions&#10;- Question 1&#10;- Question 2&#10;&#10;## Objections&#10;**&quot;Objection&quot;**&#10;- Response..."
                  required
                  rows={20}
                  className="font-mono text-sm border-zinc-800/60 bg-zinc-950/50 text-zinc-100"
                />
              </div>
            </TabsContent>
            <TabsContent value="preview" className="mt-0">
              <div className="border border-zinc-800/60 rounded-lg p-6 bg-zinc-950/50 min-h-[400px]">
                {formData.contentMarkdown ? (
                  <MarkdownContent content={formData.contentMarkdown} />
                ) : (
                  <p className="text-zinc-500 italic">Start typing to see preview...</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/app/battle-cards")}
          className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-kzOrange text-zinc-950 hover:bg-kzOrange/90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : initialData ? (
            "Update Battle Card"
          ) : (
            "Create Battle Card"
          )}
        </Button>
      </div>
    </form>
  );
}
