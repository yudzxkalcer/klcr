import Image from 'next/image'
import { Plus } from 'lucide-react'
import { discountPercent, formatRupiah, type Product } from './data'

export function ProductCard({ product: p, onAdd }: { product: Product; onAdd: (id: string) => void }) {
  return (
    <li className="flex flex-col overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border">
      <div className="relative aspect-square bg-muted">
        <Image src={p.image || '/placeholder.svg'} alt={p.name} fill sizes="180px" className="object-cover" />
        <span className="absolute left-2 top-2 rounded-md bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-white">
          -{discountPercent(p)}%
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <h3 className="line-clamp-2 min-h-[2.5em] text-xs font-semibold leading-tight">{p.name}</h3>
        <div className="leading-tight">
          <p className="text-sm font-extrabold text-primary">{formatRupiah(p.price)}</p>
          <p className="text-[11px] text-muted-foreground">
            <span className="sr-only">Harga normal </span>
            <s>{formatRupiah(p.originalPrice)}</s>
            <span className="ml-1">/ {p.unit}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAdd(p.id)}
          aria-label={`Tambah ${p.name} ke keranjang`}
          className="mt-1.5 flex h-8 items-center justify-center gap-1 rounded-lg border border-primary text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Keranjang
        </button>
      </div>
    </li>
  )
}
