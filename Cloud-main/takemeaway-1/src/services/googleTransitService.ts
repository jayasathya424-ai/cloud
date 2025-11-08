export async function getTransitRoute(from: string, to: string, apiKey: string) {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
    from
  )}&destination=${encodeURIComponent(to)}&mode=transit&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();

    if (data.status !== "OK") throw new Error(data.error_message || data.status);

    return data.routes[0];
  } catch (err) {
    console.error("Transit route fetch failed:", err);
    return null;
  }
}
