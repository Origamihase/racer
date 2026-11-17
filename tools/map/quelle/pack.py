# Schreibt tools/map/netz.json: Orte, Knoten, Straßen und Kanten in einer Datei (Quelle für export.mjs).
import json, sys
SP=sys.argv[1]; OUT=sys.argv[2]
g=json.load(open(SP+'/map2/graph.json'))
places=json.load(open(SP+'/map/places_final.json'))
net=json.load(open(SP+'/map/net_raw.json'))
POP={ # grobe Einwohnerzahlen für Orte, die das Ortsverzeichnis nicht kennt (nur für Ortsgröße und Schilder)
 'Stettin':400000,'Lodz':670000,'Lüttich':197000,'Antwerpen':530000,'San Sebastián':188000,'Zagreb':770000,
 'Ventimiglia':24000,'La Jonquera':3000,'Landeck':8000,'Imst':11000,'Zirl':8000,'Tirano':9000,'Lovosice':9000,
 'Kemi':20000,'Ulsberg':300,'Puttgarden':500,'Dagebüll':900,'Diemelstadt':5000,'Horn-Bad Meinberg':17000,
 'Auerswalde':3000,'Bad Godesberg':75000,'Bad Hindelang':5000,'Bad Salzig':2500,'Bay Lake':500,'Branham':17000,
 'Bröllin':100,'Caldes de Malavella':8000,'Comunità montana della Valtellina di Sondrio':21000,'Corte Belluno':6000,
 'Dautphetal':11000,'Dettenheim':6500,'Diemelsee':5000,'Dithmarschen':7000,'Frankenmuth Township':5000,
 'Fuldabrück':9000,'Gründau':15000,'Haidt':400,'Halhjem':500,'Halsskov':2500,'Haunetal':3000,'Haverslev':1200,
 'Hellesylt':250,'Jakobsbad':100,'Jettingen':7000,'Jämsän seutukunta':20000,'Kajaanin seutukunta':37000,
 'Krausnick':600,'Köckern':300,'Lahden seutukunta':120000,'Lahnau':8000,'Lake Buena Vista':500,'Lappland':2000,
 'Lutterberg':1000,'Pohlheim':18000,"Pont-de-l'Isère":3500,'Prora':1000,'Rex':300,'Röttle':100,'Sankt Tönis':23000,
 'Sinsheim - Reihen':2000,'Sisä-Savon seutukunta':7000,'St. Wendel':26000,'Staufen im Breisgau':8000,
 'Stor-Elvdal':1200,'Stuer':250,'Sylt':18000,'São Vicente':80000,'Torfhaus':100,'VVG der Stadt Riedlingen':10000,
 'Verwaltungsgemeinschaft Bad Mergentheim':24000,'Wurster Nordseeküste':17000,'Zinnwald-Georgenfeld':400,
}
P={}
for k,v in places.items():
    pop=v.get('pop') or POP.get(k) or POP.get(v['name']) or 0
    if not pop: print('Ort ohne Einwohnerzahl',k)
    P[k]={'name':v['name'],'lat':v['lat'],'lon':v['lon'],'cc':v['cc'],'n':v['n'],'pop':int(pop)}
N={}
for k,n in g['nodes'].items():
    pop=n.get('pop') or POP.get(k) or POP.get(n['name']) or 0
    if not pop and n['kind'] in ('ort','via'): 
        if n.get('wiki'): pop=P[n['wiki']]['pop']
    N[k]={'name':n['name'],'lat':n['lat'],'lon':n['lon'],'kind':n['kind'],'cc':n['cc'],'pop':int(pop),
          'places':[[p,round(d,1)] for p,d in n['places']]}
gn=set(N)
seq={}
for e in g['edges']:
    q=seq.setdefault(e['road'],[])
    if not q: q.append(e['a'])
    assert q[-1]==e['a'], (e['road'],q[-1],e['a'])
    q.append(e['b'])
R=[{'id':r['id'],'kind':r['kind'],'cc':r['cc'],'nodes':seq[r['id']]} for r in net['roads']]
E=[{'a':e['a'],'b':e['b'],'road':e['road'],'km':e['km'],'pts':[[round(p[0],3),round(p[1],3)] for p in e['pts'][1:-1]]} for e in g['edges']]
with open(OUT,'w') as f:
    f.write('{\n"places": {\n'+',\n'.join(json.dumps(k,ensure_ascii=False)+': '+json.dumps(v,ensure_ascii=False) for k,v in P.items())+'\n},\n')
    f.write('"nodes": {\n'+',\n'.join(json.dumps(k,ensure_ascii=False)+': '+json.dumps(v,ensure_ascii=False) for k,v in N.items())+'\n},\n')
    f.write('"roads": [\n'+',\n'.join(json.dumps(v,ensure_ascii=False) for v in R)+'\n],\n')
    f.write('"edges": [\n'+',\n'.join(json.dumps(v,ensure_ascii=False) for v in E)+'\n]\n}\n')
print('places',len(P),'nodes',len(N),'roads',len(R),'edges',len(E))
