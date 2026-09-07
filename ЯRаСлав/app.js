// Constants for localStorage
const STORAGE_KEY = 'family_tree_positions_v2';
const DB_KEY = 'family_tree_db_v2';
const TEMPLATE_KEY = 'family_tree_label_template_v2';

// Name and Date Parsing Helpers
function parseFullName(person) {
  const fullName = person.name || '';
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  
  let lastName = '';
  let firstName = '';
  let parentName = '';

  if (parts.length === 3) {
    const isPatronymic = (w) => /ович$|івна$|ич$|ївна$|евич$|євна$/i.test(w);
    if (isPatronymic(parts[1])) {
      firstName = parts[0];
      parentName = parts[1];
      lastName = parts[2];
    } else if (isPatronymic(parts[2])) {
      lastName = parts[0];
      firstName = parts[1];
      parentName = parts[2];
    } else {
      firstName = parts[0];
      parentName = parts[1];
      lastName = parts[2];
    }
  } else if (parts.length === 2) {
    const idParts = person.id.split('/');
    const idSurnameSlug = idParts[0] ? idParts[0].toLowerCase() : '';
    const isMatchSlug = (w) => transliterate(w.toLowerCase()) === idSurnameSlug;
    
    if (isMatchSlug(parts[0])) {
      lastName = parts[0];
      firstName = parts[1];
    } else if (isMatchSlug(parts[1])) {
      firstName = parts[0];
      lastName = parts[1];
    } else {
      firstName = parts[0];
      lastName = parts[1];
    }
  } else if (parts.length === 1) {
    firstName = parts[0];
    const idParts = person.id.split('/');
    if (idParts[0] && idParts[0] !== 'custom') {
      lastName = idParts[0].charAt(0).toUpperCase() + idParts[0].slice(1);
    }
  }

  let birthdayStr = '';
  const dateMatch = person.id.match(/\/(\d{4})(\d{2})?(\d{2})?$/);
  if (dateMatch) {
    const y = dateMatch[1];
    const m = dateMatch[2] || '01';
    const d = dateMatch[3] || '01';
    birthdayStr = y + '-' + m + '-' + d;
  }

  return { lastName, firstName, parentName, birthdayStr };
}

function formatNodeLabel(person, template) {
  const { lastName, firstName, parentName, birthdayStr } = parseFullName(person);
  
  let label = template
    .replace(/{LastName}/g, lastName)
    .replace(/{FirstName}/g, firstName)
    .replace(/{ParentName}/g, parentName);
    
  label = label.replace(/{Birthday:([^}]+)}/g, (match, fmt) => {
    if (!birthdayStr) return '';
    const parts = birthdayStr.split('-');
    const y = parts[0] || '';
    const m = parts[1] || '';
    const d = parts[2] || '';
    
    if (fmt === 'YYYY-MM-DD') return birthdayStr;
    if (fmt === 'YYYY-MM') return y + '-' + m;
    if (fmt === 'YYYY') return y;
    return birthdayStr;
  });

  label = label.replace(/<br\s*\/?>/gi, '\n');
  return label.split('\n').map(line => line.trim().replace(/\s+/g, ' ')).filter(Boolean).join('\n');
}

let currentTemplate = localStorage.getItem(TEMPLATE_KEY) || '{LastName}<br>{FirstName} {ParentName}<br>({Birthday:YYYY})';

// 1. Load custom DB overrides & merge
const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
const savedPositions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
const hasSavedPositions = Object.keys(savedPositions).length > 0;

const people = { ...rawPeople };
Object.keys(db).forEach(id => {
  people[id] = {
    ...people[id],
    ...db[id]
  };
});

// 2. Level calculation in the browser
Object.values(people).forEach(p => p.level = -1);

function getLevel(personId) {
  const person = people[personId];
  if (!person) return 0;
  if (person.level !== -1) return person.level;

  const fId = person.parents.father;
  const mId = person.parents.mother;

  let fLevel = fId ? getLevel(fId) : -1;
  let mLevel = mId ? getLevel(mId) : -1;

  person.level = Math.max(fLevel, mLevel) + 1;
  return person.level;
}

Object.keys(people).forEach(id => getLevel(id));

// 3. Build visNodes & visEdges
const visNodes = [];
const visEdges = [];

Object.values(people).forEach(person => {
  const birthMatch = person.id.match(/\/(\d{4}(?:\d{2})?)/);
  const birthYear = birthMatch ? ' (' + birthMatch[1].slice(0,4) + ')' : '';
  
  // Theme styling based on gender
  let bgColor = '#1e293b'; // slate-800
  let borderColor = '#64748b'; // slate-500
  let hoverBg = '#334155';
  let hoverBorder = '#94a3b8';
  
  if (person.gender === 'male') {
    bgColor = '#0369a1'; // sky-700
    borderColor = '#0284c7'; // sky-600
    hoverBg = '#0284c7';
    hoverBorder = '#38bdf8';
  } else if (person.gender === 'female') {
    bgColor = '#be185d'; // pink-700
    borderColor = '#db2777'; // pink-600
    hoverBg = '#db2777';
    hoverBorder = '#f472b6';
  }

  const nodeObj = {
    id: person.id,
    label: formatNodeLabel(person, currentTemplate),
    level: person.level,
    color: {
      background: bgColor,
      border: borderColor,
      highlight: {
        background: hoverBg,
        border: hoverBorder
      }
    },
    title: person.name,
    shape: 'box',
    margin: 12,
    font: { color: '#f8fafc', size: 14, face: 'Outfit, sans-serif' },
    borderWidth: 2,
    shadow: true
  };

  if (savedPositions[person.id]) {
    nodeObj.x = savedPositions[person.id].x;
    nodeObj.y = savedPositions[person.id].y;
  }

  visNodes.push(nodeObj);

  const fId = person.parents.father;
  const mId = person.parents.mother;

  if (fId && people[fId]) {
    visEdges.push({
      from: fId,
      to: person.id,
      arrows: 'to',
      color: { color: '#0ea5e9', highlight: '#38bdf8' },
      width: 2,
      smooth: { type: 'cubicBezier', roundness: 0.5 }
    });
  }
  if (mId && people[mId]) {
    visEdges.push({
      from: mId,
      to: person.id,
      arrows: 'to',
      color: { color: '#ec4899', highlight: '#f472b6' },
      width: 2,
      smooth: { type: 'cubicBezier', roundness: 0.5 }
    });
  }

  // Spouse links
  if (person.spouses) {
    person.spouses.forEach(sId => {
      if (people[sId]) {
        const edgeId = [person.id, sId].sort().join('---');
        if (!visEdges.some(e => e.id === edgeId)) {
          visEdges.push({
            id: edgeId,
            from: person.id,
            to: sId,
            arrows: '',
            color: { color: '#f59e0b', highlight: '#fbbf24' },
            width: 3,
            dashes: true,
            smooth: { type: 'curvedCW', roundness: 0.2 }
          });
        }
      }
    });
  }
});

const nodes = new vis.DataSet(visNodes);
const edges = new vis.DataSet(visEdges);

const container = document.getElementById('mynetwork');
const data = { nodes: nodes, edges: edges };

// Configure options dynamically based on whether we have custom layout saved
const options = {
  layout: {
    hierarchical: !hasSavedPositions ? {
      direction: 'UD',
      sortMethod: 'directed',
      nodeSpacing: 180,
      levelSeparation: 140,
      parentCentralization: true
    } : false
  },
  physics: {
    enabled: !hasSavedPositions,
    stabilization: {
      iterations: 1000
    }
  },
  interaction: {
    dragNodes: true,
    hover: true,
    zoomView: true
  }
};

const network = new vis.Network(container, data, options);

// Save positions after initial stabilization if no saved layout exists
if (!hasSavedPositions) {
  network.once("stabilizationIterationsDone", function () {
    const positions = network.getPositions();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    network.setOptions({
      layout: { hierarchical: false },
      physics: { enabled: false }
    });
  });
}

// Save position on drag end
network.on("dragEnd", function (params) {
  if (params.nodes.length > 0) {
    const positions = network.getPositions();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  }
});

function clearSavedPositions() {
  if (confirm("Скинути всі ручні налаштування розташування карток та повернути до стандартного вигляду?")) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}

// Selected Person tracker
let selectedPersonId = null;

// Event listener for node click
network.on("click", function (params) {
  if (params.nodes.length > 0) {
    selectedPersonId = params.nodes[0];
    showPersonDetails(selectedPersonId);
  }
});

function showPersonDetails(id) {
  const person = people[id];
  if (!person) return;

  document.getElementById('no-selection').style.display = 'none';
  document.getElementById('edit-details').style.display = 'none';
  document.getElementById('selection-details').style.display = 'block';

  document.getElementById('det-name').innerText = person.name;
  document.getElementById('det-meta').innerText = 'ID: ' + person.id + ' | Стать: ' + (person.gender === 'male' ? 'Чоловіча' : 'Жіноча');
  document.getElementById('det-bio').innerText = person.bio || 'Біографічні відомості відсутні.';

  // Hide or show delete button depending on if node is custom
  const isCustom = id.startsWith('custom/');
  document.getElementById('delete-btn').style.display = isCustom ? 'block' : 'none';

  // Parents list
  const parentsUl = document.getElementById('det-parents');
  parentsUl.innerHTML = '';
  const f = people[person.parents.father];
  const m = people[person.parents.mother];
  
  if (!f && !m) {
    parentsUl.innerHTML = '<li class="profile-meta" style="list-style: none; margin: 0;">Дані відсутні</li>';
  } else {
    if (f) addRelationItem(parentsUl, f);
    if (m) addRelationItem(parentsUl, m);
  }

  // Spouses list
  const spousesUl = document.getElementById('det-spouses');
  spousesUl.innerHTML = '';
  if (!person.spouses || person.spouses.length === 0) {
    spousesUl.innerHTML = '<li class="profile-meta" style="list-style: none; margin: 0;">Невідомо / немає даних</li>';
  } else {
    person.spouses.forEach(sId => {
      const s = people[sId];
      if (s) addRelationItem(spousesUl, s);
    });
  }

  // Children list
  const childrenUl = document.getElementById('det-children');
  childrenUl.innerHTML = '';
  const childrenList = Object.values(people).filter(p => p.parents.father === id || p.parents.mother === id);
  if (childrenList.length === 0) {
    childrenUl.innerHTML = '<li class="profile-meta" style="list-style: none; margin: 0;">Немає зареєстрованих дітей</li>';
  } else {
    childrenList.forEach(c => addRelationItem(childrenUl, c));
  }
}

function addRelationItem(container, targetPerson) {
  const li = document.createElement('li');
  li.className = 'relation-item';
  li.innerText = targetPerson.name;
  li.onclick = () => {
    selectedPersonId = targetPerson.id;
    network.selectNodes([targetPerson.id]);
    showPersonDetails(targetPerson.id);
    network.focus(targetPerson.id, { scale: 1.1, animation: true });
  };
  container.appendChild(li);
}

function filterNodes() {
  const searchVal = document.getElementById('search-input').value.toLowerCase();
  
  if (searchVal.trim() === '') {
    nodes.forEach(n => {
      nodes.update({id: n.id, hidden: false});
    });
    return;
  }

  nodes.forEach(n => {
    const isMatch = n.label.toLowerCase().includes(searchVal);
    nodes.update({id: n.id, hidden: !isMatch});
  });
}

function resetView() {
  document.getElementById('search-input').value = '';
  nodes.forEach(n => {
    nodes.update({id: n.id, hidden: false});
  });
  network.fit({ animation: true });
  selectedPersonId = null;
  document.getElementById('no-selection').style.display = 'flex';
  document.getElementById('selection-details').style.display = 'none';
  document.getElementById('edit-details').style.display = 'none';
}

// Dropdown population
function populateDropdowns(prefix) {
  const fatherSelect = document.getElementById(prefix + '-father');
  const motherSelect = document.getElementById(prefix + '-mother');
  const spouseSelect = document.getElementById(prefix + '-spouse');
  
  // Clear previous options
  fatherSelect.innerHTML = '<option value="">-- Батько: Немає / Невідомо --</option>';
  motherSelect.innerHTML = '<option value="">-- Мати: Немає / Невідомо --</option>';
  spouseSelect.innerHTML = '<option value="">-- Партнер (Подружжя): Немає --</option>';

  const sortedPeople = Object.values(people)
    .filter(p => p.id !== selectedPersonId) // exclude self when editing
    .sort((a, b) => a.name.localeCompare(b.name));

  sortedPeople.forEach(p => {
    const birthMatch = p.id.match(/\/(\d{4}(?:\d{2})?)/);
    const suffix = birthMatch ? ' (' + birthMatch[1].slice(0,4) + ')' : '';
    const optionText = p.name + suffix;
    
    // Father option
    const optF = document.createElement('option');
    optF.value = p.id;
    optF.innerText = optionText;
    fatherSelect.appendChild(optF);

    // Mother option
    const optM = document.createElement('option');
    optM.value = p.id;
    optM.innerText = optionText;
    motherSelect.appendChild(optM);

    // Spouse option
    const optS = document.createElement('option');
    optS.value = p.id;
    optS.innerText = optionText;
    spouseSelect.appendChild(optS);
  });
}

// CRUD - Create Custom Person
function addCustomPerson() {
  const name = document.getElementById('add-name').value.trim();
  if (!name) {
    alert("Будь ласка, введіть ім'я особи.");
    return;
  }

  const gender = document.getElementById('add-gender').value;
  const birth = document.getElementById('add-birth').value.trim();
  const bio = document.getElementById('add-bio').value.trim();
  const father = document.getElementById('add-father').value || null;
  const mother = document.getElementById('add-mother').value || null;
  const spouse = document.getElementById('add-spouse').value || null;

  const birthSuffix = birth ? '/' + birth : '/' + Math.floor(Math.random() * 10000000);
  const nameSlug = transliterate(name.toLowerCase()).replace(/[^a-z0-9]/g, '_');
  const newId = 'custom/' + nameSlug + birthSuffix;

  const newPerson = {
    id: newId,
    gender: gender,
    name: name,
    bio: bio || ('Опис для ' + name),
    parents: {
      father: father,
      mother: mother
    },
    spouses: spouse ? [spouse] : []
  };

  const currentDb = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
  if (spouse) {
    addSpouseLink(spouse, newId, currentDb);
  }

  currentDb[newId] = newPerson;
  localStorage.setItem(DB_KEY, JSON.stringify(currentDb));
  location.reload();
}

// CRUD - Edit Person
function startEditing() {
  if (!selectedPersonId) return;
  
  const person = people[selectedPersonId];
  if (!person) return;

  populateDropdowns('edit');

  document.getElementById('edit-name').value = person.name;
  document.getElementById('edit-gender').value = person.gender || 'male';
  
  const birthMatch = person.id.match(/\/(\d{4}(?:\d{2})?)/);
  document.getElementById('edit-birth').value = birthMatch ? birthMatch[1] : '';
  document.getElementById('edit-bio').value = person.bio || '';

  document.getElementById('edit-father').value = person.parents.father || '';
  document.getElementById('edit-mother').value = person.parents.mother || '';
  document.getElementById('edit-spouse').value = (person.spouses && person.spouses[0]) || '';

  document.getElementById('selection-details').style.display = 'none';
  document.getElementById('edit-details').style.display = 'flex';
}

// CRUD - Cancel Edit
function cancelEdit() {
  document.getElementById('edit-details').style.display = 'none';
  document.getElementById('selection-details').style.display = 'block';
}

// CRUD - Save Edit
function saveEdit() {
  const name = document.getElementById('edit-name').value.trim();
  if (!name) {
    alert("Ім'я не може бути порожнім.");
    return;
  }

  const gender = document.getElementById('edit-gender').value;
  const bio = document.getElementById('edit-bio').value.trim();
  const father = document.getElementById('edit-father').value || null;
  const mother = document.getElementById('edit-mother').value || null;
  const spouse = document.getElementById('edit-spouse').value || null;

  const currentDb = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
  const original = rawPeople[selectedPersonId] || {};

  // Remove old spouses relationships first
  const oldSpouses = (currentDb[selectedPersonId]?.spouses) || (rawPeople[selectedPersonId]?.spouses) || [];
  oldSpouses.forEach(sId => {
    removeSpouseLink(sId, selectedPersonId, currentDb);
  });

  if (spouse) {
    addSpouseLink(spouse, selectedPersonId, currentDb);
  }

  currentDb[selectedPersonId] = {
    ...original,
    ...currentDb[selectedPersonId],
    id: selectedPersonId,
    name: name,
    gender: gender,
    bio: bio,
    parents: { father, mother },
    spouses: spouse ? [spouse] : []
  };

  localStorage.setItem(DB_KEY, JSON.stringify(currentDb));
  location.reload();
}

// CRUD - Delete Person
function deletePerson() {
  if (confirm("Ви дійсно хочете видалити цю особу з дерева?")) {
    const currentDb = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    
    // Remove spouse references from others
    const spouseId = currentDb[selectedPersonId]?.spouses?.[0];
    if (spouseId) {
      removeSpouseLink(spouseId, selectedPersonId, currentDb);
    }

    delete currentDb[selectedPersonId];
    localStorage.setItem(DB_KEY, JSON.stringify(currentDb));

    const positions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    delete positions[selectedPersonId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));

    location.reload();
  }
}

// Helper spouse management
function addSpouseLink(aId, bId, currentDb) {
  if (!currentDb[aId]) {
    currentDb[aId] = JSON.parse(JSON.stringify(rawPeople[aId] || { id: aId, spouses: [], name: aId, parents: {father:null, mother:null}, bio: '' }));
  }
  if (!currentDb[aId].spouses) currentDb[aId].spouses = [];
  if (!currentDb[aId].spouses.includes(bId)) {
    currentDb[aId].spouses.push(bId);
  }
}

function removeSpouseLink(aId, bId, currentDb) {
  if (currentDb[aId]) {
    if (currentDb[aId].spouses) {
      currentDb[aId].spouses = currentDb[aId].spouses.filter(id => id !== bId);
    }
  } else if (rawPeople[aId]) {
    currentDb[aId] = JSON.parse(JSON.stringify(rawPeople[aId]));
    if (currentDb[aId].spouses) {
      currentDb[aId].spouses = currentDb[aId].spouses.filter(id => id !== bId);
    }
  }
}

// Transliteration
function transliterate(text) {
  const rules = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
    'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya',
    'ы': 'y', 'э': 'e', 'ё': 'yo'
  };
  return text.split('').map(char => rules[char] !== undefined ? rules[char] : char).join('');
}

// Backup & Restore
async function exportDatabase(el, event) {
  if (el && el.href && el.href.startsWith('blob:')) {
    return;
  }
  if (event) event.preventDefault();

  const data = {
    positions: JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'),
    db: JSON.parse(localStorage.getItem(DB_KEY) || '{}')
  };
  const jsonString = JSON.stringify(data, null, 2);

  if (typeof window.showSaveFilePicker === 'function') {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'family_tree_data.json',
        types: [{
          description: 'JSON Configuration',
          accept: { 'application/json': ['.json'] }
        }]
      });
      const writable = await handle.createWritable();
      await writable.write(jsonString);
      await writable.close();
      
      const txt = document.getElementById('json-text');
      txt.value = jsonString;
      document.getElementById('json-panel').style.display = 'flex';
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.warn("File System Picker failed, falling back...");
    }
  }

  try {
    const blob = new Blob([jsonString], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    el.href = url;
    el.download = 'family_tree_data.json';
    el.click();
    setTimeout(() => {
      el.href = '#';
      el.removeAttribute('download');
      URL.revokeObjectURL(url);
    }, 1500);
  } catch (err) {
    console.warn("Standard download blocked or failed, copy JSON text manually.");
  }
  
  const txt = document.getElementById('json-text');
  txt.value = jsonString;
  document.getElementById('json-panel').style.display = 'flex';
}

function toggleJsonPanel() {
  const panel = document.getElementById('json-panel');
  const txt = document.getElementById('json-text');
  if (panel.style.display === 'none' || !panel.style.display) {
    panel.style.display = 'flex';
    const data = {
      positions: JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'),
      db: JSON.parse(localStorage.getItem(DB_KEY) || '{}')
    };
    txt.value = JSON.stringify(data, null, 2);
  } else {
    panel.style.display = 'none';
  }
}

function copyJsonText() {
  const txt = document.getElementById('json-text');
  txt.select();
  document.execCommand('copy');
  alert("Конфігурацію успішно скопійовано в буфер обміну!");
}

function importJsonText() {
  const txt = document.getElementById('json-text').value.trim();
  if (!txt) {
    alert("Вставте текст конфігурації JSON перед імпортом.");
    return;
  }
  try {
    const imported = JSON.parse(txt);
    if (imported.positions) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(imported.positions));
    }
    if (imported.db) {
      localStorage.setItem(DB_KEY, JSON.stringify(imported.db));
    }
    alert("Дані успішно імпортовано! Сторінка буде перезавантажена.");
    location.reload();
  } catch (err) {
    alert("Помилка імпорту: Невірний формат JSON тексту.");
  }
}

function importDatabaseTrigger() {
  document.getElementById('import-file-input').click();
}

function handleImportFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported.positions) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(imported.positions));
      }
      if (imported.db) {
        localStorage.setItem(DB_KEY, JSON.stringify(imported.db));
      }
      alert("Дані успішно імпортовано! Сторінка буде перезавантажена.");
      location.reload();
    } catch (err) {
      alert("Помилка імпорту: Невірний формат JSON файлу.");
    }
  };
  reader.readAsText(file);
}

// Label Template update handler
function updateLabelTemplate(newTemplate) {
  localStorage.setItem(TEMPLATE_KEY, newTemplate);
  currentTemplate = newTemplate;
  
  nodes.forEach(node => {
    const person = people[node.id];
    if (person) {
      nodes.update({
        id: node.id,
        label: formatNodeLabel(person, currentTemplate)
      });
    }
  });
}

// Export SVG
function generateSVGString(positions) {
  const nodeArray = nodes.get();
  const edgeArray = edges.get();
  const nodeIds = Object.keys(positions);
  if (nodeIds.length === 0) return '';

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  nodeIds.forEach(id => {
    const pos = positions[id];
    if (pos.x < minX) minX = pos.x;
    if (pos.y < minY) minY = pos.y;
    if (pos.x > maxX) maxX = pos.x;
    if (pos.y > maxY) maxY = pos.y;
  });

  const padding = 150;
  const width = (maxX - minX) + padding * 2;
  const height = (maxY - minY) + padding * 2;
  const offsetX = -minX + padding;
  const offsetY = -minY + padding;

  let svgContent = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
'<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '" style="background-color: #0b0f19;">\n' +
'  <defs>\n' +
'    <style>\n' +
'      .node-text { font-family: \'Outfit\', sans-serif; font-size: 14px; fill: #f8fafc; text-anchor: middle; }\n' +
'      .edge-line { stroke-width: 2; fill: none; }\n' +
'      .spouse-line { stroke: #f59e0b; stroke-width: 3; stroke-dasharray: 6,4; fill: none; }\n' +
'    </style>\n' +
'  </defs>\n';

  edgeArray.forEach(edge => {
    const fromPos = positions[edge.from];
    const toPos = positions[edge.to];
    if (fromPos && toPos) {
      const x1 = fromPos.x + offsetX;
      const y1 = fromPos.y + offsetY;
      const x2 = toPos.x + offsetX;
      const y2 = toPos.y + offsetY;
      
      if (edge.id && edge.id.includes('---')) {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - 25;
        svgContent += '  <path d="M ' + x1 + ' ' + y1 + ' Q ' + midX + ' ' + midY + ' ' + x2 + ' ' + y2 + '" class="spouse-line" />\n';
      } else {
        const strokeColor = edge.color?.color || '#64748b';
        svgContent += '  <line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + strokeColor + '" class="edge-line" />\n';
        
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const arrowLength = 10;
        const arrowWidth = 6;
        const arrowX = x2 - 35 * Math.cos(angle);
        const arrowY = y2 - 35 * Math.sin(angle);
        
        const arrowX1 = arrowX - arrowLength * Math.cos(angle) + arrowWidth * Math.sin(angle);
        const arrowY1 = arrowY - arrowLength * Math.sin(angle) - arrowWidth * Math.cos(angle);
        const arrowX2 = arrowX - arrowLength * Math.cos(angle) - arrowWidth * Math.sin(angle);
        const arrowY2 = arrowY - arrowLength * Math.sin(angle) + arrowWidth * Math.cos(angle);
        
        svgContent += '  <polygon points="' + arrowX + ',' + arrowY + ' ' + arrowX1 + ',' + arrowY1 + ' ' + arrowX2 + ',' + arrowY2 + '" fill="' + strokeColor + '" />\n';
      }
    }
  });

  nodeArray.forEach(node => {
    const pos = positions[node.id];
    if (pos) {
      const x = pos.x + offsetX;
      const y = pos.y + offsetY;
      
      const bgColor = node.color?.background || '#1e293b';
      const borderColor = node.color?.border || '#64748b';
      
      const label = node.label || '';
      const lines = label.split('\n');
      const maxLineLength = Math.max(...lines.map(l => l.length));
      const boxWidth = Math.max(130, maxLineLength * 9 + 28);
      const boxHeight = lines.length * 20 + 20;

      svgContent += '  <g id="node-' + node.id.replace(/[^a-zA-Z0-9]/g, '_') + '">\n' +
'    <rect x="' + (x - boxWidth/2) + '" y="' + (y - boxHeight/2) + '" width="' + boxWidth + '" height="' + boxHeight + '" rx="8" fill="' + bgColor + '" stroke="' + borderColor + '" stroke-width="2" />\n';
      
      lines.forEach((line, index) => {
        const lineY = y - (boxHeight/2) + 20 + (index * 20) + 4;
        const escapedLine = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        svgContent += '    <text x="' + x + '" y="' + lineY + '" class="node-text">' + escapedLine + '</text>\n';
      });
      
      svgContent += '  </g>\n';
    }
  });

  svgContent += '</svg>';
  return svgContent;
}

async function exportSVG(el, event) {
  if (el && el.href && el.href.startsWith('blob:')) {
    return;
  }
  if (event) event.preventDefault();

  const positions = network.getPositions();
  const svgString = generateSVGString(positions);
  if (!svgString) return;

  if (typeof window.showSaveFilePicker === 'function') {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'family_tree.svg',
        types: [{
          description: 'SVG Vector Image',
          accept: { 'image/svg+xml': ['.svg'] }
        }]
      });
      const writable = await handle.createWritable();
      await writable.write(svgString);
      await writable.close();
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.warn("File System Picker failed, falling back...");
    }
  }

  const blob = new Blob([svgString], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  el.href = url;
  el.download = 'family_tree.svg';
  el.click();
  setTimeout(() => {
    el.href = '#';
    el.removeAttribute('download');
    URL.revokeObjectURL(url);
  }, 1500);
}

// Export High-Res PNG using SVG render pipeline
function togglePngPanel() {
  const panel = document.getElementById('png-scale-panel');
  panel.style.display = (panel.style.display === 'none' || !panel.style.display) ? 'flex' : 'none';
}

function exportPNG(el, event) {
  if (el && el.href && el.href.startsWith('blob:')) {
    return;
  }
  event.preventDefault();

  const positions = network.getPositions();
  const svgString = generateSVGString(positions);
  if (!svgString) return;

  const scaleSelect = document.getElementById('export-scale');
  const scale = parseInt(scaleSelect.value) || 2;

  // Create high-res render pipeline using SVG
  const img = new Image();
  const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
  const url = URL.createObjectURL(svgBlob);

  img.onload = function() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElem = doc.querySelector('svg');
    const width = parseFloat(svgElem.getAttribute('width'));
    const height = parseFloat(svgElem.getAttribute('height'));

    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async function(blob) {
      if (!blob) {
        alert("Не вдалося створити PNG файл.");
        URL.revokeObjectURL(url);
        return;
      }

      if (typeof window.showSaveFilePicker === 'function') {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: 'family_tree_' + scale + 'x.png',
            types: [{
              description: 'PNG Image',
              accept: { 'image/png': ['.png'] }
            }]
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          URL.revokeObjectURL(url);
          return;
        } catch (err) {
          if (err.name === 'AbortError') {
            URL.revokeObjectURL(url);
            return;
          }
          console.warn("File System Picker failed, falling back...");
        }
      }

      const pngUrl = URL.createObjectURL(blob);
      el.href = pngUrl;
      el.download = 'family_tree_' + scale + 'x.png';
      el.click();
      setTimeout(() => {
        el.href = '#';
        el.removeAttribute('download');
        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(url);
      }, 1500);
    }, 'image/png');
  };
  
  img.src = url;
}

// Initial load calls
document.getElementById('label-template').value = currentTemplate;
populateDropdowns('add');
