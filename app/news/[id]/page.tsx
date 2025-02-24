import { notFound } from "next/navigation"

async function getNewsArticle(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/${id}`, { cache: "no-store" })
  if (!res.ok) {
    if (res.status === 404) {
      notFound()
    }
    throw new Error("Failed to fetch news article")
  }
  return res.json()
}

export default async function NewsDetail({ params }: { params: { id: string } }) {
  const article = await getNewsArticle(params.id)

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <article className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <p className="text-muted-foreground mb-6">{new Date(article.publishedAt).toLocaleDateString()}</p>
          {article.image && (
            <img
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <div className="prose max-w-none">
            <p>{article.content}</p>
          </div>
          {article.tags && article.tags.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Tags:</h2>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {article.author && <p className="mt-6 text-muted-foreground">Author: {article.author}</p>}
        </article>
      </main>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 友趣館xNewplacehk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

