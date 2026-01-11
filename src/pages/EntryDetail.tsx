import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { getEntryContent, type Entry, getAllEntries } from "@/lib/content";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Streamdown } from "streamdown";
import matter from "gray-matter";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Buffer } from 'buffer';

// Polyfill Buffer for gray-matter
if (typeof globalThis !== "undefined") {
  (globalThis as typeof globalThis & { Buffer?: typeof Buffer }).Buffer = Buffer;
}

export default function EntryDetail() {
  const [match, params] = useRoute("/entries/:slug");
  const [content, setContent] = useState<string>("");
  const [metadata, setMetadata] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!match || !params?.slug) return;

    const load = async () => {
      try {
        setLoading(true);
        const raw = await getEntryContent(params.slug);

        if (!raw) {
          setError(true);
          return;
        }

        // Parse frontmatter in browser
        const { data, content: markdownBody } = matter(raw);

        // Merge with index data if possible, or just use file data
        // We trust file data more for the detail view
        setMetadata({
            slug: params.slug,
            title: data.title,
            createdAt: data.createdAt,
            audioUrl: data.audioUrl,
            tags: data.tags,
            level: data.level
        });

        setContent(markdownBody);
      } catch (err) {
        console.error('Error loading entry:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [match, params?.slug]);

  if (!match) return null;

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse max-w-3xl mx-auto">
        <div className="h-8 w-32 bg-muted rounded" />
        <div className="h-12 w-3/4 bg-muted rounded" />
        <div className="h-48 w-full bg-muted rounded-xl" />
        <div className="space-y-4">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Entry Not Found</h2>
        <Link href="/">
          <Button>Back to Library</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-in fade-in duration-500">
      <Link href="/">
        <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
        </Button>
      </Link>

      <header className="mb-8 space-y-4">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
           <span className="flex items-center gap-1">
             <Calendar className="h-4 w-4" />
             {format(new Date(metadata.createdAt), "MMMM d, yyyy")}
           </span>
           {metadata.level && (
             <>
               <span>•</span>
               <span className="font-semibold text-primary">{metadata.level}</span>
             </>
           )}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
          {metadata.title}
        </h1>

        {metadata.tags && metadata.tags.length > 0 && (
          <div className="flex gap-2 mt-4">
            {metadata.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {metadata.audioUrl && (
        <section className="mb-12 sticky top-4 z-10">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl -z-10 rounded-xl -m-4" />
          <AudioPlayer src={metadata.audioUrl} className="border-primary/20 shadow-lg shadow-primary/5" />
        </section>
      )}

      <Separator className="mb-12" />

      <article className="prose prose-lg dark:prose-invert">
        <Streamdown>{content}</Streamdown>
      </article>
    </div>
  );
}
