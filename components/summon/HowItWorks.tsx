export default function HowItWorks({ dict }: { dict?: any }) {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{dict?.how_title}</h2>
          <p className="mt-3 text-gray-300">{dict?.how_text}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 h-48 flex items-center justify-center text-cyan-300">
          {dict?.how_diagram}
        </div>
      </div>
    </section>
  )
}
