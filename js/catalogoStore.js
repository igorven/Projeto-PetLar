// Catálogo demonstrativo compartilhado: a API PHP assumirá essa responsabilidade futuramente.
window.PetLarStore = (() => {
  const KEY = 'petlar_animais_v1';
  function parse(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return Array.isArray(v) ? v : fallback; } catch { return fallback; } }
  function animais() { return parse(KEY, window.PETLAR_ANIMAIS || []).map(a => ({...a, especie: window.PetLarEspecie?.(a) || a.especie || "Outro", raca: window.PetLarRaca?.(a) || a.raca || "Não informada"})); }
  function salvarAnimais(lista) { localStorage.setItem(KEY, JSON.stringify(lista)); }
  function usuarios() { return parse('usuario', []); }
  function salvarUsuarios(lista) { localStorage.setItem('usuario', JSON.stringify(lista)); }
  function pedidos() { return usuarios().flatMap((usuario, indiceUsuario) => (usuario.adocoes || []).map((pedido, indicePedido) => ({usuario, indiceUsuario, pedido, indicePedido}))); }
  function disponiveis() { const aprovados = new Set(pedidos().filter(x => x.pedido.status === 'aprovada').map(x => x.pedido.nome)); return animais().filter(a => a.ativo !== false && !aprovados.has(a.nome)); }
  return { animais, salvarAnimais, usuarios, salvarUsuarios, pedidos, disponiveis };
})();
