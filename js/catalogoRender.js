// Preenche o catálogo com os dados cadastrados pelo painel de demonstração.
const grade = document.querySelector('.catalog-main .cards');
if (grade && window.PetLarStore) {
  grade.replaceChildren();
  PetLarStore.disponiveis().forEach(animal => {
    const card = document.createElement('article'); card.className = `card ${animal.categoria}`; card.dataset.id = animal.id; card.dataset.especie = animal.especie; card.dataset.raca = animal.raca;
    const img = document.createElement('img'); img.src = animal.imagem || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600'; img.alt = `Foto de ${animal.nome}`; img.loading = 'lazy';
    const info = document.createElement('div'); info.className = 'info';
    const titulo = document.createElement('h3'); titulo.textContent = animal.nome;
    const resumo = document.createElement('p'); resumo.textContent = animal.resumo || 'Conheça este animal';
    const link = document.createElement('a'); link.className = 'btn-detalhes'; link.href = `animal.html?id=${encodeURIComponent(animal.id)}`; link.textContent = `Conhecer ${animal.nome}`;
    const btn = document.createElement('button'); btn.className = 'btn-adotar'; btn.dataset.animal = animal.nome; btn.textContent = 'Quero Adotar'; btn.type = 'button';
    const especieRaca = document.createElement('p'); especieRaca.className='animal-breed'; especieRaca.textContent=`${animal.especie} · ${animal.raca}`;
    info.append(titulo,especieRaca,resumo,link,btn); card.append(img,info); grade.append(card);
  });
}
