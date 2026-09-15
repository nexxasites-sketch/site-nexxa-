
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
/* =========================
   NEXXA PARTICLES
========================= */

(function(){
    const canvas = document.getElementById("nexxaParticles");
    if(!canvas) return;

    const ctx = canvas.getContext("2d");
    const box = canvas.parentElement;

    let particles = [];
    let targets = [];
    let width = 0;
    let height = 0;
    let animationFrame;

    function resize(){
        const rect = box.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        width = rect.width;
        height = rect.height;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(dpr,0,0,dpr,0,0);

        createTargets();
        createParticles();
    }

    function createTargets(){
        const off = document.createElement("canvas");
        const octx = off.getContext("2d");

        off.width = Math.max(400, width);
        off.height = Math.max(300, height);

        octx.clearRect(0,0,off.width,off.height);

        const fontSize = Math.min(width * .19, 92);

        octx.font = `800 ${fontSize}px Manrope, Arial, sans-serif`;
        octx.textAlign = "center";
        octx.textBaseline = "middle";
        octx.fillStyle = "#fff";

        octx.fillText(
            "NEXXA",
            off.width / 2,
            off.height / 2
        );

        const image = octx.getImageData(
            0,
            0,
            off.width,
            off.height
        );

        targets = [];

        const step = width < 500 ? 5 : 4;

        for(let y = 0; y < off.height; y += step){
            for(let x = 0; x < off.width; x += step){

                const index = (y * off.width + x) * 4;

                if(image.data[index + 3] > 150){

                    targets.push({
                        x: x * (width / off.width),
                        y: y * (height / off.height)
                    });

                }
            }
        }

        /* limita a quantidade para ficar leve no celular */
        const maxParticles = width < 600 ? 900 : 1500;

        if(targets.length > maxParticles){
            const reduced = [];

            for(let i = 0; i < maxParticles; i++){
                const index = Math.floor(
                    i * targets.length / maxParticles
                );

                reduced.push(targets[index]);
            }

            targets = reduced;
        }
    }

    function createParticles(){

        particles = targets.map((target,index)=>{

            const fromLeft = index % 2 === 0;

            return {
                x: fromLeft
                    ? -Math.random() * width * .7
                    : width + Math.random() * width * .7,

                y: Math.random() * height,

                targetX: target.x,
                targetY: target.y,

                size: Math.random() * 1.8 + .5,

                speed: Math.random() * .018 + .012,

                delay: Math.random() * 90,

                life: 0,

                color: fromLeft
                    ? (
                        Math.random() > .5
                        ? "rgba(57,220,255,"
                        : "rgba(91,140,255,"
                    )
                    : (
                        Math.random() > .5
                        ? "rgba(189,124,255,"
                        : "rgba(255,114,200,"
                    )
            };
        });
    }

    function animate(){

        ctx.clearRect(0,0,width,height);

        particles.forEach(p=>{

            if(p.delay > 0){
                p.delay--;
            }else{

                p.life += p.speed;

                const progress = Math.min(p.life,1);

                const ease =
                    1 - Math.pow(1-progress,3);

                const driftX =
                    Math.sin(p.life * 7 + p.targetY) * 5;

                const driftY =
                    Math.cos(p.life * 6 + p.targetX) * 4;

                p.x += (
                    p.targetX + driftX - p.x
                ) * .025;

                p.y += (
                    p.targetY + driftY - p.y
                ) * .025;
            }

            const distance =
                Math.abs(p.x - p.targetX) +
                Math.abs(p.y - p.targetY);

            const alpha =
                distance > 250
                ? .35
                : .45 + Math.random() * .55;

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                p.color + alpha + ")";

            ctx.fill();

        });

        animationFrame =
            requestAnimationFrame(animate);
    }

    resize();

    window.addEventListener(
        "resize",
        resize
    );

    animate();

})();
