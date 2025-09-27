import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess } from "@/utils/toast";
import { getVendorProducts, addVendorProduct, updateVendorProduct, removeVendorProduct, type VendorProduct } from "@/utils/vendor-products";
import { Pencil, Trash2, Check, X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

type Draft = {
  id?: string;
  name: string;
  price: number;
  image?: string;
  rating?: number;
  category?: string;
  description?: string;
  stock?: number;
};

function newId() {
  return "vp_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function VendorProductManager() {
  const [items, setItems] = React.useState<VendorProduct[]>(() => getVendorProducts());
  const [draft, setDraft] = React.useState<Draft>({
    name: "",
    price: 0,
    image: "",
    rating: 4.5,
    category: "",
    description: "",
    stock: 1,
  });
  const [editing, setEditing] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState("");

  const reload = () => setItems(getVendorProducts());

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const id = newId();
    addVendorProduct({
      id,
      name: draft.name.trim(),
      price: Number(draft.price || 0),
      image: draft.image?.trim() || "/placeholder.svg",
      rating: draft.rating,
      category: draft.category?.trim(),
      description: draft.description?.trim(),
      stock: Number(draft.stock || 0),
    });
    showSuccess("Produto adicionado");
    setDraft({ name: "", price: 0, image: "", rating: 4.5, category: "", description: "", stock: 1 });
    reload();
  };

  const onSaveRow = (id: string, data: Partial<VendorProduct>) => {
    updateVendorProduct(id, data);
    setEditing(null);
    showSuccess("Produto atualizado");
    reload();
  };

  const onDelete = (id: string) => {
    removeVendorProduct(id);
    showSuccess("Produto removido");
    reload();
  };

  const visible = items.filter((i) => {
    const q = filter.toLowerCase().trim();
    if (!q) return true;
    return [i.name, i.category, i.description].filter(Boolean).some((t) => (t as string).toLowerCase().includes(q));
  });

  return (
    <Tabs defaultValue="list" className="mt-6">
      <TabsList className="grid grid-cols-2 w-full sm:w-auto">
        <TabsTrigger value="list">Meus Produtos</TabsTrigger>
        <TabsTrigger value="new">Novo Produto</TabsTrigger>
      </TabsList>

      <TabsContent value="list" className="mt-4">
        <Card className="animate-in fade-in-50">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg">Catálogo</CardTitle>
            <div className="w-full sm:w-72">
              <Label htmlFor="filter-input" className="sr-only">Filtrar produtos</Label>
              <Input
                id="filter-input"
                placeholder="Filtrar por nome, categoria..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filtrar produtos por nome ou categoria"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {visible.length === 0 ? (
              <div className="text-sm text-slate-500">Nenhum produto cadastrado.</div>
            ) : (
              visible.map((p) => (
                <div key={p.id} className="grid grid-cols-1 sm:grid-cols-[72px_1fr_auto] items-center gap-3 p-3 border rounded-md hover:shadow-sm transition">
                  <img 
                    src={p.image || "/placeholder.svg"} 
                    alt={`Imagem do produto ${p.name}`} 
                    className="w-16 h-16 object-contain rounded bg-white" 
                    loading="lazy" 
                  />
                  <div className="space-y-1">
                    {editing === p.id ? (
                      <div className="grid sm:grid-cols-2 gap-2">
                        <Input 
                          defaultValue={p.name} 
                          onChange={(e) => (p.name = e.target.value)} 
                          aria-label="Nome do produto"
                        />
                        <Input 
                          type="number" 
                          defaultValue={p.price} 
                          onChange={(e) => (p.price = Number(e.target.value))} 
                          aria-label="Preço do produto"
                        />
                        <Input 
                          defaultValue={p.image} 
                          onChange={(e) => (p.image = e.target.value)} 
                          placeholder="URL da imagem" 
                          className="sm:col-span-2"
                          aria-label="URL da imagem do produto"
                        />
                        <Input 
                          defaultValue={p.category} 
                          onChange={(e) => (p.category = e.target.value)} 
                          placeholder="Categoria"
                          aria-label="Categoria do produto"
                        />
                        <Input 
                          type="number" 
                          defaultValue={p.rating || 0} 
                          step="0.1" 
                          onChange={(e) => (p.rating = Number(e.target.value))} 
                          placeholder="Rating"
                          aria-label="Avaliação do produto"
                        />
                        <Textarea 
                          defaultValue={p.description} 
                          onChange={(e) => (p.description = e.target.value)} 
                          placeholder="Descrição" 
                          className="sm:col-span-2"
                          aria-label="Descrição do produto"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="font-medium text-slate-800">{p.name}</div>
                        <div className="text-xs text-slate-500">MT {p.price} • {p.category || "Sem categoria"}</div>
                        <div className="text-xs text-slate-500 line-clamp-2">{p.description}</div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 self-start">
                    {editing === p.id ? (
                      <>
                        <Button size="icon" variant="outline" onClick={() => onSaveRow(p.id, p)} aria-label="Salvar alterações">
                          <Check size={16} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditing(null)} aria-label="Cancelar edição">
                          <X size={16} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="icon" variant="outline" onClick={() => setEditing(p.id)} aria-label={`Editar produto ${p.name}`}>
                          <Pencil size={16} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => onDelete(p.id)} aria-label={`Remover produto ${p.name}`}>
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="new" className="mt-4">
        <Card className="animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="text-lg">Cadastrar novo produto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onCreate} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="product-name">Nome *</Label>
                <Input 
                  id="product-name"
                  value={draft.name} 
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} 
                  required 
                  aria-describedby="product-name-help"
                />
                <p id="product-name-help" className="text-xs text-gray-500 mt-1">Nome do produto que será exibido aos clientes</p>
              </div>
              
              <div>
                <Label htmlFor="product-price">Preço (MT) *</Label>
                <Input 
                  id="product-price"
                  type="number" 
                  min="0"
                  step="0.01"
                  value={draft.price} 
                  onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) }))} 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="product-category">Categoria</Label>
                <Input 
                  id="product-category"
                  value={draft.category} 
                  onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))} 
                />
              </div>
              
              <div className="sm:col-span-2">
                <ImageUpload
                  value={draft.image}
                  onChange={(url) => setDraft((d) => ({ ...d, image: url }))}
                  label="Imagem do produto"
                />
              </div>
              
              <div>
                <Label htmlFor="product-rating">Avaliação</Label>
                <Input 
                  id="product-rating"
                  type="number" 
                  step="0.1" 
                  min="0"
                  max="5"
                  value={draft.rating} 
                  onChange={(e) => setDraft((d) => ({ ...d, rating: Number(e.target.value) }))} 
                />
              </div>
              
              <div>
                <Label htmlFor="product-stock">Estoque</Label>
                <Input 
                  id="product-stock"
                  type="number" 
                  min="0"
                  value={draft.stock} 
                  onChange={(e) => setDraft((d) => ({ ...d, stock: Number(e.target.value) }))} 
                />
              </div>
              
              <div className="sm:col-span-2">
                <Label htmlFor="product-description">Descrição</Label>
                <Textarea 
                  id="product-description"
                  rows={3} 
                  value={draft.description} 
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} 
                  aria-describedby="product-description-help"
                />
                <p id="product-description-help" className="text-xs text-gray-500 mt-1">Descreva as características e benefícios do produto</p>
              </div>
              
              <div className="sm:col-span-2 flex items-center justify-end">
                <Button type="submit">Salvar produto</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}