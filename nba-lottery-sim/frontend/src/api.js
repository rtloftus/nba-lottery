const BASE_URL = "http://127.0.0.1:8000/api";

export async function getStandings() {
  const res = await fetch(`${BASE_URL}/standings`);
  return res.json();
}

export async function enterWins(wins) {
  const res = await fetch(`${BASE_URL}/enter-wins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(wins),
  });
  return res.json();
}

export async function runLottery() {
  const res = await fetch(`${BASE_URL}/run-lottery`, { method: "POST" });
  return res.json();
}

export async function roundTwo() {
  const res = await fetch(`${BASE_URL}/round-two`);
  return res.json();
}
