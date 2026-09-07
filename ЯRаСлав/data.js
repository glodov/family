// Injected rawPeople database
const rawPeople = {
  "baranik/iryna/1952": {
    "id": "baranik/iryna/1952",
    "gender": "female",
    "name": "Ірина Василівна Бараник",
    "bio": "Донька Марії Мироненко та Василя Бараника. Народилася у 1952 році.",
    "parents": {
      "father": "baranik/vasily",
      "mother": "mironenko/maria"
    },
    "spouses": [],
    "children": [],
    "level": 2
  },
  "baranik/lyudmila": {
    "id": "baranik/lyudmila",
    "gender": "female",
    "name": "Людмила Василівна Бараник",
    "bio": "Донька Марії Мироненко та Василя Бараника.",
    "parents": {
      "father": "baranik/vasily",
      "mother": "mironenko/maria"
    },
    "spouses": [],
    "children": [],
    "level": 2
  },
  "baranik/olexander/1949": {
    "id": "baranik/olexander/1949",
    "gender": "male",
    "name": "Олександр Васильович Бараник",
    "bio": "Син Марії Мироненко та Василя Бараника. Народився у 1949 році.",
    "parents": {
      "father": "baranik/vasily",
      "mother": "mironenko/maria"
    },
    "spouses": [],
    "children": [],
    "level": 2
  },
  "baranik/vasily": {
    "id": "baranik/vasily",
    "gender": "male",
    "name": "Василь Бараник",
    "bio": "Чоловік Марії (Марусі) Іванівни Мироненко.",
    "parents": {
      "father": null,
      "mother": null
    },
    "spouses": [
      "mironenko/maria"
    ],
    "children": [
      "baranik/olexander/1949",
      "baranik/iryna/1952",
      "baranik/lyudmila"
    ],
    "level": 0
  },
  "glodov/bohdan/197410": {
    "id": "glodov/bohdan/197410",
    "gender": "male",
    "name": "Богдан",
    "bio": "Народився в жовтні 1974 року. Одружений з Оленою (перекладачка з англійської). Має двох дітей: Андрія та Валерія.",
    "parents": {
      "father": null,
      "mother": null
    },
    "spouses": [],
    "children": [
      "glodov/andriy",
      "glodov/valeriy"
    ],
    "level": 0
  },
  "glodov/darina/19760821": {
    "id": "glodov/darina/19760821",
    "gender": "female",
    "name": "Дарина (Даша)",
    "bio": "Донька Тетяни Олександрівни Мироненко. Народилася 21 серпня 1976 року. Має двох дітей: Єгора та Іллю.",
    "parents": {
      "father": null,
      "mother": "mironenko/tetiana/19531212"
    },
    "spouses": [],
    "children": [],
    "level": 3
  },
  "glodov/elena": {
    "id": "glodov/elena",
    "gender": "female",
    "name": "Олена Олексіївна Глодова",
    "bio": "Рідна сестра Петра Олексійовича Глодова.",
    "parents": {
      "father": "glodov/olexiy",
      "mother": "melnik/julia"
    },
    "spouses": [],
    "children": [],
    "level": 2
  },
  "glodov/igor": {
    "id": "glodov/igor",
    "gender": "male",
    "name": "Ігор Павлович Глодов",
    "bio": "Двоюрідний брат Петра Глодова. Проживає в Москві.",
    "parents": {
      "father": "glodov/pavlo",
      "mother": null
    },
    "spouses": [],
    "children": [],
    "level": 2
  },
  "glodov/ivan": {
    "id": "glodov/ivan",
    "gender": "male",
    "name": "Іван Глодов",
    "bio": "Дід Петра Глодова. Проживав у селі Ізобільне Ставропольського краю.",
    "parents": {
      "father": null,
      "mother": null
    },
    "spouses": [],
    "children": [
      "glodov/olexiy",
      "glodov/pavlo",
      "glodov/olexander"
    ],
    "level": 0
  },
  "glodov/maxym/19740224": {
    "id": "glodov/maxym/19740224",
    "gender": "male",
    "name": "Максим",
    "bio": "Син Тетяни Олександрівни Мироненко. Народився 24 лютого 1974 року. Має трьох дітей: Альошу (від першого шлюбу), Микиту та Владика (від другого шлюбу).",
    "parents": {
      "father": null,
      "mother": "mironenko/tetiana/19531212"
    },
    "spouses": [],
    "children": [],
    "level": 3
  },
  "glodov/oksana/19680518": {
    "id": "glodov/oksana/19680518",
    "gender": "female",
    "name": "Оксана",
    "bio": "Народилася 18 травня 1968 року. Має двох дітей: Станіслава та Владислава.",
    "parents": {
      "father": null,
      "mother": null
    },
    "spouses": [],
    "children": [
      "glodov/stanislav",
      "glodov/vladyslav"
    ],
    "level": 0
  },
  "glodov/olexander": {
    "id": "glodov/olexander",
    "gender": "male",
    "name": "Олександр Іванович Глодов",
    "bio": "Син Івана Глодова. Був військовим, брав участь у Другій світовій війні.",
    "parents": {
      "father": "glodov/ivan",
      "mother": null
    },
    "spouses": [],
    "children": [
      "glodov/olexander_jr",
      "glodov/tatiana"
    ],
    "level": 1
  },
  "glodov/olexander_jr": {
    "id": "glodov/olexander_jr",
    "gender": "male",
    "name": "Олександр Олександрович Глодов",
    "bio": "Двоюрідний брат Петра Глодова. Загинув в автомобільній катастрофі.",
    "parents": {
      "father": "glodov/olexander",
      "mother": null
    },
    "spouses": [],
    "children": [],
    "level": 2
  },
  "glodov/olexiy": {
    "id": "glodov/olexiy",
    "gender": "male",
    "name": "Олексій Іванович Глодов",
    "bio": "Народився на Ставропіллі. Навчався в Північно-Кавказькому гірничо-металургійному інституті (СКГМІ) у Владикавказі. Під час війни уникнув призову, оскільки перейшов на 5-й курс. Після закінчення інституту працював на Уралі, де зустрів Юлію Прокофьєвну Мельник. Переїхав до Запоріжжя для відновлення промисловості за запрошенням директора Гончаренка.",
    "parents": {
      "father": "glodov/ivan",
      "mother": null
    },
    "spouses": [
      "melnik/julia"
    ],
    "children": [
      "glodov/petr/19431126",
      "glodov/elena"
    ],
    "level": 1
  },
  "glodov/pavlo": {
    "id": "glodov/pavlo",
    "gender": "male",
    "name": "Павло Іванович Глодов",
    "bio": "Син Івана Глодова, брат Олексія Глодова. Працював у паперовій промисловості.",
    "parents": {
      "father": "glodov/ivan",
      "mother": null
    },
    "spouses": [],
    "children": [
      "glodov/igor"
    ],
    "level": 1
  },
  "glodov/petr/19431126": {
    "id": "glodov/petr/19431126",
    "gender": "male",
    "name": "Петро Олексійович Глодов",
    "bio": "Народився 26 листопада 1943 року. Оповідач сімейних мемуарів, син Олексія Івановича Глодова та Юлії Прокофьєвни Мельник.",
    "parents": {
      "father": "glodov/olexiy",
      "mother": "melnik/julia"
    },
    "spouses": [],
    "children": [
      "glodov/yaroslav/1983"
    ],
    "level": 2
  },
  "glodov/tatiana": {
    "id": "glodov/tatiana",
    "gender": "female",
    "name": "Тетяна Олександрівна Глодова",
    "bio": "Двоюрідна сестра Петра Глодова. Проживає в місті Ялта, в Криму.",
    "parents": {
      "father": "glodov/olexander",
      "mother": null
    },
    "spouses": [],
    "children": [],
    "level": 2
  },
  "glodov/yaroslav/1983": {
    "id": "glodov/yaroslav/1983",
    "gender": "male",
    "name": "Ярослав Петрович Глодов",
    "bio": "Бенефіціар фізичної особи Глодов Ярослав Петрович. Народився у 1983 році (о 1000 році від різдва Ярослава Мудрого).",
    "parents": {
      "father": "glodov/petr/19431126",
      "mother": null
    },
    "spouses": [],
    "children": [],
    "level": 3
  },
  "melnik/elena": {
    "id": "melnik/elena",
    "gender": "female",
    "name": "Олена Прокофьєвна Мельник",
    "bio": "Донька Прокофія Мельника, сестра Юлії Мельник.",
    "parents": {
      "father": "melnik/prokofiy",
      "mother": null
    },
    "spouses": [],
    "children": [],
    "level": 1
  },
  "melnik/julia": {
    "id": "melnik/julia",
    "gender": "female",
    "name": "Юлія Прокофьєвна Мельник",
    "bio": "Донька Прокофія Гавриловича Мельника. Закінчила СКГМІ, вийшла заміж за Олексія Глодова.",
    "parents": {
      "father": "melnik/prokofiy",
      "mother": null
    },
    "spouses": [
      "glodov/olexiy"
    ],
    "children": [
      "glodov/petr/19431126",
      "glodov/elena"
    ],
    "level": 1
  },
  "melnik/prokofiy": {
    "id": "melnik/prokofiy",
    "gender": "male",
    "name": "Прокофій Гаврилович Мельник",
    "bio": "Дід Петра Глодова по материнській лінії. Проживав у Анапі. Закінчив учительську семінарію за спеціальністю «українська мова», щоб поїхати в Україну та одружитися з українкою. Знайшов дружину в Умані. Дружина померла під час Другої світової війни й похована у селі Ельхотово біля Владикавказа.",
    "parents": {
      "father": null,
      "mother": null
    },
    "spouses": [],
    "children": [
      "melnik/julia",
      "melnik/elena"
    ],
    "level": 0
  },
  "mironenko/ivan": {
    "id": "mironenko/ivan",
    "gender": "male",
    "name": "Іван Іванович Мироненко",
    "bio": "Дід по лінії Мироненків. Біографічні відомості потребують уточнення.",
    "parents": {
      "father": null,
      "mother": null
    },
    "spouses": [
      "savenko/alyana"
    ],
    "children": [
      "mironenko/olexander/19180215",
      "mironenko/maria",
      "mironenko/ivan_jr",
      "mironenko/katerina/1930"
    ],
    "level": 0
  },
  "mironenko/ivan_jr": {
    "id": "mironenko/ivan_jr",
    "gender": "male",
    "name": "Іван Іванович Мироненко (молодший)",
    "bio": "Син Івана Мироненка та Аляни Савенко. Мав трьох доньок.",
    "parents": {
      "father": "mironenko/ivan",
      "mother": "savenko/alyana"
    },
    "spouses": [],
    "children": [
      "mironenko/lyudmila/1949",
      "mironenko/valentina",
      "mironenko/nadezhda"
    ],
    "level": 1
  },
  "mironenko/katerina/1930": {
    "id": "mironenko/katerina/1930",
    "gender": "female",
    "name": "Катерина Іванівна Мироненко",
    "bio": "Молодша донька Івана Мироненка та Аляни Савенко. Народилася у 1930 році. Вийшла заміж за Дмитра Паденця.",
    "parents": {
      "father": "mironenko/ivan",
      "mother": "savenko/alyana"
    },
    "spouses": [
      "padenets/dmitry"
    ],
    "children": [
      "padenets/vladimir",
      "padenets/dmitry_jr",
      "padenets/iryna"
    ],
    "level": 1
  },
  "mironenko/lyudmila/1949": {
    "id": "mironenko/lyudmila/1949",
    "gender": "female",
    "name": "Людмила Іванівна Мироненко",
    "bio": "Донька Івана Івановича Мироненка (молодшого). Народилася у 1949 році. У шлюбі — Біла.",
    "parents": {
      "father": "mironenko/ivan_jr",
      "mother": null
    },
    "spouses": [],
    "children": [],
    "level": 2
  },
  "mironenko/maria": {
    "id": "mironenko/maria",
    "gender": "female",
    "name": "Марія Іванівна Мироненко",
    "bio": "Донька Івана Мироненка та Аляни Савенко. Відома також як Маруся. Вийшла заміж за Василя Бараника.",
    "parents": {
      "father": "mironenko/ivan",
      "mother": "savenko/alyana"
    },
    "spouses": [
      "baranik/vasily"
    ],
    "children": [
      "baranik/olexander/1949",
      "baranik/iryna/1952",
      "baranik/lyudmila"
    ],
    "level": 1
  },
  "mironenko/nadezhda": {
    "id": "mironenko/nadezhda",
    "gender": "female",
    "name": "Надія Іванівна Мироненко",
    "bio": "Донька Івана Івановика Мироненка (молодшого). У шлюбі — Понова.",
    "parents": {
      "father": "mironenko/ivan_jr",
      "mother": null
    },
    "spouses": [],
    "children": [],
    "level": 2
  },
  "mironenko/olexander/19180215": {
    "id": "mironenko/olexander/19180215",
    "gender": "male",
    "name": "Олександр Іванович Мироненко",
    "bio": "Старший син Івана Мироненка та Аляни Савенко. Народився 15 лютого 1918 року. Мав дітей від двох шлюбів.",
    "parents": {
      "father": "mironenko/ivan",
      "mother": "savenko/alyana"
    },
    "spouses": [],
    "children": [
      "mironenko/petr/19431126",
      "mironenko/tetiana/19531212"
    ],
    "level": 1
  },
  "mironenko/petr/19431126": {
    "id": "mironenko/petr/19431126",
    "gender": "male",
    "name": "Петро Олександрович Мироненко",
    "bio": "Син Олександра Івановича Мироненка від першого шлюбу. Народився 26 листопада 1943 року.",
    "parents": {
      "father": "mironenko/olexander/19180215",
      "mother": null
    },
    "spouses": [],
    "children": [],
    "level": 2
  },
  "mironenko/tetiana/19531212": {
    "id": "mironenko/tetiana/19531212",
    "gender": "female",
    "name": "Тетяна Олександрівна Мироненко",
    "bio": "Донька Олександра Івановича Мироненка від другого шлюбу. Народилася 12 грудня 1953 року. Має двох дітей: Дашу та Максима.",
    "parents": {
      "father": "mironenko/olexander/19180215",
      "mother": null
    },
    "spouses": [],
    "children": [
      "glodov/darina/19760821",
      "glodov/maxym/19740224"
    ],
    "level": 2
  },
  "mironenko/valentina": {
    "id": "mironenko/valentina",
    "gender": "female",
    "name": "Валентина Іванівна Мироненко",
    "bio": "Донька Івана Івановича Мироненка (молодшого). Проживає в Загорську. У шлюбі — Кузьміна. Дітей не мала.",
    "parents": {
      "father": "mironenko/ivan_jr",
      "mother": null
    },
    "spouses": [],
    "children": [],
    "level": 2
  },
  "padenets/dmitry": {
    "id": "padenets/dmitry",
    "gender": "male",
    "name": "Дмитро Паденець",
    "bio": "Чоловік Катерини Іванівни Мироненко.",
    "parents": {
      "father": null,
      "mother": null
    },
    "spouses": [
      "mironenko/katerina/1930"
    ],
    "children": [
      "padenets/vladimir",
      "padenets/dmitry_jr",
      "padenets/iryna"
    ],
    "level": 0
  },
  "padenets/dmitry_jr": {
    "id": "padenets/dmitry_jr",
    "gender": "male",
    "name": "Дмитро Дмитрович Паденець",
    "bio": "Син Катерини Мироненко та Дмитра Паденця.",
    "parents": {
      "father": "padenets/dmitry",
      "mother": "mironenko/katerina/1930"
    },
    "spouses": [],
    "children": [],
    "level": 2
  },
  "padenets/iryna": {
    "id": "padenets/iryna",
    "gender": "female",
    "name": "Ірина Дмитрівна Паденець",
    "bio": "Донька Катерини Мироненко та Дмитра Паденця.",
    "parents": {
      "father": "padenets/dmitry",
      "mother": "mironenko/katerina/1930"
    },
    "spouses": [],
    "children": [],
    "level": 2
  },
  "padenets/vladimir": {
    "id": "padenets/vladimir",
    "gender": "male",
    "name": "Володимир Дмитрович Паденець",
    "bio": "Син Катерини Мироненко та Дмитра Паденця. Мав двох доньок (одна загинула через самогубство).",
    "parents": {
      "father": "padenets/dmitry",
      "mother": "mironenko/katerina/1930"
    },
    "spouses": [],
    "children": [],
    "level": 2
  },
  "savenko/alyana": {
    "id": "savenko/alyana",
    "gender": "female",
    "name": "Аляна Савенко",
    "bio": "Бабуся по лінії Мироненків. Уроджена Савенко.",
    "parents": {
      "father": null,
      "mother": null
    },
    "spouses": [
      "mironenko/ivan"
    ],
    "children": [
      "mironenko/olexander/19180215",
      "mironenko/maria",
      "mironenko/ivan_jr",
      "mironenko/katerina/1930"
    ],
    "level": 0
  }
};
