#!/usr/bin/env python3
"""Atualiza assets/videos.json com os 6 vídeos mais recentes de um canal do YouTube (feed RSS público, sem API key).
Uso: CHANNEL_ID=UC... python3 update_videos.py [caminho/videos.json]
- Só reescreve o ficheiro quando o conteúdo muda (sem carimbo de hora -> commits só quando há vídeo novo/alterado).
- Se o feed falhar ou vier vazio, NÃO apaga o ficheiro anterior e sai com código 1 (o site cai no link "Ver canal no YouTube").
"""
import json, os, re, sys, time, urllib.request, xml.etree.ElementTree as ET

NS = {'a': 'http://www.w3.org/2005/Atom', 'yt': 'http://www.youtube.com/xml/schemas/2015', 'media': 'http://search.yahoo.com/mrss/'}

def fetch(cid, tries=3):
    url = f'https://www.youtube.com/feeds/videos.xml?channel_id={cid}'
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (videos.json updater)'})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()
        except Exception as e:
            last = e; time.sleep(5 * (i + 1))
    raise SystemExit(f'feed indisponível: {last}')

def parse(data, cid, n=6):
    root = ET.fromstring(data); out = []
    for e in root.findall('a:entry', NS):
        vid = (e.findtext('yt:videoId', '', NS) or '').strip()
        if not re.fullmatch(r'[\w-]{11}', vid): continue
        th = e.find('media:group/media:thumbnail', NS)
        out.append(dict(id=vid, title=(e.findtext('a:title', '', NS) or '').strip(), date=(e.findtext('a:published', '', NS) or '').strip(),
                        thumb=(th.get('url') if th is not None else f'https://i.ytimg.com/vi/{vid}/hqdefault.jpg')))
        if len(out) == n: break
    return dict(channel_id=cid, videos=out)

def main(path='assets/videos.json', cid=None):
    cid = cid or os.environ.get('CHANNEL_ID', '')
    assert re.fullmatch(r'UC[\w-]{22}', cid), f'CHANNEL_ID inválido: {cid!r}'
    data = parse(fetch(cid), cid)
    if not data['videos']: raise SystemExit('feed sem vídeos — ficheiro anterior mantido')
    new = json.dumps(data, ensure_ascii=False, indent=2) + '\n'
    old = open(path, encoding='utf-8').read() if os.path.exists(path) else ''
    if new == old: print('sem alterações'); return False
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    open(path, 'w', encoding='utf-8').write(new); print(f'atualizado: {len(data["videos"])} vídeos'); return True

if __name__ == '__main__':
    main(*(sys.argv[1:2] or []))
