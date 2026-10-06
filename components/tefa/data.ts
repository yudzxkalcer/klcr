import { Cookie, CupSoda, PencilRuler, Shirt, type LucideIcon } from 'lucide-react'

export type CategoryId = 'makanan' | 'minuman' | 'atk' | 'atribut'

export type Product = {
  id: string
  name: string
  image: string
  price: number
  originalPrice: number
  unit: string
  category: CategoryId
}

export const categories: { id: CategoryId; label: string; icon: LucideIcon; tone: string }[] = [
  { id: 'makanan', label: 'Makanan Ringan', icon: Cookie, tone: 'bg-accent/35 text-accent-foreground' },
  { id: 'minuman', label: 'Minuman Dingin', icon: CupSoda, tone: 'bg-secondary text-primary' },
  { id: 'atk', label: 'Alat Tulis (ATK)', icon: PencilRuler, tone: 'bg-secondary text-primary' },
  { id: 'atribut', label: 'Atribut Sekolah', icon: Shirt, tone: 'bg-accent/35 text-accent-foreground' },
]

export const products: Product[] = [
  { id: 'air-mineral', name: 'Air Mineral 600ml', image: '/images/air-mineral.png', price: 3000, originalPrice: 4000, unit: 'botol', category: 'minuman' },
  { id: 'mie-cup', name: 'Mie Instan Cup Rasa Ayam', image: '/images/mie-cup.png', price: 5500, originalPrice: 7000, unit: 'cup', category: 'makanan' },
  { id: 'pulpen', name: 'Pulpen Gel 0.5mm (3 pcs)', image: '/images/pulpen.png', price: 7500, originalPrice: 9000, unit: 'pak', category: 'atk' },
  { id: 'roti', name: 'Roti Isi Cokelat Lumer', image: '/images/roti.png', price: 4500, originalPrice: 6000, unit: 'pcs', category: 'makanan' },
  { id: 'susu', name: 'Susu UHT Cokelat 200ml', image: '/images/susu.png', price: 5000, originalPrice: 6500, unit: 'kotak', category: 'minuman' },
  { id: 'buku-tulis', name: 'Buku Tulis 38 Lembar (5 pcs)', image: '/images/buku-tulis.png', price: 15000, originalPrice: 20000, unit: 'pak', category: 'atk' },
  { id: 'keripik', name: 'Keripik Kentang Original', image: '/images/keripik.png', price: 8000, originalPrice: 10000, unit: 'bungkus', category: 'makanan' },
  { id: 'dasi', name: 'Dasi + Badge OSIS SMA', image: '/images/dasi.png', price: 22000, originalPrice: 27500, unit: 'set', category: 'atribut' },
]

export const aiPickIds = ['air-mineral', 'mie-cup', 'pulpen']

export type Cart = Record<string, number>

export type OrderStatus = 'diproses' | 'siap' | 'selesai'

export type Order = {
  id: string
  code: string
  items: { productId: string; qty: number }[]
  total: number
  status: OrderStatus
  time: string
}

export const initialOrders: Order[] = [
  {
    id: 'o-3',
    code: 'TF-4821',
    items: [
      { productId: 'mie-cup', qty: 1 },
      { productId: 'air-mineral', qty: 1 },
    ],
    total: 8500,
    status: 'siap',
    time: 'Hari ini, 09.45',
  },
  {
    id: 'o-2',
    code: 'TF-3907',
    items: [{ productId: 'buku-tulis', qty: 1 }],
    total: 15000,
    status: 'selesai',
    time: 'Kemarin, 12.10',
  },
  {
    id: 'o-1',
    code: 'TF-3554',
    items: [
      { productId: 'roti', qty: 2 },
      { productId: 'susu', qty: 1 },
    ],
    total: 14000,
    status: 'selesai',
    time: 'Senin, 10.05',
  },
]

export function getProduct(id: string) {
  return products.find((p) => p.id === id)
}

export function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString('id-ID')}`
}

export function discountPercent(p: Product) {
  return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
}
