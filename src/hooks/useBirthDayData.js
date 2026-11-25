
import { useEffect, useState } from "react";
import { formatContent } from "../utils/customContent";

export default function useBirthdayData() {
  const [data, setData] = useState({
    birthday: null,
    memories: [],
    letter: null,
    game: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadJSON(filename) {
      const base = import.meta.env.BASE_URL;
      const url = `${base}data/${filename}`;

      const response = await fetch(url, {
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(
          `Gagal mengambil ${filename}: HTTP ${response.status}`
        );
      }

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          `${filename} bukan JSON. Periksa lokasi public/data/${filename}. URL: ${url}`
        );
      }

      try {
        return await response.json();
      } catch {
        throw new Error(
          `Format JSON tidak valid: ${filename}`
        );
      }
    }

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [birthday, memories, letter, game] =
          await Promise.all([
            loadJSON("birthday.json"),
            loadJSON("memories.json"),
            loadJSON("letter.json"),
            loadJSON("game.json")
          ]);

        if (!controller.signal.aborted) {
          const variables = {
            name: birthday.recipient?.name || "Sayang",
            nickname: birthday.recipient?.nickname || "sayang",
            sender: birthday.sender?.name || "Aku"
          };
          setData(formatContent({ birthday, memories, letter, game }, variables));
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Birthday data error:", err);
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => controller.abort();
  }, []);

  return { ...data, loading, error };
}
