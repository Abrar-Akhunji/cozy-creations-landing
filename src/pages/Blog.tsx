import { Link } from "react-router-dom";

const Blog = () => {
  const posts = [
    {
      title: "How to choose yarn for winter wearables",
      excerpt: "A quick guide to warmth, softness, and durability.",
    },
    {
      title: "Care tips for handmade crochet",
      excerpt: "Keep your pieces looking new with simple routines.",
    },
    {
      title: "Behind the stitch: finishing details",
      excerpt: "Why edges, seams, and blocking make all the difference.",
    },
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-5xl font-semibold tracking-tight">Blog</h1>
        <p className="text-muted-foreground max-w-2xl">
          Studio notes, yarn guides, and behind-the-scenes.
        </p>
      </header>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <article key={p.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-semibold tracking-tight">{p.title}</h2>
            <p className="text-sm text-muted-foreground mt-2">{p.excerpt}</p>
            <Link to="#" className="mt-4 inline-flex text-sm font-medium text-primary story-link">
              Read more
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Blog;
