"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { NewsDialog } from "./NewsDialog";

export function NewNewsButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        New News
      </button>
      {open && <NewsDialog mode="create" onClose={handleClose} />}
    </>
  );
}
