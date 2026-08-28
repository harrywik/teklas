# Teklas

## Skapa ett blogginlägg

Placera inläggsfilen i `src/content/blog/<namn-som-hamnar-i-url>.mdx`
Referera gärna till bilder. Bilder ska läggas i `src/assets/images/<bildnamn>.<bildtyp>`
Längst upp i inläggsfilen placeras ett metadatablock:

```md
---
title: 'Markdown-demonstration'
description: 'En komplett guide till alla Markdown-funktioner som stöds på Teklas.'
pubDate: 'Aug 20 2026'
category: 'opinion-piece' <-- kan också vara 'book-review' | 'cartoon' | 'art'
heroImage: '../../assets/images/<bildnamn>.<bildtyp>' <-- blir som en thumbnail för inlägget
---
```

Sen kan du börja skriva innehållet i inlägget. 
Det finns redan ett inlägg publicerat som beskriver vilka funktioner som stöds: `src/content/blog/markdown-demo.mdx`
När du vill kan du radera det och ersätta det med dina egna inlägg.

## Preview

för att se hur det kommer att se ut innan du publicerar skriv i terminalen:
```zsh
pnpm dev
```
i samma mapp som denna text (README.md).
Navigera sedan till http://localhost:4321 i en webläsare.

## Publicera

så fort nytt material publiceras till repo:t på github i main-branchen kommer det uppdatera hemsidan på teklas.se.
```zsh
git add -A
git commit -m "Mitt beskrivande meddelande om vad som förändrats"
git push
```
det sista kommandot flyttar filer från din dator till github och du kan se hur byggjobbet går på [denna länk](https://github.com/harrywik/teklas/actions)
