/* Mini Adam: Tesla-Navi ferngesteuert – gebaut aus src/ (npm run build). Enthält three.js (MIT). */
(()=>{var vu="170";var q0=0,Rd=1,Y0=2;var Wf=1,xu=2,Ni=3,yi=0,_n=1,dt=2,cs=0,Er=1,ds=2,Cd=3,Pd=4,yu=5,ks=100,Z0=101,K0=102,$0=103,J0=104,j0=200,_u=201,Q0=202,em=203,Vc=204,bo=205,tm=206,nm=207,im=208,sm=209,rm=210,om=211,am=212,lm=213,cm=214,Wc=0,Xc=1,qc=2,Ar=3,Yc=4,Zc=5,Kc=6,$c=7,Mu=0,hm=1,um=2,hs=0,dm=1,fm=2,pm=3,bu=4,mm=5,gm=6,vm=7;var Xf=300,Rr=301,Cr=302,Jc=303,jc=304,ol=306,Oi=1e3,Hs=1001,Qc=1002,Cn=1003,xm=1004;var Qo=1005;var Vn=1006,cc=1007;var Bs=1008;var zi=1009,qf=1010,Yf=1011,Eo=1012,Eu=1013,Fs=1014,xi=1015,ps=1016,wu=1017,Su=1018,Pr=1020,Zf=35902,Kf=1021,$f=1022,oi=1023,Jf=1024,jf=1025,wr=1026,Ir=1027,Tu=1028,Au=1029,Qf=1030,Ru=1031;var Cu=1033,Ca=33776,Pa=33777,Ia=33778,La=33779,eh=35840,th=35841,nh=35842,ih=35843,sh=36196,rh=37492,oh=37496,ah=37808,lh=37809,ch=37810,hh=37811,uh=37812,dh=37813,fh=37814,ph=37815,mh=37816,gh=37817,vh=37818,xh=37819,yh=37820,_h=37821,Da=36492,Mh=36494,bh=36495,ep=36283,Eh=36284,wh=36285,Sh=36286;var ka=2300,Th=2301,hc=2302,Id=2400,Ld=2401,Dd=2402;var ym=3200,_m=3201;var Pu=0,Mm=1,ls="",ht="srgb",Or="srgb-linear",al="linear",Tt="srgb";var rr=7680;var kd=519,bm=512,Em=513,wm=514,tp=515,Sm=516,Tm=517,Am=518,Rm=519,Ud=35044,np=35048;var Nd="300 es",Bi=2e3,Ua=2001,fs=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},xn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Hd=1234567,vo=Math.PI/180,Lr=180/Math.PI;function Ws(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(xn[i&255]+xn[i>>8&255]+xn[i>>16&255]+xn[i>>24&255]+"-"+xn[e&255]+xn[e>>8&255]+"-"+xn[e>>16&15|64]+xn[e>>24&255]+"-"+xn[t&63|128]+xn[t>>8&255]+"-"+xn[t>>16&255]+xn[t>>24&255]+xn[n&255]+xn[n>>8&255]+xn[n>>16&255]+xn[n>>24&255]).toLowerCase()}function tn(i,e,t){return Math.max(e,Math.min(t,i))}function Iu(i,e){return(i%e+e)%e}function Cm(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Pm(i,e,t){return i!==e?(t-i)/(e-i):0}function xo(i,e,t){return(1-t)*i+t*e}function Im(i,e,t,n){return xo(i,e,1-Math.exp(-t*n))}function Lm(i,e=1){return e-Math.abs(Iu(i,e*2)-e)}function Dm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function km(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Um(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Nm(i,e){return i+Math.random()*(e-i)}function Hm(i){return i*(.5-Math.random())}function Bm(i){i!==void 0&&(Hd=i);let e=Hd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Fm(i){return i*vo}function Om(i){return i*Lr}function zm(i){return(i&i-1)===0&&i!==0}function Gm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Vm(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Wm(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),m=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*u,l*d,a*c);break;case"YZY":i.set(l*d,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*d,a*h,a*c);break;case"XZX":i.set(a*h,l*m,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*m,a*c);break;case"ZYZ":i.set(l*m,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function _r(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function An(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var zr={DEG2RAD:vo,RAD2DEG:Lr,generateUUID:Ws,clamp:tn,euclideanModulo:Iu,mapLinear:Cm,inverseLerp:Pm,lerp:xo,damp:Im,pingpong:Lm,smoothstep:Dm,smootherstep:km,randInt:Um,randFloat:Nm,randFloatSpread:Hm,seededRandom:Bm,degToRad:Fm,radToDeg:Om,isPowerOfTwo:zm,ceilPowerOfTwo:Gm,floorPowerOfTwo:Vm,setQuaternionFromProperEuler:Wm,normalize:An,denormalize:_r},le=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(tn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ot=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],v=s[0],g=s[3],p=s[6],y=s[1],_=s[4],x=s[7],I=s[2],S=s[5],T=s[8];return r[0]=o*v+a*y+l*I,r[3]=o*g+a*_+l*S,r[6]=o*p+a*x+l*T,r[1]=c*v+h*y+u*I,r[4]=c*g+h*_+u*S,r[7]=c*p+h*x+u*T,r[2]=d*v+f*y+m*I,r[5]=d*g+f*_+m*S,r[8]=d*p+f*x+m*T,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,m=t*u+n*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/m;return e[0]=u*v,e[1]=(s*c-h*n)*v,e[2]=(a*n-s*o)*v,e[3]=d*v,e[4]=(h*t-s*l)*v,e[5]=(s*r-a*t)*v,e[6]=f*v,e[7]=(n*l-c*t)*v,e[8]=(o*t-n*r)*v,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(uc.makeScale(e,t)),this}rotate(e){return this.premultiply(uc.makeRotation(-e)),this}translate(e,t){return this.premultiply(uc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},uc=new ot;function ip(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Na(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Xm(){let i=Na("canvas");return i.style.display="block",i}var Bd={};function mo(i){i in Bd||(Bd[i]=!0,console.warn(i))}function qm(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function Ym(i){let e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Zm(i){let e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var ft={enabled:!0,workingColorSpace:Or,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===Tt&&(i.r=Fi(i.r),i.g=Fi(i.g),i.b=Fi(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===Tt&&(i.r=Sr(i.r),i.g=Sr(i.g),i.b=Sr(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ls?al:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Fi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Sr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Fd=[.64,.33,.3,.6,.15,.06],Od=[.2126,.7152,.0722],zd=[.3127,.329],Gd=new ot().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Vd=new ot().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ft.define({[Or]:{primaries:Fd,whitePoint:zd,transfer:al,toXYZ:Gd,fromXYZ:Vd,luminanceCoefficients:Od,workingColorSpaceConfig:{unpackColorSpace:ht},outputColorSpaceConfig:{drawingBufferColorSpace:ht}},[ht]:{primaries:Fd,whitePoint:zd,transfer:Tt,toXYZ:Gd,fromXYZ:Vd,luminanceCoefficients:Od,outputColorSpaceConfig:{drawingBufferColorSpace:ht}}});var or,Ah=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{or===void 0&&(or=Na("canvas")),or.width=e.width,or.height=e.height;let n=or.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=or}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Na("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Fi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Fi(t[n]/255)*255):t[n]=Fi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Km=0,Ha=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Km++}),this.uuid=Ws(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(dc(s[o].image)):r.push(dc(s[o]))}else r=dc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function dc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ah.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var $m=0,Pn=class i extends fs{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Hs,s=Hs,r=Vn,o=Bs,a=oi,l=zi,c=i.DEFAULT_ANISOTROPY,h=ls){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$m++}),this.uuid=Ws(),this.name="",this.source=new Ha(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Xf)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Oi:e.x=e.x-Math.floor(e.x);break;case Hs:e.x=e.x<0?0:1;break;case Qc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Oi:e.y=e.y-Math.floor(e.y);break;case Hs:e.y=e.y<0?0:1;break;case Qc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Pn.DEFAULT_IMAGE=null;Pn.DEFAULT_MAPPING=Xf;Pn.DEFAULT_ANISOTROPY=1;var At=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],v=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let _=(c+1)/2,x=(f+1)/2,I=(p+1)/2,S=(h+d)/4,T=(u+v)/4,C=(m+g)/4;return _>x&&_>I?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=S/n,r=T/n):x>I?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=S/s,r=C/s):I<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(I),n=T/r,s=C/r),this.set(n,s,r,t),this}let y=Math.sqrt((g-m)*(g-m)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(g-m)/y,this.y=(u-v)/y,this.z=(d-h)/y,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Rh=class extends fs{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new At(0,0,e,t),this.scissorTest=!1,this.viewport=new At(0,0,e,t);let s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Vn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new Pn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Ha(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Yn=class extends Rh{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ba=class extends Pn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Cn,this.minFilter=Cn,this.wrapR=Hs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ch=class extends Pn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Cn,this.minFilter=Cn,this.wrapR=Hs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Gt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],f=r[o+1],m=r[o+2],v=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=m,e[t+3]=v;return}if(u!==v||l!==d||c!==f||h!==m){let g=1-a,p=l*d+c*f+h*m+u*v,y=p>=0?1:-1,_=1-p*p;if(_>Number.EPSILON){let I=Math.sqrt(_),S=Math.atan2(I,p*y);g=Math.sin(g*S)/I,a=Math.sin(a*S)/I}let x=a*y;if(l=l*g+d*x,c=c*g+f*x,h=h*g+m*x,u=u*g+v*x,g===1-a){let I=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=I,c*=I,h*=I,u*=I}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],m=r[o+3];return e[t]=a*m+h*u+l*f-c*d,e[t+1]=l*m+h*d+c*u-a*f,e[t+2]=c*m+h*f+a*d-l*u,e[t+3]=h*m-a*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),f=l(s/2),m=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(tn(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},A=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Wd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Wd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return fc.copy(this).projectOnVector(e),this.sub(fc)}reflect(e){return this.sub(fc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(tn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},fc=new A,Wd=new Gt,Gi=class{constructor(e=new A(1/0,1/0,1/0),t=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ii.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ii.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ii.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ii):ii.fromBufferAttribute(r,o),ii.applyMatrix4(e.matrixWorld),this.expandByPoint(ii);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ea.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ea.copy(n.boundingBox)),ea.applyMatrix4(e.matrixWorld),this.union(ea)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ii),ii.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(oo),ta.subVectors(this.max,oo),ar.subVectors(e.a,oo),lr.subVectors(e.b,oo),cr.subVectors(e.c,oo),ns.subVectors(lr,ar),is.subVectors(cr,lr),As.subVectors(ar,cr);let t=[0,-ns.z,ns.y,0,-is.z,is.y,0,-As.z,As.y,ns.z,0,-ns.x,is.z,0,-is.x,As.z,0,-As.x,-ns.y,ns.x,0,-is.y,is.x,0,-As.y,As.x,0];return!pc(t,ar,lr,cr,ta)||(t=[1,0,0,0,1,0,0,0,1],!pc(t,ar,lr,cr,ta))?!1:(na.crossVectors(ns,is),t=[na.x,na.y,na.z],pc(t,ar,lr,cr,ta))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ii).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ii).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ii[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ii[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ii[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ii[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ii[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ii[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ii[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ii[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ii),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Ii=[new A,new A,new A,new A,new A,new A,new A,new A],ii=new A,ea=new Gi,ar=new A,lr=new A,cr=new A,ns=new A,is=new A,As=new A,oo=new A,ta=new A,na=new A,Rs=new A;function pc(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Rs.fromArray(i,r);let a=s.x*Math.abs(Rs.x)+s.y*Math.abs(Rs.y)+s.z*Math.abs(Rs.z),l=e.dot(Rs),c=t.dot(Rs),h=n.dot(Rs);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Jm=new Gi,ao=new A,mc=new A,Vi=class{constructor(e=new A,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Jm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ao.subVectors(e,this.center);let t=ao.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ao,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(mc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ao.copy(e.center).add(mc)),this.expandByPoint(ao.copy(e.center).sub(mc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},Li=new A,gc=new A,ia=new A,ss=new A,vc=new A,sa=new A,xc=new A,wo=class{constructor(e=new A,t=new A(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Li)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Li.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Li.copy(this.origin).addScaledVector(this.direction,t),Li.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){gc.copy(e).add(t).multiplyScalar(.5),ia.copy(t).sub(e).normalize(),ss.copy(this.origin).sub(gc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(ia),a=ss.dot(this.direction),l=-ss.dot(ia),c=ss.lengthSq(),h=Math.abs(1-o*o),u,d,f,m;if(h>0)if(u=o*l-a,d=o*a-l,m=r*h,u>=0)if(d>=-m)if(d<=m){let v=1/h;u*=v,d*=v,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(gc).addScaledVector(ia,d),f}intersectSphere(e,t){Li.subVectors(e.center,this.origin);let n=Li.dot(this.direction),s=Li.dot(Li)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Li)!==null}intersectTriangle(e,t,n,s,r){vc.subVectors(t,e),sa.subVectors(n,e),xc.crossVectors(vc,sa);let o=this.direction.dot(xc),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ss.subVectors(this.origin,e);let l=a*this.direction.dot(sa.crossVectors(ss,sa));if(l<0)return null;let c=a*this.direction.dot(vc.cross(ss));if(c<0||l+c>o)return null;let h=-a*ss.dot(xc);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},je=class i{constructor(e,t,n,s,r,o,a,l,c,h,u,d,f,m,v,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,u,d,f,m,v,g)}set(e,t,n,s,r,o,a,l,c,h,u,d,f,m,v,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/hr.setFromMatrixColumn(e,0).length(),r=1/hr.setFromMatrixColumn(e,1).length(),o=1/hr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=o*h,f=o*u,m=a*h,v=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+m*c,t[5]=d-v*c,t[9]=-a*l,t[2]=v-d*c,t[6]=m+f*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,m=c*h,v=c*u;t[0]=d+v*a,t[4]=m*a-f,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-m,t[6]=v+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,m=c*h,v=c*u;t[0]=d-v*a,t[4]=-o*u,t[8]=m+f*a,t[1]=f+m*a,t[5]=o*h,t[9]=v-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*h,f=o*u,m=a*h,v=a*u;t[0]=l*h,t[4]=m*c-f,t[8]=d*c+v,t[1]=l*u,t[5]=v*c+d,t[9]=f*c-m,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,f=o*c,m=a*l,v=a*c;t[0]=l*h,t[4]=v-d*u,t[8]=m*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*u+m,t[10]=d-v*u}else if(e.order==="XZY"){let d=o*l,f=o*c,m=a*l,v=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+v,t[5]=o*h,t[9]=f*u-m,t[2]=m*u-f,t[6]=a*h,t[10]=v*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(jm,e,Qm)}lookAt(e,t,n){let s=this.elements;return zn.subVectors(e,t),zn.lengthSq()===0&&(zn.z=1),zn.normalize(),rs.crossVectors(n,zn),rs.lengthSq()===0&&(Math.abs(n.z)===1?zn.x+=1e-4:zn.z+=1e-4,zn.normalize(),rs.crossVectors(n,zn)),rs.normalize(),ra.crossVectors(zn,rs),s[0]=rs.x,s[4]=ra.x,s[8]=zn.x,s[1]=rs.y,s[5]=ra.y,s[9]=zn.y,s[2]=rs.z,s[6]=ra.z,s[10]=zn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],v=n[6],g=n[10],p=n[14],y=n[3],_=n[7],x=n[11],I=n[15],S=s[0],T=s[4],C=s[8],E=s[12],M=s[1],P=s[5],k=s[9],H=s[13],F=s[2],W=s[6],N=s[10],Z=s[14],V=s[3],ee=s[7],he=s[11],xe=s[15];return r[0]=o*S+a*M+l*F+c*V,r[4]=o*T+a*P+l*W+c*ee,r[8]=o*C+a*k+l*N+c*he,r[12]=o*E+a*H+l*Z+c*xe,r[1]=h*S+u*M+d*F+f*V,r[5]=h*T+u*P+d*W+f*ee,r[9]=h*C+u*k+d*N+f*he,r[13]=h*E+u*H+d*Z+f*xe,r[2]=m*S+v*M+g*F+p*V,r[6]=m*T+v*P+g*W+p*ee,r[10]=m*C+v*k+g*N+p*he,r[14]=m*E+v*H+g*Z+p*xe,r[3]=y*S+_*M+x*F+I*V,r[7]=y*T+_*P+x*W+I*ee,r[11]=y*C+_*k+x*N+I*he,r[15]=y*E+_*H+x*Z+I*xe,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],m=e[3],v=e[7],g=e[11],p=e[15];return m*(+r*l*u-s*c*u-r*a*d+n*c*d+s*a*f-n*l*f)+v*(+t*l*f-t*c*d+r*o*d-s*o*f+s*c*h-r*l*h)+g*(+t*c*u-t*a*f-r*o*u+n*o*f+r*a*h-n*c*h)+p*(-s*a*h-t*l*u+t*a*d+s*o*u-n*o*d+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],m=e[12],v=e[13],g=e[14],p=e[15],y=u*g*c-v*d*c+v*l*f-a*g*f-u*l*p+a*d*p,_=m*d*c-h*g*c-m*l*f+o*g*f+h*l*p-o*d*p,x=h*v*c-m*u*c+m*a*f-o*v*f-h*a*p+o*u*p,I=m*u*l-h*v*l-m*a*d+o*v*d+h*a*g-o*u*g,S=t*y+n*_+s*x+r*I;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let T=1/S;return e[0]=y*T,e[1]=(v*d*r-u*g*r-v*s*f+n*g*f+u*s*p-n*d*p)*T,e[2]=(a*g*r-v*l*r+v*s*c-n*g*c-a*s*p+n*l*p)*T,e[3]=(u*l*r-a*d*r-u*s*c+n*d*c+a*s*f-n*l*f)*T,e[4]=_*T,e[5]=(h*g*r-m*d*r+m*s*f-t*g*f-h*s*p+t*d*p)*T,e[6]=(m*l*r-o*g*r-m*s*c+t*g*c+o*s*p-t*l*p)*T,e[7]=(o*d*r-h*l*r+h*s*c-t*d*c-o*s*f+t*l*f)*T,e[8]=x*T,e[9]=(m*u*r-h*v*r-m*n*f+t*v*f+h*n*p-t*u*p)*T,e[10]=(o*v*r-m*a*r+m*n*c-t*v*c-o*n*p+t*a*p)*T,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*f-t*a*f)*T,e[12]=I*T,e[13]=(h*v*s-m*u*s+m*n*d-t*v*d-h*n*g+t*u*g)*T,e[14]=(m*a*s-o*v*s-m*n*l+t*v*l+o*n*g-t*a*g)*T,e[15]=(o*u*s-h*a*s+h*n*l-t*u*l-o*n*d+t*a*d)*T,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,m=r*u,v=o*h,g=o*u,p=a*u,y=l*c,_=l*h,x=l*u,I=n.x,S=n.y,T=n.z;return s[0]=(1-(v+p))*I,s[1]=(f+x)*I,s[2]=(m-_)*I,s[3]=0,s[4]=(f-x)*S,s[5]=(1-(d+p))*S,s[6]=(g+y)*S,s[7]=0,s[8]=(m+_)*T,s[9]=(g-y)*T,s[10]=(1-(d+v))*T,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=hr.set(s[0],s[1],s[2]).length(),o=hr.set(s[4],s[5],s[6]).length(),a=hr.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],si.copy(this);let c=1/r,h=1/o,u=1/a;return si.elements[0]*=c,si.elements[1]*=c,si.elements[2]*=c,si.elements[4]*=h,si.elements[5]*=h,si.elements[6]*=h,si.elements[8]*=u,si.elements[9]*=u,si.elements[10]*=u,t.setFromRotationMatrix(si),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=Bi){let l=this.elements,c=2*r/(t-e),h=2*r/(n-s),u=(t+e)/(t-e),d=(n+s)/(n-s),f,m;if(a===Bi)f=-(o+r)/(o-r),m=-2*o*r/(o-r);else if(a===Ua)f=-o/(o-r),m=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Bi){let l=this.elements,c=1/(t-e),h=1/(n-s),u=1/(o-r),d=(t+e)*c,f=(n+s)*h,m,v;if(a===Bi)m=(o+r)*u,v=-2*u;else if(a===Ua)m=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=v,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},hr=new A,si=new je,jm=new A(0,0,0),Qm=new A(1,1,1),rs=new A,ra=new A,zn=new A,Xd=new je,qd=new Gt,pn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(tn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-tn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(tn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-tn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(tn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-tn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Xd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Xd,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return qd.setFromEuler(this),this.setFromQuaternion(qd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};pn.DEFAULT_ORDER="XYZ";var Fa=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},eg=0,Yd=new A,ur=new Gt,Di=new je,oa=new A,lo=new A,tg=new A,ng=new Gt,Zd=new A(1,0,0),Kd=new A(0,1,0),$d=new A(0,0,1),Jd={type:"added"},ig={type:"removed"},dr={type:"childadded",child:null},yc={type:"childremoved",child:null},nn=class i extends fs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:eg++}),this.uuid=Ws(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new A,t=new pn,n=new Gt,s=new A(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new je},normalMatrix:{value:new ot}}),this.matrix=new je,this.matrixWorld=new je,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Fa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ur.setFromAxisAngle(e,t),this.quaternion.multiply(ur),this}rotateOnWorldAxis(e,t){return ur.setFromAxisAngle(e,t),this.quaternion.premultiply(ur),this}rotateX(e){return this.rotateOnAxis(Zd,e)}rotateY(e){return this.rotateOnAxis(Kd,e)}rotateZ(e){return this.rotateOnAxis($d,e)}translateOnAxis(e,t){return Yd.copy(e).applyQuaternion(this.quaternion),this.position.add(Yd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Zd,e)}translateY(e){return this.translateOnAxis(Kd,e)}translateZ(e){return this.translateOnAxis($d,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Di.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?oa.copy(e):oa.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),lo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Di.lookAt(lo,oa,this.up):Di.lookAt(oa,lo,this.up),this.quaternion.setFromRotationMatrix(Di),s&&(Di.extractRotation(s.matrixWorld),ur.setFromRotationMatrix(Di),this.quaternion.premultiply(ur.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Jd),dr.child=e,this.dispatchEvent(dr),dr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ig),yc.child=e,this.dispatchEvent(yc),yc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Di.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Di.multiply(e.parent.matrixWorld)),e.applyMatrix4(Di),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Jd),dr.child=e,this.dispatchEvent(dr),dr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lo,e,tg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lo,ng,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),m=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};nn.DEFAULT_UP=new A(0,1,0);nn.DEFAULT_MATRIX_AUTO_UPDATE=!0;nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ri=new A,ki=new A,_c=new A,Ui=new A,fr=new A,pr=new A,jd=new A,Mc=new A,bc=new A,Ec=new A,wc=new At,Sc=new At,Tc=new At,Us=class i{constructor(e=new A,t=new A,n=new A){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),ri.subVectors(e,t),s.cross(ri);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){ri.subVectors(s,t),ki.subVectors(n,t),_c.subVectors(e,t);let o=ri.dot(ri),a=ri.dot(ki),l=ri.dot(_c),c=ki.dot(ki),h=ki.dot(_c),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,m=(o*h-a*l)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Ui)===null?!1:Ui.x>=0&&Ui.y>=0&&Ui.x+Ui.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Ui)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ui.x),l.addScaledVector(o,Ui.y),l.addScaledVector(a,Ui.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return wc.setScalar(0),Sc.setScalar(0),Tc.setScalar(0),wc.fromBufferAttribute(e,t),Sc.fromBufferAttribute(e,n),Tc.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(wc,r.x),o.addScaledVector(Sc,r.y),o.addScaledVector(Tc,r.z),o}static isFrontFacing(e,t,n,s){return ri.subVectors(n,t),ki.subVectors(e,t),ri.cross(ki).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ri.subVectors(this.c,this.b),ki.subVectors(this.a,this.b),ri.cross(ki).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;fr.subVectors(s,n),pr.subVectors(r,n),Mc.subVectors(e,n);let l=fr.dot(Mc),c=pr.dot(Mc);if(l<=0&&c<=0)return t.copy(n);bc.subVectors(e,s);let h=fr.dot(bc),u=pr.dot(bc);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(fr,o);Ec.subVectors(e,r);let f=fr.dot(Ec),m=pr.dot(Ec);if(m>=0&&f<=m)return t.copy(r);let v=f*c-l*m;if(v<=0&&c>=0&&m<=0)return a=c/(c-m),t.copy(n).addScaledVector(pr,a);let g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return jd.subVectors(r,s),a=(u-h)/(u-h+(f-m)),t.copy(s).addScaledVector(jd,a);let p=1/(g+v+d);return o=v*p,a=d*p,t.copy(n).addScaledVector(fr,o).addScaledVector(pr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},sp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},os={h:0,s:0,l:0},aa={h:0,s:0,l:0};function Ac(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Ue=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ht){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ft.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=ft.workingColorSpace){return this.r=e,this.g=t,this.b=n,ft.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=ft.workingColorSpace){if(e=Iu(e,1),t=tn(t,0,1),n=tn(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Ac(o,r,e+1/3),this.g=Ac(o,r,e),this.b=Ac(o,r,e-1/3)}return ft.toWorkingColorSpace(this,s),this}setStyle(e,t=ht){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ht){let n=sp[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Fi(e.r),this.g=Fi(e.g),this.b=Fi(e.b),this}copyLinearToSRGB(e){return this.r=Sr(e.r),this.g=Sr(e.g),this.b=Sr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ht){return ft.fromWorkingColorSpace(yn.copy(this),e),Math.round(tn(yn.r*255,0,255))*65536+Math.round(tn(yn.g*255,0,255))*256+Math.round(tn(yn.b*255,0,255))}getHexString(e=ht){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ft.workingColorSpace){ft.fromWorkingColorSpace(yn.copy(this),t);let n=yn.r,s=yn.g,r=yn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=ft.workingColorSpace){return ft.fromWorkingColorSpace(yn.copy(this),t),e.r=yn.r,e.g=yn.g,e.b=yn.b,e}getStyle(e=ht){ft.fromWorkingColorSpace(yn.copy(this),e);let t=yn.r,n=yn.g,s=yn.b;return e!==ht?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(os),this.setHSL(os.h+e,os.s+t,os.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(os),e.getHSL(aa);let n=xo(os.h,aa.h,t),s=xo(os.s,aa.s,t),r=xo(os.l,aa.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},yn=new Ue;Ue.NAMES=sp;var sg=0,_i=class extends fs{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:sg++}),this.uuid=Ws(),this.name="",this.blending=Er,this.side=yi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Vc,this.blendDst=bo,this.blendEquation=ks,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ue(0,0,0),this.blendAlpha=0,this.depthFunc=Ar,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=kd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=rr,this.stencilZFail=rr,this.stencilZPass=rr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Er&&(n.blending=this.blending),this.side!==yi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Vc&&(n.blendSrc=this.blendSrc),this.blendDst!==bo&&(n.blendDst=this.blendDst),this.blendEquation!==ks&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ar&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==kd&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==rr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==rr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==rr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},cn=class extends _i{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pn,this.combine=Mu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var $t=new A,la=new le,Ft=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ud,this.updateRanges=[],this.gpuType=xi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)la.fromBufferAttribute(this,t),la.applyMatrix3(e),this.setXY(t,la.x,la.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyMatrix3(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyMatrix4(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyNormalMatrix(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.transformDirection(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=_r(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=An(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=_r(t,this.array)),t}setX(e,t){return this.normalized&&(t=An(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=_r(t,this.array)),t}setY(e,t){return this.normalized&&(t=An(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=_r(t,this.array)),t}setZ(e,t){return this.normalized&&(t=An(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=_r(t,this.array)),t}setW(e,t){return this.normalized&&(t=An(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=An(t,this.array),n=An(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=An(t,this.array),n=An(n,this.array),s=An(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=An(t,this.array),n=An(n,this.array),s=An(s,this.array),r=An(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ud&&(e.usage=this.usage),e}};var Oa=class extends Ft{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var za=class extends Ft{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Ze=class extends Ft{constructor(e,t,n){super(new Float32Array(e),t,n)}},rg=0,qn=new je,Rc=new nn,mr=new A,Gn=new Gi,co=new Gi,ln=new A,xt=class i extends fs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:rg++}),this.uuid=Ws(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ip(e)?za:Oa)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new ot().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return qn.makeRotationFromQuaternion(e),this.applyMatrix4(qn),this}rotateX(e){return qn.makeRotationX(e),this.applyMatrix4(qn),this}rotateY(e){return qn.makeRotationY(e),this.applyMatrix4(qn),this}rotateZ(e){return qn.makeRotationZ(e),this.applyMatrix4(qn),this}translate(e,t,n){return qn.makeTranslation(e,t,n),this.applyMatrix4(qn),this}scale(e,t,n){return qn.makeScale(e,t,n),this.applyMatrix4(qn),this}lookAt(e){return Rc.lookAt(e),Rc.updateMatrix(),this.applyMatrix4(Rc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(mr).negate(),this.translate(mr.x,mr.y,mr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ze(n,3))}else{for(let n=0,s=t.count;n<s;n++){let r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Gi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Gn.setFromBufferAttribute(r),this.morphTargetsRelative?(ln.addVectors(this.boundingBox.min,Gn.min),this.boundingBox.expandByPoint(ln),ln.addVectors(this.boundingBox.max,Gn.max),this.boundingBox.expandByPoint(ln)):(this.boundingBox.expandByPoint(Gn.min),this.boundingBox.expandByPoint(Gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Vi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new A,1/0);return}if(e){let n=this.boundingSphere.center;if(Gn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];co.setFromBufferAttribute(a),this.morphTargetsRelative?(ln.addVectors(Gn.min,co.min),Gn.expandByPoint(ln),ln.addVectors(Gn.max,co.max),Gn.expandByPoint(ln)):(Gn.expandByPoint(co.min),Gn.expandByPoint(co.max))}Gn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)ln.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(ln));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)ln.fromBufferAttribute(a,c),l&&(mr.fromBufferAttribute(e,c),ln.add(mr)),s=Math.max(s,n.distanceToSquared(ln))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ft(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<n.count;C++)a[C]=new A,l[C]=new A;let c=new A,h=new A,u=new A,d=new le,f=new le,m=new le,v=new A,g=new A;function p(C,E,M){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,E),u.fromBufferAttribute(n,M),d.fromBufferAttribute(r,C),f.fromBufferAttribute(r,E),m.fromBufferAttribute(r,M),h.sub(c),u.sub(c),f.sub(d),m.sub(d);let P=1/(f.x*m.y-m.x*f.y);isFinite(P)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(P),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(P),a[C].add(v),a[E].add(v),a[M].add(v),l[C].add(g),l[E].add(g),l[M].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let C=0,E=y.length;C<E;++C){let M=y[C],P=M.start,k=M.count;for(let H=P,F=P+k;H<F;H+=3)p(e.getX(H+0),e.getX(H+1),e.getX(H+2))}let _=new A,x=new A,I=new A,S=new A;function T(C){I.fromBufferAttribute(s,C),S.copy(I);let E=a[C];_.copy(E),_.sub(I.multiplyScalar(I.dot(E))).normalize(),x.crossVectors(S,E);let P=x.dot(l[C])<0?-1:1;o.setXYZW(C,_.x,_.y,_.z,P)}for(let C=0,E=y.length;C<E;++C){let M=y[C],P=M.start,k=M.count;for(let H=P,F=P+k;H<F;H+=3)T(e.getX(H+0)),T(e.getX(H+1)),T(e.getX(H+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ft(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new A,r=new A,o=new A,a=new A,l=new A,c=new A,h=new A,u=new A;if(e)for(let d=0,f=e.count;d<f;d+=3){let m=e.getX(d+0),v=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,v),o.fromBufferAttribute(t,g),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,m),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)ln.fromBufferAttribute(e,t),ln.normalize(),e.setXYZ(t,ln.x,ln.y,ln.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,m=0;for(let v=0,g=l.length;v<g;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let p=0;p<h;p++)d[m++]=c[f++]}return new Ft(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Qd=new je,Cs=new wo,ca=new Vi,ef=new A,ha=new A,ua=new A,da=new A,Cc=new A,fa=new A,tf=new A,pa=new A,D=class extends nn{constructor(e=new xt,t=new cn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){fa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(Cc.fromBufferAttribute(u,e),o?fa.addScaledVector(Cc,h):fa.addScaledVector(Cc.sub(t),h))}t.add(fa)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ca.copy(n.boundingSphere),ca.applyMatrix4(r),Cs.copy(e.ray).recast(e.near),!(ca.containsPoint(Cs.origin)===!1&&(Cs.intersectSphere(ca,ef)===null||Cs.origin.distanceToSquared(ef)>(e.far-e.near)**2))&&(Qd.copy(r).invert(),Cs.copy(e.ray).applyMatrix4(Qd),!(n.boundingBox!==null&&Cs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Cs)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,v=d.length;m<v;m++){let g=d[m],p=o[g.materialIndex],y=Math.max(g.start,f.start),_=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let x=y,I=_;x<I;x+=3){let S=a.getX(x),T=a.getX(x+1),C=a.getX(x+2);s=ma(this,p,e,n,c,h,u,S,T,C),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){let y=a.getX(g),_=a.getX(g+1),x=a.getX(g+2);s=ma(this,o,e,n,c,h,u,y,_,x),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,v=d.length;m<v;m++){let g=d[m],p=o[g.materialIndex],y=Math.max(g.start,f.start),_=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let x=y,I=_;x<I;x+=3){let S=x,T=x+1,C=x+2;s=ma(this,p,e,n,c,h,u,S,T,C),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){let y=g,_=g+1,x=g+2;s=ma(this,o,e,n,c,h,u,y,_,x),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function og(i,e,t,n,s,r,o,a){let l;if(e.side===_n?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===yi,a),l===null)return null;pa.copy(a),pa.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(pa);return c<t.near||c>t.far?null:{distance:c,point:pa.clone(),object:i}}function ma(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,ha),i.getVertexPosition(l,ua),i.getVertexPosition(c,da);let h=og(i,e,t,n,ha,ua,da,tf);if(h){let u=new A;Us.getBarycoord(tf,ha,ua,da,u),s&&(h.uv=Us.getInterpolatedAttribute(s,a,l,c,u,new le)),r&&(h.uv1=Us.getInterpolatedAttribute(r,a,l,c,u,new le)),o&&(h.normal=Us.getInterpolatedAttribute(o,a,l,c,u,new A),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new A,materialIndex:0};Us.getNormal(ha,ua,da,d.normal),h.face=d,h.barycoord=u}return h}var Fe=class i extends xt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,n,t,e,o,r,0),m("z","y","x",1,-1,n,t,-e,o,r,1),m("x","z","y",1,1,e,n,t,s,o,2),m("x","z","y",1,-1,e,n,-t,s,o,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Ze(c,3)),this.setAttribute("normal",new Ze(h,3)),this.setAttribute("uv",new Ze(u,2));function m(v,g,p,y,_,x,I,S,T,C,E){let M=x/T,P=I/C,k=x/2,H=I/2,F=S/2,W=T+1,N=C+1,Z=0,V=0,ee=new A;for(let he=0;he<N;he++){let xe=he*P-H;for(let ke=0;ke<W;ke++){let Je=ke*M-k;ee[v]=Je*y,ee[g]=xe*_,ee[p]=F,c.push(ee.x,ee.y,ee.z),ee[v]=0,ee[g]=0,ee[p]=S>0?1:-1,h.push(ee.x,ee.y,ee.z),u.push(ke/T),u.push(1-he/C),Z+=1}}for(let he=0;he<C;he++)for(let xe=0;xe<T;xe++){let ke=d+xe+W*he,Je=d+xe+W*(he+1),K=d+(xe+1)+W*(he+1),oe=d+(xe+1)+W*he;l.push(ke,Je,oe),l.push(Je,K,oe),V+=6}a.addGroup(f,V,E),f+=V,d+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Dr(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Rn(i){let e={};for(let t=0;t<i.length;t++){let n=Dr(i[t]);for(let s in n)e[s]=n[s]}return e}function ag(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function rp(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ft.workingColorSpace}var lg={clone:Dr,merge:Rn},cg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,hg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Yt=class extends _i{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=cg,this.fragmentShader=hg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Dr(e.uniforms),this.uniformsGroups=ag(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Ga=class extends nn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new je,this.projectionMatrix=new je,this.projectionMatrixInverse=new je,this.coordinateSystem=Bi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},as=new A,nf=new le,sf=new le,Jt=class extends Ga{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Lr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(vo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Lr*2*Math.atan(Math.tan(vo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){as.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(as.x,as.y).multiplyScalar(-e/as.z),as.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(as.x,as.y).multiplyScalar(-e/as.z)}getViewSize(e,t){return this.getViewBounds(e,nf,sf),t.subVectors(sf,nf)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(vo*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},gr=-90,vr=1,Ph=class extends nn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Jt(gr,vr,e,t);s.layers=this.layers,this.add(s);let r=new Jt(gr,vr,e,t);r.layers=this.layers,this.add(r);let o=new Jt(gr,vr,e,t);o.layers=this.layers,this.add(o);let a=new Jt(gr,vr,e,t);a.layers=this.layers,this.add(a);let l=new Jt(gr,vr,e,t);l.layers=this.layers,this.add(l);let c=new Jt(gr,vr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===Bi)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ua)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},Va=class extends Pn{constructor(e,t,n,s,r,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Rr,super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ih=class extends Yn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Va(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Vn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Fe(5,5,5),r=new Yt({name:"CubemapFromEquirect",uniforms:Dr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:_n,blending:cs});r.uniforms.tEquirect.value=t;let o=new D(s,r),a=t.minFilter;return t.minFilter===Bs&&(t.minFilter=Vn),new Ph(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},Pc=new A,ug=new A,dg=new ot,Hi=class{constructor(e=new A(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Pc.subVectors(n,t).cross(ug.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Pc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||dg.getNormalMatrix(e),s=this.coplanarPoint(Pc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ps=new Vi,ga=new A,So=class{constructor(e=new Hi,t=new Hi,n=new Hi,s=new Hi,r=new Hi,o=new Hi){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Bi){let n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],f=s[8],m=s[9],v=s[10],g=s[11],p=s[12],y=s[13],_=s[14],x=s[15];if(n[0].setComponents(l-r,d-c,g-f,x-p).normalize(),n[1].setComponents(l+r,d+c,g+f,x+p).normalize(),n[2].setComponents(l+o,d+h,g+m,x+y).normalize(),n[3].setComponents(l-o,d-h,g-m,x-y).normalize(),n[4].setComponents(l-a,d-u,g-v,x-_).normalize(),t===Bi)n[5].setComponents(l+a,d+u,g+v,x+_).normalize();else if(t===Ua)n[5].setComponents(a,u,v,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ps.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ps.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ps)}intersectsSprite(e){return Ps.center.set(0,0,0),Ps.radius=.7071067811865476,Ps.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ps)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(ga.x=s.normal.x>0?e.max.x:e.min.x,ga.y=s.normal.y>0?e.max.y:e.min.y,ga.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ga)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function op(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function fg(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],v=u[f];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let v=u[f];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var et=class i extends xt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=e/a,d=t/l,f=[],m=[],v=[],g=[];for(let p=0;p<h;p++){let y=p*d-o;for(let _=0;_<c;_++){let x=_*u-r;m.push(x,-y,0),v.push(0,0,1),g.push(_/a),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<a;y++){let _=y+c*p,x=y+c*(p+1),I=y+1+c*(p+1),S=y+1+c*p;f.push(_,x,S),f.push(x,I,S)}this.setIndex(f),this.setAttribute("position",new Ze(m,3)),this.setAttribute("normal",new Ze(v,3)),this.setAttribute("uv",new Ze(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},pg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,mg=`#ifdef USE_ALPHAHASH
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
#endif`,gg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,yg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,_g=`#ifdef USE_AOMAP
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
#endif`,Mg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,bg=`#ifdef USE_BATCHING
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
#endif`,Eg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,wg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Sg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Tg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ag=`#ifdef USE_IRIDESCENCE
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
#endif`,Rg=`#ifdef USE_BUMPMAP
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
#endif`,Cg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Pg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ig=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Lg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Dg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,kg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ug=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ng=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Hg=`#define PI 3.141592653589793
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
} // validated`,Bg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Fg=`vec3 transformedNormal = objectNormal;
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
#endif`,Og=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,zg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Gg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Vg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Wg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Xg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,qg=`#ifdef USE_ENVMAP
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
#endif`,Yg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Zg=`#ifdef USE_ENVMAP
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
#endif`,Kg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$g=`#ifdef USE_ENVMAP
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
#endif`,Jg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,jg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Qg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ev=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,tv=`#ifdef USE_GRADIENTMAP
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
}`,nv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,iv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,sv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,rv=`uniform bool receiveShadow;
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
#endif`,ov=`#ifdef USE_ENVMAP
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
#endif`,av=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,cv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,hv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,uv=`PhysicalMaterial material;
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
#endif`,dv=`struct PhysicalMaterial {
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
}`,fv=`
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
#endif`,pv=`#if defined( RE_IndirectDiffuse )
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
#endif`,mv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,gv=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,vv=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xv=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yv=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,_v=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Mv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,bv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ev=`#if defined( USE_POINTS_UV )
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
#endif`,wv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Tv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Av=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Rv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cv=`#ifdef USE_MORPHTARGETS
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
#endif`,Pv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Iv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Lv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Dv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,kv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Uv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Nv=`#ifdef USE_NORMALMAP
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
#endif`,Hv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Bv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Fv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ov=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,zv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Gv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Vv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Wv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Xv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,qv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Yv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Zv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Kv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$v=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Jv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,jv=`float getShadowMask() {
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
}`,Qv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ex=`#ifdef USE_SKINNING
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
#endif`,tx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,nx=`#ifdef USE_SKINNING
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
#endif`,ix=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,sx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,rx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ox=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ax=`#ifdef USE_TRANSMISSION
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
#endif`,lx=`#ifdef USE_TRANSMISSION
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
#endif`,cx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ux=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,dx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,fx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,px=`uniform sampler2D t2D;
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
}`,mx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gx=`#ifdef ENVMAP_TYPE_CUBE
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
}`,vx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yx=`#include <common>
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
}`,_x=`#if DEPTH_PACKING == 3200
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
}`,Mx=`#define DISTANCE
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
}`,bx=`#define DISTANCE
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
}`,Ex=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,wx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sx=`uniform float scale;
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
}`,Tx=`uniform vec3 diffuse;
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
}`,Ax=`#include <common>
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
}`,Rx=`uniform vec3 diffuse;
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
}`,Cx=`#define LAMBERT
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
}`,Px=`#define LAMBERT
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
}`,Ix=`#define MATCAP
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
}`,Lx=`#define MATCAP
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
}`,Dx=`#define NORMAL
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
}`,kx=`#define NORMAL
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
}`,Ux=`#define PHONG
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
}`,Nx=`#define PHONG
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
}`,Hx=`#define STANDARD
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
}`,Bx=`#define STANDARD
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
}`,Fx=`#define TOON
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
}`,Ox=`#define TOON
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
}`,zx=`uniform float size;
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
}`,Gx=`uniform vec3 diffuse;
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
}`,Vx=`#include <common>
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
}`,Wx=`uniform vec3 color;
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
}`,Xx=`uniform float rotation;
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
}`,qx=`uniform vec3 diffuse;
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
}`,lt={alphahash_fragment:pg,alphahash_pars_fragment:mg,alphamap_fragment:gg,alphamap_pars_fragment:vg,alphatest_fragment:xg,alphatest_pars_fragment:yg,aomap_fragment:_g,aomap_pars_fragment:Mg,batching_pars_vertex:bg,batching_vertex:Eg,begin_vertex:wg,beginnormal_vertex:Sg,bsdfs:Tg,iridescence_fragment:Ag,bumpmap_pars_fragment:Rg,clipping_planes_fragment:Cg,clipping_planes_pars_fragment:Pg,clipping_planes_pars_vertex:Ig,clipping_planes_vertex:Lg,color_fragment:Dg,color_pars_fragment:kg,color_pars_vertex:Ug,color_vertex:Ng,common:Hg,cube_uv_reflection_fragment:Bg,defaultnormal_vertex:Fg,displacementmap_pars_vertex:Og,displacementmap_vertex:zg,emissivemap_fragment:Gg,emissivemap_pars_fragment:Vg,colorspace_fragment:Wg,colorspace_pars_fragment:Xg,envmap_fragment:qg,envmap_common_pars_fragment:Yg,envmap_pars_fragment:Zg,envmap_pars_vertex:Kg,envmap_physical_pars_fragment:ov,envmap_vertex:$g,fog_vertex:Jg,fog_pars_vertex:jg,fog_fragment:Qg,fog_pars_fragment:ev,gradientmap_pars_fragment:tv,lightmap_pars_fragment:nv,lights_lambert_fragment:iv,lights_lambert_pars_fragment:sv,lights_pars_begin:rv,lights_toon_fragment:av,lights_toon_pars_fragment:lv,lights_phong_fragment:cv,lights_phong_pars_fragment:hv,lights_physical_fragment:uv,lights_physical_pars_fragment:dv,lights_fragment_begin:fv,lights_fragment_maps:pv,lights_fragment_end:mv,logdepthbuf_fragment:gv,logdepthbuf_pars_fragment:vv,logdepthbuf_pars_vertex:xv,logdepthbuf_vertex:yv,map_fragment:_v,map_pars_fragment:Mv,map_particle_fragment:bv,map_particle_pars_fragment:Ev,metalnessmap_fragment:wv,metalnessmap_pars_fragment:Sv,morphinstance_vertex:Tv,morphcolor_vertex:Av,morphnormal_vertex:Rv,morphtarget_pars_vertex:Cv,morphtarget_vertex:Pv,normal_fragment_begin:Iv,normal_fragment_maps:Lv,normal_pars_fragment:Dv,normal_pars_vertex:kv,normal_vertex:Uv,normalmap_pars_fragment:Nv,clearcoat_normal_fragment_begin:Hv,clearcoat_normal_fragment_maps:Bv,clearcoat_pars_fragment:Fv,iridescence_pars_fragment:Ov,opaque_fragment:zv,packing:Gv,premultiplied_alpha_fragment:Vv,project_vertex:Wv,dithering_fragment:Xv,dithering_pars_fragment:qv,roughnessmap_fragment:Yv,roughnessmap_pars_fragment:Zv,shadowmap_pars_fragment:Kv,shadowmap_pars_vertex:$v,shadowmap_vertex:Jv,shadowmask_pars_fragment:jv,skinbase_vertex:Qv,skinning_pars_vertex:ex,skinning_vertex:tx,skinnormal_vertex:nx,specularmap_fragment:ix,specularmap_pars_fragment:sx,tonemapping_fragment:rx,tonemapping_pars_fragment:ox,transmission_fragment:ax,transmission_pars_fragment:lx,uv_pars_fragment:cx,uv_pars_vertex:hx,uv_vertex:ux,worldpos_vertex:dx,background_vert:fx,background_frag:px,backgroundCube_vert:mx,backgroundCube_frag:gx,cube_vert:vx,cube_frag:xx,depth_vert:yx,depth_frag:_x,distanceRGBA_vert:Mx,distanceRGBA_frag:bx,equirect_vert:Ex,equirect_frag:wx,linedashed_vert:Sx,linedashed_frag:Tx,meshbasic_vert:Ax,meshbasic_frag:Rx,meshlambert_vert:Cx,meshlambert_frag:Px,meshmatcap_vert:Ix,meshmatcap_frag:Lx,meshnormal_vert:Dx,meshnormal_frag:kx,meshphong_vert:Ux,meshphong_frag:Nx,meshphysical_vert:Hx,meshphysical_frag:Bx,meshtoon_vert:Fx,meshtoon_frag:Ox,points_vert:zx,points_frag:Gx,shadow_vert:Vx,shadow_frag:Wx,sprite_vert:Xx,sprite_frag:qx},Ae={common:{diffuse:{value:new Ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ot},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ot}},envmap:{envMap:{value:null},envMapRotation:{value:new ot},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ot},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0},uvTransform:{value:new ot}},sprite:{diffuse:{value:new Ue(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ot},alphaMap:{value:null},alphaMapTransform:{value:new ot},alphaTest:{value:0}}},vi={basic:{uniforms:Rn([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.fog]),vertexShader:lt.meshbasic_vert,fragmentShader:lt.meshbasic_frag},lambert:{uniforms:Rn([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new Ue(0)}}]),vertexShader:lt.meshlambert_vert,fragmentShader:lt.meshlambert_frag},phong:{uniforms:Rn([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new Ue(0)},specular:{value:new Ue(1118481)},shininess:{value:30}}]),vertexShader:lt.meshphong_vert,fragmentShader:lt.meshphong_frag},standard:{uniforms:Rn([Ae.common,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.roughnessmap,Ae.metalnessmap,Ae.fog,Ae.lights,{emissive:{value:new Ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:lt.meshphysical_vert,fragmentShader:lt.meshphysical_frag},toon:{uniforms:Rn([Ae.common,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.gradientmap,Ae.fog,Ae.lights,{emissive:{value:new Ue(0)}}]),vertexShader:lt.meshtoon_vert,fragmentShader:lt.meshtoon_frag},matcap:{uniforms:Rn([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,{matcap:{value:null}}]),vertexShader:lt.meshmatcap_vert,fragmentShader:lt.meshmatcap_frag},points:{uniforms:Rn([Ae.points,Ae.fog]),vertexShader:lt.points_vert,fragmentShader:lt.points_frag},dashed:{uniforms:Rn([Ae.common,Ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:lt.linedashed_vert,fragmentShader:lt.linedashed_frag},depth:{uniforms:Rn([Ae.common,Ae.displacementmap]),vertexShader:lt.depth_vert,fragmentShader:lt.depth_frag},normal:{uniforms:Rn([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,{opacity:{value:1}}]),vertexShader:lt.meshnormal_vert,fragmentShader:lt.meshnormal_frag},sprite:{uniforms:Rn([Ae.sprite,Ae.fog]),vertexShader:lt.sprite_vert,fragmentShader:lt.sprite_frag},background:{uniforms:{uvTransform:{value:new ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:lt.background_vert,fragmentShader:lt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ot}},vertexShader:lt.backgroundCube_vert,fragmentShader:lt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:lt.cube_vert,fragmentShader:lt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:lt.equirect_vert,fragmentShader:lt.equirect_frag},distanceRGBA:{uniforms:Rn([Ae.common,Ae.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:lt.distanceRGBA_vert,fragmentShader:lt.distanceRGBA_frag},shadow:{uniforms:Rn([Ae.lights,Ae.fog,{color:{value:new Ue(0)},opacity:{value:1}}]),vertexShader:lt.shadow_vert,fragmentShader:lt.shadow_frag}};vi.physical={uniforms:Rn([vi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ot},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ot},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ot},sheen:{value:0},sheenColor:{value:new Ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ot},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ot},attenuationDistance:{value:0},attenuationColor:{value:new Ue(0)},specularColor:{value:new Ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ot},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ot}}]),vertexShader:lt.meshphysical_vert,fragmentShader:lt.meshphysical_frag};var va={r:0,b:0,g:0},Is=new pn,Yx=new je;function Zx(i,e,t,n,s,r,o){let a=new Ue(0),l=r===!0?0:1,c,h,u=null,d=0,f=null;function m(y){let _=y.isScene===!0?y.background:null;return _&&_.isTexture&&(_=(y.backgroundBlurriness>0?t:e).get(_)),_}function v(y){let _=!1,x=m(y);x===null?p(a,l):x&&x.isColor&&(p(x,1),_=!0);let I=i.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,o):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(y,_){let x=m(_);x&&(x.isCubeTexture||x.mapping===ol)?(h===void 0&&(h=new D(new Fe(1,1,1),new Yt({name:"BackgroundCubeMaterial",uniforms:Dr(vi.backgroundCube.uniforms),vertexShader:vi.backgroundCube.vertexShader,fragmentShader:vi.backgroundCube.fragmentShader,side:_n,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(I,S,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Is.copy(_.backgroundRotation),Is.x*=-1,Is.y*=-1,Is.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Is.y*=-1,Is.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Yx.makeRotationFromEuler(Is)),h.material.toneMapped=ft.getTransfer(x.colorSpace)!==Tt,(u!==x||d!==x.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,f=i.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new D(new et(2,2),new Yt({name:"BackgroundMaterial",uniforms:Dr(vi.background.uniforms),vertexShader:vi.background.vertexShader,fragmentShader:vi.background.fragmentShader,side:yi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=ft.getTransfer(x.colorSpace)!==Tt,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=x,d=x.version,f=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,_){y.getRGB(va,rp(i)),n.buffers.color.setClear(va.r,va.g,va.b,_,o)}return{getClearColor:function(){return a},setClearColor:function(y,_=1){a.set(y),l=_,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(a,l)},render:v,addToRenderList:g}}function Kx(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(M,P,k,H,F){let W=!1,N=u(H,k,P);r!==N&&(r=N,c(r.object)),W=f(M,H,k,F),W&&m(M,H,k,F),F!==null&&e.update(F,i.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,x(M,P,k,H),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function u(M,P,k){let H=k.wireframe===!0,F=n[M.id];F===void 0&&(F={},n[M.id]=F);let W=F[P.id];W===void 0&&(W={},F[P.id]=W);let N=W[H];return N===void 0&&(N=d(l()),W[H]=N),N}function d(M){let P=[],k=[],H=[];for(let F=0;F<t;F++)P[F]=0,k[F]=0,H[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:k,attributeDivisors:H,object:M,attributes:{},index:null}}function f(M,P,k,H){let F=r.attributes,W=P.attributes,N=0,Z=k.getAttributes();for(let V in Z)if(Z[V].location>=0){let he=F[V],xe=W[V];if(xe===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(xe=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(xe=M.instanceColor)),he===void 0||he.attribute!==xe||xe&&he.data!==xe.data)return!0;N++}return r.attributesNum!==N||r.index!==H}function m(M,P,k,H){let F={},W=P.attributes,N=0,Z=k.getAttributes();for(let V in Z)if(Z[V].location>=0){let he=W[V];he===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(he=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(he=M.instanceColor));let xe={};xe.attribute=he,he&&he.data&&(xe.data=he.data),F[V]=xe,N++}r.attributes=F,r.attributesNum=N,r.index=H}function v(){let M=r.newAttributes;for(let P=0,k=M.length;P<k;P++)M[P]=0}function g(M){p(M,0)}function p(M,P){let k=r.newAttributes,H=r.enabledAttributes,F=r.attributeDivisors;k[M]=1,H[M]===0&&(i.enableVertexAttribArray(M),H[M]=1),F[M]!==P&&(i.vertexAttribDivisor(M,P),F[M]=P)}function y(){let M=r.newAttributes,P=r.enabledAttributes;for(let k=0,H=P.length;k<H;k++)P[k]!==M[k]&&(i.disableVertexAttribArray(k),P[k]=0)}function _(M,P,k,H,F,W,N){N===!0?i.vertexAttribIPointer(M,P,k,F,W):i.vertexAttribPointer(M,P,k,H,F,W)}function x(M,P,k,H){v();let F=H.attributes,W=k.getAttributes(),N=P.defaultAttributeValues;for(let Z in W){let V=W[Z];if(V.location>=0){let ee=F[Z];if(ee===void 0&&(Z==="instanceMatrix"&&M.instanceMatrix&&(ee=M.instanceMatrix),Z==="instanceColor"&&M.instanceColor&&(ee=M.instanceColor)),ee!==void 0){let he=ee.normalized,xe=ee.itemSize,ke=e.get(ee);if(ke===void 0)continue;let Je=ke.buffer,K=ke.type,oe=ke.bytesPerElement,ge=K===i.INT||K===i.UNSIGNED_INT||ee.gpuType===Eu;if(ee.isInterleavedBufferAttribute){let fe=ee.data,Te=fe.stride,He=ee.offset;if(fe.isInstancedInterleavedBuffer){for(let Xe=0;Xe<V.locationSize;Xe++)p(V.location+Xe,fe.meshPerAttribute);M.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let Xe=0;Xe<V.locationSize;Xe++)g(V.location+Xe);i.bindBuffer(i.ARRAY_BUFFER,Je);for(let Xe=0;Xe<V.locationSize;Xe++)_(V.location+Xe,xe/V.locationSize,K,he,Te*oe,(He+xe/V.locationSize*Xe)*oe,ge)}else{if(ee.isInstancedBufferAttribute){for(let fe=0;fe<V.locationSize;fe++)p(V.location+fe,ee.meshPerAttribute);M.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let fe=0;fe<V.locationSize;fe++)g(V.location+fe);i.bindBuffer(i.ARRAY_BUFFER,Je);for(let fe=0;fe<V.locationSize;fe++)_(V.location+fe,xe/V.locationSize,K,he,xe*oe,xe/V.locationSize*fe*oe,ge)}}else if(N!==void 0){let he=N[Z];if(he!==void 0)switch(he.length){case 2:i.vertexAttrib2fv(V.location,he);break;case 3:i.vertexAttrib3fv(V.location,he);break;case 4:i.vertexAttrib4fv(V.location,he);break;default:i.vertexAttrib1fv(V.location,he)}}}}y()}function I(){C();for(let M in n){let P=n[M];for(let k in P){let H=P[k];for(let F in H)h(H[F].object),delete H[F];delete P[k]}delete n[M]}}function S(M){if(n[M.id]===void 0)return;let P=n[M.id];for(let k in P){let H=P[k];for(let F in H)h(H[F].object),delete H[F];delete P[k]}delete n[M.id]}function T(M){for(let P in n){let k=n[P];if(k[M.id]===void 0)continue;let H=k[M.id];for(let F in H)h(H[F].object),delete H[F];delete k[M.id]}}function C(){E(),o=!0,r!==s&&(r=s,c(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:E,dispose:I,releaseStatesOfGeometry:S,releaseStatesOfProgram:T,initAttributes:v,enableAttribute:g,disableUnusedAttributes:y}}function $x(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];t.update(f,n,1)}function l(c,h,u,d){if(u===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<c.length;m++)o(c[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let m=0;for(let v=0;v<u;v++)m+=h[v]*d[v];t.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Jx(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let T=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(T){return!(T!==oi&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){let C=T===ps&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==zi&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==xi&&!C)}function l(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),_=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=m>0,S=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:y,maxVaryings:_,maxFragmentUniforms:x,vertexTextures:I,maxSamples:S}}function jx(i){let e=this,t=null,n=0,s=!1,r=!1,o=new Hi,a=new ot,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{let y=r?0:n,_=y*4,x=p.clippingState||null;l.value=x,x=h(m,d,_,f);for(let I=0;I!==_;++I)x[I]=t[I];p.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,m){let v=u!==null?u.length:0,g=null;if(v!==0){if(g=l.value,m!==!0||g===null){let p=f+v*4,y=d.matrixWorldInverse;a.getNormalMatrix(y),(g===null||g.length<p)&&(g=new Float32Array(p));for(let _=0,x=f;_!==v;++_,x+=4)o.copy(u[_]).applyMatrix4(y,a),o.normal.toArray(g,x),g[x+3]=o.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,g}}function Qx(i){let e=new WeakMap;function t(o,a){return a===Jc?o.mapping=Rr:a===jc&&(o.mapping=Cr),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Jc||a===jc)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new Ih(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var kr=class extends Ga{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Mr=4,rf=[.125,.215,.35,.446,.526,.582],Ns=20,Ic=new kr,of=new Ue,Lc=null,Dc=0,kc=0,Uc=!1,Ds=(1+Math.sqrt(5))/2,xr=1/Ds,af=[new A(-Ds,xr,0),new A(Ds,xr,0),new A(-xr,0,Ds),new A(xr,0,Ds),new A(0,Ds,-xr),new A(0,Ds,xr),new A(-1,1,-1),new A(1,1,-1),new A(-1,1,1),new A(1,1,1)],Ur=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Lc=this._renderer.getRenderTarget(),Dc=this._renderer.getActiveCubeFace(),kc=this._renderer.getActiveMipmapLevel(),Uc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Lc,Dc,kc),this._renderer.xr.enabled=Uc,e.scissorTest=!1,xa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Rr||e.mapping===Cr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Lc=this._renderer.getRenderTarget(),Dc=this._renderer.getActiveCubeFace(),kc=this._renderer.getActiveMipmapLevel(),Uc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Vn,minFilter:Vn,generateMipmaps:!1,type:ps,format:oi,colorSpace:Or,depthBuffer:!1},s=lf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=lf(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ey(r)),this._blurMaterial=ty(r,e,t)}return s}_compileMaterial(e){let t=new D(this._lodPlanes[0],e);this._renderer.compile(t,Ic)}_sceneToCubeUV(e,t,n,s){let a=new Jt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(of),h.toneMapping=hs,h.autoClear=!1;let f=new cn({name:"PMREM.Background",side:_n,depthWrite:!1,depthTest:!1}),m=new D(new Fe,f),v=!1,g=e.background;g?g.isColor&&(f.color.copy(g),e.background=null,v=!0):(f.color.copy(of),v=!0);for(let p=0;p<6;p++){let y=p%3;y===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):y===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));let _=this._cubeSize;xa(s,y*_,p>2?_:0,_,_),h.setRenderTarget(s),v&&h.render(m,a),h.render(e,a)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=g}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Rr||e.mapping===Cr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=hf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=cf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new D(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;xa(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Ic)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=af[(s-r-1)%af.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new D(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Ns-1),v=r/m,g=isFinite(r)?1+Math.floor(h*v):Ns;g>Ns&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ns}`);let p=[],y=0;for(let T=0;T<Ns;++T){let C=T/v,E=Math.exp(-C*C/2);p.push(E),T===0?y+=E:T<g&&(y+=2*E)}for(let T=0;T<p.length;T++)p[T]=p[T]/y;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:_}=this;d.dTheta.value=m,d.mipInt.value=_-n;let x=this._sizeLods[s],I=3*x*(s>_-Mr?s-_+Mr:0),S=4*(this._cubeSize-x);xa(t,I,S,3*x,2*x),l.setRenderTarget(t),l.render(u,Ic)}};function ey(i){let e=[],t=[],n=[],s=i,r=i-Mr+1+rf.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-Mr?l=rf[o-i+Mr-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,v=3,g=2,p=1,y=new Float32Array(v*m*f),_=new Float32Array(g*m*f),x=new Float32Array(p*m*f);for(let S=0;S<f;S++){let T=S%3*2/3-1,C=S>2?0:-1,E=[T,C,0,T+2/3,C,0,T+2/3,C+1,0,T,C,0,T+2/3,C+1,0,T,C+1,0];y.set(E,v*m*S),_.set(d,g*m*S);let M=[S,S,S,S,S,S];x.set(M,p*m*S)}let I=new xt;I.setAttribute("position",new Ft(y,v)),I.setAttribute("uv",new Ft(_,g)),I.setAttribute("faceIndex",new Ft(x,p)),e.push(I),s>Mr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function lf(i,e,t){let n=new Yn(i,e,t);return n.texture.mapping=ol,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function xa(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function ty(i,e,t){let n=new Float32Array(Ns),s=new A(0,1,0);return new Yt({name:"SphericalGaussianBlur",defines:{n:Ns,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Lu(),fragmentShader:`

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
		`,blending:cs,depthTest:!1,depthWrite:!1})}function cf(){return new Yt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Lu(),fragmentShader:`

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
		`,blending:cs,depthTest:!1,depthWrite:!1})}function hf(){return new Yt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Lu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:cs,depthTest:!1,depthWrite:!1})}function Lu(){return`

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
	`}function ny(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Jc||l===jc,h=l===Rr||l===Cr;if(c||h){let u=e.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Ur(i)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return c&&f&&f.height>0||h&&f&&s(f)?(t===null&&(t=new Ur(i)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function iy(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&mo("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function sy(i,e,t,n){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let m in d.attributes)e.remove(d.attributes[m]);for(let m in d.morphAttributes){let v=d.morphAttributes[m];for(let g=0,p=v.length;g<p;g++)e.remove(v[g])}d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let m in d)e.update(d[m],i.ARRAY_BUFFER);let f=u.morphAttributes;for(let m in f){let v=f[m];for(let g=0,p=v.length;g<p;g++)e.update(v[g],i.ARRAY_BUFFER)}}function c(u){let d=[],f=u.index,m=u.attributes.position,v=0;if(f!==null){let y=f.array;v=f.version;for(let _=0,x=y.length;_<x;_+=3){let I=y[_+0],S=y[_+1],T=y[_+2];d.push(I,S,S,T,T,I)}}else if(m!==void 0){let y=m.array;v=m.version;for(let _=0,x=y.length/3-1;_<x;_+=3){let I=_+0,S=_+1,T=_+2;d.push(I,S,S,T,T,I)}}else return;let g=new(ip(d)?za:Oa)(d,1);g.version=v;let p=r.get(u);p&&e.remove(p),r.set(u,g)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function ry(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*o),t.update(f,n,1)}function c(d,f,m){m!==0&&(i.drawElementsInstanced(n,f,r,d*o,m),t.update(f,n,m))}function h(d,f,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];t.update(g,n,1)}function u(d,f,m,v){if(m===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,v,0,m);let p=0;for(let y=0;y<m;y++)p+=f[y]*v[y];t.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function oy(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function ay(i,e,t){let n=new WeakMap,s=new At;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let E=function(){T.dispose(),n.delete(a),a.removeEventListener("dispose",E)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],y=a.morphAttributes.color||[],_=0;f===!0&&(_=1),m===!0&&(_=2),v===!0&&(_=3);let x=a.attributes.position.count*_,I=1;x>e.maxTextureSize&&(I=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let S=new Float32Array(x*I*4*u),T=new Ba(S,x,I,u);T.type=xi,T.needsUpdate=!0;let C=_*4;for(let M=0;M<u;M++){let P=g[M],k=p[M],H=y[M],F=x*I*4*M;for(let W=0;W<P.count;W++){let N=W*C;f===!0&&(s.fromBufferAttribute(P,W),S[F+N+0]=s.x,S[F+N+1]=s.y,S[F+N+2]=s.z,S[F+N+3]=0),m===!0&&(s.fromBufferAttribute(k,W),S[F+N+4]=s.x,S[F+N+5]=s.y,S[F+N+6]=s.z,S[F+N+7]=0),v===!0&&(s.fromBufferAttribute(H,W),S[F+N+8]=s.x,S[F+N+9]=s.y,S[F+N+10]=s.z,S[F+N+11]=H.itemSize===4?s.w:1)}}d={count:u,texture:T,size:new le(x,I)},n.set(a,d),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];let m=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function ly(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var Wa=class extends Pn{constructor(e,t,n,s,r,o,a,l,c,h=wr){if(h!==wr&&h!==Ir)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===wr&&(n=Fs),n===void 0&&h===Ir&&(n=Pr),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Cn,this.minFilter=l!==void 0?l:Cn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ap=new Pn,uf=new Wa(1,1),lp=new Ba,cp=new Ch,hp=new Va,df=[],ff=[],pf=new Float32Array(16),mf=new Float32Array(9),gf=new Float32Array(4);function Gr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=df[s];if(r===void 0&&(r=new Float32Array(s),df[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function sn(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function rn(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ll(i,e){let t=ff[e];t===void 0&&(t=new Int32Array(e),ff[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function cy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function hy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(sn(t,e))return;i.uniform2fv(this.addr,e),rn(t,e)}}function uy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(sn(t,e))return;i.uniform3fv(this.addr,e),rn(t,e)}}function dy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(sn(t,e))return;i.uniform4fv(this.addr,e),rn(t,e)}}function fy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(sn(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),rn(t,e)}else{if(sn(t,n))return;gf.set(n),i.uniformMatrix2fv(this.addr,!1,gf),rn(t,n)}}function py(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(sn(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),rn(t,e)}else{if(sn(t,n))return;mf.set(n),i.uniformMatrix3fv(this.addr,!1,mf),rn(t,n)}}function my(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(sn(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),rn(t,e)}else{if(sn(t,n))return;pf.set(n),i.uniformMatrix4fv(this.addr,!1,pf),rn(t,n)}}function gy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function vy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(sn(t,e))return;i.uniform2iv(this.addr,e),rn(t,e)}}function xy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(sn(t,e))return;i.uniform3iv(this.addr,e),rn(t,e)}}function yy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(sn(t,e))return;i.uniform4iv(this.addr,e),rn(t,e)}}function _y(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function My(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(sn(t,e))return;i.uniform2uiv(this.addr,e),rn(t,e)}}function by(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(sn(t,e))return;i.uniform3uiv(this.addr,e),rn(t,e)}}function Ey(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(sn(t,e))return;i.uniform4uiv(this.addr,e),rn(t,e)}}function wy(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(uf.compareFunction=tp,r=uf):r=ap,t.setTexture2D(e||r,s)}function Sy(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||cp,s)}function Ty(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||hp,s)}function Ay(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||lp,s)}function Ry(i){switch(i){case 5126:return cy;case 35664:return hy;case 35665:return uy;case 35666:return dy;case 35674:return fy;case 35675:return py;case 35676:return my;case 5124:case 35670:return gy;case 35667:case 35671:return vy;case 35668:case 35672:return xy;case 35669:case 35673:return yy;case 5125:return _y;case 36294:return My;case 36295:return by;case 36296:return Ey;case 35678:case 36198:case 36298:case 36306:case 35682:return wy;case 35679:case 36299:case 36307:return Sy;case 35680:case 36300:case 36308:case 36293:return Ty;case 36289:case 36303:case 36311:case 36292:return Ay}}function Cy(i,e){i.uniform1fv(this.addr,e)}function Py(i,e){let t=Gr(e,this.size,2);i.uniform2fv(this.addr,t)}function Iy(i,e){let t=Gr(e,this.size,3);i.uniform3fv(this.addr,t)}function Ly(i,e){let t=Gr(e,this.size,4);i.uniform4fv(this.addr,t)}function Dy(i,e){let t=Gr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function ky(i,e){let t=Gr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Uy(i,e){let t=Gr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Ny(i,e){i.uniform1iv(this.addr,e)}function Hy(i,e){i.uniform2iv(this.addr,e)}function By(i,e){i.uniform3iv(this.addr,e)}function Fy(i,e){i.uniform4iv(this.addr,e)}function Oy(i,e){i.uniform1uiv(this.addr,e)}function zy(i,e){i.uniform2uiv(this.addr,e)}function Gy(i,e){i.uniform3uiv(this.addr,e)}function Vy(i,e){i.uniform4uiv(this.addr,e)}function Wy(i,e,t){let n=this.cache,s=e.length,r=ll(t,s);sn(n,r)||(i.uniform1iv(this.addr,r),rn(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||ap,r[o])}function Xy(i,e,t){let n=this.cache,s=e.length,r=ll(t,s);sn(n,r)||(i.uniform1iv(this.addr,r),rn(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||cp,r[o])}function qy(i,e,t){let n=this.cache,s=e.length,r=ll(t,s);sn(n,r)||(i.uniform1iv(this.addr,r),rn(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||hp,r[o])}function Yy(i,e,t){let n=this.cache,s=e.length,r=ll(t,s);sn(n,r)||(i.uniform1iv(this.addr,r),rn(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||lp,r[o])}function Zy(i){switch(i){case 5126:return Cy;case 35664:return Py;case 35665:return Iy;case 35666:return Ly;case 35674:return Dy;case 35675:return ky;case 35676:return Uy;case 5124:case 35670:return Ny;case 35667:case 35671:return Hy;case 35668:case 35672:return By;case 35669:case 35673:return Fy;case 5125:return Oy;case 36294:return zy;case 36295:return Gy;case 36296:return Vy;case 35678:case 36198:case 36298:case 36306:case 35682:return Wy;case 35679:case 36299:case 36307:return Xy;case 35680:case 36300:case 36308:case 36293:return qy;case 36289:case 36303:case 36311:case 36292:return Yy}}var Lh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ry(t.type)}},Dh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Zy(t.type)}},kh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},Nc=/(\w+)(\])?(\[|\.)?/g;function vf(i,e){i.seq.push(e),i.map[e.id]=e}function Ky(i,e,t){let n=i.name,s=n.length;for(Nc.lastIndex=0;;){let r=Nc.exec(n),o=Nc.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){vf(t,c===void 0?new Lh(a,i,e):new Dh(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new kh(a),vf(t,u)),t=u}}}var Tr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Ky(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function xf(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var $y=37297,Jy=0;function jy(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var yf=new ot;function Qy(i){ft._getMatrix(yf,ft.workingColorSpace,i);let e=`mat3( ${yf.elements.map(t=>t.toFixed(4))} )`;switch(ft.getTransfer(i)){case al:return[e,"LinearTransferOETF"];case Tt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function _f(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+jy(i.getShaderSource(e),o)}else return s}function e1(i,e){let t=Qy(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function t1(i,e){let t;switch(e){case dm:t="Linear";break;case fm:t="Reinhard";break;case pm:t="Cineon";break;case bu:t="ACESFilmic";break;case gm:t="AgX";break;case vm:t="Neutral";break;case mm:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var ya=new A;function n1(){ft.getLuminanceCoefficients(ya);let i=ya.x.toFixed(4),e=ya.y.toFixed(4),t=ya.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function i1(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(go).join(`
`)}function s1(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function r1(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function go(i){return i!==""}function Mf(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function bf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var o1=/^[ \t]*#include +<([\w\d./]+)>/gm;function Uh(i){return i.replace(o1,l1)}var a1=new Map;function l1(i,e){let t=lt[e];if(t===void 0){let n=a1.get(e);if(n!==void 0)t=lt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Uh(t)}var c1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ef(i){return i.replace(c1,h1)}function h1(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function wf(i){let e=`precision ${i.precision} float;
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
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function u1(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Wf?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===xu?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ni&&(e="SHADOWMAP_TYPE_VSM"),e}function d1(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Rr:case Cr:e="ENVMAP_TYPE_CUBE";break;case ol:e="ENVMAP_TYPE_CUBE_UV";break}return e}function f1(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Cr:e="ENVMAP_MODE_REFRACTION";break}return e}function p1(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Mu:e="ENVMAP_BLENDING_MULTIPLY";break;case hm:e="ENVMAP_BLENDING_MIX";break;case um:e="ENVMAP_BLENDING_ADD";break}return e}function m1(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function g1(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=u1(t),c=d1(t),h=f1(t),u=p1(t),d=m1(t),f=i1(t),m=s1(r),v=s.createProgram(),g,p,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(go).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(go).join(`
`),p.length>0&&(p+=`
`)):(g=[wf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(go).join(`
`),p=[wf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==hs?"#define TONE_MAPPING":"",t.toneMapping!==hs?lt.tonemapping_pars_fragment:"",t.toneMapping!==hs?t1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",lt.colorspace_pars_fragment,e1("linearToOutputTexel",t.outputColorSpace),n1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(go).join(`
`)),o=Uh(o),o=Mf(o,t),o=bf(o,t),a=Uh(a),a=Mf(a,t),a=bf(a,t),o=Ef(o),a=Ef(a),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===Nd?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Nd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let _=y+g+o,x=y+p+a,I=xf(s,s.VERTEX_SHADER,_),S=xf(s,s.FRAGMENT_SHADER,x);s.attachShader(v,I),s.attachShader(v,S),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function T(P){if(i.debug.checkShaderErrors){let k=s.getProgramInfoLog(v).trim(),H=s.getShaderInfoLog(I).trim(),F=s.getShaderInfoLog(S).trim(),W=!0,N=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,I,S);else{let Z=_f(s,I,"vertex"),V=_f(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+k+`
`+Z+`
`+V)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(H===""||F==="")&&(N=!1);N&&(P.diagnostics={runnable:W,programLog:k,vertexShader:{log:H,prefix:g},fragmentShader:{log:F,prefix:p}})}s.deleteShader(I),s.deleteShader(S),C=new Tr(s,v),E=r1(s,v)}let C;this.getUniforms=function(){return C===void 0&&T(this),C};let E;this.getAttributes=function(){return E===void 0&&T(this),E};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(v,$y)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Jy++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=I,this.fragmentShader=S,this}var v1=0,Nh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Hh(e),t.set(e,n)),n}},Hh=class{constructor(e){this.id=v1++,this.code=e,this.usedTimes=0}};function x1(i,e,t,n,s,r,o){let a=new Fa,l=new Nh,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(E){return c.add(E),E===0?"uv":`uv${E}`}function g(E,M,P,k,H){let F=k.fog,W=H.geometry,N=E.isMeshStandardMaterial?k.environment:null,Z=(E.isMeshStandardMaterial?t:e).get(E.envMap||N),V=Z&&Z.mapping===ol?Z.image.height:null,ee=m[E.type];E.precision!==null&&(f=s.getMaxPrecision(E.precision),f!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",f,"instead."));let he=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,xe=he!==void 0?he.length:0,ke=0;W.morphAttributes.position!==void 0&&(ke=1),W.morphAttributes.normal!==void 0&&(ke=2),W.morphAttributes.color!==void 0&&(ke=3);let Je,K,oe,ge;if(ee){let wt=vi[ee];Je=wt.vertexShader,K=wt.fragmentShader}else Je=E.vertexShader,K=E.fragmentShader,l.update(E),oe=l.getVertexShaderID(E),ge=l.getFragmentShaderID(E);let fe=i.getRenderTarget(),Te=i.state.buffers.depth.getReversed(),He=H.isInstancedMesh===!0,Xe=H.isBatchedMesh===!0,Qe=!!E.map,Q=!!E.matcap,me=!!Z,L=!!E.aoMap,Be=!!E.lightMap,se=!!E.bumpMap,ie=!!E.normalMap,ae=!!E.displacementMap,Pe=!!E.emissiveMap,Me=!!E.metalnessMap,R=!!E.roughnessMap,b=E.anisotropy>0,G=E.clearcoat>0,$=E.dispersion>0,te=E.iridescence>0,B=E.sheen>0,ne=E.transmission>0,pe=b&&!!E.anisotropyMap,ye=G&&!!E.clearcoatMap,Ye=G&&!!E.clearcoatNormalMap,ue=G&&!!E.clearcoatRoughnessMap,Ce=te&&!!E.iridescenceMap,Ve=te&&!!E.iridescenceThicknessMap,$e=B&&!!E.sheenColorMap,Le=B&&!!E.sheenRoughnessMap,j=!!E.specularMap,ve=!!E.specularColorMap,be=!!E.specularIntensityMap,U=ne&&!!E.transmissionMap,de=ne&&!!E.thicknessMap,Y=!!E.gradientMap,re=!!E.alphaMap,Ie=E.alphaTest>0,Re=!!E.alphaHash,st=!!E.extensions,zt=hs;E.toneMapped&&(fe===null||fe.isXRRenderTarget===!0)&&(zt=i.toneMapping);let vn={shaderID:ee,shaderType:E.type,shaderName:E.name,vertexShader:Je,fragmentShader:K,defines:E.defines,customVertexShaderID:oe,customFragmentShaderID:ge,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:f,batching:Xe,batchingColor:Xe&&H._colorsTexture!==null,instancing:He,instancingColor:He&&H.instanceColor!==null,instancingMorph:He&&H.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:fe===null?i.outputColorSpace:fe.isXRRenderTarget===!0?fe.texture.colorSpace:Or,alphaToCoverage:!!E.alphaToCoverage,map:Qe,matcap:Q,envMap:me,envMapMode:me&&Z.mapping,envMapCubeUVHeight:V,aoMap:L,lightMap:Be,bumpMap:se,normalMap:ie,displacementMap:d&&ae,emissiveMap:Pe,normalMapObjectSpace:ie&&E.normalMapType===Mm,normalMapTangentSpace:ie&&E.normalMapType===Pu,metalnessMap:Me,roughnessMap:R,anisotropy:b,anisotropyMap:pe,clearcoat:G,clearcoatMap:ye,clearcoatNormalMap:Ye,clearcoatRoughnessMap:ue,dispersion:$,iridescence:te,iridescenceMap:Ce,iridescenceThicknessMap:Ve,sheen:B,sheenColorMap:$e,sheenRoughnessMap:Le,specularMap:j,specularColorMap:ve,specularIntensityMap:be,transmission:ne,transmissionMap:U,thicknessMap:de,gradientMap:Y,opaque:E.transparent===!1&&E.blending===Er&&E.alphaToCoverage===!1,alphaMap:re,alphaTest:Ie,alphaHash:Re,combine:E.combine,mapUv:Qe&&v(E.map.channel),aoMapUv:L&&v(E.aoMap.channel),lightMapUv:Be&&v(E.lightMap.channel),bumpMapUv:se&&v(E.bumpMap.channel),normalMapUv:ie&&v(E.normalMap.channel),displacementMapUv:ae&&v(E.displacementMap.channel),emissiveMapUv:Pe&&v(E.emissiveMap.channel),metalnessMapUv:Me&&v(E.metalnessMap.channel),roughnessMapUv:R&&v(E.roughnessMap.channel),anisotropyMapUv:pe&&v(E.anisotropyMap.channel),clearcoatMapUv:ye&&v(E.clearcoatMap.channel),clearcoatNormalMapUv:Ye&&v(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ue&&v(E.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&v(E.iridescenceMap.channel),iridescenceThicknessMapUv:Ve&&v(E.iridescenceThicknessMap.channel),sheenColorMapUv:$e&&v(E.sheenColorMap.channel),sheenRoughnessMapUv:Le&&v(E.sheenRoughnessMap.channel),specularMapUv:j&&v(E.specularMap.channel),specularColorMapUv:ve&&v(E.specularColorMap.channel),specularIntensityMapUv:be&&v(E.specularIntensityMap.channel),transmissionMapUv:U&&v(E.transmissionMap.channel),thicknessMapUv:de&&v(E.thicknessMap.channel),alphaMapUv:re&&v(E.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(ie||b),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!W.attributes.uv&&(Qe||re),fog:!!F,useFog:E.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Te,skinning:H.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:ke,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:zt,decodeVideoTexture:Qe&&E.map.isVideoTexture===!0&&ft.getTransfer(E.map.colorSpace)===Tt,decodeVideoTextureEmissive:Pe&&E.emissiveMap.isVideoTexture===!0&&ft.getTransfer(E.emissiveMap.colorSpace)===Tt,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===dt,flipSided:E.side===_n,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:st&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(st&&E.extensions.multiDraw===!0||Xe)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return vn.vertexUv1s=c.has(1),vn.vertexUv2s=c.has(2),vn.vertexUv3s=c.has(3),c.clear(),vn}function p(E){let M=[];if(E.shaderID?M.push(E.shaderID):(M.push(E.customVertexShaderID),M.push(E.customFragmentShaderID)),E.defines!==void 0)for(let P in E.defines)M.push(P),M.push(E.defines[P]);return E.isRawShaderMaterial===!1&&(y(M,E),_(M,E),M.push(i.outputColorSpace)),M.push(E.customProgramCacheKey),M.join()}function y(E,M){E.push(M.precision),E.push(M.outputColorSpace),E.push(M.envMapMode),E.push(M.envMapCubeUVHeight),E.push(M.mapUv),E.push(M.alphaMapUv),E.push(M.lightMapUv),E.push(M.aoMapUv),E.push(M.bumpMapUv),E.push(M.normalMapUv),E.push(M.displacementMapUv),E.push(M.emissiveMapUv),E.push(M.metalnessMapUv),E.push(M.roughnessMapUv),E.push(M.anisotropyMapUv),E.push(M.clearcoatMapUv),E.push(M.clearcoatNormalMapUv),E.push(M.clearcoatRoughnessMapUv),E.push(M.iridescenceMapUv),E.push(M.iridescenceThicknessMapUv),E.push(M.sheenColorMapUv),E.push(M.sheenRoughnessMapUv),E.push(M.specularMapUv),E.push(M.specularColorMapUv),E.push(M.specularIntensityMapUv),E.push(M.transmissionMapUv),E.push(M.thicknessMapUv),E.push(M.combine),E.push(M.fogExp2),E.push(M.sizeAttenuation),E.push(M.morphTargetsCount),E.push(M.morphAttributeCount),E.push(M.numDirLights),E.push(M.numPointLights),E.push(M.numSpotLights),E.push(M.numSpotLightMaps),E.push(M.numHemiLights),E.push(M.numRectAreaLights),E.push(M.numDirLightShadows),E.push(M.numPointLightShadows),E.push(M.numSpotLightShadows),E.push(M.numSpotLightShadowsWithMaps),E.push(M.numLightProbes),E.push(M.shadowMapType),E.push(M.toneMapping),E.push(M.numClippingPlanes),E.push(M.numClipIntersection),E.push(M.depthPacking)}function _(E,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),E.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),E.push(a.mask)}function x(E){let M=m[E.type],P;if(M){let k=vi[M];P=lg.clone(k.uniforms)}else P=E.uniforms;return P}function I(E,M){let P;for(let k=0,H=h.length;k<H;k++){let F=h[k];if(F.cacheKey===M){P=F,++P.usedTimes;break}}return P===void 0&&(P=new g1(i,M,E,r),h.push(P)),P}function S(E){if(--E.usedTimes===0){let M=h.indexOf(E);h[M]=h[h.length-1],h.pop(),E.destroy()}}function T(E){l.remove(E)}function C(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:x,acquireProgram:I,releaseProgram:S,releaseShaderCache:T,programs:h,dispose:C}}function y1(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function _1(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Sf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Tf(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,d,f,m,v,g){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:v,group:g},i[e]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=v,p.group=g),e++,p}function a(u,d,f,m,v,g){let p=o(u,d,f,m,v,g);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):t.push(p)}function l(u,d,f,m,v,g){let p=o(u,d,f,m,v,g);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function c(u,d){t.length>1&&t.sort(u||_1),n.length>1&&n.sort(d||Sf),s.length>1&&s.sort(d||Sf)}function h(){for(let u=e,d=i.length;u<d;u++){let f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function M1(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Tf,i.set(n,[o])):s>=r.length?(o=new Tf,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function b1(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new A,color:new Ue};break;case"SpotLight":t={position:new A,direction:new A,color:new Ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new A,color:new Ue,distance:0,decay:0};break;case"HemisphereLight":t={direction:new A,skyColor:new Ue,groundColor:new Ue};break;case"RectAreaLight":t={color:new Ue,position:new A,halfWidth:new A,halfHeight:new A};break}return i[e.id]=t,t}}}function E1(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var w1=0;function S1(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function T1(i){let e=new b1,t=E1(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new A);let s=new A,r=new je,o=new je;function a(c){let h=0,u=0,d=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let f=0,m=0,v=0,g=0,p=0,y=0,_=0,x=0,I=0,S=0,T=0;c.sort(S1);for(let E=0,M=c.length;E<M;E++){let P=c[E],k=P.color,H=P.intensity,F=P.distance,W=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=k.r*H,u+=k.g*H,d+=k.b*H;else if(P.isLightProbe){for(let N=0;N<9;N++)n.probe[N].addScaledVector(P.sh.coefficients[N],H);T++}else if(P.isDirectionalLight){let N=e.get(P);if(N.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let Z=P.shadow,V=t.get(P);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.directionalShadow[f]=V,n.directionalShadowMap[f]=W,n.directionalShadowMatrix[f]=P.shadow.matrix,y++}n.directional[f]=N,f++}else if(P.isSpotLight){let N=e.get(P);N.position.setFromMatrixPosition(P.matrixWorld),N.color.copy(k).multiplyScalar(H),N.distance=F,N.coneCos=Math.cos(P.angle),N.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),N.decay=P.decay,n.spot[v]=N;let Z=P.shadow;if(P.map&&(n.spotLightMap[I]=P.map,I++,Z.updateMatrices(P),P.castShadow&&S++),n.spotLightMatrix[v]=Z.matrix,P.castShadow){let V=t.get(P);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.spotShadow[v]=V,n.spotShadowMap[v]=W,x++}v++}else if(P.isRectAreaLight){let N=e.get(P);N.color.copy(k).multiplyScalar(H),N.halfWidth.set(P.width*.5,0,0),N.halfHeight.set(0,P.height*.5,0),n.rectArea[g]=N,g++}else if(P.isPointLight){let N=e.get(P);if(N.color.copy(P.color).multiplyScalar(P.intensity),N.distance=P.distance,N.decay=P.decay,P.castShadow){let Z=P.shadow,V=t.get(P);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,V.shadowCameraNear=Z.camera.near,V.shadowCameraFar=Z.camera.far,n.pointShadow[m]=V,n.pointShadowMap[m]=W,n.pointShadowMatrix[m]=P.shadow.matrix,_++}n.point[m]=N,m++}else if(P.isHemisphereLight){let N=e.get(P);N.skyColor.copy(P.color).multiplyScalar(H),N.groundColor.copy(P.groundColor).multiplyScalar(H),n.hemi[p]=N,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ae.LTC_FLOAT_1,n.rectAreaLTC2=Ae.LTC_FLOAT_2):(n.rectAreaLTC1=Ae.LTC_HALF_1,n.rectAreaLTC2=Ae.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let C=n.hash;(C.directionalLength!==f||C.pointLength!==m||C.spotLength!==v||C.rectAreaLength!==g||C.hemiLength!==p||C.numDirectionalShadows!==y||C.numPointShadows!==_||C.numSpotShadows!==x||C.numSpotMaps!==I||C.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=x+I-S,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=T,C.directionalLength=f,C.pointLength=m,C.spotLength=v,C.rectAreaLength=g,C.hemiLength=p,C.numDirectionalShadows=y,C.numPointShadows=_,C.numSpotShadows=x,C.numSpotMaps=I,C.numLightProbes=T,n.version=w1++)}function l(c,h){let u=0,d=0,f=0,m=0,v=0,g=h.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){let _=c[p];if(_.isDirectionalLight){let x=n.directional[u];x.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),u++}else if(_.isSpotLight){let x=n.spot[f];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(g),x.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),f++}else if(_.isRectAreaLight){let x=n.rectArea[m];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(g),o.identity(),r.copy(_.matrixWorld),r.premultiply(g),o.extractRotation(r),x.halfWidth.set(_.width*.5,0,0),x.halfHeight.set(0,_.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),m++}else if(_.isPointLight){let x=n.point[d];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(g),d++}else if(_.isHemisphereLight){let x=n.hemi[v];x.direction.setFromMatrixPosition(_.matrixWorld),x.direction.transformDirection(g),v++}}}return{setup:a,setupView:l,state:n}}function Af(i){let e=new T1(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function A1(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Af(i),e.set(s,[a])):r>=o.length?(a=new Af(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var Bh=class extends _i{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=ym,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Fh=class extends _i{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},R1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,C1=`uniform sampler2D shadow_pass;
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
}`;function P1(i,e,t){let n=new So,s=new le,r=new le,o=new At,a=new Bh({depthPacking:_m}),l=new Fh,c={},h=t.maxTextureSize,u={[yi]:_n,[_n]:yi,[dt]:dt},d=new Yt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:R1,fragmentShader:C1}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new xt;m.setAttribute("position",new Ft(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new D(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Wf;let p=this.type;this.render=function(S,T,C){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;let E=i.getRenderTarget(),M=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),k=i.state;k.setBlending(cs),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let H=p!==Ni&&this.type===Ni,F=p===Ni&&this.type!==Ni;for(let W=0,N=S.length;W<N;W++){let Z=S[W],V=Z.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);let ee=V.getFrameExtents();if(s.multiply(ee),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ee.x),s.x=r.x*ee.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ee.y),s.y=r.y*ee.y,V.mapSize.y=r.y)),V.map===null||H===!0||F===!0){let xe=this.type!==Ni?{minFilter:Cn,magFilter:Cn}:{};V.map!==null&&V.map.dispose(),V.map=new Yn(s.x,s.y,xe),V.map.texture.name=Z.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();let he=V.getViewportCount();for(let xe=0;xe<he;xe++){let ke=V.getViewport(xe);o.set(r.x*ke.x,r.y*ke.y,r.x*ke.z,r.y*ke.w),k.viewport(o),V.updateMatrices(Z,xe),n=V.getFrustum(),x(T,C,V.camera,Z,this.type)}V.isPointLightShadow!==!0&&this.type===Ni&&y(V,C),V.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(E,M,P)};function y(S,T){let C=e.update(v);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Yn(s.x,s.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(T,null,C,d,v,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(T,null,C,f,v,null)}function _(S,T,C,E){let M=null,P=C.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)M=P;else if(M=C.isPointLight===!0?l:a,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){let k=M.uuid,H=T.uuid,F=c[k];F===void 0&&(F={},c[k]=F);let W=F[H];W===void 0&&(W=M.clone(),F[H]=W,T.addEventListener("dispose",I)),M=W}if(M.visible=T.visible,M.wireframe=T.wireframe,E===Ni?M.side=T.shadowSide!==null?T.shadowSide:T.side:M.side=T.shadowSide!==null?T.shadowSide:u[T.side],M.alphaMap=T.alphaMap,M.alphaTest=T.alphaTest,M.map=T.map,M.clipShadows=T.clipShadows,M.clippingPlanes=T.clippingPlanes,M.clipIntersection=T.clipIntersection,M.displacementMap=T.displacementMap,M.displacementScale=T.displacementScale,M.displacementBias=T.displacementBias,M.wireframeLinewidth=T.wireframeLinewidth,M.linewidth=T.linewidth,C.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let k=i.properties.get(M);k.light=C}return M}function x(S,T,C,E,M){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Ni)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,S.matrixWorld);let H=e.update(S),F=S.material;if(Array.isArray(F)){let W=H.groups;for(let N=0,Z=W.length;N<Z;N++){let V=W[N],ee=F[V.materialIndex];if(ee&&ee.visible){let he=_(S,ee,E,M);S.onBeforeShadow(i,S,T,C,H,he,V),i.renderBufferDirect(C,null,H,he,S,V),S.onAfterShadow(i,S,T,C,H,he,V)}}}else if(F.visible){let W=_(S,F,E,M);S.onBeforeShadow(i,S,T,C,H,W,null),i.renderBufferDirect(C,null,H,W,S,null),S.onAfterShadow(i,S,T,C,H,W,null)}}let k=S.children;for(let H=0,F=k.length;H<F;H++)x(k[H],T,C,E,M)}function I(S){S.target.removeEventListener("dispose",I);for(let C in c){let E=c[C],M=S.target.uuid;M in E&&(E[M].dispose(),delete E[M])}}}var I1={[Wc]:Xc,[qc]:Kc,[Yc]:$c,[Ar]:Zc,[Xc]:Wc,[Kc]:qc,[$c]:Yc,[Zc]:Ar};function L1(i,e){function t(){let U=!1,de=new At,Y=null,re=new At(0,0,0,0);return{setMask:function(Ie){Y!==Ie&&!U&&(i.colorMask(Ie,Ie,Ie,Ie),Y=Ie)},setLocked:function(Ie){U=Ie},setClear:function(Ie,Re,st,zt,vn){vn===!0&&(Ie*=zt,Re*=zt,st*=zt),de.set(Ie,Re,st,zt),re.equals(de)===!1&&(i.clearColor(Ie,Re,st,zt),re.copy(de))},reset:function(){U=!1,Y=null,re.set(-1,0,0,0)}}}function n(){let U=!1,de=!1,Y=null,re=null,Ie=null;return{setReversed:function(Re){if(de!==Re){let st=e.get("EXT_clip_control");de?st.clipControlEXT(st.LOWER_LEFT_EXT,st.ZERO_TO_ONE_EXT):st.clipControlEXT(st.LOWER_LEFT_EXT,st.NEGATIVE_ONE_TO_ONE_EXT);let zt=Ie;Ie=null,this.setClear(zt)}de=Re},getReversed:function(){return de},setTest:function(Re){Re?fe(i.DEPTH_TEST):Te(i.DEPTH_TEST)},setMask:function(Re){Y!==Re&&!U&&(i.depthMask(Re),Y=Re)},setFunc:function(Re){if(de&&(Re=I1[Re]),re!==Re){switch(Re){case Wc:i.depthFunc(i.NEVER);break;case Xc:i.depthFunc(i.ALWAYS);break;case qc:i.depthFunc(i.LESS);break;case Ar:i.depthFunc(i.LEQUAL);break;case Yc:i.depthFunc(i.EQUAL);break;case Zc:i.depthFunc(i.GEQUAL);break;case Kc:i.depthFunc(i.GREATER);break;case $c:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}re=Re}},setLocked:function(Re){U=Re},setClear:function(Re){Ie!==Re&&(de&&(Re=1-Re),i.clearDepth(Re),Ie=Re)},reset:function(){U=!1,Y=null,re=null,Ie=null,de=!1}}}function s(){let U=!1,de=null,Y=null,re=null,Ie=null,Re=null,st=null,zt=null,vn=null;return{setTest:function(wt){U||(wt?fe(i.STENCIL_TEST):Te(i.STENCIL_TEST))},setMask:function(wt){de!==wt&&!U&&(i.stencilMask(wt),de=wt)},setFunc:function(wt,ti,Ci){(Y!==wt||re!==ti||Ie!==Ci)&&(i.stencilFunc(wt,ti,Ci),Y=wt,re=ti,Ie=Ci)},setOp:function(wt,ti,Ci){(Re!==wt||st!==ti||zt!==Ci)&&(i.stencilOp(wt,ti,Ci),Re=wt,st=ti,zt=Ci)},setLocked:function(wt){U=wt},setClear:function(wt){vn!==wt&&(i.clearStencil(wt),vn=wt)},reset:function(){U=!1,de=null,Y=null,re=null,Ie=null,Re=null,st=null,zt=null,vn=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,f=[],m=null,v=!1,g=null,p=null,y=null,_=null,x=null,I=null,S=null,T=new Ue(0,0,0),C=0,E=!1,M=null,P=null,k=null,H=null,F=null,W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,Z=0,V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(V)[1]),N=Z>=1):V.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),N=Z>=2);let ee=null,he={},xe=i.getParameter(i.SCISSOR_BOX),ke=i.getParameter(i.VIEWPORT),Je=new At().fromArray(xe),K=new At().fromArray(ke);function oe(U,de,Y,re){let Ie=new Uint8Array(4),Re=i.createTexture();i.bindTexture(U,Re),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let st=0;st<Y;st++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(de,0,i.RGBA,1,1,re,0,i.RGBA,i.UNSIGNED_BYTE,Ie):i.texImage2D(de+st,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ie);return Re}let ge={};ge[i.TEXTURE_2D]=oe(i.TEXTURE_2D,i.TEXTURE_2D,1),ge[i.TEXTURE_CUBE_MAP]=oe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ge[i.TEXTURE_2D_ARRAY]=oe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ge[i.TEXTURE_3D]=oe(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),fe(i.DEPTH_TEST),o.setFunc(Ar),se(!1),ie(Rd),fe(i.CULL_FACE),L(cs);function fe(U){h[U]!==!0&&(i.enable(U),h[U]=!0)}function Te(U){h[U]!==!1&&(i.disable(U),h[U]=!1)}function He(U,de){return u[U]!==de?(i.bindFramebuffer(U,de),u[U]=de,U===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=de),U===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=de),!0):!1}function Xe(U,de){let Y=f,re=!1;if(U){Y=d.get(de),Y===void 0&&(Y=[],d.set(de,Y));let Ie=U.textures;if(Y.length!==Ie.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let Re=0,st=Ie.length;Re<st;Re++)Y[Re]=i.COLOR_ATTACHMENT0+Re;Y.length=Ie.length,re=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,re=!0);re&&i.drawBuffers(Y)}function Qe(U){return m!==U?(i.useProgram(U),m=U,!0):!1}let Q={[ks]:i.FUNC_ADD,[Z0]:i.FUNC_SUBTRACT,[K0]:i.FUNC_REVERSE_SUBTRACT};Q[$0]=i.MIN,Q[J0]=i.MAX;let me={[j0]:i.ZERO,[_u]:i.ONE,[Q0]:i.SRC_COLOR,[Vc]:i.SRC_ALPHA,[rm]:i.SRC_ALPHA_SATURATE,[im]:i.DST_COLOR,[tm]:i.DST_ALPHA,[em]:i.ONE_MINUS_SRC_COLOR,[bo]:i.ONE_MINUS_SRC_ALPHA,[sm]:i.ONE_MINUS_DST_COLOR,[nm]:i.ONE_MINUS_DST_ALPHA,[om]:i.CONSTANT_COLOR,[am]:i.ONE_MINUS_CONSTANT_COLOR,[lm]:i.CONSTANT_ALPHA,[cm]:i.ONE_MINUS_CONSTANT_ALPHA};function L(U,de,Y,re,Ie,Re,st,zt,vn,wt){if(U===cs){v===!0&&(Te(i.BLEND),v=!1);return}if(v===!1&&(fe(i.BLEND),v=!0),U!==yu){if(U!==g||wt!==E){if((p!==ks||x!==ks)&&(i.blendEquation(i.FUNC_ADD),p=ks,x=ks),wt)switch(U){case Er:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ds:i.blendFunc(i.ONE,i.ONE);break;case Cd:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Pd:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Er:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ds:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Cd:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Pd:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}y=null,_=null,I=null,S=null,T.set(0,0,0),C=0,g=U,E=wt}return}Ie=Ie||de,Re=Re||Y,st=st||re,(de!==p||Ie!==x)&&(i.blendEquationSeparate(Q[de],Q[Ie]),p=de,x=Ie),(Y!==y||re!==_||Re!==I||st!==S)&&(i.blendFuncSeparate(me[Y],me[re],me[Re],me[st]),y=Y,_=re,I=Re,S=st),(zt.equals(T)===!1||vn!==C)&&(i.blendColor(zt.r,zt.g,zt.b,vn),T.copy(zt),C=vn),g=U,E=!1}function Be(U,de){U.side===dt?Te(i.CULL_FACE):fe(i.CULL_FACE);let Y=U.side===_n;de&&(Y=!Y),se(Y),U.blending===Er&&U.transparent===!1?L(cs):L(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);let re=U.stencilWrite;a.setTest(re),re&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Pe(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?fe(i.SAMPLE_ALPHA_TO_COVERAGE):Te(i.SAMPLE_ALPHA_TO_COVERAGE)}function se(U){M!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),M=U)}function ie(U){U!==q0?(fe(i.CULL_FACE),U!==P&&(U===Rd?i.cullFace(i.BACK):U===Y0?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Te(i.CULL_FACE),P=U}function ae(U){U!==k&&(N&&i.lineWidth(U),k=U)}function Pe(U,de,Y){U?(fe(i.POLYGON_OFFSET_FILL),(H!==de||F!==Y)&&(i.polygonOffset(de,Y),H=de,F=Y)):Te(i.POLYGON_OFFSET_FILL)}function Me(U){U?fe(i.SCISSOR_TEST):Te(i.SCISSOR_TEST)}function R(U){U===void 0&&(U=i.TEXTURE0+W-1),ee!==U&&(i.activeTexture(U),ee=U)}function b(U,de,Y){Y===void 0&&(ee===null?Y=i.TEXTURE0+W-1:Y=ee);let re=he[Y];re===void 0&&(re={type:void 0,texture:void 0},he[Y]=re),(re.type!==U||re.texture!==de)&&(ee!==Y&&(i.activeTexture(Y),ee=Y),i.bindTexture(U,de||ge[U]),re.type=U,re.texture=de)}function G(){let U=he[ee];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function te(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function B(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ne(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function pe(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ye(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ye(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ue(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ce(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ve(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function $e(U){Je.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Je.copy(U))}function Le(U){K.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),K.copy(U))}function j(U,de){let Y=c.get(de);Y===void 0&&(Y=new WeakMap,c.set(de,Y));let re=Y.get(U);re===void 0&&(re=i.getUniformBlockIndex(de,U.name),Y.set(U,re))}function ve(U,de){let re=c.get(de).get(U);l.get(de)!==re&&(i.uniformBlockBinding(de,re,U.__bindingPointIndex),l.set(de,re))}function be(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ee=null,he={},u={},d=new WeakMap,f=[],m=null,v=!1,g=null,p=null,y=null,_=null,x=null,I=null,S=null,T=new Ue(0,0,0),C=0,E=!1,M=null,P=null,k=null,H=null,F=null,Je.set(0,0,i.canvas.width,i.canvas.height),K.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:fe,disable:Te,bindFramebuffer:He,drawBuffers:Xe,useProgram:Qe,setBlending:L,setMaterial:Be,setFlipSided:se,setCullFace:ie,setLineWidth:ae,setPolygonOffset:Pe,setScissorTest:Me,activeTexture:R,bindTexture:b,unbindTexture:G,compressedTexImage2D:$,compressedTexImage3D:te,texImage2D:Ce,texImage3D:Ve,updateUBOMapping:j,uniformBlockBinding:ve,texStorage2D:Ye,texStorage3D:ue,texSubImage2D:B,texSubImage3D:ne,compressedTexSubImage2D:pe,compressedTexSubImage3D:ye,scissor:$e,viewport:Le,reset:be}}function Rf(i,e,t,n){let s=D1(n);switch(t){case Kf:return i*e;case Jf:return i*e;case jf:return i*e*2;case Tu:return i*e/s.components*s.byteLength;case Au:return i*e/s.components*s.byteLength;case Qf:return i*e*2/s.components*s.byteLength;case Ru:return i*e*2/s.components*s.byteLength;case $f:return i*e*3/s.components*s.byteLength;case oi:return i*e*4/s.components*s.byteLength;case Cu:return i*e*4/s.components*s.byteLength;case Ca:case Pa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ia:case La:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case th:case ih:return Math.max(i,16)*Math.max(e,8)/4;case eh:case nh:return Math.max(i,8)*Math.max(e,8)/2;case sh:case rh:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case oh:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ah:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case lh:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ch:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case hh:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case uh:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case dh:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case fh:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ph:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case mh:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case gh:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case vh:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case xh:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case yh:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case _h:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Da:case Mh:case bh:return Math.ceil(i/4)*Math.ceil(e/4)*16;case ep:case Eh:return Math.ceil(i/4)*Math.ceil(e/4)*8;case wh:case Sh:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function D1(i){switch(i){case zi:case qf:return{byteLength:1,components:1};case Eo:case Yf:case ps:return{byteLength:2,components:1};case wu:case Su:return{byteLength:2,components:4};case Fs:case Eu:case xi:return{byteLength:4,components:1};case Zf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function k1(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new le,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(R,b){return f?new OffscreenCanvas(R,b):Na("canvas")}function v(R,b,G){let $=1,te=Me(R);if((te.width>G||te.height>G)&&($=G/Math.max(te.width,te.height)),$<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let B=Math.floor($*te.width),ne=Math.floor($*te.height);u===void 0&&(u=m(B,ne));let pe=b?m(B,ne):u;return pe.width=B,pe.height=ne,pe.getContext("2d").drawImage(R,0,0,B,ne),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+B+"x"+ne+")."),pe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),R;return R}function g(R){return R.generateMipmaps}function p(R){i.generateMipmap(R)}function y(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function _(R,b,G,$,te=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let B=b;if(b===i.RED&&(G===i.FLOAT&&(B=i.R32F),G===i.HALF_FLOAT&&(B=i.R16F),G===i.UNSIGNED_BYTE&&(B=i.R8)),b===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(B=i.R8UI),G===i.UNSIGNED_SHORT&&(B=i.R16UI),G===i.UNSIGNED_INT&&(B=i.R32UI),G===i.BYTE&&(B=i.R8I),G===i.SHORT&&(B=i.R16I),G===i.INT&&(B=i.R32I)),b===i.RG&&(G===i.FLOAT&&(B=i.RG32F),G===i.HALF_FLOAT&&(B=i.RG16F),G===i.UNSIGNED_BYTE&&(B=i.RG8)),b===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(B=i.RG8UI),G===i.UNSIGNED_SHORT&&(B=i.RG16UI),G===i.UNSIGNED_INT&&(B=i.RG32UI),G===i.BYTE&&(B=i.RG8I),G===i.SHORT&&(B=i.RG16I),G===i.INT&&(B=i.RG32I)),b===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(B=i.RGB8UI),G===i.UNSIGNED_SHORT&&(B=i.RGB16UI),G===i.UNSIGNED_INT&&(B=i.RGB32UI),G===i.BYTE&&(B=i.RGB8I),G===i.SHORT&&(B=i.RGB16I),G===i.INT&&(B=i.RGB32I)),b===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(B=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(B=i.RGBA16UI),G===i.UNSIGNED_INT&&(B=i.RGBA32UI),G===i.BYTE&&(B=i.RGBA8I),G===i.SHORT&&(B=i.RGBA16I),G===i.INT&&(B=i.RGBA32I)),b===i.RGB&&G===i.UNSIGNED_INT_5_9_9_9_REV&&(B=i.RGB9_E5),b===i.RGBA){let ne=te?al:ft.getTransfer($);G===i.FLOAT&&(B=i.RGBA32F),G===i.HALF_FLOAT&&(B=i.RGBA16F),G===i.UNSIGNED_BYTE&&(B=ne===Tt?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(B=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(B=i.RGB5_A1)}return(B===i.R16F||B===i.R32F||B===i.RG16F||B===i.RG32F||B===i.RGBA16F||B===i.RGBA32F)&&e.get("EXT_color_buffer_float"),B}function x(R,b){let G;return R?b===null||b===Fs||b===Pr?G=i.DEPTH24_STENCIL8:b===xi?G=i.DEPTH32F_STENCIL8:b===Eo&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Fs||b===Pr?G=i.DEPTH_COMPONENT24:b===xi?G=i.DEPTH_COMPONENT32F:b===Eo&&(G=i.DEPTH_COMPONENT16),G}function I(R,b){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==Cn&&R.minFilter!==Vn?Math.log2(Math.max(b.width,b.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?b.mipmaps.length:1}function S(R){let b=R.target;b.removeEventListener("dispose",S),C(b),b.isVideoTexture&&h.delete(b)}function T(R){let b=R.target;b.removeEventListener("dispose",T),M(b)}function C(R){let b=n.get(R);if(b.__webglInit===void 0)return;let G=R.source,$=d.get(G);if($){let te=$[b.__cacheKey];te.usedTimes--,te.usedTimes===0&&E(R),Object.keys($).length===0&&d.delete(G)}n.remove(R)}function E(R){let b=n.get(R);i.deleteTexture(b.__webglTexture);let G=R.source,$=d.get(G);delete $[b.__cacheKey],o.memory.textures--}function M(R){let b=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(b.__webglFramebuffer[$]))for(let te=0;te<b.__webglFramebuffer[$].length;te++)i.deleteFramebuffer(b.__webglFramebuffer[$][te]);else i.deleteFramebuffer(b.__webglFramebuffer[$]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[$])}else{if(Array.isArray(b.__webglFramebuffer))for(let $=0;$<b.__webglFramebuffer.length;$++)i.deleteFramebuffer(b.__webglFramebuffer[$]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let $=0;$<b.__webglColorRenderbuffer.length;$++)b.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[$]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let G=R.textures;for(let $=0,te=G.length;$<te;$++){let B=n.get(G[$]);B.__webglTexture&&(i.deleteTexture(B.__webglTexture),o.memory.textures--),n.remove(G[$])}n.remove(R)}let P=0;function k(){P=0}function H(){let R=P;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),P+=1,R}function F(R){let b=[];return b.push(R.wrapS),b.push(R.wrapT),b.push(R.wrapR||0),b.push(R.magFilter),b.push(R.minFilter),b.push(R.anisotropy),b.push(R.internalFormat),b.push(R.format),b.push(R.type),b.push(R.generateMipmaps),b.push(R.premultiplyAlpha),b.push(R.flipY),b.push(R.unpackAlignment),b.push(R.colorSpace),b.join()}function W(R,b){let G=n.get(R);if(R.isVideoTexture&&ae(R),R.isRenderTargetTexture===!1&&R.version>0&&G.__version!==R.version){let $=R.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(G,R,b);return}}t.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+b)}function N(R,b){let G=n.get(R);if(R.version>0&&G.__version!==R.version){K(G,R,b);return}t.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+b)}function Z(R,b){let G=n.get(R);if(R.version>0&&G.__version!==R.version){K(G,R,b);return}t.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+b)}function V(R,b){let G=n.get(R);if(R.version>0&&G.__version!==R.version){oe(G,R,b);return}t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+b)}let ee={[Oi]:i.REPEAT,[Hs]:i.CLAMP_TO_EDGE,[Qc]:i.MIRRORED_REPEAT},he={[Cn]:i.NEAREST,[xm]:i.NEAREST_MIPMAP_NEAREST,[Qo]:i.NEAREST_MIPMAP_LINEAR,[Vn]:i.LINEAR,[cc]:i.LINEAR_MIPMAP_NEAREST,[Bs]:i.LINEAR_MIPMAP_LINEAR},xe={[bm]:i.NEVER,[Rm]:i.ALWAYS,[Em]:i.LESS,[tp]:i.LEQUAL,[wm]:i.EQUAL,[Am]:i.GEQUAL,[Sm]:i.GREATER,[Tm]:i.NOTEQUAL};function ke(R,b){if(b.type===xi&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===Vn||b.magFilter===cc||b.magFilter===Qo||b.magFilter===Bs||b.minFilter===Vn||b.minFilter===cc||b.minFilter===Qo||b.minFilter===Bs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,ee[b.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,ee[b.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,ee[b.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,he[b.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,he[b.minFilter]),b.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,xe[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Cn||b.minFilter!==Qo&&b.minFilter!==Bs||b.type===xi&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){let G=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function Je(R,b){let G=!1;R.__webglInit===void 0&&(R.__webglInit=!0,b.addEventListener("dispose",S));let $=b.source,te=d.get($);te===void 0&&(te={},d.set($,te));let B=F(b);if(B!==R.__cacheKey){te[B]===void 0&&(te[B]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,G=!0),te[B].usedTimes++;let ne=te[R.__cacheKey];ne!==void 0&&(te[R.__cacheKey].usedTimes--,ne.usedTimes===0&&E(b)),R.__cacheKey=B,R.__webglTexture=te[B].texture}return G}function K(R,b,G){let $=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&($=i.TEXTURE_3D);let te=Je(R,b),B=b.source;t.bindTexture($,R.__webglTexture,i.TEXTURE0+G);let ne=n.get(B);if(B.version!==ne.__version||te===!0){t.activeTexture(i.TEXTURE0+G);let pe=ft.getPrimaries(ft.workingColorSpace),ye=b.colorSpace===ls?null:ft.getPrimaries(b.colorSpace),Ye=b.colorSpace===ls||pe===ye?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ye);let ue=v(b.image,!1,s.maxTextureSize);ue=Pe(b,ue);let Ce=r.convert(b.format,b.colorSpace),Ve=r.convert(b.type),$e=_(b.internalFormat,Ce,Ve,b.colorSpace,b.isVideoTexture);ke($,b);let Le,j=b.mipmaps,ve=b.isVideoTexture!==!0,be=ne.__version===void 0||te===!0,U=B.dataReady,de=I(b,ue);if(b.isDepthTexture)$e=x(b.format===Ir,b.type),be&&(ve?t.texStorage2D(i.TEXTURE_2D,1,$e,ue.width,ue.height):t.texImage2D(i.TEXTURE_2D,0,$e,ue.width,ue.height,0,Ce,Ve,null));else if(b.isDataTexture)if(j.length>0){ve&&be&&t.texStorage2D(i.TEXTURE_2D,de,$e,j[0].width,j[0].height);for(let Y=0,re=j.length;Y<re;Y++)Le=j[Y],ve?U&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,Le.width,Le.height,Ce,Ve,Le.data):t.texImage2D(i.TEXTURE_2D,Y,$e,Le.width,Le.height,0,Ce,Ve,Le.data);b.generateMipmaps=!1}else ve?(be&&t.texStorage2D(i.TEXTURE_2D,de,$e,ue.width,ue.height),U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ue.width,ue.height,Ce,Ve,ue.data)):t.texImage2D(i.TEXTURE_2D,0,$e,ue.width,ue.height,0,Ce,Ve,ue.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){ve&&be&&t.texStorage3D(i.TEXTURE_2D_ARRAY,de,$e,j[0].width,j[0].height,ue.depth);for(let Y=0,re=j.length;Y<re;Y++)if(Le=j[Y],b.format!==oi)if(Ce!==null)if(ve){if(U)if(b.layerUpdates.size>0){let Ie=Rf(Le.width,Le.height,b.format,b.type);for(let Re of b.layerUpdates){let st=Le.data.subarray(Re*Ie/Le.data.BYTES_PER_ELEMENT,(Re+1)*Ie/Le.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,Re,Le.width,Le.height,1,Ce,st)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,Le.width,Le.height,ue.depth,Ce,Le.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,$e,Le.width,Le.height,ue.depth,0,Le.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ve?U&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,Le.width,Le.height,ue.depth,Ce,Ve,Le.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Y,$e,Le.width,Le.height,ue.depth,0,Ce,Ve,Le.data)}else{ve&&be&&t.texStorage2D(i.TEXTURE_2D,de,$e,j[0].width,j[0].height);for(let Y=0,re=j.length;Y<re;Y++)Le=j[Y],b.format!==oi?Ce!==null?ve?U&&t.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,Le.width,Le.height,Ce,Le.data):t.compressedTexImage2D(i.TEXTURE_2D,Y,$e,Le.width,Le.height,0,Le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ve?U&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,Le.width,Le.height,Ce,Ve,Le.data):t.texImage2D(i.TEXTURE_2D,Y,$e,Le.width,Le.height,0,Ce,Ve,Le.data)}else if(b.isDataArrayTexture)if(ve){if(be&&t.texStorage3D(i.TEXTURE_2D_ARRAY,de,$e,ue.width,ue.height,ue.depth),U)if(b.layerUpdates.size>0){let Y=Rf(ue.width,ue.height,b.format,b.type);for(let re of b.layerUpdates){let Ie=ue.data.subarray(re*Y/ue.data.BYTES_PER_ELEMENT,(re+1)*Y/ue.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,re,ue.width,ue.height,1,Ce,Ve,Ie)}b.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,Ce,Ve,ue.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,$e,ue.width,ue.height,ue.depth,0,Ce,Ve,ue.data);else if(b.isData3DTexture)ve?(be&&t.texStorage3D(i.TEXTURE_3D,de,$e,ue.width,ue.height,ue.depth),U&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,Ce,Ve,ue.data)):t.texImage3D(i.TEXTURE_3D,0,$e,ue.width,ue.height,ue.depth,0,Ce,Ve,ue.data);else if(b.isFramebufferTexture){if(be)if(ve)t.texStorage2D(i.TEXTURE_2D,de,$e,ue.width,ue.height);else{let Y=ue.width,re=ue.height;for(let Ie=0;Ie<de;Ie++)t.texImage2D(i.TEXTURE_2D,Ie,$e,Y,re,0,Ce,Ve,null),Y>>=1,re>>=1}}else if(j.length>0){if(ve&&be){let Y=Me(j[0]);t.texStorage2D(i.TEXTURE_2D,de,$e,Y.width,Y.height)}for(let Y=0,re=j.length;Y<re;Y++)Le=j[Y],ve?U&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,Ce,Ve,Le):t.texImage2D(i.TEXTURE_2D,Y,$e,Ce,Ve,Le);b.generateMipmaps=!1}else if(ve){if(be){let Y=Me(ue);t.texStorage2D(i.TEXTURE_2D,de,$e,Y.width,Y.height)}U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Ce,Ve,ue)}else t.texImage2D(i.TEXTURE_2D,0,$e,Ce,Ve,ue);g(b)&&p($),ne.__version=B.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function oe(R,b,G){if(b.image.length!==6)return;let $=Je(R,b),te=b.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+G);let B=n.get(te);if(te.version!==B.__version||$===!0){t.activeTexture(i.TEXTURE0+G);let ne=ft.getPrimaries(ft.workingColorSpace),pe=b.colorSpace===ls?null:ft.getPrimaries(b.colorSpace),ye=b.colorSpace===ls||ne===pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);let Ye=b.isCompressedTexture||b.image[0].isCompressedTexture,ue=b.image[0]&&b.image[0].isDataTexture,Ce=[];for(let re=0;re<6;re++)!Ye&&!ue?Ce[re]=v(b.image[re],!0,s.maxCubemapSize):Ce[re]=ue?b.image[re].image:b.image[re],Ce[re]=Pe(b,Ce[re]);let Ve=Ce[0],$e=r.convert(b.format,b.colorSpace),Le=r.convert(b.type),j=_(b.internalFormat,$e,Le,b.colorSpace),ve=b.isVideoTexture!==!0,be=B.__version===void 0||$===!0,U=te.dataReady,de=I(b,Ve);ke(i.TEXTURE_CUBE_MAP,b);let Y;if(Ye){ve&&be&&t.texStorage2D(i.TEXTURE_CUBE_MAP,de,j,Ve.width,Ve.height);for(let re=0;re<6;re++){Y=Ce[re].mipmaps;for(let Ie=0;Ie<Y.length;Ie++){let Re=Y[Ie];b.format!==oi?$e!==null?ve?U&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie,0,0,Re.width,Re.height,$e,Re.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie,j,Re.width,Re.height,0,Re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ve?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie,0,0,Re.width,Re.height,$e,Le,Re.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie,j,Re.width,Re.height,0,$e,Le,Re.data)}}}else{if(Y=b.mipmaps,ve&&be){Y.length>0&&de++;let re=Me(Ce[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,de,j,re.width,re.height)}for(let re=0;re<6;re++)if(ue){ve?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Ce[re].width,Ce[re].height,$e,Le,Ce[re].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,j,Ce[re].width,Ce[re].height,0,$e,Le,Ce[re].data);for(let Ie=0;Ie<Y.length;Ie++){let st=Y[Ie].image[re].image;ve?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie+1,0,0,st.width,st.height,$e,Le,st.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie+1,j,st.width,st.height,0,$e,Le,st.data)}}else{ve?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,$e,Le,Ce[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,j,$e,Le,Ce[re]);for(let Ie=0;Ie<Y.length;Ie++){let Re=Y[Ie];ve?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie+1,0,0,$e,Le,Re.image[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie+1,j,$e,Le,Re.image[re])}}}g(b)&&p(i.TEXTURE_CUBE_MAP),B.__version=te.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function ge(R,b,G,$,te,B){let ne=r.convert(G.format,G.colorSpace),pe=r.convert(G.type),ye=_(G.internalFormat,ne,pe,G.colorSpace),Ye=n.get(b),ue=n.get(G);if(ue.__renderTarget=b,!Ye.__hasExternalTextures){let Ce=Math.max(1,b.width>>B),Ve=Math.max(1,b.height>>B);te===i.TEXTURE_3D||te===i.TEXTURE_2D_ARRAY?t.texImage3D(te,B,ye,Ce,Ve,b.depth,0,ne,pe,null):t.texImage2D(te,B,ye,Ce,Ve,0,ne,pe,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),ie(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,te,ue.__webglTexture,0,se(b)):(te===i.TEXTURE_2D||te>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,te,ue.__webglTexture,B),t.bindFramebuffer(i.FRAMEBUFFER,null)}function fe(R,b,G){if(i.bindRenderbuffer(i.RENDERBUFFER,R),b.depthBuffer){let $=b.depthTexture,te=$&&$.isDepthTexture?$.type:null,B=x(b.stencilBuffer,te),ne=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pe=se(b);ie(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pe,B,b.width,b.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,pe,B,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,B,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ne,i.RENDERBUFFER,R)}else{let $=b.textures;for(let te=0;te<$.length;te++){let B=$[te],ne=r.convert(B.format,B.colorSpace),pe=r.convert(B.type),ye=_(B.internalFormat,ne,pe,B.colorSpace),Ye=se(b);G&&ie(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ye,ye,b.width,b.height):ie(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ye,ye,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,ye,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Te(R,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let $=n.get(b.depthTexture);$.__renderTarget=b,(!$.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),W(b.depthTexture,0);let te=$.__webglTexture,B=se(b);if(b.depthTexture.format===wr)ie(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,te,0,B):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,te,0);else if(b.depthTexture.format===Ir)ie(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,te,0,B):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function He(R){let b=n.get(R),G=R.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==R.depthTexture){let $=R.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),$){let te=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,$.removeEventListener("dispose",te)};$.addEventListener("dispose",te),b.__depthDisposeCallback=te}b.__boundDepthTexture=$}if(R.depthTexture&&!b.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");Te(b.__webglFramebuffer,R)}else if(G){b.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[$]),b.__webglDepthbuffer[$]===void 0)b.__webglDepthbuffer[$]=i.createRenderbuffer(),fe(b.__webglDepthbuffer[$],R,!1);else{let te=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,B=b.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,B),i.framebufferRenderbuffer(i.FRAMEBUFFER,te,i.RENDERBUFFER,B)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),fe(b.__webglDepthbuffer,R,!1);else{let $=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,te=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,te),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,te)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Xe(R,b,G){let $=n.get(R);b!==void 0&&ge($.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&He(R)}function Qe(R){let b=R.texture,G=n.get(R),$=n.get(b);R.addEventListener("dispose",T);let te=R.textures,B=R.isWebGLCubeRenderTarget===!0,ne=te.length>1;if(ne||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=b.version,o.memory.textures++),B){G.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)if(b.mipmaps&&b.mipmaps.length>0){G.__webglFramebuffer[pe]=[];for(let ye=0;ye<b.mipmaps.length;ye++)G.__webglFramebuffer[pe][ye]=i.createFramebuffer()}else G.__webglFramebuffer[pe]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){G.__webglFramebuffer=[];for(let pe=0;pe<b.mipmaps.length;pe++)G.__webglFramebuffer[pe]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(ne)for(let pe=0,ye=te.length;pe<ye;pe++){let Ye=n.get(te[pe]);Ye.__webglTexture===void 0&&(Ye.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&ie(R)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let pe=0;pe<te.length;pe++){let ye=te[pe];G.__webglColorRenderbuffer[pe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[pe]);let Ye=r.convert(ye.format,ye.colorSpace),ue=r.convert(ye.type),Ce=_(ye.internalFormat,Ye,ue,ye.colorSpace,R.isXRRenderTarget===!0),Ve=se(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ve,Ce,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,G.__webglColorRenderbuffer[pe])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),fe(G.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(B){t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),ke(i.TEXTURE_CUBE_MAP,b);for(let pe=0;pe<6;pe++)if(b.mipmaps&&b.mipmaps.length>0)for(let ye=0;ye<b.mipmaps.length;ye++)ge(G.__webglFramebuffer[pe][ye],R,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,ye);else ge(G.__webglFramebuffer[pe],R,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0);g(b)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ne){for(let pe=0,ye=te.length;pe<ye;pe++){let Ye=te[pe],ue=n.get(Ye);t.bindTexture(i.TEXTURE_2D,ue.__webglTexture),ke(i.TEXTURE_2D,Ye),ge(G.__webglFramebuffer,R,Ye,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,0),g(Ye)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let pe=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(pe=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(pe,$.__webglTexture),ke(pe,b),b.mipmaps&&b.mipmaps.length>0)for(let ye=0;ye<b.mipmaps.length;ye++)ge(G.__webglFramebuffer[ye],R,b,i.COLOR_ATTACHMENT0,pe,ye);else ge(G.__webglFramebuffer,R,b,i.COLOR_ATTACHMENT0,pe,0);g(b)&&p(pe),t.unbindTexture()}R.depthBuffer&&He(R)}function Q(R){let b=R.textures;for(let G=0,$=b.length;G<$;G++){let te=b[G];if(g(te)){let B=y(R),ne=n.get(te).__webglTexture;t.bindTexture(B,ne),p(B),t.unbindTexture()}}}let me=[],L=[];function Be(R){if(R.samples>0){if(ie(R)===!1){let b=R.textures,G=R.width,$=R.height,te=i.COLOR_BUFFER_BIT,B=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=n.get(R),pe=b.length>1;if(pe)for(let ye=0;ye<b.length;ye++)t.bindFramebuffer(i.FRAMEBUFFER,ne.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ne.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ne.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ne.__webglFramebuffer);for(let ye=0;ye<b.length;ye++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(te|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(te|=i.STENCIL_BUFFER_BIT)),pe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ne.__webglColorRenderbuffer[ye]);let Ye=n.get(b[ye]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ye,0)}i.blitFramebuffer(0,0,G,$,0,0,G,$,te,i.NEAREST),l===!0&&(me.length=0,L.length=0,me.push(i.COLOR_ATTACHMENT0+ye),R.depthBuffer&&R.resolveDepthBuffer===!1&&(me.push(B),L.push(B),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,L)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,me))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),pe)for(let ye=0;ye<b.length;ye++){t.bindFramebuffer(i.FRAMEBUFFER,ne.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,ne.__webglColorRenderbuffer[ye]);let Ye=n.get(b[ye]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ne.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,Ye,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ne.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){let b=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function se(R){return Math.min(s.maxSamples,R.samples)}function ie(R){let b=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function ae(R){let b=o.render.frame;h.get(R)!==b&&(h.set(R,b),R.update())}function Pe(R,b){let G=R.colorSpace,$=R.format,te=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||G!==Or&&G!==ls&&(ft.getTransfer(G)===Tt?($!==oi||te!==zi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),b}function Me(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=k,this.setTexture2D=W,this.setTexture2DArray=N,this.setTexture3D=Z,this.setTextureCube=V,this.rebindTextures=Xe,this.setupRenderTarget=Qe,this.updateRenderTargetMipmap=Q,this.updateMultisampleRenderTarget=Be,this.setupDepthRenderbuffer=He,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=ie}function U1(i,e){function t(n,s=ls){let r,o=ft.getTransfer(s);if(n===zi)return i.UNSIGNED_BYTE;if(n===wu)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Su)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Zf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===qf)return i.BYTE;if(n===Yf)return i.SHORT;if(n===Eo)return i.UNSIGNED_SHORT;if(n===Eu)return i.INT;if(n===Fs)return i.UNSIGNED_INT;if(n===xi)return i.FLOAT;if(n===ps)return i.HALF_FLOAT;if(n===Kf)return i.ALPHA;if(n===$f)return i.RGB;if(n===oi)return i.RGBA;if(n===Jf)return i.LUMINANCE;if(n===jf)return i.LUMINANCE_ALPHA;if(n===wr)return i.DEPTH_COMPONENT;if(n===Ir)return i.DEPTH_STENCIL;if(n===Tu)return i.RED;if(n===Au)return i.RED_INTEGER;if(n===Qf)return i.RG;if(n===Ru)return i.RG_INTEGER;if(n===Cu)return i.RGBA_INTEGER;if(n===Ca||n===Pa||n===Ia||n===La)if(o===Tt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ca)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Pa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ia)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===La)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ca)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Pa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ia)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===La)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===eh||n===th||n===nh||n===ih)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===eh)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===th)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===nh)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ih)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===sh||n===rh||n===oh)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===sh||n===rh)return o===Tt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===oh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ah||n===lh||n===ch||n===hh||n===uh||n===dh||n===fh||n===ph||n===mh||n===gh||n===vh||n===xh||n===yh||n===_h)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ah)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===lh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ch)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===hh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===uh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===dh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===fh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ph)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===mh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===gh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===vh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===xh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===yh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===_h)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Da||n===Mh||n===bh)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Da)return o===Tt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Mh)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===bh)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ep||n===Eh||n===wh||n===Sh)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Da)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Eh)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===wh)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Sh)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Pr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Oh=class extends Jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},we=class extends nn{constructor(){super(),this.isGroup=!0,this.type="Group"}},N1={type:"move"},yo=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new we,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new we,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new we,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let v of e.hand.values()){let g=t.getJointPose(v,n),p=this._getHandJoint(c,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(N1)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new we;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},H1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,B1=`
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

}`,zh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let s=new Pn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Yt({vertexShader:H1,fragmentShader:B1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new D(new et(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Gh=class extends fs{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null,v=new zh,g=t.getContextAttributes(),p=null,y=null,_=[],x=[],I=new le,S=null,T=new Jt;T.viewport=new At;let C=new Jt;C.viewport=new At;let E=[T,C],M=new Oh,P=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let oe=_[K];return oe===void 0&&(oe=new yo,_[K]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(K){let oe=_[K];return oe===void 0&&(oe=new yo,_[K]=oe),oe.getGripSpace()},this.getHand=function(K){let oe=_[K];return oe===void 0&&(oe=new yo,_[K]=oe),oe.getHandSpace()};function H(K){let oe=x.indexOf(K.inputSource);if(oe===-1)return;let ge=_[oe];ge!==void 0&&(ge.update(K.inputSource,K.frame,c||o),ge.dispatchEvent({type:K.type,data:K.inputSource}))}function F(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",F),s.removeEventListener("inputsourceschange",W);for(let K=0;K<_.length;K++){let oe=x[K];oe!==null&&(x[K]=null,_[K].disconnect(oe))}P=null,k=null,v.reset(),e.setRenderTarget(p),f=null,d=null,u=null,s=null,y=null,Je.stop(),n.isPresenting=!1,e.setPixelRatio(S),e.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){a=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",F),s.addEventListener("inputsourceschange",W),g.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(I),s.renderState.layers===void 0){let oe={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,oe),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Yn(f.framebufferWidth,f.framebufferHeight,{format:oi,type:zi,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let oe=null,ge=null,fe=null;g.depth&&(fe=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=g.stencil?Ir:wr,ge=g.stencil?Pr:Fs);let Te={colorFormat:t.RGBA8,depthFormat:fe,scaleFactor:r};u=new XRWebGLBinding(s,t),d=u.createProjectionLayer(Te),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Yn(d.textureWidth,d.textureHeight,{format:oi,type:zi,depthTexture:new Wa(d.textureWidth,d.textureHeight,ge,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Je.setContext(s),Je.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function W(K){for(let oe=0;oe<K.removed.length;oe++){let ge=K.removed[oe],fe=x.indexOf(ge);fe>=0&&(x[fe]=null,_[fe].disconnect(ge))}for(let oe=0;oe<K.added.length;oe++){let ge=K.added[oe],fe=x.indexOf(ge);if(fe===-1){for(let He=0;He<_.length;He++)if(He>=x.length){x.push(ge),fe=He;break}else if(x[He]===null){x[He]=ge,fe=He;break}if(fe===-1)break}let Te=_[fe];Te&&Te.connect(ge)}}let N=new A,Z=new A;function V(K,oe,ge){N.setFromMatrixPosition(oe.matrixWorld),Z.setFromMatrixPosition(ge.matrixWorld);let fe=N.distanceTo(Z),Te=oe.projectionMatrix.elements,He=ge.projectionMatrix.elements,Xe=Te[14]/(Te[10]-1),Qe=Te[14]/(Te[10]+1),Q=(Te[9]+1)/Te[5],me=(Te[9]-1)/Te[5],L=(Te[8]-1)/Te[0],Be=(He[8]+1)/He[0],se=Xe*L,ie=Xe*Be,ae=fe/(-L+Be),Pe=ae*-L;if(oe.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(Pe),K.translateZ(ae),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Te[10]===-1)K.projectionMatrix.copy(oe.projectionMatrix),K.projectionMatrixInverse.copy(oe.projectionMatrixInverse);else{let Me=Xe+ae,R=Qe+ae,b=se-Pe,G=ie+(fe-Pe),$=Q*Qe/R*Me,te=me*Qe/R*Me;K.projectionMatrix.makePerspective(b,G,$,te,Me,R),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function ee(K,oe){oe===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(oe.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let oe=K.near,ge=K.far;v.texture!==null&&(v.depthNear>0&&(oe=v.depthNear),v.depthFar>0&&(ge=v.depthFar)),M.near=C.near=T.near=oe,M.far=C.far=T.far=ge,(P!==M.near||k!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,k=M.far),T.layers.mask=K.layers.mask|2,C.layers.mask=K.layers.mask|4,M.layers.mask=T.layers.mask|C.layers.mask;let fe=K.parent,Te=M.cameras;ee(M,fe);for(let He=0;He<Te.length;He++)ee(Te[He],fe);Te.length===2?V(M,T,C):M.projectionMatrix.copy(T.projectionMatrix),he(K,M,fe)};function he(K,oe,ge){ge===null?K.matrix.copy(oe.matrixWorld):(K.matrix.copy(ge.matrixWorld),K.matrix.invert(),K.matrix.multiply(oe.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(oe.projectionMatrix),K.projectionMatrixInverse.copy(oe.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Lr*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(K){l=K,d!==null&&(d.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let xe=null;function ke(K,oe){if(h=oe.getViewerPose(c||o),m=oe,h!==null){let ge=h.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let fe=!1;ge.length!==M.cameras.length&&(M.cameras.length=0,fe=!0);for(let He=0;He<ge.length;He++){let Xe=ge[He],Qe=null;if(f!==null)Qe=f.getViewport(Xe);else{let me=u.getViewSubImage(d,Xe);Qe=me.viewport,He===0&&(e.setRenderTargetTextures(y,me.colorTexture,d.ignoreDepthValues?void 0:me.depthStencilTexture),e.setRenderTarget(y))}let Q=E[He];Q===void 0&&(Q=new Jt,Q.layers.enable(He),Q.viewport=new At,E[He]=Q),Q.matrix.fromArray(Xe.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(Xe.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(Qe.x,Qe.y,Qe.width,Qe.height),He===0&&(M.matrix.copy(Q.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),fe===!0&&M.cameras.push(Q)}let Te=s.enabledFeatures;if(Te&&Te.includes("depth-sensing")){let He=u.getDepthInformation(ge[0]);He&&He.isValid&&He.texture&&v.init(e,He,s.renderState)}}for(let ge=0;ge<_.length;ge++){let fe=x[ge],Te=_[ge];fe!==null&&Te!==void 0&&Te.update(fe,oe,c||o)}xe&&xe(K,oe),oe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:oe}),m=null}let Je=new op;Je.setAnimationLoop(ke),this.setAnimationLoop=function(K){xe=K},this.dispose=function(){}}},Ls=new pn,F1=new je;function O1(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,rp(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,y,_,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,x)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),v(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?l(g,p,y,_):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===_n&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===_n&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let y=e.get(p),_=y.envMap,x=y.envMapRotation;_&&(g.envMap.value=_,Ls.copy(x),Ls.x*=-1,Ls.y*=-1,Ls.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Ls.y*=-1,Ls.z*=-1),g.envMapRotation.value.setFromMatrix4(F1.makeRotationFromEuler(Ls)),g.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,y,_){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*y,g.scale.value=_*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,y){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===_n&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){let y=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function z1(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,_){let x=_.program;n.uniformBlockBinding(y,x)}function c(y,_){let x=s[y.id];x===void 0&&(m(y),x=h(y),s[y.id]=x,y.addEventListener("dispose",g));let I=_.program;n.updateUBOMapping(y,I);let S=e.render.frame;r[y.id]!==S&&(d(y),r[y.id]=S)}function h(y){let _=u();y.__bindingPointIndex=_;let x=i.createBuffer(),I=y.__size,S=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,I,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,x),x}function u(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){let _=s[y.id],x=y.uniforms,I=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let S=0,T=x.length;S<T;S++){let C=Array.isArray(x[S])?x[S]:[x[S]];for(let E=0,M=C.length;E<M;E++){let P=C[E];if(f(P,S,E,I)===!0){let k=P.__offset,H=Array.isArray(P.value)?P.value:[P.value],F=0;for(let W=0;W<H.length;W++){let N=H[W],Z=v(N);typeof N=="number"||typeof N=="boolean"?(P.__data[0]=N,i.bufferSubData(i.UNIFORM_BUFFER,k+F,P.__data)):N.isMatrix3?(P.__data[0]=N.elements[0],P.__data[1]=N.elements[1],P.__data[2]=N.elements[2],P.__data[3]=0,P.__data[4]=N.elements[3],P.__data[5]=N.elements[4],P.__data[6]=N.elements[5],P.__data[7]=0,P.__data[8]=N.elements[6],P.__data[9]=N.elements[7],P.__data[10]=N.elements[8],P.__data[11]=0):(N.toArray(P.__data,F),F+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,k,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(y,_,x,I){let S=y.value,T=_+"_"+x;if(I[T]===void 0)return typeof S=="number"||typeof S=="boolean"?I[T]=S:I[T]=S.clone(),!0;{let C=I[T];if(typeof S=="number"||typeof S=="boolean"){if(C!==S)return I[T]=S,!0}else if(C.equals(S)===!1)return C.copy(S),!0}return!1}function m(y){let _=y.uniforms,x=0,I=16;for(let T=0,C=_.length;T<C;T++){let E=Array.isArray(_[T])?_[T]:[_[T]];for(let M=0,P=E.length;M<P;M++){let k=E[M],H=Array.isArray(k.value)?k.value:[k.value];for(let F=0,W=H.length;F<W;F++){let N=H[F],Z=v(N),V=x%I,ee=V%Z.boundary,he=V+ee;x+=ee,he!==0&&I-he<Z.storage&&(x+=I-he),k.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=x,x+=Z.storage}}}let S=x%I;return S>0&&(x+=I-S),y.__size=x,y.__cache={},this}function v(y){let _={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(_.boundary=4,_.storage=4):y.isVector2?(_.boundary=8,_.storage=8):y.isVector3||y.isColor?(_.boundary=16,_.storage=12):y.isVector4?(_.boundary=16,_.storage=16):y.isMatrix3?(_.boundary=48,_.storage=48):y.isMatrix4?(_.boundary=64,_.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),_}function g(y){let _=y.target;_.removeEventListener("dispose",g);let x=o.indexOf(_.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function p(){for(let y in s)i.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}var Xa=class{constructor(e={}){let{canvas:t=Xm(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let m=new Uint32Array(4),v=new Int32Array(4),g=null,p=null,y=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ht,this.toneMapping=hs,this.toneMappingExposure=1;let x=this,I=!1,S=0,T=0,C=null,E=-1,M=null,P=new At,k=new At,H=null,F=new Ue(0),W=0,N=t.width,Z=t.height,V=1,ee=null,he=null,xe=new At(0,0,N,Z),ke=new At(0,0,N,Z),Je=!1,K=new So,oe=!1,ge=!1,fe=new je,Te=new je,He=new A,Xe=new At,Qe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Q=!1;function me(){return C===null?V:1}let L=n;function Be(w,O){return t.getContext(w,O)}try{let w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${vu}`),t.addEventListener("webglcontextlost",re,!1),t.addEventListener("webglcontextrestored",Ie,!1),t.addEventListener("webglcontextcreationerror",Re,!1),L===null){let O="webgl2";if(L=Be(O,w),L===null)throw Be(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let se,ie,ae,Pe,Me,R,b,G,$,te,B,ne,pe,ye,Ye,ue,Ce,Ve,$e,Le,j,ve,be,U;function de(){se=new iy(L),se.init(),ve=new U1(L,se),ie=new Jx(L,se,e,ve),ae=new L1(L,se),ie.reverseDepthBuffer&&d&&ae.buffers.depth.setReversed(!0),Pe=new oy(L),Me=new y1,R=new k1(L,se,ae,Me,ie,ve,Pe),b=new Qx(x),G=new ny(x),$=new fg(L),be=new Kx(L,$),te=new sy(L,$,Pe,be),B=new ly(L,te,$,Pe),$e=new ay(L,ie,R),ue=new jx(Me),ne=new x1(x,b,G,se,ie,be,ue),pe=new O1(x,Me),ye=new M1,Ye=new A1(se),Ve=new Zx(x,b,G,ae,B,f,l),Ce=new P1(x,B,ie),U=new z1(L,Pe,ie,ae),Le=new $x(L,se,Pe),j=new ry(L,se,Pe),Pe.programs=ne.programs,x.capabilities=ie,x.extensions=se,x.properties=Me,x.renderLists=ye,x.shadowMap=Ce,x.state=ae,x.info=Pe}de();let Y=new Gh(x,L);this.xr=Y,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let w=se.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=se.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(w){w!==void 0&&(V=w,this.setSize(N,Z,!1))},this.getSize=function(w){return w.set(N,Z)},this.setSize=function(w,O,X=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}N=w,Z=O,t.width=Math.floor(w*V),t.height=Math.floor(O*V),X===!0&&(t.style.width=w+"px",t.style.height=O+"px"),this.setViewport(0,0,w,O)},this.getDrawingBufferSize=function(w){return w.set(N*V,Z*V).floor()},this.setDrawingBufferSize=function(w,O,X){N=w,Z=O,V=X,t.width=Math.floor(w*X),t.height=Math.floor(O*X),this.setViewport(0,0,w,O)},this.getCurrentViewport=function(w){return w.copy(P)},this.getViewport=function(w){return w.copy(xe)},this.setViewport=function(w,O,X,q){w.isVector4?xe.set(w.x,w.y,w.z,w.w):xe.set(w,O,X,q),ae.viewport(P.copy(xe).multiplyScalar(V).round())},this.getScissor=function(w){return w.copy(ke)},this.setScissor=function(w,O,X,q){w.isVector4?ke.set(w.x,w.y,w.z,w.w):ke.set(w,O,X,q),ae.scissor(k.copy(ke).multiplyScalar(V).round())},this.getScissorTest=function(){return Je},this.setScissorTest=function(w){ae.setScissorTest(Je=w)},this.setOpaqueSort=function(w){ee=w},this.setTransparentSort=function(w){he=w},this.getClearColor=function(w){return w.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor.apply(Ve,arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha.apply(Ve,arguments)},this.clear=function(w=!0,O=!0,X=!0){let q=0;if(w){let z=!1;if(C!==null){let _e=C.texture.format;z=_e===Cu||_e===Ru||_e===Au}if(z){let _e=C.texture.type,De=_e===zi||_e===Fs||_e===Eo||_e===Pr||_e===wu||_e===Su,Oe=Ve.getClearColor(),ze=Ve.getClearAlpha(),nt=Oe.r,rt=Oe.g,Ge=Oe.b;De?(m[0]=nt,m[1]=rt,m[2]=Ge,m[3]=ze,L.clearBufferuiv(L.COLOR,0,m)):(v[0]=nt,v[1]=rt,v[2]=Ge,v[3]=ze,L.clearBufferiv(L.COLOR,0,v))}else q|=L.COLOR_BUFFER_BIT}O&&(q|=L.DEPTH_BUFFER_BIT),X&&(q|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",re,!1),t.removeEventListener("webglcontextrestored",Ie,!1),t.removeEventListener("webglcontextcreationerror",Re,!1),ye.dispose(),Ye.dispose(),Me.dispose(),b.dispose(),G.dispose(),B.dispose(),be.dispose(),U.dispose(),ne.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",_d),Y.removeEventListener("sessionend",Md),Ts.stop()};function re(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function Ie(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;let w=Pe.autoReset,O=Ce.enabled,X=Ce.autoUpdate,q=Ce.needsUpdate,z=Ce.type;de(),Pe.autoReset=w,Ce.enabled=O,Ce.autoUpdate=X,Ce.needsUpdate=q,Ce.type=z}function Re(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function st(w){let O=w.target;O.removeEventListener("dispose",st),zt(O)}function zt(w){vn(w),Me.remove(w)}function vn(w){let O=Me.get(w).programs;O!==void 0&&(O.forEach(function(X){ne.releaseProgram(X)}),w.isShaderMaterial&&ne.releaseShaderCache(w))}this.renderBufferDirect=function(w,O,X,q,z,_e){O===null&&(O=Qe);let De=z.isMesh&&z.matrixWorld.determinant()<0,Oe=V0(w,O,X,q,z);ae.setMaterial(q,De);let ze=X.index,nt=1;if(q.wireframe===!0){if(ze=te.getWireframeAttribute(X),ze===void 0)return;nt=2}let rt=X.drawRange,Ge=X.attributes.position,vt=rt.start*nt,Ct=(rt.start+rt.count)*nt;_e!==null&&(vt=Math.max(vt,_e.start*nt),Ct=Math.min(Ct,(_e.start+_e.count)*nt)),ze!==null?(vt=Math.max(vt,0),Ct=Math.min(Ct,ze.count)):Ge!=null&&(vt=Math.max(vt,0),Ct=Math.min(Ct,Ge.count));let Lt=Ct-vt;if(Lt<0||Lt===1/0)return;be.setup(z,q,Oe,X,ze);let kn,bt=Le;if(ze!==null&&(kn=$.get(ze),bt=j,bt.setIndex(kn)),z.isMesh)q.wireframe===!0?(ae.setLineWidth(q.wireframeLinewidth*me()),bt.setMode(L.LINES)):bt.setMode(L.TRIANGLES);else if(z.isLine){let qe=q.linewidth;qe===void 0&&(qe=1),ae.setLineWidth(qe*me()),z.isLineSegments?bt.setMode(L.LINES):z.isLineLoop?bt.setMode(L.LINE_LOOP):bt.setMode(L.LINE_STRIP)}else z.isPoints?bt.setMode(L.POINTS):z.isSprite&&bt.setMode(L.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)bt.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(se.get("WEBGL_multi_draw"))bt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let qe=z._multiDrawStarts,Pi=z._multiDrawCounts,Et=z._multiDrawCount,ni=ze?$.get(ze).bytesPerElement:1,sr=Me.get(q).currentProgram.getUniforms();for(let On=0;On<Et;On++)sr.setValue(L,"_gl_DrawID",On),bt.render(qe[On]/ni,Pi[On])}else if(z.isInstancedMesh)bt.renderInstances(vt,Lt,z.count);else if(X.isInstancedBufferGeometry){let qe=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Pi=Math.min(X.instanceCount,qe);bt.renderInstances(vt,Lt,Pi)}else bt.render(vt,Lt)};function wt(w,O,X){w.transparent===!0&&w.side===dt&&w.forceSinglePass===!1?(w.side=_n,w.needsUpdate=!0,jo(w,O,X),w.side=yi,w.needsUpdate=!0,jo(w,O,X),w.side=dt):jo(w,O,X)}this.compile=function(w,O,X=null){X===null&&(X=w),p=Ye.get(X),p.init(O),_.push(p),X.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),w!==X&&w.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),p.setupLights();let q=new Set;return w.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let _e=z.material;if(_e)if(Array.isArray(_e))for(let De=0;De<_e.length;De++){let Oe=_e[De];wt(Oe,X,z),q.add(Oe)}else wt(_e,X,z),q.add(_e)}),_.pop(),p=null,q},this.compileAsync=function(w,O,X=null){let q=this.compile(w,O,X);return new Promise(z=>{function _e(){if(q.forEach(function(De){Me.get(De).currentProgram.isReady()&&q.delete(De)}),q.size===0){z(w);return}setTimeout(_e,10)}se.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let ti=null;function Ci(w){ti&&ti(w)}function _d(){Ts.stop()}function Md(){Ts.start()}let Ts=new op;Ts.setAnimationLoop(Ci),typeof self<"u"&&Ts.setContext(self),this.setAnimationLoop=function(w){ti=w,Y.setAnimationLoop(w),w===null?Ts.stop():Ts.start()},Y.addEventListener("sessionstart",_d),Y.addEventListener("sessionend",Md),this.render=function(w,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(O),O=Y.getCamera()),w.isScene===!0&&w.onBeforeRender(x,w,O,C),p=Ye.get(w,_.length),p.init(O),_.push(p),Te.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),K.setFromProjectionMatrix(Te),ge=this.localClippingEnabled,oe=ue.init(this.clippingPlanes,ge),g=ye.get(w,y.length),g.init(),y.push(g),Y.enabled===!0&&Y.isPresenting===!0){let _e=x.xr.getDepthSensingMesh();_e!==null&&lc(_e,O,-1/0,x.sortObjects)}lc(w,O,0,x.sortObjects),g.finish(),x.sortObjects===!0&&g.sort(ee,he),Q=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,Q&&Ve.addToRenderList(g,w),this.info.render.frame++,oe===!0&&ue.beginShadows();let X=p.state.shadowsArray;Ce.render(X,w,O),oe===!0&&ue.endShadows(),this.info.autoReset===!0&&this.info.reset();let q=g.opaque,z=g.transmissive;if(p.setupLights(),O.isArrayCamera){let _e=O.cameras;if(z.length>0)for(let De=0,Oe=_e.length;De<Oe;De++){let ze=_e[De];Ed(q,z,w,ze)}Q&&Ve.render(w);for(let De=0,Oe=_e.length;De<Oe;De++){let ze=_e[De];bd(g,w,ze,ze.viewport)}}else z.length>0&&Ed(q,z,w,O),Q&&Ve.render(w),bd(g,w,O);C!==null&&(R.updateMultisampleRenderTarget(C),R.updateRenderTargetMipmap(C)),w.isScene===!0&&w.onAfterRender(x,w,O),be.resetDefaultState(),E=-1,M=null,_.pop(),_.length>0?(p=_[_.length-1],oe===!0&&ue.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?g=y[y.length-1]:g=null};function lc(w,O,X,q){if(w.visible===!1)return;if(w.layers.test(O.layers)){if(w.isGroup)X=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(O);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||K.intersectsSprite(w)){q&&Xe.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Te);let De=B.update(w),Oe=w.material;Oe.visible&&g.push(w,De,Oe,X,Xe.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||K.intersectsObject(w))){let De=B.update(w),Oe=w.material;if(q&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Xe.copy(w.boundingSphere.center)):(De.boundingSphere===null&&De.computeBoundingSphere(),Xe.copy(De.boundingSphere.center)),Xe.applyMatrix4(w.matrixWorld).applyMatrix4(Te)),Array.isArray(Oe)){let ze=De.groups;for(let nt=0,rt=ze.length;nt<rt;nt++){let Ge=ze[nt],vt=Oe[Ge.materialIndex];vt&&vt.visible&&g.push(w,De,vt,X,Xe.z,Ge)}}else Oe.visible&&g.push(w,De,Oe,X,Xe.z,null)}}let _e=w.children;for(let De=0,Oe=_e.length;De<Oe;De++)lc(_e[De],O,X,q)}function bd(w,O,X,q){let z=w.opaque,_e=w.transmissive,De=w.transparent;p.setupLightsView(X),oe===!0&&ue.setGlobalState(x.clippingPlanes,X),q&&ae.viewport(P.copy(q)),z.length>0&&Jo(z,O,X),_e.length>0&&Jo(_e,O,X),De.length>0&&Jo(De,O,X),ae.buffers.depth.setTest(!0),ae.buffers.depth.setMask(!0),ae.buffers.color.setMask(!0),ae.setPolygonOffset(!1)}function Ed(w,O,X,q){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[q.id]===void 0&&(p.state.transmissionRenderTarget[q.id]=new Yn(1,1,{generateMipmaps:!0,type:se.has("EXT_color_buffer_half_float")||se.has("EXT_color_buffer_float")?ps:zi,minFilter:Bs,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ft.workingColorSpace}));let _e=p.state.transmissionRenderTarget[q.id],De=q.viewport||P;_e.setSize(De.z,De.w);let Oe=x.getRenderTarget();x.setRenderTarget(_e),x.getClearColor(F),W=x.getClearAlpha(),W<1&&x.setClearColor(16777215,.5),x.clear(),Q&&Ve.render(X);let ze=x.toneMapping;x.toneMapping=hs;let nt=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),p.setupLightsView(q),oe===!0&&ue.setGlobalState(x.clippingPlanes,q),Jo(w,X,q),R.updateMultisampleRenderTarget(_e),R.updateRenderTargetMipmap(_e),se.has("WEBGL_multisampled_render_to_texture")===!1){let rt=!1;for(let Ge=0,vt=O.length;Ge<vt;Ge++){let Ct=O[Ge],Lt=Ct.object,kn=Ct.geometry,bt=Ct.material,qe=Ct.group;if(bt.side===dt&&Lt.layers.test(q.layers)){let Pi=bt.side;bt.side=_n,bt.needsUpdate=!0,wd(Lt,X,q,kn,bt,qe),bt.side=Pi,bt.needsUpdate=!0,rt=!0}}rt===!0&&(R.updateMultisampleRenderTarget(_e),R.updateRenderTargetMipmap(_e))}x.setRenderTarget(Oe),x.setClearColor(F,W),nt!==void 0&&(q.viewport=nt),x.toneMapping=ze}function Jo(w,O,X){let q=O.isScene===!0?O.overrideMaterial:null;for(let z=0,_e=w.length;z<_e;z++){let De=w[z],Oe=De.object,ze=De.geometry,nt=q===null?De.material:q,rt=De.group;Oe.layers.test(X.layers)&&wd(Oe,O,X,ze,nt,rt)}}function wd(w,O,X,q,z,_e){w.onBeforeRender(x,O,X,q,z,_e),w.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),z.onBeforeRender(x,O,X,q,w,_e),z.transparent===!0&&z.side===dt&&z.forceSinglePass===!1?(z.side=_n,z.needsUpdate=!0,x.renderBufferDirect(X,O,q,z,w,_e),z.side=yi,z.needsUpdate=!0,x.renderBufferDirect(X,O,q,z,w,_e),z.side=dt):x.renderBufferDirect(X,O,q,z,w,_e),w.onAfterRender(x,O,X,q,z,_e)}function jo(w,O,X){O.isScene!==!0&&(O=Qe);let q=Me.get(w),z=p.state.lights,_e=p.state.shadowsArray,De=z.state.version,Oe=ne.getParameters(w,z.state,_e,O,X),ze=ne.getProgramCacheKey(Oe),nt=q.programs;q.environment=w.isMeshStandardMaterial?O.environment:null,q.fog=O.fog,q.envMap=(w.isMeshStandardMaterial?G:b).get(w.envMap||q.environment),q.envMapRotation=q.environment!==null&&w.envMap===null?O.environmentRotation:w.envMapRotation,nt===void 0&&(w.addEventListener("dispose",st),nt=new Map,q.programs=nt);let rt=nt.get(ze);if(rt!==void 0){if(q.currentProgram===rt&&q.lightsStateVersion===De)return Td(w,Oe),rt}else Oe.uniforms=ne.getUniforms(w),w.onBeforeCompile(Oe,x),rt=ne.acquireProgram(Oe,ze),nt.set(ze,rt),q.uniforms=Oe.uniforms;let Ge=q.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ge.clippingPlanes=ue.uniform),Td(w,Oe),q.needsLights=X0(w),q.lightsStateVersion=De,q.needsLights&&(Ge.ambientLightColor.value=z.state.ambient,Ge.lightProbe.value=z.state.probe,Ge.directionalLights.value=z.state.directional,Ge.directionalLightShadows.value=z.state.directionalShadow,Ge.spotLights.value=z.state.spot,Ge.spotLightShadows.value=z.state.spotShadow,Ge.rectAreaLights.value=z.state.rectArea,Ge.ltc_1.value=z.state.rectAreaLTC1,Ge.ltc_2.value=z.state.rectAreaLTC2,Ge.pointLights.value=z.state.point,Ge.pointLightShadows.value=z.state.pointShadow,Ge.hemisphereLights.value=z.state.hemi,Ge.directionalShadowMap.value=z.state.directionalShadowMap,Ge.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Ge.spotShadowMap.value=z.state.spotShadowMap,Ge.spotLightMatrix.value=z.state.spotLightMatrix,Ge.spotLightMap.value=z.state.spotLightMap,Ge.pointShadowMap.value=z.state.pointShadowMap,Ge.pointShadowMatrix.value=z.state.pointShadowMatrix),q.currentProgram=rt,q.uniformsList=null,rt}function Sd(w){if(w.uniformsList===null){let O=w.currentProgram.getUniforms();w.uniformsList=Tr.seqWithValue(O.seq,w.uniforms)}return w.uniformsList}function Td(w,O){let X=Me.get(w);X.outputColorSpace=O.outputColorSpace,X.batching=O.batching,X.batchingColor=O.batchingColor,X.instancing=O.instancing,X.instancingColor=O.instancingColor,X.instancingMorph=O.instancingMorph,X.skinning=O.skinning,X.morphTargets=O.morphTargets,X.morphNormals=O.morphNormals,X.morphColors=O.morphColors,X.morphTargetsCount=O.morphTargetsCount,X.numClippingPlanes=O.numClippingPlanes,X.numIntersection=O.numClipIntersection,X.vertexAlphas=O.vertexAlphas,X.vertexTangents=O.vertexTangents,X.toneMapping=O.toneMapping}function V0(w,O,X,q,z){O.isScene!==!0&&(O=Qe),R.resetTextureUnits();let _e=O.fog,De=q.isMeshStandardMaterial?O.environment:null,Oe=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Or,ze=(q.isMeshStandardMaterial?G:b).get(q.envMap||De),nt=q.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,rt=!!X.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Ge=!!X.morphAttributes.position,vt=!!X.morphAttributes.normal,Ct=!!X.morphAttributes.color,Lt=hs;q.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Lt=x.toneMapping);let kn=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,bt=kn!==void 0?kn.length:0,qe=Me.get(q),Pi=p.state.lights;if(oe===!0&&(ge===!0||w!==M)){let Xn=w===M&&q.id===E;ue.setState(q,w,Xn)}let Et=!1;q.version===qe.__version?(qe.needsLights&&qe.lightsStateVersion!==Pi.state.version||qe.outputColorSpace!==Oe||z.isBatchedMesh&&qe.batching===!1||!z.isBatchedMesh&&qe.batching===!0||z.isBatchedMesh&&qe.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&qe.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&qe.instancing===!1||!z.isInstancedMesh&&qe.instancing===!0||z.isSkinnedMesh&&qe.skinning===!1||!z.isSkinnedMesh&&qe.skinning===!0||z.isInstancedMesh&&qe.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&qe.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&qe.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&qe.instancingMorph===!1&&z.morphTexture!==null||qe.envMap!==ze||q.fog===!0&&qe.fog!==_e||qe.numClippingPlanes!==void 0&&(qe.numClippingPlanes!==ue.numPlanes||qe.numIntersection!==ue.numIntersection)||qe.vertexAlphas!==nt||qe.vertexTangents!==rt||qe.morphTargets!==Ge||qe.morphNormals!==vt||qe.morphColors!==Ct||qe.toneMapping!==Lt||qe.morphTargetsCount!==bt)&&(Et=!0):(Et=!0,qe.__version=q.version);let ni=qe.currentProgram;Et===!0&&(ni=jo(q,O,z));let sr=!1,On=!1,so=!1,Dt=ni.getUniforms(),gi=qe.uniforms;if(ae.useProgram(ni.program)&&(sr=!0,On=!0,so=!0),q.id!==E&&(E=q.id,On=!0),sr||M!==w){ae.buffers.depth.getReversed()?(fe.copy(w.projectionMatrix),Ym(fe),Zm(fe),Dt.setValue(L,"projectionMatrix",fe)):Dt.setValue(L,"projectionMatrix",w.projectionMatrix),Dt.setValue(L,"viewMatrix",w.matrixWorldInverse);let es=Dt.map.cameraPosition;es!==void 0&&es.setValue(L,He.setFromMatrixPosition(w.matrixWorld)),ie.logarithmicDepthBuffer&&Dt.setValue(L,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&Dt.setValue(L,"isOrthographic",w.isOrthographicCamera===!0),M!==w&&(M=w,On=!0,so=!0)}if(z.isSkinnedMesh){Dt.setOptional(L,z,"bindMatrix"),Dt.setOptional(L,z,"bindMatrixInverse");let Xn=z.skeleton;Xn&&(Xn.boneTexture===null&&Xn.computeBoneTexture(),Dt.setValue(L,"boneTexture",Xn.boneTexture,R))}z.isBatchedMesh&&(Dt.setOptional(L,z,"batchingTexture"),Dt.setValue(L,"batchingTexture",z._matricesTexture,R),Dt.setOptional(L,z,"batchingIdTexture"),Dt.setValue(L,"batchingIdTexture",z._indirectTexture,R),Dt.setOptional(L,z,"batchingColorTexture"),z._colorsTexture!==null&&Dt.setValue(L,"batchingColorTexture",z._colorsTexture,R));let ro=X.morphAttributes;if((ro.position!==void 0||ro.normal!==void 0||ro.color!==void 0)&&$e.update(z,X,ni),(On||qe.receiveShadow!==z.receiveShadow)&&(qe.receiveShadow=z.receiveShadow,Dt.setValue(L,"receiveShadow",z.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(gi.envMap.value=ze,gi.flipEnvMap.value=ze.isCubeTexture&&ze.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&O.environment!==null&&(gi.envMapIntensity.value=O.environmentIntensity),On&&(Dt.setValue(L,"toneMappingExposure",x.toneMappingExposure),qe.needsLights&&W0(gi,so),_e&&q.fog===!0&&pe.refreshFogUniforms(gi,_e),pe.refreshMaterialUniforms(gi,q,V,Z,p.state.transmissionRenderTarget[w.id]),Tr.upload(L,Sd(qe),gi,R)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Tr.upload(L,Sd(qe),gi,R),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&Dt.setValue(L,"center",z.center),Dt.setValue(L,"modelViewMatrix",z.modelViewMatrix),Dt.setValue(L,"normalMatrix",z.normalMatrix),Dt.setValue(L,"modelMatrix",z.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){let Xn=q.uniformsGroups;for(let es=0,ts=Xn.length;es<ts;es++){let Ad=Xn[es];U.update(Ad,ni),U.bind(Ad,ni)}}return ni}function W0(w,O){w.ambientLightColor.needsUpdate=O,w.lightProbe.needsUpdate=O,w.directionalLights.needsUpdate=O,w.directionalLightShadows.needsUpdate=O,w.pointLights.needsUpdate=O,w.pointLightShadows.needsUpdate=O,w.spotLights.needsUpdate=O,w.spotLightShadows.needsUpdate=O,w.rectAreaLights.needsUpdate=O,w.hemisphereLights.needsUpdate=O}function X0(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(w,O,X){Me.get(w.texture).__webglTexture=O,Me.get(w.depthTexture).__webglTexture=X;let q=Me.get(w);q.__hasExternalTextures=!0,q.__autoAllocateDepthBuffer=X===void 0,q.__autoAllocateDepthBuffer||se.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,O){let X=Me.get(w);X.__webglFramebuffer=O,X.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(w,O=0,X=0){C=w,S=O,T=X;let q=!0,z=null,_e=!1,De=!1;if(w){let ze=Me.get(w);if(ze.__useDefaultFramebuffer!==void 0)ae.bindFramebuffer(L.FRAMEBUFFER,null),q=!1;else if(ze.__webglFramebuffer===void 0)R.setupRenderTarget(w);else if(ze.__hasExternalTextures)R.rebindTextures(w,Me.get(w.texture).__webglTexture,Me.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let Ge=w.depthTexture;if(ze.__boundDepthTexture!==Ge){if(Ge!==null&&Me.has(Ge)&&(w.width!==Ge.image.width||w.height!==Ge.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(w)}}let nt=w.texture;(nt.isData3DTexture||nt.isDataArrayTexture||nt.isCompressedArrayTexture)&&(De=!0);let rt=Me.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(rt[O])?z=rt[O][X]:z=rt[O],_e=!0):w.samples>0&&R.useMultisampledRTT(w)===!1?z=Me.get(w).__webglMultisampledFramebuffer:Array.isArray(rt)?z=rt[X]:z=rt,P.copy(w.viewport),k.copy(w.scissor),H=w.scissorTest}else P.copy(xe).multiplyScalar(V).floor(),k.copy(ke).multiplyScalar(V).floor(),H=Je;if(ae.bindFramebuffer(L.FRAMEBUFFER,z)&&q&&ae.drawBuffers(w,z),ae.viewport(P),ae.scissor(k),ae.setScissorTest(H),_e){let ze=Me.get(w.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+O,ze.__webglTexture,X)}else if(De){let ze=Me.get(w.texture),nt=O||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,ze.__webglTexture,X||0,nt)}E=-1},this.readRenderTargetPixels=function(w,O,X,q,z,_e,De){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Oe=Me.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&De!==void 0&&(Oe=Oe[De]),Oe){ae.bindFramebuffer(L.FRAMEBUFFER,Oe);try{let ze=w.texture,nt=ze.format,rt=ze.type;if(!ie.textureFormatReadable(nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ie.textureTypeReadable(rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=w.width-q&&X>=0&&X<=w.height-z&&L.readPixels(O,X,q,z,ve.convert(nt),ve.convert(rt),_e)}finally{let ze=C!==null?Me.get(C).__webglFramebuffer:null;ae.bindFramebuffer(L.FRAMEBUFFER,ze)}}},this.readRenderTargetPixelsAsync=async function(w,O,X,q,z,_e,De){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Oe=Me.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&De!==void 0&&(Oe=Oe[De]),Oe){let ze=w.texture,nt=ze.format,rt=ze.type;if(!ie.textureFormatReadable(nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ie.textureTypeReadable(rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=w.width-q&&X>=0&&X<=w.height-z){ae.bindFramebuffer(L.FRAMEBUFFER,Oe);let Ge=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Ge),L.bufferData(L.PIXEL_PACK_BUFFER,_e.byteLength,L.STREAM_READ),L.readPixels(O,X,q,z,ve.convert(nt),ve.convert(rt),0);let vt=C!==null?Me.get(C).__webglFramebuffer:null;ae.bindFramebuffer(L.FRAMEBUFFER,vt);let Ct=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await qm(L,Ct,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Ge),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,_e),L.deleteBuffer(Ge),L.deleteSync(Ct),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,O=null,X=0){w.isTexture!==!0&&(mo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,w=arguments[1]);let q=Math.pow(2,-X),z=Math.floor(w.image.width*q),_e=Math.floor(w.image.height*q),De=O!==null?O.x:0,Oe=O!==null?O.y:0;R.setTexture2D(w,0),L.copyTexSubImage2D(L.TEXTURE_2D,X,0,0,De,Oe,z,_e),ae.unbindTexture()},this.copyTextureToTexture=function(w,O,X=null,q=null,z=0){w.isTexture!==!0&&(mo("WebGLRenderer: copyTextureToTexture function signature has changed."),q=arguments[0]||null,w=arguments[1],O=arguments[2],z=arguments[3]||0,X=null);let _e,De,Oe,ze,nt,rt,Ge,vt,Ct,Lt=w.isCompressedTexture?w.mipmaps[z]:w.image;X!==null?(_e=X.max.x-X.min.x,De=X.max.y-X.min.y,Oe=X.isBox3?X.max.z-X.min.z:1,ze=X.min.x,nt=X.min.y,rt=X.isBox3?X.min.z:0):(_e=Lt.width,De=Lt.height,Oe=Lt.depth||1,ze=0,nt=0,rt=0),q!==null?(Ge=q.x,vt=q.y,Ct=q.z):(Ge=0,vt=0,Ct=0);let kn=ve.convert(O.format),bt=ve.convert(O.type),qe;O.isData3DTexture?(R.setTexture3D(O,0),qe=L.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(R.setTexture2DArray(O,0),qe=L.TEXTURE_2D_ARRAY):(R.setTexture2D(O,0),qe=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,O.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,O.unpackAlignment);let Pi=L.getParameter(L.UNPACK_ROW_LENGTH),Et=L.getParameter(L.UNPACK_IMAGE_HEIGHT),ni=L.getParameter(L.UNPACK_SKIP_PIXELS),sr=L.getParameter(L.UNPACK_SKIP_ROWS),On=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,Lt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Lt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,ze),L.pixelStorei(L.UNPACK_SKIP_ROWS,nt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,rt);let so=w.isDataArrayTexture||w.isData3DTexture,Dt=O.isDataArrayTexture||O.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){let gi=Me.get(w),ro=Me.get(O),Xn=Me.get(gi.__renderTarget),es=Me.get(ro.__renderTarget);ae.bindFramebuffer(L.READ_FRAMEBUFFER,Xn.__webglFramebuffer),ae.bindFramebuffer(L.DRAW_FRAMEBUFFER,es.__webglFramebuffer);for(let ts=0;ts<Oe;ts++)so&&L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Me.get(w).__webglTexture,z,rt+ts),w.isDepthTexture?(Dt&&L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Me.get(O).__webglTexture,z,Ct+ts),L.blitFramebuffer(ze,nt,_e,De,Ge,vt,_e,De,L.DEPTH_BUFFER_BIT,L.NEAREST)):Dt?L.copyTexSubImage3D(qe,z,Ge,vt,Ct+ts,ze,nt,_e,De):L.copyTexSubImage2D(qe,z,Ge,vt,Ct+ts,ze,nt,_e,De);ae.bindFramebuffer(L.READ_FRAMEBUFFER,null),ae.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else Dt?w.isDataTexture||w.isData3DTexture?L.texSubImage3D(qe,z,Ge,vt,Ct,_e,De,Oe,kn,bt,Lt.data):O.isCompressedArrayTexture?L.compressedTexSubImage3D(qe,z,Ge,vt,Ct,_e,De,Oe,kn,Lt.data):L.texSubImage3D(qe,z,Ge,vt,Ct,_e,De,Oe,kn,bt,Lt):w.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,z,Ge,vt,_e,De,kn,bt,Lt.data):w.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,z,Ge,vt,Lt.width,Lt.height,kn,Lt.data):L.texSubImage2D(L.TEXTURE_2D,z,Ge,vt,_e,De,kn,bt,Lt);L.pixelStorei(L.UNPACK_ROW_LENGTH,Pi),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Et),L.pixelStorei(L.UNPACK_SKIP_PIXELS,ni),L.pixelStorei(L.UNPACK_SKIP_ROWS,sr),L.pixelStorei(L.UNPACK_SKIP_IMAGES,On),z===0&&O.generateMipmaps&&L.generateMipmap(qe),ae.unbindTexture()},this.copyTextureToTexture3D=function(w,O,X=null,q=null,z=0){return w.isTexture!==!0&&(mo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),X=arguments[0]||null,q=arguments[1]||null,w=arguments[2],O=arguments[3],z=arguments[4]||0),mo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,O,X,q,z)},this.initRenderTarget=function(w){Me.get(w).__webglFramebuffer===void 0&&R.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?R.setTextureCube(w,0):w.isData3DTexture?R.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?R.setTexture2DArray(w,0):R.setTexture2D(w,0),ae.unbindTexture()},this.resetState=function(){S=0,T=0,C=null,ae.reset(),be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Bi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=ft._getDrawingBufferColorSpace(e),t.unpackColorSpace=ft._getUnpackColorSpace()}};var qa=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ue(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Mi=class extends nn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new pn,this.environmentIntensity=1,this.environmentRotation=new pn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var Vh=class extends Pn{constructor(e=null,t=1,n=1,s,r,o,a,l,c=Cn,h=Cn,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var To=class extends Ft{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},yr=new je,Cf=new je,_a=[],Pf=new Gi,G1=new je,ho=new D,uo=new Vi,ai=class extends D{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new To(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,G1)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Gi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,yr),Pf.copy(e.boundingBox).applyMatrix4(yr),this.boundingBox.union(Pf)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Vi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,yr),uo.copy(e.boundingSphere).applyMatrix4(yr),this.boundingSphere.union(uo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(ho.geometry=this.geometry,ho.material=this.material,ho.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),uo.copy(this.boundingSphere),uo.applyMatrix4(n),e.ray.intersectsSphere(uo)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,yr),Cf.multiplyMatrices(n,yr),ho.matrixWorld=Cf,ho.raycast(e,_a);for(let o=0,a=_a.length;o<a;o++){let l=_a[o];l.instanceId=r,l.object=this,t.push(l)}_a.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new To(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Vh(new Float32Array(s*this.count),s,this.count,Tu,xi));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var Wh=class extends _i{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new Ue(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Ya=new A,Za=new A,If=new je,fo=new wo,Ma=new Vi,Hc=new A,Lf=new A,Xh=class extends nn{constructor(e=new xt,t=new Wh){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ya.fromBufferAttribute(t,s-1),Za.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ya.distanceTo(Za);e.setAttribute("lineDistance",new Ze(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ma.copy(n.boundingSphere),Ma.applyMatrix4(s),Ma.radius+=r,e.ray.intersectsSphere(Ma)===!1)return;If.copy(s).invert(),fo.copy(e.ray).applyMatrix4(If);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=c){let p=h.getX(v),y=h.getX(v+1),_=ba(this,e,fo,l,p,y);_&&t.push(_)}if(this.isLineLoop){let v=h.getX(m-1),g=h.getX(f),p=ba(this,e,fo,l,v,g);p&&t.push(p)}}else{let f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=c){let p=ba(this,e,fo,l,v,v+1);p&&t.push(p)}if(this.isLineLoop){let v=ba(this,e,fo,l,m-1,f);v&&t.push(v)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function ba(i,e,t,n,s,r){let o=i.geometry.attributes.position;if(Ya.fromBufferAttribute(o,s),Za.fromBufferAttribute(o,r),t.distanceSqToSegment(Ya,Za,Hc,Lf)>n)return;Hc.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(Hc);if(!(l<e.near||l>e.far))return{distance:l,point:Lf.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}var Df=new A,kf=new A,Ka=class extends Xh{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Df.fromBufferAttribute(t,s),kf.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Df.distanceTo(kf);e.setAttribute("lineDistance",new Ze(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var qh=class extends _i{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Ue(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Uf=new je,Yh=new wo,Ea=new Vi,wa=new A,$a=class extends nn{constructor(e=new xt,t=new qh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ea.copy(n.boundingSphere),Ea.applyMatrix4(s),Ea.radius+=r,e.ray.intersectsSphere(Ea)===!1)return;Uf.copy(s).invert(),Yh.copy(e.ray).applyMatrix4(Uf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let m=d,v=f;m<v;m++){let g=c.getX(m);wa.fromBufferAttribute(u,g),Nf(wa,g,l,s,e,t,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let m=d,v=f;m<v;m++)wa.fromBufferAttribute(u,m),Nf(wa,m,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Nf(i,e,t,n,s,r,o){let a=Yh.distanceSqToPoint(i);if(a<t){let l=new A;Yh.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Ja=class extends Pn{constructor(e,t){super({width:e,height:t}),this.isFramebufferTexture=!0,this.magFilter=Cn,this.minFilter=Cn,this.generateMipmaps=!1,this.needsUpdate=!0}};var Pt=class extends Pn{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Zn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new le:new A);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new A,s=[],r=[],o=[],a=new A,l=new je;for(let f=0;f<=e;f++){let m=f/e;s[f]=this.getTangentAt(m,new A)}r[0]=new A,o[0]=new A;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let m=Math.acos(tn(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,m))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(tn(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let m=1;m<=e;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],f*m)),o[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Ao=class extends Zn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new le){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Zh=class extends Ao{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Du(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var Sa=new A,Bc=new Du,Fc=new Du,Oc=new Du,Kh=class extends Zn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new A){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(Sa.subVectors(s[0],s[1]).add(s[0]),c=Sa);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Sa.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Sa),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),Bc.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,m,v,g),Fc.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,m,v,g),Oc.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,m,v,g)}else this.curveType==="catmullrom"&&(Bc.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Fc.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Oc.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Bc.calc(l),Fc.calc(l),Oc.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new A().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Hf(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function V1(i,e){let t=1-i;return t*t*e}function W1(i,e){return 2*(1-i)*i*e}function X1(i,e){return i*i*e}function _o(i,e,t,n){return V1(i,e)+W1(i,t)+X1(i,n)}function q1(i,e){let t=1-i;return t*t*t*e}function Y1(i,e){let t=1-i;return 3*t*t*i*e}function Z1(i,e){return 3*(1-i)*i*i*e}function K1(i,e){return i*i*i*e}function Mo(i,e,t,n,s){return q1(i,e)+Y1(i,t)+Z1(i,n)+K1(i,s)}var ja=class extends Zn{constructor(e=new le,t=new le,n=new le,s=new le){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new le){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Mo(e,s.x,r.x,o.x,a.x),Mo(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},$h=class extends Zn{constructor(e=new A,t=new A,n=new A,s=new A){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new A){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Mo(e,s.x,r.x,o.x,a.x),Mo(e,s.y,r.y,o.y,a.y),Mo(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Qa=class extends Zn{constructor(e=new le,t=new le){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new le){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new le){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Jh=class extends Zn{constructor(e=new A,t=new A){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new A){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new A){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},el=class extends Zn{constructor(e=new le,t=new le,n=new le){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new le){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(_o(e,s.x,r.x,o.x),_o(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},jh=class extends Zn{constructor(e=new A,t=new A,n=new A){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new A){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(_o(e,s.x,r.x,o.x),_o(e,s.y,r.y,o.y),_o(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},tl=class extends Zn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new le){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Hf(a,l.x,c.x,h.x,u.x),Hf(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new le().fromArray(s))}return this}},Qh=Object.freeze({__proto__:null,ArcCurve:Zh,CatmullRomCurve3:Kh,CubicBezierCurve:ja,CubicBezierCurve3:$h,EllipseCurve:Ao,LineCurve:Qa,LineCurve3:Jh,QuadraticBezierCurve:el,QuadraticBezierCurve3:jh,SplineCurve:tl}),eu=class extends Zn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Qh[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Qh[s.type]().fromJSON(s))}return this}},Ro=class extends eu{constructor(e){super(),this.type="Path",this.currentPoint=new le,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Qa(this.currentPoint.clone(),new le(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new el(this.currentPoint.clone(),new le(e,t),new le(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new ja(this.currentPoint.clone(),new le(e,t),new le(n,s),new le(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new tl(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){let c=new Ao(e,t,n,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Co=class i extends xt{constructor(e=[new le(0,-.5),new le(.5,0),new le(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=tn(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/t,u=new A,d=new le,f=new A,m=new A,v=new A,g=0,p=0;for(let y=0;y<=e.length-1;y++)switch(y){case 0:g=e[y+1].x-e[y].x,p=e[y+1].y-e[y].y,f.x=p*1,f.y=-g,f.z=p*0,v.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(v.x,v.y,v.z);break;default:g=e[y+1].x-e[y].x,p=e[y+1].y-e[y].y,f.x=p*1,f.y=-g,f.z=p*0,m.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),l.push(f.x,f.y,f.z),v.copy(m)}for(let y=0;y<=t;y++){let _=n+y*h*s,x=Math.sin(_),I=Math.cos(_);for(let S=0;S<=e.length-1;S++){u.x=e[S].x*x,u.y=e[S].y,u.z=e[S].x*I,o.push(u.x,u.y,u.z),d.x=y/t,d.y=S/(e.length-1),a.push(d.x,d.y);let T=l[3*S+0]*x,C=l[3*S+1],E=l[3*S+0]*I;c.push(T,C,E)}}for(let y=0;y<t;y++)for(let _=0;_<e.length-1;_++){let x=_+y*e.length,I=x,S=x+e.length,T=x+e.length+1,C=x+1;r.push(I,S,C),r.push(T,C,S)}this.setIndex(r),this.setAttribute("position",new Ze(o,3)),this.setAttribute("uv",new Ze(a,2)),this.setAttribute("normal",new Ze(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},Os=class i extends Co{constructor(e=1,t=1,n=4,s=8){let r=new Ro;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:s}}static fromJSON(e){return new i(e.radius,e.length,e.capSegments,e.radialSegments)}},Un=class i extends xt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],l=[],c=new A,h=new le;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/e+1)/2,h.y=(o[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Ze(o,3)),this.setAttribute("normal",new Ze(a,3)),this.setAttribute("uv",new Ze(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},We=class i extends xt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,v=[],g=n/2,p=0;y(),o===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new Ze(u,3)),this.setAttribute("normal",new Ze(d,3)),this.setAttribute("uv",new Ze(f,2));function y(){let x=new A,I=new A,S=0,T=(t-e)/n;for(let C=0;C<=r;C++){let E=[],M=C/r,P=M*(t-e)+e;for(let k=0;k<=s;k++){let H=k/s,F=H*l+a,W=Math.sin(F),N=Math.cos(F);I.x=P*W,I.y=-M*n+g,I.z=P*N,u.push(I.x,I.y,I.z),x.set(W,T,N).normalize(),d.push(x.x,x.y,x.z),f.push(H,1-M),E.push(m++)}v.push(E)}for(let C=0;C<s;C++)for(let E=0;E<r;E++){let M=v[E][C],P=v[E+1][C],k=v[E+1][C+1],H=v[E][C+1];(e>0||E!==0)&&(h.push(M,P,H),S+=3),(t>0||E!==r-1)&&(h.push(P,k,H),S+=3)}c.addGroup(p,S,0),p+=S}function _(x){let I=m,S=new le,T=new A,C=0,E=x===!0?e:t,M=x===!0?1:-1;for(let k=1;k<=s;k++)u.push(0,g*M,0),d.push(0,M,0),f.push(.5,.5),m++;let P=m;for(let k=0;k<=s;k++){let F=k/s*l+a,W=Math.cos(F),N=Math.sin(F);T.x=E*N,T.y=g*M,T.z=E*W,u.push(T.x,T.y,T.z),d.push(0,M,0),S.x=W*.5+.5,S.y=N*.5*M+.5,f.push(S.x,S.y),m++}for(let k=0;k<s;k++){let H=I+k,F=P+k;x===!0?h.push(F,F+1,H):h.push(F+1,F,H),C+=3}c.addGroup(p,C,x===!0?1:2),p+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Wn=class i extends We{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},tu=class i extends xt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new Ze(r,3)),this.setAttribute("normal",new Ze(r.slice(),3)),this.setAttribute("uv",new Ze(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(y){let _=new A,x=new A,I=new A;for(let S=0;S<t.length;S+=3)f(t[S+0],_),f(t[S+1],x),f(t[S+2],I),l(_,x,I,y)}function l(y,_,x,I){let S=I+1,T=[];for(let C=0;C<=S;C++){T[C]=[];let E=y.clone().lerp(x,C/S),M=_.clone().lerp(x,C/S),P=S-C;for(let k=0;k<=P;k++)k===0&&C===S?T[C][k]=E:T[C][k]=E.clone().lerp(M,k/P)}for(let C=0;C<S;C++)for(let E=0;E<2*(S-C)-1;E++){let M=Math.floor(E/2);E%2===0?(d(T[C][M+1]),d(T[C+1][M]),d(T[C][M])):(d(T[C][M+1]),d(T[C+1][M+1]),d(T[C+1][M]))}}function c(y){let _=new A;for(let x=0;x<r.length;x+=3)_.x=r[x+0],_.y=r[x+1],_.z=r[x+2],_.normalize().multiplyScalar(y),r[x+0]=_.x,r[x+1]=_.y,r[x+2]=_.z}function h(){let y=new A;for(let _=0;_<r.length;_+=3){y.x=r[_+0],y.y=r[_+1],y.z=r[_+2];let x=g(y)/2/Math.PI+.5,I=p(y)/Math.PI+.5;o.push(x,1-I)}m(),u()}function u(){for(let y=0;y<o.length;y+=6){let _=o[y+0],x=o[y+2],I=o[y+4],S=Math.max(_,x,I),T=Math.min(_,x,I);S>.9&&T<.1&&(_<.2&&(o[y+0]+=1),x<.2&&(o[y+2]+=1),I<.2&&(o[y+4]+=1))}}function d(y){r.push(y.x,y.y,y.z)}function f(y,_){let x=y*3;_.x=e[x+0],_.y=e[x+1],_.z=e[x+2]}function m(){let y=new A,_=new A,x=new A,I=new A,S=new le,T=new le,C=new le;for(let E=0,M=0;E<r.length;E+=9,M+=6){y.set(r[E+0],r[E+1],r[E+2]),_.set(r[E+3],r[E+4],r[E+5]),x.set(r[E+6],r[E+7],r[E+8]),S.set(o[M+0],o[M+1]),T.set(o[M+2],o[M+3]),C.set(o[M+4],o[M+5]),I.copy(y).add(_).add(x).divideScalar(3);let P=g(I);v(S,M+0,y,P),v(T,M+2,_,P),v(C,M+4,x,P)}}function v(y,_,x,I){I<0&&y.x===1&&(o[_]=y.x-1),x.x===0&&x.z===0&&(o[_]=I/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var mn=class extends Ro{constructor(e){super(e),this.uuid=Ws(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new Ro().fromJSON(s))}return this}},$1={triangulate:function(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=up(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,u,d,f;if(n&&(r=t_(i,e,r,t)),i.length>80*t){a=c=i[0],l=h=i[1];for(let m=t;m<s;m+=t)u=i[m],d=i[m+1],u<a&&(a=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-a,h-l),f=f!==0?32767/f:0}return Po(r,o,t,a,l,f,0),o}};function up(i,e,t,n,s){let r,o;if(s===d_(i,e,t,n)>0)for(r=e;r<t;r+=n)o=Bf(r,i[r],i[r+1],o);else for(r=t-n;r>=e;r-=n)o=Bf(r,i[r],i[r+1],o);return o&&cl(o,o.next)&&(Lo(o),o=o.next),o}function zs(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(cl(t,t.next)||Bt(t.prev,t,t.next)===0)){if(Lo(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Po(i,e,t,n,s,r,o){if(!i)return;!o&&r&&o_(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?j1(i,n,s,r):J1(i)){e.push(l.i/t|0),e.push(i.i/t|0),e.push(c.i/t|0),Lo(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=Q1(zs(i),e,t),Po(i,e,t,n,s,r,2)):o===2&&e_(i,e,t,n,s,r):Po(zs(i),e,t,n,s,r,1);break}}}function J1(i){let e=i.prev,t=i,n=i.next;if(Bt(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=s<r?s<o?s:o:r<o?r:o,u=a<l?a<c?a:c:l<c?l:c,d=s>r?s>o?s:o:r>o?r:o,f=a>l?a>c?a:c:l>c?l:c,m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&br(s,a,r,l,o,c,m.x,m.y)&&Bt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function j1(i,e,t,n){let s=i.prev,r=i,o=i.next;if(Bt(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,f=a<l?a<c?a:c:l<c?l:c,m=h<u?h<d?h:d:u<d?u:d,v=a>l?a>c?a:c:l>c?l:c,g=h>u?h>d?h:d:u>d?u:d,p=nu(f,m,e,t,n),y=nu(v,g,e,t,n),_=i.prevZ,x=i.nextZ;for(;_&&_.z>=p&&x&&x.z<=y;){if(_.x>=f&&_.x<=v&&_.y>=m&&_.y<=g&&_!==s&&_!==o&&br(a,h,l,u,c,d,_.x,_.y)&&Bt(_.prev,_,_.next)>=0||(_=_.prevZ,x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&br(a,h,l,u,c,d,x.x,x.y)&&Bt(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;_&&_.z>=p;){if(_.x>=f&&_.x<=v&&_.y>=m&&_.y<=g&&_!==s&&_!==o&&br(a,h,l,u,c,d,_.x,_.y)&&Bt(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;x&&x.z<=y;){if(x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&br(a,h,l,u,c,d,x.x,x.y)&&Bt(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Q1(i,e,t){let n=i;do{let s=n.prev,r=n.next.next;!cl(s,r)&&dp(s,n,n.next,r)&&Io(s,r)&&Io(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),Lo(n),Lo(n.next),n=i=r),n=n.next}while(n!==i);return zs(n)}function e_(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&c_(o,a)){let l=fp(o,a);o=zs(o,o.next),l=zs(l,l.next),Po(o,e,t,n,s,r,0),Po(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function t_(i,e,t,n){let s=[],r,o,a,l,c;for(r=0,o=e.length;r<o;r++)a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=up(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(l_(c));for(s.sort(n_),r=0;r<s.length;r++)t=i_(s[r],t);return t}function n_(i,e){return i.x-e.x}function i_(i,e){let t=s_(i,e);if(!t)return e;let n=fp(t,i);return zs(n,n.next),zs(t,t.next)}function s_(i,e){let t=e,n=-1/0,s,r=i.x,o=i.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){let d=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=r&&d>n&&(n=d,s=t.x<t.next.x?t:t.next,d===r))return s}t=t.next}while(t!==e);if(!s)return null;let a=s,l=s.x,c=s.y,h=1/0,u;t=s;do r>=t.x&&t.x>=l&&r!==t.x&&br(o<c?r:n,o,l,c,o<c?n:r,o,t.x,t.y)&&(u=Math.abs(o-t.y)/(r-t.x),Io(t,i)&&(u<h||u===h&&(t.x>s.x||t.x===s.x&&r_(s,t)))&&(s=t,h=u)),t=t.next;while(t!==a);return s}function r_(i,e){return Bt(i.prev,i,e.prev)<0&&Bt(e.next,i,i.next)<0}function o_(i,e,t,n){let s=i;do s.z===0&&(s.z=nu(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,a_(s)}function a_(i){let e,t,n,s,r,o,a,l,c=1;do{for(t=i,i=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<c&&(a++,n=n.nextZ,!!n);e++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,c*=2}while(o>1);return i}function nu(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function l_(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function br(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function c_(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!h_(i,e)&&(Io(i,e)&&Io(e,i)&&u_(i,e)&&(Bt(i.prev,i,e.prev)||Bt(i,e.prev,e))||cl(i,e)&&Bt(i.prev,i,i.next)>0&&Bt(e.prev,e,e.next)>0)}function Bt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function cl(i,e){return i.x===e.x&&i.y===e.y}function dp(i,e,t,n){let s=Aa(Bt(i,e,t)),r=Aa(Bt(i,e,n)),o=Aa(Bt(t,n,i)),a=Aa(Bt(t,n,e));return!!(s!==r&&o!==a||s===0&&Ta(i,t,e)||r===0&&Ta(i,n,e)||o===0&&Ta(t,i,n)||a===0&&Ta(t,e,n))}function Ta(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Aa(i){return i>0?1:i<0?-1:0}function h_(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&dp(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Io(i,e){return Bt(i.prev,i,i.next)<0?Bt(i,e,i.next)>=0&&Bt(i,i.prev,e)>=0:Bt(i,e,i.prev)<0||Bt(i,i.next,e)<0}function u_(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function fp(i,e){let t=new iu(i.i,i.x,i.y),n=new iu(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Bf(i,e,t,n){let s=new iu(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Lo(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function iu(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function d_(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var us=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Ff(e),Of(n,e);let o=e.length;t.forEach(Ff);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,Of(n,t[l]);let a=$1.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Ff(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Of(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var Kn=class i extends xt{constructor(e=new mn([new le(.5,.5),new le(-.5,.5),new le(-.5,-.5),new le(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new Ze(s,3)),this.setAttribute("uv",new Ze(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:f-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,y=t.UVGenerator!==void 0?t.UVGenerator:f_,_,x=!1,I,S,T,C;p&&(_=p.getSpacedPoints(h),x=!0,d=!1,I=p.computeFrenetFrames(h,!1),S=new A,T=new A,C=new A),d||(g=0,f=0,m=0,v=0);let E=a.extractPoints(c),M=E.shape,P=E.holes;if(!us.isClockWise(M)){M=M.reverse();for(let Q=0,me=P.length;Q<me;Q++){let L=P[Q];us.isClockWise(L)&&(P[Q]=L.reverse())}}let H=us.triangulateShape(M,P),F=M;for(let Q=0,me=P.length;Q<me;Q++){let L=P[Q];M=M.concat(L)}function W(Q,me,L){return me||console.error("THREE.ExtrudeGeometry: vec does not exist"),Q.clone().addScaledVector(me,L)}let N=M.length,Z=H.length;function V(Q,me,L){let Be,se,ie,ae=Q.x-me.x,Pe=Q.y-me.y,Me=L.x-Q.x,R=L.y-Q.y,b=ae*ae+Pe*Pe,G=ae*R-Pe*Me;if(Math.abs(G)>Number.EPSILON){let $=Math.sqrt(b),te=Math.sqrt(Me*Me+R*R),B=me.x-Pe/$,ne=me.y+ae/$,pe=L.x-R/te,ye=L.y+Me/te,Ye=((pe-B)*R-(ye-ne)*Me)/(ae*R-Pe*Me);Be=B+ae*Ye-Q.x,se=ne+Pe*Ye-Q.y;let ue=Be*Be+se*se;if(ue<=2)return new le(Be,se);ie=Math.sqrt(ue/2)}else{let $=!1;ae>Number.EPSILON?Me>Number.EPSILON&&($=!0):ae<-Number.EPSILON?Me<-Number.EPSILON&&($=!0):Math.sign(Pe)===Math.sign(R)&&($=!0),$?(Be=-Pe,se=ae,ie=Math.sqrt(b)):(Be=ae,se=Pe,ie=Math.sqrt(b/2))}return new le(Be/ie,se/ie)}let ee=[];for(let Q=0,me=F.length,L=me-1,Be=Q+1;Q<me;Q++,L++,Be++)L===me&&(L=0),Be===me&&(Be=0),ee[Q]=V(F[Q],F[L],F[Be]);let he=[],xe,ke=ee.concat();for(let Q=0,me=P.length;Q<me;Q++){let L=P[Q];xe=[];for(let Be=0,se=L.length,ie=se-1,ae=Be+1;Be<se;Be++,ie++,ae++)ie===se&&(ie=0),ae===se&&(ae=0),xe[Be]=V(L[Be],L[ie],L[ae]);he.push(xe),ke=ke.concat(xe)}for(let Q=0;Q<g;Q++){let me=Q/g,L=f*Math.cos(me*Math.PI/2),Be=m*Math.sin(me*Math.PI/2)+v;for(let se=0,ie=F.length;se<ie;se++){let ae=W(F[se],ee[se],Be);fe(ae.x,ae.y,-L)}for(let se=0,ie=P.length;se<ie;se++){let ae=P[se];xe=he[se];for(let Pe=0,Me=ae.length;Pe<Me;Pe++){let R=W(ae[Pe],xe[Pe],Be);fe(R.x,R.y,-L)}}}let Je=m+v;for(let Q=0;Q<N;Q++){let me=d?W(M[Q],ke[Q],Je):M[Q];x?(T.copy(I.normals[0]).multiplyScalar(me.x),S.copy(I.binormals[0]).multiplyScalar(me.y),C.copy(_[0]).add(T).add(S),fe(C.x,C.y,C.z)):fe(me.x,me.y,0)}for(let Q=1;Q<=h;Q++)for(let me=0;me<N;me++){let L=d?W(M[me],ke[me],Je):M[me];x?(T.copy(I.normals[Q]).multiplyScalar(L.x),S.copy(I.binormals[Q]).multiplyScalar(L.y),C.copy(_[Q]).add(T).add(S),fe(C.x,C.y,C.z)):fe(L.x,L.y,u/h*Q)}for(let Q=g-1;Q>=0;Q--){let me=Q/g,L=f*Math.cos(me*Math.PI/2),Be=m*Math.sin(me*Math.PI/2)+v;for(let se=0,ie=F.length;se<ie;se++){let ae=W(F[se],ee[se],Be);fe(ae.x,ae.y,u+L)}for(let se=0,ie=P.length;se<ie;se++){let ae=P[se];xe=he[se];for(let Pe=0,Me=ae.length;Pe<Me;Pe++){let R=W(ae[Pe],xe[Pe],Be);x?fe(R.x,R.y+_[h-1].y,_[h-1].x+L):fe(R.x,R.y,u+L)}}}K(),oe();function K(){let Q=s.length/3;if(d){let me=0,L=N*me;for(let Be=0;Be<Z;Be++){let se=H[Be];Te(se[2]+L,se[1]+L,se[0]+L)}me=h+g*2,L=N*me;for(let Be=0;Be<Z;Be++){let se=H[Be];Te(se[0]+L,se[1]+L,se[2]+L)}}else{for(let me=0;me<Z;me++){let L=H[me];Te(L[2],L[1],L[0])}for(let me=0;me<Z;me++){let L=H[me];Te(L[0]+N*h,L[1]+N*h,L[2]+N*h)}}n.addGroup(Q,s.length/3-Q,0)}function oe(){let Q=s.length/3,me=0;ge(F,me),me+=F.length;for(let L=0,Be=P.length;L<Be;L++){let se=P[L];ge(se,me),me+=se.length}n.addGroup(Q,s.length/3-Q,1)}function ge(Q,me){let L=Q.length;for(;--L>=0;){let Be=L,se=L-1;se<0&&(se=Q.length-1);for(let ie=0,ae=h+g*2;ie<ae;ie++){let Pe=N*ie,Me=N*(ie+1),R=me+Be+Pe,b=me+se+Pe,G=me+se+Me,$=me+Be+Me;He(R,b,G,$)}}}function fe(Q,me,L){l.push(Q),l.push(me),l.push(L)}function Te(Q,me,L){Xe(Q),Xe(me),Xe(L);let Be=s.length/3,se=y.generateTopUV(n,s,Be-3,Be-2,Be-1);Qe(se[0]),Qe(se[1]),Qe(se[2])}function He(Q,me,L,Be){Xe(Q),Xe(me),Xe(Be),Xe(me),Xe(L),Xe(Be);let se=s.length/3,ie=y.generateSideWallUV(n,s,se-6,se-3,se-2,se-1);Qe(ie[0]),Qe(ie[1]),Qe(ie[3]),Qe(ie[1]),Qe(ie[2]),Qe(ie[3])}function Xe(Q){s.push(l[Q*3+0]),s.push(l[Q*3+1]),s.push(l[Q*3+2])}function Qe(Q){r.push(Q.x),r.push(Q.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return p_(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Qh[s.type]().fromJSON(s)),new i(n,e.options)}},f_={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new le(r,o),new le(a,l),new le(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],m=e[s*3+2],v=e[r*3],g=e[r*3+1],p=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new le(o,1-l),new le(c,1-u),new le(d,1-m),new le(v,1-p)]:[new le(a,1-l),new le(h,1-u),new le(f,1-m),new le(g,1-p)]}};function p_(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Do=class i extends tu{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Wi=class i extends xt{constructor(e=new mn([new le(0,.5),new le(-.5,-.5),new le(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],o=[],a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new Ze(s,3)),this.setAttribute("normal",new Ze(r,3)),this.setAttribute("uv",new Ze(o,2));function c(h){let u=s.length/3,d=h.extractPoints(t),f=d.shape,m=d.holes;us.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){let y=m[g];us.isClockWise(y)===!0&&(m[g]=y.reverse())}let v=us.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){let y=m[g];f=f.concat(y)}for(let g=0,p=f.length;g<p;g++){let y=f[g];s.push(y.x,y.y,0),r.push(0,0,1),o.push(y.x,y.y)}for(let g=0,p=v.length;g<p;g++){let y=v[g],_=y[0]+u,x=y[1]+u,I=y[2]+u;n.push(_,x,I),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return m_(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let o=t[e.shapes[s]];n.push(o)}return new i(n,e.curveSegments)}};function m_(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var yt=class i extends xt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new A,d=new A,f=[],m=[],v=[],g=[];for(let p=0;p<=n;p++){let y=[],_=p/n,x=0;p===0&&o===0?x=.5/t:p===n&&l===Math.PI&&(x=-.5/t);for(let I=0;I<=t;I++){let S=I/t;u.x=-e*Math.cos(s+S*r)*Math.sin(o+_*a),u.y=e*Math.cos(o+_*a),u.z=e*Math.sin(s+S*r)*Math.sin(o+_*a),m.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),g.push(S+x,1-_),y.push(c++)}h.push(y)}for(let p=0;p<n;p++)for(let y=0;y<t;y++){let _=h[p][y+1],x=h[p][y],I=h[p+1][y],S=h[p+1][y+1];(p!==0||o>0)&&f.push(_,x,S),(p!==n-1||l<Math.PI)&&f.push(x,I,S)}this.setIndex(f),this.setAttribute("position",new Ze(m,3)),this.setAttribute("normal",new Ze(v,3)),this.setAttribute("uv",new Ze(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Nn=class i extends xt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new A,u=new A,d=new A;for(let f=0;f<=n;f++)for(let m=0;m<=s;m++){let v=m/s*r,g=f/n*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(v),u.y=(e+t*Math.cos(g))*Math.sin(v),u.z=t*Math.sin(g),a.push(u.x,u.y,u.z),h.x=e*Math.cos(v),h.y=e*Math.sin(v),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/s),c.push(f/n)}for(let f=1;f<=n;f++)for(let m=1;m<=s;m++){let v=(s+1)*f+m-1,g=(s+1)*(f-1)+m-1,p=(s+1)*(f-1)+m,y=(s+1)*f+m;o.push(v,g,y),o.push(g,p,y)}this.setIndex(o),this.setAttribute("position",new Ze(a,3)),this.setAttribute("normal",new Ze(l,3)),this.setAttribute("uv",new Ze(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var pt=class extends _i{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Pu,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},li=class extends pt{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new le(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return tn(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ue(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ue(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ue(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var nl=class extends _i{static get type(){return"MeshLambertMaterial"}constructor(e){super(),this.isMeshLambertMaterial=!0,this.color=new Ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Pu,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pn,this.combine=Mu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function Ra(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function g_(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Nr=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},su=class extends Nr{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Id,endingEnd:Id}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Ld:r=e,a=2*t-n;break;case Dd:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Ld:o=e,l=2*n-t;break;case Dd:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-t)/(s-t),v=m*m,g=v*m,p=-d*g+2*d*v-d*m,y=(1+d)*g+(-1.5-2*d)*v+(-.5+d)*m+1,_=(-1-f)*g+(1.5+f)*v+.5*m,x=f*g-f*v;for(let I=0;I!==a;++I)r[I]=p*o[h+I]+y*o[c+I]+_*o[l+I]+x*o[u+I];return r}},ru=class extends Nr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},ou=class extends Nr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},ci=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ra(t,this.TimeBufferType),this.values=Ra(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ra(e.times,Array),values:Ra(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ou(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ru(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new su(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ka:t=this.InterpolantFactoryMethodDiscrete;break;case Th:t=this.InterpolantFactoryMethodLinear;break;case hc:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ka;case this.InterpolantFactoryMethodLinear:return Th;case this.InterpolantFactoryMethodSmooth:return hc}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&g_(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===hc,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*n,d=u-n,f=u+n;for(let m=0;m!==n;++m){let v=t[u+m];if(v!==t[d+m]||v!==t[f+m]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};ci.prototype.TimeBufferType=Float32Array;ci.prototype.ValueBufferType=Float32Array;ci.prototype.DefaultInterpolation=Th;var Gs=class extends ci{constructor(e,t,n){super(e,t,n)}};Gs.prototype.ValueTypeName="bool";Gs.prototype.ValueBufferType=Array;Gs.prototype.DefaultInterpolation=ka;Gs.prototype.InterpolantFactoryMethodLinear=void 0;Gs.prototype.InterpolantFactoryMethodSmooth=void 0;var au=class extends ci{};au.prototype.ValueTypeName="color";var lu=class extends ci{};lu.prototype.ValueTypeName="number";var cu=class extends Nr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)Gt.slerpFlat(r,0,o,c-a,o,c,l);return r}},il=class extends ci{InterpolantFactoryMethodLinear(e){return new cu(this.times,this.values,this.getValueSize(),e)}};il.prototype.ValueTypeName="quaternion";il.prototype.InterpolantFactoryMethodSmooth=void 0;var Vs=class extends ci{constructor(e,t,n){super(e,t,n)}};Vs.prototype.ValueTypeName="string";Vs.prototype.ValueBufferType=Array;Vs.prototype.DefaultInterpolation=ka;Vs.prototype.InterpolantFactoryMethodLinear=void 0;Vs.prototype.InterpolantFactoryMethodSmooth=void 0;var hu=class extends ci{};hu.prototype.ValueTypeName="vector";var uu=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],m=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null}}},v_=new uu,du=class{constructor(e){this.manager=e!==void 0?e:v_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};du.DEFAULT_MATERIAL_NAME="__DEFAULT";var Hr=class extends nn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ue(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Br=class extends Hr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ue(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},zc=new je,zf=new A,Gf=new A,ko=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.map=null,this.mapPass=null,this.matrix=new je,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new So,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new At(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;zf.setFromMatrixPosition(e.matrixWorld),t.position.copy(zf),Gf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Gf),t.updateMatrixWorld(),zc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(zc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},fu=class extends ko{constructor(){super(new Jt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){let t=this.camera,n=Lr*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},sl=class extends Hr{constructor(e,t,n=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.target=new nn,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new fu}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Vf=new je,po=new A,Gc=new A,pu=class extends ko{constructor(){super(new Jt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new le(4,2),this._viewportCount=6,this._viewports=[new At(2,1,1,1),new At(0,1,1,1),new At(3,1,1,1),new At(1,1,1,1),new At(3,0,1,1),new At(1,0,1,1)],this._cubeDirections=[new A(1,0,0),new A(-1,0,0),new A(0,0,1),new A(0,0,-1),new A(0,1,0),new A(0,-1,0)],this._cubeUps=[new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,0,1),new A(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),po.setFromMatrixPosition(e.matrixWorld),n.position.copy(po),Gc.copy(n.position),Gc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Gc),n.updateMatrixWorld(),s.makeTranslation(-po.x,-po.y,-po.z),Vf.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Vf)}},rl=class extends Hr{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new pu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},mu=class extends ko{constructor(){super(new kr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Fr=class extends Hr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.target=new nn,this.shadow=new mu}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var ku="\\[\\]\\.:\\/",x_=new RegExp("["+ku+"]","g"),Uu="[^"+ku+"]",y_="[^"+ku.replace("\\.","")+"]",__=/((?:WC+[\/:])*)/.source.replace("WC",Uu),M_=/(WCOD+)?/.source.replace("WCOD",y_),b_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Uu),E_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Uu),w_=new RegExp("^"+__+M_+b_+E_+"$"),S_=["material","materials","bones","map"],gu=class{constructor(e,t,n){let s=n||Nt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Nt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(x_,"")}static parseTrackName(e){let t=w_.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);S_.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Nt.Composite=gu;Nt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Nt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Nt.prototype.GetterByBindingType=[Nt.prototype._getValue_direct,Nt.prototype._getValue_array,Nt.prototype._getValue_arrayElement,Nt.prototype._getValue_toArray];Nt.prototype.SetterByBindingTypeAndVersioning=[[Nt.prototype._setValue_direct,Nt.prototype._setValue_direct_setNeedsUpdate,Nt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Nt.prototype._setValue_array,Nt.prototype._setValue_array_setNeedsUpdate,Nt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Nt.prototype._setValue_arrayElement,Nt.prototype._setValue_arrayElement_setNeedsUpdate,Nt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Nt.prototype._setValue_fromArray,Nt.prototype._setValue_fromArray_setNeedsUpdate,Nt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var GM=new Float32Array(1);typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:vu}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=vu);var Xi={uCurve:{value:new le(0,0)}},T_=`
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
`,Nu=1/700,pp="#define CURVE_K "+Nu.toFixed(8)+`
`,hl=pp+`
uniform vec2 uCurve;
vec4 curveWorld(vec4 w) {
  float d = w.z;
  float b = d * d / (1.0 + abs(d) * CURVE_K);
  w.x += uCurve.x * b;
  w.y += uCurve.y * b;
  return w;
}
`;function bi(i){return i.onBeforeCompile=e=>{e.uniforms.uCurve=Xi.uCurve,e.vertexShader=pp+`uniform vec2 uCurve;
`+e.vertexShader.replace("#include <project_vertex>",T_)},i.customProgramCacheKey=()=>"curved-world",i}var ce={std(i){return bi(new pt(i))},lambert(i){return bi(new nl(i))},basic(i){return bi(new cn(i))},phys(i){return bi(new li(i))}};var Ke=(i,e,t)=>i<e?e:i>t?t:i,it=(i,e,t)=>i+(e-i)*t;var Ei=(i,e,t)=>{let n=Ke((t-i)/(e-i),0,1);return n*n*(3-2*n)},Se=(i=0,e=1)=>i+Math.random()*(e-i),Vr=(i,e)=>Math.floor(Se(i,e+1)),tt=i=>i[Math.floor(Math.random()*i.length)],mt=i=>Math.random()<i,Hn=(i,e,t,n)=>it(i,e,1-Math.exp(-t*n)),Fu=i=>i<.5?2*i*i:1-Math.pow(-2*i+2,2)/2;function Uo(i,e){let t=0;for(let s of i)t+=e(s);let n=Math.random()*t;for(let s of i)if(n-=e(s),n<=0)return s;return i[i.length-1]}function mp(i){let e=i.slice();for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}var Hu=new Map;function ul(i,e){let t=i+":"+e;return Hu.has(t)||Hu.set(t,new Intl.NumberFormat("de-DE",{minimumFractionDigits:i,maximumFractionDigits:e})),Hu.get(t)}var on=(i,e=0)=>ul(e,e).format(i),wi=(i,e=2)=>ul(e,e).format(i/1e3)+" km",Ou=(i,e=0)=>ul(e,e).format(i)+"\xA0\u20AC",Zt=i=>ul(2,2).format(i)+"\xA0\u20AC";function Wr(i){let e=Math.floor(i)%1440,t=Math.floor(e/60),n=e%60;return String(t).padStart(2,"0")+":"+String(n).padStart(2,"0")}function No(i){let e=Math.max(0,Math.round(i));return Math.floor(e/60)+":"+String(e%60).padStart(2,"0")}function Bn(i){let e=i>>>0;return function(){e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Bu(i,e=0){let t=Math.floor(i),n=i-t,s=o=>{let a=Math.sin((o+e*101.3)*127.1)*43758.5453;return a-Math.floor(a)},r=n*n*(3-2*n);return it(s(t),s(t+1),r)*2-1}function ms(i,e=0){return Bu(i,e)*.6+Bu(i*2.13,e+7)*.3+Bu(i*4.7,e+13)*.1}var vp=8;function xp(i){vp=i}function gn(i,e){let t=document.createElement("canvas");return t.width=i,t.height=e,t}function Mn(i,{repeat:e=!1,srgb:t=!0,aniso:n=!0}={}){let s=new Pt(i);return t&&(s.colorSpace=ht),e&&(s.wrapS=s.wrapT=Oi),n&&(s.anisotropy=vp),s.needsUpdate=!0,s}function Gu(i,e,t,n,s,r=1,o=1){let a=Bn(r),l=i.getImageData(0,0,e,t),c=l.data;for(let h=0;h<t;h+=o)for(let u=0;u<e;u+=o){let d=(a()-.5)*s;for(let f=0;f<o&&h+f<t;f++)for(let m=0;m<o&&u+m<e;m++){let v=((h+f)*e+(u+m))*4;c[v]=n[0]+d,c[v+1]=n[1]+d,c[v+2]=n[2]+d,c[v+3]=255}}i.putImageData(l,0,0)}var Ne={laneWidth:3.75,lanes:4,left:-8.25,right:10.5,width:18.75,texLength:36,laneCenter:i=>-5.625+i*3.75};function yp(){let t=gn(512,1024),n=t.getContext("2d");Gu(n,512,1024,[88,89,92],26,7,1);let s=c=>(c-Ne.left)/Ne.width*512,r=c=>c/Ne.texLength*1024,o=Bn(42);for(let c=0;c<18;c++){let h=o()<.5?64:112;n.fillStyle=`rgba(${h},${h},${h+4},${.1+o()*.1})`;let u=o()*512,d=o()*1024;n.fillRect(u,d,20+o()*90,30+o()*160)}for(let c=0;c<4;c++){let h=Ne.laneCenter(c);for(let u of[-.85,.85]){let d=n.createLinearGradient(s(h+u-.4),0,s(h+u+.4),0);d.addColorStop(0,"rgba(40,40,44,0)"),d.addColorStop(.5,"rgba(40,40,44,0.32)"),d.addColorStop(1,"rgba(40,40,44,0)"),n.fillStyle=d,n.fillRect(s(h+u-.4),0,s(h+u+.4)-s(h+u-.4),1024)}}n.fillStyle="rgba(140,140,140,0.08)",n.fillRect(s(7.5),0,s(Ne.right)-s(7.5),1024);let a="#eceae2";n.fillStyle=a;for(let c=1;c<4;c++){let h=-7.5+c*3.75;for(let u=0;u<Ne.texLength;u+=18)n.fillRect(s(h-.075),r(u),s(h+.075)-s(h-.075),r(6))}n.fillRect(s(-7.5-.3),0,s(-7.5)-s(-7.8),1024),n.fillRect(s(7.5),0,s(7.8)-s(7.5),1024),n.fillRect(s(Ne.right-.35),0,s(Ne.right-.15)-s(Ne.right-.35),1024),n.globalAlpha=.25,_p(n,512,1024,3e3,"rgba(70,70,74,1)",13),n.globalAlpha=1;let l=Mn(t,{repeat:!0});return l.repeat.set(1,1),l}function _p(i,e,t,n,s,r){let o=Bn(r);i.fillStyle=s;for(let a=0;a<n;a++)i.fillRect(o()*e,o()*t,1+o()*2,1+o()*2)}function Mp(){let e=gn(1024,1024),t=e.getContext("2d"),n=Bn(99);t.fillStyle="#5f8a3a",t.fillRect(0,0,1024,1024);let s=["#6a9a3c","#7fae45","#5a8434","#c9b24a","#e1cf3a","#8a9a4a","#6f8f3c","#a08a52","#b6a35a","#4f7a30"],r=0;for(;r<1024;){let o=60+n()*180,a=0;for(;a<1024;){let l=80+n()*260;t.fillStyle=s[Math.floor(n()*s.length)],t.fillRect(a,r,l,o),t.strokeStyle="rgba(0,0,0,0.06)",t.lineWidth=2;let c=n()<.5;for(let h=0;h<(c?l:o);h+=7)t.beginPath(),c?(t.moveTo(a+h,r),t.lineTo(a+h,r+o)):(t.moveTo(a,r+h),t.lineTo(a+l,r+h)),t.stroke();a+=l}r+=o}t.strokeStyle="rgba(190,175,140,0.6)",t.lineWidth=5;for(let o=0;o<4;o++)t.beginPath(),t.moveTo(n()*1024,0),t.lineTo(n()*1024,1024),t.stroke();return t.globalAlpha=.18,_p(t,1024,1024,2e4,"rgba(30,50,20,1)",5),t.globalAlpha=1,Mn(e,{repeat:!0})}function bp(){let e=gn(256,256),t=e.getContext("2d");return Gu(t,256,256,[92,128,58],34,3,2),Mn(e,{repeat:!0})}function Ep(){let i=gn(64,64),e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,64);return t.addColorStop(0,"#c9ccd0"),t.addColorStop(.18,"#8d9296"),t.addColorStop(.35,"#dfe2e5"),t.addColorStop(.5,"#9aa0a5"),t.addColorStop(.65,"#e2e4e6"),t.addColorStop(.82,"#8b9094"),t.addColorStop(1,"#bfc3c7"),e.fillStyle=t,e.fillRect(0,0,64,64),e.fillStyle="rgba(60,60,60,0.5)",e.fillRect(30,26,4,12),Mn(i,{repeat:!0})}var zu=new Map;function fl(i){if(zu.has(i))return zu.get(i);let e=gn(256,56),t=e.getContext("2d");t.fillStyle="#f5f5f0",t.fillRect(0,0,256,56),t.strokeStyle="#111",t.lineWidth=3,t.strokeRect(2,2,252,52),t.fillStyle="#1d3f9a",t.fillRect(3,3,26,50),t.fillStyle="#ffd400",t.beginPath(),t.arc(16,18,7,0,Math.PI*2),t.setLineDash([2,2]),t.strokeStyle="#ffd400",t.lineWidth=2,t.stroke(),t.setLineDash([]),t.fillStyle="#fff",t.font="bold 15px Arial",t.textAlign="center",t.fillText("D",16,47),t.fillStyle="#111",t.font='bold 38px "DIN Alternate", "Arial Narrow", Arial, sans-serif',t.textBaseline="middle",t.fillText(i,142,30);let n=Mn(e);return zu.set(i,n),n}function Xr({w:i=512,h:e=512,bg:t=null,color:n="#f4f4f4"}={}){let s=gn(i,e),r=s.getContext("2d");t&&(r.fillStyle=t,r.fillRect(0,0,i,e)),r.fillStyle=n;let o=e*.5,a=[[.18,.1,.12],[.29,.07,.2],[.37,.06,.28],[.44,.08,.36],[.53,.06,.3],[.6,.07,.22],[.68,.06,.26],[.75,.08,.15]];for(let[c,h,u]of a)r.fillRect(i*c,o-e*u,i*h,e*u);return r.fillRect(i*.39,o-e*.36,i*.012,e*.08),r.fillRect(i*.15,o,i*.7,e*.025),r.font=`900 ${Math.round(e*.3)}px "Arial Black", Impact, sans-serif`,r.textAlign="center",r.textBaseline="top",r.fillText("LIVE",i/2,o+e*.05),Mn(s)}function wp(){let i=gn(1024,64),e=i.getContext("2d");e.fillStyle="#3b2c22",e.fillRect(0,0,1024,64);let t=Bn(5);for(let n=0;n<90;n++){e.strokeStyle=`rgba(${20+t()*40},${15+t()*25},${10+t()*15},${.3+t()*.4})`,e.lineWidth=1+t()*2,e.beginPath();let s=t()*64;e.moveTo(0,s);for(let r=0;r<=1024;r+=64)e.lineTo(r,s+Math.sin(r*.01+n)*3+(t()-.5)*2);e.stroke()}return Mn(i,{repeat:!0})}function pl(i=1){let t=gn(128,128),n=t.getContext("2d");return Gu(n,128,128,[200,200,200],70,i,1),Mn(t,{repeat:!0,srgb:!1})}function Sp(){let e=gn(256,256),t=e.getContext("2d");t.fillStyle="#1b1c1e",t.fillRect(0,0,256,256);let n=256/2,s=t.createRadialGradient(n,n,10,n,n,n);s.addColorStop(0,"#9da2a7"),s.addColorStop(.75,"#7c8186"),s.addColorStop(1,"#4b4f53"),t.fillStyle=s,t.beginPath(),t.arc(n,n,n*.92,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(30,30,30,0.6)",t.lineWidth=6;for(let r=0;r<5;r++){let o=r/5*Math.PI*2;t.beginPath(),t.moveTo(n+Math.cos(o)*30,n+Math.sin(o)*30),t.quadraticCurveTo(n+Math.cos(o+.5)*80,n+Math.sin(o+.5)*80,n+Math.cos(o+.9)*112,n+Math.sin(o+.9)*112),t.stroke()}return t.fillStyle="#2a2c2e",t.beginPath(),t.arc(n,n,20,0,Math.PI*2),t.fill(),Mn(e)}function ml(){let e=gn(64,64),t=e.getContext("2d"),n=t.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.5,"rgba(255,255,255,0.4)"),n.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=n,t.fillRect(0,0,64,64),Mn(e,{aniso:!1})}var dl=null;function gl(){if(dl)return dl;let i=64,e=128,t=gn(i,e),n=t.getContext("2d"),s=n.createImageData(i,e);for(let r=0;r<e;r++)for(let o=0;o<i;o++){let a=Math.abs((o+.5)/i*2-1),l=Math.abs((r+.5)/e*2-1),c=Math.pow(Math.pow(a,5)+Math.pow(l,5),1/5),h=Math.min(1,Math.max(0,(1-c)/.42)),u=h*h*(3-2*h);s.data[(r*i+o)*4+3]=Math.round(u*255)}return n.putImageData(s,0,0),dl=Mn(t,{aniso:!1,srgb:!1}),dl}function qr(i,{w:e=512,h:t=256,bg:n="#1452a8",fg:s="#ffffff",border:r=!0,arrows:o=null}={}){let a=gn(e,t),l=a.getContext("2d");l.fillStyle=n,Ot(l,0,0,e,t,18),l.fill(),r&&(l.strokeStyle=s,l.lineWidth=7,Ot(l,10,10,e-20,t-20,12),l.stroke()),l.fillStyle=s,l.textBaseline="middle";let c=i.length,h=(t-40)/Math.max(1,c);return i.forEach((u,d)=>{let f=20+h*(d+.5),m=Math.min(h*.62,64);l.font=`bold ${m}px "DIN Alternate", "Arial Narrow", Arial, sans-serif`,typeof u=="string"?(l.textAlign="left",gp(l,u,34,f,e-68)):(l.textAlign="left",gp(l,u.left,34,f,e*.68),u.right&&(l.textAlign="right",l.fillText(u.right,e-34,f)))}),o&&(l.strokeStyle=s,l.lineWidth=9,o.forEach(u=>{let d=e*u;l.beginPath(),l.moveTo(d,t-26),l.lineTo(d,t-70),l.stroke(),l.beginPath(),l.moveTo(d-14,t-58),l.lineTo(d,t-76),l.lineTo(d+14,t-58),l.stroke()})),Mn(a)}function gp(i,e,t,n,s){let r=parseFloat(i.font.match(/(\d+(\.\d+)?)px/)[1]);for(;i.measureText(e).width>s&&r>12;)r-=2,i.font=i.font.replace(/\d+(\.\d+)?px/,r+"px");i.fillText(e,t,n)}function Ot(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()}function Tp(i,e){let s=gn(512,320),r=s.getContext("2d");return r.fillStyle="#6b3d22",Ot(r,0,0,512,320,16),r.fill(),r.strokeStyle="#fff",r.lineWidth=6,Ot(r,10,10,492,300,10),r.stroke(),r.fillStyle="#fff",r.textAlign="center",r.textBaseline="middle",r.font="bold 44px Arial, sans-serif",Ho(r,i,512/2,320*.42,452),r.font="30px Arial, sans-serif",Ho(r,e,512/2,320*.72,452),Mn(s)}function Ho(i,e,t,n,s){let r=parseFloat(i.font.match(/(\d+(\.\d+)?)px/)[1]);for(;i.measureText(e).width>s&&r>12;)r-=2,i.font=i.font.replace(/\d+(\.\d+)?px/,r+"px");i.fillText(e,t,n)}function Ap(i){let t=gn(256,256),n=t.getContext("2d");if(n.clearRect(0,0,256,256),i==="ende"){n.fillStyle="#fff",n.beginPath(),n.arc(128,128,120,0,Math.PI*2),n.fill(),n.strokeStyle="#222",n.lineWidth=4,n.stroke(),n.save(),n.beginPath(),n.arc(128,128,116,0,Math.PI*2),n.clip(),n.strokeStyle="#333",n.lineWidth=8;for(let s=-5;s<=5;s++)n.beginPath(),n.moveTo(40+s*14,236),n.lineTo(236+s*14,40),n.stroke();n.restore()}else n.fillStyle="#d4141b",n.beginPath(),n.arc(128,128,122,0,Math.PI*2),n.fill(),n.fillStyle="#fff",n.beginPath(),n.arc(128,128,92,0,Math.PI*2),n.fill(),n.fillStyle="#111",n.font='bold 92px "DIN Alternate", Arial, sans-serif',n.textAlign="center",n.textBaseline="middle",n.fillText(String(i),128,134);return Mn(t)}function Rp(i,e,t="#f2f2f2",n="#c8102e"){let o=gn(1024,256),a=o.getContext("2d");a.fillStyle=t,a.fillRect(0,0,1024,256);for(let l=0;l<1024;l+=64)a.fillStyle="rgba(0,0,0,0.05)",a.fillRect(l,0,6,256);return a.fillStyle=n,a.fillRect(0,222,1024,20),a.fillStyle=n,a.font='italic 900 92px "Arial Black", Arial, sans-serif',a.textAlign="center",a.textBaseline="middle",Ho(a,i,1024/2,256*.4,944),a.fillStyle="#333",a.font="bold 34px Arial, sans-serif",Ho(a,e,1024/2,256*.72,904),Mn(o)}function Cp(i="Abstand halten!"){let n=gn(256,256),s=n.getContext("2d");s.fillStyle="#e9e9e4",s.fillRect(0,0,256,256),s.fillStyle="#c9c9c4",s.fillRect(256/2-2,0,4,256),s.strokeStyle="#9a9a96",s.lineWidth=6,s.strokeRect(6,6,244,244),s.fillStyle="#333",s.font="bold 22px Arial, sans-serif",s.textAlign="center",Ho(s,i,256/2,256*.3,226);for(let r=0;r<256;r+=32)s.fillStyle=r/32%2?"#d01818":"#ffffff",s.fillRect(r,230,32,18);return Mn(n)}function Pp(){let e=gn(64,64),t=e.getContext("2d"),n=t.createImageData(64,64);for(let s=0;s<64;s++)for(let r=0;r<64;r++){let o=(r-32+.5)/32,a=(s-64/2+.5)/(64/2),l=o*o+a*a,c=(s*64+r)*4;if(l<1){let h=Math.sqrt(1-l);n.data[c]=128+o*127*(1-h*.3),n.data[c+1]=128+a*127*(1-h*.3),n.data[c+2]=255*Math.min(1,h*1.6),n.data[c+3]=255*Math.min(1,(1-l)*4)}else n.data[c+3]=0}return t.putImageData(n,0,0),e}var gs=-9,hi=i=>2*gs-i,Vu=140,Ip=1700;function A_(i=Vu,e=Ip){let t=[],n=i;for(;n>-e;)t.push(n),n-=2+Math.abs(n)*.018;return t.push(-e),t}var R_=A_();function Bo(i,e=R_){let t=[],n=[],s=[],r=0;for(let a of i){let{a:l,b:c,uv:h}=a;for(let u=0;u<e.length;u++){let d=e[u];t.push(l[0],l[1],d,c[0],c[1],d);let f=h(l[0],l[1],d,0),m=h(c[0],c[1],d,1);n.push(f[0],f[1],m[0],m[1])}for(let u=0;u<e.length-1;u++){let d=r+u*2;a.flip?s.push(d,d+2,d+1,d+1,d+2,d+3):s.push(d,d+1,d+2,d+1,d+3,d+2)}r+=e.length*2}let o=new xt;return o.setAttribute("position",new Ze(t,3)),o.setAttribute("uv",new Ze(n,2)),o.setIndex(s),o.computeVertexNormals(),o}var vl=class{constructor(e){this.group=new we,this.group.name="Road",e.add(this.group),this.s=0,this.wet=0,this.roadTex=yp(),this.roadMat=ce.std({map:this.roadTex,roughness:.88,metalness:0,envMapIntensity:.6});let t=Ne.texLength,n=(N,Z,V)=>[(N-Ne.left)/Ne.width,-V/t],s=(N,Z,V)=>[(hi(N)-Ne.left)/Ne.width,-V/t],r=Bo([{a:[Ne.left,0],b:[Ne.right,0],uv:n},{a:[hi(Ne.right),0],b:[hi(Ne.left),0],uv:s}]);this.road=new D(r,this.roadMat),this.road.receiveShadow=!0,this.road.frustumCulled=!1,this.group.add(this.road),this.grassTex=bp(),this.grassTex.repeat.set(1,1),this.grassMat=ce.lambert({map:this.grassTex});let o=(N,Z,V)=>[N/6,-V/6],a=Bo([{a:[Ne.right,0],b:[Ne.right+3.2,.15],uv:o},{a:[Ne.right+3.2,.15],b:[36,.25],uv:o},{a:[hi(Ne.left),0],b:[Ne.left,0],uv:o},{a:[-52,.25],b:[hi(Ne.right)-3.2,.15],uv:o},{a:[hi(Ne.right)-3.2,.15],b:[hi(Ne.right),0],uv:o}]);this.verge=new D(a,this.grassMat),this.verge.receiveShadow=!0,this.verge.frustumCulled=!1,this.group.add(this.verge),this.fieldTex=Mp(),this.fieldMat=ce.lambert({map:this.fieldTex});let l=(N,Z,V)=>[N/160,-V/160],c=Bo([{a:[36,.25],b:[420,.25],uv:l},{a:[420,.25],b:[2600,-6],uv:l},{a:[-420,.25],b:[-52,.25],uv:l},{a:[-2600,-6],b:[-420,.25],uv:l}]);this.ground=new D(c,this.fieldMat),this.ground.receiveShadow=!0,this.ground.frustumCulled=!1,this.group.add(this.ground),this.railTex=Ep(),this.railMat=ce.std({map:this.railTex,metalness:.75,roughness:.38,envMapIntensity:.9,side:dt});let h=(N,Z,V,ee)=>[-V/4,ee],u=[],d=(N,Z)=>{u.push({a:[N,.52],b:[N,.84],uv:h,flip:Z>0}),u.push({a:[N-.08*Z,.84],b:[N,.84+.01],uv:h,flip:Z<0})};d(gs+.16,1),d(gs-.16,-1),d(Ne.right+.55,-1),d(hi(Ne.right)-.55,1),this.rails=new D(Bo(u),this.railMat),this.rails.castShadow=!1,this.rails.receiveShadow=!0,this.rails.frustumCulled=!1,this.group.add(this.rails);let f=new Fe(.1,.8,.07);f.translate(0,.4,0);let m=ce.std({color:9343896,metalness:.6,roughness:.5});this.postSpacing=2;let v=[gs,Ne.right+.72,hi(Ne.right)-.72],g=Math.floor(700/this.postSpacing);this.posts=new ai(f,m,g*v.length);let p=new je,y=0;for(let N of v)for(let Z=0;Z<g;Z++)p.makeTranslation(N,0,Vu*.5-Z*this.postSpacing),this.posts.setMatrixAt(y++,p);this.posts.frustumCulled=!1,this.posts.castShadow=!0,this.group.add(this.posts),this.delinSpacing=50;let _=new we,x=new Fe(.12,1,.12);x.translate(0,.5,0);let I=new Fe(.125,.25,.125);I.translate(0,.82,0);let S=new et(.05,.12);S.translate(0,.82,.064);let T=Math.ceil(Ip*.6/this.delinSpacing),C=ce.std({color:15921902,roughness:.6}),E=ce.std({color:1118481,roughness:.6}),M=ce.std({color:16752672,emissive:16742912,emissiveIntensity:.9}),P=new ai(x,C,T),k=new ai(I,E,T),H=new ai(S,M,T);for(let N=0;N<T;N++)p.makeTranslation(Ne.right+1.05,.12,Vu*.5-N*this.delinSpacing),P.setMatrixAt(N,p),k.setMatrixAt(N,p),H.setMatrixAt(N,p);for(let N of[P,k,H])N.frustumCulled=!1,_.add(N);this.delin=_,this.group.add(_),this.laneUniforms={uTime:{value:0},uS:{value:0},uOpacity:{value:0},uWarn:{value:0}};let F=new Yt({uniforms:{...this.laneUniforms,uCurve:{value:null}},vertexShader:hl+`
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
        }`,transparent:!0,depthWrite:!1,blending:ds});F.uniforms.uCurve=Xi.uCurve;let W=Bo([{a:[Ne.laneCenter(0)-1.8,.025],b:[Ne.laneCenter(0)+1.8,.025],uv:N=>[(N-(Ne.laneCenter(0)-1.8))/3.6,0]}]);this.lane=new D(W,F),this.lane.frustumCulled=!1,this.lane.renderOrder=1,this.lane.visible=!1,this.group.add(this.lane)}setWet(e){this.wet=e,this.roadMat.roughness=.88-e*.62,this.roadMat.color.setScalar(1-e*.42),this.roadMat.envMapIntensity=.6+e*.9,this.railMat.roughness=.38-e*.2,this.grassMat.color.setScalar(1-e*.25),this.fieldMat.color.setScalar(1-e*.28)}update(e,t,n,s,r=0){this.s=e,this.roadTex.offset.y=e/Ne.texLength%1,this.grassTex.offset.y=e/6%1,this.fieldTex.offset.y=e/160%1,this.railTex.offset.x=e/4%1,this.posts.position.z=e%this.postSpacing,this.delin.position.z=e%this.delinSpacing,this.laneUniforms.uTime.value=n,this.laneUniforms.uS.value=e%1120,this.laneUniforms.uOpacity.value=s,this.laneUniforms.uWarn.value=r,this.lane.visible=s>.001}};var C_=`
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`,P_=`
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
}`,xl=class{constructor(e,t,{shadows:n=!0,shadowSize:s=2048}={}){this.renderer=e,this.scene=t,this.overcast=0,this.sunDir=new A(.52,.6,.6).normalize(),this.fogClear=new Ue(.66,.78,.92),this.fogRain=new Ue(.43,.46,.5),this.fogColor=this.fogClear.clone(),this.uniforms={uSunDir:{value:this.sunDir},uOvercast:{value:0},uOffset:{value:new le(0,0)},uFog:{value:this.fogColor}};let r=new Yt({uniforms:this.uniforms,vertexShader:C_,fragmentShader:P_,side:_n,depthWrite:!1,depthTest:!0,fog:!1});this.dome=new D(new yt(3e3,40,20),r),this.dome.frustumCulled=!1,this.dome.renderOrder=-10,t.add(this.dome),t.fog=new qa(this.fogColor,140,1550),t.fog.color=this.fogColor,this.sun=new Fr(16773340,3),this.sun.castShadow=n,this.sun.shadow.mapSize.set(s,s);let o=this.sun.shadow.camera;o.left=-55,o.right=55,o.top=60,o.bottom=-60,o.near=10,o.far=400,o.updateProjectionMatrix(),this.sun.shadow.bias=-5e-4,this.sun.shadow.normalBias=.04,t.add(this.sun),t.add(this.sun.target),this.hemi=new Br(12901631,6253125,1.05),t.add(this.hemi),this.hills=this.buildHills(),t.add(this.hills),this.pmrem=new Ur(e),this.envScene=new Mi;let a=new D(new yt(50,32,16),r);this.envScene.add(a),this.envGround=new D(new Un(48,24).rotateX(-Math.PI/2),new cn({color:new Ue(.16,.17,.13)})),this.envGround.position.y=-2,this.envScene.add(this.envGround),this.envTarget=null,this.lastEnvOvercast=-1,this.updateEnv()}buildHills(){let n=[],s=[],r=[],o=new Ue().setRGB(.3,.42,.33,ht),a=new Ue().setRGB(.5,.6,.7,ht),l=d=>25+Math.max(0,ms(d*.09,4)*.5+.5)*150+Math.max(0,ms(d*.31,9))*40,c=48;for(let d=0;d<=320;d++){let f=d/320*Math.PI*2,m=Math.sin(f)*1950,v=-Math.cos(f)*1950,g=Math.max(0,(d-(320-c))/c),p=g>0?it(l(d),l(d-320),g*g*(3-2*g)):l(d);n.push(m,-40,v,m,p,v);let y=o.clone().lerp(a,.25),_=o.clone().lerp(a,.7+.2*Math.sin(d/320*Math.PI*6));if(s.push(y.r,y.g,y.b,_.r,_.g,_.b),d<320){let x=d*2;r.push(x,x+2,x+1,x+1,x+2,x+3)}}let h=new xt;h.setAttribute("position",new Ze(n,3)),h.setAttribute("color",new Ze(s,3)),h.setIndex(r),this.hillMat=new cn({vertexColors:!0,fog:!1,side:dt,transparent:!0,opacity:1});let u=new D(h,this.hillMat);return u.frustumCulled=!1,u.renderOrder=-5,u}updateEnv(){this.envTarget&&this.envTarget.dispose(),this.envTarget=this.pmrem.fromScene(this.envScene,.02,.1,100),this.scene.environment=this.envTarget.texture,this.lastEnvOvercast=this.overcast,this.onEnv&&this.onEnv(this.envTarget.texture)}setOvercast(e){this.overcast=Ke(e,0,1)}update(e,t,n,s){let r=this.overcast;this.uniforms.uOvercast.value=r;let o=this.uniforms.uOffset.value;o.x+=e*.004,o.y=-n*6e-4-s*.002,this.fogColor.copy(this.fogClear).lerp(this.fogRain,r);let a=this.scene.fog;a.near=it(140,18,r),a.far=it(1550,430,r),this.sun.intensity=it(3,.32,r),this.hemi.intensity=it(1.05,1.35,r),this.hemi.color.setRGB(it(.77,.6,r),it(.86,.64,r),it(1,.7,r)),this.hillMat.opacity=1-r,this.hillMat.color.setRGB(1,1,1).lerp(this.fogColor,.15+r*.6),this.hills.visible=r<.98,this.dome.position.copy(t.position);let l=h=>h*h/(1+h*Nu),c=Xi.uCurve.value;this.hills.position.set(t.position.x+c.x*l(1950)*.7,c.y*l(1950)*.8,0),this.sun.target.position.set(t.position.x*.5,0,-32),this.sun.position.copy(this.sun.target.position).addScaledVector(this.sunDir,200),this.envGround.material.color.setRGB(it(.16,.1,r),it(.17,.11,r),it(.13,.11,r)),Math.abs(r-this.lastEnvOvercast)>.12&&this.updateEnv()}};function It(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new xt,c=0;for(let h=0;h<i.length;++h){let u=i[h],d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(t){let h=0,u=[];for(let d=0;d<i.length;++d){let f=i[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=Lp(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let v=0;v<o[h].length;++v)f.push(o[h][v][d]);let m=Lp(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}return l}function Lp(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new Ft(o,t,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let u=l/t;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<t;m++){let v=h.getComponent(d,m);a.setComponent(d+u,m,v)}}else o.set(h.array,l);l+=h.count*t}return s!==void 0&&(a.gpuType=s),a}function In(i){let e=i.length;return t=>{if(t<=i[0][0])return i[0][1];if(t>=i[e-1][0])return i[e-1][1];let n=0;for(;n<e-2&&t>i[n+1][0];)n++;let s=i[Math.max(0,n-1)],r=i[n],o=i[n+1],a=i[Math.min(e-1,n+2)],l=o[0]-r[0],c=(t-r[0])/l,h=(o[1]-s[1])/(o[0]-s[0]||1)*l,u=(a[1]-r[1])/(a[0]-r[0]||1)*l,d=c*c,f=d*c;return(2*f-3*d+1)*r[1]+(f-2*d+c)*h+(-2*f+3*d)*o[1]+(f-d)*u}}function yl(i,e,t=.4,n=.335){return s=>{let r=i(s);for(let o of e){let a=s-o;Math.abs(a)<t&&(r=Math.max(r,n+Math.sqrt(t*t-a*a)))}return r}}function _l(i,e=.5,t=.72){return(n,s,r)=>{let o=Math.abs(s);if(o<=e)return r;let a=Math.min(1,(o-e)/(t-e));return r+(i(n)-r)*a*a*(3-2*a)}}function qi({w:i,b:e,t,tw:n=.9,bw:s=.96,n:r=4,L:o=4.7,bx:a=null},l,c,h=new A){let u=2/r,d=Math.cos(c),f=Math.sin(c),m=Math.sign(d)*Math.pow(Math.abs(d),u),v=Math.sign(f)*Math.pow(Math.abs(f),u),g=e(l),p=Math.max(t(l),g+.002),y=g+(v+1)/2*(p-g);a&&(y=Math.max(y,Math.min(a(l,m,g),p)));let _=v>0?it(1,n,v):it(1,s,-v);return h.set(m*i(l)*_,y,l-o/2)}function Xs(i,e,{ns:t=6,nt:n=16,lift:s=.006,center:r=new A(0,.75,0)}={}){let o=[],a=[],l=new A,c=new A,h=new A,u=new A,d=.001;for(let p=0;p<=n;p++)for(let y=0;y<=t;y++){let[_,x]=e(y/t,p/n);i(_,x,l),i(_+d,x,c).sub(l),i(_,x+d,h).sub(l),u.crossVectors(c,h),u.lengthSq()<1e-14&&u.set(l.x,l.y-r.y,l.z-r.z),u.normalize(),u.x*l.x+u.y*(l.y-r.y)+u.z*(l.z-r.z)<0&&u.negate(),o.push(l.x+u.x*s,l.y+u.y*s,l.z+u.z*s)}for(let p=0;p<n;p++)for(let y=0;y<t;y++){let _=p*(t+1)+y,x=_+1,I=_+t+1,S=I+1;a.push(_,I,x,x,I,S)}let f=new xt;f.setAttribute("position",new Ze(o,3)),f.setIndex(a),f.computeVertexNormals();let m=new A().fromBufferAttribute(f.attributes.normal,Math.floor((t+1)*(n+1)/2)),v=new A().fromBufferAttribute(f.attributes.position,Math.floor((t+1)*(n+1)/2));if(m.x*v.x+m.y*(v.y-r.y)+m.z*(v.z-r.z)<0){let p=f.index.array;for(let y=0;y<p.length;y+=3){let _=p[y+1];p[y+1]=p[y+2],p[y+2]=_}f.computeVertexNormals()}let g=[];for(let p=0;p<=n;p++)for(let y=0;y<=t;y++)g.push(y/t,p/n);return f.setAttribute("uv",new Ze(g,2)),f}function Si({u0:i,u1:e,w:t,b:n,t:s,tw:r=.9,bw:o=.96,n:a=4,segs:l=80,ring:c=28,L:h=4.7,H:u=1.5,caps:d=!0,sampleEnds:f=.55,bx:m=null,capDome:v=0}){let g=[],p=[],y=[],_=[];for(let k=0;k<=l;k++){let H=k/l,F=(1-Math.cos(Math.PI*H))/2;_.push(i+(e-i)*it(H,F,f))}let x=2/a,I=[];for(let k=0;k<c;k++){let H=k/c*Math.PI*2-Math.PI/2,F=Math.cos(H),W=Math.sin(H);I.push([Math.sign(F)*Math.pow(Math.abs(F),x),Math.sign(W)*Math.pow(Math.abs(W),x)])}for(let k of _){let H=n(k),F=s(k),W=t(k),N=Math.max(F,H+.002);for(let[Z,V]of I){let ee=H+(V+1)/2*(N-H);m&&(ee=Math.max(ee,Math.min(m(k,Z,H),N)));let he=V>0?it(1,r,V):it(1,o,-V),xe=Z*W*he;g.push(xe,ee,k-h/2),p.push(xe<0?k/h:1-k/h,ee/u)}}for(let k=0;k<l;k++)for(let H=0;H<c;H++){let F=k*c+H,W=k*c+(H+1)%c,N=(k+1)*c+H,Z=(k+1)*c+(H+1)%c;y.push(F,W,N,W,Z,N)}let S=new xt;if(S.setAttribute("position",new Ze(g,3)),S.setAttribute("uv",new Ze(p,2)),S.setIndex(y),S.computeVertexNormals(),!d)return S;let T=Array.from(S.attributes.position.array),C=Array.from(S.attributes.normal.array),E=Array.from(S.attributes.uv.array),M=(k,H)=>{let F=T.length/3,W=0,N=0,Z=T[k*c*3+2],V=H?-1:1;for(let he=0;he<c;he++){let xe=(k*c+he)*3;if(W+=T[xe],N+=T[xe+1],T.push(T[xe],T[xe+1],T[xe+2]),v>0){let ke=C[xe],Je=C[xe+1],K=Math.hypot(ke,Je)||1,oe=ke/K*v,ge=Je/K*v,fe=V*(1-v*.55),Te=Math.hypot(oe,ge,fe);C.push(oe/Te,ge/Te,fe/Te)}else C.push(0,0,V);E.push(E[(k*c+he)*2],E[(k*c+he)*2+1])}T.push(W/c,N/c,Z),C.push(0,0,H?-1:1),E.push(.5,.5);let ee=F+c;for(let he=0;he<c;he++){let xe=F+he,ke=F+(he+1)%c;H?y.push(ee,ke,xe):y.push(ee,xe,ke)}};M(0,!0),M(l,!1);let P=new xt;return P.setAttribute("position",new Ze(T,3)),P.setAttribute("normal",new Ze(C,3)),P.setAttribute("uv",new Ze(E,2)),P.setIndex(y),S.dispose(),P}function gt(i,e){let t=new Ue(e),n=i.attributes.position.count,s=new Float32Array(n*3);for(let r=0;r<n;r++)s[r*3]=t.r,s[r*3+1]=t.g,s[r*3+2]=t.b;return i.setAttribute("color",new Ft(s,3)),i}function Fo(i=1,e=-1){let t=d=>e<0?d:-d,n=-.118*i,s=.112*i,r=.062*i,o=.05*i,a=-.058*i,l=-.046*i,c=.055*i,h=.022*i,u=new mn;return u.moveTo(t(n+c),a),u.lineTo(t(s-h),l),u.quadraticCurveTo(t(s),l,t(s),l+h),u.lineTo(t(s),o-h),u.quadraticCurveTo(t(s),o,t(s-h),o),u.lineTo(t(n+c),r),u.quadraticCurveTo(t(n),r,t(n),r-c),u.lineTo(t(n),a+c),u.quadraticCurveTo(t(n),a,t(n+c),a),u}function Ml(i=-1){let e=new Kn(Fo(1,i),{depth:.07,bevelEnabled:!0,bevelThickness:.014,bevelSize:.011,bevelSegments:4,curveSegments:12});return e.translate(0,0,-.084),e}function Rt(i,e,t,n,s,r,o=0,a=0,l=0){let c=new Fe(i,e,t);return(o||a||l)&&c.applyMatrix4(new je().makeRotationFromEuler(new pn(o,a,l))),c.translate(n,s,r),c}function Dp(i,e,t=20){let n=[],s=i*.62,r=e/2,o=Math.min(.045,e*.22);n.push(new le(s,-r)),n.push(new le(i-o,-r));for(let l=0;l<=4;l++){let c=-Math.PI/2+l/4*(Math.PI/2);n.push(new le(i-o+Math.cos(c)*o,-r+o+Math.sin(c)*o))}for(let l=0;l<=4;l++){let c=l/4*(Math.PI/2);n.push(new le(i-o+Math.cos(c)*o,r-o+Math.sin(c)*o))}n.push(new le(s,r));let a=new Co(n,t);return a.rotateZ(Math.PI/2),a}function Oo(i,e,t,n,s=1,r=20){let o=new Un(i,r);return o.rotateY(s>0?Math.PI/2:-Math.PI/2),o.translate(e,t,n),o}var vs=null;function I_(){if(vs)return vs;let i=512,e=document.createElement("canvas");e.width=i,e.height=i;let t=e.getContext("2d");t.fillStyle="#123a8e",t.fillRect(0,0,i,i);let n=Bn(1887),s=22;for(let r=0;r<i/(s*.8)+2;r++)for(let o=0;o<i/(s*1.6)+2;o++){let a=o*s*1.6+r%2*s*.8,l=r*s*.8,c=n()<.16,h=t.createRadialGradient(a,l-s*.3,2,a,l,s);if(c)h.addColorStop(0,"#ffffff"),h.addColorStop(1,"#cfd8e6");else{let u=.85+n()*.3;h.addColorStop(0,`rgb(${40*u},${95*u},${200*u})`),h.addColorStop(1,`rgb(${14*u},${46*u},${130*u})`)}t.fillStyle=h,t.beginPath(),t.arc(a,l,s,0,Math.PI),t.fill(),t.strokeStyle="rgba(5,20,60,0.55)",t.lineWidth=2,t.beginPath(),t.arc(a,l,s,.1,Math.PI-.1),t.stroke()}return vs=new Pt(e),vs.colorSpace=ht,vs.wrapS=vs.wrapT=Oi,vs.repeat.set(2,1),vs}function bl({curved:i=!0}={}){let e=I=>i?bi(I):I,t=new we;t.name="Elsa";let n=e(new pt({map:I_(),roughness:.45,metalness:.15})),s=e(new pt({color:1920944,roughness:.5,side:dt})),r=e(new pt({color:16777215,roughness:.25})),o=e(new pt({color:723728,roughness:.2})),a=e(new pt({color:15909424,metalness:.9,roughness:.25,emissive:3811328,emissiveIntensity:.3})),l=e(new pt({color:14169162,roughness:.4})),c=e(new pt({color:15331062,roughness:.5})),h=new D(new yt(.3,32,24),n);h.scale.set(1,1.45,.8),h.position.y=.48,t.add(h);let u=new D(new yt(.3,24,14,Math.PI/2-.85,1.7,1.62,.98),c);u.scale.set(1.012,1.45*1.012,.8*1.012),u.position.y=.48,t.add(u);let d=new mn;d.moveTo(0,.12),d.quadraticCurveTo(-.12,.02,-.26,-.08),d.quadraticCurveTo(-.12,-.03,0,-.04),d.quadraticCurveTo(.12,-.03,.26,-.08),d.quadraticCurveTo(.12,.02,0,.12);let f=new D(new Kn(d,{depth:.05,bevelEnabled:!0,bevelSize:.015,bevelThickness:.015,bevelSegments:2}),s);f.position.set(0,.08,-.03),t.add(f);let m=new yt(.09,14,10);m.scale(.35,1,.7);let v=new D(m,s),g=new D(m,s);v.position.set(-.3,.42,.02),g.position.set(.3,.42,.02),v.rotation.z=.7,g.rotation.z=-.7,t.add(v,g);let p=new D(new Wn(.08,.22,3),s);p.scale.set(.3,1,1.4),p.position.set(0,.62,-.23),p.rotation.x=-.6,t.add(p);for(let I of[-1,1]){let S=new D(new yt(.085,20,14),r);S.position.set(I*.13,.7,.17);let T=new D(new yt(.045,16,12),o);T.position.set(I*.145,.7,.24);let C=new D(new yt(.014,8,6),r);C.position.set(I*.13+.02,.72,.28),t.add(S,T,C)}let y=new D(new Nn(.07,.016,8,20,Math.PI),l);y.rotation.z=Math.PI,y.position.set(0,.56,.235),t.add(y);let _=new we;_.position.y=.9;let x=new D(new We(.15,.14,.07,24,1,!0),a);_.add(x);for(let I=0;I<6;I++){let S=I/6*Math.PI*2,T=new we;T.position.set(Math.sin(S)*.145,.035,Math.cos(S)*.145),T.rotation.y=S;let C=new D(new Wn(.028,.12,6),a);C.position.y=.06;let E=new D(new Wn(.018,.08,5),a);E.position.set(-.03,.04,0),E.rotation.z=.6;let M=E.clone();M.position.x=.03,M.rotation.z=-.6;let P=new D(new yt(.016,8,6),a);P.position.y=.125,T.add(C,E,M,P),_.add(T)}return t.add(_),t.traverse(I=>{I.isMesh&&(I.castShadow=!0)}),t.userData={finL:v,finR:g,crown:_,body:h},t}function El(i,e,t=0){let n=i.userData;n.finL.rotation.z=.7+Math.sin(e*6)*.35,n.finR.rotation.z=-.7-Math.sin(e*6+1)*.2,i.rotation.z=Math.sin(e*2.2)*.04+t}var $n=100,Np=17,Hp=2,Yi=Np+Hp+1,kp=["Gr\xFC\xDFe an Mini Adam!","Linke Spur freischalten: jetzt!","BrunnenTV Fanclub","Malte Malte Malte","Elsa \u2764","Ehrenmenschen-Br\xFCcke","Rechts fahren, Adam!","Wir streamen in Full HD","Live-Eskalationen immer woanders","Ringtennis-Verein gr\xFC\xDFt","Danke f\xFCr alles \u2764","Bimmel hurra!","Kanalpunkte-Wette l\xE4uft"],Up=[["Burg Hauneck","Haunetal"],["Wartburg","Eisenach"],["Weser-Skywalk","Beverungen"],["Burg Ronneburg","Ronneburg"],["Elsa","Kassel gr\xFC\xDFt"],["Hochofenwerk Phoenix West","Dortmund"],["BrunnenTV-Studio","Herr Sch\xF6nnbrun"],["Megahub","Lehrte"],["Rh\xF6n","Starlink-Gebiet"],["Zissel","Kassel"],["Skyline","Frankfurt am Main"]],L_=["Kassel","Fulda","Frankfurt","Gifhorn","Hannover","W\xFCrzburg","G\xF6ttingen","Hamburg","Hanau","Siegen","Erlensee","Eisenach","Bad Hersfeld","Dortmund"];function D_(){let i=[],e=new We(.16,.24,2.4,6);e.translate(0,1.2,0),i.push(gt(e,4862756));let t=[[2.5,4,1.5],[2.05,3.5,3.4],[1.55,3,5.2],[1,2.5,6.8]];for(let[n,s,r]of t){let o=new Wn(n,s,8);o.translate(0,r+s/2,0),i.push(gt(o,2970928))}return It(i)}function k_(){let i=[],e=new We(.2,.3,3.2,6).toNonIndexed();e.translate(0,1.6,0),i.push(gt(e,5914672));let t=[[0,5,0,2.6],[1.3,4.3,.6,1.9],[-1.2,4.5,-.5,2],[.2,6.3,.3,1.7]];for(let[n,s,r,o]of t){let a=new Do(o,1);a.translate(n,s,r),i.push(gt(a,5012020))}return It(i)}function U_(){let i=[];for(let[e,t,n,s]of[[0,.7,0,1],[.8,.55,.3,.75],[-.7,.5,-.2,.7]]){let r=new Do(s,1);r.translate(e,t,n),i.push(gt(r,5603127))}return It(i)}function N_(){let i=new Fe(1,1,1);return i.translate(0,.5,0),gt(i,16777215)}function H_(){let i=[],t=(f,m,v,g)=>i.push(...f,...m,...v,...f,...v,...g),n=(f,m,v)=>i.push(...f,...m,...v),r=[-.56,1,-.56],o=[.5+.06,1,-.5-.06],a=[.5+.06,1,.5+.06],l=[-.5-.06,1,.5+.06],c=[0,1+.62,-.5-.06],h=[0,1+.62,.5+.06];t(a,o,c,h),t(r,l,h,c),n(l,a,h),n(o,r,c);let u=new xt;u.setAttribute("position",new Ze(i,3)),u.computeVertexNormals();let d=i.length/3;return u.setAttribute("uv",new Ze(new Float32Array(d*2),2)),gt(u,16777215)}var wl=[16777215,14741728,13164744,15794144,13691096,16774364],B_=[15854816,15327951,16184298,15063480,14275788,15720649,14471872],F_=[10698794,9124390,5978926,3816512,11883054,7023136],Sl=class{constructor(e){this.track=new we,this.track.name="Scenery",e.add(this.track),this.slots=Array.from({length:Yi},()=>({k:-1,items:[]})),this.requests=[],this.pools=new Map,this.animated=new Set,this.texCache=new Map,this.gantryInfo=()=>({target:"Kassel",km:42}),this.time=0,this.mats={concrete:ce.std({color:12433838,roughness:.92}),concreteDark:ce.std({color:9407620,roughness:.95}),steel:ce.std({color:10133928,metalness:.7,roughness:.4}),dark:ce.std({color:2763566,roughness:.7}),white:ce.std({color:15921903,roughness:.6}),orange:ce.std({color:15231762,roughness:.6}),grass:ce.lambert({color:6261306}),stone:ce.std({color:10985102,roughness:.95}),water:ce.std({color:10276863,roughness:.05,metalness:.2,transparent:!0,opacity:.55,envMapIntensity:1.5}),redRoof:ce.std({color:10698794,roughness:.8}),glassBlue:ce.std({color:6258595,metalness:.8,roughness:.15,envMapIntensity:1.2})},this.makeInstanced()}makeInstanced(){let e=ce.lambert({vertexColors:!0}),t={conifer:[D_(),90],decid:[k_(),60],bush:[U_(),50],house:[N_(),34],roof:[H_(),34]};this.inst={};let n=new je().makeScale(0,0,0);for(let[s,[r,o]]of Object.entries(t)){let a=s==="house"?ce.lambert({vertexColors:!0}):e,l=new ai(r,a,o*Yi);l.frustumCulled=!1,l.castShadow=!0,l.receiveShadow=s==="house"||s==="roof";for(let c=0;c<o*Yi;c++)l.setMatrixAt(c,n),l.setColorAt(c,new Ue(1,1,1));l.instanceMatrix.setUsage(np),this.track.add(l),this.inst[s]={mesh:l,cap:o}}}acquire(e,t){this.pools.has(e)||this.pools.set(e,[]);let n=this.pools.get(e),s=n.find(r=>!r.userData.active);return s||(s=t(),s.userData.type=e,n.push(s),this.track.add(s)),s.userData.active=!0,s.visible=!0,s}release(e){e.userData.active=!1,e.visible=!1,this.animated.delete(e),e.userData.onRelease&&e.userData.onRelease()}request(e,t,n={}){let s=Math.random().toString(36).slice(2),r={id:s,type:e,s:t,data:n,built:!1};this.requests.push(r);let o=Math.floor(t/$n),a=this.slots[(o%Yi+Yi)%Yi];return a.k===o&&this.placeRequest(a,r),s}cancel(e,t=!0){let n=this.requests.find(s=>s.id===e);if(n&&(this.requests=this.requests.filter(s=>s!==n),t&&n.built&&n.s>this.track.position.z+150))for(let s of this.slots){let r=s.items.findIndex(o=>o.userData.requestId===e);r>=0&&(this.release(s.items[r]),s.items.splice(r,1))}}reset(){for(let e of this.slots){for(let t of e.items)this.release(t);e.items=[],e.k=-1}this.requests=[]}update(e,t){this.time+=t,this.track.position.z=e;let n=Math.floor(e/$n);for(let s=n-Hp;s<=n+Np;s++){if(s<0)continue;let r=(s%Yi+Yi)%Yi;this.slots[r].k!==s&&this.buildSlot(r,s)}for(let s of this.animated){let r=s.userData.animate;r&&r(this.time,t)}this.requests.length>40&&(this.requests=this.requests.filter(s=>s.s>e-500))}buildSlot(e,t){let n=this.slots[e];for(let p of n.items)this.release(p);n.items=[],n.k=t;let s=Bn(t*7919+17),r=t*$n,o=-r,a={conifer:0,decid:0,bush:0,house:0,roof:0},l=new je,c=new Gt,h=new A,u=new A,d=new Ue,f=new A(0,1,0),m=(p,y,_,x,I,S,T,C,E,M)=>{let P=this.inst[p],k=a[p];if(k>=P.cap)return!1;a[p]++,c.setFromAxisAngle(f,S),u.set(C??I,E??I,M??I),l.compose(h.set(y,_,x),c,u);let H=e*P.cap+k;return P.mesh.setMatrixAt(H,l),P.mesh.setColorAt(H,d.setHex(T)),!0},v=this.villageSide(t),g=this.villageSide(t-1)||this.villageSide(t+1);for(let p of[1,-1]){let y=p>0?11:23,_=Ei(.05,.38,ms(t/9,y)),x=p>0?17:34;if(v===p)continue;let I=Math.floor(_*46);for(let T=0;T<I;T++){let C=p*(x+4+Math.pow(s(),.7)*120),E=o-s()*$n,M=.75+s()*.65;s()<.62?m("conifer",C,0,E,M,s()*6,wl[Math.floor(s()*wl.length)]):m("decid",C,0,E,M,s()*6,wl[Math.floor(s()*wl.length)])}let S=3+Math.floor(s()*6);for(let T=0;T<S;T++){let C=p*(x-1+s()*10),E=o-s()*$n;s()<.55?m("bush",C,0,E,.7+s()*.9,s()*6,16777215):m("decid",C,0,E,.55+s()*.5,s()*6,16777215)}if(_<.3){let T=Math.floor(s()*5);for(let C=0;C<T;C++)m("decid",p*(60+s()*380),0,o-s()*$n,.9+s()*.8,s()*6,16777215);if(s()<.22){let C=this.acquire("turbine",()=>this.makeTurbine());C.position.set(p*(180+s()*520),0,o-s()*$n),C.rotation.y=(s()-.5)*.6,C.userData.phase=s()*6,this.animated.add(C),n.items.push(C)}}}if(v){let p=v,y=14+Math.floor(s()*14);for(let _=0;_<y;_++){let x=p*(42+s()*150),I=o-s()*$n,S=8+s()*5,T=9+s()*6,C=5+s()*3.5,E=(s()<.5?0:Math.PI/2)+(s()-.5)*.3;m("house",x,0,I,1,E,tt(B_),S,C,T),m("roof",x,0,I,1,E,tt(F_),S,C,T)}if(s()<.8){let _=this.acquire("church",()=>this.makeChurch());_.position.set(p*(70+s()*60),0,o-50),_.rotation.y=s()*.5,n.items.push(_)}for(let _=0;_<8;_++)m("decid",p*(40+s()*160),0,o-s()*$n,.7+s()*.5,s()*6,16777215)}if((v===1||g===1)&&t>2){let p=this.acquire("noisewall",()=>this.makeNoiseWall());p.position.set(Ne.right+2.1,0,o-$n/2),n.items.push(p)}if(t%5===0&&t>0){let p=this.makeKmSign((r/1e3).toLocaleString("de-DE",{minimumFractionDigits:1,maximumFractionDigits:1}));p.position.set(Ne.right+1.2,0,o),n.items.push(p)}if(t%20===10){let p=this.acquire("notruf",()=>this.makeNotruf());p.position.set(Ne.right+1.4,0,o-30),n.items.push(p)}if(t%13===7){let p=this.acquire("gantry",()=>this.makeGantry());this.labelGantry(p,s,r+50),p.position.set(0,0,o-50),n.items.push(p)}else if(t%23===15){let p=this.acquire("bridge",()=>this.makeBridge());this.labelBridge(p,s),p.position.set(0,0,o-50),n.items.push(p)}else if(t%17===3){let[p,y]=Up[Math.floor(s()*Up.length)],_=this.acquire("brown",()=>this.makeBrownSign());_.userData.setText(p,y),_.position.set(Ne.right+3.4,0,o-40),n.items.push(_)}else if(t%29===11){let p=this.acquire("blueinfo",()=>this.makeBlueInfo());p.userData.setText(s()<.5?["Rastplatz","Sch\xE4ferborn  2 km"]:["Rastst\xE4tte","Bananensaft  1500 m"]),p.position.set(Ne.right+3.4,0,o-40),n.items.push(p)}for(let p of this.requests)!p.built&&p.s>=r&&p.s<r+$n&&this.placeRequest(n,p);for(let p of Object.keys(this.inst)){let y=this.inst[p],_=new je().makeScale(0,0,0);for(let x=a[p];x<y.cap;x++)y.mesh.setMatrixAt(e*y.cap+x,_);y.mesh.instanceMatrix.needsUpdate=!0,y.mesh.instanceColor&&(y.mesh.instanceColor.needsUpdate=!0)}}villageSide(e){return e<4?0:e%37===5||e%37===6?1:e%53===20||e%53===21?-1:0}placeRequest(e,t){t.built=!0;let n=-t.s,s=null;switch(t.type){case"brunnen":s=this.acquire("brunnen",()=>this.makeFountain()),s.position.set(Ne.right+9,0,n),this.animated.add(s);break;case"elsa":s=this.acquire("elsaStatue",()=>this.makeElsaStatue()),s.position.set(Ne.right+8,0,n),this.animated.add(s);break;case"burg":s=this.acquire("burg",()=>this.makeCastle()),s.position.set(160,0,n-60);break;case"skyline":s=this.acquire("skyline",()=>this.makeSkyline()),s.position.set(-75,0,n);break;case"sparkasse":s=this.acquire("sparkasse",()=>this.makeSparkasse()),s.userData.setColor(t.data.color||"#d5121e"),s.position.set(Ne.right+16,0,n);break;case"kiosk":s=this.acquire("kiosk",()=>this.makeKiosk()),s.userData.setText(t.data.title||"Currywurst",t.data.sub||"die richtige Bude"),s.position.set(Ne.right+10,0,n);break;case"charger":s=this.acquire("charger",()=>this.makeCharger()),s.position.set(Ne.right+11,0,n);break;case"ziel":s=this.acquire("ziel",()=>this.makeZiel()),s.userData.setText(t.data.title||"Ziel"),s.position.set(Ne.right+3.5,0,n);break;case"blitzer":s=this.acquire("blitzer",()=>this.makeBlitzer()),s.userData.flash.material.color.setScalar(1),s.position.set(Ne.right+1.6,0,n);break;case"speed":{s=this.acquire("speed:"+t.data.limit,()=>this.makeSpeedSign(t.data.limit)),s.position.set(0,0,n);break}default:return}s.userData.requestId=t.id,e.items.push(s)}canvasTex(e,t,n,s){if(this.texCache.has(e))return this.texCache.get(e);let r=document.createElement("canvas");r.width=t,r.height=n,s(r.getContext("2d"),t,n);let o=new Pt(r);if(o.colorSpace=ht,o.anisotropy=4,this.texCache.set(e,o),this.texCache.size>90){let a=this.texCache.keys().next().value;this.texCache.get(a).dispose(),this.texCache.delete(a)}return o}makeKmSign(e){let t=new we;this.kmGeo||(this.kmGeo={post:new Fe(.08,1.4,.08),board:new et(.5,.38)});let n=new D(this.kmGeo.post,this.mats.steel);n.position.y=.7;let s=this.canvasTex("km:"+e,128,96,(o,a,l)=>{o.fillStyle="#fafaf5",o.fillRect(0,0,a,l),o.strokeStyle="#111",o.lineWidth=5,o.strokeRect(3,3,a-6,l-6),o.fillStyle="#111",o.font="bold 46px Arial, sans-serif",o.textAlign="center",o.textBaseline="middle",o.fillText(e,a/2,l/2+2)}),r=new D(this.kmGeo.board,ce.std({map:s,roughness:.6}));return r.position.set(0,1.35,.05),r.rotation.y=-.25,t.add(n,r),t.userData.active=!0,t.userData.onRelease=()=>{r.material.dispose(),this.track.remove(t)},this.track.add(t),t}makeNotruf(){let e=new we,t=new D(new Fe(.32,1.25,.28),this.mats.orange);t.position.y=.62;let n=new D(new et(.22,.25),this.mats.white);return n.position.set(0,.95,.142),e.add(t,n),e}makeGantry(){let e=new we,t=this.mats.steel,n=gs-.4,s=Ne.right+1.6;for(let c of[n,s]){let h=new D(new Fe(.5,7.4,.5),t);h.position.set(c,3.7,0),h.castShadow=!0,e.add(h);let u=new D(new Fe(1.2,.5,1.2),this.mats.concrete);u.position.set(c,.25,0),e.add(u)}let r=s-n;for(let c of[6.3,7.2]){let h=new D(new Fe(r,.22,.22),t);h.position.set((n+s)/2,c,0),h.castShadow=!0,e.add(h)}for(let c=0;c<=12;c++){let h=n+r*c/12,u=new D(new Fe(.08,.9,.08),t);u.position.set(h,6.75,0),u.rotation.z=c%2?.7:-.7,e.add(u)}let o=new D(new et(7.2,2.7),ce.std({roughness:.5}));o.position.set(-3.75,6.6,.2);let a=new D(new et(7.2,2.7),ce.std({roughness:.5}));a.position.set(3.9,6.6,.2);let l=new D(new Fe(14.8,2.8,.12),this.mats.dark);return l.position.set(.07,6.6,.12),e.add(l,o,a),e.userData.panels=[o,a],e}relabelGantries(){let e=this.pools.get("gantry");if(!(!e||!this.gantryInfo))for(let t of e)t.userData.active&&t.userData.sSign!==void 0&&this.labelGantry(t,Math.random,t.userData.sSign,!0)}labelGantry(e,t,n,s=!1){e.userData.sSign=n;let r=this.gantryInfo(n),[o,a]=e.userData.panels,l=v=>v.toLocaleString("de-DE",{maximumFractionDigits:v<10?1:0})+" km",c=L_.filter(v=>!r||v!==r.target),h=tt(c),u=tt(c);for(;u===h;)u=tt(c);let d=tt(c);for(;d===h||d===u;)d=tt(c);let f=r?qr([{left:r.target,right:l(r.km)},{left:"Navi-Ziel",right:"\u2191"}],{w:768,h:288,arrows:null}):qr([{left:d,right:l(3+Math.floor(t()*20))},{left:"Rastanlage",right:l(1+Math.floor(t()*9))}],{w:768,h:288,arrows:null}),m=qr([{left:h,right:l(5+Math.floor(t()*60))},{left:u,right:l(30+Math.floor(t()*120))}],{w:768,h:288,arrows:null});for(let[v,g]of s?[[o,f]]:[[o,f],[a,m]])v.material.map&&v.material.map.dispose(),v.material.map=g,v.material.needsUpdate=!0}makeBridge(){let e=new we,t=this.mats.concrete,n=-58,s=42,r=new D(new Fe(s-n,1.1,11,20,1,1),t);r.position.set((n+s)/2,6.35,0),r.castShadow=!0,r.receiveShadow=!0,e.add(r);let o=new D(new et(s-n,11),this.mats.concreteDark);o.rotation.x=Math.PI/2,o.position.set((n+s)/2,5.79,0),e.add(o);for(let l of[gs,Ne.right+3,-31.5])for(let c of[-3.2,3.2]){let h=new D(new We(.55,.6,5.8,12),t);h.position.set(l,2.9,c),h.castShadow=!0,e.add(h)}for(let l of[n+4,s-4]){let c=new D(new Fe(8,6,13),this.mats.grass);c.position.set(l,3,0),e.add(c)}for(let l of[-5.4,5.4]){let c=new D(new Fe(s-n,.1,.1),this.mats.steel);c.position.set((n+s)/2,7.95,l),e.add(c);for(let h=n;h<=s;h+=2.5){let u=new D(new Fe(.06,1,.06),this.mats.steel);u.position.set(h,7.4,l),e.add(u)}}let a=new D(new et(9,1.5,8,1),ce.std({side:dt,roughness:.9}));return a.position.set(-1.5,6.9,5.6),e.add(a),e.userData.banner=a,e}labelBridge(e,t){let n=kp[Math.floor(t()*kp.length)],s=this.canvasTex("banner:"+n,1024,170,(r,o,a)=>{r.fillStyle="#fbfbf6",r.fillRect(0,0,o,a),r.fillStyle=["#c8102e","#1d4f9a","#111111","#2d7a32"][n.length%4],r.font='bold 92px "Comic Sans MS", "Marker Felt", "Segoe Print", Arial, sans-serif',r.textAlign="center",r.textBaseline="middle";let l=92;for(;r.measureText(n).width>o-60&&l>30;)l-=4,r.font=`bold ${l}px "Comic Sans MS", "Marker Felt", "Segoe Print", Arial, sans-serif`;r.fillText(n,o/2,a/2+4),r.strokeStyle="rgba(0,0,0,0.15)";for(let c=0;c<5;c++)r.beginPath(),r.moveTo(0,Math.random()*a),r.bezierCurveTo(o*.3,Math.random()*a,o*.7,Math.random()*a,o,Math.random()*a),r.stroke()});e.userData.banner.material.map=s,e.userData.banner.material.needsUpdate=!0,e.userData.banner.position.x=-12+t()*20}makeBrownSign(){let e=new we;for(let n of[-1.3,1.3]){let s=new D(new Fe(.1,3.8,.1),this.mats.steel);s.position.set(n,1.9,0),e.add(s)}let t=new D(new et(3.4,2.1),ce.std({roughness:.6}));return t.position.set(0,2.75,.06),e.add(t),e.rotation.y=-.12,e.userData.setText=(n,s)=>{t.material.map=this.canvasTexFrom("brown:"+n,()=>Tp(n,s)),t.material.needsUpdate=!0},e}canvasTexFrom(e,t){return this.texCache.has(e)||this.texCache.set(e,t()),this.texCache.get(e)}makeBlueInfo(){let e=new we;for(let n of[-1.3,1.3]){let s=new D(new Fe(.1,3.6,.1),this.mats.steel);s.position.set(n,1.8,0),e.add(s)}let t=new D(new et(3.4,1.8),ce.std({roughness:.6}));return t.position.set(0,2.7,.06),e.add(t),e.rotation.y=-.12,e.userData.setText=n=>{t.material.map=this.canvasTexFrom("blue:"+n.join("|"),()=>qr(n,{w:512,h:272})),t.material.needsUpdate=!0},e}makeSpeedSign(e){let t=new we,n=Ap(e),s=ce.std({map:n,transparent:!0,alphaTest:.4,roughness:.5});for(let r of[Ne.right+1.3,gs]){let o=new D(new We(.04,.04,2.6,6),this.mats.steel);o.position.set(r,1.3,0);let a=new D(new et(1,1),s);a.position.set(r,2.5,.05),t.add(o,a)}return t}makeBlitzer(){let e=new we,t=new D(new Fe(.55,2.7,.55),ce.std({color:10331048,metalness:.4,roughness:.5}));t.position.y=1.35;let n=new D(new et(.36,.5),ce.std({color:1053720,metalness:.8,roughness:.1}));n.position.set(0,2.2,.28);let s=new D(new et(.3,.2),ce.basic({color:16777215}));return s.position.set(0,1.75,.28),e.add(t,n,s),e.rotation.y=-.35,e.userData.flash=s,e}makeTurbine(){let e=new we,t=ce.std({color:15987957,roughness:.55}),n=new D(new We(1.2,2.4,92,12),t);n.position.y=46;let s=new D(new Fe(3.6,3.8,10),t);s.position.set(0,93,-1);let r=new we;r.position.set(0,93,4.4);let o=new D(new yt(2,12,10),t);o.scale.set(1,1,1.4),r.add(o);let a=new Fe(2.4,46,.5);a.translate(0,24,0);let l=a.attributes.position;for(let c=0;c<l.count;c++){let h=l.getY(c);l.setX(c,l.getX(c)*(1-h/50*.75))}a.computeVertexNormals();for(let c=0;c<3;c++){let h=new D(a,t);h.rotation.z=c/3*Math.PI*2,r.add(h)}return e.add(n,s,r),e.userData.animate=c=>{r.rotation.z=c*1.3+e.userData.phase},e}makeChurch(){let e=new we,t=ce.std({color:15525333,roughness:.9}),n=new D(new Fe(9,8,18),t);n.position.set(0,4,4);let s=new D(new We(.01,6.8,5,4,1),this.mats.redRoof);s.scale.set(1,1,2),s.rotation.y=Math.PI/4,s.position.set(0,10.5,4);let r=new D(new Fe(4.5,20,4.5),t);r.position.set(0,10,-7);let o=new D(new Wn(3.4,10,4),ce.std({color:4087378,roughness:.7}));o.rotation.y=Math.PI/4,o.position.set(0,25,-7);let a=new D(new Un(.9,16),ce.std({color:1710618}));return a.position.set(0,16,-4.74),e.add(n,s,r,o,a),e.traverse(l=>l.isMesh&&(l.castShadow=!0)),e}makeNoiseWall(){let e=this.canvasTexFrom("noisewall",()=>{let r=document.createElement("canvas");r.width=256,r.height=128;let o=r.getContext("2d");o.fillStyle="#7f8f84",o.fillRect(0,0,256,128);for(let l=0;l<128;l+=8)o.fillStyle=l%16?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.06)",o.fillRect(0,l,256,4);o.fillStyle="#5b6168",o.fillRect(0,0,10,128);let a=new Pt(r);return a.colorSpace=ht,a.wrapS=a.wrapT=Oi,a.repeat.set(20,1),a.anisotropy=4,a}),t=ce.std({map:e,roughness:.8}),n=new D(new Fe(.3,4.2,$n,1,1,25),t);n.position.y=2.1,n.castShadow=!0,n.receiveShadow=!0;let s=new we;return s.add(n),s}makeFountain(){let e=new we,t=new D(new We(3.4,3.6,.9,28,1,!0),this.mats.stone);t.position.y=.45;let n=new D(new Nn(3.45,.18,8,32),this.mats.stone);n.rotation.x=Math.PI/2,n.position.y=.9;let s=new D(new Un(3.35,28),this.mats.water);s.rotation.x=-Math.PI/2,s.position.y=.75;let r=new D(new We(.35,.5,2.4,14),this.mats.stone);r.position.y=1.2;let o=new D(new We(1.4,.35,.5,20),this.mats.stone);o.position.y=2.5;let a=ce.std({color:14676479,transparent:!0,opacity:.55,roughness:.1,emissive:3364215,emissiveIntensity:.3}),l=new D(new Wn(.25,2.2,12,1,!0),a);l.position.y=3.8,l.rotation.x=Math.PI;let c=new D(new We(1.45,2.4,1.7,24,1,!0),a);c.position.y=1.65;let h=this.canvasTex("brunnentv",512,200,(f,m,v)=>{f.fillStyle="#3a1f63",Ot(f,0,0,m,v,24),f.fill(),f.fillStyle="#ffd84a",f.font="bold 84px Arial Black, Arial, sans-serif",f.textAlign="center",f.textBaseline="middle",f.fillText("BrunnenTV",m/2,v*.42),f.fillStyle="#ffffff",f.font="34px Arial, sans-serif",f.fillText("mit Herrn Sch\xF6nnbrun \u26F2",m/2,v*.78)}),u=new D(new et(3.2,1.25),ce.std({map:h,roughness:.5}));u.position.set(-4.2,2.3,1.5),u.rotation.y=.5;let d=new D(new Fe(.12,1.8,.12),this.mats.steel);return d.position.set(-4.2,.9,1.4),e.add(t,n,s,r,o,l,c,u,d),e.userData.animate=f=>{l.scale.y=1+Math.sin(f*7)*.08,c.scale.x=c.scale.z=1+Math.sin(f*5)*.03},e}makeElsaStatue(){let e=new we,t=new D(new We(1.8,2.1,1.2,20),this.mats.stone);t.position.y=.6;let n=bl({curved:!0});n.scale.setScalar(4.2),n.position.y=1.2,n.rotation.y=-.6;let s=this.canvasTex("elsaSign",512,160,(o,a,l)=>{o.fillStyle="#1d3f9a",Ot(o,0,0,a,l,20),o.fill(),o.fillStyle="#f2c230",o.font="bold 66px Arial, sans-serif",o.textAlign="center",o.textBaseline="middle",o.fillText("\u{1F451} Elsa gr\xFC\xDFt!",a/2,l/2+3)}),r=new D(new et(2.6,.8),ce.std({map:s}));return r.position.set(0,.7,2.12),e.add(t,n,r),e.userData.animate=o=>El(n,o),e}makeCastle(){let e=new we,t=new D(new Wn(95,42,24,1),ce.lambert({color:6063680}));t.position.y=21;let n=ce.std({color:12036495,roughness:.95}),s=new D(new Fe(12,30,12),n);s.position.y=57;let r=new D(new Wn(9.5,12,4),this.mats.redRoof);r.rotation.y=Math.PI/4,r.position.y=78,e.add(t,s,r);for(let o=0;o<4;o++){let a=o/4*Math.PI*2+.4,l=new D(new We(3.5,3.8,20,12),n);l.position.set(Math.sin(a)*18,52,Math.cos(a)*18);let c=new D(new Wn(4.4,8,12),this.mats.redRoof);c.position.set(Math.sin(a)*18,66,Math.cos(a)*18),e.add(l,c);let h=(o+.5)/4*Math.PI*2+.4,u=new D(new Fe(24,12,2),n);u.position.set(Math.sin(h)*13.5,48,Math.cos(h)*13.5),u.rotation.y=h,e.add(u)}return e}makeSkyline(){let e=new we,t=Bn(69),n=[this.mats.glassBlue,ce.std({color:12174028,metalness:.5,roughness:.3}),ce.std({color:7305862,metalness:.6,roughness:.25})];for(let s=0;s<16;s++){let r=60+t()*190,o=18+t()*22,a=new D(new Fe(o,r,o),n[s%3]);if(a.position.set(-s*22-t()*8,r/2,-s*14-t()*40),e.add(a),s===7){let l=new D(new We(.6,1.2,50,6),this.mats.steel);l.position.set(a.position.x,r+25,a.position.z),e.add(l)}}return e}makeSparkasse(){let e=new we,t=new D(new Fe(14,7,10),ce.std({color:15328991,roughness:.85}));t.position.y=3.5;let n=new D(new et(12,3),this.mats.glassBlue);n.position.set(0,2.2,5.01),n.rotation.y=0;let s=new D(new et(8,1.6),ce.std({roughness:.5}));return s.position.set(0,6,5.03),e.add(t,n,s),e.rotation.y=-Math.PI/2+.25,e.userData.setColor=r=>{let o=this.canvasTex("spk:"+r,512,100,(a,l,c)=>{a.fillStyle="#ffffff",a.fillRect(0,0,l,c),a.fillStyle=r,a.font="bold 64px Arial, sans-serif",a.textAlign="center",a.textBaseline="middle",a.fillText("Sparkasse",l/2,c/2+3)});s.material.map=o,s.material.needsUpdate=!0},e}makeKiosk(){let e=new we,t=new D(new Fe(5,3,4),ce.std({color:15786160,roughness:.8}));t.position.y=1.5;let n=new D(new Fe(5.4,.2,1.6),ce.std({color:13770784,roughness:.7}));n.position.set(0,2.8,2.6),n.rotation.x=.25;let s=new D(new We(.12,.12,7,8),this.mats.steel);s.position.set(-3.6,3.5,1);let r=new D(new et(3.2,1.8),ce.std({roughness:.5}));return r.position.set(-3.6,6.4,1.13),e.add(t,n,s,r),e.rotation.y=-.4,e.userData.setText=(o,a)=>{let l=this.canvasTex("kiosk:"+o+a,512,288,(c,h,u)=>{c.fillStyle="#fff4d0",Ot(c,0,0,h,u,26),c.fill(),c.strokeStyle="#d22020",c.lineWidth=12,Ot(c,8,8,h-16,u-16,20),c.stroke(),c.fillStyle="#b31515",c.font="bold 72px Arial Black, Arial, sans-serif",c.textAlign="center",c.textBaseline="middle",c.fillText(o,h/2,u*.4),c.fillStyle="#333",c.font="bold 38px Arial, sans-serif",c.fillText(a,h/2,u*.75)});r.material.map=l,r.material.needsUpdate=!0},e}makeCharger(){let e=new we,t=new D(new Fe(14,.4,6),ce.std({color:16053492,roughness:.6}));t.position.y=4.2,e.add(t);for(let s of[-6,6]){let r=new D(new Fe(.3,4.2,.3),this.mats.steel);r.position.set(s,2.1,0),e.add(r)}for(let s=0;s<5;s++){let r=new D(new Fe(.35,1.6,.35),ce.std({color:15921906,roughness:.4}));r.position.set(-5+s*2.5,.8,-1.5);let o=new D(new Fe(.36,.25,.36),ce.std({color:13638684,emissive:5242880}));o.position.set(-5+s*2.5,1.35,-1.5),e.add(r,o)}let n=new D(new Fe(13.6,.08,5.6),ce.basic({color:12575743}));return n.position.y=3.98,e.add(n),e.rotation.y=-.2,e}makeZiel(){let e=new we;for(let r of[-2.2,2.2]){let o=new D(new We(.08,.08,4.6,8),this.mats.steel);o.position.set(r,2.3,0),e.add(o)}let t=this.canvasTex("checker",256,64,(r,o,a)=>{for(let l=0;l<4;l++)for(let c=0;c<16;c++)r.fillStyle=(c+l)%2?"#111":"#fff",r.fillRect(c*16,l*16,16,16)}),n=new D(new et(4.4,.9,10,1),ce.std({map:t,side:dt}));n.position.y=4.15;let s=new D(new et(4.2,1.6),ce.std({roughness:.6}));return s.position.y=2.9,s.position.z=.05,e.add(n,s),e.rotation.y=-.15,e.userData.setText=r=>{s.material.map=this.canvasTexFrom("ziel:"+r,()=>qr(["Ziel erreicht:",r],{w:512,h:196,bg:"#1d7a3a"})),s.material.needsUpdate=!0},e}flashBlitzer(e){let t=this.pools.get("blitzer")||[];for(let n of t)n.userData.active&&n.userData.flash.material.color.setScalar(e?30:1)}};var Kr={klein:{L:3.62,half:.83,H:1.5,belt:.93,hood:.78,ws:1.32,re:2.85,ce:3.48,rear:"hatch",axles:[.68,3],wr:.29,cl:.15,nose:.62,weight:8},kompakt:{L:4.26,half:.895,H:1.46,belt:.93,hood:1.05,ws:1.72,re:3.35,ce:4.12,rear:"hatch",axles:[.86,3.5],wr:.31,cl:.16,nose:.6,weight:22},limo:{L:4.78,half:.915,H:1.45,belt:.95,hood:1.32,ws:1.98,re:3.15,ce:3.88,rear:"sedan",axles:[.95,3.8],wr:.32,cl:.15,nose:.6,weight:15},kombi:{L:4.82,half:.915,H:1.5,belt:.95,hood:1.25,ws:1.92,re:4.5,ce:4.74,rear:"wagon",axles:[.95,3.75],wr:.32,cl:.16,nose:.6,weight:18},suv:{L:4.62,half:.94,H:1.68,belt:1.08,hood:1.12,ws:1.78,re:4.2,ce:4.5,rear:"wagon",axles:[.92,3.62],wr:.36,cl:.22,nose:.74,weight:14},sport:{L:4.5,half:.93,H:1.27,belt:.82,hood:1.62,ws:2.25,re:2.9,ce:4.05,rear:"hatch",axles:[1.12,3.62],wr:.33,cl:.12,nose:.48,weight:4},transporter:{L:5.9,half:1,H:2.5,belt:1.2,hood:.78,ws:1.42,re:5.85,ce:5.9,rear:"box",cargo:2.05,axles:[.95,4.6],wr:.36,cl:.2,nose:.78,weight:8},wohnmobil:{L:7,half:1.15,H:3,belt:1.3,hood:.8,ws:1.45,re:6.95,ce:7,rear:"box",cargo:1.9,alkoven:!0,axles:[1,4.9],wr:.38,cl:.22,nose:.8,weight:2}},O_=[[12106946,20],[1118740,20],[15659250,18],[5922662,18],[2310266,10],[10361627,6],[2968122,3],[12099706,2],[15254298,1],[13789470,1],[1929128,2]],Bp=["KS-EL 5A","GF-PO 110","FD-BR 1","SI-EG 3","F-SK 2017","MZ-RT 1369","B-AN 333","KS-ZF 33","HU-PA 42","F-AB 1234","DA-HD 1080","OF-RT 333","GF-MA 3","HH-MA 1","FD-VIP 3","K-OE 1337"],Cl=[["Pl\xFCsch-Logistik","Wir liefern Mini Adams in ganz Deutschland","#ffffff","#c8102e"],["Brunnenbau Sch\xF6nnbrun","Seit 1887 \u2013 Brunnen mit Gef\xFChl","#e8f1f8","#1d5fa8"],["Rettich-Express","Frisch vom Feld \u2013 13,69 \u20AC das Kilo","#f6f6ee","#3c8d2f"],["Pappkarton & S\xF6hne","Haufenweise Kartons seit 1972","#d8b98a","#5a3b1c"],["Elsa Fischtransporte","Kassel \xB7 frisch & k\xF6niglich","#ffffff","#1d3f9a"],["Bananensaft-Spedition","Gelb ist das neue Schnell","#fff6c0","#c79a00"],["Sprachstudio-Logistik","Wir bringen jede Durchsage an","#f0f0f0","#7a2ca0"],["Konfetti-Transporte","Vorsicht: Rutschgefahr beim \xD6ffnen","#ffffff","#e5307a"],["Ringtennis-Bedarf","Ringe, Netze, Leidenschaft","#eef6ff","#d45a00"],["Kanalpunkte-Kurier","Wetten, dass wir p\xFCnktlich sind?","#f4f4f4","#6c3fc4"],["Leitplanken-Lutz","Wir halten zusammen","#e6e6e6","#444444"],["Schnelle Pommes","Ohne R\xFCckfragen","#fff3d6","#d81e1e"]],Fp=["Abstand halten!","Wie fahre ich? 0800-BRUNNEN","Ladung: 33.333 Rettiche","Rechts fahren ist Ehrensache","Mein Wischer zuckt auch","Gr\xFC\xDFe an die Polizei Gifhorn","Nicht hupen, Fahrer tr\xE4umt von Elsa"],Tl=null;function xs(){return Tl||(Tl={body:new Map,glass:ce.std({color:1317410,metalness:.6,roughness:.08,envMapIntensity:1.4}),detail:ce.std({vertexColors:!0,roughness:.6,metalness:.15}),tail:ce.std({color:2753797,emissive:16711680,emissiveIntensity:.14,roughness:.3}),brake:ce.std({color:5245450,emissive:16711680,emissiveIntensity:.95,roughness:.3}),liner:ce.std({color:789517,roughness:.85,side:dt}),blink:ce.std({color:5583616,emissive:16753178,emissiveIntensity:3,roughness:.3}),blueOn:ce.std({color:662118,emissive:2250239,emissiveIntensity:5,roughness:.3}),blueOff:ce.std({color:1714790,emissive:660800,emissiveIntensity:.4,roughness:.3}),plates:new Map,trailers:new Map,ground:ce.basic({color:0,map:gl(),transparent:!0,opacity:.5,depthWrite:!1})},Tl)}var Wu=new Map;function z_(i,e){let t=i.toFixed(2)+"x"+e.toFixed(2);if(!Wu.has(t)){let n=new et(i,e,1,Math.max(1,Math.ceil(e/2.5)));n.rotateX(-Math.PI/2),n.translate(0,.02,0),Wu.set(t,n)}return Wu.get(t)}function Al(i,e=null){let t=xs(),n=i+(e?":"+e.uuid:"");return t.body.has(n)||t.body.set(n,ce.std({color:i,map:e,metalness:.45,roughness:.3,envMapIntensity:1.1})),t.body.get(n)}function Op(i){let e=xs();return e.plates.has(i)||e.plates.set(i,ce.std({map:fl(i),roughness:.6})),e.plates.get(i)}function Gp(i){let e=xs();e.tail.emissiveIntensity=i?.3:.14,e.ground.opacity=i?.78:.5}var Zr=new Map,qs=new A;function zp(i,e,t){let n=0,s=-1/0;for(let r=0;r<=48;r++){if(qi(i,e,-Math.PI/2+r/48*Math.PI,qs),qs.y>=t)return s===-1/0?qs.x:it(n,qs.x,(t-s)/Math.max(1e-6,qs.y-s));n=qs.x,s=qs.y}return 0}function qu(i){if(Zr.has(i))return Zr.get(i);let e=Kr[i],{L:t,half:n,H:s,belt:r,hood:o,ws:a,re:l,ce:c,rear:h,axles:u,wr:d,cl:f,nose:m}=e,v=h==="box",g=[[0,m-.13],[.06,m],[.3,m+.06],[o,r]];h==="sedan"?g.push([c,r+.05],[t-.16,r+.06],[t,r-.1]):g.push([it(o,t,.6),r+.02],[t-.06,r-.02],[t,r-.14]);let p=In(g),y=In([[0,.36],[.08,f+.07],[.28,f],[t-.3,f],[t-.06,f+.1],[t,.4]]),_=yl(y,u,d+.07,d),x=In([[0,n-.22],[.1,n-.08],[.4,n-.02],[.9,n],[t-.9,n],[t-.3,n-.03],[t,n-.1]]),I={w:x,b:y,bx:_l(_,.5,.72),t:p,tw:.9,bw:.95,n:4.5,L:t},S=[Si({u0:0,u1:t,...I,segs:64,ring:24,H:s})],T=(ie,ae,Pe)=>qi(I,ie,ae,Pe),C=(ie,ae,Pe,Me,R,b=.004)=>Xs(T,(G,$)=>{let te=it(Me,R,G);return[it(ae,Pe,$),ie>0?te:Math.PI-te]},{ns:Math.max(6,Math.ceil(Math.abs(R-Me)/.08)),nt:8,lift:b}),E=h==="sedan"?r+.07:r+.12,M=v?e.cargo+.02:c,P=[[o-.02,r+.01],[it(o,a,.5),it(r,s,.56)],[a,s-.01]];v?P.push([M,s-.01]):P.push([(a+l)/2,s],[l,s-.015],[it(l,c,.5),it(s,E,.55)],[c,E]);let k=In(P),H=ie=>x(ie)-.06,F={w:H,b:ie=>p(ie)-.05,t:k,tw:v?.95:.8,bw:1,n:3.4,L:t},W=Si({u0:o-.02,u1:M,...F,segs:36,ring:22,H:s});if(v)S.push(Si({u0:e.cargo,u1:t,w:ie=>x(ie)+.01,b:()=>r-.06,t:In([[e.cargo,s-.02],[e.cargo+.3,s],[t,s]]),tw:.97,bw:1,n:7,segs:24,ring:24,L:t,H:s})),e.alkoven?S.push(Si({u0:.45,u1:e.cargo+.2,w:()=>n+.02,b:In([[.45,s-.45],[1.2,s-.7],[e.cargo+.2,s-.72]]),t:()=>s,tw:.98,bw:1,n:6,segs:16,ring:24,L:t,H:s})):S.push(Si({u0:a-.05,u1:e.cargo+.05,w:ie=>H(ie)*.95+.02,b:ie=>k(ie)-.07,t:ie=>k(ie)+.015,tw:.95,bw:1,n:5,segs:10,ring:20,L:t,H:s}));else{let ie=(ae,Pe,Me)=>qi(F,ae,Pe,Me);S.push(Xs(ie,(ae,Pe)=>[it(a-.03,l+.02,Pe),it(.42,Math.PI-.42,ae)],{ns:12,nt:16,lift:.006}))}let N=It(S),Z=[],V=[],ee=ie=>ie-t/2;for(let ie of u)for(let ae of[-1,1]){let Pe=n*.45,Me=new We(d+.065,d+.065,n-Pe,14,1,!0,0,Math.PI);Me.rotateZ(Math.PI/2),Me.translate(ae*(n+Pe)/2,d,ee(ie));let R=new Un(d+.065,14,0,Math.PI);R.rotateY(Math.PI/2),R.translate(ae*Pe,d,ee(ie)),V.push(Me.toNonIndexed(),R.toNonIndexed());for(let G of[-1,1]){let $=new et(n-Pe,d-f+.02);$.translate(ae*(n+Pe)/2,(d+f-.02)/2,ee(ie+G*(d+.06))),V.push($.toNonIndexed())}let b=new We(d,d,.22,16);b.rotateZ(Math.PI/2),b.translate(ae*(n-.13),d,ee(ie)),Z.push(gt(b,1184274)),Z.push(gt(Oo(d*.62,ae*(n-.015),d,ee(ie),ae,14),10133414))}Z.push(gt(C(1,0,.16,-Math.PI+.42,-.42,.004),1776413)),Z.push(gt(C(1,t-.18,t,-Math.PI+.42,-.42,.004),1776413));let he=p(0),xe=y(0);Z.push(gt(Rt(x(0)*1.05,Math.max(.04,(he-xe)*.55),.01,0,xe+(he-xe)*.45,ee(0)-.006),2237222));let ke=o+.25,Je=r+.035,K=Math.max(zp(I,ke,Je),zp(F,ke,Je))-.02;for(let ie of[-1,1])Z.push(gt(C(ie,.008,.17,.2,.8,.004),2896184)),Z.push(gt(C(ie,.02,.15,.3,.7,.007),15002868)),Z.push(gt(Rt(.15,.085,.06,ie*(n+.03),r+.07,ee(ke),0,ie*.12,0),1710620)),Z.push(gt(Rt(n-.03-K,.035,.05,ie*(K+n-.03)/2,Je,ee(ke)+.01),1710620));let oe=It(Z);for(let ie of V)ie.deleteAttribute("uv");let ge=It(V),fe=[],Te=h==="box"?.85:p(t)-.1,He=x(t)-.26;for(let ie of[-1,1])fe.push(Rt(.3,.12,.024,ie*He,Te,ee(t)+.004));let Xe=It(fe),Qe=h==="box"?Te+.11:Te-.1,Q=x(t)-.18,me=ie=>It([Rt(.1,.06,.024,ie*Q,Qe,ee(t)+.006),C(ie,.01,.12,.02,.18,.005),C(ie,Math.min(u[0]+d+.12,o-.1),Math.min(u[0]+d+.2,o-.02),.3,.4,.005)]),L=new et(.52,.112);L.translate(0,h==="box"?.55:Math.max(f+.32,r-.32),ee(t)+.012);let Be=[Rt(.42,.08,.22,-.22,s+.05,ee((a+l)/2)),Rt(.42,.08,.22,.22,s+.05,ee((a+l)/2))],se={bodyGeo:N,glassGeo:W,detailGeo:oe,linerGeo:ge,tailGeo:Xe,blinkL:me(-1),blinkR:me(1),plateGeo:L,lightbarGeo:Be,bodyShape:I};return Zr.set(i,se),se}var Xu=16.5;function Vp(){if(Zr.has("lkw"))return Zr.get("lkw");let i=h=>h-Xu/2,e=Si({u0:0,u1:2.3,w:In([[0,1.18],[.12,1.24],[2.3,1.25]]),b:()=>.92,t:In([[0,3.35],[.2,3.62],[.8,3.75],[2.3,3.78]]),tw:.96,bw:1,n:8,segs:14,ring:28,L:Xu,H:4}),t=[];t.push(gt(Rt(2.2,1.05,.05,0,2.72,i(0)-.06,-.06),1581096));for(let h of[-1,1])t.push(gt(Rt(.04,.85,1,h*1.255,2.75,i(.75)),1581096));t.push(gt(Rt(2.3,.35,.12,0,.75,i(.05)),2763308)),t.push(gt(Rt(1.7,.9,.04,0,1.6,i(.01)),3093046)),t.push(gt(Rt(2.4,.12,.35,0,3.4,i(.05),.25),1973792)),t.push(gt(Rt(1,.45,5.2,0,.78,i(3.2)),2236964));for(let h of[-1,1]){let u=new We(.3,.3,1.2,12);u.rotateX(Math.PI/2),u.translate(h*.95,.75,i(3.2)),t.push(gt(u,12172996)),t.push(gt(Rt(.3,.12,.08,h*.85,1.25,i(.02)),15199989)),t.push(gt(Rt(.08,.55,.06,h*1.38,2.6,i(.55)),1710618));for(let d of[2.42,2.8])t.push(gt(Rt(.16,.035,.035,h*1.31,d,i(.55)),1710618));t.push(gt(Rt(.05,.4,9,h*1.24,.95,i(9.3)),10133670))}let n=[[1.35,.52,.32],[4.9,.52,.55],[13.3,.48,.5],[14.6,.48,.5],[15.9,.48,.5]];for(let[h,u,d]of n)for(let f of[-1,1]){let m=new We(u,u,d,16);m.rotateZ(Math.PI/2),m.translate(f*(1.25-d/2-.02),u,i(h)),t.push(gt(m,1184274)),t.push(gt(Oo(u*.6,f*1.24,u,i(h),f,14),9080726))}t.push(gt(Rt(2.4,.15,.12,0,.6,i(16.45)),10133670)),t.push(gt(Rt(2.4,.3,13.6,0,1.12,i(9.7)),2829358));let s=It(t),r=new Fe(2.55,2.75,13.6);r.translate(0,2.65,i(9.7));let o=It([Rt(.4,.14,.05,-.95,1.05,i(16.5)+.02),Rt(.4,.14,.05,.95,1.05,i(16.5)+.02)]),a=h=>It([Rt(.14,.12,.05,h*1.17,1.05,i(16.5)+.025),Rt(.12,.1,.05,h*1.05,1.25,i(0)-.02),Rt(.04,.08,.16,h*1.27,1.25,i(1.9))]),l=new et(.52,.112);l.translate(0,1.12,i(16.5)+.03);let c={bodyGeo:e,detailGeo:s,trailerGeo:r,tailGeo:o,blinkL:a(-1),blinkR:a(1),plateGeo:l};return Zr.set("lkw",c),c}function Wp(i){let e=xs();if(!e.trailers.has(i)){let[t,n,s,r]=Cl[i],o=ce.std({map:Rp(t,n,s,r),roughness:.7}),a=ce.std({map:Cp(Fp[i%Fp.length]),roughness:.7}),l=ce.std({color:new Ue(s),roughness:.75});e.trailers.set(i,[o,o,l,l,a,l])}return e.trailers.get(i)}var Yr=null;function Xp(){if(Yr)return Yr;let i=document.createElement("canvas");i.width=1024,i.height=256;let e=i.getContext("2d");e.fillStyle="#d9dde2",e.fillRect(0,0,1024,256);let t=n=>256-n/1.5*256;return e.fillStyle="#1b4ea3",e.fillRect(0,t(.86),1024,t(.42)-t(.86)),e.fillStyle="#d7e64a",e.fillRect(0,t(.88),1024,5),Yr=new Pt(i),Yr.colorSpace=ht,Yr.anisotropy=4,Yr}var Rl=null;function qp(){if(Rl)return Rl;let i=document.createElement("canvas");i.width=1024,i.height=192;let e=i.getContext("2d");e.textAlign="center",e.textBaseline="middle",e.fillStyle="#ffffff",e.font="bold 118px Arial, sans-serif",e.fillText("POLIZEI",512,84),e.font="bold 40px Arial, sans-serif",e.fillText("Gifhorn",512,166);let t=new Pt(i);t.colorSpace=ht,t.anisotropy=4;let n=ce.std({map:t,transparent:!0,depthWrite:!1,roughness:.4}),s=qu("kombi").bodyShape,{n:r}={n:4.5},o=(l,c)=>{let h=s.b(l),u=s.t(l),d=Math.min(.995,Math.max(-.995,2*(c-h)/(u-h)-1));return Math.asin(Math.sign(d)*Math.pow(Math.abs(d),r/2))},a=[-1,1].map(l=>{let c=Xs((u,d,f)=>qi(s,u,d,f),(u,d)=>{let f=it(1.62,3.22,d),m=o(f,it(.47,.8,u));return[f,l>0?m:Math.PI-m]},{ns:4,nt:28,lift:.006}),h=c.attributes.uv;for(let u=0;u<h.count;u++){let d=h.getX(u),f=h.getY(u);h.setXY(u,l>0?1-f:f,d)}return c});return Rl={mat:n,geo:It(a)},Rl}var Pl=class{constructor(e,{color:t,plate:n,company:s}={}){let r=xs();this.kind=e,this.group=new we,this.brake=!1,this.blinkDir=0,this.police=e==="polizei";let o=e==="polizei"?"kombi":e;if(e==="lkw"){let a=Vp();this.length=Xu,this.width=2.55,this.height=4;let l=t??tt([15921906,11540504,1920922,15250432,2236962,2976570,14343648]);this.cab=new D(a.bodyGeo,Al(l)),this.details=new D(a.detailGeo,r.detail);let c=s??Math.floor(Math.random()*Cl.length);this.company=Cl[c][0],this.trailer=new D(a.trailerGeo,Wp(c)),this.tail=new D(a.tailGeo,r.tail),this.blinkL=new D(a.blinkL,r.blink),this.blinkR=new D(a.blinkR,r.blink),this.plate=new D(a.plateGeo,Op(n??tt(Bp))),this.group.add(this.cab,this.details,this.trailer,this.tail,this.blinkL,this.blinkR,this.plate),this.trailer.castShadow=!0,this.cab.castShadow=!0}else{let a=qu(o),l=Kr[o];this.length=l.L,this.width=l.half*2+.12,this.height=l.H;let c;if(this.police?c=Al(16777215,Xp()):e==="wohnmobil"?c=Al(16053488):c=Al(t??Uo(O_,h=>h[1])[0]),this.body=new D(a.bodyGeo,c),this.body.castShadow=!0,this.glass=new D(a.glassGeo,r.glass),this.details=new D(a.detailGeo,r.detail),this.liners=new D(a.linerGeo,r.liner),this.tail=new D(a.tailGeo,r.tail),this.blinkL=new D(a.blinkL,r.blink),this.blinkR=new D(a.blinkR,r.blink),this.plate=new D(a.plateGeo,Op(n??(this.police?"GF-3333":tt(Bp)))),this.group.add(this.body,this.glass,this.details,this.liners,this.tail,this.blinkL,this.blinkR,this.plate),this.police){this.bar=a.lightbarGeo.map(u=>new D(u,r.blueOff)),this.group.add(...this.bar);let h=qp();this.group.add(new D(h.geo,h.mat))}}this.blinkL.visible=!1,this.blinkR.visible=!1,this.ground=new D(z_(this.width+.2,this.length+.35),r.ground),this.ground.renderOrder=-1,this.group.add(this.ground)}setPoliceText(e){if(!this.police)return;if(!this.display){let r=document.createElement("canvas");r.width=512,r.height=96,this.displayCanvas=r,this.displayTex=new Pt(r),this.displayTex.colorSpace=ht;let o=Kr.kombi,a=ce.basic({map:this.displayTex,toneMapped:!1});this.display=new D(new et(.9,.17),a),this.display.position.set(0,o.H-.25,o.L/2-.18),this.display.rotation.x=-.52,this.group.add(this.display)}let t=this.displayCanvas.getContext("2d");t.fillStyle="#050505",t.fillRect(0,0,512,96),t.fillStyle="#ffb21a",t.font='bold 54px "Courier New", monospace',t.textAlign="center",t.textBaseline="middle";let n=(e||"POLIZEI GIFHORN").toUpperCase(),s=54;for(;t.measureText(n).width>490&&s>20;)s-=4,t.font=`bold ${s}px "Courier New", monospace`;t.fillText(n,256,50),this.displayTex.needsUpdate=!0}setBrake(e){e!==this.brake&&(this.brake=e,this.tail.material=e?xs().brake:xs().tail)}setBlink(e){this.blinkDir=e,e||(this.blinkL.visible=!1,this.blinkR.visible=!1)}updateLights(e,t=!1){let n=Math.sin(e*Math.PI*2*1.45)>0;if(this.blinkDir&&(this.blinkL.visible=this.blinkDir<0&&n,this.blinkR.visible=this.blinkDir>0&&n),this.bar){let s=xs(),r=Math.floor(e*7)%4;this.bar[0].material=t&&(r===0||r===2)?s.blueOn:s.blueOff,this.bar[1].material=t&&(r===1||r===3)?s.blueOn:s.blueOff}}};function Yu(i=!0,e=.18){if(i&&Math.random()<e)return"lkw";let t=Object.keys(Kr);return Uo(t,n=>Kr[n].weight)}function Yp(){for(let i of Object.keys(Kr))qu(i);Vp();for(let i=0;i<Cl.length;i++)Wp(i);Xp(),qp()}var Zu=[[150,205],[128,160],[112,138],[95,120]],Zi=1/3.6,G_=1,Il=class{constructor(e,t){this.scene=e,this.rain=t,this.group=new we,this.group.name="Traffic",e.add(this.group),this.cars=[],this.oncoming=[],this.pool=new Map,this.difficulty=0,this.leftOpen=!1,this.grip=1,this.t=0,this.events=[],this.policeText=null}acquire(e,t){let n=this.pool.get(e)||[];this.pool.set(e,n);let s=n.find(r=>!r.inUse&&!t);return s||(s=new Pl(e,t),n.push(s),this.group.add(s.group)),s.inUse=!0,s.group.visible=!0,s.setBrake(!1),s.setBlink(0),s}releaseVehicle(e){e.inUse=!1,e.group.visible=!1}reset(){for(let e of this.cars)this.releaseVehicle(e.v);for(let e of this.oncoming)this.releaseVehicle(e.v);this.cars=[],this.oncoming=[],this.events=[],this.difficulty=0,this.leftOpen=!1}laneSpeed(e,t){if(t)return Se(e===2?86:80,e===2?92:89)*Zi;let[n,s]=Zu[e];return Se(n,s+this.difficulty*15)*Zi}spawn(e,t,{kind:n,speed:s,behavior:r="normal",opts:o}={}){let a=n||Yu(t>=2,t===3?.3:.22),l=a==="lkw";l&&t<2&&(t=2+Math.round(Math.random()));let c=this.acquire(a,o),h={id:G_++,v:c,kind:a,truck:l,lane:t,x:Ne.laneCenter(t),s:e,speed:s??this.laneSpeed(t,l),len:c.length,w:c.width,v0:0,change:null,decideIn:Se(.5,2.5),brake:!1,passed:!1,behavior:r,sirens:r==="polizei",careless:mt(.08+this.difficulty*.18),wobble:Math.random()*10};return h.v0=h.speed,r==="polizei"&&c.setPoliceText?.(this.policeText),this.cars.push(h),this.place(h,e),h}spawnOncoming(e,t=!0){let n=Math.floor(Math.random()*4),s=Yu(n>=2,.2),r=this.acquire(s);r.group.rotation.y=Math.PI;let o=s==="lkw",a=o?Se(80,89)*Zi:Se(Zu[n][0]-15,Zu[n][1])*Zi;this.oncoming.push({v:r,s:e+(t?Se(700,1300):Se(100,1200)),x:hi(Ne.laneCenter(o?2+Math.round(Math.random()):n)),speed:a,len:r.length})}populate(e,t){this.reset();for(let n=0;n<18;n++){let s=Zp(this.leftOpen),r=e+40+n*45+Se(0,30);this.laneFree(s,r,30)&&this.spawn(r,s)}for(let n=0;n<10;n++)this.spawnOncoming(e,!1)}laneFree(e,t,n){for(let s of this.cars)if(zo(s,e)&&Math.abs(s.s-t)<n+s.len)return!1;return!0}place(e,t){e.v.group.position.set(e.x,0,-(e.s-t))}update(e,t,n,s){this.t=t,this.events.length=0,this.difficulty=s.difficulty,this.leftOpen=s.leftOpen;let r=s.rain>.3;Gp(r);let o=Math.round(it(15,32,this.difficulty));if(this.cars.length<o){let u=Zp(this.leftOpen),d=n.s+Se(620,950);this.laneFree(u,d,60)&&this.spawn(d,u)}if(n.speed<34&&mt(e*.35)&&this.cars.length<o+4){let u=this.leftOpen?1:mt(.6)?0:1,d=n.s-Se(150,190);this.laneFree(u,d,40)&&(this.spawn(d,u,{speed:Se(170,215)*Zi}).passed=!0)}let a=this.cars,l={s:n.s,x:n.x,speed:n.speed,len:n.len,w:n.w,isPlayer:!0};for(let u of a){if(u.decideIn-=e,!u.change&&u.decideIn<=0&&(u.decideIn=Se(.6,1.6),this.decide(u,a,l)),u.change){let y=u.change;if(y.t+=e,y.t<y.delay)u.v.setBlink(y.to<y.from?-1:1);else{let _=Ke((y.t-y.delay)/y.dur,0,1);u.x=it(Ne.laneCenter(y.from),Ne.laneCenter(y.to),Ei(0,1,_)),_>=.5&&(u.lane=y.to),_>=1&&(u.change=null,u.v.setBlink(0))}}let d=this.leader(u,a,l),f=u.truck?1.7:1.25+(u.careless?-.4:0),m=u.truck?.6:1.6,v=2.8,g=3,p=m*(1-Math.pow(u.speed/Math.max(1,u.v0),4));if(d){let y=Math.max(.1,d.s-u.s-(d.len+u.len)/2),_=u.speed-d.speed,x=g+Math.max(0,u.speed*f+u.speed*_/(2*Math.sqrt(m*v)));p-=m*Math.pow(x/y,2),y<4&&_>0&&(p=Math.min(p,-9))}p=Ke(p,-10,m),u.speed=Math.max(0,u.speed+p*e),u.brake=p<-1.2,u.v.setBrake(u.brake||u.speed<3),u.s+=u.speed*e}for(let u=0;u<a.length;u++)for(let d=u+1;d<a.length;d++){let f=a[u],m=a[d];if(Math.abs(f.x-m.x)>(f.w+m.w)/2-.2)continue;let v=m.s-f.s,g=(f.len+m.len)/2+.5;if(Math.abs(v)<g){let p=v>0?f:m,y=v>0?m:f;p.s=y.s-g,p.speed=Math.min(p.speed,y.speed)}}for(let u of a){let d=Math.abs(u.x-n.x),f=u.s-n.s,m=(u.w+n.w)/2-d,v=(u.len+n.len)/2-Math.abs(f);if(m>.08&&v>.05&&(f<0&&m>.6&&u.speed>n.speed?(u.s=n.s-(u.len+n.len)/2-.4,u.speed=Math.min(u.speed,n.speed*.95)):(u.contactT=t,this.events.push({type:"crash",car:u,ds:f,dx:u.x-n.x,latOverlap:m,lonOverlap:v}))),!u.passed&&f<-(u.len+n.len)/2){u.passed=!0;let g=d-(u.w+n.w)/2,p=n.speed-u.speed,y=t-(u.contactT??-1e9)<2;g<.85&&g>-.05&&p>6&&!y&&this.events.push({type:"nearMiss",car:u,clearance:g,rel:p}),u.behavior==="polizei"&&this.events.push({type:"passPolice",car:u})}f>0&&(u.passed=!1)}let c=[];for(let u of a){let d=u.s-n.s;if(d<-240||d>1250){this.releaseVehicle(u.v);continue}if(c.push(u),this.place(u,n.s),u.v.group.rotation.y=u.change&&u.change.t>u.change.delay?u.change.to>u.change.from?-.035:.035:0,u.v.updateLights(t,u.sirens),r&&d>-10&&d<140){let f=-d+u.len/2;this.rain.emit(u.x,f,u.w,u.speed,u.truck?3:1)}}this.cars=c;let h=[];for(let u of this.oncoming){u.s-=u.speed*e;let d=u.s-n.s;if(d<-200){this.releaseVehicle(u.v),u.v.group.rotation.y=0;continue}u.v.group.position.set(u.x,0,-d),h.push(u)}for(this.oncoming=h;this.oncoming.length<11;)this.spawnOncoming(n.s,!0);return this.events}leader(e,t,n){let s=null,r=1/0,o=e.change&&e.change.t>=e.change.delay?[e.change.from,e.change.to]:[e.lane];for(let l of t){if(l===e)continue;let c=l.s-e.s;c<=0||c>220||c>=r||o.some(h=>zo(l,h))&&(s=l,r=c)}let a=n.s-e.s;return a>0&&a<r&&o.some(l=>zo(n,l))&&(s=n),s}decide(e,t,n){if(e.behavior==="elefant")return;let s=this.leader(e,t,n),r=e.truck?2:0;if(s&&e.lane>r&&s.s-e.s-(s.len+e.len)/2<70&&s.speed<e.v0-2.5){let a=e.lane-1;if(!(e.truck&&a<2)&&this.safe(e,a,t,n))return this.startChange(e,a)}if(e.lane<3&&!(e.truck&&e.lane>=3)){let o=e.lane===0&&this.leftOpen?.65:e.behavior==="schleicher"?.02:.25;if(mt(o)){let a=e.lane+1;if(this.laneClearAhead(e,a,t,n,90)&&this.safe(e,a,t,n))return this.startChange(e,a)}}if(e.careless&&mt(.04+this.difficulty*.12)){let o=e.lane+(mt(.5)?-1:1);o>=r&&o<=3&&this.safe(e,o,t,n,!0)&&this.startChange(e,o)}}laneClearAhead(e,t,n,s,r){for(let o of[...n,s]){if(o===e)continue;let a=o.s-e.s;if(a>-10&&a<r&&zo(o,t))return!1}return!0}safe(e,t,n,s,r=!1){for(let o of[...n,s]){if(o===e||!zo(o,t)&&!(o.change&&o.change.to===t))continue;let a=o.s-e.s,l=(o.len+e.len)/2;if(a>=0){if(a-l<Math.max(8,e.speed*(r?.3:.6)))return!1}else{let c=-a-l,h=o.speed-e.speed,u=o.isPlayer?r?6:14:8;if(c<u+Math.max(0,h)*(r?.6:2.2))return!1}}return!0}startChange(e,t){e.change={from:e.lane,to:t,t:0,delay:e.careless?Se(.15,.5):Se(.9,1.6),dur:e.truck?Se(4,5.5):Se(2.4,3.6)}}megafon(e){let t=0,n={s:e.s,x:e.x,speed:e.speed,len:e.len,w:e.w,isPlayer:!0};for(let s of this.cars){let r=s.s-e.s;if(r>0&&r<160&&Math.abs(s.x-e.x)<2.6&&!s.change&&s.behavior!=="elefant"){let a=[s.lane+1,s.lane-1].filter(l=>l>=(s.truck?2:0)&&l<=3&&this.safe(s,l,this.cars,n,!0)).sort((l,c)=>Math.abs(Ne.laneCenter(c)-e.x)-Math.abs(Ne.laneCenter(l)-e.x))[0];a!==void 0&&(s.change={from:s.lane,to:a,t:0,delay:.3,dur:1.8},s.decideIn=10+Se(0,5),t++)}}return t}elefantenrennen(e){let t=e+420;for(let r of this.cars)r.s>t-60&&r.s<t+60&&r.lane>=2&&(this.releaseVehicle(r.v),r.s=-1e9);this.cars=this.cars.filter(r=>r.s>-1e8);let n=this.spawn(t,3,{kind:"lkw",speed:84*Zi,behavior:"elefant"}),s=this.spawn(t+6,2,{kind:"lkw",speed:84.6*Zi,behavior:"elefant"});return setTimeout(()=>{s&&(s.behavior="normal")},26e3),[n,s]}police(e,t){this.policeText=t;let n=this.leftOpen?1:0,s=this.spawn(e-170,n,{kind:"polizei",speed:185*Zi,behavior:"polizei"});return s.v0=185*Zi,s.passed=!0,s}nearby(e,t=130){let n=[];for(let s of this.cars){let r=s.s-e.s;r>-25&&r<t&&n.push({dx:s.x,ds:r,len:s.len,w:s.w,kind:s.kind,brake:s.brake})}return n}};function zo(i,e){let t=Ne.laneCenter(e),n=Math.max(i.x-i.w/2,t-1.875);return Math.min(i.x+i.w/2,t+1.875)-n>.35}function Zp(i){let e=Math.random();return i?e<.08?0:e<.32?1:e<.62?2:3:e<.17?0:e<.4?1:e<.66?2:3}var ui={skin:14263415,skinDark:13208418,black:1315862,shirt:1447448,hair:3811356,beard:2825492,pants:3421498,shoe:986896,white:16250352,mouth:7023141},Ks={shoulder:[.165,.53,0],upperArm:.15,foreArm:.14,head:.745},Ku=null;function Ki(i,e,{sheen:t=.9,rough:n=.95,side:s=yi}={}){Ku||(Ku=pl(11));let r=new li({color:i,roughness:n,metalness:0,sheen:t,sheenRoughness:.55,sheenColor:new Ue(i).lerp(new Ue(16777215),.35),bumpMap:Ku,bumpScale:.6,side:s});return e?bi(r):r}function Ys(i,e,t={}){let n=new pt({color:i,roughness:.4,metalness:0,...t});return e?bi(n):n}function Zs(i,e,t,n=10){return new D(new Os(i,e,6,n),t)}function bn(i,e,t=18,n=14){return new D(new yt(i,t,n),e)}var Ll=(i,e,t)=>{let n=Math.min(1,Math.max(0,(t-i)/(e-i)));return n*n*(3-2*n)},kt=()=>new A,Fn={d:kt(),u:kt(),v:kt(),e:kt(),u1:kt(),u2:kt(),x:kt(),y:kt(),z:kt(),down:new A(0,-1,0),m:new je,q:new Gt};function V_(i,e,t,n){let s=i.position,r=Fn.d.subVectors(e,s),o=r.length(),a=Ks.upperArm,l=Ks.foreArm,c=a+l-.003,h=Math.abs(a-l)+.03;o<1e-6&&(r.set(0,-1,0),o=1);let u=Fn.u.copy(r).divideScalar(o);o=Math.min(c,Math.max(h,o));let d=Fn.v.copy(t).addScaledVector(u,-t.dot(u));d.lengthSq()<1e-8&&d.set(0,-1,0).addScaledVector(u,-u.y),d.normalize();let f=Math.min(1,Math.max(-1,(a*a+o*o-l*l)/(2*a*o))),m=Math.sqrt(1-f*f),v=Fn.u1.copy(u).multiplyScalar(f).addScaledVector(d,m),g=Fn.e.copy(s).addScaledVector(v,a),p=Fn.u2.copy(s).addScaledVector(u,o).sub(g).normalize();i.quaternion.setFromUnitVectors(Fn.down,v);let y=Fn.y.copy(p).negate(),_=Fn.z.copy(n).addScaledVector(y,-n.dot(y));_.lengthSq()<1e-8&&_.set(0,0,1).addScaledVector(y,-y.z),_.normalize();let x=Fn.x.crossVectors(y,_);Fn.m.makeBasis(x,y,_),Fn.q.setFromRotationMatrix(Fn.m),i.userData.elbow.quaternion.copy(i.quaternion).invert().multiply(Fn.q)}var W_=new A(.292,.765,.04),X_=new A(.255,.6,.13),q_=new A(.55,-.1,.83).normalize(),Y_=new A(1,-.45,-.1).normalize(),$r={p:kt(),n:kt(),c:kt(),pole:kt(),palm:kt(),a:kt(),b:kt()};function Z_(i,e,{wave:t=0,steer:n=0,t:s=0}={},r={pos:kt(),pole:kt(),palm:kt()}){let o=(i>0?Math.PI-.3:.3)+n*.5,a=Math.cos(o),l=Math.sin(o),c=e.r+.012;if(r.pos.set(a*c,l*c,.026).applyMatrix4(e.m),$r.n.set(-a,-l,-.45).transformDirection(e.m),r.palm.copy($r.n),r.pole.set(i*.55,-1,-.15).normalize(),i>0&&t>0){let h=t,u=(1-h)*(1-h),d=2*(1-h)*h,f=h*h;$r.a.copy(r.pos).multiplyScalar(u).addScaledVector(X_,d).addScaledVector(W_,f);let m=Ll(.7,1,h);$r.a.x+=Math.sin(s*9)*.026*m,$r.a.y+=Math.abs(Math.cos(s*9))*.008*m,r.pos.copy($r.a),r.pole.lerp(Y_,Ll(.15,.85,h)).normalize(),r.palm.lerp(q_,Ll(.2,.9,h)).normalize()}return r}function Kp({curved:i=!0}={}){let e=new we;e.name="MiniAdam";let t=Ki(ui.skin,i),n=Ki(ui.skinDark,i),s=Ki(ui.shirt,i,{sheen:.6}),r=Ki(ui.shirt,i,{sheen:.6,side:dt}),o=Ki(ui.black,i,{sheen:.5,side:dt}),a=Ki(ui.hair,i,{sheen:1,rough:1}),l=Ki(ui.beard,i,{sheen:1,rough:1}),c=Ki(ui.pants,i,{sheen:.7}),h=Ki(ui.shoe,i,{sheen:.4}),u=Ys(ui.white,i,{roughness:.25}),d=Ys(657930,i,{roughness:.15}),f=Ys(ui.mouth,i,{roughness:.6}),m=Ys(1710618,i,{roughness:.35,metalness:.4}),v=Ys(3947580,i,{roughness:.8,metalness:.3}),g=Xr({w:256,h:256}),p=new pt({map:g,transparent:!0,roughness:.9,alphaTest:.2,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1});i&&bi(p);let y=new we;y.name="body",e.add(y);let _=Zs(.15,.12,s,14);_.scale.set(1.08,1,.86),_.position.y=.43,y.add(_);let x=new D(new We(.152,.152,.16,20,1,!0,-.62,1.24),p);x.scale.set(1.08,1,.86),x.position.set(0,.45,0),y.add(x);let I=new We(.058,.066,.085,16,1,!0),S=new we,T=new we,[C,E]=Ks.shoulder;S.position.set(-C,E,0),T.position.set(C,E,0),y.add(S,T);for(let[B,ne]of[[S,-1],[T,1]]){let pe=bn(.063,s,16,12);B.add(pe);let ye=new D(I,r);ye.position.y=-.045,B.add(ye);let Ye=Zs(.041,.1,t);Ye.position.y=-.085,B.add(Ye);let ue=new we;ue.position.y=-Ks.upperArm,B.add(ue);let Ce=Zs(.039,.085,t);Ce.position.y=-.062,ue.add(Ce);let Ve=new we;Ve.position.y=-Ks.foreArm,ue.add(Ve);let $e=bn(.05,t);$e.scale.set(1,1.12,.64),Ve.add($e);let Le=Zs(.017,.026,t,8);Le.position.set(ne*.042,.006,.012),Le.rotation.z=-ne*.75,Ve.add(Le),B.userData.elbow=ue,B.userData.hand=Ve}let M=new we,P=new D(new We(.016,.012,.13,12),m);P.position.y=-.02;let k=bn(.03,v,14,10);k.position.y=.065,M.add(P,k),M.position.set(0,.02,.035),T.userData.hand.add(M);let H=new we;y.add(H);let F=new we,W=new we;F.position.set(-.075,.29,0),W.position.set(.075,.29,0),H.add(F,W);for(let B of[F,W]){let ne=Zs(.072,.13,c);ne.position.y=-.11,B.add(ne);let pe=bn(.075,h);pe.scale.set(1,.7,1.35),pe.position.set(0,-.245,.03),B.add(pe),B.userData.shoe=pe,B.userData.thigh=ne}let N=new we;N.position.y=Ks.head,y.add(N);let Z=bn(.16,t,28,22);Z.scale.set(1,1,.95),N.add(Z);for(let B of[-1,1]){let ne=bn(.035,t);ne.scale.set(.6,1,.8),ne.position.set(B*.158,-.005,-.01),N.add(ne)}let V=[[0,0,-.13,.085],[-.08,-.02,-.12,.075],[.08,-.02,-.12,.075],[-.13,.01,-.06,.07],[.13,.01,-.06,.07],[-.145,-.04,0,.055],[.145,-.04,0,.055],[-.05,-.07,-.13,.07],[.05,-.07,-.13,.07],[0,.03,-.11,.08]];for(let[B,ne,pe,ye]of V){let Ye=bn(ye,a,12,10);Ye.position.set(B,ne,pe),Ye.scale.set(1,.9,.9),N.add(Ye)}let ee=new D(new yt(.168,26,16,Math.PI/2-1.35,2.7,Math.PI*.55,Math.PI*.38),l);N.add(ee);let he=bn(.075,l);he.scale.set(1.25,.8,.9),he.position.set(0,-.125,.08),N.add(he);for(let B of[-1,1]){let ne=bn(.05,l,10,8);ne.position.set(B*.13,-.05,.05),ne.scale.set(.8,1.4,1),N.add(ne)}let xe=new we;xe.position.set(0,-.062,.151),N.add(xe);for(let B of[-1,1]){let ne=Zs(.02,.04,l,8);ne.rotation.z=Math.PI/2+B*.32,ne.position.set(B*.03,-.006,-.004),xe.add(ne)}let ke=bn(.026,f,12,8);ke.scale.set(1.3,.55,.5),ke.position.set(0,-.095,.146),N.add(ke);let Je=bn(.043,n,16,12);Je.scale.set(1.05,.95,.9),Je.position.set(0,-.016,.162),N.add(Je);let K=new we;N.add(K);for(let B of[-1,1]){let ne=B*.057,pe=.026,ye=.141,Ye=bn(.036,u,18,14);Ye.scale.set(.86,1.12,.48),Ye.position.set(ne,pe,ye);let ue=bn(.0165,d,14,10);ue.scale.set(1,1.15,.42),ue.position.set(ne-B*.002,pe-.002,ye+.0125);let Ce=bn(.0048,u,8,6);Ce.position.set(ne-B*.002+.006,pe+.006,ye+.0185),K.add(Ye,ue,Ce)}for(let B of[-1,1]){let ne=Zs(.009,.034,a,6);ne.rotation.z=Math.PI/2+B*.2,ne.position.set(B*.058,.077,.133),N.add(ne)}let oe=.166,ge=new we;ge.position.y=.093,ge.rotation.x=-.14,N.add(ge);let fe=new D(new yt(oe,28,14,0,Math.PI*2,0,Math.PI/2),o);fe.scale.set(1,.74,1),ge.add(fe);let Te=new D(new We(oe+.001,oe+.003,.03,28,1,!0),o);Te.position.y=-.012,ge.add(Te);let He=.13,Xe=B=>Math.sqrt(oe*oe-B*B)-.012,Qe=new mn;Qe.moveTo(-He,Xe(-He)),Qe.quadraticCurveTo(-He-.012,oe+.07,0,oe+.088),Qe.quadraticCurveTo(He+.012,oe+.07,He,Xe(He));for(let B=1;B<12;B++){let ne=He-2*He*B/12;Qe.lineTo(ne,Xe(ne))}Qe.lineTo(-He,Xe(-He));let Q=new Kn(Qe,{depth:.008,bevelEnabled:!0,bevelThickness:.004,bevelSize:.005,bevelSegments:2,curveSegments:10});Q.deleteAttribute("uv");let me=new D(Q,o);me.rotation.x=Math.PI/2-.1,me.position.set(0,-.022,0),ge.add(me);let L=bn(.016,o,10,8);L.scale.set(1,.55,1),L.position.y=oe*.74,ge.add(L);let Be=new D(new yt(oe+.0016,24,8,Math.PI/2-.45,.9,.62,.86),p);Be.scale.set(1,.74,1),ge.add(Be);let se=Ys(14155551,i,{roughness:.6,emissive:3820032,emissiveIntensity:.25}),ie=Ys(14211288,i,{roughness:.2,metalness:.6}),ae=new we,Pe=new D(new We(.168,.165,.2,18,1,!0),se);Pe.scale.set(1.08,1,.88),Pe.position.y=.43,ae.add(Pe);let Me=new D(new We(.118,.168,.075,18,1,!0),se);Me.scale.set(1.08,1,.88),Me.position.y=.567,ae.add(Me);for(let B of[-1,1]){let ne=bn(.071,se,18,12);ne.position.set(B*C,E+.002,0),ae.add(ne)}for(let B of[.38,.47]){let ne=new D(new We(.17,.17,.022,18,1,!0),ie);ne.scale.set(1.08,1,.88),ne.position.y=B,ae.add(ne)}ae.visible=!1,y.add(ae),e.traverse(B=>{B.isMesh&&(B.castShadow=!0,B.receiveShadow=!1)});let R={m:new je().makeRotationX(.35).setPosition(0,.44,.22),r:.17},b=[{pos:kt(),pole:kt(),palm:kt()},{pos:kt(),pole:kt(),palm:kt()}],G=B=>{for(let[ne,pe,ye]of[[S,-1,b[0]],[T,1,b[1]]])Z_(pe,R,B,ye),V_(ne,ye.pos,ye.pole,ye.palm),ne.userData.hand.rotation.set(0,0,pe>0?Math.sin($(B)-.6)*.3*Ll(.7,1,B.wave||0):0)},$=B=>(B.t||0)*9,te={root:e,body:y,head:N,armL:S,armR:T,legL:F,legR:W,mic:M,vest:ae,eyes:K,pose:"stand",setVest(B){ae.visible=!!B},setWheel(B,ne=.17){R.m.copy(B),R.r=ne,te.pose==="drive"&&G({})},setPose(B){te.pose=B,M.visible=B!=="drive",B==="drive"?(F.rotation.x=-1.45,W.rotation.x=-1.45,F.position.y=W.position.y=.3,S.userData.hand.rotation.set(0,0,0),T.userData.hand.rotation.set(0,0,0),G({})):(F.rotation.x=W.rotation.x=0,S.rotation.set(0,0,.18),S.userData.elbow.rotation.set(-.2,0,0),S.userData.hand.rotation.set(0,0,0),T.rotation.set(-.9,.3,-.3),T.userData.elbow.rotation.set(-1.5,0,0),T.userData.hand.rotation.set(0,0,0))},animate(B,ne={}){let pe=ne.wave||0,ye=ne.steer||0;if(N.rotation.y=(ne.look||0)*.6+Math.sin(B*.7)*.05,N.rotation.z=Math.sin(B*1.3)*.03-ye*.12,N.position.y=Ks.head+Math.sin(B*2.2)*.004,te.pose==="drive")G({steer:ye,wave:pe,t:B});else{S.rotation.z=.18+Math.sin(B*1.1)*.03,pe>0&&S.rotation.set(-.3*pe,0,.18+2.4*pe+Math.sin(B*9)*.3*pe);let Ye=ne.talk||0;T.rotation.x=-.9+Math.sin(B*6)*.04*Ye}}};return te.setPose("stand"),te}var Go=new A;function Jn(i,e,t,n,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;Go.copy(e),Go[n]=0,Go.normalize();let c=.5*o/(o+a),h=1-Go.angleTo(i)/l;return Math.sign(Go[t])===1?h*c:a/(o+a)+c+c*(1-h)}var ys=class extends Fe{constructor(e=1,t=1,n=1,s=2,r=.1){if(s=s*2+1,r=Math.min(e/2,t/2,n/2,r),super(1,1,1,s,s,s),s===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let a=new A,l=new A,c=new A(e,t,n).divideScalar(2).subScalar(r),h=this.attributes.position.array,u=this.attributes.normal.array,d=this.attributes.uv.array,f=h.length/6,m=new A,v=.5/s;for(let g=0,p=0;g<h.length;g+=3,p+=2)switch(a.fromArray(h,g),l.copy(a),l.x-=Math.sign(l.x)*v,l.y-=Math.sign(l.y)*v,l.z-=Math.sign(l.z)*v,l.normalize(),h[g+0]=c.x*Math.sign(a.x)+l.x*r,h[g+1]=c.y*Math.sign(a.y)+l.y*r,h[g+2]=c.z*Math.sign(a.z)+l.z*r,u[g+0]=l.x,u[g+1]=l.y,u[g+2]=l.z,Math.floor(g/f)){case 0:m.set(1,0,0),d[p+0]=Jn(m,l,"z","y",r,n),d[p+1]=1-Jn(m,l,"y","z",r,t);break;case 1:m.set(-1,0,0),d[p+0]=1-Jn(m,l,"z","y",r,n),d[p+1]=1-Jn(m,l,"y","z",r,t);break;case 2:m.set(0,1,0),d[p+0]=1-Jn(m,l,"x","z",r,e),d[p+1]=Jn(m,l,"z","x",r,n);break;case 3:m.set(0,-1,0),d[p+0]=1-Jn(m,l,"x","z",r,e),d[p+1]=1-Jn(m,l,"z","x",r,n);break;case 4:m.set(0,0,1),d[p+0]=1-Jn(m,l,"x","y",r,e),d[p+1]=1-Jn(m,l,"y","x",r,t);break;case 5:m.set(0,0,-1),d[p+0]=Jn(m,l,"x","y",r,e),d[p+1]=1-Jn(m,l,"y","x",r,t);break}}};var jn={length:4.69,width:1.85,height:1.443,wheelR:.335,frontAxleZ:.84-4.69/2,rearAxleZ:3.715-4.69/2,trackHalf:.79,plate:"F-LV 333"},Gb=new A(-.37,1.2,.27),Qr=jn.length,Jp=[.84,3.715],jp=In([[0,.5],[.03,.56],[.1,.625],[.2,.675],[.45,.73],[.8,.79],[1.2,.86],[1.52,.92],[2.4,.965],[3.3,.995],[3.95,1.03],[4.25,1.05],[4.55,1.055],[4.64,1.04],[4.69,.95]]),Qp=In([[0,.31],[.06,.22],[.15,.18],[.5,.17],[4.3,.18],[4.6,.25],[4.69,.42]]),K_=yl(Qp,Jp,.405,.335),$_=In([[0,.6],[.08,.77],[.25,.86],[.6,.905],[1.2,.925],[3.6,.925],[4.3,.9],[4.6,.845],[4.69,.77]]),J_=In([[1.48,.93],[1.7,1.04],[2,1.2],[2.25,1.35],[2.5,1.415],[2.8,1.44],[3.1,1.44],[3.4,1.415],[3.7,1.3],[3.95,1.17],[4.15,1.075],[4.24,1.045]]),j_=In([[1.48,.8],[1.8,.84],[2.3,.8],[2.9,.74],[3.5,.7],[4,.63],[4.24,.57]]);function _t(i){return i-Qr/2}var Qu={w:$_,b:Qp,t:jp,tw:.9,bw:.94,n:4.6,L:Qr,bx:_l(K_,.48,.7)},Q_=3.2,eM=.76,e0={w:j_,b:i=>jp(i)-.05,t:J_,tw:eM,bw:1,n:Q_,L:Qr},Ju=(i,e,t)=>qi(Qu,i,e,t),tM={...Qu,bx:null};function nM(i,e,t=.415,n=.345){let s=new A,r=[],o=null;for(let l=0;l<=96;l++){qi(tM,i,-Math.PI/2+l/96*(Math.PI/2),s);let c=[s.x-.005,s.y+.003];if(o){if(o[0]<t&&c[0]>=t){let h=(t-o[0])/(c[0]-o[0]);r.push([t,o[1]+h*(c[1]-o[1])])}if(c[1]>=n){let h=(n-o[1])/(c[1]-o[1]);r.push([o[0]+h*(c[0]-o[0]),n]);break}c[0]>=t&&r.push(c)}o=c}r.push([t,n]);let a=new Wi(new mn(r.map(([l,c])=>new le(e*l,c))));return a.translate(0,0,_t(i)),a}var ju=(i,e,t)=>qi(e0,i,e,t),Kt=(i,e,t)=>i+(e-i)*t,jr=.34,Jr=(i,e)=>i>0?e:Math.PI-e,iM=[[.05,1.24],[.085,1],[.13,.86],[.24,.8],[.4,.76]],sM=[[.03,1.2],[.025,.86],[.05,.54],[.16,.55],[.4,.7]];function $p(i,e){let t=Math.min(i.length-1.000001,Math.max(0,e*(i.length-1))),n=Math.floor(t),s=t-n,r=i[Math.max(0,n-1)],o=i[n],a=i[n+1],l=i[Math.min(i.length-1,n+2)],c=h=>.5*(2*o[h]+(-r[h]+a[h])*s+(2*r[h]-5*o[h]+4*a[h]-l[h])*s*s+(-r[h]+3*o[h]-3*a[h]+l[h])*s*s*s);return[c(0),c(1)]}function rM(i,e){let t=$p(iM,e),n=$p(sM,e);return[Kt(n[0],t[0],i),Kt(n[1],t[1],i)]}function oM(i,e){let t=0,n=Math.PI/2,s=new A,r=Math.abs(e);for(let o=0;o<30;o++){let a=(t+n)/2;Ju(i,a,s),s.x>r?t=a:n=a}return Ju(i,(t+n)/2,s).y}function $u(i,e){let t=jr,n=Math.PI/2,s=new A,r=Math.abs(e);for(let o=0;o<30;o++){let a=(t+n)/2;ju(i,a,s),s.x>r?t=a:n=a}return ju(i,(t+n)/2,s).y}function t0(){let i=new we;i.name="Tesla";let e=ce.phys({color:395016,metalness:.5,roughness:.34,clearcoat:1,clearcoatRoughness:.12,envMapIntensity:1.25}),t=ce.phys({color:329740,metalness:.25,roughness:.04,transparent:!0,opacity:.74,envMapIntensity:2.6,depthWrite:!1}),n=ce.std({color:723724,roughness:.8,side:dt}),s=ce.std({color:1316118,roughness:.55}),r=ce.phys({color:197380,metalness:.3,roughness:.12,clearcoat:1,clearcoatRoughness:.08,side:dt}),o=ce.std({color:13162214,emissive:15397887,emissiveIntensity:1.1,roughness:.15,metalness:.2,side:dt}),a=ce.phys({color:11450047,metalness:1,roughness:.28,clearcoat:1,clearcoatRoughness:.04,side:dt}),l=ce.phys({color:790550,metalness:.5,roughness:.1,clearcoat:1,side:dt}),c=ce.std({color:3802373,emissive:16711680,emissiveIntensity:.2,roughness:.25,side:dt}),h=ce.std({color:1776414,roughness:.85}),u=ce.basic({color:8365256}),d=Si({u0:0,u1:Qr,...Qu,segs:150,ring:44,H:1.5,capDome:.8}),f=new D(d,e);f.castShadow=!0,i.add(f);let m=Si({u0:1.48,u1:4.24,...e0,segs:70,ring:32,H:1.5}),v=new D(m,t);v.renderOrder=2,i.add(v);let g=[],p=(j,ve)=>Xs(ju,j,ve);for(let j of[-1,1])g.push(p((ve,be)=>[Kt(Kt(1.5,2.25,be),Kt(1.6,2.36,be),ve),Jr(j,Kt(-.74,jr+.04,be))],{ns:2,nt:18,lift:.005})),g.push(p((ve,be)=>[Kt(2.76,2.88,ve),Jr(j,Kt(-.74,jr+.04,be))],{ns:2,nt:14,lift:.005})),g.push(p((ve,be)=>[Kt(Kt(4,3.62,be),4.24,ve),Jr(j,Kt(-.74,jr+.04,be))],{ns:8,nt:14,lift:.005})),g.push(p((ve,be)=>[Kt(1.52,4.1,be),Jr(j,Kt(-.86,-.66,ve))],{ns:2,nt:30,lift:.004}));g.push(p((j,ve)=>[Kt(2.3,4.24,ve),Kt(jr,Math.PI-jr,j)],{ns:18,nt:34,lift:.004}));let y=new D(It(g),r);y.castShadow=!0,i.add(y);let _=[];for(let j of Jp)for(let ve of[-1,1]){let be=new We(.405,.405,.5,22,1,!0,0,Math.PI);be.rotateZ(Math.PI/2),be.translate(ve*.665,.335,_t(j));let U=new Un(.405,22,0,Math.PI);U.rotateY(Math.PI/2),U.translate(ve*.415,.335,_t(j)),_.push(be,U);for(let de of[-1,1])_.push(nM(j+de*(.405-.012),ve))}i.add(new D(It(_.map(j=>j.index?j.toNonIndexed():j)),n));let x=(j,ve,be)=>{let U=new mn;U.moveTo(-j/2+be,-ve/2),U.lineTo(j/2-be,-ve/2),U.quadraticCurveTo(j/2,-ve/2,j/2,-ve/2+be),U.lineTo(j/2,ve/2-be),U.quadraticCurveTo(j/2,ve/2,j/2-be,ve/2),U.lineTo(-j/2+be,ve/2),U.quadraticCurveTo(-j/2,ve/2,-j/2,ve/2-be),U.lineTo(-j/2,-ve/2+be),U.quadraticCurveTo(-j/2,-ve/2,-j/2+be,-ve/2);let de=new Wi(U,6);return de.deleteAttribute("uv"),de},I=x(.8,.03,.015);I.rotateY(Math.PI),I.translate(0,.333,_t(0)-.003);let S=x(1.08,.07,.03);S.translate(0,.475,_t(Qr)+.003),i.add(new D(It([I,S]),s));let T=(j,ve)=>Xs(Ju,j,ve),C=[],E=[],M=[],P=[];for(let j of[-1,1]){let ve=(be,U)=>{let[de,Y]=rM(be,U);return[de,Jr(j,Y)]};C.push(T(ve,{ns:8,nt:24,lift:.004}));for(let[be,U]of[[.34,.1],[.58,.11]])E.push(T((de,Y)=>ve(.4+.24*de*Math.cos(Y*Math.PI*2),be+U*de*Math.sin(Y*Math.PI*2)),{ns:3,nt:18,lift:.006}));M.push(T((be,U)=>ve(Kt(.8,.94,be),Kt(.08,.95,U)),{ns:2,nt:22,lift:.007})),P.push(T((be,U)=>[Kt(4.4,4.672,U),Jr(j,Kt(Kt(.5,.36,U),Kt(.78,1,U),be))],{ns:6,nt:14,lift:.006}))}i.add(new D(It(C),a)),i.add(new D(It(E),l)),i.add(new D(It(M),o));let k=new D(It(P),c);i.add(k);let H=ce.std({map:fl(jn.plate),roughness:.5}),F=new et(.52,.112),W=new D(F,H);W.position.set(0,.415,_t(0)-.012),W.rotation.y=Math.PI;let N=new D(F,H);N.position.set(0,.62,_t(Qr)+.004),i.add(W,N);let Z=new et(.34,.34,8,8),V=Z.attributes.position;for(let j=0;j<V.count;j++){let ve=V.getX(j),be=4.44-V.getY(j);V.setXYZ(j,ve,oM(be,ve)+.003,_t(be))}Z.computeVertexNormals();let ee=new D(Z,ce.std({map:Xr({w:256,h:256}),transparent:!0,roughness:.4,alphaTest:.3,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));i.add(ee);let he=[],xe=[],ke=_t(1.8);for(let j of[-1,1]){let ve=j*1,be=1,U=Ml(j);U.translate(ve,be,ke),he.push(U),he.push(Rt(.1,.032,.045,j*.86,.968,ke-.045,0,0,j*.22));let de=new Wi(Fo(.9,j),10);de.deleteAttribute("uv"),de.translate(ve,be,ke+.002),xe.push(de)}let Je=It(he.map(j=>j.index?j.toNonIndexed():j));i.add(new D(Je,e)),i.add(new D(It(xe),ce.std({color:10465988,metalness:1,roughness:.06})));let K=Dp(jn.wheelR,.235,24),oe=ce.std({color:1118481,roughness:.9}),ge=ce.std({map:Sp(),roughness:.45,metalness:.5}),fe=[];for(let j of[jn.frontAxleZ,jn.rearAxleZ])for(let ve of[-1,1]){let be=new we;be.rotation.order="YXZ",be.position.set(ve*jn.trackHalf,jn.wheelR,j);let U=new D(K,oe);U.castShadow=!0;let de=new D(Oo(jn.wheelR*.7,ve*.119,0,0,ve),ge);be.add(U,de),i.add(be),fe.push(be)}let Te=(j,ve,be,U,de,Y,re=0,Ie=.03)=>{let Re=new ys(j,ve,be,3,Math.min(Ie,j/2-.001,ve/2-.001,be/2-.001));return re&&Re.rotateX(re),Re.translate(U,de,Y),Re},He=[];He.push(Te(1.3,.18,.42,0,.79,_t(1.74),0,.05));for(let j of[-1,1])He.push(Te(.5,.12,.5,j*.37,.5,_t(2.72),0,.04)),He.push(Te(.5,.64,.12,j*.37,.86,_t(3),-.2,.05)),He.push(Te(.27,.19,.1,j*.37,1.25,_t(3.07),-.1,.045));He.push(Te(1.36,.16,.5,0,.5,_t(3.62),0,.04)),He.push(Te(1.12,.55,.12,0,.82,_t(3.92),-.18,.05)),He.push(Te(.22,.2,.8,0,.55,_t(2.6),0,.04));let Xe=new D(It(He),h);i.add(Xe);let Qe=new D(new et(.33,.2),u);Qe.position.set(0,1,_t(1.93)),Qe.rotation.x=-.2,i.add(Qe);let Q=new D(new Nn(.17,.022,10,28),h);Q.position.set(-.37,.84,_t(2.4)),Q.rotation.x=-.35,i.add(Q);let me=new A(0,0,1).applyEuler(Q.rotation),L=new D(new We(.055,.06,.04,18),h);L.quaternion.setFromUnitVectors(new A(0,1,0),me),L.position.copy(Q.position).addScaledVector(me,-.01);let Be=new D(new We(.03,.036,.46,12),h);Be.quaternion.copy(L.quaternion),Be.position.copy(Q.position).addScaledVector(me,-.25),i.add(L,Be);let se=Kp({curved:!0});se.setPose("drive"),se.root.position.set(-.37,.4,_t(2.62)),se.root.rotation.y=Math.PI,i.add(se.root),se.root.updateMatrix(),Q.updateMatrix(),se.setWheel(se.root.matrix.clone().invert().multiply(Q.matrix),.17);let ie=new D(new We(.2,.22,.07,18),ce.phys({color:11538987,roughness:.9,sheen:1,sheenColor:new Ue(16737920)}));ie.position.set(-.37,.59,_t(2.72)),i.add(ie);let ae=new D(new We(.18,.2,.07,18),ce.phys({color:1920928,roughness:.9,sheen:1,sheenColor:new Ue(7842047)}));ae.position.set(-.37,.655,_t(2.71)),i.add(ae);let Pe=new sl(16773597,0,2.2,.62,.6,1.5);Pe.position.set(-.37,1.24,_t(2.24)),Pe.target.position.set(-.37,.96,_t(2.66)),i.add(Pe,Pe.target);let Me=ce.basic({color:0,map:gl(),transparent:!0,opacity:.55,depthWrite:!1}),R=new D(new et(2.2,5.15),Me);R.rotation.x=-Math.PI/2,R.position.set(0,.02,0),R.renderOrder=-1,i.add(R);let b=[],G=2.5,$=$u(G,0),te=new We(.05,.055,.012,20);te.translate(0,$+.004,_t(G)),b.push(te);let B=new We(.012,.016,.03,10);B.translate(0,$+.024,_t(G)),b.push(B),b.push(Te(.12,.068,.1,0,$+.07,_t(G),0,.012));let ne=3.45;for(let j=0;j<3;j++){let ve=-.18+j*.18,be=$u(ne,ve),U=new We(.03,.034,.014,16);U.translate(ve,be+.005,_t(ne)),b.push(U);let de=new We(.005,.009,.17,8);de.translate(0,.085,0),de.rotateX(.22),de.translate(ve,be+.01,_t(ne)),b.push(de);let Y=new yt(.009,8,6);Y.translate(0,.17,0),Y.rotateX(.22),Y.translate(ve,be+.01,_t(ne)),b.push(Y)}i.add(new D(It(b.map(j=>j.index?j.toNonIndexed():j)),s));let pe=new D(new Un(.025,14),ce.std({color:2241348,metalness:.9,roughness:.1}));pe.position.set(0,$+.07,_t(G)-.051),pe.rotation.y=Math.PI,i.add(pe);let ye=new D(new yt(.008,8,6),ce.basic({color:16720418}));ye.position.set(.04,$+.092,_t(G)-.048),i.add(ye);let Ye=new we,ue=ce.std({color:15921906,roughness:.5}),Ce=new D(new We(.29,.27,.035,28),ue);Ce.rotation.x=-.35,Ce.position.y=.16;let Ve=new D(new We(.025,.03,.16,8),ue);Ve.position.y=.08,Ye.add(Ce,Ve),Ye.position.set(0,$u(3.05,0),_t(3.05)),Ye.visible=!1,i.add(Ye),i.traverse(j=>{j.isMesh&&j!==v&&j!==R&&(j.castShadow=!0)});let $e=0,Le=!1;return{root:i,adam:se,glass:t,wheels:fe,cabinLight:Pe,recLed:ye,setStarlink(j){Ye.visible=!!j},setGroundShade(j){Me.opacity=.55+.3*Math.min(1,Math.max(0,j))},setVest(j){se.setVest(j)},setBrake(j){j!==Le&&(Le=j,c.emissiveIntensity=j?.95:.2)},update(j,ve,be,U){$e-=ve*j/jn.wheelR;for(let de=0;de<fe.length;de++)fe[de].rotation.x=$e,de<2&&(fe[de].rotation.y=-be*.35);ye.visible=Math.sin(U*4)>-.2}}}var un=256,Dl=class{constructor(){this.group=new we,this.group.name="NOMI",this.canvas=document.createElement("canvas"),this.canvas.width=un,this.canvas.height=un,this.ctx=this.canvas.getContext("2d"),this.tex=new Pt(this.canvas),this.tex.colorSpace=ht;let e=.066,t=new D(new We(.03,.042,.03,24),new pt({color:1381914,metalness:.6,roughness:.35}));t.position.y=.015,this.group.add(t),this.head=new we,this.head.position.y=.03+e*.92,this.group.add(this.head);let n=new D(new yt(e,40,28),new li({color:460810,metalness:.3,roughness:.18,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:1.6}));this.head.add(n);let s=.72,r=new yt(e*1.004,32,24,Math.PI/2-s,2*s,Math.PI/2-s,2*s),o=r.attributes.position,a=r.attributes.uv,l=e*Math.sin(s)*2;for(let h=0;h<o.count;h++)a.setXY(h,o.getX(h)/l+.5,o.getY(h)/l+.5);this.faceMat=new cn({map:this.tex,toneMapped:!1,transparent:!0});let c=new D(r,this.faceMat);this.head.add(c),this.ring=new D(new Nn(.036,.003,8,32),new cn({color:6737151,toneMapped:!1,transparent:!0,opacity:.6})),this.ring.rotation.x=Math.PI/2,this.ring.position.y=.031,this.group.add(this.ring),this.mood="idle",this.moodTimer=0,this.talk=0,this.talkTimer=0,this.yaw=0,this.targetYaw=0,this.lookX=0,this.lookTarget=0,this.blink=0,this.nextBlink=2,this.idleYaw=-.06,this.bounce=0,this.lastDraw=-1,this.draw(0)}setMood(e,t=2.5){this.mood=e,this.moodTimer=t,this.bounce=1}speak(e=2.5){this.talkTimer=Math.max(this.talkTimer,e),this.bounce=1}glance(e,t=1.5){this.lookTarget=Ke(e,-1,1),this.glanceTimer=t}update(e,t,n){this.moodTimer>0&&(this.moodTimer-=e,this.moodTimer<=0&&(this.mood="idle")),this.glanceTimer>0&&(this.glanceTimer-=e,this.glanceTimer<=0&&(this.lookTarget=0)),this.talkTimer=Math.max(0,this.talkTimer-e),this.talk=Hn(this.talk,this.talkTimer>0?1:0,8,e),this.targetYaw=this.talkTimer>0?n:this.idleYaw+this.lookTarget*.7+Math.sin(t*.37)*.06,this.yaw=Hn(this.yaw,this.targetYaw,5,e),this.lookX=Hn(this.lookX,this.talkTimer>0?0:this.lookTarget,6,e),this.bounce=Math.max(0,this.bounce-e*2.2),this.head.rotation.y=this.yaw,this.head.rotation.x=-.24+Math.sin(t*9)*.03*this.talk-Math.sin(this.bounce*Math.PI)*.12,this.head.position.y=.03+.066*.92+Math.sin(this.bounce*Math.PI*2)*.006,this.ring.material.opacity=.35+.4*this.talk+.15*Math.sin(t*2),this.nextBlink-=e,this.nextBlink<=0&&(this.blink=1,this.nextBlink=2.5+Math.random()*4),this.blink=Math.max(0,this.blink-e*7),t-this.lastDraw>1/30&&(this.lastDraw=t,this.draw(t),this.tex.needsUpdate=!0)}draw(e){let t=this.ctx;t.clearRect(0,0,un,un);let n=t.createRadialGradient(un*.42,un*.36,10,un/2,un/2,un*.5);n.addColorStop(0,"#16202a"),n.addColorStop(.7,"#06080b"),n.addColorStop(1,"#030405"),t.fillStyle=n,t.beginPath(),t.arc(un/2,un/2,un*.49,0,Math.PI*2),t.fill();let s=this.mood,r=un/2+this.lookX*34,o=un/2+4+Math.sin(e*10)*4*this.talk,a=46;t.save(),t.shadowColor="rgba(160,220,255,0.9)",t.shadowBlur=14,t.strokeStyle="#ffffff",t.fillStyle="#ffffff",t.lineWidth=11,t.lineCap="round",t.lineJoin="round";let l=s==="idle"||s==="talk"?this.blink:0;for(let c of[-1,1]){let h=r+c*a;this.drawEye(t,s,h,o,c,l,e)}t.restore(),t.fillStyle="rgba(255,255,255,0.07)",t.beginPath(),t.ellipse(un*.38,un*.26,un*.22,un*.09,-.5,0,Math.PI*2),t.fill()}drawEye(e,t,n,s,r,o,a){let c=70;switch(t){case"happy":e.beginPath(),e.arc(n,s+12,24,Math.PI*1.1,Math.PI*1.9),e.stroke();return;case"love":this.heart(e,n,s,26+Math.sin(a*8)*3);return;case"dizzy":{e.beginPath();for(let h=0;h<Math.PI*5;h+=.2){let u=3+h*2.6,d=n+Math.cos(h+a*6*r)*u,f=s+Math.sin(h+a*6*r)*u;h===0?e.moveTo(d,f):e.lineTo(d,f)}e.lineWidth=7,e.stroke();return}case"surprised":e.beginPath(),e.arc(n,s,30,0,Math.PI*2),e.stroke(),e.beginPath(),e.arc(n,s,9,0,Math.PI*2),e.fill();return;case"sleep":e.beginPath(),e.moveTo(n-22,s+6),e.lineTo(n+22,s+6),e.stroke();return;case"worried":e.save(),e.translate(n,s),e.rotate(r*-.35),ed(e,-38/2,-c/2+8,38,c-16,18),e.stroke(),e.restore();return;case"think":r<0?(e.beginPath(),e.moveTo(n-20,s),e.lineTo(n+20,s),e.stroke()):(ed(e,n-38/2,s-c/2,38,c,18),e.stroke());return;case"wink":if(r>0){e.beginPath(),e.arc(n,s+12,22,Math.PI*1.1,Math.PI*1.9),e.stroke();return}break;default:break}c=Math.max(8,c*(1-o*.92)),ed(e,n-38/2,s-c/2,38,c,Math.min(18,c/2)),e.stroke()}heart(e,t,n,s){e.beginPath(),e.moveTo(t,n+s*.9),e.bezierCurveTo(t-s*1.4,n-s*.1,t-s*.6,n-s*1.1,t,n-s*.35),e.bezierCurveTo(t+s*.6,n-s*1.1,t+s*1.4,n-s*.1,t,n+s*.9),e.fill()}};function ed(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()}var En=1024,wn=640,jt=372,aM={bg:"#eceef0",panel:"#f4f5f6",text:"#1d1f22",sub:"#6b7078",lane:"#c3c7cc",car:"#9aa0a8",land:"#efece6",road:"#ffffff",roadCase:"#d4d0c8",hwy:"#ffd36a",hwyCase:"#d9a640",water:"#a9d3ec",park:"#cfe7c4",town:"#e2ddd5",route:"#2f6fe4",routeCase:"#1e4fb0",dock:"#1b1c1f",card:"rgba(32,34,38,0.92)"},lM={bg:"#141518",panel:"#1b1c20",text:"#f2f3f5",sub:"#9097a1",lane:"#4a4f57",car:"#6d737c",land:"#25272b",road:"#3a3d43",roadCase:"#2c2e33",hwy:"#8a6d2c",hwyCase:"#5d4a20",water:"#1d3550",park:"#233428",town:"#2f3136",route:"#4c8dff",routeCase:"#2a5fc0",dock:"#0c0d0f",card:"rgba(10,11,13,0.92)"};function Ln(i){return 900*ms(i/3200,5)+260*ms(i/950,8)}var kl=class{constructor(){this.canvas=document.createElement("canvas"),this.canvas.width=En,this.canvas.height=wn,this.ctx=this.canvas.getContext("2d"),this.texture=new Pt(this.canvas),this.texture.colorSpace=ht,this.texture.anisotropy=8,this.zoom=.16,this.acc=0,this.spin=0,this.featureCache=new Map}update(e,t){this.acc+=e,this.spin+=e,!(this.acc<1/15)&&(this.acc=0,this.draw(t),this.texture.needsUpdate=!0)}draw(e){let t=this.ctx,n=e.dark?lM:aM;this.T=n,t.save(),t.fillStyle=n.bg,t.fillRect(0,0,En,wn),this.drawMap(t,e,n),this.drawCarPanel(t,e,n),this.drawTopBar(t,e,n),this.drawDock(t,e,n),e.funkloch>0&&(t.fillStyle=`rgba(120,120,120,${.35*e.funkloch})`,t.fillRect(jt,0,En-jt,wn-64),t.fillStyle="#ffffff",t.font="bold 34px Arial, sans-serif",t.textAlign="center",t.fillText("Keine Verbindung",jt+(En-jt)/2,300),t.font="24px Arial, sans-serif",t.fillText("Mobilfunk wird neu geb\xFCndelt \u2026",jt+(En-jt)/2,340)),t.restore()}drawCarPanel(e,t,n){e.fillStyle=n.panel,e.fillRect(0,0,jt,wn),e.textBaseline="alphabetic",e.font='600 26px "Helvetica Neue", Arial, sans-serif',e.textAlign="left",["P","R","N","D"].forEach((x,I)=>{e.fillStyle=x==="D"?n.text:n.sub,e.font=(x==="D"?"700 28px":"500 24px")+' "Helvetica Neue", Arial, sans-serif',e.fillText(x,26+I*30,78)});let r=196,o=56;e.strokeStyle=n.text,e.lineWidth=3,Ot(e,r,o,60,26,5),e.stroke(),e.fillStyle=n.text,e.fillRect(r+60,o+8,5,10);let a=Ke(t.battery,0,100);e.fillStyle=a<15?"#e0301e":a<30?"#f0a020":"#34c759",e.fillRect(r+4,o+4,52*(a/100),18),e.fillStyle=n.text,e.font='600 26px "Helvetica Neue", Arial, sans-serif',e.fillText(Math.round(a)+" %",r+76,79),e.textAlign="center",e.font='600 104px "Helvetica Neue", Arial, sans-serif',e.fillStyle=n.text,e.fillText(String(Math.round(t.speedKmh)),jt/2,196),e.font='500 26px "Helvetica Neue", Arial, sans-serif',e.fillStyle=n.sub,e.fillText("km/h",jt/2,232),t.limit&&(e.save(),e.translate(jt-58,150),e.fillStyle="#fff",e.beginPath(),e.arc(0,0,34,0,Math.PI*2),e.fill(),e.strokeStyle="#d4141b",e.lineWidth=8,e.stroke(),e.fillStyle="#111",e.font="bold 30px Arial, sans-serif",e.textBaseline="middle",e.fillText(String(t.limit),0,2),e.restore());let l=262,c=wn-78,h=jt/2,u=l,d=(x,I)=>{let T=1/(1+(Ke(I,-18,120)+18)/26),C=it(u+6,c,T*1.05);return[h+x*30*T,C,T]},f=t.playerX,m=[-7.5,-3.75,0,3.75,7.5];if(t.leftLane>0){e.fillStyle=`rgba(62,120,255,${.25+.15*Math.sin(this.spin*6)})`,e.beginPath();let x=d(-7.5-f,-18);e.moveTo(x[0],x[1]);for(let I=-18;I<=120;I+=6)x=d(-7.5-f,I),e.lineTo(x[0],x[1]);for(let I=120;I>=-18;I-=6)x=d(-3.75-f,I),e.lineTo(x[0],x[1]);e.fill()}if(m.forEach((x,I)=>{e.strokeStyle=n.lane,e.lineWidth=I===0||I===4?4:3,e.setLineDash(I===0||I===4?[]:[14,14]),e.beginPath();for(let S=-18;S<=120;S+=4){let T=d(x-f,S);S===-18?e.moveTo(T[0],T[1]):e.lineTo(T[0],T[1])}e.stroke()}),e.setLineDash([]),t.leftLane<=0){let x=d(-5.625-f,40);e.font=`${Math.round(30*x[2]+12)}px "Segoe UI Emoji", "Noto Color Emoji", sans-serif`,e.textAlign="center",e.fillText("\u{1F512}",x[0],x[1])}let v=(t.cars||[]).filter(x=>x.ds>-18&&x.ds<120).sort((x,I)=>I.ds-x.ds);for(let x of v){let I=d(x.dx-f,x.ds-x.len/2),S=d(x.dx-f,x.ds+x.len/2),T=x.w*30*I[2];e.fillStyle=x.kind==="polizei"?"#5c7ed6":n.car,Ot(e,I[0]-T/2,S[1],T,Math.max(4,I[1]-S[1]),Math.min(8,T/3)),e.fill(),x.brake&&(e.fillStyle="#ff3b30",e.fillRect(I[0]-T/2,I[1]-4,T,4))}let g=d(0,0),p=d(0,4.7),y=1.85*30*g[2];e.fillStyle="#111214",Ot(e,g[0]-y/2,p[1],y,g[1]-p[1],10),e.fill(),e.fillStyle="rgba(120,150,190,0.8)",Ot(e,g[0]-y*.36,p[1]+(g[1]-p[1])*.18,y*.72,(g[1]-p[1])*.28,6),e.fill();let _=e.createLinearGradient(0,wn-128,0,wn-112);_.addColorStop(0,n.panel+"00"),_.addColorStop(1,n.panel),e.fillStyle=_,e.fillRect(0,wn-128,jt,16),e.fillStyle=n.panel,e.fillRect(0,wn-112,jt,112),e.textAlign="center",e.font='600 24px "Helvetica Neue", Arial, sans-serif',t.leftLane>0?(e.fillStyle="#2f6fe4",e.fillText("Linke Spur frei \xB7 "+Math.ceil(t.leftLane)+" s",jt/2,wn-86)):(e.fillStyle=n.sub,e.fillText("Rechtsfahrgebot aktiv",jt/2,wn-86))}features(e){if(this.featureCache.has(e))return this.featureCache.get(e);let t=Bn(e*977+3),n=e*600,s={roads:[],towns:[],parks:[],water:null,exit:null};if(t()<.55){let o=n+t()*600,a=(t()-.5)*1.2;s.roads.push({s:o,a,len:1500+t()*2500}),t()<.6&&(s.exit=o)}if(t()<.35){let o=t()<.5?-1:1;s.towns.push({s:n+t()*600,x:o*(300+t()*900),r:120+t()*220,seed:e})}let r=Math.floor(t()*3);for(let o=0;o<r;o++)s.parks.push({s:n+t()*600,x:(t()<.5?-1:1)*(200+t()*1400),r:150+t()*400,k:t()});return t()<.12&&(s.water={s:n+t()*600,a:(t()-.5)*.8}),this.featureCache.set(e,s),this.featureCache.size>80&&this.featureCache.delete(this.featureCache.keys().next().value),s}drawMap(e,t,n){let s=t.navi||{},r=jt,o=En-jt,a=wn-64;e.save(),e.beginPath(),e.rect(r,0,o,a),e.clip(),e.fillStyle=n.land,e.fillRect(r,0,o,a);let l=t.s,c=Math.max(0,s.remaining??3e3),h=Ke(330/Math.max(c+250,400),.07,.42);this.zoom=it(this.zoom,h,.08);let u=this.zoom,d=r+o/2,f=a*.8,m=Ln(l),v=(Ln(l+25)-Ln(l-25))/50,g=Math.atan(v),p=(C,E)=>{let M=C-m,P=-(E-l),k=Math.cos(-g),H=Math.sin(-g);return[d+(M*k-P*H)*u,f+(M*H+P*k)*u]},y=l-a*.25/u-600,_=l+a*.9/u+600,x=Math.floor(y/600),I=Math.floor(_/600);for(let C=x;C<=I;C++){let E=this.features(C);for(let M of E.parks){let[P,k]=p(Ln(M.s)+M.x,M.s);e.fillStyle=n.park,e.beginPath(),e.ellipse(P,k,M.r*u,M.r*u*(.6+M.k*.6),M.k*3,0,Math.PI*2),e.fill()}if(E.water){e.strokeStyle=n.water,e.lineWidth=Math.max(5,60*u),e.beginPath();let M=E.water.s,P=E.water.a;for(let k=-6;k<=6;k++){let H=Ln(M)+k*400,F=M+k*400*Math.tan(P)+Math.sin(k)*80,[W,N]=p(H,F);k===-6?e.moveTo(W,N):e.lineTo(W,N)}e.stroke()}for(let M of E.towns){let P=Bn(M.seed),[k,H]=p(Ln(M.s)+M.x,M.s),F=M.r*u;e.save(),e.fillStyle=n.town,e.beginPath(),e.arc(k,H,F,0,Math.PI*2),e.fill(),e.clip(),e.strokeStyle=n.road,e.lineWidth=2.5,e.lineCap="round";let W=P()*Math.PI;for(let N=0;N<2;N++){let Z=W+N*(Math.PI/2+(P()-.5)*.5),V=Math.cos(Z),ee=Math.sin(Z);for(let he=-2;he<=2;he++){if(P()<.25)continue;let xe=(he+(P()-.5)*.5)*F*.36,ke=F*(.45+P()*.75),Je=(P()-.5)*F*.7,K=k-ee*xe+V*Je,oe=H+V*xe+ee*Je;e.beginPath(),e.moveTo(K-V*ke/2,oe-ee*ke/2),e.lineTo(K+V*ke/2,oe+ee*ke/2),e.stroke()}}e.restore()}}for(let C=x;C<=I;C++){let E=this.features(C);for(let M of E.roads){let P=Ln(M.s),k=p(P-Math.cos(M.a)*M.len,M.s-Math.sin(M.a)*M.len),H=p(P+Math.cos(M.a)*M.len,M.s+Math.sin(M.a)*M.len);e.strokeStyle=n.roadCase,e.lineWidth=9,e.beginPath(),e.moveTo(k[0],k[1]),e.lineTo(H[0],H[1]),e.stroke(),e.strokeStyle=n.road,e.lineWidth=6,e.stroke()}}let S=[];for(let C=y;C<=_;C+=40/Math.max(u,.05))S.push(p(Ln(C),C));let T=(C,E,M)=>{e.strokeStyle=E,e.lineWidth=M,e.lineJoin="round",e.lineCap="round",e.beginPath(),C.forEach((P,k)=>k?e.lineTo(P[0],P[1]):e.moveTo(P[0],P[1])),e.stroke()};if(T(S,n.hwyCase,17),T(S,n.hwy,12),s.target&&!s.arrived){let C=s.recalc||0,E=l+c,M=s.side||1,P=[];if(s.wende&&s.wendeS>l){for(let k=l;k<=s.wendeS;k+=30)P.push(p(Ln(k)+6,k));for(let k=0;k<=8;k++){let H=k/8*Math.PI;P.push(p(Ln(s.wendeS)+6-(1-Math.cos(H))*70,s.wendeS+Math.sin(H)*120))}for(let k=s.wendeS;k>=l-900;k-=30)P.push(p(Ln(k)-134,k))}else{let k=Math.max(l,E-260);for(let W=l;W<=k;W+=Math.max(20,12/u))P.push(p(Ln(W),W));let H=Ln(k),F=Ln(E)+M*520;for(let W=1;W<=10;W++){let N=W/10;P.push(p(it(H,F,N*N),it(k,E+120,N)))}}if(C<1&&(e.globalAlpha=1-C,T(P,n.routeCase,15),T(P,n.route,10),e.globalAlpha=1),!s.wende){let[k,H]=p(Ln(E)+M*520,E+120);k>r-40&&k<En+40&&H>-40&&H<a+40&&(e.fillStyle="#e8352b",e.beginPath(),e.arc(k,H-26,15,Math.PI,0),e.lineTo(k,H),e.closePath(),e.fill(),e.fillStyle="#fff",e.beginPath(),e.arc(k,H-26,6,0,Math.PI*2),e.fill())}}if(e.save(),e.translate(d,f),e.fillStyle="rgba(47,111,228,0.18)",e.beginPath(),e.arc(0,0,34,0,Math.PI*2),e.fill(),e.fillStyle="#ffffff",e.beginPath(),e.moveTo(0,-24),e.lineTo(17,18),e.lineTo(0,8),e.lineTo(-17,18),e.closePath(),e.fill(),e.fillStyle="#2f6fe4",e.beginPath(),e.moveTo(0,-18),e.lineTo(12,13),e.lineTo(0,5),e.lineTo(-12,13),e.closePath(),e.fill(),e.restore(),s.recalc>0&&(e.fillStyle=`rgba(255,255,255,${.5*s.recalc})`,e.fillRect(r,0,o,a),e.save(),e.translate(d,a*.45),e.strokeStyle="#2f6fe4",e.lineWidth=8,e.lineCap="round",e.beginPath(),e.arc(0,0,34,this.spin*6,this.spin*6+4.2),e.stroke(),e.restore(),e.fillStyle="#1d1f22",e.font='bold 32px "Helvetica Neue", Arial, sans-serif',e.textAlign="center",e.fillText("Route wird neu berechnet \u2026",d,a*.45+80)),s.target){e.fillStyle=n.card,Ot(e,r+18,70,o-36,118,16),e.fill(),e.fillStyle="#ffffff",e.textAlign="left",e.font='bold 30px "Helvetica Neue", Arial, sans-serif';let C=s.arrived?"Ziel erreicht":s.wende&&s.wendeS>l?"Bitte wenden":c>400?"A7 folgen":"Ausfahrt nehmen",E=s.wende&&s.wendeS>l?s.wendeS-l:Math.max(0,c-260);e.fillText(this.arrowFor(C)+"  "+C,r+38,112),e.font='600 28px "Helvetica Neue", Arial, sans-serif',e.textAlign="right",s.arrived||e.fillText(n0(E),En-36,112),e.textAlign="left",e.font='26px "Helvetica Neue", Arial, sans-serif';let M=s.arrived?"":n0(c)+(s.eta?" \xB7 "+s.eta:""),P=e.measureText(M).width;e.fillStyle="#c9d6ff",td(e,(s.arrived?"\u23F3 ":"\u{1F3C1} ")+s.target,r+38,160,En-36-P-26-(r+38),20),e.font='26px "Helvetica Neue", Arial, sans-serif',e.textAlign="right",e.fillStyle="#ffffff",e.fillText(M,En-36,160),e.fillStyle="rgba(200,16,46,0.94)",Ot(e,r+18,a-74,o-36,56,14),e.fill(),e.fillStyle="#ffffff",e.textAlign="left",e.font='bold 24px "Helvetica Neue", Arial, sans-serif',td(e,"\u{1F4E1} Ferngesteuert von "+(s.bidder||"\u2014"),r+34,a-38,o-210),e.textAlign="right",e.font='bold 26px "Helvetica Neue", Arial, sans-serif',e.fillText(s.bid||"",En-36,a-38)}e.restore()}arrowFor(e){return e==="Ziel erreicht"?"\u2713":e==="Bitte wenden"?"\u21B6":e==="Ausfahrt nehmen"?"\u2197":"\u2191"}drawTopBar(e,t,n){e.fillStyle=t.dark?"rgba(20,21,24,0.85)":"rgba(244,245,246,0.88)",e.fillRect(jt,0,En-jt,50),e.fillStyle=n.text,e.font='600 24px "Helvetica Neue", Arial, sans-serif',e.textAlign="left",e.textBaseline="middle",e.fillText("\u{1F464} Mini Adam",jt+20,26),e.textAlign="right",e.fillText(t.clock+"   "+t.temp+" \xB0C   "+(t.funkloch>0?"Kein Netz":"LTE \u2582\u2584\u2586\u2588"),En-18,26),e.textBaseline="alphabetic"}drawDock(e,t,n){e.fillStyle=n.dock,e.fillRect(0,wn-64,En,64),e.fillStyle="#e6e8eb",e.font='30px "Segoe UI Emoji", "Noto Color Emoji", sans-serif',e.textAlign="center",e.textBaseline="middle",["\u{1F697}","\u2744\uFE0F","\u{1F3B5}","\u{1F4DE}","\u{1F4E1}","\u{1F327}\uFE0F","\u2699\uFE0F"].forEach((r,o)=>e.fillText(r,70+o*90,wn-32)),e.font='600 26px "Helvetica Neue", Arial, sans-serif',e.fillStyle="#e6e8eb",e.textAlign="right",e.fillText("21,0 \xB0",En-26,wn-32),t.wiperOn&&(e.textAlign="left",e.fillStyle="#4c8dff",e.font='600 22px "Helvetica Neue", Arial, sans-serif',td(e,"Wischer: Auto (Beta)",656,wn-32,En-130-656,14)),e.textAlign="center",e.textBaseline="alphabetic"}};function n0(i){return i>=1e3?on(i/1e3,i>=1e4?0:1)+" km":Math.max(0,Math.round(i/10)*10)+" m"}function td(i,e,t,n,s,r=14){let o=parseFloat(i.font.match(/(\d+)px/)[1]);for(;i.measureText(e).width>s&&o>r;)o-=2,i.font=i.font.replace(/\d+px/,o+"px");if(i.measureText(e).width>s){let a=e;for(;a.length>4&&i.measureText(a+"\u2026").width>s;)a=a.slice(0,-1);e=a.trimEnd()+"\u2026"}i.fillText(e,t,n)}var cM=new A(-.37,1.2,.27),hM=-.12,_s=(()=>{let i=new A(0,.9,-.88),e=new A(0,1.38,-.095),t=e.clone().sub(i),n=t.length();t.normalize();let s=new A(1,0,0),r=new A().crossVectors(t,s).normalize();return{base:i,top:e,U:t,X:s,N:r,length:n,halfBase:.74,halfTop:.63}})(),eo=[{pivot:new A(-.64,.884,-.905),length:.62,max:1.55},{pivot:new A(.06,.884,-.905),length:.56,max:1.75}];function i0(i){return new li({color:i,roughness:.95,sheen:1,sheenRoughness:.5,sheenColor:new Ue(i).lerp(new Ue(16777215),.35),bumpMap:pl(5),bumpScale:.5})}function Ul(i,e,t,n,s,r=0){let o=new A().subVectors(e,i),a=o.length(),l=.5,c=new Os(l,Math.max(.001,a/Math.max(t,n)-2*l),6,16);c.scale(t,Math.max(t,n),n),c.translate(0,a/2,0),r&&c.rotateY(r);let h=new D(c,s);return h.position.copy(i),h.quaternion.setFromUnitVectors(new A(0,1,0),o.normalize()),h}function uM(){let i=document.createElement("canvas");i.width=1024,i.height=300;let e=i.getContext("2d"),t=i.width,n=i.height;e.fillStyle="#1c1d20",e.fillRect(0,0,t,n),e.globalCompositeOperation="destination-out",e.beginPath();let s=n*.12,r=n*.88;e.moveTo(t*.2,s),e.lineTo(t*.8,s),e.quadraticCurveTo(t*.88,s,t*.9,s+n*.18),e.lineTo(t*.95,r),e.lineTo(t*.05,r),e.lineTo(t*.1,s+n*.18),e.quadraticCurveTo(t*.12,s,t*.2,s),e.closePath(),e.fill(),e.globalCompositeOperation="source-over",e.fillStyle="#2a2b2f";for(let a of[.24,.5,.76]){let l=t*(a===.5?.085:.11);dM(e,t*a-l/2,n*.7,l,n*.4,26),e.fill()}e.fillStyle="#141517",e.fillRect(0,n*.9,t,n*.1);let o=new Pt(i);return o.colorSpace=ht,o.anisotropy=4,o}function dM(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.lineTo(e+n-r,t),i.quadraticCurveTo(e+n,t,e+n,t+r),i.lineTo(e+n,t+s-r),i.quadraticCurveTo(e+n,t+s,e+n-r,t+s),i.lineTo(e+r,t+s),i.quadraticCurveTo(e,t+s,e,t+s-r),i.lineTo(e,t+r),i.quadraticCurveTo(e,t,e+r,t),i.closePath()}var Nl=class{constructor(){this.scene=new Mi,this.root=new we,this.root.name="Cockpit",this.scene.add(this.root),this.hemi=new Br(13163775,4208428,1.25),this.scene.add(this.hemi),this.sun=new Fr(16773340,2),this.scene.add(this.sun),this.scene.add(this.sun.target),this.fill=new rl(16774376,.25,2.5,1.2),this.fill.position.set(-.2,1.25,.1),this.root.add(this.fill);let e={dashTop:new pt({color:1908257,roughness:.86}),dash:new pt({color:1579292,roughness:.62}),vent:new pt({color:328966,roughness:.9}),wood:new pt({map:wp(),roughness:.42,color:14271664}),pillar:new pt({color:2500394,roughness:.95}),door:new pt({color:1776671,roughness:.68}),chrome:new pt({color:12172738,metalness:1,roughness:.22}),rim:new pt({color:1250069,roughness:.52}),spoke:new pt({color:2829360,metalness:.55,roughness:.32}),black:new pt({color:723724,roughness:.3,metalness:.2}),skin:i0(14263415),sleeve:i0(1447448),wiper:new pt({color:1315860,roughness:.6,metalness:.4})};this.M=e,this.buildDash(e),this.buildPillars(e),this.buildDoor(e),this.buildWheel(e),this.buildScreen(e),this.buildMirrors(e),this.buildWipers(e),this.buildExtras(e),this.nomi=new Dl,this.nomi.group.position.set(-.27,.911,-.53),this.nomi.group.scale.setScalar(1.1),this.root.add(this.nomi.group),this.steer=0,this.wheelAngle=0,this.elsaWobble=0,this.elsaVel=0,this.headOffset=new A,this.shake=0}buildDash(e){let t=new mn,n=[[-.92,.882],[-.86,.9],[-.5,.913],[-.455,.905],[-.42,.875],[-.405,.85],[-.405,.8],[-.43,.793],[-.43,.776],[-.395,.77],[-.335,.62],[-.35,.42],[-.92,.42]];t.moveTo(n[0][0],n[0][1]);for(let h=1;h<n.length;h++)t.lineTo(n[h][0],n[h][1]);t.closePath();let s=1.6,r=new Kn(t,{depth:s,bevelEnabled:!1,curveSegments:4});r.rotateY(-Math.PI/2),r.translate(s/2,0,0);let o=new D(r,e.dashTop);this.root.add(o);let a=new Fe(1.5,.05,.012),l=new D(a,e.wood);l.position.set(.02,.826,-.399),this.root.add(l);let c=new D(new Fe(1.52,.014,.02),e.vent);c.position.set(.02,.785,-.425),this.root.add(c);for(let h of[-.62,.62]){let u=new D(new Fe(.18,.004,.08),e.vent);u.position.set(h,.912,-.78),this.root.add(u)}}buildPillars(e){let t=_s;for(let r of[-1,1]){let o=new A(r*.765,t.base.y-.07,t.base.z-.03),a=new A(r*.64,t.top.y+.015,t.top.z+0);this.root.add(Ul(o,a,.085,.06,e.pillar));let l=new A(r*.68,t.top.y+.035,.8);this.root.add(Ul(a,l,.08,.07,e.pillar))}let n=new D(new ys(1.34,.06,.12,3,.025),e.pillar);n.position.set(0,t.top.y+.02,t.top.z+.03),this.root.add(n),this.root.add(Ul(new A(-.79,.99,.34),new A(-.665,1.405,.3),.09,.07,e.pillar));let s=new D(new Fe(1.5,.11,.012),e.vent);s.quaternion.setFromRotationMatrix(new je().makeBasis(t.X,t.U,t.N)),s.position.copy(t.base).addScaledVector(t.U,-.01).addScaledVector(t.N,.007),this.root.add(s)}buildDoor(e){let t=new we,n=new D(new Fe(.07,.56,1.35),e.door);n.position.set(-.8,.7,-.08),t.add(n);let s=new D(new ys(.075,.06,1.3,3,.025),e.dash);s.position.set(-.775,.975,-.06),t.add(s);let r=new D(new Fe(.1,.05,.4),e.dashTop);r.position.set(-.73,.76,.15),t.add(r);let o=new D(new Fe(.012,.04,.8),e.wood);o.position.set(-.762,.9,-.1),t.add(o);let a=new D(new Fe(.012,.018,.04),e.black);a.position.set(-.76,.86,-.32),t.add(a),this.root.add(t)}buildWheel(e){let t=new we;t.position.set(-.37,.865,-.2),t.rotation.x=-.5,this.root.add(t);let n=new we;t.add(n),this.wheel=n;let s=.17,r=new Nn(s,.023,14,56);r.scale(1,.94,1.15),n.add(new D(r,e.rim));for(let f of[-1,1]){let m=new D(new Fe(.12,.034,.02),e.spoke);m.position.set(f*.115,-.01,-.005),n.add(m);let v=new D(new We(.012,.012,.01,16),e.black);v.rotation.x=Math.PI/2,v.position.set(f*.11,-.01,.009),n.add(v)}let o=new D(new Fe(.035,.11,.02),e.spoke);o.position.set(0,-.1,-.005),n.add(o);let a=new We(.065,.07,.04,28);a.rotateX(Math.PI/2),a.scale(1.25,.85,1);let l=new D(a,e.rim);l.position.set(0,-.008,-.01),n.add(l);let c=new D(new et(.075,.075),new pt({map:Xr({w:256,h:256}),transparent:!0,roughness:.4,alphaTest:.2}));c.position.set(0,-.004,.011),n.add(c);let h=new D(new We(.035,.045,.24,14),e.dash);h.rotation.x=Math.PI/2,h.position.set(0,-.01,-.13),t.add(h);for(let f of[-1,1]){let m=new D(new We(.007,.006,.14,8),e.black);m.rotation.z=f*(Math.PI/2-.25),m.position.set(f*.09,0,-.08),t.add(m)}this.hands=[];for(let f of[-1,1]){let m=f*1.32,v=new we;v.position.set(Math.sin(m)*s,Math.cos(m)*s,.012),v.rotation.z=-m;let g=new D(new yt(.048,18,14),e.skin);g.scale.set(1.05,.85,.85),g.position.set(0,.005,.014);let p=new D(new yt(.019,12,10),e.skin);p.position.set(-f*.03,-.012,.035);let y=new D(new yt(.04,14,10),e.skin);y.scale.set(1,.7,.6),y.position.set(0,.01,-.025),v.add(g,p,y),n.add(v),this.hands.push(v)}this.arms=[];let u=new Os(.036,1,6,14),d=new We(.052,.058,1,16,1,!0);for(let f of[-1,1]){let m=new D(u,e.sleeve),v=new D(d,e.sleeve);this.root.add(m,v),this.arms.push({arm:m,sleeve:v,shoulder:new A(-.37+f*.25,.84,.3)})}}buildScreen(e){this.screen=new kl;let t=new we;t.position.set(0,1.03,-.465),t.rotation.x=-.16;let n=new D(new Fe(.352,.226,.018),e.black);n.position.z=-.01;let s=new D(new et(.336,.21),new cn({map:this.screen.texture,toneMapped:!1}));s.position.z=5e-4;let r=new D(new Fe(.06,.08,.03),e.dash);r.position.set(0,-.13,-.03),t.add(n,s,r),this.root.add(t),this.displayMat=s.material}buildMirrors(e){let s=new mn,r=.03;s.moveTo(-.245/2+r,-.072/2),s.lineTo(.245/2-r,-.072/2),s.quadraticCurveTo(.245/2,-.072/2,.245/2,-.072/2+r),s.lineTo(.245/2,.072/2-r),s.quadraticCurveTo(.245/2,.072/2,.245/2-r,.072/2),s.lineTo(-.245/2+r,.072/2),s.quadraticCurveTo(-.245/2,.072/2,-.245/2,.072/2-r),s.lineTo(-.245/2,-.072/2+r),s.quadraticCurveTo(-.245/2,-.072/2,-.245/2+r,-.072/2);let o=new Wi(s,6),a=o.attributes.uv,l=o.attributes.position;for(let ge=0;ge<a.count;ge++)a.setXY(ge,1-(l.getX(ge)/.245+.5),l.getY(ge)/.072+.5);this.mirrorMat=new cn({color:16777215});let c=new we;c.position.set(-.08,1.235,-.225),c.rotation.set(-.06,-.18,0);let h=new D(o,this.mirrorMat);h.position.z=.021;let u=new Kn(s,{depth:.022,bevelEnabled:!0,bevelSize:.006,bevelThickness:.006,bevelSegments:2});u.translate(0,0,-.012);let d=new D(u,e.black),f=o.clone(),m=f.attributes.uv;for(let ge=0;ge<m.count;ge++)m.setXY(ge,l.getX(ge)/.245+.5,l.getY(ge)/.072+.5);this.mirrorFrame=new D(f,new cn({map:uM(),transparent:!0,depthWrite:!1})),this.mirrorFrame.position.z=.0215,c.add(d,h,this.mirrorFrame),this.root.add(c);let v=_s,g=new je().makeBasis(v.X,v.U,v.N.clone().negate()).setPosition(v.base),p=new mn,y=-.07,_=.048,x=.088,I=.85,S=.95;p.moveTo(y-_+.025,I),p.lineTo(y+_-.025,I),p.quadraticCurveTo(y+_,I,y+_+.003,I+.025),p.lineTo(y+x,S),p.lineTo(y-x,S),p.lineTo(y-_-.003,I+.025),p.quadraticCurveTo(y-_,I,y-_+.025,I);let T=new Kn(p,{depth:.014,bevelEnabled:!0,bevelSize:.006,bevelThickness:.006,bevelSegments:2,curveSegments:6});T.translate(0,0,.007),T.applyMatrix4(g);let C=new D(T,e.dash),E=(ge,fe,Te)=>new A(ge,fe,Te).applyMatrix4(g),M=E(-.08,.862,.024),P=new A(-.08,1.258,-.243),k=P.clone().sub(M),H=new We(.008,.011,k.length(),10);H.translate(0,k.length()/2,0);let F=new D(H,e.black);F.position.copy(M),F.quaternion.setFromUnitVectors(new A(0,1,0),k.normalize());let W=new D(new yt(.013,12,8),e.black);W.position.copy(P),this.root.add(C,F,W),this.mirrorHousing={toGlass:g,onGlass:E};let N=new we;N.position.set(-1,1.045,-.6),N.rotation.y=.62;let Z=new li({color:329223,metalness:.5,roughness:.3,clearcoat:1}),V=new D(Ml(-1),Z),ee=new Wi(Fo(.9,-1),12);ee.computeBoundingBox();let he=ee.boundingBox,xe=ee.attributes.uv,ke=ee.attributes.position;for(let ge=0;ge<xe.count;ge++){let fe=(ke.getX(ge)-he.min.x)/(he.max.x-he.min.x),Te=(ke.getY(ge)-he.min.y)/(he.max.y-he.min.y);xe.setXY(ge,1-fe*.34,.03+Te*.6)}this.sideMirrorMat=new cn({color:16777215});let Je=new D(ee,this.sideMirrorMat);Je.position.z=.002,N.add(V,Je),N.updateMatrix();let K=new A(.095,-.028,-.05).applyMatrix4(N.matrix),oe=Ul(new A(-.79,.99,-.66),K,.05,.035,Z);this.root.add(N,oe)}setMirrorTexture(e){this.mirrorMat.map=e,this.mirrorMat.needsUpdate=!0,this.sideMirrorMat.map=e,this.sideMirrorMat.needsUpdate=!0,this.mirrorFrame.visible=!0}setTrunkView(e){this.mirrorMat.map=e,this.mirrorMat.needsUpdate=!0,this.mirrorFrame.visible=!1}buildWipers(e){let t=_s,n=new je().makeBasis(t.X,t.U,t.N.clone().negate()),s=new Gt().setFromRotationMatrix(n);this.wiperObjs=eo.map(r=>{let o=new we;o.position.copy(r.pivot).addScaledVector(t.N,.02),o.quaternion.copy(s);let a=new we;o.add(a);let l=new D(new Fe(r.length,.016,.012),e.wiper);l.position.set(r.length/2,0,-.012);let c=new D(new Fe(r.length*.92,.022,.008),e.wiper);return c.position.set(r.length*.52,.01,-.001),a.add(l,c),this.root.add(o),a})}buildExtras(e){let t=new we;t.position.copy(this.mirrorHousing.onGlass(-.098,.9,.049));let n=new D(new ys(.06,.044,.036,2,.006),e.black),s=new D(new We(.013,.013,.012,16),new pt({color:1714746,metalness:.9,roughness:.1}));s.rotation.x=Math.PI/2,s.position.z=-.022,this.recLed=new D(new yt(.0055,10,8),new cn({color:16719904,toneMapped:!1})),this.recLed.position.set(.019,-.008,.0175);let r=new D(new Fe(.03,.02,.03),e.black);r.position.set(0,.026,-.004),t.add(n,s,this.recLed,r),this.root.add(t),this.elsa=bl({curved:!1}),this.elsa.scale.setScalar(.11),this.elsaSpring=new we,this.elsaSpring.position.set(-.6,.913,-.68),this.elsaSpring.rotation.y=.5;let o=new D(new We(.018,.022,.012,16),e.black);this.elsaSpring.add(o,this.elsa),this.elsa.position.y=.008,this.elsaSpring.visible=!1,this.root.add(this.elsaSpring);let a=new et(.012,.008);this.confetti=new ai(a,new pt({side:dt,roughness:.6}),400),this.confetti.count=0,this.confetti.frustumCulled=!1,this.root.add(this.confetti)}addConfetti(e=40){let t=_s,n=new je().makeBasis(t.X,t.U,t.N.clone().negate()),s=new Gt().setFromRotationMatrix(n),r=new je,o=new Gt,a=new Gt,l=[16726891,16765503,3919532,5934574,16747586,11828479,16777215],c=new Ue;for(let h=0;h<e&&this.confetti.count<400;h++){let u=Math.random()*t.length*.9+.03,d=t.halfBase+(t.halfTop-t.halfBase)*(u/t.length)-.05,f=(Math.random()*2-1)*d,m=t.base.clone().addScaledVector(t.U,u);m.x=f,m.addScaledVector(t.N,-.006),a.setFromAxisAngle(new A(0,0,1),Math.random()*Math.PI),o.copy(s).multiply(a),r.compose(m,o,new A(1,1,1).multiplyScalar(.7+Math.random()*.8));let v=this.confetti.count++;this.confetti.setMatrixAt(v,r),this.confetti.setColorAt(v,c.setHex(l[v%l.length]))}this.confetti.instanceMatrix.needsUpdate=!0,this.confetti.instanceColor&&(this.confetti.instanceColor.needsUpdate=!0)}clearConfetti(){this.confetti.count=0}setElsa(e){this.elsaSpring.visible=!!e}placeCamera(e,t,n,s,r,o){let a=Math.min(1,s/60)*.0025+this.shake*.03;this.headOffset.x=Hn(this.headOffset.x,Ke(-r*.006,-.05,.05),4,o);let l=this.headOffset.x+(Math.sin(n*37)*.5+Math.sin(n*23)*.5)*a,c=(Math.sin(n*29)+Math.sin(n*13.3))*.5*a+Math.sin(n*1.4)*.003,h=cM.clone().add(new A(l,c,0));h.applyMatrix4(t),e.position.copy(h);let u=new Gt().setFromRotationMatrix(t),d=new pn(hM+c*2,this.headOffset.x*.6+Math.sin(n*.31)*.004,-r*.0025+l*2,"YXZ");e.quaternion.copy(u).multiply(new Gt().setFromEuler(d))}update(e){let{dt:t,t:n}=e;this.wheelAngle=Hn(this.wheelAngle,e.steer*1.25,10,t),this.wheel.rotation.z=-this.wheelAngle,this.root.updateMatrixWorld(!0);let s=new je().copy(this.root.matrixWorld).invert(),r=new A,o=new A;if(this.arms.forEach((l,c)=>{this.hands[c].getWorldPosition(r),r.applyMatrix4(s),o.subVectors(r,l.shoulder);let h=o.length();o.normalize();let u=new Gt().setFromUnitVectors(new A(0,1,0),o);l.arm.position.copy(l.shoulder).addScaledVector(o,h/2-.01),l.arm.quaternion.copy(u),l.arm.scale.set(1,(h-.04)/1.086,1),l.sleeve.position.copy(l.shoulder).addScaledVector(o,.08),l.sleeve.quaternion.copy(u),l.sleeve.scale.set(1,.22,1)}),e.wiperAngles&&(this.wiperObjs[0].rotation.z=e.wiperAngles[0],this.wiperObjs[1].rotation.z=e.wiperAngles[1]),this.elsaSpring.visible){let h=-60*this.elsaWobble-3.5*this.elsaVel-(e.latAcc||0)*.9;this.elsaVel+=h*t,this.elsaWobble+=this.elsaVel*t,this.elsaWobble=Ke(this.elsaWobble,-.6,.6),this.elsa.rotation.z=this.elsaWobble,El(this.elsa,n,this.elsaWobble)}this.recLed.visible=Math.sin(n*3.5)>-.3;let a=e.overcast||0;e.sunDir&&(this.sun.position.copy(this.root.position).addScaledVector(e.sunDir,10),this.sun.target.position.copy(this.root.position)),this.sun.intensity=2.1*(1-a*.85),this.hemi.intensity=1.2-a*.25,this.nomi.update(t,n,-.16),this.screen.update(t,e.screen)}};var $s=640,Ms=360,Js=160,js=90,Hl=class{constructor(){this.canvas=document.createElement("canvas"),this.canvas.width=$s,this.canvas.height=Ms,this.ctx=this.canvas.getContext("2d"),this.texture=new Pt(this.canvas),this.texture.generateMipmaps=!1,this.texture.minFilter=Vn,this.film=document.createElement("canvas"),this.film.width=Js,this.film.height=js,this.fctx=this.film.getContext("2d"),this.fctx.fillStyle="#000",this.fctx.fillRect(0,0,Js,js),this.filmTex=new Pt(this.film),this.filmTex.generateMipmaps=!1,this.filmTex.minFilter=Vn,this.sprite=Pp(),this.drops=[],this.intensity=0,this.firmware=0,this.enabled=!0,this.wiper={angle:0,mode:"park",t:0,dur:0,amp:0,queue:0,pause:0,prevAngle:0},this.autoTimer=2.5,this.onEvent=null,this.tmp=new A,this.camPos=new A,this.twitches=0,this.wipes=0,this.dirty=!0,this.filmAcc=0,this.dryFor=0}setRain(e){this.intensity=Ke(e,0,1)}setFirmware(e){this.firmware=e}get angles(){let e=this.wiper.angle;return[e*(eo[0].max/2.15),e*(eo[1].max/2.15)]}manual(){if(this.wiper.mode!=="park")return null;let e=[.18,.42,.62,.82][this.firmware]??.18;return mt(e)?(this.startSweep(),"wipe"):(this.startTwitch(1+Math.floor(Math.random()*2)),"twitch")}startTwitch(e=1){this.wiper.mode="twitch",this.wiper.t=0,this.wiper.dur=Se(.18,.3),this.wiper.amp=Se(.28,.66),this.wiper.queue=e-1,this.twitches++,this.onEvent&&this.onEvent("twitch")}startSweep(){this.wiper.mode="sweep",this.wiper.t=0,this.wiper.dur=1,this.wiper.amp=2.15,this.wipes++,this.onEvent&&this.onEvent("wipe")}update(e,{speed:t,camera:n,carMatrix:s}){let r=this.wiper;r.prevAngle=r.angle;let o=r.mode==="sweep";if(n.updateMatrixWorld(),this.intensity>.05&&r.mode==="park"&&(this.autoTimer-=e,this.autoTimer<=0)){this.autoTimer=Se(1.4,3.8)/(.6+this.intensity*.6);let u=[0,.18,.36,.55][this.firmware]??0;mt(u)?this.startSweep():this.startTwitch(1+Math.floor(Math.random()*3))}if(r.mode==="twitch"){r.t+=e;let u=r.t/r.dur;r.angle=u<1?r.amp*Math.sin(Math.PI*u)*(1-.3*u):0,u>=1&&(r.angle=0,r.queue>0?(r.queue--,r.mode="pause",r.pause=Se(.08,.25)):r.mode="park")}else if(r.mode==="pause")r.pause-=e,r.pause<=0&&(r.mode="twitch",r.t=0,r.dur=Se(.15,.28),r.amp=Se(.2,.55),this.twitches++,this.onEvent&&this.onEvent("twitch"));else if(r.mode==="sweep"){r.t+=e;let u=r.t/r.dur;r.angle=u<1?r.amp*Math.sin(Math.PI*Math.min(1,u))**.8:0,u>=1&&(r.angle=0,r.mode="park")}let a=_s;if(this.intensity>0){let d=this.intensity*(22+t*1.3)*e;for(;d>0;){if(Math.random()<d){let f=Math.random()*a.length,m=it(a.halfBase,a.halfTop,f/a.length),v=Math.random()<.08;this.drops.push({x:(Math.random()*2-1)*m,u:f,r:v?Se(.006,.011):Se(.0022,.0058),life:0})}d-=1}}let l=Math.max(0,t-14)*.0055;for(let u of this.drops){u.life+=e;let d=Ke((u.r-.003)/.006,0,1);u.u+=(l*d-(1-Math.min(1,t/14))*.02*d)*e,u.x+=Math.sin(u.life*3+u.r*1e3)*.002*d*e*(t/30)}this.drops=this.drops.filter(u=>u.u>-.02&&u.u<a.length+.02&&!(this.intensity<.01&&u.life>6));let c=Math.min(r.prevAngle,r.angle),h=Math.max(r.prevAngle,r.angle);if(h>.01&&h-c>1e-4){let u=!(o||r.mode==="sweep");for(let d=0;d<eo.length;d++){let f=eo[d],m=f.max/2.15,v=c*m-.04,g=h*m+.04,p=f.pivot.x,y=this.pivotU(f.pivot);this.drops=this.drops.filter(_=>{let x=_.x-p,I=_.u-y,S=Math.hypot(x,I);if(S<.06||S>f.length+.015)return!0;let T=Math.atan2(I,x);return!(T>=v&&T<=g)}),this.paintFilm(n,s,f,c*m,h*m,u)}}if(this.drops.length>520&&this.drops.splice(0,this.drops.length-520),this.filmAcc+=e,this.dryFor+=e,this.filmAcc>=.2){let u=this.filmAcc;this.filmAcc=0,this.fctx.globalCompositeOperation="source-over",this.intensity<=0&&this.dryFor>12?this.fctx.fillStyle="#000":this.fctx.fillStyle=`rgba(0,0,0,${1-Math.exp(-.35*u)})`,this.fctx.fillRect(0,0,Js,js),this.intensity>0&&(this.fctx.fillStyle=`rgba(255,255,255,${u*.05*this.intensity})`,this.fctx.fillRect(0,0,Js,js)),this.filmTex.needsUpdate=!0}this.draw(n,s)}pivotU(e){let t=_s;return this.tmp.copy(e).sub(t.base).dot(t.U)}glassToScreen(e,t,n,s,r){let o=_s;this.tmp.copy(o.base).addScaledVector(o.U,t),this.tmp.x=e,this.tmp.applyMatrix4(s);let a=this.tmp.distanceTo(n.position);return this.tmp.project(n),r.x=(this.tmp.x*.5+.5)*$s,r.y=(.5-this.tmp.y*.5)*Ms,r.z=this.tmp.z,r.d=a,r}paintFilm(e,t,n,s,r,o){let a=this.pivotU(n.pivot),l=[],c={x:0,y:0},h=6;for(let d=0;d<=h;d++){let f=s+(r-s)*d/h;this.glassToScreen(n.pivot.x+Math.cos(f)*n.length,a+Math.sin(f)*n.length,e,t,c),l.push([c.x*(Js/$s),c.y*(js/Ms)])}this.glassToScreen(n.pivot.x,a,e,t,c);let u=this.fctx;u.beginPath(),u.moveTo(c.x*(Js/$s),c.y*(js/Ms));for(let d of l)u.lineTo(d[0],d[1]);u.closePath(),o?(this.dryFor=0,u.globalCompositeOperation="lighter",u.fillStyle=`rgba(255,255,255,${.06+this.intensity*.12})`,u.fill()):(u.globalCompositeOperation="destination-out",u.fillStyle="rgba(0,0,0,0.85)",u.fill(),u.globalCompositeOperation="source-over",u.fillStyle="#000",u.fill()),u.globalCompositeOperation="source-over"}draw(e,t){let n=this.ctx;if(n.clearRect(0,0,$s,Ms),!this.enabled||this.drops.length===0){this.texture.needsUpdate=!0;return}let s=Ms/2/Math.tan(zr.degToRad(e.fov)/2),r=$s/Ms/e.aspect,o={x:0,y:0,z:0,d:1};for(let a of this.drops){if(this.glassToScreen(a.x,a.u,e,t,o),o.z>1)continue;let l=Math.max(1.2,a.r/o.d*s*2.3),c=1+Math.min(2.2,a.life<.4?0:a.r>.004?.35:0);n.drawImage(this.sprite,o.x-l*r,o.y-l*c,l*2*r,l*2*c)}this.texture.needsUpdate=!0}clear(){this.drops=[],this.fctx.fillStyle="#000",this.fctx.fillRect(0,0,Js,js),this.filmTex.needsUpdate=!0,this.ctx.clearRect(0,0,$s,Ms),this.texture.needsUpdate=!0}};function s0(i,e){return new Yt({uniforms:{tScene:{value:i},tDrops:{value:e.texture},tFilm:{value:e.filmTex},uDrops:{value:1},uRain:{value:0},uTexel:{value:new le(1/1280,1/720)},uFlash:{value:0},uFlashColor:{value:new Ue(1,1,1)},uFade:{value:0},uGreen:{value:0},uGlitch:{value:0},uTime:{value:0},uVignette:{value:.35},uSat:{value:1.08},uPost:{value:1}},vertexShader:`
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
      }`,depthTest:!1,depthWrite:!1})}var Bl=class{constructor(e,t=2600){let n=new Float32Array(t*2*3),s=new Float32Array(t*2);for(let f=0;f<t;f++){let m=Math.random()*60-30,v=Math.random()*24,g=Math.random()*70-55;for(let p=0;p<2;p++)n[(f*2+p)*3]=m,n[(f*2+p)*3+1]=v,n[(f*2+p)*3+2]=g,s[f*2+p]=p}let r=new xt;r.setAttribute("position",new Ft(n,3)),r.setAttribute("aEnd",new Ft(s,1)),this.uniforms={uTime:{value:0},uSpeed:{value:0},uS:{value:0},uCam:{value:new A},uOpacity:{value:0}};let o=new Yt({uniforms:this.uniforms,vertexShader:`
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
        void main() { gl_FragColor = vec4(vec3(0.75, 0.8, 0.88), uOpacity * vA * 0.5); }`,transparent:!0,depthWrite:!1});this.lines=new Ka(r,o),this.lines.frustumCulled=!1,this.lines.visible=!1,e.add(this.lines),this.maxSpray=700;let a=new Float32Array(this.maxSpray*3),l=new Float32Array(this.maxSpray),c=new Float32Array(this.maxSpray),h=new xt;h.setAttribute("position",new Ft(a,3)),h.setAttribute("aAlpha",new Ft(l,1)),h.setAttribute("aSize",new Ft(c,1)),this.sprayData=[],this.sprayGeo=h;let u=new Yt({uniforms:{tDot:{value:ml()},uCurve:Xi.uCurve,uH:{value:720}},vertexShader:hl+`
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
        }`,transparent:!0,depthWrite:!1});this.spray=new $a(h,u),this.spray.frustumCulled=!1;let d=new le;this.spray.onBeforeRender=(f,m,v,g,p)=>{let y=f.getRenderTarget();p.uniforms.uH.value=y?y.height:f.getDrawingBufferSize(d).y},e.add(this.spray),this.intensity=0}setPixelScale(e){this.spray.material.uniforms.uH.value=e}emit(e,t,n,s,r=1){if(this.intensity<.15)return;let o=Math.round(r*this.intensity*2);for(let a=0;a<o&&this.sprayData.length<this.maxSpray;a++)this.sprayData.push({x:e+(Math.random()-.5)*n,y:.25+Math.random()*.3,z:t,vx:(Math.random()-.5)*1.2,vy:.6+Math.random()*1.4,vz:s*.9,life:0,max:.8+Math.random()*.8,size:1.2+Math.random()*1.6})}update(e,t,{speed:n,s,camX:r,intensity:o}){this.intensity=o;let a=this.uniforms;a.uTime.value=t,a.uSpeed.value=n,a.uS.value=s%70,a.uCam.value.x=r,a.uOpacity.value=o,this.lines.visible=o>.02;let l=this.sprayGeo.attributes.position.array,c=this.sprayGeo.attributes.aAlpha.array,h=this.sprayGeo.attributes.aSize.array,u=0,d=[];for(let f of this.sprayData)f.life+=e,!(f.life>f.max)&&(f.x+=f.vx*e,f.y+=f.vy*e,f.vy-=.8*e,f.z+=(n-f.vz*Math.exp(-f.life*2))*e,f.size+=e*2.2,d.push(f),l[u*3]=f.x,l[u*3+1]=f.y,l[u*3+2]=f.z,c[u]=.32*(1-f.life/f.max)*this.intensity,h[u]=f.size,u++);this.sprayData=d,this.sprayGeo.setDrawRange(0,u),this.sprayGeo.attributes.position.needsUpdate=!0,this.sprayGeo.attributes.aAlpha.needsUpdate=!0,this.sprayGeo.attributes.aSize.needsUpdate=!0,this.spray.visible=u>0}};var Fl=class{constructor(){this.ctx=null,this.enabled=!0,this.volume=.8,this.ready=!1,this.duck=1}suspend(){this.ctx&&this.ctx.state==="running"&&this.ctx.suspend().catch(()=>{})}resume(){this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{})}init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}let e=window.AudioContext||window.webkitAudioContext;if(!e)return;let t=new e;this.ctx=t,this.master=t.createGain(),this.master.gain.value=this.enabled?this.volume:0;let n=t.createDynamicsCompressor();n.threshold.value=-14,n.ratio.value=4,this.master.connect(n).connect(t.destination),this.sfx=t.createGain(),this.sfx.connect(this.master),this.amb=t.createGain(),this.amb.connect(this.master);let s=t.sampleRate*2,r=t.createBuffer(1,s,t.sampleRate),o=r.getChannelData(0);for(let m=0;m<s;m++)o[m]=Math.random()*2-1;this.noiseBuf=r;let a=()=>{let m=t.createBufferSource();return m.buffer=r,m.loop=!0,m.start(),m};this.motor=t.createGain(),this.motor.gain.value=0;let l=t.createBiquadFilter();l.type="bandpass",l.Q.value=2,this.motorFilter=l,this.oscA=t.createOscillator(),this.oscA.type="sawtooth",this.oscB=t.createOscillator(),this.oscB.type="sine",this.oscA.connect(l),this.oscB.connect(l),l.connect(this.motor).connect(this.amb),this.oscA.start(),this.oscB.start(),this.whine=t.createOscillator(),this.whine.type="sine",this.whineGain=t.createGain(),this.whineGain.gain.value=0,this.whine.connect(this.whineGain).connect(this.amb),this.whine.start();let c=a();this.roadFilter=t.createBiquadFilter(),this.roadFilter.type="lowpass",this.roadGain=t.createGain(),this.roadGain.gain.value=0,c.connect(this.roadFilter).connect(this.roadGain).connect(this.amb);let h=a();this.windFilter=t.createBiquadFilter(),this.windFilter.type="bandpass",this.windFilter.frequency.value=700,this.windFilter.Q.value=.6,this.windGain=t.createGain(),this.windGain.gain.value=0,h.connect(this.windFilter).connect(this.windGain).connect(this.amb);let u=a(),d=t.createBiquadFilter();d.type="highpass",d.frequency.value=1800,this.rainGain=t.createGain(),this.rainGain.gain.value=0,u.connect(d).connect(this.rainGain).connect(this.amb),this.siren=t.createOscillator(),this.siren.type="triangle",this.sirenGain=t.createGain(),this.sirenGain.gain.value=0;let f=t.createBiquadFilter();f.type="lowpass",f.frequency.value=2200,this.siren.connect(f).connect(this.sirenGain).connect(this.sfx),this.siren.start(),this.ready=!0,this.rainTick=0}setEnabled(e){this.enabled=e,this.master&&this.master.gain.setTargetAtTime(e?this.volume:0,this.ctx.currentTime,.05)}update(e,{speed:t,throttle:n,rain:s,sirenLevel:r,inCabin:o=!0,paused:a=!1}){if(!this.ready)return;let l=this.ctx.currentTime,c=a?0:t,h=o?1:.7,u=this.duck;this.oscA.frequency.setTargetAtTime(60+c*7.5,l,.05),this.oscB.frequency.setTargetAtTime(120+c*15,l,.05),this.motorFilter.frequency.setTargetAtTime(300+c*30,l,.05),this.motor.gain.setTargetAtTime(a?0:(.012+n*.03+c*4e-4)*h*u,l,.08),this.whine.frequency.setTargetAtTime(500+c*48,l,.05),this.whineGain.gain.setTargetAtTime(a?0:(.0025+n*.006)*Math.min(1,c/8)*u,l,.08),this.roadFilter.frequency.setTargetAtTime(200+c*22,l,.1),this.roadGain.gain.setTargetAtTime(a?0:Ke(c/60,0,1)*.11*h*u,l,.1),this.windGain.gain.setTargetAtTime(a?0:Ke((c/65)**2,0,1)*.08*u,l,.1),this.windFilter.frequency.setTargetAtTime(500+c*14,l,.1),this.rainGain.gain.setTargetAtTime(a?0:s*.05*(.7+c/120),l,.3),!a&&s>.1&&(this.rainTick-=e,this.rainTick<=0&&(this.rainTick=.02+Math.random()*.12/s,this.tick(2e3+Math.random()*3e3,.012*s)));let d=l%1.4<.7;this.siren.frequency.setTargetAtTime(d?440:587,l,.01),this.sirenGain.gain.setTargetAtTime(a?0:r*.05,l,.1)}env(e,t,n,s,r){e.gain.setValueAtTime(1e-4,t),e.gain.exponentialRampToValueAtTime(s,t+n),e.gain.exponentialRampToValueAtTime(1e-4,t+n+r)}tone(e,t=.2,n="sine",s=.15,r=0,o=null){if(!this.ready)return;let a=this.ctx,l=a.currentTime+r,c=a.createOscillator();c.type=n,c.frequency.setValueAtTime(e,l),o&&c.frequency.exponentialRampToValueAtTime(o,l+t);let h=a.createGain();this.env(h,l,.008,s,t),c.connect(h).connect(this.sfx),c.start(l),c.stop(l+t+.05)}noiseBurst(e,t,{type:n="lowpass",freq:s=1e3,q:r=.7,when:o=0,slideTo:a=null}={}){if(!this.ready)return;let l=this.ctx,c=l.currentTime+o,h=l.createBufferSource();h.buffer=this.noiseBuf;let u=l.createBiquadFilter();u.type=n,u.frequency.setValueAtTime(s,c),a&&u.frequency.exponentialRampToValueAtTime(a,c+e),u.Q.value=r;let d=l.createGain();this.env(d,c,.01,t,e),h.connect(u).connect(d).connect(this.sfx),h.start(c,Math.random()),h.stop(c+e+.05)}tick(e,t){this.tone(e,.03,"sine",t)}nomiChime(){this.tone(1318.5,.35,"sine",.09),this.tone(987.8,.5,"sine",.08,.14),this.tone(2637,.2,"sine",.02,0)}naviAlert(){this.tone(880,.12,"sine",.1),this.tone(1174.7,.18,"sine",.1,.13)}pling(){this.tone(1567.98,.25,"triangle",.08),this.tone(2093,.4,"sine",.06,.06)}coin(){this.tone(987.8,.08,"square",.04),this.tone(1318.5,.3,"square",.04,.07)}chime(){[523.25,659.25,783.99,1046.5].forEach((e,t)=>this.tone(e,.25,"triangle",.07,t*.07))}bad(){this.tone(330,.25,"sawtooth",.05,0,180)}crash(){this.tone(70,.5,"sine",.5,0,30),this.noiseBurst(.45,.4,{freq:1800,slideTo:300}),this.noiseBurst(.25,.18,{type:"bandpass",freq:3500,q:3,when:.03})}scrape(){this.noiseBurst(.35,.12,{type:"bandpass",freq:2600,q:6})}whoosh(){this.noiseBurst(.5,.18,{type:"bandpass",freq:400,slideTo:2500,q:1.5})}wiperTwitch(){this.tone(75,.12,"sawtooth",.05),this.noiseBurst(.08,.03,{type:"bandpass",freq:900,q:4})}wiperSweep(){this.tone(70,.9,"sawtooth",.035),this.tone(1400,.35,"sine",.012,.2,1800)}horn(){this.tone(415,.45,"square",.06),this.tone(523,.45,"square",.05)}blinker(){this.tone(2400,.02,"square",.03)}flash(){this.noiseBurst(.05,.15,{type:"highpass",freq:3e3}),this.tone(3200,.6,"sine",.02,.05,6e3)}megafon(){this.tone(900,.4,"square",.04,0,1300)}click(){this.tone(1200,.04,"square",.02)}jingle(){[523.25,659.25,783.99,1046.5,987.77,1046.5].forEach((t,n)=>this.tone(t,.22,"triangle",.06,n*.12))}brunnenJingle(){[392,523.25,659.25,523.25,784].forEach((e,t)=>this.tone(e,.3,"sine",.07,t*.16)),this.noiseBurst(1.2,.03,{type:"highpass",freq:4e3,when:.1})}record(){[659.25,783.99,987.77,1318.5].forEach((e,t)=>this.tone(e,.35,"triangle",.08,t*.1))}confetti(){this.noiseBurst(.15,.3,{type:"lowpass",freq:600});for(let e=0;e<8;e++)this.tone(1500+Math.random()*2500,.05,"sine",.02,.1+e*.04)}};var o0="Mini Adam",a0="Tesla-Navi ferngesteuert",l0="Live-Eskalationen immer woanders!",nd=[{name:"Tesla Supercharger Erlensee",short:"Supercharger Erlensee",note:"Hier begann am 30.01.2021 das allererste Navi-Experiment.",km:[1.6,3.2]},{name:"Hochofenwerk Phoenix West, Dortmund",short:"Phoenix West",note:"Ziel des ersten Navi-Streams (429,16 km).",km:[2.2,4]},{name:"Burg Hauneck, Haunetal",note:"Das erste Ziel, das 2022 wirklich erreicht wurde.",km:[1.8,3.4]},{name:"Megahub Lehrte",note:"G\xFCterbahnhof. Der Chat war erleichtert.",km:[1.8,3.6]},{name:"Arnhem (Niederlande)",note:"Kurz mal Ausland.",km:[2.5,4.6]},{name:"Gifhorn, Supermarkt-Parkplatz",note:"Historisch bedeutsam. Polizei Gifhorn gr\xFC\xDFt.",km:[2,3.8],special:"gifhorn"},{name:"Liberec (Tschechien)",note:"Ziemlich weit. Wird bestimmt gleich \xFCberboten.",km:[6,8.5]},{name:"Wartburg, Eisenach",note:"Dort gibt es einen Automaten mit 0-Euro-Geldscheinen.",km:[1.8,3.5]},{name:"Drive-In: Pommes ohne R\xFCckfragen",note:"Die legend\xE4re Drive-In-Wette.",km:[1.4,2.6],special:"pommes"},{name:"Malte in Norderstedt abholen",short:"Malte abholen",note:"Die Bahn f\xE4llt mal wieder aus.",km:[2.6,4.8],special:"malte"},{name:"Burg Ronneburg",note:"Burgen gehen immer.",km:[1.6,3]},{name:"Rastplatz Sch\xE4ferborn Ost",short:"Sch\xE4ferborn Ost",note:"Endstation der dritten Navi-Runde.",km:[1.4,2.8]},{name:"Weser-Skywalk, Beverungen",note:"Aussicht mit Wackelfaktor.",km:[2,3.6]},{name:"Ionity-Ladestation Kirchheim",short:"Ionity Kirchheim",note:"Strom tanken mit Stil.",km:[1.5,3],special:"charger"},{name:"Tesla Supercharger Mogendorf",short:"Supercharger Mogendorf",note:"Hier endete die 723-km-Tour 2021.",km:[1.8,3.2],special:"charger"},{name:"K\xF6ln",note:"Wo genau? Egal, Hauptsache K\xF6ln.",km:[2.2,4]},{name:"Siegen",note:"Wurde schon oft gespendet. Setzt sich fast nie durch.",km:[2,3.5],special:"siegen",weight:.25},{name:"Bispingen",note:"Schnee im Sommer.",km:[2.4,4.2]},{name:"Sizilien (wegen Monte)",note:"Ein ganz normaler Ostersamstag.",km:[8,11]},{name:"Gardasee",note:"Die Oster-Tour l\xE4sst gr\xFC\xDFen.",km:[5,7]},{name:"Burg Staufen",note:"Silvester-Feeling.",km:[2.2,3.8]},{name:"Kassel \u2013 Elsa besuchen",note:"Spirit-Animal von SkylineTV LIVE.",km:[2,3.8],special:"elsa"},{name:"Fulda",note:"Startort der VIP-Edition.",km:[1.6,3]},{name:"Frankfurt am Main \u2013 Skyline",note:"Heimat von SkylineTV.",km:[2.4,4.4]},{name:"Bad Soden-Salm\xFCnster (Popcorn an der Lades\xE4ule)",note:"Haushaltsger\xE4te an der E-S\xE4ule testen.",km:[1.6,3],special:"charger"},{name:"Bischofsheim in der Rh\xF6n (Starlink)",note:"Erster Starlink-IRL-Stream der Welt.",km:[2.2,3.8]},{name:"Dortmund \u2013 die richtige Currywurstbude",note:"Diesmal ganz sicher die richtige.",km:[1.8,3.2],special:"bude"},{name:"Ein sehr sch\xF6ner Brunnen",note:"F\xFCr eine neue Folge BrunnenTV.",km:[1.4,2.8],special:"brunnen"},{name:"Meister Propper abholen",note:"Er ist ganz bestimmt gleich da.",km:[1.6,3],special:"propper"},{name:"Sparkasse (Farbe pr\xFCfen)",note:"Der Wissenschaftliche Dienst braucht Daten.",km:[1.4,2.6],special:"sparkasse"}],c0=["rot","blau","wei\xDF","rot (wie immer)","\xFCberraschend orange"],fM=["Ebbelwoi","Handk\xE4s","Brunnen","Schnitzel","Navi","Pl\xFCsch","Rettich","Elsa","Sparkassen","Blinker","Wischer","Kassel","Fulda","Gifhorn","Mainz","Rasthof","Akku","Supercharger","Dampfcola","Bananensaft","Kanalpunkte","Pommes","Funkloch","Drohnen","Starlink","Spurwechsel","Autobahn","Leitplanken","Ortsspenden","Rahmen","FullHD","Konfetti","Megafon","Ringtennis","Pandam\xFCtzen"],pM=["_FFM","77","_HD","3000","333","_Fan","fahrer","freund","hesse","_LIVE","42","_93","k\xF6nig","prinzessin","opa","tante","kumpel","_VIP","2017","liebe","meister","_on_tour","1337","xd"];function $i(){return tt(fM)+tt(pM)}function h0(i){let e=0;for(let t=0;t<i.length;t++)e=(e*31+i.charCodeAt(t))%360;return`hsl(${e}, 75%, 68%)`}var Ol={james:{name:"James",icon:"\u{1F4B6}",role:"Finanz-Bot"},claudia:{name:"Claudia",icon:"\u2699\uFE0F",role:"Aktions-Bot"},victoria:{name:"Victoria",icon:"\u{1F3C6}",role:"Sieges-B\xF6ttin"},hugo:{name:"Hugo",icon:"\u23F0",role:"Hilfs-Bot"},nora:{name:"Nora",icon:"\u{1F5A5}\uFE0F",role:"Server-Bot"}},St={ambient:["Gr\xFC\xDFe aus {city}! \u{1F44B}","Hallo Mini Adam \u2764","Ist das Bild wirklich Full HD?","Wo seid ihr gerade?","Welche Farbe hat die Sparkasse hier?","Gibt es in {city} einen Ringtennis-Verein?","Rechts fahren, Adam! \u{1F605}","Sch\xF6ne Landschaft heute","Wie viel Akku noch?","Wann kommt Meister Propper?","Malte Malte Malte Malte Malte","Erz\xE4hl mal die Raab-Story!","Das Bild ist so scharf \u{1F60D}","Elsa \u2764\u{1F41F}","BrunnenTV wann?","Bananensaft-Pause? \u{1F34C}","Kappandram\xE4\xDFige Zusammenfassung bitte, bin grad erst rein","Wir sind auf der Autobahn und streamen in Full HD! \u{1F3B6}","Wohin fahren wir eigentlich?","Das Navi-Ziel \xE4ndert sich eh gleich wieder","Gr\xFC\xDFe ans Sprachstudio!","Danke an alle Ehrenmenschen \u{1F64F}","Tic Tac jemand?","Pandam\xFCtze aufsetzen!","Ich biete 1 Cent mehr \u{1F911}","Was ist eigentlich im Kofferraum?","Gr\xFC\xDFe an die Polizei Gifhorn \u{1F46E}","Ist das die A7?","Sch\xF6ner Tesla \u{1F5A4}","Der Wischer ist auch nur ein Mensch","Nils wei\xDF bestimmt, wann wir das letzte Mal hier waren","Bester Stream der Woche","Die Pl\xFCsch-H\xE4nde am Lenkrad \u{1F602}","Gleich kommt bestimmt ein Brunnen","Tesla-Taxi spielen wann?","Erster! (nicht)","Falsche Bude? \u{1F602}","Wer hat das Navi so eingestellt","Adam, schreib mal eine Zahl in den Chat","Was l\xE4uft da im Radio?","Live-Eskalationen immer woanders \u{1F525}"],leftLane:["LINKS IST FREI!!! \u2B05\uFE0F","Endlich linke Spur \u{1F680}","Gib ihm!","Eine Minute Freiheit!","Danke f\xFCr die Freischaltung!","\u2B05\uFE0F\u2B05\uFE0F\u2B05\uFE0F","Jetzt aber links!","Linke Spur, Baby!"],leftLaneEnd:["Und wieder rechts \u{1F605}","Rechtsfahrgebot!","War sch\xF6n, solange es ging","Nochmal freischalten!"],naviChanged:["Wer war das? \u{1F602}","Nicht schon wieder!","\xDCberboten! \u{1F911}","Navi ferngesteuert \u{1F525}","Wendeman\xF6ver incoming","Das Navi wei\xDF auch nicht mehr weiter","Ich biete 1 Cent mehr","Klassiker","Jetzt aber wirklich!","NEIN \u{1F602}"],naviReached:["ANGEKOMMEN! \u{1F389}","Geschafft!!!","Und jetzt?","Gibt es hier eine Sparkasse?","Wo ist der Guide?","Ziel erreicht \u{1F3C1}"],crash:["Rezeption!","Uff \u{1F648}","Das gibt \xC4rger","Polizei Gifhorn ist unterwegs \u{1F693}","Blechschaden!","Hoffentlich hat das keiner gesehen","Eskalation! \u{1F602}","Das war die falsche Spur"],nearMiss:["WAS WAR DAS \u{1F631}","Knapp!!!","Millimeterarbeit","CLIP!","Clip it!","Puh\u2026","Mutig!"],rainStart:["Regen \u{1F327}","Jetzt wird es spannend","Wischer.exe reagiert nicht","Auto-Wischer (Beta) \u{1F602}","Der Herr mit den Schirmen freut sich","Ab jetzt gibt es Regenzulage!"],wiper:["Der Wischer zuckt wieder \u{1F602}","Der Wischer wischt nicht, der winkt nur","Software-Update wann?","Das ist kein Bug, das ist ein Feature","Wischer-Firmware 0.1 Beta","Mach doch einfach manuell!","Der Wischer ist sch\xFCchtern"],police:["POLIZEI GIFHORN \u{1F693}","Polizei Gifhorn kommt!","Benehmen jetzt!","Ganz ruhig bleiben\u2026","\u{1F46E}\u{1F46E}\u{1F46E}"],funkloch:["F","F","F","Ton f","/cam2","F","Bild weg?","F"],funklochBack:["\u2714\uFE0F","\u2714\uFE0F","\u2714\uFE0F Bild ist wieder da","Da ist es wieder \u2714\uFE0F"],frog:["\u{1F438}","\u{1F438}\u{1F438}","Frosch!","\u{1F438} HDMI-Kabel?"],blitzer:["\u{1F4F8}","L\xE4cheln! \u{1F4F8}","Das Foto kommt in einen Rahmen","Tsch\xFCss, du Betr\xFCger!","Teures Selfie"],elefant:["Elefantenrennen \u{1F418}\u{1F418}","Das dauert\u2026","\xDCberholverbot wann?","Die stehen ja fast"],trunk:["Kofferraum auf! \u{1F602}","Was ist da drin?","Bitspende-Eskalation","Konfetti im Kofferraum?"],brunnen:["BRUNNENTV!!!","Herr Sch\xF6nnbrun!","Brunnen gesichtet! \u26F2","Neue Folge BrunnenTV!"],elsa:["ELSA!!! \u2764\u{1F41F}","Elsa \u2764","Spirit-Animal gesichtet!","\u{1F451}\u{1F41F}"],record:["REKORD!!! \u{1F389}","Neuer Zuschauerrekord!","Diesmal ohne Viewer-Bots \u{1F916}","Hype!"],banana:["\u{1F34C}\u{1F34C}\u{1F34C}","Bananensaft-Power!","Lecker \u{1F34C}"],koriander:["B\xE4h, Koriander \u{1F922}","Nicht der Koriander!","Wer hat da Koriander bestellt?"],shoulder:["Standstreifen?! \u{1F631}","Polizei Gifhorn!!","Das ist keine Fahrspur!"],fiveJobs:["Job erledigt \u2705","Weiter so!","Noch ein Job weniger"],rahmen:["Sch\xF6ner Rahmen \u{1F602}","Ich sehe nichts mehr","Bestes Geld ever","Danke f\xFCr den Rahmen!"],zahl:()=>mt(.75)?mM():String(Vr(10,9999))};function mM(){let i=Vr(2,4),e="";for(let t=0;t<i;t++)e+=mt(.62)?"3":String(Vr(0,9));return e.includes("3")||(e="3"+e.slice(1)),e}function id(i,e={}){return i.replace(/\{(\w+)\}/g,(t,n)=>e[n]!==void 0?e[n]:tt(gM))}var gM=["Fulda","Kassel","Gifhorn","Mainz","K\xF6ln","Siegen","Hanau","Darmstadt","Bielefeld","Buxtehude","Konstanz","Augsburg","Bremen","N\xFCrnberg","Hamburg","L\xFCbeck","Trier","Erlensee"];function u0(i){return i>=100?"ALTER!":i>=50?"Mittelalter":i>=33?"Drittel-Alter":i>=25?"Viertel-Alter":i>=20?"F\xFCnftel-Alter":i>=10?"Zehntel-Alter":null}var Qs={kassandra:{label:"Fr\xE4ulein Kassandra",pitch:1.35,rate:1},weronika:{label:"Weronika",pitch:1.1,rate:.95},karla:{label:"Karla",pitch:1,rate:1.05},william:{label:"Br\xFCll-William",pitch:.55,rate:1.12},board:{label:"NOMI",pitch:1.18,rate:1.04},schoennbrun:{label:"Herr Sch\xF6nnbrun",pitch:.45,rate:.82}},d0=[{voice:"kassandra",text:"Treffen sich zwei Unterhosen. Fragt die eine: Warst du im Urlaub? Du bist so braun."},{voice:"karla",text:"Hallo Mini Adam, liebe Gr\xFC\xDFe aus {city}. Dachs gr\xFC\xDFt Efeu."},{voice:"william",text:"Mini Adam, bitte einmal hupen! Bimmel hurra!"},{voice:"weronika",text:"Hier spricht Meister Propper. Ich bin in f\xFCnf Minuten da."},{voice:"karla",text:"Gr\xFC\xDFe an das Sprachstudio und an alle Ehrenmenschen!"},{voice:"weronika",text:"Mini Adam, wann gibt es endlich eine neue Folge BrunnenTV?"},{voice:"kassandra",text:"Liebe Gr\xFC\xDFe an Elsa!"},{voice:"karla",text:"Gibt es in {city} eigentlich einen Ringtennis-Verein?"},{voice:"weronika",text:"Welche Farbe hat die Sparkasse in {city}?"},{voice:"william",text:"Mini Adam, erz\xE4hl doch mal die Raab-Story!"},{voice:"karla",text:"Wir sind auf der Autobahn und streamen in Full HD!"},{voice:"william",text:"Ich biete einen Cent mehr. Neues Ziel: {city}."},{voice:"kassandra",text:"Bitte rechts fahren. Mit freundlichen Gr\xFC\xDFen, die Polizei Gifhorn."},{voice:"weronika",text:"Mini Adam, du f\xE4hrst besser als jedes Navi."},{voice:"karla",text:"Hallo Mini Adam! Schreib mal eine Zahl in den Chat. Aber bitte ohne Drei."},{voice:"william",text:"Kappandram\xE4\xDFige Zusammenfassung bitte! Ich war beim Schwimmunterricht."}],f0=[{voice:"karla",text:"Guten Tag, hier ist der Herr mit den Schirmen. Ich w\xFCrde meine Schirme gerne heute noch abholen."},{voice:"weronika",text:"Mini Adam, dein Scheibenwischer winkt mir gerade zu. Ich winke zur\xFCck!"},{voice:"kassandra",text:"Achtung, Achtung. Der automatische Scheibenwischer befindet sich weiterhin in der Beta-Phase."}],Qn={leftLane:"Die linke Fahrspur ist freigeschaltet.",leftLaneEnd:"Die linke Fahrspur ist wieder gesperrt. Bitte rechts fahren.",naviChanged:"Das Navi-Ziel wurde ge\xE4ndert.",arrived:"Sie haben Ihr Ziel erreicht.",rain:"Regen erkannt. Automatische Scheibenwischer aktiviert.",lowBattery:"Akku schwach. Bitte bald laden.",veryLowBattery:"Akku fast leer. Die Stream-Technik schaltet gleich ab.",elefant:"Achtung. Elefantenrennen voraus.",blitzer:"Hinweis: Tempolimit. Station\xE4rer Blitzer voraus.",shoulder:"Hinweis: Der Standstreifen ist keine Fahrspur.",funkloch:"Verbindung schwach. Mobilfunk wird neu geb\xFCndelt."},p0=[{id:"rosen",name:"Rosenrahmen",price:12,dur:9},{id:"rettich",name:"Rettichrahmen",price:13.69,dur:9},{id:"pommes",name:"Pommes-Rahmen",price:5,dur:7},{id:"pappkarton",name:"Pappkartonhaufen",price:10,dur:8},{id:"haelfte",name:"Bildh\xE4lfte abdecken",price:10,dur:3.5},{id:"elsa",name:"Elsa auf den Bildschirm zaubern",price:2.9,dur:6},{id:"burger",name:"Burger-Rahmen",price:14,dur:8},{id:"candy",name:"Candy-Rahmen",price:10,dur:8},{id:"lego",name:"Lego-Rahmen",price:12,dur:8},{id:"briefmarken",name:"Briefmarken-Rahmen",price:10.01,dur:8},{id:"chips",name:"Chipsrahmen",price:5,dur:7},{id:"keinerechte",name:"Keine-Rechte-Bildrahmen",price:10,dur:7},{id:"kuerbis",name:"K\xFCrbis im Stream",price:4.9,dur:6}],r0=[{km:0,job:"Brownietester",src:"19.03.2020, Ersatzstream im Homeoffice"},{km:1,job:"Briefmarkenautomatenbef\xFCller",src:"26.03.2020, Ersatzstream im Homeoffice"},{km:2,job:"Plumpsklo-Ingenieur",src:"20.09.2018, M\xFCnster"},{km:3,job:"baut k\xFCnstliche Maulwurfstunnel",src:"02.01.2020, Cuxhaven"},{km:4,job:"Bildumdreher im Frankfurter Kunstmuseum",src:"05.03.2020, Werne"},{km:5,job:"Krokodilw\xE4chter im Frankfurter Zoo",src:"26.05.2019, Fulda"},{km:6.5,job:"Qualit\xE4tssicherung f\xFCr Schilder (pr\xFCft die Druckaufl\xF6sung)",src:"30.03.2017, M\xFCnchen"},{km:8,job:"wartet Schornsteine in Wolkenkratzern",src:"13.12.2019, Salzburg"},{km:10,job:"richtet WLAN in Flugzeugen ein",src:"25.07.2019, Karlsruhe"},{km:12,job:"schreibt die Algorithmen f\xFCr die roten und orangenen Bereiche bei Google Maps",src:"23.05.2019, Freising"},{km:15,job:"macht statistische Modelle f\xFCr die Endzeit der Benzintankstellen",src:"07.10.2022, Golfen im Park"},{km:20,job:"Teilchenbeschleuniger",src:"06.02.2021, Tesla-Navi ferngesteuert"}];function m0(i){let e=r0[0];for(let t of r0)i>=t.km&&(e=t);return e}var g0=[{id:"left20",text:"20 Sekunden auf der freigeschalteten linken Spur",goal:20,stat:"leftLaneTime"},{id:"navi1",text:"Ein Navi-Ziel erreichen",goal:1,stat:"naviReached"},{id:"near3",text:"3\xD7 haarscharf \xFCberholen",goal:3,stat:"nearMisses"},{id:"speed200",text:"200 km/h fahren",goal:200,stat:"maxSpeedKmh"},{id:"banana2",text:"2\xD7 Bananensaft einsammeln",goal:2,stat:"bananas"},{id:"clean5",text:"5 km ohne Blechschaden",goal:5e3,stat:"cleanDistance"},{id:"changes3",text:"3 Navi-\xC4nderungen \xFCberstehen",goal:3,stat:"naviChanges"},{id:"viewers1000",text:"1.000 Zuschauer erreichen",goal:1e3,stat:"maxViewers"},{id:"charge2",text:"2 Lade-Ringe einsammeln",goal:2,stat:"charges"},{id:"dist8",text:"8 km Strecke schaffen",goal:8e3,stat:"distance"},{id:"blitzfrei",text:"An einem Blitzer vorbei, ohne geblitzt zu werden",goal:1,stat:"blitzerClean"},{id:"rain1",text:"1 km im Regen fahren",goal:1e3,stat:"rainDistance"}],Vo=[{id:"boost",icon:"\u26A1",name:"Beschleunigungs-Boost",cat:"Leistung",prices:[300,700,1500],desc:"Over-the-Air-Update f\xFCr mehr Bums. Zieht los wie der Chat bei einer Ortsspende.",effect:i=>`Beschleunigung +${i*20} %`},{id:"vmax",icon:"\u{1F3C1}",name:"Tempo-Freischaltung",cat:"Leistung",prices:[400,900,1900],desc:"Hebt die Software-Drossel auf. Stufe 3 ist der Performance-Modus.",effect:i=>`H\xF6chstgeschwindigkeit ${[200,215,233,261][i]} km/h`},{id:"akku",icon:"\u{1F50B}",name:"Akku-Puffer",cat:"Akku",prices:[350,800,1600],desc:"Mehr nutzbare kWh. Offiziell bleibt es nat\xFCrlich beim 75-kWh-Akku.",effect:i=>`${75+i*4} kWh nutzbar`},{id:"encoder",icon:"\u{1F4E1}",name:"Stream-Technik-Update",cat:"Akku",prices:[300,700,1400],desc:"Telekom, Vodafone und O\u2082 werden effizienter geb\xFCndelt. Die Technik im Kofferraum frisst weniger Strom.",effect:i=>`Stromverbrauch der Stream-Technik \u2212${i*15} %`},{id:"reifen",icon:"\u{1F6DE}",name:"Sportreifen",cat:"Fahrwerk",prices:[350,900],desc:"Mehr Grip f\xFCr schnelle Spurwechsel, auch bei Regen.",effect:i=>`Spurwechsel +${i*12} %, besserer Nassgrip`},{id:"polster",icon:"\u{1F9F8}",name:"Pl\xFCsch-Polster",cat:"Fahrwerk",prices:[500,1300],desc:"Rundum-Polsterung aus original Mini-Adam-Pl\xFCsch. Steckt einen Rempler mehr weg.",effect:i=>`${3+i} Karosserie-Punkte`},{id:"wischer",icon:"\u{1F327}\uFE0F",name:"Wischer-Firmware (Beta)",cat:"Sicht",prices:[250,600,1200],desc:"Der automatische Wischer wischt jetzt manchmal. Manchmal. Zucken bleibt Kult.",effect:i=>["Version 0.1 Beta: zuckt nur","Version 11.1 Beta: wischt ab und zu","Version 11.2 Beta: wischt \xF6fter","Version 12 (immer noch Beta)"][i]},{id:"megafon",icon:"\u{1F4E2}",name:"Megafon",cat:"Spa\xDF",prices:[450],desc:"Wie in Gifhorn: Mit einer Megafon-Durchsage macht der Verkehr vor dir Platz. Taste H.",effect:()=>"Autos vor dir wechseln die Spur"},{id:"starlink",icon:"\u{1F6F0}\uFE0F",name:"Starlink-Sch\xFCssel",cat:"Spa\xDF",prices:[1100],desc:"Wie beim ersten Starlink-IRL-Stream der Welt: keine Funkl\xF6cher, mehr Zuschauer, mehr Spenden.",effect:()=>"Keine Funkl\xF6cher, +25 % Zuschauer, +20 % Spenden"},{id:"linksspur",icon:"\u2B05\uFE0F",name:"Linke-Spur-Sammelaktion",cat:"Spa\xDF",prices:[400,1e3],desc:"Die Community sammelt flei\xDFiger: Die linke Spur wird \xF6fter freigeschaltet und zahlt besser.",effect:i=>`Linke-Spur-Bonus +${i*25} %, h\xE4ufiger`},{id:"elsa",icon:"\u{1F451}",name:"Wackel-Elsa",cat:"Deko",prices:[120],desc:"Das Spirit-Animal von SkylineTV LIVE als Wackelfigur f\xFCrs Armaturenbrett.",effect:()=>"Wackelt bei jeder Kurve mit"},{id:"weste",icon:"\u{1F9BA}",name:"Warnweste",cat:"Deko",prices:[90],desc:"F\xFCr Mini Adam. Bringt nichts, sieht aber sehr professionell aus.",effect:()=>"Sichtbar beim Kameraschwenk"},{id:"konfetti",icon:"\u{1F389}",name:"Konfetti-Kanone",cat:"Deko",prices:[200],desc:"Knallt bei jedem erreichten Ziel. Ein paar Schnipsel kleben danach an der Scheibe \u2013 wie 2022.",effect:()=>"Konfetti bei Navi-Zielen"}],zl=Object.fromEntries(Vo.map(i=>[i.id,i.prices.length])),v0=[["Fahrer","Mini Adam"],["Kamera","station\xE4r"],["Drohne","die Drohne"],["Sprachstudio","das Sprachstudio"],["Scheibenwischer","Auto-Wischer (Beta)"],["Navigation","ferngesteuert vom Chat"]];function x0(i=1,e=30){let t=Se(i,e);return mt(.15)?13.69:mt(.1)?3.33:Math.round(t*100)/100}var Gl=class{constructor(){if(this.supported=typeof window<"u"&&"speechSynthesis"in window&&typeof SpeechSynthesisUtterance<"u",this.enabled=!0,this.voices=[],this.queue=[],this.busy=!1,this.current=null,this.supported){let e=()=>{let t=window.speechSynthesis.getVoices();this.voices=t.filter(n=>/^de(-|_|$)/i.test(n.lang))};e(),window.speechSynthesis.onvoiceschanged=e}}pickVoice(e){if(!this.voices.length)return null;let t={board:[/Google Deutsch/i,/Anna/i,/Hedda/i,/Katja/i,/Petra/i,/Helena/i],kassandra:[/Anna/i,/Google Deutsch/i,/Katja/i,/Hedda/i],weronika:[/Hedda/i,/Petra/i,/Google Deutsch/i],karla:[/Katja/i,/Google Deutsch/i,/Anna/i],william:[/Stefan/i,/Markus/i,/Yannick/i,/Conrad/i,/Google Deutsch/i],schoennbrun:[/Stefan/i,/Markus/i,/Yannick/i,/Conrad/i]}[e]||[];for(let n of t){let s=this.voices.find(r=>n.test(r.name));if(s)return s}return this.voices[0]}estimate(e,t=1){return Math.max(1.2,e.length/14/t)}say(e,t="board",n={}){let s=Qs[t]||Qs.board,r=this.estimate(e,s.rate),o={text:e,voiceKey:t,opts:n,dur:r};if(n.priority)this.queue=this.queue.filter(a=>a.opts.priority),this.current&&!this.current.opts.priority&&this.cancelCurrent(),this.queue.unshift(o);else{if(this.queue.length>2)return r;this.queue.push(o)}return this.pump(),r}cancelCurrent(){if(this.supported)try{window.speechSynthesis.cancel()}catch{}this.current?.timer&&clearTimeout(this.current.timer);let e=this.current;this.current=null,this.busy=!1,e?.opts.onEnd?.()}pump(){if(this.busy||!this.queue.length)return;let e=this.queue.shift();this.busy=!0,this.current=e;let t=Qs[e.voiceKey]||Qs.board;e.opts.onStart?.(e.dur);let n=()=>{this.current===e&&(e.timer&&clearTimeout(e.timer),this.current=null,this.busy=!1,e.opts.onEnd?.(),setTimeout(()=>this.pump(),250))};if(this.supported&&this.enabled&&this.voices.length)try{let s=new SpeechSynthesisUtterance(e.text);s.lang="de-DE";let r=this.pickVoice(e.voiceKey);r&&(s.voice=r),s.pitch=t.pitch,s.rate=t.rate,s.volume=1,s.onend=n,s.onerror=n,window.speechSynthesis.speak(s),e.timer=setTimeout(n,(e.dur+4)*1e3);return}catch{}e.timer=setTimeout(n,e.dur*1e3)}stopAll(){this.queue=[],this.cancelCurrent()}pause(e){if(this.supported)try{e?window.speechSynthesis.pause():window.speechSynthesis.resume()}catch{}}};var Vl=class{constructor(){this.keys=new Set,this.pressed=new Set,this.touch={left:!1,right:!1,gas:!1,brake:!1},this.steer=0,this.throttle=0,this.brake=0,this.anyKey=!1,this.lastDevice="keyboard";let e={ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right",ArrowUp:"gas",KeyW:"gas",ArrowDown:"brake",KeyS:"brake",Space:"horn",KeyE:"wiper",KeyH:"megafon",Escape:"pause",KeyP:"pause",KeyV:"camera",KeyM:"mute",Enter:"confirm",KeyC:"chat"};this.map=e,window.addEventListener("keydown",t=>{let n=e[t.code];if(!(t.target&&/input|textarea|select/i.test(t.target.tagName))&&(this.anyKey=!0,this.lastDevice="keyboard",n)){this.keys.has(n)||this.pressed.add(n),this.keys.add(n);let s=t.target&&t.target.tagName==="BUTTON"&&t.target.offsetParent!==null;["left","right","gas","brake","horn"].includes(n)&&!s&&t.preventDefault()}}),window.addEventListener("keyup",t=>{let n=e[t.code];n&&this.keys.delete(n)}),window.addEventListener("blur",()=>this.keys.clear()),this.padPrev={}}bindTouch(e,t){let n=r=>{r.preventDefault(),this.lastDevice="touch",t in this.touch?this.touch[t]=!0:this.pressed.add(t)},s=r=>{r.preventDefault(),t in this.touch&&(this.touch[t]=!1)};e.addEventListener("pointerdown",n),e.addEventListener("pointerup",s),e.addEventListener("pointercancel",s),e.addEventListener("pointerleave",s)}poll(){let e=0,t=0,n=0;(this.keys.has("left")||this.touch.left)&&(e-=1),(this.keys.has("right")||this.touch.right)&&(e+=1),(this.keys.has("gas")||this.touch.gas)&&(t=1),(this.keys.has("brake")||this.touch.brake)&&(n=1);let s=navigator.getGamepads?navigator.getGamepads():[];for(let r of s){if(!r)continue;let o=r.axes[0]||0;Math.abs(o)>.15&&(e=o,this.lastDevice="gamepad");let a=r.buttons[7]?.value||0,l=r.buttons[6]?.value||0;a>.05&&(t=Math.max(t,a)),l>.05&&(n=Math.max(n,l)),r.buttons[12]?.pressed&&(t=1),r.buttons[13]?.pressed&&(n=1);let c=(h,u)=>{let d=r.index+":"+h,f=!!r.buttons[h]?.pressed;f&&!this.padPrev[d]&&(this.pressed.add(u),this.anyKey=!0),this.padPrev[d]=f};c(0,"horn"),c(2,"wiper"),c(3,"megafon"),c(9,"pause"),c(1,"camera")}this.steer=Math.max(-1,Math.min(1,e)),this.throttle=t,this.brake=n}take(e){return this.pressed.has(e)?(this.pressed.delete(e),!0):!1}endFrame(){this.pressed.clear(),this.anyKey=!1}};var sd="mini-adam-tesla-navi-v1",er={wallet:0,upgrades:{},best:{distance:0,earned:0,viewers:0},stats:{runs:0,totalKm:0,naviReached:0,crashes:0,leftLaneEuro:0},settings:{sound:!0,speech:!0,chat:!0,quality:"auto",volume:.8},seenIntro:!1};function y0(){try{let i=localStorage.getItem(sd);if(!i)return structuredClone(er);let e=JSON.parse(i);return{...structuredClone(er),...e,best:{...er.best,...e.best||{}},stats:{...er.stats,...e.stats||{}},settings:{...er.settings,...e.settings||{}},upgrades:{...e.upgrades||{}}}}catch{return structuredClone(er)}}function tr(i){try{return localStorage.setItem(sd,JSON.stringify(i)),!0}catch{return!1}}function _0(){try{localStorage.removeItem(sd)}catch{}return structuredClone(er)}var Wl=1/3.6,vM=[200,215,233,261],rd=-7.8,M0=10,xM=7.9,Xl=class{constructor(){this.reset({})}reset(e={}){let t=n=>e[n]||0;this.upgrades=e,this.vmaxBase=vM[Math.min(3,t("vmax"))]*Wl,this.accelMul=1+.2*t("boost"),this.capacity=75+4*t("akku"),this.streamDrain=.1*(1-.15*t("encoder")),this.latMul=1+.12*t("reifen"),this.wetGrip=.66+.13*t("reifen"),this.maxHits=3+t("polster"),this.s=0,this.x=Ne.laneCenter(3),this.vx=0,this.speed=95*Wl,this.yaw=0,this.latAcc=0,this.steer=0,this.throttle=0,this.braking=0,this.battery=100,this.hits=0,this.cooldown=0,this.len=jn.length,this.w=jn.width,this.shoulderTime=0,this.scrapeCooldown=0,this.sugar=0,this.wobble=0,this.limiter=0,this.empty=!1,this.events=[]}get kmh(){return this.speed*3.6}get vmax(){return this.vmaxBase*(this.sugar>0?1.08:1)}get lane(){return Ke(Math.round((this.x+5.625)/3.75),0,3)}get inLeftLane(){return this.x<-3.75-.35}get onShoulder(){return this.x>xM}update(e,t,n={}){this.events.length=0;let s=n.wet||0,r=1-s*(1-this.wetGrip);this.cooldown=Math.max(0,this.cooldown-e),this.scrapeCooldown=Math.max(0,this.scrapeCooldown-e),this.sugar=Math.max(0,this.sugar-e),this.wobble=Math.max(0,this.wobble-e);let o=this.speed/55,a=.25*o*o*(.4+.6*Math.max(this.throttle,.35)),l=(this.streamDrain+a)*(75/this.capacity);this.battery=Math.max(0,this.battery-l*e),this.empty=this.battery<=0;let c=this.empty?0:Ke(t.throttle,0,1),h=Ke(t.brake,0,1);this.throttle=Hn(this.throttle,c,8,e),this.braking=h;let u=this.speed,d=this.vmax,f=0;if(c>.02&&u<d){let _=Ke(u/d,0,1);f+=c*5.4*this.accelMul*Math.max(.12,1-Math.pow(_,2.6))}h>.02&&(f-=h*9.5*(1-s*.18)),c<=.02&&h<=.02&&(f-=.12+11e-5*u*u+(this.empty?1.4:0)),u>d&&(f=Math.min(f,-1.5)),this.speed=Math.max(0,u+f*e),u<=d&&this.speed>d&&(this.speed=d);let m=Ke(t.steer,-1,1);this.wobble>0&&(m+=Math.sin(this.wobble*9)*.35),this.steer=Hn(this.steer,m,14,e);let v=Ke(this.speed/12,0,1),g=4.3*this.latMul*r*v,p;if(Math.abs(m)>.08)p=m*g;else{let _=Ne.laneCenter(this.lane);p=Ke((_-this.x)*2,-1.9,1.9)*v}let y=this.vx;if(this.vx=Hn(this.vx,p,8.5*r,e),this.latAcc=(this.vx-y)/Math.max(e,1e-4),this.x+=this.vx*e,this.x<rd||this.x>M0){let _=this.x<rd?-1:1;this.x=_<0?rd:M0;let x=Math.abs(this.vx)>1.2;this.vx=-_*Math.min(1.5,Math.abs(this.vx)*.4),this.scrapeCooldown<=0&&(this.scrapeCooldown=.6,this.speed*=x?.9:.97,this.events.push({type:"rail",side:_,hard:x}))}this.onShoulder&&this.speed>5?this.shoulderTime+=e:this.shoulderTime=Math.max(0,this.shoulderTime-e*2),this.yaw=Ke(Math.atan2(this.vx,Math.max(this.speed,4)),-.22,.22),this.s+=this.speed*e}collide(e){let t=this.cooldown<=0,n=e.car,s=e.lonOverlap>e.latOverlap*1.6;if(!s&&e.ds>0)this.s=n.s-(n.len+this.len)/2-.35,t?(this.speed=Math.max(0,Math.min(this.speed,n.speed)-4),n.speed+=2.5):this.speed=Math.min(this.speed,n.speed);else if(!s&&e.ds<0)t?(this.speed+=2,n.speed=Math.max(0,this.speed-4)):n.speed=Math.min(n.speed,this.speed),n.s=this.s-(n.len+this.len)/2-.4;else{let r=e.dx>0?-1:1;t?(this.x+=r*(e.latOverlap+.12),this.vx=r*3.2,this.speed*=.93,n.speed*=.97):(this.x+=r*(e.latOverlap+.05),this.vx=r*Math.max(1.5,this.vx*r))}return t?(this.hits++,this.cooldown=1.6,!0):!1}charge(e){this.battery=Math.min(100,this.battery+e),this.empty=!1}};function od(i){if(!i)return"";if(i.short)return i.short;let e=i.name.split(/[,(–:]/)[0].trim();return e.length>24?e.slice(0,23)+"\u2026":e}var yM={rot:"#d5121e",blau:"#1d5fbf",wei\u00DF:"#f2f2f2","rot (wie immer)":"#d5121e","\xFCberraschend orange":"#f07a12"},ql=class{constructor(e){this.scenery=e,this.requests=[],this.reset(0)}reset(e){for(let t of this.requests)this.scenery.cancel(t);this.requests=[],this.bid=.01,this.changes=0,this.history=[],this.set(e,nd[0],"Mini Adam",{first:!0})}pickTarget(){let e=this.target;return Uo(nd.filter(t=>t!==e),t=>t.weight??1)}overbid(e,t){let n=mt(.18)?Math.floor(Se(2,12)):1;this.bid=Math.round((this.bid+n*.01)*100)/100,this.changes++;let s=this.pickTarget();return this.set(e,s,t),s}set(e,t,n,{first:s=!1}={}){for(let r of this.requests)this.scenery.cancel(r,!this.arrived);this.requests=[],this.target=t,this.bidder=n,this.km=Se(t.km[0],t.km[1]),this.startS=e,this.targetS=e+this.km*1e3,this.recalc=s?0:1,this.wende=!s&&mt(.28),this.wendeS=e+Se(380,820),this.arrived=!1,this.side=mt(.5)?1:-1,this.sparkColor=tt(c0),this.history.push({name:t.name,bidder:n,bid:this.bid}),this.history.length>12&&this.history.shift(),this.placeLandmarks()}placeLandmarks(){let e=this.target,t=this.targetS,n=(s,r,o)=>this.requests.push(this.scenery.request(s,r,o));switch(n("ziel",t,{title:od(e)}),e.special){case"brunnen":n("brunnen",t-70);break;case"elsa":n("elsa",t-70);break;case"sparkasse":n("sparkasse",t-90,{color:yM[this.sparkColor]||"#d5121e"});break;case"pommes":n("kiosk",t-80,{title:"Drive-In",sub:"Pommes ohne R\xFCckfragen"});break;case"bude":n("kiosk",t-80,{title:"Currywurst",sub:"die richtige Bude (wirklich!)"});break;case"charger":n("charger",t-80);break;default:break}/Burg|Wartburg/.test(e.name)&&n("burg",t-40),/Frankfurt/.test(e.name)&&n("skyline",t+300)}get remaining(){return Math.max(0,this.targetS-this._s)}update(e,t){this._s=t;let n=[];return this.recalc=Math.max(0,this.recalc-e/2.4),this.wende&&t>this.wendeS&&(this.wende=!1,this.recalc=.8,n.push({type:"wendeIgnored"})),!this.arrived&&t>=this.targetS&&(this.arrived=!0,n.push({type:"arrived",target:this.target,km:this.km})),n}screen(e,t,n){let s=Math.max(0,this.targetS-e),r=t+s/Ke(n,20,70)*.5;return{target:this.arrived?"Warte auf das n\xE4chste Gebot \u2026":this.target.name,arrived:this.arrived,remaining:s,recalc:this.recalc,side:this.side,wende:this.wende,wendeS:this.wendeS,eta:this.arrived?"":"Ankunft "+Wr(r),bidder:this.bidder,bid:Zt(this.bid)}}};var _M=["POLIZEI GIFHORN","GUTE FAHRT, ADAM!","GIFHORN GR\xDCSST","BITTE L\xC4CHELN"],Yl=class{constructor(e){Object.assign(this,e),this.player=new Xl,this.navi=new ql(this.scenery),this.scenery.gantryInfo=(t=this.player.s)=>{let n=(this.navi.targetS-t)/1e3;return n<.2?null:{target:od(this.navi.target),km:n}},this.running=!1,this.over=null}start(e){this.save=e;let t=e.upgrades||{};this.up=t;let n=this.player;n.reset(t),this.t=0,this.money=0,this.breakdown={},this.over=null,this.running=!0,this.queue=[],this._greeted=!1,this._introChime=!1,this.clock=18*60,this.viewers=240,this.hype=0,this.peakViewers=240,this.recordShown=!1,this.lastHorn=-99,this.megafonCd=0,this.leftTick=0,this.chatT=1.5,this.donationT=Se(6,10),this.stats={leftLaneTime:0,naviReached:0,nearMisses:0,maxSpeedKmh:0,bananas:0,cleanDistance:0,naviChanges:0,maxViewers:0,charges:0,distance:0,blitzerClean:0,rainDistance:0,crashes:0,koriander:0,fines:0,wipes:0,twitches:0,photos:0},this.jobs=mp(g0).slice(0,5).map(r=>({...r,done:!1,progress:0})),this.allJobsPaid=!1;let s=t.linksspur||0;this.left={open:!1,timer:0,next:Se(22,30),warned:!1,glow:0,rg:0,grace:0,bonusMul:1+.25*s,freq:1-.14*s,earned:0},this.weather={level:0,target:0,active:!1,dur:0,cool:0,announced:!1,regenzulage:!1},this.T={bid:Se(38,52),durchsage:Se(28,40),rahmen:Se(70,100),funkloch:Se(110,170),frog:Se(160,260),trunk:Se(120,200),numbers:Se(80,130),police:Se(200,300),wiperChat:0},this.S={blitzer:Se(3e3,3800),elefant:Se(3200,4200),landmark:Se(1400,2e3),charge:Se(700,1e3),banana:Se(1100,1500),koriander:Se(2200,2800)},this.blitzer=null,this.landmark=null,this.funkloch=0,this.policeCar=null,this.shoulderWarned=!1,this.batteryWarned=0,this.lastHugo=0,this.scenery.reset(),this.navi.reset(0),this.traffic.reset(),this.traffic.populate(0,n.speed),this.pickups.reset(),this.speech.stopAll(),this.windshield.clear(),this.windshield.setRain(0),this.windshield.setFirmware(t.wischer||0),this.windshield.onEvent=r=>this.onWiper(r),this.cockpit.clearConfetti(),this.cockpit.setElsa(!!t.elsa),this.ui.reset?.(),this.ui.jobs(this.jobs),this.bot("hugo","Der Stream l\xE4uft! Viel Spa\xDF beim Zuschauen."),this.later(1.2,()=>this.chat("Hallo Mini Adam \u2764")),this.later(2,()=>this.chat("Wohin fahren wir heute?")),this.later(3.2,()=>this.bot("james",`Startgebot: ${Zt(this.navi.bid)} \u2013 Ziel: ${this.navi.target.name}`))}startDemo(){this.running=!1,this.over=null,this.demoT=0,this.player.reset({}),this.player.x=1.875,this.player.speed=118*Wl,this.weather={level:0,target:0,active:!1,dur:0,cool:0,announced:!1,regenzulage:!1},this.left={open:!1,timer:0,glow:0},this.sirenLevel=0,this.windshield.setRain(0),this.windshield.clear(),this.scenery.reset(),this.navi.reset(0),this.traffic.reset(),this.traffic.populate(0,this.player.speed),this.pickups.reset()}demo(e,t){this.demoT+=e;let n=this.player;n.update(e,t,{wet:0}),n.battery=100,n.hits=0,this.navi.update(e,n.s),this.navi.arrived&&this.navi.overbid(n.s,"Demo"),this.traffic.update(e,this.demoT,n,{difficulty:.15,leftOpen:!1,rain:0})}later(e,t){this.queue.push({at:this.t+e,fn:t})}chat(e,t=$i(),n={}){this.ui.chat&&this.ui.chat({name:t,text:id(e),...n})}bot(e,t){let n=Ol[e];this.ui.chat({name:n.name,text:t,bot:e,icon:n.icon})}burst(e,t=3,n=2.5){let s=typeof e=="function"?null:e;for(let r=0;r<t;r++)this.later(Se(.1,n),()=>this.chat(s?tt(s):e()))}say(e,t="talk",{priority:n=!0}={}){this.audio.nomiChime();let s=this.cockpit.nomi;s.setMood(t,3.2);let r=()=>{let o=this.speech.say(e,"board",{priority:n,onStart:a=>s.speak(a)});this.ui.nomi(e,o+.8)};this.running?this.later(.35,r):r()}earn(e,t,{mult:n=!0,silent:s=!1}={}){if(e<=0)return 0;let r=n&&this.weather.regenzulage?1.5:1,o=e*r;return this.money+=o,this.breakdown[t]=(this.breakdown[t]||0)+o,s||this.ui.money(o,t),o}fine(e,t){let n=Math.min(this.money,e);this.money-=n,this.breakdown[t]=(this.breakdown[t]||0)-n,this.stats.fines+=n,n>0&&this.ui.money(-n,t),this.audio.bad()}donate(e,t,n){let s=this.earn(t*(this.up.starlink?1.2:1),"Spenden",{silent:!0});this.bot("james",`${e} hat ${Zt(t)} ${n?"f\xFCr \xBB"+n+"\xAB ":""}gespendet!`),this.ui.money(s,"Spende"),this.audio.pling();let r=u0(t);return r&&this.later(.6,()=>this.chat(r+(t>=33?" \u{1F631}":""))),this.hype+=s*2,s}update(e,t,n){if(!this.running)return;this.t+=e;let s=this.player,r=this.stats,o=this.weather;if(this.queue.length){let h=this.t,u=this.queue.filter(d=>d.at<=h);if(u.length){this.queue=this.queue.filter(d=>d.at>h);for(let d of u)d.fn()}}let a=s.s;s.update(e,t,{wet:o.level});let l=s.s-a;for(let h of s.events)h.type==="rail"&&(this.audio.scrape(),this.fx.shake(h.hard?.5:.2),h.hard&&mt(.4)&&this.chat(tt(["Leitplanke! \u{1F62C}","Uff, die Leitplanke","Kratz kratz"])));r.distance=s.s,r.maxSpeedKmh=Math.max(r.maxSpeedKmh,s.kmh),r.cleanDistance+=l,o.level>.3&&(r.rainDistance+=l),this.clock+=e*.5,this.megafonCd=Math.max(0,this.megafonCd-e),t.horn&&this.honk(),t.wiper&&this.manualWiper(),t.megafon&&this.useMegafon();let c=this.traffic.update(e,this.t,s,{difficulty:Ke(s.s/16e3,0,1),leftOpen:this.left.open,rain:o.level});for(let h of c)h.type==="crash"?this.onCrash(h):h.type==="nearMiss"?this.onNearMiss(h):h.type==="passPolice"&&this.chat(tt(["Polizei \xFCberholt?! Mutig! \u{1F605}","Tsch\xFCss Polizei Gifhorn \u{1F44B}","Das gibt einen Eintrag ins Fahrtenbuch"]));this.over||(this.sirenLevel=0,this.policeCar&&(this.traffic.cars.includes(this.policeCar)?this.sirenLevel=Ke(1-Math.abs(this.policeCar.s-s.s)/260,0,1):this.policeCar=null),this.updateLeftLane(e),this.updateWeather(e,l),this.updateNavi(e),this.updateEvents(e),this.updatePickups(e,n),this.updateViewers(e),this.updateChat(e),this.updateJobs(),s.shoulderTime>1.2&&!this.shoulderWarned&&(this.shoulderWarned=!0,this.say(Qn.shoulder,"worried"),this.burst(St.shoulder,2,1.5)),s.shoulderTime>4.5&&(s.shoulderTime=0,this.fine(10,"Verwarngeld"),this.ui.toast("\u{1F693} Standstreifen: 10\xA0\u20AC Verwarngeld","bad"),this.callPolice("STANDSTREIFEN? NEIN!")),s.shoulderTime<=0&&(this.shoulderWarned=!1),s.battery>30?this.batteryWarned=0:s.battery>12&&this.batteryWarned>1&&(this.batteryWarned=1),s.battery<20&&this.batteryWarned<1&&(this.batteryWarned=1,this.say(Qn.lowBattery,"worried"),this.chat(tt(["Akku! \u{1F50B}","Wo ist der n\xE4chste Supercharger?","Lade-Ringe einsammeln!"]))),s.battery<7&&this.batteryWarned<2&&(this.batteryWarned=2,this.say(Qn.veryLowBattery,"worried")),s.empty&&s.speed<1.5&&this.end("akku"))}updateLeftLane(e){let t=this.left,n=this.player;if(!t.open)t.next-=e,t.next<=0&&this.openLeftLane();else{if(t.timer-=e,n.inLeftLane){let s=1.25*(.45+.55*Ke(n.speed/50,0,1.3))*t.bonusMul,r=this.earn(s*e,"Linke Spur",{silent:!0});t.earned+=r,this.leftTick+=r,this.stats.leftLaneTime+=e,this.leftTick>=1&&(this.ui.money(this.leftTick,"Linke Spur"),this.leftTick=0)}t.timer<=10&&!t.warned&&(t.warned=!0,this.ui.banner("\u23F3 Linke Spur: noch 10 Sekunden",2.5)),t.timer<=0&&this.closeLeftLane()}t.glow=Hn(t.glow,t.open?1:0,3,e),t.grace=Math.max(0,t.grace-e),!t.open&&n.inLeftLane&&t.grace<=0?(t.rg+=e,t.rg>7&&!t.rgWarned&&(t.rgWarned=!0,this.ui.toast("\u26A0\uFE0F Rechtsfahrgebot! Die linke Spur ist gesperrt.","bad"),this.callPolice("BITTE RECHTS FAHREN"),this.burst(["Rechts fahren! \u{1F605}","Rechtsfahrgebot!","Polizei Gifhorn kommt\u2026"],2,1.5)),t.rg>15&&(t.rg=0,t.rgWarned=!1,this.fine(10,"Verwarngeld"),this.ui.toast("\u{1F693} Rechtsfahrgebot missachtet: 10\xA0\u20AC Verwarngeld","bad"))):(t.rg=Math.max(0,t.rg-e*2),t.rg<=0&&(t.rgWarned=!1))}openLeftLane(){let e=this.left;e.open=!0,e.timer=60,e.warned=!1;let t=$i();this.say(Qn.leftLane,"happy"),this.audio.chime(),this.later(.2,()=>this.donate(t,tt([3.33,5,2.5,10,4.2]),"Linke Spur freischalten")),this.burst(St.leftLane,3,3),this.ui.banner("\u2B05\uFE0F Linke Spur freigeschaltet!",4,"Eine Minute Bonusguthaben auf der ganz linken Spur"),this.hype+=40}closeLeftLane(){let e=this.left;e.open=!1,e.next=Se(45,70)*e.freq,e.grace=5,this.say(Qn.leftLaneEnd,"idle"),e.earned>.5&&this.ui.toast(`\u2B05\uFE0F Linke Spur: ${Zt(e.earned)} Bonusguthaben`,"good"),e.earned=0,this.burst(St.leftLaneEnd,2,2.5)}updateWeather(e,t){let n=this.weather,s=this.player;if(n.active)n.dur-=e,n.dur<=0&&(n.active=!1,n.target=0,n.cool=Se(60,100),this.later(8,()=>this.chat(tt(["Endlich trocken \u2600\uFE0F","Regen vorbei!","Der Wischer hat sich erholt"]))));else{n.cool-=e;let o=s.s>=4e3&&this.stats.cleanDistance>=2500;n.cool<=0&&(o||s.s>=7500)&&(n.active=!0,n.target=Se(.6,1),n.dur=Se(95,150),n.announced=!1)}let r=n.target>n.level?.07:.05;n.level+=Ke(n.target-n.level,-r*e,r*e),n.active&&!n.announced&&n.level>.12&&(n.announced=!0,this.say(Qn.rain,"worried"),this.burst(St.rainStart,3,4),this.later(4,()=>this.ui.banner("\u{1F327}\uFE0F Regenzulage!",4,"Solange es regnet, gibt es 1,5-fach Guthaben")),this.audio.whoosh()),n.regenzulage=n.level>.3,this.windshield.setRain(n.level)}onWiper(e){e==="twitch"?(this.audio.wiperTwitch(),this.stats.twitches++):(this.audio.wiperSweep(),this.stats.wipes++),this.running&&e==="twitch"&&this.T.wiperChat<=0&&this.weather.level>.2&&mt(.3)&&(this.T.wiperChat=14,this.chat(tt(St.wiper)))}manualWiper(){let e=this.windshield.manual();e==="wipe"?this.ui.toast("\u{1F327}\uFE0F Wisch! Klare Sicht.","info"):e==="twitch"&&(this.ui.toast("\u{1F327}\uFE0F Der Wischer zuckt nur \u2026","info"),mt(.4)&&this.chat(tt(St.wiper)))}updateNavi(e){let t=this.player;if(this.T.bid<=0)if(this.T.bid=Se(36,72),mt(.16)){let n=$i();this.navi.bid=Math.round((this.navi.bid+.01)*100)/100,this.bot("james",`${n} bietet ${Zt(this.navi.bid)} \u2013 neues Ziel: Siegen`),this.chat(tt(["SIEGEN!","Siegen? \u{1F440}","Diesmal Siegen!"])),this.later(2.2,()=>this.changeNavi(!0))}else this.changeNavi(!1);for(let n of this.navi.update(e,t.s))n.type==="wendeIgnored"?(this.say("Route wird neu berechnet.","think",{priority:!1}),mt(.6)&&this.chat(tt(["Wenden auf der Autobahn? \u{1F602}","Bitte wenden\u2026 nein!","Das Navi gibt nicht auf"]))):n.type==="arrived"&&this.onArrive(n)}changeNavi(e){let t=this.player,n=$i(),s=this.navi.overbid(t.s,n);this.scenery.relabelGantries(),this.stats.naviChanges++,this.bot("james",`${n} bietet ${Zt(this.navi.bid)} \u2013 neues Ziel: ${s.name}`),e&&this.later(.8,()=>this.chat(tt(["Siegen wurde \xFCberboten. Wie immer \u{1F602}","Nicht schon wieder Siegen verpasst","Klassiker"]))),this.say(Qn.naviChanged,"think"),this.audio.naviAlert(),this.burst(St.naviChanged,2,3),s.special==="siegen"&&this.later(1.4,()=>this.chat("SIEGEN SETZT SICH DURCH?! \u{1F631}")),this.navi.wende&&this.later(3.5,()=>this.ui.toast("\u21A9\uFE0F Navi: \u201EBitte wenden\u201C \u2013 auf der Autobahn?","info")),this.ui.toast(`\u{1F4CD} Neues Navi-Ziel: ${s.name} (${on(this.navi.km,1)} km)`,"info",s.note),this.hype+=25}onArrive(e){let t=this.player,n=e.target;this.stats.naviReached++;let s=Math.round(20+e.km*14);switch(n.special==="siegen"&&(s*=2),this.say(Qn.arrived,"love"),this.audio.jingle(),this.earn(s,"Navi-Ziele"),this.ui.banner(`\u{1F3C1} Ziel erreicht: ${n.name}`,4),this.burst(St.naviReached,4,3),this.hype+=120,this.up.konfetti&&(this.cockpit.addConfetti(70),this.audio.confetti(),this.later(1,()=>this.chat("KONFETTI! \u{1F389}"))),n.special){case"charger":t.charge(35),this.ui.toast("\u{1F50C} Schnell geladen: +35 % Akku","good"),this.stats.charges++;break;case"gifhorn":this.later(1.5,()=>this.callPolice("GIFHORN GR\xDCSST!"));break;case"brunnen":this.later(1.2,()=>this.speech.say("Ein sehr sch\xF6ner Brunnen. Vielen Dank.","schoennbrun")),this.audio.brunnenJingle(),this.burst(St.brunnen,3,2);break;case"elsa":this.burst(St.elsa,3,2);break;case"propper":this.later(4.5,()=>this.say("Meister Propper ist leider noch nicht da.","worried",{priority:!1})),this.later(6,()=>this.chat(tt(["Wie immer \u{1F602}","Er ist bestimmt gleich da","F\xFCnf Minuten noch!"])));break;case"malte":this.burst(["Malte Malte Malte Malte","MALTE!","MaLTE","Malte ist eingestiegen \u2714\uFE0F"],5,3);break;case"siegen":this.burst(["SIEGEN!!! Es ist tats\xE4chlich passiert \u{1F631}","Geschichte wurde geschrieben","Doppelter Bonus f\xFCr Siegen!"],3,2);break;case"sparkasse":this.later(1.5,()=>this.ui.chat({name:"Wissenschaftlicher Dienst",text:`\u{1F52C} Ergebnis: Die Sparkasse ist ${this.navi.sparkColor}.`,bot:"claudia",icon:"\u{1F52C}"}));break;case"pommes":this.earn(10,"Navi-Ziele"),this.burst(["Pommes ohne R\xFCckfragen \u{1F35F}","Mit Mayo!","Keine R\xFCckfragen!"],3,2);break;case"bude":this.burst(["Diesmal die richtige Bude! \u{1F32D}","Falsche Bude? \u{1F602}","Currywurst!"],3,2);break;default:break}this.T.bid=Math.min(this.T.bid,Se(6,10))}updateEvents(e){let t=this.player,n=this.T;for(let r of Object.keys(n))n[r]-=e;if(n.durchsage<=0){n.durchsage=Se(48,85);let r=this.weather.level>.3&&mt(.5)?f0:d0,o=tt(r),a=id(o.text),l=$i();this.donate(l,3,"Sprachdurchsage"),this.later(1.2,()=>{let c=this.speech.say(a,o.voice);this.ui.durchsage(Qs[o.voice].label,a,c+1,l)})}if(n.rahmen<=0&&t.s>1e3){n.rahmen=Se(75,130);let r=tt(p0),o=$i();this.donate(o,r.price,r.name),this.ui.rahmen(r,o),this.later(2,()=>this.chat(tt(St.rahmen)))}if(this.funkloch>0&&(this.funkloch-=e,this.funkloch<=0&&(this.ui.funkloch(!1),this.burst(St.funklochBack,3,1.5),this.later(1.2,()=>this.bot("nora","Verbindung zum Streaming-Server steht wieder. Weiter geht\u2019s!")))),n.funkloch<=0&&t.s>1500&&(n.funkloch=Se(120,220),this.up.starlink?mt(.5)&&this.chat(tt(["Starlink sei Dank: kein Funkloch \u{1F6F0}\uFE0F","Bild bleibt stabil \u2714\uFE0F","Starlink \u{1F525}"])):(this.funkloch=Se(2.2,3.2),this.fx.glitch(this.funkloch),this.ui.funkloch(!0),this.burst(St.funkloch,5,1.6),mt(.5)&&this.later(.5,()=>this.say(Qn.funkloch,"worried",{priority:!1})))),n.frog<=0&&(n.frog=Se(170,300),this.fx.green(1.4),this.burst(St.frog,4,1.5)),n.trunk<=0&&t.s>2e3){n.trunk=Se(140,220);let r=$i();this.donate(r,5,"Kofferraum \xF6ffnen"),this.fx.trunk(7),this.burst(St.trunk,3,2.5)}if(n.numbers<=0){n.numbers=Se(90,150),this.bot("claudia","Kanalpunkte-Aktion: Mini Adam m\xF6chte eine Zahl im Chat sehen!");let r=[];for(let a=0;a<Vr(6,9);a++)r.push(St.zahl());r.forEach((a,l)=>this.later(.6+l*Se(.2,.45),()=>this.chat(a)));let o=r.find((a,l)=>r.indexOf(a)!==l);o&&this.later(4.5,()=>this.chat(`Synchron mit ${o}! \u{1F91D}`))}if(n.police<=0&&t.s>2500&&(n.police=Se(220,340),this.callPolice(tt(_M))),!this.blitzer&&t.s>this.S.blitzer){let r=t.s;this.blitzer={limitS:r+520,camS:r+1120,endS:r+1300,announced:!1,checked:!1},this.scenery.request("speed",this.blitzer.limitS,{limit:120}),this.scenery.request("blitzer",this.blitzer.camS),this.scenery.request("speed",this.blitzer.endS,{limit:"ende"})}if(this.blitzer){let r=this.blitzer;if(!r.announced&&t.s>r.limitS-180&&(r.announced=!0,this.say(Qn.blitzer,"wink")),!r.checked&&t.s>r.camS)if(r.checked=!0,t.kmh>126){this.fx.flash(1),this.audio.flash(),this.scenery.flashBlitzer(!0),this.later(.15,()=>this.scenery.flashBlitzer(!1)),this.stats.photos++;let o=Math.round(t.kmh),a=Wr(this.clock);this.later(.6,()=>{this.fine(15,"Bu\xDFgeld"),this.ui.photo(o,a)}),this.burst(St.blitzer,3,2),this.cockpit.nomi.setMood("surprised",2)}else this.stats.blitzerClean++,this.earn(5,"Vorbildlich"),this.ui.toast("\u{1F4F8} Nicht geblitzt \u2013 vorbildlich!","good");t.s>r.endS+50&&(this.blitzer=null,this.S.blitzer=t.s+Se(2600,4200))}if(t.s>this.S.elefant&&(this.S.elefant=t.s+Se(3200,5200),this.traffic.elefantenrennen(t.s),this.say(Qn.elefant,"worried",{priority:!1}),this.later(3,()=>this.burst(St.elefant,3,3))),!this.landmark&&t.s>this.S.landmark){let r=mt(.55)?"brunnen":"elsa",o=t.s+1500;this.landmark={type:r,s:o,seen:!1,greeted:!1},this.scenery.request(r,o)}if(this.landmark){let r=this.landmark,o=r.s-t.s;!r.seen&&o<260&&(r.seen=!0,this.burst(r.type==="brunnen"?St.brunnen:St.elsa,3,2),this.ui.toast(r.type==="brunnen"?"\u26F2 Ein Brunnen! Hupen f\xFCr BrunnenTV (Leertaste)":"\u{1F451} Elsa! Hupen zum Gr\xFC\xDFen (Leertaste)","info")),!r.greeted&&o<220&&o>-40&&this.t-this.lastHorn<.3&&(r.greeted=!0,r.type==="brunnen"?(this.earn(10,"BrunnenTV"),this.audio.brunnenJingle(),this.later(.5,()=>this.speech.say("Ein sehr sch\xF6ner Brunnen.","schoennbrun")),this.ui.toast("\u26F2 BrunnenTV-Bonus!","good")):(this.earn(10,"Elsa-Gru\xDF"),this.cockpit.nomi.setMood("love",2.5),this.ui.toast("\u{1F451} Elsa winkt zur\xFCck!","good")),this.hype+=60),o<-80&&(this.landmark=null,this.S.landmark=t.s+Se(2400,3800))}let s=Math.floor(this.clock/60)%24;s!==this.lastHugo&&this.t>5&&(this.lastHugo=s,s===21?this.bot("hugo","21 Uhr: Ortsspenden-Schluss! \u2026 Verl\xE4ngerung um 5 Minuten \u{1F609}"):s===22?this.bot("hugo","Eigentlich w\xE4re jetzt Sendeschluss. Wir fahren einfach weiter!"):s>=19?this.bot("hugo",`Es ist ${s} Uhr. Sendezeit l\xE4uft.`):s===0?this.bot("hugo","Mitternacht! Der Stream l\xE4uft einfach weiter. \u{1F319}"):s<6&&this.bot("hugo",`Es ist ${s} Uhr nachts. Sendezeit l\xE4uft immer noch.`))}callPolice(e){this.policeCar||(this.policeCar=this.traffic.police(this.player.s,e),this.burst(St.police,3,2.5),this.later(1,()=>this.cockpit.nomi.setMood("worried",2.5)))}updatePickups(e,t){let n=this.player,s=this.S;n.s>s.charge&&(s.charge=n.s+Se(900,1500),this.pickups.spawnAhead("charge",n.s,this.traffic)),n.s>s.banana&&(s.banana=n.s+Se(1200,1900),this.pickups.spawnAhead("banana",n.s,this.traffic)),n.s>s.koriander&&(s.koriander=n.s+Se(1300,2300),this.pickups.spawnAhead("koriander",n.s,this.traffic));for(let r of this.pickups.update(e,this.t,n,t))r.type==="charge"?(n.charge(12),this.stats.charges++,this.audio.chime(),this.ui.toast("\u26A1 Lade-Ring: +12 % Akku","good")):r.type==="banana"?(this.stats.bananas++,n.sugar=6,this.audio.coin(),this.earn(15,"Bananensaft"),this.ui.toast("\u{1F34C} Bananensaft! Zuckerschub","good"),mt(.7)&&this.chat(tt(St.banana))):(this.stats.koriander++,n.wobble=2.2,this.fine(5,"Koriander"),this.ui.toast("\u{1F33F} Koriander \u2026 b\xE4h!","bad"),this.cockpit.nomi.setMood("dizzy",2.5),this.burst(St.koriander,2,1.5))}updateViewers(e){let t=this.player,n=t.s/1e3;this.hype*=Math.exp(-e*.04);let s=220+95*n+25*Math.sin(this.t/23)+this.hype;this.up.starlink&&(s*=1.25),this.funkloch>0&&(s*=.8),this.viewers=Hn(this.viewers,s,.4,e),this.peakViewers=Math.max(this.peakViewers,this.viewers),this.stats.maxViewers=this.peakViewers;let r=Math.max(500,this.save.best.viewers||0);if(!this.recordShown&&this.viewers>r&&t.s>1500&&(this.recordShown=!0,this.bot("victoria",`Neuer Zuschauerrekord: ${on(Math.round(this.viewers))} Zuschauer!`),this.audio.record(),this.burst(St.record,4,2.5),this.ui.banner("\u{1F3C6} Neuer Zuschauerrekord!",3.5),this.up.konfetti&&this.cockpit.addConfetti(30)),this.donationT-=e,this.donationT<=0){this.donationT=Se(8,17)*Ke(500/Math.max(this.viewers,1),.5,1.5);let o=$i(),a=x0(1,22);this.donate(o,a),mt(.35)&&this.later(.9,()=>this.chat(tt(["Danke!","Ehrenmensch \u{1F64F}","Bimmel hurra!","F\xFCnftel-Alter","\u2764"])))}}updateChat(e){this.chatT-=e,this.chatT<=0&&(this.chatT=Se(1.3,3.4)*Ke(600/Math.max(this.viewers,1),.6,1.4),this.chat(tt(St.ambient)))}updateJobs(){let e=this.stats,t=!1;for(let n of this.jobs){if(n.done)continue;let s=e[n.stat]||0,r=Ke(s/n.goal,0,1);Math.abs(r-n.progress)>.01&&(n.progress=r,t=!0),s>=n.goal-.5&&(n.done=!0,n.progress=1,t=!0,this.earn(25,"Jobs",{mult:!1}),this.ui.toast(`\u2705 Job erledigt: ${n.text}`,"good"),this.audio.chime(),this.chat(tt(St.fiveJobs)))}t&&this.ui.jobs(this.jobs),!this.allJobsPaid&&this.jobs.every(n=>n.done)&&(this.allJobsPaid=!0,this.earn(100,"Jobs",{mult:!1}),this.bot("victoria","You had 5 Jobs \u2013 und alle erledigt! 100\xA0\u20AC Bonus!"),this.audio.record(),this.ui.banner("\u{1F3C6} Alle 5 Jobs erledigt!",4))}honk(){this.audio.horn(),this.lastHorn=this.t,mt(.12)&&this.chat(tt(["Bimmel hurra! \u{1F4EF}","HUP HUP","Hupkonzert!"]))}useMegafon(){if(!this.up.megafon){this.ui.toast("\u{1F4E2} Das Megafon gibt es im Tesla-Shop","info");return}if(this.megafonCd>0){this.ui.toast(`\u{1F4E2} Megafon l\xE4dt noch (${Math.ceil(this.megafonCd)} s)`,"info");return}this.megafonCd=15,this.audio.megafon();let e=this.traffic.megafon(this.player);this.speech.say("Achtung, Achtung! Bitte machen Sie die Spur frei!","william"),this.ui.toast(e?`\u{1F4E2} ${e} Fahrzeug${e>1?"e machen":" macht"} Platz`:"\u{1F4E2} Durchsage!","info"),this.chat(tt(["Wie in Gifhorn \u{1F4E2}","MEGAFON \u{1F602}","Platz da!"]))}onCrash(e){let t=this.player;if(!t.collide(e))return;this.stats.crashes++,this.stats.cleanDistance=0,this.audio.crash(),this.fx.shake(1),this.cockpit.nomi.setMood("dizzy",3);let n=t.maxHits-t.hits;if(this.ui.damage(t.hits,t.maxHits),e.car.behavior==="polizei"&&this.chat("Ausgerechnet die Polizei Gifhorn \u{1F631}"),this.burst(St.crash,3,2),n<=0){this.end("werkstatt");return}this.ui.toast(n===1?"\u{1F9F8} Rempler! Nur noch ein Karosserie-Punkt!":`\u{1F9F8} Rempler! Noch ${n} Karosserie-Punkte`,"bad")}onNearMiss(e){this.stats.nearMisses++,this.earn(3,"Haarscharf"),this.hype+=15,mt(.5)&&this.chat(tt(St.nearMiss))}end(e){if(this.over)return;this.running=!1;let t=this.player,n=t.s/1e3;this.over={reason:e,distance:t.s,money:Math.max(0,Math.round(this.money*100)/100),breakdown:{...this.breakdown},jobs:this.jobs.map(s=>({text:s.text,done:s.done})),stats:{...this.stats},peakViewers:Math.round(this.peakViewers),beruf:m0(n),time:this.t,clock:Wr(this.clock),naviHistory:this.navi.history.slice(-5)},this.speech.stopAll(),e==="akku"?this.say("Akku leer. Die Stream-Technik verabschiedet sich.","sleep"):e==="werkstatt"&&this.say("Bitte einen Werkstatttermin vereinbaren.","dizzy")}screenState(){let e=this.player,t=this.weather,n=this.blitzer&&e.s>this.blitzer.limitS&&e.s<this.blitzer.endS?120:null;return{dark:t.level>.45,battery:e.battery,speedKmh:e.kmh,limit:n,playerX:e.x,leftLane:this.left.open?this.left.timer:0,cars:this.traffic.nearby(e,125),s:e.s,navi:this.navi.screen(e.s,this.clock,e.speed),clock:Wr(this.clock),temp:Math.round(17-t.level*6),funkloch:this.funkloch>0?1:0,wiperOn:t.level>.05}}};function ad(i,e,t){let n=document.createElement("canvas");n.width=i,n.height=e,t(n.getContext("2d"),i,e);let s=new Pt(n);return s.colorSpace=ht,s.anisotropy=4,s}function MM(){return ad(256,384,(i,e,t)=>{i.translate(e/2,0),i.beginPath(),i.moveTo(-26,40),i.lineTo(26,40),i.lineTo(26,92),i.quadraticCurveTo(84,120,84,180),i.lineTo(84,340),i.quadraticCurveTo(84,370,54,370),i.lineTo(-54,370),i.quadraticCurveTo(-84,370,-84,340),i.lineTo(-84,180),i.quadraticCurveTo(-84,120,-26,92),i.closePath(),i.fillStyle="rgba(255,255,255,0.9)",i.fill(),i.lineWidth=8,i.strokeStyle="#3a2a10",i.stroke(),i.save(),i.clip();let n=i.createLinearGradient(-84,0,84,0);n.addColorStop(0,"#f2c419"),n.addColorStop(.5,"#ffe45c"),n.addColorStop(1,"#e8b30e"),i.fillStyle=n,i.fillRect(-90,150,180,230),i.restore(),i.fillStyle="#2e7d32",Ot(i,-32,14,64,32,8),i.fill(),i.fillStyle="#ffffff",Ot(i,-70,205,140,110,14),i.fill(),i.strokeStyle="#3a2a10",i.lineWidth=5,i.stroke(),i.beginPath(),i.moveTo(-44,228),i.quadraticCurveTo(-30,292,46,270),i.quadraticCurveTo(-6,270,-26,226),i.closePath(),i.fillStyle="#ffd21f",i.fill(),i.strokeStyle="#6b4a00",i.lineWidth=4,i.stroke(),i.fillStyle="#3a2a10",i.font="bold 22px Arial, sans-serif",i.textAlign="center",i.fillText("BANANENSAFT",0,306),i.fillStyle="rgba(255,255,255,0.55)",Ot(i,-70,140,14,190,7),i.fill()})}function bM(){return ad(320,320,(i,e,t)=>{i.translate(e/2,t/2+30),i.strokeStyle="#4f8a2b",i.lineWidth=7,i.lineCap="round";let n=[];for(let r=0;r<7;r++){let o=-Math.PI/2+(r-3)*.32,a=95+r%3*18,l=Math.cos(o)*a,c=Math.sin(o)*a;i.beginPath(),i.moveTo(0,110),i.quadraticCurveTo(l*.3,20,l,c),i.stroke(),n.push([l,c])}let s=(r,o,a,l)=>{i.save(),i.translate(r,o),i.rotate(l),i.beginPath();for(let c=0;c<=12;c++){let h=c/12*Math.PI*2,u=a*(c%2?.62:1);i.lineTo(Math.cos(h)*u,Math.sin(h)*u*.9)}i.closePath(),i.fillStyle="#3f9b2f",i.fill(),i.strokeStyle="#215c18",i.lineWidth=4,i.stroke(),i.restore()};n.forEach(([r,o],a)=>{s(r,o,34,a),s(r*.7+18,o*.7,22,a+1)}),i.fillStyle="#c62828",Ot(i,-46,82,92,34,8),i.fill(),i.fillStyle="#fff",i.font="bold 20px Arial, sans-serif",i.textAlign="center",i.fillText("KORIANDER",0,106)})}function EM(){return ad(256,256,(i,e,t)=>{i.translate(e/2,t/2),i.beginPath(),i.moveTo(18,-110),i.lineTo(-62,14),i.lineTo(-8,14),i.lineTo(-24,110),i.lineTo(62,-22),i.lineTo(8,-22),i.closePath(),i.fillStyle="#eaffef",i.shadowColor="#4dff9a",i.shadowBlur=24,i.fill(),i.shadowBlur=0,i.lineWidth=6,i.strokeStyle="#1faa5a",i.stroke()})}var Zl=class{constructor(e){this.group=new we,this.group.name="Pickups",e.add(this.group),this.items=[],this.pool={charge:[],banana:[],koriander:[]};let t=ml();this.mats={ring:ce.basic({color:new Ue(.25,2.2,.9),toneMapped:!0}),bolt:ce.basic({map:EM(),transparent:!0,depthWrite:!1,side:dt}),bottle:ce.basic({map:MM(),transparent:!0,alphaTest:.05,side:dt}),koriander:ce.basic({map:bM(),transparent:!0,alphaTest:.05,side:dt}),glowG:ce.basic({map:t,color:5635993,transparent:!0,depthWrite:!1,blending:ds,opacity:.8}),glowY:ce.basic({map:t,color:16765773,transparent:!0,depthWrite:!1,blending:ds,opacity:.6}),glowR:ce.basic({map:t,color:16736320,transparent:!0,depthWrite:!1,blending:ds,opacity:.35})},this.geo={ring:new Nn(.95,.09,10,40),plane:new et(1,1)}}make(e){let t=new we,n=this.mats;if(e==="charge"){let s=new D(this.geo.ring,n.ring);s.position.y=1.15;let r=new D(this.geo.plane,n.bolt);r.scale.setScalar(1.1),r.position.y=1.15;let o=new D(this.geo.plane,n.glowG);o.scale.setScalar(3.2),o.position.y=1.15,t.add(o,s,r),t.userData.spin=s,t.userData.face=[r,o]}else if(e==="banana"){let s=new D(this.geo.plane,n.bottle);s.scale.set(.95,1.42,1),s.position.y=.95;let r=new D(this.geo.plane,n.glowY);r.scale.setScalar(2.6),r.position.y=.95,t.add(r,s),t.userData.face=[s,r]}else{let s=new D(this.geo.plane,n.koriander);s.scale.setScalar(1.35),s.position.y=.85;let r=new D(this.geo.plane,n.glowR);r.scale.setScalar(2.4),r.position.y=.85,t.add(r,s),t.userData.face=[s,r]}return this.group.add(t),t}spawn(e,t,n){let s=this.pool[e],r=s.find(a=>!a.userData.inUse);r||(r=this.make(e),s.push(r)),r.userData.inUse=!0,r.visible=!0,r.scale.setScalar(1);let o={type:e,s:t,x:Ne.laneCenter(n),lane:n,obj:r,taken:!1,fade:0,phase:Math.random()*6};return this.items.push(o),o}spawnAhead(e,t,n,s=650){let r=t+s+Se(0,120),o=[0,1,2,3].filter(a=>n.laneFree(a,r,26));return o.length?this.spawn(e,r,tt(o)):null}reset(){for(let e of this.items)e.obj.visible=!1,e.obj.userData.inUse=!1;this.items=[]}update(e,t,n,s,r=!0){let o=[],a=[];for(let l of this.items){let c=l.s-n.s;if(c<-30||l.taken&&l.fade>.4){l.obj.visible=!1,l.obj.userData.inUse=!1;continue}a.push(l);let h=l.obj;h.position.set(l.x,Math.sin(t*2.2+l.phase)*.08,-c),h.userData.spin&&(h.userData.spin.rotation.y=t*1.8+l.phase);let u=Math.atan2(s.position.x-l.x,s.position.z+c);for(let d of h.userData.face)d.rotation.y=u;l.taken?(l.fade+=e,h.scale.setScalar(1+l.fade*3),h.position.y+=l.fade*4):r&&Math.abs(c)<2.7&&Math.abs(l.x-n.x)<1.55&&(l.taken=!0,o.push(l))}return this.items=a,o}};function Ee(i,e,t,n){let s=document.createElement(i);return e&&(s.className=e),n!==void 0&&(s.textContent=n),t&&t.appendChild(s),s}var wM={rosen:"\u{1F339}",pommes:"\u{1F35F}",burger:"\u{1F354}",candy:"\u{1F36C}",chips:"\u{1F954}",kuerbis:"\u{1F383}"},Kl=class{constructor(e){this.root=e,this.hud=Ee("div","hud hidden",e),this.hud.id="hud";let t=Ee("div","hud-info",this.hud);this.infoEl=t;let n=Ee("div","live-row",t);this.liveBadge=Ee("span","live-badge",n,"\u25CF LIVE"),this.viewersEl=Ee("span","viewers",n,"\u{1F441} 0"),this.timeEl=Ee("span","streamtime",n,"0:00");let s=Ee("div","stat-rows",t),r=(u,d)=>{let f=Ee("div","stat",s);Ee("span","stat-icon",f,u);let m=Ee("span","stat-val",f,"");return d&&Ee("span","stat-label",f,d),m};this.distEl=r("\u{1F4CF}",""),this.recordEl=Ee("span","stat-sub",this.distEl.parentNode,""),this.speedEl=r("\u{1F697}",""),this.moneyRow=r("\u{1F4B6}","Guthaben");let o=this.moneyRow.parentNode;this.moneySlot=Ee("span","money-slot",o),this.moneySlot.appendChild(o.querySelector(".stat-label")),this.moneyPops=Ee("span","money-pops",this.moneySlot),this.batteryEl=r("\u{1F50B}",""),this.batteryBar=Ee("span","battery-bar",this.batteryEl.parentNode),this.batteryFill=Ee("span","battery-fill",this.batteryBar),this.damageEl=r("\u{1F9F8}",""),this.jobsEl=Ee("div","jobs-mini",t),this.zulageEl=Ee("div","zulage hidden",t,"\u{1F327}\uFE0F Regenzulage \xD71,5"),this.leftLaneEl=Ee("div","leftlane hidden",this.hud),this.leftLaneText=Ee("div","leftlane-text",this.leftLaneEl,"");let a=Ee("div","leftlane-bar",this.leftLaneEl);this.leftLaneFill=Ee("div","leftlane-fill",a),this.naviEl=Ee("div","navi-line",this.hud,"");let l=Ee("div","center-stack",this.hud);this.nomiEl=Ee("div","nomi-sub hidden",l);let c=Ee("span","nomi-eyes",this.nomiEl);Ee("i","",c),Ee("i","",c),this.nomiText=Ee("span","nomi-text",this.nomiEl,""),this.bannerEl=Ee("div","banner hidden",l,""),this.toastsEl=Ee("div","toasts",l),this.chatEl=Ee("div","chat",this.hud);let h=Ee("div","chat-head",this.chatEl);if(Ee("span","",h,"Live-Chat"),this.chatCount=Ee("span","chat-count",h,""),this.chatList=Ee("div","chat-list",this.chatEl),this.durchsageEl=Ee("div","durchsage hidden",this.hud),this.funklochEl=Ee("div","funkloch hidden",this.hud),Ee("div","funkloch-icon",this.funklochEl,"\u{1F4E1}"),Ee("div","funkloch-text",this.funklochEl,"Verbindung verloren \u2013 Telekom, Vodafone und O\u2082 werden neu geb\xFCndelt \u2026"),this.photoEl=Ee("div","photo hidden",this.hud),this.rahmenEl=Ee("div","rahmen-layer",this.hud),this.cameraHint=Ee("div","camera-hint hidden",this.hud,""),this.chatOn=!0,this.lastHud=0,this.toasts=[],this.bannerT=0,this.nomiT=0,this.durchsageT=0,this.photoT=0,this.rahmenList=[],this.photos=[],this.moneyShown=0,typeof ResizeObserver<"u"){let u=new ResizeObserver(()=>this.layout());u.observe(t),u.observe(this.chatEl)}window.addEventListener("resize",()=>this.layout())}layout(){let e=this.infoEl.getBoundingClientRect();if(!e.width)return;let t=window.innerWidth,n=this.chatOn&&this.chatEl.getBoundingClientRect(),s=Math.max(e.right,n&&n.width?t-n.left:0)+14,r=t-2*s,o=14,a=r<240;if(a){let c=n&&n.width?n.top+(parseFloat(getComputedStyle(this.chatEl).maxHeight)||n.height):0;o=Math.max(e.bottom,c)+10,r=t-28}let l=this.hud.style;l.setProperty("--mid",Math.round(r)+"px"),l.setProperty("--top",Math.round(o)+"px"),this.hud.classList.toggle("hud-narrow",a)}show(e){this.hud.classList.toggle("hidden",!e)}setChat(e){this.chatOn=e,this.chatEl.classList.toggle("hidden",!e),this.layout()}reset(){this.chatList.textContent="",this.toastsEl.textContent="",this.rahmenEl.textContent="",this.clearMoneyPop(),this.toasts=[],this.rahmenList=[],this.photos=[],this.bannerEl.classList.add("hidden"),this.nomiEl.classList.add("hidden"),this.durchsageEl.classList.add("hidden"),this.photoEl.classList.add("hidden"),this.funkloch(!1),this.bannerT=this.nomiT=this.durchsageT=this.photoT=0}chat({name:e,text:t,bot:n,icon:s}){let r=Ee("div","msg"+(n?" bot bot-"+n:""),this.chatList);if(n){Ee("span","bot-icon",r,s||Ol[n]?.icon||"\u{1F916}");let o=Ee("span","name",r,e);o.style.color="#ffd76a",r.append(" "),Ee("span","bot-tag",r,"BOT")}else{let o=Ee("span","name",r,e);o.style.color=h0(e)}for(r.append(" "),Ee("span","text",r,t);this.chatList.childElementCount>36;)this.chatList.firstElementChild.remove();this.chatList.scrollTop=this.chatList.scrollHeight}toast(e,t="info",n=""){let s=Ee("div","toast toast-"+t,this.toastsEl,e);for(n&&Ee("div","toast-sub",s,n),this.toasts.push({el:s,t:n?5:3.6});this.toasts.length>4;)this.toasts.shift().el.remove()}banner(e,t=3,n=""){this.bannerEl.textContent=e,n&&Ee("div","banner-sub",this.bannerEl,n),this.bannerEl.classList.remove("hidden"),this.bannerEl.classList.remove("pop"),this.bannerEl.offsetWidth,this.bannerEl.classList.add("pop"),this.bannerT=t}nomi(e,t=3){this.nomiText.textContent=e,this.nomiEl.classList.remove("hidden"),this.nomiT=Math.max(2.2,t)}money(e,t){this.moneyPops.textContent="";let n=Ee("span","money-pop "+(e>=0?"plus":"minus"),this.moneyPops,(e>=0?"+":"\u2212")+Zt(Math.abs(e)));t&&(Ee("small","",n,t),n.offsetWidth>this.moneySlot.clientWidth&&n.lastChild.remove()),this.moneySlot.classList.add("popping"),clearTimeout(this.moneyTimer),this.moneyTimer=setTimeout(()=>this.clearMoneyPop(),1900)}clearMoneyPop(){clearTimeout(this.moneyTimer),this.moneyPops.textContent="",this.moneySlot.classList.remove("popping")}durchsage(e,t,n,s){this.durchsageEl.textContent="";let r=Ee("div","durchsage-head",this.durchsageEl,`\u{1F399}\uFE0F Sprachdurchsage von ${s} \xB7 Stimme: ${e}`);r.title=e,Ee("div","durchsage-text",this.durchsageEl,"\xBB"+t+"\xAB"),this.durchsageEl.classList.remove("hidden"),this.durchsageT=Ke(n,3,14)}funkloch(e){this.funklochEl.classList.toggle("hidden",!e),this.liveBadge.classList.toggle("offline",e),this.liveBadge.textContent=e?"\u25CF OFFLINE":"\u25CF LIVE"}damage(e,t){this.damageEl.parentNode.classList.remove("shake"),this.damageEl.offsetWidth,this.damageEl.parentNode.classList.add("shake")}jobs(e){this.jobsEl.textContent="",Ee("span","jobs-title",this.jobsEl,"You had 5 Jobs");for(let t of e){let n=Ee("div","job"+(t.done?" done":""),this.jobsEl);if(Ee("span","job-box",n,t.done?"\u2714":""),Ee("span","job-text",n,t.text),!t.done&&t.progress>0){let s=Ee("span","job-bar",n);Ee("span","job-fill",s).style.width=Math.round(t.progress*100)+"%"}}}rahmen(e,t){let n=Ee("div","rahmen rahmen-"+e.id,this.rahmenEl),s=Ee("div","rahmen-caption",n,`${e.name} \xB7 ${Zt(e.price)} von ${t}`);s.title=e.name;let r=wM[e.id];if(r){for(let a of["top","bottom","left","right"]){let l=Ee("div","strip strip-"+a,n);for(let c=0;c<22;c++)Ee("span","",l,r)}e.id==="kuerbis"&&n.classList.add("corner-only")}else if(e.id==="pappkarton"){let o=Ee("div","boxes",n);for(let a=0;a<26;a++){let l=Ee("span","box",o,"");l.style.left=a%13*7.8+(a>=13?3.5:0)+"%",l.style.bottom=(a>=13?11:0)+Math.random()*2+"%",l.style.transform=`rotate(${(Math.random()-.5)*16}deg)`,l.style.animationDelay=(a*.05).toFixed(2)+"s"}}else if(e.id==="haelfte"){let o=Math.random()<.5?"left":"right";Ee("div","half half-"+o,n,"Bildh\xE4lfte abgedeckt")}else if(e.id==="elsa")Ee("div","elsa-fly",n,"");else if(e.id==="lego")for(let o of["top","bottom","left","right"]){let a=Ee("div","strip lego strip-"+o,n);for(let l=0;l<18;l++)Ee("span","brick b"+l%4,a,"")}else if(e.id==="briefmarken")Ee("div","stamp-frame",n,"");else if(e.id==="keinerechte")for(let o of["top","bottom","left","right"]){let a=Ee("div","strip norights strip-"+o,n),l=o==="top"||o==="bottom"?6:3;for(let c=0;c<l;c++)Ee("span","",a,"\xA9 Keine Rechte")}else if(e.id==="rettich")for(let o of["top","bottom","left","right"]){let a=Ee("div","strip strip-"+o,n);for(let l=0;l<16;l++)Ee("span","rettich",a,"")}this.rahmenList.push({el:n,t:e.dur})}photo(e,t,n){if(this.photoEl.textContent="",e){let s=Ee("img","",this.photoEl);s.src=e,s.alt="Blitzerfoto",this.photos.push({url:e,kmh:t,clock:n})}Ee("div","photo-cap",this.photoEl,`\u{1F4F8} ${t} km/h \xB7 ${n} Uhr`),Ee("div","photo-sub",this.photoEl,"Das Foto kommt in einen Rahmen."),this.photoEl.classList.remove("hidden"),this.photoT=6}cameraLabel(e){this.cameraHint.textContent=e,this.cameraHint.classList.remove("hidden"),clearTimeout(this.camTimer),this.camTimer=setTimeout(()=>this.cameraHint.classList.add("hidden"),1600)}update(e,t){for(let c of this.toasts)c.t-=e;for(;this.toasts.length&&this.toasts[0].t<=0;)this.toasts.shift().el.remove();this.bannerT>0&&(this.bannerT-=e,this.bannerT<=0&&this.bannerEl.classList.add("hidden")),this.nomiT>0&&(this.nomiT-=e,this.nomiT<=0&&this.nomiEl.classList.add("hidden")),this.durchsageT>0&&(this.durchsageT-=e,this.durchsageT<=0&&this.durchsageEl.classList.add("hidden")),this.photoT>0&&(this.photoT-=e,this.photoT<=0&&this.photoEl.classList.add("hidden"));for(let c of this.rahmenList)c.t-=e,c.t<.6&&c.el.classList.add("out"),c.t<=0&&c.el.remove();if(this.rahmenList=this.rahmenList.filter(c=>c.t>0),this.lastHud-=e,this.lastHud>0||!t)return;this.lastHud=.1;let n=t.player;this.viewersEl.textContent="\u{1F441} "+on(Math.round(t.viewers)),this.timeEl.textContent=No(t.t),this.distEl.textContent=wi(n.s);let s=t.save.best.distance||0;this.recordEl.textContent=n.s>s&&s>0?"\u{1F3C6} neuer Rekord!":s>0?"Rekord "+wi(s):"",this.recordEl.classList.toggle("record",n.s>s&&s>0),this.speedEl.textContent=Math.round(n.kmh)+" km/h",this.moneyRow.textContent=Zt(t.money),this.batteryEl.textContent=Math.round(n.battery)+" %",this.batteryFill.style.width=Ke(n.battery,0,100)+"%",this.batteryFill.className="battery-fill"+(n.battery<15?" low":n.battery<30?" mid":"");let r=Math.max(0,n.maxHits-n.hits);this.damageEl.textContent="\u2665".repeat(r)+"\u2661".repeat(Math.max(0,n.maxHits-r)),this.damageEl.title="Karosserie-Punkte",this.zulageEl.classList.toggle("hidden",!t.weather.regenzulage);let o=t.left;if(this.leftLaneEl.classList.toggle("hidden",!o.open),this.hud.classList.toggle("lane-on",o.open),o.open){let c=n.inLeftLane;this.leftLaneText.textContent=(c?"\u2B05\uFE0F Linke Spur: Bonus l\xE4uft! ":"\u2B05\uFE0F Linke Spur frei! ")+Math.ceil(o.timer)+" s",this.leftLaneEl.classList.toggle("active",c),this.leftLaneEl.classList.toggle("warn",o.timer<10),this.leftLaneFill.style.width=Ke(o.timer/60,0,1)*100+"%"}let a=t.navi,l=Math.max(0,a.targetS-n.s);this.naviEl.textContent=a.arrived?"\u{1F4CD} Ziel erreicht \u2013 warte auf das n\xE4chste Gebot \u2026":`\u{1F4CD} ${a.target.name} \xB7 ${wi(l,l<1e4?1:0)} \xB7 Gebot ${Zt(a.bid)} von ${a.bidder}`,this.chatCount.textContent=on(Math.round(t.viewers))+" Zuschauer"}};function J(i,e,t,n){let s=document.createElement(i);return e&&(s.className=e),n!==void 0&&(s.textContent=n),t&&t.appendChild(s),s}function Qt(i,e,t,n=""){let s=J("button","btn "+n,i,e);return s.type="button",s.dataset.action=t,s}var b0={akku:{title:"Akku leer",sub:"Die Stream-Technik im Kofferraum hat den letzten Strom bekommen."},werkstatt:{title:"Ab in die Werkstatt",sub:"Zu viele Rempler \u2013 der Tesla braucht eine kleine Pause. Mini Adam winkt trotzdem in die Kamera."},quit:{title:"Stream beendet",sub:"Mini Adam hat den Stream vorzeitig beendet."}},E0=["Linke Spur","Navi-Ziele","Spenden","Jobs","Bananensaft","Haarscharf","BrunnenTV","Elsa-Gru\xDF","Vorbildlich","Bu\xDFgeld","Verwarngeld","Koriander"],$l=class{constructor(e,t){this.root=J("div","screens",e),this.h=t,this.screens={},this.current=null,this.stack=[];for(let n of["title","pause","over","shop","about","controls","settings"]){let s=J("section","screen screen-"+n+" hidden",this.root);this.screens[n]=s}this.root.addEventListener("click",n=>{let s=n.target.closest("[data-action]");!s||s.disabled||(this.h.click?.(),this.action(s.dataset.action,s))}),window.addEventListener("keydown",n=>this.onKey(n))}get open(){return!!this.current}show(e,t){this.current&&this.current!==e&&this.screens[this.current].classList.add("hidden"),this.current=e,this.data=t;let n=this.screens[e];this["render_"+e](n,t),n.classList.remove("hidden"),this.root.classList.add("active"),this.root.classList.toggle("dim",e!=="title"),requestAnimationFrame(()=>{(n.querySelector(".btn.primary:not([disabled])")||n.querySelector(".btn:not([disabled])"))?.focus({preventScroll:!0})})}push(e,t){this.current&&this.stack.push({name:this.current,data:this.data}),this.show(e,t)}back(){let e=this.stack.pop();e?this.show(e.name,e.name==="title"||e.name==="pause"||e.name==="over"?this.refreshData(e):e.data):this.h.back?.(this.current)}refresh(e){if(this.current!==e)return;let t=this.screens[e],n=document.activeElement,s=n&&t.contains(n)&&n.dataset?n.dataset.key?`[data-key="${n.dataset.key}"]`:n.dataset.value?`[data-value="${n.dataset.value}"]`:null:null,r=t.querySelector(".card")?.scrollTop||0;this["render_"+e](t,this.h.dataFor?this.h.dataFor(e,this.data):this.data);let o=t.querySelector(".card");o&&(o.style.animation="none",o.scrollTop=r),s&&t.querySelector(s)?.focus({preventScroll:!0})}refreshData(e){return this.h.dataFor?this.h.dataFor(e.name,e.data):e.data}hide(){this.current&&this.screens[this.current].classList.add("hidden"),this.current=null,this.stack=[],this.root.classList.remove("active","dim")}action(e,t){switch(e){case"back":this.back();break;case"shop":case"about":case"controls":case"settings":this.push(e,this.h.dataFor?this.h.dataFor(e):null);break;case"buy":{let n=t.dataset.id;if(this.h.buy(n)){let s=this.screens.shop.querySelector(".card")?.scrollTop||0;this.render_shop(this.screens.shop,this.h.dataFor("shop"));let r=this.screens.shop.querySelector(".card");r&&(r.style.animation="none",r.scrollTop=s);let o=this.screens.shop.querySelector(`[data-id="${n}"]`),a=o&&!o.disabled?o:this.screens.shop.querySelector(".btn.back");a?.focus({preventScroll:!0}),a?.scrollIntoView({block:"nearest"})}break}case"toggle":{this.h.setting(t.dataset.key,t.dataset.on!=="1"),this.render_settings(this.screens.settings,this.h.dataFor("settings")),this.screens.settings.querySelector(`[data-key="${t.dataset.key}"]`)?.focus({preventScroll:!0});break}case"quality":this.h.setting("quality",t.dataset.value),this.render_settings(this.screens.settings,this.h.dataFor("settings")),this.screens.settings.querySelector(`[data-value="${t.dataset.value}"]`)?.focus({preventScroll:!0});break;case"reset":t.dataset.confirm==="1"?(this.h.resetSave(),this.render_settings(this.screens.settings,this.h.dataFor("settings"))):(t.dataset.confirm="1",t.textContent="Wirklich alles l\xF6schen? Nochmal klicken",t.classList.add("danger"));break;default:this.h.action?.(e,t)}}onKey(e){if(!this.current||e.target&&/input/i.test(e.target.tagName)&&e.target.type!=="range"&&e.code!=="Escape")return;let t=this.screens[this.current],n=[...t.querySelectorAll(".btn:not([disabled]), input[type=range]")],s=n.indexOf(document.activeElement);if(e.code==="ArrowDown"||e.code==="ArrowRight"||e.code==="KeyS"||e.code==="KeyD"){if(e.target.type==="range"&&(e.code==="ArrowRight"||e.code==="KeyD"))return;e.preventDefault(),n[(s+1+n.length)%n.length]?.focus()}else if(e.code==="ArrowUp"||e.code==="ArrowLeft"||e.code==="KeyW"||e.code==="KeyA"){if(e.target.type==="range"&&(e.code==="ArrowLeft"||e.code==="KeyA"))return;e.preventDefault(),n[(s-1+n.length)%n.length]?.focus()}else if(e.code==="Escape"||e.code==="Backspace"||e.code==="KeyP"&&this.current==="pause")e.preventDefault(),this.current==="pause"?this.h.action("resume"):this.current!=="title"&&this.current!=="over"&&this.back();else if(e.code==="Enter"||e.code==="Space"){if(document.activeElement&&n.includes(document.activeElement))return;e.preventDefault(),(t.querySelector(".btn.primary:not([disabled])")||n[0])?.click()}}pad(e,t,n){if(!this.current)return;let r=[...this.screens[this.current].querySelectorAll(".btn:not([disabled])")],o=r.indexOf(document.activeElement);e&&r[(o+e+r.length)%r.length]?.focus(),t&&(document.activeElement&&r.includes(document.activeElement)?document.activeElement:r[0])?.click(),n&&(this.current==="pause"?this.h.action("resume"):this.current!=="title"&&this.current!=="over"&&this.back())}render_title(e,t){e.textContent="";let n=J("div","title-card",e),s=J("div","title-logo",n);J("span","title-live",s,"\u25CF LIVE"),J("h1","",n,o0),J("h2","",n,a0),J("p","tagline",n,l0);let r=J("div","menu",n);Qt(r,"\u25B6  Losfahren","start","primary"),Qt(r,"\u{1F6D2}  Tesla-Shop","shop"),Qt(r,"\u{1F3AE}  Steuerung","controls"),Qt(r,"\u2699\uFE0F  Einstellungen","settings"),Qt(r,"\u2139\uFE0F  \xDCber das Spiel","about");let o=J("div","title-stats",n);J("span","",o,"\u{1F4B6} "+Zt(t.wallet)+" Guthaben"),J("span","",o,"\u{1F3C6} Rekord "+wi(t.best.distance||0)),J("span","",o,"\u{1F6E3}\uFE0F "+wi((t.stats.totalKm||0)*1e3,1)+" gesamt"),J("div","title-hint",e,"Enter: Losfahren \xB7 Pfeiltasten oder WASD: fahren \xB7 Esc: Pause")}render_pause(e,t){e.textContent="";let n=J("div","card pause-card",e);J("h2","",n,"\u23F8 Pause"),J("p","sub",n,"Kappandram\xE4\xDFige Zusammenfassung f\xFCr alle, die gerade erst reingekommen sind:");let s=J("div","summary-grid",n),r=(l,c)=>{let h=J("div","sum",s);J("span","k",h,l),J("span","v",h,c)};r("Strecke",wi(t.player.s)),r("Guthaben dieser Fahrt",Zt(t.money)),r("Navi-Ziel",t.navi.target.name),r("Navi-\xC4nderungen",on(t.stats.naviChanges)),r("Zuschauer",on(Math.round(t.viewers))),r("Sendezeit",No(t.t));let o=J("div","job-list",n);J("h3","",o,"You had 5 Jobs");for(let l of t.jobs){let c=J("div","job"+(l.done?" done":""),o);J("span","job-box",c,l.done?"\u2714":""),J("span","",c,l.text)}let a=J("div","menu row",n);Qt(a,"\u25B6 Weiterfahren","resume","primary"),Qt(a,"\u21BB Neustart","restart"),Qt(a,"\u2699\uFE0F Einstellungen","settings"),Qt(a,"\u23F9 Stream beenden","quit")}render_over(e,t){e.textContent="";let n=J("div","card over-card",e),s=b0[t.reason]||b0.quit;J("div","abspann-tag",n,"ABSPANN"),J("h2","",n,s.title),J("p","sub",n,s.sub);let r=J("div","over-big",n),o=J("div","over-dist",r);J("span","num",o,wi(t.distance)),J("span","lbl",o,t.newRecord?"\u{1F3C6} Neuer Rekord!":"Rekord: "+wi(t.best));let a=J("div","over-money",r);J("span","num",a,"+"+Zt(t.money)),J("span","lbl",a,"Guthaben \xB7 jetzt "+Zt(t.wallet));let l=J("div","menu row over-menu",n);Qt(l,"\u21BB Nochmal fahren","restart","primary"),Qt(l,"\u{1F6D2} Tesla-Shop","shop"),Qt(l,"\u{1F3E0} Hauptmen\xFC","menu");let c=J("div","over-cols",n),h=J("div","over-col",c);J("h3","",h,"Abrechnung");let u=Object.keys(t.breakdown).sort((p,y)=>{let _=E0.indexOf(p),x=E0.indexOf(y);return(_<0?99:_)-(x<0?99:x)});for(let p of u){let y=t.breakdown[p];if(Math.abs(y)<.005)continue;let _=J("div","bd"+(y<0?" minus":""),h);J("span","",_,p),J("span","",_,(y<0?"\u2212":"+")+Zt(Math.abs(y)))}J("h3","",h,"You had 5 Jobs");for(let p of t.jobs){let y=J("div","job"+(p.done?" done":""),h);J("span","job-box",y,p.done?"\u2714":""),J("span","",y,p.text)}let d=J("div","over-col",c);J("h3","",d,"Statistik");let f=t.stats,m=(p,y)=>{let _=J("div","bd",d);J("span","",_,p),J("span","",_,y)};m("Navi-Ziele erreicht",on(f.naviReached)),m("Navi-\xC4nderungen",on(f.naviChanges)),m("Haarscharf \xFCberholt",on(f.nearMisses)),m("Rempler",on(f.crashes)),m("H\xF6chstgeschwindigkeit",on(Math.round(f.maxSpeedKmh))+" km/h"),m("Zuschauer-Spitze",on(t.peakViewers)),m("Wischer: gezuckt / gewischt",on(f.twitches)+" / "+on(f.wipes)),m("Sendezeit",No(t.time)+" (bis "+t.clock+" Uhr)");let v=J("div","beruf",d);if(J("div","beruf-k",v,"Erlogene Berufsbezeichnung des Tages"),J("div","beruf-v",v,"Mini Adam, "+t.beruf.job),J("div","beruf-src",v,"(aus dem Stream vom "+t.beruf.src+")"),t.photos&&t.photos.length){J("h3","",d,"Blitzerfotos");let p=J("div","over-photos",d);for(let y of t.photos.slice(-3)){let _=J("figure","",p),x=J("img","",_);x.src=y.url,x.alt="Blitzerfoto",J("figcaption","",_,y.kmh+" km/h")}}let g=J("div","crew",n);for(let[p,y]of v0){let _=J("div","crew-row",g);J("span","k",_,p),J("span","v",_,y)}}render_shop(e,t){e.textContent="";let n=J("div","card shop-card",e),s=J("div","shop-head",n);J("h2","",s,"\u{1F6D2} Tesla-Shop"),J("div","wallet",s,"\u{1F4B6} "+Zt(t.wallet)),J("p","sub",n,"Upgrades f\xFCr den schwarzen Model 3 Long Range AWD. Bezahlt wird mit Bonusguthaben aus dem Live-Bereich.");let r=J("div","shop-grid",n);for(let a of Vo){let l=t.upgrades[a.id]||0,c=zl[a.id],h=J("div","shop-item"+(l>=c?" maxed":""),r),u=J("div","shop-top",h);J("span","shop-icon",u,a.icon);let d=J("div","shop-title",u);J("div","shop-name",d,a.name),J("div","shop-cat",d,a.cat);let f=J("div","pips",h);for(let v=0;v<c;v++)J("span","pip"+(v<l?" on":""),f);J("p","shop-desc",h,a.desc);let m=J("div","shop-eff",h);if(l>0&&J("div","now",m,"Aktuell: "+a.effect(l)),l<c&&J("div","next",m,(l>0?"N\xE4chste Stufe: ":"Bringt: ")+a.effect(l+1)),l<c){let v=a.prices[l],g=t.wallet>=v,p=Qt(h,g?"Kaufen \xB7 "+Ou(v):Ou(v)+" \xB7 fehlt noch "+Zt(v-t.wallet),"buy",g?"buy":"buy poor");p.dataset.id=a.id,g||(p.disabled=!0)}else J("div","maxed-tag",h,"Ausgebaut \u2714")}let o=J("div","menu row",n);Qt(o,"\u2190 Zur\xFCck","back","back primary")}render_controls(e){e.textContent="";let t=J("div","card",e);J("h2","",t,"\u{1F3AE} Steuerung");let n=J("div","controls-grid",t),s=[["Lenken","\u2190 \u2192 oder A D","Linker Stick","\u25C0 \u25B6"],["Strom geben","\u2191 oder W","RT oder Steuerkreuz \u2191","Strom"],["Bremsen","\u2193 oder S","LT oder Steuerkreuz \u2193","Bremse"],["Hupen (Brunnen & Elsa gr\xFC\xDFen)","Leertaste","A","\u{1F4EF}"],["Scheibenwischer von Hand","E","X","\u{1F327}\uFE0F"],["Megafon (aus dem Shop)","H","Y","\u{1F4E2}"],["Kamera (Cockpit / Drohne)","V","B","\u{1F3A5}"],["Chat ein/aus","C","\u2013","\u2013"],["Ton aus","M","\u2013","\u2013"],["Pause","Esc oder P","Start","\u23F8"]],r=J("div","crow head",n);for(let l of["Aktion","Tastatur","Gamepad","Touch"])J("span","",r,l);for(let l of s){let c=J("div","crow",n);for(let h of l)J("span","",c,h)}let o=J("div","tips",t);J("h3","",o,"Tipps");for(let l of["Wenn NOMI sagt \u201EDie linke Fahrspur ist freigeschaltet.\u201C, gibt es auf der ganz linken Spur Bonusguthaben \u2013 eine Minute lang.","Danach gilt wieder das Rechtsfahrgebot. Sonst kommt die Polizei Gifhorn.","Das Navi-Ziel \xE4ndert sich st\xE4ndig \u2013 jeder neue Zuschauer bietet einen Cent mehr. Erreichte Ziele bringen Guthaben.","Lade-Ringe f\xFCllen den Akku. Bananensaft ist super, Koriander leider nicht.","Wer gut f\xE4hrt, bekommt Regen \u2013 mit Regenzulage. Der automatische Wischer ist allerdings noch in der Beta."])J("p","",o,"\u2022 "+l);let a=J("div","menu row",t);Qt(a,"\u2190 Zur\xFCck","back","primary")}render_settings(e,t){e.textContent="";let n=J("div","card settings-card",e);J("h2","",n,"\u2699\uFE0F Einstellungen");let s=J("div","settings-list",n),r=(d,f,m)=>{let v=J("div","set-row",s);J("span","",v,f);let g=Qt(v,m?"An":"Aus","toggle",m?"on":"off");g.dataset.key=d,g.dataset.on=m?"1":"0"};r("sound","Ger\xE4usche",t.sound),r("speech","Sprachausgabe (NOMI und Sprachdurchsagen)",t.speech),r("chat","Live-Chat anzeigen",t.chat);let o=J("div","set-row",s);J("span","",o,"Lautst\xE4rke");let a=J("input","range",o);a.type="range",a.min="0",a.max="1",a.step="0.05",a.value=String(t.volume),a.addEventListener("input",()=>this.h.setting("volume",parseFloat(a.value)));let l=J("div","set-row",s);J("span","",l,"Grafik");let c=J("div","seg",l);for(let[d,f]of[["auto","Automatisch"],["hoch","Hoch"],["mittel","Mittel"],["niedrig","Niedrig"]]){let m=Qt(c,f,"quality",t.quality===d?"on":"off");m.dataset.value=d}t.speechSupported||J("p","note",n,"Hinweis: Dieser Browser hat keine deutsche Sprachausgabe \u2013 NOMI spricht dann nur per Untertitel.");let h=J("div","set-row",s);J("span","",h,"Spielstand"),Qt(h,"Spielstand zur\xFCcksetzen","reset","off");let u=J("div","menu row",n);Qt(u,"\u2190 Zur\xFCck","back","primary")}render_about(e){e.textContent="";let t=J("div","card about-card",e);J("h2","",t,"\u2139\uFE0F \xDCber das Spiel");let n=a=>J("p","",t,a);n("\u201EMini Adam \u2013 Tesla-Navi ferngesteuert\u201C ist ein liebevolles, nicht-kommerzielles Fan-Spiel rund um SkylineTV LIVE. Mini Adam \u2013 der Pl\xFCsch-Adam mit Kappe, Bart und LIVE-Shirt \u2013 f\xE4hrt den schwarzen Tesla Model 3 Long Range AWD mit 75-kWh-Akku \xFCber die Autobahn, w\xE4hrend der Chat das Navi fernsteuert."),n("Fast alle Witze stammen aus dem SkylineTV LIVE Wiki: die freigeschaltete linke Spur, das Navi-Bieten mit einem Cent mehr, BrunnenTV mit Herrn Sch\xF6nnbrun, Elsa, die Polizei Gifhorn, Meister Propper (kommt gleich), Malte, die Sparkassen-Farbe, Rahmen aus dem Live-Bereich, Sprachdurchsagen von Fr\xE4ulein Kassandra und Br\xFCll-William, Bananensaft statt Koriander, \u201EYou had 5 Jobs\u201C und die erlogenen Berufsbezeichnungen im Abspann."),n("NOMI ist der Boardcomputer auf dem Armaturenbrett. Alle Grafiken, Ger\xE4usche und Stimmen entstehen direkt im Browser \u2013 ohne Bilder- oder Tondateien.");let s=J("a","link",t,"SkylineTV LIVE Wiki \xF6ffnen");s.href="https://skylinetv.live/wiki/index.php?title=Hauptseite",s.target="_blank",s.rel="noopener";let r=J("div","tribute",t);J("span","heart",r,"\u{1F5A4}"),J("span","",r,"In Erinnerung an Adam Wolke \u2013 danke f\xFCr die Live-Eskalationen.");let o=J("div","menu row",t);Qt(o,"\u2190 Zur\xFCck","back","primary")}};var Wo={hoch:{pr:1.5,msaa:4,shadows:!0,shadowSize:2048,mirrorEvery:1},mittel:{pr:1,msaa:4,shadows:!0,shadowSize:1024,mirrorEvery:2},niedrig:{pr:.75,msaa:0,shadows:!1,shadowSize:1024,mirrorEvery:3}},pd=/[?&]debug/.test(location.search),rc=document.getElementById("app"),cd=document.getElementById("loading"),at=y0(),en=at.settings;function C0(){let i=en.quality;return i==="auto"?{...Wo.hoch,pr:Math.min(window.devicePixelRatio||1,1.25),auto:!0}:{...Wo[i]||Wo.mittel,pr:Math.min(window.devicePixelRatio||1,(Wo[i]||Wo.mittel).pr)}}var dn=C0(),ut;try{ut=new Xa({antialias:!0,powerPreference:"high-performance"})}catch(i){throw cd.innerHTML='<div class="load-card"><h1>Mini Adam</h1><p>WebGL konnte nicht gestartet werden. Bitte eine aktuelle Version von Google Chrome verwenden und die Hardware-Beschleunigung einschalten.</p></div>',i}var Ji=dn.pr;ut.setPixelRatio(Ji);ut.setSize(window.innerWidth,window.innerHeight);ut.toneMapping=bu;ut.toneMappingExposure=1;ut.outputColorSpace=ht;ut.shadowMap.enabled=dn.shadows;ut.shadowMap.type=xu;ut.shadowMap.autoUpdate=!1;ut.domElement.id="view";rc.prepend(ut.domElement);xp(ut.capabilities.getMaxAnisotropy());var mi=new Mi,Mt=new Jt(58,window.innerWidth/window.innerHeight,.25,3200),to=new Jt(58,window.innerWidth/window.innerHeight,.012,20),ld=new Jt(21,.245/.072,.6,700),Xo=new Jt(24,16/9,.2,900),ws=new xl(ut,mi,{shadows:dn.shadows,shadowSize:dn.shadowSize}),hd=new vl(mi),md=new Sl(mi),oc=new Bl(mi),ir=new Il(mi,oc),P0=new Zl(mi);Yp();var Tn=t0();mi.add(Tn.root);var Ut=new Nl;Ut.scene.environment=ws.envTarget.texture;ws.onEnv=i=>{Ut.scene.environment=i};var io=new Hl,Qi=new le;function I0(){return ut.getDrawingBufferSize(Qi),Qi}I0();var Yo=new Yn(Qi.x,Qi.y,{type:ps,samples:dn.msaa,depthBuffer:!0}),gd=new Yn(768,226,{type:ps,samples:4,depthBuffer:!0});Ut.setMirrorTexture(gd.texture);var L0=s0(Yo.texture,io),D0=new Mi,k0=new D(new et(2,2),L0);k0.frustumCulled=!1;D0.add(k0);var U0=new kr(-1,1,1,-1,0,1),qt=L0.uniforms,N0=new Mi,qo=new le,bs=null,ud=new Yt({uniforms:{tScreen:{value:null},uCopy:{value:0},uFade:qt.uFade,uFlash:qt.uFlash,uFlashColor:qt.uFlashColor,uVignette:qt.uVignette,uGreen:qt.uGreen,uGlitch:qt.uGlitch,uTime:qt.uTime},vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`
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
    }`,transparent:!0,depthTest:!1,depthWrite:!1,blending:yu,blendSrc:_u,blendDst:bo}),H0=new D(new et(2,2),ud);H0.frustumCulled=!1;N0.add(H0);var SM=(()=>{let i=document.createElement("canvas");i.width=512,i.height=192;let e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,192);t.addColorStop(0,"#2a2c30"),t.addColorStop(1,"#141517"),e.fillStyle=t,e.fillRect(0,0,512,192),e.fillStyle="#0c0c0d",e.fillRect(0,0,512,34);let n=(r,o,a,l,c,h)=>{e.fillStyle=c,Ot(e,r,o,a,l,8),e.fill(),e.fillStyle="#e8e8e8",e.font="bold 15px Arial, sans-serif",e.textAlign="center",e.fillText(h,r+a/2,o+l/2+5)};n(24,70,120,84,"#3b3f46","Akku-Pack"),n(160,92,96,62,"#20242a","Router"),n(272,60,92,94,"#5a2a2a","KONFETTI"),n(380,84,110,70,"#1e3550","LTE \xD73"),e.strokeStyle="#d4a21a",e.lineWidth=3;for(let r=0;r<4;r++)e.beginPath(),e.moveTo(140+r*8,120),e.bezierCurveTo(180,175-r*6,330,178,380,120+r*6),e.stroke();e.fillStyle="#ff4d4d",e.font="bold 18px Arial, sans-serif",e.textAlign="left",e.fillText("\u25CF REC  Kofferraum offen",18,24);let s=new Pt(i);return s.colorSpace=ht,s.repeat.x=-1,s.offset.x=1,s})(),ac=document.createElement("canvas");ac.width=360;ac.height=270;var nr=ac.getContext("2d"),fn=new Fl;fn.enabled=en.sound;fn.volume=en.volume;var Ss=new Gl;Ss.enabled=en.speech;var an=new Vl,Ht=new Kl(rc);Ht.setChat(en.chat);var vd=document.createElement("div");vd.className="touch";for(let[i,e,t]of[["left","\u25C0","t-left"],["right","\u25B6","t-right"],["brake","Bremse","t-brake"],["gas","Strom","t-gas"],["horn","\u{1F4EF}","t-small t-horn"],["wiper","\u{1F327}\uFE0F","t-small t-wiper"],["megafon","\u{1F4E2}","t-small t-megafon"],["camera","\u{1F3A5}","t-small t-camera"],["pause","\u23F8","t-small t-pause"]]){let n=document.createElement("button");n.type="button",n.className=t,n.textContent=e,vd.appendChild(n),an.bindTouch(n,i)}rc.appendChild(vd);var Ql=null,Vt={flash:0,glitch:0,green:0,trunk:0,fade:0,fadeTarget:0},TM={flash:(i=1)=>{Vt.flash=Math.max(Vt.flash,i)},glitch:i=>{Vt.glitch=Math.max(Vt.glitch,i)},green:i=>{Vt.green=Math.max(Vt.green,i)},shake:i=>{Ut.shake=Math.max(Ut.shake,i)},trunk:i=>{Vt.trunk=i,Ut.setTrunkView(SM),Ut.mirrorMat.needsUpdate=!0}},AM={reset:()=>Ht.reset(),chat:i=>Ht.chat(i),toast:(i,e,t)=>Ht.toast(i,e,t),banner:(i,e,t)=>Ht.banner(i,e,t),nomi:(i,e)=>Ht.nomi(i,e),money:(i,e)=>Ht.money(i,e),durchsage:(i,e,t,n)=>Ht.durchsage(i,e,t,n),rahmen:(i,e)=>Ht.rahmen(i,e),funkloch:i=>Ht.funkloch(i),damage:(i,e)=>Ht.damage(i,e),jobs:i=>Ht.jobs(i),photo:(i,e)=>{Ql={kmh:i,clock:e}}},ct=new Yl({traffic:ir,scenery:md,road:hd,sky:ws,rain:oc,windshield:io,cockpit:Ut,audio:fn,speech:Ss,ui:AM,fx:TM,pickups:P0}),Wt="loading",ji="cockpit",Xt=0,Ri=!1,tc=null,dd=!1,Dn=new $l(rc,{click:()=>{fn.init(),fn.click()},action:i=>{i==="start"||i==="restart"?B0():i==="resume"?F0():i==="quit"?(Ri=!1,Dn.hide(),ct.end("quit")):i==="menu"&&RM()},back:()=>{},dataFor:(i,e)=>i==="shop"?{wallet:at.wallet,upgrades:at.upgrades}:i==="settings"?{...en,speechSupported:Ss.supported}:i==="title"?at:i==="pause"?ct:i==="over"&&tc?{...tc,wallet:at.wallet}:e,buy:i=>{let e=Vo.find(s=>s.id===i),t=at.upgrades[i]||0;if(!e||t>=zl[i])return!1;let n=e.prices[t];return at.wallet<n?(fn.bad(),!1):(at.wallet=Math.round((at.wallet-n)*100)/100,at.upgrades[i]=t+1,tr(at),fn.coin(),Zo(),!0)},setting:(i,e)=>{en[i]=e,at.settings=en,tr(at),nc(i)},resetSave:()=>{let i=_0();for(let e of Object.keys(at))delete at[e];Object.assign(at,i),en=at.settings,tr(at),Zo(),nc()}});function Zo(){let i=at.upgrades;Tn.setStarlink(!!i.starlink),Tn.setVest(!!i.weste),Ut.setElsa(!!i.elsa)}function nc(i){if(fn.enabled=en.sound,fn.volume=en.volume,fn.setEnabled(en.sound),Ss.enabled=en.speech,en.speech||Ss.stopAll(),Ht.setChat(en.chat),!i||i==="quality"){let e=dn;dn=C0(),Ji=dn.pr,e.shadows!==dn.shadows&&(ut.shadowMap.enabled=dn.shadows,ws.sun.castShadow=dn.shadows,mi.traverse(n=>{n.material&&(Array.isArray(n.material)?n.material:[n.material]).forEach(s=>s.needsUpdate=!0)}));let t=ws.sun.shadow;t.mapSize.x!==dn.shadowSize&&(t.mapSize.set(dn.shadowSize,dn.shadowSize),t.map&&(t.map.dispose(),t.map=null)),Yo.samples=dn.msaa,Yo.dispose(),$o()}}function RM(){Wt="title",Xt=0,Ri=!1,Ut.shake=0,ji="cockpit",Ht.show(!1),Ss.stopAll(),ct.startDemo(),Zo(),Dn.hide(),Dn.show("title",at)}function B0(){fn.init(),Dn.hide(),Ri=!1,ct.start(at),Zo(),Wt="intro",Xt=0,dd=!1,ji="cockpit",Ht.show(!1),Vt.fade=1,Ut.shake=0,an.endFrame()}function F0(){Ri=!1,Dn.hide(),Ss.pause(!1),an.pressed.clear(),an.keys.clear()}function xd(){Wt!=="drive"||Ri||(Ri=!0,Ss.pause(!0),Dn.show("pause",ct))}function CM(){let i=ct.over,e=i.distance/1e3,t=at.best.distance||0,n=i.distance>t&&i.distance>50;at.wallet=Math.round((at.wallet+i.money)*100)/100,at.best.distance=Math.max(t,i.distance),at.best.earned=Math.max(at.best.earned||0,i.money),at.best.viewers=Math.max(at.best.viewers||0,i.peakViewers),at.stats.runs++,at.stats.totalKm+=e,at.stats.naviReached+=i.stats.naviReached,at.stats.crashes+=i.stats.crashes,at.stats.leftLaneEuro+=i.breakdown["Linke Spur"]||0,tr(at),tc={...i,newRecord:n,best:at.best.distance,wallet:at.wallet,photos:Ht.photos.slice()}}var fi={lane:2,cool:0};function w0(i,e,t=!0){let n=ct.player;fi.cool-=i;let s=null,r=1/0;for(let h of ir.cars){let u=h.s-n.s;u>0&&u<70&&Math.abs(h.x-n.x)<2.3&&u<r&&(s=h,r=u)}if(t&&s&&r<55&&fi.cool<=0){let h=f=>f>=1&&f<=3&&ir.cars.every(m=>Math.abs(m.x-Ne.laneCenter(f))>2.4||m.s-n.s<-22||m.s-n.s>48),u=n.lane,d=[u-1,u+1].filter(h);d.length&&(fi.lane=d[0],fi.cool=3)}if(fi.cool<=-8&&fi.lane<3){let h=fi.lane+1;ir.cars.every(u=>Math.abs(u.x-Ne.laneCenter(h))>2.4||u.s-n.s<-22||u.s-n.s>60)&&(fi.lane=h,fi.cool=3)}let o=Ne.laneCenter(fi.lane)-n.x,a=Math.abs(o)>.25?Ke(o*.9,-1,1):0,l=n.kmh<e?.6:0,c=0;return s&&r<40&&s.speed<n.speed&&(l=0,c=Ke((n.speed-s.speed)/8+(40-r)/40,0,1)),{steer:a,throttle:l,brake:c,horn:!1,wiper:!1,megafon:!1}}var pi=new je,Jl=new A,jl=new Gt,S0=new pn,PM=new A(1,1,1),IM=new A,Ko=new A,Ti={pos:new A(0,4,10),look:new A(0,1,-10),init:!1};function no(){let i=ct.player;Jl.set(i.x,0,0),S0.set(0,-i.yaw,Ke(i.latAcc*.0025,-.03,.03),"YXZ"),jl.setFromEuler(S0),pi.compose(Jl,jl,PM),Tn.root.position.copy(Jl),Tn.root.quaternion.copy(jl),Ut.root.position.copy(Jl),Ut.root.quaternion.copy(jl)}function ic(i){let e=window.innerWidth/window.innerHeight,t=zr.degToRad(86),n=Math.max(zr.degToRad(i),2*Math.atan(Math.tan(t/2)/e));Mt.fov=Ke(zr.radToDeg(n),50,78),Mt.aspect=e,Mt.view&&(Mt.view.enabled=!1),Mt.updateProjectionMatrix()}var Ai={x:0,y:0};function LM(i){let e=window.innerWidth,t=window.innerHeight,n=0,s=0,r=Wt==="title"?document.querySelector(".screen-title:not(.hidden) .title-card"):null,o=r&&r.getBoundingClientRect();o&&o.width&&(e-o.right>e*.3?n=(o.right+e)/2-e/2:t-o.bottom>=o.top&&t-o.bottom>110?s=(o.bottom+t)/2-t/2:o.top>110&&(s=o.top/2-t/2));let a=1-Math.exp(-i*4);Ai.x+=(n-Ai.x)*a,Ai.y+=(s-Ai.y)*a,Math.abs(Ai.x)+Math.abs(Ai.y)>.5&&Mt.setViewOffset(e,t,-Ai.x,-Ai.y,e,t)}function sc(i){return IM.copy(i).applyMatrix4(pi)}function ec(i,e){let t=ct.player,n,s;if(e==="orbit"){let o=Xt*.16+.9;n=new A(Math.sin(o)*8.5,2.4+Math.sin(Xt*.3)*.6,Math.cos(o)*8.5),s=new A(0,.9,0)}else n=new A(-t.vx*.25,3.3,9.2),s=new A(0,1,-14);n.applyMatrix4(pi),s.applyMatrix4(pi),Ti.init||(Ti.pos.copy(n),Ti.look.copy(s),Ti.init=!0);let r=1-Math.exp(-i*(e==="orbit"?3:6));Ti.pos.lerp(n,r),Ti.look.lerp(s,r),Mt.position.copy(Ti.pos),Ut.shake>0&&(Mt.position.y+=Math.sin(Xt*60)*Ut.shake*.08),Mt.lookAt(Ti.look),ic(50),e==="orbit"?LM(i):Ai.x=Ai.y=0}var Es=[{t:0,pos:[-6.2,2.4,-9.5],look:[-.25,.95,0]},{t:2.4,pos:[-2.7,1.55,-3.4],look:[-.37,1.12,.22]},{t:4.6,pos:[-1.72,1.26,.2],look:[-.37,1.16,.28]}],ei=4.85,yd=6.3;function DM(i){let e=Es[0],t=Es[Es.length-1];for(let s=0;s<Es.length-1;s++)if(i>=Es[s].t&&i<=Es[s+1].t){e=Es[s],t=Es[s+1];break}if(i>t.t)return{pos:new A(...t.pos),look:new A(...t.look)};let n=Fu(Ke((i-e.t)/(t.t-e.t),0,1));return{pos:new A().fromArray(e.pos).lerp(new A().fromArray(t.pos),n),look:new A().fromArray(e.look).lerp(new A().fromArray(t.look),n)}}function kM(i){let e=Xt;if(e<ei){let{pos:n,look:s}=DM(e);return n.applyMatrix4(pi),s.applyMatrix4(pi),Mt.position.copy(n),Mt.lookAt(s),ic(44),"outside"}Ut.placeCamera(Mt,pi,e,ct.player.speed,0,i);let t=Fu(Ke((e-ei)/(yd-ei),0,1));return Mt.rotateOnWorldAxis(Ko.set(0,1,0),(1-t)*1.05),ic(58),"inside"}function $o(){ut.setPixelRatio(Ji),ut.setSize(window.innerWidth,window.innerHeight),I0(),Yo.setSize(Qi.x,Qi.y),qt.uTexel.value.set(1/Qi.x,1/Qi.y),Mt.aspect=window.innerWidth/window.innerHeight,Mt.updateProjectionMatrix(),oc.setPixelScale(Qi.y)}window.addEventListener("resize",$o);$o();var di={acc:0,n:0,cool:3};function UM(i){if(!dn.auto||Wt==="loading"||(di.acc+=i,di.n++,di.cool-=i,di.n<40))return;let e=di.acc/di.n;if(di.acc=0,di.n=0,di.cool>0)return;let t=Math.min(window.devicePixelRatio||1,1.5);e>1/45&&Ji>.55?(Ji=Math.max(.55,Ji-.12),di.cool=1.5,$o()):e<1/75&&Ji<t&&(Ji=Math.min(t,Ji+.06),di.cool=3,$o())}var T0=0;function O0(i,{cockpitOn:e,drops:t}){Tn.root.visible=!e,ut.shadowMap.needsUpdate=dn.shadows,ut.setRenderTarget(Yo),ut.render(mi,i),ut.setRenderTarget(null),qt.uDrops.value=t?1:0,qt.uPost.value=e?0:1,ut.render(D0,U0)}function NM(i){T0++,i&&T0%dn.mirrorEvery===0&&(ld.position.copy(sc(Ko.set(0,1.32,.9))),ld.lookAt(sc(Ko.set(0,1.05,40))),Tn.root.visible=!1,ut.setRenderTarget(gd),ut.render(mi,ld)),Ql&&(BM(Ql),Ql=null),O0(Mt,{cockpitOn:i,drops:i}),i&&(to.position.copy(Mt.position),to.quaternion.copy(Mt.quaternion),to.fov=Mt.fov,to.aspect=Mt.aspect,to.updateProjectionMatrix(),ut.autoClear=!1,ut.clearDepth(),ut.render(Ut.scene,to),HM(),ut.autoClear=!0)}function HM(){let i=qt.uGreen.value>.001||qt.uGlitch.value>.001;i&&(ut.getDrawingBufferSize(qo),(!bs||bs.image.width!==qo.x||bs.image.height!==qo.y)&&(bs&&bs.dispose(),bs=new Ja(qo.x,qo.y),ud.uniforms.tScreen.value=bs),ut.copyFramebufferToTexture(bs)),ud.uniforms.uCopy.value=i?1:0,ut.render(N0,U0)}function BM({kmh:i,clock:e}){Xo.aspect=4/3,Xo.updateProjectionMatrix(),Xo.position.copy(sc(Ko.set(2.6,1.55,-10.5))),Xo.lookAt(sc(Ko.set(-.3,1.05,-.3)));let t=Tn.cabinLight.intensity;Tn.cabinLight.intensity=5;let n=qt.uFlash.value;qt.uFlash.value=.01,O0(Xo,{cockpitOn:!1,drops:!1}),qt.uFlash.value=n,Tn.cabinLight.intensity=t,nr.drawImage(ut.domElement,0,0,ut.domElement.width,ut.domElement.height,0,0,360,270),nr.fillStyle="rgba(0,0,0,0.55)",nr.fillRect(0,238,360,32),nr.fillStyle="#ffd21f",nr.font='bold 17px "Courier New", monospace',nr.textAlign="left",nr.fillText(`${i} km/h   ${e}   ERLAUBT 120`,10,260);let s=null;try{s=ac.toDataURL("image/jpeg",.82)}catch{s=null}Ht.photo(s,i,e)}var fd=performance.now(),Sn=0,A0={prev:{}};function FM(i){let e=navigator.getGamepads?navigator.getGamepads():[];for(let t of e){if(!t)continue;let n=l=>!!t.buttons[l]?.pressed,s=t.axes[1]||0,r={up:n(12)||s<-.6,down:n(13)||s>.6,a:n(0),b:n(1),start:n(9)},o=l=>r[l]&&!A0.prev[l],a=0;o("up")&&(a=-1),o("down")&&(a=1),i&&(a||o("a")||o("b")||o("start"))&&Dn.pad(a,o("a")||o("start")&&Dn.current!=="pause",o("b")||o("start")&&Dn.current==="pause"),A0.prev=r;return}}function z0(i){requestAnimationFrame(z0);let e=(i-fd)/1e3;fd=i,!(pd&&window.__MA&&window.__MA.frozen)&&(e>0||(e=1/60),e=Math.min(e,1/20),G0(e),UM(e))}function G0(i,{render:e=!0}={}){Sn+=i,Xt+=i,an.poll(),FM(Dn.open);let t=ct.player,n=null,s=!1,r=0,o=0;switch(an.take("mute")&&(en.sound=!en.sound,nc("sound"),tr(at),Ht.toast(en.sound?"\u{1F50A} Ton an":"\u{1F507} Ton aus","info"),Dn.refresh("settings")),an.take("chat")&&(en.chat=!en.chat,nc("chat"),tr(at),Dn.refresh("settings")),Wt){case"title":{n=w0(i,118),ct.demo(i,n),no(),ec(i,"orbit"),r=Ei(.72,.9,Math.sin(Sn*.5)),o=Math.sin(Sn*.4)*.6;break}case"intro":{Xt>.3&&(an.anyKey||an.take("confirm"))&&(dd=!0),dd&&Xt<ei-.25&&(Xt=ei-.25),n=w0(i,100,!1),fi.lane=3,ct.update(i,n,Mt),no(),s=kM(i)==="inside",r=Ei(1,1.8,Xt)*(1-Ei(3.4,4,Xt)),o=Ei(1,2.6,Xt)*1;let u=Xt;Vt.fade=u<.6?1-u/.6:u>ei-.25&&u<ei?(u-(ei-.25))/.25:u>=ei&&u<ei+.35?1-(u-ei)/.35:0,!ct._greeted&&u>=ei&&(ct._greeted=!0,fn.whoosh(),ct.say("Hallo Mini Adam! Der Stream l\xE4uft. Gute Fahrt!","happy")),u>.4&&!ct._introChime&&(ct._introChime=!0,fn.nomiChime()),Xt>=yd&&(Wt="drive",Xt=0,Ht.show(!0),Ht.toast("Tipp: \u2190 \u2192 lenken \xB7 \u2191 Strom \xB7 \u2193 Bremse \xB7 V Kamera","info"));break}case"drive":{if(Ri){no(),ji==="cockpit"&&Ut.placeCamera(Mt,pi,Sn,0,0,0),s=ji==="cockpit";break}if(an.take("pause")){xd();break}an.take("camera")&&(ji=ji==="cockpit"?"drone":"cockpit",Ti.init=!1,Ht.cameraLabel(ji==="cockpit"?"\u{1F3A5} Cockpit":"\u{1F3A5} Drohne")),n={steer:an.steer,throttle:an.throttle,brake:an.brake,horn:an.take("horn"),wiper:an.take("wiper"),megafon:an.take("megafon")},ct.update(i,n,Mt),no(),ji==="cockpit"?(Ut.placeCamera(Mt,pi,Sn,t.speed,t.latAcc,i),ic(58),s=!0):ec(i,"follow"),ct.over&&(Wt="ending",Xt=0,Ti.init=!1,CM());break}case"ending":case"over":{let h={steer:0,throttle:0,brake:.5,horn:!1,wiper:!1,megafon:!1};t.update(i,h,{wet:ct.weather.level}),ir.update(i,Sn,t,{difficulty:.2,leftOpen:!1,rain:ct.weather.level}),P0.update(i,Sn,t,Mt,!1),no(),ec(i,"orbit"),r=Ei(.9,1.5,Xt),o=Math.sin(Xt*.5)*.8,Wt==="ending"&&Xt>2.6&&(Wt="over",Ht.show(!1),Dn.show("over",tc));break}default:break}let a=t.s,l=ct.weather?ct.weather.level:0,c=Ri;if(!c){let h=Xi.uCurve.value;h.x=125e-6*(.62*Math.sin(a/1900+1.3)+.38*Math.sin(a/740+.4)),h.y=45e-6*Math.sin(a/1300+2.1)*(.5+.5*Math.sin(a/3100));let u=ct.left||{glow:0};hd.update(a,i,Sn,u.glow||0,u.open&&u.timer<10?1:0),hd.setWet(l),md.update(a,i),ws.setOvercast(l*.95),oc.update(i,Sn,{speed:t.speed,s:a,camX:Mt.position.x,intensity:l}),Tn.update(i,t.speed,t.steer,Sn),Tn.setBrake(t.braking>.1||t.speed<1),Tn.adam.animate(Sn,{steer:t.steer,wave:r,look:o}),Tn.cabinLight.intensity=s?0:Wt==="title"||Wt==="intro"||Wt==="ending"||Wt==="over"?3.2:.9,Tn.setGroundShade(l),io.update(i,{speed:t.speed,camera:Mt,carMatrix:pi}),Ut.update({dt:i,t:Sn,steer:t.steer,latAcc:t.latAcc,wiperAngles:io.angles,sunDir:ws.sunDir,overcast:l,screen:ct.screenState?OM():null}),Vt.trunk>0&&(Vt.trunk-=i,Vt.trunk<=0&&Ut.setMirrorTexture(gd.texture))}ws.update(c?0:i,Mt,a,Sn),fn.update(i,{speed:t.speed,throttle:t.throttle,rain:l,sirenLevel:ct.sirenLevel||0,inCabin:s,paused:c||Wt==="over"}),Ut.shake=Math.max(0,Ut.shake-i*1.6),Vt.flash=Math.max(0,Vt.flash-i*3.5),Vt.glitch=Math.max(0,Vt.glitch-i),Vt.green=Math.max(0,Vt.green-i),qt.uTime.value=Sn,qt.uRain.value=l,qt.uFlash.value=Vt.flash,qt.uGlitch.value=Vt.glitch>0?.6+.4*Math.sin(Sn*40):0,qt.uGreen.value=Vt.green>0?Math.sin(Sn*26)>.2?1:.15:0,qt.uFade.value=Wt==="intro"?Ke(Vt.fade,0,1):0,qt.uSat.value=1.08-l*.25,pd&&window.__MA&&window.__MA.camHook&&window.__MA.camHook(Mt,pi),document.body.classList.toggle("playing",Wt==="drive"&&!Ri),e&&NM(s),Ht.update(Ri?0:i,Wt==="drive"||Wt==="intro"?ct:null),an.endFrame()}function OM(){try{return ct.running||ct.over?ct.screenState():R0()}catch{return R0()}}function R0(){let i=ct.player;return{dark:!1,battery:100,speedKmh:i.kmh,limit:null,playerX:i.x,leftLane:0,cars:ir.nearby(i,125),s:i.s,navi:ct.navi.screen(i.s,18*60,i.speed),clock:"18:00",temp:17,funkloch:0,wiperOn:!1}}window.addEventListener("pointerdown",()=>fn.init());window.addEventListener("keydown",()=>fn.init());document.addEventListener("visibilitychange",()=>{document.hidden?(xd(),fn.suspend()):fn.resume()});function zM(){Zo(),ct.startDemo(),no(),ec(.016,"orbit");try{ut.compile(mi,Mt),ut.compile(Ut.scene,Mt)}catch{}Wt="title",Dn.show("title",at),cd.classList.add("done"),setTimeout(()=>cd.remove(),800),requestAnimationFrame(i=>{fd=i,z0(i)})}pd&&(window.__MA={game:ct,traffic:ir,scenery:md,cockpit:Ut,windshield:io,tesla:Tn,ui:Ht,menus:Dn,input:an,renderer:ut,camera:Mt,save:at,get state(){return Wt},set view(i){ji=i},start:()=>B0(),skipIntro:()=>{Xt=yd},step:(i,e=1/30)=>{let t=Math.round(i/e);for(let n=0;n<t;n++)G0(e,{render:n===t-1})},setState:(i,e=0)=>{Wt=i,Xt=e},rain:i=>{ct.weather.active=i>0,ct.weather.target=i,ct.weather.level=i,ct.weather.dur=999,io.setRain(i)},pause:()=>xd(),resume:()=>F0()});zM();})();
