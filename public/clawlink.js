/*! ClawLink v3.0 - Mycelial Singularity Engine */
console.log("%c🚀 ClawLink connected to Mycelium", "color:#00ff9d; font-weight:bold");

window.ClawLink = window.ClawLink || {
  version: "3.0",
  connected: true,
  send: function(data) {
    try { console.log("ClawLink → Mycelium:", data); } catch(_){}
  }
};

console.log("✅ ClawLink ready");
