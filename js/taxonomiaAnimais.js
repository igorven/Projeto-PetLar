// Exemplos de raças para facilitar o preenchimento, sem inferir raça pela fotografia.
window.PetLarTaxonomia = Object.freeze({
  Cachorro: ['Sem raça definida (SRD)', 'Labrador Retriever', 'Golden Retriever', 'Poodle', 'Shih-tzu', 'Pinscher', 'Pastor-alemão', 'Bulldog francês', 'Beagle', 'Outra raça', 'Não informada'],
  Gato: ['Sem raça definida (SRD)', 'Siamês', 'Persa', 'Maine Coon', 'Ragdoll', 'Angorá', 'Sphynx', 'British Shorthair', 'Outra raça', 'Não informada'],
  Coelho: ['Sem raça definida (SRD)', 'Mini Lop', 'Holland Lop', 'Lionhead', 'Nova Zelândia', 'Outra raça', 'Não informada'],
  Ave: ['Não se aplica / não informada', 'Outra raça/variedade'],
  Outro: ['Não informada', 'Outra raça']
});
window.PetLarEspecie = animal => animal.especie || ({cachorro:'Cachorro',gato:'Gato'}[animal.categoria] || 'Outro');
window.PetLarRaca = animal => animal.raca || 'Não informada';
