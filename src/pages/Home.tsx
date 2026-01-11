import { useEffect, useState } from "react";
import { getAllEntries, type Entry } from "@/lib/content";
import { Link } from "wouter";
import { format } from "date-fns";
import { Headphones, Calendar, ArrowRight, Tag } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllEntries().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight font-serif text-foreground">Library</h1>
        <p className="text-lg text-muted-foreground font-serif">
          Weekly transcripts and audio lessons.
        </p>
      </div>

      <div className="grid gap-6">
        {entries.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl">
            <p className="text-muted-foreground">No entries found.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add markdown files to <code className="bg-muted px-1 rounded">src/content/entries/</code>
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <Link key={entry.slug} href={`/entries/${entry.slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/50 cursor-pointer overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-2xl font-serif font-bold group-hover:text-primary transition-colors">
                      {entry.title}
                    </CardTitle>
                    {entry.audioUrl && (
                      <Badge variant="secondary" className="flex items-center gap-1 font-mono text-xs">
                        <Headphones className="h-3 w-3" /> AUDIO
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {entry.createdAt ? format(new Date(entry.createdAt), "MMMM d, yyyy") : "Unknown Date"}
                    </div>
                    {entry.level && (
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-primary">{entry.level}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex items-center justify-between">
                   <div className="flex gap-2">
                      {entry.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs font-normal text-muted-foreground">
                          #{tag}
                        </Badge>
                      ))}
                   </div>
                   <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                      Read & Listen <ArrowRight className="ml-2 h-4 w-4" />
                   </Button>
                </CardFooter>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
