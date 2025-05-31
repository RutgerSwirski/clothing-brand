"use client";

import { format } from "date-fns";

export default function EnquiriesList({ enquiries }: { enquiries: any[] }) {
  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Upcycle Enquiries</h2>
      <div className="space-y-4">
        {enquiries.map((entry) => (
          <div key={entry.id} className="border rounded p-4 bg-white shadow-sm">
            <p className="font-medium">
              {entry.name} – {entry.email}
            </p>
            <p className="text-sm italic text-stone-500">{entry.path}</p>
            <p className="mt-2 text-sm">{entry.message}</p>
            <p className="text-sm text-stone-500">
              <a href={`mailto:${entry.email}`} className="hover:underline">
                Reply via email
              </a>
            </p>
            <p className="text-xs text-stone-400 mt-1">
              {format(new Date(entry.createdAt), "dd MMM yyyy HH:mm")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
