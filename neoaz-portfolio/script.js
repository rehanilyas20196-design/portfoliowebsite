/* ============================================================
   Rehan Ilyas — portfolio interactions
   ============================================================ */

(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var mobileOverlay = document.getElementById("mobileOverlay");
  var mobileClose = document.getElementById("mobileClose");

  /* ---------- sticky nav ---------- */
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  function openMenu() {
    mobileOverlay.classList.add("open");
    navToggle.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    mobileOverlay.classList.remove("open");
    navToggle.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (navToggle) navToggle.addEventListener("click", function () {
    mobileOverlay.classList.contains("open") ? closeMenu() : openMenu();
  });
  if (mobileClose) mobileClose.addEventListener("click", closeMenu);
  if (mobileOverlay) mobileOverlay.addEventListener("click", function (e) {
    if (e.target === mobileOverlay) closeMenu();
  });
  mobileOverlay.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- modals ---------- */
  function openModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    m.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal(el) {
    el.classList.remove("open");
    if (!mobileOverlay.classList.contains("open")) document.body.style.overflow = "";
  }
  function onOverlayClick(overlay, e) {
    if (e.target === overlay) closeModal(overlay);
  }

  // project modal
  var projLink = document.querySelector("[data-project='corecollective']");
  var projOverlay = document.getElementById("projOverlay");
  if (projLink && projOverlay) {
    projLink.addEventListener("click", function (e) {
      e.preventDefault();
      openModal("projOverlay");
    });
    document.getElementById("projClose").addEventListener("click", function () { closeModal(projOverlay); });
    projOverlay.addEventListener("click", function (e) { onOverlayClick(projOverlay, e); });
  }

  // DevOps group modal
  var devopsCard = document.querySelector("[data-cert='devops']");
  var devopsModal = document.getElementById("devopsModal");
  if (devopsCard && devopsModal) {
    devopsCard.addEventListener("click", function (e) {
      e.preventDefault();
      openModal("devopsModal");
    });
    devopsModal.querySelectorAll("[data-close]").forEach(function (btn) {
      btn.addEventListener("click", function () { closeModal(devopsModal); });
    });
    devopsModal.addEventListener("click", function (e) { onOverlayClick(devopsModal, e); });
  }

  // close any modal with Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".overlay.open, .modal.open").forEach(closeModal);
      closeMenu();
    }
  });

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
