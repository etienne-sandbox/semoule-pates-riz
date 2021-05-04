import produce from "immer";
import { useCounter } from "./useCounter";
import { Counter } from "./Counter";
import { useEffect, useMemo, useState } from "react";

type Menu = "pates" | "riz" | "semoule";

interface MenuJour {
  midi: Menu;
  soir: Menu;
}

interface MenuSemaine {
  lundi: MenuJour;
  mardi: MenuJour;
  mercredi: MenuJour;
  jeudi: MenuJour;
  vendredi: MenuJour;
  samedi: MenuJour;
  dimanche: MenuJour;
}

const JOURS = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
] as const;

export function App() {
  const personnes = useCounter(2);
  const semaines = useCounter(2);
  const portionPates = useCounter(70, { step: 5, min: 10, max: 200 });
  const portionRiz = useCounter(60, { step: 5, min: 10, max: 200 });
  const portionSemoule = useCounter(80, { step: 5, min: 10, max: 200 });
  const [menu, setMenu] = useState<MenuSemaine>({
    lundi: { midi: "pates", soir: "riz" },
    mardi: { midi: "semoule", soir: "pates" },
    mercredi: { midi: "riz", soir: "semoule" },
    jeudi: { midi: "pates", soir: "riz" },
    vendredi: { midi: "semoule", soir: "pates" },
    samedi: { midi: "riz", soir: "semoule" },
    dimanche: { midi: "pates", soir: "riz" },
  });
  const [isBottom, setIsBottom] = useState(() => getScrollPercent() > 0.95);

  useEffect(() => {
    const onScroll = () => {
      setIsBottom(getScrollPercent() > 0.95);
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const total = useMemo(() => {
    const all = JOURS.map((j) => menu[j]).reduce<Array<Menu>>(
      (acc, item) => [...acc, item.midi, item.soir],
      []
    );

    const pates = all.filter((v) => v === "pates").length;
    const riz = all.filter((v) => v === "riz").length;
    const semoule = all.filter((v) => v === "semoule").length;

    const patesKg =
      (pates * personnes.value * semaines.value * portionPates.value) / 1000;
    const rizKg =
      (riz * personnes.value * semaines.value * portionRiz.value) / 1000;
    const semouleKg =
      (semoule * personnes.value * semaines.value * portionSemoule.value) /
      1000;

    const patesPack = Math.ceil(patesKg / 0.5);
    const rizPack = Math.ceil(rizKg / 0.5);
    const semoulePack = Math.ceil(semouleKg / 0.5);

    return {
      patesKg,
      rizKg,
      semouleKg,
      patesPack,
      rizPack,
      semoulePack,
    };
  }, [
    menu,
    personnes.value,
    portionPates.value,
    portionRiz.value,
    portionSemoule.value,
    semaines.value,
  ]);

  return (
    <div className="box app">
      <h1 className="box title">Semoule - Pâtes - Riz</h1>
      <Counter
        header={<div>Hello React !</div>}
        value={personnes.value}
        label="Nombre de personnes"
        onDecrement={() => personnes.decrement()}
        onIncrement={() => personnes.increment()}
        unitPlural="Personnes"
        unitSingle="Personne"
        background="linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)"
      />
      <Counter
        value={semaines.value}
        label="Stock pour"
        onDecrement={() => semaines.decrement()}
        onIncrement={() => semaines.increment()}
        unitPlural="Semaines"
        unitSingle="Semaine"
        background="linear-gradient(315deg, #e79087 0%, #86785f 74%)"
      />
      <Counter
        value={portionPates.value}
        label="Portion de pâtes"
        onDecrement={() => portionPates.decrement()}
        onIncrement={() => portionPates.increment()}
        unitPlural="Grammes"
        unitSingle="Gramme"
        background="linear-gradient(115deg, #1fd1f9 0%, #b621fe 74%)"
      />
      <Counter
        value={portionRiz.value}
        label="Portion de riz"
        onDecrement={() => portionRiz.decrement()}
        onIncrement={() => portionRiz.increment()}
        unitPlural="Grammes"
        unitSingle="Gramme"
        background="linear-gradient(115deg, #0abcf9 0%, #2c69d1 74%)"
      />
      <Counter
        value={portionSemoule.value}
        label="Portion de semoule"
        onDecrement={() => portionSemoule.decrement()}
        onIncrement={() => portionSemoule.increment()}
        unitPlural="Grammes"
        unitSingle="Gramme"
        background="linear-gradient(115deg, #b1bfd8 0%, #6782b4 74%)"
      />
      <div className="menu">
        <p className="menu--label">Menu de la semaine</p>
        <div className="menu--block">
          {JOURS.map((jourName) => {
            const jour = menu[jourName];
            return (
              <div key={jourName} className="menu--line">
                <p className="menu--day">{jourName}</p>
                <div className="menu--selects">
                  <div className="menu--meal">
                    <p>Midi</p>
                    <select
                      value={jour.midi}
                      onChange={(e) => {
                        const value: Menu = e.target.value as any;
                        setMenu((prev) =>
                          produce(prev, (draft) => {
                            draft[jourName].midi = value;
                          })
                        );
                      }}
                    >
                      <option value="pates">Pates</option>
                      <option value="riz">Riz</option>
                      <option value="semoule">Semoule</option>
                    </select>
                  </div>
                  <div className="menu--meal">
                    <p>Soir</p>
                    <select
                      value={jour.soir}
                      onChange={(e) => {
                        const value: Menu = e.target.value as any;
                        setMenu((prev) =>
                          produce(prev, (draft) => {
                            draft[jourName].soir = value;
                          })
                        );
                      }}
                    >
                      <option value="pates">Pâtes</option>
                      <option value="riz">Riz</option>
                      <option value="semoule">Semoule</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={"needs" + (isBottom ? " active" : "")}>
        <p className="needs--label">Il vous faut</p>
        <div
          className="need"
          style={{
            backgroundImage: "linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)",
          }}
        >
          <h2>{total.patesKg}kg de pâtes</h2>
          <p>
            Soit {total.patesPack} {total.patesPack > 1 ? "paquets" : "paquet"}{" "}
            de 500g
          </p>
        </div>
        <div
          className="need"
          style={{
            backgroundImage: "linear-gradient(315deg, #0abcf9 0%, #2c69d1 74%)",
          }}
        >
          <h2>{total.rizKg}kg de riz</h2>
          <p>
            Soit {total.rizPack} {total.rizPack > 1 ? "paquets" : "paquet"} de
            500g
          </p>
        </div>
        <div
          className="need"
          style={{
            backgroundImage: "linear-gradient(315deg, #b1bfd8 0%, #6782b4 74%)",
          }}
        >
          <h2>{total.semouleKg}kg de semoule</h2>
          <p>
            Soit {total.semoulePack}{" "}
            {total.semoulePack > 1 ? "paquets" : "paquet"} de 500g
          </p>
        </div>
      </div>
    </div>
  );
}

function getScrollPercent(): number {
  const h = document.documentElement;
  const b = document.body;
  const st = "scrollTop";
  const sh = "scrollHeight";
  return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);
}
