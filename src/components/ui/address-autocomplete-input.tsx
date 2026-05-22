"use client";

type AddressAutocompleteInputProps = {
  defaultStreet?: string | null;
  defaultCity?: string | null;
  defaultState?: string | null;
  defaultZip?: string | null;
  streetName?: string;
  cityName?: string;
  stateName?: string;
  zipName?: string;
};

export function AddressAutocompleteInput({
  defaultStreet,
  defaultCity,
  defaultState,
  defaultZip,
  streetName = "streetAddress",
  cityName = "city",
  stateName = "state",
  zipName = "zip"
}: AddressAutocompleteInputProps) {
  const provider = process.env.NEXT_PUBLIC_ADDRESS_AUTOCOMPLETE_PROVIDER;
  const providerReady =
    (provider === "google" && Boolean(process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY)) ||
    (provider === "mapbox" && Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN));

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-[#f8fafc] p-4">
      <div>
        <p className="font-semibold">Address</p>
        <p className="mt-1 text-sm text-slate-500">
          {providerReady ? "Address search is ready for this provider." : "Manual entry is available until address search is configured."}
        </p>
      </div>
      <label className="space-y-1.5">
        <span className="text-sm font-semibold text-slate-700">Street address</span>
        <input name={streetName} defaultValue={defaultStreet ?? ""} autoComplete="street-address" className={fieldClass} />
      </label>
      <div className="grid gap-3 sm:grid-cols-[1fr_6rem_8rem]">
        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700">City</span>
          <input name={cityName} defaultValue={defaultCity ?? ""} autoComplete="address-level2" className={fieldClass} />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700">State</span>
          <input name={stateName} defaultValue={defaultState ?? ""} autoComplete="address-level1" className={fieldClass} />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-semibold text-slate-700">ZIP</span>
          <input name={zipName} defaultValue={defaultZip ?? ""} autoComplete="postal-code" className={fieldClass} />
        </label>
      </div>
    </div>
  );
}

const fieldClass =
  "min-h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none transition focus:border-harbor focus:ring-4 focus:ring-[#3A6EA5]/10";
