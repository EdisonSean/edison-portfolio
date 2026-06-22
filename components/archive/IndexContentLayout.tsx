type IndexContentLayoutProps = {
  sidebar: React.ReactNode;
  content: React.ReactNode;
};

export default function IndexContentLayout({
  sidebar,
  content,
}: IndexContentLayoutProps) {
  return (
    <section className="grid w-full gap-12 pt-14 md:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] md:gap-10 md:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] lg:gap-14 2xl:grid-cols-[minmax(0,1fr)_minmax(560px,34vw)] 2xl:gap-16">
      <div className="min-w-0 pb-20 md:order-1">{content}</div>

      <aside className="order-first md:order-2 md:sticky md:top-20 md:h-[calc(100svh-5rem)] md:self-start">
        {sidebar}
      </aside>
    </section>
  );
}
