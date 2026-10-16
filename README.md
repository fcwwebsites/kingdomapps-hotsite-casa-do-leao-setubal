# Kingdomapps — prévia de hotsite: Casa do Leão

Prévia interna (Kingdomapps). A página raiz é um gate protegido por código; após o desbloqueio mostra 2 versões
do mesmo conteúdo em estruturas de layout diferentes.

- Gate: https://fcwwebsites.github.io/kingdomapps-hotsite-casa-do-leao-setubal/
- `/v1/` — E05 Balcão em blocos
- `/v2/` — E09 Pôster suíço

Site de igreja (pt-PT): sem cardápio, entrega ou preços. Vídeos recentes do YouTube lidos de `assets/videos.json`, atualizado pela GitHub Action `.github/workflows/update-videos.yml` (cron a cada 6h + execução manual; commit só quando muda). Fotos e logótipo da própria igreja — `assets/CREDITS.md`.

Pages: branch `main`, pasta `/`. Prévia local: `python3 -m http.server 8765`.
