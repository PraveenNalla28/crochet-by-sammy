"use client";

import { useState } from "react";
import { useAdminMedia } from "@/components/admin/admin-media-context";
import { useShopCatalog } from "@/components/admin/shop-catalog-context";
import {
  paiseToRupeesInput,
  rupeesInputToPaise,
  slugifyLabel,
} from "@/lib/shop-catalog";
import type { ShopTab } from "@/lib/tabs";

type EditableProduct = {
  slug: string;
  name: string;
  pricePaise: number;
  extra?: boolean;
  hidden?: boolean;
};

export function CatalogProductEditor({
  product,
  extra,
}: {
  product: EditableProduct;
  extra?: boolean;
}) {
  const { isAdmin } = useAdminMedia();
  const { updateProduct, hideProduct, removeExtraProduct } = useShopCatalog();
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(paiseToRupeesInput(product.pricePaise));
  if (!isAdmin) return null;

  return (
    <div
      className="space-y-1.5 border-t border-[#f0e0e3] bg-[#fff7f8] px-3 py-2"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <label className="block text-[10px] font-semibold tracking-wide text-[#8b4a52]">
        Name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => {
            const next = name.trim();
            if (next && next !== product.name) updateProduct(product.slug, { name: next });
          }}
          className="mt-0.5 w-full rounded border border-[#ecd5d9] bg-white px-2 py-1 text-sm text-[#2f2426] outline-none"
        />
      </label>
      <label className="block text-[10px] font-semibold tracking-wide text-[#8b4a52]">
        Price (₹)
        <input
          inputMode="numeric"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          onBlur={() => {
            const next = rupeesInputToPaise(price);
            if (next !== product.pricePaise) {
              updateProduct(product.slug, { pricePaise: next });
            }
          }}
          className="mt-0.5 w-full rounded border border-[#ecd5d9] bg-white px-2 py-1 text-sm text-[#2f2426] outline-none"
        />
      </label>
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          className="text-[11px] text-[#8b4a52] underline"
          onClick={() => hideProduct(product.slug, !product.hidden)}
        >
          {product.hidden ? "Show on shop" : "Hide from shop"}
        </button>
        {extra ? (
          <button
            type="button"
            className="text-[11px] text-[#b42318] underline"
            onClick={() => removeExtraProduct(product.slug)}
          >
            Remove card
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function AddProductPanel({
  tab,
  subcategories,
  selectedSub,
}: {
  tab: ShopTab;
  subcategories: readonly { id: string; label: string }[];
  selectedSub: string | null;
}) {
  const { isAdmin, replaceSlot } = useAdminMedia();
  const { catalog, addProduct } = useShopCatalog();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [rowCategory, setRowCategory] = useState(
    selectedSub ?? subcategories[0]?.id ?? "",
  );
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  if (!isAdmin) return null;

  async function onAdd() {
    const nextName = name.trim();
    if (!nextName || !rowCategory) {
      alert("Add a name and pick a category option.");
      return;
    }
    setBusy(true);
    try {
      let slug = slugifyLabel(nextName);
      const used = new Set(catalog.extraProducts.map((item) => item.slug));
      let n = 2;
      while (used.has(slug)) {
        slug = `${slugifyLabel(nextName)}-${n}`;
        n += 1;
      }
      slug = `${slug}-${Date.now().toString(36)}`;
      let imageUrl = "/images/categories/cat-1.png";
      if (file) {
        const src = await replaceSlot(`product-${slug}`, file);
        if (src && !src.startsWith("data:")) imageUrl = src;
      }
      addProduct({
        slug,
        name: nextName,
        pricePaise: rupeesInputToPaise(price) || 0,
        imageUrl,
        rowCategory,
        tab,
        inStock: true,
      });
      setName("");
      setPrice("");
      setFile(null);
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not add that piece.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-dashed border-[#ecd5d9] bg-white px-4 py-4">
      {open ? (
        <div className="space-y-3">
          <p className="font-serif text-base text-[#2f2426]">Add a new card</p>
          <label className="block text-xs text-[#8b4a52]">
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-md border border-[#ecd5d9] px-3 py-2 text-sm text-[#2f2426] outline-none"
            />
          </label>
          <label className="block text-xs text-[#8b4a52]">
            Price (₹)
            <input
              inputMode="numeric"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="mt-1 w-full rounded-md border border-[#ecd5d9] px-3 py-2 text-sm text-[#2f2426] outline-none"
            />
          </label>
          <label className="block text-xs text-[#8b4a52]">
            Under option
            <select
              value={rowCategory}
              onChange={(event) => setRowCategory(event.target.value)}
              className="mt-1 w-full rounded-md border border-[#ecd5d9] bg-white px-3 py-2 text-sm text-[#2f2426] outline-none"
            >
              {subcategories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs text-[#8b4a52]">
            Photo
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              className="rounded-full bg-[#8b4a52] px-4 py-2 text-sm text-white disabled:opacity-60"
              onClick={() => void onAdd()}
            >
              {busy ? "Saving…" : "Save card"}
            </button>
            <button
              type="button"
              className="rounded-full border border-[#ecd5d9] px-4 py-2 text-sm text-[#5a4a4d]"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="text-sm text-[#8b4a52]"
          onClick={() => setOpen(true)}
        >
          + Add a new product card
        </button>
      )}
    </div>
  );
}

export function AddNavOptionForm({ tab }: { tab: ShopTab }) {
  const { isAdmin } = useAdminMedia();
  const { addNavOption } = useShopCatalog();
  const [label, setLabel] = useState("");
  if (!isAdmin) return null;

  return (
    <form
      className="flex items-center gap-1 border-t border-[#f0e0e3] px-2 py-2"
      onClick={(event) => event.stopPropagation()}
      onSubmit={(event) => {
        event.preventDefault();
        const id = addNavOption(tab, label);
        if (id) setLabel("");
      }}
    >
      <input
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        placeholder="New option"
        className="min-w-0 flex-1 rounded border border-[#ecd5d9] px-2 py-1 text-xs text-[#2f2426] outline-none"
      />
      <button type="submit" className="shrink-0 text-xs text-[#8b4a52]">
        Add
      </button>
    </form>
  );
}
