import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function createFormData(data) {
  const formData = new FormData();

  for (const key in data) {
    const value = data[key];

    if (value === undefined || value === null) continue;

    if (value instanceof FileList && value.length > 0) {
      formData.append(key, value[0]); // ambil file pertama saja
    } else {
      formData.append(key, value);
    }
  }

  return formData;
}

export function dateFormat(tanggal) {
  if (!tanggal) return "-";
  try {
    return format(new Date(tanggal), "dd MMMM yyyy", { locale: id });
  } catch (error) {
    return "-";
  }
}
