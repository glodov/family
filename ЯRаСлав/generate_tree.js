const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'data/people');
const mdOutputFile = path.join(__dirname, 'FAMILY_TREE.md');
const htmlOutputFile = path.join(__dirname, 'family_tree.html');

// Helper to recursively list all md files
function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else if (file === 'index.md') {
      results.push(filePath);
    }
  });
  return results;
}

// Simple YAML frontmatter parser
function parseFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;

  const yamlText = match[1];
  const bodyText = match[2];

  // Extract name from H1 tag
  const nameMatch = bodyText.match(/^#\s+(.+)$/m);
  const name = nameMatch ? nameMatch[1].trim() : path.basename(path.dirname(filePath));
  const bio = bodyText.replace(/^#\s+.+$/m, '').trim();

  // Primitive YAML parser
  const yaml = {};
  yamlText.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim();
      if (val === 'null') yaml[key] = null;
      else if (val.startsWith('[') && val.endsWith(']')) {
        yaml[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
      } else yaml[key] = val.replace(/^['"]|['"]$/g, '');
    }
  });

  // Extract parents
  const parents = { father: null, mother: null };
  const fatherMatch = yamlText.match(/father:\s*(.+)$/m);
  if (fatherMatch && fatherMatch[1].trim() !== 'null') {
    parents.father = fatherMatch[1].trim().replace(/^['"]|['"]$/g, '');
  }
  const motherMatch = yamlText.match(/mother:\s*(.+)$/m);
  if (motherMatch && motherMatch[1].trim() !== 'null') {
    parents.mother = motherMatch[1].trim().replace(/^['"]|['"]$/g, '');
  }

  // Extract spouses
  const spouses = [];
  const spousesSection = yamlText.match(/spouses:\s*\n((?:\s+-\s+spouse:.*\n?)*)/);
  if (spousesSection) {
    const spouseMatches = spousesSection[1].matchAll(/spouse:\s*(.+)/g);
    for (const sm of spouseMatches) {
      spouses.push(sm[1].trim().replace(/^['"]|['"]$/g, ''));
    }
  }

  // Extract children
  const children = [];
  const childrenSection = yamlText.match(/children:\s*\n((?:\s+-\s+.*\n?)*)/);
  if (childrenSection) {
    const childMatches = childrenSection[1].matchAll(/-\s*(.+)/g);
    for (const cm of childMatches) {
      children.push(cm[1].trim().replace(/^['"]|['"]$/g, ''));
    }
  }

  return {
    id: yaml.id,
    gender: yaml.gender,
    name,
    bio,
    parents,
    spouses,
    children
  };
}

try {
  const files = getFiles(baseDir);
  const people = {};

  files.forEach(file => {
    const data = parseFile(file);
    if (data && data.id) {
      people[data.id] = data;
    }
  });

  // Calculate generational levels dynamically
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

  // ==========================================
  // GENERATE FAMILY_TREE.md (Mermaid TD Flowchart with custom styling)
  // ==========================================
  let mermaid = 'graph TD\n';
  mermaid += '  %% Node Styling\n';
  mermaid += '  classDef male fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,rx:8px;\n';
  mermaid += '  classDef female fill:#fce4ec,stroke:#c2185b,stroke-width:2px,rx:8px;\n';
  mermaid += '  classDef unknown fill:#eceff1,stroke:#37474f,stroke-width:2px,rx:8px;\n\n';

  const nodes = [];
  const links = new Set();
  const spouseLinks = new Set();

  Object.values(people).forEach(person => {
    const nodeId = person.id.replace(/\//g, '_');
    const birthMatch = person.id.match(/\/(\d{4}(?:\d{2})?)/);
    const birthYear = birthMatch ? ` (${birthMatch[1].slice(0,4)})` : '';
    
    nodes.push(`  ${nodeId}["${person.name}${birthYear}"]:::${person.gender || 'unknown'}`);

    const fId = person.parents.father;
    const mId = person.parents.mother;

    if (fId && people[fId]) {
      links.add(`  ${fId.replace(/\//g, '_')} --> ${nodeId}`);
    }
    if (mId && people[mId]) {
      links.add(`  ${mId.replace(/\//g, '_')} --> ${nodeId}`);
    }

    person.spouses.forEach(sId => {
      if (people[sId]) {
        const linkKey = [nodeId, sId.replace(/\//g, '_')].sort().join(' --- ');
        spouseLinks.add(`  ${linkKey}`);
      }
    });
  });

  mermaid += '  %% Nodes\n';
  mermaid += nodes.join('\n') + '\n\n';

  if (spouseLinks.size > 0) {
    mermaid += '  %% Spouses\n';
    mermaid += Array.from(spouseLinks).join('\n') + '\n\n';
  }

  if (links.size > 0) {
    mermaid += '  %% Parents to Children\n';
    mermaid += Array.from(links).join('\n') + '\n';
  }

  const markdownContent = `# 🌳 Родовідне дерево (Family Tree)\n\n> [!TIP]\n> Для інтерактивного перегляду з пошуком, масштабуванням та біографіями відкрийте файл [family_tree.html](./family_tree.html) у браузері.\n\n\`\`\`mermaid\n${mermaid}\`\`\`\n`;
  fs.writeFileSync(mdOutputFile, markdownContent, 'utf8');
  console.log(`Successfully generated Family Tree markdown at: ${mdOutputFile}`);

  // ==========================================
  // GENERATE data.js (Dynamic rawPeople DB)
  // ==========================================
  const dataJsContent = `// Injected rawPeople database
const rawPeople = ${JSON.stringify(people, null, 2)};
`;
  fs.writeFileSync(path.join(__dirname, 'data.js'), dataJsContent, 'utf8');
  console.log(`Successfully generated data.js`);

  // ==========================================
  // GENERATE family_tree.html Skeleton
  // ==========================================
  const htmlTemplate = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🌳 Родовідне Дерево Глодових-Мироненків</title>
  
  <!-- Modern Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  
  <!-- Vis.js Standalone CDN -->
  <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>

  <link rel="stylesheet" href="style.css">
</head>
<body>

  <div id="app-container">
    <!-- Controls (Search) -->
    <div id="controls">
      <input type="text" id="search-input" placeholder="🔍 Пошук за ім'ям..." oninput="filterNodes()">
      <button onclick="resetView()">🔄 Скинути Вигляд</button>
      <button onclick="clearSavedPositions()" class="btn-danger">🧹 Скинути розташування</button>
    </div>

    <!-- The Network Visualizer -->
    <div id="mynetwork"></div>

    <!-- Right Sidebar Detail View -->
    <div id="sidebar">
      
      <!-- No Selection View: Database & Add Form -->
      <div id="no-selection" style="display: flex; flex-direction: column; gap: 20px;">
        <div style="margin: auto; text-align: center; color: var(--text-muted); padding: 10px 0;">
          <p style="font-size: 48px; margin-bottom: 12px;">🌳</p>
          <p>Виберіть когось на дереві, щоб переглянути біографію та родичів.</p>
        </div>

        <hr style="border: 0; border-top: 1px solid var(--border-glass); margin: 10px 0;">

        <!-- Backup & Share section -->
        <div class="relation-section">
          <div class="relation-title">💾 Експорт та Резервні Копії</div>
          <div style="display: flex; gap: 8px; margin-top: 5px; flex-wrap: wrap;">
            <a href="#" class="btn-export" onclick="exportDatabase(this, event)" style="flex: 1 1 45%; font-size: 13px; padding: 8px;">📤 JSON Експорт</a>
            <button onclick="importDatabaseTrigger()" style="flex: 1 1 45%; font-size: 13px; padding: 8px;">📥 JSON Імпорт</button>
            <input type="file" id="import-file-input" style="display: none;" accept=".json" onchange="handleImportFile(event)">
            
            <a href="#" class="btn-export" onclick="exportSVG(this, event)" style="flex: 1 1 45%; font-size: 13px; padding: 8px; background: #10b981; color: white;">🖼️ SVG Експорт</a>
            <button onclick="togglePngPanel()" style="flex: 1 1 45%; font-size: 13px; padding: 8px; background: #8b5cf6; color: white;">🖼️ PNG Експорт</button>
          </div>

          <!-- PNG High-Res scaling panel -->
          <div id="png-scale-panel" style="display: none; flex-direction: column; gap: 8px; margin-top: 8px; padding: 12px; background: rgba(15, 23, 42, 0.4); border: 1px solid var(--border-glass); border-radius: 8px;">
            <label style="margin: 0; font-size: 11px;">Якість/масштаб PNG зображення:</label>
            <div style="display: flex; gap: 8px;">
              <select id="export-scale" style="flex-grow: 1; font-size: 12px; padding: 6px 10px; background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); color: var(--text-main); border-radius: 8px;">
                <option value="1">1x (Звичайне)</option>
                <option value="2" selected>2x (Висока - HD)</option>
                <option value="3">3x (Retina / 4K)</option>
                <option value="4">4x (Ультра деталізація)</option>
              </select>
              <a href="#" class="btn-export" onclick="exportPNG(this, event)" style="font-size: 12px; padding: 6px 12px; background: #8b5cf6; color: white;">Завантажити</a>
            </div>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
            <button onclick="toggleJsonPanel()" style="width: 100%; font-size: 13px; padding: 8px; background: rgba(255,255,255,0.05); color: var(--text-main);">📋 Показати/Вставити JSON текст</button>
            <div id="json-panel" style="display: none; flex-direction: column; gap: 8px;">
              <textarea id="json-text" placeholder="Конфігурація JSON з'явиться тут при натисканні Експорту, або вставте сюди текст для імпорту..." style="width: 100%; height: 120px; font-family: 'JetBrains Mono', monospace; font-size: 11px; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-glass); color: var(--text-main); border-radius: 6px; padding: 8px; resize: none;"></textarea>
              <div style="display: flex; gap: 8px;">
                <button onclick="copyJsonText()" style="flex-grow: 1; font-size: 12px; padding: 6px;">📋 Скопіювати</button>
                <button onclick="importJsonText()" style="flex-grow: 1; background: var(--accent); color: #0f172a; font-size: 12px; padding: 6px;">📥 Імпортувати текст</button>
              </div>
            </div>
          </div>
        </div>

        <hr style="border: 0; border-top: 1px solid var(--border-glass); margin: 10px 0;">

        <!-- Card Template Configuration -->
        <div class="relation-section">
          <div class="relation-title">🎨 Налаштування Карток</div>
          <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 5px;">
            <label for="label-template" style="margin-top: 0;">Формат тексту в картках:</label>
            <input type="text" id="label-template" style="font-size: 13px; padding: 8px; font-family: 'JetBrains Mono', monospace; width: 100%;" oninput="updateLabelTemplate(this.value)">
            <p style="font-size: 11px; color: var(--text-muted); line-height: 1.4; margin-top: 4px;">
              Теги: <code>{LastName}</code>, <code>{FirstName}</code>, <code>{ParentName}</code>, <code>{Birthday:YYYY}</code>, <code>{Birthday:YYYY-MM-DD}</code>, <code>&lt;br&gt;</code>
            </p>
          </div>
        </div>

        <hr style="border: 0; border-top: 1px solid var(--border-glass); margin: 10px 0;">

        <!-- Add Person Form -->
        <div class="relation-section">
          <div class="relation-title">➕ Додати нову особу</div>
          
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 5px;">
            <input type="text" id="add-name" placeholder="Ім'я та Прізвище (напр. Андрій Глодов)" required>
            
            <div style="display: flex; gap: 10px;">
              <select id="add-gender" style="flex-grow: 1;">
                <option value="male">Стать: Чоловіча</option>
                <option value="female">Стать: Жіноча</option>
              </select>
              <input type="text" id="add-birth" placeholder="Рік народження" style="width: 50%;">
            </div>

            <textarea id="add-bio" placeholder="Коротка біографія або опис..." style="height: 60px; background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); color: var(--text-main); border-radius: 8px; padding: 8px; font-family: inherit; font-size: 13px; outline: none; resize: none;"></textarea>

            <select id="add-father" style="font-size: 13px; width: 100%;">
              <option value="">-- Батько: Немає / Невідомо --</option>
            </select>

            <select id="add-mother" style="font-size: 13px; width: 100%;">
              <option value="">-- Мати: Немає / Невідомо --</option>
            </select>

            <select id="add-spouse" style="font-size: 13px; width: 100%;">
              <option value="">-- Партнер (Подружжя): Немає --</option>
            </select>

            <button onclick="addCustomPerson()" style="background: var(--accent); color: #0f172a; margin-top: 5px;">➕ Створити Особу</button>
          </div>
        </div>
      </div>

      <!-- Selection Details View -->
      <div id="selection-details" style="display: none;">
        <button onclick="resetView()" style="width: 100%; margin-bottom: 15px; background: rgba(255,255,255,0.05); color: var(--text-muted); font-size: 13px; padding: 8px; border: 1px solid var(--border-glass);">⬅️ Назад до головного меню</button>
        <h2 id="det-name" class="profile-title">Олексій Глодов</h2>
        <div id="det-meta" class="profile-meta">ID: glodov/olexiy</div>
        
        <div class="relation-section" style="margin-bottom: 20px;">
          <div class="relation-title">Біографія / Опис</div>
          <div id="det-bio" class="profile-bio">...</div>
        </div>

        <div class="relation-section">
          <div class="relation-title">Батьки</div>
          <ul id="det-parents" class="relation-list"></ul>
        </div>

        <div class="relation-section" style="margin-top: 15px;">
          <div class="relation-title">Партнери (Подружжя)</div>
          <ul id="det-spouses" class="relation-list"></ul>
        </div>

        <div class="relation-section" style="margin-top: 15px;">
          <div class="relation-title">Діти</div>
          <ul id="det-children" class="relation-list"></ul>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 25px;">
          <button onclick="startEditing()" style="flex-grow: 1; background: #3b82f6; color: white;">✏️ Редагувати особу</button>
          <button id="delete-btn" onclick="deletePerson()" style="background: #ef4444; color: white; display: none;">🗑️ Видалити особу</button>
        </div>
      </div>

      <!-- Edit Details View -->
      <div id="edit-details" style="display: none; flex-direction: column; gap: 15px;">
        <h2 class="profile-title" style="font-size: 22px;">✏️ Редагування Особи</h2>
        
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <label>Ім'я та Прізвище</label>
          <input type="text" id="edit-name" required>
          
          <div style="display: flex; gap: 10px;">
            <div style="flex-grow: 1; display: flex; flex-direction: column;">
              <label>Стать</label>
              <select id="edit-gender" style="width: 100%;">
                <option value="male">Чоловіча</option>
                <option value="female">Жіноча</option>
              </select>
            </div>
            <div style="width: 50%; display: flex; flex-direction: column;">
              <label>Рік нар.</label>
              <input type="text" id="edit-birth" style="width: 100%;">
            </div>
          </div>

          <label>Біографія / Опис</label>
          <textarea id="edit-bio" style="height: 100px; background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); color: var(--text-main); border-radius: 8px; padding: 8px; font-family: inherit; font-size: 13px; outline: none; resize: none;"></textarea>

          <label>Батько</label>
          <select id="edit-father" style="width: 100%;"></select>

          <label>Мати</label>
          <select id="edit-mother" style="width: 100%;"></select>

          <label>Партнер (Подружжя)</label>
          <select id="edit-spouse" style="width: 100%;"></select>

          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button onclick="saveEdit()" style="flex-grow: 1; background: var(--accent); color: #0f172a;">💾 Зберегти</button>
            <button onclick="cancelEdit()" style="background: rgba(255,255,255,0.1); color: var(--text-main);">❌ Скасувати</button>
          </div>
        </div>
      </div>

    </div>

    <div id="overlay-tip">
      💡 Перетягуйте вузли для зміни структури (положення зберігається автоматично). Наближайте мишкою та натискайте для деталей.
    </div>
  </div>

  <script src="data.js"></script>
  <script src="app.js"></script>
</body>
</html>`;

  fs.writeFileSync(htmlOutputFile, htmlTemplate, 'utf8');
  console.log(`Successfully generated Interactive HTML Family Tree skeleton at: ${htmlOutputFile}`);

} catch (err) {
  console.error('Error generating family tree:', err);
}
