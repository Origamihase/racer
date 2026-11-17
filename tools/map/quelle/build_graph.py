# Baut aus net_raw.json + rest_attach.json den Spielgraphen (Knoten = Ausfahrten/Kreuze/Enden, Kanten mit Polylinie).
import json, math, sys
import os
SP=os.environ.get('MAP_WORK','.')  # Arbeitsordner mit den Eingaben (siehe README.md)
places=json.load(open(SP+'/map/places_final.json'))
net=json.load(open(SP+'/map/net_raw.json'))
rest=json.load(open(SP+'/map/rest_attach.json'))
nodes=net['nodes']; roads=net['roads']
def hav(a,b):
    R=6371.0
    la1,lo1,la2,lo2=map(math.radians,(a[0],a[1],b[0],b[1]))
    h=math.sin((la2-la1)/2)**2+math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2
    return 2*R*math.asin(math.sqrt(h))
P=lambda n:(nodes[n]['lat'],nodes[n]['lon'])
# 1) Rest-Orte einhängen
ins={}   # (road, seg) -> [(t, placeKey, d)]
extra={} # nodeId -> [(placeKey, d)]
for k,(d,rid,i,t,a,b) in rest:
    na,nb=nodes[a],nodes[b]
    seglen=hav(P(a),P(b))
    near=None
    if t*seglen<5 and na['kind']!='kreuz': near=a
    elif (1-t)*seglen<5 and nb['kind']!='kreuz': near=b
    if near: extra.setdefault(near,[]).append((k,d))
    else:
        tt=min(max(t,3/seglen if seglen>6 else 0.5),1-3/seglen if seglen>6 else 0.5)
        ins.setdefault((rid,i),[]).append((tt,k,d))
for r in roads:
    ns=r['nodes']; out=[]
    for i,n in enumerate(ns):
        out.append(n)
        if (r['id'],i) in ins and i+1<len(ns):
            A=P(n); B=P(ns[i+1])
            for tt,k,d in sorted(ins[(r['id'],i)]):
                v=places[k]
                nid='AS '+v['name']
                nodes[nid]={'name':v['name'],'lat':round(A[0]+(B[0]-A[0])*tt,4),'lon':round(A[1]+(B[1]-A[1])*tt,4),'kind':'as','cc':v['cc'],'wiki':None}
                extra.setdefault(nid,[]).append((k,d))
                out.append(nid)
    r['nodes']=out
# 2) Knotenrollen
deg={}
for r in roads:
    for j,n in enumerate(r['nodes']):
        deg.setdefault(n,set()).add(r['id'])
ends=set()
for r in roads:
    ends.add(r['nodes'][0]); ends.add(r['nodes'][-1])
def served(n):
    out=[]
    if nodes[n].get('wiki'): out.append((nodes[n]['wiki'],0.0))
    out+=extra.get(n,[])
    return out
G={}  # graph nodes
def is_graph(n):
    return bool(served(n)) or len(deg[n])>1 or n in ends or nodes[n]['kind']=='kreuz'
for n in nodes:
    if n in deg and is_graph(n):
        G[n]=1
# 3) Kanten
edges=[]
for r in roads:
    ns=r['nodes']; cur=[ns[0]]
    for n in ns[1:]:
        cur.append(n)
        if n in G:
            a=cur[0]; b=n
            pts=[P(x) for x in cur]
            km=sum(hav(p,q) for p,q in zip(pts,pts[1:]))
            f=1.0 if r['kind'] in ('flug','faehre','zug') else 1.13
            via=[nodes[x]['name'] for x in cur[1:-1]]
            edges.append({'a':a,'b':b,'road':r['id'],'kind':r['kind'],'km':round(km*f,1),'pts':pts,'via':via})
            cur=[n]
print('graph nodes',len(G),'edges',len(edges))
K=19
import statistics
for kind in ('ab','land','faehre','zug','flug'):
    E=[e for e in edges if e['kind']==kind]
    if not E: continue
    kms=[e['km'] for e in E]
    print(kind,'edges',len(E),'km total',round(sum(kms)),'median',statistics.median(kms),'min',min(kms),'max',max(kms))
for MIN in (1000,1200,1500):
    tot=0; stretched=0
    for e in edges:
        if e['kind'] not in ('ab','land'): continue
        L=e['km']/K*1000
        if L<MIN: stretched+=1; L=MIN
        tot+=L
    print('MIN',MIN,'game km',round(tot/1000),'stretched',stretched)
short=sorted([e for e in edges if e['kind'] in ('ab','land')],key=lambda e:e['km'])[:40]
for e in short: print('  kurz',e['road'],e['a'],'→',e['b'],e['km'])
nsrv=sum(1 for n in G if served(n)); 
print('exits with places',nsrv,'places served',sum(len(served(n)) for n in G))
multi=[(n,[k for k,d in served(n)]) for n in G if len(served(n))>1]
print('multi',len(multi)); 
for m in multi: print('  ',m)
json.dump({'nodes':{n:dict(nodes[n],places=served(n),roads=sorted(deg[n])) for n in G},'edges':edges},open(SP+'/map/graph.json','w'),ensure_ascii=False)
