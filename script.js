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
  var note=lf.querySelector('.formnote');
  var btn=lf.querySelector('button[type="submit"]');
  lf.addEventListener('submit',function(ev){
    ev.preventDefault();
    var f=ev.target;
    var payload={
      nom:f.nom.value,
      societe:(f.soc&&f.soc.value)||'',
      email:f.mail.value,
      telephone:(f.tel&&f.tel.value)||'',
      localisation:(f.lieu&&f.lieu.value)||'',
      message:f.msg.value,
      _subject:'Demande de rachat de stock — '+((f.soc&&f.soc.value)||f.nom.value)
    };
    if(FORMSPREE_ID){
      btn.disabled=true;btn.textContent='Envoi en cours…';
      fetch('https://formspree.io/f/'+FORMSPREE_ID,{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(payload)
      }).then(function(r){
        if(r.ok){
          lf.reset();
          btn.textContent='Demande envoyée ✓';
          if(note)note.textContent='Merci — votre demande est bien reçue. On vous répond rapidement.';
        }else{throw new Error('bad status');}
      }).catch(function(){
        btn.disabled=false;btn.textContent='Envoyer ma demande';
        if(note)note.textContent="L'envoi a échoué. Réessayez, ou écrivez-nous directement à contact@jds-global.com.";
      });
    }else{
      var body='Nom : '+payload.nom+'\n'+
        'Société : '+(payload.societe||'—')+'\n'+
        'E-mail : '+payload.email+'\n'+
        'Téléphone : '+(payload.telephone||'—')+'\n'+
        'Localisation : '+(payload.localisation||'—')+'\n\n'+
        'Lot à écouler :\n'+payload.message+'\n';
      window.location.href='mailto:contact@jds-global.com?subject='+encodeURIComponent(payload._subject)+'&body='+encodeURIComponent(body);
    }
  });
}
