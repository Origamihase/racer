# Löst das Straßennetz auf: Punkte → Koordinaten, hängt alle Wiki-Orte an, prüft und zeichnet eine Karte.
import json, math, sys, re
import os
SP=os.environ.get('MAP_WORK','.')  # Arbeitsordner mit den Eingaben (siehe README.md)
sys.path.insert(0, SP+'/map')
from roads_def import ROADS
places=json.load(open(SP+'/map/places_final.json'))
GZ=SP+'/geo_dl/unz/geonamescache/data/cities1000.json'
def norm(s): return re.sub(r'\s+',' ',s.strip().casefold())
gaz={}
for g in json.load(open(GZ)).values():
    names=[g['name']]+g.get('alternatenames',[])
    for n in names:
        k=(g['countrycode'],norm(n))
        if k not in gaz or gaz[k]['population']<g['population']: gaz[k]=g
def hav(a,b):
    R=6371.0
    la1,lo1,la2,lo2=map(math.radians,(a[0],a[1],b[0],b[1]))
    h=math.sin((la2-la1)/2)**2+math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2
    return 2*R*math.asin(math.sqrt(h))
# Wiki-Orte: nach Wiki-Name und Anzeigename auffindbar
pidx={}
for k,v in places.items():
    pidx[norm(k)]=k; pidx[norm(v['name'])]=k
nodes={}   # id -> {name, lat, lon, kind: 'ort'|'kreuz'|'via', wiki?}
def node(name, lat, lon, kind, cc, wiki=None):
    nid=wiki or name
    if nid in nodes:
        n=nodes[nid]
        if hav((n['lat'],n['lon']),(lat,lon))>3: print('WARN coords differ',nid,(n['lat'],n['lon']),(lat,lon))
        return nid
    nodes[nid]={'name':name,'lat':lat,'lon':lon,'kind':kind,'cc':cc,'wiki':wiki}
    return nid
roads=[]; bad=[]
for line in ROADS.strip().splitlines():
    rid,kind,cc,pts=[x.strip() for x in line.split('|',3)]
    seq=[]
    for tok in pts.split(';'):
        tok=tok.strip()
        if not tok: continue
        kr=tok.startswith('*')
        if kr: tok=tok[1:]
        c=cc
        coord=None
        if '@' in tok:
            tok,co=tok.split('@'); coord=tuple(float(x) for x in co.split(','))
        if '|' in tok:
            tok,c=tok.split('|')
        tok=tok.strip()
        if kr:
            if coord is None:
                if tok not in nodes: bad.append((rid,tok,'kreuz ohne Koordinate')); continue
                seq.append(tok); continue
            seq.append(node(tok,coord[0],coord[1],'kreuz',c)); continue
        if norm(tok) in pidx and coord is None:
            k=pidx[norm(tok)]; v=places[k]
            seq.append(node(v['name'],v['lat'],v['lon'],'ort',v['cc'],wiki=k)); continue
        if coord is not None:
            if norm(tok) in pidx:
                k=pidx[norm(tok)]; v=places[k]
                seq.append(node(v['name'],v['lat'],v['lon'],'ort',v['cc'],wiki=k)); continue
            seq.append(node(tok,coord[0],coord[1],'via',c)); continue
        g=gaz.get((c,norm(tok)))
        if not g and tok in nodes: seq.append(tok); continue
        if not g: bad.append((rid,tok,'nicht gefunden in '+c)); continue
        seq.append(node(tok,round(g['latitude'],4),round(g['longitude'],4),'via',c))
    roads.append({'id':rid,'kind':kind,'cc':cc,'nodes':seq})
print('roads',len(roads),'nodes',len(nodes),'bad',len(bad))
for b in bad: print('  BAD',b)
# Prüfen: Sprünge
for r in roads:
    if r['kind'] in ('flug','faehre','zug'): continue
    for a,b in zip(r['nodes'],r['nodes'][1:]):
        d=hav((nodes[a]['lat'],nodes[a]['lon']),(nodes[b]['lat'],nodes[b]['lon']))
        lim=220 if r['cc'] in ('DE','NL','BE','CH','AT','LU') else 700
        if d>lim or d<0.8: print('  JUMP',r['id'],a,'→',b,round(d))
    # Zickzack: Winkel
    ns=r['nodes']
    for a,b,c in zip(ns,ns[1:],ns[2:]):
        A,B,C=[(nodes[x]['lat'],nodes[x]['lon']) for x in (a,b,c)]
        d1=hav(A,B); d2=hav(B,C); d3=hav(A,C)
        if d1>8 and d2>8 and d3<0.55*(d1+d2) and not (a==c): print('  ZICKZACK',r['id'],a,b,c,round(d1),round(d2),round(d3))
json.dump({'nodes':nodes,'roads':roads},open(SP+'/map/net_raw.json','w'),ensure_ascii=False)
used={n['wiki'] for n in nodes.values() if n['wiki']}
rest=[k for k in places if k not in used]
print('wiki places on roads:',len(used),'rest:',len(rest))

# --- Rest-Orte: nächster Punkt auf einer Straße ---------------------------------
def proj(P,A,B):
    # lokale ebene Näherung um P
    k=math.cos(math.radians(P[0]))
    ax,ay=(A[1]-P[1])*k*111.32,(A[0]-P[0])*110.57
    bx,by=(B[1]-P[1])*k*111.32,(B[0]-P[0])*110.57
    dx,dy=bx-ax,by-ay
    L2=dx*dx+dy*dy
    t=0 if L2==0 else max(0,min(1,-(ax*dx+ay*dy)/L2))
    px,py=ax+t*dx,ay+t*dy
    return math.hypot(px,py),t
out=[]
for k in rest:
    v=places[k]; P=(v['lat'],v['lon'])
    best=None
    for r in roads:
        if r['kind'] not in ('ab','land'): continue
        ns=r['nodes']
        for i,(a,b) in enumerate(zip(ns,ns[1:])):
            A=(nodes[a]['lat'],nodes[a]['lon']); B=(nodes[b]['lat'],nodes[b]['lon'])
            if abs(A[0]-P[0])>3 and abs(B[0]-P[0])>3: continue
            d,t=proj(P,A,B)
            if best is None or d<best[0]: best=(d,r['id'],i,t,a,b)
    out.append((k,v,best))
out.sort(key=lambda x:-x[2][0])
for k,v,b in out:
    print('%-34s %s n=%d  %5.1f km  %s  zwischen %s und %s (t=%.2f)'%(v['name'],v['cc'],v['n'],b[0],b[1],b[4],b[5],b[3]))
json.dump([(k,b) for k,v,b in out],open(SP+'/map/rest_attach.json','w'),ensure_ascii=False)
