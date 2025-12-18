import requests
from bs4 import BeautifulSoup
import re

HEADERS = {
    "User-Agent": "SportsStatsTracker/1.0 (http://localhost:3000; contact@example.com)"
}

def get_wikipedia_url(name):
    search_url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "opensearch",
        "search": name,
        "limit": 1,
        "format": "json"
    }
    try:
        resp = requests.get(search_url, params=params, headers=HEADERS)
        data = resp.json()
        if data and len(data) > 3 and data[3]:
            return data[3][0]
    except Exception as e:
        print(f"Error searching Wikipedia: {e}")
    return None

def scrape_player_stats(league, name):
    url = get_wikipedia_url(name)
    if not url:
        return None

    print(f"Scraping URL: {url}")
    try:
        resp = requests.get(url, headers=HEADERS)
        if resp.status_code != 200:
            return None

        soup = BeautifulSoup(resp.content, "html.parser")
        stats = {}

        # Find tables with class 'wikitable'
        tables = soup.find_all("table", class_="wikitable")

        target_table = None
        for table in tables:
            headers = [th.get_text().strip() for th in table.find_all("th")]
            header_text = " ".join(headers)

            has_team = "Team" in headers or "Club" in headers or "Tm" in headers

            if league == "NBA":
                if "PPG" in headers and "RPG" in headers and has_team:
                    target_table = table
                    break
            elif league == "NHL":
                if (("G" in headers and "A" in headers and "Pts" in headers) or \
                   ("Goals" in header_text and "Assists" in header_text)) and has_team:
                    target_table = table
                    break
            elif league == "NFL":
                if has_team and ("TD" in headers or "Touchdowns" in headers):
                    target_table = table
                    break
            elif league == "MLB":
                if has_team and ("AVG" in headers or "BA" in headers) and "HR" in headers:
                    target_table = table
                    break

        if not target_table:
            print(f"Could not find valid stats table for {league}")
            return None

        # Extract rows
        rows = target_table.find("tbody").find_all("tr")

        target_row = None
        # Loop reversed to find the last row with data
        for row in reversed(rows):
            cells = row.find_all(["td", "th"])
            text = row.get_text()
            if len(cells) > 3 and any(c.isdigit() for c in text):
                first_cell_text = cells[0].get_text().strip()
                # Skip Career, Total, All-Star
                if any(x in first_cell_text for x in ["Career", "Total", "All-Star"]):
                    continue
                target_row = row
                break

        # Fallback to last row if we filtered everything out (e.g. maybe only Career exists?)
        if not target_row and rows:
             target_row = rows[-1]

        if not target_row:
            print("No valid data row found")
            return None

        # Parse headers
        headers = []
        for hr in target_table.find_all("tr"):
            ths = hr.find_all("th")
            if len(ths) > 3:
                headers = [th.get_text().strip() for th in ths]
                break

        if not headers:
             print("Could not parse headers")
             return None

        cells = [td.get_text().strip() for td in target_row.find_all(["td", "th"])]

        print(f"Headers: {headers}")
        print(f"Row: {cells}")

        # Helper to get value using reverse index if forward fails
        def get_stat_value(col_names):
            # Find index in headers
            idx = -1
            for i, h in enumerate(headers):
                if any(c == h or c in h for c in col_names):
                    idx = i
                    break

            if idx == -1:
                return None

            # Check if we can access by forward index
            if idx < len(cells):
                val = _clean_stat(cells[idx])
                if val is not None:
                    return val

            # Try reverse index (distance from end)
            dist_from_end = len(headers) - idx
            rev_idx = len(cells) - dist_from_end
            if rev_idx >= 0 and rev_idx < len(cells):
                return _clean_stat(cells[rev_idx])

            return None

        if league == "NBA":
            stats['points'] = get_stat_value(["PPG"])
            stats['rebounds'] = get_stat_value(["RPG"])
            stats['assists'] = get_stat_value(["APG"])

        elif league == "NHL":
            stats['goals'] = get_stat_value(["G", "Goals"])
            stats['assists'] = get_stat_value(["A", "Assists"])

        elif league == "MLB":
            stats['batting_average'] = get_stat_value(["AVG", "BA"])
            stats['home_runs'] = get_stat_value(["HR"])

        elif league == "NFL":
            stats['touchdowns'] = get_stat_value(["TD", "Touchdowns"])
            stats['yards'] = get_stat_value(["Yds", "Yards"])

        print(f"Scraped Stats: {stats}")
        return stats

    except Exception as e:
        print(f"Error scraping: {e}")
        return None

def _clean_stat(value):
    val = re.sub(r'\[.*?\]', '', value)
    val = val.replace('*', '').replace('†', '').strip()
    if not val or val == '—' or val == '–':
        return None
    try:
        return float(val)
    except ValueError:
        return None
