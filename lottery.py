import time
import random
import json

DEBUG_MODE = False  
VIEW_DATA = False
debug_wins = {
    "Atlanta Hawks": 40, "Boston Celtics": 61, "Brooklyn Nets": 26, "Charlotte Hornets": 19,
    "Chicago Bulls": 39, "Cleveland Cavaliers": 64, "Dallas Mavericks": 39, "Denver Nuggets": 50,
    "Detroit Pistons": 44, "Golden State Warriors": 48, "Houston Rockets": 52, "Indiana Pacers": 50,
    "Los Angeles Clippers": 50, "Los Angeles Lakers": 50, "Memphis Grizzlies": 48, "Miami Heat": 37,
    "Milwaukee Bucks": 48, "Minnesota Timberwolves": 49, "New Orleans Pelicans": 21, "New York Knicks": 51,
    "Oklahoma City Thunder": 68, "Orlando Magic": 41, "Philadelphia 76ers": 24, "Phoenix Suns": 36,
    "Portland Trail Blazers": 36, "Sacramento Kings": 40, "San Antonio Spurs": 34, "Toronto Raptors": 30,
    "Utah Jazz": 17, "Washington Wizards": 18
}
teams_data = {
    
    "Atlanta Hawks": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "East"
    },

    "Boston Celtics": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "East"
    },
    
    "Brooklyn Nets": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "East"
    },

    "Charlotte Hornets": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "East"
    },

    "Chicago Bulls": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "East"
    },

    "Cleveland Cavaliers": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "East"
    },

    "Dallas Mavericks": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "West"
    },

    "Denver Nuggets": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "West"
    },

    "Detroit Pistons": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "East"
    },

    "Golden State Warriors": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "West"
    },

    "Houston Rockets": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "West"
    },

    "Indiana Pacers": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "East"
    },

    "Los Angeles Clippers": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "West"
    },
    
    "Los Angeles Lakers": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "West"
    },

    "Memphis Grizzlies": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "West"
    },

    "Miami Heat": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "East"
    },

    "Milwaukee Bucks": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "East"
    },

    "Minnesota Timberwolves": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "West"
    },

    "New Orleans Pelicans": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "West"
    },

    "New York Knicks": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "East"
    },

    "Oklahoma City Thunder": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "West"
    },

    "Orlando Magic": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "East"
    },

    "Philadelphia 76ers": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "East"
    },

    "Phoenix Suns": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "West"
    },

    "Portland Trail Blazers": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "West"
    },

    "Sacramento Kings": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "West"
    },

    "San Antonio Spurs": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "West"
    },

    "Toronto Raptors": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "East"
    },

    "Utah Jazz": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "West"
    },

    "Washington Wizards": {
        "wins": 0,
        "losses": 0,
        "playoffs": False,
        "combos": None,
        "pct": None,
        "expected": None,
        "actual": None,
        "secondrd": None,
        "tiebroken": None,
        "conference": "East"
    }
}
bar = "=====================\n"
barthin = "\n---------------------\n"
debugbar = "\n*********************\n"
western_standings = {}
eastern_standings = {}
WEIGHTS = [140, 140, 140, 125, 105, 90, 75, 60, 45, 30, 20, 15, 10, 5]
#used for playoff teams
top_east = []
top_west = []
lottery_order = []
def yes_or_no_choice(message):
    while True:
        choice = input(message).lower()
        if choice == 'y':
            return "yes"
        elif choice == 'n':
            return "no"
        else:
            print(barthin)
            print("Invalid input. Please enter 'y' for yes or 'n' for no.")
            print(barthin)

def manual_playoffs(teams):
    playoff_list = []
    for team, (wins, losses) in sorted(teams.items(), key=lambda x: x[1][0], reverse=True):
        if len(playoff_list) >= 8:
            break  # stop once 8 are picked
        while True:
            if yes_or_no_choice(f"Did the {team} make the playoffs? (y/n): ").lower() == "yes":
                playoff_list.append((team, wins, losses))
                teams_data[team]["playoffs"] = True
                break
            else:
                teams_data[team]["playoffs"] = False
                break
    if len(playoff_list) != 8:
        print(barthin)
        print(f"You selected {len(playoff_list)} teams. You must have exactly 8. Starting over...")
        print(barthin)
        return manual_playoffs(teams)

    return playoff_list

def enter_wins(current_team):
    if DEBUG_MODE:
        wins = debug_wins[current_team]
    else:
        while True:
            win_total = input(f"Enter the {current_team}'s number of wins (out of 82): ")
            if not win_total.isdigit() or win_total == "":
                print(barthin)
                print("Something went wrong. Please enter a number between 0 and 82.")
                print(barthin)
                continue
            wins = int(win_total)
            if 0 <= wins <= 82:
                print(f"{current_team}'s record: {wins}-{82 - wins}")
                print()
                break
            else:
                print(barthin)
                print("Invalid input. Please enter a number between 0 and 82.")
                print(barthin)

    losses = 82 - wins
    if teams_data[current_team]["conference"] == "East":
        eastern_standings[current_team] = (wins, losses)
    elif teams_data[current_team]["conference"] == "West":
        western_standings[current_team] = (wins, losses)


    teams_data[team]["wins"] = wins
    teams_data[team]["losses"] = 82 - wins

def playoff_pick_simulation(playoff_east, playoff_west, eastern_standings, western_standings):
    playoff_teams = playoff_east + playoff_west
    all_teams = list(eastern_standings.items()) + list(western_standings.items())
    playoff_names = {team for team, _, _ in playoff_teams}

    non_playoff_teams = [(team, wins, losses) for team, (wins, losses) in all_teams if team not in playoff_names]
    non_playoff_teams.sort(key=lambda x: x[1])
    pick = 30

    if pick > 14:
        # Sort by wins and handle ties
        sorted_teams = sorted(playoff_teams, key=lambda x: x[1], reverse=True)
        i = 0
        while i < len(sorted_teams):
            current_wins = sorted_teams[i][1]
            tie_group = [sorted_teams[i]]
            j = i + 1
            while j < len(sorted_teams) and sorted_teams[j][1] == current_wins:
                tie_group.append(sorted_teams[j])
                j += 1

            if len(tie_group) > 1:
                names = [team[0] for team in tie_group]
                print()
                print(f"Calculating tiebreaker between {', '.join(names)}...")
                print()
                sleep_state(0.75, 0.1)
                random.shuffle(tie_group)

            for team, wins, losses in tie_group:
                print(f"Pick {pick}: {team} ({wins}-{losses})")
                sleep_state(1, 0.01)
                teams_data[team]["actual"] = pick
                pick -= 1

            i += len(tie_group)
    return non_playoff_teams

def prepare_lottery_order_with_tiebreak(non_playoff_teams):
    non_playoff_teams.sort(key=lambda x: x[1])  # worst → best
    ordered = []
    i = 0
    while i < len(non_playoff_teams):
        current_wins = non_playoff_teams[i][1]
        tie_group = [non_playoff_teams[i]]
        j = i + 1
        while j < len(non_playoff_teams) and non_playoff_teams[j][1] == current_wins:
            tie_group.append(non_playoff_teams[j])
            j += 1

        if len(tie_group) > 1:
            names = [t[0] for t in tie_group]
            print(f"Calculating tiebreaker between {', '.join(names)}...")

            # Calculate total combinations for these positions
            start_pos = len(ordered)
            end_pos = start_pos + len(tie_group)
            total_combos = sum(WEIGHTS[start_pos:end_pos])
            base_combos = total_combos // len(tie_group)
            remainder = total_combos % len(tie_group)

            # Assign combinations to each team
            combos_list = [base_combos] * len(tie_group)
            # Use coin flip to assign extra combos
            for _ in range(remainder):
                coin = random.randint(0, len(tie_group)-1)
                combos_list[coin] += 1

            # Shuffle the tie group to decide who gets earlier pick if neither wins top 4
            random.shuffle(tie_group)

            # Attach combos and tiebroken flag
            tie_group = [(team, wins, losses, combos, True) 
                         for (team, wins, losses), combos in zip(tie_group, combos_list)]
        else:
            team, wins, losses = tie_group[0]
            tie_group = [(team, wins, losses, WEIGHTS[len(ordered)], False)]

        ordered.extend(tie_group)
        i += len(tie_group)

    return ordered

def lottery_simulation(ordered, expected_order):
    # ordered: [(team, wins, losses, combos, tiebroken), ...]
    teams = [team for team, _, _, _, _ in ordered]
    expected_vs_actual = []

    # Build weighted pool
    pool = []
    for team, _, _, combos, _ in ordered:
        pool.extend([team] * combos)

    # Draw 4 winners
    winners = []
    non_winners = []
    teams_with_actual = []
    drawn = set()
    current_pick = 1
# Draw 4 winners from the pool
    for _ in range(4):
        while True:
            choice = random.choice(pool)
            if choice not in drawn:
                winners.append(choice)
                teams_with_actual.append((choice, current_pick))
                drawn.add(choice)
                current_pick += 1
                break
    
    for team in teams:
        if team not in drawn:
            non_winners.append(team)
            teams_with_actual.append((team, current_pick))
            current_pick += 1
    expected_dict = dict(expected_order)
    for team in teams_with_actual:
        if team[0] in expected_dict:
            expected_vs_actual.append((team[0], expected_dict[team[0]], team[1]))
    if VIEW_DATA:
        print()
        print(debugbar)
        print("winners: ", winners)
        print(debugbar)
        print()
        print(debugbar)
        print("expected_vs_actual: ", expected_vs_actual)
        print(debugbar)
        print()
    team_info = {}
    for team, expected, actual in expected_vs_actual:
        team_info[team] = {"expected": expected, "actual": actual}
        teams_data[team]["expected"] = expected
        teams_data[team]["actual"] = actual

    # Final slots to fill, worst (14) to best (1)
    results = {}
    pick_number = 1

    # Place the winners first (NBA rule: top 4 determined by lottery)
    for winner in winners:
        results[pick_number] = winner
        pick_number += 1

    all_lottery = {}
    all_lottery = team_info
    # Fill the rest in order, skipping already drawn teams
    for team in teams:
        if team in results.values():
            continue
        results[pick_number] = team
        pick_number += 1
    jumped_in = [
    team for team, info in team_info.items()
    if info["expected"] > 4 and info["actual"] <= 4
    ]
    jumped_count = len(jumped_in)
    top_four = {}
   
    #TOP FOUR
    for team in list(team_info.keys()):
        if team_info[team]["actual"] <= 4:  # top 4 actual pick
            top_four[team] = team_info[team]  # add to top_four
            team_info.pop(team) 
    
    back_ten = team_info
    sleep_state(0.5)
    if VIEW_DATA:
        print(f"Number of teams that jumped into the top 4: {jumped_count}")
        print("Teams:", jumped_in)
        print(debugbar)
        print(top_four)
        print(debugbar)
        print(back_ten)
        print(debugbar)
        print(ordered)
    
    print("\nFinal Lottery Results")
    print(bar)
    # Print results from 14 down to 1
    all_lottery = top_four | team_info
  
    exp_order = [team for team, info in sorted(all_lottery.items(), key=lambda x: x[1]["expected"])]

# List of teams in order of actual pick
    actual_order = [team for team, info in sorted(all_lottery.items(), key=lambda x: x[1]["actual"])]
    exp_order = list(reversed(exp_order))
    if VIEW_DATA:
        print("Expected order:", exp_order)
        print("Actual order:", actual_order)

    total_picks = len(actual_order)

    # Picks 14 → 5
    for pick_number, actual_team in zip(range(total_picks, 4, -1), reversed(actual_order[4:])):
        expected_team = exp_order.pop(0)

        if expected_team != actual_team:
            if actual_team in exp_order:
                exp_order.remove(actual_team)
            exp_order.append(expected_team)

        team_data = next(t for t in ordered if t[0] == actual_team)
        wins, losses, combos = team_data[1], team_data[2], team_data[3]
        pct = combos / 1000 * 100

        print(f"Pick {pick_number}: (Projected: {expected_team} ({teams_data[expected_team]['pct']}%))")
        sleep_state(1, 0.1)
        print(f"  {actual_team} ({wins}-{losses})")
        sleep_state(1.5, 0.1)
        print()

    # Rebuild exp_order for top 4
# Top 4 special handling
    remaining_top4 = actual_order[:4]  # first 4 from actual results

    for pick_number, actual_team in zip(range(4, 0, -1), reversed(actual_order[:4])):
        # expected = lowest odds among remaining
        expected_team = min(
            remaining_top4,
            key=lambda t: teams_data[t]["pct"]
        )

        team_data = next(t for t in ordered if t[0] == actual_team)
        wins, losses, combos = team_data[1], team_data[2], team_data[3]
        pct = combos / 1000 * 100

        print(f"Pick {pick_number}: (Projected: {expected_team} ({teams_data[expected_team]['pct']}%))")
        sleep_state(1, 0.1)
        print(f"  {actual_team} ({wins}-{losses})")
        sleep_state(1.5, 0.1)
        print()

        # only drop the actual team, not the expected unless they match
        remaining_top4.remove(actual_team)

def round_two_simulation(eastern_standings, western_standings):
    all_teams = list(eastern_standings.items()) + list(western_standings.items())
    pick = 31
    if pick < 61:
        # Sort by wins and handle ties
        sorted_teams = sorted(all_teams, key=lambda x: x[1])
        i = 0
        while i < len(sorted_teams):
            current_wins = sorted_teams[i][1]
            tie_group = [sorted_teams[i]]
            j = i + 1
            while j < len(sorted_teams) and sorted_teams[j][1] == current_wins:
                tie_group.append(sorted_teams[j])
                j += 1

            if len(tie_group) > 1:
                names = [team[0] for team in tie_group]
                print()
                print(f"Calculating tiebreaker between {', '.join(names)}...")
                print()
                sleep_state(0.3, 0.1)
                random.shuffle(tie_group)

            for team, (wins, losses) in tie_group:
                print(f"Pick {pick}: {team} ({wins}-{losses})")
                sleep_state(0.2, 0.01)
                teams_data[team]["secondrd"] = pick
                pick += 1

            i += len(tie_group)
    return
    
def sleep_state(duration=None, debug_duration=None):
    if duration is None and debug_duration is None:
        duration = 0.2
        debug_duration = 0.05
    elif debug_duration is None:
        debug_duration = 0.05

    time.sleep(debug_duration if DEBUG_MODE else duration)

def print_conference(conf):
    print(f"Your {conf}ern Conference records:")
    print(bar)
    teams = [
        (team, data["wins"], data["losses"])
        for team, data in teams_data.items()
        if data["conference"] == conf
    ]
    for team, wins, losses in sorted(teams, key=lambda x: x[1], reverse=True):
        print(f"{team}: {wins}-{losses}")
    print()

print(bar)
print("Welcome to the NBA Draft Lottery.")
sleep_state(0.5)
print()
print("Let's start by confirming your team wins.")
print(barthin)
sleep_state(0.5)
for team in teams_data:
    enter_wins(team)
print(barthin)
print_conference("East")
print_conference("West")
print(bar)
#while true is the only easy way to recurse here
if DEBUG_MODE:
    # Auto-select top 8 teams in each conference
    top_east = sorted(eastern_standings.items(), key=lambda x: x[1][0], reverse=True)[:8]
    top_west = sorted(western_standings.items(), key=lambda x: x[1][0], reverse=True)[:8]

    # Format as list of (team, wins, losses)
    top_east = [(team, wins, losses) for team, (wins, losses) in top_east]
    top_west = [(team, wins, losses) for team, (wins, losses) in top_west]

else:
    while True:
        print("Now, let's confirm your Eastern playoff teams.")
        print()
        sleep_state(0.5)
        top_east = manual_playoffs(eastern_standings)
        print()
        print("Now, let's confirm your Western playoff teams.")
        print()
        sleep_state(0.5)
        top_west = manual_playoffs(western_standings)

        sleep_state(0.5)
        print()
        print("Your playoff teams are as follows:")
        print()
        sleep_state(0.5)
        print("Eastern Conference Playoffs")
        print(bar)
        for seed, (team, wins, losses) in enumerate(sorted(top_east, key=lambda x: x[1], reverse=True), start=1):
            print(f"{seed}. {team}: {wins}-{losses}")
            sleep_state(0.1)
        print()
        print("Western Conference Playoffs")
        print(bar)
        for seed, (team, wins, losses) in enumerate(sorted(top_west, key=lambda x: x[1], reverse=True), start=1):
            print(f"{seed}. {team}: {wins}-{losses}")
            sleep_state(0.1)
        print()
        print("If teams with the same record are out of order, that is okay. They will be tiebroken later.")
        if yes_or_no_choice("Would you like to begin the simulation? (y/n): ") == "yes":
            break
        else:
            # reset playoff lists and restart loop
            top_east = []
            top_west = []
            print("Let's try again...")
            sleep_state(1)
print()
print(bar)
print("Beginning the simulation...")
sleep_state(1, 0.5)

non_playoff_teams = playoff_pick_simulation(top_east, top_west, eastern_standings, western_standings)
print()
sleep_state(0.7)
print("Lottery odds for the 1st overall pick:")
sleep_state(0.7)
print(bar)
sleep_state(0.5, 0.1)
ordered = prepare_lottery_order_with_tiebreak(non_playoff_teams)
print()
sleep_state(0.5, 0.1)
expected_position = 1
for team, wins, losses, combos, tiebroken in ordered:
    pct = combos / 1000 * 100
    teams_data[team]["combos"] = combos
    teams_data[team]["pct"] = round(pct, 1)
    teams_data[team]["tiebroken"] = tiebroken
    star = "*" if teams_data[team]["tiebroken"] else ""
    print(f"{expected_position}. {team} ({wins}-{losses}): {pct:.1f}% {star}")
    lottery_order.append((team, expected_position))
    expected_position = expected_position + 1

    sleep_state(0.2)
print()
print("* indicates a tiebreaker was used to determine order.")
print(bar)
while True:
    if yes_or_no_choice("Would you like to continue with the lottery simulation? (y/n): ") == "yes":
        break
    else:
        if yes_or_no_choice("Are you sure? Your progress will not be saved. (y/n): ") == "yes":
            exit()
        else:
            sleep_state(1)

lottery_simulation(ordered, lottery_order)
print()
sleep_state(0.5)
while True:
    if yes_or_no_choice("Ready for Round 2? (y/n): ") == "yes":
        break
    else:
        if yes_or_no_choice("Are you sure? Your progress will not be saved. (y/n): ") == "yes":
            exit()
        else:
            sleep_state(1)
print(barthin)
print("Round 2")
print(bar)
sleep_state(0.5)
round_two_simulation(eastern_standings, western_standings)
print(barthin)
print("This concludes the pick selection of the NBA Draft.")
sleep_state(0.75, 0.4)
team_name = next(name for name, data in teams_data.items() if data["actual"] == 1)
print(f"Thank you for participating in the draft lottery, and congratulations to the {team_name}.")
print(barthin)
sleep_state(1, 0.4)
print("COMPLETE DRAFT")
sleep_state(2, 0.4)
print("First Round")
print(bar)
# Sort by actual
actual_sorted = sorted(
    teams_data.items(),
    key=lambda x: x[1]['actual'] if x[1]['actual'] is not None else float('inf')
)

for i, (name, data) in enumerate(actual_sorted, start=1):
    print(f"{i}: {name}")
    sleep_state(0.25)

print()
sleep_state(2, 0.4)
print("Second Round")
print(bar)
# Sort by secondrd
secondrd_sorted = sorted(
    teams_data.items(),
    key=lambda x: x[1]['secondrd'] if x[1]['secondrd'] is not None else float('inf')
)

for i, (name, data) in enumerate(secondrd_sorted, start=31):
    print(f"{i}: {name}")
    sleep_state(0.2)

if VIEW_DATA:
    print(barthin)
    print(json.dumps(teams_data, indent=4))