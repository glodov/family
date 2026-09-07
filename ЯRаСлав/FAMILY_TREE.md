[← Головне меню (README.md)](../README.md) | [← Досьє ЯRаСлава (README.md)](./README.md)

# 🌳 Родовідне дерево (Family Tree)

> [!TIP]
> Для інтерактивного перегляду з пошуком, масштабуванням та біографіями відкрийте файл [family_tree.html](./family_tree.html) у браузері.

```mermaid
graph TD
  %% Node Styling
  classDef male fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,rx:8px;
  classDef female fill:#fce4ec,stroke:#c2185b,stroke-width:2px,rx:8px;
  classDef unknown fill:#eceff1,stroke:#37474f,stroke-width:2px,rx:8px;

  %% Nodes
  baranik_iryna_1952["Ірина Василівна Бараник (1952)"]:::female
  baranik_lyudmila["Людмила Василівна Бараник"]:::female
  baranik_olexander_1949["Олександр Васильович Бараник (1949)"]:::male
  baranik_vasily["Василь Бараник"]:::male
  glodov_bohdan_197410["Богдан (1974)"]:::male
  glodov_darina_19760821["Дарина (Даша) (1976)"]:::female
  glodov_elena["Олена Олексіївна Глодова"]:::female
  glodov_igor["Ігор Павлович Глодов"]:::male
  glodov_ivan["Іван Глодов"]:::male
  glodov_maxym_19740224["Максим (1974)"]:::male
  glodov_oksana_19680518["Оксана (1968)"]:::female
  glodov_olexander["Олександр Іванович Глодов"]:::male
  glodov_olexander_jr["Олександр Олександрович Глодов"]:::male
  glodov_olexiy["Олексій Іванович Глодов"]:::male
  glodov_pavlo["Павло Іванович Глодов"]:::male
  glodov_petr_19431126["Петро Олексійович Глодов (1943)"]:::male
  glodov_tatiana["Тетяна Олександрівна Глодова"]:::female
  glodov_yaroslav_1983["Ярослав Петрович Глодов (1983)"]:::male
  melnik_elena["Олена Прокофьєвна Мельник"]:::female
  melnik_julia["Юлія Прокофьєвна Мельник"]:::female
  melnik_prokofiy["Прокофій Гаврилович Мельник"]:::male
  mironenko_ivan["Іван Іванович Мироненко"]:::male
  mironenko_ivan_jr["Іван Іванович Мироненко (молодший)"]:::male
  mironenko_katerina_1930["Катерина Іванівна Мироненко (1930)"]:::female
  mironenko_lyudmila_1949["Людмила Іванівна Мироненко (1949)"]:::female
  mironenko_maria["Марія Іванівна Мироненко"]:::female
  mironenko_nadezhda["Надія Іванівна Мироненко"]:::female
  mironenko_olexander_19180215["Олександр Іванович Мироненко (1918)"]:::male
  mironenko_petr_19431126["Петро Олександрович Мироненко (1943)"]:::male
  mironenko_tetiana_19531212["Тетяна Олександрівна Мироненко (1953)"]:::female
  mironenko_valentina["Валентина Іванівна Мироненко"]:::female
  padenets_dmitry["Дмитро Паденець"]:::male
  padenets_dmitry_jr["Дмитро Дмитрович Паденець"]:::male
  padenets_iryna["Ірина Дмитрівна Паденець"]:::female
  padenets_vladimir["Володимир Дмитрович Паденець"]:::male
  savenko_alyana["Аляна Савенко"]:::female

  %% Spouses
  baranik_vasily --- mironenko_maria
  glodov_olexiy --- melnik_julia
  mironenko_ivan --- savenko_alyana
  mironenko_katerina_1930 --- padenets_dmitry

  %% Parents to Children
  baranik_vasily --> baranik_iryna_1952
  mironenko_maria --> baranik_iryna_1952
  baranik_vasily --> baranik_lyudmila
  mironenko_maria --> baranik_lyudmila
  baranik_vasily --> baranik_olexander_1949
  mironenko_maria --> baranik_olexander_1949
  mironenko_tetiana_19531212 --> glodov_darina_19760821
  glodov_olexiy --> glodov_elena
  melnik_julia --> glodov_elena
  glodov_pavlo --> glodov_igor
  mironenko_tetiana_19531212 --> glodov_maxym_19740224
  glodov_ivan --> glodov_olexander
  glodov_olexander --> glodov_olexander_jr
  glodov_ivan --> glodov_olexiy
  glodov_ivan --> glodov_pavlo
  glodov_olexiy --> glodov_petr_19431126
  melnik_julia --> glodov_petr_19431126
  glodov_olexander --> glodov_tatiana
  glodov_petr_19431126 --> glodov_yaroslav_1983
  melnik_prokofiy --> melnik_elena
  melnik_prokofiy --> melnik_julia
  mironenko_ivan --> mironenko_ivan_jr
  savenko_alyana --> mironenko_ivan_jr
  mironenko_ivan --> mironenko_katerina_1930
  savenko_alyana --> mironenko_katerina_1930
  mironenko_ivan_jr --> mironenko_lyudmila_1949
  mironenko_ivan --> mironenko_maria
  savenko_alyana --> mironenko_maria
  mironenko_ivan_jr --> mironenko_nadezhda
  mironenko_ivan --> mironenko_olexander_19180215
  savenko_alyana --> mironenko_olexander_19180215
  mironenko_olexander_19180215 --> mironenko_petr_19431126
  mironenko_olexander_19180215 --> mironenko_tetiana_19531212
  mironenko_ivan_jr --> mironenko_valentina
  padenets_dmitry --> padenets_dmitry_jr
  mironenko_katerina_1930 --> padenets_dmitry_jr
  padenets_dmitry --> padenets_iryna
  mironenko_katerina_1930 --> padenets_iryna
  padenets_dmitry --> padenets_vladimir
  mironenko_katerina_1930 --> padenets_vladimir
```

---
[← Головне меню (README.md)](../README.md) | [← Досьє ЯRаСлава (README.md)](./README.md)
