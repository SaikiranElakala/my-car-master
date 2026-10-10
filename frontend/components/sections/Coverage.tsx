import { locationGroups } from "@/config/locations";

export function Coverage() {
  return (
    <section className="py-20 md:py-32">
      <div className="container-x">
        <p className="eyebrow">Locations</p>
        <h2 className="display mt-3 text-5xl md:text-7xl">Cities and areas<br /><span className="text-amber">for requests.</span></h2>
        <p className="mt-4 max-w-2xl text-steel">Choose a listed location when sending a request. The team will confirm service availability for your exact area.</p>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {locationGroups.map((group) => (
            <section key={group.state} className="rounded-3xl border border-line bg-white p-6 md:p-8">
              <h3 className="display text-2xl md:text-3xl">{group.state}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.cities.map((city) => <li key={city} className="rounded-full border border-line bg-paper px-3 py-2 text-sm">{city}</li>)}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
