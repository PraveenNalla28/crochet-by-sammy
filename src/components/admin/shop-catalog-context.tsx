"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { TAB_ROWS } from "@/data/products";
import {
  EMPTY_CATALOG,
  navKey,
  slugifyLabel,
  type CatalogExtraProduct,
  type CatalogProductEdit,
  type CatalogState,
} from "@/lib/shop-catalog";
import type { ShopTab } from "@/lib/tabs";

type ShopCatalogContextValue = {
  catalog: CatalogState;
  updateProduct: (slug: string, patch: CatalogProductEdit) => void;
  hideProduct: (slug: string, hidden?: boolean) => void;
  removeExtraProduct: (slug: string) => void;
  addProduct: (product: CatalogExtraProduct) => void;
  setNavEnabled: (tab: ShopTab, id: string, extra: boolean, enabled: boolean) => void;
  renameNav: (tab: ShopTab, id: string, extra: boolean, label: string) => void;
  addNavOption: (tab: ShopTab, label: string) => string | null;
  removeNavOption: (tab: ShopTab, id: string) => void;
};

const ShopCatalogContext = createContext<ShopCatalogContextValue | null>(null);

async function fetchCatalog(): Promise<CatalogState> {
  const res = await fetch(`/api/shop-catalog?t=${Date.now()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Could not load catalogue.");
  const data = (await res.json()) as { catalog?: CatalogState };
  return data.catalog ?? EMPTY_CATALOG;
}

export function ShopCatalogProvider({
  children,
  initialCatalog = EMPTY_CATALOG,
}: {
  children: ReactNode;
  initialCatalog?: CatalogState;
}) {
  const [catalog, setCatalog] = useState<CatalogState>(initialCatalog);

  useEffect(() => {
    fetchCatalog()
      .then(setCatalog)
      .catch(() => undefined);
  }, []);

  const persist = useCallback((next: CatalogState) => {
    setCatalog(next);
    void fetch("/api/shop-catalog", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ catalog: next }),
    }).catch(() => undefined);
  }, []);

  const updateProduct = useCallback(
    (slug: string, patch: CatalogProductEdit) => {
      persist({
        ...catalog,
        productEdits: {
          ...catalog.productEdits,
          [slug]: { ...catalog.productEdits[slug], ...patch },
        },
      });
    },
    [catalog, persist],
  );

  const hideProduct = useCallback(
    (slug: string, hidden = true) => {
      updateProduct(slug, { hidden });
    },
    [updateProduct],
  );

  const removeExtraProduct = useCallback(
    (slug: string) => {
      const { [slug]: _removed, ...productEdits } = catalog.productEdits;
      persist({
        ...catalog,
        productEdits,
        extraProducts: catalog.extraProducts.filter((item) => item.slug !== slug),
      });
    },
    [catalog, persist],
  );

  const addProduct = useCallback(
    (product: CatalogExtraProduct) => {
      persist({
        ...catalog,
        extraProducts: [...catalog.extraProducts, product],
      });
    },
    [catalog, persist],
  );

  const setNavEnabled = useCallback(
    (tab: ShopTab, id: string, extra: boolean, enabled: boolean) => {
      if (extra) {
        persist({
          ...catalog,
          extraNav: catalog.extraNav.map((item) =>
            item.tab === tab && item.id === id ? { ...item, enabled } : item,
          ),
        });
        return;
      }
      persist({
        ...catalog,
        navEdits: {
          ...catalog.navEdits,
          [navKey(tab, id)]: { ...catalog.navEdits[navKey(tab, id)], enabled },
        },
      });
    },
    [catalog, persist],
  );

  const renameNav = useCallback(
    (tab: ShopTab, id: string, extra: boolean, label: string) => {
      const nextLabel = label.trim();
      if (!nextLabel) return;
      if (extra) {
        persist({
          ...catalog,
          extraNav: catalog.extraNav.map((item) =>
            item.tab === tab && item.id === id
              ? { ...item, label: nextLabel }
              : item,
          ),
        });
        return;
      }
      persist({
        ...catalog,
        navEdits: {
          ...catalog.navEdits,
          [navKey(tab, id)]: {
            ...catalog.navEdits[navKey(tab, id)],
            label: nextLabel,
          },
        },
      });
    },
    [catalog, persist],
  );

  const addNavOption = useCallback(
    (tab: ShopTab, label: string) => {
      const nextLabel = label.trim();
      if (!nextLabel) return null;
      const used = new Set([
        ...TAB_ROWS[tab].map((row) => row.rowCategory),
        ...catalog.extraNav.filter((item) => item.tab === tab).map((item) => item.id),
      ]);
      let id = slugifyLabel(nextLabel);
      let n = 2;
      while (used.has(id)) {
        id = `${slugifyLabel(nextLabel)}-${n}`;
        n += 1;
      }
      persist({
        ...catalog,
        extraNav: [
          ...catalog.extraNav,
          { tab, id, label: nextLabel, enabled: true },
        ],
      });
      return id;
    },
    [catalog, persist],
  );

  const removeNavOption = useCallback(
    (tab: ShopTab, id: string) => {
      persist({
        ...catalog,
        extraNav: catalog.extraNav.filter(
          (item) => !(item.tab === tab && item.id === id),
        ),
      });
    },
    [catalog, persist],
  );

  const value = useMemo(
    () => ({
      catalog,
      updateProduct,
      hideProduct,
      removeExtraProduct,
      addProduct,
      setNavEnabled,
      renameNav,
      addNavOption,
      removeNavOption,
    }),
    [
      catalog,
      updateProduct,
      hideProduct,
      removeExtraProduct,
      addProduct,
      setNavEnabled,
      renameNav,
      addNavOption,
      removeNavOption,
    ],
  );

  return (
    <ShopCatalogContext.Provider value={value}>
      {children}
    </ShopCatalogContext.Provider>
  );
}

export function useShopCatalog() {
  const ctx = useContext(ShopCatalogContext);
  if (!ctx) {
    throw new Error("useShopCatalog must be used inside ShopCatalogProvider");
  }
  return ctx;
}
