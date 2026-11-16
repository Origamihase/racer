# Ergänzt den Spielgraphen um Einwohnerzahlen (auch für Durchgangsorte) und schreibt die Quelldateien fürs Repo.
import json, re, sys, math
SP=sys.argv[1]  # Arbeitsordner
g=json.load(open(SP+'/map/graph.json'))
places=json.load(open(SP+'/map/places_final.json'))
net=json.load(open(SP+'/map/net_raw.json'))
gaz_raw=json.load(open(SP+'/geo_dl/unz/geonamescache/data/cities1000.json'))
def norm(s): return re.sub(r'\s+',' ',s.strip().casefold())
gaz={}
for c in gaz_raw.values():
    for n in [c['name']]+c.get('alternatenames',[]):
        k=(c['countrycode'],norm(n))
        if k not in gaz or gaz[k]['population']<c['population']: gaz[k]=c
def hav(a,b):
    R=6371.0
    la1,lo1,la2,lo2=map(math.radians,(a[0],a[1],b[0],b[1]))
    h=math.sin((la2-la1)/2)**2+math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2
    return 2*R*math.asin(math.sqrt(h))
N=g['nodes']
miss=[]
for k,n in N.items():
    pop=0
    if n.get('wiki'): pop=places[n['wiki']].get('pop',0) or 0
    if not pop and n['kind'] in ('via','ort'):
        c=gaz.get((n['cc'],norm(n['name'])))
        if c and hav((c['latitude'],c['longitude']),(n['lat'],n['lon']))<25: pop=c['population']
        else: miss.append(k)
    n['pop']=int(pop)
print('ohne Einwohnerzahl:',len(miss),miss[:60])
# Orte ohne Einwohnerzahl
nopop=[k for k,v in places.items() if not v.get('pop')]
print('Wiki-Orte ohne Einwohnerzahl:',len(nopop),nopop)
json.dump(g,open(SP+'/map2/graph.json','w'),ensure_ascii=False)
