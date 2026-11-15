/* Mini Adam: Tesla-Navi ferngesteuert – gebaut aus src/ (npm run build). Enthält three.js (MIT). */
(()=>{var Ru="170";var Em=0,Zd=1,wm=2;var hp=1,Cu=2,Xi=3,Ri=0,Sn=1,he=2,ms=0,Tr=1,xs=2,Kd=3,$d=4,Pu=5,Fs=100,Sm=101,Tm=102,Am=103,Rm=104,Cm=200,Iu=201,Pm=202,Im=203,th=204,To=205,Lm=206,Dm=207,km=208,Um=209,Nm=210,Hm=211,Bm=212,Fm=213,Om=214,eh=0,nh=1,ih=2,Pr=3,sh=4,rh=5,oh=6,ah=7,Lu=0,zm=1,Gm=2,gs=0,Vm=1,Wm=2,Xm=3,Du=4,qm=5,Ym=6,Zm=7;var up=300,Ir=301,Lr=302,lh=303,ch=304,cl=306,Ki=1e3,Gs=1001,hh=1002,Un=1003,Km=1004;var na=1005;var Jn=1006,_c=1007;var Vs=1008;var $i=1009,dp=1010,fp=1011,Ao=1012,ku=1013,Ws=1014,Ai=1015,_s=1016,Uu=1017,Nu=1018,Dr=1020,pp=35902,mp=1021,gp=1022,mi=1023,vp=1024,xp=1025,Ar=1026,kr=1027,Hu=1028,Bu=1029,yp=1030,Fu=1031;var Ou=1033,La=33776,Da=33777,ka=33778,Ua=33779,uh=35840,dh=35841,fh=35842,ph=35843,mh=36196,gh=37492,vh=37496,xh=37808,yh=37809,_h=37810,Mh=37811,bh=37812,Eh=37813,wh=37814,Sh=37815,Th=37816,Ah=37817,Rh=37818,Ch=37819,Ph=37820,Ih=37821,Na=36492,Lh=36494,Dh=36495,_p=36283,kh=36284,Uh=36285,Nh=36286;var Ha=2300,Hh=2301,Mc=2302,Jd=2400,jd=2401,Qd=2402;var $m=3200,Jm=3201;var zu=0,jm=1,ps="",ce="srgb",Wr="srgb-linear",hl="linear",Te="srgb";var lr=7680;var tf=519,Qm=512,tg=513,eg=514,Mp=515,ng=516,ig=517,sg=518,rg=519,ef=35044,bp=35048;var nf="300 es",Yi=2e3,Ba=2001,ys=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},En=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],sf=1234567,Mo=Math.PI/180,Ur=180/Math.PI;function Zs(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(En[i&255]+En[i>>8&255]+En[i>>16&255]+En[i>>24&255]+"-"+En[t&255]+En[t>>8&255]+"-"+En[t>>16&15|64]+En[t>>24&255]+"-"+En[e&63|128]+En[e>>8&255]+"-"+En[e>>16&255]+En[e>>24&255]+En[n&255]+En[n>>8&255]+En[n>>16&255]+En[n>>24&255]).toLowerCase()}function rn(i,t,e){return Math.max(t,Math.min(e,i))}function Gu(i,t){return(i%t+t)%t}function og(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function ag(i,t,e){return i!==t?(e-i)/(t-i):0}function bo(i,t,e){return(1-e)*i+e*t}function lg(i,t,e,n){return bo(i,t,1-Math.exp(-e*n))}function cg(i,t=1){return t-Math.abs(Gu(i,t*2)-t)}function hg(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function ug(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function dg(i,t){return i+Math.floor(Math.random()*(t-i+1))}function fg(i,t){return i+Math.random()*(t-i)}function pg(i){return i*(.5-Math.random())}function mg(i){i!==void 0&&(sf=i);let t=sf+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function gg(i){return i*Mo}function vg(i){return i*Ur}function xg(i){return(i&i-1)===0&&i!==0}function yg(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function _g(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Mg(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),m=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*u,l*d,a*c);break;case"YZY":i.set(l*d,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*d,a*h,a*c);break;case"XZX":i.set(a*h,l*m,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*m,a*c);break;case"ZYZ":i.set(l*m,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Er(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Dn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Xr={DEG2RAD:Mo,RAD2DEG:Ur,generateUUID:Zs,clamp:rn,euclideanModulo:Gu,mapLinear:og,inverseLerp:ag,lerp:bo,damp:lg,pingpong:cg,smoothstep:hg,smootherstep:ug,randInt:dg,randFloat:fg,randFloatSpread:pg,seededRandom:mg,degToRad:gg,radToDeg:vg,isPowerOfTwo:xg,ceilPowerOfTwo:yg,floorPowerOfTwo:_g,setQuaternionFromProperEuler:Mg,normalize:Dn,denormalize:Er},nt=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(rn(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},re=class i{constructor(t,e,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],v=s[0],g=s[3],p=s[6],x=s[1],_=s[4],y=s[7],I=s[2],T=s[5],S=s[8];return r[0]=o*v+a*x+l*I,r[3]=o*g+a*_+l*T,r[6]=o*p+a*y+l*S,r[1]=c*v+h*x+u*I,r[4]=c*g+h*_+u*T,r[7]=c*p+h*y+u*S,r[2]=d*v+f*x+m*I,r[5]=d*g+f*_+m*T,r[8]=d*p+f*y+m*S,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,m=e*u+n*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/m;return t[0]=u*v,t[1]=(s*c-h*n)*v,t[2]=(a*n-s*o)*v,t[3]=d*v,t[4]=(h*e-s*l)*v,t[5]=(s*r-a*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(bc.makeScale(t,e)),this}rotate(t){return this.premultiply(bc.makeRotation(-t)),this}translate(t,e){return this.premultiply(bc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},bc=new re;function Ep(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Fa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function bg(){let i=Fa("canvas");return i.style.display="block",i}var rf={};function yo(i){i in rf||(rf[i]=!0,console.warn(i))}function Eg(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function wg(i){let t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Sg(i){let t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}var me={enabled:!0,workingColorSpace:Wr,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Te&&(i.r=Zi(i.r),i.g=Zi(i.g),i.b=Zi(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Te&&(i.r=Rr(i.r),i.g=Rr(i.g),i.b=Rr(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ps?hl:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Zi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Rr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var of=[.64,.33,.3,.6,.15,.06],af=[.2126,.7152,.0722],lf=[.3127,.329],cf=new re().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),hf=new re().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);me.define({[Wr]:{primaries:of,whitePoint:lf,transfer:hl,toXYZ:cf,fromXYZ:hf,luminanceCoefficients:af,workingColorSpaceConfig:{unpackColorSpace:ce},outputColorSpaceConfig:{drawingBufferColorSpace:ce}},[ce]:{primaries:of,whitePoint:lf,transfer:Te,toXYZ:cf,fromXYZ:hf,luminanceCoefficients:af,outputColorSpaceConfig:{drawingBufferColorSpace:ce}}});var cr,Bh=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{cr===void 0&&(cr=Fa("canvas")),cr.width=t.width,cr.height=t.height;let n=cr.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=cr}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Fa("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Zi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Zi(e[n]/255)*255):e[n]=Zi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Tg=0,Oa=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Tg++}),this.uuid=Zs(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Ec(s[o].image)):r.push(Ec(s[o]))}else r=Ec(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Ec(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Bh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Ag=0,Nn=class i extends ys{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Gs,s=Gs,r=Jn,o=Vs,a=mi,l=$i,c=i.DEFAULT_ANISOTROPY,h=ps){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ag++}),this.uuid=Zs(),this.name="",this.source=new Oa(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new nt(0,0),this.repeat=new nt(1,1),this.center=new nt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new re,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==up)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ki:t.x=t.x-Math.floor(t.x);break;case Gs:t.x=t.x<0?0:1;break;case hh:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ki:t.y=t.y-Math.floor(t.y);break;case Gs:t.y=t.y<0?0:1;break;case hh:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Nn.DEFAULT_IMAGE=null;Nn.DEFAULT_MAPPING=up;Nn.DEFAULT_ANISOTROPY=1;var Ae=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],v=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let _=(c+1)/2,y=(f+1)/2,I=(p+1)/2,T=(h+d)/4,S=(u+v)/4,P=(m+g)/4;return _>y&&_>I?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=T/n,r=S/n):y>I?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=T/s,r=P/s):I<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(I),n=S/r,s=P/r),this.set(n,s,r,e),this}let x=Math.sqrt((g-m)*(g-m)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(g-m)/x,this.y=(u-v)/x,this.z=(d-h)/x,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Fh=class extends ys{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ae(0,0,t,e),this.scissorTest=!1,this.viewport=new Ae(0,0,t,e);let s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Jn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new Nn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new Oa(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},ei=class extends Fh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},za=class extends Nn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Un,this.minFilter=Un,this.wrapR=Gs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Oh=class extends Nn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Un,this.minFilter=Un,this.wrapR=Gs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var qe=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],f=r[o+1],m=r[o+2],v=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=m,t[e+3]=v;return}if(u!==v||l!==d||c!==f||h!==m){let g=1-a,p=l*d+c*f+h*m+u*v,x=p>=0?1:-1,_=1-p*p;if(_>Number.EPSILON){let I=Math.sqrt(_),T=Math.atan2(I,p*x);g=Math.sin(g*T)/I,a=Math.sin(a*T)/I}let y=a*x;if(l=l*g+d*y,c=c*g+f*y,h=h*g+m*y,u=u*g+v*y,g===1-a){let I=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=I,c*=I,h*=I,u*=I}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],m=r[o+3];return t[e]=a*m+h*u+l*f-c*d,t[e+1]=l*m+h*d+c*u-a*f,t[e+2]=c*m+h*f+a*d-l*u,t[e+3]=h*m-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),f=l(s/2),m=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(rn(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},A=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(uf.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(uf.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return wc.copy(this).projectOnVector(t),this.sub(wc)}reflect(t){return this.sub(wc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(rn(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},wc=new A,uf=new qe,Ji=class{constructor(t=new A(1/0,1/0,1/0),e=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(di.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(di.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=di.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,di):di.fromBufferAttribute(r,o),di.applyMatrix4(t.matrixWorld),this.expandByPoint(di);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ia.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ia.copy(n.boundingBox)),ia.applyMatrix4(t.matrixWorld),this.union(ia)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,di),di.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ho),sa.subVectors(this.max,ho),hr.subVectors(t.a,ho),ur.subVectors(t.b,ho),dr.subVectors(t.c,ho),ls.subVectors(ur,hr),cs.subVectors(dr,ur),Ls.subVectors(hr,dr);let e=[0,-ls.z,ls.y,0,-cs.z,cs.y,0,-Ls.z,Ls.y,ls.z,0,-ls.x,cs.z,0,-cs.x,Ls.z,0,-Ls.x,-ls.y,ls.x,0,-cs.y,cs.x,0,-Ls.y,Ls.x,0];return!Sc(e,hr,ur,dr,sa)||(e=[1,0,0,0,1,0,0,0,1],!Sc(e,hr,ur,dr,sa))?!1:(ra.crossVectors(ls,cs),e=[ra.x,ra.y,ra.z],Sc(e,hr,ur,dr,sa))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,di).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(di).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Oi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Oi=[new A,new A,new A,new A,new A,new A,new A,new A],di=new A,ia=new Ji,hr=new A,ur=new A,dr=new A,ls=new A,cs=new A,Ls=new A,ho=new A,sa=new A,ra=new A,Ds=new A;function Sc(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Ds.fromArray(i,r);let a=s.x*Math.abs(Ds.x)+s.y*Math.abs(Ds.y)+s.z*Math.abs(Ds.z),l=t.dot(Ds),c=e.dot(Ds),h=n.dot(Ds);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Rg=new Ji,uo=new A,Tc=new A,ji=class{constructor(t=new A,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Rg.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;uo.subVectors(t,this.center);let e=uo.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(uo,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Tc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(uo.copy(t.center).add(Tc)),this.expandByPoint(uo.copy(t.center).sub(Tc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},zi=new A,Ac=new A,oa=new A,hs=new A,Rc=new A,aa=new A,Cc=new A,Ro=class{constructor(t=new A,e=new A(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,zi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=zi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(zi.copy(this.origin).addScaledVector(this.direction,e),zi.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ac.copy(t).add(e).multiplyScalar(.5),oa.copy(e).sub(t).normalize(),hs.copy(this.origin).sub(Ac);let r=t.distanceTo(e)*.5,o=-this.direction.dot(oa),a=hs.dot(this.direction),l=-hs.dot(oa),c=hs.lengthSq(),h=Math.abs(1-o*o),u,d,f,m;if(h>0)if(u=o*l-a,d=o*a-l,m=r*h,u>=0)if(d>=-m)if(d<=m){let v=1/h;u*=v,d*=v,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ac).addScaledVector(oa,d),f}intersectSphere(t,e){zi.subVectors(t.center,this.origin);let n=zi.dot(this.direction),s=zi.dot(zi)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,zi)!==null}intersectTriangle(t,e,n,s,r){Rc.subVectors(e,t),aa.subVectors(n,t),Cc.crossVectors(Rc,aa);let o=this.direction.dot(Cc),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;hs.subVectors(this.origin,t);let l=a*this.direction.dot(aa.crossVectors(hs,aa));if(l<0)return null;let c=a*this.direction.dot(Rc.cross(hs));if(c<0||l+c>o)return null;let h=-a*hs.dot(Cc);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},jt=class i{constructor(t,e,n,s,r,o,a,l,c,h,u,d,f,m,v,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,u,d,f,m,v,g)}set(t,e,n,s,r,o,a,l,c,h,u,d,f,m,v,g){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/fr.setFromMatrixColumn(t,0).length(),r=1/fr.setFromMatrixColumn(t,1).length(),o=1/fr.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,f=o*u,m=a*h,v=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+m*c,e[5]=d-v*c,e[9]=-a*l,e[2]=v-d*c,e[6]=m+f*c,e[10]=o*l}else if(t.order==="YXZ"){let d=l*h,f=l*u,m=c*h,v=c*u;e[0]=d+v*a,e[4]=m*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-m,e[6]=v+d*a,e[10]=o*l}else if(t.order==="ZXY"){let d=l*h,f=l*u,m=c*h,v=c*u;e[0]=d-v*a,e[4]=-o*u,e[8]=m+f*a,e[1]=f+m*a,e[5]=o*h,e[9]=v-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let d=o*h,f=o*u,m=a*h,v=a*u;e[0]=l*h,e[4]=m*c-f,e[8]=d*c+v,e[1]=l*u,e[5]=v*c+d,e[9]=f*c-m,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let d=o*l,f=o*c,m=a*l,v=a*c;e[0]=l*h,e[4]=v-d*u,e[8]=m*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+m,e[10]=d-v*u}else if(t.order==="XZY"){let d=o*l,f=o*c,m=a*l,v=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+v,e[5]=o*h,e[9]=f*u-m,e[2]=m*u-f,e[6]=a*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Cg,t,Pg)}lookAt(t,e,n){let s=this.elements;return Kn.subVectors(t,e),Kn.lengthSq()===0&&(Kn.z=1),Kn.normalize(),us.crossVectors(n,Kn),us.lengthSq()===0&&(Math.abs(n.z)===1?Kn.x+=1e-4:Kn.z+=1e-4,Kn.normalize(),us.crossVectors(n,Kn)),us.normalize(),la.crossVectors(Kn,us),s[0]=us.x,s[4]=la.x,s[8]=Kn.x,s[1]=us.y,s[5]=la.y,s[9]=Kn.y,s[2]=us.z,s[6]=la.z,s[10]=Kn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],v=n[6],g=n[10],p=n[14],x=n[3],_=n[7],y=n[11],I=n[15],T=s[0],S=s[4],P=s[8],b=s[12],M=s[1],C=s[5],k=s[9],N=s[13],z=s[2],X=s[6],H=s[10],J=s[14],W=s[3],ct=s[7],ht=s[11],ft=s[15];return r[0]=o*T+a*M+l*z+c*W,r[4]=o*S+a*C+l*X+c*ct,r[8]=o*P+a*k+l*H+c*ht,r[12]=o*b+a*N+l*J+c*ft,r[1]=h*T+u*M+d*z+f*W,r[5]=h*S+u*C+d*X+f*ct,r[9]=h*P+u*k+d*H+f*ht,r[13]=h*b+u*N+d*J+f*ft,r[2]=m*T+v*M+g*z+p*W,r[6]=m*S+v*C+g*X+p*ct,r[10]=m*P+v*k+g*H+p*ht,r[14]=m*b+v*N+g*J+p*ft,r[3]=x*T+_*M+y*z+I*W,r[7]=x*S+_*C+y*X+I*ct,r[11]=x*P+_*k+y*H+I*ht,r[15]=x*b+_*N+y*J+I*ft,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],m=t[3],v=t[7],g=t[11],p=t[15];return m*(+r*l*u-s*c*u-r*a*d+n*c*d+s*a*f-n*l*f)+v*(+e*l*f-e*c*d+r*o*d-s*o*f+s*c*h-r*l*h)+g*(+e*c*u-e*a*f-r*o*u+n*o*f+r*a*h-n*c*h)+p*(-s*a*h-e*l*u+e*a*d+s*o*u-n*o*d+n*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],m=t[12],v=t[13],g=t[14],p=t[15],x=u*g*c-v*d*c+v*l*f-a*g*f-u*l*p+a*d*p,_=m*d*c-h*g*c-m*l*f+o*g*f+h*l*p-o*d*p,y=h*v*c-m*u*c+m*a*f-o*v*f-h*a*p+o*u*p,I=m*u*l-h*v*l-m*a*d+o*v*d+h*a*g-o*u*g,T=e*x+n*_+s*y+r*I;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let S=1/T;return t[0]=x*S,t[1]=(v*d*r-u*g*r-v*s*f+n*g*f+u*s*p-n*d*p)*S,t[2]=(a*g*r-v*l*r+v*s*c-n*g*c-a*s*p+n*l*p)*S,t[3]=(u*l*r-a*d*r-u*s*c+n*d*c+a*s*f-n*l*f)*S,t[4]=_*S,t[5]=(h*g*r-m*d*r+m*s*f-e*g*f-h*s*p+e*d*p)*S,t[6]=(m*l*r-o*g*r-m*s*c+e*g*c+o*s*p-e*l*p)*S,t[7]=(o*d*r-h*l*r+h*s*c-e*d*c-o*s*f+e*l*f)*S,t[8]=y*S,t[9]=(m*u*r-h*v*r-m*n*f+e*v*f+h*n*p-e*u*p)*S,t[10]=(o*v*r-m*a*r+m*n*c-e*v*c-o*n*p+e*a*p)*S,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*f-e*a*f)*S,t[12]=I*S,t[13]=(h*v*s-m*u*s+m*n*d-e*v*d-h*n*g+e*u*g)*S,t[14]=(m*a*s-o*v*s-m*n*l+e*v*l+o*n*g-e*a*g)*S,t[15]=(o*u*s-h*a*s+h*n*l-e*u*l-o*n*d+e*a*d)*S,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,m=r*u,v=o*h,g=o*u,p=a*u,x=l*c,_=l*h,y=l*u,I=n.x,T=n.y,S=n.z;return s[0]=(1-(v+p))*I,s[1]=(f+y)*I,s[2]=(m-_)*I,s[3]=0,s[4]=(f-y)*T,s[5]=(1-(d+p))*T,s[6]=(g+x)*T,s[7]=0,s[8]=(m+_)*S,s[9]=(g-x)*S,s[10]=(1-(d+v))*S,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=fr.set(s[0],s[1],s[2]).length(),o=fr.set(s[4],s[5],s[6]).length(),a=fr.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],fi.copy(this);let c=1/r,h=1/o,u=1/a;return fi.elements[0]*=c,fi.elements[1]*=c,fi.elements[2]*=c,fi.elements[4]*=h,fi.elements[5]*=h,fi.elements[6]*=h,fi.elements[8]*=u,fi.elements[9]*=u,fi.elements[10]*=u,e.setFromRotationMatrix(fi),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Yi){let l=this.elements,c=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s),f,m;if(a===Yi)f=-(o+r)/(o-r),m=-2*o*r/(o-r);else if(a===Ba)f=-o/(o-r),m=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Yi){let l=this.elements,c=1/(e-t),h=1/(n-s),u=1/(o-r),d=(e+t)*c,f=(n+s)*h,m,v;if(a===Yi)m=(o+r)*u,v=-2*u;else if(a===Ba)m=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=v,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},fr=new A,fi=new jt,Cg=new A(0,0,0),Pg=new A(1,1,1),us=new A,la=new A,Kn=new A,df=new jt,ff=new qe,vn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(rn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-rn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(rn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-rn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(rn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-rn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return df.makeRotationFromQuaternion(t),this.setFromRotationMatrix(df,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ff.setFromEuler(this),this.setFromQuaternion(ff,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};vn.DEFAULT_ORDER="XYZ";var Ga=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Ig=0,pf=new A,pr=new qe,Gi=new jt,ca=new A,fo=new A,Lg=new A,Dg=new qe,mf=new A(1,0,0),gf=new A(0,1,0),vf=new A(0,0,1),xf={type:"added"},kg={type:"removed"},mr={type:"childadded",child:null},Pc={type:"childremoved",child:null},on=class i extends ys{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ig++}),this.uuid=Zs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new A,e=new vn,n=new qe,s=new A(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new jt},normalMatrix:{value:new re}}),this.matrix=new jt,this.matrixWorld=new jt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ga,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return pr.setFromAxisAngle(t,e),this.quaternion.multiply(pr),this}rotateOnWorldAxis(t,e){return pr.setFromAxisAngle(t,e),this.quaternion.premultiply(pr),this}rotateX(t){return this.rotateOnAxis(mf,t)}rotateY(t){return this.rotateOnAxis(gf,t)}rotateZ(t){return this.rotateOnAxis(vf,t)}translateOnAxis(t,e){return pf.copy(t).applyQuaternion(this.quaternion),this.position.add(pf.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(mf,t)}translateY(t){return this.translateOnAxis(gf,t)}translateZ(t){return this.translateOnAxis(vf,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Gi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ca.copy(t):ca.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),fo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Gi.lookAt(fo,ca,this.up):Gi.lookAt(ca,fo,this.up),this.quaternion.setFromRotationMatrix(Gi),s&&(Gi.extractRotation(s.matrixWorld),pr.setFromRotationMatrix(Gi),this.quaternion.premultiply(pr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(xf),mr.child=t,this.dispatchEvent(mr),mr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(kg),Pc.child=t,this.dispatchEvent(Pc),Pc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Gi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Gi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Gi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(xf),mr.child=t,this.dispatchEvent(mr),mr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fo,t,Lg),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fo,Dg,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),m=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};on.DEFAULT_UP=new A(0,1,0);on.DEFAULT_MATRIX_AUTO_UPDATE=!0;on.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var pi=new A,Vi=new A,Ic=new A,Wi=new A,gr=new A,vr=new A,yf=new A,Lc=new A,Dc=new A,kc=new A,Uc=new Ae,Nc=new Ae,Hc=new Ae,Os=class i{constructor(t=new A,e=new A,n=new A){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),pi.subVectors(t,e),s.cross(pi);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){pi.subVectors(s,e),Vi.subVectors(n,e),Ic.subVectors(t,e);let o=pi.dot(pi),a=pi.dot(Vi),l=pi.dot(Ic),c=Vi.dot(Vi),h=Vi.dot(Ic),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,m=(o*h-a*l)*d;return r.set(1-f-m,m,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Wi)===null?!1:Wi.x>=0&&Wi.y>=0&&Wi.x+Wi.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Wi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Wi.x),l.addScaledVector(o,Wi.y),l.addScaledVector(a,Wi.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Uc.setScalar(0),Nc.setScalar(0),Hc.setScalar(0),Uc.fromBufferAttribute(t,e),Nc.fromBufferAttribute(t,n),Hc.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Uc,r.x),o.addScaledVector(Nc,r.y),o.addScaledVector(Hc,r.z),o}static isFrontFacing(t,e,n,s){return pi.subVectors(n,e),Vi.subVectors(t,e),pi.cross(Vi).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return pi.subVectors(this.c,this.b),Vi.subVectors(this.a,this.b),pi.cross(Vi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;gr.subVectors(s,n),vr.subVectors(r,n),Lc.subVectors(t,n);let l=gr.dot(Lc),c=vr.dot(Lc);if(l<=0&&c<=0)return e.copy(n);Dc.subVectors(t,s);let h=gr.dot(Dc),u=vr.dot(Dc);if(h>=0&&u<=h)return e.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(gr,o);kc.subVectors(t,r);let f=gr.dot(kc),m=vr.dot(kc);if(m>=0&&f<=m)return e.copy(r);let v=f*c-l*m;if(v<=0&&c>=0&&m<=0)return a=c/(c-m),e.copy(n).addScaledVector(vr,a);let g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return yf.subVectors(r,s),a=(u-h)/(u-h+(f-m)),e.copy(s).addScaledVector(yf,a);let p=1/(g+v+d);return o=v*p,a=d*p,e.copy(n).addScaledVector(gr,o).addScaledVector(vr,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},wp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ds={h:0,s:0,l:0},ha={h:0,s:0,l:0};function Bc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Dt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ce){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,me.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=me.workingColorSpace){return this.r=t,this.g=e,this.b=n,me.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=me.workingColorSpace){if(t=Gu(t,1),e=rn(e,0,1),n=rn(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Bc(o,r,t+1/3),this.g=Bc(o,r,t),this.b=Bc(o,r,t-1/3)}return me.toWorkingColorSpace(this,s),this}setStyle(t,e=ce){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ce){let n=wp[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Zi(t.r),this.g=Zi(t.g),this.b=Zi(t.b),this}copyLinearToSRGB(t){return this.r=Rr(t.r),this.g=Rr(t.g),this.b=Rr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ce){return me.fromWorkingColorSpace(wn.copy(this),t),Math.round(rn(wn.r*255,0,255))*65536+Math.round(rn(wn.g*255,0,255))*256+Math.round(rn(wn.b*255,0,255))}getHexString(t=ce){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=me.workingColorSpace){me.fromWorkingColorSpace(wn.copy(this),e);let n=wn.r,s=wn.g,r=wn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=me.workingColorSpace){return me.fromWorkingColorSpace(wn.copy(this),e),t.r=wn.r,t.g=wn.g,t.b=wn.b,t}getStyle(t=ce){me.fromWorkingColorSpace(wn.copy(this),t);let e=wn.r,n=wn.g,s=wn.b;return t!==ce?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ds),this.setHSL(ds.h+t,ds.s+e,ds.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ds),t.getHSL(ha);let n=bo(ds.h,ha.h,e),s=bo(ds.s,ha.s,e),r=bo(ds.l,ha.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},wn=new Dt;Dt.NAMES=wp;var Ug=0,Ci=class extends ys{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ug++}),this.uuid=Zs(),this.name="",this.blending=Tr,this.side=Ri,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=th,this.blendDst=To,this.blendEquation=Fs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Dt(0,0,0),this.blendAlpha=0,this.depthFunc=Pr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=tf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=lr,this.stencilZFail=lr,this.stencilZPass=lr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Tr&&(n.blending=this.blending),this.side!==Ri&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==th&&(n.blendSrc=this.blendSrc),this.blendDst!==To&&(n.blendDst=this.blendDst),this.blendEquation!==Fs&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Pr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==tf&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==lr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==lr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==lr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},dn=class extends Ci{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.combine=Lu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Je=new A,ua=new nt,Oe=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ef,this.updateRanges=[],this.gpuType=Ai,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ua.fromBufferAttribute(this,e),ua.applyMatrix3(t),this.setXY(e,ua.x,ua.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Je.fromBufferAttribute(this,e),Je.applyMatrix3(t),this.setXYZ(e,Je.x,Je.y,Je.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Je.fromBufferAttribute(this,e),Je.applyMatrix4(t),this.setXYZ(e,Je.x,Je.y,Je.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Je.fromBufferAttribute(this,e),Je.applyNormalMatrix(t),this.setXYZ(e,Je.x,Je.y,Je.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Je.fromBufferAttribute(this,e),Je.transformDirection(t),this.setXYZ(e,Je.x,Je.y,Je.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Er(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Dn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Er(e,this.array)),e}setX(t,e){return this.normalized&&(e=Dn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Er(e,this.array)),e}setY(t,e){return this.normalized&&(e=Dn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Er(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Dn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Er(e,this.array)),e}setW(t,e){return this.normalized&&(e=Dn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Dn(e,this.array),n=Dn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Dn(e,this.array),n=Dn(n,this.array),s=Dn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Dn(e,this.array),n=Dn(n,this.array),s=Dn(s,this.array),r=Dn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ef&&(t.usage=this.usage),t}};var Va=class extends Oe{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Wa=class extends Oe{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var $t=class extends Oe{constructor(t,e,n){super(new Float32Array(t),e,n)}},Ng=0,ti=new jt,Fc=new on,xr=new A,$n=new Ji,po=new Ji,un=new A,de=class i extends ys{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ng++}),this.uuid=Zs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ep(t)?Wa:Va)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new re().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ti.makeRotationFromQuaternion(t),this.applyMatrix4(ti),this}rotateX(t){return ti.makeRotationX(t),this.applyMatrix4(ti),this}rotateY(t){return ti.makeRotationY(t),this.applyMatrix4(ti),this}rotateZ(t){return ti.makeRotationZ(t),this.applyMatrix4(ti),this}translate(t,e,n){return ti.makeTranslation(t,e,n),this.applyMatrix4(ti),this}scale(t,e,n){return ti.makeScale(t,e,n),this.applyMatrix4(ti),this}lookAt(t){return Fc.lookAt(t),Fc.updateMatrix(),this.applyMatrix4(Fc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xr).negate(),this.translate(xr.x,xr.y,xr.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new $t(n,3))}else{for(let n=0,s=e.count;n<s;n++){let r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ji);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];$n.setFromBufferAttribute(r),this.morphTargetsRelative?(un.addVectors(this.boundingBox.min,$n.min),this.boundingBox.expandByPoint(un),un.addVectors(this.boundingBox.max,$n.max),this.boundingBox.expandByPoint(un)):(this.boundingBox.expandByPoint($n.min),this.boundingBox.expandByPoint($n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ji);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new A,1/0);return}if(t){let n=this.boundingSphere.center;if($n.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];po.setFromBufferAttribute(a),this.morphTargetsRelative?(un.addVectors($n.min,po.min),$n.expandByPoint(un),un.addVectors($n.max,po.max),$n.expandByPoint(un)):($n.expandByPoint(po.min),$n.expandByPoint(po.max))}$n.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)un.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(un));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)un.fromBufferAttribute(a,c),l&&(xr.fromBufferAttribute(t,c),un.add(xr)),s=Math.max(s,n.distanceToSquared(un))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Oe(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let P=0;P<n.count;P++)a[P]=new A,l[P]=new A;let c=new A,h=new A,u=new A,d=new nt,f=new nt,m=new nt,v=new A,g=new A;function p(P,b,M){c.fromBufferAttribute(n,P),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,M),d.fromBufferAttribute(r,P),f.fromBufferAttribute(r,b),m.fromBufferAttribute(r,M),h.sub(c),u.sub(c),f.sub(d),m.sub(d);let C=1/(f.x*m.y-m.x*f.y);isFinite(C)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(C),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(C),a[P].add(v),a[b].add(v),a[M].add(v),l[P].add(g),l[b].add(g),l[M].add(g))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let P=0,b=x.length;P<b;++P){let M=x[P],C=M.start,k=M.count;for(let N=C,z=C+k;N<z;N+=3)p(t.getX(N+0),t.getX(N+1),t.getX(N+2))}let _=new A,y=new A,I=new A,T=new A;function S(P){I.fromBufferAttribute(s,P),T.copy(I);let b=a[P];_.copy(b),_.sub(I.multiplyScalar(I.dot(b))).normalize(),y.crossVectors(T,b);let C=y.dot(l[P])<0?-1:1;o.setXYZW(P,_.x,_.y,_.z,C)}for(let P=0,b=x.length;P<b;++P){let M=x[P],C=M.start,k=M.count;for(let N=C,z=C+k;N<z;N+=3)S(t.getX(N+0)),S(t.getX(N+1)),S(t.getX(N+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Oe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new A,r=new A,o=new A,a=new A,l=new A,c=new A,h=new A,u=new A;if(t)for(let d=0,f=t.count;d<f;d+=3){let m=t.getX(d+0),v=t.getX(d+1),g=t.getX(d+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,m),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)un.fromBufferAttribute(t,e),un.normalize(),t.setXYZ(e,un.x,un.y,un.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,m=0;for(let v=0,g=l.length;v<g;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let p=0;p<h;p++)d[m++]=c[f++]}return new Oe(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},_f=new jt,ks=new Ro,da=new ji,Mf=new A,fa=new A,pa=new A,ma=new A,Oc=new A,ga=new A,bf=new A,va=new A,D=class extends on{constructor(t=new de,e=new dn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){ga.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(Oc.fromBufferAttribute(u,t),o?ga.addScaledVector(Oc,h):ga.addScaledVector(Oc.sub(e),h))}e.add(ga)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),da.copy(n.boundingSphere),da.applyMatrix4(r),ks.copy(t.ray).recast(t.near),!(da.containsPoint(ks.origin)===!1&&(ks.intersectSphere(da,Mf)===null||ks.origin.distanceToSquared(Mf)>(t.far-t.near)**2))&&(_f.copy(r).invert(),ks.copy(t.ray).applyMatrix4(_f),!(n.boundingBox!==null&&ks.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ks)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,v=d.length;m<v;m++){let g=d[m],p=o[g.materialIndex],x=Math.max(g.start,f.start),_=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let y=x,I=_;y<I;y+=3){let T=a.getX(y),S=a.getX(y+1),P=a.getX(y+2);s=xa(this,p,t,n,c,h,u,T,S,P),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let m=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){let x=a.getX(g),_=a.getX(g+1),y=a.getX(g+2);s=xa(this,o,t,n,c,h,u,x,_,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,v=d.length;m<v;m++){let g=d[m],p=o[g.materialIndex],x=Math.max(g.start,f.start),_=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let y=x,I=_;y<I;y+=3){let T=y,S=y+1,P=y+2;s=xa(this,p,t,n,c,h,u,T,S,P),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let m=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){let x=g,_=g+1,y=g+2;s=xa(this,o,t,n,c,h,u,x,_,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}};function Hg(i,t,e,n,s,r,o,a){let l;if(t.side===Sn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Ri,a),l===null)return null;va.copy(a),va.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(va);return c<e.near||c>e.far?null:{distance:c,point:va.clone(),object:i}}function xa(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,fa),i.getVertexPosition(l,pa),i.getVertexPosition(c,ma);let h=Hg(i,t,e,n,fa,pa,ma,bf);if(h){let u=new A;Os.getBarycoord(bf,fa,pa,ma,u),s&&(h.uv=Os.getInterpolatedAttribute(s,a,l,c,u,new nt)),r&&(h.uv1=Os.getInterpolatedAttribute(r,a,l,c,u,new nt)),o&&(h.normal=Os.getInterpolatedAttribute(o,a,l,c,u,new A),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new A,materialIndex:0};Os.getNormal(fa,pa,ma,d.normal),h.face=d,h.barycoord=u}return h}var Ht=class i extends de{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,n,e,t,o,r,0),m("z","y","x",1,-1,n,e,-t,o,r,1),m("x","z","y",1,1,t,n,e,s,o,2),m("x","z","y",1,-1,t,n,-e,s,o,3),m("x","y","z",1,-1,t,e,n,s,r,4),m("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new $t(c,3)),this.setAttribute("normal",new $t(h,3)),this.setAttribute("uv",new $t(u,2));function m(v,g,p,x,_,y,I,T,S,P,b){let M=y/S,C=I/P,k=y/2,N=I/2,z=T/2,X=S+1,H=P+1,J=0,W=0,ct=new A;for(let ht=0;ht<H;ht++){let ft=ht*C-N;for(let Ut=0;Ut<X;Ut++){let qt=Ut*M-k;ct[v]=qt*x,ct[g]=ft*_,ct[p]=z,c.push(ct.x,ct.y,ct.z),ct[v]=0,ct[g]=0,ct[p]=T>0?1:-1,h.push(ct.x,ct.y,ct.z),u.push(Ut/S),u.push(1-ht/P),J+=1}}for(let ht=0;ht<P;ht++)for(let ft=0;ft<S;ft++){let Ut=d+ft+X*ht,qt=d+ft+X*(ht+1),K=d+(ft+1)+X*(ht+1),it=d+(ft+1)+X*ht;l.push(Ut,qt,it),l.push(qt,K,it),W+=6}a.addGroup(f,W,b),f+=W,d+=J}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Nr(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function kn(i){let t={};for(let e=0;e<i.length;e++){let n=Nr(i[e]);for(let s in n)t[s]=n[s]}return t}function Bg(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Sp(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:me.workingColorSpace}var Fg={clone:Nr,merge:kn},Og=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ye=class extends Ci{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Og,this.fragmentShader=zg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Nr(t.uniforms),this.uniformsGroups=Bg(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Xa=class extends on{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new jt,this.projectionMatrix=new jt,this.projectionMatrixInverse=new jt,this.coordinateSystem=Yi}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},fs=new A,Ef=new nt,wf=new nt,je=class extends Xa{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Ur*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Mo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ur*2*Math.atan(Math.tan(Mo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){fs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(fs.x,fs.y).multiplyScalar(-t/fs.z),fs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(fs.x,fs.y).multiplyScalar(-t/fs.z)}getViewSize(t,e){return this.getViewBounds(t,Ef,wf),e.subVectors(wf,Ef)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Mo*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},yr=-90,_r=1,zh=class extends on{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new je(yr,_r,t,e);s.layers=this.layers,this.add(s);let r=new je(yr,_r,t,e);r.layers=this.layers,this.add(r);let o=new je(yr,_r,t,e);o.layers=this.layers,this.add(o);let a=new je(yr,_r,t,e);a.layers=this.layers,this.add(a);let l=new je(yr,_r,t,e);l.layers=this.layers,this.add(l);let c=new je(yr,_r,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Yi)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ba)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},qa=class extends Nn{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Ir,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Gh=class extends ei{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new qa(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Jn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ht(5,5,5),r=new Ye({name:"CubemapFromEquirect",uniforms:Nr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Sn,blending:ms});r.uniforms.tEquirect.value=e;let o=new D(s,r),a=e.minFilter;return e.minFilter===Vs&&(e.minFilter=Jn),new zh(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},zc=new A,Gg=new A,Vg=new re,qi=class{constructor(t=new A(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=zc.subVectors(n,e).cross(Gg.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(zc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Vg.getNormalMatrix(t),s=this.coplanarPoint(zc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Us=new ji,ya=new A,Co=class{constructor(t=new qi,e=new qi,n=new qi,s=new qi,r=new qi,o=new qi){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Yi){let n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],f=s[8],m=s[9],v=s[10],g=s[11],p=s[12],x=s[13],_=s[14],y=s[15];if(n[0].setComponents(l-r,d-c,g-f,y-p).normalize(),n[1].setComponents(l+r,d+c,g+f,y+p).normalize(),n[2].setComponents(l+o,d+h,g+m,y+x).normalize(),n[3].setComponents(l-o,d-h,g-m,y-x).normalize(),n[4].setComponents(l-a,d-u,g-v,y-_).normalize(),e===Yi)n[5].setComponents(l+a,d+u,g+v,y+_).normalize();else if(e===Ba)n[5].setComponents(a,u,v,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Us.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Us.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Us)}intersectsSprite(t){return Us.center.set(0,0,0),Us.radius=.7071067811865476,Us.applyMatrix4(t.matrixWorld),this.intersectsSphere(Us)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(ya.x=s.normal.x>0?t.max.x:t.min.x,ya.y=s.normal.y>0?t.max.y:t.min.y,ya.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ya)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Tp(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Wg(i){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],v=u[f];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let v=u[f];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var fe=class i extends de{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=t/a,d=e/l,f=[],m=[],v=[],g=[];for(let p=0;p<h;p++){let x=p*d-o;for(let _=0;_<c;_++){let y=_*u-r;m.push(y,-x,0),v.push(0,0,1),g.push(_/a),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let x=0;x<a;x++){let _=x+c*p,y=x+c*(p+1),I=x+1+c*(p+1),T=x+1+c*p;f.push(_,y,T),f.push(y,I,T)}this.setIndex(f),this.setAttribute("position",new $t(m,3)),this.setAttribute("normal",new $t(v,3)),this.setAttribute("uv",new $t(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},Xg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,qg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Yg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Zg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Kg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,$g=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Jg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,jg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Qg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,tv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ev=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,nv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,iv=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,sv=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,rv=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ov=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,av=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,lv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,hv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,uv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,dv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,fv=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,pv=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,mv=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,gv=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,vv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,yv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_v=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Mv="gl_FragColor = linearToOutputTexel( gl_FragColor );",bv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ev=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,wv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Sv=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Tv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Av=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Rv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Cv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Pv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Iv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Lv=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Dv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,kv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Uv=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Nv=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Hv=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Bv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fv=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ov=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,zv=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Gv=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Vv=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Wv=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Xv=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,qv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Yv=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Zv=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kv=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$v=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,jv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Qv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,tx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ex=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,nx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ix=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,sx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,rx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ox=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ax=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,cx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,hx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ux=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,fx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,px=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,mx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,gx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,vx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,xx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,yx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,_x=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Mx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ex=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,wx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Sx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Tx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Ax=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Rx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Cx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Px=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ix=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Lx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Dx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,kx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ux=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Nx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Hx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Bx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Fx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ox=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,zx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Gx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Vx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Wx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Xx=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yx=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$x=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Jx=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,jx=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Qx=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ty=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ey=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ny=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,iy=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sy=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ry=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,oy=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ay=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ly=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,cy=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hy=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,uy=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,dy=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fy=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,py=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,my=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gy=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vy=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xy=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,yy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_y=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,My=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,by=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ey=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ae={alphahash_fragment:Xg,alphahash_pars_fragment:qg,alphamap_fragment:Yg,alphamap_pars_fragment:Zg,alphatest_fragment:Kg,alphatest_pars_fragment:$g,aomap_fragment:Jg,aomap_pars_fragment:jg,batching_pars_vertex:Qg,batching_vertex:tv,begin_vertex:ev,beginnormal_vertex:nv,bsdfs:iv,iridescence_fragment:sv,bumpmap_pars_fragment:rv,clipping_planes_fragment:ov,clipping_planes_pars_fragment:av,clipping_planes_pars_vertex:lv,clipping_planes_vertex:cv,color_fragment:hv,color_pars_fragment:uv,color_pars_vertex:dv,color_vertex:fv,common:pv,cube_uv_reflection_fragment:mv,defaultnormal_vertex:gv,displacementmap_pars_vertex:vv,displacementmap_vertex:xv,emissivemap_fragment:yv,emissivemap_pars_fragment:_v,colorspace_fragment:Mv,colorspace_pars_fragment:bv,envmap_fragment:Ev,envmap_common_pars_fragment:wv,envmap_pars_fragment:Sv,envmap_pars_vertex:Tv,envmap_physical_pars_fragment:Hv,envmap_vertex:Av,fog_vertex:Rv,fog_pars_vertex:Cv,fog_fragment:Pv,fog_pars_fragment:Iv,gradientmap_pars_fragment:Lv,lightmap_pars_fragment:Dv,lights_lambert_fragment:kv,lights_lambert_pars_fragment:Uv,lights_pars_begin:Nv,lights_toon_fragment:Bv,lights_toon_pars_fragment:Fv,lights_phong_fragment:Ov,lights_phong_pars_fragment:zv,lights_physical_fragment:Gv,lights_physical_pars_fragment:Vv,lights_fragment_begin:Wv,lights_fragment_maps:Xv,lights_fragment_end:qv,logdepthbuf_fragment:Yv,logdepthbuf_pars_fragment:Zv,logdepthbuf_pars_vertex:Kv,logdepthbuf_vertex:$v,map_fragment:Jv,map_pars_fragment:jv,map_particle_fragment:Qv,map_particle_pars_fragment:tx,metalnessmap_fragment:ex,metalnessmap_pars_fragment:nx,morphinstance_vertex:ix,morphcolor_vertex:sx,morphnormal_vertex:rx,morphtarget_pars_vertex:ox,morphtarget_vertex:ax,normal_fragment_begin:lx,normal_fragment_maps:cx,normal_pars_fragment:hx,normal_pars_vertex:ux,normal_vertex:dx,normalmap_pars_fragment:fx,clearcoat_normal_fragment_begin:px,clearcoat_normal_fragment_maps:mx,clearcoat_pars_fragment:gx,iridescence_pars_fragment:vx,opaque_fragment:xx,packing:yx,premultiplied_alpha_fragment:_x,project_vertex:Mx,dithering_fragment:bx,dithering_pars_fragment:Ex,roughnessmap_fragment:wx,roughnessmap_pars_fragment:Sx,shadowmap_pars_fragment:Tx,shadowmap_pars_vertex:Ax,shadowmap_vertex:Rx,shadowmask_pars_fragment:Cx,skinbase_vertex:Px,skinning_pars_vertex:Ix,skinning_vertex:Lx,skinnormal_vertex:Dx,specularmap_fragment:kx,specularmap_pars_fragment:Ux,tonemapping_fragment:Nx,tonemapping_pars_fragment:Hx,transmission_fragment:Bx,transmission_pars_fragment:Fx,uv_pars_fragment:Ox,uv_pars_vertex:zx,uv_vertex:Gx,worldpos_vertex:Vx,background_vert:Wx,background_frag:Xx,backgroundCube_vert:qx,backgroundCube_frag:Yx,cube_vert:Zx,cube_frag:Kx,depth_vert:$x,depth_frag:Jx,distanceRGBA_vert:jx,distanceRGBA_frag:Qx,equirect_vert:ty,equirect_frag:ey,linedashed_vert:ny,linedashed_frag:iy,meshbasic_vert:sy,meshbasic_frag:ry,meshlambert_vert:oy,meshlambert_frag:ay,meshmatcap_vert:ly,meshmatcap_frag:cy,meshnormal_vert:hy,meshnormal_frag:uy,meshphong_vert:dy,meshphong_frag:fy,meshphysical_vert:py,meshphysical_frag:my,meshtoon_vert:gy,meshtoon_frag:vy,points_vert:xy,points_frag:yy,shadow_vert:_y,shadow_frag:My,sprite_vert:by,sprite_frag:Ey},Rt={common:{diffuse:{value:new Dt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new re},alphaMap:{value:null},alphaMapTransform:{value:new re},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new re}},envmap:{envMap:{value:null},envMapRotation:{value:new re},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new re}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new re}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new re},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new re},normalScale:{value:new nt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new re},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new re}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new re}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new re}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Dt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Dt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new re},alphaTest:{value:0},uvTransform:{value:new re}},sprite:{diffuse:{value:new Dt(16777215)},opacity:{value:1},center:{value:new nt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new re},alphaMap:{value:null},alphaMapTransform:{value:new re},alphaTest:{value:0}}},Ti={basic:{uniforms:kn([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.fog]),vertexShader:ae.meshbasic_vert,fragmentShader:ae.meshbasic_frag},lambert:{uniforms:kn([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,Rt.lights,{emissive:{value:new Dt(0)}}]),vertexShader:ae.meshlambert_vert,fragmentShader:ae.meshlambert_frag},phong:{uniforms:kn([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,Rt.lights,{emissive:{value:new Dt(0)},specular:{value:new Dt(1118481)},shininess:{value:30}}]),vertexShader:ae.meshphong_vert,fragmentShader:ae.meshphong_frag},standard:{uniforms:kn([Rt.common,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.roughnessmap,Rt.metalnessmap,Rt.fog,Rt.lights,{emissive:{value:new Dt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ae.meshphysical_vert,fragmentShader:ae.meshphysical_frag},toon:{uniforms:kn([Rt.common,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.gradientmap,Rt.fog,Rt.lights,{emissive:{value:new Dt(0)}}]),vertexShader:ae.meshtoon_vert,fragmentShader:ae.meshtoon_frag},matcap:{uniforms:kn([Rt.common,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,{matcap:{value:null}}]),vertexShader:ae.meshmatcap_vert,fragmentShader:ae.meshmatcap_frag},points:{uniforms:kn([Rt.points,Rt.fog]),vertexShader:ae.points_vert,fragmentShader:ae.points_frag},dashed:{uniforms:kn([Rt.common,Rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ae.linedashed_vert,fragmentShader:ae.linedashed_frag},depth:{uniforms:kn([Rt.common,Rt.displacementmap]),vertexShader:ae.depth_vert,fragmentShader:ae.depth_frag},normal:{uniforms:kn([Rt.common,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,{opacity:{value:1}}]),vertexShader:ae.meshnormal_vert,fragmentShader:ae.meshnormal_frag},sprite:{uniforms:kn([Rt.sprite,Rt.fog]),vertexShader:ae.sprite_vert,fragmentShader:ae.sprite_frag},background:{uniforms:{uvTransform:{value:new re},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ae.background_vert,fragmentShader:ae.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new re}},vertexShader:ae.backgroundCube_vert,fragmentShader:ae.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ae.cube_vert,fragmentShader:ae.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ae.equirect_vert,fragmentShader:ae.equirect_frag},distanceRGBA:{uniforms:kn([Rt.common,Rt.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ae.distanceRGBA_vert,fragmentShader:ae.distanceRGBA_frag},shadow:{uniforms:kn([Rt.lights,Rt.fog,{color:{value:new Dt(0)},opacity:{value:1}}]),vertexShader:ae.shadow_vert,fragmentShader:ae.shadow_frag}};Ti.physical={uniforms:kn([Ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new re},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new re},clearcoatNormalScale:{value:new nt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new re},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new re},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new re},sheen:{value:0},sheenColor:{value:new Dt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new re},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new re},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new re},transmissionSamplerSize:{value:new nt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new re},attenuationDistance:{value:0},attenuationColor:{value:new Dt(0)},specularColor:{value:new Dt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new re},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new re},anisotropyVector:{value:new nt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new re}}]),vertexShader:ae.meshphysical_vert,fragmentShader:ae.meshphysical_frag};var _a={r:0,b:0,g:0},Ns=new vn,wy=new jt;function Sy(i,t,e,n,s,r,o){let a=new Dt(0),l=r===!0?0:1,c,h,u=null,d=0,f=null;function m(x){let _=x.isScene===!0?x.background:null;return _&&_.isTexture&&(_=(x.backgroundBlurriness>0?e:t).get(_)),_}function v(x){let _=!1,y=m(x);y===null?p(a,l):y&&y.isColor&&(p(y,1),_=!0);let I=i.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,o):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(x,_){let y=m(_);y&&(y.isCubeTexture||y.mapping===cl)?(h===void 0&&(h=new D(new Ht(1,1,1),new Ye({name:"BackgroundCubeMaterial",uniforms:Nr(Ti.backgroundCube.uniforms),vertexShader:Ti.backgroundCube.vertexShader,fragmentShader:Ti.backgroundCube.fragmentShader,side:Sn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(I,T,S){this.matrixWorld.copyPosition(S.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Ns.copy(_.backgroundRotation),Ns.x*=-1,Ns.y*=-1,Ns.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Ns.y*=-1,Ns.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(wy.makeRotationFromEuler(Ns)),h.material.toneMapped=me.getTransfer(y.colorSpace)!==Te,(u!==y||d!==y.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=y,d=y.version,f=i.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new D(new fe(2,2),new Ye({name:"BackgroundMaterial",uniforms:Nr(Ti.background.uniforms),vertexShader:Ti.background.vertexShader,fragmentShader:Ti.background.fragmentShader,side:Ri,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=me.getTransfer(y.colorSpace)!==Te,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=y,d=y.version,f=i.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function p(x,_){x.getRGB(_a,Sp(i)),n.buffers.color.setClear(_a.r,_a.g,_a.b,_,o)}return{getClearColor:function(){return a},setClearColor:function(x,_=1){a.set(x),l=_,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,p(a,l)},render:v,addToRenderList:g}}function Ty(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(M,C,k,N,z){let X=!1,H=u(N,k,C);r!==H&&(r=H,c(r.object)),X=f(M,N,k,z),X&&m(M,N,k,z),z!==null&&t.update(z,i.ELEMENT_ARRAY_BUFFER),(X||o)&&(o=!1,y(M,C,k,N),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function u(M,C,k){let N=k.wireframe===!0,z=n[M.id];z===void 0&&(z={},n[M.id]=z);let X=z[C.id];X===void 0&&(X={},z[C.id]=X);let H=X[N];return H===void 0&&(H=d(l()),X[N]=H),H}function d(M){let C=[],k=[],N=[];for(let z=0;z<e;z++)C[z]=0,k[z]=0,N[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:k,attributeDivisors:N,object:M,attributes:{},index:null}}function f(M,C,k,N){let z=r.attributes,X=C.attributes,H=0,J=k.getAttributes();for(let W in J)if(J[W].location>=0){let ht=z[W],ft=X[W];if(ft===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(ft=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(ft=M.instanceColor)),ht===void 0||ht.attribute!==ft||ft&&ht.data!==ft.data)return!0;H++}return r.attributesNum!==H||r.index!==N}function m(M,C,k,N){let z={},X=C.attributes,H=0,J=k.getAttributes();for(let W in J)if(J[W].location>=0){let ht=X[W];ht===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(ht=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(ht=M.instanceColor));let ft={};ft.attribute=ht,ht&&ht.data&&(ft.data=ht.data),z[W]=ft,H++}r.attributes=z,r.attributesNum=H,r.index=N}function v(){let M=r.newAttributes;for(let C=0,k=M.length;C<k;C++)M[C]=0}function g(M){p(M,0)}function p(M,C){let k=r.newAttributes,N=r.enabledAttributes,z=r.attributeDivisors;k[M]=1,N[M]===0&&(i.enableVertexAttribArray(M),N[M]=1),z[M]!==C&&(i.vertexAttribDivisor(M,C),z[M]=C)}function x(){let M=r.newAttributes,C=r.enabledAttributes;for(let k=0,N=C.length;k<N;k++)C[k]!==M[k]&&(i.disableVertexAttribArray(k),C[k]=0)}function _(M,C,k,N,z,X,H){H===!0?i.vertexAttribIPointer(M,C,k,z,X):i.vertexAttribPointer(M,C,k,N,z,X)}function y(M,C,k,N){v();let z=N.attributes,X=k.getAttributes(),H=C.defaultAttributeValues;for(let J in X){let W=X[J];if(W.location>=0){let ct=z[J];if(ct===void 0&&(J==="instanceMatrix"&&M.instanceMatrix&&(ct=M.instanceMatrix),J==="instanceColor"&&M.instanceColor&&(ct=M.instanceColor)),ct!==void 0){let ht=ct.normalized,ft=ct.itemSize,Ut=t.get(ct);if(Ut===void 0)continue;let qt=Ut.buffer,K=Ut.type,it=Ut.bytesPerElement,gt=K===i.INT||K===i.UNSIGNED_INT||ct.gpuType===ku;if(ct.isInterleavedBufferAttribute){let ut=ct.data,At=ut.stride,Bt=ct.offset;if(ut.isInstancedInterleavedBuffer){for(let Zt=0;Zt<W.locationSize;Zt++)p(W.location+Zt,ut.meshPerAttribute);M.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let Zt=0;Zt<W.locationSize;Zt++)g(W.location+Zt);i.bindBuffer(i.ARRAY_BUFFER,qt);for(let Zt=0;Zt<W.locationSize;Zt++)_(W.location+Zt,ft/W.locationSize,K,ht,At*it,(Bt+ft/W.locationSize*Zt)*it,gt)}else{if(ct.isInstancedBufferAttribute){for(let ut=0;ut<W.locationSize;ut++)p(W.location+ut,ct.meshPerAttribute);M.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let ut=0;ut<W.locationSize;ut++)g(W.location+ut);i.bindBuffer(i.ARRAY_BUFFER,qt);for(let ut=0;ut<W.locationSize;ut++)_(W.location+ut,ft/W.locationSize,K,ht,ft*it,ft/W.locationSize*ut*it,gt)}}else if(H!==void 0){let ht=H[J];if(ht!==void 0)switch(ht.length){case 2:i.vertexAttrib2fv(W.location,ht);break;case 3:i.vertexAttrib3fv(W.location,ht);break;case 4:i.vertexAttrib4fv(W.location,ht);break;default:i.vertexAttrib1fv(W.location,ht)}}}}x()}function I(){P();for(let M in n){let C=n[M];for(let k in C){let N=C[k];for(let z in N)h(N[z].object),delete N[z];delete C[k]}delete n[M]}}function T(M){if(n[M.id]===void 0)return;let C=n[M.id];for(let k in C){let N=C[k];for(let z in N)h(N[z].object),delete N[z];delete C[k]}delete n[M.id]}function S(M){for(let C in n){let k=n[C];if(k[M.id]===void 0)continue;let N=k[M.id];for(let z in N)h(N[z].object),delete N[z];delete k[M.id]}}function P(){b(),o=!0,r!==s&&(r=s,c(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:b,dispose:I,releaseStatesOfGeometry:T,releaseStatesOfProgram:S,initAttributes:v,enableAttribute:g,disableUnusedAttributes:x}}function Ay(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];e.update(f,n,1)}function l(c,h,u,d){if(u===0)return;let f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<c.length;m++)o(c[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let m=0;for(let v=0;v<u;v++)m+=h[v]*d[v];e.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Ry(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let S=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(S){return!(S!==mi&&n.convert(S)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(S){let P=S===_s&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(S!==$i&&n.convert(S)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&S!==Ai&&!P)}function l(S){if(S==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),_=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=m>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:x,maxVaryings:_,maxFragmentUniforms:y,vertexTextures:I,maxSamples:T}}function Cy(i){let t=this,e=null,n=0,s=!1,r=!1,o=new qi,a=new re,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{let x=r?0:n,_=x*4,y=p.clippingState||null;l.value=y,y=h(m,d,_,f);for(let I=0;I!==_;++I)y[I]=e[I];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,m){let v=u!==null?u.length:0,g=null;if(v!==0){if(g=l.value,m!==!0||g===null){let p=f+v*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(g===null||g.length<p)&&(g=new Float32Array(p));for(let _=0,y=f;_!==v;++_,y+=4)o.copy(u[_]).applyMatrix4(x,a),o.normal.toArray(g,y),g[y+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,g}}function Py(i){let t=new WeakMap;function e(o,a){return a===lh?o.mapping=Ir:a===ch&&(o.mapping=Lr),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===lh||a===ch)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new Gh(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Hr=class extends Xa{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},wr=4,Sf=[.125,.215,.35,.446,.526,.582],zs=20,Gc=new Hr,Tf=new Dt,Vc=null,Wc=0,Xc=0,qc=!1,Bs=(1+Math.sqrt(5))/2,Mr=1/Bs,Af=[new A(-Bs,Mr,0),new A(Bs,Mr,0),new A(-Mr,0,Bs),new A(Mr,0,Bs),new A(0,Bs,-Mr),new A(0,Bs,Mr),new A(-1,1,-1),new A(1,1,-1),new A(-1,1,1),new A(1,1,1)],Br=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Vc=this._renderer.getRenderTarget(),Wc=this._renderer.getActiveCubeFace(),Xc=this._renderer.getActiveMipmapLevel(),qc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Cf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Vc,Wc,Xc),this._renderer.xr.enabled=qc,t.scissorTest=!1,Ma(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ir||t.mapping===Lr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Vc=this._renderer.getRenderTarget(),Wc=this._renderer.getActiveCubeFace(),Xc=this._renderer.getActiveMipmapLevel(),qc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Jn,minFilter:Jn,generateMipmaps:!1,type:_s,format:mi,colorSpace:Wr,depthBuffer:!1},s=Rf(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Rf(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Iy(r)),this._blurMaterial=Ly(r,t,e)}return s}_compileMaterial(t){let e=new D(this._lodPlanes[0],t);this._renderer.compile(e,Gc)}_sceneToCubeUV(t,e,n,s){let a=new je(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Tf),h.toneMapping=gs,h.autoClear=!1;let f=new dn({name:"PMREM.Background",side:Sn,depthWrite:!1,depthTest:!1}),m=new D(new Ht,f),v=!1,g=t.background;g?g.isColor&&(f.color.copy(g),t.background=null,v=!0):(f.color.copy(Tf),v=!0);for(let p=0;p<6;p++){let x=p%3;x===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):x===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));let _=this._cubeSize;Ma(s,x*_,p>2?_:0,_,_),h.setRenderTarget(s),v&&h.render(m,a),h.render(t,a)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=g}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Ir||t.mapping===Lr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Cf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new D(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Ma(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Gc)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Af[(s-r-1)%Af.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new D(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*zs-1),v=r/m,g=isFinite(r)?1+Math.floor(h*v):zs;g>zs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${zs}`);let p=[],x=0;for(let S=0;S<zs;++S){let P=S/v,b=Math.exp(-P*P/2);p.push(b),S===0?x+=b:S<g&&(x+=2*b)}for(let S=0;S<p.length;S++)p[S]=p[S]/x;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:_}=this;d.dTheta.value=m,d.mipInt.value=_-n;let y=this._sizeLods[s],I=3*y*(s>_-wr?s-_+wr:0),T=4*(this._cubeSize-y);Ma(e,I,T,3*y,2*y),l.setRenderTarget(e),l.render(u,Gc)}};function Iy(i){let t=[],e=[],n=[],s=i,r=i-wr+1+Sf.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>i-wr?l=Sf[o-i+wr-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,v=3,g=2,p=1,x=new Float32Array(v*m*f),_=new Float32Array(g*m*f),y=new Float32Array(p*m*f);for(let T=0;T<f;T++){let S=T%3*2/3-1,P=T>2?0:-1,b=[S,P,0,S+2/3,P,0,S+2/3,P+1,0,S,P,0,S+2/3,P+1,0,S,P+1,0];x.set(b,v*m*T),_.set(d,g*m*T);let M=[T,T,T,T,T,T];y.set(M,p*m*T)}let I=new de;I.setAttribute("position",new Oe(x,v)),I.setAttribute("uv",new Oe(_,g)),I.setAttribute("faceIndex",new Oe(y,p)),t.push(I),s>wr&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Rf(i,t,e){let n=new ei(i,t,e);return n.texture.mapping=cl,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ma(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Ly(i,t,e){let n=new Float32Array(zs),s=new A(0,1,0);return new Ye({name:"SphericalGaussianBlur",defines:{n:zs,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Vu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ms,depthTest:!1,depthWrite:!1})}function Cf(){return new Ye({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ms,depthTest:!1,depthWrite:!1})}function Pf(){return new Ye({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ms,depthTest:!1,depthWrite:!1})}function Vu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Dy(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===lh||l===ch,h=l===Ir||l===Lr;if(c||h){let u=t.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Br(i)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return c&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new Br(i)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function ky(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&yo("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Uy(i,t,e,n){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let m in d.attributes)t.remove(d.attributes[m]);for(let m in d.morphAttributes){let v=d.morphAttributes[m];for(let g=0,p=v.length;g<p;g++)t.remove(v[g])}d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(u){let d=u.attributes;for(let m in d)t.update(d[m],i.ARRAY_BUFFER);let f=u.morphAttributes;for(let m in f){let v=f[m];for(let g=0,p=v.length;g<p;g++)t.update(v[g],i.ARRAY_BUFFER)}}function c(u){let d=[],f=u.index,m=u.attributes.position,v=0;if(f!==null){let x=f.array;v=f.version;for(let _=0,y=x.length;_<y;_+=3){let I=x[_+0],T=x[_+1],S=x[_+2];d.push(I,T,T,S,S,I)}}else if(m!==void 0){let x=m.array;v=m.version;for(let _=0,y=x.length/3-1;_<y;_+=3){let I=_+0,T=_+1,S=_+2;d.push(I,T,T,S,S,I)}}else return;let g=new(Ep(d)?Wa:Va)(d,1);g.version=v;let p=r.get(u);p&&t.remove(p),r.set(u,g)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function Ny(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*o),e.update(f,n,1)}function c(d,f,m){m!==0&&(i.drawElementsInstanced(n,f,r,d*o,m),e.update(f,n,m))}function h(d,f,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];e.update(g,n,1)}function u(d,f,m,v){if(m===0)return;let g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,v,0,m);let p=0;for(let x=0;x<m;x++)p+=f[x]*v[x];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Hy(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function By(i,t,e){let n=new WeakMap,s=new Ae;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let b=function(){S.dispose(),n.delete(a),a.removeEventListener("dispose",b)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],x=a.morphAttributes.color||[],_=0;f===!0&&(_=1),m===!0&&(_=2),v===!0&&(_=3);let y=a.attributes.position.count*_,I=1;y>t.maxTextureSize&&(I=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let T=new Float32Array(y*I*4*u),S=new za(T,y,I,u);S.type=Ai,S.needsUpdate=!0;let P=_*4;for(let M=0;M<u;M++){let C=g[M],k=p[M],N=x[M],z=y*I*4*M;for(let X=0;X<C.count;X++){let H=X*P;f===!0&&(s.fromBufferAttribute(C,X),T[z+H+0]=s.x,T[z+H+1]=s.y,T[z+H+2]=s.z,T[z+H+3]=0),m===!0&&(s.fromBufferAttribute(k,X),T[z+H+4]=s.x,T[z+H+5]=s.y,T[z+H+6]=s.z,T[z+H+7]=0),v===!0&&(s.fromBufferAttribute(N,X),T[z+H+8]=s.x,T[z+H+9]=s.y,T[z+H+10]=s.z,T[z+H+11]=N.itemSize===4?s.w:1)}}d={count:u,texture:S,size:new nt(y,I)},n.set(a,d),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];let m=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Fy(i,t,e,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var Ya=class extends Nn{constructor(t,e,n,s,r,o,a,l,c,h=Ar){if(h!==Ar&&h!==kr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ar&&(n=Ws),n===void 0&&h===kr&&(n=Dr),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Un,this.minFilter=l!==void 0?l:Un,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Ap=new Nn,If=new Ya(1,1),Rp=new za,Cp=new Oh,Pp=new qa,Lf=[],Df=[],kf=new Float32Array(16),Uf=new Float32Array(9),Nf=new Float32Array(4);function qr(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Lf[s];if(r===void 0&&(r=new Float32Array(s),Lf[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function an(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function ln(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ul(i,t){let e=Df[t];e===void 0&&(e=new Int32Array(t),Df[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Oy(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function zy(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(an(e,t))return;i.uniform2fv(this.addr,t),ln(e,t)}}function Gy(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(an(e,t))return;i.uniform3fv(this.addr,t),ln(e,t)}}function Vy(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(an(e,t))return;i.uniform4fv(this.addr,t),ln(e,t)}}function Wy(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(an(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),ln(e,t)}else{if(an(e,n))return;Nf.set(n),i.uniformMatrix2fv(this.addr,!1,Nf),ln(e,n)}}function Xy(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(an(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),ln(e,t)}else{if(an(e,n))return;Uf.set(n),i.uniformMatrix3fv(this.addr,!1,Uf),ln(e,n)}}function qy(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(an(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),ln(e,t)}else{if(an(e,n))return;kf.set(n),i.uniformMatrix4fv(this.addr,!1,kf),ln(e,n)}}function Yy(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Zy(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(an(e,t))return;i.uniform2iv(this.addr,t),ln(e,t)}}function Ky(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(an(e,t))return;i.uniform3iv(this.addr,t),ln(e,t)}}function $y(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(an(e,t))return;i.uniform4iv(this.addr,t),ln(e,t)}}function Jy(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function jy(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(an(e,t))return;i.uniform2uiv(this.addr,t),ln(e,t)}}function Qy(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(an(e,t))return;i.uniform3uiv(this.addr,t),ln(e,t)}}function t1(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(an(e,t))return;i.uniform4uiv(this.addr,t),ln(e,t)}}function e1(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(If.compareFunction=Mp,r=If):r=Ap,e.setTexture2D(t||r,s)}function n1(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Cp,s)}function i1(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Pp,s)}function s1(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Rp,s)}function r1(i){switch(i){case 5126:return Oy;case 35664:return zy;case 35665:return Gy;case 35666:return Vy;case 35674:return Wy;case 35675:return Xy;case 35676:return qy;case 5124:case 35670:return Yy;case 35667:case 35671:return Zy;case 35668:case 35672:return Ky;case 35669:case 35673:return $y;case 5125:return Jy;case 36294:return jy;case 36295:return Qy;case 36296:return t1;case 35678:case 36198:case 36298:case 36306:case 35682:return e1;case 35679:case 36299:case 36307:return n1;case 35680:case 36300:case 36308:case 36293:return i1;case 36289:case 36303:case 36311:case 36292:return s1}}function o1(i,t){i.uniform1fv(this.addr,t)}function a1(i,t){let e=qr(t,this.size,2);i.uniform2fv(this.addr,e)}function l1(i,t){let e=qr(t,this.size,3);i.uniform3fv(this.addr,e)}function c1(i,t){let e=qr(t,this.size,4);i.uniform4fv(this.addr,e)}function h1(i,t){let e=qr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function u1(i,t){let e=qr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function d1(i,t){let e=qr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function f1(i,t){i.uniform1iv(this.addr,t)}function p1(i,t){i.uniform2iv(this.addr,t)}function m1(i,t){i.uniform3iv(this.addr,t)}function g1(i,t){i.uniform4iv(this.addr,t)}function v1(i,t){i.uniform1uiv(this.addr,t)}function x1(i,t){i.uniform2uiv(this.addr,t)}function y1(i,t){i.uniform3uiv(this.addr,t)}function _1(i,t){i.uniform4uiv(this.addr,t)}function M1(i,t,e){let n=this.cache,s=t.length,r=ul(e,s);an(n,r)||(i.uniform1iv(this.addr,r),ln(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Ap,r[o])}function b1(i,t,e){let n=this.cache,s=t.length,r=ul(e,s);an(n,r)||(i.uniform1iv(this.addr,r),ln(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Cp,r[o])}function E1(i,t,e){let n=this.cache,s=t.length,r=ul(e,s);an(n,r)||(i.uniform1iv(this.addr,r),ln(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Pp,r[o])}function w1(i,t,e){let n=this.cache,s=t.length,r=ul(e,s);an(n,r)||(i.uniform1iv(this.addr,r),ln(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Rp,r[o])}function S1(i){switch(i){case 5126:return o1;case 35664:return a1;case 35665:return l1;case 35666:return c1;case 35674:return h1;case 35675:return u1;case 35676:return d1;case 5124:case 35670:return f1;case 35667:case 35671:return p1;case 35668:case 35672:return m1;case 35669:case 35673:return g1;case 5125:return v1;case 36294:return x1;case 36295:return y1;case 36296:return _1;case 35678:case 36198:case 36298:case 36306:case 35682:return M1;case 35679:case 36299:case 36307:return b1;case 35680:case 36300:case 36308:case 36293:return E1;case 36289:case 36303:case 36311:case 36292:return w1}}var Vh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=r1(e.type)}},Wh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=S1(e.type)}},Xh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Yc=/(\w+)(\])?(\[|\.)?/g;function Hf(i,t){i.seq.push(t),i.map[t.id]=t}function T1(i,t,e){let n=i.name,s=n.length;for(Yc.lastIndex=0;;){let r=Yc.exec(n),o=Yc.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Hf(e,c===void 0?new Vh(a,i,t):new Wh(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new Xh(a),Hf(e,u)),e=u}}}var Cr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);T1(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function Bf(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var A1=37297,R1=0;function C1(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var Ff=new re;function P1(i){me._getMatrix(Ff,me.workingColorSpace,i);let t=`mat3( ${Ff.elements.map(e=>e.toFixed(4))} )`;switch(me.getTransfer(i)){case hl:return[t,"LinearTransferOETF"];case Te:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Of(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+C1(i.getShaderSource(t),o)}else return s}function I1(i,t){let e=P1(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function L1(i,t){let e;switch(t){case Vm:e="Linear";break;case Wm:e="Reinhard";break;case Xm:e="Cineon";break;case Du:e="ACESFilmic";break;case Ym:e="AgX";break;case Zm:e="Neutral";break;case qm:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var ba=new A;function D1(){me.getLuminanceCoefficients(ba);let i=ba.x.toFixed(4),t=ba.y.toFixed(4),e=ba.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function k1(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(_o).join(`
`)}function U1(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function N1(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function _o(i){return i!==""}function zf(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Gf(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var H1=/^[ \t]*#include +<([\w\d./]+)>/gm;function qh(i){return i.replace(H1,F1)}var B1=new Map;function F1(i,t){let e=ae[t];if(e===void 0){let n=B1.get(t);if(n!==void 0)e=ae[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return qh(e)}var O1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vf(i){return i.replace(O1,z1)}function z1(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Wf(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function G1(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===hp?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Cu?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Xi&&(t="SHADOWMAP_TYPE_VSM"),t}function V1(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ir:case Lr:t="ENVMAP_TYPE_CUBE";break;case cl:t="ENVMAP_TYPE_CUBE_UV";break}return t}function W1(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Lr:t="ENVMAP_MODE_REFRACTION";break}return t}function X1(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Lu:t="ENVMAP_BLENDING_MULTIPLY";break;case zm:t="ENVMAP_BLENDING_MIX";break;case Gm:t="ENVMAP_BLENDING_ADD";break}return t}function q1(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Y1(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=G1(e),c=V1(e),h=W1(e),u=X1(e),d=q1(e),f=k1(e),m=U1(r),v=s.createProgram(),g,p,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(_o).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(_o).join(`
`),p.length>0&&(p+=`
`)):(g=[Wf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(_o).join(`
`),p=[Wf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==gs?"#define TONE_MAPPING":"",e.toneMapping!==gs?ae.tonemapping_pars_fragment:"",e.toneMapping!==gs?L1("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ae.colorspace_pars_fragment,I1("linearToOutputTexel",e.outputColorSpace),D1(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(_o).join(`
`)),o=qh(o),o=zf(o,e),o=Gf(o,e),a=qh(a),a=zf(a,e),a=Gf(a,e),o=Vf(o),a=Vf(a),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===nf?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===nf?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let _=x+g+o,y=x+p+a,I=Bf(s,s.VERTEX_SHADER,_),T=Bf(s,s.FRAGMENT_SHADER,y);s.attachShader(v,I),s.attachShader(v,T),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function S(C){if(i.debug.checkShaderErrors){let k=s.getProgramInfoLog(v).trim(),N=s.getShaderInfoLog(I).trim(),z=s.getShaderInfoLog(T).trim(),X=!0,H=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,I,T);else{let J=Of(s,I,"vertex"),W=Of(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+k+`
`+J+`
`+W)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(N===""||z==="")&&(H=!1);H&&(C.diagnostics={runnable:X,programLog:k,vertexShader:{log:N,prefix:g},fragmentShader:{log:z,prefix:p}})}s.deleteShader(I),s.deleteShader(T),P=new Cr(s,v),b=N1(s,v)}let P;this.getUniforms=function(){return P===void 0&&S(this),P};let b;this.getAttributes=function(){return b===void 0&&S(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(v,A1)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=R1++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=I,this.fragmentShader=T,this}var Z1=0,Yh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Zh(t),e.set(t,n)),n}},Zh=class{constructor(t){this.id=Z1++,this.code=t,this.usedTimes=0}};function K1(i,t,e,n,s,r,o){let a=new Ga,l=new Yh,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return c.add(b),b===0?"uv":`uv${b}`}function g(b,M,C,k,N){let z=k.fog,X=N.geometry,H=b.isMeshStandardMaterial?k.environment:null,J=(b.isMeshStandardMaterial?e:t).get(b.envMap||H),W=J&&J.mapping===cl?J.image.height:null,ct=m[b.type];b.precision!==null&&(f=s.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));let ht=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ft=ht!==void 0?ht.length:0,Ut=0;X.morphAttributes.position!==void 0&&(Ut=1),X.morphAttributes.normal!==void 0&&(Ut=2),X.morphAttributes.color!==void 0&&(Ut=3);let qt,K,it,gt;if(ct){let we=Ti[ct];qt=we.vertexShader,K=we.fragmentShader}else qt=b.vertexShader,K=b.fragmentShader,l.update(b),it=l.getVertexShaderID(b),gt=l.getFragmentShaderID(b);let ut=i.getRenderTarget(),At=i.state.buffers.depth.getReversed(),Bt=N.isInstancedMesh===!0,Zt=N.isBatchedMesh===!0,te=!!b.map,et=!!b.matcap,pt=!!J,L=!!b.aoMap,Ft=!!b.lightMap,st=!!b.bumpMap,It=!!b.normalMap,xt=!!b.displacementMap,zt=!!b.emissiveMap,St=!!b.metalnessMap,R=!!b.roughnessMap,E=b.anisotropy>0,G=b.clearcoat>0,V=b.dispersion>0,$=b.iridescence>0,B=b.sheen>0,j=b.transmission>0,rt=E&&!!b.anisotropyMap,mt=G&&!!b.clearcoatMap,Ot=G&&!!b.clearcoatNormalMap,at=G&&!!b.clearcoatRoughnessMap,Et=$&&!!b.iridescenceMap,Nt=$&&!!b.iridescenceThicknessMap,Gt=B&&!!b.sheenColorMap,Ct=B&&!!b.sheenRoughnessMap,Q=!!b.specularMap,vt=!!b.specularColorMap,Mt=!!b.specularIntensityMap,U=j&&!!b.transmissionMap,dt=j&&!!b.thicknessMap,Z=!!b.gradientMap,ot=!!b.alphaMap,Lt=b.alphaTest>0,Pt=!!b.alphaHash,ie=!!b.extensions,Ve=gs;b.toneMapped&&(ut===null||ut.isXRRenderTarget===!0)&&(Ve=i.toneMapping);let bn={shaderID:ct,shaderType:b.type,shaderName:b.name,vertexShader:qt,fragmentShader:K,defines:b.defines,customVertexShaderID:it,customFragmentShaderID:gt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Zt,batchingColor:Zt&&N._colorsTexture!==null,instancing:Bt,instancingColor:Bt&&N.instanceColor!==null,instancingMorph:Bt&&N.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ut===null?i.outputColorSpace:ut.isXRRenderTarget===!0?ut.texture.colorSpace:Wr,alphaToCoverage:!!b.alphaToCoverage,map:te,matcap:et,envMap:pt,envMapMode:pt&&J.mapping,envMapCubeUVHeight:W,aoMap:L,lightMap:Ft,bumpMap:st,normalMap:It,displacementMap:d&&xt,emissiveMap:zt,normalMapObjectSpace:It&&b.normalMapType===jm,normalMapTangentSpace:It&&b.normalMapType===zu,metalnessMap:St,roughnessMap:R,anisotropy:E,anisotropyMap:rt,clearcoat:G,clearcoatMap:mt,clearcoatNormalMap:Ot,clearcoatRoughnessMap:at,dispersion:V,iridescence:$,iridescenceMap:Et,iridescenceThicknessMap:Nt,sheen:B,sheenColorMap:Gt,sheenRoughnessMap:Ct,specularMap:Q,specularColorMap:vt,specularIntensityMap:Mt,transmission:j,transmissionMap:U,thicknessMap:dt,gradientMap:Z,opaque:b.transparent===!1&&b.blending===Tr&&b.alphaToCoverage===!1,alphaMap:ot,alphaTest:Lt,alphaHash:Pt,combine:b.combine,mapUv:te&&v(b.map.channel),aoMapUv:L&&v(b.aoMap.channel),lightMapUv:Ft&&v(b.lightMap.channel),bumpMapUv:st&&v(b.bumpMap.channel),normalMapUv:It&&v(b.normalMap.channel),displacementMapUv:xt&&v(b.displacementMap.channel),emissiveMapUv:zt&&v(b.emissiveMap.channel),metalnessMapUv:St&&v(b.metalnessMap.channel),roughnessMapUv:R&&v(b.roughnessMap.channel),anisotropyMapUv:rt&&v(b.anisotropyMap.channel),clearcoatMapUv:mt&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:Ot&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:at&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Et&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:Nt&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:Gt&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:Ct&&v(b.sheenRoughnessMap.channel),specularMapUv:Q&&v(b.specularMap.channel),specularColorMapUv:vt&&v(b.specularColorMap.channel),specularIntensityMapUv:Mt&&v(b.specularIntensityMap.channel),transmissionMapUv:U&&v(b.transmissionMap.channel),thicknessMapUv:dt&&v(b.thicknessMap.channel),alphaMapUv:ot&&v(b.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(It||E),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!X.attributes.uv&&(te||ot),fog:!!z,useFog:b.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:At,skinning:N.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:ft,morphTextureStride:Ut,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ve,decodeVideoTexture:te&&b.map.isVideoTexture===!0&&me.getTransfer(b.map.colorSpace)===Te,decodeVideoTextureEmissive:zt&&b.emissiveMap.isVideoTexture===!0&&me.getTransfer(b.emissiveMap.colorSpace)===Te,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===he,flipSided:b.side===Sn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:ie&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ie&&b.extensions.multiDraw===!0||Zt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return bn.vertexUv1s=c.has(1),bn.vertexUv2s=c.has(2),bn.vertexUv3s=c.has(3),c.clear(),bn}function p(b){let M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(let C in b.defines)M.push(C),M.push(b.defines[C]);return b.isRawShaderMaterial===!1&&(x(M,b),_(M,b),M.push(i.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function x(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function _(b,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),b.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),b.push(a.mask)}function y(b){let M=m[b.type],C;if(M){let k=Ti[M];C=Fg.clone(k.uniforms)}else C=b.uniforms;return C}function I(b,M){let C;for(let k=0,N=h.length;k<N;k++){let z=h[k];if(z.cacheKey===M){C=z,++C.usedTimes;break}}return C===void 0&&(C=new Y1(i,M,b,r),h.push(C)),C}function T(b){if(--b.usedTimes===0){let M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function S(b){l.remove(b)}function P(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:y,acquireProgram:I,releaseProgram:T,releaseShaderCache:S,programs:h,dispose:P}}function $1(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function J1(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Xf(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function qf(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,f,m,v,g){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:v,group:g},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=v,p.group=g),t++,p}function a(u,d,f,m,v,g){let p=o(u,d,f,m,v,g);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function l(u,d,f,m,v,g){let p=o(u,d,f,m,v,g);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||J1),n.length>1&&n.sort(d||Xf),s.length>1&&s.sort(d||Xf)}function h(){for(let u=t,d=i.length;u<d;u++){let f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function j1(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new qf,i.set(n,[o])):s>=r.length?(o=new qf,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Q1(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new A,color:new Dt};break;case"SpotLight":e={position:new A,direction:new A,color:new Dt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new A,color:new Dt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new A,skyColor:new Dt,groundColor:new Dt};break;case"RectAreaLight":e={color:new Dt,position:new A,halfWidth:new A,halfHeight:new A};break}return i[t.id]=e,e}}}function t_(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var e_=0;function n_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function i_(i){let t=new Q1,e=t_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new A);let s=new A,r=new jt,o=new jt;function a(c){let h=0,u=0,d=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let f=0,m=0,v=0,g=0,p=0,x=0,_=0,y=0,I=0,T=0,S=0;c.sort(n_);for(let b=0,M=c.length;b<M;b++){let C=c[b],k=C.color,N=C.intensity,z=C.distance,X=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=k.r*N,u+=k.g*N,d+=k.b*N;else if(C.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(C.sh.coefficients[H],N);S++}else if(C.isDirectionalLight){let H=t.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let J=C.shadow,W=e.get(C);W.shadowIntensity=J.intensity,W.shadowBias=J.bias,W.shadowNormalBias=J.normalBias,W.shadowRadius=J.radius,W.shadowMapSize=J.mapSize,n.directionalShadow[f]=W,n.directionalShadowMap[f]=X,n.directionalShadowMatrix[f]=C.shadow.matrix,x++}n.directional[f]=H,f++}else if(C.isSpotLight){let H=t.get(C);H.position.setFromMatrixPosition(C.matrixWorld),H.color.copy(k).multiplyScalar(N),H.distance=z,H.coneCos=Math.cos(C.angle),H.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),H.decay=C.decay,n.spot[v]=H;let J=C.shadow;if(C.map&&(n.spotLightMap[I]=C.map,I++,J.updateMatrices(C),C.castShadow&&T++),n.spotLightMatrix[v]=J.matrix,C.castShadow){let W=e.get(C);W.shadowIntensity=J.intensity,W.shadowBias=J.bias,W.shadowNormalBias=J.normalBias,W.shadowRadius=J.radius,W.shadowMapSize=J.mapSize,n.spotShadow[v]=W,n.spotShadowMap[v]=X,y++}v++}else if(C.isRectAreaLight){let H=t.get(C);H.color.copy(k).multiplyScalar(N),H.halfWidth.set(C.width*.5,0,0),H.halfHeight.set(0,C.height*.5,0),n.rectArea[g]=H,g++}else if(C.isPointLight){let H=t.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),H.distance=C.distance,H.decay=C.decay,C.castShadow){let J=C.shadow,W=e.get(C);W.shadowIntensity=J.intensity,W.shadowBias=J.bias,W.shadowNormalBias=J.normalBias,W.shadowRadius=J.radius,W.shadowMapSize=J.mapSize,W.shadowCameraNear=J.camera.near,W.shadowCameraFar=J.camera.far,n.pointShadow[m]=W,n.pointShadowMap[m]=X,n.pointShadowMatrix[m]=C.shadow.matrix,_++}n.point[m]=H,m++}else if(C.isHemisphereLight){let H=t.get(C);H.skyColor.copy(C.color).multiplyScalar(N),H.groundColor.copy(C.groundColor).multiplyScalar(N),n.hemi[p]=H,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Rt.LTC_FLOAT_1,n.rectAreaLTC2=Rt.LTC_FLOAT_2):(n.rectAreaLTC1=Rt.LTC_HALF_1,n.rectAreaLTC2=Rt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let P=n.hash;(P.directionalLength!==f||P.pointLength!==m||P.spotLength!==v||P.rectAreaLength!==g||P.hemiLength!==p||P.numDirectionalShadows!==x||P.numPointShadows!==_||P.numSpotShadows!==y||P.numSpotMaps!==I||P.numLightProbes!==S)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=y+I-T,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=S,P.directionalLength=f,P.pointLength=m,P.spotLength=v,P.rectAreaLength=g,P.hemiLength=p,P.numDirectionalShadows=x,P.numPointShadows=_,P.numSpotShadows=y,P.numSpotMaps=I,P.numLightProbes=S,n.version=e_++)}function l(c,h){let u=0,d=0,f=0,m=0,v=0,g=h.matrixWorldInverse;for(let p=0,x=c.length;p<x;p++){let _=c[p];if(_.isDirectionalLight){let y=n.directional[u];y.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),u++}else if(_.isSpotLight){let y=n.spot[f];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),f++}else if(_.isRectAreaLight){let y=n.rectArea[m];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(g),o.identity(),r.copy(_.matrixWorld),r.premultiply(g),o.extractRotation(r),y.halfWidth.set(_.width*.5,0,0),y.halfHeight.set(0,_.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),m++}else if(_.isPointLight){let y=n.point[d];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(g),d++}else if(_.isHemisphereLight){let y=n.hemi[v];y.direction.setFromMatrixPosition(_.matrixWorld),y.direction.transformDirection(g),v++}}}return{setup:a,setupView:l,state:n}}function Yf(i){let t=new i_(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}let c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function s_(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new Yf(i),t.set(s,[a])):r>=o.length?(a=new Yf(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var Kh=class extends Ci{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=$m,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},$h=class extends Ci{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},r_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,o_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function a_(i,t,e){let n=new Co,s=new nt,r=new nt,o=new Ae,a=new Kh({depthPacking:Jm}),l=new $h,c={},h=e.maxTextureSize,u={[Ri]:Sn,[Sn]:Ri,[he]:he},d=new Ye({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new nt},radius:{value:4}},vertexShader:r_,fragmentShader:o_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new de;m.setAttribute("position",new Oe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new D(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=hp;let p=this.type;this.render=function(T,S,P){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;let b=i.getRenderTarget(),M=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),k=i.state;k.setBlending(ms),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let N=p!==Xi&&this.type===Xi,z=p===Xi&&this.type!==Xi;for(let X=0,H=T.length;X<H;X++){let J=T[X],W=J.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);let ct=W.getFrameExtents();if(s.multiply(ct),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ct.x),s.x=r.x*ct.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ct.y),s.y=r.y*ct.y,W.mapSize.y=r.y)),W.map===null||N===!0||z===!0){let ft=this.type!==Xi?{minFilter:Un,magFilter:Un}:{};W.map!==null&&W.map.dispose(),W.map=new ei(s.x,s.y,ft),W.map.texture.name=J.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();let ht=W.getViewportCount();for(let ft=0;ft<ht;ft++){let Ut=W.getViewport(ft);o.set(r.x*Ut.x,r.y*Ut.y,r.x*Ut.z,r.y*Ut.w),k.viewport(o),W.updateMatrices(J,ft),n=W.getFrustum(),y(S,P,W.camera,J,this.type)}W.isPointLightShadow!==!0&&this.type===Xi&&x(W,P),W.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(b,M,C)};function x(T,S){let P=t.update(v);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new ei(s.x,s.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(S,null,P,d,v,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(S,null,P,f,v,null)}function _(T,S,P,b){let M=null,C=P.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(C!==void 0)M=C;else if(M=P.isPointLight===!0?l:a,i.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0){let k=M.uuid,N=S.uuid,z=c[k];z===void 0&&(z={},c[k]=z);let X=z[N];X===void 0&&(X=M.clone(),z[N]=X,S.addEventListener("dispose",I)),M=X}if(M.visible=S.visible,M.wireframe=S.wireframe,b===Xi?M.side=S.shadowSide!==null?S.shadowSide:S.side:M.side=S.shadowSide!==null?S.shadowSide:u[S.side],M.alphaMap=S.alphaMap,M.alphaTest=S.alphaTest,M.map=S.map,M.clipShadows=S.clipShadows,M.clippingPlanes=S.clippingPlanes,M.clipIntersection=S.clipIntersection,M.displacementMap=S.displacementMap,M.displacementScale=S.displacementScale,M.displacementBias=S.displacementBias,M.wireframeLinewidth=S.wireframeLinewidth,M.linewidth=S.linewidth,P.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let k=i.properties.get(M);k.light=P}return M}function y(T,S,P,b,M){if(T.visible===!1)return;if(T.layers.test(S.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&M===Xi)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,T.matrixWorld);let N=t.update(T),z=T.material;if(Array.isArray(z)){let X=N.groups;for(let H=0,J=X.length;H<J;H++){let W=X[H],ct=z[W.materialIndex];if(ct&&ct.visible){let ht=_(T,ct,b,M);T.onBeforeShadow(i,T,S,P,N,ht,W),i.renderBufferDirect(P,null,N,ht,T,W),T.onAfterShadow(i,T,S,P,N,ht,W)}}}else if(z.visible){let X=_(T,z,b,M);T.onBeforeShadow(i,T,S,P,N,X,null),i.renderBufferDirect(P,null,N,X,T,null),T.onAfterShadow(i,T,S,P,N,X,null)}}let k=T.children;for(let N=0,z=k.length;N<z;N++)y(k[N],S,P,b,M)}function I(T){T.target.removeEventListener("dispose",I);for(let P in c){let b=c[P],M=T.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}var l_={[eh]:nh,[ih]:oh,[sh]:ah,[Pr]:rh,[nh]:eh,[oh]:ih,[ah]:sh,[rh]:Pr};function c_(i,t){function e(){let U=!1,dt=new Ae,Z=null,ot=new Ae(0,0,0,0);return{setMask:function(Lt){Z!==Lt&&!U&&(i.colorMask(Lt,Lt,Lt,Lt),Z=Lt)},setLocked:function(Lt){U=Lt},setClear:function(Lt,Pt,ie,Ve,bn){bn===!0&&(Lt*=Ve,Pt*=Ve,ie*=Ve),dt.set(Lt,Pt,ie,Ve),ot.equals(dt)===!1&&(i.clearColor(Lt,Pt,ie,Ve),ot.copy(dt))},reset:function(){U=!1,Z=null,ot.set(-1,0,0,0)}}}function n(){let U=!1,dt=!1,Z=null,ot=null,Lt=null;return{setReversed:function(Pt){if(dt!==Pt){let ie=t.get("EXT_clip_control");dt?ie.clipControlEXT(ie.LOWER_LEFT_EXT,ie.ZERO_TO_ONE_EXT):ie.clipControlEXT(ie.LOWER_LEFT_EXT,ie.NEGATIVE_ONE_TO_ONE_EXT);let Ve=Lt;Lt=null,this.setClear(Ve)}dt=Pt},getReversed:function(){return dt},setTest:function(Pt){Pt?ut(i.DEPTH_TEST):At(i.DEPTH_TEST)},setMask:function(Pt){Z!==Pt&&!U&&(i.depthMask(Pt),Z=Pt)},setFunc:function(Pt){if(dt&&(Pt=l_[Pt]),ot!==Pt){switch(Pt){case eh:i.depthFunc(i.NEVER);break;case nh:i.depthFunc(i.ALWAYS);break;case ih:i.depthFunc(i.LESS);break;case Pr:i.depthFunc(i.LEQUAL);break;case sh:i.depthFunc(i.EQUAL);break;case rh:i.depthFunc(i.GEQUAL);break;case oh:i.depthFunc(i.GREATER);break;case ah:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ot=Pt}},setLocked:function(Pt){U=Pt},setClear:function(Pt){Lt!==Pt&&(dt&&(Pt=1-Pt),i.clearDepth(Pt),Lt=Pt)},reset:function(){U=!1,Z=null,ot=null,Lt=null,dt=!1}}}function s(){let U=!1,dt=null,Z=null,ot=null,Lt=null,Pt=null,ie=null,Ve=null,bn=null;return{setTest:function(we){U||(we?ut(i.STENCIL_TEST):At(i.STENCIL_TEST))},setMask:function(we){dt!==we&&!U&&(i.stencilMask(we),dt=we)},setFunc:function(we,hi,Bi){(Z!==we||ot!==hi||Lt!==Bi)&&(i.stencilFunc(we,hi,Bi),Z=we,ot=hi,Lt=Bi)},setOp:function(we,hi,Bi){(Pt!==we||ie!==hi||Ve!==Bi)&&(i.stencilOp(we,hi,Bi),Pt=we,ie=hi,Ve=Bi)},setLocked:function(we){U=we},setClear:function(we){bn!==we&&(i.clearStencil(we),bn=we)},reset:function(){U=!1,dt=null,Z=null,ot=null,Lt=null,Pt=null,ie=null,Ve=null,bn=null}}}let r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,f=[],m=null,v=!1,g=null,p=null,x=null,_=null,y=null,I=null,T=null,S=new Dt(0,0,0),P=0,b=!1,M=null,C=null,k=null,N=null,z=null,X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,J=0,W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(W)[1]),H=J>=1):W.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),H=J>=2);let ct=null,ht={},ft=i.getParameter(i.SCISSOR_BOX),Ut=i.getParameter(i.VIEWPORT),qt=new Ae().fromArray(ft),K=new Ae().fromArray(Ut);function it(U,dt,Z,ot){let Lt=new Uint8Array(4),Pt=i.createTexture();i.bindTexture(U,Pt),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ie=0;ie<Z;ie++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(dt,0,i.RGBA,1,1,ot,0,i.RGBA,i.UNSIGNED_BYTE,Lt):i.texImage2D(dt+ie,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Lt);return Pt}let gt={};gt[i.TEXTURE_2D]=it(i.TEXTURE_2D,i.TEXTURE_2D,1),gt[i.TEXTURE_CUBE_MAP]=it(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),gt[i.TEXTURE_2D_ARRAY]=it(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),gt[i.TEXTURE_3D]=it(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ut(i.DEPTH_TEST),o.setFunc(Pr),st(!1),It(Zd),ut(i.CULL_FACE),L(ms);function ut(U){h[U]!==!0&&(i.enable(U),h[U]=!0)}function At(U){h[U]!==!1&&(i.disable(U),h[U]=!1)}function Bt(U,dt){return u[U]!==dt?(i.bindFramebuffer(U,dt),u[U]=dt,U===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=dt),U===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=dt),!0):!1}function Zt(U,dt){let Z=f,ot=!1;if(U){Z=d.get(dt),Z===void 0&&(Z=[],d.set(dt,Z));let Lt=U.textures;if(Z.length!==Lt.length||Z[0]!==i.COLOR_ATTACHMENT0){for(let Pt=0,ie=Lt.length;Pt<ie;Pt++)Z[Pt]=i.COLOR_ATTACHMENT0+Pt;Z.length=Lt.length,ot=!0}}else Z[0]!==i.BACK&&(Z[0]=i.BACK,ot=!0);ot&&i.drawBuffers(Z)}function te(U){return m!==U?(i.useProgram(U),m=U,!0):!1}let et={[Fs]:i.FUNC_ADD,[Sm]:i.FUNC_SUBTRACT,[Tm]:i.FUNC_REVERSE_SUBTRACT};et[Am]=i.MIN,et[Rm]=i.MAX;let pt={[Cm]:i.ZERO,[Iu]:i.ONE,[Pm]:i.SRC_COLOR,[th]:i.SRC_ALPHA,[Nm]:i.SRC_ALPHA_SATURATE,[km]:i.DST_COLOR,[Lm]:i.DST_ALPHA,[Im]:i.ONE_MINUS_SRC_COLOR,[To]:i.ONE_MINUS_SRC_ALPHA,[Um]:i.ONE_MINUS_DST_COLOR,[Dm]:i.ONE_MINUS_DST_ALPHA,[Hm]:i.CONSTANT_COLOR,[Bm]:i.ONE_MINUS_CONSTANT_COLOR,[Fm]:i.CONSTANT_ALPHA,[Om]:i.ONE_MINUS_CONSTANT_ALPHA};function L(U,dt,Z,ot,Lt,Pt,ie,Ve,bn,we){if(U===ms){v===!0&&(At(i.BLEND),v=!1);return}if(v===!1&&(ut(i.BLEND),v=!0),U!==Pu){if(U!==g||we!==b){if((p!==Fs||y!==Fs)&&(i.blendEquation(i.FUNC_ADD),p=Fs,y=Fs),we)switch(U){case Tr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case xs:i.blendFunc(i.ONE,i.ONE);break;case Kd:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case $d:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Tr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case xs:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Kd:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case $d:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}x=null,_=null,I=null,T=null,S.set(0,0,0),P=0,g=U,b=we}return}Lt=Lt||dt,Pt=Pt||Z,ie=ie||ot,(dt!==p||Lt!==y)&&(i.blendEquationSeparate(et[dt],et[Lt]),p=dt,y=Lt),(Z!==x||ot!==_||Pt!==I||ie!==T)&&(i.blendFuncSeparate(pt[Z],pt[ot],pt[Pt],pt[ie]),x=Z,_=ot,I=Pt,T=ie),(Ve.equals(S)===!1||bn!==P)&&(i.blendColor(Ve.r,Ve.g,Ve.b,bn),S.copy(Ve),P=bn),g=U,b=!1}function Ft(U,dt){U.side===he?At(i.CULL_FACE):ut(i.CULL_FACE);let Z=U.side===Sn;dt&&(Z=!Z),st(Z),U.blending===Tr&&U.transparent===!1?L(ms):L(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);let ot=U.stencilWrite;a.setTest(ot),ot&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),zt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ut(i.SAMPLE_ALPHA_TO_COVERAGE):At(i.SAMPLE_ALPHA_TO_COVERAGE)}function st(U){M!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),M=U)}function It(U){U!==Em?(ut(i.CULL_FACE),U!==C&&(U===Zd?i.cullFace(i.BACK):U===wm?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):At(i.CULL_FACE),C=U}function xt(U){U!==k&&(H&&i.lineWidth(U),k=U)}function zt(U,dt,Z){U?(ut(i.POLYGON_OFFSET_FILL),(N!==dt||z!==Z)&&(i.polygonOffset(dt,Z),N=dt,z=Z)):At(i.POLYGON_OFFSET_FILL)}function St(U){U?ut(i.SCISSOR_TEST):At(i.SCISSOR_TEST)}function R(U){U===void 0&&(U=i.TEXTURE0+X-1),ct!==U&&(i.activeTexture(U),ct=U)}function E(U,dt,Z){Z===void 0&&(ct===null?Z=i.TEXTURE0+X-1:Z=ct);let ot=ht[Z];ot===void 0&&(ot={type:void 0,texture:void 0},ht[Z]=ot),(ot.type!==U||ot.texture!==dt)&&(ct!==Z&&(i.activeTexture(Z),ct=Z),i.bindTexture(U,dt||gt[U]),ot.type=U,ot.texture=dt)}function G(){let U=ht[ct];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function V(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function $(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function B(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function j(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function rt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function mt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ot(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function at(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Et(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Nt(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Gt(U){qt.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),qt.copy(U))}function Ct(U){K.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),K.copy(U))}function Q(U,dt){let Z=c.get(dt);Z===void 0&&(Z=new WeakMap,c.set(dt,Z));let ot=Z.get(U);ot===void 0&&(ot=i.getUniformBlockIndex(dt,U.name),Z.set(U,ot))}function vt(U,dt){let ot=c.get(dt).get(U);l.get(dt)!==ot&&(i.uniformBlockBinding(dt,ot,U.__bindingPointIndex),l.set(dt,ot))}function Mt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ct=null,ht={},u={},d=new WeakMap,f=[],m=null,v=!1,g=null,p=null,x=null,_=null,y=null,I=null,T=null,S=new Dt(0,0,0),P=0,b=!1,M=null,C=null,k=null,N=null,z=null,qt.set(0,0,i.canvas.width,i.canvas.height),K.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ut,disable:At,bindFramebuffer:Bt,drawBuffers:Zt,useProgram:te,setBlending:L,setMaterial:Ft,setFlipSided:st,setCullFace:It,setLineWidth:xt,setPolygonOffset:zt,setScissorTest:St,activeTexture:R,bindTexture:E,unbindTexture:G,compressedTexImage2D:V,compressedTexImage3D:$,texImage2D:Et,texImage3D:Nt,updateUBOMapping:Q,uniformBlockBinding:vt,texStorage2D:Ot,texStorage3D:at,texSubImage2D:B,texSubImage3D:j,compressedTexSubImage2D:rt,compressedTexSubImage3D:mt,scissor:Gt,viewport:Ct,reset:Mt}}function Zf(i,t,e,n){let s=h_(n);switch(e){case mp:return i*t;case vp:return i*t;case xp:return i*t*2;case Hu:return i*t/s.components*s.byteLength;case Bu:return i*t/s.components*s.byteLength;case yp:return i*t*2/s.components*s.byteLength;case Fu:return i*t*2/s.components*s.byteLength;case gp:return i*t*3/s.components*s.byteLength;case mi:return i*t*4/s.components*s.byteLength;case Ou:return i*t*4/s.components*s.byteLength;case La:case Da:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ka:case Ua:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case dh:case ph:return Math.max(i,16)*Math.max(t,8)/4;case uh:case fh:return Math.max(i,8)*Math.max(t,8)/2;case mh:case gh:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case vh:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case xh:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case yh:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case _h:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Mh:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case bh:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Eh:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case wh:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Sh:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Th:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Ah:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Rh:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Ch:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ph:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ih:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Na:case Lh:case Dh:return Math.ceil(i/4)*Math.ceil(t/4)*16;case _p:case kh:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Uh:case Nh:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function h_(i){switch(i){case $i:case dp:return{byteLength:1,components:1};case Ao:case fp:case _s:return{byteLength:2,components:1};case Uu:case Nu:return{byteLength:2,components:4};case Ws:case ku:case Ai:return{byteLength:4,components:1};case pp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function u_(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new nt,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(R,E){return f?new OffscreenCanvas(R,E):Fa("canvas")}function v(R,E,G){let V=1,$=St(R);if(($.width>G||$.height>G)&&(V=G/Math.max($.width,$.height)),V<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let B=Math.floor(V*$.width),j=Math.floor(V*$.height);u===void 0&&(u=m(B,j));let rt=E?m(B,j):u;return rt.width=B,rt.height=j,rt.getContext("2d").drawImage(R,0,0,B,j),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+B+"x"+j+")."),rt}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),R;return R}function g(R){return R.generateMipmaps}function p(R){i.generateMipmap(R)}function x(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function _(R,E,G,V,$=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let B=E;if(E===i.RED&&(G===i.FLOAT&&(B=i.R32F),G===i.HALF_FLOAT&&(B=i.R16F),G===i.UNSIGNED_BYTE&&(B=i.R8)),E===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(B=i.R8UI),G===i.UNSIGNED_SHORT&&(B=i.R16UI),G===i.UNSIGNED_INT&&(B=i.R32UI),G===i.BYTE&&(B=i.R8I),G===i.SHORT&&(B=i.R16I),G===i.INT&&(B=i.R32I)),E===i.RG&&(G===i.FLOAT&&(B=i.RG32F),G===i.HALF_FLOAT&&(B=i.RG16F),G===i.UNSIGNED_BYTE&&(B=i.RG8)),E===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(B=i.RG8UI),G===i.UNSIGNED_SHORT&&(B=i.RG16UI),G===i.UNSIGNED_INT&&(B=i.RG32UI),G===i.BYTE&&(B=i.RG8I),G===i.SHORT&&(B=i.RG16I),G===i.INT&&(B=i.RG32I)),E===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(B=i.RGB8UI),G===i.UNSIGNED_SHORT&&(B=i.RGB16UI),G===i.UNSIGNED_INT&&(B=i.RGB32UI),G===i.BYTE&&(B=i.RGB8I),G===i.SHORT&&(B=i.RGB16I),G===i.INT&&(B=i.RGB32I)),E===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(B=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(B=i.RGBA16UI),G===i.UNSIGNED_INT&&(B=i.RGBA32UI),G===i.BYTE&&(B=i.RGBA8I),G===i.SHORT&&(B=i.RGBA16I),G===i.INT&&(B=i.RGBA32I)),E===i.RGB&&G===i.UNSIGNED_INT_5_9_9_9_REV&&(B=i.RGB9_E5),E===i.RGBA){let j=$?hl:me.getTransfer(V);G===i.FLOAT&&(B=i.RGBA32F),G===i.HALF_FLOAT&&(B=i.RGBA16F),G===i.UNSIGNED_BYTE&&(B=j===Te?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(B=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(B=i.RGB5_A1)}return(B===i.R16F||B===i.R32F||B===i.RG16F||B===i.RG32F||B===i.RGBA16F||B===i.RGBA32F)&&t.get("EXT_color_buffer_float"),B}function y(R,E){let G;return R?E===null||E===Ws||E===Dr?G=i.DEPTH24_STENCIL8:E===Ai?G=i.DEPTH32F_STENCIL8:E===Ao&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Ws||E===Dr?G=i.DEPTH_COMPONENT24:E===Ai?G=i.DEPTH_COMPONENT32F:E===Ao&&(G=i.DEPTH_COMPONENT16),G}function I(R,E){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==Un&&R.minFilter!==Jn?Math.log2(Math.max(E.width,E.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?E.mipmaps.length:1}function T(R){let E=R.target;E.removeEventListener("dispose",T),P(E),E.isVideoTexture&&h.delete(E)}function S(R){let E=R.target;E.removeEventListener("dispose",S),M(E)}function P(R){let E=n.get(R);if(E.__webglInit===void 0)return;let G=R.source,V=d.get(G);if(V){let $=V[E.__cacheKey];$.usedTimes--,$.usedTimes===0&&b(R),Object.keys(V).length===0&&d.delete(G)}n.remove(R)}function b(R){let E=n.get(R);i.deleteTexture(E.__webglTexture);let G=R.source,V=d.get(G);delete V[E.__cacheKey],o.memory.textures--}function M(R){let E=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(E.__webglFramebuffer[V]))for(let $=0;$<E.__webglFramebuffer[V].length;$++)i.deleteFramebuffer(E.__webglFramebuffer[V][$]);else i.deleteFramebuffer(E.__webglFramebuffer[V]);E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer[V])}else{if(Array.isArray(E.__webglFramebuffer))for(let V=0;V<E.__webglFramebuffer.length;V++)i.deleteFramebuffer(E.__webglFramebuffer[V]);else i.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&i.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let V=0;V<E.__webglColorRenderbuffer.length;V++)E.__webglColorRenderbuffer[V]&&i.deleteRenderbuffer(E.__webglColorRenderbuffer[V]);E.__webglDepthRenderbuffer&&i.deleteRenderbuffer(E.__webglDepthRenderbuffer)}let G=R.textures;for(let V=0,$=G.length;V<$;V++){let B=n.get(G[V]);B.__webglTexture&&(i.deleteTexture(B.__webglTexture),o.memory.textures--),n.remove(G[V])}n.remove(R)}let C=0;function k(){C=0}function N(){let R=C;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),C+=1,R}function z(R){let E=[];return E.push(R.wrapS),E.push(R.wrapT),E.push(R.wrapR||0),E.push(R.magFilter),E.push(R.minFilter),E.push(R.anisotropy),E.push(R.internalFormat),E.push(R.format),E.push(R.type),E.push(R.generateMipmaps),E.push(R.premultiplyAlpha),E.push(R.flipY),E.push(R.unpackAlignment),E.push(R.colorSpace),E.join()}function X(R,E){let G=n.get(R);if(R.isVideoTexture&&xt(R),R.isRenderTargetTexture===!1&&R.version>0&&G.__version!==R.version){let V=R.image;if(V===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(G,R,E);return}}e.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+E)}function H(R,E){let G=n.get(R);if(R.version>0&&G.__version!==R.version){K(G,R,E);return}e.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+E)}function J(R,E){let G=n.get(R);if(R.version>0&&G.__version!==R.version){K(G,R,E);return}e.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+E)}function W(R,E){let G=n.get(R);if(R.version>0&&G.__version!==R.version){it(G,R,E);return}e.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+E)}let ct={[Ki]:i.REPEAT,[Gs]:i.CLAMP_TO_EDGE,[hh]:i.MIRRORED_REPEAT},ht={[Un]:i.NEAREST,[Km]:i.NEAREST_MIPMAP_NEAREST,[na]:i.NEAREST_MIPMAP_LINEAR,[Jn]:i.LINEAR,[_c]:i.LINEAR_MIPMAP_NEAREST,[Vs]:i.LINEAR_MIPMAP_LINEAR},ft={[Qm]:i.NEVER,[rg]:i.ALWAYS,[tg]:i.LESS,[Mp]:i.LEQUAL,[eg]:i.EQUAL,[sg]:i.GEQUAL,[ng]:i.GREATER,[ig]:i.NOTEQUAL};function Ut(R,E){if(E.type===Ai&&t.has("OES_texture_float_linear")===!1&&(E.magFilter===Jn||E.magFilter===_c||E.magFilter===na||E.magFilter===Vs||E.minFilter===Jn||E.minFilter===_c||E.minFilter===na||E.minFilter===Vs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,ct[E.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,ct[E.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,ct[E.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,ht[E.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,ht[E.minFilter]),E.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,ft[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Un||E.minFilter!==na&&E.minFilter!==Vs||E.type===Ai&&t.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){let G=t.get("EXT_texture_filter_anisotropic");i.texParameterf(R,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function qt(R,E){let G=!1;R.__webglInit===void 0&&(R.__webglInit=!0,E.addEventListener("dispose",T));let V=E.source,$=d.get(V);$===void 0&&($={},d.set(V,$));let B=z(E);if(B!==R.__cacheKey){$[B]===void 0&&($[B]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,G=!0),$[B].usedTimes++;let j=$[R.__cacheKey];j!==void 0&&($[R.__cacheKey].usedTimes--,j.usedTimes===0&&b(E)),R.__cacheKey=B,R.__webglTexture=$[B].texture}return G}function K(R,E,G){let V=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(V=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(V=i.TEXTURE_3D);let $=qt(R,E),B=E.source;e.bindTexture(V,R.__webglTexture,i.TEXTURE0+G);let j=n.get(B);if(B.version!==j.__version||$===!0){e.activeTexture(i.TEXTURE0+G);let rt=me.getPrimaries(me.workingColorSpace),mt=E.colorSpace===ps?null:me.getPrimaries(E.colorSpace),Ot=E.colorSpace===ps||rt===mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ot);let at=v(E.image,!1,s.maxTextureSize);at=zt(E,at);let Et=r.convert(E.format,E.colorSpace),Nt=r.convert(E.type),Gt=_(E.internalFormat,Et,Nt,E.colorSpace,E.isVideoTexture);Ut(V,E);let Ct,Q=E.mipmaps,vt=E.isVideoTexture!==!0,Mt=j.__version===void 0||$===!0,U=B.dataReady,dt=I(E,at);if(E.isDepthTexture)Gt=y(E.format===kr,E.type),Mt&&(vt?e.texStorage2D(i.TEXTURE_2D,1,Gt,at.width,at.height):e.texImage2D(i.TEXTURE_2D,0,Gt,at.width,at.height,0,Et,Nt,null));else if(E.isDataTexture)if(Q.length>0){vt&&Mt&&e.texStorage2D(i.TEXTURE_2D,dt,Gt,Q[0].width,Q[0].height);for(let Z=0,ot=Q.length;Z<ot;Z++)Ct=Q[Z],vt?U&&e.texSubImage2D(i.TEXTURE_2D,Z,0,0,Ct.width,Ct.height,Et,Nt,Ct.data):e.texImage2D(i.TEXTURE_2D,Z,Gt,Ct.width,Ct.height,0,Et,Nt,Ct.data);E.generateMipmaps=!1}else vt?(Mt&&e.texStorage2D(i.TEXTURE_2D,dt,Gt,at.width,at.height),U&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,at.width,at.height,Et,Nt,at.data)):e.texImage2D(i.TEXTURE_2D,0,Gt,at.width,at.height,0,Et,Nt,at.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){vt&&Mt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,dt,Gt,Q[0].width,Q[0].height,at.depth);for(let Z=0,ot=Q.length;Z<ot;Z++)if(Ct=Q[Z],E.format!==mi)if(Et!==null)if(vt){if(U)if(E.layerUpdates.size>0){let Lt=Zf(Ct.width,Ct.height,E.format,E.type);for(let Pt of E.layerUpdates){let ie=Ct.data.subarray(Pt*Lt/Ct.data.BYTES_PER_ELEMENT,(Pt+1)*Lt/Ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,Pt,Ct.width,Ct.height,1,Et,ie)}E.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,Ct.width,Ct.height,at.depth,Et,Ct.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Z,Gt,Ct.width,Ct.height,at.depth,0,Ct.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else vt?U&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,Ct.width,Ct.height,at.depth,Et,Nt,Ct.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Z,Gt,Ct.width,Ct.height,at.depth,0,Et,Nt,Ct.data)}else{vt&&Mt&&e.texStorage2D(i.TEXTURE_2D,dt,Gt,Q[0].width,Q[0].height);for(let Z=0,ot=Q.length;Z<ot;Z++)Ct=Q[Z],E.format!==mi?Et!==null?vt?U&&e.compressedTexSubImage2D(i.TEXTURE_2D,Z,0,0,Ct.width,Ct.height,Et,Ct.data):e.compressedTexImage2D(i.TEXTURE_2D,Z,Gt,Ct.width,Ct.height,0,Ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):vt?U&&e.texSubImage2D(i.TEXTURE_2D,Z,0,0,Ct.width,Ct.height,Et,Nt,Ct.data):e.texImage2D(i.TEXTURE_2D,Z,Gt,Ct.width,Ct.height,0,Et,Nt,Ct.data)}else if(E.isDataArrayTexture)if(vt){if(Mt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,dt,Gt,at.width,at.height,at.depth),U)if(E.layerUpdates.size>0){let Z=Zf(at.width,at.height,E.format,E.type);for(let ot of E.layerUpdates){let Lt=at.data.subarray(ot*Z/at.data.BYTES_PER_ELEMENT,(ot+1)*Z/at.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ot,at.width,at.height,1,Et,Nt,Lt)}E.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,at.width,at.height,at.depth,Et,Nt,at.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Gt,at.width,at.height,at.depth,0,Et,Nt,at.data);else if(E.isData3DTexture)vt?(Mt&&e.texStorage3D(i.TEXTURE_3D,dt,Gt,at.width,at.height,at.depth),U&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,at.width,at.height,at.depth,Et,Nt,at.data)):e.texImage3D(i.TEXTURE_3D,0,Gt,at.width,at.height,at.depth,0,Et,Nt,at.data);else if(E.isFramebufferTexture){if(Mt)if(vt)e.texStorage2D(i.TEXTURE_2D,dt,Gt,at.width,at.height);else{let Z=at.width,ot=at.height;for(let Lt=0;Lt<dt;Lt++)e.texImage2D(i.TEXTURE_2D,Lt,Gt,Z,ot,0,Et,Nt,null),Z>>=1,ot>>=1}}else if(Q.length>0){if(vt&&Mt){let Z=St(Q[0]);e.texStorage2D(i.TEXTURE_2D,dt,Gt,Z.width,Z.height)}for(let Z=0,ot=Q.length;Z<ot;Z++)Ct=Q[Z],vt?U&&e.texSubImage2D(i.TEXTURE_2D,Z,0,0,Et,Nt,Ct):e.texImage2D(i.TEXTURE_2D,Z,Gt,Et,Nt,Ct);E.generateMipmaps=!1}else if(vt){if(Mt){let Z=St(at);e.texStorage2D(i.TEXTURE_2D,dt,Gt,Z.width,Z.height)}U&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Et,Nt,at)}else e.texImage2D(i.TEXTURE_2D,0,Gt,Et,Nt,at);g(E)&&p(V),j.__version=B.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function it(R,E,G){if(E.image.length!==6)return;let V=qt(R,E),$=E.source;e.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+G);let B=n.get($);if($.version!==B.__version||V===!0){e.activeTexture(i.TEXTURE0+G);let j=me.getPrimaries(me.workingColorSpace),rt=E.colorSpace===ps?null:me.getPrimaries(E.colorSpace),mt=E.colorSpace===ps||j===rt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,mt);let Ot=E.isCompressedTexture||E.image[0].isCompressedTexture,at=E.image[0]&&E.image[0].isDataTexture,Et=[];for(let ot=0;ot<6;ot++)!Ot&&!at?Et[ot]=v(E.image[ot],!0,s.maxCubemapSize):Et[ot]=at?E.image[ot].image:E.image[ot],Et[ot]=zt(E,Et[ot]);let Nt=Et[0],Gt=r.convert(E.format,E.colorSpace),Ct=r.convert(E.type),Q=_(E.internalFormat,Gt,Ct,E.colorSpace),vt=E.isVideoTexture!==!0,Mt=B.__version===void 0||V===!0,U=$.dataReady,dt=I(E,Nt);Ut(i.TEXTURE_CUBE_MAP,E);let Z;if(Ot){vt&&Mt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,Q,Nt.width,Nt.height);for(let ot=0;ot<6;ot++){Z=Et[ot].mipmaps;for(let Lt=0;Lt<Z.length;Lt++){let Pt=Z[Lt];E.format!==mi?Gt!==null?vt?U&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Lt,0,0,Pt.width,Pt.height,Gt,Pt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Lt,Q,Pt.width,Pt.height,0,Pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):vt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Lt,0,0,Pt.width,Pt.height,Gt,Ct,Pt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Lt,Q,Pt.width,Pt.height,0,Gt,Ct,Pt.data)}}}else{if(Z=E.mipmaps,vt&&Mt){Z.length>0&&dt++;let ot=St(Et[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,Q,ot.width,ot.height)}for(let ot=0;ot<6;ot++)if(at){vt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,Et[ot].width,Et[ot].height,Gt,Ct,Et[ot].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Q,Et[ot].width,Et[ot].height,0,Gt,Ct,Et[ot].data);for(let Lt=0;Lt<Z.length;Lt++){let ie=Z[Lt].image[ot].image;vt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Lt+1,0,0,ie.width,ie.height,Gt,Ct,ie.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Lt+1,Q,ie.width,ie.height,0,Gt,Ct,ie.data)}}else{vt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,0,0,Gt,Ct,Et[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0,Q,Gt,Ct,Et[ot]);for(let Lt=0;Lt<Z.length;Lt++){let Pt=Z[Lt];vt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Lt+1,0,0,Gt,Ct,Pt.image[ot]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,Lt+1,Q,Gt,Ct,Pt.image[ot])}}}g(E)&&p(i.TEXTURE_CUBE_MAP),B.__version=$.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function gt(R,E,G,V,$,B){let j=r.convert(G.format,G.colorSpace),rt=r.convert(G.type),mt=_(G.internalFormat,j,rt,G.colorSpace),Ot=n.get(E),at=n.get(G);if(at.__renderTarget=E,!Ot.__hasExternalTextures){let Et=Math.max(1,E.width>>B),Nt=Math.max(1,E.height>>B);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?e.texImage3D($,B,mt,Et,Nt,E.depth,0,j,rt,null):e.texImage2D($,B,mt,Et,Nt,0,j,rt,null)}e.bindFramebuffer(i.FRAMEBUFFER,R),It(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,V,$,at.__webglTexture,0,st(E)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,V,$,at.__webglTexture,B),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ut(R,E,G){if(i.bindRenderbuffer(i.RENDERBUFFER,R),E.depthBuffer){let V=E.depthTexture,$=V&&V.isDepthTexture?V.type:null,B=y(E.stencilBuffer,$),j=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=st(E);It(E)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,rt,B,E.width,E.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,rt,B,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,B,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,R)}else{let V=E.textures;for(let $=0;$<V.length;$++){let B=V[$],j=r.convert(B.format,B.colorSpace),rt=r.convert(B.type),mt=_(B.internalFormat,j,rt,B.colorSpace),Ot=st(E);G&&It(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ot,mt,E.width,E.height):It(E)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ot,mt,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,mt,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function At(R,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,R),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let V=n.get(E.depthTexture);V.__renderTarget=E,(!V.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),X(E.depthTexture,0);let $=V.__webglTexture,B=st(E);if(E.depthTexture.format===Ar)It(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0,B):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0);else if(E.depthTexture.format===kr)It(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0,B):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function Bt(R){let E=n.get(R),G=R.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==R.depthTexture){let V=R.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),V){let $=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,V.removeEventListener("dispose",$)};V.addEventListener("dispose",$),E.__depthDisposeCallback=$}E.__boundDepthTexture=V}if(R.depthTexture&&!E.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");At(E.__webglFramebuffer,R)}else if(G){E.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(e.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[V]),E.__webglDepthbuffer[V]===void 0)E.__webglDepthbuffer[V]=i.createRenderbuffer(),ut(E.__webglDepthbuffer[V],R,!1);else{let $=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,B=E.__webglDepthbuffer[V];i.bindRenderbuffer(i.RENDERBUFFER,B),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,B)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=i.createRenderbuffer(),ut(E.__webglDepthbuffer,R,!1);else{let V=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=E.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,V,i.RENDERBUFFER,$)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Zt(R,E,G){let V=n.get(R);E!==void 0&&gt(V.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&Bt(R)}function te(R){let E=R.texture,G=n.get(R),V=n.get(E);R.addEventListener("dispose",S);let $=R.textures,B=R.isWebGLCubeRenderTarget===!0,j=$.length>1;if(j||(V.__webglTexture===void 0&&(V.__webglTexture=i.createTexture()),V.__version=E.version,o.memory.textures++),B){G.__webglFramebuffer=[];for(let rt=0;rt<6;rt++)if(E.mipmaps&&E.mipmaps.length>0){G.__webglFramebuffer[rt]=[];for(let mt=0;mt<E.mipmaps.length;mt++)G.__webglFramebuffer[rt][mt]=i.createFramebuffer()}else G.__webglFramebuffer[rt]=i.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){G.__webglFramebuffer=[];for(let rt=0;rt<E.mipmaps.length;rt++)G.__webglFramebuffer[rt]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(j)for(let rt=0,mt=$.length;rt<mt;rt++){let Ot=n.get($[rt]);Ot.__webglTexture===void 0&&(Ot.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&It(R)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let rt=0;rt<$.length;rt++){let mt=$[rt];G.__webglColorRenderbuffer[rt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[rt]);let Ot=r.convert(mt.format,mt.colorSpace),at=r.convert(mt.type),Et=_(mt.internalFormat,Ot,at,mt.colorSpace,R.isXRRenderTarget===!0),Nt=st(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Nt,Et,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+rt,i.RENDERBUFFER,G.__webglColorRenderbuffer[rt])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),ut(G.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(B){e.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture),Ut(i.TEXTURE_CUBE_MAP,E);for(let rt=0;rt<6;rt++)if(E.mipmaps&&E.mipmaps.length>0)for(let mt=0;mt<E.mipmaps.length;mt++)gt(G.__webglFramebuffer[rt][mt],R,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,mt);else gt(G.__webglFramebuffer[rt],R,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0);g(E)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(j){for(let rt=0,mt=$.length;rt<mt;rt++){let Ot=$[rt],at=n.get(Ot);e.bindTexture(i.TEXTURE_2D,at.__webglTexture),Ut(i.TEXTURE_2D,Ot),gt(G.__webglFramebuffer,R,Ot,i.COLOR_ATTACHMENT0+rt,i.TEXTURE_2D,0),g(Ot)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let rt=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(rt=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(rt,V.__webglTexture),Ut(rt,E),E.mipmaps&&E.mipmaps.length>0)for(let mt=0;mt<E.mipmaps.length;mt++)gt(G.__webglFramebuffer[mt],R,E,i.COLOR_ATTACHMENT0,rt,mt);else gt(G.__webglFramebuffer,R,E,i.COLOR_ATTACHMENT0,rt,0);g(E)&&p(rt),e.unbindTexture()}R.depthBuffer&&Bt(R)}function et(R){let E=R.textures;for(let G=0,V=E.length;G<V;G++){let $=E[G];if(g($)){let B=x(R),j=n.get($).__webglTexture;e.bindTexture(B,j),p(B),e.unbindTexture()}}}let pt=[],L=[];function Ft(R){if(R.samples>0){if(It(R)===!1){let E=R.textures,G=R.width,V=R.height,$=i.COLOR_BUFFER_BIT,B=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=n.get(R),rt=E.length>1;if(rt)for(let mt=0;mt<E.length;mt++)e.bindFramebuffer(i.FRAMEBUFFER,j.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,j.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,j.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,j.__webglFramebuffer);for(let mt=0;mt<E.length;mt++){if(R.resolveDepthBuffer&&(R.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),rt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,j.__webglColorRenderbuffer[mt]);let Ot=n.get(E[mt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ot,0)}i.blitFramebuffer(0,0,G,V,0,0,G,V,$,i.NEAREST),l===!0&&(pt.length=0,L.length=0,pt.push(i.COLOR_ATTACHMENT0+mt),R.depthBuffer&&R.resolveDepthBuffer===!1&&(pt.push(B),L.push(B),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,L)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,pt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),rt)for(let mt=0;mt<E.length;mt++){e.bindFramebuffer(i.FRAMEBUFFER,j.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.RENDERBUFFER,j.__webglColorRenderbuffer[mt]);let Ot=n.get(E[mt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,j.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.TEXTURE_2D,Ot,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,j.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let E=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[E])}}}function st(R){return Math.min(s.maxSamples,R.samples)}function It(R){let E=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function xt(R){let E=o.render.frame;h.get(R)!==E&&(h.set(R,E),R.update())}function zt(R,E){let G=R.colorSpace,V=R.format,$=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||G!==Wr&&G!==ps&&(me.getTransfer(G)===Te?(V!==mi||$!==$i)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),E}function St(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=N,this.resetTextureUnits=k,this.setTexture2D=X,this.setTexture2DArray=H,this.setTexture3D=J,this.setTextureCube=W,this.rebindTextures=Zt,this.setupRenderTarget=te,this.updateRenderTargetMipmap=et,this.updateMultisampleRenderTarget=Ft,this.setupDepthRenderbuffer=Bt,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=It}function d_(i,t){function e(n,s=ps){let r,o=me.getTransfer(s);if(n===$i)return i.UNSIGNED_BYTE;if(n===Uu)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Nu)return i.UNSIGNED_SHORT_5_5_5_1;if(n===pp)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===dp)return i.BYTE;if(n===fp)return i.SHORT;if(n===Ao)return i.UNSIGNED_SHORT;if(n===ku)return i.INT;if(n===Ws)return i.UNSIGNED_INT;if(n===Ai)return i.FLOAT;if(n===_s)return i.HALF_FLOAT;if(n===mp)return i.ALPHA;if(n===gp)return i.RGB;if(n===mi)return i.RGBA;if(n===vp)return i.LUMINANCE;if(n===xp)return i.LUMINANCE_ALPHA;if(n===Ar)return i.DEPTH_COMPONENT;if(n===kr)return i.DEPTH_STENCIL;if(n===Hu)return i.RED;if(n===Bu)return i.RED_INTEGER;if(n===yp)return i.RG;if(n===Fu)return i.RG_INTEGER;if(n===Ou)return i.RGBA_INTEGER;if(n===La||n===Da||n===ka||n===Ua)if(o===Te)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===La)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Da)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ka)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ua)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===La)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Da)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ka)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ua)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===uh||n===dh||n===fh||n===ph)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===uh)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===dh)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===fh)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ph)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===mh||n===gh||n===vh)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===mh||n===gh)return o===Te?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===vh)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===xh||n===yh||n===_h||n===Mh||n===bh||n===Eh||n===wh||n===Sh||n===Th||n===Ah||n===Rh||n===Ch||n===Ph||n===Ih)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===xh)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===yh)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===_h)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Mh)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===bh)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Eh)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===wh)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Sh)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Th)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ah)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Rh)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ch)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ph)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ih)return o===Te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Na||n===Lh||n===Dh)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Na)return o===Te?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Lh)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Dh)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===_p||n===kh||n===Uh||n===Nh)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Na)return r.COMPRESSED_RED_RGTC1_EXT;if(n===kh)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Uh)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Nh)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Dr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var Jh=class extends je{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},wt=class extends on{constructor(){super(),this.isGroup=!0,this.type="Group"}},f_={type:"move"},Eo=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new wt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new wt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new wt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let v of t.hand.values()){let g=e.getJointPose(v,n),p=this._getHandJoint(c,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(f_)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new wt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},p_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,m_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,jh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){let s=new Nn,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Ye({vertexShader:p_,fragmentShader:m_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new D(new fe(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Qh=class extends ys{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null,v=new jh,g=e.getContextAttributes(),p=null,x=null,_=[],y=[],I=new nt,T=null,S=new je;S.viewport=new Ae;let P=new je;P.viewport=new Ae;let b=[S,P],M=new Jh,C=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let it=_[K];return it===void 0&&(it=new Eo,_[K]=it),it.getTargetRaySpace()},this.getControllerGrip=function(K){let it=_[K];return it===void 0&&(it=new Eo,_[K]=it),it.getGripSpace()},this.getHand=function(K){let it=_[K];return it===void 0&&(it=new Eo,_[K]=it),it.getHandSpace()};function N(K){let it=y.indexOf(K.inputSource);if(it===-1)return;let gt=_[it];gt!==void 0&&(gt.update(K.inputSource,K.frame,c||o),gt.dispatchEvent({type:K.type,data:K.inputSource}))}function z(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",X);for(let K=0;K<_.length;K++){let it=y[K];it!==null&&(y[K]=null,_[K].disconnect(it))}C=null,k=null,v.reset(),t.setRenderTarget(p),f=null,d=null,u=null,s=null,x=null,qt.stop(),n.isPresenting=!1,t.setPixelRatio(T),t.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){a=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",z),s.addEventListener("inputsourceschange",X),g.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(I),s.renderState.layers===void 0){let it={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,it),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new ei(f.framebufferWidth,f.framebufferHeight,{format:mi,type:$i,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let it=null,gt=null,ut=null;g.depth&&(ut=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,it=g.stencil?kr:Ar,gt=g.stencil?Dr:Ws);let At={colorFormat:e.RGBA8,depthFormat:ut,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(At),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new ei(d.textureWidth,d.textureHeight,{format:mi,type:$i,depthTexture:new Ya(d.textureWidth,d.textureHeight,gt,void 0,void 0,void 0,void 0,void 0,void 0,it),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),qt.setContext(s),qt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function X(K){for(let it=0;it<K.removed.length;it++){let gt=K.removed[it],ut=y.indexOf(gt);ut>=0&&(y[ut]=null,_[ut].disconnect(gt))}for(let it=0;it<K.added.length;it++){let gt=K.added[it],ut=y.indexOf(gt);if(ut===-1){for(let Bt=0;Bt<_.length;Bt++)if(Bt>=y.length){y.push(gt),ut=Bt;break}else if(y[Bt]===null){y[Bt]=gt,ut=Bt;break}if(ut===-1)break}let At=_[ut];At&&At.connect(gt)}}let H=new A,J=new A;function W(K,it,gt){H.setFromMatrixPosition(it.matrixWorld),J.setFromMatrixPosition(gt.matrixWorld);let ut=H.distanceTo(J),At=it.projectionMatrix.elements,Bt=gt.projectionMatrix.elements,Zt=At[14]/(At[10]-1),te=At[14]/(At[10]+1),et=(At[9]+1)/At[5],pt=(At[9]-1)/At[5],L=(At[8]-1)/At[0],Ft=(Bt[8]+1)/Bt[0],st=Zt*L,It=Zt*Ft,xt=ut/(-L+Ft),zt=xt*-L;if(it.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(zt),K.translateZ(xt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),At[10]===-1)K.projectionMatrix.copy(it.projectionMatrix),K.projectionMatrixInverse.copy(it.projectionMatrixInverse);else{let St=Zt+xt,R=te+xt,E=st-zt,G=It+(ut-zt),V=et*te/R*St,$=pt*te/R*St;K.projectionMatrix.makePerspective(E,G,V,$,St,R),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function ct(K,it){it===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(it.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let it=K.near,gt=K.far;v.texture!==null&&(v.depthNear>0&&(it=v.depthNear),v.depthFar>0&&(gt=v.depthFar)),M.near=P.near=S.near=it,M.far=P.far=S.far=gt,(C!==M.near||k!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),C=M.near,k=M.far),S.layers.mask=K.layers.mask|2,P.layers.mask=K.layers.mask|4,M.layers.mask=S.layers.mask|P.layers.mask;let ut=K.parent,At=M.cameras;ct(M,ut);for(let Bt=0;Bt<At.length;Bt++)ct(At[Bt],ut);At.length===2?W(M,S,P):M.projectionMatrix.copy(S.projectionMatrix),ht(K,M,ut)};function ht(K,it,gt){gt===null?K.matrix.copy(it.matrixWorld):(K.matrix.copy(gt.matrixWorld),K.matrix.invert(),K.matrix.multiply(it.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(it.projectionMatrix),K.projectionMatrixInverse.copy(it.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Ur*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(K){l=K,d!==null&&(d.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let ft=null;function Ut(K,it){if(h=it.getViewerPose(c||o),m=it,h!==null){let gt=h.views;f!==null&&(t.setRenderTargetFramebuffer(x,f.framebuffer),t.setRenderTarget(x));let ut=!1;gt.length!==M.cameras.length&&(M.cameras.length=0,ut=!0);for(let Bt=0;Bt<gt.length;Bt++){let Zt=gt[Bt],te=null;if(f!==null)te=f.getViewport(Zt);else{let pt=u.getViewSubImage(d,Zt);te=pt.viewport,Bt===0&&(t.setRenderTargetTextures(x,pt.colorTexture,d.ignoreDepthValues?void 0:pt.depthStencilTexture),t.setRenderTarget(x))}let et=b[Bt];et===void 0&&(et=new je,et.layers.enable(Bt),et.viewport=new Ae,b[Bt]=et),et.matrix.fromArray(Zt.transform.matrix),et.matrix.decompose(et.position,et.quaternion,et.scale),et.projectionMatrix.fromArray(Zt.projectionMatrix),et.projectionMatrixInverse.copy(et.projectionMatrix).invert(),et.viewport.set(te.x,te.y,te.width,te.height),Bt===0&&(M.matrix.copy(et.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ut===!0&&M.cameras.push(et)}let At=s.enabledFeatures;if(At&&At.includes("depth-sensing")){let Bt=u.getDepthInformation(gt[0]);Bt&&Bt.isValid&&Bt.texture&&v.init(t,Bt,s.renderState)}}for(let gt=0;gt<_.length;gt++){let ut=y[gt],At=_[gt];ut!==null&&At!==void 0&&At.update(ut,it,c||o)}ft&&ft(K,it),it.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:it}),m=null}let qt=new Tp;qt.setAnimationLoop(Ut),this.setAnimationLoop=function(K){ft=K},this.dispose=function(){}}},Hs=new vn,g_=new jt;function v_(i,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Sp(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,x,_,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,y)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),v(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?l(g,p,x,_):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Sn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Sn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let x=t.get(p),_=x.envMap,y=x.envMapRotation;_&&(g.envMap.value=_,Hs.copy(y),Hs.x*=-1,Hs.y*=-1,Hs.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Hs.y*=-1,Hs.z*=-1),g.envMapRotation.value.setFromMatrix4(g_.makeRotationFromEuler(Hs)),g.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,x,_){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*x,g.scale.value=_*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,x){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Sn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=x.texture,g.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){let x=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(x.matrixWorld),g.nearDistance.value=x.shadow.camera.near,g.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function x_(i,t,e,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,_){let y=_.program;n.uniformBlockBinding(x,y)}function c(x,_){let y=s[x.id];y===void 0&&(m(x),y=h(x),s[x.id]=y,x.addEventListener("dispose",g));let I=_.program;n.updateUBOMapping(x,I);let T=t.render.frame;r[x.id]!==T&&(d(x),r[x.id]=T)}function h(x){let _=u();x.__bindingPointIndex=_;let y=i.createBuffer(),I=x.__size,T=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,I,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,y),y}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){let _=s[x.id],y=x.uniforms,I=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let T=0,S=y.length;T<S;T++){let P=Array.isArray(y[T])?y[T]:[y[T]];for(let b=0,M=P.length;b<M;b++){let C=P[b];if(f(C,T,b,I)===!0){let k=C.__offset,N=Array.isArray(C.value)?C.value:[C.value],z=0;for(let X=0;X<N.length;X++){let H=N[X],J=v(H);typeof H=="number"||typeof H=="boolean"?(C.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,k+z,C.__data)):H.isMatrix3?(C.__data[0]=H.elements[0],C.__data[1]=H.elements[1],C.__data[2]=H.elements[2],C.__data[3]=0,C.__data[4]=H.elements[3],C.__data[5]=H.elements[4],C.__data[6]=H.elements[5],C.__data[7]=0,C.__data[8]=H.elements[6],C.__data[9]=H.elements[7],C.__data[10]=H.elements[8],C.__data[11]=0):(H.toArray(C.__data,z),z+=J.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,k,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(x,_,y,I){let T=x.value,S=_+"_"+y;if(I[S]===void 0)return typeof T=="number"||typeof T=="boolean"?I[S]=T:I[S]=T.clone(),!0;{let P=I[S];if(typeof T=="number"||typeof T=="boolean"){if(P!==T)return I[S]=T,!0}else if(P.equals(T)===!1)return P.copy(T),!0}return!1}function m(x){let _=x.uniforms,y=0,I=16;for(let S=0,P=_.length;S<P;S++){let b=Array.isArray(_[S])?_[S]:[_[S]];for(let M=0,C=b.length;M<C;M++){let k=b[M],N=Array.isArray(k.value)?k.value:[k.value];for(let z=0,X=N.length;z<X;z++){let H=N[z],J=v(H),W=y%I,ct=W%J.boundary,ht=W+ct;y+=ct,ht!==0&&I-ht<J.storage&&(y+=I-ht),k.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=y,y+=J.storage}}}let T=y%I;return T>0&&(y+=I-T),x.__size=y,x.__cache={},this}function v(x){let _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=48,_.storage=48):x.isMatrix4?(_.boundary=64,_.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),_}function g(x){let _=x.target;_.removeEventListener("dispose",g);let y=o.indexOf(_.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function p(){for(let x in s)i.deleteBuffer(s[x]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}var Za=class{constructor(t={}){let{canvas:e=bg(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let m=new Uint32Array(4),v=new Int32Array(4),g=null,p=null,x=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ce,this.toneMapping=gs,this.toneMappingExposure=1;let y=this,I=!1,T=0,S=0,P=null,b=-1,M=null,C=new Ae,k=new Ae,N=null,z=new Dt(0),X=0,H=e.width,J=e.height,W=1,ct=null,ht=null,ft=new Ae(0,0,H,J),Ut=new Ae(0,0,H,J),qt=!1,K=new Co,it=!1,gt=!1,ut=new jt,At=new jt,Bt=new A,Zt=new Ae,te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},et=!1;function pt(){return P===null?W:1}let L=n;function Ft(w,F){return e.getContext(w,F)}try{let w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ru}`),e.addEventListener("webglcontextlost",ot,!1),e.addEventListener("webglcontextrestored",Lt,!1),e.addEventListener("webglcontextcreationerror",Pt,!1),L===null){let F="webgl2";if(L=Ft(F,w),L===null)throw Ft(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let st,It,xt,zt,St,R,E,G,V,$,B,j,rt,mt,Ot,at,Et,Nt,Gt,Ct,Q,vt,Mt,U;function dt(){st=new ky(L),st.init(),vt=new d_(L,st),It=new Ry(L,st,t,vt),xt=new c_(L,st),It.reverseDepthBuffer&&d&&xt.buffers.depth.setReversed(!0),zt=new Hy(L),St=new $1,R=new u_(L,st,xt,St,It,vt,zt),E=new Py(y),G=new Dy(y),V=new Wg(L),Mt=new Ty(L,V),$=new Uy(L,V,zt,Mt),B=new Fy(L,$,V,zt),Gt=new By(L,It,R),at=new Cy(St),j=new K1(y,E,G,st,It,Mt,at),rt=new v_(y,St),mt=new j1,Ot=new s_(st),Nt=new Sy(y,E,G,xt,B,f,l),Et=new a_(y,B,It),U=new x_(L,zt,It,xt),Ct=new Ay(L,st,zt),Q=new Ny(L,st,zt),zt.programs=j.programs,y.capabilities=It,y.extensions=st,y.properties=St,y.renderLists=mt,y.shadowMap=Et,y.state=xt,y.info=zt}dt();let Z=new Qh(y,L);this.xr=Z,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let w=st.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=st.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(w){w!==void 0&&(W=w,this.setSize(H,J,!1))},this.getSize=function(w){return w.set(H,J)},this.setSize=function(w,F,q=!0){if(Z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=w,J=F,e.width=Math.floor(w*W),e.height=Math.floor(F*W),q===!0&&(e.style.width=w+"px",e.style.height=F+"px"),this.setViewport(0,0,w,F)},this.getDrawingBufferSize=function(w){return w.set(H*W,J*W).floor()},this.setDrawingBufferSize=function(w,F,q){H=w,J=F,W=q,e.width=Math.floor(w*q),e.height=Math.floor(F*q),this.setViewport(0,0,w,F)},this.getCurrentViewport=function(w){return w.copy(C)},this.getViewport=function(w){return w.copy(ft)},this.setViewport=function(w,F,q,Y){w.isVector4?ft.set(w.x,w.y,w.z,w.w):ft.set(w,F,q,Y),xt.viewport(C.copy(ft).multiplyScalar(W).round())},this.getScissor=function(w){return w.copy(Ut)},this.setScissor=function(w,F,q,Y){w.isVector4?Ut.set(w.x,w.y,w.z,w.w):Ut.set(w,F,q,Y),xt.scissor(k.copy(Ut).multiplyScalar(W).round())},this.getScissorTest=function(){return qt},this.setScissorTest=function(w){xt.setScissorTest(qt=w)},this.setOpaqueSort=function(w){ct=w},this.setTransparentSort=function(w){ht=w},this.getClearColor=function(w){return w.copy(Nt.getClearColor())},this.setClearColor=function(){Nt.setClearColor.apply(Nt,arguments)},this.getClearAlpha=function(){return Nt.getClearAlpha()},this.setClearAlpha=function(){Nt.setClearAlpha.apply(Nt,arguments)},this.clear=function(w=!0,F=!0,q=!0){let Y=0;if(w){let O=!1;if(P!==null){let yt=P.texture.format;O=yt===Ou||yt===Fu||yt===Bu}if(O){let yt=P.texture.type,kt=yt===$i||yt===Ws||yt===Ao||yt===Dr||yt===Uu||yt===Nu,Vt=Nt.getClearColor(),Wt=Nt.getClearAlpha(),ne=Vt.r,se=Vt.g,Xt=Vt.b;kt?(m[0]=ne,m[1]=se,m[2]=Xt,m[3]=Wt,L.clearBufferuiv(L.COLOR,0,m)):(v[0]=ne,v[1]=se,v[2]=Xt,v[3]=Wt,L.clearBufferiv(L.COLOR,0,v))}else Y|=L.COLOR_BUFFER_BIT}F&&(Y|=L.DEPTH_BUFFER_BIT),q&&(Y|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ot,!1),e.removeEventListener("webglcontextrestored",Lt,!1),e.removeEventListener("webglcontextcreationerror",Pt,!1),mt.dispose(),Ot.dispose(),St.dispose(),E.dispose(),G.dispose(),B.dispose(),Mt.dispose(),U.dispose(),j.dispose(),Z.dispose(),Z.removeEventListener("sessionstart",Od),Z.removeEventListener("sessionend",zd),Is.stop()};function ot(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function Lt(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;let w=zt.autoReset,F=Et.enabled,q=Et.autoUpdate,Y=Et.needsUpdate,O=Et.type;dt(),zt.autoReset=w,Et.enabled=F,Et.autoUpdate=q,Et.needsUpdate=Y,Et.type=O}function Pt(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function ie(w){let F=w.target;F.removeEventListener("dispose",ie),Ve(F)}function Ve(w){bn(w),St.remove(w)}function bn(w){let F=St.get(w).programs;F!==void 0&&(F.forEach(function(q){j.releaseProgram(q)}),w.isShaderMaterial&&j.releaseShaderCache(w))}this.renderBufferDirect=function(w,F,q,Y,O,yt){F===null&&(F=te);let kt=O.isMesh&&O.matrixWorld.determinant()<0,Vt=_m(w,F,q,Y,O);xt.setMaterial(Y,kt);let Wt=q.index,ne=1;if(Y.wireframe===!0){if(Wt=$.getWireframeAttribute(q),Wt===void 0)return;ne=2}let se=q.drawRange,Xt=q.attributes.position,ye=se.start*ne,Pe=(se.start+se.count)*ne;yt!==null&&(ye=Math.max(ye,yt.start*ne),Pe=Math.min(Pe,(yt.start+yt.count)*ne)),Wt!==null?(ye=Math.max(ye,0),Pe=Math.min(Pe,Wt.count)):Xt!=null&&(ye=Math.max(ye,0),Pe=Math.min(Pe,Xt.count));let De=Pe-ye;if(De<0||De===1/0)return;Mt.setup(O,Y,Vt,q,Wt);let zn,be=Ct;if(Wt!==null&&(zn=V.get(Wt),be=Q,be.setIndex(zn)),O.isMesh)Y.wireframe===!0?(xt.setLineWidth(Y.wireframeLinewidth*pt()),be.setMode(L.LINES)):be.setMode(L.TRIANGLES);else if(O.isLine){let Kt=Y.linewidth;Kt===void 0&&(Kt=1),xt.setLineWidth(Kt*pt()),O.isLineSegments?be.setMode(L.LINES):O.isLineLoop?be.setMode(L.LINE_LOOP):be.setMode(L.LINE_STRIP)}else O.isPoints?be.setMode(L.POINTS):O.isSprite&&be.setMode(L.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)be.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(st.get("WEBGL_multi_draw"))be.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Kt=O._multiDrawStarts,Fi=O._multiDrawCounts,Ee=O._multiDrawCount,ui=Wt?V.get(Wt).bytesPerElement:1,ar=St.get(Y).currentProgram.getUniforms();for(let Zn=0;Zn<Ee;Zn++)ar.setValue(L,"_gl_DrawID",Zn),be.render(Kt[Zn]/ui,Fi[Zn])}else if(O.isInstancedMesh)be.renderInstances(ye,De,O.count);else if(q.isInstancedBufferGeometry){let Kt=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Fi=Math.min(q.instanceCount,Kt);be.renderInstances(ye,De,Fi)}else be.render(ye,De)};function we(w,F,q){w.transparent===!0&&w.side===he&&w.forceSinglePass===!1?(w.side=Sn,w.needsUpdate=!0,ea(w,F,q),w.side=Ri,w.needsUpdate=!0,ea(w,F,q),w.side=he):ea(w,F,q)}this.compile=function(w,F,q=null){q===null&&(q=w),p=Ot.get(q),p.init(F),_.push(p),q.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),w!==q&&w.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),p.setupLights();let Y=new Set;return w.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let yt=O.material;if(yt)if(Array.isArray(yt))for(let kt=0;kt<yt.length;kt++){let Vt=yt[kt];we(Vt,q,O),Y.add(Vt)}else we(yt,q,O),Y.add(yt)}),_.pop(),p=null,Y},this.compileAsync=function(w,F,q=null){let Y=this.compile(w,F,q);return new Promise(O=>{function yt(){if(Y.forEach(function(kt){St.get(kt).currentProgram.isReady()&&Y.delete(kt)}),Y.size===0){O(w);return}setTimeout(yt,10)}st.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let hi=null;function Bi(w){hi&&hi(w)}function Od(){Is.stop()}function zd(){Is.start()}let Is=new Tp;Is.setAnimationLoop(Bi),typeof self<"u"&&Is.setContext(self),this.setAnimationLoop=function(w){hi=w,Z.setAnimationLoop(w),w===null?Is.stop():Is.start()},Z.addEventListener("sessionstart",Od),Z.addEventListener("sessionend",zd),this.render=function(w,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Z.enabled===!0&&Z.isPresenting===!0&&(Z.cameraAutoUpdate===!0&&Z.updateCamera(F),F=Z.getCamera()),w.isScene===!0&&w.onBeforeRender(y,w,F,P),p=Ot.get(w,_.length),p.init(F),_.push(p),At.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),K.setFromProjectionMatrix(At),gt=this.localClippingEnabled,it=at.init(this.clippingPlanes,gt),g=mt.get(w,x.length),g.init(),x.push(g),Z.enabled===!0&&Z.isPresenting===!0){let yt=y.xr.getDepthSensingMesh();yt!==null&&yc(yt,F,-1/0,y.sortObjects)}yc(w,F,0,y.sortObjects),g.finish(),y.sortObjects===!0&&g.sort(ct,ht),et=Z.enabled===!1||Z.isPresenting===!1||Z.hasDepthSensing()===!1,et&&Nt.addToRenderList(g,w),this.info.render.frame++,it===!0&&at.beginShadows();let q=p.state.shadowsArray;Et.render(q,w,F),it===!0&&at.endShadows(),this.info.autoReset===!0&&this.info.reset();let Y=g.opaque,O=g.transmissive;if(p.setupLights(),F.isArrayCamera){let yt=F.cameras;if(O.length>0)for(let kt=0,Vt=yt.length;kt<Vt;kt++){let Wt=yt[kt];Vd(Y,O,w,Wt)}et&&Nt.render(w);for(let kt=0,Vt=yt.length;kt<Vt;kt++){let Wt=yt[kt];Gd(g,w,Wt,Wt.viewport)}}else O.length>0&&Vd(Y,O,w,F),et&&Nt.render(w),Gd(g,w,F);P!==null&&(R.updateMultisampleRenderTarget(P),R.updateRenderTargetMipmap(P)),w.isScene===!0&&w.onAfterRender(y,w,F),Mt.resetDefaultState(),b=-1,M=null,_.pop(),_.length>0?(p=_[_.length-1],it===!0&&at.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,x.pop(),x.length>0?g=x[x.length-1]:g=null};function yc(w,F,q,Y){if(w.visible===!1)return;if(w.layers.test(F.layers)){if(w.isGroup)q=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(F);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||K.intersectsSprite(w)){Y&&Zt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(At);let kt=B.update(w),Vt=w.material;Vt.visible&&g.push(w,kt,Vt,q,Zt.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||K.intersectsObject(w))){let kt=B.update(w),Vt=w.material;if(Y&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Zt.copy(w.boundingSphere.center)):(kt.boundingSphere===null&&kt.computeBoundingSphere(),Zt.copy(kt.boundingSphere.center)),Zt.applyMatrix4(w.matrixWorld).applyMatrix4(At)),Array.isArray(Vt)){let Wt=kt.groups;for(let ne=0,se=Wt.length;ne<se;ne++){let Xt=Wt[ne],ye=Vt[Xt.materialIndex];ye&&ye.visible&&g.push(w,kt,ye,q,Zt.z,Xt)}}else Vt.visible&&g.push(w,kt,Vt,q,Zt.z,null)}}let yt=w.children;for(let kt=0,Vt=yt.length;kt<Vt;kt++)yc(yt[kt],F,q,Y)}function Gd(w,F,q,Y){let O=w.opaque,yt=w.transmissive,kt=w.transparent;p.setupLightsView(q),it===!0&&at.setGlobalState(y.clippingPlanes,q),Y&&xt.viewport(C.copy(Y)),O.length>0&&ta(O,F,q),yt.length>0&&ta(yt,F,q),kt.length>0&&ta(kt,F,q),xt.buffers.depth.setTest(!0),xt.buffers.depth.setMask(!0),xt.buffers.color.setMask(!0),xt.setPolygonOffset(!1)}function Vd(w,F,q,Y){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Y.id]===void 0&&(p.state.transmissionRenderTarget[Y.id]=new ei(1,1,{generateMipmaps:!0,type:st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float")?_s:$i,minFilter:Vs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:me.workingColorSpace}));let yt=p.state.transmissionRenderTarget[Y.id],kt=Y.viewport||C;yt.setSize(kt.z,kt.w);let Vt=y.getRenderTarget();y.setRenderTarget(yt),y.getClearColor(z),X=y.getClearAlpha(),X<1&&y.setClearColor(16777215,.5),y.clear(),et&&Nt.render(q);let Wt=y.toneMapping;y.toneMapping=gs;let ne=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),p.setupLightsView(Y),it===!0&&at.setGlobalState(y.clippingPlanes,Y),ta(w,q,Y),R.updateMultisampleRenderTarget(yt),R.updateRenderTargetMipmap(yt),st.has("WEBGL_multisampled_render_to_texture")===!1){let se=!1;for(let Xt=0,ye=F.length;Xt<ye;Xt++){let Pe=F[Xt],De=Pe.object,zn=Pe.geometry,be=Pe.material,Kt=Pe.group;if(be.side===he&&De.layers.test(Y.layers)){let Fi=be.side;be.side=Sn,be.needsUpdate=!0,Wd(De,q,Y,zn,be,Kt),be.side=Fi,be.needsUpdate=!0,se=!0}}se===!0&&(R.updateMultisampleRenderTarget(yt),R.updateRenderTargetMipmap(yt))}y.setRenderTarget(Vt),y.setClearColor(z,X),ne!==void 0&&(Y.viewport=ne),y.toneMapping=Wt}function ta(w,F,q){let Y=F.isScene===!0?F.overrideMaterial:null;for(let O=0,yt=w.length;O<yt;O++){let kt=w[O],Vt=kt.object,Wt=kt.geometry,ne=Y===null?kt.material:Y,se=kt.group;Vt.layers.test(q.layers)&&Wd(Vt,F,q,Wt,ne,se)}}function Wd(w,F,q,Y,O,yt){w.onBeforeRender(y,F,q,Y,O,yt),w.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),O.onBeforeRender(y,F,q,Y,w,yt),O.transparent===!0&&O.side===he&&O.forceSinglePass===!1?(O.side=Sn,O.needsUpdate=!0,y.renderBufferDirect(q,F,Y,O,w,yt),O.side=Ri,O.needsUpdate=!0,y.renderBufferDirect(q,F,Y,O,w,yt),O.side=he):y.renderBufferDirect(q,F,Y,O,w,yt),w.onAfterRender(y,F,q,Y,O,yt)}function ea(w,F,q){F.isScene!==!0&&(F=te);let Y=St.get(w),O=p.state.lights,yt=p.state.shadowsArray,kt=O.state.version,Vt=j.getParameters(w,O.state,yt,F,q),Wt=j.getProgramCacheKey(Vt),ne=Y.programs;Y.environment=w.isMeshStandardMaterial?F.environment:null,Y.fog=F.fog,Y.envMap=(w.isMeshStandardMaterial?G:E).get(w.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&w.envMap===null?F.environmentRotation:w.envMapRotation,ne===void 0&&(w.addEventListener("dispose",ie),ne=new Map,Y.programs=ne);let se=ne.get(Wt);if(se!==void 0){if(Y.currentProgram===se&&Y.lightsStateVersion===kt)return qd(w,Vt),se}else Vt.uniforms=j.getUniforms(w),w.onBeforeCompile(Vt,y),se=j.acquireProgram(Vt,Wt),ne.set(Wt,se),Y.uniforms=Vt.uniforms;let Xt=Y.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Xt.clippingPlanes=at.uniform),qd(w,Vt),Y.needsLights=bm(w),Y.lightsStateVersion=kt,Y.needsLights&&(Xt.ambientLightColor.value=O.state.ambient,Xt.lightProbe.value=O.state.probe,Xt.directionalLights.value=O.state.directional,Xt.directionalLightShadows.value=O.state.directionalShadow,Xt.spotLights.value=O.state.spot,Xt.spotLightShadows.value=O.state.spotShadow,Xt.rectAreaLights.value=O.state.rectArea,Xt.ltc_1.value=O.state.rectAreaLTC1,Xt.ltc_2.value=O.state.rectAreaLTC2,Xt.pointLights.value=O.state.point,Xt.pointLightShadows.value=O.state.pointShadow,Xt.hemisphereLights.value=O.state.hemi,Xt.directionalShadowMap.value=O.state.directionalShadowMap,Xt.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Xt.spotShadowMap.value=O.state.spotShadowMap,Xt.spotLightMatrix.value=O.state.spotLightMatrix,Xt.spotLightMap.value=O.state.spotLightMap,Xt.pointShadowMap.value=O.state.pointShadowMap,Xt.pointShadowMatrix.value=O.state.pointShadowMatrix),Y.currentProgram=se,Y.uniformsList=null,se}function Xd(w){if(w.uniformsList===null){let F=w.currentProgram.getUniforms();w.uniformsList=Cr.seqWithValue(F.seq,w.uniforms)}return w.uniformsList}function qd(w,F){let q=St.get(w);q.outputColorSpace=F.outputColorSpace,q.batching=F.batching,q.batchingColor=F.batchingColor,q.instancing=F.instancing,q.instancingColor=F.instancingColor,q.instancingMorph=F.instancingMorph,q.skinning=F.skinning,q.morphTargets=F.morphTargets,q.morphNormals=F.morphNormals,q.morphColors=F.morphColors,q.morphTargetsCount=F.morphTargetsCount,q.numClippingPlanes=F.numClippingPlanes,q.numIntersection=F.numClipIntersection,q.vertexAlphas=F.vertexAlphas,q.vertexTangents=F.vertexTangents,q.toneMapping=F.toneMapping}function _m(w,F,q,Y,O){F.isScene!==!0&&(F=te),R.resetTextureUnits();let yt=F.fog,kt=Y.isMeshStandardMaterial?F.environment:null,Vt=P===null?y.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Wr,Wt=(Y.isMeshStandardMaterial?G:E).get(Y.envMap||kt),ne=Y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,se=!!q.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Xt=!!q.morphAttributes.position,ye=!!q.morphAttributes.normal,Pe=!!q.morphAttributes.color,De=gs;Y.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(De=y.toneMapping);let zn=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,be=zn!==void 0?zn.length:0,Kt=St.get(Y),Fi=p.state.lights;if(it===!0&&(gt===!0||w!==M)){let Qn=w===M&&Y.id===b;at.setState(Y,w,Qn)}let Ee=!1;Y.version===Kt.__version?(Kt.needsLights&&Kt.lightsStateVersion!==Fi.state.version||Kt.outputColorSpace!==Vt||O.isBatchedMesh&&Kt.batching===!1||!O.isBatchedMesh&&Kt.batching===!0||O.isBatchedMesh&&Kt.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Kt.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Kt.instancing===!1||!O.isInstancedMesh&&Kt.instancing===!0||O.isSkinnedMesh&&Kt.skinning===!1||!O.isSkinnedMesh&&Kt.skinning===!0||O.isInstancedMesh&&Kt.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Kt.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Kt.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Kt.instancingMorph===!1&&O.morphTexture!==null||Kt.envMap!==Wt||Y.fog===!0&&Kt.fog!==yt||Kt.numClippingPlanes!==void 0&&(Kt.numClippingPlanes!==at.numPlanes||Kt.numIntersection!==at.numIntersection)||Kt.vertexAlphas!==ne||Kt.vertexTangents!==se||Kt.morphTargets!==Xt||Kt.morphNormals!==ye||Kt.morphColors!==Pe||Kt.toneMapping!==De||Kt.morphTargetsCount!==be)&&(Ee=!0):(Ee=!0,Kt.__version=Y.version);let ui=Kt.currentProgram;Ee===!0&&(ui=ea(Y,F,O));let ar=!1,Zn=!1,lo=!1,ke=ui.getUniforms(),Si=Kt.uniforms;if(xt.useProgram(ui.program)&&(ar=!0,Zn=!0,lo=!0),Y.id!==b&&(b=Y.id,Zn=!0),ar||M!==w){xt.buffers.depth.getReversed()?(ut.copy(w.projectionMatrix),wg(ut),Sg(ut),ke.setValue(L,"projectionMatrix",ut)):ke.setValue(L,"projectionMatrix",w.projectionMatrix),ke.setValue(L,"viewMatrix",w.matrixWorldInverse);let os=ke.map.cameraPosition;os!==void 0&&os.setValue(L,Bt.setFromMatrixPosition(w.matrixWorld)),It.logarithmicDepthBuffer&&ke.setValue(L,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&ke.setValue(L,"isOrthographic",w.isOrthographicCamera===!0),M!==w&&(M=w,Zn=!0,lo=!0)}if(O.isSkinnedMesh){ke.setOptional(L,O,"bindMatrix"),ke.setOptional(L,O,"bindMatrixInverse");let Qn=O.skeleton;Qn&&(Qn.boneTexture===null&&Qn.computeBoneTexture(),ke.setValue(L,"boneTexture",Qn.boneTexture,R))}O.isBatchedMesh&&(ke.setOptional(L,O,"batchingTexture"),ke.setValue(L,"batchingTexture",O._matricesTexture,R),ke.setOptional(L,O,"batchingIdTexture"),ke.setValue(L,"batchingIdTexture",O._indirectTexture,R),ke.setOptional(L,O,"batchingColorTexture"),O._colorsTexture!==null&&ke.setValue(L,"batchingColorTexture",O._colorsTexture,R));let co=q.morphAttributes;if((co.position!==void 0||co.normal!==void 0||co.color!==void 0)&&Gt.update(O,q,ui),(Zn||Kt.receiveShadow!==O.receiveShadow)&&(Kt.receiveShadow=O.receiveShadow,ke.setValue(L,"receiveShadow",O.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(Si.envMap.value=Wt,Si.flipEnvMap.value=Wt.isCubeTexture&&Wt.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&F.environment!==null&&(Si.envMapIntensity.value=F.environmentIntensity),Zn&&(ke.setValue(L,"toneMappingExposure",y.toneMappingExposure),Kt.needsLights&&Mm(Si,lo),yt&&Y.fog===!0&&rt.refreshFogUniforms(Si,yt),rt.refreshMaterialUniforms(Si,Y,W,J,p.state.transmissionRenderTarget[w.id]),Cr.upload(L,Xd(Kt),Si,R)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Cr.upload(L,Xd(Kt),Si,R),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&ke.setValue(L,"center",O.center),ke.setValue(L,"modelViewMatrix",O.modelViewMatrix),ke.setValue(L,"normalMatrix",O.normalMatrix),ke.setValue(L,"modelMatrix",O.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){let Qn=Y.uniformsGroups;for(let os=0,as=Qn.length;os<as;os++){let Yd=Qn[os];U.update(Yd,ui),U.bind(Yd,ui)}}return ui}function Mm(w,F){w.ambientLightColor.needsUpdate=F,w.lightProbe.needsUpdate=F,w.directionalLights.needsUpdate=F,w.directionalLightShadows.needsUpdate=F,w.pointLights.needsUpdate=F,w.pointLightShadows.needsUpdate=F,w.spotLights.needsUpdate=F,w.spotLightShadows.needsUpdate=F,w.rectAreaLights.needsUpdate=F,w.hemisphereLights.needsUpdate=F}function bm(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(w,F,q){St.get(w.texture).__webglTexture=F,St.get(w.depthTexture).__webglTexture=q;let Y=St.get(w);Y.__hasExternalTextures=!0,Y.__autoAllocateDepthBuffer=q===void 0,Y.__autoAllocateDepthBuffer||st.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Y.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,F){let q=St.get(w);q.__webglFramebuffer=F,q.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(w,F=0,q=0){P=w,T=F,S=q;let Y=!0,O=null,yt=!1,kt=!1;if(w){let Wt=St.get(w);if(Wt.__useDefaultFramebuffer!==void 0)xt.bindFramebuffer(L.FRAMEBUFFER,null),Y=!1;else if(Wt.__webglFramebuffer===void 0)R.setupRenderTarget(w);else if(Wt.__hasExternalTextures)R.rebindTextures(w,St.get(w.texture).__webglTexture,St.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let Xt=w.depthTexture;if(Wt.__boundDepthTexture!==Xt){if(Xt!==null&&St.has(Xt)&&(w.width!==Xt.image.width||w.height!==Xt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(w)}}let ne=w.texture;(ne.isData3DTexture||ne.isDataArrayTexture||ne.isCompressedArrayTexture)&&(kt=!0);let se=St.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(se[F])?O=se[F][q]:O=se[F],yt=!0):w.samples>0&&R.useMultisampledRTT(w)===!1?O=St.get(w).__webglMultisampledFramebuffer:Array.isArray(se)?O=se[q]:O=se,C.copy(w.viewport),k.copy(w.scissor),N=w.scissorTest}else C.copy(ft).multiplyScalar(W).floor(),k.copy(Ut).multiplyScalar(W).floor(),N=qt;if(xt.bindFramebuffer(L.FRAMEBUFFER,O)&&Y&&xt.drawBuffers(w,O),xt.viewport(C),xt.scissor(k),xt.setScissorTest(N),yt){let Wt=St.get(w.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+F,Wt.__webglTexture,q)}else if(kt){let Wt=St.get(w.texture),ne=F||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,Wt.__webglTexture,q||0,ne)}b=-1},this.readRenderTargetPixels=function(w,F,q,Y,O,yt,kt){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Vt=St.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&kt!==void 0&&(Vt=Vt[kt]),Vt){xt.bindFramebuffer(L.FRAMEBUFFER,Vt);try{let Wt=w.texture,ne=Wt.format,se=Wt.type;if(!It.textureFormatReadable(ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!It.textureTypeReadable(se)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=w.width-Y&&q>=0&&q<=w.height-O&&L.readPixels(F,q,Y,O,vt.convert(ne),vt.convert(se),yt)}finally{let Wt=P!==null?St.get(P).__webglFramebuffer:null;xt.bindFramebuffer(L.FRAMEBUFFER,Wt)}}},this.readRenderTargetPixelsAsync=async function(w,F,q,Y,O,yt,kt){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Vt=St.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&kt!==void 0&&(Vt=Vt[kt]),Vt){let Wt=w.texture,ne=Wt.format,se=Wt.type;if(!It.textureFormatReadable(ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!It.textureTypeReadable(se))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=w.width-Y&&q>=0&&q<=w.height-O){xt.bindFramebuffer(L.FRAMEBUFFER,Vt);let Xt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Xt),L.bufferData(L.PIXEL_PACK_BUFFER,yt.byteLength,L.STREAM_READ),L.readPixels(F,q,Y,O,vt.convert(ne),vt.convert(se),0);let ye=P!==null?St.get(P).__webglFramebuffer:null;xt.bindFramebuffer(L.FRAMEBUFFER,ye);let Pe=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Eg(L,Pe,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Xt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,yt),L.deleteBuffer(Xt),L.deleteSync(Pe),yt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,F=null,q=0){w.isTexture!==!0&&(yo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,w=arguments[1]);let Y=Math.pow(2,-q),O=Math.floor(w.image.width*Y),yt=Math.floor(w.image.height*Y),kt=F!==null?F.x:0,Vt=F!==null?F.y:0;R.setTexture2D(w,0),L.copyTexSubImage2D(L.TEXTURE_2D,q,0,0,kt,Vt,O,yt),xt.unbindTexture()},this.copyTextureToTexture=function(w,F,q=null,Y=null,O=0){w.isTexture!==!0&&(yo("WebGLRenderer: copyTextureToTexture function signature has changed."),Y=arguments[0]||null,w=arguments[1],F=arguments[2],O=arguments[3]||0,q=null);let yt,kt,Vt,Wt,ne,se,Xt,ye,Pe,De=w.isCompressedTexture?w.mipmaps[O]:w.image;q!==null?(yt=q.max.x-q.min.x,kt=q.max.y-q.min.y,Vt=q.isBox3?q.max.z-q.min.z:1,Wt=q.min.x,ne=q.min.y,se=q.isBox3?q.min.z:0):(yt=De.width,kt=De.height,Vt=De.depth||1,Wt=0,ne=0,se=0),Y!==null?(Xt=Y.x,ye=Y.y,Pe=Y.z):(Xt=0,ye=0,Pe=0);let zn=vt.convert(F.format),be=vt.convert(F.type),Kt;F.isData3DTexture?(R.setTexture3D(F,0),Kt=L.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(R.setTexture2DArray(F,0),Kt=L.TEXTURE_2D_ARRAY):(R.setTexture2D(F,0),Kt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,F.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,F.unpackAlignment);let Fi=L.getParameter(L.UNPACK_ROW_LENGTH),Ee=L.getParameter(L.UNPACK_IMAGE_HEIGHT),ui=L.getParameter(L.UNPACK_SKIP_PIXELS),ar=L.getParameter(L.UNPACK_SKIP_ROWS),Zn=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,De.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,De.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Wt),L.pixelStorei(L.UNPACK_SKIP_ROWS,ne),L.pixelStorei(L.UNPACK_SKIP_IMAGES,se);let lo=w.isDataArrayTexture||w.isData3DTexture,ke=F.isDataArrayTexture||F.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){let Si=St.get(w),co=St.get(F),Qn=St.get(Si.__renderTarget),os=St.get(co.__renderTarget);xt.bindFramebuffer(L.READ_FRAMEBUFFER,Qn.__webglFramebuffer),xt.bindFramebuffer(L.DRAW_FRAMEBUFFER,os.__webglFramebuffer);for(let as=0;as<Vt;as++)lo&&L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,St.get(w).__webglTexture,O,se+as),w.isDepthTexture?(ke&&L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,St.get(F).__webglTexture,O,Pe+as),L.blitFramebuffer(Wt,ne,yt,kt,Xt,ye,yt,kt,L.DEPTH_BUFFER_BIT,L.NEAREST)):ke?L.copyTexSubImage3D(Kt,O,Xt,ye,Pe+as,Wt,ne,yt,kt):L.copyTexSubImage2D(Kt,O,Xt,ye,Pe+as,Wt,ne,yt,kt);xt.bindFramebuffer(L.READ_FRAMEBUFFER,null),xt.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else ke?w.isDataTexture||w.isData3DTexture?L.texSubImage3D(Kt,O,Xt,ye,Pe,yt,kt,Vt,zn,be,De.data):F.isCompressedArrayTexture?L.compressedTexSubImage3D(Kt,O,Xt,ye,Pe,yt,kt,Vt,zn,De.data):L.texSubImage3D(Kt,O,Xt,ye,Pe,yt,kt,Vt,zn,be,De):w.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,O,Xt,ye,yt,kt,zn,be,De.data):w.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,O,Xt,ye,De.width,De.height,zn,De.data):L.texSubImage2D(L.TEXTURE_2D,O,Xt,ye,yt,kt,zn,be,De);L.pixelStorei(L.UNPACK_ROW_LENGTH,Fi),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Ee),L.pixelStorei(L.UNPACK_SKIP_PIXELS,ui),L.pixelStorei(L.UNPACK_SKIP_ROWS,ar),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Zn),O===0&&F.generateMipmaps&&L.generateMipmap(Kt),xt.unbindTexture()},this.copyTextureToTexture3D=function(w,F,q=null,Y=null,O=0){return w.isTexture!==!0&&(yo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),q=arguments[0]||null,Y=arguments[1]||null,w=arguments[2],F=arguments[3],O=arguments[4]||0),yo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,F,q,Y,O)},this.initRenderTarget=function(w){St.get(w).__webglFramebuffer===void 0&&R.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?R.setTextureCube(w,0):w.isData3DTexture?R.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?R.setTexture2DArray(w,0):R.setTexture2D(w,0),xt.unbindTexture()},this.resetState=function(){T=0,S=0,P=null,xt.reset(),Mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Yi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorspace=me._getDrawingBufferColorSpace(t),e.unpackColorSpace=me._getUnpackColorSpace()}};var Ka=class i{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Dt(t),this.near=e,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Pi=class extends on{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new vn,this.environmentIntensity=1,this.environmentRotation=new vn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}};var tu=class extends Nn{constructor(t=null,e=1,n=1,s,r,o,a,l,c=Un,h=Un,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Po=class extends Oe{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},br=new jt,Kf=new jt,Ea=[],$f=new Ji,y_=new jt,mo=new D,go=new ji,gi=class extends D{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Po(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,y_)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ji),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,br),$f.copy(t.boundingBox).applyMatrix4(br),this.boundingBox.union($f)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ji),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,br),go.copy(t.boundingSphere).applyMatrix4(br),this.boundingSphere.union(go)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(mo.geometry=this.geometry,mo.material=this.material,mo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),go.copy(this.boundingSphere),go.applyMatrix4(n),t.ray.intersectsSphere(go)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,br),Kf.multiplyMatrices(n,br),mo.matrixWorld=Kf,mo.raycast(t,Ea);for(let o=0,a=Ea.length;o<a;o++){let l=Ea[o];l.instanceId=r,l.object=this,e.push(l)}Ea.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Po(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new tu(new Float32Array(s*this.count),s,this.count,Hu,Ai));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var eu=class extends Ci{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new Dt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},$a=new A,Ja=new A,Jf=new jt,vo=new Ro,wa=new ji,Zc=new A,jf=new A,nu=class extends on{constructor(t=new de,e=new eu){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)$a.fromBufferAttribute(e,s-1),Ja.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=$a.distanceTo(Ja);t.setAttribute("lineDistance",new $t(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),wa.copy(n.boundingSphere),wa.applyMatrix4(s),wa.radius+=r,t.ray.intersectsSphere(wa)===!1)return;Jf.copy(s).invert(),vo.copy(t.ray).applyMatrix4(Jf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=c){let p=h.getX(v),x=h.getX(v+1),_=Sa(this,t,vo,l,p,x);_&&e.push(_)}if(this.isLineLoop){let v=h.getX(m-1),g=h.getX(f),p=Sa(this,t,vo,l,v,g);p&&e.push(p)}}else{let f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=c){let p=Sa(this,t,vo,l,v,v+1);p&&e.push(p)}if(this.isLineLoop){let v=Sa(this,t,vo,l,m-1,f);v&&e.push(v)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Sa(i,t,e,n,s,r){let o=i.geometry.attributes.position;if($a.fromBufferAttribute(o,s),Ja.fromBufferAttribute(o,r),e.distanceSqToSegment($a,Ja,Zc,jf)>n)return;Zc.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(Zc);if(!(l<t.near||l>t.far))return{distance:l,point:jf.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}var Qf=new A,tp=new A,ja=class extends nu{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Qf.fromBufferAttribute(e,s),tp.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Qf.distanceTo(tp);t.setAttribute("lineDistance",new $t(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var iu=class extends Ci{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Dt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},ep=new jt,su=new Ro,Ta=new ji,Aa=new A,Qa=class extends on{constructor(t=new de,e=new iu){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ta.copy(n.boundingSphere),Ta.applyMatrix4(s),Ta.radius+=r,t.ray.intersectsSphere(Ta)===!1)return;ep.copy(s).invert(),su.copy(t.ray).applyMatrix4(ep);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let m=d,v=f;m<v;m++){let g=c.getX(m);Aa.fromBufferAttribute(u,g),np(Aa,g,l,s,t,e,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let m=d,v=f;m<v;m++)Aa.fromBufferAttribute(u,m),np(Aa,m,l,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function np(i,t,e,n,s,r,o){let a=su.distanceSqToPoint(i);if(a<e){let l=new A;su.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var tl=class extends Nn{constructor(t,e){super({width:t,height:e}),this.isFramebufferTexture=!0,this.magFilter=Un,this.minFilter=Un,this.generateMipmaps=!1,this.needsUpdate=!0}};var Ce=class extends Nn{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},ni=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),s=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new nt:new A);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new A,s=[],r=[],o=[],a=new A,l=new jt;for(let f=0;f<=t;f++){let m=f/t;s[f]=this.getTangentAt(m,new A)}r[0]=new A,o[0]=new A;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let m=Math.acos(rn(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,m))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(rn(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let m=1;m<=t;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],f*m)),o[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Io=class extends ni{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new nt){let n=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},ru=class extends Io{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Wu(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return i+t*r+e*o+n*a}}}var Ra=new A,Kc=new Wu,$c=new Wu,Jc=new Wu,ou=class extends ni{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new A){let n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(Ra.subVectors(s[0],s[1]).add(s[0]),c=Ra);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Ra.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Ra),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),Kc.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,m,v,g),$c.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,m,v,g),Jc.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,m,v,g)}else this.curveType==="catmullrom"&&(Kc.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),$c.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Jc.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Kc.calc(l),$c.calc(l),Jc.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new A().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function ip(i,t,e,n,s){let r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function __(i,t){let e=1-i;return e*e*t}function M_(i,t){return 2*(1-i)*i*t}function b_(i,t){return i*i*t}function wo(i,t,e,n){return __(i,t)+M_(i,e)+b_(i,n)}function E_(i,t){let e=1-i;return e*e*e*t}function w_(i,t){let e=1-i;return 3*e*e*i*t}function S_(i,t){return 3*(1-i)*i*i*t}function T_(i,t){return i*i*i*t}function So(i,t,e,n,s){return E_(i,t)+w_(i,e)+S_(i,n)+T_(i,s)}var el=class extends ni{constructor(t=new nt,e=new nt,n=new nt,s=new nt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new nt){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(So(t,s.x,r.x,o.x,a.x),So(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},au=class extends ni{constructor(t=new A,e=new A,n=new A,s=new A){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new A){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(So(t,s.x,r.x,o.x,a.x),So(t,s.y,r.y,o.y,a.y),So(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},nl=class extends ni{constructor(t=new nt,e=new nt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new nt){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new nt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},lu=class extends ni{constructor(t=new A,e=new A){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new A){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new A){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},il=class extends ni{constructor(t=new nt,e=new nt,n=new nt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new nt){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(wo(t,s.x,r.x,o.x),wo(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},cu=class extends ni{constructor(t=new A,e=new A,n=new A){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new A){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(wo(t,s.x,r.x,o.x),wo(t,s.y,r.y,o.y),wo(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},sl=class extends ni{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new nt){let n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(ip(a,l.x,c.x,h.x,u.x),ip(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new nt().fromArray(s))}return this}},hu=Object.freeze({__proto__:null,ArcCurve:ru,CatmullRomCurve3:ou,CubicBezierCurve:el,CubicBezierCurve3:au,EllipseCurve:Io,LineCurve:nl,LineCurve3:lu,QuadraticBezierCurve:il,QuadraticBezierCurve3:cu,SplineCurve:sl}),uu=class extends ni{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new hu[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new hu[s.type]().fromJSON(s))}return this}},Lo=class extends uu{constructor(t){super(),this.type="Path",this.currentPoint=new nt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new nl(this.currentPoint.clone(),new nt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new il(this.currentPoint.clone(),new nt(t,e),new nt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){let a=new el(this.currentPoint.clone(),new nt(t,e),new nt(n,s),new nt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new sl(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){let c=new Io(t,e,n,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Qi=class i extends de{constructor(t=[new nt(0,-.5),new nt(.5,0),new nt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=rn(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/e,u=new A,d=new nt,f=new A,m=new A,v=new A,g=0,p=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:g=t[x+1].x-t[x].x,p=t[x+1].y-t[x].y,f.x=p*1,f.y=-g,f.z=p*0,v.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(v.x,v.y,v.z);break;default:g=t[x+1].x-t[x].x,p=t[x+1].y-t[x].y,f.x=p*1,f.y=-g,f.z=p*0,m.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),l.push(f.x,f.y,f.z),v.copy(m)}for(let x=0;x<=e;x++){let _=n+x*h*s,y=Math.sin(_),I=Math.cos(_);for(let T=0;T<=t.length-1;T++){u.x=t[T].x*y,u.y=t[T].y,u.z=t[T].x*I,o.push(u.x,u.y,u.z),d.x=x/e,d.y=T/(t.length-1),a.push(d.x,d.y);let S=l[3*T+0]*y,P=l[3*T+1],b=l[3*T+0]*I;c.push(S,P,b)}}for(let x=0;x<e;x++)for(let _=0;_<t.length-1;_++){let y=_+x*t.length,I=y,T=y+t.length,S=y+t.length+1,P=y+1;r.push(I,T,P),r.push(S,P,T)}this.setIndex(r),this.setAttribute("position",new $t(o,3)),this.setAttribute("uv",new $t(a,2)),this.setAttribute("normal",new $t(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.points,t.segments,t.phiStart,t.phiLength)}},Fr=class i extends Qi{constructor(t=1,e=1,n=4,s=8){let r=new Lo;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:s}}static fromJSON(t){return new i(t.radius,t.length,t.capSegments,t.radialSegments)}},Gn=class i extends de{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],o=[],a=[],l=[],c=new A,h=new nt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){let f=n+u/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new $t(o,3)),this.setAttribute("normal",new $t(a,3)),this.setAttribute("uv",new $t(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Yt=class i extends de{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,v=[],g=n/2,p=0;x(),o===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new $t(u,3)),this.setAttribute("normal",new $t(d,3)),this.setAttribute("uv",new $t(f,2));function x(){let y=new A,I=new A,T=0,S=(e-t)/n;for(let P=0;P<=r;P++){let b=[],M=P/r,C=M*(e-t)+t;for(let k=0;k<=s;k++){let N=k/s,z=N*l+a,X=Math.sin(z),H=Math.cos(z);I.x=C*X,I.y=-M*n+g,I.z=C*H,u.push(I.x,I.y,I.z),y.set(X,S,H).normalize(),d.push(y.x,y.y,y.z),f.push(N,1-M),b.push(m++)}v.push(b)}for(let P=0;P<s;P++)for(let b=0;b<r;b++){let M=v[b][P],C=v[b+1][P],k=v[b+1][P+1],N=v[b][P+1];(t>0||b!==0)&&(h.push(M,C,N),T+=3),(e>0||b!==r-1)&&(h.push(C,k,N),T+=3)}c.addGroup(p,T,0),p+=T}function _(y){let I=m,T=new nt,S=new A,P=0,b=y===!0?t:e,M=y===!0?1:-1;for(let k=1;k<=s;k++)u.push(0,g*M,0),d.push(0,M,0),f.push(.5,.5),m++;let C=m;for(let k=0;k<=s;k++){let z=k/s*l+a,X=Math.cos(z),H=Math.sin(z);S.x=b*H,S.y=g*M,S.z=b*X,u.push(S.x,S.y,S.z),d.push(0,M,0),T.x=X*.5+.5,T.y=H*.5*M+.5,f.push(T.x,T.y),m++}for(let k=0;k<s;k++){let N=I+k,z=C+k;y===!0?h.push(z,z+1,N):h.push(z+1,z,N),P+=3}c.addGroup(p,P,y===!0?1:2),p+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ii=class i extends Yt{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},du=class i extends de{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new $t(r,3)),this.setAttribute("normal",new $t(r.slice(),3)),this.setAttribute("uv",new $t(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(x){let _=new A,y=new A,I=new A;for(let T=0;T<e.length;T+=3)f(e[T+0],_),f(e[T+1],y),f(e[T+2],I),l(_,y,I,x)}function l(x,_,y,I){let T=I+1,S=[];for(let P=0;P<=T;P++){S[P]=[];let b=x.clone().lerp(y,P/T),M=_.clone().lerp(y,P/T),C=T-P;for(let k=0;k<=C;k++)k===0&&P===T?S[P][k]=b:S[P][k]=b.clone().lerp(M,k/C)}for(let P=0;P<T;P++)for(let b=0;b<2*(T-P)-1;b++){let M=Math.floor(b/2);b%2===0?(d(S[P][M+1]),d(S[P+1][M]),d(S[P][M])):(d(S[P][M+1]),d(S[P+1][M+1]),d(S[P+1][M]))}}function c(x){let _=new A;for(let y=0;y<r.length;y+=3)_.x=r[y+0],_.y=r[y+1],_.z=r[y+2],_.normalize().multiplyScalar(x),r[y+0]=_.x,r[y+1]=_.y,r[y+2]=_.z}function h(){let x=new A;for(let _=0;_<r.length;_+=3){x.x=r[_+0],x.y=r[_+1],x.z=r[_+2];let y=g(x)/2/Math.PI+.5,I=p(x)/Math.PI+.5;o.push(y,1-I)}m(),u()}function u(){for(let x=0;x<o.length;x+=6){let _=o[x+0],y=o[x+2],I=o[x+4],T=Math.max(_,y,I),S=Math.min(_,y,I);T>.9&&S<.1&&(_<.2&&(o[x+0]+=1),y<.2&&(o[x+2]+=1),I<.2&&(o[x+4]+=1))}}function d(x){r.push(x.x,x.y,x.z)}function f(x,_){let y=x*3;_.x=t[y+0],_.y=t[y+1],_.z=t[y+2]}function m(){let x=new A,_=new A,y=new A,I=new A,T=new nt,S=new nt,P=new nt;for(let b=0,M=0;b<r.length;b+=9,M+=6){x.set(r[b+0],r[b+1],r[b+2]),_.set(r[b+3],r[b+4],r[b+5]),y.set(r[b+6],r[b+7],r[b+8]),T.set(o[M+0],o[M+1]),S.set(o[M+2],o[M+3]),P.set(o[M+4],o[M+5]),I.copy(x).add(_).add(y).divideScalar(3);let C=g(I);v(T,M+0,x,C),v(S,M+2,_,C),v(P,M+4,y,C)}}function v(x,_,y,I){I<0&&x.x===1&&(o[_]=x.x-1),y.x===0&&y.z===0&&(o[_]=I/2/Math.PI+.5)}function g(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.details)}};var cn=class extends Lo{constructor(t){super(t),this.uuid=Zs(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new Lo().fromJSON(s))}return this}},A_={triangulate:function(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=Ip(i,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,u,d,f;if(n&&(r=L_(i,t,r,e)),i.length>80*e){a=c=i[0],l=h=i[1];for(let m=e;m<s;m+=e)u=i[m],d=i[m+1],u<a&&(a=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-a,h-l),f=f!==0?32767/f:0}return Do(r,o,e,a,l,f,0),o}};function Ip(i,t,e,n,s){let r,o;if(s===V_(i,t,e,n)>0)for(r=t;r<e;r+=n)o=sp(r,i[r],i[r+1],o);else for(r=e-n;r>=t;r-=n)o=sp(r,i[r],i[r+1],o);return o&&dl(o,o.next)&&(Uo(o),o=o.next),o}function Xs(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(dl(e,e.next)||Fe(e.prev,e,e.next)===0)){if(Uo(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Do(i,t,e,n,s,r,o){if(!i)return;!o&&r&&H_(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?C_(i,n,s,r):R_(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(c.i/e|0),Uo(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=P_(Xs(i),t,e),Do(i,t,e,n,s,r,2)):o===2&&I_(i,t,e,n,s,r):Do(Xs(i),t,e,n,s,r,1);break}}}function R_(i){let t=i.prev,e=i,n=i.next;if(Fe(t,e,n)>=0)return!1;let s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=s<r?s<o?s:o:r<o?r:o,u=a<l?a<c?a:c:l<c?l:c,d=s>r?s>o?s:o:r>o?r:o,f=a>l?a>c?a:c:l>c?l:c,m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&Sr(s,a,r,l,o,c,m.x,m.y)&&Fe(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function C_(i,t,e,n){let s=i.prev,r=i,o=i.next;if(Fe(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,f=a<l?a<c?a:c:l<c?l:c,m=h<u?h<d?h:d:u<d?u:d,v=a>l?a>c?a:c:l>c?l:c,g=h>u?h>d?h:d:u>d?u:d,p=fu(f,m,t,e,n),x=fu(v,g,t,e,n),_=i.prevZ,y=i.nextZ;for(;_&&_.z>=p&&y&&y.z<=x;){if(_.x>=f&&_.x<=v&&_.y>=m&&_.y<=g&&_!==s&&_!==o&&Sr(a,h,l,u,c,d,_.x,_.y)&&Fe(_.prev,_,_.next)>=0||(_=_.prevZ,y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==o&&Sr(a,h,l,u,c,d,y.x,y.y)&&Fe(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;_&&_.z>=p;){if(_.x>=f&&_.x<=v&&_.y>=m&&_.y<=g&&_!==s&&_!==o&&Sr(a,h,l,u,c,d,_.x,_.y)&&Fe(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;y&&y.z<=x;){if(y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==o&&Sr(a,h,l,u,c,d,y.x,y.y)&&Fe(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function P_(i,t,e){let n=i;do{let s=n.prev,r=n.next.next;!dl(s,r)&&Lp(s,n,n.next,r)&&ko(s,r)&&ko(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),Uo(n),Uo(n.next),n=i=r),n=n.next}while(n!==i);return Xs(n)}function I_(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&O_(o,a)){let l=Dp(o,a);o=Xs(o,o.next),l=Xs(l,l.next),Do(o,t,e,n,s,r,0),Do(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function L_(i,t,e,n){let s=[],r,o,a,l,c;for(r=0,o=t.length;r<o;r++)a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=Ip(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(F_(c));for(s.sort(D_),r=0;r<s.length;r++)e=k_(s[r],e);return e}function D_(i,t){return i.x-t.x}function k_(i,t){let e=U_(i,t);if(!e)return t;let n=Dp(e,i);return Xs(n,n.next),Xs(e,e.next)}function U_(i,t){let e=t,n=-1/0,s,r=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){let d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>n&&(n=d,s=e.x<e.next.x?e:e.next,d===r))return s}e=e.next}while(e!==t);if(!s)return null;let a=s,l=s.x,c=s.y,h=1/0,u;e=s;do r>=e.x&&e.x>=l&&r!==e.x&&Sr(o<c?r:n,o,l,c,o<c?n:r,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(r-e.x),ko(e,i)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&N_(s,e)))&&(s=e,h=u)),e=e.next;while(e!==a);return s}function N_(i,t){return Fe(i.prev,i,t.prev)<0&&Fe(t.next,i,i.next)<0}function H_(i,t,e,n){let s=i;do s.z===0&&(s.z=fu(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,B_(s)}function B_(i){let t,e,n,s,r,o,a,l,c=1;do{for(e=i,i=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,c*=2}while(o>1);return i}function fu(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function F_(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Sr(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function O_(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!z_(i,t)&&(ko(i,t)&&ko(t,i)&&G_(i,t)&&(Fe(i.prev,i,t.prev)||Fe(i,t.prev,t))||dl(i,t)&&Fe(i.prev,i,i.next)>0&&Fe(t.prev,t,t.next)>0)}function Fe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function dl(i,t){return i.x===t.x&&i.y===t.y}function Lp(i,t,e,n){let s=Pa(Fe(i,t,e)),r=Pa(Fe(i,t,n)),o=Pa(Fe(e,n,i)),a=Pa(Fe(e,n,t));return!!(s!==r&&o!==a||s===0&&Ca(i,e,t)||r===0&&Ca(i,n,t)||o===0&&Ca(e,i,n)||a===0&&Ca(e,t,n))}function Ca(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Pa(i){return i>0?1:i<0?-1:0}function z_(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Lp(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function ko(i,t){return Fe(i.prev,i,i.next)<0?Fe(i,t,i.next)>=0&&Fe(i,i.prev,t)>=0:Fe(i,t,i.prev)<0||Fe(i,i.next,t)<0}function G_(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Dp(i,t){let e=new pu(i.i,i.x,i.y),n=new pu(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function sp(i,t,e,n){let s=new pu(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Uo(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function pu(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function V_(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var vs=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];rp(t),op(n,t);let o=t.length;e.forEach(rp);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,op(n,e[l]);let a=A_.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function rp(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function op(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var si=class i extends de{constructor(t=new cn([new nt(.5,.5),new nt(-.5,.5),new nt(-.5,-.5),new nt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){let c=t[a];o(c)}this.setAttribute("position",new $t(s,3)),this.setAttribute("uv",new $t(r,2)),this.computeVertexNormals();function o(a){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,m=e.bevelSize!==void 0?e.bevelSize:f-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3,p=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:W_,_,y=!1,I,T,S,P;p&&(_=p.getSpacedPoints(h),y=!0,d=!1,I=p.computeFrenetFrames(h,!1),T=new A,S=new A,P=new A),d||(g=0,f=0,m=0,v=0);let b=a.extractPoints(c),M=b.shape,C=b.holes;if(!vs.isClockWise(M)){M=M.reverse();for(let et=0,pt=C.length;et<pt;et++){let L=C[et];vs.isClockWise(L)&&(C[et]=L.reverse())}}let N=vs.triangulateShape(M,C),z=M;for(let et=0,pt=C.length;et<pt;et++){let L=C[et];M=M.concat(L)}function X(et,pt,L){return pt||console.error("THREE.ExtrudeGeometry: vec does not exist"),et.clone().addScaledVector(pt,L)}let H=M.length,J=N.length;function W(et,pt,L){let Ft,st,It,xt=et.x-pt.x,zt=et.y-pt.y,St=L.x-et.x,R=L.y-et.y,E=xt*xt+zt*zt,G=xt*R-zt*St;if(Math.abs(G)>Number.EPSILON){let V=Math.sqrt(E),$=Math.sqrt(St*St+R*R),B=pt.x-zt/V,j=pt.y+xt/V,rt=L.x-R/$,mt=L.y+St/$,Ot=((rt-B)*R-(mt-j)*St)/(xt*R-zt*St);Ft=B+xt*Ot-et.x,st=j+zt*Ot-et.y;let at=Ft*Ft+st*st;if(at<=2)return new nt(Ft,st);It=Math.sqrt(at/2)}else{let V=!1;xt>Number.EPSILON?St>Number.EPSILON&&(V=!0):xt<-Number.EPSILON?St<-Number.EPSILON&&(V=!0):Math.sign(zt)===Math.sign(R)&&(V=!0),V?(Ft=-zt,st=xt,It=Math.sqrt(E)):(Ft=xt,st=zt,It=Math.sqrt(E/2))}return new nt(Ft/It,st/It)}let ct=[];for(let et=0,pt=z.length,L=pt-1,Ft=et+1;et<pt;et++,L++,Ft++)L===pt&&(L=0),Ft===pt&&(Ft=0),ct[et]=W(z[et],z[L],z[Ft]);let ht=[],ft,Ut=ct.concat();for(let et=0,pt=C.length;et<pt;et++){let L=C[et];ft=[];for(let Ft=0,st=L.length,It=st-1,xt=Ft+1;Ft<st;Ft++,It++,xt++)It===st&&(It=0),xt===st&&(xt=0),ft[Ft]=W(L[Ft],L[It],L[xt]);ht.push(ft),Ut=Ut.concat(ft)}for(let et=0;et<g;et++){let pt=et/g,L=f*Math.cos(pt*Math.PI/2),Ft=m*Math.sin(pt*Math.PI/2)+v;for(let st=0,It=z.length;st<It;st++){let xt=X(z[st],ct[st],Ft);ut(xt.x,xt.y,-L)}for(let st=0,It=C.length;st<It;st++){let xt=C[st];ft=ht[st];for(let zt=0,St=xt.length;zt<St;zt++){let R=X(xt[zt],ft[zt],Ft);ut(R.x,R.y,-L)}}}let qt=m+v;for(let et=0;et<H;et++){let pt=d?X(M[et],Ut[et],qt):M[et];y?(S.copy(I.normals[0]).multiplyScalar(pt.x),T.copy(I.binormals[0]).multiplyScalar(pt.y),P.copy(_[0]).add(S).add(T),ut(P.x,P.y,P.z)):ut(pt.x,pt.y,0)}for(let et=1;et<=h;et++)for(let pt=0;pt<H;pt++){let L=d?X(M[pt],Ut[pt],qt):M[pt];y?(S.copy(I.normals[et]).multiplyScalar(L.x),T.copy(I.binormals[et]).multiplyScalar(L.y),P.copy(_[et]).add(S).add(T),ut(P.x,P.y,P.z)):ut(L.x,L.y,u/h*et)}for(let et=g-1;et>=0;et--){let pt=et/g,L=f*Math.cos(pt*Math.PI/2),Ft=m*Math.sin(pt*Math.PI/2)+v;for(let st=0,It=z.length;st<It;st++){let xt=X(z[st],ct[st],Ft);ut(xt.x,xt.y,u+L)}for(let st=0,It=C.length;st<It;st++){let xt=C[st];ft=ht[st];for(let zt=0,St=xt.length;zt<St;zt++){let R=X(xt[zt],ft[zt],Ft);y?ut(R.x,R.y+_[h-1].y,_[h-1].x+L):ut(R.x,R.y,u+L)}}}K(),it();function K(){let et=s.length/3;if(d){let pt=0,L=H*pt;for(let Ft=0;Ft<J;Ft++){let st=N[Ft];At(st[2]+L,st[1]+L,st[0]+L)}pt=h+g*2,L=H*pt;for(let Ft=0;Ft<J;Ft++){let st=N[Ft];At(st[0]+L,st[1]+L,st[2]+L)}}else{for(let pt=0;pt<J;pt++){let L=N[pt];At(L[2],L[1],L[0])}for(let pt=0;pt<J;pt++){let L=N[pt];At(L[0]+H*h,L[1]+H*h,L[2]+H*h)}}n.addGroup(et,s.length/3-et,0)}function it(){let et=s.length/3,pt=0;gt(z,pt),pt+=z.length;for(let L=0,Ft=C.length;L<Ft;L++){let st=C[L];gt(st,pt),pt+=st.length}n.addGroup(et,s.length/3-et,1)}function gt(et,pt){let L=et.length;for(;--L>=0;){let Ft=L,st=L-1;st<0&&(st=et.length-1);for(let It=0,xt=h+g*2;It<xt;It++){let zt=H*It,St=H*(It+1),R=pt+Ft+zt,E=pt+st+zt,G=pt+st+St,V=pt+Ft+St;Bt(R,E,G,V)}}}function ut(et,pt,L){l.push(et),l.push(pt),l.push(L)}function At(et,pt,L){Zt(et),Zt(pt),Zt(L);let Ft=s.length/3,st=x.generateTopUV(n,s,Ft-3,Ft-2,Ft-1);te(st[0]),te(st[1]),te(st[2])}function Bt(et,pt,L,Ft){Zt(et),Zt(pt),Zt(Ft),Zt(pt),Zt(L),Zt(Ft);let st=s.length/3,It=x.generateSideWallUV(n,s,st-6,st-3,st-2,st-1);te(It[0]),te(It[1]),te(It[3]),te(It[1]),te(It[2]),te(It[3])}function Zt(et){s.push(l[et*3+0]),s.push(l[et*3+1]),s.push(l[et*3+2])}function te(et){r.push(et.x),r.push(et.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return X_(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new hu[s.type]().fromJSON(s)),new i(n,t.options)}},W_={generateTopUV:function(i,t,e,n,s){let r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new nt(r,o),new nt(a,l),new nt(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){let o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[s*3],f=t[s*3+1],m=t[s*3+2],v=t[r*3],g=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new nt(o,1-l),new nt(c,1-u),new nt(d,1-m),new nt(v,1-p)]:[new nt(a,1-l),new nt(h,1-u),new nt(f,1-m),new nt(g,1-p)]}};function X_(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var No=class i extends du{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}};var vi=class i extends de{constructor(t=new cn([new nt(0,.5),new nt(-.5,-.5),new nt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],s=[],r=[],o=[],a=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new $t(s,3)),this.setAttribute("normal",new $t(r,3)),this.setAttribute("uv",new $t(o,2));function c(h){let u=s.length/3,d=h.extractPoints(e),f=d.shape,m=d.holes;vs.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){let x=m[g];vs.isClockWise(x)===!0&&(m[g]=x.reverse())}let v=vs.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){let x=m[g];f=f.concat(x)}for(let g=0,p=f.length;g<p;g++){let x=f[g];s.push(x.x,x.y,0),r.push(0,0,1),o.push(x.x,x.y)}for(let g=0,p=v.length;g<p;g++){let x=v[g],_=x[0]+u,y=x[1]+u,I=x[2]+u;n.push(_,y,I),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return q_(e,t)}static fromJSON(t,e){let n=[];for(let s=0,r=t.shapes.length;s<r;s++){let o=e[t.shapes[s]];n.push(o)}return new i(n,t.curveSegments)}};function q_(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){let s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}var _e=class i extends de{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new A,d=new A,f=[],m=[],v=[],g=[];for(let p=0;p<=n;p++){let x=[],_=p/n,y=0;p===0&&o===0?y=.5/e:p===n&&l===Math.PI&&(y=-.5/e);for(let I=0;I<=e;I++){let T=I/e;u.x=-t*Math.cos(s+T*r)*Math.sin(o+_*a),u.y=t*Math.cos(o+_*a),u.z=t*Math.sin(s+T*r)*Math.sin(o+_*a),m.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),g.push(T+y,1-_),x.push(c++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<e;x++){let _=h[p][x+1],y=h[p][x],I=h[p+1][x],T=h[p+1][x+1];(p!==0||o>0)&&f.push(_,y,T),(p!==n-1||l<Math.PI)&&f.push(y,I,T)}this.setIndex(f),this.setAttribute("position",new $t(m,3)),this.setAttribute("normal",new $t(v,3)),this.setAttribute("uv",new $t(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Vn=class i extends de{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new A,u=new A,d=new A;for(let f=0;f<=n;f++)for(let m=0;m<=s;m++){let v=m/s*r,g=f/n*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(v),u.y=(t+e*Math.cos(g))*Math.sin(v),u.z=e*Math.sin(g),a.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/s),c.push(f/n)}for(let f=1;f<=n;f++)for(let m=1;m<=s;m++){let v=(s+1)*f+m-1,g=(s+1)*(f-1)+m-1,p=(s+1)*(f-1)+m,x=(s+1)*f+m;o.push(v,g,x),o.push(g,p,x)}this.setIndex(o),this.setAttribute("position",new $t(a,3)),this.setAttribute("normal",new $t(l,3)),this.setAttribute("uv",new $t(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var pe=class extends Ci{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Dt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Dt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zu,this.normalScale=new nt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},xi=class extends pe{static get type(){return"MeshPhysicalMaterial"}constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new nt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return rn(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Dt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Dt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Dt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var rl=class extends Ci{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new Dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Dt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zu,this.normalScale=new nt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.combine=Lu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function Ia(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Y_(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Or=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},mu=class extends Or{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Jd,endingEnd:Jd}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case jd:r=t,a=2*e-n;break;case Qd:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case jd:o=t,l=2*n-e;break;case Qd:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-e)/(s-e),v=m*m,g=v*m,p=-d*g+2*d*v-d*m,x=(1+d)*g+(-1.5-2*d)*v+(-.5+d)*m+1,_=(-1-f)*g+(1.5+f)*v+.5*m,y=f*g-f*v;for(let I=0;I!==a;++I)r[I]=p*o[h+I]+x*o[c+I]+_*o[l+I]+y*o[u+I];return r}},gu=class extends Or{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},vu=class extends Or{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},yi=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ia(e,this.TimeBufferType),this.values=Ia(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Ia(t.times,Array),values:Ia(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new vu(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new gu(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new mu(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Ha:e=this.InterpolantFactoryMethodDiscrete;break;case Hh:e=this.InterpolantFactoryMethodLinear;break;case Mc:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ha;case this.InterpolantFactoryMethodLinear:return Hh;case this.InterpolantFactoryMethodSmooth:return Mc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&Y_(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Mc,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let u=a*n,d=u-n,f=u+n;for(let m=0;m!==n;++m){let v=e[u+m];if(v!==e[d+m]||v!==e[f+m]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};yi.prototype.TimeBufferType=Float32Array;yi.prototype.ValueBufferType=Float32Array;yi.prototype.DefaultInterpolation=Hh;var qs=class extends yi{constructor(t,e,n){super(t,e,n)}};qs.prototype.ValueTypeName="bool";qs.prototype.ValueBufferType=Array;qs.prototype.DefaultInterpolation=Ha;qs.prototype.InterpolantFactoryMethodLinear=void 0;qs.prototype.InterpolantFactoryMethodSmooth=void 0;var xu=class extends yi{};xu.prototype.ValueTypeName="color";var yu=class extends yi{};yu.prototype.ValueTypeName="number";var _u=class extends Or{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)qe.slerpFlat(r,0,o,c-a,o,c,l);return r}},ol=class extends yi{InterpolantFactoryMethodLinear(t){return new _u(this.times,this.values,this.getValueSize(),t)}};ol.prototype.ValueTypeName="quaternion";ol.prototype.InterpolantFactoryMethodSmooth=void 0;var Ys=class extends yi{constructor(t,e,n){super(t,e,n)}};Ys.prototype.ValueTypeName="string";Ys.prototype.ValueBufferType=Array;Ys.prototype.DefaultInterpolation=Ha;Ys.prototype.InterpolantFactoryMethodLinear=void 0;Ys.prototype.InterpolantFactoryMethodSmooth=void 0;var Mu=class extends yi{};Mu.prototype.ValueTypeName="vector";var bu=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],m=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null}}},Z_=new bu,Eu=class{constructor(t){this.manager=t!==void 0?t:Z_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};Eu.DEFAULT_MATERIAL_NAME="__DEFAULT";var zr=class extends on{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Dt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},Gr=class extends zr{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(on.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Dt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},jc=new jt,ap=new A,lp=new A,Ho=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new nt(512,512),this.map=null,this.mapPass=null,this.matrix=new jt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Co,this._frameExtents=new nt(1,1),this._viewportCount=1,this._viewports=[new Ae(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;ap.setFromMatrixPosition(t.matrixWorld),e.position.copy(ap),lp.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(lp),e.updateMatrixWorld(),jc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(jc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(jc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},wu=class extends Ho{constructor(){super(new je(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){let e=this.camera,n=Ur*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}},al=class extends zr{constructor(t,e,n=0,s=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(on.DEFAULT_UP),this.updateMatrix(),this.target=new on,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new wu}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},cp=new jt,xo=new A,Qc=new A,Su=class extends Ho{constructor(){super(new je(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new nt(4,2),this._viewportCount=6,this._viewports=[new Ae(2,1,1,1),new Ae(0,1,1,1),new Ae(3,1,1,1),new Ae(1,1,1,1),new Ae(3,0,1,1),new Ae(1,0,1,1)],this._cubeDirections=[new A(1,0,0),new A(-1,0,0),new A(0,0,1),new A(0,0,-1),new A(0,1,0),new A(0,-1,0)],this._cubeUps=[new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,0,1),new A(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),xo.setFromMatrixPosition(t.matrixWorld),n.position.copy(xo),Qc.copy(n.position),Qc.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Qc),n.updateMatrixWorld(),s.makeTranslation(-xo.x,-xo.y,-xo.z),cp.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(cp)}},ll=class extends zr{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Su}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},Tu=class extends Ho{constructor(){super(new Hr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Vr=class extends zr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(on.DEFAULT_UP),this.updateMatrix(),this.target=new on,this.shadow=new Tu}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var Xu="\\[\\]\\.:\\/",K_=new RegExp("["+Xu+"]","g"),qu="[^"+Xu+"]",$_="[^"+Xu.replace("\\.","")+"]",J_=/((?:WC+[\/:])*)/.source.replace("WC",qu),j_=/(WCOD+)?/.source.replace("WCOD",$_),Q_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",qu),tM=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",qu),eM=new RegExp("^"+J_+j_+Q_+tM+"$"),nM=["material","materials","bones","map"],Au=class{constructor(t,e,n){let s=n||He.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},He=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(K_,"")}static parseTrackName(t){let e=eM.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);nM.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};He.Composite=Au;He.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};He.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};He.prototype.GetterByBindingType=[He.prototype._getValue_direct,He.prototype._getValue_array,He.prototype._getValue_arrayElement,He.prototype._getValue_toArray];He.prototype.SetterByBindingTypeAndVersioning=[[He.prototype._setValue_direct,He.prototype._setValue_direct_setNeedsUpdate,He.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[He.prototype._setValue_array,He.prototype._setValue_array_setNeedsUpdate,He.prototype._setValue_array_setMatrixWorldNeedsUpdate],[He.prototype._setValue_arrayElement,He.prototype._setValue_arrayElement_setNeedsUpdate,He.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[He.prototype._setValue_fromArray,He.prototype._setValue_fromArray_setNeedsUpdate,He.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Tb=new Float32Array(1);typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ru}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ru);var _i={uCurve:{value:new nt(0,0)}},iM=`
vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
  mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
  mvPosition = instanceMatrix * mvPosition;
#endif
vec4 cwWorld = modelMatrix * mvPosition;
float cwD = cwWorld.z;
float cwB = cwD * cwD / (1.0 + abs(cwD) * CURVE_K);
cwWorld.x += uCurve.x * cwB;
cwWorld.y += uCurve.y * cwB;
mvPosition = viewMatrix * cwWorld;
gl_Position = projectionMatrix * mvPosition;
`,fl=1/700,kp="#define CURVE_K "+fl.toFixed(8)+`
`,pl=kp+`
uniform vec2 uCurve;
vec4 curveWorld(vec4 w) {
  float d = w.z;
  float b = d * d / (1.0 + abs(d) * CURVE_K);
  w.x += uCurve.x * b;
  w.y += uCurve.y * b;
  return w;
}
`;function Ii(i){return i.onBeforeCompile=t=>{t.uniforms.uCurve=_i.uCurve,t.vertexShader=kp+`uniform vec2 uCurve;
`+t.vertexShader.replace("#include <project_vertex>",iM)},i.customProgramCacheKey=()=>"curved-world",i}function Up(i){let t=i.z,e=t*t/(1+Math.abs(t)*fl);return i.x+=_i.uCurve.value.x*e,i.y+=_i.uCurve.value.y*e,i}var lt={std(i){return Ii(new pe(i))},lambert(i){return Ii(new rl(i))},basic(i){return Ii(new dn(i))},phys(i){return Ii(new xi(i))}};var Jt=(i,t,e)=>i<t?t:i>e?e:i,Qt=(i,t,e)=>i+(t-i)*e;var xn=(i,t,e)=>{let n=Jt((e-i)/(t-i),0,1);return n*n*(3-2*n)},Tt=(i=0,t=1)=>i+Math.random()*(t-i),Yr=(i,t)=>Math.floor(Tt(i,t+1)),ee=i=>i[Math.floor(Math.random()*i.length)],ge=i=>Math.random()<i,Hn=(i,t,e,n)=>Qt(i,t,1-Math.exp(-e*n)),Ku=i=>i<.5?2*i*i:1-Math.pow(-2*i+2,2)/2;function Bo(i,t){let e=0;for(let s of i)e+=t(s);let n=Math.random()*e;for(let s of i)if(n-=t(s),n<=0)return s;return i[i.length-1]}function Np(i){let t=i.slice();for(let e=t.length-1;e>0;e--){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}var Yu=new Map;function ml(i,t){let e=i+":"+t;return Yu.has(e)||Yu.set(e,new Intl.NumberFormat("de-DE",{minimumFractionDigits:i,maximumFractionDigits:t})),Yu.get(e)}var hn=(i,t=0)=>ml(t,t).format(i),Li=(i,t=2)=>ml(t,t).format(i/1e3)+" km",$u=(i,t=0)=>ml(t,t).format(i)+"\xA0\u20AC",Ze=i=>ml(2,2).format(i)+"\xA0\u20AC";function Zr(i){let t=Math.floor(i)%1440,e=Math.floor(t/60),n=t%60;return String(e).padStart(2,"0")+":"+String(n).padStart(2,"0")}function Fo(i){let t=Math.max(0,Math.round(i));return Math.floor(t/60)+":"+String(t%60).padStart(2,"0")}function Wn(i){let t=i>>>0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function Zu(i,t=0){let e=Math.floor(i),n=i-e,s=o=>{let a=Math.sin((o+t*101.3)*127.1)*43758.5453;return a-Math.floor(a)},r=n*n*(3-2*n);return Qt(s(e),s(e+1),r)*2-1}function Ms(i,t=0){return Zu(i,t)*.6+Zu(i*2.13,t+7)*.3+Zu(i*4.7,t+13)*.1}var Bp=8;function Fp(i){Bp=i}function yn(i,t){let e=document.createElement("canvas");return e.width=i,e.height=t,e}function Tn(i,{repeat:t=!1,srgb:e=!0,aniso:n=!0}={}){let s=new Ce(i);return e&&(s.colorSpace=ce),t&&(s.wrapS=s.wrapT=Ki),n&&(s.anisotropy=Bp),s.needsUpdate=!0,s}function ju(i,t,e,n,s,r=1,o=1){let a=Wn(r),l=i.getImageData(0,0,t,e),c=l.data;for(let h=0;h<e;h+=o)for(let u=0;u<t;u+=o){let d=(a()-.5)*s;for(let f=0;f<o&&h+f<e;f++)for(let m=0;m<o&&u+m<t;m++){let v=((h+f)*t+(u+m))*4;c[v]=n[0]+d,c[v+1]=n[1]+d,c[v+2]=n[2]+d,c[v+3]=255}}i.putImageData(l,0,0)}var bt={laneWidth:3.75,lanes:4,left:-8.25,right:10.5,width:18.75,texLength:36,laneCenter:i=>-5.625+i*3.75};function Op(){let e=yn(512,1024),n=e.getContext("2d");ju(n,512,1024,[88,89,92],26,7,1);let s=c=>(c-bt.left)/bt.width*512,r=c=>c/bt.texLength*1024,o=Wn(42);for(let c=0;c<18;c++){let h=o()<.5?64:112;n.fillStyle=`rgba(${h},${h},${h+4},${.1+o()*.1})`;let u=o()*512,d=o()*1024;n.fillRect(u,d,20+o()*90,30+o()*160)}for(let c=0;c<4;c++){let h=bt.laneCenter(c);for(let u of[-.85,.85]){let d=n.createLinearGradient(s(h+u-.4),0,s(h+u+.4),0);d.addColorStop(0,"rgba(40,40,44,0)"),d.addColorStop(.5,"rgba(40,40,44,0.32)"),d.addColorStop(1,"rgba(40,40,44,0)"),n.fillStyle=d,n.fillRect(s(h+u-.4),0,s(h+u+.4)-s(h+u-.4),1024)}}n.fillStyle="rgba(140,140,140,0.08)",n.fillRect(s(7.5),0,s(bt.right)-s(7.5),1024);let a="#eceae2";n.fillStyle=a;for(let c=1;c<4;c++){let h=-7.5+c*3.75;for(let u=0;u<bt.texLength;u+=18)n.fillRect(s(h-.075),r(u),s(h+.075)-s(h-.075),r(6))}n.fillRect(s(-7.5-.3),0,s(-7.5)-s(-7.8),1024),n.fillRect(s(7.5),0,s(7.8)-s(7.5),1024),n.fillRect(s(bt.right-.35),0,s(bt.right-.15)-s(bt.right-.35),1024),n.globalAlpha=.25,zp(n,512,1024,3e3,"rgba(70,70,74,1)",13),n.globalAlpha=1;let l=Tn(e,{repeat:!0});return l.repeat.set(1,1),l}function zp(i,t,e,n,s,r){let o=Wn(r);i.fillStyle=s;for(let a=0;a<n;a++)i.fillRect(o()*t,o()*e,1+o()*2,1+o()*2)}function Gp(){let t=yn(1024,1024),e=t.getContext("2d"),n=Wn(99);e.fillStyle="#5f8a3a",e.fillRect(0,0,1024,1024);let s=["#6a9a3c","#7fae45","#5a8434","#c9b24a","#e1cf3a","#8a9a4a","#6f8f3c","#a08a52","#b6a35a","#4f7a30"],r=0;for(;r<1024;){let o=60+n()*180,a=0;for(;a<1024;){let l=80+n()*260;e.fillStyle=s[Math.floor(n()*s.length)],e.fillRect(a,r,l,o),e.strokeStyle="rgba(0,0,0,0.06)",e.lineWidth=2;let c=n()<.5;for(let h=0;h<(c?l:o);h+=7)e.beginPath(),c?(e.moveTo(a+h,r),e.lineTo(a+h,r+o)):(e.moveTo(a,r+h),e.lineTo(a+l,r+h)),e.stroke();a+=l}r+=o}e.strokeStyle="rgba(190,175,140,0.6)",e.lineWidth=5;for(let o=0;o<4;o++)e.beginPath(),e.moveTo(n()*1024,0),e.lineTo(n()*1024,1024),e.stroke();return e.globalAlpha=.18,zp(e,1024,1024,2e4,"rgba(30,50,20,1)",5),e.globalAlpha=1,Tn(t,{repeat:!0})}function vl(){let t=yn(256,256),e=t.getContext("2d");return ju(e,256,256,[92,128,58],34,3,2),Tn(t,{repeat:!0})}function Vp(){let i=yn(64,64),t=i.getContext("2d"),e=t.createLinearGradient(0,0,0,64);return e.addColorStop(0,"#c9ccd0"),e.addColorStop(.18,"#8d9296"),e.addColorStop(.35,"#dfe2e5"),e.addColorStop(.5,"#9aa0a5"),e.addColorStop(.65,"#e2e4e6"),e.addColorStop(.82,"#8b9094"),e.addColorStop(1,"#bfc3c7"),t.fillStyle=e,t.fillRect(0,0,64,64),t.fillStyle="rgba(60,60,60,0.5)",t.fillRect(30,26,4,12),Tn(i,{repeat:!0})}var Ju=new Map;function xl(i){if(Ju.has(i))return Ju.get(i);let t=yn(256,56),e=t.getContext("2d");e.fillStyle="#f5f5f0",e.fillRect(0,0,256,56),e.strokeStyle="#111",e.lineWidth=3,e.strokeRect(2,2,252,52),e.fillStyle="#1d3f9a",e.fillRect(3,3,26,50),e.fillStyle="#ffd400",e.beginPath(),e.arc(16,18,7,0,Math.PI*2),e.setLineDash([2,2]),e.strokeStyle="#ffd400",e.lineWidth=2,e.stroke(),e.setLineDash([]),e.fillStyle="#fff",e.font="bold 15px Arial",e.textAlign="center",e.fillText("D",16,47),e.fillStyle="#111",e.font='bold 38px "DIN Alternate", "Arial Narrow", Arial, sans-serif',e.textBaseline="middle",e.fillText(i,142,30);let n=Tn(t);return Ju.set(i,n),n}function Kr({w:i=512,h:t=512,bg:e=null,color:n="#f4f4f4"}={}){let s=yn(i,t),r=s.getContext("2d");e&&(r.fillStyle=e,r.fillRect(0,0,i,t)),r.fillStyle=n;let o=t*.5,a=[[.18,.1,.12],[.29,.07,.2],[.37,.06,.28],[.44,.08,.36],[.53,.06,.3],[.6,.07,.22],[.68,.06,.26],[.75,.08,.15]];for(let[c,h,u]of a)r.fillRect(i*c,o-t*u,i*h,t*u);return r.fillRect(i*.39,o-t*.36,i*.012,t*.08),r.fillRect(i*.15,o,i*.7,t*.025),r.font=`900 ${Math.round(t*.3)}px "Arial Black", Impact, sans-serif`,r.textAlign="center",r.textBaseline="top",r.fillText("LIVE",i/2,o+t*.05),Tn(s)}function Wp(){let i=yn(1024,64),t=i.getContext("2d");t.fillStyle="#3b2c22",t.fillRect(0,0,1024,64);let e=Wn(5);for(let n=0;n<90;n++){t.strokeStyle=`rgba(${20+e()*40},${15+e()*25},${10+e()*15},${.3+e()*.4})`,t.lineWidth=1+e()*2,t.beginPath();let s=e()*64;t.moveTo(0,s);for(let r=0;r<=1024;r+=64)t.lineTo(r,s+Math.sin(r*.01+n)*3+(e()-.5)*2);t.stroke()}return Tn(i,{repeat:!0})}function yl(i=1){let e=yn(128,128),n=e.getContext("2d");return ju(n,128,128,[200,200,200],70,i,1),Tn(e,{repeat:!0,srgb:!1})}function Xp(){let t=yn(256,256),e=t.getContext("2d");e.fillStyle="#1b1c1e",e.fillRect(0,0,256,256);let n=256/2,s=e.createRadialGradient(n,n,10,n,n,n);s.addColorStop(0,"#9da2a7"),s.addColorStop(.75,"#7c8186"),s.addColorStop(1,"#4b4f53"),e.fillStyle=s,e.beginPath(),e.arc(n,n,n*.92,0,Math.PI*2),e.fill(),e.strokeStyle="rgba(30,30,30,0.6)",e.lineWidth=6;for(let r=0;r<5;r++){let o=r/5*Math.PI*2;e.beginPath(),e.moveTo(n+Math.cos(o)*30,n+Math.sin(o)*30),e.quadraticCurveTo(n+Math.cos(o+.5)*80,n+Math.sin(o+.5)*80,n+Math.cos(o+.9)*112,n+Math.sin(o+.9)*112),e.stroke()}return e.fillStyle="#2a2c2e",e.beginPath(),e.arc(n,n,20,0,Math.PI*2),e.fill(),Tn(t)}function qp(){let t=yn(64,64),e=t.getContext("2d"),n=e.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.5,"rgba(255,255,255,0.4)"),n.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=n,e.fillRect(0,0,64,64),Tn(t,{aniso:!1})}var gl=null;function _l(){if(gl)return gl;let i=64,t=128,e=yn(i,t),n=e.getContext("2d"),s=n.createImageData(i,t);for(let r=0;r<t;r++)for(let o=0;o<i;o++){let a=Math.abs((o+.5)/i*2-1),l=Math.abs((r+.5)/t*2-1),c=Math.pow(Math.pow(a,5)+Math.pow(l,5),1/5),h=Math.min(1,Math.max(0,(1-c)/.42)),u=h*h*(3-2*h);s.data[(r*i+o)*4+3]=Math.round(u*255)}return n.putImageData(s,0,0),gl=Tn(e,{aniso:!1,srgb:!1}),gl}function $r(i,{w:t=512,h:e=256,bg:n="#1452a8",fg:s="#ffffff",border:r=!0,arrows:o=null}={}){let a=yn(t,e),l=a.getContext("2d");l.fillStyle=n,ze(l,0,0,t,e,18),l.fill(),r&&(l.strokeStyle=s,l.lineWidth=7,ze(l,10,10,t-20,e-20,12),l.stroke()),l.fillStyle=s,l.textBaseline="middle";let c=i.length,h=(e-40)/Math.max(1,c);return i.forEach((u,d)=>{let f=20+h*(d+.5),m=Math.min(h*.62,64);l.font=`bold ${m}px "DIN Alternate", "Arial Narrow", Arial, sans-serif`,typeof u=="string"?(l.textAlign="left",Hp(l,u,34,f,t-68)):(l.textAlign="left",Hp(l,u.left,34,f,t*.68),u.right&&(l.textAlign="right",l.fillText(u.right,t-34,f)))}),o&&(l.strokeStyle=s,l.lineWidth=9,o.forEach(u=>{let d=t*u;l.beginPath(),l.moveTo(d,e-26),l.lineTo(d,e-70),l.stroke(),l.beginPath(),l.moveTo(d-14,e-58),l.lineTo(d,e-76),l.lineTo(d+14,e-58),l.stroke()})),Tn(a)}function Hp(i,t,e,n,s){let r=parseFloat(i.font.match(/(\d+(\.\d+)?)px/)[1]);for(;i.measureText(t).width>s&&r>12;)r-=2,i.font=i.font.replace(/\d+(\.\d+)?px/,r+"px");i.fillText(t,e,n)}function ze(i,t,e,n,s,r){i.beginPath(),i.moveTo(t+r,e),i.arcTo(t+n,e,t+n,e+s,r),i.arcTo(t+n,e+s,t,e+s,r),i.arcTo(t,e+s,t,e,r),i.arcTo(t,e,t+n,e,r),i.closePath()}function Yp(i,t){let s=yn(512,320),r=s.getContext("2d");return r.fillStyle="#6b3d22",ze(r,0,0,512,320,16),r.fill(),r.strokeStyle="#fff",r.lineWidth=6,ze(r,10,10,492,300,10),r.stroke(),r.fillStyle="#fff",r.textAlign="center",r.textBaseline="middle",r.font="bold 44px Arial, sans-serif",Oo(r,i,512/2,320*.42,452),r.font="30px Arial, sans-serif",Oo(r,t,512/2,320*.72,452),Tn(s)}function Oo(i,t,e,n,s){let r=parseFloat(i.font.match(/(\d+(\.\d+)?)px/)[1]);for(;i.measureText(t).width>s&&r>12;)r-=2,i.font=i.font.replace(/\d+(\.\d+)?px/,r+"px");i.fillText(t,e,n)}function Zp(i){let e=yn(256,256),n=e.getContext("2d");if(n.clearRect(0,0,256,256),i==="ende"){n.fillStyle="#fff",n.beginPath(),n.arc(128,128,120,0,Math.PI*2),n.fill(),n.strokeStyle="#222",n.lineWidth=4,n.stroke(),n.save(),n.beginPath(),n.arc(128,128,116,0,Math.PI*2),n.clip(),n.strokeStyle="#333",n.lineWidth=8;for(let s=-5;s<=5;s++)n.beginPath(),n.moveTo(40+s*14,236),n.lineTo(236+s*14,40),n.stroke();n.restore()}else n.fillStyle="#d4141b",n.beginPath(),n.arc(128,128,122,0,Math.PI*2),n.fill(),n.fillStyle="#fff",n.beginPath(),n.arc(128,128,92,0,Math.PI*2),n.fill(),n.fillStyle="#111",n.font='bold 92px "DIN Alternate", Arial, sans-serif',n.textAlign="center",n.textBaseline="middle",n.fillText(String(i),128,134);return Tn(e)}function Kp(i,t,e="#f2f2f2",n="#c8102e"){let o=yn(1024,256),a=o.getContext("2d");a.fillStyle=e,a.fillRect(0,0,1024,256);for(let l=0;l<1024;l+=64)a.fillStyle="rgba(0,0,0,0.05)",a.fillRect(l,0,6,256);return a.fillStyle=n,a.fillRect(0,222,1024,20),a.fillStyle=n,a.font='italic 900 92px "Arial Black", Arial, sans-serif',a.textAlign="center",a.textBaseline="middle",Oo(a,i,1024/2,256*.4,944),a.fillStyle="#333",a.font="bold 34px Arial, sans-serif",Oo(a,t,1024/2,256*.72,904),Tn(o)}function $p(i="Abstand halten!"){let n=yn(256,256),s=n.getContext("2d");s.fillStyle="#e9e9e4",s.fillRect(0,0,256,256),s.fillStyle="#c9c9c4",s.fillRect(256/2-2,0,4,256),s.strokeStyle="#9a9a96",s.lineWidth=6,s.strokeRect(6,6,244,244),s.fillStyle="#333",s.font="bold 22px Arial, sans-serif",s.textAlign="center",Oo(s,i,256/2,256*.3,226);for(let r=0;r<256;r+=32)s.fillStyle=r/32%2?"#d01818":"#ffffff",s.fillRect(r,230,32,18);return Tn(n)}function Jp(){let t=yn(64,64),e=t.getContext("2d"),n=e.createImageData(64,64);for(let s=0;s<64;s++)for(let r=0;r<64;r++){let o=(r-32+.5)/32,a=(s-64/2+.5)/(64/2),l=o*o+a*a,c=(s*64+r)*4;if(l<1){let h=Math.sqrt(1-l);n.data[c]=128+o*127*(1-h*.3),n.data[c+1]=128+a*127*(1-h*.3),n.data[c+2]=255*Math.min(1,h*1.6),n.data[c+3]=255*Math.min(1,(1-l)*4)}else n.data[c+3]=0}return e.putImageData(n,0,0),t}var Ks=-9,Xn=i=>2*Ks-i,Qu=140,jp=1700,td=new Dt(1,1,1);function sM(i=Qu,t=jp){let e=[],n=i;for(;n>-t;)e.push(n),n-=2+Math.abs(n)*.018;return e.push(-t),e}var rM=sM();function zo(i,t=rM){let e=[],n=[],s=[],r=0;for(let a of i){let{a:l,b:c,uv:h}=a;for(let u=0;u<t.length;u++){let d=t[u];e.push(l[0],l[1],d,c[0],c[1],d);let f=h(l[0],l[1],d,0),m=h(c[0],c[1],d,1);n.push(f[0],f[1],m[0],m[1])}for(let u=0;u<t.length-1;u++){let d=r+u*2;a.flip?s.push(d,d+2,d+1,d+1,d+2,d+3):s.push(d,d+1,d+2,d+1,d+3,d+2)}r+=t.length*2}let o=new de;return o.setAttribute("position",new $t(e,3)),o.setAttribute("uv",new $t(n,2)),o.setIndex(s),o.computeVertexNormals(),o}var Ml=class{constructor(t){this.group=new wt,this.group.name="Road",t.add(this.group),this.s=0,this.wet=0,this.roadTex=Op(),this.roadMat=lt.std({map:this.roadTex,roughness:.88,metalness:0,envMapIntensity:.6});let e=bt.texLength,n=(H,J,W)=>[(H-bt.left)/bt.width,-W/e],s=(H,J,W)=>[(Xn(H)-bt.left)/bt.width,-W/e],r=zo([{a:[bt.left,0],b:[bt.right,0],uv:n},{a:[Xn(bt.right),0],b:[Xn(bt.left),0],uv:s}]);this.road=new D(r,this.roadMat),this.road.receiveShadow=!0,this.road.frustumCulled=!1,this.group.add(this.road),this.grassTex=vl(),this.grassTex.repeat.set(1,1),this.grassMat=lt.lambert({map:this.grassTex}),this.grassMat.color=td;let o=(H,J,W)=>[H/6,-W/6],a=zo([{a:[bt.right,0],b:[bt.right+3.2,.15],uv:o},{a:[bt.right+3.2,.15],b:[36,.25],uv:o},{a:[Xn(bt.left),0],b:[bt.left,0],uv:o},{a:[-52,.25],b:[Xn(bt.right)-3.2,.15],uv:o},{a:[Xn(bt.right)-3.2,.15],b:[Xn(bt.right),0],uv:o}]);this.verge=new D(a,this.grassMat),this.verge.receiveShadow=!0,this.verge.frustumCulled=!1,this.group.add(this.verge),this.fieldTex=Gp(),this.fieldMat=lt.lambert({map:this.fieldTex});let l=(H,J,W)=>[H/160,-W/160],c=zo([{a:[36,.25],b:[420,.25],uv:l},{a:[420,.25],b:[2600,-6],uv:l},{a:[-420,.25],b:[-52,.25],uv:l},{a:[-2600,-6],b:[-420,.25],uv:l}]);this.ground=new D(c,this.fieldMat),this.ground.receiveShadow=!0,this.ground.frustumCulled=!1,this.group.add(this.ground),this.railTex=Vp(),this.railMat=lt.std({map:this.railTex,metalness:.75,roughness:.38,envMapIntensity:.9,side:he});let h=(H,J,W,ct)=>[-W/4,ct],u=[],d=(H,J)=>{u.push({a:[H,.52],b:[H,.84],uv:h,flip:J>0}),u.push({a:[H-.08*J,.84],b:[H,.84+.01],uv:h,flip:J<0})};d(Ks+.16,1),d(Ks-.16,-1),d(bt.right+.55,-1),d(Xn(bt.right)-.55,1),this.rails=new D(zo(u),this.railMat),this.rails.castShadow=!1,this.rails.receiveShadow=!0,this.rails.frustumCulled=!1,this.group.add(this.rails);let f=new Ht(.1,.8,.07);f.translate(0,.4,0);let m=lt.std({color:9343896,metalness:.6,roughness:.5});this.postSpacing=2;let v=[Ks,bt.right+.72,Xn(bt.right)-.72],g=Math.floor(700/this.postSpacing);this.posts=new gi(f,m,g*v.length);let p=new jt,x=0;for(let H of v)for(let J=0;J<g;J++)p.makeTranslation(H,0,Qu*.5-J*this.postSpacing),this.posts.setMatrixAt(x++,p);this.posts.frustumCulled=!1,this.posts.castShadow=!0,this.group.add(this.posts),this.delinSpacing=50;let _=new wt,y=new Ht(.12,1.09,.12);y.translate(0,.455,0);let I=new Ht(.13,.25,.13);I.translate(0,.82,0);let T=new fe(.05,.12);T.translate(0,.82,.075);let S=Math.ceil(jp*.6/this.delinSpacing),P=lt.std({color:15921902,roughness:.6}),b=lt.std({color:1118481,roughness:.6,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),M=lt.std({color:16752672,emissive:16742912,emissiveIntensity:.9,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),C=new gi(y,P,S),k=new gi(I,b,S),N=new gi(T,M,S);for(let H=0;H<S;H++)p.makeTranslation(bt.right+1.05,.12,Qu*.5-H*this.delinSpacing),C.setMatrixAt(H,p),k.setMatrixAt(H,p),N.setMatrixAt(H,p);for(let H of[C,k,N])H.frustumCulled=!1,_.add(H);this.delin=_,this.group.add(_),this.laneUniforms={uTime:{value:0},uS:{value:0},uOpacity:{value:0},uWarn:{value:0}};let z=new Ye({uniforms:{...this.laneUniforms,uCurve:{value:null}},vertexShader:pl+`
        varying vec2 vUv;
        varying float vDist;
        void main() {
          vUv = uv;
          vec4 w = modelMatrix * vec4(position, 1.0);
          vDist = -w.z;
          w = curveWorld(w);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,fragmentShader:`
        uniform float uTime;
        uniform float uS;
        uniform float uOpacity;
        uniform float uWarn;
        varying vec2 vUv;
        varying float vDist;
        void main() {
          float p = uS + vDist;
          float x = vUv.x * 2.0 - 1.0;
          float chev = fract((p + abs(x) * 2.2) / 7.0 - uTime * 0.35);
          chev = smoothstep(0.0, 0.08, chev) * (1.0 - smoothstep(0.18, 0.3, chev));
          float edge = smoothstep(0.82, 0.97, abs(x));
          float wave = exp(-abs(fract((p - uTime * 55.0) / 160.0) - 0.5) * 18.0);
          float a = 0.16 + chev * 0.42 + edge * 0.55 + wave * 0.35;
          float fade = smoothstep(2.0, 12.0, vDist + 6.0) * (1.0 - smoothstep(250.0, 650.0, vDist));
          vec3 col = mix(vec3(0.24, 0.55, 1.0), vec3(0.35, 1.0, 0.75), 0.35 + 0.35 * sin(uTime * 2.0));
          col = mix(col, vec3(1.0, 0.35, 0.2), uWarn);
          gl_FragColor = vec4(col * 1.6, a * fade * uOpacity);
        }`,transparent:!0,depthWrite:!1,blending:xs});z.uniforms.uCurve=_i.uCurve;let X=zo([{a:[bt.laneCenter(0)-1.8,.025],b:[bt.laneCenter(0)+1.8,.025],uv:H=>[(H-(bt.laneCenter(0)-1.8))/3.6,0]}]);this.lane=new D(X,z),this.lane.frustumCulled=!1,this.lane.renderOrder=1,this.lane.visible=!1,this.group.add(this.lane)}setWet(t){this.wet=t,this.roadMat.roughness=.88-t*.62,this.roadMat.color.setScalar(1-t*.42),this.roadMat.envMapIntensity=.6+t*.9,this.railMat.roughness=.38-t*.2,this.grassMat.color.setScalar(1-t*.25),this.fieldMat.color.setScalar(1-t*.28)}update(t,e,n,s,r=0){this.s=t,this.roadTex.offset.y=t/bt.texLength%1,this.grassTex.offset.y=t/6%1,this.fieldTex.offset.y=t/160%1,this.railTex.offset.x=t/4%1,this.posts.position.z=t%this.postSpacing,this.delin.position.z=t%this.delinSpacing,this.laneUniforms.uTime.value=n,this.laneUniforms.uS.value=t%1120,this.laneUniforms.uOpacity.value=s,this.laneUniforms.uWarn.value=r,this.lane.visible=s>.001}};var oM=`
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`,aM=`
uniform vec3 uSunDir;
uniform float uOvercast;
uniform vec2 uOffset;
uniform vec3 uFog;
varying vec3 vDir;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 zenith = vec3(0.13, 0.33, 0.82);
  vec3 horizon = vec3(0.62, 0.77, 0.95);
  vec3 col = mix(horizon, zenith, pow(clamp(h, 0.0, 1.0), 0.5));
  float sd = max(dot(d, uSunDir), 0.0);
  float clear = 1.0 - uOvercast;
  col += vec3(1.0, 0.82, 0.55) * pow(sd, 6.0) * 0.28 * clear;
  col += vec3(1.0, 0.92, 0.78) * pow(sd, 90.0) * 1.2 * clear;
  col += vec3(40.0, 35.0, 28.0) * smoothstep(0.99955, 0.9998, sd) * clear;
  if (h > 0.0) {
    vec2 p = d.xz / (h + 0.06) * 0.9 + uOffset;
    float cov = mix(0.56, 0.18, uOvercast);
    float n = fbm(p);
    float c = smoothstep(cov, cov + 0.28, n);
    float shade = 0.72 + 0.28 * fbm(p * 2.1 + 3.0);
    vec3 cloudCol = mix(vec3(1.05, 1.05, 1.08), vec3(0.42, 0.45, 0.5), uOvercast) * shade;
    cloudCol += vec3(1.0, 0.85, 0.6) * pow(sd, 5.0) * 0.5 * clear;
    col = mix(col, cloudCol, c * smoothstep(0.0, 0.1, h) * (0.85 + 0.15 * uOvercast));
  }
  vec3 gray = mix(vec3(0.36, 0.39, 0.44), vec3(0.52, 0.55, 0.6), smoothstep(-0.05, 0.6, h));
  col = mix(col, gray, uOvercast * 0.8);
  col = mix(col, uFog, smoothstep(0.06, -0.02, h));
  gl_FragColor = vec4(col, 1.0);
}`,bl=class{constructor(t,e,{shadows:n=!0,shadowSize:s=2048}={}){this.renderer=t,this.scene=e,this.overcast=0,this.sunDir=new A(.52,.6,.6).normalize(),this.fogClear=new Dt(.66,.78,.92),this.fogRain=new Dt(.43,.46,.5),this.fogColor=this.fogClear.clone(),this.uniforms={uSunDir:{value:this.sunDir},uOvercast:{value:0},uOffset:{value:new nt(0,0)},uFog:{value:this.fogColor}};let r=new Ye({uniforms:this.uniforms,vertexShader:oM,fragmentShader:aM,side:Sn,depthWrite:!1,depthTest:!0,fog:!1});this.dome=new D(new _e(3e3,40,20),r),this.dome.frustumCulled=!1,this.dome.renderOrder=-10,e.add(this.dome),e.fog=new Ka(this.fogColor,140,1550),e.fog.color=this.fogColor,this.sun=new Vr(16773340,3),this.sun.castShadow=n,this.sun.shadow.mapSize.set(s,s);let o=this.sun.shadow.camera;o.left=-55,o.right=55,o.top=60,o.bottom=-60,o.near=10,o.far=400,o.updateProjectionMatrix(),this.sun.shadow.bias=-5e-4,this.sun.shadow.normalBias=.04,e.add(this.sun),e.add(this.sun.target),this.hemi=new Gr(12901631,6253125,1.05),e.add(this.hemi),this.hills=this.buildHills(),e.add(this.hills),this.pmrem=new Br(t),this.envScene=new Pi;let a=new D(new _e(50,32,16),r);this.envScene.add(a),this.envGround=new D(new Gn(48,24).rotateX(-Math.PI/2),new dn({color:new Dt(.16,.17,.13)})),this.envGround.position.y=-2,this.envScene.add(this.envGround),this.envTarget=null,this.lastEnvOvercast=-1,this.updateEnv()}buildHills(){let n=[],s=[],r=[],o=new Dt().setRGB(.3,.42,.33,ce),a=new Dt().setRGB(.5,.6,.7,ce),l=d=>25+Math.max(0,Ms(d*.09,4)*.5+.5)*150+Math.max(0,Ms(d*.31,9))*40,c=48;for(let d=0;d<=320;d++){let f=d/320*Math.PI*2,m=Math.sin(f)*1950,v=-Math.cos(f)*1950,g=Math.max(0,(d-(320-c))/c),p=g>0?Qt(l(d),l(d-320),g*g*(3-2*g)):l(d);n.push(m,-40,v,m,p,v);let x=o.clone().lerp(a,.25),_=o.clone().lerp(a,.7+.2*Math.sin(d/320*Math.PI*6));if(s.push(x.r,x.g,x.b,_.r,_.g,_.b),d<320){let y=d*2;r.push(y,y+2,y+1,y+1,y+2,y+3)}}let h=new de;h.setAttribute("position",new $t(n,3)),h.setAttribute("color",new $t(s,3)),h.setIndex(r),this.hillMat=new dn({vertexColors:!0,fog:!1,side:he,transparent:!0,opacity:1});let u=new D(h,this.hillMat);return u.frustumCulled=!1,u.renderOrder=-5,u}updateEnv(){this.envTarget&&this.envTarget.dispose(),this.envTarget=this.pmrem.fromScene(this.envScene,.02,.1,100),this.scene.environment=this.envTarget.texture,this.lastEnvOvercast=this.overcast,this.onEnv&&this.onEnv(this.envTarget.texture)}setOvercast(t){this.overcast=Jt(t,0,1)}update(t,e,n,s){let r=this.overcast;this.uniforms.uOvercast.value=r;let o=this.uniforms.uOffset.value;o.x+=t*.004,o.y=-n*6e-4-s*.002,this.fogColor.copy(this.fogClear).lerp(this.fogRain,r);let a=this.scene.fog;a.near=Qt(140,18,r),a.far=Qt(1550,430,r),this.sun.intensity=Qt(3,.32,r),this.hemi.intensity=Qt(1.05,1.35,r),this.hemi.color.setRGB(Qt(.77,.6,r),Qt(.86,.64,r),Qt(1,.7,r)),this.hillMat.opacity=1-r,this.hillMat.color.setRGB(1,1,1).lerp(this.fogColor,.15+r*.6),this.hills.visible=r<.98,this.dome.position.copy(e.position);let l=h=>h*h/(1+h*fl),c=_i.uCurve.value;this.hills.position.set(e.position.x+c.x*l(1950)*.7,c.y*l(1950)*.8,0),this.sun.target.position.set(e.position.x*.5,0,-32),this.sun.position.copy(this.sun.target.position).addScaledVector(this.sunDir,200),this.envGround.material.color.setRGB(Qt(.16,.1,r),Qt(.17,.11,r),Qt(.13,.11,r)),Math.abs(r-this.lastEnvOvercast)>.12&&this.updateEnv()}};function Re(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new de,c=0;for(let h=0;h<i.length;++h){let u=i[h],d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(e){let h=0,u=[];for(let d=0;d<i.length;++d){let f=i[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=Qp(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let v=0;v<o[h].length;++v)f.push(o[h][v][d]);let m=Qp(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}return l}function Qp(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let o=new t(r),a=new Oe(o,e,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let u=l/e;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<e;m++){let v=h.getComponent(d,m);a.setComponent(d+u,m,v)}}else o.set(h.array,l);l+=h.count*e}return s!==void 0&&(a.gpuType=s),a}function Bn(i){let t=i.length;return e=>{if(e<=i[0][0])return i[0][1];if(e>=i[t-1][0])return i[t-1][1];let n=0;for(;n<t-2&&e>i[n+1][0];)n++;let s=i[Math.max(0,n-1)],r=i[n],o=i[n+1],a=i[Math.min(t-1,n+2)],l=o[0]-r[0],c=(e-r[0])/l,h=(o[1]-s[1])/(o[0]-s[0]||1)*l,u=(a[1]-r[1])/(a[0]-r[0]||1)*l,d=c*c,f=d*c;return(2*f-3*d+1)*r[1]+(f-2*d+c)*h+(-2*f+3*d)*o[1]+(f-d)*u}}function El(i,t,e=.4,n=.335){return s=>{let r=i(s);for(let o of t){let a=s-o;Math.abs(a)<e&&(r=Math.max(r,n+Math.sqrt(e*e-a*a)))}return r}}function wl(i,t=.5,e=.72){return(n,s,r)=>{let o=Math.abs(s);if(o<=t)return r;let a=Math.min(1,(o-t)/(e-t));return r+(i(n)-r)*a*a*(3-2*a)}}function Mi({w:i,b:t,t:e,tw:n=.9,bw:s=.96,n:r=4,L:o=4.7,bx:a=null},l,c,h=new A){let u=2/r,d=Math.cos(c),f=Math.sin(c),m=Math.sign(d)*Math.pow(Math.abs(d),u),v=Math.sign(f)*Math.pow(Math.abs(f),u),g=t(l),p=Math.max(e(l),g+.002),x=g+(v+1)/2*(p-g);a&&(x=Math.max(x,Math.min(a(l,m,g),p)));let _=v>0?Qt(1,n,v):Qt(1,s,-v);return h.set(m*i(l)*_,x,l-o/2)}function $s(i,t,{ns:e=6,nt:n=16,lift:s=.006,center:r=new A(0,.75,0)}={}){let o=[],a=[],l=new A,c=new A,h=new A,u=new A,d=.001;for(let p=0;p<=n;p++)for(let x=0;x<=e;x++){let[_,y]=t(x/e,p/n);i(_,y,l),i(_+d,y,c).sub(l),i(_,y+d,h).sub(l),u.crossVectors(c,h),u.lengthSq()<1e-14&&u.set(l.x,l.y-r.y,l.z-r.z),u.normalize(),u.x*l.x+u.y*(l.y-r.y)+u.z*(l.z-r.z)<0&&u.negate(),o.push(l.x+u.x*s,l.y+u.y*s,l.z+u.z*s)}for(let p=0;p<n;p++)for(let x=0;x<e;x++){let _=p*(e+1)+x,y=_+1,I=_+e+1,T=I+1;a.push(_,I,y,y,I,T)}let f=new de;f.setAttribute("position",new $t(o,3)),f.setIndex(a),f.computeVertexNormals();let m=new A().fromBufferAttribute(f.attributes.normal,Math.floor((e+1)*(n+1)/2)),v=new A().fromBufferAttribute(f.attributes.position,Math.floor((e+1)*(n+1)/2));if(m.x*v.x+m.y*(v.y-r.y)+m.z*(v.z-r.z)<0){let p=f.index.array;for(let x=0;x<p.length;x+=3){let _=p[x+1];p[x+1]=p[x+2],p[x+2]=_}f.computeVertexNormals()}let g=[];for(let p=0;p<=n;p++)for(let x=0;x<=e;x++)g.push(x/e,p/n);return f.setAttribute("uv",new $t(g,2)),f}function ed(i,t,e,n=.55){let s=[];for(let r=0;r<=e;r++){let o=r/e,a=(1-Math.cos(Math.PI*o))/2;s.push(i+(t-i)*Qt(o,a,n))}return s}var nd=(i,t)=>i/t*Math.PI*2-Math.PI/2;function Di({u0:i,u1:t,w:e,b:n,t:s,tw:r=.9,bw:o=.96,n:a=4,segs:l=80,ring:c=28,L:h=4.7,H:u=1.5,caps:d=!0,sampleEnds:f=.55,bx:m=null,capDome:v=0}){let g=[],p=[],x=[],_=ed(i,t,l,f),y=2/a,I=[];for(let k=0;k<c;k++){let N=nd(k,c),z=Math.cos(N),X=Math.sin(N);I.push([Math.sign(z)*Math.pow(Math.abs(z),y),Math.sign(X)*Math.pow(Math.abs(X),y)])}for(let k of _){let N=n(k),z=s(k),X=e(k),H=Math.max(z,N+.002);for(let[J,W]of I){let ct=N+(W+1)/2*(H-N);m&&(ct=Math.max(ct,Math.min(m(k,J,N),H)));let ht=W>0?Qt(1,r,W):Qt(1,o,-W),ft=J*X*ht;g.push(ft,ct,k-h/2),p.push(k/h,ct/u)}}for(let k=0;k<l;k++)for(let N=0;N<c;N++){let z=k*c+N,X=k*c+(N+1)%c,H=(k+1)*c+N,J=(k+1)*c+(N+1)%c;x.push(z,X,H,X,J,H)}let T=new de;if(T.setAttribute("position",new $t(g,3)),T.setAttribute("uv",new $t(p,2)),T.setIndex(x),T.computeVertexNormals(),!d)return T;let S=Array.from(T.attributes.position.array),P=Array.from(T.attributes.normal.array),b=Array.from(T.attributes.uv.array),M=(k,N)=>{let z=S.length/3,X=0,H=0,J=S[k*c*3+2],W=N?-1:1;for(let ht=0;ht<c;ht++){let ft=(k*c+ht)*3;if(X+=S[ft],H+=S[ft+1],S.push(S[ft],S[ft+1],S[ft+2]),v>0){let Ut=P[ft],qt=P[ft+1],K=Math.hypot(Ut,qt)||1,it=Ut/K*v,gt=qt/K*v,ut=W*(1-v*.55),At=Math.hypot(it,gt,ut);P.push(it/At,gt/At,ut/At)}else P.push(0,0,W);b.push(b[(k*c+ht)*2],b[(k*c+ht)*2+1])}S.push(X/c,H/c,J),P.push(0,0,N?-1:1),b.push(.5,.5);let ct=z+c;for(let ht=0;ht<c;ht++){let ft=z+ht,Ut=z+(ht+1)%c;N?x.push(ct,Ut,ft):x.push(ct,ft,Ut)}};M(0,!0),M(l,!1);let C=new de;return C.setAttribute("position",new $t(S,3)),C.setAttribute("normal",new $t(P,3)),C.setAttribute("uv",new $t(b,2)),C.setIndex(x),T.dispose(),C}function ve(i,t){let e=new Dt(t),n=i.attributes.position.count,s=new Float32Array(n*3);for(let r=0;r<n;r++)s[r*3]=e.r,s[r*3+1]=e.g,s[r*3+2]=e.b;return i.setAttribute("color",new Oe(s,3)),i}function Go(i=1,t=-1){let e=d=>t<0?d:-d,n=-.118*i,s=.112*i,r=.062*i,o=.05*i,a=-.058*i,l=-.046*i,c=.055*i,h=.022*i,u=new cn;return u.moveTo(e(n+c),a),u.lineTo(e(s-h),l),u.quadraticCurveTo(e(s),l,e(s),l+h),u.lineTo(e(s),o-h),u.quadraticCurveTo(e(s),o,e(s-h),o),u.lineTo(e(n+c),r),u.quadraticCurveTo(e(n),r,e(n),r-c),u.lineTo(e(n),a+c),u.quadraticCurveTo(e(n),a,e(n+c),a),u}function Sl(i=-1){let t=new si(Go(1,i),{depth:.07,bevelEnabled:!0,bevelThickness:.014,bevelSize:.011,bevelSegments:4,curveSegments:12});return t.translate(0,0,-.084),t}function Ie(i,t,e,n,s,r,o=0,a=0,l=0){let c=new Ht(i,t,e);return(o||a||l)&&c.applyMatrix4(new jt().makeRotationFromEuler(new vn(o,a,l))),c.translate(n,s,r),c}function t0(i,t,e=20){let n=[],s=i*.62,r=t/2,o=Math.min(.045,t*.22);n.push(new nt(s,-r)),n.push(new nt(i-o,-r));for(let l=0;l<=4;l++){let c=-Math.PI/2+l/4*(Math.PI/2);n.push(new nt(i-o+Math.cos(c)*o,-r+o+Math.sin(c)*o))}for(let l=0;l<=4;l++){let c=l/4*(Math.PI/2);n.push(new nt(i-o+Math.cos(c)*o,r-o+Math.sin(c)*o))}n.push(new nt(s,r));let a=new Qi(n,e);return a.rotateZ(Math.PI/2),a}function Vo(i,t,e,n,s=1,r=20){let o=new Gn(i,r);return o.rotateY(s>0?Math.PI/2:-Math.PI/2),o.translate(t,e,n),o}var bs=null;function lM(){if(bs)return bs;let i=512,t=document.createElement("canvas");t.width=i,t.height=i;let e=t.getContext("2d");e.fillStyle="#123a8e",e.fillRect(0,0,i,i);let n=14,s=n*2,r=i/n,o=r/1.6,a=Wn(1887),l=[];for(let c=0;c<s*n;c++)l.push({white:!1,l:.85+a()*.3});for(let c=Math.round(l.length*.16);c>0;){let h=l[Math.floor(a()*l.length)];h.white||(h.white=!0,c--)}for(let c=-1;c<s;c++){let h=(c+s)%s;for(let u=-1;u<=n;u++){let{white:d,l:f}=l[h*n+(u+n)%n],m=u*i/n+h%2*r*.5,v=c*r*.5,g=e.createRadialGradient(m,v-o*.3,2,m,v,o);d?(g.addColorStop(0,"#ffffff"),g.addColorStop(1,"#cfd8e6")):(g.addColorStop(0,`rgb(${40*f},${95*f},${200*f})`),g.addColorStop(1,`rgb(${14*f},${46*f},${130*f})`)),e.fillStyle=g,e.beginPath(),e.arc(m,v,o,0,Math.PI),e.fill(),e.strokeStyle="rgba(5,20,60,0.55)",e.lineWidth=2,e.beginPath(),e.arc(m,v,o,.1,Math.PI-.1),e.stroke()}}return bs=new Ce(t),bs.colorSpace=ce,bs.wrapS=bs.wrapT=Ki,bs.repeat.set(2,1),bs}function Tl({curved:i=!0}={}){let t=S=>i?Ii(S):S,e=new wt;e.name="Elsa";let n=t(new pe({map:lM(),roughness:.45,metalness:.15})),s=t(new pe({color:1920944,roughness:.5,side:he})),r=t(new pe({color:16777215,roughness:.25})),o=t(new pe({color:723728,roughness:.2})),a={color:15909424,metalness:.9,roughness:.25,emissive:3811328,emissiveIntensity:.3},l=t(new pe(a)),c=t(new pe({...a,side:he})),h=t(new pe({color:14169162,roughness:.4})),u=t(new pe({color:15331062,roughness:.5,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4})),d=new D(new _e(.3,32,24),n);d.scale.set(1,1.45,.8),d.position.y=.48,e.add(d);let f=new D(new _e(.3,24,14,Math.PI/2-.85,1.7,1.62,.98),u);f.scale.set(1.012,1.45*1.012,.8*1.012),f.position.y=.48,e.add(f);let m=new cn;m.moveTo(0,.12),m.quadraticCurveTo(-.12,.02,-.26,-.08),m.quadraticCurveTo(-.12,-.03,0,-.04),m.quadraticCurveTo(.12,-.03,.26,-.08),m.quadraticCurveTo(.12,.02,0,.12);let v=new D(new si(m,{depth:.05,bevelEnabled:!0,bevelSize:.015,bevelThickness:.015,bevelSegments:2}),s);v.position.set(0,.08,-.03),e.add(v);let g=new _e(.09,14,10);g.scale(.35,1,.7);let p=new D(g,s),x=new D(g,s);p.position.set(-.3,.42,.02),x.position.set(.3,.42,.02),p.rotation.z=.7,x.rotation.z=-.7,e.add(p,x);let _=new D(new ii(.08,.22,3),s);_.scale.set(.3,1,1.4),_.position.set(0,.62,-.23),_.rotation.x=-.6,e.add(_);for(let S of[-1,1]){let P=new D(new _e(.085,20,14),r);P.position.set(S*.13,.7,.17);let b=new D(new _e(.045,16,12),o);b.position.set(S*.145,.7,.24);let M=new D(new _e(.014,8,6),r);M.position.set(S*.13+.02,.72,.28),e.add(P,b,M)}let y=new D(new Vn(.07,.016,8,20,Math.PI),h);y.rotation.z=Math.PI,y.position.set(0,.56,.235),e.add(y);let I=new wt;I.position.y=.9;let T=new D(new Yt(.15,.14,.07,24,1,!0),c);I.add(T);for(let S=0;S<6;S++){let P=S/6*Math.PI*2,b=new wt;b.position.set(Math.sin(P)*.145,.035,Math.cos(P)*.145),b.rotation.y=P;let M=new D(new ii(.028,.12,6),l);M.position.y=.06;let C=new D(new ii(.018,.08,5),l);C.position.set(-.03,.04,0),C.rotation.z=.6;let k=C.clone();k.position.x=.03,k.rotation.z=-.6;let N=new D(new _e(.016,8,6),l);N.position.y=.125,b.add(M,C,k,N),I.add(b)}return e.add(I),e.traverse(S=>{S.isMesh&&(S.castShadow=!0)}),e.userData={finL:p,finR:x,crown:I,body:d},e}function Al(i,t,e=0){let n=i.userData;n.finL.rotation.z=.7+Math.sin(t*6)*.35,n.finR.rotation.z=-.7-Math.sin(t*6+1)*.2,i.rotation.z=Math.sin(t*2.2)*.04+e}var Ue=100,c0=17,h0=2,ki=c0+h0+1,Il={x:bt.right+4.55,scale:1.4},Rl={x:bt.right+8,scale:1},e0=12,n0=75,i0=2.6,qn={polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4},cM=bt.right+2.35,Cl=new Set(["ziel","brunnen","elsa","sparkasse","kiosk","charger"]),id=140,s0=25,sd=20,r0=97,o0=["Gr\xFC\xDFe an Mini Adam!","Linke Spur freischalten: jetzt!","BrunnenTV Fanclub","Malte Malte Malte","Elsa \u2764","Ehrenmenschen-Br\xFCcke","Rechts fahren, Adam!","Wir streamen in Full HD","Live-Eskalationen immer woanders","Ringtennis-Verein gr\xFC\xDFt","Danke f\xFCr alles \u2764","Bimmel hurra!","Kanalpunkte-Wette l\xE4uft"],a0=[["Burg Hauneck","Haunetal"],["Wartburg","Eisenach"],["Weser-Skywalk","Beverungen"],["Burg Ronneburg","Ronneburg"],["Elsa","Kassel gr\xFC\xDFt"],["Hochofenwerk Phoenix West","Dortmund"],["BrunnenTV-Studio","Herr Sch\xF6nnbrun"],["Megahub","Lehrte"],["Rh\xF6n","Starlink-Gebiet"],["Zissel","Kassel"],["Skyline","Frankfurt am Main"]],hM=["Kassel","Fulda","Frankfurt","Gifhorn","Hannover","W\xFCrzburg","G\xF6ttingen","Hamburg","Hanau","Siegen","Erlensee","Eisenach","Bad Hersfeld","Dortmund"];function uM(){let i=[],t=new Yt(.16,.24,2.4,6);t.translate(0,1.2,0),i.push(ve(t,4862756));let e=[[2.5,4,1.5],[2.05,3.5,3.4],[1.55,3,5.2],[1,2.5,6.8]];for(let[n,s,r]of e){let o=new ii(n,s,8);o.translate(0,r+s/2,0),i.push(ve(o,2970928))}return Re(i)}function dM(){let i=[],t=new Yt(.2,.3,3.2,6).toNonIndexed();t.translate(0,1.6,0),i.push(ve(t,5914672));let e=[[0,5,0,2.6],[1.3,4.3,.6,1.9],[-1.2,4.5,-.5,2],[.2,6.3,.3,1.7]];for(let[n,s,r,o]of e){let a=new No(o,1);a.translate(n,s,r),i.push(ve(a,5012020))}return Re(i)}function fM(){let i=[];for(let[t,e,n,s]of[[0,.7,0,1],[.8,.55,.3,.75],[-.7,.5,-.2,.7]]){let r=new No(s,1);r.translate(t,e,n),i.push(ve(r,5603127))}return Re(i)}function pM(){let i=new Ht(1,1,1);return i.translate(0,.5,0),ve(i,16777215)}function mM(){let i=[],e=(f,m,v,g)=>i.push(...f,...m,...v,...f,...v,...g),n=(f,m,v)=>i.push(...f,...m,...v),r=[-.56,1,-.56],o=[.5+.06,1,-.5-.06],a=[.5+.06,1,.5+.06],l=[-.5-.06,1,.5+.06],c=[0,1+.62,-.5-.06],h=[0,1+.62,.5+.06];e(a,o,c,h),e(r,l,h,c),n(l,a,h),n(o,r,c);let u=new de;u.setAttribute("position",new $t(i,3)),u.computeVertexNormals();let d=i.length/3;return u.setAttribute("uv",new $t(new Float32Array(d*2),2)),ve(u,16777215)}function l0(i,t){let e=[],n=[],s=new A,r=new A,o=new A;for(let{pts:l,out:c}of i){s.fromArray(l[0]),r.fromArray(l[1]).sub(s),o.fromArray(l[2]).sub(s);let h=r.cross(o).dot(new A(...c))<0?[...l].reverse():l;for(let u=1;u<h.length-1;u++)for(let d of[h[0],h[u],h[u+1]])e.push(...d),n.push(...t(d,c))}let a=new de;return a.setAttribute("position",new $t(e,3)),a.setAttribute("uv",new $t(n,2)),a.computeVertexNormals(),a}var Pl=[16777215,14741728,13164744,15794144,13691096,16774364],gM=[15854816,15327951,16184298,15063480,14275788,15720649,14471872],vM=[10698794,9124390,5978926,3816512,11883054,7023136],Ll=class{constructor(t){this.track=new wt,this.track.name="Scenery",t.add(this.track),this.slots=Array.from({length:ki},()=>({k:-1,items:[]})),this.requests=[],this.pools=new Map,this.animated=new Set,this.texCache=new Map,this.gantryInfo=()=>({target:"Kassel",km:42}),this.time=0,this.mats={concrete:lt.std({color:12433838,roughness:.92}),concreteDark:lt.std({color:9407620,roughness:.95}),steel:lt.std({color:10133928,metalness:.7,roughness:.4}),dark:lt.std({color:2763566,roughness:.7}),white:lt.std({color:15921903,roughness:.6}),orange:lt.std({color:15231762,roughness:.6}),grass:lt.lambert({map:vl()}),stone:lt.std({color:10985102,roughness:.95}),water:lt.std({color:10276863,roughness:.05,metalness:.2,transparent:!0,opacity:.55,envMapIntensity:1.5}),redRoof:lt.std({color:10698794,roughness:.8}),glassBlue:lt.std({color:6258595,metalness:.8,roughness:.15,envMapIntensity:1.2})},this.mats.grass.color=td,this.makeInstanced()}makeInstanced(){let t=lt.lambert({vertexColors:!0}),e={conifer:[uM(),90],decid:[dM(),60],bush:[fM(),50],house:[pM(),34],roof:[mM(),34]};this.inst={};let n=new jt().makeScale(0,0,0);for(let[s,[r,o]]of Object.entries(e)){let a=s==="house"?lt.lambert({vertexColors:!0}):t,l=new gi(r,a,o*ki);l.frustumCulled=!1,l.castShadow=!0,l.receiveShadow=s==="house"||s==="roof";for(let c=0;c<o*ki;c++)l.setMatrixAt(c,n),l.setColorAt(c,new Dt(1,1,1));l.instanceMatrix.setUsage(bp),this.track.add(l),this.inst[s]={mesh:l,cap:o}}}acquire(t,e){this.pools.has(t)||this.pools.set(t,[]);let n=this.pools.get(t),s=n.find(r=>!r.userData.active);return s||(s=e(),s.userData.type=t,n.push(s),this.track.add(s)),s.userData.active=!0,s.visible=!0,s}release(t){t.userData.active=!1,t.visible=!1,this.animated.delete(t),t.userData.onRelease&&t.userData.onRelease()}request(t,e,n={}){let s=Math.random().toString(36).slice(2),r={id:s,type:t,s:e,data:n,built:!1};this.requests.push(r);let o=Math.floor(e/Ue),a=this.slots[(o%ki+ki)%ki];return a.k===o&&this.placeRequest(a,r),t!=="elsa"&&this.makeRoom(r),Cl.has(t)&&this.refreshWalls(e),s}cancel(t,e=!0){let n=this.requests.find(o=>o.id===t);if(!n)return;this.requests=this.requests.filter(o=>o!==n);let s=!1;if(e&&n.built&&n.s>this.track.position.z+150)for(let o of this.slots){let a=o.items.findIndex(l=>l.userData.requestId===t);a>=0&&(this.release(o.items[a]),o.items.splice(a,1),s=!0)}let r=n.s-id-sd>this.track.position.z+300;Cl.has(n.type)&&(s||!n.built)&&r&&this.refreshWalls(n.s)}reset(){for(let t of this.slots){for(let e of t.items)this.release(e);t.items=[],t.k=-1}this.requests=[]}update(t,e){this.time+=e,this.track.position.z=t;let n=Math.floor(t/Ue);for(let s=n-h0;s<=n+c0;s++){if(s<0)continue;let r=(s%ki+ki)%ki;this.slots[r].k!==s&&this.buildSlot(r,s)}for(let s of this.animated){let r=s.userData.animate;r&&r(this.time,e),s.userData.waveT>0&&this.waveFins(s,e)}this.requests.length>40&&(this.requests=this.requests.filter(s=>s.s>t-500))}buildSlot(t,e){let n=this.slots[t];for(let p of n.items)this.release(p);n.items=[],n.k=e;let s=Wn(e*7919+17),r=e*Ue,o=-r,a={conifer:0,decid:0,bush:0,house:0,roof:0},l=new jt,c=new qe,h=new A,u=new A,d=new Dt,f=new A(0,1,0),m=(p,x,_,y,I,T,S,P,b,M)=>{let C=this.inst[p],k=a[p];if(k>=C.cap)return!1;a[p]++,c.setFromAxisAngle(f,T),u.set(P??I,b??I,M??I),l.compose(h.set(x,_,y),c,u);let N=t*C.cap+k;return C.mesh.setMatrixAt(N,l),C.mesh.setColorAt(N,d.setHex(S)),!0},v=this.villageSide(e);for(let p of[1,-1]){let x=p>0?11:23,_=xn(.05,.38,Ms(e/9,x)),y=p>0?17:34;if(v===p)continue;let I=Math.floor(_*46);for(let S=0;S<I;S++){let P=p*(y+4+Math.pow(s(),.7)*120),b=o-s()*Ue,M=.75+s()*.65;s()<.62?m("conifer",P,0,b,M,s()*6,Pl[Math.floor(s()*Pl.length)]):m("decid",P,0,b,M,s()*6,Pl[Math.floor(s()*Pl.length)])}let T=3+Math.floor(s()*6);for(let S=0;S<T;S++){let P=p*(y-1+s()*10),b=o-s()*Ue;s()<.55?m("bush",P,0,b,.7+s()*.9,s()*6,16777215):m("decid",P,0,b,.55+s()*.5,s()*6,16777215)}if(_<.3){let S=Math.floor(s()*5);for(let P=0;P<S;P++)m("decid",p*(60+s()*380),0,o-s()*Ue,.9+s()*.8,s()*6,16777215);if(s()<.22){let P=this.acquire("turbine",()=>this.makeTurbine());P.position.set(p*(180+s()*520),0,o-s()*Ue),P.rotation.y=(s()-.5)*.6,P.userData.phase=s()*6,this.animated.add(P),n.items.push(P)}}}if(v){let p=v,x=14+Math.floor(s()*14);for(let _=0;_<x;_++){let y=p*(42+s()*150),I=o-s()*Ue,T=8+s()*5,S=9+s()*6,P=5+s()*3.5,b=(s()<.5?0:Math.PI/2)+(s()-.5)*.3;m("house",y,0,I,1,b,ee(gM),T,P,S),m("roof",y,0,I,1,b,ee(vM),T,P,S)}if(s()<.8){let _=this.acquire("church",()=>this.makeChurch());_.position.set(p*(70+s()*60),0,o-50),_.rotation.y=s()*.5,n.items.push(_)}for(let _=0;_<8;_++)m("decid",p*(40+s()*160),0,o-s()*Ue,.7+s()*.5,s()*6,16777215)}if(this.hasWall(e)&&this.buildWall(n),e%5===0&&e>0){let p=this.makeKmSign((r/1e3).toLocaleString("de-DE",{minimumFractionDigits:1,maximumFractionDigits:1}));p.position.set(bt.right+1.2,0,o),n.items.push(p)}if(e%20===10){let p=this.acquire("notruf",()=>this.makeNotruf());p.position.set(bt.right+1.4,0,o-30),n.items.push(p)}let g=this.furniture(e);if(g==="gantry"){let p=this.acquire("gantry",()=>this.makeGantry());this.labelGantry(p,s,r+50),p.position.set(0,0,o-50),n.items.push(p)}else if(g==="bridge"){let p=this.acquire("bridge",()=>this.makeBridge());this.labelBridge(p,s),p.position.set(0,0,o-50),n.items.push(p),this.clearPlants((x,_)=>x>-70&&x<52&&Math.abs(_-(o-50))<20,t),this.clearPlants((x,_)=>x>-74&&x<56&&Math.abs(_-(o-50))<24,t,["house","roof"])}else if(g==="brown"){let[p,x]=a0[Math.floor(s()*a0.length)],_=this.acquire("brown",()=>this.makeBrownSign());_.userData.setText(p,x),_.position.set(bt.right+3.4,0,o-40),n.items.push(_),this.clearPlants((y,I)=>y>bt.right&&y<bt.right+8&&Math.abs(I-(o-40))<5,t)}else if(g==="blueinfo"){let p=this.acquire("blueinfo",()=>this.makeBlueInfo());p.userData.setText(s()<.5?["Rastplatz","Sch\xE4ferborn  2 km"]:["Rastst\xE4tte","Bananensaft  1500 m"]),p.position.set(bt.right+3.4,0,o-40),n.items.push(p),this.clearPlants((x,_)=>x>bt.right&&x<bt.right+8&&Math.abs(_-(o-40))<5,t)}for(let p of this.requests){!p.built&&p.s>=r&&p.s<r+Ue&&this.placeRequest(n,p);let x=Math.abs(p.s-r-Ue/2)<400,_=x&&this.plantFree(p);_&&this.clearPlants(_,t),x&&this.clearHill(p,t)}for(let p of Object.keys(this.inst)){let x=this.inst[p],_=new jt().makeScale(0,0,0);for(let y=a[p];y<x.cap;y++)x.mesh.setMatrixAt(t*x.cap+y,_);x.mesh.instanceMatrix.needsUpdate=!0,x.mesh.instanceColor&&(x.mesh.instanceColor.needsUpdate=!0)}}villageSide(t){return t<4?0:t%37===5||t%37===6?1:t%53===20||t%53===21?-1:0}furniture(t){return t%13===7?"gantry":t%23===15?"bridge":this.hasWall(t)?null:t%17===3?"brown":t%29===11?"blueinfo":null}statueFree(t,e=null){let n=Math.floor(t/Ue),s=t-n*Ue,r=this.furniture(n);return this.hasWall(n)||(r==="gantry"||r==="bridge")&&Math.abs(s-50)<15||(r==="brown"||r==="blueinfo")&&Math.abs(s-40)<6||n%20===10&&Math.abs(s-30)<5||n%5===0&&s<4||(n+1)%5===0&&s>Ue-4?!1:!this.requests.some(o=>o!==e&&Math.abs(o.s-t)<e0)}makeRoom(t){for(let e of this.requests)if(!(e.type!=="elsa"||e.spot!==Il||Math.abs(e.s-t.s)>=e0)){e.spot=Rl;for(let n of this.slots)for(let s of n.items)s.userData.requestId===e.id&&(s.position.x=Rl.x,s.scale.setScalar(Rl.scale))}}landmarkSpot(t){let e=Math.ceil((t-n0)/Ue);for(let n=e;n<e+12;n++){let s=n*Ue+n0;if(!this.furniture(n)&&this.statueFree(s)&&!this.requests.some(o=>Math.abs(o.s-s)<40))return s}return t}placed(t){let e=this.requests.find(n=>n.id===t);return e&&e.spot||null}waveBack(t){for(let e of this.slots)for(let n of e.items)n.userData.requestId===t&&n.userData.type==="elsaStatue"&&(n.userData.waveT=i0)}waveFins(t,e){let n=t.userData,s=t.children.find(c=>c.name==="Elsa"),{finL:r,finR:o}=s?.userData||{};if(!r||!o)return;n.elsaY===void 0&&(n.elsaY=s.position.y),n.waveT=Math.max(0,n.waveT-e);let a=Math.min(1,n.waveT/.5,(i0-n.waveT)/.25),l=.55+.45*Math.sin(this.time*12);r.rotation.z+=a*l*.9,o.rotation.z-=a*l*.9,s.position.y=n.elsaY+a*Math.abs(Math.sin(this.time*6))*.1}hasWall(t){if(t<=2)return!1;let e=this.villageSide(t-1)||this.villageSide(t+1);return this.villageSide(t)===1||e===1}wallPieces(t){let e=t;for(;this.hasWall(e-1);)e--;let n=t;for(;this.hasWall(n+1);)n++;let s=[[e*Ue,(n+1)*Ue]];for(let r of this.requests){if(!Cl.has(r.type))continue;let o=Math.floor((r.s-id)/5)*5,a=Math.ceil((r.s+s0)/5)*5;s=s.flatMap(([l,c])=>a<=l||o>=c?[[l,c]]:[[l,Math.min(c,o)],[Math.max(l,a),c]])}return s.filter(([r,o])=>o-r>=sd)}buildWall(t){let e=t.items.findIndex(a=>a.userData.type==="noisewall");e>=0&&(this.release(t.items[e]),t.items.splice(e,1));let n=t.k*Ue,s=n+Ue,r=[];for(let[a,l]of this.wallPieces(t.k)){let c=Math.max(a,n),h=Math.min(l,s);h-c>.5&&r.push([c,h,c===a,h===l])}if(!r.length)return;let o=this.acquire("noisewall",()=>this.makeNoiseWall());o.userData.shape(r,n+Ue/2),o.position.set(cM,0,-(n+Ue/2)),t.items.push(o)}clearPlants(t,e=-1,n=["conifer","decid","bush"]){let s=new jt,r=new jt().makeScale(0,0,0);for(let o of n){let{mesh:a,cap:l}=this.inst[o],c=e<0?0:e*l,h=e<0?l*ki:c+l,u=!1;for(let d=c;d<h;d++){a.getMatrixAt(d,s);let f=s.elements;f[0]===0&&f[1]===0&&f[2]===0||t(f[12],f[14])&&(a.setMatrixAt(d,r),u=!0)}u&&(a.instanceMatrix.needsUpdate=!0)}}plantFree(t){let e=-t.s;return Cl.has(t.type)?(n,s)=>n>bt.right&&n<bt.right+28&&Math.abs(s-e)<18:t.type==="burg"?(n,s)=>Math.hypot(n-160,s-(e-60))<100:t.type==="skyline"?(n,s)=>n>-425&&n<-64&&s>e-265&&s<e-16:null}clearHill(t,e=-1){if(t.type!=="burg")return;let n=-t.s-60;this.clearPlants((s,r)=>Math.hypot(s-160,r-n)<r0+10,e,["house","roof"]),this.slots.forEach((s,r)=>{e>=0&&r!==e||(s.items=s.items.filter(o=>{let a=o.userData.type==="church"&&Math.hypot(o.position.x-160,o.position.z-n)<r0+14;return a&&this.release(o),!a}))})}refreshWalls(t){for(let e of this.slots)e.k<0||!this.hasWall(e.k)||Math.abs(e.k*Ue+Ue/2-t)<id+s0+Ue+sd&&this.buildWall(e)}placeRequest(t,e){e.built=!0;let n=-e.s,s=null;switch(e.type){case"brunnen":s=this.acquire("brunnen",()=>this.makeFountain()),s.position.set(bt.right+9,0,n),this.animated.add(s);break;case"elsa":{s=this.acquire("elsaStatue",()=>this.makeElsaStatue()),e.spot=this.statueFree(e.s,e)?Il:Rl,s.position.set(e.spot.x,0,n),s.scale.setScalar(e.spot.scale),s.userData.waveT=0,this.waveFins(s,0),this.animated.add(s);break}case"burg":s=this.acquire("burg",()=>this.makeCastle()),s.position.set(160,0,n-60);break;case"skyline":s=this.acquire("skyline",()=>this.makeSkyline()),s.position.set(-75,0,n);break;case"sparkasse":s=this.acquire("sparkasse",()=>this.makeSparkasse()),s.userData.setColor(e.data.color||"#d5121e"),s.position.set(bt.right+16,0,n);break;case"kiosk":s=this.acquire("kiosk",()=>this.makeKiosk()),s.userData.setText(e.data.title||"Currywurst",e.data.sub||"die richtige Bude"),s.position.set(bt.right+10,0,n);break;case"charger":s=this.acquire("charger",()=>this.makeCharger()),s.position.set(bt.right+11,0,n);break;case"ziel":s=this.acquire("ziel",()=>this.makeZiel()),s.userData.setText(e.data.title||"Ziel"),s.position.set(bt.right+3.5,0,n);break;case"blitzer":s=this.acquire("blitzer",()=>this.makeBlitzer()),s.userData.flash.material.color.setScalar(1),s.position.set(bt.right+1.6,0,n);break;case"speed":{s=this.acquire("speed:"+e.data.limit,()=>this.makeSpeedSign(e.data.limit)),s.position.set(0,0,n);break}default:return}s.userData.requestId=e.id,t.items.push(s);let r=this.plantFree(e);r&&this.clearPlants(r),this.clearHill(e)}canvasTex(t,e,n,s){if(this.texCache.has(t))return this.texCache.get(t);let r=document.createElement("canvas");r.width=e,r.height=n,s(r.getContext("2d"),e,n);let o=new Ce(r);if(o.colorSpace=ce,o.anisotropy=4,this.texCache.set(t,o),this.texCache.size>90){let a=this.texCache.keys().next().value;this.texCache.get(a).dispose(),this.texCache.delete(a)}return o}makeKmSign(t){let e=new wt;this.kmGeo||(this.kmGeo={post:new Ht(.08,1.4,.08),board:new fe(.5,.38)});let n=new D(this.kmGeo.post,this.mats.steel);n.position.y=.7;let s=this.canvasTex("km:"+t,128,96,(o,a,l)=>{o.fillStyle="#fafaf5",o.fillRect(0,0,a,l),o.strokeStyle="#111",o.lineWidth=5,o.strokeRect(3,3,a-6,l-6),o.fillStyle="#111",o.font="bold 46px Arial, sans-serif",o.textAlign="center",o.textBaseline="middle",o.fillText(t,a/2,l/2+2)}),r=new D(this.kmGeo.board,lt.std({...qn,map:s,roughness:.6}));return r.position.set(0,1.35,.1),r.rotation.y=-.25,e.add(n,r),e.userData.active=!0,e.userData.onRelease=()=>{r.material.dispose(),this.track.remove(e)},this.track.add(e),e}makeNotruf(){let t=new wt,e=new D(new Ht(.32,1.25,.28),this.mats.orange);e.position.y=.62,this.mats.plate||(this.mats.plate=lt.std({...qn,color:15921903,roughness:.6}));let n=new D(new fe(.22,.25),this.mats.plate);return n.position.set(0,.95,.152),t.add(e,n),t}makeGantry(){let t=new wt,e=this.mats.steel,n=Ks-.4,s=bt.right+1.6;for(let c of[n,s]){let h=new D(new Ht(.5,7.4,.5),e);h.position.set(c,3.7,0),h.castShadow=!0,t.add(h);let u=new D(new Ht(.9,.5,1.2),this.mats.concrete);u.position.set(c,.25,0),t.add(u)}let r=s-n;for(let c of[6.3,7.2]){let h=new D(new Ht(r,.22,.22),e);h.position.set((n+s)/2,c,0),h.castShadow=!0,t.add(h)}for(let c=0;c<=12;c++){let h=n+r*c/12,u=new D(new Ht(.08,.9,.08),e);u.position.set(h,6.75,0),u.rotation.z=c%2?.7:-.7,t.add(u)}let o=new D(new Ht(15,2.8,.12),this.mats.dark);o.position.set(.075,6.6,.12),t.add(o);let a=new Ht(7.2,2.7,.16),l=this.mats.dark;t.userData.panels=[];for(let c of[-3.75,3.9]){let h=lt.std({...qn,roughness:.5}),u=new D(a,[l,l,l,l,h,l]);u.position.set(c,6.6,.24),t.add(u),t.userData.panels.push(h)}return t}relabelGantries(){let t=this.pools.get("gantry");if(!(!t||!this.gantryInfo))for(let e of t)e.userData.active&&e.userData.sSign!==void 0&&this.labelGantry(e,Math.random,e.userData.sSign,!0)}labelGantry(t,e,n,s=!1){t.userData.sSign=n;let r=this.gantryInfo(n),[o,a]=t.userData.panels,l=v=>v.toLocaleString("de-DE",{maximumFractionDigits:v<10?1:0})+" km",c=hM.filter(v=>!r||v!==r.target),h=ee(c),u=ee(c);for(;u===h;)u=ee(c);let d=ee(c);for(;d===h||d===u;)d=ee(c);let f=r?$r([{left:r.target,right:l(r.km)},{left:"Navi-Ziel",right:"\u2191"}],{w:768,h:288,arrows:null}):$r([{left:d,right:l(3+Math.floor(e()*20))},{left:"Rastanlage",right:l(1+Math.floor(e()*9))}],{w:768,h:288,arrows:null}),m=$r([{left:h,right:l(5+Math.floor(e()*60))},{left:u,right:l(30+Math.floor(e()*120))}],{w:768,h:288,arrows:null});for(let[v,g]of s?[[o,f]]:[[o,f],[a,m]])v.map&&v.map.dispose(),v.map=g,v.needsUpdate=!0}makeBridge(){let t=new wt,e=this.mats.concrete,n=34,s=Xn(n),r=new D(new Ht(n-s,1.1,11,20,1,1),[e,e,e,this.mats.concreteDark,e,e]);r.position.set((s+n)/2,6.35,0),r.castShadow=!0,r.receiveShadow=!0,t.add(r);for(let a of[bt.right+3.5,Xn(bt.right+3.5)])for(let l of[-3.2,3.2]){let c=new D(new Yt(.55,.6,5.8,12),e);c.position.set(a,2.9,l),c.castShadow=!0,t.add(c)}for(let a of[1,-1]){let[l,c]=this.makeAbutment(a>0?n:s,a);t.add(l,c)}for(let a of[-5.4,5.4]){let l=new D(new Ht(n-s,.1,.1),this.mats.steel);l.position.set((s+n)/2,7.95,a),t.add(l);for(let c=s+1.25;c<=n-1.2;c+=2.5){let h=new D(new Ht(.06,1,.06),this.mats.steel);h.position.set(c,7.4,a),t.add(h)}}let o=new D(new fe(9,1.5,8,1),lt.std({...qn,side:he,roughness:.9}));return o.position.set(-1.5,6.9,5.62),t.add(o),t.userData.banner=o,t}labelBridge(t,e){let n=o0[Math.floor(e()*o0.length)],s=this.canvasTex("banner:"+n,1024,170,(r,o,a)=>{r.fillStyle="#fbfbf6",r.fillRect(0,0,o,a),r.fillStyle=["#c8102e","#1d4f9a","#111111","#2d7a32"][n.length%4],r.font='bold 92px "Comic Sans MS", "Marker Felt", "Segoe Print", Arial, sans-serif',r.textAlign="center",r.textBaseline="middle";let l=92;for(;r.measureText(n).width>o-60&&l>30;)l-=4,r.font=`bold ${l}px "Comic Sans MS", "Marker Felt", "Segoe Print", Arial, sans-serif`;r.fillText(n,o/2,a/2+4),r.strokeStyle="rgba(0,0,0,0.15)";for(let c=0;c<5;c++)r.beginPath(),r.moveTo(0,Math.random()*a),r.bezierCurveTo(o*.3,Math.random()*a,o*.7,Math.random()*a,o,Math.random()*a),r.stroke()});t.userData.banner.material.map=s,t.userData.banner.material.needsUpdate=!0,t.userData.banner.position.x=-12+e()*20}makeAbutment(t,e){let o=10.350000000000001,a=M=>t+e*M,l=M=>[[a(M),0,-(5.9+o)],[a(M),0,5.9+o],[a(M),6.9,5.9],[a(M),6.9,-5.9]],c=[{pts:l(0),out:[-e,0,0]},{pts:l(.9),out:[e,0,0]},{pts:[[a(0),6.9,-5.9],[a(0),6.9,5.9],[a(.9),6.9,5.9],[a(.9),6.9,-5.9]],out:[0,1,0]}];for(let M of[1,-1])c.push({pts:[[a(0),6.9,M*5.9],[a(0),0,M*(5.9+o)],[a(.9),0,M*(5.9+o)],[a(.9),6.9,M*5.9]],out:[0,1,M]});let h=new D(l0(c,()=>[0,0]),this.mats.concrete);h.castShadow=!0,h.receiveShadow=!0;let u=6.9-.05,d=3,f=1.5*u,m=(M,C,k)=>[a(M),C,k],v=m(.9,u,-5.9),g=m(.9,u,5.9),p=m(.9+d,u,5.9),x=m(.9+d,u,-5.9),_=m(.9,0,-(5.9+f)),y=m(.9,0,5.9+f),I=m(.9+d+f,0,5.9+f),T=m(.9+d+f,0,-(5.9+f)),S=[{pts:[v,g,p,x],out:[0,1,0]},{pts:[g,y,I,p],out:[0,1,1]},{pts:[x,p,I,T],out:[e,1,0]},{pts:[v,x,T,_],out:[0,1,-1]}],P=([M,C,k],N)=>N[0]===0&&N[2]===0?[M/6,k/6]:N[2]!==0?[M/6,C*1.8/6]:[k/6,C*1.8/6],b=new D(l0(S,P),this.mats.grass);return b.castShadow=!0,b.receiveShadow=!0,[h,b]}makeBrownSign(){let t=new wt;for(let n of[-1.3,1.3]){let s=new D(new Ht(.1,3.8,.1),this.mats.steel);s.position.set(n,1.9,0),t.add(s)}let e=this.signBoard(t,3.4,2.1,2.75);return t.rotation.y=-.12,t.userData.setText=(n,s)=>{e.map=this.canvasTexFrom("brown:"+n,()=>Yp(n,s)),e.needsUpdate=!0},t}signBoard(t,e,n,s){this.signEdgeGeo||(this.signEdgeGeo=new Map);let r=e+"x"+n;this.signEdgeGeo.has(r)||this.signEdgeGeo.set(r,new Ht(e,n,.05));let o=lt.std({...qn,roughness:.6}),a=this.mats.steel,l=new D(this.signEdgeGeo.get(r),[a,a,a,a,o,a]);return l.position.set(0,s,.085),t.add(l),o}canvasTexFrom(t,e){return this.texCache.has(t)||this.texCache.set(t,e()),this.texCache.get(t)}makeBlueInfo(){let t=new wt;for(let n of[-1.3,1.3]){let s=new D(new Ht(.1,3.6,.1),this.mats.steel);s.position.set(n,1.8,0),t.add(s)}let e=this.signBoard(t,3.4,1.8,2.7);return t.rotation.y=-.12,t.userData.setText=n=>{e.map=this.canvasTexFrom("blue:"+n.join("|"),()=>$r(n,{w:512,h:272})),e.needsUpdate=!0},t}makeSpeedSign(t){let e=new wt,n=Zp(t),s=lt.std({...qn,map:n,transparent:!0,alphaTest:.4,roughness:.5});for(let r of[bt.right+1.3,Ks]){let o=new D(new Yt(.04,.04,2.6,6),this.mats.steel);o.position.set(r,1.3,0);let a=new D(new fe(1,1),s);a.position.set(r,2.5,.1),e.add(o,a)}return e}makeBlitzer(){let t=new wt,e=new D(new Ht(.55,2.7,.55),lt.std({color:10331048,metalness:.4,roughness:.5}));e.position.y=1.35;let n=new D(new fe(.36,.5),lt.std({...qn,color:1053720,metalness:.8,roughness:.1}));n.position.set(0,2.2,.29);let s=new D(new fe(.3,.2),lt.basic({...qn,color:16777215}));return s.position.set(0,1.75,.29),t.add(e,n,s),t.rotation.y=-.35,t.userData.flash=s,t}makeTurbine(){let t=new wt,e=lt.std({color:15987957,roughness:.55}),n=new D(new Yt(1.2,2.4,92,12),e);n.position.y=46;let s=new D(new Ht(3.6,3.8,10),e);s.position.set(0,93,-1);let r=new wt;r.position.set(0,93,4.7);let o=new D(new _e(2,12,10),e);o.scale.set(1,1,1.4),r.add(o);let a=new Ht(2.4,46,.5);a.translate(0,24,0);let l=a.attributes.position;for(let c=0;c<l.count;c++){let h=l.getY(c);l.setX(c,l.getX(c)*(1-h/50*.75))}a.computeVertexNormals();for(let c=0;c<3;c++){let h=new D(a,e);h.rotation.z=c/3*Math.PI*2,r.add(h)}return t.add(n,s,r),t.userData.animate=c=>{r.rotation.z=c*1.3+t.userData.phase},t}makeChurch(){let t=new wt,e=lt.std({color:15525333,roughness:.9}),n=new D(new Ht(9,8,18),e);n.position.set(0,4,4);let s=new D(new Yt(.01,6.8,5,4,1),this.mats.redRoof);s.scale.set(1,1,2),s.rotation.y=Math.PI/4,s.position.set(0,10.5,4);let r=new D(new Ht(4.5,20,4.5),e);r.position.set(0,10,-7);let o=new D(new ii(3.4,10,4),lt.std({color:4087378,roughness:.7}));o.rotation.y=Math.PI/4,o.position.set(0,25,-7);let a=new D(new Gn(.9,16),lt.std({...qn,color:1710618}));return a.position.set(0,16,-4.69),t.add(n,s,r,o,a),t.traverse(l=>l.isMesh&&(l.castShadow=!0)),t}makeNoiseWall(){if(!this.mats.noiseWall){let s=this.canvasTexFrom("noisewall",()=>{let r=document.createElement("canvas");r.width=256,r.height=128;let o=r.getContext("2d");o.fillStyle="#7f8f84",o.fillRect(0,0,256,128);for(let l=0;l<128;l+=8)o.fillStyle=l%16?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.06)",o.fillRect(0,l,256,4);o.fillStyle="#5b6168",o.fillRect(0,0,10,128);let a=new Ce(r);return a.colorSpace=ce,a.wrapS=a.wrapT=Ki,a.anisotropy=4,a});this.mats.noiseWall=lt.std({map:s,roughness:.8}),this.mats.wallPost=lt.std({color:5988712,metalness:.4,roughness:.55}),this.wallPostGeo=new Ht(.42,4.45,.24),this.wallPostGeo.translate(0,2.225,0)}let t=new wt,e=new D(new de,this.mats.noiseWall);e.castShadow=!0,e.receiveShadow=!0;let n=new D(new de,this.mats.wallPost);return n.castShadow=!0,t.add(e,n),t.userData.shape=(s,r)=>{let o=[],a=[];for(let[l,c,h,u]of s){let d=c-l,f=(l+c)/2,m=new Ht(.3,4.2,d,1,1,Math.max(1,Math.round(d/5))),v=m.attributes.position,g=m.attributes.uv,p=m.attributes.normal;for(let x=0;x<v.count;x++)g.setXY(x,(f-v.getZ(x))/5,p.getY(x)>.5?.97:(v.getY(x)+2.1)/4.2);m.translate(0,2.1,r-f),o.push(m);for(let[x,_]of[[h,l],[u,c]])x&&a.push(this.wallPostGeo.clone().translate(0,0,r-_))}e.geometry.dispose(),e.geometry=Re(o),n.geometry.dispose(),n.geometry=a.length?Re(a):new de,n.visible=a.length>0;for(let l of[...o,...a])l.dispose()},t}makeFountain(){let t=new wt,e=new D(new Yt(3.4,3.6,.9,28,1,!0),this.mats.stone);e.position.y=.45;let n=new D(new Vn(3.45,.18,8,32),this.mats.stone);n.rotation.x=Math.PI/2,n.position.y=.9;let s=new D(new Gn(3.35,28),this.mats.water);s.rotation.x=-Math.PI/2,s.position.y=.75;let r=new D(new Yt(.35,.5,2.4,14),this.mats.stone);r.position.y=1.2;let o=new D(new Yt(1.4,.35,.5,20),this.mats.stone);o.position.y=2.5;let a=lt.std({color:14676479,transparent:!0,opacity:.55,roughness:.1,emissive:3364215,emissiveIntensity:.3}),l=new D(new ii(.25,2.2,12,1,!0),a);l.position.y=3.8,l.rotation.x=Math.PI;let c=new D(new Yt(1.45,2.4,1.7,24,1,!0),a);c.position.y=1.65;let h=this.canvasTex("brunnentv",512,200,(f,m,v)=>{f.fillStyle="#3a1f63",ze(f,0,0,m,v,24),f.fill(),f.fillStyle="#ffd84a",f.font="bold 84px Arial Black, Arial, sans-serif",f.textAlign="center",f.textBaseline="middle",f.fillText("BrunnenTV",m/2,v*.42),f.fillStyle="#ffffff",f.font="34px Arial, sans-serif",f.fillText("mit Herrn Sch\xF6nnbrun \u26F2",m/2,v*.78)}),u=new D(new fe(3.2,1.25),lt.std({...qn,map:h,roughness:.5}));u.position.set(-4.2,2.3,1.5),u.rotation.y=.5;let d=new D(new Ht(.12,1.8,.12),this.mats.steel);return d.position.set(-4.2,.9,1.3),t.add(e,n,s,r,o,l,c,u,d),t.userData.animate=f=>{l.scale.y=1+Math.sin(f*7)*.08,c.scale.x=c.scale.z=1+Math.sin(f*5)*.03},t}makeElsaStatue(){let t=new wt,e=20,n=new D(new Yt(1.8,2.1,1.2,e),this.mats.stone);n.position.y=.6,n.castShadow=!0;let s=Tl({curved:!0});s.scale.setScalar(4.2),s.position.y=1.2,s.rotation.y=-.6;let r=this.canvasTex("elsaSign",512,160,(f,m,v)=>{f.fillStyle="#1d3f9a",ze(f,0,0,m,v,20),f.fill(),f.fillStyle="#f2c230",f.font="bold 66px Arial, sans-serif",f.textAlign="center",f.textBaseline="middle",f.fillText("\u{1F451} Elsa gr\xFC\xDFt!",m/2,v/2+3)}),o=Math.PI*2/e,a=f=>2.1-.3*f/1.2,l=.76,c=.7,h=.021,u=new Yt(a(c+l/2)+h,a(c-l/2)+h,l,4,1,!0,-4*o,4*o),d=new D(u,lt.std({map:r,alphaTest:.5,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}));return d.position.y=c,t.add(n,s,d),t.userData.animate=f=>Al(s,f),t}makeCastle(){let t=new wt,e=[[97,0],[90,4],[78,12.5],[62,24],[46,34.5],[34,40.4],[28,42.2],[24,42.6],[0,42.6]],n=new D(new Qi(e.map(([a,l])=>new nt(a,l)),24),lt.lambert({color:6063680})),s=lt.std({color:12036495,roughness:.95}),r=new D(new Ht(12,30,12),s);r.position.y=57;let o=new D(new ii(9.5,12,4),this.mats.redRoof);o.rotation.y=Math.PI/4,o.position.y=78,t.add(n,r,o);for(let a=0;a<4;a++){let l=a/4*Math.PI*2+.4,c=new D(new Yt(3.5,3.8,20,12),s);c.position.set(Math.sin(l)*18,52,Math.cos(l)*18);let h=new D(new ii(4.4,8,12),this.mats.redRoof);h.position.set(Math.sin(l)*18,66,Math.cos(l)*18),t.add(c,h);let u=(a+.5)/4*Math.PI*2+.4,d=new D(new Ht(24,12,2),s);d.position.set(Math.sin(u)*13.5,48,Math.cos(u)*13.5),d.rotation.y=u,t.add(d)}return t}makeSkyline(){let t=new wt,e=Wn(69),n=[this.mats.glassBlue,lt.std({color:12174028,metalness:.5,roughness:.3}),lt.std({color:7305862,metalness:.6,roughness:.25})];for(let s=0;s<16;s++){let r=60+e()*190,o=18+e()*22,a=new D(new Ht(o,r,o),n[s%3]);if(a.position.set(-s*22-e()*8,r/2,-s*14-e()*40),t.add(a),s===7){let l=new D(new Yt(.6,1.2,50,6),this.mats.steel);l.position.set(a.position.x,r+25,a.position.z),t.add(l)}}return t}makeSparkasse(){let t=new wt,e=new D(new Ht(14,7,10),lt.std({color:15328991,roughness:.85}));e.position.y=3.5;let n=new D(new fe(12,3),lt.std({...qn,color:6258595,metalness:.8,roughness:.15,envMapIntensity:1.2}));n.position.set(0,2.2,5.025);let s=lt.std({...qn,roughness:.5}),r=this.mats.white,o=new D(new Ht(8,1.6,.12),[r,r,r,r,s,r]);return o.position.set(0,6,5.07),t.add(e,n,o),t.rotation.y=-Math.PI/2+.25,t.userData.setColor=a=>{let l=this.canvasTex("spk:"+a,512,100,(c,h,u)=>{c.fillStyle="#ffffff",c.fillRect(0,0,h,u),c.fillStyle=a,c.font="bold 64px Arial, sans-serif",c.textAlign="center",c.textBaseline="middle",c.fillText("Sparkasse",h/2,u/2+3)});s.map=l,s.needsUpdate=!0},t}makeKiosk(){let t=new wt,e=new D(new Ht(5,3,4),lt.std({color:15786160,roughness:.8}));e.position.y=1.5;let n=new D(new Ht(5.4,.2,1.6),lt.std({color:13770784,roughness:.7}));n.position.set(0,2.8,2.6),n.rotation.x=.25;let s=new D(new Yt(.12,.12,7,8),this.mats.steel);s.position.set(-3.6,3.5,1);let r=lt.std({...qn,roughness:.5}),o=this.mats.steel,a=new D(new Ht(3.2,1.8,.06),[o,o,o,o,r,o]);return a.position.set(-3.6,6.4,1.15),t.add(e,n,s,a),t.rotation.y=-.4,t.userData.setText=(l,c)=>{let h=this.canvasTex("kiosk:"+l+c,512,288,(u,d,f)=>{u.fillStyle="#fff4d0",ze(u,0,0,d,f,26),u.fill(),u.strokeStyle="#d22020",u.lineWidth=12,ze(u,8,8,d-16,f-16,20),u.stroke(),u.fillStyle="#b31515",u.font="bold 72px Arial Black, Arial, sans-serif",u.textAlign="center",u.textBaseline="middle",u.fillText(l,d/2,f*.4),u.fillStyle="#333",u.font="bold 38px Arial, sans-serif",u.fillText(c,d/2,f*.75)});r.map=h,r.needsUpdate=!0},t}makeCharger(){let t=new wt,e=new D(new Ht(14,.4,6),lt.std({color:16053492,roughness:.6}));e.position.y=4.2,t.add(e);for(let s of[-6,6]){let r=new D(new Ht(.3,4.2,.3),this.mats.steel);r.position.set(s,2.1,0),t.add(r)}for(let s=0;s<5;s++){let r=new D(new Ht(.35,1.6,.35),lt.std({color:15921906,roughness:.4}));r.position.set(-5+s*2.5,.8,-1.5);let o=new D(new Ht(.39,.25,.39),lt.std({...qn,color:13638684,emissive:5242880}));o.position.set(-5+s*2.5,1.35,-1.5),t.add(r,o)}let n=new D(new Ht(13.6,.08,5.6),lt.basic({color:12575743}));return n.position.y=3.98,t.add(n),t.rotation.y=-.2,t}makeZiel(){let t=new wt;for(let r of[-2.2,2.2]){let o=new D(new Yt(.08,.08,4.6,8),this.mats.steel);o.position.set(r,2.3,0),t.add(o)}let e=this.canvasTex("checker",256,64,(r,o,a)=>{for(let l=0;l<4;l++)for(let c=0;c<16;c++)r.fillStyle=(c+l)%2?"#111":"#fff",r.fillRect(c*16,l*16,16,16)}),n=new D(new fe(4.4,.9,10,1),lt.std({map:e,side:he}));n.position.y=4.15;let s=new D(new fe(4.2,1.6),lt.std({roughness:.6}));return s.position.y=2.9,s.position.z=.05,t.add(n,s),t.rotation.y=-.15,t.userData.setText=r=>{s.material.map=this.canvasTexFrom("ziel:"+r,()=>$r(["Ziel erreicht:",r],{w:512,h:196,bg:"#1d7a3a"})),s.material.needsUpdate=!0},t}flashBlitzer(t){let e=this.pools.get("blitzer")||[];for(let n of e)n.userData.active&&n.userData.flash.material.color.setScalar(t?30:1)}};var Qr={klein:{L:3.62,half:.83,H:1.5,belt:.93,hood:.78,ws:1.32,re:2.85,ce:3.48,rear:"hatch",axles:[.68,3],wr:.29,cl:.15,nose:.62,weight:8},kompakt:{L:4.26,half:.895,H:1.46,belt:.93,hood:1.05,ws:1.72,re:3.35,ce:4.12,rear:"hatch",axles:[.86,3.5],wr:.31,cl:.16,nose:.6,weight:22},limo:{L:4.78,half:.915,H:1.45,belt:.95,hood:1.32,ws:1.98,re:3.15,ce:3.88,rear:"sedan",axles:[.95,3.8],wr:.32,cl:.15,nose:.6,weight:15},kombi:{L:4.82,half:.915,H:1.5,belt:.95,hood:1.25,ws:1.92,re:4.5,ce:4.74,rear:"wagon",axles:[.95,3.75],wr:.32,cl:.16,nose:.6,weight:18},suv:{L:4.62,half:.94,H:1.68,belt:1.08,hood:1.12,ws:1.78,re:4.2,ce:4.5,rear:"wagon",axles:[.92,3.62],wr:.36,cl:.22,nose:.74,weight:14},sport:{L:4.5,half:.93,H:1.27,belt:.82,hood:1.62,ws:2.25,re:2.9,ce:4.05,rear:"hatch",axles:[1.12,3.62],wr:.33,arch:.35,cl:.12,nose:.48,weight:4},transporter:{L:5.9,half:1,H:2.5,belt:1.2,hood:.78,ws:1.42,re:5.85,ce:5.9,rear:"box",cargo:2.05,axles:[.95,4.6],wr:.36,cl:.2,nose:.78,weight:8},wohnmobil:{L:7,half:1.15,H:3,belt:1.3,hood:.8,ws:1.45,re:6.95,ce:7,rear:"box",cargo:1.9,alkoven:!0,axles:[1,4.9],wr:.38,cl:.22,nose:.8,weight:2}},xM=[[12106946,20],[1118740,20],[15659250,18],[5922662,18],[2310266,10],[10361627,6],[2968122,3],[12099706,2],[15254298,1],[13789470,1],[1929128,2]],u0=["KS-EL 5A","GF-PO 110","FD-BR 1","SI-EG 3","F-SK 2017","MZ-RT 1369","B-AN 333","KS-ZF 33","HU-PA 42","F-AB 1234","DA-HD 1080","OF-RT 333","GF-MA 3","HH-MA 1","FD-VIP 3","K-OE 1337"],Hl=[["Pl\xFCsch-Logistik","Wir liefern Mini Adams in ganz Deutschland","#ffffff","#c8102e"],["Brunnenbau Sch\xF6nnbrun","Seit 1887 \u2013 Brunnen mit Gef\xFChl","#e8f1f8","#1d5fa8"],["Rettich-Express","Frisch vom Feld \u2013 13,69 \u20AC das Kilo","#f6f6ee","#3c8d2f"],["Pappkarton & S\xF6hne","Haufenweise Kartons seit 1972","#d8b98a","#5a3b1c"],["Elsa Fischtransporte","Kassel \xB7 frisch & k\xF6niglich","#ffffff","#1d3f9a"],["Bananensaft-Spedition","Gelb ist das neue Schnell","#fff6c0","#c79a00"],["Sprachstudio-Logistik","Wir bringen jede Durchsage an","#f0f0f0","#7a2ca0"],["Konfetti-Transporte","Vorsicht: Rutschgefahr beim \xD6ffnen","#ffffff","#e5307a"],["Ringtennis-Bedarf","Ringe, Netze, Leidenschaft","#eef6ff","#d45a00"],["Kanalpunkte-Kurier","Wetten, dass wir p\xFCnktlich sind?","#f4f4f4","#6c3fc4"],["Leitplanken-Lutz","Wir halten zusammen","#e6e6e6","#444444"],["Schnelle Pommes","Ohne R\xFCckfragen","#fff3d6","#d81e1e"]],d0=["Abstand halten!","Wie fahre ich? 0800-BRUNNEN","Ladung: 33.333 Rettiche","Rechts fahren ist Ehrensache","Mein Wischer zuckt auch","Gr\xFC\xDFe an die Polizei Gifhorn","Nicht hupen, Fahrer tr\xE4umt von Elsa"],Dl=null;function Es(){return Dl||(Dl={body:new Map,glass:lt.std({color:1317410,metalness:.6,roughness:.08,envMapIntensity:1.4}),detail:lt.std({vertexColors:!0,roughness:.6,metalness:.15}),tail:lt.std({color:2753797,emissive:16711680,emissiveIntensity:.14,roughness:.3}),brake:lt.std({color:5245450,emissive:16711680,emissiveIntensity:.95,roughness:.3}),liner:lt.std({color:789517,roughness:.85,side:he}),blink:lt.std({color:5583616,emissive:16753178,emissiveIntensity:3,roughness:.3}),blueOn:lt.std({color:662118,emissive:2250239,emissiveIntensity:5,roughness:.3}),blueOff:lt.std({color:1714790,emissive:660800,emissiveIntensity:.4,roughness:.3}),plates:new Map,trailers:new Map,ground:lt.basic({color:0,map:_l(),transparent:!0,opacity:.5,depthWrite:!1})},Dl)}var rd=new Map;function yM(i,t){let e=i.toFixed(2)+"x"+t.toFixed(2);if(!rd.has(e)){let n=new fe(i,t,1,Math.max(1,Math.ceil(t/2.5)));n.rotateX(-Math.PI/2),n.translate(0,.02,0),rd.set(e,n)}return rd.get(e)}function kl(i,t=null){let e=Es(),n=i+(t?":"+t.uuid:"");return e.body.has(n)||e.body.set(n,lt.std({color:i,map:t,metalness:.45,roughness:.3,envMapIntensity:1.1})),e.body.get(n)}function f0(i){let t=Es();return t.plates.has(i)||t.plates.set(i,lt.std({map:xl(i),roughness:.6})),t.plates.get(i)}function m0(i){let t=Es();t.tail.emissiveIntensity=i?.3:.14,t.ground.opacity=i?.78:.5}var jr=new Map,An=new A;function Ul(i,t,e){let n=0,s=-1/0;for(let r=0;r<=48;r++){if(Mi(i,t,-Math.PI/2+r/48*Math.PI,An),An.y>=e)return s===-1/0?An.x:Qt(n,An.x,(e-s)/Math.max(1e-6,An.y-s));n=An.x,s=An.y}return 0}function p0(i,t,e){let n=0,s=0;for(let r=0;r<=48;r++){if(Mi(i,t,Math.PI/2-r/48*(Math.PI/2),An),r>0&&An.x>=e)return Qt(s,An.y,(e-n)/Math.max(1e-6,An.x-n));n=An.x,s=An.y}return s}function _M(i,t,e,n,s){let r=[],o=null;for(let l=0;l<=96;l++){Mi(i,t,-Math.PI/2+l/96*(Math.PI/2),An);let c=[An.x-.005,An.y+.003];if(o){if(o[0]<n&&c[0]>=n){let h=(n-o[0])/(c[0]-o[0]);r.push([n,o[1]+h*(c[1]-o[1])])}if(c[1]>=s){let h=(s-o[1])/(c[1]-o[1]);r.push([o[0]+h*(c[0]-o[0]),s]);break}c[0]>=n&&r.push(c)}o=c}r.push([n,s]);let a=new vi(new cn(r.map(([l,c])=>new nt(e*l,c))));return a.translate(0,0,t-i.L/2),a}function ad(i){if(jr.has(i))return jr.get(i);let t=Qr[i],{L:e,half:n,H:s,belt:r,hood:o,ws:a,re:l,ce:c,rear:h,axles:u,wr:d,cl:f,nose:m}=t,v=h==="box",g=[[0,m-.13],[.06,m],[.3,m+.06],[o,r]];h==="sedan"?g.push([c,r+.05],[e-.16,r+.06],[e,r-.1]):g.push([Qt(o,e,.6),r+.02],[e-.06,r-.02],[e,r-.14]);let p=Bn(g),x=Bn([[0,.36],[.08,f+.07],[.28,f],[e-.3,f],[e-.06,f+.1],[e,.4]]),_=t.arch??d+.07,y=El(x,u,_,d),I=Bn([[0,n-.22],[.1,n-.08],[.4,n-.02],[.9,n],[e-.9,n],[e-.3,n-.03],[e,n-.1]]),T={w:I,b:x,bx:wl(y,.5,.72),t:p,tw:.9,bw:.95,n:4.5,L:e},S=[Di({u0:0,u1:e,...T,segs:64,ring:24,H:s})],P=(V,$,B)=>Mi(T,V,$,B),b=(V,$,B,j,rt,mt=.004)=>$s(P,(Ot,at)=>{let Et=Qt(j,rt,Ot);return[Qt($,B,at),V>0?Et:Math.PI-Et]},{ns:Math.max(6,Math.ceil(Math.abs(rt-j)/.08)),nt:8,lift:mt}),M=h==="sedan"?r+.07:r+.12,C=v?t.cargo+.02:c,k=[[o-.02,r+.01],[Qt(o,a,.5),Qt(r,s,.56)],[a,s-.01]];v?k.push([C,s-.01]):k.push([(a+l)/2,s],[l,s-.015],[Qt(l,c,.5),Qt(s,M,.55)],[c,M]);let N=Bn(k),z=V=>I(V)-.06,X={w:z,b:V=>p(V)-.05,t:N,tw:v?.95:.8,bw:1,n:3.4,L:e},H=o-.02,J=36,W=22,ct=Di({u0:H,u1:C,...X,segs:J,ring:W,H:s});if(v)S.push(Di({u0:t.cargo,u1:e,w:V=>I(V)+.01,b:()=>r-.06,t:Bn([[t.cargo,s-.02],[t.cargo+.3,s],[e,s]]),tw:.97,bw:1,n:7,segs:24,ring:24,L:e,H:s})),t.alkoven?S.push(Di({u0:.45,u1:t.cargo+.2,w:()=>n+.02,b:Bn([[.45,s-.45],[1.2,s-.7],[t.cargo+.2,s-.72]]),t:()=>s,tw:.98,bw:1,n:6,segs:16,ring:24,L:e,H:s})):S.push(Di({u0:a-.05,u1:t.cargo+.05,w:V=>z(V)*.95+.02,b:V=>N(V)-.07,t:V=>N(V)+.015,tw:.95,bw:1,n:5,segs:10,ring:20,L:e,H:s}));else{let V=(Nt,Gt,Ct)=>Mi(X,Nt,Gt,Ct),$=ed(H,C,J),B=Nt=>$.reduce((Gt,Ct,Q)=>Math.abs(Ct-Nt)<Math.abs($[Gt]-Nt)?Q:Gt,0),j=B(a-.03),rt=B(l+.02),mt=Math.round(W*(.42+Math.PI/2)/(2*Math.PI)),Ot=W-mt,at=$s(V,(Nt,Gt)=>[$[j+Math.round(Gt*(rt-j))],nd(mt+Math.round(Nt*(Ot-mt)),W)],{ns:Ot-mt,nt:rt-j,lift:.006}),Et=at.attributes.uv;for(let Nt=0;Nt<Et.count;Nt++)Et.setXY(Nt,.5,.97);S.push(at)}let ht=Re(S),ft=[],Ut=[],qt=V=>V-e/2,K={...T,bx:null};for(let V of u)for(let $ of[-1,1]){let B=n*.45,j=new Yt(_-.005,_-.005,n-B,14,1,!0,0,Math.PI);j.rotateZ(Math.PI/2),j.translate($*(n+B)/2,d,qt(V));let rt=new Gn(_-.005,14,0,Math.PI);rt.rotateY(Math.PI/2),rt.translate($*B,d,qt(V)),Ut.push(j.toNonIndexed(),rt.toNonIndexed());for(let Ot of[-1,1])Ut.push(_M(K,V+Ot*(_-.01),$,B,d+.01).toNonIndexed());let mt=new Yt(d,d,.22,16);mt.rotateZ(Math.PI/2),mt.translate($*(n-.13),d,qt(V)),ft.push(ve(mt,1184274)),ft.push(ve(Vo(d*.62,$*(n-.015),d,qt(V),$,14),10133414))}ft.push(ve(b(1,0,.16,-Math.PI+.42,-.42,.004),1776413)),ft.push(ve(b(1,e-.18,e,-Math.PI+.42,-.42,.004),1776413));let it=p(0),gt=x(0);ft.push(ve(Ie(I(0)*1.05,Math.max(.04,(it-gt)*.55),.01,0,gt+(it-gt)*.45,qt(0)-.006),2237222));let ut=o+.25,At=r+.035,Bt=Math.max(Ul(T,ut,At),Ul(X,ut,At))-.02;for(let V of[-1,1])ft.push(ve(b(V,.008,.17,.2,.8,.004),2896184)),ft.push(ve(b(V,.02,.15,.3,.7,.007),15002868)),ft.push(ve(Ie(.15,.085,.06,V*(n+.03),r+.07,qt(ut),0,V*.12,0),1710620)),ft.push(ve(Ie(n-.03-Bt,.035,.05,V*(Bt+n-.03)/2,At,qt(ut)+.01),1710620));let Zt=Re(ft);for(let V of Ut)V.deleteAttribute("uv");let te=Re(Ut),et=[],pt=h==="box"?.85:p(e)-.1,L=Math.min(I(e)-.26,Ul(T,e,pt+.06)-.18);for(let V of[-1,1])et.push(Ie(.3,.12,.024,V*L,pt,qt(e)+.004));let Ft=Re(et),st=h==="box"?pt+.11:pt-.1,It=Math.min(I(e)-.18,Ul(T,e,st+.03)-.08),xt=V=>Re([Ie(.1,.06,.024,V*It,st,qt(e)+.006),b(V,.01,.12,.02,.18,.005),b(V,Math.min(u[0]+d+.12,o-.1),Math.min(u[0]+d+.2,o-.02),.3,.4,.005)]),zt=new fe(.52,.112);zt.translate(0,h==="box"?.55:Math.max(f+.32,r-.32),qt(e)+.012);let St=(a+l)/2,R=Math.min(p0(X,St-.11,.43),p0(X,St+.11,.43)),E=[-1,1].map(V=>Ie(.42,.09,.22,V*.22,R+.045,qt(St))),G={bodyGeo:ht,glassGeo:ct,detailGeo:Zt,linerGeo:te,tailGeo:Ft,blinkL:xt(-1),blinkR:xt(1),plateGeo:zt,lightbarGeo:E,bodyShape:T};return jr.set(i,G),G}var od=16.5;function g0(){if(jr.has("lkw"))return jr.get("lkw");let i=h=>h-od/2,t=Di({u0:0,u1:2.3,w:Bn([[0,1.18],[.12,1.24],[2.3,1.25]]),b:()=>.92,t:Bn([[0,3.35],[.2,3.62],[.8,3.75],[2.3,3.78]]),tw:.96,bw:1,n:8,segs:14,ring:28,L:od,H:4}),e=[];e.push(ve(Ie(2,1.05,.05,0,2.72,i(0)-.06,-.06),1581096));for(let h of[-1,1])e.push(ve(Ie(.04,.85,1,h*1.255,2.75,i(.75)),1581096));e.push(ve(Ie(2.3,.35,.12,0,.75,i(.05)),2763308)),e.push(ve(Ie(1.7,.9,.04,0,1.6,i(.01)),3093046)),e.push(ve(Ie(2.1,.12,.35,0,3.4,i(.05),.25),1973792)),e.push(ve(Ie(1,.45,5.2,0,.78,i(3.2)),2236964));for(let h of[-1,1]){let u=new Yt(.3,.3,1.2,12);u.rotateX(Math.PI/2),u.translate(h*.95,.75,i(3.2)),e.push(ve(u,12172996)),e.push(ve(Ie(.3,.12,.08,h*.85,1.25,i(.02)),15199989)),e.push(ve(Ie(.08,.55,.06,h*1.38,2.6,i(.55)),1710618));for(let d of[2.42,2.8])e.push(ve(Ie(.2,.035,.035,h*1.29,d,i(.55)),1710618));e.push(ve(Ie(.05,.4,7.1,h*1.24,.95,i(9.12)),10133670))}let n=[[1.35,.52,.32],[4.9,.52,.55],[13.3,.48,.5],[14.6,.48,.5],[15.9,.48,.5]];for(let[h,u,d]of n)for(let f of[-1,1]){let m=new Yt(u,u,d,16);m.rotateZ(Math.PI/2),m.translate(f*(1.25-d/2-.02),u,i(h)),e.push(ve(m,1184274)),e.push(ve(Vo(u*.6,f*1.24,u,i(h),f,14),9080726))}e.push(ve(Ie(2.4,.15,.12,0,.6,i(16.45)),10133670)),e.push(ve(Ie(2.4,.3,13.6,0,1.12,i(9.7)),2829358));let s=Re(e),r=new Ht(2.55,2.75,13.6);r.translate(0,2.65,i(9.7));let o=Re([Ie(.4,.14,.05,-.95,1.05,i(16.5)+.02),Ie(.4,.14,.05,.95,1.05,i(16.5)+.02)]),a=h=>Re([Ie(.14,.12,.05,h*1.17,1.05,i(16.5)+.025),Ie(.12,.1,.05,h*1.05,1.25,i(0)-.02),Ie(.04,.08,.16,h*1.27,1.25,i(1.9))]),l=new fe(.52,.112);l.translate(0,1.12,i(16.5)+.03);let c={bodyGeo:t,detailGeo:s,trailerGeo:r,tailGeo:o,blinkL:a(-1),blinkR:a(1),plateGeo:l};return jr.set("lkw",c),c}function v0(i){let t=Es();if(!t.trailers.has(i)){let[e,n,s,r]=Hl[i],o=lt.std({map:Kp(e,n,s,r),roughness:.7}),a=lt.std({map:$p(d0[i%d0.length]),roughness:.7}),l=lt.std({color:new Dt(s),roughness:.75});t.trailers.set(i,[o,o,l,l,a,l])}return t.trailers.get(i)}var Jr=null;function x0(){if(Jr)return Jr;let i=document.createElement("canvas");i.width=1024,i.height=256;let t=i.getContext("2d");t.fillStyle="#d9dde2",t.fillRect(0,0,1024,256);let e=n=>256-n/1.5*256;return t.fillStyle="#1b4ea3",t.fillRect(0,e(.86),1024,e(.42)-e(.86)),t.fillStyle="#d7e64a",t.fillRect(0,e(.88),1024,5),Jr=new Ce(i),Jr.colorSpace=ce,Jr.anisotropy=4,Jr}var Nl=null;function y0(){if(Nl)return Nl;let i=document.createElement("canvas");i.width=1024,i.height=192;let t=i.getContext("2d");t.textAlign="center",t.textBaseline="middle",t.fillStyle="#ffffff",t.font="bold 118px Arial, sans-serif",t.fillText("POLIZEI",512,84),t.font="bold 40px Arial, sans-serif",t.fillText("Gifhorn",512,166);let e=new Ce(i);e.colorSpace=ce,e.anisotropy=4;let n=lt.std({map:e,transparent:!0,depthWrite:!1,roughness:.4}),s=ad("kombi").bodyShape,{n:r}={n:4.5},o=(l,c)=>{let h=s.b(l),u=s.t(l),d=Math.min(.995,Math.max(-.995,2*(c-h)/(u-h)-1));return Math.asin(Math.sign(d)*Math.pow(Math.abs(d),r/2))},a=[-1,1].map(l=>{let c=$s((u,d,f)=>Mi(s,u,d,f),(u,d)=>{let f=Qt(1.62,3.22,d),m=o(f,Qt(.47,.8,u));return[f,l>0?m:Math.PI-m]},{ns:4,nt:28,lift:.006}),h=c.attributes.uv;for(let u=0;u<h.count;u++){let d=h.getX(u),f=h.getY(u);h.setXY(u,l>0?1-f:f,d)}return c});return Nl={mat:n,geo:Re(a)},Nl}var Bl=class{constructor(t,{color:e,plate:n,company:s}={}){let r=Es();this.kind=t,this.group=new wt,this.brake=!1,this.blinkDir=0,this.police=t==="polizei";let o=t==="polizei"?"kombi":t;if(t==="lkw"){let a=g0();this.length=od,this.width=2.55,this.height=4;let l=e??ee([15921906,11540504,1920922,15250432,2236962,2976570,14343648]);this.cab=new D(a.bodyGeo,kl(l)),this.details=new D(a.detailGeo,r.detail);let c=s??Math.floor(Math.random()*Hl.length);this.company=Hl[c][0],this.trailer=new D(a.trailerGeo,v0(c)),this.tail=new D(a.tailGeo,r.tail),this.blinkL=new D(a.blinkL,r.blink),this.blinkR=new D(a.blinkR,r.blink),this.plate=new D(a.plateGeo,f0(n??ee(u0))),this.group.add(this.cab,this.details,this.trailer,this.tail,this.blinkL,this.blinkR,this.plate),this.trailer.castShadow=!0,this.cab.castShadow=!0}else{let a=ad(o),l=Qr[o];this.length=l.L,this.width=l.half*2+.12,this.height=l.H;let c;if(this.police?c=kl(16777215,x0()):t==="wohnmobil"?c=kl(16053488):c=kl(e??Bo(xM,h=>h[1])[0]),this.body=new D(a.bodyGeo,c),this.body.castShadow=!0,this.glass=new D(a.glassGeo,r.glass),this.details=new D(a.detailGeo,r.detail),this.liners=new D(a.linerGeo,r.liner),this.tail=new D(a.tailGeo,r.tail),this.blinkL=new D(a.blinkL,r.blink),this.blinkR=new D(a.blinkR,r.blink),this.plate=new D(a.plateGeo,f0(n??(this.police?"GF-3333":ee(u0)))),this.group.add(this.body,this.glass,this.details,this.liners,this.tail,this.blinkL,this.blinkR,this.plate),this.police){this.bar=a.lightbarGeo.map(u=>new D(u,r.blueOff)),this.group.add(...this.bar);let h=y0();this.group.add(new D(h.geo,h.mat))}}this.blinkL.visible=!1,this.blinkR.visible=!1,this.ground=new D(yM(this.width+.2,this.length+.35),r.ground),this.ground.renderOrder=-1,this.group.add(this.ground)}setPoliceText(t){if(!this.police)return;if(!this.display){let r=document.createElement("canvas");r.width=512,r.height=96,this.displayCanvas=r,this.displayTex=new Ce(r),this.displayTex.colorSpace=ce;let o=Qr.kombi,a=lt.basic({map:this.displayTex,toneMapped:!1});this.display=new D(new fe(.9,.17),a),this.display.position.set(0,o.H-.25,o.L/2-.18),this.display.rotation.x=-.52,this.group.add(this.display)}let e=this.displayCanvas.getContext("2d");e.fillStyle="#050505",e.fillRect(0,0,512,96),e.fillStyle="#ffb21a",e.font='bold 54px "Courier New", monospace',e.textAlign="center",e.textBaseline="middle";let n=(t||"POLIZEI GIFHORN").toUpperCase(),s=54;for(;e.measureText(n).width>490&&s>20;)s-=4,e.font=`bold ${s}px "Courier New", monospace`;e.fillText(n,256,50),this.displayTex.needsUpdate=!0}setBrake(t){t!==this.brake&&(this.brake=t,this.tail.material=t?Es().brake:Es().tail)}setBlink(t){this.blinkDir=t,t||(this.blinkL.visible=!1,this.blinkR.visible=!1)}updateLights(t,e=!1){let n=Math.sin(t*Math.PI*2*1.45)>0;if(this.blinkDir&&(this.blinkL.visible=this.blinkDir<0&&n,this.blinkR.visible=this.blinkDir>0&&n),this.bar){let s=Es(),r=Math.floor(t*7)%4;this.bar[0].material=e&&(r===0||r===2)?s.blueOn:s.blueOff,this.bar[1].material=e&&(r===1||r===3)?s.blueOn:s.blueOff}}};function ld(i=!0,t=.18){if(i&&Math.random()<t)return"lkw";let e=Object.keys(Qr);return Bo(e,n=>Qr[n].weight)}function _0(){for(let i of Object.keys(Qr))ad(i);g0();for(let i=0;i<Hl.length;i++)v0(i);x0(),y0()}var cd=[[150,205],[128,160],[112,138],[95,120]],ts=1/3.6,MM=1,Fl=class{constructor(t,e){this.scene=t,this.rain=e,this.group=new wt,this.group.name="Traffic",t.add(this.group),this.cars=[],this.oncoming=[],this.pool=new Map,this.difficulty=0,this.leftOpen=!1,this.grip=1,this.t=0,this.events=[],this.policeText=null}acquire(t,e){let n=this.pool.get(t)||[];this.pool.set(t,n);let s=n.find(r=>!r.inUse&&!e);return s||(s=new Bl(t,e),n.push(s),this.group.add(s.group)),s.inUse=!0,s.group.visible=!0,s.setBrake(!1),s.setBlink(0),s}releaseVehicle(t){t.inUse=!1,t.group.visible=!1}reset(){for(let t of this.cars)this.releaseVehicle(t.v);for(let t of this.oncoming)this.releaseVehicle(t.v);this.cars=[],this.oncoming=[],this.events=[],this.difficulty=0,this.leftOpen=!1}laneSpeed(t,e){if(e)return Tt(t===2?86:80,t===2?92:89)*ts;let[n,s]=cd[t];return Tt(n,s+this.difficulty*15)*ts}spawn(t,e,{kind:n,speed:s,behavior:r="normal",opts:o}={}){let a=n||ld(e>=2,e===3?.3:.22),l=a==="lkw";l&&e<2&&(e=2+Math.round(Math.random()));let c=this.acquire(a,o),h={id:MM++,v:c,kind:a,truck:l,lane:e,x:bt.laneCenter(e),s:t,speed:s??this.laneSpeed(e,l),len:c.length,w:c.width,v0:0,change:null,decideIn:Tt(.5,2.5),brake:!1,passed:!1,behavior:r,sirens:r==="polizei",careless:ge(.08+this.difficulty*.18),wobble:Math.random()*10};return h.v0=h.speed,r==="polizei"&&c.setPoliceText?.(this.policeText),this.cars.push(h),this.place(h,this.sPlayer??t),h}spawnOncoming(t,e=!0){let n=Math.floor(Math.random()*4),s=ld(n>=2,.2),r=this.acquire(s);r.group.rotation.y=Math.PI;let o=s==="lkw",a=o?Tt(80,89)*ts:Tt(cd[n][0]-15,cd[n][1])*ts,l={v:r,s:t+(e?Tt(700,1300):Tt(100,1200)),x:Xn(bt.laneCenter(o?2+Math.round(Math.random()):n)),speed:a,len:r.length};r.group.position.set(l.x,0,-(l.s-t)),this.oncoming.push(l)}populate(t,e){this.reset(),this.sPlayer=t;for(let n=0;n<18;n++){let s=M0(this.leftOpen),r=t+40+n*45+Tt(0,30);this.laneFree(s,r,30)&&this.spawn(r,s)}for(let n=0;n<10;n++)this.spawnOncoming(t,!1)}laneFree(t,e,n){for(let s of this.cars)if(Wo(s,t)&&Math.abs(s.s-e)<n+s.len)return!1;return!0}place(t,e){t.v.group.position.set(t.x,0,-(t.s-e))}update(t,e,n,s){this.t=e,this.sPlayer=n.s,this.events.length=0,this.difficulty=s.difficulty,this.leftOpen=s.leftOpen;let r=s.rain>.3;m0(r);let o=Math.round(Qt(15,32,this.difficulty));if(this.cars.length<o){let u=M0(this.leftOpen),d=n.s+Tt(620,950);this.laneFree(u,d,60)&&this.spawn(d,u)}if(n.speed<34&&ge(t*.35)&&this.cars.length<o+4){let u=this.leftOpen?1:ge(.6)?0:1,d=n.s-Tt(150,190);this.laneFree(u,d,40)&&(this.spawn(d,u,{speed:Tt(170,215)*ts}).passed=!0)}let a=this.cars,l={s:n.s,x:n.x,speed:n.speed,len:n.len,w:n.w,isPlayer:!0};for(let u of a){if(u.decideIn-=t,!u.change&&u.decideIn<=0&&(u.decideIn=Tt(.6,1.6),this.decide(u,a,l)),u.change){let x=u.change;if(x.t+=t,x.t<x.delay)u.v.setBlink(x.to<x.from?-1:1);else{let _=Jt((x.t-x.delay)/x.dur,0,1);u.x=Qt(bt.laneCenter(x.from),bt.laneCenter(x.to),xn(0,1,_)),_>=.5&&(u.lane=x.to),_>=1&&(u.change=null,u.v.setBlink(0))}}let d=this.leader(u,a,l),f=u.truck?1.7:1.25+(u.careless?-.4:0),m=u.truck?.6:1.6,v=2.8,g=3,p=m*(1-Math.pow(u.speed/Math.max(1,u.v0),4));if(d){let x=Math.max(.1,d.s-u.s-(d.len+u.len)/2),_=u.speed-d.speed,y=g+Math.max(0,u.speed*f+u.speed*_/(2*Math.sqrt(m*v)));p-=m*Math.pow(y/x,2),x<4&&_>0&&(p=Math.min(p,-9))}p=Jt(p,-10,m),u.speed=Math.max(0,u.speed+p*t),u.brake=p<-1.2,u.v.setBrake(u.brake||u.speed<3),u.s+=u.speed*t}for(let u=0;u<a.length;u++)for(let d=u+1;d<a.length;d++){let f=a[u],m=a[d];if(Math.abs(f.x-m.x)>(f.w+m.w)/2-.2)continue;let v=m.s-f.s,g=(f.len+m.len)/2+.5;if(Math.abs(v)<g){let p=v>0?f:m,x=v>0?m:f;p.s=x.s-g,p.speed=Math.min(p.speed,x.speed)}}for(let u of a){let d=Math.abs(u.x-n.x),f=u.s-n.s,m=(u.w+n.w)/2-d,v=(u.len+n.len)/2-Math.abs(f);if(m>.08&&v>.05&&(f<0&&m>.6&&u.speed>n.speed?(u.s=n.s-(u.len+n.len)/2-.4,u.speed=Math.min(u.speed,n.speed*.95)):(u.contactT=e,this.events.push({type:"crash",car:u,ds:f,dx:u.x-n.x,latOverlap:m,lonOverlap:v}))),!u.passed&&f<-(u.len+n.len)/2){u.passed=!0;let g=d-(u.w+n.w)/2,p=n.speed-u.speed,x=e-(u.contactT??-1e9)<2;g<.85&&g>-.05&&p>6&&!x&&this.events.push({type:"nearMiss",car:u,clearance:g,rel:p}),u.behavior==="polizei"&&this.events.push({type:"passPolice",car:u})}f>0&&(u.passed=!1)}let c=[];for(let u of a){let d=u.s-n.s;if(d<-240||d>1250){this.releaseVehicle(u.v);continue}if(c.push(u),this.place(u,n.s),u.v.group.rotation.y=u.change&&u.change.t>u.change.delay?u.change.to>u.change.from?-.035:.035:0,u.v.updateLights(e,u.sirens),r&&d>-10&&d<140){let f=-d+u.len/2;this.rain.emit(u.x,f,u.w,u.speed,u.truck?3:1)}}this.cars=c;let h=[];for(let u of this.oncoming){u.s-=u.speed*t;let d=u.s-n.s;if(d<-200){this.releaseVehicle(u.v),u.v.group.rotation.y=0;continue}u.v.group.position.set(u.x,0,-d),h.push(u)}for(this.oncoming=h;this.oncoming.length<11;)this.spawnOncoming(n.s,!0);return this.events}leader(t,e,n){let s=null,r=1/0,o=t.change&&t.change.t>=t.change.delay?[t.change.from,t.change.to]:[t.lane];for(let l of e){if(l===t)continue;let c=l.s-t.s;c<=0||c>220||c>=r||o.some(h=>Wo(l,h))&&(s=l,r=c)}let a=n.s-t.s;return a>0&&a<r&&o.some(l=>Wo(n,l))&&(s=n),s}decide(t,e,n){if(t.behavior==="elefant")return;let s=this.leader(t,e,n),r=t.truck?2:0;if(s&&t.lane>r&&s.s-t.s-(s.len+t.len)/2<70&&s.speed<t.v0-2.5){let a=t.lane-1;if(!(t.truck&&a<2)&&this.safe(t,a,e,n))return this.startChange(t,a)}if(t.lane<3&&!(t.truck&&t.lane>=3)){let o=t.lane===0&&this.leftOpen?.65:t.behavior==="schleicher"?.02:.25;if(ge(o)){let a=t.lane+1;if(this.laneClearAhead(t,a,e,n,90)&&this.safe(t,a,e,n))return this.startChange(t,a)}}if(t.careless&&ge(.04+this.difficulty*.12)){let o=t.lane+(ge(.5)?-1:1);o>=r&&o<=3&&this.safe(t,o,e,n,!0)&&this.startChange(t,o)}}laneClearAhead(t,e,n,s,r){for(let o of[...n,s]){if(o===t)continue;let a=o.s-t.s;if(a>-10&&a<r&&Wo(o,e))return!1}return!0}safe(t,e,n,s,r=!1){for(let o of[...n,s]){if(o===t||!Wo(o,e)&&!(o.change&&o.change.to===e))continue;let a=o.s-t.s,l=(o.len+t.len)/2;if(a>=0){if(a-l<Math.max(8,t.speed*(r?.3:.6)))return!1}else{let c=-a-l,h=o.speed-t.speed,u=o.isPlayer?r?6:14:8;if(c<u+Math.max(0,h)*(r?.6:2.2))return!1}}return!0}startChange(t,e){t.change={from:t.lane,to:e,t:0,delay:t.careless?Tt(.15,.5):Tt(.9,1.6),dur:t.truck?Tt(4,5.5):Tt(2.4,3.6)}}megafon(t){let e=0,n={s:t.s,x:t.x,speed:t.speed,len:t.len,w:t.w,isPlayer:!0};for(let s of this.cars){let r=s.s-t.s;if(r>0&&r<160&&Math.abs(s.x-t.x)<2.6&&!s.change&&s.behavior!=="elefant"){let a=[s.lane+1,s.lane-1].filter(l=>l>=(s.truck?2:0)&&l<=3&&this.safe(s,l,this.cars,n,!0)).sort((l,c)=>Math.abs(bt.laneCenter(c)-t.x)-Math.abs(bt.laneCenter(l)-t.x))[0];a!==void 0&&(s.change={from:s.lane,to:a,t:0,delay:.3,dur:1.8},s.decideIn=10+Tt(0,5),e++)}}return e}elefantenrennen(t){let e=t+420;for(let r of this.cars)r.s>e-60&&r.s<e+60&&r.lane>=2&&(this.releaseVehicle(r.v),r.s=-1e9);this.cars=this.cars.filter(r=>r.s>-1e8);let n=this.spawn(e,3,{kind:"lkw",speed:84*ts,behavior:"elefant"}),s=this.spawn(e+6,2,{kind:"lkw",speed:84.6*ts,behavior:"elefant"});return setTimeout(()=>{s&&(s.behavior="normal")},26e3),[n,s]}police(t,e){this.policeText=e;let n=this.leftOpen?1:0,s=this.spawn(t-170,n,{kind:"polizei",speed:185*ts,behavior:"polizei"});return s.v0=185*ts,s.passed=!0,s}nearby(t,e=130){let n=[];for(let s of this.cars){let r=s.s-t.s;r>-25&&r<e&&n.push({dx:s.x,ds:r,len:s.len,w:s.w,kind:s.kind,brake:s.brake})}return n}};function Wo(i,t){let e=bt.laneCenter(t),n=Math.max(i.x-i.w/2,e-1.875);return Math.min(i.x+i.w/2,e+1.875)-n>.35}function M0(i){let t=Math.random();return i?t<.08?0:t<.32?1:t<.62?2:3:t<.17?0:t<.4?1:t<.66?2:3}var bi={skin:14263415,skinDark:13208418,black:1315862,shirt:1447448,hair:3811356,beard:2825492,pants:3421498,shoe:986896,white:16250352,mouth:7023141},Qs={shoulder:[.165,.53,0],upperArm:.15,foreArm:.14,head:.745},hd=null;function es(i,t,{sheen:e=.9,rough:n=.95,side:s=Ri}={}){hd||(hd=yl(11));let r=new xi({color:i,roughness:n,metalness:0,sheen:e,sheenRoughness:.55,sheenColor:new Dt(i).lerp(new Dt(16777215),.35),bumpMap:hd,bumpScale:.6,side:s});return t?Ii(r):r}function Js(i,t,e={}){let n=new pe({color:i,roughness:.4,metalness:0,...e});return t?Ii(n):n}function js(i,t,e,n=10){return new D(new Fr(i,t,6,n),e)}function Rn(i,t,e=18,n=14){return new D(new _e(i,e,n),t)}var Ol=(i,t,e)=>{let n=Math.min(1,Math.max(0,(e-i)/(t-i)));return n*n*(3-2*n)},Ne=()=>new A,Yn={d:Ne(),u:Ne(),v:Ne(),e:Ne(),u1:Ne(),u2:Ne(),x:Ne(),y:Ne(),z:Ne(),down:new A(0,-1,0),m:new jt,q:new qe};function bM(i,t,e,n){let s=i.position,r=Yn.d.subVectors(t,s),o=r.length(),a=Qs.upperArm,l=Qs.foreArm,c=a+l-.003,h=Math.abs(a-l)+.03;o<1e-6&&(r.set(0,-1,0),o=1);let u=Yn.u.copy(r).divideScalar(o);o=Math.min(c,Math.max(h,o));let d=Yn.v.copy(e).addScaledVector(u,-e.dot(u));d.lengthSq()<1e-8&&d.set(0,-1,0).addScaledVector(u,-u.y),d.normalize();let f=Math.min(1,Math.max(-1,(a*a+o*o-l*l)/(2*a*o))),m=Math.sqrt(1-f*f),v=Yn.u1.copy(u).multiplyScalar(f).addScaledVector(d,m),g=Yn.e.copy(s).addScaledVector(v,a),p=Yn.u2.copy(s).addScaledVector(u,o).sub(g).normalize();i.quaternion.setFromUnitVectors(Yn.down,v);let x=Yn.y.copy(p).negate(),_=Yn.z.copy(n).addScaledVector(x,-n.dot(x));_.lengthSq()<1e-8&&_.set(0,0,1).addScaledVector(x,-x.z),_.normalize();let y=Yn.x.crossVectors(x,_);Yn.m.makeBasis(y,x,_),Yn.q.setFromRotationMatrix(Yn.m),i.userData.elbow.quaternion.copy(i.quaternion).invert().multiply(Yn.q)}var EM=new A(.292,.765,.04),wM=new A(.255,.6,.13),SM=new A(.55,-.1,.83).normalize(),TM=new A(1,-.45,-.1).normalize(),to={p:Ne(),n:Ne(),c:Ne(),pole:Ne(),palm:Ne(),a:Ne(),b:Ne()};function AM(i,t,{wave:e=0,steer:n=0,t:s=0}={},r={pos:Ne(),pole:Ne(),palm:Ne()}){let o=(i>0?Math.PI-.3:.3)+n*.5,a=Math.cos(o),l=Math.sin(o),c=t.r+.012;if(r.pos.set(a*c,l*c,.026).applyMatrix4(t.m),to.n.set(-a,-l,-.45).transformDirection(t.m),r.palm.copy(to.n),r.pole.set(i*.55,-1,-.15).normalize(),i>0&&e>0){let h=e,u=(1-h)*(1-h),d=2*(1-h)*h,f=h*h;to.a.copy(r.pos).multiplyScalar(u).addScaledVector(wM,d).addScaledVector(EM,f);let m=Ol(.7,1,h);to.a.x+=Math.sin(s*9)*.026*m,to.a.y+=Math.abs(Math.cos(s*9))*.008*m,r.pos.copy(to.a),r.pole.lerp(TM,Ol(.15,.85,h)).normalize(),r.palm.lerp(SM,Ol(.2,.9,h)).normalize()}return r}function b0({curved:i=!0}={}){let t=new wt;t.name="MiniAdam";let e=es(bi.skin,i),n=es(bi.skinDark,i),s=es(bi.shirt,i,{sheen:.6}),r=es(bi.shirt,i,{sheen:.6,side:he}),o=es(bi.black,i,{sheen:.5,side:he}),a=es(bi.hair,i,{sheen:1,rough:1}),l=es(bi.beard,i,{sheen:1,rough:1}),c=es(bi.pants,i,{sheen:.7}),h=es(bi.shoe,i,{sheen:.4}),u=Js(bi.white,i,{roughness:.25}),d=Js(657930,i,{roughness:.15}),f=Js(bi.mouth,i,{roughness:.6}),m=Js(1710618,i,{roughness:.35,metalness:.4}),v=Js(3947580,i,{roughness:.8,metalness:.3}),g=Kr({w:256,h:256}),p=new pe({map:g,transparent:!0,roughness:.9,alphaTest:.2,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1});i&&Ii(p);let x=new wt;x.name="body",t.add(x);let _=js(.15,.12,s,14);_.scale.set(1.08,1,.86),_.position.y=.43,x.add(_);let y=new D(new Yt(.152,.152,.16,20,1,!0,-.62,1.24),p);y.scale.set(1.08,1,.86),y.position.set(0,.45,0),x.add(y);let I=new Yt(.058,.066,.085,16,1,!0),T=new wt,S=new wt,[P,b]=Qs.shoulder;T.position.set(-P,b,0),S.position.set(P,b,0),x.add(T,S);for(let[B,j]of[[T,-1],[S,1]]){let rt=Rn(.063,s,16,12);B.add(rt);let mt=new D(I,r);mt.position.y=-.045,B.add(mt);let Ot=js(.041,.1,e);Ot.position.y=-.085,B.add(Ot);let at=new wt;at.position.y=-Qs.upperArm,B.add(at);let Et=js(.039,.085,e);Et.position.y=-.062,at.add(Et);let Nt=new wt;Nt.position.y=-Qs.foreArm,at.add(Nt);let Gt=Rn(.05,e);Gt.scale.set(1,1.12,.64),Nt.add(Gt);let Ct=js(.017,.026,e,8);Ct.position.set(j*.042,.006,.012),Ct.rotation.z=-j*.75,Nt.add(Ct),B.userData.elbow=at,B.userData.hand=Nt}let M=new wt,C=new D(new Yt(.016,.012,.13,12),m);C.position.y=-.02;let k=Rn(.03,v,14,10);k.position.y=.065,M.add(C,k),M.position.set(0,.02,.035),S.userData.hand.add(M);let N=new wt;x.add(N);let z=new wt,X=new wt;z.position.set(-.075,.29,0),X.position.set(.075,.29,0),N.add(z,X);for(let B of[z,X]){let j=js(.072,.13,c);j.position.y=-.11,B.add(j);let rt=Rn(.075,h);rt.scale.set(1,.7,1.35),rt.position.set(0,-.245,.03),B.add(rt),B.userData.shoe=rt,B.userData.thigh=j}let H=new wt;H.position.y=Qs.head,x.add(H);let J=Rn(.16,e,28,22);J.scale.set(1,1,.95),H.add(J);for(let B of[-1,1]){let j=Rn(.035,e);j.scale.set(.6,1,.8),j.position.set(B*.158,-.005,-.01),H.add(j)}let W=[[0,0,-.13,.085],[-.08,-.02,-.12,.075],[.08,-.02,-.12,.075],[-.13,.01,-.06,.07],[.13,.01,-.06,.07],[-.145,-.04,0,.055],[.145,-.04,0,.055],[-.05,-.07,-.13,.07],[.05,-.07,-.13,.07],[0,.03,-.11,.08]];for(let[B,j,rt,mt]of W){let Ot=Rn(mt,a,12,10);Ot.position.set(B,j,rt),Ot.scale.set(1,.9,.9),H.add(Ot)}let ct=new D(new _e(.168,26,16,Math.PI/2-1.35,2.7,Math.PI*.55,Math.PI*.38),l);H.add(ct);let ht=Rn(.075,l);ht.scale.set(1.25,.8,.9),ht.position.set(0,-.125,.08),H.add(ht);for(let B of[-1,1]){let j=Rn(.05,l,10,8);j.position.set(B*.13,-.05,.05),j.scale.set(.8,1.4,1),H.add(j)}let ft=new wt;ft.position.set(0,-.062,.151),H.add(ft);for(let B of[-1,1]){let j=js(.02,.04,l,8);j.rotation.z=Math.PI/2+B*.32,j.position.set(B*.03,-.006,-.004),ft.add(j)}let Ut=Rn(.026,f,12,8);Ut.scale.set(1.3,.55,.5),Ut.position.set(0,-.095,.146),H.add(Ut);let qt=Rn(.043,n,16,12);qt.scale.set(1.05,.95,.9),qt.position.set(0,-.016,.162),H.add(qt);let K=new wt;H.add(K);for(let B of[-1,1]){let j=B*.057,rt=.026,mt=.141,Ot=Rn(.036,u,18,14);Ot.scale.set(.86,1.12,.48),Ot.position.set(j,rt,mt);let at=Rn(.0165,d,14,10);at.scale.set(1,1.15,.42),at.position.set(j-B*.002,rt-.002,mt+.0125);let Et=Rn(.0048,u,8,6);Et.position.set(j-B*.002+.006,rt+.006,mt+.0185),K.add(Ot,at,Et)}for(let B of[-1,1]){let j=js(.009,.034,a,6);j.rotation.z=Math.PI/2+B*.2,j.position.set(B*.058,.077,.133),H.add(j)}let it=.166,gt=new wt;gt.position.y=.093,gt.rotation.x=-.14,H.add(gt);let ut=new D(new _e(it,28,14,0,Math.PI*2,0,Math.PI/2),o);ut.scale.set(1,.74,1),gt.add(ut);let At=new D(new Yt(it+.001,it+.003,.03,28,1,!0),o);At.position.y=-.012,gt.add(At);let Bt=.13,Zt=B=>Math.sqrt(it*it-B*B)-.012,te=new cn;te.moveTo(-Bt,Zt(-Bt)),te.quadraticCurveTo(-Bt-.012,it+.07,0,it+.088),te.quadraticCurveTo(Bt+.012,it+.07,Bt,Zt(Bt));for(let B=1;B<12;B++){let j=Bt-2*Bt*B/12;te.lineTo(j,Zt(j))}te.lineTo(-Bt,Zt(-Bt));let et=new si(te,{depth:.008,bevelEnabled:!0,bevelThickness:.004,bevelSize:.005,bevelSegments:2,curveSegments:10});et.deleteAttribute("uv");let pt=new D(et,o);pt.rotation.x=Math.PI/2-.1,pt.position.set(0,-.022,0),gt.add(pt);let L=Rn(.016,o,10,8);L.scale.set(1,.55,1),L.position.y=it*.74,gt.add(L);let Ft=new D(new _e(it+.0016,24,8,Math.PI/2-.45,.9,.62,.86),p);Ft.scale.set(1,.74,1),gt.add(Ft);let st=Js(14155551,i,{roughness:.6,emissive:3820032,emissiveIntensity:.25}),It=Js(14211288,i,{roughness:.2,metalness:.6}),xt=new wt,zt=new D(new Yt(.168,.165,.2,18,1,!0),st);zt.scale.set(1.08,1,.88),zt.position.y=.43,xt.add(zt);let St=new D(new Yt(.118,.168,.075,18,1,!0),st);St.scale.set(1.08,1,.88),St.position.y=.567,xt.add(St);for(let B of[-1,1]){let j=Rn(.071,st,18,12);j.position.set(B*P,b+.002,0),xt.add(j)}for(let B of[.38,.47]){let j=new D(new Yt(.17,.17,.022,18,1,!0),It);j.scale.set(1.08,1,.88),j.position.y=B,xt.add(j)}xt.visible=!1,x.add(xt),t.traverse(B=>{B.isMesh&&(B.castShadow=!0,B.receiveShadow=!1)});let R={m:new jt().makeRotationX(.35).setPosition(0,.44,.22),r:.17},E=[{pos:Ne(),pole:Ne(),palm:Ne()},{pos:Ne(),pole:Ne(),palm:Ne()}],G=B=>{for(let[j,rt,mt]of[[T,-1,E[0]],[S,1,E[1]]])AM(rt,R,B,mt),bM(j,mt.pos,mt.pole,mt.palm),j.userData.hand.rotation.set(0,0,rt>0?Math.sin(V(B)-.6)*.3*Ol(.7,1,B.wave||0):0)},V=B=>(B.t||0)*9,$={root:t,body:x,head:H,armL:T,armR:S,legL:z,legR:X,mic:M,vest:xt,eyes:K,pose:"stand",setVest(B){xt.visible=!!B},setWheel(B,j=.17){R.m.copy(B),R.r=j,$.pose==="drive"&&G({})},setPose(B){$.pose=B,M.visible=B!=="drive",B==="drive"?(z.rotation.x=-1.45,X.rotation.x=-1.45,z.position.y=X.position.y=.3,T.userData.hand.rotation.set(0,0,0),S.userData.hand.rotation.set(0,0,0),G({})):(z.rotation.x=X.rotation.x=0,T.rotation.set(0,0,.18),T.userData.elbow.rotation.set(-.2,0,0),T.userData.hand.rotation.set(0,0,0),S.rotation.set(-.9,.3,-.3),S.userData.elbow.rotation.set(-1.5,0,0),S.userData.hand.rotation.set(0,0,0))},animate(B,j={}){let rt=j.wave||0,mt=j.steer||0;if(H.rotation.y=(j.look||0)*.6+Math.sin(B*.7)*.05,H.rotation.z=Math.sin(B*1.3)*.03-mt*.12,H.position.y=Qs.head+Math.sin(B*2.2)*.004,$.pose==="drive")G({steer:mt,wave:rt,t:B});else{T.rotation.z=.18+Math.sin(B*1.1)*.03,rt>0&&T.rotation.set(-.3*rt,0,.18+2.4*rt+Math.sin(B*9)*.3*rt);let Ot=j.talk||0;S.rotation.x=-.9+Math.sin(B*6)*.04*Ot}}};return $.setPose("stand"),$}var Xo=new A;function ri(i,t,e,n,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;Xo.copy(t),Xo[n]=0,Xo.normalize();let c=.5*o/(o+a),h=1-Xo.angleTo(i)/l;return Math.sign(Xo[e])===1?h*c:a/(o+a)+c+c*(1-h)}var ws=class extends Ht{constructor(t=1,e=1,n=1,s=2,r=.1){if(s=s*2+1,r=Math.min(t/2,e/2,n/2,r),super(1,1,1,s,s,s),s===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let a=new A,l=new A,c=new A(t,e,n).divideScalar(2).subScalar(r),h=this.attributes.position.array,u=this.attributes.normal.array,d=this.attributes.uv.array,f=h.length/6,m=new A,v=.5/s;for(let g=0,p=0;g<h.length;g+=3,p+=2)switch(a.fromArray(h,g),l.copy(a),l.x-=Math.sign(l.x)*v,l.y-=Math.sign(l.y)*v,l.z-=Math.sign(l.z)*v,l.normalize(),h[g+0]=c.x*Math.sign(a.x)+l.x*r,h[g+1]=c.y*Math.sign(a.y)+l.y*r,h[g+2]=c.z*Math.sign(a.z)+l.z*r,u[g+0]=l.x,u[g+1]=l.y,u[g+2]=l.z,Math.floor(g/f)){case 0:m.set(1,0,0),d[p+0]=ri(m,l,"z","y",r,n),d[p+1]=1-ri(m,l,"y","z",r,e);break;case 1:m.set(-1,0,0),d[p+0]=1-ri(m,l,"z","y",r,n),d[p+1]=1-ri(m,l,"y","z",r,e);break;case 2:m.set(0,1,0),d[p+0]=1-ri(m,l,"x","z",r,t),d[p+1]=ri(m,l,"z","x",r,n);break;case 3:m.set(0,-1,0),d[p+0]=1-ri(m,l,"x","z",r,t),d[p+1]=1-ri(m,l,"z","x",r,n);break;case 4:m.set(0,0,1),d[p+0]=1-ri(m,l,"x","y",r,t),d[p+1]=1-ri(m,l,"y","x",r,e);break;case 5:m.set(0,0,-1),d[p+0]=ri(m,l,"x","y",r,t),d[p+1]=1-ri(m,l,"y","x",r,e);break}}};var oi={length:4.69,width:1.85,height:1.443,wheelR:.335,frontAxleZ:.84-4.69/2,rearAxleZ:3.715-4.69/2,trackHalf:.79,plate:"F-LV 333"},TE=new A(-.37,1.2,.27),io=oi.length,w0=[.84,3.715],S0=Bn([[0,.5],[.03,.56],[.1,.625],[.2,.675],[.45,.73],[.8,.79],[1.2,.86],[1.52,.92],[2.4,.965],[3.3,.995],[3.95,1.03],[4.25,1.05],[4.55,1.055],[4.64,1.04],[4.69,.95]]),T0=Bn([[0,.31],[.06,.22],[.15,.18],[.5,.17],[4.3,.18],[4.6,.25],[4.69,.42]]),RM=El(T0,w0,.405,.335),CM=Bn([[0,.6],[.08,.77],[.25,.86],[.6,.905],[1.2,.925],[3.6,.925],[4.3,.9],[4.6,.845],[4.69,.77]]),PM=Bn([[1.48,.93],[1.7,1.04],[2,1.2],[2.25,1.35],[2.5,1.415],[2.8,1.44],[3.1,1.44],[3.4,1.415],[3.7,1.3],[3.95,1.17],[4.15,1.075],[4.24,1.045]]),IM=Bn([[1.48,.8],[1.8,.84],[2.3,.8],[2.9,.74],[3.5,.7],[4,.63],[4.24,.57]]);function Me(i){return i-io/2}var pd={w:CM,b:T0,t:S0,tw:.9,bw:.94,n:4.6,L:io,bx:wl(RM,.48,.7)},LM=3.2,DM=.76,A0={w:IM,b:i=>S0(i)-.05,t:PM,tw:DM,bw:1,n:LM,L:io},dd=(i,t,e)=>Mi(pd,i,t,e),kM={...pd,bx:null};function UM(i,t,e=.415,n=.345){let s=new A,r=[],o=null;for(let l=0;l<=96;l++){Mi(kM,i,-Math.PI/2+l/96*(Math.PI/2),s);let c=[s.x-.005,s.y+.003];if(o){if(o[0]<e&&c[0]>=e){let h=(e-o[0])/(c[0]-o[0]);r.push([e,o[1]+h*(c[1]-o[1])])}if(c[1]>=n){let h=(n-o[1])/(c[1]-o[1]);r.push([o[0]+h*(c[0]-o[0]),n]);break}c[0]>=e&&r.push(c)}o=c}r.push([e,n]);let a=new vi(new cn(r.map(([l,c])=>new nt(t*l,c))));return a.translate(0,0,Me(i)),a}var fd=(i,t,e)=>Mi(A0,i,t,e),Ke=(i,t,e)=>i+(t-i)*e,no=.34,eo=(i,t)=>i>0?t:Math.PI-t,NM=[[.05,1.24],[.085,1],[.13,.86],[.24,.8],[.4,.76]],HM=[[.03,1.2],[.025,.86],[.05,.54],[.16,.55],[.4,.7]];function E0(i,t){let e=Math.min(i.length-1.000001,Math.max(0,t*(i.length-1))),n=Math.floor(e),s=e-n,r=i[Math.max(0,n-1)],o=i[n],a=i[n+1],l=i[Math.min(i.length-1,n+2)],c=h=>.5*(2*o[h]+(-r[h]+a[h])*s+(2*r[h]-5*o[h]+4*a[h]-l[h])*s*s+(-r[h]+3*o[h]-3*a[h]+l[h])*s*s*s);return[c(0),c(1)]}function BM(i,t){let e=E0(NM,t),n=E0(HM,t);return[Ke(n[0],e[0],i),Ke(n[1],e[1],i)]}function FM(i,t){let e=0,n=Math.PI/2,s=new A,r=Math.abs(t);for(let o=0;o<30;o++){let a=(e+n)/2;dd(i,a,s),s.x>r?e=a:n=a}return dd(i,(e+n)/2,s).y}function ud(i,t){let e=no,n=Math.PI/2,s=new A,r=Math.abs(t);for(let o=0;o<30;o++){let a=(e+n)/2;fd(i,a,s),s.x>r?e=a:n=a}return fd(i,(e+n)/2,s).y}function R0(){let i=new wt;i.name="Tesla";let t=lt.phys({color:395016,metalness:.5,roughness:.34,clearcoat:1,clearcoatRoughness:.12,envMapIntensity:1.25}),e=lt.phys({color:329740,metalness:.25,roughness:.04,transparent:!0,opacity:.74,envMapIntensity:2.6,depthWrite:!1}),n=lt.std({color:723724,roughness:.8,side:he}),s=lt.std({color:1316118,roughness:.55}),r=lt.phys({color:197380,metalness:.3,roughness:.12,clearcoat:1,clearcoatRoughness:.08,side:he}),o=lt.std({color:13162214,emissive:15397887,emissiveIntensity:1.1,roughness:.15,metalness:.2,side:he}),a=lt.phys({color:11450047,metalness:1,roughness:.28,clearcoat:1,clearcoatRoughness:.04,side:he}),l=lt.phys({color:790550,metalness:.5,roughness:.1,clearcoat:1,side:he}),c=lt.std({color:3802373,emissive:16711680,emissiveIntensity:.2,roughness:.25,side:he}),h=lt.std({color:1776414,roughness:.85}),u=lt.basic({color:8365256}),d=Di({u0:0,u1:io,...pd,segs:150,ring:44,H:1.5,capDome:.8}),f=new D(d,t);f.castShadow=!0,i.add(f);let m=Di({u0:1.48,u1:4.24,...A0,segs:70,ring:32,H:1.5}),v=new D(m,e);v.renderOrder=2,i.add(v);let g=[],p=(Q,vt)=>$s(fd,Q,vt);for(let Q of[-1,1])g.push(p((vt,Mt)=>[Ke(Ke(1.5,2.25,Mt),Ke(1.6,2.36,Mt),vt),eo(Q,Ke(-.74,no+.04,Mt))],{ns:2,nt:18,lift:.005})),g.push(p((vt,Mt)=>[Ke(2.76,2.88,vt),eo(Q,Ke(-.74,no+.04,Mt))],{ns:2,nt:14,lift:.005})),g.push(p((vt,Mt)=>[Ke(Ke(4,3.62,Mt),4.24,vt),eo(Q,Ke(-.74,no+.04,Mt))],{ns:8,nt:14,lift:.005})),g.push(p((vt,Mt)=>[Ke(1.52,4.1,Mt),eo(Q,Ke(-.86,-.66,vt))],{ns:2,nt:30,lift:.004}));g.push(p((Q,vt)=>[Ke(2.3,4.24,vt),Ke(no,Math.PI-no,Q)],{ns:18,nt:34,lift:.004}));let x=new D(Re(g),r);x.castShadow=!0,i.add(x);let _=[];for(let Q of w0)for(let vt of[-1,1]){let Mt=new Yt(.405,.405,.5,22,1,!0,0,Math.PI);Mt.rotateZ(Math.PI/2),Mt.translate(vt*.665,.335,Me(Q));let U=new Gn(.405,22,0,Math.PI);U.rotateY(Math.PI/2),U.translate(vt*.415,.335,Me(Q)),_.push(Mt,U);for(let dt of[-1,1])_.push(UM(Q+dt*(.405-.012),vt))}i.add(new D(Re(_.map(Q=>Q.index?Q.toNonIndexed():Q)),n));let y=(Q,vt,Mt)=>{let U=new cn;U.moveTo(-Q/2+Mt,-vt/2),U.lineTo(Q/2-Mt,-vt/2),U.quadraticCurveTo(Q/2,-vt/2,Q/2,-vt/2+Mt),U.lineTo(Q/2,vt/2-Mt),U.quadraticCurveTo(Q/2,vt/2,Q/2-Mt,vt/2),U.lineTo(-Q/2+Mt,vt/2),U.quadraticCurveTo(-Q/2,vt/2,-Q/2,vt/2-Mt),U.lineTo(-Q/2,-vt/2+Mt),U.quadraticCurveTo(-Q/2,-vt/2,-Q/2+Mt,-vt/2);let dt=new vi(U,6);return dt.deleteAttribute("uv"),dt},I=y(.8,.03,.015);I.rotateY(Math.PI),I.translate(0,.333,Me(0)-.003);let T=y(1.08,.07,.03);T.translate(0,.475,Me(io)+.003),i.add(new D(Re([I,T]),s));let S=(Q,vt)=>$s(dd,Q,vt),P=[],b=[],M=[],C=[];for(let Q of[-1,1]){let vt=(Mt,U)=>{let[dt,Z]=BM(Mt,U);return[dt,eo(Q,Z)]};P.push(S(vt,{ns:8,nt:24,lift:.004}));for(let[Mt,U]of[[.34,.1],[.58,.11]])b.push(S((dt,Z)=>vt(.4+.24*dt*Math.cos(Z*Math.PI*2),Mt+U*dt*Math.sin(Z*Math.PI*2)),{ns:3,nt:18,lift:.006}));M.push(S((Mt,U)=>vt(Ke(.8,.94,Mt),Ke(.08,.95,U)),{ns:2,nt:22,lift:.007})),C.push(S((Mt,U)=>[Ke(4.4,4.672,U),eo(Q,Ke(Ke(.5,.36,U),Ke(.78,1,U),Mt))],{ns:6,nt:14,lift:.006}))}i.add(new D(Re(P),a)),i.add(new D(Re(b),l)),i.add(new D(Re(M),o));let k=new D(Re(C),c);i.add(k);let N=lt.std({map:xl(oi.plate),roughness:.5}),z=new fe(.52,.112),X=new D(z,N);X.position.set(0,.415,Me(0)-.012),X.rotation.y=Math.PI;let H=new D(z,N);H.position.set(0,.62,Me(io)+.004),i.add(X,H);let J=new fe(.34,.34,8,8),W=J.attributes.position;for(let Q=0;Q<W.count;Q++){let vt=W.getX(Q),Mt=4.44-W.getY(Q);W.setXYZ(Q,vt,FM(Mt,vt)+.003,Me(Mt))}J.computeVertexNormals();let ct=new D(J,lt.std({map:Kr({w:256,h:256}),transparent:!0,roughness:.4,alphaTest:.3,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));i.add(ct);let ht=[],ft=[],Ut=Me(1.8);for(let Q of[-1,1]){let vt=Q*1,Mt=1,U=Sl(Q);U.translate(vt,Mt,Ut),ht.push(U),ht.push(Ie(.1,.032,.045,Q*.86,.968,Ut-.045,0,0,Q*.22));let dt=new vi(Go(.9,Q),10);dt.deleteAttribute("uv"),dt.translate(vt,Mt,Ut+.002),ft.push(dt)}let qt=Re(ht.map(Q=>Q.index?Q.toNonIndexed():Q));i.add(new D(qt,t)),i.add(new D(Re(ft),lt.std({color:10465988,metalness:1,roughness:.06})));let K=t0(oi.wheelR,.235,24),it=lt.std({color:1118481,roughness:.9}),gt=lt.std({map:Xp(),roughness:.45,metalness:.5}),ut=[];for(let Q of[oi.frontAxleZ,oi.rearAxleZ])for(let vt of[-1,1]){let Mt=new wt;Mt.rotation.order="YXZ",Mt.position.set(vt*oi.trackHalf,oi.wheelR,Q);let U=new D(K,it);U.castShadow=!0;let dt=new D(Vo(oi.wheelR*.7,vt*.119,0,0,vt),gt);Mt.add(U,dt),i.add(Mt),ut.push(Mt)}let At=(Q,vt,Mt,U,dt,Z,ot=0,Lt=.03)=>{let Pt=new ws(Q,vt,Mt,3,Math.min(Lt,Q/2-.001,vt/2-.001,Mt/2-.001));return ot&&Pt.rotateX(ot),Pt.translate(U,dt,Z),Pt},Bt=[];Bt.push(At(1.3,.18,.42,0,.79,Me(1.74),0,.05));for(let Q of[-1,1])Bt.push(At(.5,.12,.5,Q*.37,.5,Me(2.72),0,.04)),Bt.push(At(.5,.64,.12,Q*.37,.86,Me(3),-.2,.05)),Bt.push(At(.27,.19,.1,Q*.37,1.25,Me(3.07),-.1,.045));Bt.push(At(1.36,.16,.5,0,.5,Me(3.62),0,.04)),Bt.push(At(1.12,.55,.12,0,.82,Me(3.92),-.18,.05)),Bt.push(At(.22,.2,.8,0,.55,Me(2.6),0,.04));let Zt=new D(Re(Bt),h);i.add(Zt);let te=new D(new fe(.33,.2),u);te.position.set(0,1,Me(1.93)),te.rotation.x=-.2,i.add(te);let et=new D(new Vn(.17,.022,10,28),h);et.position.set(-.37,.84,Me(2.4)),et.rotation.x=-.35,i.add(et);let pt=new A(0,0,1).applyEuler(et.rotation),L=new D(new Yt(.055,.06,.04,18),h);L.quaternion.setFromUnitVectors(new A(0,1,0),pt),L.position.copy(et.position).addScaledVector(pt,-.01);let Ft=new D(new Yt(.03,.036,.46,12),h);Ft.quaternion.copy(L.quaternion),Ft.position.copy(et.position).addScaledVector(pt,-.25),i.add(L,Ft);let st=b0({curved:!0});st.setPose("drive"),st.root.position.set(-.37,.4,Me(2.62)),st.root.rotation.y=Math.PI,i.add(st.root),st.root.updateMatrix(),et.updateMatrix(),st.setWheel(st.root.matrix.clone().invert().multiply(et.matrix),.17);let It=new D(new Yt(.2,.22,.07,18),lt.phys({color:11538987,roughness:.9,sheen:1,sheenColor:new Dt(16737920)}));It.position.set(-.37,.59,Me(2.72)),i.add(It);let xt=new D(new Yt(.18,.2,.07,18),lt.phys({color:1920928,roughness:.9,sheen:1,sheenColor:new Dt(7842047)}));xt.position.set(-.37,.655,Me(2.71)),i.add(xt);let zt=new al(16773597,0,2.2,.62,.6,1.5);zt.position.set(-.37,1.24,Me(2.24)),zt.target.position.set(-.37,.96,Me(2.66)),i.add(zt,zt.target);let St=lt.basic({color:0,map:_l(),transparent:!0,opacity:.55,depthWrite:!1}),R=new D(new fe(2.2,5.15),St);R.rotation.x=-Math.PI/2,R.position.set(0,.02,0),R.renderOrder=-1,i.add(R);let E=[],G=2.5,V=ud(G,0),$=new Yt(.05,.055,.012,20);$.translate(0,V+.004,Me(G)),E.push($);let B=new Yt(.012,.016,.03,10);B.translate(0,V+.024,Me(G)),E.push(B),E.push(At(.12,.068,.1,0,V+.07,Me(G),0,.012));let j=3.45;for(let Q=0;Q<3;Q++){let vt=-.18+Q*.18,Mt=ud(j,vt),U=new Yt(.03,.034,.014,16);U.translate(vt,Mt+.005,Me(j)),E.push(U);let dt=new Yt(.005,.009,.17,8);dt.translate(0,.085,0),dt.rotateX(.22),dt.translate(vt,Mt+.01,Me(j)),E.push(dt);let Z=new _e(.009,8,6);Z.translate(0,.17,0),Z.rotateX(.22),Z.translate(vt,Mt+.01,Me(j)),E.push(Z)}i.add(new D(Re(E.map(Q=>Q.index?Q.toNonIndexed():Q)),s));let rt=new D(new Gn(.025,14),lt.std({color:2241348,metalness:.9,roughness:.1}));rt.position.set(0,V+.07,Me(G)-.051),rt.rotation.y=Math.PI,i.add(rt);let mt=new D(new _e(.008,8,6),lt.basic({color:16720418}));mt.position.set(.04,V+.092,Me(G)-.048),i.add(mt);let Ot=new wt,at=lt.std({color:15921906,roughness:.5}),Et=new D(new Yt(.29,.27,.035,28),at);Et.rotation.x=-.35,Et.position.y=.16;let Nt=new D(new Yt(.025,.03,.16,8),at);Nt.position.y=.08,Ot.add(Et,Nt),Ot.position.set(0,ud(3.05,0),Me(3.05)),Ot.visible=!1,i.add(Ot),i.traverse(Q=>{Q.isMesh&&Q!==v&&Q!==R&&(Q.castShadow=!0)});let Gt=0,Ct=!1;return{root:i,adam:st,glass:e,wheels:ut,cabinLight:zt,recLed:mt,setStarlink(Q){Ot.visible=!!Q},setGroundShade(Q){St.opacity=.55+.3*Math.min(1,Math.max(0,Q))},setVest(Q){st.setVest(Q)},setBrake(Q){Q!==Ct&&(Ct=Q,c.emissiveIntensity=Q?.95:.2)},update(Q,vt,Mt,U){Gt-=vt*Q/oi.wheelR;for(let dt=0;dt<ut.length;dt++)ut[dt].rotation.x=Gt,dt<2&&(ut[dt].rotation.y=-Mt*.35);mt.visible=Math.sin(U*4)>-.2}}}var pn=256,zl=class{constructor(){this.group=new wt,this.group.name="NOMI",this.canvas=document.createElement("canvas"),this.canvas.width=pn,this.canvas.height=pn,this.ctx=this.canvas.getContext("2d"),this.tex=new Ce(this.canvas),this.tex.colorSpace=ce;let t=.066,e=new D(new Yt(.03,.042,.03,24),new pe({color:1381914,metalness:.6,roughness:.35}));e.position.y=.015,this.group.add(e),this.head=new wt,this.head.position.y=.03+t*.92,this.group.add(this.head);let n=new D(new _e(t,40,28),new xi({color:460810,metalness:.3,roughness:.18,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:1.6}));this.head.add(n);let s=.72,r=new _e(t*1.004,32,24,Math.PI/2-s,2*s,Math.PI/2-s,2*s),o=r.attributes.position,a=r.attributes.uv,l=t*Math.sin(s)*2;for(let h=0;h<o.count;h++)a.setXY(h,o.getX(h)/l+.5,o.getY(h)/l+.5);this.faceMat=new dn({map:this.tex,toneMapped:!1,transparent:!0});let c=new D(r,this.faceMat);this.head.add(c),this.ring=new D(new Vn(.036,.003,8,32),new dn({color:6737151,toneMapped:!1,transparent:!0,opacity:.6})),this.ring.rotation.x=Math.PI/2,this.ring.position.y=.031,this.group.add(this.ring),this.mood="idle",this.moodTimer=0,this.talk=0,this.talkTimer=0,this.yaw=0,this.targetYaw=0,this.lookX=0,this.lookTarget=0,this.blink=0,this.nextBlink=2,this.idleYaw=-.06,this.bounce=0,this.lastDraw=-1,this.draw(0)}setMood(t,e=2.5){this.mood=t,this.moodTimer=e,this.bounce=1}speak(t=2.5){this.talkTimer=Math.max(this.talkTimer,t),this.bounce=1}glance(t,e=1.5){this.lookTarget=Jt(t,-1,1),this.glanceTimer=e}update(t,e,n){this.moodTimer>0&&(this.moodTimer-=t,this.moodTimer<=0&&(this.mood="idle")),this.glanceTimer>0&&(this.glanceTimer-=t,this.glanceTimer<=0&&(this.lookTarget=0)),this.talkTimer=Math.max(0,this.talkTimer-t),this.talk=Hn(this.talk,this.talkTimer>0?1:0,8,t),this.targetYaw=this.talkTimer>0?n:this.idleYaw+this.lookTarget*.7+Math.sin(e*.37)*.06,this.yaw=Hn(this.yaw,this.targetYaw,5,t),this.lookX=Hn(this.lookX,this.talkTimer>0?0:this.lookTarget,6,t),this.bounce=Math.max(0,this.bounce-t*2.2),this.head.rotation.y=this.yaw,this.head.rotation.x=-.24+Math.sin(e*9)*.03*this.talk-Math.sin(this.bounce*Math.PI)*.12,this.head.position.y=.03+.066*.92+Math.sin(this.bounce*Math.PI*2)*.006,this.ring.material.opacity=.35+.4*this.talk+.15*Math.sin(e*2),this.nextBlink-=t,this.nextBlink<=0&&(this.blink=1,this.nextBlink=2.5+Math.random()*4),this.blink=Math.max(0,this.blink-t*7),e-this.lastDraw>1/30&&(this.lastDraw=e,this.draw(e),this.tex.needsUpdate=!0)}draw(t){let e=this.ctx;e.clearRect(0,0,pn,pn);let n=e.createRadialGradient(pn*.42,pn*.36,10,pn/2,pn/2,pn*.5);n.addColorStop(0,"#16202a"),n.addColorStop(.7,"#06080b"),n.addColorStop(1,"#030405"),e.fillStyle=n,e.beginPath(),e.arc(pn/2,pn/2,pn*.49,0,Math.PI*2),e.fill();let s=this.mood,r=pn/2+this.lookX*34,o=pn/2+4+Math.sin(t*10)*4*this.talk,a=46;e.save(),e.shadowColor="rgba(160,220,255,0.9)",e.shadowBlur=14,e.strokeStyle="#ffffff",e.fillStyle="#ffffff",e.lineWidth=11,e.lineCap="round",e.lineJoin="round";let l=s==="idle"||s==="talk"?this.blink:0;for(let c of[-1,1]){let h=r+c*a;this.drawEye(e,s,h,o,c,l,t)}e.restore(),e.fillStyle="rgba(255,255,255,0.07)",e.beginPath(),e.ellipse(pn*.38,pn*.26,pn*.22,pn*.09,-.5,0,Math.PI*2),e.fill()}drawEye(t,e,n,s,r,o,a){let c=70;switch(e){case"happy":t.beginPath(),t.arc(n,s+12,24,Math.PI*1.1,Math.PI*1.9),t.stroke();return;case"love":this.heart(t,n,s,26+Math.sin(a*8)*3);return;case"dizzy":{t.beginPath();for(let h=0;h<Math.PI*5;h+=.2){let u=3+h*2.6,d=n+Math.cos(h+a*6*r)*u,f=s+Math.sin(h+a*6*r)*u;h===0?t.moveTo(d,f):t.lineTo(d,f)}t.lineWidth=7,t.stroke();return}case"surprised":t.beginPath(),t.arc(n,s,30,0,Math.PI*2),t.stroke(),t.beginPath(),t.arc(n,s,9,0,Math.PI*2),t.fill();return;case"sleep":t.beginPath(),t.moveTo(n-22,s+6),t.lineTo(n+22,s+6),t.stroke();return;case"worried":t.save(),t.translate(n,s),t.rotate(r*-.35),md(t,-38/2,-c/2+8,38,c-16,18),t.stroke(),t.restore();return;case"think":r<0?(t.beginPath(),t.moveTo(n-20,s),t.lineTo(n+20,s),t.stroke()):(md(t,n-38/2,s-c/2,38,c,18),t.stroke());return;case"wink":if(r>0){t.beginPath(),t.arc(n,s+12,22,Math.PI*1.1,Math.PI*1.9),t.stroke();return}break;default:break}c=Math.max(8,c*(1-o*.92)),md(t,n-38/2,s-c/2,38,c,Math.min(18,c/2)),t.stroke()}heart(t,e,n,s){t.beginPath(),t.moveTo(e,n+s*.9),t.bezierCurveTo(e-s*1.4,n-s*.1,e-s*.6,n-s*1.1,e,n-s*.35),t.bezierCurveTo(e+s*.6,n-s*1.1,e+s*1.4,n-s*.1,e,n+s*.9),t.fill()}};function md(i,t,e,n,s,r){i.beginPath(),i.moveTo(t+r,e),i.arcTo(t+n,e,t+n,e+s,r),i.arcTo(t+n,e+s,t,e+s,r),i.arcTo(t,e+s,t,e,r),i.arcTo(t,e,t+n,e,r),i.closePath()}var Cn=1024,Pn=640,Qe=372,OM={bg:"#eceef0",panel:"#f4f5f6",text:"#1d1f22",sub:"#6b7078",lane:"#c3c7cc",car:"#9aa0a8",land:"#efece6",road:"#ffffff",roadCase:"#d4d0c8",hwy:"#ffd36a",hwyCase:"#d9a640",water:"#a9d3ec",park:"#cfe7c4",town:"#e2ddd5",route:"#2f6fe4",routeCase:"#1e4fb0",dock:"#1b1c1f",card:"rgba(32,34,38,0.92)"},zM={bg:"#141518",panel:"#1b1c20",text:"#f2f3f5",sub:"#9097a1",lane:"#4a4f57",car:"#6d737c",land:"#25272b",road:"#3a3d43",roadCase:"#2c2e33",hwy:"#8a6d2c",hwyCase:"#5d4a20",water:"#1d3550",park:"#233428",town:"#2f3136",route:"#4c8dff",routeCase:"#2a5fc0",dock:"#0c0d0f",card:"rgba(10,11,13,0.92)"};function Fn(i){return 900*Ms(i/3200,5)+260*Ms(i/950,8)}var Gl=class{constructor(){this.canvas=document.createElement("canvas"),this.canvas.width=Cn,this.canvas.height=Pn,this.ctx=this.canvas.getContext("2d"),this.texture=new Ce(this.canvas),this.texture.colorSpace=ce,this.texture.anisotropy=8,this.zoom=.16,this.acc=0,this.spin=0,this.featureCache=new Map}update(t,e){this.acc+=t,this.spin+=t,!(this.acc<1/15)&&(this.acc=0,this.draw(e),this.texture.needsUpdate=!0)}draw(t){let e=this.ctx,n=t.dark?zM:OM;this.T=n,e.save(),e.fillStyle=n.bg,e.fillRect(0,0,Cn,Pn),this.drawMap(e,t,n),this.drawCarPanel(e,t,n),this.drawTopBar(e,t,n),this.drawDock(e,t,n),t.funkloch>0&&(e.fillStyle=`rgba(120,120,120,${.35*t.funkloch})`,e.fillRect(Qe,0,Cn-Qe,Pn-64),e.fillStyle="#ffffff",e.font="bold 34px Arial, sans-serif",e.textAlign="center",e.fillText("Keine Verbindung",Qe+(Cn-Qe)/2,300),e.font="24px Arial, sans-serif",e.fillText("Mobilfunk wird neu geb\xFCndelt \u2026",Qe+(Cn-Qe)/2,340)),e.restore()}drawCarPanel(t,e,n){t.fillStyle=n.panel,t.fillRect(0,0,Qe,Pn),t.textBaseline="alphabetic",t.font='600 26px "Helvetica Neue", Arial, sans-serif',t.textAlign="left",["P","R","N","D"].forEach((y,I)=>{t.fillStyle=y==="D"?n.text:n.sub,t.font=(y==="D"?"700 28px":"500 24px")+' "Helvetica Neue", Arial, sans-serif',t.fillText(y,26+I*30,78)});let r=196,o=56;t.strokeStyle=n.text,t.lineWidth=3,ze(t,r,o,60,26,5),t.stroke(),t.fillStyle=n.text,t.fillRect(r+60,o+8,5,10);let a=Jt(e.battery,0,100);t.fillStyle=a<15?"#e0301e":a<30?"#f0a020":"#34c759",t.fillRect(r+4,o+4,52*(a/100),18),t.fillStyle=n.text,t.font='600 26px "Helvetica Neue", Arial, sans-serif',t.fillText(Math.round(a)+" %",r+76,79),t.textAlign="center",t.font='600 104px "Helvetica Neue", Arial, sans-serif',t.fillStyle=n.text,t.fillText(String(Math.round(e.speedKmh)),Qe/2,196),t.font='500 26px "Helvetica Neue", Arial, sans-serif',t.fillStyle=n.sub,t.fillText("km/h",Qe/2,232),e.limit&&(t.save(),t.translate(Qe-58,150),t.fillStyle="#fff",t.beginPath(),t.arc(0,0,34,0,Math.PI*2),t.fill(),t.strokeStyle="#d4141b",t.lineWidth=8,t.stroke(),t.fillStyle="#111",t.font="bold 30px Arial, sans-serif",t.textBaseline="middle",t.fillText(String(e.limit),0,2),t.restore());let l=262,c=Pn-78,h=Qe/2,u=l,d=(y,I)=>{let S=1/(1+(Jt(I,-18,120)+18)/26),P=Qt(u+6,c,S*1.05);return[h+y*30*S,P,S]},f=e.playerX,m=[-7.5,-3.75,0,3.75,7.5];if(e.leftLane>0){t.fillStyle=`rgba(62,120,255,${.25+.15*Math.sin(this.spin*6)})`,t.beginPath();let y=d(-7.5-f,-18);t.moveTo(y[0],y[1]);for(let I=-18;I<=120;I+=6)y=d(-7.5-f,I),t.lineTo(y[0],y[1]);for(let I=120;I>=-18;I-=6)y=d(-3.75-f,I),t.lineTo(y[0],y[1]);t.fill()}if(m.forEach((y,I)=>{t.strokeStyle=n.lane,t.lineWidth=I===0||I===4?4:3,t.setLineDash(I===0||I===4?[]:[14,14]),t.beginPath();for(let T=-18;T<=120;T+=4){let S=d(y-f,T);T===-18?t.moveTo(S[0],S[1]):t.lineTo(S[0],S[1])}t.stroke()}),t.setLineDash([]),e.leftLane<=0){let y=d(-5.625-f,40);t.font=`${Math.round(30*y[2]+12)}px "Segoe UI Emoji", "Noto Color Emoji", sans-serif`,t.textAlign="center",t.fillText("\u{1F512}",y[0],y[1])}let v=(e.cars||[]).filter(y=>y.ds>-18&&y.ds<120).sort((y,I)=>I.ds-y.ds);for(let y of v){let I=d(y.dx-f,y.ds-y.len/2),T=d(y.dx-f,y.ds+y.len/2),S=y.w*30*I[2];t.fillStyle=y.kind==="polizei"?"#5c7ed6":n.car,ze(t,I[0]-S/2,T[1],S,Math.max(4,I[1]-T[1]),Math.min(8,S/3)),t.fill(),y.brake&&(t.fillStyle="#ff3b30",t.fillRect(I[0]-S/2,I[1]-4,S,4))}let g=d(0,0),p=d(0,4.7),x=1.85*30*g[2];t.fillStyle="#111214",ze(t,g[0]-x/2,p[1],x,g[1]-p[1],10),t.fill(),t.fillStyle="rgba(120,150,190,0.8)",ze(t,g[0]-x*.36,p[1]+(g[1]-p[1])*.18,x*.72,(g[1]-p[1])*.28,6),t.fill();let _=t.createLinearGradient(0,Pn-128,0,Pn-112);_.addColorStop(0,n.panel+"00"),_.addColorStop(1,n.panel),t.fillStyle=_,t.fillRect(0,Pn-128,Qe,16),t.fillStyle=n.panel,t.fillRect(0,Pn-112,Qe,112),t.textAlign="center",t.font='600 24px "Helvetica Neue", Arial, sans-serif',e.leftLane>0?(t.fillStyle="#2f6fe4",t.fillText("Linke Spur frei \xB7 "+Math.ceil(e.leftLane)+" s",Qe/2,Pn-86)):(t.fillStyle=n.sub,t.fillText("Rechtsfahrgebot aktiv",Qe/2,Pn-86))}features(t){if(this.featureCache.has(t))return this.featureCache.get(t);let e=Wn(t*977+3),n=t*600,s={roads:[],towns:[],parks:[],water:null,exit:null};if(e()<.55){let o=n+e()*600,a=(e()-.5)*1.2;s.roads.push({s:o,a,len:1500+e()*2500}),e()<.6&&(s.exit=o)}if(e()<.35){let o=e()<.5?-1:1;s.towns.push({s:n+e()*600,x:o*(300+e()*900),r:120+e()*220,seed:t})}let r=Math.floor(e()*3);for(let o=0;o<r;o++)s.parks.push({s:n+e()*600,x:(e()<.5?-1:1)*(200+e()*1400),r:150+e()*400,k:e()});return e()<.12&&(s.water={s:n+e()*600,a:(e()-.5)*.8}),this.featureCache.set(t,s),this.featureCache.size>80&&this.featureCache.delete(this.featureCache.keys().next().value),s}drawMap(t,e,n){let s=e.navi||{},r=Qe,o=Cn-Qe,a=Pn-64;t.save(),t.beginPath(),t.rect(r,0,o,a),t.clip(),t.fillStyle=n.land,t.fillRect(r,0,o,a);let l=e.s,c=Math.max(0,s.remaining??3e3),h=Jt(330/Math.max(c+250,400),.07,.42);this.zoom=Qt(this.zoom,h,.08);let u=this.zoom,d=r+o/2,f=a*.8,m=Fn(l),v=(Fn(l+25)-Fn(l-25))/50,g=Math.atan(v),p=(P,b)=>{let M=P-m,C=-(b-l),k=Math.cos(-g),N=Math.sin(-g);return[d+(M*k-C*N)*u,f+(M*N+C*k)*u]},x=l-a*.25/u-600,_=l+a*.9/u+600,y=Math.floor(x/600),I=Math.floor(_/600);for(let P=y;P<=I;P++){let b=this.features(P);for(let M of b.parks){let[C,k]=p(Fn(M.s)+M.x,M.s);t.fillStyle=n.park,t.beginPath(),t.ellipse(C,k,M.r*u,M.r*u*(.6+M.k*.6),M.k*3,0,Math.PI*2),t.fill()}if(b.water){t.strokeStyle=n.water,t.lineWidth=Math.max(5,60*u),t.beginPath();let M=b.water.s,C=b.water.a;for(let k=-6;k<=6;k++){let N=Fn(M)+k*400,z=M+k*400*Math.tan(C)+Math.sin(k)*80,[X,H]=p(N,z);k===-6?t.moveTo(X,H):t.lineTo(X,H)}t.stroke()}for(let M of b.towns){let C=Wn(M.seed),[k,N]=p(Fn(M.s)+M.x,M.s),z=M.r*u;t.save(),t.fillStyle=n.town,t.beginPath(),t.arc(k,N,z,0,Math.PI*2),t.fill(),t.clip(),t.strokeStyle=n.road,t.lineWidth=2.5,t.lineCap="round";let X=C()*Math.PI;for(let H=0;H<2;H++){let J=X+H*(Math.PI/2+(C()-.5)*.5),W=Math.cos(J),ct=Math.sin(J);for(let ht=-2;ht<=2;ht++){if(C()<.25)continue;let ft=(ht+(C()-.5)*.5)*z*.36,Ut=z*(.45+C()*.75),qt=(C()-.5)*z*.7,K=k-ct*ft+W*qt,it=N+W*ft+ct*qt;t.beginPath(),t.moveTo(K-W*Ut/2,it-ct*Ut/2),t.lineTo(K+W*Ut/2,it+ct*Ut/2),t.stroke()}}t.restore()}}for(let P=y;P<=I;P++){let b=this.features(P);for(let M of b.roads){let C=Fn(M.s),k=p(C-Math.cos(M.a)*M.len,M.s-Math.sin(M.a)*M.len),N=p(C+Math.cos(M.a)*M.len,M.s+Math.sin(M.a)*M.len);t.strokeStyle=n.roadCase,t.lineWidth=9,t.beginPath(),t.moveTo(k[0],k[1]),t.lineTo(N[0],N[1]),t.stroke(),t.strokeStyle=n.road,t.lineWidth=6,t.stroke()}}let T=[];for(let P=x;P<=_;P+=40/Math.max(u,.05))T.push(p(Fn(P),P));let S=(P,b,M)=>{t.strokeStyle=b,t.lineWidth=M,t.lineJoin="round",t.lineCap="round",t.beginPath(),P.forEach((C,k)=>k?t.lineTo(C[0],C[1]):t.moveTo(C[0],C[1])),t.stroke()};if(S(T,n.hwyCase,17),S(T,n.hwy,12),s.target&&!s.arrived){let P=s.recalc||0,b=l+c,M=s.side||1,C=[];if(s.wende&&s.wendeS>l){for(let k=l;k<=s.wendeS;k+=30)C.push(p(Fn(k)+6,k));for(let k=0;k<=8;k++){let N=k/8*Math.PI;C.push(p(Fn(s.wendeS)+6-(1-Math.cos(N))*70,s.wendeS+Math.sin(N)*120))}for(let k=s.wendeS;k>=l-900;k-=30)C.push(p(Fn(k)-134,k))}else{let k=Math.max(l,b-260);for(let X=l;X<=k;X+=Math.max(20,12/u))C.push(p(Fn(X),X));let N=Fn(k),z=Fn(b)+M*520;for(let X=1;X<=10;X++){let H=X/10;C.push(p(Qt(N,z,H*H),Qt(k,b+120,H)))}}if(P<1&&(t.globalAlpha=1-P,S(C,n.routeCase,15),S(C,n.route,10),t.globalAlpha=1),!s.wende){let[k,N]=p(Fn(b)+M*520,b+120);k>r-40&&k<Cn+40&&N>-40&&N<a+40&&(t.fillStyle="#e8352b",t.beginPath(),t.arc(k,N-26,15,Math.PI,0),t.lineTo(k,N),t.closePath(),t.fill(),t.fillStyle="#fff",t.beginPath(),t.arc(k,N-26,6,0,Math.PI*2),t.fill())}}if(t.save(),t.translate(d,f),t.fillStyle="rgba(47,111,228,0.18)",t.beginPath(),t.arc(0,0,34,0,Math.PI*2),t.fill(),t.fillStyle="#ffffff",t.beginPath(),t.moveTo(0,-24),t.lineTo(17,18),t.lineTo(0,8),t.lineTo(-17,18),t.closePath(),t.fill(),t.fillStyle="#2f6fe4",t.beginPath(),t.moveTo(0,-18),t.lineTo(12,13),t.lineTo(0,5),t.lineTo(-12,13),t.closePath(),t.fill(),t.restore(),s.recalc>0&&(t.fillStyle=`rgba(255,255,255,${.5*s.recalc})`,t.fillRect(r,0,o,a),t.save(),t.translate(d,a*.45),t.strokeStyle="#2f6fe4",t.lineWidth=8,t.lineCap="round",t.beginPath(),t.arc(0,0,34,this.spin*6,this.spin*6+4.2),t.stroke(),t.restore(),t.fillStyle="#1d1f22",t.font='bold 32px "Helvetica Neue", Arial, sans-serif',t.textAlign="center",t.fillText("Route wird neu berechnet \u2026",d,a*.45+80)),s.target){t.fillStyle=n.card,ze(t,r+18,70,o-36,118,16),t.fill(),t.fillStyle="#ffffff",t.textAlign="left",t.font='bold 30px "Helvetica Neue", Arial, sans-serif';let P=s.arrived?"Ziel erreicht":s.wende&&s.wendeS>l?"Bitte wenden":c>400?"A7 folgen":"Ausfahrt nehmen",b=s.wende&&s.wendeS>l?s.wendeS-l:Math.max(0,c-260);t.fillText(this.arrowFor(P)+"  "+P,r+38,112),t.font='600 28px "Helvetica Neue", Arial, sans-serif',t.textAlign="right",s.arrived||t.fillText(C0(b),Cn-36,112),t.textAlign="left",t.font='26px "Helvetica Neue", Arial, sans-serif';let M=s.arrived?"":C0(c)+(s.eta?" \xB7 "+s.eta:""),C=t.measureText(M).width;t.fillStyle="#c9d6ff",gd(t,(s.arrived?"\u23F3 ":"\u{1F3C1} ")+s.target,r+38,160,Cn-36-C-26-(r+38),20),t.font='26px "Helvetica Neue", Arial, sans-serif',t.textAlign="right",t.fillStyle="#ffffff",t.fillText(M,Cn-36,160),t.fillStyle="rgba(200,16,46,0.94)",ze(t,r+18,a-74,o-36,56,14),t.fill(),t.fillStyle="#ffffff",t.textAlign="left",t.font='bold 24px "Helvetica Neue", Arial, sans-serif',gd(t,"\u{1F4E1} Ferngesteuert von "+(s.bidder||"\u2014"),r+34,a-38,o-210),t.textAlign="right",t.font='bold 26px "Helvetica Neue", Arial, sans-serif',t.fillText(s.bid||"",Cn-36,a-38)}t.restore()}arrowFor(t){return t==="Ziel erreicht"?"\u2713":t==="Bitte wenden"?"\u21B6":t==="Ausfahrt nehmen"?"\u2197":"\u2191"}drawTopBar(t,e,n){t.fillStyle=e.dark?"rgba(20,21,24,0.85)":"rgba(244,245,246,0.88)",t.fillRect(Qe,0,Cn-Qe,50),t.fillStyle=n.text,t.font='600 24px "Helvetica Neue", Arial, sans-serif',t.textAlign="left",t.textBaseline="middle",t.fillText("\u{1F464} Mini Adam",Qe+20,26),t.textAlign="right",t.fillText(e.clock+"   "+e.temp+" \xB0C   "+(e.funkloch>0?"Kein Netz":"LTE \u2582\u2584\u2586\u2588"),Cn-18,26),t.textBaseline="alphabetic"}drawDock(t,e,n){t.fillStyle=n.dock,t.fillRect(0,Pn-64,Cn,64),t.fillStyle="#e6e8eb",t.font='30px "Segoe UI Emoji", "Noto Color Emoji", sans-serif',t.textAlign="center",t.textBaseline="middle",["\u{1F697}","\u2744\uFE0F","\u{1F3B5}","\u{1F4DE}","\u{1F4E1}","\u{1F327}\uFE0F","\u2699\uFE0F"].forEach((r,o)=>t.fillText(r,70+o*90,Pn-32)),t.font='600 26px "Helvetica Neue", Arial, sans-serif',t.fillStyle="#e6e8eb",t.textAlign="right",t.fillText("21,0 \xB0",Cn-26,Pn-32),e.wiperOn&&(t.textAlign="left",t.fillStyle="#4c8dff",t.font='600 22px "Helvetica Neue", Arial, sans-serif',gd(t,"Wischer: Auto (Beta)",656,Pn-32,Cn-130-656,14)),t.textAlign="center",t.textBaseline="alphabetic"}};function C0(i){return i>=1e3?hn(i/1e3,i>=1e4?0:1)+" km":Math.max(0,Math.round(i/10)*10)+" m"}function gd(i,t,e,n,s,r=14){let o=parseFloat(i.font.match(/(\d+)px/)[1]);for(;i.measureText(t).width>s&&o>r;)o-=2,i.font=i.font.replace(/\d+px/,o+"px");if(i.measureText(t).width>s){let a=t;for(;a.length>4&&i.measureText(a+"\u2026").width>s;)a=a.slice(0,-1);t=a.trimEnd()+"\u2026"}i.fillText(t,e,n)}var yd=new A(-.37,1.2,.27),GM=-.12,Ss=(()=>{let i=new A(0,.9,-.88),t=new A(0,1.38,-.095),e=t.clone().sub(i),n=e.length();e.normalize();let s=new A(1,0,0),r=new A().crossVectors(e,s).normalize();return{base:i,top:t,U:e,X:s,N:r,length:n,halfBase:.74,halfTop:.63}})(),so=[{pivot:new A(-.64,.884,-.905),length:.62,max:1.55},{pivot:new A(.06,.884,-.905),length:.56,max:1.75}],vd=.94,xd=1.32,P0=.8,Vl=.5,Wl=.2;function I0(i){return new xi({color:i,roughness:.95,sheen:1,sheenRoughness:.5,sheenColor:new Dt(i).lerp(new Dt(16777215),.35),bumpMap:yl(5),bumpScale:.5})}function L0(i){let t=i.length,e=new Qi(i.map(([o,a])=>new nt(o,a)),18),n=2*Math.PI*Math.max(...i.map(([o])=>o)),s=[0];for(let o=1;o<t;o++)s.push(s[o-1]+Math.hypot(i[o][0]-i[o-1][0],i[o][1]-i[o-1][1])/n);let r=e.attributes.uv;for(let o=0;o<r.count;o++)r.setY(o,s[o%t]);return e}function Xl(i,t,e,n,s,r=0){let o=new A().subVectors(t,i),a=o.length(),l=.5,c=new Fr(l,Math.max(.001,a/Math.max(e,n)-2*l),6,16);c.scale(e,Math.max(e,n),n),c.translate(0,a/2,0),r&&c.rotateY(r);let h=new D(c,s);return h.position.copy(i),h.quaternion.setFromUnitVectors(new A(0,1,0),o.normalize()),h}function VM(){let i=document.createElement("canvas");i.width=1024,i.height=300;let t=i.getContext("2d"),e=i.width,n=i.height;t.fillStyle="#1c1d20",t.fillRect(0,0,e,n),t.globalCompositeOperation="destination-out",t.beginPath();let s=n*.12,r=n*.88;t.moveTo(e*.2,s),t.lineTo(e*.8,s),t.quadraticCurveTo(e*.88,s,e*.9,s+n*.18),t.lineTo(e*.95,r),t.lineTo(e*.05,r),t.lineTo(e*.1,s+n*.18),t.quadraticCurveTo(e*.12,s,e*.2,s),t.closePath(),t.fill(),t.globalCompositeOperation="source-over",t.fillStyle="#2a2b2f";for(let a of[.24,.5,.76]){let l=e*(a===.5?.085:.11);WM(t,e*a-l/2,n*.7,l,n*.4,26),t.fill()}t.fillStyle="#141517",t.fillRect(0,n*.9,e,n*.1);let o=new Ce(i);return o.colorSpace=ce,o.anisotropy=4,o}function WM(i,t,e,n,s,r){i.beginPath(),i.moveTo(t+r,e),i.lineTo(t+n-r,e),i.quadraticCurveTo(t+n,e,t+n,e+r),i.lineTo(t+n,e+s-r),i.quadraticCurveTo(t+n,e+s,t+n-r,e+s),i.lineTo(t+r,e+s),i.quadraticCurveTo(t,e+s,t,e+s-r),i.lineTo(t,e+r),i.quadraticCurveTo(t,e,t+r,e),i.closePath()}var ql=class{constructor(){this.scene=new Pi,this.root=new wt,this.root.name="Cockpit",this.scene.add(this.root),this.hemi=new Gr(13163775,4208428,1.25),this.scene.add(this.hemi),this.sun=new Vr(16773340,2),this.scene.add(this.sun),this.scene.add(this.sun.target),this.fill=new ll(16774376,.25,2.5,1.2),this.fill.position.set(-.2,1.25,.1),this.root.add(this.fill);let t={dashTop:new pe({color:1908257,roughness:.86}),dash:new pe({color:1579292,roughness:.62}),vent:new pe({color:328966,roughness:.9}),wood:new pe({map:Wp(),roughness:.42,color:14271664}),pillar:new pe({color:2500394,roughness:.95}),door:new pe({color:1776671,roughness:.68}),chrome:new pe({color:12172738,metalness:1,roughness:.22}),rim:new pe({color:1250069,roughness:.52}),spoke:new pe({color:2829360,metalness:.55,roughness:.32}),black:new pe({color:723724,roughness:.3,metalness:.2}),skin:I0(14263415),sleeve:I0(1447448),wiper:new pe({color:1315860,roughness:.6,metalness:.4})};this.M=t,this.buildDash(t),this.buildPillars(t),this.buildDoor(t),this.buildWheel(t),this.buildScreen(t),this.buildMirrors(t),this.buildWipers(t),this.buildExtras(t),this.nomi=new zl,this.nomi.group.position.set(-.27,.911,-.53),this.nomi.group.scale.setScalar(1.1),this.root.add(this.nomi.group),this.steer=0,this.wheelAngle=0,this.elsaWobble=0,this.elsaVel=0,this.headOffset=new A,this.shake=0}buildDash(t){let e=new cn,n=[[-.92,.882],[-.86,.9],[-.5,.913],[-.455,.905],[-.42,.875],[-.405,.85],[-.405,.8],[-.43,.793],[-.43,.776],[-.395,.77],[-.335,.62],[-.35,.42],[-.92,.42]];e.moveTo(n[0][0],n[0][1]);for(let h=1;h<n.length;h++)e.lineTo(n[h][0],n[h][1]);e.closePath();let s=1.6,r=new si(e,{depth:s,bevelEnabled:!1,curveSegments:4});r.rotateY(-Math.PI/2),r.translate(s/2,0,0);let o=new D(r,t.dashTop);this.root.add(o);let a=new Ht(1.5,.05,.012),l=new D(a,t.wood);l.position.set(.02,.826,-.399),this.root.add(l);let c=new D(new Ht(1.52,.014,.02),t.vent);c.position.set(.02,.785,-.425),this.root.add(c);for(let h of[-.62,.62]){let u=new D(new Ht(.18,.004,.08),t.vent);u.position.set(h,.912,-.78),this.root.add(u)}}buildPillars(t){let e=Ss;for(let r of[-1,1]){let o=new A(r*.765,e.base.y-.07,e.base.z-.03),a=new A(r*.64,e.top.y+.015,e.top.z+0);this.root.add(Xl(o,a,.085,.06,t.pillar));let l=new A(r*.68,e.top.y+.035,.8);this.root.add(Xl(a,l,.08,.07,t.pillar))}let n=new D(new ws(1.34,.06,.12,3,.025),t.pillar);n.position.set(0,e.top.y+.02,e.top.z+.03),this.root.add(n),this.root.add(Xl(new A(-.79,.99,.34),new A(-.665,1.405,.3),.09,.07,t.pillar));let s=new D(new Ht(1.5,.11,.012),t.vent);s.quaternion.setFromRotationMatrix(new jt().makeBasis(e.X,e.U,e.N)),s.position.copy(e.base).addScaledVector(e.U,-.01).addScaledVector(e.N,.007),this.root.add(s)}buildDoor(t){let e=new wt,n=new D(new Ht(.07,.56,1.35),t.door);n.position.set(-.8,.7,-.08),e.add(n);let s=new D(new ws(.075,.06,1.3,3,.025),t.dash);s.position.set(-.775,.975,-.06),e.add(s);let r=new D(new Ht(.1,.05,.4),t.dashTop);r.position.set(-.73,.76,.15),e.add(r);let o=new D(new Ht(.012,.04,.8),t.wood);o.position.set(-.762,.9,-.1),e.add(o);let a=new D(new Ht(.012,.018,.04),t.black);a.position.set(-.76,.86,-.32),e.add(a),this.root.add(e)}buildWheel(t){let e=new wt;e.position.set(-.37,.865,-.2),e.rotation.x=-.5,this.root.add(e);let n=new wt;e.add(n),this.wheel=n;let s=.17,r=new Vn(s,.023,14,56);r.scale(1,vd,1.15),n.add(new D(r,t.rim));for(let f of[-1,1]){let m=new D(new Ht(.12,.034,.02),t.spoke);m.position.set(f*.115,-.01,-.005),n.add(m);let v=new D(new Yt(.012,.012,.01,16),t.black);v.rotation.x=Math.PI/2,v.position.set(f*.11,-.01,.009),n.add(v)}let o=new D(new Ht(.035,.11,.02),t.spoke);o.position.set(0,-.1,-.005),n.add(o);let a=new Yt(.065,.07,.04,28);a.rotateX(Math.PI/2),a.scale(1.25,.85,1);let l=new D(a,t.rim);l.position.set(0,-.008,-.01),n.add(l);let c=new D(new fe(.075,.075),new pe({map:Kr({w:256,h:256}),transparent:!0,roughness:.4,alphaTest:.2}));c.position.set(0,-.004,.011),n.add(c);let h=new D(new Yt(.035,.045,.24,14),t.dash);h.rotation.x=Math.PI/2,h.position.set(0,-.01,-.13),e.add(h);for(let f of[-1,1]){let m=new D(new Yt(.007,.006,.14,8),t.black);m.rotation.z=f*(Math.PI/2-.25),m.position.set(f*.09,0,-.08),e.add(m)}this.rimR=s,this.hands=[];for(let f of[-1,1]){let m=new wt,v=new D(new _e(.048,18,14),t.skin);v.scale.set(1.05,.85,.85),v.position.set(0,.005,.014);let g=new D(new _e(.019,12,10),t.skin);g.position.set(-f*.03,-.012,.035);let p=new D(new _e(.04,14,10),t.skin);p.scale.set(1,.7,.6),p.position.set(0,.01,-.025),m.add(v,g,p),m.userData.side=f,n.add(m),this.hands.push(m)}this.grip=xd,this.gripTarget=xd,this.gripSet=!1,this.placeHands(),this.arms=[];let u=L0([[0,0],[.019,.004],[.028,.012],[.031,.024],[.034,.16],[.037,Vl-.03],[.032,Vl-.01],[.018,Vl-.001],[0,Vl]]);u.rotateX(Math.PI);let d=L0([[0,-.035],[.03,-.028],[.047,-.012],[.053,.02],[.056,.12],[.058,Wl-.016],[.056,Wl-.003],[.05,Wl],[.043,Wl-.008]]);for(let f of[-1,1]){let m=new D(u,t.skin),v=new D(d,t.sleeve);this.root.add(m,v),this.arms.push({fore:m,sleeve:v,shoulder:new A(-.37+f*.25,.84,.3)})}}placeHands(){let t=this.rimR;for(let e of this.hands){let n=e.userData.side*this.grip;e.position.set(Math.sin(n)*t,Math.cos(n)*t*vd,.012),e.rotation.z=-Math.atan2(Math.sin(n),Math.cos(n)/vd)}}setAspect(t){t>0&&t<1/0&&(this.gripTarget=P0+(xd-P0)*xn(.6,1,t),this.gripSet||(this.gripSet=!0,this.grip=this.gripTarget,this.placeHands()))}buildScreen(t){this.screen=new Gl;let e=new wt;e.position.set(0,1.03,-.465),e.rotation.x=-.16;let n=new D(new Ht(.352,.226,.018),t.black);n.position.z=-.01;let s=new D(new fe(.336,.21),new dn({map:this.screen.texture,toneMapped:!1}));s.position.z=5e-4;let r=new D(new Ht(.06,.08,.03),t.dash);r.position.set(0,-.13,-.03),e.add(n,s,r),this.root.add(e),this.displayMat=s.material}buildMirrors(t){let s=new cn,r=.03;s.moveTo(-.245/2+r,-.072/2),s.lineTo(.245/2-r,-.072/2),s.quadraticCurveTo(.245/2,-.072/2,.245/2,-.072/2+r),s.lineTo(.245/2,.072/2-r),s.quadraticCurveTo(.245/2,.072/2,.245/2-r,.072/2),s.lineTo(-.245/2+r,.072/2),s.quadraticCurveTo(-.245/2,.072/2,-.245/2,.072/2-r),s.lineTo(-.245/2,-.072/2+r),s.quadraticCurveTo(-.245/2,-.072/2,-.245/2+r,-.072/2);let o=new vi(s,6),a=o.attributes.uv,l=o.attributes.position;for(let gt=0;gt<a.count;gt++)a.setXY(gt,1-(l.getX(gt)/.245+.5),l.getY(gt)/.072+.5);this.mirrorMat=new dn({color:16777215});let c=new wt;c.position.set(-.08,1.235,-.225),c.rotation.set(-.06,-.18,0);let h=new D(o,this.mirrorMat);h.position.z=.021;let u=new si(s,{depth:.022,bevelEnabled:!0,bevelSize:.006,bevelThickness:.006,bevelSegments:2});u.translate(0,0,-.012);let d=new D(u,t.black),f=o.clone(),m=f.attributes.uv;for(let gt=0;gt<m.count;gt++)m.setXY(gt,l.getX(gt)/.245+.5,l.getY(gt)/.072+.5);this.mirrorFrame=new D(f,new dn({map:VM(),transparent:!0,depthWrite:!1})),this.mirrorFrame.position.z=.0215,c.add(d,h,this.mirrorFrame),this.root.add(c);let v=Ss,g=new jt().makeBasis(v.X,v.U,v.N.clone().negate()).setPosition(v.base),p=new cn,x=-.07,_=.048,y=.088,I=.85,T=.95;p.moveTo(x-_+.025,I),p.lineTo(x+_-.025,I),p.quadraticCurveTo(x+_,I,x+_+.003,I+.025),p.lineTo(x+y,T),p.lineTo(x-y,T),p.lineTo(x-_-.003,I+.025),p.quadraticCurveTo(x-_,I,x-_+.025,I);let S=new si(p,{depth:.014,bevelEnabled:!0,bevelSize:.006,bevelThickness:.006,bevelSegments:2,curveSegments:6});S.translate(0,0,.007),S.applyMatrix4(g);let P=new D(S,t.dash),b=(gt,ut,At)=>new A(gt,ut,At).applyMatrix4(g),M=b(-.08,.862,.024),C=new A(-.08,1.258,-.243),k=C.clone().sub(M),N=new Yt(.008,.011,k.length(),10);N.translate(0,k.length()/2,0);let z=new D(N,t.black);z.position.copy(M),z.quaternion.setFromUnitVectors(new A(0,1,0),k.normalize());let X=new D(new _e(.013,12,8),t.black);X.position.copy(C),this.root.add(P,z,X),this.mirrorHousing={toGlass:g,onGlass:b};let H=new wt;H.position.set(-1,1.045,-.6),H.rotation.y=.62;let J=new xi({color:329223,metalness:.5,roughness:.3,clearcoat:1}),W=new D(Sl(-1),J),ct=new vi(Go(.9,-1),12);ct.computeBoundingBox();let ht=ct.boundingBox,ft=ct.attributes.uv,Ut=ct.attributes.position;for(let gt=0;gt<ft.count;gt++){let ut=(Ut.getX(gt)-ht.min.x)/(ht.max.x-ht.min.x),At=(Ut.getY(gt)-ht.min.y)/(ht.max.y-ht.min.y);ft.setXY(gt,1-ut*.34,.03+At*.6)}this.sideMirrorMat=new dn({color:16777215});let qt=new D(ct,this.sideMirrorMat);qt.position.z=.002,H.add(W,qt),H.updateMatrix();let K=new A(.095,-.028,-.05).applyMatrix4(H.matrix),it=Xl(new A(-.79,.99,-.66),K,.05,.035,J);this.root.add(H,it)}setMirrorTexture(t){this.mirrorMat.map=t,this.mirrorMat.needsUpdate=!0,this.sideMirrorMat.map=t,this.sideMirrorMat.needsUpdate=!0,this.mirrorFrame.visible=!0}setTrunkView(t){this.mirrorMat.map=t,this.mirrorMat.needsUpdate=!0,this.mirrorFrame.visible=!1}buildWipers(t){let e=Ss,n=new jt().makeBasis(e.X,e.U,e.N.clone().negate()),s=new qe().setFromRotationMatrix(n);this.wiperObjs=so.map(r=>{let o=new wt;o.position.copy(r.pivot).addScaledVector(e.N,.02),o.quaternion.copy(s);let a=new wt;o.add(a);let l=new D(new Ht(r.length,.016,.012),t.wiper);l.position.set(r.length/2,0,-.012);let c=new D(new Ht(r.length*.92,.022,.008),t.wiper);return c.position.set(r.length*.52,.01,-.001),a.add(l,c),this.root.add(o),a})}buildExtras(t){let e=new wt;e.position.copy(this.mirrorHousing.onGlass(-.098,.9,.049));let n=new D(new ws(.06,.044,.036,2,.006),t.black),s=new D(new Yt(.013,.013,.012,16),new pe({color:1714746,metalness:.9,roughness:.1}));s.rotation.x=Math.PI/2,s.position.z=-.022,this.recLed=new D(new _e(.0055,10,8),new dn({color:16719904,toneMapped:!1})),this.recLed.position.set(.019,-.008,.0175);let r=new D(new Ht(.03,.02,.03),t.black);r.position.set(0,.026,-.004),e.add(n,s,this.recLed,r),this.root.add(e),this.elsa=Tl({curved:!1}),this.elsa.scale.setScalar(.11),this.elsaSpring=new wt,this.elsaSpring.position.set(-.6,.913,-.68),this.elsaSpring.rotation.y=.5;let o=new D(new Yt(.018,.022,.012,16),t.black);this.elsaSpring.add(o,this.elsa),this.elsa.position.y=.0045,this.elsaSpring.visible=!1,this.root.add(this.elsaSpring);let a=new fe(.012,.008);this.confetti=new gi(a,new pe({side:he,roughness:.6}),400),this.confetti.count=0,this.confetti.frustumCulled=!1,this.root.add(this.confetti)}addConfetti(t=40){let e=Ss,n=new jt().makeBasis(e.X,e.U,e.N.clone().negate()),s=new qe().setFromRotationMatrix(n),r=new jt,o=new qe,a=new qe,l=[16726891,16765503,3919532,5934574,16747586,11828479,16777215],c=new Dt;for(let h=0;h<t&&this.confetti.count<400;h++){let u=Math.random()*e.length*.9+.03,d=e.halfBase+(e.halfTop-e.halfBase)*(u/e.length)-.05,f=(Math.random()*2-1)*d,m=e.base.clone().addScaledVector(e.U,u);m.x=f,m.addScaledVector(e.N,-.006),a.setFromAxisAngle(new A(0,0,1),Math.random()*Math.PI),o.copy(s).multiply(a),r.compose(m,o,new A(1,1,1).multiplyScalar(.7+Math.random()*.8));let v=this.confetti.count++;this.confetti.setMatrixAt(v,r),this.confetti.setColorAt(v,c.setHex(l[v%l.length]))}this.confetti.instanceMatrix.needsUpdate=!0,this.confetti.instanceColor&&(this.confetti.instanceColor.needsUpdate=!0)}clearConfetti(){this.confetti.count=0}setElsa(t){this.elsaSpring.visible=!!t}placeCamera(t,e,n,s,r,o){let a=Math.min(1,s/60)*.0025+this.shake*.03;this.headOffset.x=Hn(this.headOffset.x,Jt(-r*.006,-.05,.05),4,o);let l=this.headOffset.x+(Math.sin(n*37)*.5+Math.sin(n*23)*.5)*a,c=(Math.sin(n*29)+Math.sin(n*13.3))*.5*a+Math.sin(n*1.4)*.003,h=yd.clone().add(new A(l,c,0));h.applyMatrix4(e),t.position.copy(h);let u=new qe().setFromRotationMatrix(e),d=new vn(GM+c*2,this.headOffset.x*.6+Math.sin(n*.31)*.004,-r*.0025+l*2,"YXZ");t.quaternion.copy(u).multiply(new qe().setFromEuler(d))}update(t){let{dt:e,t:n}=t;this.wheelAngle=Hn(this.wheelAngle,t.steer*1.25,10,e),this.wheel.rotation.z=-this.wheelAngle,this.grip!==this.gripTarget&&(this.grip=Math.abs(this.grip-this.gripTarget)<.002?this.gripTarget:Hn(this.grip,this.gripTarget,5,e),this.placeHands()),this.root.updateMatrixWorld(!0);let s=new jt().copy(this.root.matrixWorld).invert(),r=new A,o=new A,a=new A(0,1,0);if(this.arms.forEach((c,h)=>{this.hands[h].getWorldPosition(r),r.applyMatrix4(s),o.subVectors(r,c.shoulder).normalize(),c.sleeve.position.copy(c.shoulder),c.sleeve.quaternion.setFromUnitVectors(a,o),c.fore.position.copy(r),c.fore.quaternion.copy(c.sleeve.quaternion)}),t.wiperAngles&&(this.wiperObjs[0].rotation.z=t.wiperAngles[0],this.wiperObjs[1].rotation.z=t.wiperAngles[1]),this.elsaSpring.visible){let u=-60*this.elsaWobble-3.5*this.elsaVel-(t.latAcc||0)*.9;this.elsaVel+=u*e,this.elsaWobble+=this.elsaVel*e,this.elsaWobble=Jt(this.elsaWobble,-.6,.6),this.elsa.rotation.z=this.elsaWobble,Al(this.elsa,n,this.elsaWobble)}this.recLed.visible=Math.sin(n*3.5)>-.3;let l=t.overcast||0;t.sunDir&&(this.sun.position.copy(this.root.position).addScaledVector(t.sunDir,10),this.sun.target.position.copy(this.root.position)),this.sun.intensity=2.1*(1-l*.85),this.hemi.intensity=1.2-l*.25,this.nomi.update(e,n,-.16),this.screen.update(e,t.screen)}};var tr=640,Ts=360,er=160,nr=90,Yl=class{constructor(){this.canvas=document.createElement("canvas"),this.canvas.width=tr,this.canvas.height=Ts,this.ctx=this.canvas.getContext("2d"),this.texture=new Ce(this.canvas),this.texture.generateMipmaps=!1,this.texture.minFilter=Jn,this.film=document.createElement("canvas"),this.film.width=er,this.film.height=nr,this.fctx=this.film.getContext("2d"),this.fctx.fillStyle="#000",this.fctx.fillRect(0,0,er,nr),this.filmTex=new Ce(this.film),this.filmTex.generateMipmaps=!1,this.filmTex.minFilter=Jn,this.sprite=Jp(),this.drops=[],this.intensity=0,this.firmware=0,this.enabled=!0,this.wiper={angle:0,mode:"park",t:0,dur:0,amp:0,queue:0,pause:0,prevAngle:0},this.autoTimer=2.5,this.onEvent=null,this.tmp=new A,this.camPos=new A,this.twitches=0,this.wipes=0,this.dirty=!0,this.filmAcc=0,this.dryFor=0}setRain(t){this.intensity=Jt(t,0,1)}setFirmware(t){this.firmware=t}get angles(){let t=this.wiper.angle;return[t*(so[0].max/2.15),t*(so[1].max/2.15)]}manual(){if(this.wiper.mode!=="park")return null;let t=[.18,.42,.62,.82][this.firmware]??.18;return ge(t)?(this.startSweep(),"wipe"):(this.startTwitch(1+Math.floor(Math.random()*2)),"twitch")}startTwitch(t=1){this.wiper.mode="twitch",this.wiper.t=0,this.wiper.dur=Tt(.18,.3),this.wiper.amp=Tt(.28,.66),this.wiper.queue=t-1,this.twitches++,this.onEvent&&this.onEvent("twitch")}startSweep(){this.wiper.mode="sweep",this.wiper.t=0,this.wiper.dur=1,this.wiper.amp=2.15,this.wipes++,this.onEvent&&this.onEvent("wipe")}update(t,{speed:e,camera:n,carMatrix:s}){let r=this.wiper;r.prevAngle=r.angle;let o=r.mode==="sweep";if(n.updateMatrixWorld(),this.intensity>.05&&r.mode==="park"&&(this.autoTimer-=t,this.autoTimer<=0)){this.autoTimer=Tt(1.4,3.8)/(.6+this.intensity*.6);let u=[0,.18,.36,.55][this.firmware]??0;ge(u)?this.startSweep():this.startTwitch(1+Math.floor(Math.random()*3))}if(r.mode==="twitch"){r.t+=t;let u=r.t/r.dur;r.angle=u<1?r.amp*Math.sin(Math.PI*u)*(1-.3*u):0,u>=1&&(r.angle=0,r.queue>0?(r.queue--,r.mode="pause",r.pause=Tt(.08,.25)):r.mode="park")}else if(r.mode==="pause")r.pause-=t,r.pause<=0&&(r.mode="twitch",r.t=0,r.dur=Tt(.15,.28),r.amp=Tt(.2,.55),this.twitches++,this.onEvent&&this.onEvent("twitch"));else if(r.mode==="sweep"){r.t+=t;let u=r.t/r.dur;r.angle=u<1?r.amp*Math.sin(Math.PI*Math.min(1,u))**.8:0,u>=1&&(r.angle=0,r.mode="park")}let a=Ss;if(this.intensity>0){let d=this.intensity*(22+e*1.3)*t;for(;d>0;){if(Math.random()<d){let f=Math.random()*a.length,m=Qt(a.halfBase,a.halfTop,f/a.length),v=Math.random()<.08;this.drops.push({x:(Math.random()*2-1)*m,u:f,r:v?Tt(.006,.011):Tt(.0022,.0058),life:0})}d-=1}}let l=Math.max(0,e-14)*.0055;for(let u of this.drops){u.life+=t;let d=Jt((u.r-.003)/.006,0,1);u.u+=(l*d-(1-Math.min(1,e/14))*.02*d)*t,u.x+=Math.sin(u.life*3+u.r*1e3)*.002*d*t*(e/30)}this.drops=this.drops.filter(u=>u.u>-.02&&u.u<a.length+.02&&!(this.intensity<.01&&u.life>6));let c=Math.min(r.prevAngle,r.angle),h=Math.max(r.prevAngle,r.angle);if(h>.01&&h-c>1e-4){let u=!(o||r.mode==="sweep");for(let d=0;d<so.length;d++){let f=so[d],m=f.max/2.15,v=c*m-.04,g=h*m+.04,p=f.pivot.x,x=this.pivotU(f.pivot);this.drops=this.drops.filter(_=>{let y=_.x-p,I=_.u-x,T=Math.hypot(y,I);if(T<.06||T>f.length+.015)return!0;let S=Math.atan2(I,y);return!(S>=v&&S<=g)}),this.paintFilm(n,s,f,c*m,h*m,u)}}if(this.drops.length>520&&this.drops.splice(0,this.drops.length-520),this.filmAcc+=t,this.dryFor+=t,this.filmAcc>=.2){let u=this.filmAcc;this.filmAcc=0,this.fctx.globalCompositeOperation="source-over",this.intensity<=0&&this.dryFor>12?this.fctx.fillStyle="#000":this.fctx.fillStyle=`rgba(0,0,0,${1-Math.exp(-.35*u)})`,this.fctx.fillRect(0,0,er,nr),this.intensity>0&&(this.fctx.fillStyle=`rgba(255,255,255,${u*.05*this.intensity})`,this.fctx.fillRect(0,0,er,nr)),this.filmTex.needsUpdate=!0}this.draw(n,s)}pivotU(t){let e=Ss;return this.tmp.copy(t).sub(e.base).dot(e.U)}glassToScreen(t,e,n,s,r){let o=Ss;this.tmp.copy(o.base).addScaledVector(o.U,e),this.tmp.x=t,this.tmp.applyMatrix4(s);let a=this.tmp.distanceTo(n.position);return this.tmp.project(n),r.x=(this.tmp.x*.5+.5)*tr,r.y=(.5-this.tmp.y*.5)*Ts,r.z=this.tmp.z,r.d=a,r}paintFilm(t,e,n,s,r,o){let a=this.pivotU(n.pivot),l=[],c={x:0,y:0},h=6;for(let d=0;d<=h;d++){let f=s+(r-s)*d/h;this.glassToScreen(n.pivot.x+Math.cos(f)*n.length,a+Math.sin(f)*n.length,t,e,c),l.push([c.x*(er/tr),c.y*(nr/Ts)])}this.glassToScreen(n.pivot.x,a,t,e,c);let u=this.fctx;u.beginPath(),u.moveTo(c.x*(er/tr),c.y*(nr/Ts));for(let d of l)u.lineTo(d[0],d[1]);u.closePath(),o?(this.dryFor=0,u.globalCompositeOperation="lighter",u.fillStyle=`rgba(255,255,255,${.06+this.intensity*.12})`,u.fill()):(u.globalCompositeOperation="destination-out",u.fillStyle="rgba(0,0,0,0.85)",u.fill(),u.globalCompositeOperation="source-over",u.fillStyle="#000",u.fill()),u.globalCompositeOperation="source-over"}draw(t,e){let n=this.ctx;if(n.clearRect(0,0,tr,Ts),!this.enabled||this.drops.length===0){this.texture.needsUpdate=!0;return}let s=Ts/2/Math.tan(Xr.degToRad(t.fov)/2),r=tr/Ts/t.aspect,o={x:0,y:0,z:0,d:1};for(let a of this.drops){if(this.glassToScreen(a.x,a.u,t,e,o),o.z>1)continue;let l=Math.max(1.2,a.r/o.d*s*2.3),c=1+Math.min(2.2,a.life<.4?0:a.r>.004?.35:0);n.drawImage(this.sprite,o.x-l*r,o.y-l*c,l*2*r,l*2*c)}this.texture.needsUpdate=!0}clear(){this.drops=[],this.fctx.fillStyle="#000",this.fctx.fillRect(0,0,er,nr),this.filmTex.needsUpdate=!0,this.ctx.clearRect(0,0,tr,Ts),this.texture.needsUpdate=!0}};function D0(i,t){return new Ye({uniforms:{tScene:{value:i},tDrops:{value:t.texture},tFilm:{value:t.filmTex},uDrops:{value:1},uRain:{value:0},uTexel:{value:new nt(1/1280,1/720)},uFlash:{value:0},uFlashColor:{value:new Dt(1,1,1)},uFade:{value:0},uGreen:{value:0},uGlitch:{value:0},uTime:{value:0},uVignette:{value:.35},uSat:{value:1.08},uPost:{value:1}},vertexShader:`
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,fragmentShader:`
      uniform sampler2D tScene;
      uniform sampler2D tDrops;
      uniform sampler2D tFilm;
      uniform float uDrops;
      uniform float uRain;
      uniform vec2 uTexel;
      uniform float uFlash;
      uniform vec3 uFlashColor;
      uniform float uFade;
      uniform float uGreen;
      uniform float uGlitch;
      uniform float uTime;
      uniform float uVignette;
      uniform float uSat;
      uniform float uPost;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        if (uGlitch > 0.0 && uPost > 0.5) {
          float band = floor(uv.y * 30.0) + floor(uTime * 24.0);
          float r = fract(sin(band * 91.7) * 4375.85);
          uv.x += (r - 0.5) * 0.08 * uGlitch * step(0.6, r);
        }
        vec4 d = texture2D(tDrops, uv) * uDrops;
        float mask = clamp(d.a * (0.4 + d.b), 0.0, 1.0);
        vec2 n = (d.rg - 0.5) * 2.0;
        float film = texture2D(tFilm, uv).r * uDrops;
        vec2 suv = uv - n * mask * 0.06;
        vec3 col = texture2D(tScene, suv).rgb;
        float blur = film * 2.6 + mask * 0.7 + uRain * 0.25 * uDrops;
        if (blur > 0.04) {
          vec3 acc = col;
          for (int i = 0; i < 8; i++) {
            float a = float(i) * 0.7853 + 0.3;
            vec2 o = vec2(cos(a), sin(a)) * uTexel * (2.0 + blur * 7.0);
            acc += texture2D(tScene, suv + o).rgb;
          }
          col = mix(col, acc / 9.0, clamp(blur, 0.0, 1.0));
        }
        float l = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(col, vec3(l) * 1.02 + 0.03, clamp(film * 0.45, 0.0, 0.6));
        col *= 1.0 - mask * 0.22 * (1.0 - n.y * 0.5);
        col += mask * pow(max(0.0, n.y), 4.0) * 0.35;
        col = mix(vec3(dot(col, vec3(0.299, 0.587, 0.114))), col, uSat);
        if (uPost > 0.5) {
          col = mix(col, uFlashColor * 4.0, clamp(uFlash, 0.0, 1.0));
          vec2 vc = vUv - 0.5;
          col *= 1.0 - dot(vc, vc) * uVignette;
        }
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        if (uPost > 0.5) {
          float g = dot(gl_FragColor.rgb, vec3(0.3, 0.6, 0.1));
          gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.08, 1.0, 0.25) * (0.3 + g), uGreen * 0.65);
          gl_FragColor.rgb *= 1.0 - uFade;
        }
      }`,depthTest:!1,depthWrite:!1})}var Zl=class{constructor(t,e=2600){let n=new Float32Array(e*2*3),s=new Float32Array(e*2);for(let f=0;f<e;f++){let m=Math.random()*60-30,v=Math.random()*24,g=Math.random()*70-55;for(let p=0;p<2;p++)n[(f*2+p)*3]=m,n[(f*2+p)*3+1]=v,n[(f*2+p)*3+2]=g,s[f*2+p]=p}let r=new de;r.setAttribute("position",new Oe(n,3)),r.setAttribute("aEnd",new Oe(s,1)),this.uniforms={uTime:{value:0},uSpeed:{value:0},uS:{value:0},uCam:{value:new A},uOpacity:{value:0}};let o=new Ye({uniforms:this.uniforms,vertexShader:`
        attribute float aEnd;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uS;
        uniform vec3 uCam;
        varying float vA;
        void main() {
          vec3 p = position;
          float fall = 11.0;
          p.y = mod(p.y - uTime * fall, 24.0);
          p.z = mod(p.z + uS, 70.0) - 55.0;
          p.x += uCam.x;
          vec3 vel = vec3(0.0, -fall, uSpeed);
          p += normalize(vel) * aEnd * (0.35 + uSpeed * 0.012);
          vA = 1.0 - smoothstep(10.0, 24.0, abs(p.z + 10.0));
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
        }`,fragmentShader:`
        uniform float uOpacity;
        varying float vA;
        void main() { gl_FragColor = vec4(vec3(0.75, 0.8, 0.88), uOpacity * vA * 0.5); }`,transparent:!0,depthWrite:!1});this.lines=new ja(r,o),this.lines.frustumCulled=!1,this.lines.visible=!1,t.add(this.lines),this.maxSpray=700;let a=new Float32Array(this.maxSpray*3),l=new Float32Array(this.maxSpray),c=new Float32Array(this.maxSpray),h=new de;h.setAttribute("position",new Oe(a,3)),h.setAttribute("aAlpha",new Oe(l,1)),h.setAttribute("aSize",new Oe(c,1)),this.sprayData=[],this.sprayGeo=h;let u=new Ye({uniforms:{tDot:{value:qp()},uCurve:_i.uCurve,uH:{value:720}},vertexShader:pl+`
        attribute float aAlpha;
        attribute float aSize;
        uniform float uH;
        varying float vA;
        varying float vCut;
        void main() {
          vec4 w = curveWorld(modelMatrix * vec4(position, 1.0));
          vec4 mv = viewMatrix * w;
          gl_Position = projectionMatrix * mv;
          // Gr\xF6\xDFe in Metern: gleich gro\xDF bei jeder Bildh\xF6he und jedem Blickwinkel (auch im R\xFCckspiegel)
          float px = aSize * 0.52 * uH * projectionMatrix[1][1] / max(1.0, -mv.z);
          gl_PointSize = px;
          // Die Fahrbahn schneidet den Punkt unten gerade ab: dort vorher weich ausblenden
          vec4 g = projectionMatrix * viewMatrix * curveWorld(modelMatrix * vec4(position.x, 0.0, position.z, 1.0));
          float below = (gl_Position.y / gl_Position.w - g.y / g.w) * 0.5 * uH;
          vCut = 0.5 + below / max(px, 1.0);
          vA = aAlpha;
        }`,fragmentShader:`
        uniform sampler2D tDot;
        varying float vA;
        varying float vCut;
        void main() {
          float a = texture2D(tDot, gl_PointCoord).a;
          a *= 1.0 - smoothstep(vCut - 0.22, vCut, gl_PointCoord.y);
          gl_FragColor = vec4(vec3(0.82, 0.85, 0.9), a * vA);
        }`,transparent:!0,depthWrite:!1});this.spray=new Qa(h,u),this.spray.frustumCulled=!1;let d=new nt;this.spray.onBeforeRender=(f,m,v,g,p)=>{let x=f.getRenderTarget();p.uniforms.uH.value=x?x.height:f.getDrawingBufferSize(d).y},t.add(this.spray),this.intensity=0}setPixelScale(t){this.spray.material.uniforms.uH.value=t}emit(t,e,n,s,r=1){if(this.intensity<.15)return;let o=Math.round(r*this.intensity*2);for(let a=0;a<o&&this.sprayData.length<this.maxSpray;a++)this.sprayData.push({x:t+(Math.random()-.5)*n,y:.25+Math.random()*.3,z:e,vx:(Math.random()-.5)*1.2,vy:.6+Math.random()*1.4,vz:s*.9,life:0,max:.8+Math.random()*.8,size:1.2+Math.random()*1.6})}update(t,e,{speed:n,s,camX:r,intensity:o}){this.intensity=o;let a=this.uniforms;a.uTime.value=e,a.uSpeed.value=n,a.uS.value=s%70,a.uCam.value.x=r,a.uOpacity.value=o,this.lines.visible=o>.02;let l=this.sprayGeo.attributes.position.array,c=this.sprayGeo.attributes.aAlpha.array,h=this.sprayGeo.attributes.aSize.array,u=0,d=[];for(let f of this.sprayData)f.life+=t,!(f.life>f.max)&&(f.x+=f.vx*t,f.y+=f.vy*t,f.vy-=.8*t,f.z+=(n-f.vz*Math.exp(-f.life*2))*t,f.size+=t*2.2,d.push(f),l[u*3]=f.x,l[u*3+1]=f.y,l[u*3+2]=f.z,c[u]=.32*(1-f.life/f.max)*this.intensity,h[u]=f.size,u++);this.sprayData=d,this.sprayGeo.setDrawRange(0,u),this.sprayGeo.attributes.position.needsUpdate=!0,this.sprayGeo.attributes.aAlpha.needsUpdate=!0,this.sprayGeo.attributes.aSize.needsUpdate=!0,this.spray.visible=u>0}};var Kl=class{constructor(){this.ctx=null,this.enabled=!0,this.volume=.8,this.ready=!1,this.duck=1}suspend(){this.ctx&&this.ctx.state==="running"&&this.ctx.suspend().catch(()=>{})}resume(){this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{})}init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}let t=window.AudioContext||window.webkitAudioContext;if(!t)return;let e=new t;this.ctx=e,this.master=e.createGain(),this.master.gain.value=this.enabled?this.volume:0;let n=e.createDynamicsCompressor();n.threshold.value=-14,n.ratio.value=4,this.master.connect(n).connect(e.destination),this.sfx=e.createGain(),this.sfx.connect(this.master),this.amb=e.createGain(),this.amb.connect(this.master);let s=e.sampleRate*2,r=e.createBuffer(1,s,e.sampleRate),o=r.getChannelData(0);for(let m=0;m<s;m++)o[m]=Math.random()*2-1;this.noiseBuf=r;let a=()=>{let m=e.createBufferSource();return m.buffer=r,m.loop=!0,m.start(),m};this.motor=e.createGain(),this.motor.gain.value=0;let l=e.createBiquadFilter();l.type="bandpass",l.Q.value=2,this.motorFilter=l,this.oscA=e.createOscillator(),this.oscA.type="sawtooth",this.oscB=e.createOscillator(),this.oscB.type="sine",this.oscA.connect(l),this.oscB.connect(l),l.connect(this.motor).connect(this.amb),this.oscA.start(),this.oscB.start(),this.whine=e.createOscillator(),this.whine.type="sine",this.whineGain=e.createGain(),this.whineGain.gain.value=0,this.whine.connect(this.whineGain).connect(this.amb),this.whine.start();let c=a();this.roadFilter=e.createBiquadFilter(),this.roadFilter.type="lowpass",this.roadGain=e.createGain(),this.roadGain.gain.value=0,c.connect(this.roadFilter).connect(this.roadGain).connect(this.amb);let h=a();this.windFilter=e.createBiquadFilter(),this.windFilter.type="bandpass",this.windFilter.frequency.value=700,this.windFilter.Q.value=.6,this.windGain=e.createGain(),this.windGain.gain.value=0,h.connect(this.windFilter).connect(this.windGain).connect(this.amb);let u=a(),d=e.createBiquadFilter();d.type="highpass",d.frequency.value=1800,this.rainGain=e.createGain(),this.rainGain.gain.value=0,u.connect(d).connect(this.rainGain).connect(this.amb),this.siren=e.createOscillator(),this.siren.type="triangle",this.sirenGain=e.createGain(),this.sirenGain.gain.value=0;let f=e.createBiquadFilter();f.type="lowpass",f.frequency.value=2200,this.siren.connect(f).connect(this.sirenGain).connect(this.sfx),this.siren.start(),this.ready=!0,this.rainTick=0}setEnabled(t){this.enabled=t,this.master&&this.master.gain.setTargetAtTime(t?this.volume:0,this.ctx.currentTime,.05)}update(t,{speed:e,throttle:n,rain:s,sirenLevel:r,inCabin:o=!0,paused:a=!1}){if(!this.ready)return;let l=this.ctx.currentTime,c=a?0:e,h=o?1:.7,u=this.duck;this.oscA.frequency.setTargetAtTime(60+c*7.5,l,.05),this.oscB.frequency.setTargetAtTime(120+c*15,l,.05),this.motorFilter.frequency.setTargetAtTime(300+c*30,l,.05),this.motor.gain.setTargetAtTime(a?0:(.012+n*.03+c*4e-4)*h*u,l,.08),this.whine.frequency.setTargetAtTime(500+c*48,l,.05),this.whineGain.gain.setTargetAtTime(a?0:(.0025+n*.006)*Math.min(1,c/8)*u,l,.08),this.roadFilter.frequency.setTargetAtTime(200+c*22,l,.1),this.roadGain.gain.setTargetAtTime(a?0:Jt(c/60,0,1)*.11*h*u,l,.1),this.windGain.gain.setTargetAtTime(a?0:Jt((c/65)**2,0,1)*.08*u,l,.1),this.windFilter.frequency.setTargetAtTime(500+c*14,l,.1),this.rainGain.gain.setTargetAtTime(a?0:s*.05*(.7+c/120),l,.3),!a&&s>.1&&(this.rainTick-=t,this.rainTick<=0&&(this.rainTick=.02+Math.random()*.12/s,this.tick(2e3+Math.random()*3e3,.012*s)));let d=l%1.4<.7;this.siren.frequency.setTargetAtTime(d?440:587,l,.01),this.sirenGain.gain.setTargetAtTime(a?0:r*.05,l,.1)}env(t,e,n,s,r){t.gain.setValueAtTime(1e-4,e),t.gain.exponentialRampToValueAtTime(s,e+n),t.gain.exponentialRampToValueAtTime(1e-4,e+n+r)}tone(t,e=.2,n="sine",s=.15,r=0,o=null){if(!this.ready)return;let a=this.ctx,l=a.currentTime+r,c=a.createOscillator();c.type=n,c.frequency.setValueAtTime(t,l),o&&c.frequency.exponentialRampToValueAtTime(o,l+e);let h=a.createGain();this.env(h,l,.008,s,e),c.connect(h).connect(this.sfx),c.start(l),c.stop(l+e+.05)}noiseBurst(t,e,{type:n="lowpass",freq:s=1e3,q:r=.7,when:o=0,slideTo:a=null}={}){if(!this.ready)return;let l=this.ctx,c=l.currentTime+o,h=l.createBufferSource();h.buffer=this.noiseBuf;let u=l.createBiquadFilter();u.type=n,u.frequency.setValueAtTime(s,c),a&&u.frequency.exponentialRampToValueAtTime(a,c+t),u.Q.value=r;let d=l.createGain();this.env(d,c,.01,e,t),h.connect(u).connect(d).connect(this.sfx),h.start(c,Math.random()),h.stop(c+t+.05)}tick(t,e){this.tone(t,.03,"sine",e)}nomiChime(){this.tone(1318.5,.35,"sine",.09),this.tone(987.8,.5,"sine",.08,.14),this.tone(2637,.2,"sine",.02,0)}naviAlert(){this.tone(880,.12,"sine",.1),this.tone(1174.7,.18,"sine",.1,.13)}pling(){this.tone(1567.98,.25,"triangle",.08),this.tone(2093,.4,"sine",.06,.06)}coin(){this.tone(987.8,.08,"square",.04),this.tone(1318.5,.3,"square",.04,.07)}chime(){[523.25,659.25,783.99,1046.5].forEach((t,e)=>this.tone(t,.25,"triangle",.07,e*.07))}bad(){this.tone(330,.25,"sawtooth",.05,0,180)}crash(){this.tone(70,.5,"sine",.5,0,30),this.noiseBurst(.45,.4,{freq:1800,slideTo:300}),this.noiseBurst(.25,.18,{type:"bandpass",freq:3500,q:3,when:.03})}scrape(){this.noiseBurst(.35,.12,{type:"bandpass",freq:2600,q:6})}whoosh(){this.noiseBurst(.5,.18,{type:"bandpass",freq:400,slideTo:2500,q:1.5})}wiperTwitch(){this.tone(75,.12,"sawtooth",.05),this.noiseBurst(.08,.03,{type:"bandpass",freq:900,q:4})}wiperSweep(){this.tone(70,.9,"sawtooth",.035),this.tone(1400,.35,"sine",.012,.2,1800)}horn(){this.tone(415,.45,"square",.06),this.tone(523,.45,"square",.05)}blinker(){this.tone(2400,.02,"square",.03)}flash(){this.noiseBurst(.05,.15,{type:"highpass",freq:3e3}),this.tone(3200,.6,"sine",.02,.05,6e3)}megafon(){this.tone(900,.4,"square",.04,0,1300)}click(){this.tone(1200,.04,"square",.02)}jingle(){[523.25,659.25,783.99,1046.5,987.77,1046.5].forEach((e,n)=>this.tone(e,.22,"triangle",.06,n*.12))}brunnenJingle(){[392,523.25,659.25,523.25,784].forEach((t,e)=>this.tone(t,.3,"sine",.07,e*.16)),this.noiseBurst(1.2,.03,{type:"highpass",freq:4e3,when:.1})}record(){[659.25,783.99,987.77,1318.5].forEach((t,e)=>this.tone(t,.35,"triangle",.08,e*.1))}confetti(){this.noiseBurst(.15,.3,{type:"lowpass",freq:600});for(let t=0;t<8;t++)this.tone(1500+Math.random()*2500,.05,"sine",.02,.1+t*.04)}};var U0="Mini Adam",N0="Tesla-Navi ferngesteuert",H0="Live-Eskalationen immer woanders!",_d=[{name:"Tesla Supercharger Erlensee",short:"Supercharger Erlensee",note:"Hier begann am 30.01.2021 das allererste Navi-Experiment.",km:[1.6,3.2]},{name:"Hochofenwerk Phoenix West, Dortmund",short:"Phoenix West",note:"Ziel des ersten Navi-Streams (429,16 km).",km:[2.2,4]},{name:"Burg Hauneck, Haunetal",note:"Das erste Ziel, das 2022 wirklich erreicht wurde.",km:[1.8,3.4]},{name:"Megahub Lehrte",note:"G\xFCterbahnhof. Der Chat war erleichtert.",km:[1.8,3.6]},{name:"Arnhem (Niederlande)",note:"Kurz mal Ausland.",km:[2.5,4.6]},{name:"Gifhorn, Supermarkt-Parkplatz",note:"Historisch bedeutsam. Polizei Gifhorn gr\xFC\xDFt.",km:[2,3.8],special:"gifhorn"},{name:"Liberec (Tschechien)",note:"Ziemlich weit. Wird bestimmt gleich \xFCberboten.",km:[6,8.5]},{name:"Wartburg, Eisenach",note:"Dort gibt es einen Automaten mit 0-Euro-Geldscheinen.",km:[1.8,3.5]},{name:"Drive-In: Pommes ohne R\xFCckfragen",note:"Die legend\xE4re Drive-In-Wette.",km:[1.4,2.6],special:"pommes"},{name:"Malte in Norderstedt abholen",short:"Malte abholen",note:"Die Bahn f\xE4llt mal wieder aus.",km:[2.6,4.8],special:"malte"},{name:"Burg Ronneburg",note:"Burgen gehen immer.",km:[1.6,3]},{name:"Rastplatz Sch\xE4ferborn Ost",short:"Sch\xE4ferborn Ost",note:"Endstation der dritten Navi-Runde.",km:[1.4,2.8]},{name:"Weser-Skywalk, Beverungen",note:"Aussicht mit Wackelfaktor.",km:[2,3.6]},{name:"Ionity-Ladestation Kirchheim",short:"Ionity Kirchheim",note:"Strom tanken mit Stil.",km:[1.5,3],special:"charger"},{name:"Tesla Supercharger Mogendorf",short:"Supercharger Mogendorf",note:"Hier endete die 723-km-Tour 2021.",km:[1.8,3.2],special:"charger"},{name:"K\xF6ln",note:"Wo genau? Egal, Hauptsache K\xF6ln.",km:[2.2,4]},{name:"Siegen",note:"Wurde schon oft gespendet. Setzt sich fast nie durch.",km:[2,3.5],special:"siegen",weight:.25},{name:"Bispingen",note:"Schnee im Sommer.",km:[2.4,4.2]},{name:"Sizilien (wegen Monte)",note:"Ein ganz normaler Ostersamstag.",km:[8,11]},{name:"Gardasee",note:"Die Oster-Tour l\xE4sst gr\xFC\xDFen.",km:[5,7]},{name:"Burg Staufen",note:"Silvester-Feeling.",km:[2.2,3.8]},{name:"Kassel \u2013 Elsa besuchen",note:"Spirit-Animal von SkylineTV LIVE.",km:[2,3.8],special:"elsa"},{name:"Fulda",note:"Startort der VIP-Edition.",km:[1.6,3]},{name:"Frankfurt am Main \u2013 Skyline",note:"Heimat von SkylineTV.",km:[2.4,4.4]},{name:"Bad Soden-Salm\xFCnster (Popcorn an der Lades\xE4ule)",note:"Haushaltsger\xE4te an der E-S\xE4ule testen.",km:[1.6,3],special:"charger"},{name:"Bischofsheim in der Rh\xF6n (Starlink)",note:"Erster Starlink-IRL-Stream der Welt.",km:[2.2,3.8]},{name:"Dortmund \u2013 die richtige Currywurstbude",note:"Diesmal ganz sicher die richtige.",km:[1.8,3.2],special:"bude"},{name:"Ein sehr sch\xF6ner Brunnen",note:"F\xFCr eine neue Folge BrunnenTV.",km:[1.4,2.8],special:"brunnen"},{name:"Meister Propper abholen",note:"Er ist ganz bestimmt gleich da.",km:[1.6,3],special:"propper"},{name:"Sparkasse (Farbe pr\xFCfen)",note:"Der Wissenschaftliche Dienst braucht Daten.",km:[1.4,2.6],special:"sparkasse"}],B0=["rot","blau","wei\xDF","rot (wie immer)","\xFCberraschend orange"],XM=["Ebbelwoi","Handk\xE4s","Brunnen","Schnitzel","Navi","Pl\xFCsch","Rettich","Elsa","Sparkassen","Blinker","Wischer","Kassel","Fulda","Gifhorn","Mainz","Rasthof","Akku","Supercharger","Dampfcola","Bananensaft","Kanalpunkte","Pommes","Funkloch","Drohnen","Starlink","Spurwechsel","Autobahn","Leitplanken","Ortsspenden","Rahmen","FullHD","Konfetti","Megafon","Ringtennis","Pandam\xFCtzen"],qM=["_FFM","77","_HD","3000","333","_Fan","fahrer","freund","hesse","_LIVE","42","_93","k\xF6nig","prinzessin","opa","tante","kumpel","_VIP","2017","liebe","meister","_on_tour","1337","xd"];function ns(){return ee(XM)+ee(qM)}function F0(i){let t=0;for(let e=0;e<i.length;e++)t=(t*31+i.charCodeAt(e))%360;return`hsl(${t}, 75%, 68%)`}var $l={james:{name:"James",icon:"\u{1F4B6}",role:"Finanz-Bot"},claudia:{name:"Claudia",icon:"\u2699\uFE0F",role:"Aktions-Bot"},victoria:{name:"Victoria",icon:"\u{1F3C6}",role:"Sieges-B\xF6ttin"},hugo:{name:"Hugo",icon:"\u23F0",role:"Hilfs-Bot"},nora:{name:"Nora",icon:"\u{1F5A5}\uFE0F",role:"Server-Bot"}},Se={ambient:["Gr\xFC\xDFe aus {city}! \u{1F44B}","Hallo Mini Adam \u2764","Ist das Bild wirklich Full HD?","Wo seid ihr gerade?","Welche Farbe hat die Sparkasse hier?","Gibt es in {city} einen Ringtennis-Verein?","Rechts fahren, Adam! \u{1F605}","Sch\xF6ne Landschaft heute","Wie viel Akku noch?","Wann kommt Meister Propper?","Malte Malte Malte Malte Malte","Erz\xE4hl mal die Raab-Story!","Das Bild ist so scharf \u{1F60D}","Elsa \u2764\u{1F41F}","BrunnenTV wann?","Bananensaft-Pause? \u{1F34C}","Kappandram\xE4\xDFige Zusammenfassung bitte, bin grad erst rein","Wir sind auf der Autobahn und streamen in Full HD! \u{1F3B6}","Wohin fahren wir eigentlich?","Das Navi-Ziel \xE4ndert sich eh gleich wieder","Gr\xFC\xDFe ans Sprachstudio!","Danke an alle Ehrenmenschen \u{1F64F}","Tic Tac jemand?","Pandam\xFCtze aufsetzen!","Ich biete 1 Cent mehr \u{1F911}","Was ist eigentlich im Kofferraum?","Gr\xFC\xDFe an die Polizei Gifhorn \u{1F46E}","Ist das die A7?","Sch\xF6ner Tesla \u{1F5A4}","Der Wischer ist auch nur ein Mensch","Nils wei\xDF bestimmt, wann wir das letzte Mal hier waren","Bester Stream der Woche","Die Pl\xFCsch-H\xE4nde am Lenkrad \u{1F602}","Gleich kommt bestimmt ein Brunnen","Tesla-Taxi spielen wann?","Erster! (nicht)","Falsche Bude? \u{1F602}","Wer hat das Navi so eingestellt","Adam, schreib mal eine Zahl in den Chat","Was l\xE4uft da im Radio?","Live-Eskalationen immer woanders \u{1F525}"],leftLane:["LINKS IST FREI!!! \u2B05\uFE0F","Endlich linke Spur \u{1F680}","Gib ihm!","Eine Minute Freiheit!","Danke f\xFCr die Freischaltung!","\u2B05\uFE0F\u2B05\uFE0F\u2B05\uFE0F","Jetzt aber links!","Linke Spur, Baby!"],leftLaneEnd:["Und wieder rechts \u{1F605}","Rechtsfahrgebot!","War sch\xF6n, solange es ging","Nochmal freischalten!"],naviChanged:["Wer war das? \u{1F602}","Nicht schon wieder!","\xDCberboten! \u{1F911}","Navi ferngesteuert \u{1F525}","Wendeman\xF6ver incoming","Das Navi wei\xDF auch nicht mehr weiter","Ich biete 1 Cent mehr","Klassiker","Jetzt aber wirklich!","NEIN \u{1F602}"],naviReached:["ANGEKOMMEN! \u{1F389}","Geschafft!!!","Und jetzt?","Gibt es hier eine Sparkasse?","Wo ist der Guide?","Ziel erreicht \u{1F3C1}"],crash:["Rezeption!","Uff \u{1F648}","Das gibt \xC4rger","Polizei Gifhorn ist unterwegs \u{1F693}","Blechschaden!","Hoffentlich hat das keiner gesehen","Eskalation! \u{1F602}","Das war die falsche Spur"],nearMiss:["WAS WAR DAS \u{1F631}","Knapp!!!","Millimeterarbeit","CLIP!","Clip it!","Puh\u2026","Mutig!"],rainStart:["Regen \u{1F327}","Jetzt wird es spannend","Wischer.exe reagiert nicht","Auto-Wischer (Beta) \u{1F602}","Der Herr mit den Schirmen freut sich","Ab jetzt gibt es Regenzulage!"],wiper:["Der Wischer zuckt wieder \u{1F602}","Der Wischer wischt nicht, der winkt nur","Software-Update wann?","Das ist kein Bug, das ist ein Feature","Wischer-Firmware 0.1 Beta","Mach doch einfach manuell!","Der Wischer ist sch\xFCchtern"],police:["POLIZEI GIFHORN \u{1F693}","Polizei Gifhorn kommt!","Benehmen jetzt!","Ganz ruhig bleiben\u2026","\u{1F46E}\u{1F46E}\u{1F46E}"],funkloch:["F","F","F","Ton f","/cam2","F","Bild weg?","F"],funklochBack:["\u2714\uFE0F","\u2714\uFE0F","\u2714\uFE0F Bild ist wieder da","Da ist es wieder \u2714\uFE0F"],frog:["\u{1F438}","\u{1F438}\u{1F438}","Frosch!","\u{1F438} HDMI-Kabel?"],blitzer:["\u{1F4F8}","L\xE4cheln! \u{1F4F8}","Das Foto kommt in einen Rahmen","Tsch\xFCss, du Betr\xFCger!","Teures Selfie"],elefant:["Elefantenrennen \u{1F418}\u{1F418}","Das dauert\u2026","\xDCberholverbot wann?","Die stehen ja fast"],trunk:["Kofferraum auf! \u{1F602}","Was ist da drin?","Bitspende-Eskalation","Konfetti im Kofferraum?"],brunnen:["BRUNNENTV!!!","Herr Sch\xF6nnbrun!","Brunnen gesichtet! \u26F2","Neue Folge BrunnenTV!"],elsa:["ELSA!!! \u2764\u{1F41F}","Elsa \u2764","Spirit-Animal gesichtet!","\u{1F451}\u{1F41F}"],record:["REKORD!!! \u{1F389}","Neuer Zuschauerrekord!","Diesmal ohne Viewer-Bots \u{1F916}","Hype!"],banana:["\u{1F34C}\u{1F34C}\u{1F34C}","Bananensaft-Power!","Lecker \u{1F34C}"],koriander:["B\xE4h, Koriander \u{1F922}","Nicht der Koriander!","Wer hat da Koriander bestellt?"],shoulder:["Standstreifen?! \u{1F631}","Polizei Gifhorn!!","Das ist keine Fahrspur!"],fiveJobs:["Job erledigt \u2705","Weiter so!","Noch ein Job weniger"],rahmen:["Sch\xF6ner Rahmen \u{1F602}","Ich sehe nichts mehr","Bestes Geld ever","Danke f\xFCr den Rahmen!"],zahl:()=>ge(.75)?YM():String(Yr(10,9999))};function YM(){let i=Yr(2,4),t="";for(let e=0;e<i;e++)t+=ge(.62)?"3":String(Yr(0,9));return t.includes("3")||(t="3"+t.slice(1)),t}function Md(i,t={}){return i.replace(/\{(\w+)\}/g,(e,n)=>t[n]!==void 0?t[n]:ee(ZM))}var ZM=["Fulda","Kassel","Gifhorn","Mainz","K\xF6ln","Siegen","Hanau","Darmstadt","Bielefeld","Buxtehude","Konstanz","Augsburg","Bremen","N\xFCrnberg","Hamburg","L\xFCbeck","Trier","Erlensee"];function O0(i){return i>=100?"ALTER!":i>=50?"Mittelalter":i>=33?"Drittel-Alter":i>=25?"Viertel-Alter":i>=20?"F\xFCnftel-Alter":i>=10?"Zehntel-Alter":null}var ir={kassandra:{label:"Fr\xE4ulein Kassandra",pitch:1.35,rate:1},weronika:{label:"Weronika",pitch:1.1,rate:.95},karla:{label:"Karla",pitch:1,rate:1.05},william:{label:"Br\xFCll-William",pitch:.55,rate:1.12},board:{label:"NOMI",pitch:1.18,rate:1.04},schoennbrun:{label:"Herr Sch\xF6nnbrun",pitch:.45,rate:.82}},z0=[{voice:"kassandra",text:"Treffen sich zwei Unterhosen. Fragt die eine: Warst du im Urlaub? Du bist so braun."},{voice:"karla",text:"Hallo Mini Adam, liebe Gr\xFC\xDFe aus {city}. Dachs gr\xFC\xDFt Efeu."},{voice:"william",text:"Mini Adam, bitte einmal hupen! Bimmel hurra!"},{voice:"weronika",text:"Hier spricht Meister Propper. Ich bin in f\xFCnf Minuten da."},{voice:"karla",text:"Gr\xFC\xDFe an das Sprachstudio und an alle Ehrenmenschen!"},{voice:"weronika",text:"Mini Adam, wann gibt es endlich eine neue Folge BrunnenTV?"},{voice:"kassandra",text:"Liebe Gr\xFC\xDFe an Elsa!"},{voice:"karla",text:"Gibt es in {city} eigentlich einen Ringtennis-Verein?"},{voice:"weronika",text:"Welche Farbe hat die Sparkasse in {city}?"},{voice:"william",text:"Mini Adam, erz\xE4hl doch mal die Raab-Story!"},{voice:"karla",text:"Wir sind auf der Autobahn und streamen in Full HD!"},{voice:"william",text:"Ich biete einen Cent mehr. Neues Ziel: {city}."},{voice:"kassandra",text:"Bitte rechts fahren. Mit freundlichen Gr\xFC\xDFen, die Polizei Gifhorn."},{voice:"weronika",text:"Mini Adam, du f\xE4hrst besser als jedes Navi."},{voice:"karla",text:"Hallo Mini Adam! Schreib mal eine Zahl in den Chat. Aber bitte ohne Drei."},{voice:"william",text:"Kappandram\xE4\xDFige Zusammenfassung bitte! Ich war beim Schwimmunterricht."}],G0=[{voice:"karla",text:"Guten Tag, hier ist der Herr mit den Schirmen. Ich w\xFCrde meine Schirme gerne heute noch abholen."},{voice:"weronika",text:"Mini Adam, dein Scheibenwischer winkt mir gerade zu. Ich winke zur\xFCck!"},{voice:"kassandra",text:"Achtung, Achtung. Der automatische Scheibenwischer befindet sich weiterhin in der Beta-Phase."}],ai={leftLane:"Die linke Fahrspur ist freigeschaltet.",leftLaneEnd:"Die linke Fahrspur ist wieder gesperrt. Bitte rechts fahren.",naviChanged:"Das Navi-Ziel wurde ge\xE4ndert.",arrived:"Sie haben Ihr Ziel erreicht.",rain:"Regen erkannt. Automatische Scheibenwischer aktiviert.",lowBattery:"Akku schwach. Bitte bald laden.",veryLowBattery:"Akku fast leer. Die Stream-Technik schaltet gleich ab.",elefant:"Achtung. Elefantenrennen voraus.",blitzer:"Hinweis: Tempolimit. Station\xE4rer Blitzer voraus.",shoulder:"Hinweis: Der Standstreifen ist keine Fahrspur.",funkloch:"Verbindung schwach. Mobilfunk wird neu geb\xFCndelt."},V0=[{id:"rosen",name:"Rosenrahmen",price:12,dur:9},{id:"rettich",name:"Rettichrahmen",price:13.69,dur:9},{id:"pommes",name:"Pommes-Rahmen",price:5,dur:7},{id:"pappkarton",name:"Pappkartonhaufen",price:10,dur:8},{id:"haelfte",name:"Bildh\xE4lfte abdecken",price:10,dur:3.5},{id:"elsa",name:"Elsa auf den Bildschirm zaubern",price:2.9,dur:6},{id:"burger",name:"Burger-Rahmen",price:14,dur:8},{id:"candy",name:"Candy-Rahmen",price:10,dur:8},{id:"lego",name:"Lego-Rahmen",price:12,dur:8},{id:"briefmarken",name:"Briefmarken-Rahmen",price:10.01,dur:8},{id:"chips",name:"Chipsrahmen",price:5,dur:7},{id:"keinerechte",name:"Keine-Rechte-Bildrahmen",price:10,dur:7},{id:"kuerbis",name:"K\xFCrbis im Stream",price:4.9,dur:6}],k0=[{km:0,job:"Brownietester",src:"19.03.2020, Ersatzstream im Homeoffice"},{km:1,job:"Briefmarkenautomatenbef\xFCller",src:"26.03.2020, Ersatzstream im Homeoffice"},{km:2,job:"Plumpsklo-Ingenieur",src:"20.09.2018, M\xFCnster"},{km:3,job:"baut k\xFCnstliche Maulwurfstunnel",src:"02.01.2020, Cuxhaven"},{km:4,job:"Bildumdreher im Frankfurter Kunstmuseum",src:"05.03.2020, Werne"},{km:5,job:"Krokodilw\xE4chter im Frankfurter Zoo",src:"26.05.2019, Fulda"},{km:6.5,job:"Qualit\xE4tssicherung f\xFCr Schilder (pr\xFCft die Druckaufl\xF6sung)",src:"30.03.2017, M\xFCnchen"},{km:8,job:"wartet Schornsteine in Wolkenkratzern",src:"13.12.2019, Salzburg"},{km:10,job:"richtet WLAN in Flugzeugen ein",src:"25.07.2019, Karlsruhe"},{km:12,job:"schreibt die Algorithmen f\xFCr die roten und orangenen Bereiche bei Google Maps",src:"23.05.2019, Freising"},{km:15,job:"macht statistische Modelle f\xFCr die Endzeit der Benzintankstellen",src:"07.10.2022, Golfen im Park"},{km:20,job:"Teilchenbeschleuniger",src:"06.02.2021, Tesla-Navi ferngesteuert"}];function W0(i){let t=k0[0];for(let e of k0)i>=e.km&&(t=e);return t}var X0=[{id:"left20",text:"20 Sekunden auf der freigeschalteten linken Spur",goal:20,stat:"leftLaneTime"},{id:"navi1",text:"Ein Navi-Ziel erreichen",goal:1,stat:"naviReached"},{id:"near3",text:"3\xD7 haarscharf \xFCberholen",goal:3,stat:"nearMisses"},{id:"speed200",text:"200 km/h fahren",goal:200,stat:"maxSpeedKmh"},{id:"banana2",text:"2\xD7 Bananensaft einsammeln",goal:2,stat:"bananas"},{id:"clean5",text:"5 km ohne Blechschaden",goal:5e3,stat:"cleanDistance"},{id:"changes3",text:"3 Navi-\xC4nderungen \xFCberstehen",goal:3,stat:"naviChanges"},{id:"viewers1000",text:"1.000 Zuschauer erreichen",goal:1e3,stat:"maxViewers"},{id:"charge2",text:"2 Lade-Ringe einsammeln",goal:2,stat:"charges"},{id:"dist8",text:"8 km Strecke schaffen",goal:8e3,stat:"distance"},{id:"blitzfrei",text:"An einem Blitzer vorbei, ohne geblitzt zu werden",goal:1,stat:"blitzerClean"},{id:"rain1",text:"1 km im Regen fahren",goal:1e3,stat:"rainDistance"}],qo=[{id:"boost",icon:"\u26A1",name:"Beschleunigungs-Boost",cat:"Leistung",prices:[300,700,1500],desc:"Over-the-Air-Update f\xFCr mehr Bums. Zieht los wie der Chat bei einer Ortsspende.",effect:i=>`Beschleunigung +${i*20} %`},{id:"vmax",icon:"\u{1F3C1}",name:"Tempo-Freischaltung",cat:"Leistung",prices:[400,900,1900],desc:"Hebt die Software-Drossel auf. Stufe 3 ist der Performance-Modus.",effect:i=>`H\xF6chstgeschwindigkeit ${[200,215,233,261][i]} km/h`},{id:"akku",icon:"\u{1F50B}",name:"Akku-Puffer",cat:"Akku",prices:[350,800,1600],desc:"Mehr nutzbare kWh. Offiziell bleibt es nat\xFCrlich beim 75-kWh-Akku.",effect:i=>`${75+i*4} kWh nutzbar`},{id:"encoder",icon:"\u{1F4E1}",name:"Stream-Technik-Update",cat:"Akku",prices:[300,700,1400],desc:"Telekom, Vodafone und O\u2082 werden effizienter geb\xFCndelt. Die Technik im Kofferraum frisst weniger Strom.",effect:i=>`Stromverbrauch der Stream-Technik \u2212${i*15} %`},{id:"reifen",icon:"\u{1F6DE}",name:"Sportreifen",cat:"Fahrwerk",prices:[350,900],desc:"Mehr Grip f\xFCr schnelle Spurwechsel, auch bei Regen.",effect:i=>`Spurwechsel +${i*12} %, besserer Nassgrip`},{id:"polster",icon:"\u{1F9F8}",name:"Pl\xFCsch-Polster",cat:"Fahrwerk",prices:[500,1300],desc:"Rundum-Polsterung aus original Mini-Adam-Pl\xFCsch. Steckt einen Rempler mehr weg.",effect:i=>`${3+i} Karosserie-Punkte`},{id:"wischer",icon:"\u{1F327}\uFE0F",name:"Wischer-Firmware (Beta)",cat:"Sicht",prices:[250,600,1200],desc:"Der automatische Wischer wischt jetzt manchmal. Manchmal. Zucken bleibt Kult.",effect:i=>["Version 0.1 Beta: zuckt nur","Version 11.1 Beta: wischt ab und zu","Version 11.2 Beta: wischt \xF6fter","Version 12 (immer noch Beta)"][i]},{id:"megafon",icon:"\u{1F4E2}",name:"Megafon",cat:"Spa\xDF",prices:[450],desc:"Wie in Gifhorn: Mit einer Megafon-Durchsage macht der Verkehr vor dir Platz. Taste H.",effect:()=>"Autos vor dir wechseln die Spur"},{id:"starlink",icon:"\u{1F6F0}\uFE0F",name:"Starlink-Sch\xFCssel",cat:"Spa\xDF",prices:[1100],desc:"Wie beim ersten Starlink-IRL-Stream der Welt: keine Funkl\xF6cher, mehr Zuschauer, mehr Spenden.",effect:()=>"Keine Funkl\xF6cher, +25 % Zuschauer, +20 % Spenden"},{id:"linksspur",icon:"\u2B05\uFE0F",name:"Linke-Spur-Sammelaktion",cat:"Spa\xDF",prices:[400,1e3],desc:"Die Community sammelt flei\xDFiger: Die linke Spur wird \xF6fter freigeschaltet und zahlt besser.",effect:i=>`Linke-Spur-Bonus +${i*25} %, h\xE4ufiger`},{id:"elsa",icon:"\u{1F451}",name:"Wackel-Elsa",cat:"Deko",prices:[120],desc:"Das Spirit-Animal von SkylineTV LIVE als Wackelfigur f\xFCrs Armaturenbrett.",effect:()=>"Wackelt bei jeder Kurve mit"},{id:"weste",icon:"\u{1F9BA}",name:"Warnweste",cat:"Deko",prices:[90],desc:"F\xFCr Mini Adam. Bringt nichts, sieht aber sehr professionell aus.",effect:()=>"Sichtbar beim Kameraschwenk"},{id:"konfetti",icon:"\u{1F389}",name:"Konfetti-Kanone",cat:"Deko",prices:[200],desc:"Knallt bei jedem erreichten Ziel. Ein paar Schnipsel kleben danach an der Scheibe \u2013 wie 2022.",effect:()=>"Konfetti bei Navi-Zielen"}],Jl=Object.fromEntries(qo.map(i=>[i.id,i.prices.length])),q0=[["Fahrer","Mini Adam"],["Kamera","station\xE4r"],["Drohne","die Drohne"],["Sprachstudio","das Sprachstudio"],["Scheibenwischer","Auto-Wischer (Beta)"],["Navigation","ferngesteuert vom Chat"]];function Y0(i=1,t=30){let e=Tt(i,t);return ge(.15)?13.69:ge(.1)?3.33:Math.round(e*100)/100}var jl=class{constructor(){if(this.supported=typeof window<"u"&&"speechSynthesis"in window&&typeof SpeechSynthesisUtterance<"u",this.enabled=!0,this.voices=[],this.queue=[],this.busy=!1,this.current=null,this.supported){let t=()=>{let e=window.speechSynthesis.getVoices();this.voices=e.filter(n=>/^de(-|_|$)/i.test(n.lang))};t(),window.speechSynthesis.onvoiceschanged=t}}pickVoice(t){if(!this.voices.length)return null;let e={board:[/Google Deutsch/i,/Anna/i,/Hedda/i,/Katja/i,/Petra/i,/Helena/i],kassandra:[/Anna/i,/Google Deutsch/i,/Katja/i,/Hedda/i],weronika:[/Hedda/i,/Petra/i,/Google Deutsch/i],karla:[/Katja/i,/Google Deutsch/i,/Anna/i],william:[/Stefan/i,/Markus/i,/Yannick/i,/Conrad/i,/Google Deutsch/i],schoennbrun:[/Stefan/i,/Markus/i,/Yannick/i,/Conrad/i]}[t]||[];for(let n of e){let s=this.voices.find(r=>n.test(r.name));if(s)return s}return this.voices[0]}estimate(t,e=1){return Math.max(1.2,t.length/14/e)}say(t,e="board",n={}){let s=ir[e]||ir.board,r=this.estimate(t,s.rate),o={text:t,voiceKey:e,opts:n,dur:r};if(n.priority)this.queue=this.queue.filter(a=>a.opts.priority),this.current&&!this.current.opts.priority&&this.cancelCurrent(),this.queue.unshift(o);else{if(this.queue.length>2)return r;this.queue.push(o)}return this.pump(),r}cancelCurrent(){if(this.supported)try{window.speechSynthesis.cancel()}catch{}this.current?.timer&&clearTimeout(this.current.timer);let t=this.current;this.current=null,this.busy=!1,t?.opts.onEnd?.()}pump(){if(this.busy||!this.queue.length)return;let t=this.queue.shift();this.busy=!0,this.current=t;let e=ir[t.voiceKey]||ir.board;t.opts.onStart?.(t.dur);let n=()=>{this.current===t&&(t.timer&&clearTimeout(t.timer),this.current=null,this.busy=!1,t.opts.onEnd?.(),setTimeout(()=>this.pump(),250))};if(this.supported&&this.enabled&&this.voices.length)try{let s=new SpeechSynthesisUtterance(t.text);s.lang="de-DE";let r=this.pickVoice(t.voiceKey);r&&(s.voice=r),s.pitch=e.pitch,s.rate=e.rate,s.volume=1,s.onend=n,s.onerror=n,window.speechSynthesis.speak(s),t.timer=setTimeout(n,(t.dur+4)*1e3);return}catch{}t.timer=setTimeout(n,t.dur*1e3)}stopAll(){this.queue=[],this.cancelCurrent()}pause(t){if(this.supported)try{t?window.speechSynthesis.pause():window.speechSynthesis.resume()}catch{}}};var Ql=class{constructor(){this.keys=new Set,this.pressed=new Set,this.touch={left:!1,right:!1,gas:!1,brake:!1},this.steer=0,this.throttle=0,this.brake=0,this.anyKey=!1,this.lastDevice=typeof matchMedia=="function"&&matchMedia("(pointer: coarse)").matches?"touch":"keyboard";let t={ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right",ArrowUp:"gas",KeyW:"gas",ArrowDown:"brake",KeyS:"brake",Space:"horn",KeyE:"wiper",KeyH:"megafon",Escape:"pause",KeyP:"pause",KeyV:"camera",KeyM:"mute",Enter:"confirm",KeyC:"chat"};this.map=t,window.addEventListener("keydown",e=>{let n=t[e.code];if(!(e.target&&/input|textarea|select/i.test(e.target.tagName))&&(this.anyKey=!0,this.lastDevice="keyboard",n)){this.keys.has(n)||this.pressed.add(n),this.keys.add(n);let s=e.target&&e.target.tagName==="BUTTON"&&e.target.offsetParent!==null;["left","right","gas","brake","horn"].includes(n)&&!s&&e.preventDefault()}}),window.addEventListener("keyup",e=>{let n=t[e.code];n&&this.keys.delete(n)}),window.addEventListener("blur",()=>this.keys.clear()),this.padPrev={}}bindTouch(t,e){let n=r=>{r.preventDefault(),this.lastDevice="touch",e in this.touch?this.touch[e]=!0:this.pressed.add(e)},s=r=>{r.preventDefault(),e in this.touch&&(this.touch[e]=!1)};t.addEventListener("pointerdown",n),t.addEventListener("pointerup",s),t.addEventListener("pointercancel",s),t.addEventListener("pointerleave",s)}poll(){let t=0,e=0,n=0;(this.keys.has("left")||this.touch.left)&&(t-=1),(this.keys.has("right")||this.touch.right)&&(t+=1),(this.keys.has("gas")||this.touch.gas)&&(e=1),(this.keys.has("brake")||this.touch.brake)&&(n=1);let s=navigator.getGamepads?navigator.getGamepads():[];for(let r of s){if(!r)continue;let o=r.axes[0]||0;Math.abs(o)>.15&&(t=o,this.lastDevice="gamepad");let a=r.buttons[7]?.value||0,l=r.buttons[6]?.value||0;a>.05&&(e=Math.max(e,a)),l>.05&&(n=Math.max(n,l)),r.buttons[12]?.pressed&&(e=1),r.buttons[13]?.pressed&&(n=1);let c=(h,u)=>{let d=r.index+":"+h,f=!!r.buttons[h]?.pressed;f&&!this.padPrev[d]&&(this.pressed.add(u),this.anyKey=!0),this.padPrev[d]=f};c(0,"horn"),c(2,"wiper"),c(3,"megafon"),c(9,"pause"),c(1,"camera")}this.steer=Math.max(-1,Math.min(1,t)),this.throttle=e,this.brake=n}take(t){return this.pressed.has(t)?(this.pressed.delete(t),!0):!1}endFrame(){this.pressed.clear(),this.anyKey=!1}};var bd="mini-adam-tesla-navi-v1",sr={wallet:0,upgrades:{},best:{distance:0,earned:0,viewers:0},stats:{runs:0,totalKm:0,naviReached:0,crashes:0,leftLaneEuro:0},settings:{sound:!0,speech:!0,chat:!0,quality:"auto",volume:.8},seenIntro:!1};function Z0(){try{let i=localStorage.getItem(bd);if(!i)return structuredClone(sr);let t=JSON.parse(i);return{...structuredClone(sr),...t,best:{...sr.best,...t.best||{}},stats:{...sr.stats,...t.stats||{}},settings:{...sr.settings,...t.settings||{}},upgrades:{...t.upgrades||{}}}}catch{return structuredClone(sr)}}function rr(i){try{return localStorage.setItem(bd,JSON.stringify(i)),!0}catch{return!1}}function K0(){try{localStorage.removeItem(bd)}catch{}return structuredClone(sr)}var tc=1/3.6,KM=[200,215,233,261],Ed=-7.8,$0=10,$M=7.9,ec=class{constructor(){this.reset({})}reset(t={}){let e=n=>t[n]||0;this.upgrades=t,this.vmaxBase=KM[Math.min(3,e("vmax"))]*tc,this.accelMul=1+.2*e("boost"),this.capacity=75+4*e("akku"),this.streamDrain=.1*(1-.15*e("encoder")),this.latMul=1+.12*e("reifen"),this.wetGrip=.66+.13*e("reifen"),this.maxHits=3+e("polster"),this.s=0,this.x=bt.laneCenter(3),this.vx=0,this.speed=95*tc,this.yaw=0,this.latAcc=0,this.steer=0,this.throttle=0,this.braking=0,this.battery=100,this.hits=0,this.cooldown=0,this.len=oi.length,this.w=oi.width,this.shoulderTime=0,this.scrapeCooldown=0,this.sugar=0,this.wobble=0,this.limiter=0,this.empty=!1,this.events=[]}get kmh(){return this.speed*3.6}get vmax(){return this.vmaxBase*(this.sugar>0?1.08:1)}get lane(){return Jt(Math.round((this.x+5.625)/3.75),0,3)}get inLeftLane(){return this.x<-3.75-.35}get onShoulder(){return this.x>$M}update(t,e,n={}){this.events.length=0;let s=n.wet||0,r=1-s*(1-this.wetGrip);this.cooldown=Math.max(0,this.cooldown-t),this.scrapeCooldown=Math.max(0,this.scrapeCooldown-t),this.sugar=Math.max(0,this.sugar-t),this.wobble=Math.max(0,this.wobble-t);let o=this.speed/55,a=.25*o*o*(.4+.6*Math.max(this.throttle,.35)),l=(this.streamDrain+a)*(75/this.capacity);this.battery=Math.max(0,this.battery-l*t),this.empty=this.battery<=0;let c=this.empty?0:Jt(e.throttle,0,1),h=Jt(e.brake,0,1);this.throttle=Hn(this.throttle,c,8,t),this.braking=h;let u=this.speed,d=this.vmax,f=0;if(c>.02&&u<d){let _=Jt(u/d,0,1);f+=c*5.4*this.accelMul*Math.max(.12,1-Math.pow(_,2.6))}h>.02&&(f-=h*9.5*(1-s*.18)),c<=.02&&h<=.02&&(f-=.12+11e-5*u*u+(this.empty?1.4:0)),u>d&&(f=Math.min(f,-1.5)),this.speed=Math.max(0,u+f*t),u<=d&&this.speed>d&&(this.speed=d);let m=Jt(e.steer,-1,1);this.wobble>0&&(m+=Math.sin(this.wobble*9)*.35),this.steer=Hn(this.steer,m,14,t);let v=Jt(this.speed/12,0,1),g=4.3*this.latMul*r*v,p;if(Math.abs(m)>.08)p=m*g;else{let _=bt.laneCenter(this.lane);p=Jt((_-this.x)*2,-1.9,1.9)*v}let x=this.vx;if(this.vx=Hn(this.vx,p,8.5*r,t),this.latAcc=(this.vx-x)/Math.max(t,1e-4),this.x+=this.vx*t,this.x<Ed||this.x>$0){let _=this.x<Ed?-1:1;this.x=_<0?Ed:$0;let y=Math.abs(this.vx)>1.2;this.vx=-_*Math.min(1.5,Math.abs(this.vx)*.4),this.scrapeCooldown<=0&&(this.scrapeCooldown=.6,this.speed*=y?.9:.97,this.events.push({type:"rail",side:_,hard:y}))}this.onShoulder&&this.speed>5?this.shoulderTime+=t:this.shoulderTime=Math.max(0,this.shoulderTime-t*2),this.yaw=Jt(Math.atan2(this.vx,Math.max(this.speed,4)),-.22,.22),this.s+=this.speed*t}collide(t){let e=this.cooldown<=0,n=t.car,s=t.lonOverlap>t.latOverlap*1.6;if(!s&&t.ds>0)this.s=n.s-(n.len+this.len)/2-.35,e?(this.speed=Math.max(0,Math.min(this.speed,n.speed)-4),n.speed+=2.5):this.speed=Math.min(this.speed,n.speed);else if(!s&&t.ds<0)e?(this.speed+=2,n.speed=Math.max(0,this.speed-4)):n.speed=Math.min(n.speed,this.speed),n.s=this.s-(n.len+this.len)/2-.4;else{let r=t.dx>0?-1:1;e?(this.x+=r*(t.latOverlap+.12),this.vx=r*3.2,this.speed*=.93,n.speed*=.97):(this.x+=r*(t.latOverlap+.05),this.vx=r*Math.max(1.5,this.vx*r))}return e?(this.hits++,this.cooldown=1.6,!0):!1}charge(t){this.battery=Math.min(100,this.battery+t),this.empty=!1}};function wd(i){if(!i)return"";if(i.short)return i.short;let t=i.name.split(/[,(–:]/)[0].trim();return t.length>24?t.slice(0,23)+"\u2026":t}var JM={rot:"#d5121e",blau:"#1d5fbf",wei\u00DF:"#f2f2f2","rot (wie immer)":"#d5121e","\xFCberraschend orange":"#f07a12"},nc=class{constructor(t){this.scenery=t,this.requests=[],this.reset(0)}reset(t){for(let e of this.requests)this.scenery.cancel(e);this.requests=[],this.bid=.01,this.changes=0,this.history=[],this.set(t,_d[0],"Mini Adam",{first:!0})}pickTarget(){let t=this.target;return Bo(_d.filter(e=>e!==t),e=>e.weight??1)}overbid(t,e){let n=ge(.18)?Math.floor(Tt(2,12)):1;this.bid=Math.round((this.bid+n*.01)*100)/100,this.changes++;let s=this.pickTarget();return this.set(t,s,e),s}set(t,e,n,{first:s=!1}={}){for(let r of this.requests)this.scenery.cancel(r,!this.arrived);this.requests=[],this.target=e,this.bidder=n,this.km=Tt(e.km[0],e.km[1]),this.startS=t,this.targetS=t+this.km*1e3,this.recalc=s?0:1,this.wende=!s&&ge(.28),this.wendeS=t+Tt(380,820),this.arrived=!1,this.side=ge(.5)?1:-1,this.sparkColor=ee(B0),this.history.push({name:e.name,bidder:n,bid:this.bid}),this.history.length>12&&this.history.shift(),this.placeLandmarks()}placeLandmarks(){let t=this.target,e=this.targetS,n=(s,r,o)=>this.requests.push(this.scenery.request(s,r,o));switch(n("ziel",e,{title:wd(t)}),t.special){case"brunnen":n("brunnen",e-70);break;case"elsa":n("elsa",e-70);break;case"sparkasse":n("sparkasse",e-90,{color:JM[this.sparkColor]||"#d5121e"});break;case"pommes":n("kiosk",e-80,{title:"Drive-In",sub:"Pommes ohne R\xFCckfragen"});break;case"bude":n("kiosk",e-80,{title:"Currywurst",sub:"die richtige Bude (wirklich!)"});break;case"charger":n("charger",e-80);break;default:break}/Burg|Wartburg/.test(t.name)&&n("burg",e-40),/Frankfurt/.test(t.name)&&n("skyline",e+300)}get remaining(){return Math.max(0,this.targetS-this._s)}update(t,e){this._s=e;let n=[];return this.recalc=Math.max(0,this.recalc-t/2.4),this.wende&&e>this.wendeS&&(this.wende=!1,this.recalc=.8,n.push({type:"wendeIgnored"})),!this.arrived&&e>=this.targetS&&(this.arrived=!0,n.push({type:"arrived",target:this.target,km:this.km})),n}screen(t,e,n){let s=Math.max(0,this.targetS-t),r=e+s/Jt(n,20,70)*.5;return{target:this.arrived?"Warte auf das n\xE4chste Gebot \u2026":this.target.name,arrived:this.arrived,remaining:s,recalc:this.recalc,side:this.side,wende:this.wende,wendeS:this.wendeS,eta:this.arrived?"":"Ankunft "+Zr(r),bidder:this.bidder,bid:Ze(this.bid)}}};var jM=["POLIZEI GIFHORN","GUTE FAHRT, ADAM!","GIFHORN GR\xDCSST","BITTE L\xC4CHELN"],J0=16*Math.PI/180,ic={top:5.65,chin:3.1,half:1.3},QM=new A,sc=class{constructor(t){Object.assign(this,t),this.player=new ec,this.navi=new nc(this.scenery),this.scenery.gantryInfo=(e=this.player.s)=>{let n=(this.navi.targetS-e)/1e3;return n<.2?null:{target:wd(this.navi.target),km:n}},this.running=!1,this.over=null}start(t){this.save=t;let e=t.upgrades||{};this.up=e;let n=this.player;n.reset(e),this.t=0,this.money=0,this.breakdown={},this.over=null,this.running=!0,this.queue=[],this._greeted=!1,this._introChime=!1,this.clock=18*60,this.viewers=240,this.hype=0,this.peakViewers=240,this.recordShown=!1,this.lastHorn=-99,this.megafonCd=0,this.leftTick=0,this.chatT=1.5,this.donationT=Tt(6,10),this.stats={leftLaneTime:0,naviReached:0,nearMisses:0,maxSpeedKmh:0,bananas:0,cleanDistance:0,naviChanges:0,maxViewers:0,charges:0,distance:0,blitzerClean:0,rainDistance:0,crashes:0,koriander:0,fines:0,wipes:0,twitches:0,photos:0},this.jobs=Np(X0).slice(0,5).map(r=>({...r,done:!1,progress:0})),this.allJobsPaid=!1;let s=e.linksspur||0;this.left={open:!1,timer:0,next:Tt(22,30),warned:!1,glow:0,rg:0,grace:0,bonusMul:1+.25*s,freq:1-.14*s,earned:0},this.weather={level:0,target:0,active:!1,dur:0,cool:0,announced:!1,regenzulage:!1},this.T={bid:Tt(38,52),durchsage:Tt(28,40),rahmen:Tt(70,100),funkloch:Tt(110,170),frog:Tt(160,260),trunk:Tt(120,200),numbers:Tt(80,130),police:Tt(200,300),wiperChat:0},this.S={blitzer:Tt(3e3,3800),elefant:Tt(3200,4200),landmark:Tt(1400,2e3),charge:Tt(700,1e3),banana:Tt(1100,1500),koriander:Tt(2200,2800)},this.blitzer=null,this.landmark=null,this.funkloch=0,this.policeCar=null,this.shoulderWarned=!1,this.batteryWarned=0,this.lastHugo=0,this.scenery.reset(),this.navi.reset(0),this.traffic.reset(),this.traffic.populate(0,n.speed),this.pickups.reset(),this.speech.stopAll(),this.windshield.clear(),this.windshield.setRain(0),this.windshield.setFirmware(e.wischer||0),this.windshield.onEvent=r=>this.onWiper(r),this.cockpit.clearConfetti(),this.cockpit.setElsa(!!e.elsa),this.ui.reset?.(),this.ui.jobs(this.jobs),this.bot("hugo","Der Stream l\xE4uft! Viel Spa\xDF beim Zuschauen."),this.later(1.2,()=>this.chat("Hallo Mini Adam \u2764")),this.later(2,()=>this.chat("Wohin fahren wir heute?")),this.later(3.2,()=>this.bot("james",`Startgebot: ${Ze(this.navi.bid)} \u2013 Ziel: ${this.navi.target.name}`))}startDemo(){this.running=!1,this.over=null,this.demoT=0,this.player.reset({}),this.player.x=1.875,this.player.speed=118*tc,this.weather={level:0,target:0,active:!1,dur:0,cool:0,announced:!1,regenzulage:!1},this.left={open:!1,timer:0,glow:0},this.sirenLevel=0,this.windshield.setRain(0),this.windshield.clear(),this.scenery.reset(),this.navi.reset(0),this.traffic.reset(),this.traffic.populate(0,this.player.speed),this.pickups.reset()}demo(t,e){this.demoT+=t;let n=this.player;n.update(t,e,{wet:0}),n.battery=100,n.hits=0,this.navi.update(t,n.s),this.navi.arrived&&this.navi.overbid(n.s,"Demo"),this.traffic.update(t,this.demoT,n,{difficulty:.15,leftOpen:!1,rain:0})}later(t,e){this.queue.push({at:this.t+t,fn:e})}chat(t,e=ns(),n={}){this.ui.chat&&this.ui.chat({name:e,text:Md(t),...n})}bot(t,e){let n=$l[t];this.ui.chat({name:n.name,text:e,bot:t,icon:n.icon})}burst(t,e=3,n=2.5){let s=typeof t=="function"?null:t;for(let r=0;r<e;r++)this.later(Tt(.1,n),()=>this.chat(s?ee(s):t()))}say(t,e="talk",{priority:n=!0}={}){this.audio.nomiChime();let s=this.cockpit.nomi;s.setMood(e,3.2);let r=()=>{let o=this.speech.say(t,"board",{priority:n,onStart:a=>s.speak(a)});this.ui.nomi(t,o+.8)};this.running?this.later(.35,r):r()}earn(t,e,{mult:n=!0,silent:s=!1}={}){if(t<=0)return 0;let r=n&&this.weather.regenzulage?1.5:1,o=t*r;return this.money+=o,this.breakdown[e]=(this.breakdown[e]||0)+o,s||this.ui.money(o,e),o}fine(t,e){let n=Math.min(this.money,t);this.money-=n,this.breakdown[e]=(this.breakdown[e]||0)-n,this.stats.fines+=n,n>0&&this.ui.money(-n,e),this.audio.bad()}donate(t,e,n){let s=this.earn(e*(this.up.starlink?1.2:1),"Spenden",{silent:!0});this.bot("james",`${t} hat ${Ze(e)} ${n?"f\xFCr \xBB"+n+"\xAB ":""}gespendet!`),this.ui.money(s,"Spende"),this.audio.pling();let r=O0(e);return r&&this.later(.6,()=>this.chat(r+(e>=33?" \u{1F631}":""))),this.hype+=s*2,s}update(t,e,n){if(!this.running)return;this.t+=t;let s=this.player,r=this.stats,o=this.weather;if(this.queue.length){let h=this.t,u=this.queue.filter(d=>d.at<=h);if(u.length){this.queue=this.queue.filter(d=>d.at>h);for(let d of u)d.fn()}}let a=s.s;s.update(t,e,{wet:o.level});let l=s.s-a;for(let h of s.events)h.type==="rail"&&(this.audio.scrape(),this.fx.shake(h.hard?.5:.2),h.hard&&ge(.4)&&this.chat(ee(["Leitplanke! \u{1F62C}","Uff, die Leitplanke","Kratz kratz"])));r.distance=s.s,r.maxSpeedKmh=Math.max(r.maxSpeedKmh,s.kmh),r.cleanDistance+=l,o.level>.3&&(r.rainDistance+=l),this.clock+=t*.5,this.megafonCd=Math.max(0,this.megafonCd-t),e.device&&(this.device=e.device),e.horn&&this.honk(),e.wiper&&this.manualWiper(),e.megafon&&this.useMegafon();let c=this.traffic.update(t,this.t,s,{difficulty:Jt(s.s/16e3,0,1),leftOpen:this.left.open,rain:o.level});for(let h of c)h.type==="crash"?this.onCrash(h):h.type==="nearMiss"?this.onNearMiss(h):h.type==="passPolice"&&this.chat(ee(["Polizei \xFCberholt?! Mutig! \u{1F605}","Tsch\xFCss Polizei Gifhorn \u{1F44B}","Das gibt einen Eintrag ins Fahrtenbuch"]));this.over||(this.sirenLevel=0,this.policeCar&&(this.traffic.cars.includes(this.policeCar)?this.sirenLevel=Jt(1-Math.abs(this.policeCar.s-s.s)/260,0,1):this.policeCar=null),this.updateLeftLane(t),this.updateWeather(t,l),this.updateNavi(t),this.updateEvents(t,n),this.updatePickups(t,n),this.updateViewers(t),this.updateChat(t),this.updateJobs(),s.shoulderTime>1.2&&!this.shoulderWarned&&(this.shoulderWarned=!0,this.say(ai.shoulder,"worried"),this.burst(Se.shoulder,2,1.5)),s.shoulderTime>4.5&&(s.shoulderTime=0,this.fine(10,"Verwarngeld"),this.ui.toast("\u{1F693} Standstreifen: 10\xA0\u20AC Verwarngeld","bad"),this.callPolice("STANDSTREIFEN? NEIN!")),s.shoulderTime<=0&&(this.shoulderWarned=!1),s.battery>30?this.batteryWarned=0:s.battery>12&&this.batteryWarned>1&&(this.batteryWarned=1),s.battery<20&&this.batteryWarned<1&&(this.batteryWarned=1,this.say(ai.lowBattery,"worried"),this.chat(ee(["Akku! \u{1F50B}","Wo ist der n\xE4chste Supercharger?","Lade-Ringe einsammeln!"]))),s.battery<7&&this.batteryWarned<2&&(this.batteryWarned=2,this.say(ai.veryLowBattery,"worried")),s.empty&&s.speed<1.5&&this.end("akku"))}updateLeftLane(t){let e=this.left,n=this.player;if(!e.open)e.next-=t,e.next<=0&&this.openLeftLane();else{if(e.timer-=t,n.inLeftLane){let s=1.25*(.45+.55*Jt(n.speed/50,0,1.3))*e.bonusMul,r=this.earn(s*t,"Linke Spur",{silent:!0});e.earned+=r,this.leftTick+=r,this.stats.leftLaneTime+=t,this.leftTick>=1&&(this.ui.money(this.leftTick,"Linke Spur"),this.leftTick=0)}e.timer<=10&&!e.warned&&(e.warned=!0,this.ui.banner("\u23F3 Linke Spur: noch 10 Sekunden",2.5)),e.timer<=0&&this.closeLeftLane()}e.glow=Hn(e.glow,e.open?1:0,3,t),e.grace=Math.max(0,e.grace-t),!e.open&&n.inLeftLane&&e.grace<=0?(e.rg+=t,e.rg>7&&!e.rgWarned&&(e.rgWarned=!0,this.ui.toast("\u26A0\uFE0F Rechtsfahrgebot! Die linke Spur ist gesperrt.","bad"),this.callPolice("BITTE RECHTS FAHREN"),this.burst(["Rechts fahren! \u{1F605}","Rechtsfahrgebot!","Polizei Gifhorn kommt\u2026"],2,1.5)),e.rg>15&&(e.rg=0,e.rgWarned=!1,this.fine(10,"Verwarngeld"),this.ui.toast("\u{1F693} Rechtsfahrgebot missachtet: 10\xA0\u20AC Verwarngeld","bad"))):(e.rg=Math.max(0,e.rg-t*2),e.rg<=0&&(e.rgWarned=!1))}openLeftLane(){let t=this.left;t.open=!0,t.timer=60,t.warned=!1;let e=ns();this.say(ai.leftLane,"happy"),this.audio.chime(),this.later(.2,()=>this.donate(e,ee([3.33,5,2.5,10,4.2]),"Linke Spur freischalten")),this.burst(Se.leftLane,3,3),this.ui.banner("\u2B05\uFE0F Linke Spur freigeschaltet!",4,"Eine Minute Bonusguthaben auf der ganz linken Spur"),this.hype+=40}closeLeftLane(){let t=this.left;t.open=!1,t.next=Tt(45,70)*t.freq,t.grace=5,this.say(ai.leftLaneEnd,"idle"),t.earned>.5&&this.ui.toast(`\u2B05\uFE0F Linke Spur: ${Ze(t.earned)} Bonusguthaben`,"good"),t.earned=0,this.burst(Se.leftLaneEnd,2,2.5)}updateWeather(t,e){let n=this.weather,s=this.player;if(n.active)n.dur-=t,n.dur<=0&&(n.active=!1,n.target=0,n.cool=Tt(60,100),this.later(8,()=>this.chat(ee(["Endlich trocken \u2600\uFE0F","Regen vorbei!","Der Wischer hat sich erholt"]))));else{n.cool-=t;let o=s.s>=4e3&&this.stats.cleanDistance>=2500;n.cool<=0&&(o||s.s>=7500)&&(n.active=!0,n.target=Tt(.6,1),n.dur=Tt(95,150),n.announced=!1)}let r=n.target>n.level?.07:.05;n.level+=Jt(n.target-n.level,-r*t,r*t),n.active&&!n.announced&&n.level>.12&&(n.announced=!0,this.say(ai.rain,"worried"),this.burst(Se.rainStart,3,4),this.later(4,()=>this.ui.banner("\u{1F327}\uFE0F Regenzulage!",4,"Solange es regnet, gibt es 1,5-fach Guthaben")),this.audio.whoosh()),n.regenzulage=n.level>.3,this.windshield.setRain(n.level)}onWiper(t){t==="twitch"?(this.audio.wiperTwitch(),this.stats.twitches++):(this.audio.wiperSweep(),this.stats.wipes++),this.running&&t==="twitch"&&this.T.wiperChat<=0&&this.weather.level>.2&&ge(.3)&&(this.T.wiperChat=14,this.chat(ee(Se.wiper)))}manualWiper(){let t=this.windshield.manual();t==="wipe"?this.ui.toast("\u{1F327}\uFE0F Wisch! Klare Sicht.","info"):t==="twitch"&&(this.ui.toast("\u{1F327}\uFE0F Der Wischer zuckt nur \u2026","info"),ge(.4)&&this.chat(ee(Se.wiper)))}updateNavi(t){let e=this.player;if(this.T.bid<=0)if(this.T.bid=Tt(36,72),ge(.16)){let n=ns();this.navi.bid=Math.round((this.navi.bid+.01)*100)/100,this.bot("james",`${n} bietet ${Ze(this.navi.bid)} \u2013 neues Ziel: Siegen`),this.chat(ee(["SIEGEN!","Siegen? \u{1F440}","Diesmal Siegen!"])),this.later(2.2,()=>this.changeNavi(!0))}else this.changeNavi(!1);for(let n of this.navi.update(t,e.s))n.type==="wendeIgnored"?(this.say("Route wird neu berechnet.","think",{priority:!1}),ge(.6)&&this.chat(ee(["Wenden auf der Autobahn? \u{1F602}","Bitte wenden\u2026 nein!","Das Navi gibt nicht auf"]))):n.type==="arrived"&&this.onArrive(n)}changeNavi(t){let e=this.player,n=ns(),s=this.navi.overbid(e.s,n);this.scenery.relabelGantries(),this.stats.naviChanges++,this.bot("james",`${n} bietet ${Ze(this.navi.bid)} \u2013 neues Ziel: ${s.name}`),t&&this.later(.8,()=>this.chat(ee(["Siegen wurde \xFCberboten. Wie immer \u{1F602}","Nicht schon wieder Siegen verpasst","Klassiker"]))),this.say(ai.naviChanged,"think"),this.audio.naviAlert(),this.burst(Se.naviChanged,2,3),s.special==="siegen"&&this.later(1.4,()=>this.chat("SIEGEN SETZT SICH DURCH?! \u{1F631}")),this.navi.wende&&this.later(3.5,()=>this.ui.toast("\u21A9\uFE0F Navi: \u201EBitte wenden\u201C \u2013 auf der Autobahn?","info")),this.ui.toast(`\u{1F4CD} Neues Navi-Ziel: ${s.name} (${hn(this.navi.km,1)} km)`,"info",s.note),this.hype+=25}onArrive(t){let e=this.player,n=t.target;this.stats.naviReached++;let s=Math.round(20+t.km*14);switch(n.special==="siegen"&&(s*=2),this.say(ai.arrived,"love"),this.audio.jingle(),this.earn(s,"Navi-Ziele"),this.ui.banner(`\u{1F3C1} Ziel erreicht: ${n.name}`,4),this.burst(Se.naviReached,4,3),this.hype+=120,this.up.konfetti&&(this.cockpit.addConfetti(70),this.audio.confetti(),this.later(1,()=>this.chat("KONFETTI! \u{1F389}"))),n.special){case"charger":e.charge(35),this.ui.toast("\u{1F50C} Schnell geladen: +35 % Akku","good"),this.stats.charges++;break;case"gifhorn":this.later(1.5,()=>this.callPolice("GIFHORN GR\xDCSST!"));break;case"brunnen":this.later(1.2,()=>this.speech.say("Ein sehr sch\xF6ner Brunnen. Vielen Dank.","schoennbrun")),this.audio.brunnenJingle(),this.burst(Se.brunnen,3,2);break;case"elsa":this.burst(Se.elsa,3,2);break;case"propper":this.later(4.5,()=>this.say("Meister Propper ist leider noch nicht da.","worried",{priority:!1})),this.later(6,()=>this.chat(ee(["Wie immer \u{1F602}","Er ist bestimmt gleich da","F\xFCnf Minuten noch!"])));break;case"malte":this.burst(["Malte Malte Malte Malte","MALTE!","MaLTE","Malte ist eingestiegen \u2714\uFE0F"],5,3);break;case"siegen":this.burst(["SIEGEN!!! Es ist tats\xE4chlich passiert \u{1F631}","Geschichte wurde geschrieben","Doppelter Bonus f\xFCr Siegen!"],3,2);break;case"sparkasse":this.later(1.5,()=>this.ui.chat({name:"Wissenschaftlicher Dienst",text:`\u{1F52C} Ergebnis: Die Sparkasse ist ${this.navi.sparkColor}.`,bot:"claudia",icon:"\u{1F52C}"}));break;case"pommes":this.earn(10,"Navi-Ziele"),this.burst(["Pommes ohne R\xFCckfragen \u{1F35F}","Mit Mayo!","Keine R\xFCckfragen!"],3,2);break;case"bude":this.burst(["Diesmal die richtige Bude! \u{1F32D}","Falsche Bude? \u{1F602}","Currywurst!"],3,2);break;default:break}this.T.bid=Math.min(this.T.bid,Tt(6,10))}updateEvents(t,e){let n=this.player,s=this.T;for(let o of Object.keys(s))s[o]-=t;if(s.durchsage<=0){s.durchsage=Tt(48,85);let o=this.weather.level>.3&&ge(.5)?G0:z0,a=ee(o),l=Md(a.text),c=ns();this.donate(c,3,"Sprachdurchsage"),this.later(1.2,()=>{let h=this.speech.say(l,a.voice);this.ui.durchsage(ir[a.voice].label,l,h+1,c)})}if(s.rahmen<=0&&n.s>1e3){s.rahmen=Tt(75,130);let o=ee(V0),a=ns();this.donate(a,o.price,o.name),this.ui.rahmen(o,a),this.later(2,()=>this.chat(ee(Se.rahmen)))}if(this.funkloch>0&&(this.funkloch-=t,this.funkloch<=0&&(this.ui.funkloch(!1),this.burst(Se.funklochBack,3,1.5),this.later(1.2,()=>this.bot("nora","Verbindung zum Streaming-Server steht wieder. Weiter geht\u2019s!")))),s.funkloch<=0&&n.s>1500&&(s.funkloch=Tt(120,220),this.up.starlink?ge(.5)&&this.chat(ee(["Starlink sei Dank: kein Funkloch \u{1F6F0}\uFE0F","Bild bleibt stabil \u2714\uFE0F","Starlink \u{1F525}"])):(this.funkloch=Tt(2.2,3.2),this.fx.glitch(this.funkloch),this.ui.funkloch(!0),this.burst(Se.funkloch,5,1.6),ge(.5)&&this.later(.5,()=>this.say(ai.funkloch,"worried",{priority:!1})))),s.frog<=0&&(s.frog=Tt(170,300),this.fx.green(1.4),this.burst(Se.frog,4,1.5)),s.trunk<=0&&n.s>2e3){s.trunk=Tt(140,220);let o=ns();this.donate(o,5,"Kofferraum \xF6ffnen"),this.fx.trunk(7),this.burst(Se.trunk,3,2.5)}if(s.numbers<=0){s.numbers=Tt(90,150),this.bot("claudia","Kanalpunkte-Aktion: Mini Adam m\xF6chte eine Zahl im Chat sehen!");let o=[];for(let l=0;l<Yr(6,9);l++)o.push(Se.zahl());o.forEach((l,c)=>this.later(.6+c*Tt(.2,.45),()=>this.chat(l)));let a=o.find((l,c)=>o.indexOf(l)!==c);a&&this.later(4.5,()=>this.chat(`Synchron mit ${a}! \u{1F91D}`))}if(s.police<=0&&n.s>2500&&(s.police=Tt(220,340),this.callPolice(ee(jM))),!this.blitzer&&n.s>this.S.blitzer){let o=n.s;this.blitzer={limitS:o+520,camS:o+1120,endS:o+1300,announced:!1,checked:!1},this.scenery.request("speed",this.blitzer.limitS,{limit:120}),this.scenery.request("blitzer",this.blitzer.camS),this.scenery.request("speed",this.blitzer.endS,{limit:"ende"})}if(this.blitzer){let o=this.blitzer;if(!o.announced&&n.s>o.limitS-180&&(o.announced=!0,this.say(ai.blitzer,"wink")),!o.checked&&n.s>o.camS)if(o.checked=!0,n.kmh>126){this.fx.flash(1),this.audio.flash(),this.scenery.flashBlitzer(!0),this.later(.15,()=>this.scenery.flashBlitzer(!1)),this.stats.photos++;let a=Math.round(n.kmh),l=Zr(this.clock);this.later(.6,()=>{this.fine(15,"Bu\xDFgeld"),this.ui.photo(a,l)}),this.burst(Se.blitzer,3,2),this.cockpit.nomi.setMood("surprised",2)}else this.stats.blitzerClean++,this.earn(5,"Vorbildlich"),this.ui.toast("\u{1F4F8} Nicht geblitzt \u2013 vorbildlich!","good");n.s>o.endS+50&&(this.blitzer=null,this.S.blitzer=n.s+Tt(2600,4200))}if(n.s>this.S.elefant&&(this.S.elefant=n.s+Tt(3200,5200),this.traffic.elefantenrennen(n.s),this.say(ai.elefant,"worried",{priority:!1}),this.later(3,()=>this.burst(Se.elefant,3,3))),!this.landmark&&n.s>this.S.landmark){let o=ge(.55)?"brunnen":"elsa",a=this.scenery.landmarkSpot(n.s+1500);this.landmark={type:o,s:a,seen:!1,greeted:!1,id:this.scenery.request(o,a)}}if(this.landmark){let o=this.landmark,a=o.s-n.s,l=o.type==="elsa",c=l&&this.elsaView(o,a,e);if(!o.seen&&(l?a<c.show:a<260)){o.seen=!0,this.burst(o.type==="brunnen"?Se.brunnen:Se.elsa,3,2);let u=this.hornKey(),d=this.ui.toast(o.type==="brunnen"?`\u26F2 Ein Brunnen! Hupen f\xFCr BrunnenTV (${u})`:`\u{1F451} Elsa! Hupen zum Gr\xFC\xDFen (${u})`,"info");l&&this.elsaToast(o,d)}let h=o.toast?this.t-o.toastT:0;if(o.toast&&(!c.visible&&h>1.2||c.covered&&h>.4)&&this.elsaToast(o,null),!o.greeted&&(l?o.seen:a<220)&&a>-40&&this.t-this.lastHorn<.3){if(o.greeted=!0,o.type==="brunnen")this.earn(10,"BrunnenTV"),this.audio.brunnenJingle(),this.later(.5,()=>this.speech.say("Ein sehr sch\xF6ner Brunnen.","schoennbrun")),this.ui.toast("\u26F2 BrunnenTV-Bonus!","good");else{this.earn(10,"Elsa-Gru\xDF"),this.cockpit.nomi.setMood("love",2.5),this.scenery.waveBack(o.id),this.elsaToast(o,null);let u=this.ui.toast(c.visible?"\u{1F451} Elsa winkt zur\xFCck!":"\u{1F451} Elsa winkt dir hinterher!","good");c.visible&&this.elsaToast(o,u)}this.hype+=60}a<-80&&(this.landmark=null,this.S.landmark=n.s+Tt(2400,3800))}let r=Math.floor(this.clock/60)%24;r!==this.lastHugo&&this.t>5&&(this.lastHugo=r,r===21?this.bot("hugo","21 Uhr: Ortsspenden-Schluss! \u2026 Verl\xE4ngerung um 5 Minuten \u{1F609}"):r===22?this.bot("hugo","Eigentlich w\xE4re jetzt Sendeschluss. Wir fahren einfach weiter!"):r>=19?this.bot("hugo",`Es ist ${r} Uhr. Sendezeit l\xE4uft.`):r===0?this.bot("hugo","Mitternacht! Der Stream l\xE4uft einfach weiter. \u{1F319}"):r<6&&this.bot("hugo",`Es ist ${r} Uhr nachts. Sendezeit l\xE4uft immer noch.`))}elsaView(t,e,n){let s=this.player,{x:r,scale:o}=this.scenery.placed(t.id)||Il,a=r-(s.x+yd.x),l=e>0&&Math.atan2(a,e)-s.yaw<J0,c=(n?.fov||58)*Math.PI/180,h=4.3*o/(.08*Math.tan(c/2)),u=Math.min(175,Math.max(h,a/Math.tan(J0)+s.speed*1.5)),d=!1,f=t.toast&&n&&e>0?t.toast.el.getBoundingClientRect():null;if(f&&f.width>0){let m=window.innerWidth,v=window.innerHeight,g=(I,T)=>{let S=Up(QM.set(r+I*o,T*o,-e)).project(n);return[(S.x+1)/2*m,(1-S.y)/2*v]},[p,x]=g(-ic.half,ic.top),[_,y]=g(ic.half,ic.chin);d=p<f.right+6&&_>f.left-6&&x<f.bottom+6&&y>f.top-6}return{visible:l,show:u,covered:d}}hornKey(){return this.device==="touch"?"\u{1F4EF}":this.device==="gamepad"?"A":"Leertaste"}elsaToast(t,e){t.toast&&t.toast!==e&&t.toast.drop?.(),t.toast=e,t.toastT=this.t}callPolice(t){this.policeCar||(this.policeCar=this.traffic.police(this.player.s,t),this.burst(Se.police,3,2.5),this.later(1,()=>this.cockpit.nomi.setMood("worried",2.5)))}updatePickups(t,e){let n=this.player,s=this.S;n.s>s.charge&&(s.charge=n.s+Tt(900,1500),this.pickups.spawnAhead("charge",n.s,this.traffic)),n.s>s.banana&&(s.banana=n.s+Tt(1200,1900),this.pickups.spawnAhead("banana",n.s,this.traffic)),n.s>s.koriander&&(s.koriander=n.s+Tt(1300,2300),this.pickups.spawnAhead("koriander",n.s,this.traffic));for(let r of this.pickups.update(t,this.t,n,e))r.type==="charge"?(n.charge(12),this.stats.charges++,this.audio.chime(),this.ui.toast("\u26A1 Lade-Ring: +12 % Akku","good")):r.type==="banana"?(this.stats.bananas++,n.sugar=6,this.audio.coin(),this.earn(15,"Bananensaft"),this.ui.toast("\u{1F34C} Bananensaft! Zuckerschub","good"),ge(.7)&&this.chat(ee(Se.banana))):(this.stats.koriander++,n.wobble=2.2,this.fine(5,"Koriander"),this.ui.toast("\u{1F33F} Koriander \u2026 b\xE4h!","bad"),this.cockpit.nomi.setMood("dizzy",2.5),this.burst(Se.koriander,2,1.5))}updateViewers(t){let e=this.player,n=e.s/1e3;this.hype*=Math.exp(-t*.04);let s=220+95*n+25*Math.sin(this.t/23)+this.hype;this.up.starlink&&(s*=1.25),this.funkloch>0&&(s*=.8),this.viewers=Hn(this.viewers,s,.4,t),this.peakViewers=Math.max(this.peakViewers,this.viewers),this.stats.maxViewers=this.peakViewers;let r=Math.max(500,this.save.best.viewers||0);if(!this.recordShown&&this.viewers>r&&e.s>1500&&(this.recordShown=!0,this.bot("victoria",`Neuer Zuschauerrekord: ${hn(Math.round(this.viewers))} Zuschauer!`),this.audio.record(),this.burst(Se.record,4,2.5),this.ui.banner("\u{1F3C6} Neuer Zuschauerrekord!",3.5),this.up.konfetti&&this.cockpit.addConfetti(30)),this.donationT-=t,this.donationT<=0){this.donationT=Tt(8,17)*Jt(500/Math.max(this.viewers,1),.5,1.5);let o=ns(),a=Y0(1,22);this.donate(o,a),ge(.35)&&this.later(.9,()=>this.chat(ee(["Danke!","Ehrenmensch \u{1F64F}","Bimmel hurra!","F\xFCnftel-Alter","\u2764"])))}}updateChat(t){this.chatT-=t,this.chatT<=0&&(this.chatT=Tt(1.3,3.4)*Jt(600/Math.max(this.viewers,1),.6,1.4),this.chat(ee(Se.ambient)))}updateJobs(){let t=this.stats,e=!1;for(let n of this.jobs){if(n.done)continue;let s=t[n.stat]||0,r=Jt(s/n.goal,0,1);Math.abs(r-n.progress)>.01&&(n.progress=r,e=!0),s>=n.goal-.5&&(n.done=!0,n.progress=1,e=!0,this.earn(25,"Jobs",{mult:!1}),this.ui.toast(`\u2705 Job erledigt: ${n.text}`,"good"),this.audio.chime(),this.chat(ee(Se.fiveJobs)))}e&&this.ui.jobs(this.jobs),!this.allJobsPaid&&this.jobs.every(n=>n.done)&&(this.allJobsPaid=!0,this.earn(100,"Jobs",{mult:!1}),this.bot("victoria","You had 5 Jobs \u2013 und alle erledigt! 100\xA0\u20AC Bonus!"),this.audio.record(),this.ui.banner("\u{1F3C6} Alle 5 Jobs erledigt!",4))}honk(){this.audio.horn(),this.lastHorn=this.t,ge(.12)&&this.chat(ee(["Bimmel hurra! \u{1F4EF}","HUP HUP","Hupkonzert!"]))}useMegafon(){if(!this.up.megafon){this.ui.toast("\u{1F4E2} Das Megafon gibt es im Tesla-Shop","info");return}if(this.megafonCd>0){this.ui.toast(`\u{1F4E2} Megafon l\xE4dt noch (${Math.ceil(this.megafonCd)} s)`,"info");return}this.megafonCd=15,this.audio.megafon();let t=this.traffic.megafon(this.player);this.speech.say("Achtung, Achtung! Bitte machen Sie die Spur frei!","william"),this.ui.toast(t?`\u{1F4E2} ${t} Fahrzeug${t>1?"e machen":" macht"} Platz`:"\u{1F4E2} Durchsage!","info"),this.chat(ee(["Wie in Gifhorn \u{1F4E2}","MEGAFON \u{1F602}","Platz da!"]))}onCrash(t){let e=this.player;if(!e.collide(t))return;this.stats.crashes++,this.stats.cleanDistance=0,this.audio.crash(),this.fx.shake(1),this.cockpit.nomi.setMood("dizzy",3);let n=e.maxHits-e.hits;if(this.ui.damage(e.hits,e.maxHits),t.car.behavior==="polizei"&&this.chat("Ausgerechnet die Polizei Gifhorn \u{1F631}"),this.burst(Se.crash,3,2),n<=0){this.end("werkstatt");return}this.ui.toast(n===1?"\u{1F9F8} Rempler! Nur noch ein Karosserie-Punkt!":`\u{1F9F8} Rempler! Noch ${n} Karosserie-Punkte`,"bad")}onNearMiss(t){this.stats.nearMisses++,this.earn(3,"Haarscharf"),this.hype+=15,ge(.5)&&this.chat(ee(Se.nearMiss))}end(t){if(this.over)return;this.running=!1;let e=this.player,n=e.s/1e3;this.over={reason:t,distance:e.s,money:Math.max(0,Math.round(this.money*100)/100),breakdown:{...this.breakdown},jobs:this.jobs.map(s=>({text:s.text,done:s.done})),stats:{...this.stats},peakViewers:Math.round(this.peakViewers),beruf:W0(n),time:this.t,clock:Zr(this.clock),naviHistory:this.navi.history.slice(-5)},this.speech.stopAll(),t==="akku"?this.say("Akku leer. Die Stream-Technik verabschiedet sich.","sleep"):t==="werkstatt"&&this.say("Bitte einen Werkstatttermin vereinbaren.","dizzy")}screenState(){let t=this.player,e=this.weather,n=this.blitzer&&t.s>this.blitzer.limitS&&t.s<this.blitzer.endS?120:null;return{dark:e.level>.45,battery:t.battery,speedKmh:t.kmh,limit:n,playerX:t.x,leftLane:this.left.open?this.left.timer:0,cars:this.traffic.nearby(t,125),s:t.s,navi:this.navi.screen(t.s,this.clock,t.speed),clock:Zr(this.clock),temp:Math.round(17-e.level*6),funkloch:this.funkloch>0?1:0,wiperOn:e.level>.05}}};var Sd=.4;function Td(i,t,e){let n=document.createElement("canvas");n.width=i,n.height=t,e(n.getContext("2d"),i,t);let s=new Ce(n);return s.colorSpace=ce,s.anisotropy=4,s}function tb(){return Td(256,384,(i,t,e)=>{i.translate(t/2,0),i.beginPath(),i.moveTo(-26,40),i.lineTo(26,40),i.lineTo(26,92),i.quadraticCurveTo(84,120,84,180),i.lineTo(84,340),i.quadraticCurveTo(84,370,54,370),i.lineTo(-54,370),i.quadraticCurveTo(-84,370,-84,340),i.lineTo(-84,180),i.quadraticCurveTo(-84,120,-26,92),i.closePath(),i.fillStyle="rgba(255,255,255,0.9)",i.fill(),i.lineWidth=8,i.strokeStyle="#3a2a10",i.stroke(),i.save(),i.clip();let n=i.createLinearGradient(-84,0,84,0);n.addColorStop(0,"#f2c419"),n.addColorStop(.5,"#ffe45c"),n.addColorStop(1,"#e8b30e"),i.fillStyle=n,i.fillRect(-90,150,180,230),i.restore(),i.fillStyle="#2e7d32",ze(i,-32,14,64,32,8),i.fill(),i.fillStyle="#ffffff",ze(i,-70,205,140,110,14),i.fill(),i.strokeStyle="#3a2a10",i.lineWidth=5,i.stroke(),i.beginPath(),i.moveTo(-44,228),i.quadraticCurveTo(-30,292,46,270),i.quadraticCurveTo(-6,270,-26,226),i.closePath(),i.fillStyle="#ffd21f",i.fill(),i.strokeStyle="#6b4a00",i.lineWidth=4,i.stroke(),i.fillStyle="#3a2a10",i.font="bold 22px Arial, sans-serif",i.textAlign="center",i.fillText("BANANENSAFT",0,306,124),i.fillStyle="rgba(255,255,255,0.55)",ze(i,-70,140,14,190,7),i.fill()})}function eb(){return Td(320,320,(i,t,e)=>{i.translate(t/2,e/2+30),i.strokeStyle="#4f8a2b",i.lineWidth=7,i.lineCap="round";let n=[];for(let r=0;r<7;r++){let o=-Math.PI/2+(r-3)*.32,a=95+r%3*18,l=Math.cos(o)*a,c=Math.sin(o)*a;i.beginPath(),i.moveTo(0,110),i.quadraticCurveTo(l*.3,20,l,c),i.stroke(),n.push([l,c])}let s=(r,o,a,l)=>{i.save(),i.translate(r,o),i.rotate(l),i.beginPath();for(let c=0;c<=12;c++){let h=c/12*Math.PI*2,u=a*(c%2?.62:1);i.lineTo(Math.cos(h)*u,Math.sin(h)*u*.9)}i.closePath(),i.fillStyle="#3f9b2f",i.fill(),i.strokeStyle="#215c18",i.lineWidth=4,i.stroke(),i.restore()};n.forEach(([r,o],a)=>{s(r,o,34,a),s(r*.7+18,o*.7,22,a+1)}),i.fillStyle="#c62828",ze(i,-46,82,92,34,8),i.fill(),i.fillStyle="#fff",i.font="bold 20px Arial, sans-serif",i.textAlign="center",i.fillText("KORIANDER",0,106)})}function nb(){let t=document.createElement("canvas");t.width=128,t.height=128;let e=t.getContext("2d"),n=e.createImageData(128,128),s=(o,a,l)=>{let c=Math.min(1,Math.max(0,(l-o)/(a-o)));return c*c*(3-2*c)};for(let o=0;o<128;o++){let a=1-(o+.5)/128,l=s(.2,.45,a);for(let c=0;c<128;c++){let h=Math.hypot((c+.5)/128-.5,a-.5)*2,u=h<.5?1-1.2*h:Math.max(0,.4*(1-(h-.5)/.5)),d=(o*128+c)*4;n.data[d]=n.data[d+1]=n.data[d+2]=255,n.data[d+3]=Math.round(255*u*l)}}e.putImageData(n,0,0);let r=new Ce(t);return r.colorSpace=ce,r}function ib(){return Td(256,256,(i,t,e)=>{i.translate(t/2,e/2),i.beginPath(),i.moveTo(18,-110),i.lineTo(-62,14),i.lineTo(-8,14),i.lineTo(-24,110),i.lineTo(62,-22),i.lineTo(8,-22),i.closePath(),i.fillStyle="#eaffef",i.shadowColor="#4dff9a",i.shadowBlur=24,i.fill(),i.shadowBlur=0,i.lineWidth=6,i.strokeStyle="#1faa5a",i.stroke()})}var rc=class{constructor(t){this.group=new wt,this.group.name="Pickups",t.add(this.group),this.items=[],this.pool={charge:[],banana:[],koriander:[]};let e=nb(),n={polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:4};this.mats={ring:lt.basic({color:new Dt(.25,2.2,.9),toneMapped:!0}),bolt:lt.basic({map:ib(),transparent:!0,depthWrite:!1,side:he}),bottle:lt.basic({map:tb(),transparent:!0,alphaTest:.05,side:he}),koriander:lt.basic({map:eb(),transparent:!0,alphaTest:.05,side:he}),glowG:lt.basic({...n,map:e,color:5635993,transparent:!0,depthWrite:!1,blending:xs,opacity:.8}),glowY:lt.basic({...n,map:e,color:16765773,transparent:!0,depthWrite:!1,blending:xs,opacity:.6}),glowR:lt.basic({...n,map:e,color:16736320,transparent:!0,depthWrite:!1,blending:xs,opacity:.35})},this.geo={ring:new Vn(.95,.09,10,40),plane:new fe(1,1)}}make(t){let e=new wt,n=this.mats;if(t==="charge"){let s=new D(this.geo.ring,n.ring);s.position.y=1.15;let r=new D(this.geo.plane,n.bolt);r.scale.setScalar(1.1),r.position.y=1.15;let o=new D(this.geo.plane,n.glowG);o.scale.setScalar(3.2),o.position.y=1.15,e.add(o,s,r),e.userData.spin=s,e.userData.face=[r,o]}else if(t==="banana"){let s=new D(this.geo.plane,n.bottle);s.scale.set(.95,1.42,1),s.position.y=.95;let r=new D(this.geo.plane,n.glowY);r.scale.setScalar(2.6),r.position.y=.95,e.add(r,s),e.userData.face=[s,r]}else{let s=new D(this.geo.plane,n.koriander);s.scale.setScalar(1.35),s.position.y=.85;let r=new D(this.geo.plane,n.glowR);r.scale.setScalar(2.4),r.position.y=.85,e.add(r,s),e.userData.face=[s,r]}return this.group.add(e),e}spawn(t,e,n){let s=this.pool[t],r=s.find(a=>!a.userData.inUse);r||(r=this.make(t),s.push(r)),r.userData.inUse=!0,r.visible=!0,r.scale.setScalar(1);let o={type:t,s:e,x:bt.laneCenter(n),lane:n,obj:r,taken:!1,fade:0,ahead:0,phase:Math.random()*6};return this.items.push(o),o}spawnAhead(t,e,n,s=650){let r=e+s+Tt(0,120),o=[0,1,2,3].filter(a=>n.laneFree(a,r,26));return o.length?this.spawn(t,r,ee(o)):null}reset(){for(let t of this.items)t.obj.visible=!1,t.obj.userData.inUse=!1;this.items=[]}update(t,e,n,s,r=!0){let o=[],a=[];for(let l of this.items){if(!l.taken&&r&&Math.abs(l.s-n.s)<2.7&&Math.abs(l.x-n.x)<1.55?(l.taken=!0,l.from=l.s-n.s,l.ahead=Math.max(l.from,2.5),Math.abs(l.x-n.x)<1&&(l.from=l.ahead),o.push(l)):l.taken&&(l.fade+=t),l.taken){let m=Math.min(1,l.fade/Sd);l.s=n.s+Qt(l.from,l.ahead,xn(0,.4,m))+1.2*m}let c=l.s-n.s;if(c<-30||l.taken&&l.fade>Sd){l.obj.visible=!1,l.obj.userData.inUse=!1;continue}a.push(l);let h=l.obj,u=l.x,d=Math.sin(e*2.2+l.phase)*.08;if(l.taken){let m=Math.min(1,l.fade/Sd);u=Qt(l.x,n.x,m),d+=1.4*(1-(1-m)*(1-m)),h.scale.setScalar(Math.max(.001,(1-m)*(1+.25*Math.sin(m*Math.PI))))}h.position.set(u,d,-c),h.userData.spin&&(h.userData.spin.rotation.y=e*1.8+l.phase);let f=Math.atan2(s.position.x-u,s.position.z+c);for(let m of h.userData.face)m.rotation.y=f}return this.items=a,o}};function _t(i,t,e,n){let s=document.createElement(i);return t&&(s.className=t),n!==void 0&&(s.textContent=n),e&&e.appendChild(s),s}var sb={rosen:"\u{1F339}",pommes:"\u{1F35F}",burger:"\u{1F354}",candy:"\u{1F36C}",chips:"\u{1F954}",kuerbis:"\u{1F383}"};function rb(i){let t=i.firstElementChild;if(!t)return;let e=i.classList.contains("strip-left")||i.classList.contains("strip-right"),n=e?i.clientHeight:i.clientWidth,s=e?t.offsetHeight:t.offsetWidth;if(!n||!s)return;let r=Math.max(1,Math.floor(n/(s*1.12)));for(;i.childElementCount>r;)i.lastElementChild.remove()}var oc=class{constructor(t){this.root=t,this.hud=_t("div","hud hidden",t),this.hud.id="hud";let e=_t("div","hud-info",this.hud);this.infoEl=e;let n=_t("div","live-row",e);this.liveBadge=_t("span","live-badge",n,"\u25CF LIVE"),this.viewersEl=_t("span","viewers",n,"\u{1F441} 0"),this.timeEl=_t("span","streamtime",n,"0:00");let s=_t("div","stat-rows",e),r=(u,d)=>{let f=_t("div","stat",s);_t("span","stat-icon",f,u);let m=_t("span","stat-val",f,"");return d&&_t("span","stat-label",f,d),m};this.distEl=r("\u{1F4CF}",""),this.recordEl=_t("span","stat-sub",this.distEl.parentNode,""),this.speedEl=r("\u{1F697}",""),this.moneyRow=r("\u{1F4B6}","Guthaben");let o=this.moneyRow.parentNode;this.moneySlot=_t("span","money-slot",o),this.moneySlot.appendChild(o.querySelector(".stat-label")),this.moneyPops=_t("span","money-pops",this.moneySlot),this.batteryEl=r("\u{1F50B}",""),this.batteryBar=_t("span","battery-bar",this.batteryEl.parentNode),this.batteryFill=_t("span","battery-fill",this.batteryBar),this.damageEl=r("\u{1F9F8}",""),this.jobsEl=_t("div","jobs-mini",e),this.zulageEl=_t("div","zulage hidden",e,"\u{1F327}\uFE0F Regenzulage \xD71,5"),this.leftLaneEl=_t("div","leftlane hidden",this.hud),this.leftLaneText=_t("div","leftlane-text",this.leftLaneEl,"");let a=_t("div","leftlane-bar",this.leftLaneEl);this.leftLaneFill=_t("div","leftlane-fill",a),this.naviEl=_t("div","navi-line",this.hud),this.naviTarget=_t("span","navi-target",this.naviEl,""),this.naviKm=_t("span","navi-km",this.naviEl,""),this.naviBid=_t("span","navi-bid",this.naviEl,"");let l=_t("div","center-stack",this.hud);this.stackEl=l,this.nomiEl=_t("div","nomi-sub hidden",l);let c=_t("span","nomi-eyes",this.nomiEl);_t("i","",c),_t("i","",c),this.nomiText=_t("span","nomi-text",this.nomiEl,""),this.bannerEl=_t("div","banner hidden",l,""),this.toastsEl=_t("div","toasts",l),this.cameraHint=_t("div","camera-hint hidden",l,""),this.chatEl=_t("div","chat",this.hud);let h=_t("div","chat-head",this.chatEl);if(_t("span","",h,"Live-Chat"),this.chatCount=_t("span","chat-count",h,""),this.chatList=_t("div","chat-list",this.chatEl),this.durchsageEl=_t("div","durchsage hidden",this.hud),this.funklochEl=_t("div","funkloch hidden",this.hud),_t("div","funkloch-icon",this.funklochEl,"\u{1F4E1}"),_t("div","funkloch-text",this.funklochEl,"Verbindung verloren \u2013 Telekom, Vodafone und O\u2082 werden neu geb\xFCndelt \u2026"),this.photoEl=_t("div","photo hidden",this.hud),this.rahmenEl=_t("div","rahmen-layer",this.hud),this.chatOn=!0,this.lastHud=0,this.toasts=[],this.bannerT=0,this.nomiT=0,this.durchsageT=0,this.photoT=0,this.rahmenList=[],this.photos=[],this.moneyShown=0,typeof ResizeObserver<"u"){let u=new ResizeObserver(()=>this.layout());u.observe(e),u.observe(this.chatEl)}window.addEventListener("resize",()=>this.layout())}layout(){let t=this.infoEl.getBoundingClientRect();if(!t.width)return;let e=window.innerWidth,n=this.chatOn&&this.chatEl.getBoundingClientRect(),s=Math.max(t.right,n&&n.width?e-n.left:0)+14,r=e-2*s,o=14,a=r<240;if(a){let c=n&&n.width?n.top+(parseFloat(getComputedStyle(this.chatEl).maxHeight)||n.height):0;o=Math.max(t.bottom,c)+10,r=e-28}let l=this.hud.style;l.setProperty("--mid",Math.round(r)+"px"),l.setProperty("--top",Math.round(o)+"px"),this.hud.classList.toggle("hud-narrow",a),this.naviMax=Math.min(760,r)}funkCover(){let t=!1;if(!this.funklochEl.classList.contains("hidden")){let e=this.funklochEl.getBoundingClientRect(),n=this.stackEl.getBoundingClientRect();t=n.height>0&&e.left<n.right&&e.right>n.left&&e.top<n.bottom+6&&e.bottom>n.top-6}this.hud.classList.toggle("funk",t)}fitStack(){if(this.funkCover(),this.fitDurchsage(),!this.toasts.length)return;let t=this.stackEl.getBoundingClientRect();if(!t.height)return;let e=window.innerHeight-8;document.body.classList.contains("drone")&&(e=Math.min(e,window.innerHeight*.54));let n=[this.durchsageEl,...this.rahmenEl.querySelectorAll(".rahmen-caption"),...document.querySelectorAll(".touch button")];for(let r of n){let o=r.getBoundingClientRect();o.height&&o.top>t.top+40&&o.left<t.right&&o.right>t.left&&(e=Math.min(e,o.top-8))}let s=()=>this.stackEl.getBoundingClientRect().bottom;for(;this.toasts.length>1&&s()>e;)this.toasts.shift().el.remove();this.toastsEl.classList.toggle("squeezed",s()>e),this.fitDurchsage()}fitDurchsage(){let t=this.durchsageEl,e=!1;if(!t.classList.contains("hidden")){let n=t.getBoundingClientRect(),s=this.stackEl.getBoundingClientRect(),r=[this.nomiEl,this.bannerEl,this.toastsEl].filter(a=>!a.classList.contains("hidden")&&!a.classList.contains("squeezed")),o=Math.max(-1/0,...r.map(a=>a.getBoundingClientRect()).filter(a=>a.height).map(a=>a.bottom));e=n.height>0&&n.top>s.top+40&&n.left<s.right&&n.right>s.left&&o>n.top-4}t.classList.toggle("squeezed",e)}show(t){this.hud.classList.toggle("hidden",!t)}setChat(t){this.chatOn=t,this.chatEl.classList.toggle("hidden",!t),this.layout()}reset(){this.chatList.textContent="",this.toastsEl.textContent="",this.rahmenEl.textContent="",this.clearMoneyPop(),this.toasts=[],this.rahmenList=[],this.photos=[],this.bannerEl.classList.add("hidden"),this.nomiEl.classList.add("hidden"),this.durchsageEl.classList.add("hidden"),this.photoEl.classList.add("hidden"),this.funkloch(!1),this.bannerT=this.nomiT=this.durchsageT=this.photoT=0}chat({name:t,text:e,bot:n,icon:s}){let r=_t("div","msg"+(n?" bot bot-"+n:""),this.chatList);if(n){_t("span","bot-icon",r,s||$l[n]?.icon||"\u{1F916}");let o=_t("span","name",r,t);o.style.color="#ffd76a",r.append(" "),_t("span","bot-tag",r,"BOT")}else{let o=_t("span","name",r,t);o.style.color=F0(t)}for(r.append(" "),_t("span","text",r,e);this.chatList.childElementCount>36;)this.chatList.firstElementChild.remove();this.chatList.scrollTop=this.chatList.scrollHeight}toast(t,e="info",n=""){let s=_t("div","toast toast-"+e,this.toastsEl,t);n&&_t("div","toast-sub",s,n);let r={el:s,t:n?5:3.6,drop:()=>r.t=Math.min(r.t,0)};for(this.toasts.push(r);this.toasts.length>4;)this.toasts.shift().el.remove();return this.fitStack(),r}banner(t,e=3,n=""){this.bannerEl.textContent=t,n&&_t("div","banner-sub",this.bannerEl,n),this.bannerEl.classList.remove("hidden"),this.bannerEl.classList.remove("pop"),this.bannerEl.offsetWidth,this.bannerEl.classList.add("pop"),this.bannerT=e,this.fitStack()}nomi(t,e=3){this.nomiText.textContent=t,this.nomiEl.classList.remove("hidden"),this.nomiT=Math.max(2.2,e),this.fitStack()}money(t,e){this.moneyPops.textContent="";let n=_t("span","money-pop "+(t>=0?"plus":"minus"),this.moneyPops,(t>=0?"+":"\u2212")+Ze(Math.abs(t)));e&&(_t("small","",n,e),n.offsetWidth>this.moneySlot.clientWidth&&n.lastChild.remove()),this.moneySlot.classList.add("popping"),clearTimeout(this.moneyTimer),this.moneyTimer=setTimeout(()=>this.clearMoneyPop(),1900)}clearMoneyPop(){clearTimeout(this.moneyTimer),this.moneyPops.textContent="",this.moneySlot.classList.remove("popping")}durchsage(t,e,n,s){this.durchsageEl.textContent="";let r=_t("div","durchsage-head",this.durchsageEl,`\u{1F399}\uFE0F Sprachdurchsage von ${s} \xB7 Stimme: ${t}`);r.title=t,_t("div","durchsage-text",this.durchsageEl,"\xBB"+e+"\xAB"),this.durchsageEl.classList.remove("hidden"),this.durchsageT=Jt(n,3,14),this.fitStack()}funkloch(t){this.funklochEl.classList.toggle("hidden",!t),this.funkCover(),this.liveBadge.classList.toggle("offline",t),this.liveBadge.textContent=t?"\u25CF OFFLINE":"\u25CF LIVE"}damage(t,e){this.damageEl.parentNode.classList.remove("shake"),this.damageEl.offsetWidth,this.damageEl.parentNode.classList.add("shake")}jobs(t){this.jobsEl.textContent="",_t("span","jobs-title",this.jobsEl,"You had 5 Jobs");for(let e of t){let n=_t("div","job"+(e.done?" done":""),this.jobsEl);if(_t("span","job-box",n,e.done?"\u2714":""),_t("span","job-text",n,e.text),!e.done&&e.progress>0){let s=_t("span","job-bar",n);_t("span","job-fill",s).style.width=Math.round(e.progress*100)+"%"}}}rahmen(t,e){let n=_t("div","rahmen rahmen-"+t.id,this.rahmenEl),s=_t("div","rahmen-caption",n,`${t.name} \xB7 ${Ze(t.price)} von ${e}`);s.title=t.name;let r=sb[t.id];if(r){for(let a of["top","bottom","left","right"]){let l=_t("div","strip strip-"+a,n);for(let c=0;c<22;c++)_t("span","",l,r)}t.id==="kuerbis"&&n.classList.add("corner-only")}else if(t.id==="pappkarton"){let o=_t("div","boxes",n);for(let a=0;a<26;a++){let l=_t("span","box",o,"");l.style.left=a%13*7.8+(a>=13?3.5:0)+"%",l.style.bottom=(a>=13?11:0)+Math.random()*2+"%",l.style.transform=`rotate(${(Math.random()-.5)*16}deg)`,l.style.animationDelay=(a*.05).toFixed(2)+"s"}}else if(t.id==="haelfte"){let o=Math.random()<.5?"left":"right";_t("div","half half-"+o,n,"Bildh\xE4lfte abgedeckt")}else if(t.id==="elsa")_t("div","elsa-fly",n,"");else if(t.id==="lego")for(let o of["top","bottom","left","right"]){let a=_t("div","strip lego strip-"+o,n);for(let l=0;l<18;l++)_t("span","brick b"+l%4,a,"")}else if(t.id==="briefmarken")_t("div","stamp-frame",n,"");else if(t.id==="keinerechte")for(let o of["top","bottom","left","right"]){let a=_t("div","strip norights strip-"+o,n),l=o==="top"||o==="bottom"?6:3;for(let c=0;c<l;c++)_t("span","",a,"\xA9 Keine Rechte")}else if(t.id==="rettich")for(let o of["top","bottom","left","right"]){let a=_t("div","strip strip-"+o,n);for(let l=0;l<16;l++)_t("span","rettich",a,"")}if(!n.classList.contains("corner-only"))for(let o of n.querySelectorAll(".strip:not(.lego)"))rb(o);this.rahmenList.push({el:n,t:t.dur}),this.fitStack()}photo(t,e,n){if(this.photoEl.textContent="",t){let s=_t("img","",this.photoEl);s.src=t,s.alt="Blitzerfoto",this.photos.push({url:t,kmh:e,clock:n})}_t("div","photo-cap",this.photoEl,`\u{1F4F8} ${e} km/h \xB7 ${n} Uhr`),_t("div","photo-sub",this.photoEl,"Das Foto kommt in einen Rahmen."),this.photoEl.classList.remove("hidden"),this.photoT=6}cameraLabel(t){this.cameraHint.textContent=t,this.cameraHint.classList.remove("hidden"),clearTimeout(this.camTimer),this.camTimer=setTimeout(()=>this.cameraHint.classList.add("hidden"),1600)}update(t,e){for(let h of this.toasts)h.t-=t,h.t<=0&&h.el.remove();this.toasts=this.toasts.filter(h=>h.t>0),this.bannerT>0&&(this.bannerT-=t,this.bannerT<=0&&this.bannerEl.classList.add("hidden")),this.nomiT>0&&(this.nomiT-=t,this.nomiT<=0&&this.nomiEl.classList.add("hidden")),this.durchsageT>0&&(this.durchsageT-=t,this.durchsageT<=0&&this.durchsageEl.classList.add("hidden")),this.photoT>0&&(this.photoT-=t,this.photoT<=0&&this.photoEl.classList.add("hidden"));for(let h of this.rahmenList)h.t-=t,h.t<.6&&h.el.classList.add("out"),h.t<=0&&h.el.remove();if(this.rahmenList=this.rahmenList.filter(h=>h.t>0),this.lastHud-=t,this.lastHud>0||!e)return;this.lastHud=.1;let n=e.player;this.viewersEl.textContent="\u{1F441} "+hn(Math.round(e.viewers)),this.timeEl.textContent=Fo(e.t),this.distEl.textContent=Li(n.s);let s=e.save.best.distance||0;this.recordEl.textContent=n.s>s&&s>0?"\u{1F3C6} neuer Rekord!":s>0?"Rekord "+Li(s):"",this.recordEl.classList.toggle("record",n.s>s&&s>0),this.speedEl.textContent=Math.round(n.kmh)+" km/h",this.moneyRow.textContent=Ze(e.money),this.batteryEl.textContent=Math.round(n.battery)+" %",this.batteryFill.style.width=Jt(n.battery,0,100)+"%",this.batteryFill.className="battery-fill"+(n.battery<15?" low":n.battery<30?" mid":"");let r=Math.max(0,n.maxHits-n.hits);this.damageEl.textContent="\u2665".repeat(r)+"\u2661".repeat(Math.max(0,n.maxHits-r)),this.damageEl.title="Karosserie-Punkte",this.zulageEl.classList.toggle("hidden",!e.weather.regenzulage);let o=e.left;if(this.leftLaneEl.classList.toggle("hidden",!o.open),this.hud.classList.toggle("lane-on",o.open),o.open){let h=n.inLeftLane;this.leftLaneText.textContent=(h?"\u2B05\uFE0F Linke Spur: Bonus l\xE4uft! ":"\u2B05\uFE0F Linke Spur frei! ")+Math.ceil(o.timer)+" s",this.leftLaneEl.classList.toggle("active",h),this.leftLaneEl.classList.toggle("warn",o.timer<10),this.leftLaneFill.style.width=Jt(o.timer/60,0,1)*100+"%"}let a=e.navi,l=Math.max(0,a.targetS-n.s);this.naviTarget.textContent=a.arrived?"\u{1F4CD} Ziel erreicht \u2013 warte auf das n\xE4chste Gebot \u2026":"\u{1F4CD} "+a.target.name,this.naviKm.textContent=a.arrived?"":"\xA0\xB7 "+Li(l,l<1e4?1:0),this.naviBid.textContent=a.arrived?"":`\xA0\xB7 Gebot ${Ze(a.bid)} von ${a.bidder}`;let c=this.naviTarget.scrollWidth+this.naviKm.scrollWidth+this.naviBid.scrollWidth+30;this.naviEl.classList.toggle("short",c>(this.naviMax||760)),this.chatCount.textContent=hn(Math.round(e.viewers))+" Zuschauer",this.fitStack()}};function tt(i,t,e,n){let s=document.createElement(i);return t&&(s.className=t),n!==void 0&&(s.textContent=n),e&&e.appendChild(s),s}function tn(i,t,e,n=""){let s=tt("button","btn "+n,i,t);return s.type="button",s.dataset.action=e,s}var j0={akku:{title:"Akku leer",sub:"Die Stream-Technik im Kofferraum hat den letzten Strom bekommen."},werkstatt:{title:"Ab in die Werkstatt",sub:"Zu viele Rempler \u2013 der Tesla braucht eine kleine Pause. Mini Adam winkt trotzdem in die Kamera."},quit:{title:"Stream beendet",sub:"Mini Adam hat den Stream vorzeitig beendet."}},Q0=["Linke Spur","Navi-Ziele","Spenden","Jobs","Bananensaft","Haarscharf","BrunnenTV","Elsa-Gru\xDF","Vorbildlich","Bu\xDFgeld","Verwarngeld","Koriander"],ac=class{constructor(t,e){this.root=tt("div","screens",t),this.h=e,this.screens={},this.current=null,this.stack=[];for(let n of["title","pause","over","shop","about","controls","settings"]){let s=tt("section","screen screen-"+n+" hidden",this.root);this.screens[n]=s}this.root.addEventListener("click",n=>{let s=n.target.closest("[data-action]");!s||s.disabled||(this.h.click?.(),this.action(s.dataset.action,s))}),window.addEventListener("keydown",n=>this.onKey(n))}get open(){return!!this.current}show(t,e){this.current&&this.current!==t&&this.screens[this.current].classList.add("hidden"),this.current=t,this.data=e;let n=this.screens[t];this["render_"+t](n,e),this.watchScroll(n),n.classList.remove("hidden"),this.root.classList.add("active"),this.root.classList.toggle("dim",t!=="title"),requestAnimationFrame(()=>{(n.querySelector(".btn.primary:not([disabled])")||n.querySelector(".btn:not([disabled])"))?.focus({preventScroll:!0})})}push(t,e){this.current&&this.stack.push({name:this.current,data:this.data}),this.show(t,e)}back(){let t=this.stack.pop();t?this.show(t.name,t.name==="title"||t.name==="pause"||t.name==="over"?this.refreshData(t):t.data):this.h.back?.(this.current)}refresh(t){if(this.current!==t)return;let e=this.screens[t],n=document.activeElement,s=n&&e.contains(n)&&n.dataset?n.dataset.key?`[data-key="${n.dataset.key}"]`:n.dataset.value?`[data-value="${n.dataset.value}"]`:null:null,r=e.querySelector(".card")?.scrollTop||0;this["render_"+t](e,this.h.dataFor?this.h.dataFor(t,this.data):this.data);let o=e.querySelector(".card");o&&(o.style.animation="none",o.scrollTop=r),this.watchScroll(e),s&&e.querySelector(s)?.focus({preventScroll:!0})}watchScroll(t){this.scrollObs?.disconnect();let e=t.querySelector(".card");if(!e)return;let n=()=>e.classList.toggle("more",e.scrollHeight-e.scrollTop-e.clientHeight>4);e.addEventListener("scroll",n,{passive:!0}),this.scrollObs=new ResizeObserver(n),this.scrollObs.observe(e)}refreshData(t){return this.h.dataFor?this.h.dataFor(t.name,t.data):t.data}hide(){this.current&&this.screens[this.current].classList.add("hidden"),this.current=null,this.stack=[],this.root.classList.remove("active","dim")}action(t,e){switch(t){case"back":this.back();break;case"shop":case"about":case"controls":case"settings":this.push(t,this.h.dataFor?this.h.dataFor(t):null);break;case"buy":{let n=e.dataset.id;if(this.h.buy(n)){let s=this.screens.shop.querySelector(".card")?.scrollTop||0;this.render_shop(this.screens.shop,this.h.dataFor("shop"));let r=this.screens.shop.querySelector(".card");r&&(r.style.animation="none",r.scrollTop=s),this.watchScroll(this.screens.shop);let o=this.screens.shop.querySelector(`[data-id="${n}"]`),a=o&&!o.disabled?o:this.screens.shop.querySelector(".btn.back");a?.focus({preventScroll:!0}),a?.scrollIntoView({block:"nearest"})}break}case"toggle":{this.h.setting(e.dataset.key,e.dataset.on!=="1"),this.render_settings(this.screens.settings,this.h.dataFor("settings")),this.watchScroll(this.screens.settings),this.screens.settings.querySelector(`[data-key="${e.dataset.key}"]`)?.focus({preventScroll:!0});break}case"quality":this.h.setting("quality",e.dataset.value),this.render_settings(this.screens.settings,this.h.dataFor("settings")),this.watchScroll(this.screens.settings),this.screens.settings.querySelector(`[data-value="${e.dataset.value}"]`)?.focus({preventScroll:!0});break;case"reset":e.dataset.confirm==="1"?(this.h.resetSave(),this.render_settings(this.screens.settings,this.h.dataFor("settings")),this.watchScroll(this.screens.settings)):(e.dataset.confirm="1",e.textContent="Wirklich alles l\xF6schen? Nochmal klicken",e.classList.add("danger"));break;default:this.h.action?.(t,e)}}onKey(t){if(!this.current||t.target&&/input/i.test(t.target.tagName)&&t.target.type!=="range"&&t.code!=="Escape")return;let e=this.screens[this.current],n=[...e.querySelectorAll(".btn:not([disabled]), input[type=range]")],s=n.indexOf(document.activeElement);if(t.code==="ArrowDown"||t.code==="ArrowRight"||t.code==="KeyS"||t.code==="KeyD"){if(t.target.type==="range"&&(t.code==="ArrowRight"||t.code==="KeyD"))return;t.preventDefault(),n[(s+1+n.length)%n.length]?.focus()}else if(t.code==="ArrowUp"||t.code==="ArrowLeft"||t.code==="KeyW"||t.code==="KeyA"){if(t.target.type==="range"&&(t.code==="ArrowLeft"||t.code==="KeyA"))return;t.preventDefault(),n[(s-1+n.length)%n.length]?.focus()}else if(t.code==="Escape"||t.code==="Backspace"||t.code==="KeyP"&&this.current==="pause")t.preventDefault(),this.current==="pause"?this.h.action("resume"):this.current!=="title"&&this.current!=="over"&&this.back();else if(t.code==="Enter"||t.code==="Space"){if(document.activeElement&&n.includes(document.activeElement))return;t.preventDefault(),(e.querySelector(".btn.primary:not([disabled])")||n[0])?.click()}}pad(t,e,n){if(!this.current)return;let r=[...this.screens[this.current].querySelectorAll(".btn:not([disabled])")],o=r.indexOf(document.activeElement);t&&r[(o+t+r.length)%r.length]?.focus(),e&&(document.activeElement&&r.includes(document.activeElement)?document.activeElement:r[0])?.click(),n&&(this.current==="pause"?this.h.action("resume"):this.current!=="title"&&this.current!=="over"&&this.back())}render_title(t,e){t.textContent="";let n=tt("div","title-card",t),s=tt("div","title-logo",n);tt("span","title-live",s,"\u25CF LIVE"),tt("h1","",n,U0),tt("h2","",n,N0),tt("p","tagline",n,H0);let r=tt("div","menu",n);tn(r,"\u25B6  Losfahren","start","primary"),tn(r,"\u{1F6D2}  Tesla-Shop","shop"),tn(r,"\u{1F3AE}  Steuerung","controls"),tn(r,"\u2699\uFE0F  Einstellungen","settings"),tn(r,"\u2139\uFE0F  \xDCber das Spiel","about");let o=tt("div","title-stats",n);tt("span","",o,"\u{1F4B6} "+Ze(e.wallet)+" Guthaben"),tt("span","",o,"\u{1F3C6} Rekord "+Li(e.best.distance||0)),tt("span","",o,"\u{1F6E3}\uFE0F "+Li((e.stats.totalKm||0)*1e3,1)+" gesamt"),tt("div","title-hint",t,"Enter: Losfahren \xB7 Pfeiltasten oder WASD: fahren \xB7 Esc: Pause")}render_pause(t,e){t.textContent="";let n=tt("div","card pause-card",t);tt("h2","",n,"\u23F8 Pause"),tt("p","sub",n,"Kappandram\xE4\xDFige Zusammenfassung f\xFCr alle, die gerade erst reingekommen sind:");let s=tt("div","summary-grid",n),r=(l,c)=>{let h=tt("div","sum",s);tt("span","k",h,l),tt("span","v",h,c)};r("Strecke",Li(e.player.s)),r("Guthaben dieser Fahrt",Ze(e.money)),r("Navi-Ziel",e.navi.target.name),r("Navi-\xC4nderungen",hn(e.stats.naviChanges)),r("Zuschauer",hn(Math.round(e.viewers))),r("Sendezeit",Fo(e.t));let o=tt("div","job-list",n);tt("h3","",o,"You had 5 Jobs");for(let l of e.jobs){let c=tt("div","job"+(l.done?" done":""),o);tt("span","job-box",c,l.done?"\u2714":""),tt("span","job-text",c,l.text)}let a=tt("div","menu row",n);tn(a,"\u25B6 Weiterfahren","resume","primary"),tn(a,"\u21BB Neustart","restart"),tn(a,"\u2699\uFE0F Einstellungen","settings"),tn(a,"\u23F9 Stream beenden","quit")}render_over(t,e){t.textContent="";let n=tt("div","card over-card",t),s=j0[e.reason]||j0.quit;tt("div","abspann-tag",n,"ABSPANN"),tt("h2","",n,s.title),tt("p","sub",n,s.sub);let r=tt("div","over-big",n),o=tt("div","over-dist",r);tt("span","num",o,Li(e.distance)),tt("span","lbl",o,e.newRecord?"\u{1F3C6} Neuer Rekord!":"Rekord: "+Li(e.best));let a=tt("div","over-money",r);tt("span","num",a,"+"+Ze(e.money)),tt("span","lbl",a,"Guthaben \xB7 jetzt "+Ze(e.wallet));let l=tt("div","menu row over-menu",n);tn(l,"\u21BB Nochmal fahren","restart","primary"),tn(l,"\u{1F6D2} Tesla-Shop","shop"),tn(l,"\u{1F3E0} Hauptmen\xFC","menu");let c=tt("div","over-cols",n),h=tt("div","over-col",c);tt("h3","",h,"Abrechnung");let u=Object.keys(e.breakdown).sort((p,x)=>{let _=Q0.indexOf(p),y=Q0.indexOf(x);return(_<0?99:_)-(y<0?99:y)});for(let p of u){let x=e.breakdown[p];if(Math.abs(x)<.005)continue;let _=tt("div","bd"+(x<0?" minus":""),h);tt("span","",_,p),tt("span","",_,(x<0?"\u2212":"+")+Ze(Math.abs(x)))}tt("h3","",h,"You had 5 Jobs");for(let p of e.jobs){let x=tt("div","job"+(p.done?" done":""),h);tt("span","job-box",x,p.done?"\u2714":""),tt("span","job-text",x,p.text)}let d=tt("div","over-col",c);tt("h3","",d,"Statistik");let f=e.stats,m=(p,x)=>{let _=tt("div","bd",d);tt("span","",_,p),tt("span","",_,x)};m("Navi-Ziele erreicht",hn(f.naviReached)),m("Navi-\xC4nderungen",hn(f.naviChanges)),m("Haarscharf \xFCberholt",hn(f.nearMisses)),m("Rempler",hn(f.crashes)),m("H\xF6chstgeschwindigkeit",hn(Math.round(f.maxSpeedKmh))+" km/h"),m("Zuschauer-Spitze",hn(e.peakViewers)),m("Wischer: gezuckt / gewischt",hn(f.twitches)+" / "+hn(f.wipes)),m("Sendezeit",Fo(e.time)+" (bis "+e.clock+" Uhr)");let v=tt("div","beruf",d);if(tt("div","beruf-k",v,"Erlogene Berufsbezeichnung des Tages"),tt("div","beruf-v",v,"Mini Adam, "+e.beruf.job),tt("div","beruf-src",v,"(aus dem Stream vom "+e.beruf.src+")"),e.photos&&e.photos.length){tt("h3","",d,"Blitzerfotos");let p=tt("div","over-photos",d);for(let x of e.photos.slice(-3)){let _=tt("figure","",p),y=tt("img","",_);y.src=x.url,y.alt="Blitzerfoto",tt("figcaption","",_,x.kmh+" km/h")}}let g=tt("div","crew",n);for(let[p,x]of q0){let _=tt("div","crew-row",g);tt("span","k",_,p),tt("span","v",_,x)}}render_shop(t,e){t.textContent="";let n=tt("div","card shop-card",t),s=tt("div","shop-head",n);tt("h2","",s,"\u{1F6D2} Tesla-Shop"),tt("div","wallet",s,"\u{1F4B6} "+Ze(e.wallet)),tt("p","sub",n,"Upgrades f\xFCr den schwarzen Model 3 Long Range AWD. Bezahlt wird mit Bonusguthaben aus dem Live-Bereich.");let r=tt("div","shop-grid",n);for(let a of qo){let l=e.upgrades[a.id]||0,c=Jl[a.id],h=tt("div","shop-item"+(l>=c?" maxed":""),r),u=tt("div","shop-top",h);tt("span","shop-icon",u,a.icon);let d=tt("div","shop-title",u);tt("div","shop-name",d,a.name),tt("div","shop-cat",d,a.cat);let f=tt("div","pips",h);for(let v=0;v<c;v++)tt("span","pip"+(v<l?" on":""),f);tt("p","shop-desc",h,a.desc);let m=tt("div","shop-eff",h);if(l>0&&tt("div","now",m,"Aktuell: "+a.effect(l)),l<c&&tt("div","next",m,(l>0?"N\xE4chste Stufe: ":"Bringt: ")+a.effect(l+1)),l<c){let v=a.prices[l],g=e.wallet>=v,p=tn(h,g?"Kaufen \xB7 "+$u(v):$u(v)+" \xB7 fehlt noch "+Ze(v-e.wallet),"buy",g?"buy":"buy poor");p.dataset.id=a.id,g||(p.disabled=!0)}else tt("div","maxed-tag",h,"Ausgebaut \u2714")}let o=tt("div","menu row",n);tn(o,"\u2190 Zur\xFCck","back","back primary")}render_controls(t){t.textContent="";let e=tt("div","card",t);tt("h2","",e,"\u{1F3AE} Steuerung");let n=tt("div","controls-grid",e),s=[["Lenken","\u2190\xA0\u2192 oder A\xA0D","Linker Stick","\u25C0\xA0\u25B6"],["Strom geben","\u2191 oder W","RT oder Steuerkreuz \u2191","Strom"],["Bremsen","\u2193 oder S","LT oder Steuerkreuz \u2193","Bremse"],["Hupen (Brunnen & Elsa gr\xFC\xDFen)","Leertaste","A","\u{1F4EF}"],["Scheibenwischer von Hand","E","X","\u{1F327}\uFE0F"],["Megafon (aus dem Shop)","H","Y","\u{1F4E2}"],["Kamera (Cockpit / Drohne)","V","B","\u{1F3A5}"],["Chat ein/aus","C","\u2013","\u2013"],["Ton aus","M","\u2013","\u2013"],["Pause","Esc oder P","Start","\u23F8"]],r=tt("div","crow head",n);for(let l of["Aktion","Tastatur","Gamepad","Touch"])tt("span","",r,l);for(let l of s){let c=tt("div","crow",n);for(let h of l)tt("span","",c,h)}let o=tt("div","tips",e);tt("h3","",o,"Tipps");for(let l of["Wenn NOMI sagt \u201EDie linke Fahrspur ist freigeschaltet.\u201C, gibt es auf der ganz linken Spur Bonusguthaben \u2013 eine Minute lang.","Danach gilt wieder das Rechtsfahrgebot. Sonst kommt die Polizei Gifhorn.","Das Navi-Ziel \xE4ndert sich st\xE4ndig \u2013 jeder neue Zuschauer bietet einen Cent mehr. Erreichte Ziele bringen Guthaben.","Lade-Ringe f\xFCllen den Akku. Bananensaft ist super, Koriander leider nicht.","Wer gut f\xE4hrt, bekommt Regen \u2013 mit Regenzulage. Der automatische Wischer ist allerdings noch in der Beta."])tt("p","",o,"\u2022 "+l);let a=tt("div","menu row",e);tn(a,"\u2190 Zur\xFCck","back","primary")}render_settings(t,e){t.textContent="";let n=tt("div","card settings-card",t);tt("h2","",n,"\u2699\uFE0F Einstellungen");let s=tt("div","settings-list",n),r=(d,f,m)=>{let v=tt("div","set-row",s);tt("span","",v,f);let g=tn(v,m?"An":"Aus","toggle",m?"on":"off");g.dataset.key=d,g.dataset.on=m?"1":"0"};r("sound","Ger\xE4usche",e.sound),r("speech","Sprachausgabe (NOMI und Sprachdurchsagen)",e.speech),r("chat","Live-Chat anzeigen",e.chat);let o=tt("div","set-row",s);tt("span","",o,"Lautst\xE4rke");let a=tt("input","range",o);a.type="range",a.min="0",a.max="1",a.step="0.05",a.value=String(e.volume),a.addEventListener("input",()=>this.h.setting("volume",parseFloat(a.value)));let l=tt("div","set-row",s);tt("span","",l,"Grafik");let c=tt("div","seg",l);for(let[d,f]of[["auto","Automatisch"],["hoch","Hoch"],["mittel","Mittel"],["niedrig","Niedrig"]]){let m=tn(c,f,"quality",e.quality===d?"on":"off");m.dataset.value=d}e.speechSupported||tt("p","note",n,"Hinweis: Dieser Browser hat keine deutsche Sprachausgabe \u2013 NOMI spricht dann nur per Untertitel.");let h=tt("div","set-row",s);tt("span","",h,"Spielstand"),tn(h,"Spielstand zur\xFCcksetzen","reset","off");let u=tt("div","menu row",n);tn(u,"\u2190 Zur\xFCck","back","primary")}render_about(t){t.textContent="";let e=tt("div","card about-card",t);tt("h2","",e,"\u2139\uFE0F \xDCber das Spiel");let n=a=>tt("p","",e,a);n("\u201EMini Adam \u2013 Tesla-Navi ferngesteuert\u201C ist ein liebevolles, nicht-kommerzielles Fan-Spiel rund um SkylineTV LIVE. Mini Adam \u2013 der Pl\xFCsch-Adam mit Kappe, Bart und LIVE-Shirt \u2013 f\xE4hrt den schwarzen Tesla Model 3 Long Range AWD mit 75-kWh-Akku \xFCber die Autobahn, w\xE4hrend der Chat das Navi fernsteuert."),n("Fast alle Witze stammen aus dem SkylineTV LIVE Wiki: die freigeschaltete linke Spur, das Navi-Bieten mit einem Cent mehr, BrunnenTV mit Herrn Sch\xF6nnbrun, Elsa, die Polizei Gifhorn, Meister Propper (kommt gleich), Malte, die Sparkassen-Farbe, Rahmen aus dem Live-Bereich, Sprachdurchsagen von Fr\xE4ulein Kassandra und Br\xFCll-William, Bananensaft statt Koriander, \u201EYou had 5 Jobs\u201C und die erlogenen Berufsbezeichnungen im Abspann."),n("NOMI ist der Boardcomputer auf dem Armaturenbrett. Alle Grafiken, Ger\xE4usche und Stimmen entstehen direkt im Browser \u2013 ohne Bilder- oder Tondateien.");let s=tt("a","link",e,"SkylineTV LIVE Wiki \xF6ffnen");s.href="https://skylinetv.live/wiki/index.php?title=Hauptseite",s.target="_blank",s.rel="noopener";let r=tt("div","tribute",e);tt("span","heart",r,"\u{1F5A4}"),tt("span","",r,"In Erinnerung an Adam Wolke \u2013 danke f\xFCr die Live-Eskalationen.");let o=tt("div","menu row",e);tn(o,"\u2190 Zur\xFCck","back","primary")}};var Yo={hoch:{pr:1.5,msaa:4,shadows:!0,shadowSize:2048,mirrorEvery:1},mittel:{pr:1,msaa:4,shadows:!0,shadowSize:1024,mirrorEvery:2},niedrig:{pr:.75,msaa:0,shadows:!1,shadowSize:1024,mirrorEvery:3}},kd=/[?&]debug/.test(location.search),gc=document.getElementById("app"),Cd=document.getElementById("loading"),oe=Z0(),sn=oe.settings;function om(){let i=sn.quality;return i==="auto"?{...Yo.hoch,pr:Math.min(window.devicePixelRatio||1,1.25),auto:!0}:{...Yo[i]||Yo.mittel,pr:Math.min(window.devicePixelRatio||1,(Yo[i]||Yo.mittel).pr)}}var mn=om(),ue;try{ue=new Za({antialias:!0,powerPreference:"high-performance"})}catch(i){throw Cd.innerHTML='<div class="load-card"><h1>Mini Adam</h1><p>WebGL konnte nicht gestartet werden. Bitte eine aktuelle Version von Google Chrome verwenden und die Hardware-Beschleunigung einschalten.</p></div>',i}var is=mn.pr;ue.setPixelRatio(is);ue.setSize(window.innerWidth,window.innerHeight);ue.toneMapping=Du;ue.toneMappingExposure=1;ue.outputColorSpace=ce;ue.shadowMap.enabled=mn.shadows;ue.shadowMap.type=Cu;ue.shadowMap.autoUpdate=!1;ue.domElement.id="view";gc.prepend(ue.domElement);Fp(ue.capabilities.getMaxAnisotropy());var wi=new Pi,xe=new je(58,window.innerWidth/window.innerHeight,.25,3200),ro=new je(58,window.innerWidth/window.innerHeight,.012,20),Ad=new je(21,.245/.072,.6,700),Zo=new je(24,16/9,.2,900),Cs=new bl(ue,wi,{shadows:mn.shadows,shadowSize:mn.shadowSize}),Pd=new Ml(wi),Ud=new Ll(wi),vc=new Zl(wi),rs=new Fl(wi,vc),am=new rc(wi);_0();var Ln=R0();wi.add(Ln.root);var Le=new ql;Le.scene.environment=Cs.envTarget.texture;Cs.onEnv=i=>{Le.scene.environment=i};var ao=new Yl,ss=new nt;function lm(){return ue.getDrawingBufferSize(ss),ss}lm();var $o=new ei(ss.x,ss.y,{type:_s,samples:mn.msaa,depthBuffer:!0}),Nd=new ei(768,226,{type:_s,samples:4,depthBuffer:!0});Le.setMirrorTexture(Nd.texture);var cm=D0($o.texture,ao),hm=new Pi,um=new D(new fe(2,2),cm);um.frustumCulled=!1;hm.add(um);var dm=new Hr(-1,1,1,-1,0,1),Xe=cm.uniforms,fm=new Pi,Ko=new nt,As=null,Id=new Ye({uniforms:{tScreen:{value:null},uCopy:{value:0},uFade:Xe.uFade,uFlash:Xe.uFlash,uFlashColor:Xe.uFlashColor,uVignette:Xe.uVignette,uGreen:Xe.uGreen,uGlitch:Xe.uGlitch,uTime:Xe.uTime},vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`
    uniform sampler2D tScreen;
    uniform float uCopy;
    uniform float uFade;
    uniform float uFlash;
    uniform vec3 uFlashColor;
    uniform float uVignette;
    uniform float uGreen;
    uniform float uGlitch;
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vec2 vc = vUv - 0.5;
      // gleiche Vignette wie im Weltbild (dort vor, hier nach der sRGB-Kodierung)
      float vig = pow(max(0.0, 1.0 - dot(vc, vc) * uVignette), 0.4545);
      float f = clamp(uFlash, 0.0, 1.0);
      float k = 1.0 - clamp(uFade, 0.0, 1.0);
      vec3 flash = min(uFlashColor * 4.0, vec3(1.0)) * f;
      if (uCopy > 0.5) {
        vec2 uv = vUv;
        if (uGlitch > 0.0) {
          float band = floor(uv.y * 30.0) + floor(uTime * 24.0);
          float r = fract(sin(band * 91.7) * 4375.85);
          uv.x += (r - 0.5) * 0.08 * uGlitch * step(0.6, r);
        }
        vec3 c = texture2D(tScreen, uv).rgb;
        float g = dot(c, vec3(0.3, 0.6, 0.1));
        c = mix(c, vec3(0.08, 1.0, 0.25) * (0.3 + g), uGreen * 0.65);
        gl_FragColor = vec4((c * vig * (1.0 - f) + flash) * k, 1.0);
      } else {
        // vormultipliziert: Bild * (1 - a) + Farbe
        gl_FragColor = vec4(flash * k, 1.0 - vig * (1.0 - f) * k);
      }
    }`,transparent:!0,depthTest:!1,depthWrite:!1,blending:Pu,blendSrc:Iu,blendDst:To}),pm=new D(new fe(2,2),Id);pm.frustumCulled=!1;fm.add(pm);var ob=(()=>{let i=document.createElement("canvas");i.width=512,i.height=192;let t=i.getContext("2d"),e=t.createLinearGradient(0,0,0,192);e.addColorStop(0,"#2a2c30"),e.addColorStop(1,"#141517"),t.fillStyle=e,t.fillRect(0,0,512,192),t.fillStyle="#0c0c0d",t.fillRect(0,0,512,34);let n=(r,o,a,l,c,h)=>{t.fillStyle=c,ze(t,r,o,a,l,8),t.fill(),t.fillStyle="#e8e8e8",t.font="bold 15px Arial, sans-serif",t.textAlign="center",t.fillText(h,r+a/2,o+l/2+5)};n(24,70,120,84,"#3b3f46","Akku-Pack"),n(160,92,96,62,"#20242a","Router"),n(272,60,92,94,"#5a2a2a","KONFETTI"),n(380,84,110,70,"#1e3550","LTE \xD73"),t.strokeStyle="#d4a21a",t.lineWidth=3;for(let r=0;r<4;r++)t.beginPath(),t.moveTo(140+r*8,120),t.bezierCurveTo(180,175-r*6,330,178,380,120+r*6),t.stroke();t.fillStyle="#ff4d4d",t.font="bold 18px Arial, sans-serif",t.textAlign="left",t.fillText("\u25CF REC  Kofferraum offen",18,24);let s=new Ce(i);return s.colorSpace=ce,s.repeat.x=-1,s.offset.x=1,s})(),xc=document.createElement("canvas");xc.width=360;xc.height=270;var or=xc.getContext("2d"),gn=new Kl;gn.enabled=sn.sound;gn.volume=sn.volume;var Ps=new jl;Ps.enabled=sn.speech;var nn=new Ql,Be=new oc(gc);Be.setChat(sn.chat);var Hd=document.createElement("div");Hd.className="touch";for(let[i,t,e]of[["left","\u25C0","t-left"],["right","\u25B6","t-right"],["brake","Bremse","t-brake"],["gas","Strom","t-gas"],["horn","\u{1F4EF}","t-small t-horn"],["wiper","\u{1F327}\uFE0F","t-small t-wiper"],["megafon","\u{1F4E2}","t-small t-megafon"],["camera","\u{1F3A5}","t-small t-camera"],["pause","\u23F8","t-small t-pause"]]){let n=document.createElement("button");n.type="button",n.className=e,n.textContent=t,Hd.appendChild(n),nn.bindTouch(n,i)}gc.appendChild(Hd);var hc=null,We={flash:0,glitch:0,green:0,trunk:0,fade:0,fadeTarget:0},ab={flash:(i=1)=>{We.flash=Math.max(We.flash,i)},glitch:i=>{We.glitch=Math.max(We.glitch,i)},green:i=>{We.green=Math.max(We.green,i)},shake:i=>{Le.shake=Math.max(Le.shake,i)},trunk:i=>{We.trunk=i,Le.setTrunkView(ob),Le.mirrorMat.needsUpdate=!0}},lb={reset:()=>Be.reset(),chat:i=>Be.chat(i),toast:(i,t,e)=>Be.toast(i,t,e),banner:(i,t,e)=>Be.banner(i,t,e),nomi:(i,t)=>Be.nomi(i,t),money:(i,t)=>Be.money(i,t),durchsage:(i,t,e,n)=>Be.durchsage(i,t,e,n),rahmen:(i,t)=>Be.rahmen(i,t),funkloch:i=>Be.funkloch(i),damage:(i,t)=>Be.damage(i,t),jobs:i=>Be.jobs(i),photo:(i,t)=>{hc={kmh:i,clock:t}}},le=new sc({traffic:rs,scenery:Ud,road:Pd,sky:Cs,rain:vc,windshield:ao,cockpit:Le,audio:gn,speech:Ps,ui:lb,fx:ab,pickups:am}),Ge="loading",Ni="cockpit",$e=0,Hi=!1,dc=null,Ld=!1,On=new ac(gc,{click:()=>{gn.init(),gn.click()},action:i=>{i==="start"||i==="restart"?mm():i==="resume"?gm():i==="quit"?(Hi=!1,On.hide(),le.end("quit")):i==="menu"&&cb()},back:()=>{},dataFor:(i,t)=>i==="shop"?{wallet:oe.wallet,upgrades:oe.upgrades}:i==="settings"?{...sn,speechSupported:Ps.supported}:i==="title"?oe:i==="pause"?le:i==="over"&&dc?{...dc,wallet:oe.wallet}:t,buy:i=>{let t=qo.find(s=>s.id===i),e=oe.upgrades[i]||0;if(!t||e>=Jl[i])return!1;let n=t.prices[e];return oe.wallet<n?(gn.bad(),!1):(oe.wallet=Math.round((oe.wallet-n)*100)/100,oe.upgrades[i]=e+1,rr(oe),gn.coin(),Jo(),!0)},setting:(i,t)=>{sn[i]=t,oe.settings=sn,rr(oe),fc(i)},resetSave:()=>{let i=K0();for(let t of Object.keys(oe))delete oe[t];Object.assign(oe,i),sn=oe.settings,rr(oe),Jo(),fc()}});function Jo(){let i=oe.upgrades;Ln.setStarlink(!!i.starlink),Ln.setVest(!!i.weste),Le.setElsa(!!i.elsa)}function fc(i){if(gn.enabled=sn.sound,gn.volume=sn.volume,gn.setEnabled(sn.sound),Ps.enabled=sn.speech,sn.speech||Ps.stopAll(),Be.setChat(sn.chat),!i||i==="quality"){let t=mn;mn=om(),is=mn.pr,t.shadows!==mn.shadows&&(ue.shadowMap.enabled=mn.shadows,Cs.sun.castShadow=mn.shadows,wi.traverse(n=>{n.material&&(Array.isArray(n.material)?n.material:[n.material]).forEach(s=>s.needsUpdate=!0)}));let e=Cs.sun.shadow;e.mapSize.x!==mn.shadowSize&&(e.mapSize.set(mn.shadowSize,mn.shadowSize),e.map&&(e.map.dispose(),e.map=null)),$o.samples=mn.msaa,$o.dispose(),Qo()}}function cb(){Ge="title",$e=0,Hi=!1,Le.shake=0,Ni="cockpit",Be.show(!1),Ps.stopAll(),le.startDemo(),Jo(),On.hide(),On.show("title",oe)}function mm(){gn.init(),On.hide(),Hi=!1,le.start(oe),Jo(),Ge="intro",$e=0,Ld=!1,Ni="cockpit",Be.show(!1),We.fade=1,Le.shake=0,nn.endFrame()}function gm(){Hi=!1,On.hide(),Ps.pause(!1),nn.pressed.clear(),nn.keys.clear()}function Bd(){Ge!=="drive"||Hi||(Hi=!0,Ps.pause(!0),On.show("pause",le))}function hb(){let i=le.over,t=i.distance/1e3,e=oe.best.distance||0,n=i.distance>e&&i.distance>50;oe.wallet=Math.round((oe.wallet+i.money)*100)/100,oe.best.distance=Math.max(e,i.distance),oe.best.earned=Math.max(oe.best.earned||0,i.money),oe.best.viewers=Math.max(oe.best.viewers||0,i.peakViewers),oe.stats.runs++,oe.stats.totalKm+=t,oe.stats.naviReached+=i.stats.naviReached,oe.stats.crashes+=i.stats.crashes,oe.stats.leftLaneEuro+=i.breakdown["Linke Spur"]||0,rr(oe),dc={...i,newRecord:n,best:oe.best.distance,wallet:oe.wallet,photos:Be.photos.slice()}}var li={lane:2,cool:0};function tm(i,t,e=!0){let n=le.player;li.cool-=i;let s=null,r=1/0;for(let h of rs.cars){let u=h.s-n.s;u>0&&u<70&&Math.abs(h.x-n.x)<2.3&&u<r&&(s=h,r=u)}if(e&&s&&r<55&&li.cool<=0){let h=f=>f>=1&&f<=3&&rs.cars.every(m=>Math.abs(m.x-bt.laneCenter(f))>2.4||m.s-n.s<-22||m.s-n.s>48),u=n.lane,d=[u-1,u+1].filter(h);d.length&&(li.lane=d[0],li.cool=3)}if(li.cool<=-8&&li.lane<3){let h=li.lane+1;rs.cars.every(u=>Math.abs(u.x-bt.laneCenter(h))>2.4||u.s-n.s<-22||u.s-n.s>60)&&(li.lane=h,li.cool=3)}let o=bt.laneCenter(li.lane)-n.x,a=Math.abs(o)>.25?Jt(o*.9,-1,1):0,l=n.kmh<t?.6:0,c=0;return s&&r<40&&s.speed<n.speed&&(l=0,c=Jt((n.speed-s.speed)/8+(40-r)/40,0,1)),{steer:a,throttle:l,brake:c,horn:!1,wiper:!1,megafon:!1}}var jn=new jt,lc=new A,cc=new qe,em=new vn,ub=new A(1,1,1),db=new A,jo=new A,Mn={pos:new A(0,4,10),look:new A(0,1,-10),init:!1};function oo(){let i=le.player;lc.set(i.x,0,0),em.set(0,-i.yaw,Jt(i.latAcc*.0025,-.03,.03),"YXZ"),cc.setFromEuler(em),jn.compose(lc,cc,ub),Ln.root.position.copy(lc),Ln.root.quaternion.copy(cc),Le.root.position.copy(lc),Le.root.quaternion.copy(cc)}function pc(i){let t=window.innerWidth/window.innerHeight,e=Xr.degToRad(86),n=Math.max(Xr.degToRad(i),2*Math.atan(Math.tan(e/2)/t));xe.fov=Jt(Xr.radToDeg(n),50,78),xe.aspect=t,xe.view&&(xe.view.enabled=!1),xe.updateProjectionMatrix()}var Ui={x:0,y:0};function fb(i){let t=window.innerWidth,e=window.innerHeight,n=0,s=0,r=Ge==="title"?document.querySelector(".screen-title:not(.hidden) .title-card"):null,o=r&&r.getBoundingClientRect();o&&o.width&&(t-o.right>t*.3?n=(o.right+t)/2-t/2:e-o.bottom>=o.top&&e-o.bottom>110?s=(o.bottom+e)/2-e/2:o.top>110&&(s=o.top/2-e/2));let a=1-Math.exp(-i*4);Ui.x+=(n-Ui.x)*a,Ui.y+=(s-Ui.y)*a,Math.abs(Ui.x)+Math.abs(Ui.y)>.5&&xe.setViewOffset(t,e,-Ui.x,-Ui.y,t,e)}function mc(i){return db.copy(i).applyMatrix4(jn)}var en={r:8.5,xMin:bt.left+.25,xMax:bt.right+.4,yMax:4.8,clear:.5,margin:.5,blend:2.5,lead:1.4},pb=new A,nm=.16,_n={a:.9,dir:1,leaving:!1};function Rd(i,t){let e=Ge==="title"?[i.x,bt.laneCenter(li.lane)]:[i.x],n=s=>Math.min(...e.map(r=>s>0?en.xMax-r:r-en.xMin));return n(t)<en.r*.75&&n(-t)>n(t)}function mb(i,t){if(_n.leaving=!1,!Mn.init)_n.a=Rd(i,1)?-.9:.9,_n.dir=1;else{let o=Math.sin(_n.a)>=0?1:-1;if(Rd(i,o))_n.dir=Math.cos(_n.a)*o>0?-1:1,_n.a+=_n.dir*nm*2.5*t,_n.leaving=!0;else{let a=_n.a+_n.dir*nm*t;(Math.sin(a)>=0?1:-1)!==o&&Rd(i,-o)?_n.dir=-_n.dir:_n.a=a}}let e=_n.a,n=pb.set(Math.sin(e)*en.r,2.4+Math.sin($e*.3)*.6,Math.cos(e)*en.r).applyMatrix4(jn),s=Math.max(n.x-en.xMax,en.xMin-n.x,0);if(n.x=Jt(n.x,en.xMin,en.xMax),_n.leaving&&s>0){let o=n.x-i.x;n.z=(Math.cos(_n.a)>=0?1:-1)*Math.sqrt(Math.max(0,en.r*en.r-o*o))}else n.y+=s*.3;let r=n.y;for(let o of rs.cars){let a=o.v.height+en.clear;if(a<=r)continue;let l=i.s-o.s,c=Math.max(0,l-o.len/2-en.margin-n.z,n.z-(l+o.len/2+en.margin)),h=Math.max(0,Math.abs(n.x-o.x)-o.w/2-en.margin),u=1-xn(0,en.blend,h),d=1-xn(.3,en.lead,c/Math.max(.001,Math.abs(i.speed-o.speed))),f=Math.max(1-xn(0,en.blend,Math.hypot(h,c)),u*d);f>0&&(n.y=Math.max(n.y,Qt(r,a,f)))}return n.y=Math.min(n.y,en.yMax),n}function gb(i,t){for(let e of rs.cars)Math.abs(i.x-e.x)<e.w/2+.35&&Math.abs(i.z-(t.s-e.s))<e.len/2+.35&&(i.y=Math.max(i.y,Math.min(e.v.height+.35,en.yMax)))}function uc(i,t){let e=le.player,n,s;t==="orbit"?(n=mb(e,i),s=new A(0,.9,0).applyMatrix4(jn)):(n=new A(-e.vx*.25,3.3,9.2).applyMatrix4(jn),s=new A(0,1,-14).applyMatrix4(jn)),Mn.init||(Mn.pos.copy(n),Mn.look.copy(s),Mn.init=!0);let r=1-Math.exp(-i*(t==="orbit"?3:6));if(t==="orbit"){let o=Mn.pos.y+(n.y-Mn.pos.y)*(1-Math.exp(-i*(n.y>Mn.pos.y?4:1.5)));Mn.pos.lerp(n,r),Mn.pos.y=o,gb(Mn.pos,e)}else Mn.pos.lerp(n,r);Mn.look.lerp(s,r),xe.position.copy(Mn.pos),Le.shake>0&&(xe.position.y+=Math.sin($e*60)*Le.shake*.08),xe.lookAt(Mn.look),pc(50),t==="orbit"?fb(i):Ui.x=Ui.y=0}var Rs=[{t:0,pos:[-6.2,2.4,-9.5],look:[-.25,.95,0]},{t:2.4,pos:[-2.7,1.55,-3.4],look:[-.37,1.12,.22]},{t:4.6,pos:[-1.72,1.26,.2],look:[-.37,1.16,.28]}],ci=4.85,Fd=6.3;function vb(i){let t=Rs[0],e=Rs[Rs.length-1];for(let s=0;s<Rs.length-1;s++)if(i>=Rs[s].t&&i<=Rs[s+1].t){t=Rs[s],e=Rs[s+1];break}if(i>e.t)return{pos:new A(...e.pos),look:new A(...e.look)};let n=Ku(Jt((i-t.t)/(e.t-t.t),0,1));return{pos:new A().fromArray(t.pos).lerp(new A().fromArray(e.pos),n),look:new A().fromArray(t.look).lerp(new A().fromArray(e.look),n)}}function xb(i){let t=$e;if(t<ci){let{pos:n,look:s}=vb(t);return n.applyMatrix4(jn),s.applyMatrix4(jn),xe.position.copy(n),xe.lookAt(s),pc(44),"outside"}Le.placeCamera(xe,jn,t,le.player.speed,0,i);let e=Ku(Jt((t-ci)/(Fd-ci),0,1));return xe.rotateOnWorldAxis(jo.set(0,1,0),(1-e)*1.05),pc(58),"inside"}function Qo(){ue.setPixelRatio(is),ue.setSize(window.innerWidth,window.innerHeight),lm(),$o.setSize(ss.x,ss.y),Xe.uTexel.value.set(1/ss.x,1/ss.y),xe.aspect=window.innerWidth/window.innerHeight,xe.updateProjectionMatrix(),Le.setAspect(xe.aspect),vc.setPixelScale(ss.y)}window.addEventListener("resize",Qo);Qo();var Ei={acc:0,n:0,cool:3};function yb(i){if(!mn.auto||Ge==="loading"||(Ei.acc+=i,Ei.n++,Ei.cool-=i,Ei.n<40))return;let t=Ei.acc/Ei.n;if(Ei.acc=0,Ei.n=0,Ei.cool>0)return;let e=Math.min(window.devicePixelRatio||1,1.5);t>1/45&&is>.55?(is=Math.max(.55,is-.12),Ei.cool=1.5,Qo()):t<1/75&&is<e&&(is=Math.min(e,is+.06),Ei.cool=3,Qo())}var im=0;function vm(i,{cockpitOn:t,drops:e}){Ln.root.visible=!t,ue.shadowMap.needsUpdate=mn.shadows,ue.setRenderTarget($o),ue.render(wi,i),ue.setRenderTarget(null),Xe.uDrops.value=e?1:0,Xe.uPost.value=t?0:1,ue.render(hm,dm)}function _b(i){im++,i&&im%mn.mirrorEvery===0&&(Ad.position.copy(mc(jo.set(0,1.32,.9))),Ad.lookAt(mc(jo.set(0,1.05,40))),Ln.root.visible=!1,ue.setRenderTarget(Nd),ue.render(wi,Ad)),hc&&(bb(hc),hc=null),vm(xe,{cockpitOn:i,drops:i}),i&&(ro.position.copy(xe.position),ro.quaternion.copy(xe.quaternion),ro.fov=xe.fov,ro.aspect=xe.aspect,ro.updateProjectionMatrix(),ue.autoClear=!1,ue.clearDepth(),ue.render(Le.scene,ro),Mb(),ue.autoClear=!0)}function Mb(){let i=Xe.uGreen.value>.001||Xe.uGlitch.value>.001;i&&(ue.getDrawingBufferSize(Ko),(!As||As.image.width!==Ko.x||As.image.height!==Ko.y)&&(As&&As.dispose(),As=new tl(Ko.x,Ko.y),Id.uniforms.tScreen.value=As),ue.copyFramebufferToTexture(As)),Id.uniforms.uCopy.value=i?1:0,ue.render(fm,dm)}function bb({kmh:i,clock:t}){Zo.aspect=4/3,Zo.updateProjectionMatrix(),Zo.position.copy(mc(jo.set(2.6,1.55,-10.5))),Zo.lookAt(mc(jo.set(-.3,1.05,-.3)));let e=Ln.cabinLight.intensity;Ln.cabinLight.intensity=5;let n=Xe.uFlash.value;Xe.uFlash.value=.01,vm(Zo,{cockpitOn:!1,drops:!1}),Xe.uFlash.value=n,Ln.cabinLight.intensity=e,or.drawImage(ue.domElement,0,0,ue.domElement.width,ue.domElement.height,0,0,360,270),or.fillStyle="rgba(0,0,0,0.55)",or.fillRect(0,238,360,32),or.fillStyle="#ffd21f",or.font='bold 17px "Courier New", monospace',or.textAlign="left",or.fillText(`${i} km/h   ${t}   ERLAUBT 120`,10,260);let s=null;try{s=xc.toDataURL("image/jpeg",.82)}catch{s=null}Be.photo(s,i,t)}var Dd=performance.now(),In=0,sm={prev:{}};function Eb(i){let t=navigator.getGamepads?navigator.getGamepads():[];for(let e of t){if(!e)continue;let n=l=>!!e.buttons[l]?.pressed,s=e.axes[1]||0,r={up:n(12)||s<-.6,down:n(13)||s>.6,a:n(0),b:n(1),start:n(9)},o=l=>r[l]&&!sm.prev[l],a=0;o("up")&&(a=-1),o("down")&&(a=1),i&&(a||o("a")||o("b")||o("start"))&&On.pad(a,o("a")||o("start")&&On.current!=="pause",o("b")||o("start")&&On.current==="pause"),sm.prev=r;return}}function xm(i){requestAnimationFrame(xm);let t=(i-Dd)/1e3;Dd=i,!(kd&&window.__MA&&window.__MA.frozen)&&(t>0||(t=1/60),t=Math.min(t,1/20),ym(t),yb(t))}function ym(i,{render:t=!0}={}){In+=i,$e+=i,nn.poll(),Eb(On.open);let e=le.player,n=null,s=!1,r=0,o=0;switch(nn.take("mute")&&(sn.sound=!sn.sound,fc("sound"),rr(oe),Be.toast(sn.sound?"\u{1F50A} Ton an":"\u{1F507} Ton aus","info"),On.refresh("settings")),nn.take("chat")&&(sn.chat=!sn.chat,fc("chat"),rr(oe),On.refresh("settings")),Ge){case"title":{n=tm(i,118),le.demo(i,n),oo(),uc(i,"orbit"),r=xn(.72,.9,Math.sin(In*.5)),o=Math.sin(In*.4)*.6;break}case"intro":{$e>.3&&(nn.anyKey||nn.take("confirm"))&&(Ld=!0),Ld&&$e<ci-.25&&($e=ci-.25),n=tm(i,100,!1),li.lane=3,le.update(i,n,xe),oo(),s=xb(i)==="inside",r=xn(1,1.8,$e)*(1-xn(3.4,4,$e)),o=xn(1,2.6,$e)*1;let u=$e;We.fade=u<.6?1-u/.6:u>ci-.25&&u<ci?(u-(ci-.25))/.25:u>=ci&&u<ci+.35?1-(u-ci)/.35:0,!le._greeted&&u>=ci&&(le._greeted=!0,gn.whoosh(),le.say("Hallo Mini Adam! Der Stream l\xE4uft. Gute Fahrt!","happy")),u>.4&&!le._introChime&&(le._introChime=!0,gn.nomiChime()),$e>=Fd&&(Ge="drive",$e=0,Be.show(!0),Be.toast(matchMedia("(pointer: coarse)").matches?"Tipp: \u25C0 \u25B6 lenken \xB7 Strom und Bremse rechts \xB7 \u{1F3A5} Kamera":"Tipp: \u2190 \u2192 lenken \xB7 \u2191 Strom \xB7 \u2193 Bremse \xB7 V Kamera","info"));break}case"drive":{if(Hi){oo(),Ni==="cockpit"&&Le.placeCamera(xe,jn,In,0,0,0),s=Ni==="cockpit";break}if(nn.take("pause")){Bd();break}nn.take("camera")&&(Ni=Ni==="cockpit"?"drone":"cockpit",Mn.init=!1,Be.cameraLabel(Ni==="cockpit"?"\u{1F3A5} Cockpit":"\u{1F3A5} Drohne")),n={steer:nn.steer,throttle:nn.throttle,brake:nn.brake,horn:nn.take("horn"),wiper:nn.take("wiper"),megafon:nn.take("megafon"),device:nn.lastDevice},le.update(i,n,xe),oo(),Ni==="cockpit"?(Le.placeCamera(xe,jn,In,e.speed,e.latAcc,i),pc(58),s=!0):uc(i,"follow"),le.over&&(Ge="ending",$e=0,Mn.init=!1,hb());break}case"ending":case"over":{let h={steer:0,throttle:0,brake:.5,horn:!1,wiper:!1,megafon:!1};e.update(i,h,{wet:le.weather.level}),rs.update(i,In,e,{difficulty:.2,leftOpen:!1,rain:le.weather.level}),am.update(i,In,e,xe,!1),oo(),uc(i,"orbit"),r=xn(.9,1.5,$e),o=Math.sin($e*.5)*.8,Ge==="ending"&&$e>2.6&&(Ge="over",Be.show(!1),On.show("over",dc));break}default:break}let a=e.s,l=le.weather?le.weather.level:0,c=Hi;if(!c){let h=_i.uCurve.value;h.x=125e-6*(.62*Math.sin(a/1900+1.3)+.38*Math.sin(a/740+.4)),h.y=45e-6*Math.sin(a/1300+2.1)*(.5+.5*Math.sin(a/3100));let u=le.left||{glow:0};Pd.update(a,i,In,u.glow||0,u.open&&u.timer<10?1:0),Pd.setWet(l),Ud.update(a,i),Cs.setOvercast(l*.95),vc.update(i,In,{speed:e.speed,s:a,camX:xe.position.x,intensity:l}),Ln.update(i,e.speed,e.steer,In),Ln.setBrake(e.braking>.1||e.speed<1),Ln.adam.animate(In,{steer:e.steer,wave:r,look:o}),Ln.cabinLight.intensity=s?0:Ge==="title"||Ge==="intro"||Ge==="ending"||Ge==="over"?3.2:.9,Ln.setGroundShade(l),ao.update(i,{speed:e.speed,camera:xe,carMatrix:jn}),Le.update({dt:i,t:In,steer:e.steer,latAcc:e.latAcc,wiperAngles:ao.angles,sunDir:Cs.sunDir,overcast:l,screen:le.screenState?wb():null}),We.trunk>0&&(We.trunk-=i,We.trunk<=0&&Le.setMirrorTexture(Nd.texture))}Cs.update(c?0:i,xe,a,In),gn.update(i,{speed:e.speed,throttle:e.throttle,rain:l,sirenLevel:le.sirenLevel||0,inCabin:s,paused:c||Ge==="over"}),Le.shake=Math.max(0,Le.shake-i*1.6),We.flash=Math.max(0,We.flash-i*3.5),We.glitch=Math.max(0,We.glitch-i),We.green=Math.max(0,We.green-i),Xe.uTime.value=In,Xe.uRain.value=l,Xe.uFlash.value=We.flash,Xe.uGlitch.value=We.glitch>0?.6+.4*Math.sin(In*40):0,Xe.uGreen.value=We.green>0?Math.sin(In*26)>.2?1:.15:0,Xe.uFade.value=Ge==="intro"?Jt(We.fade,0,1):0,Xe.uSat.value=1.08-l*.25,kd&&window.__MA&&window.__MA.camHook&&window.__MA.camHook(xe,jn),document.body.classList.toggle("playing",Ge==="drive"&&!Hi),document.body.classList.toggle("drone",Ni==="drone"),t&&_b(s),Be.update(Hi?0:i,Ge==="drive"||Ge==="intro"?le:null),nn.endFrame()}function wb(){try{return le.running||le.over?le.screenState():rm()}catch{return rm()}}function rm(){let i=le.player;return{dark:!1,battery:100,speedKmh:i.kmh,limit:null,playerX:i.x,leftLane:0,cars:rs.nearby(i,125),s:i.s,navi:le.navi.screen(i.s,18*60,i.speed),clock:"18:00",temp:17,funkloch:0,wiperOn:!1}}window.addEventListener("pointerdown",()=>gn.init());window.addEventListener("keydown",()=>gn.init());document.addEventListener("visibilitychange",()=>{document.hidden?(Bd(),gn.suspend()):gn.resume()});function Sb(){Jo(),le.startDemo(),oo(),uc(.016,"orbit");try{ue.compile(wi,xe),ue.compile(Le.scene,xe)}catch{}Ge="title",On.show("title",oe),Cd.classList.add("done"),setTimeout(()=>Cd.remove(),800),requestAnimationFrame(i=>{Dd=i,xm(i)})}kd&&(window.__MA={game:le,traffic:rs,scenery:Ud,cockpit:Le,windshield:ao,tesla:Ln,ui:Be,menus:On,input:nn,renderer:ue,camera:xe,save:oe,get state(){return Ge},set view(i){Ni=i},start:()=>mm(),skipIntro:()=>{$e=Fd},step:(i,t=1/30)=>{let e=Math.round(i/t);for(let n=0;n<e;n++)ym(t,{render:n===e-1})},setState:(i,t=0)=>{Ge=i,$e=t},rain:i=>{le.weather.active=i>0,le.weather.target=i,le.weather.level=i,le.weather.dur=999,ao.setRain(i)},pause:()=>Bd(),resume:()=>gm()});Sb();})();
