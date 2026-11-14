# NASA Data and Science Plan

## Principle

NASA data must affect the player’s situation or rule set. A randomized NASA background is useful presentation, but it does not count as meaningful data integration by itself.

## Source 1 — DONKI space-weather events

Official API documentation: <https://api.nasa.gov/>

Candidate endpoints:

```text
GET https://api.nasa.gov/DONKI/CME
GET https://api.nasa.gov/DONKI/SEP
```

Parameters:

```text
startDate=YYYY-MM-DD
endDate=YYYY-MM-DD
api_key=...
```

### Gameplay use

- Select one archived, well-documented event.
- Store its event ID, date, instruments, linked events, and official URL.
- Use it as the source of Chapter 2’s warning card and narrative conditions.
- Do not convert it directly into a fictional Mars surface dose.
- Label it “an archived NASA space-weather event used as a teaching scenario.”

### Runtime strategy

- Fetch during development with a team key.
- Reduce to the fields the game needs.
- Save the selected record in a local JSON fixture.
- The game reads the fixture by default.
- A live refresh is optional and must have a timeout and local fallback.

## Source 2 — OSDR crop studies

### Lettuce

- Dataset: NASA OSDR OSD-268
- URL: <https://osdr.nasa.gov/bio/repo/data/studies/OSD-268>
- Relevant fact: red romaine lettuce was grown in the ISS Veggie system and analyzed for nutritional and microbiological characteristics.

### Chile peppers

- Dataset: NASA OSDR OSD-772
- URL: <https://osdr.nasa.gov/bio/repo/data/studies/OSD-772>
- Relevant facts: chile peppers were grown in the Advanced Plant Habitat for 137 days and produced 26 fruits.

### Gameplay use

- Choose one crop for visual consistency.
- The crop is already mature when the story starts.
- Use the study to explain that space crops require controlled water, light, humidity, and environmental conditions.
- Do not claim ISS results prove identical performance on Mars.
- Do not turn the exact study measurements into Mars-outpost predictions without justification.

## Source 3 — Mars imagery and environmental context

### Image discovery

- NASA Image and Video Library API: <https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf>
- Search endpoint: `https://images-api.nasa.gov/search?q=mars&media_type=image`
- NASA media guidelines: <https://www.nasa.gov/nasa-brand-center/images-and-media/>

### Optional rover-photo discovery

```text
GET https://api.nasa.gov/mars-photos/api/v1/rovers/{rover}/photos
```

Rover-photo availability and endpoint status must be verified before depending on it.

### Recommended implementation

Do not request a random image on every page load. Instead:

1. Curate 4–6 suitable images.
2. Record NASA ID, title, source URL, creator/center, alt text, and required credit.
3. Optimize local WebP/AVIF copies for the site.
4. Randomly choose from that local manifest once per session.
5. Always overlay a readable credit/source control.

This prevents slow loads, irrelevant imagery, missing responses, and accidental use of third-party copyrighted media.

## Source 4 — Life-support and habitat references

- NASA ECLSS overview/material supplied through the challenge resources.
- NASA Baseline Values and Assumptions Document: <https://ntrs.nasa.gov/citations/20210024855>

### Gameplay use

- Establish that air and water systems require power and maintenance.
- Explain recycling as a loop, not infinite resource creation.
- Keep displayed values normalized unless a real unit and mapping have been reviewed.

## API-key security

- Never place an API key in Git.
- Never put a key directly in source code or committed JSON.
- `.env` belongs in `.gitignore`.
- Any variable prefixed with `VITE_` is shipped to the browser and is not secret.
- Prefer development-time downloads and committed snapshots.
- If live calls are essential, use a serverless function with the key stored in deployment environment variables.
- Provide `DEMO_KEY` only for local exploration, not the judging build.

## Planned local data shape

```json
{
  "id": "official-event-id",
  "type": "SEP",
  "eventTime": "ISO timestamp",
  "instruments": ["instrument name"],
  "sourceUrl": "official NASA URL",
  "retrievedAt": "ISO timestamp",
  "usageNote": "Archived event used as a simplified educational scenario"
}
```

## “Why?” drawer format

Every chapter ends with:

```text
What happened?
One child-friendly causal explanation.

What did NASA study?
Dataset/resource title and one verified fact.

How did the game simplify it?
Explicitly state the abstraction.

Source
Official link and access date.
```

## Science review checklist

- [ ] Every factual claim has a source.
- [ ] Every number has a unit and provenance, or is labeled a game value.
- [ ] ISS crop findings are not presented as proven Mars outcomes.
- [ ] DONKI is not presented as a direct Mars radiation forecast.
- [ ] Dust storms are not depicted with unrealistic wind force.
- [ ] Radiation protection is physical shielding.
- [ ] Live API failure cannot break the game.
- [ ] NASA logos are not used without permission.
- [ ] NASA is credited without implying endorsement.

