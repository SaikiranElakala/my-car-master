import { Check } from "lucide-react";
import type { ChecklistGroup } from "@/types";

export function ChecklistGrid({ groups, note }: { groups: ChecklistGroup[]; note?: string }) {
  return (
    <div>
      <div className="grid gap-px overflow-hidden rounded-[24px] border border-line bg-line md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.category} className="bg-white p-6 md:p-8">
            <h3 className="display text-2xl">{g.category}</h3>
            <ul className="mt-4 space-y-2">
              {g.items.map((i) => (
                <li key={i} className="flex items-start gap-3 text-steel"><Check className="mt-0.5 h-4 w-4 shrink-0 text-amber" />{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-steel">{note ?? "Potential checklist categories. Final inspection scope will be confirmed by My Car Master and is configurable."}</p>
    </div>
  );
}
