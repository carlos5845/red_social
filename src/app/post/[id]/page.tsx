import { getPostById } from "@/app/actions/post";
import { SinglePostView } from "@/components/SinglePostView";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPostById(parseInt(id));

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-zinc-400 pt-24">
      <div className="max-w-2xl mx-auto px-6">
        <SinglePostView initialPost={post} />
      </div>
    </div>
  );
}
