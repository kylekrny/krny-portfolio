import{a}from"./_astro_actions.B1Hs8mhV.js";document.addEventListener("DOMContentLoaded",()=>{function s(e){if(!e)return;e.classList.remove("hidden");const t=e.querySelector(".fixed");t&&(t.classList.remove("opacity-0"),t.classList.add("opacity-100"));const o=e.querySelector(".relative");o&&(o.classList.remove("opacity-0","translate-y-4","sm:translate-y-0","sm:scale-95"),o.classList.add("opacity-100","translate-y-0","sm:scale-100")),document.addEventListener("keydown",c),e.addEventListener("click",r)}function n(e){if(!e)return;const t=e.querySelector(".fixed");t&&(t.classList.remove("opacity-100"),t.classList.add("opacity-0"));const o=e.querySelector(".relative");o&&(o.classList.remove("opacity-100","translate-y-0","sm:scale-100"),o.classList.add("opacity-0","translate-y-4","sm:translate-y-0","sm:scale-95")),setTimeout(()=>{e.classList.add("hidden")},200),document.removeEventListener("keydown",c),e.removeEventListener("click",r)}function c(e){e.key==="Escape"&&document.querySelectorAll(".relative.z-10:not(.hidden)").forEach(t=>n(t))}document.querySelector("#backdrop")?.addEventListener("click",()=>{document.querySelectorAll(".relative.z-10:not(.hidden)").forEach(e=>n(e))});function r(e){const t=e.currentTarget,o=e.target;o&&(o===t||o.classList.contains("fixed"))&&t instanceof HTMLElement&&n(t)}document.querySelectorAll(".open-modal").forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-modal-id");if(!t)return;const o=document.getElementById(t);o&&s(o)})}),document.querySelectorAll(".close-modal").forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-close-id");if(!t)return;const o=document.getElementById(t);o&&n(o)})})});const i=async s=>{s.preventDefault();const n=s.target;if(!n)return;const c=new FormData(n),r=Object.fromEntries(c.entries());console.log(r);const e=await a.project(r);console.log(e),e.error?alert("There was an error submitting the form. Please try again."):(n.reset(),alert("Thanks for reaching out! I’ll get back to you soon."))},l=document.getElementById("project-form");l?.addEventListener("submit",i);
