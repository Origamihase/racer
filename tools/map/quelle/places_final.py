# Baut die endgültige Ortsliste: automatische Treffer + Korrekturen + Handkoordinaten.
import json, sys
import os
SP=os.environ.get('MAP_WORK','.')  # Arbeitsordner mit den Eingaben (siehe README.md)
raw=json.load(open(SP+'/geo/places_raw.json'))
auto=json.load(open(SP+'/geo/places_geo_auto.json'))
bl=json.load(open(SP+'/geo/place_bundesland.json'))

SKIP={'Emskirchen','Auschwitz','Rovaniemen seutukunta','Hauptseite','WikiBot','Tschechien','Hessen','Uecker-Randow-Tal','Oktoberfest','Bochum-Wattenscheid','St.Goar','Frankfurt','Freiburg','Amt Schenefeld'}
# name -> (lat, lon, cc, display)
MANUAL={
 'Borken (Hessen)':(51.05,9.28,'DE','Borken (Hessen)'),
 'Friedrichstadt':(54.38,9.09,'DE','Friedrichstadt'),
 'Kirchheim':(50.83,9.57,'DE','Kirchheim'),
 'Rüdersdorf bei Berlin':(52.47,13.78,'DE','Rüdersdorf bei Berlin'),
 'Fredericksburg (Texas)':(30.28,-98.87,'US','Fredericksburg (Texas)'),
 'Walldorf':(50.00,8.58,'DE','Walldorf (Hessen)'),
 'Alfeld':(49.43,11.55,'DE','Alfeld (Mittelfranken)'),
 'Auerswalde':(50.90,12.90,'DE',None),
 'Bad Godesberg':(50.68,7.15,'DE',None),
 'Bad Hindelang':(47.50,10.37,'DE',None),
 'Bad Salzig':(50.20,7.63,'DE',None),
 'Bay Lake':(28.39,-81.57,'US',None),
 'Branham':(30.17,-96.40,'US','Brenham (Texas)'),
 'Bröllin':(53.44,14.05,'DE',None),
 'Comunità montana della Valtellina di Sondrio':(46.17,9.87,'IT','Sondrio'),
 'Corte Belluno':(46.54,12.14,'IT',"Cortina d'Ampezzo"),
 'Dautphetal':(50.85,8.55,'DE',None),
 'Dettenheim':(49.17,8.42,'DE',None),
 'Diemelsee':(51.37,8.72,'DE',None),
 'Dithmarschen':(54.09,9.07,'DE','Meldorf (Dithmarschen)'),
 'Frankenmuth Township':(43.33,-83.74,'US','Frankenmuth'),
 'Gründau':(50.21,9.13,'DE',None),
 'Haidt':(49.77,10.25,'DE','Haidt (Rasthof)'),
 'Halhjem':(60.14,5.42,'NO',None),
 'Halsskov':(55.34,11.12,'DK',None),
 'Haunetal':(50.77,9.67,'DE',None),
 'Haverslev':(56.80,9.70,'DK',None),
 'Hellesylt':(62.09,6.87,'NO',None),
 'Jakobsbad':(47.32,9.33,'CH',None),
 'Jettingen':(48.39,10.43,'DE','Jettingen-Scheppach'),
 'Jämsän seutukunta':(61.86,25.19,'FI','Jämsä'),
 'Kajaanin seutukunta':(64.22,27.73,'FI','Kajaani'),
 'Krausnick':(52.04,13.75,'DE','Krausnick (Tropical Islands)'),
 'Köckern':(51.60,12.19,'DE','Köckern (Rasthof)'),
 'Lahden seutukunta':(60.98,25.66,'FI','Lahti'),
 'Lahnau':(50.58,8.57,'DE',None),
 'Lake Buena Vista':(28.38,-81.52,'US',None),
 'Lappland':(67.4,26.6,'FI','Lappland'),
 'Lutterberg':(51.37,9.63,'DE','Lutterberg'),
 'Pohlheim':(50.53,8.70,'DE',None),
 "Pont-de-l'Isère":(45.00,4.87,'FR',None),
 'Prora':(54.44,13.57,'DE',None),
 'Rex':(50.60,9.75,'DE','Rex (bei Fulda)'),
 'Rovaniemen seutukunta':(66.50,25.72,'FI','Rovaniemi'),
 'Röttle':(57.99,14.44,'SE','Röttle (Gränna)'),
 'Sankt Tönis':(51.32,6.49,'DE',None),
 'Sinsheim - Reihen':(49.21,8.93,'DE','Sinsheim-Reihen'),
 'Sisä-Savon seutukunta':(62.62,27.12,'FI','Suonenjoki'),
 'St. Wendel':(49.47,7.17,'DE',None),
 'Staufen im Breisgau':(47.88,7.73,'DE',None),
 'Stor-Elvdal':(61.57,11.05,'NO','Koppang (Stor-Elvdal)'),
 'Stuer':(53.38,12.33,'DE','Stuer (Bärenwald)'),
 'Sylt':(54.91,8.31,'DE','Sylt'),
 'São Vicente':(16.89,-24.98,'CV','São Vicente (Kap Verde)'),
 'Torfhaus':(51.80,10.54,'DE',None),
 'VVG der Stadt Riedlingen':(48.15,9.47,'DE','Riedlingen'),
 'Verwaltungsgemeinschaft Bad Mergentheim':(49.49,9.77,'DE','Bad Mergentheim'),
 'Wurster Nordseeküste':(53.69,8.57,'DE','Wurster Nordseeküste'),
 'Zinnwald-Georgenfeld':(50.73,13.77,'DE',None),
}
out={}
missing=[]
for name,r in raw.items():
    if name in SKIP: continue
    if r['n']==0 and name not in MANUAL and name not in auto: continue
    if name in MANUAL:
        lat,lon,cc,disp=MANUAL[name]
    elif name in auto:
        a=auto[name]; lat,lon,cc,disp=a['lat'],a['lon'],a['cc'],None
    else:
        missing.append((name,r['n'])); continue
    out[name]={'name':disp or name,'wiki':name,'lat':round(lat,4),'lon':round(lon,4),'cc':cc,'n':r['n'],
               'adm':(auto.get(name) or {}).get('adm'),'pop':(auto.get(name) or {}).get('pop',0)}
# Zusammenlegungen
def addn(dst,src):
    if src in raw and dst in out: out[dst]['n']+=raw[src]['n']
addn('Frankfurt am Main','Frankfurt'); addn('Freiburg im Breisgau','Freiburg'); addn('Wacken','Amt Schenefeld'); addn('Rovaniemi','Rovaniemen seutukunta')
json.dump(out,open(SP+'/map/places_final.json','w'),ensure_ascii=False,indent=0)
print('places',len(out),'missing',missing)
by={}
for k,v in out.items(): by.setdefault(v['cc'],[]).append(v)
for cc in sorted(by,key=lambda c:-len(by[c])):
    L=sorted(by[cc],key=lambda v:-v['n'])
    print('\n==',cc,len(L))
    print(', '.join('%s(%d|%.2f,%.2f)'%(v['name'],v['n'],v['lat'],v['lon']) for v in L))
