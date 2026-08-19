import { useCallback, useEffect, useState } from "react";
import { apiRequest, ApiError } from "../../lib/api";
import { GOLD_XP_RATE } from "./storeConstants";

export interface StoreWallet {
  goldBalance: number;
  goldSpent: number;
  totalXp: number;
  goldRate: number;
  ownedItemIds: string[];
}

interface WalletResponse extends StoreWallet {
  items: unknown[];
}

interface PurchaseResponse {
  goldBalance: number;
  itemId: string;
}

interface UseStoreWalletOptions {
  localOnly?: boolean;
  localTotalXp?: number;
}

export interface UseStoreWalletResult {
  wallet: StoreWallet;
  owned: Set<string>;
  loading: boolean;
  error: string | null;
  /** Erreur du dernier chargement du solde, distincte d'un refus d'achat. */
  syncError: string | null;
  purchasing: string | null;
  purchase: (itemId: string, price: number) => Promise<boolean>;
  refresh: () => void;
}

const emptyWallet: StoreWallet = { goldBalance: 0, goldSpent: 0, totalXp: 0, goldRate: GOLD_XP_RATE, ownedItemIds: [] };

export function useStoreWallet({ localOnly = false, localTotalXp = 0 }: UseStoreWalletOptions = {}): UseStoreWalletResult {
  const [wallet, setWallet] = useState<StoreWallet>(emptyWallet);
  const [loading, setLoading] = useState(!localOnly);
  const [error, setError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [localSpent, setLocalSpent] = useState(0);
  const [localOwned, setLocalOwned] = useState<string[]>([]);

  useEffect(() => {
    if (localOnly) {
      const balance = Math.floor(localTotalXp / GOLD_XP_RATE) - localSpent;
      setWallet({ goldBalance: balance, goldSpent: localSpent, totalXp: localTotalXp, goldRate: GOLD_XP_RATE, ownedItemIds: localOwned });
      setSyncError(null);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    apiRequest<WalletResponse>("/store")
      .then((data) => {
        if (!active) return;
        setWallet({
          goldBalance: data.goldBalance,
          goldSpent: data.goldSpent,
          totalXp: data.totalXp,
          goldRate: data.goldRate ?? GOLD_XP_RATE,
          ownedItemIds: data.ownedItemIds ?? [],
        });
        setError(null);
        setSyncError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = err instanceof ApiError ? err.message : "Le porte-monnaie est momentanément indisponible.";
        setError(message);
        setSyncError(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [localOnly, localTotalXp, localSpent, localOwned, refreshKey]);

  const purchase = useCallback(async (itemId: string, price: number) => {
    setPurchasing(itemId);
    setError(null);
    try {
      if (localOnly) {
        if (localOwned.includes(itemId)) return false;
        if (Math.floor(localTotalXp / GOLD_XP_RATE) - localSpent < price) {
          setError("Solde d’or insuffisant.");
          return false;
        }
        setLocalSpent((current) => current + price);
        setLocalOwned((current) => [...current, itemId]);
        return true;
      }
      const result = await apiRequest<PurchaseResponse>("/store/purchase", {
        method: "POST",
        body: JSON.stringify({ itemId }),
      });
      setWallet((current) => ({
        ...current,
        goldBalance: result.goldBalance,
        goldSpent: current.goldSpent + price,
        ownedItemIds: current.ownedItemIds.includes(itemId) ? current.ownedItemIds : [...current.ownedItemIds, itemId],
      }));
      return true;
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "L’achat n’a pas pu être finalisé.");
      return false;
    } finally {
      setPurchasing(null);
    }
  }, [localOnly, localOwned, localSpent, localTotalXp]);

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), []);

  return {
    wallet,
    owned: new Set(wallet.ownedItemIds),
    loading,
    error,
    syncError,
    purchasing,
    purchase,
    refresh,
  };
}
