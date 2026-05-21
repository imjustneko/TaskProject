export default async function TaskDetailPage({ params }: PageProps<"/tasks/[id]">) {
  const { id } = await params;
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-text-base dark:text-text-base-dark mb-4">Таск {id}</h1>
      <p className="text-text-muted dark:text-text-muted-dark">Таскийн дэлгэрэнгүй хуудас — удахгүй нэмэгдэнэ.</p>
    </div>
  );
}
