import { products } from './data'
import { ProductCard } from './product-card'

export function ProductGrid({ onAdd, onSeeAll }: { onAdd: (id: string) => void; onSeeAll: () => void }) {
  return (
    <section aria-labelledby="produk-title" className="px-4 pb-4">
      <div className="mb-3 flex items-end justify-between">
        <h2 id="produk-title" className="text-base font-bold">Promo Spesial Siswa</h2>
        <button type="button" onClick={onSeeAll} className="text-xs font-semibold text-primary">
          Lihat semua
        </button>
      </div>
      <ul className="grid grid-cols-2 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={onAdd} />
        ))}
      </ul>
    </section>
  )
}
