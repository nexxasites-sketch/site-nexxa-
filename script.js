
const qs=s=>document.querySelector(s), qsa=s=>[...document.querySelectorAll(s)];
const PLANS={
 essencial:{name:"Essencial",price:399.99,maintenance:75},
 profissional:{name:"Profissional",price:599.99,maintenance:117},
 avancado:{name:"Avançado",price:799.99,maintenance:150}
};
const extras={
 mapa:["Mapa / localização",49.99],pagina:["Página adicional",39.99],feedback:["Feedbacks / depoimentos",69.99],
 catalogo:["Catálogo de produtos",59.99],agendamento:["Agendamento",299.99],whatsapp:["WhatsApp",29.99],
 instagram:["Instagram",29.99],faq:["FAQ",159.99],galeria:["Galeria",189.99]
};
const demos={
 Barbearia:{file:"barbearia.html",image:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85",tag:"BARBEARIA",desc:"Estilo que começa no detalhe."},
 Restaurante:{file:"restaurante.html",image:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",tag:"RESTAURANTE",desc:"Sabor que merece ser visto."},
 Oficina:{file:"oficina.html",image:"https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=85",tag:"OFICINA",desc:"Seu carro em boas mãos."},
 "Salão":{file:"salao.html",image:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85",tag:"SALÃO",desc:"Beleza em cada detalhe."},
 Loja:{file:"loja.html",image:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",tag:"LOJA",desc:"Seu próximo favorito está aqui."}
};
let currentStep=1;
const brl=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function selectedPlan(){return qs('input[name="plan"]:checked')?.value||"profissional"}
function calc(){
 const p=PLANS[selectedPlan()];let extraTotal=0,details=[p.name];
 qsa('.extras input[type="checkbox"]:checked').forEach(input=>{
  const key=input.dataset.extra,[name,price]=extras[key]||["",0];
  if(key==="pagina"){const qty=Math.max(1,Math.min(20,Number(qs('[data-qty="pagina"]')?.value)||1));extraTotal+=price*qty;details.push(`${qty}x ${name}`)}
  else{extraTotal+=price;details.push(name)}
 });
 const domain=qs("#domainCheck")?.checked||false;if(domain){extraTotal+=100;details.push("Serviço de domínio")}
 const subtotal=p.price+extraTotal,discount=subtotal*.20,total=subtotal-discount;
 qs("#liveTotal").textContent=brl(total);qs("#liveMaintenance").textContent=`+ ${brl(p.maintenance)}/mês`;qs("#liveDetails").textContent=details.join(" • ");
 return{p,subtotal,discount,total,domain};
}
function renderSummary(){
 const c=calc();let rows=[`<div class="summary-row"><span>${c.p.name}</span><b>${brl(c.p.price)}</b></div>`];
 qsa('.extras input[type="checkbox"]:checked').forEach(input=>{
  const key=input.dataset.extra,[name,price]=extras[key]||["",0];let qty=key==="pagina"?Math.max(1,Math.min(20,Number(qs('[data-qty="pagina"]')?.value)||1)):1;
  rows.push(`<div class="summary-row"><span>${qty>1?qty+"x ":""}${name}</span><span>${brl(price*qty)}</span></div>`);
 });
 if(c.domain)rows.push(`<div class="summary-row"><span>Serviço de domínio</span><span>R$ 100,00</span></div>`);
 rows.push(`<div class="summary-row"><span>Subtotal</span><span>${brl(c.subtotal)}</span></div>`);
 rows.push(`<div class="summary-row discount-row"><span>Desconto de 20%</span><span>− ${brl(c.discount)}</span></div>`);
 rows.push(`<div class="summary-row total"><span>Total estimado</span><span>${brl(c.total)}</span></div>`);
 rows.push(`<div class="summary-row"><span>Manutenção</span><span>${brl(c.p.maintenance)}/mês</span></div>`);
 qs("#summaryBox").innerHTML=rows.join("");
}
function go(step){
 currentStep=step;qsa(".step-panel").forEach(x=>x.classList.toggle("active",Number(x.dataset.step)===step));
 qsa("[data-step-dot]").forEach(x=>{const n=Number(x.dataset.stepDot);x.classList.toggle("active",n===step);x.classList.toggle("done",n<step)});
 if(step===4)renderSummary();document.querySelector(".builder")?.scrollIntoView({behavior:"smooth",block:"start"});
}
qsa("[data-next]").forEach(b=>b.addEventListener("click",()=>{
 const target=Number(b.dataset.next);
 if(target===4){
  let ok=true;qsa("[required]").forEach(el=>{if(!el.value.trim()){el.focus();el.style.borderColor="#ff667d";ok=false}});
  if(!ok)return;
 }
 go(target);
}));
qsa("[data-prev]").forEach(b=>b.addEventListener("click",()=>go(Number(b.dataset.prev))));
qsa('input[name="plan"], .extras input, .qty').forEach(el=>el.addEventListener("change",calc));
qsa("[data-choose]").forEach(b=>b.addEventListener("click",()=>{const i=qs(`input[name="plan"][value="${b.dataset.choose}"]`);if(i){i.checked=true;calc();go(1)}}));

const modal=qs("#demoModal"),modalTitle=qs("#modalTitle"),preview=qs("#modalPreview"),modalDemo=qs("#modalDemo");
qsa("[data-demo]").forEach(card=>card.addEventListener("click",()=>{
 const key=card.dataset.demo,d=demos[key];if(!d)return;
 modalTitle.textContent=`Exemplo de ${key}`;preview.style.backgroundImage=`url("${d.image}")`;
 preview.innerHTML=`<div class="modal-preview-copy"><b>${d.tag}</b><span>${d.desc}</span></div>`;
 modalDemo.href=`exemplos/${d.file}`;modal.classList.add("open");modal.setAttribute("aria-hidden","false");
}));
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
qs("#modalClose")?.addEventListener("click",closeModal);modal?.addEventListener("click",e=>{if(e.target===modal)closeModal()});
qs("#modalQuote")?.addEventListener("click",closeModal);

const toast=qs("#toast");
function showToast(t){toast.textContent=t;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2200)}
qs("#copyQuote")?.addEventListener("click",async()=>{const c=calc();const text=`NEXXA — orçamento estimado\nPlano: ${c.p.name}\nTotal: ${brl(c.total)}\nManutenção: ${brl(c.p.maintenance)}/mês`;try{await navigator.clipboard.writeText(text);showToast("Orçamento copiado!")}catch(e){showToast("Selecione e copie o resumo acima.")}});
qs("#instagramQuote")?.addEventListener("click",()=>{const c=calc();const company=qs("#company")?.value||"meu negócio";const text=encodeURIComponent(`Olá, NEXXA! Quero criar um site para ${company}. Plano ${c.p.name}, estimativa ${brl(c.total)} + ${brl(c.p.maintenance)}/mês.`);window.open(`https://www.instagram.com/nexxa.sites/?text=${text}`,"_blank")});
qs("#menuBtn")?.addEventListener("click",()=>qs("#nav")?.classList.toggle("open"));
qsa(".nav a").forEach(a=>a.addEventListener("click",()=>qs("#nav")?.classList.remove("open")));
qs("#year").textContent=new Date().getFullYear();calc();
