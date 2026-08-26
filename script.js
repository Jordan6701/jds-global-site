// ===== CONFIGURATION =====
// Après avoir créé ton formulaire sur https://formspree.io (gratuit),
// colle ici l'ID fourni (ex: "mzbqwxyz"). Tant que c'est vide, le
// formulaire utilise le mailto (ouvre la messagerie du visiteur).
var FORMSPREE_ID = "";
// =========================

// Mobile menu
var burger=document.getElementById('burger'), menu=document.getElementById('menu');
if(burger&&menu){
  burger.addEventListener('click',function(){
    var open=menu.classList.toggle('open');
    burger.setAttribute('aria-expanded',open);
  });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(){menu.classList.remove('open');burger.setAttribute('aria-expanded',false);});
  });
}

// Scroll reveal
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

// Contact form
var lf=document.getElementById('leadform');
if(lf){
  var statut=document.getElementById('formstatus');
  var btn=lf.querySelector('button[type="submit"]');

  function dire(txte,etat){
    if(!statut) return;
    statut.textContent=txte;
    statut.className='formstatus'+(etat?' '+etat:'');
  }

  /* Tant qu'aucun identifiant Formspree n'est renseigne, le bouton n'envoie rien :
     il ouvre la messagerie du visiteur, qui doit poster l'e-mail lui-meme. On le dit,
     sinon le bouton promet un envoi qu'il ne fait pas. L'avertissement disparait tout
     seul le jour ou FORMSPREE_ID est rempli — il ne peut donc pas devenir faux. */
  if(!FORMSPREE_ID) dire('Ce bouton ouvre votre logiciel de messagerie avec la demande préremplie : il reste à l’envoyer depuis votre messagerie.');

  lf.addEventListener('submit',function(ev){
    ev.preventDefault();
    var f=ev.target;
    var payload={
      nom:f.nom.value,
      societe:(f.soc&&f.soc.value)||'',
      email:f.mail.value,
      telephone:(f.tel&&f.tel.value)||'',
      message:f.msg.value,
      _subject:'Demande de rachat de stock — '+((f.soc&&f.soc.value)||f.nom.value)
    };
    if(FORMSPREE_ID){
      btn.disabled=true;btn.textContent='Envoi en cours…';
      dire('');
      fetch('https://formspree.io/f/'+FORMSPREE_ID,{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(payload)
      }).then(function(r){
        if(r.ok){
          lf.reset();
          btn.textContent='Demande envoyée ✓';
          dire('Merci — votre demande nous est parvenue. Nous revenons vers vous rapidement.','ok');
        }else{throw new Error('bad status');}
      }).catch(function(){
        btn.disabled=false;btn.textContent='Envoyer ma demande';
        dire('L’envoi a échoué : rien ne nous est parvenu. Réessayez, ou écrivez-nous directement à contact@jds-global.com.','ko');
      });
    }else{
      var body='Nom : '+payload.nom+'\n'+
        'Société : '+(payload.societe||'—')+'\n'+
        'E-mail : '+payload.email+'\n'+
        'Téléphone : '+(payload.telephone||'—')+'\n\n'+
        'Lot à écouler :\n'+payload.message+'\n';
      window.location.href='mailto:contact@jds-global.com?subject='+encodeURIComponent(payload._subject)+'&body='+encodeURIComponent(body);
    }
  });
}

/* ===== Consentement aux traceurs =====
   Etat des lieux au 26 aout 2026 : ce site ne charge AUCUN traceur. Le bandeau n'a donc
   rien a bloquer aujourd'hui — il recueille le choix a l'avance et expose le mecanisme qui
   le fera respecter le jour ou un outil de mesure sera ajoute.
   Pour brancher un outil plus tard, appeler jdsConsent.auTraceur(function(){ ... }) :
   la fonction ne s'executera que si le visiteur a accepte, et immediatement s'il accepte
   apres coup. Ne jamais poser de script de mesure en dehors de ce passage.
   Le choix vit dans le stockage local du visiteur : aucun cookie, rien ne nous est transmis. */
var jdsConsent=(function(){
  var CLE='jds-consent', ecouteurs=[];
  function lire(){ try{ return localStorage.getItem(CLE); }catch(e){ return null; } }
  function ecrire(v){ try{ localStorage.setItem(CLE,v); }catch(e){} }
  function diffuser(){ if(lire()!=='accepte') return;
    while(ecouteurs.length){ try{ ecouteurs.shift()(); }catch(e){} } }

  /* Attire l'oeil sur un bandeau deja affiche : sans ca, « Modifier mon choix »
     ne produit aucun effet visible quand le visiteur n'a pas encore repondu. */
  function signaler(el){
    el.classList.remove('cc-attn');
    void el.offsetWidth;              // force le navigateur a rejouer l'animation
    el.classList.add('cc-attn');
  }

  function bandeau(){
    var deja=document.querySelector('.cc');
    if(deja){ signaler(deja); return; }
    var el=document.createElement('aside');
    el.className='cc'; el.setAttribute('role','dialog');
    el.setAttribute('aria-label','Consentement aux cookies de mesure');
    el.innerHTML='<div class="cc-in"><div class="cc-txt">'
      +'<b>Cookies de mesure</b>'
      +'Ce site n’en dépose aucun aujourd’hui. Si nous ajoutons un outil de statistiques, '
      +'il ne sera activé que si vous l’acceptez ici. '
      +'<a href="/confidentialite">En savoir plus</a></div>'
      +'<div class="cc-acts">'
      +'<button type="button" class="btn ghost" data-cc="refuse">Refuser</button>'
      +'<button type="button" class="btn" data-cc="accepte">Accepter</button>'
      +'</div></div>';
    document.body.appendChild(el);
    requestAnimationFrame(function(){ el.classList.add('show'); });
    el.addEventListener('click',function(e){
      var b=e.target.closest('[data-cc]'); if(!b) return;
      ecrire(b.getAttribute('data-cc'));
      el.classList.remove('show');
      setTimeout(function(){ el.remove(); },340);
      diffuser();
    });
  }

  /* Le bandeau est deja la : on le signale sans remettre le choix a zero.
     Sinon on efface le choix precedent et on le redemande. */
  function rouvrir(){
    if(!document.querySelector('.cc')){ try{ localStorage.removeItem(CLE); }catch(e){} }
    bandeau();
  }

  document.addEventListener('DOMContentLoaded',function(){
    if(!lire()) bandeau();
    // Depuis la politique de confidentialite : revenir sur son choix.
    var r=document.getElementById('cookie-reopen');
    if(r) r.addEventListener('click',rouvrir);
    diffuser();
  });

  return {
    etat:lire,
    auTraceur:function(fn){ ecouteurs.push(fn); if(lire()==='accepte') diffuser(); },
    rouvrir:rouvrir
  };
})();
