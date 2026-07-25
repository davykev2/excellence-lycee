import { useState } from "react";
import { CheckCircle, Coins, GraduationCap, Lock, Sparkle } from "@phosphor-icons/react";
import type { LearnerProfile, SchoolLevel } from "../../domain/learning";
import { storeCatalog, storeCategories, type StoreCatalogItem } from "../../data/storeCatalog";
import type { UseStoreWalletResult } from "./useStoreWallet";

interface StoreScreenProps {
  profile: LearnerProfile;
  level: SchoolLevel;
  store: UseStoreWalletResult;
}

export function StoreScreen({ profile, level, store }: StoreScreenProps) {
  const { wallet, owned, loading, error, purchasing, purchase } = store;
  const [flash, setFlash] = useState<string | null>(null);

  const xpToNextGold = wallet.goldRate - (wallet.totalXp % wallet.goldRate);

  async function handleBuy(item: StoreCatalogItem) {
    const done = await purchase(item.id, item.price);
    if (done) setFlash(`« ${item.title} » ajouté à ta collection !`);
  }

  return (
    <main className="community-page store-page">
      <header className="community-header">
        <div>
          <p className="header-kicker">Récompense ton travail</p>
          <h1>Boutique</h1>
          <p>Ton or grandit avec ton XP : {wallet.goldRate} XP gagnés = 1 or. Dépense-le sans jamais toucher à ton classement.</p>
        </div>
        <div className="community-level-pill"><GraduationCap size={23} weight="duotone" /><span>Ma classe</span><strong>{level.label}</strong></div>
      </header>

      <section className="store-wallet" aria-label="Ton solde d’or">
        <div className="store-wallet-coin"><Coins size={34} weight="fill" /></div>
        <div className="store-wallet-balance">
          <span>Solde de {profile.name.split(" ")[0]}</span>
          <strong>{loading ? "…" : wallet.goldBalance.toLocaleString("fr-FR")} <em>or</em></strong>
        </div>
        <div className="store-wallet-hint">
          <Sparkle size={18} weight="fill" />
          <span>Encore <strong>{xpToNextGold} XP</strong> pour gagner 1 or de plus.</span>
        </div>
      </section>

      {flash && <p className="store-flash" role="status"><CheckCircle size={18} weight="fill" /> {flash}</p>}
      {error && <p className="store-error" role="alert">{error}</p>}

      {storeCategories.map((category) => {
        const items = storeCatalog.filter((item) => item.category === category.id);
        if (items.length === 0) return null;
        return (
          <section className="store-category" key={category.id}>
            <header className="store-category-header">
              <h2>{category.label}</h2>
              <p>{category.tagline}</p>
            </header>
            <div className="store-grid">
              {items.map((item) => {
                const isOwned = owned.has(item.id);
                const affordable = wallet.goldBalance >= item.price;
                const isBusy = purchasing === item.id;
                return (
                  <article className={`store-card${isOwned ? " is-owned" : ""}`} key={item.id} style={{ "--item-accent": item.accent } as React.CSSProperties}>
                    <span className="store-card-emoji" aria-hidden="true">{item.emoji}</span>
                    <div className="store-card-body">
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </div>
                    <div className="store-card-footer">
                      <span className="store-price"><Coins size={16} weight="fill" /> {item.price}</span>
                      {isOwned ? (
                        <span className="store-owned-tag"><CheckCircle size={16} weight="fill" /> Possédé</span>
                      ) : (
                        <button
                          className="store-buy"
                          type="button"
                          disabled={isBusy || !affordable}
                          onClick={() => void handleBuy(item)}
                        >
                          {isBusy ? "Achat…" : affordable ? "Acheter" : <><Lock size={14} weight="fill" /> {item.price - wallet.goldBalance} or</>}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}

      <p className="store-footnote">D’autres articles arriveront bientôt — bonus de jeu, contenus exclusifs et bien plus.</p>
    </main>
  );
}
