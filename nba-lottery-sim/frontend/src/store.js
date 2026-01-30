import { create } from "zustand";
import { persist } from "zustand/middleware";

const TEAMS = {
  "Atlanta Hawks": "East", "Boston Celtics": "East", "Brooklyn Nets": "East",
  "Charlotte Hornets": "East", "Chicago Bulls": "East", "Cleveland Cavaliers": "East",
  "Dallas Mavericks": "West", "Denver Nuggets": "West", "Detroit Pistons": "East",
  "Golden State Warriors": "West", "Houston Rockets": "West", "Indiana Pacers": "East",
  "Los Angeles Clippers": "West", "Los Angeles Lakers": "West", "Memphis Grizzlies": "West",
  "Miami Heat": "East", "Milwaukee Bucks": "East", "Minnesota Timberwolves": "West",
  "New Orleans Pelicans": "West", "New York Knicks": "East", "Oklahoma City Thunder": "West",
  "Orlando Magic": "East", "Philadelphia 76ers": "East", "Phoenix Suns": "West",
  "Portland Trail Blazers": "West", "Sacramento Kings": "West", "San Antonio Spurs": "West",
  "Toronto Raptors": "East", "Utah Jazz": "West", "Washington Wizards": "East"
};

function initTeams() {
  const teams = {};
Object.entries(TEAMS).forEach(([name, conf]) => {
  teams[name] = {
    wins: 0,
    losses: 0,
    playoffs: false,
    combos: 0,
    expected: null,
    actual: null,
    secondrd: null,
    tiebroken: false,
    conference: conf
  };
});
  return teams;
}

export const useNBAStore = create(
  persist(
    (set, get) => ({
      teams: initTeams(),

      initTeams: () => set({ teams: initTeams() }),

      updateTeam: (teamName, updates) => {
        const { teams } = get();
        set({
          teams: {
            ...teams,
            [teamName]: { ...teams[teamName], ...updates }
          }
        });
      },

      updateTeams: (updates) => {
        const { teams } = get();
        const merged = { ...teams };
        for (const [name, data] of Object.entries(updates)) {
          merged[name] = { ...merged[name], ...data };
        }
        set({ teams: merged });
      },

      setTeams: (newTeams) => set({ teams: newTeams }),

      clearTeams: () => set({ teams: initTeams() })
    }),
    { name: "nba-teams" }
  )
);
if (typeof window !== "undefined") {
  window.store = useNBAStore;
}
