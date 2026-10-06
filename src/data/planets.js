// Sayyoralar: raqamlar NASA Science (science.nasa.gov/<sayyora>/facts) sahifalaridan.
// Matn tartibi (p): 0 umumiy, 1 sirt, 2 atmosfera, 3 orbita va kun, 4 yo'ldoshlar/halqalar/magnit maydon, 5 tadqiqot
export const PLANET_IDS = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']

export const PLANETS = {
  mercury: {
    color: '#b9b3ac', tilt: 2, size: 4879,
    stats: { diameter: 4880, distance: 58, au: 0.4, year: 88, day: { v: 59, u: 'days' }, solar: 176, tilt: 2, moons: 0, rings: false, temp: { min: -180, max: 430 } },
    name: { uz: 'Merkuriy', en: 'Mercury', ru: 'Меркурий' },
    tag: { uz: 'Quyoshga eng yaqin sayyora: kunduzi qaynoq, tunda muzlaydi.', en: 'The closest planet to the Sun: scorching by day, freezing by night.', ru: 'Ближайшая к Солнцу планета: днём жара, ночью мороз.' },
    p: {
      uz: [
        "Merkuriy Quyoshga eng yaqin sayyora. Uning radiusi 2 440 km, ya'ni Yer kengligining uchdan biridan sal ko'proq. Quyoshdan o'rtacha 58 mln km (0,4 astronomik birlik) uzoqlikda joylashgan va Quyosh nuri unga 3,2 daqiqada yetib boradi. Sayyora qadimgi Rim xudolarining eng chaqqonining nomi bilan atalgan.",
        "Merkuriy yuzasi Oyga o'xshaydi, zarba kraterlari bilan qoplangan. Eng yirigi Caloris havzasi, diametri 1 550 km. Raxmaninov havzasining diametri 306 km. Qutblardagi doimiy soyada qolgan joylarda suv muzi bo'lishi mumkin.",
        "Merkuriyda odatdagi atmosfera yo'q. Uning o'rniga atomlardan tashkil topgan yupqa ekzosfera bor: kislorod, natriy, vodorod, geliy va kaliy. Havo issiqlikni ushlab turmagani uchun harorat keskin o'zgaradi: kunduzi +430 °C, tunda −180 °C.",
        "Merkuriy Quyosh atrofida 88 Yer kunida aylanadi va deyarli 47 km/s tezlikda uchadi. O'z o'qi atrofida bir marta 59 Yer kunida aylanadi, lekin Quyosh chiqishidan keyingi chiqishigacha 176 Yer kuni o'tadi: Merkuriydagi bitta kun uning yilidan ikki barobar uzun. O'qi atigi 2° ga og'gan.",
        "Merkuriyning yo'ldoshi ham, halqasi ham yo'q. Magnit maydoni Yernikining atigi 1% ini tashkil qiladi, lekin shiddatli magnit \"tornado\"lar hosil qiladi.",
        "Merkuriyni NASA ning Mariner 10 va MESSENGER kosmik kemalari o'rgangan. MESSENGER sayyora orbitasiga chiqqan birinchi apparat bo'lgan.",
      ],
      en: [
        'Mercury is the closest planet to the Sun. Its radius is 2,440 km, a little more than a third the width of Earth. It orbits on average 58 million km (0.4 astronomical units) from the Sun, and sunlight takes 3.2 minutes to reach it. The planet is named for the swiftest of the ancient Roman gods.',
        'Mercury’s surface resembles the Moon’s, covered in impact craters. The largest is the Caloris Basin, 1,550 km across. The Rachmaninoff Basin is 306 km across. Water ice may exist in permanently shadowed regions near the poles.',
        'Mercury has no traditional atmosphere. Instead it has a thin exosphere of atoms: oxygen, sodium, hydrogen, helium and potassium. With no air to hold heat, temperatures swing wildly: +430 °C by day and −180 °C by night.',
        'Mercury orbits the Sun in 88 Earth days, moving at nearly 47 km per second. It spins once in 59 Earth days, but the time from one sunrise to the next is 176 Earth days: a day on Mercury is twice as long as its year. Its axis is tilted only 2°.',
        'Mercury has no moons and no rings. Its magnetic field is only about 1% as strong as Earth’s, yet it creates intense magnetic tornadoes.',
        'NASA’s Mariner 10 and MESSENGER spacecraft studied Mercury. MESSENGER was the first spacecraft to orbit the planet.',
      ],
      ru: [
        'Меркурий ближайшая к Солнцу планета. Его радиус 2 440 км, это чуть больше трети ширины Земли. В среднем он находится в 58 млн км (0,4 астрономической единицы) от Солнца, и свет доходит до него за 3,2 минуты. Планета названа в честь самого быстрого из древнеримских богов.',
        'Поверхность Меркурия напоминает лунную и покрыта ударными кратерами. Крупнейший из них бассейн Калорис диаметром 1 550 км. Бассейн Рахманинова имеет диаметр 306 км. В постоянно затенённых областях у полюсов может быть водяной лёд.',
        'У Меркурия нет обычной атмосферы. Вместо неё тонкая экзосфера из атомов: кислорода, натрия, водорода, гелия и калия. Воздух не удерживает тепло, поэтому температуры резко меняются: днём +430 °C, ночью −180 °C.',
        'Меркурий обращается вокруг Солнца за 88 земных суток со скоростью почти 47 км/с. Вокруг оси он делает оборот за 59 земных суток, но от одного восхода до другого проходит 176 земных суток: сутки на Меркурии вдвое длиннее его года. Наклон оси всего 2°.',
        'У Меркурия нет ни спутников, ни колец. Его магнитное поле составляет всего около 1% земного, но порождает мощные магнитные «торнадо».',
        'Меркурий изучали космические аппараты NASA Mariner 10 и MESSENGER. MESSENGER стал первым аппаратом на орбите этой планеты.',
      ],
    },
    facts: {
      uz: ["Quyosh nuri Merkuriyga 3,2 daqiqada yetib boradi.", "Merkuriyda bir kun (176 Yer kuni) uning yilidan (88 kun) ikki barobar uzun.", "Harorat farqi 610 °C ga yaqin: +430 °C dan −180 °C gacha."],
      en: ['Sunlight reaches Mercury in 3.2 minutes.', 'A day on Mercury (176 Earth days) is twice as long as its year (88 days).', 'The temperature swing is about 610 °C: from +430 °C down to −180 °C.'],
      ru: ['Свет Солнца идёт до Меркурия 3,2 минуты.', 'Сутки на Меркурии (176 земных) вдвое длиннее года (88 дней).', 'Перепад температур около 610 °C: от +430 °C до −180 °C.'],
    },
  },

  venus: {
    color: '#e9b95a', tilt: 3, size: 12104,
    stats: { diameter: 12104, distance: 108, au: 0.72, year: 225, day: { v: 243, u: 'days' }, solar: 117, tilt: 3, moons: 0, rings: false, temp: { mean: 467 } },
    name: { uz: 'Venera', en: 'Venus', ru: 'Венера' },
    tag: { uz: "Hajmi Yerga o'xshash, lekin Quyosh tizimidagi eng issiq sayyora.", en: 'Similar in size to Earth, but the hottest planet in the solar system.', ru: 'По размеру похожа на Землю, но самая горячая планета Солнечной системы.' },
    p: {
      uz: [
        "Venera ekvatorida 12 104 km kenglikda, bu Yernikidan (12 756 km) ozgina kichik. Quyoshdan 108 mln km (0,72 astronomik birlik) uzoqlikda. Venera ba'zan \"Yerning yovuz egizagi\" deb ataladi. Nomi Rim sevgi va go'zallik ma'budasidan olingan.",
        "Venera yuzasida minglab vulqonlar bor. Eng baland cho'qqisi 11 km, ya'ni Everestdan baland. Zarba kraterlari soni bo'yicha u tosh sayyoralar orasida (Yerdan tashqari) eng kam kraterli.",
        "Atmosferasi asosan karbonat angidriddan iborat, bulutlari esa sulfat kislotadan. Yuzasidagi bosim Yerdagi dengiz sathi bosimidan 93 marta yuqori, harorat esa +467 °C. Faqat 30–50 km balandlikda harorat +30...+70 °C ga tushadi.",
        "Venera Quyosh atrofida 225 Yer kunida, o'z o'qi atrofida esa 243 Yer kunida aylanadi: uning kuni yilidan uzun. U boshqa sayyoralarga teskari yo'nalishda aylanadi, shuning uchun Quyosh g'arbdan chiqib, sharqda botadi. Quyosh chiqishidan botishigacha 117 Yer kuni o'tadi. O'qi atigi 3° og'gan, fasllar deyarli yo'q.",
        "Venerada yo'ldosh va halqa yo'q, faqat Zoozve nomli kvazi-yo'ldosh bor. Yadrosi temirdan bo'lsa ham, o'zining magnit maydoni yo'q: Quyosh shamoli ionosferaga ta'sir qilib, induksiyalangan maydon hosil qiladi.",
        "Veneraga Mariner 10 (1974) va Magellan (1994 yilgacha) borgan. Sovet \"Venera\" zondlari (1961–1984) dan 10 tasi sayyora yuzasiga yetib borgan.",
      ],
      en: [
        'Venus is 12,104 km across at the equator, slightly smaller than Earth (12,756 km). It is 108 million km (0.72 astronomical units) from the Sun. Venus is sometimes called Earth’s evil twin. It is named for the Roman goddess of love and beauty.',
        'Thousands of volcanoes dot the surface of Venus. Its highest peak is 11 km, taller than Mount Everest. Apart from Earth, it has the fewest impact craters of the rocky planets.',
        'The atmosphere is mostly carbon dioxide, with clouds of sulfuric acid. Surface pressure is 93 times Earth’s sea-level pressure, and the temperature is +467 °C. Only at 30–50 km altitude does it cool to +30…+70 °C.',
        'Venus orbits the Sun in 225 Earth days and spins once in 243 Earth days: its day is longer than its year. It spins backward compared with most planets, so the Sun would rise in the west and set in the east. Sunrise to sunset takes 117 Earth days. Its axis is tilted only 3°, so there are almost no seasons.',
        'Venus has no moons and no rings, only a quasi-satellite called Zoozve. Despite its iron core it has no magnetic field of its own: the solar wind interacting with its ionosphere induces one.',
        'Mariner 10 (1974) and Magellan (until 1994) explored Venus. Ten of the Soviet Venera probes (1961–1984) reached the surface.',
      ],
      ru: [
        'Диаметр Венеры на экваторе 12 104 км, чуть меньше земного (12 756 км). Она находится в 108 млн км (0,72 астрономической единицы) от Солнца. Венеру иногда называют «злым близнецом Земли». Названа в честь римской богини любви и красоты.',
        'На поверхности Венеры тысячи вулканов. Её высочайшая вершина достигает 11 км, выше Эвереста. Кроме Земли, у неё меньше всего ударных кратеров среди каменных планет.',
        'Атмосфера в основном состоит из углекислого газа, облака из серной кислоты. Давление у поверхности в 93 раза выше земного давления на уровне моря, температура +467 °C. Лишь на высоте 30–50 км она снижается до +30…+70 °C.',
        'Венера обращается вокруг Солнца за 225 земных суток, а вокруг оси делает оборот за 243 земных суток: её сутки длиннее года. Она вращается в сторону, обратную большинству планет, поэтому Солнце там восходит на западе и садится на востоке. От восхода до заката проходит 117 земных суток. Наклон оси лишь 3°, поэтому смены сезонов почти нет.',
        'У Венеры нет спутников и колец, есть только квазиспутник Зоозве. Несмотря на железное ядро, собственного магнитного поля у неё нет: солнечный ветер, взаимодействуя с ионосферой, наводит поле.',
        'Венеру исследовали Mariner 10 (1974) и Magellan (до 1994). Десять советских зондов «Венера» (1961–1984) достигли поверхности.',
      ],
    },
    facts: {
      uz: ["Quyosh va Oydan keyin osmondagi uchinchi eng yorqin jism.", "Yerga eng yaqin kelganda 38 mln km, eng uzoqda 261 mln km masofada bo'ladi.", "Quyoshdan uzoqroq bo'lsa ham, Merkuriydan issiqroq (+467 °C va +430 °C)."],
      en: ['The third brightest object in the sky after the Sun and the Moon.', 'It comes as close as 38 million km to Earth and as far as 261 million km.', 'It is hotter than Mercury (+467 °C vs +430 °C) despite being farther from the Sun.'],
      ru: ['Третий по яркости объект на небе после Солнца и Луны.', 'Она подходит к Земле на 38 млн км и удаляется до 261 млн км.', 'Она горячее Меркурия (+467 °C против +430 °C), хотя дальше от Солнца.'],
    },
  },

  earth: {
    color: '#4aa3ff', tilt: 23.4, size: 12756,
    stats: { diameter: 12756, distance: 150, au: 1, year: 365.25, day: { v: 23.9, u: 'h' }, solar: null, tilt: 23.4, moons: 1, rings: false, temp: null },
    name: { uz: 'Yer', en: 'Earth', ru: 'Земля' },
    tag: { uz: "Yuzasida suyuq suvi bor yagona sayyora.", en: 'The only planet with liquid water on its surface.', ru: 'Единственная планета с жидкой водой на поверхности.' },
    p: {
      uz: [
        "Yerning ekvatordagi diametri 12 756 km. U Quyoshdan 150 mln km (1 astronomik birlik) uzoqlikda joylashgan, Quyosh nuri Yerga 8 daqiqa 21 soniyada yetib keladi. Sayyoraning yoshi taxminan 4,5 mlrd yil.",
        "Yer yuzasining taxminan 71% ini okeanlar egallaydi. Okeanning o'rtacha chuqurligi 3,6 km, va Yerdagi suvning 97% shu yerda. Quruqlikdagi po'st qalinligi o'rtacha 30 km, okean tubida esa taxminan 5 km.",
        "Atmosferasi 78% azot, 21% kislorod va 1% boshqa gazlardan (argon, karbonat angidrid, neon) iborat.",
        "Yer Quyosh atrofida 365,25 kunda aylanadi, o'z o'qi atrofida esa 23,9 soatda. O'qi orbita tekisligiga nisbatan 23,4° og'gan, shuning uchun fasllar almashadi.",
        "Yerning bitta yo'ldoshi bor: Oy. Uning radiusi 1 738 km, Yerdan o'rtacha 384 400 km uzoqda, va u Quyosh tizimidagi beshinchi yirik yo'ldosh. Yerning halqasi yo'q.",
        "Ichki yadro (radiusi 1 221 km, harorati 5 400 °C gacha), tashqi yadro (qalinligi 2 300 km) va mantiya (qalinligi 2 900 km) sayyorani tashkil qiladi. Magnit maydon tez aylanish va suyuq nikel-temir yadro tufayli hosil bo'ladi, va magnit qutblar taxminan har 300 000 yilda o'rin almashadi. Ko'plab sun'iy yo'ldoshlar Yerni yagona tizim sifatida kuzatadi.",
      ],
      en: [
        'Earth is 12,756 km across at the equator. It is 150 million km (1 astronomical unit) from the Sun, and sunlight takes 8 minutes 21 seconds to reach it. The planet is about 4.5 billion years old.',
        'Oceans cover about 71% of Earth’s surface. The average ocean depth is 3.6 km, and the oceans hold 97% of Earth’s water. The crust averages 30 km thick on land and about 5 km under the ocean.',
        'The atmosphere is 78% nitrogen, 21% oxygen and 1% other gases such as argon, carbon dioxide and neon.',
        'Earth orbits the Sun in 365.25 days and rotates once in 23.9 hours. Its axis is tilted 23.4° relative to its orbit, which is why we have seasons.',
        'Earth has one moon. The Moon has a radius of 1,738 km, orbits 384,400 km away on average, and is the fifth largest moon in the solar system. Earth has no rings.',
        'An inner core (radius 1,221 km, up to 5,400 °C), an outer core (2,300 km thick) and a mantle (2,900 km thick) make up the interior. The magnetic field comes from rapid rotation and the molten nickel-iron core, and the magnetic poles reverse about every 300,000 years. Many satellites watch Earth as one connected system.',
      ],
      ru: [
        'Диаметр Земли на экваторе 12 756 км. Она находится в 150 млн км (1 астрономическая единица) от Солнца, свет доходит до неё за 8 минут 21 секунду. Возраст планеты около 4,5 млрд лет.',
        'Океаны покрывают около 71% поверхности Земли. Средняя глубина океана 3,6 км, в нём содержится 97% всей воды Земли. Толщина коры в среднем 30 км на суше и около 5 км под океаном.',
        'Атмосфера состоит на 78% из азота, на 21% из кислорода и на 1% из других газов, например аргона, углекислого газа и неона.',
        'Земля обращается вокруг Солнца за 365,25 суток и делает оборот вокруг оси за 23,9 часа. Ось наклонена к плоскости орбиты на 23,4°, поэтому происходит смена времён года.',
        'У Земли один спутник, Луна. Её радиус 1 738 км, она находится в среднем в 384 400 км от Земли и является пятым по величине спутником Солнечной системы. Колец у Земли нет.',
        'Внутреннее ядро (радиус 1 221 км, до 5 400 °C), внешнее ядро (толщина 2 300 км) и мантия (толщина 2 900 км) составляют недра планеты. Магнитное поле возникает из-за быстрого вращения и расплавленного железо-никелевого ядра, а магнитные полюса меняются местами примерно раз в 300 000 лет. Множество спутников наблюдает Землю как единую систему.',
      ],
    },
    facts: {
      uz: ["Yer — yuzasida suyuq suvi bor yagona sayyora.", "Oy Quyosh tizimidagi beshinchi yirik yo'ldosh.", "Yer yadrosi Quyosh yuzasidek issiq bo'lishi mumkin: 5 400 °C gacha."],
      en: ['Earth is the only planet with liquid water on its surface.', 'The Moon is the fifth largest moon in the solar system.', 'Earth’s inner core can reach 5,400 °C.'],
      ru: ['Земля единственная планета с жидкой водой на поверхности.', 'Луна пятый по величине спутник в Солнечной системе.', 'Внутреннее ядро Земли может нагреваться до 5 400 °C.'],
    },
  },

  mars: {
    color: '#e0603a', tilt: 25, size: 6780,
    stats: { diameter: 6780, distance: 228, au: 1.5, year: 687, day: { v: 24.6, u: 'h' }, solar: null, tilt: 25, moons: 2, rings: false, temp: { min: -153, max: 20 } },
    name: { uz: 'Mars', en: 'Mars', ru: 'Марс' },
    tag: { uz: "Sovuq, changli cho'l: qadimda unda suv bo'lgan.", en: 'A cold, dusty desert that once had water.', ru: 'Холодная пыльная пустыня, где когда-то была вода.' },
    p: {
      uz: [
        "Mars radiusi 3 390 km, bu Yernikining taxminan yarmi. Quyoshdan o'rtacha 228 mln km (1,5 astronomik birlik) uzoqlikda, Quyosh nuri unga 13 daqiqada yetib boradi.",
        "Valles Marineris vodiysi taxminan 3 870 km uzun, 600 km kengligida va 9,3 km chuqurlikda. Olympus Mons Quyosh tizimidagi eng yirik vulqon: balandligi 40 km dan ortiq, asosi esa Arizona shtati kattaligida. Qadimiy daryo vodiylari, deltalar va ko'l tubi izlari bor; qutblarda yer ostida suv muzi va mavsumiy sho'r oqimlar topilgan.",
        "Atmosferasi yupqa: asosan karbonat angidrid, azot va argon. Shu sabab osmon xira va qizg'ish ko'rinadi. Harorat +20 °C dan −153 °C gacha o'zgaradi.",
        "Mars kuni (sol) 24,6 soat, yili 669,6 sol, ya'ni 687 Yer kuni. O'qi 25° og'gan, shuning uchun fasllar bor, lekin ularning uzunligi turlicha: shimoliy bahor 194 sol, kuz 142, qish 154, yoz 178 sol.",
        "Marsning ikkita kichik yo'ldoshi bor: Phobos va Deimos, ular kartoshkaga o'xshaydi. Phobos asta Marsga yaqinlashmoqda va taxminan 50 mln yildan keyin qulaydi yoki parchalanadi. Deimos Phobosdan taxminan ikki barobar kichik va 2,5 marta uzoqroq. Hozir global magnit maydon yo'q, lekin janubiy yarimsharda 4 mlrd yil oldingi magnitlanish izlari saqlangan.",
        "Marsda NASA ning Curiosity va Perseverance rover'lari ishlagan; Mars Reconnaissance Orbiter va Mars Odyssey orbitadan kuzatadi. ESCAPADE ikkita sun'iy yo'ldoshi 2027 yil sentyabrda yetib borishi rejalashtirilgan.",
      ],
      en: [
        'Mars has a radius of 3,390 km, about half the size of Earth. It is on average 228 million km (1.5 astronomical units) from the Sun, and sunlight takes 13 minutes to reach it.',
        'Valles Marineris is about 3,870 km long, 600 km wide and 9.3 km deep. Olympus Mons is the largest volcano in the solar system: more than 40 km tall, with a base the size of Arizona. There are ancient river valleys, deltas and lakebeds, and water-ice lies just under the surface near the poles, along with seasonal briny flows.',
        'The atmosphere is thin, mostly carbon dioxide, nitrogen and argon. That is why the sky looks hazy and red. Temperatures range from +20 °C to −153 °C.',
        'A Martian day (a sol) lasts 24.6 hours and a year is 669.6 sols, or 687 Earth days. The axis is tilted 25°, so there are seasons, but of different lengths: northern spring 194 sols, autumn 142, winter 154 and summer 178 sols.',
        'Mars has two small moons, Phobos and Deimos, which are potato-shaped. Phobos is slowly moving toward Mars and will crash or break apart in about 50 million years. Deimos is about half as big and orbits 2.5 times farther away. Mars has no global magnetic field now, but traces of magnetization from about 4 billion years ago remain in the southern hemisphere.',
        'NASA’s Curiosity and Perseverance rovers work on Mars, and the Mars Reconnaissance Orbiter and Mars Odyssey watch from orbit. The twin ESCAPADE satellites are planned to arrive in September 2027.',
      ],
      ru: [
        'Радиус Марса 3 390 км, примерно половина земного. В среднем он находится в 228 млн км (1,5 астрономической единицы) от Солнца, свет доходит до него за 13 минут.',
        'Долина Маринер имеет длину около 3 870 км, ширину 600 км и глубину 9,3 км. Олимп самый большой вулкан Солнечной системы: высота более 40 км, а основание размером с штат Аризона. Есть древние речные долины, дельты и русла озёр, а водяной лёд лежит под поверхностью у полюсов, где бывают и сезонные потоки рассола.',
        'Атмосфера тонкая, в основном углекислый газ, азот и аргон. Поэтому небо кажется мутным и красноватым. Температура колеблется от +20 °C до −153 °C.',
        'Марсианские сутки (сол) длятся 24,6 часа, год составляет 669,6 сола, то есть 687 земных суток. Ось наклонена на 25°, поэтому есть сезоны, но разной длины: северная весна 194 сола, осень 142, зима 154, лето 178 солов.',
        'У Марса два маленьких спутника, Фобос и Деймос, похожие на картофелины. Фобос медленно приближается к Марсу и примерно через 50 млн лет упадёт или разрушится. Деймос примерно вдвое меньше и в 2,5 раза дальше. Глобального магнитного поля сейчас нет, но в южном полушарии сохранились следы намагниченности возрастом около 4 млрд лет.',
        'На Марсе работали марсоходы NASA Curiosity и Perseverance, а с орбиты наблюдают Mars Reconnaissance Orbiter и Mars Odyssey. Два спутника ESCAPADE планируется доставить в сентябре 2027 года.',
      ],
    },
    facts: {
      uz: ["Olympus Mons Quyosh tizimidagi eng yirik vulqon (40 km dan baland).", "Valles Marineris taxminan 3 870 km uzunlikda.", "Marsdagi kun Yerdagidan atigi 40 daqiqa uzun."],
      en: ['Olympus Mons is the largest volcano in the solar system (over 40 km tall).', 'Valles Marineris stretches about 3,870 km.', 'A Martian day is only about 40 minutes longer than an Earth day.'],
      ru: ['Олимп самый большой вулкан Солнечной системы (выше 40 км).', 'Долина Маринер тянется примерно на 3 870 км.', 'Марсианские сутки лишь примерно на 40 минут длиннее земных.'],
    },
  },

  jupiter: {
    color: '#d9a066', tilt: 3, size: 139822,
    stats: { diameter: 139822, distance: 778, au: 5.2, year: 4333, day: { v: 9.9, u: 'h' }, solar: null, tilt: 3, moons: 115, rings: true, temp: null },
    name: { uz: 'Yupiter', en: 'Jupiter', ru: 'Юпитер' },
    tag: { uz: "Quyosh tizimidagi eng katta sayyora: gaz gigant va Katta Qizil Dog'.", en: 'The largest planet in the solar system: a gas giant with the Great Red Spot.', ru: 'Крупнейшая планета Солнечной системы: газовый гигант с Большим красным пятном.' },
    p: {
      uz: [
        "Yupiterning radiusi 69 911 km, ya'ni Yerdan 11 marta kengroq. Agar u ichi bo'sh bo'lsa, unga 1 000 ta Yer sig'ardi. Quyoshdan o'rtacha 778 mln km (5,2 astronomik birlik) uzoqlikda, nur unga 43 daqiqada yetadi. Yoshi 4,6 mlrd yil.",
        "Yupiterning qattiq yuzasi yo'q: u gaz gigant. Bulut qatlamlari taxminan 71 km qalinlikda. Katta Qizil Dog' Yerdan ikki barobar keng bo'ron, u 300 yildan ortiq vaqtdan beri kuzatiladi va bulutlar tepasidan taxminan 500 km chuqurlikka cho'zilgan.",
        "Atmosferasi asosan vodorod va geliydan iborat. Ekvatorda shamol tezligi 539 km/soat gacha yetadi.",
        "Yupiter Quyosh atrofida taxminan 12 Yer yilida (4 333 kun) aylanadi, lekin o'z o'qi atrofida atigi 9,9 soatda. O'qining og'ishi 3°.",
        "Yupiterning 115 ta rasman tan olingan yo'ldoshi bor. Galiley yo'ldoshlari: Io, Yevropa, Ganimed va Kallisto. Ganimed Quyosh tizimidagi eng yirik yo'ldosh. 1979 yilda Voyager 1 halqalarni kashf etgan: ular mayda qora zarralardan iborat, ichki yo'ldoshlarga meteoroidlar urilishidan chiqqan chang. Magnit maydoni Yernikidan 16–54 marta kuchli.",
        "Yupiterni Galileo kosmik kemasi o'rgangan. Juno hozir uning tortishish va magnit maydonini o'lchamoqda, Europa Clipper esa 2024 yil 14 oktyabrda uchirilgan.",
      ],
      en: [
        'Jupiter has a radius of 69,911 km, 11 times wider than Earth. If it were hollow, about 1,000 Earths could fit inside. It is on average 778 million km (5.2 astronomical units) from the Sun, and sunlight takes 43 minutes to reach it. It is 4.6 billion years old.',
        'Jupiter has no solid surface: it is a gas giant. Its cloud layers span about 71 km. The Great Red Spot is a storm twice as wide as Earth, observed for over 300 years, and it reaches about 500 km below the cloud tops.',
        'The atmosphere is mostly hydrogen and helium. Winds at the equator reach up to 539 km/h.',
        'Jupiter orbits the Sun in about 12 Earth years (4,333 days) but spins once in only 9.9 hours. Its axis is tilted 3°.',
        'Jupiter has 115 officially recognized moons. The Galilean moons are Io, Europa, Ganymede and Callisto. Ganymede is the largest moon in the solar system. Voyager 1 discovered the rings in 1979: small dark particles, likely dust from meteoroid impacts on the inner moons. Its magnetic field is 16 to 54 times as powerful as Earth’s.',
        'The Galileo spacecraft studied Jupiter. Juno is now measuring its gravity and magnetic field, and Europa Clipper launched on October 14, 2024.',
      ],
      ru: [
        'Радиус Юпитера 69 911 км, он в 11 раз шире Земли. Если бы он был пустым, в него поместилось бы около 1 000 Земель. В среднем он находится в 778 млн км (5,2 астрономической единицы) от Солнца, свет идёт до него 43 минуты. Возраст 4,6 млрд лет.',
        'У Юпитера нет твёрдой поверхности: это газовый гигант. Облачные слои занимают около 71 км. Большое красное пятно это шторм вдвое шире Земли, его наблюдают более 300 лет, и он уходит примерно на 500 км вглубь от верхней кромки облаков.',
        'Атмосфера состоит в основном из водорода и гелия. Ветры на экваторе достигают 539 км/ч.',
        'Юпитер обращается вокруг Солнца примерно за 12 земных лет (4 333 суток), но делает оборот вокруг оси всего за 9,9 часа. Наклон оси 3°.',
        'У Юпитера 115 официально признанных спутников. Галилеевы спутники: Ио, Европа, Ганимед и Каллисто. Ганимед крупнейший спутник Солнечной системы. Кольца открыл Voyager 1 в 1979 году: мелкие тёмные частицы, вероятно, пыль от ударов метеороидов по внутренним спутникам. Магнитное поле в 16–54 раза мощнее земного.',
        'Юпитер изучал аппарат Galileo. Сейчас гравитацию и магнитное поле измеряет Juno, а Europa Clipper запущен 14 октября 2024 года.',
      ],
    },
    facts: {
      uz: ["Ganimed Quyosh tizimidagi eng yirik yo'ldosh.", "Katta Qizil Dog' Yerdan ikki barobar keng va 300 yildan ortiq kuzatiladi.", "Yupiterda kun atigi 9,9 soat."],
      en: ['Ganymede is the largest moon in the solar system.', 'The Great Red Spot is twice as wide as Earth and has been watched for over 300 years.', 'A day on Jupiter lasts only 9.9 hours.'],
      ru: ['Ганимед крупнейший спутник Солнечной системы.', 'Большое красное пятно вдвое шире Земли и наблюдается более 300 лет.', 'Сутки на Юпитере длятся всего 9,9 часа.'],
    },
  },

  saturn: {
    color: '#e6cf8f', tilt: 26.73, size: 120500,
    stats: { diameter: 120500, distance: 1400, au: 9.5, year: 10756, day: { v: 10.7, u: 'h' }, solar: null, tilt: 26.73, moons: 274, rings: true, temp: null },
    name: { uz: 'Saturn', en: 'Saturn', ru: 'Сатурн' },
    tag: { uz: "Mashhur halqalari bilan gaz gigant: zichligi suvdan kam.", en: 'A gas giant famed for its rings, less dense than water.', ru: 'Газовый гигант со знаменитыми кольцами, менее плотный, чем вода.' },
    p: {
      uz: [
        "Saturnning ekvatordagi diametri taxminan 120 500 km, bu Yerdan 9 marta keng. Quyoshdan o'rtacha 1,4 mlrd km (9,5 astronomik birlik) uzoqlikda, Quyosh nuri unga 80 daqiqada yetadi.",
        "Saturn asosan vodorod va geliydan iborat, zichligi suvdan kam: uni katta vannaga tushirsa, suzib yurardi. Qattiq yuzasi yo'q.",
        "Atmosferada xira yo'llar, reaktiv oqimlar va bo'ronlar bor; ranglari sariq, jigarrang va kulrang. Ekvatorda shamol tezligi 500 m/s ga yetadi. Shimoliy qutbda taxminan 32 000 km (20 000 milya) kenglikdagi olti burchakli bulut oqimi bor, janubiy qutbda esa o'n burchakli atmosfera to'lqini kuzatilgan.",
        "Saturnda kun 10,7 soat, yil esa 29,4 Yer yili (10 756 kun). O'qining og'ishi 26,73°.",
        "Saturnning 274 ta tasdiqlangan yo'ldoshi bor (2025 yil mart holatiga). Titan tuman bilan o'ralgan va metan ko'llari bor, Enceladus esa yuzasidan suv fontanlarini otadi va ichida okeani bor. Halqalari sayyoradan 282 000 km gacha cho'zilgan, lekin asosiy qismining qalinligi atigi 10 m: milliardlab muz va tosh bo'laklari, changdan tog' kattaligigacha. Asosiy halqalar A, B va C, ular orasida 4 700 km kenglikdagi Kassini bo'shlig'i bor. Magnit maydoni Yernikidan 578 marta kuchli.",
        "Saturnni Cassini kosmik kemasi 2004 yildan 2017 yil 15 sentyabrgacha o'rgangan.",
      ],
      en: [
        'Saturn has an equatorial diameter of about 120,500 km, nine times wider than Earth. It is on average 1.4 billion km (9.5 astronomical units) from the Sun, and sunlight takes 80 minutes to reach it.',
        'Saturn is made mostly of hydrogen and helium and is less dense than water: it would float in a big enough bathtub. It has no solid surface.',
        'The atmosphere has faint stripes, jet streams and storms in yellow, brown and gray. Equatorial winds reach 500 m/s. At the north pole a hexagon-shaped cloud pattern spans about 32,000 km (20,000 miles), and a ten-sided wave has been seen at the south pole.',
        'A day on Saturn lasts 10.7 hours and a year is 29.4 Earth years (10,756 days). Its axis is tilted 26.73°.',
        'Saturn has 274 confirmed moons (as of March 2025). Titan is shrouded in haze and has methane lakes, and Enceladus sprays jets of water and has an internal ocean. The rings extend up to 282,000 km from the planet, yet the main rings are only about 10 m thick: billions of chunks of ice and rock, from dust grains to mountain-sized pieces. The main rings are A, B and C, separated by the 4,700 km-wide Cassini Division. Saturn’s magnetic field is 578 times as powerful as Earth’s.',
        'The Cassini spacecraft studied Saturn from 2004 until September 15, 2017.',
      ],
      ru: [
        'Диаметр Сатурна на экваторе около 120 500 км, в девять раз больше земного. В среднем он находится в 1,4 млрд км (9,5 астрономической единицы) от Солнца, свет идёт до него 80 минут.',
        'Сатурн состоит в основном из водорода и гелия и менее плотен, чем вода: в достаточно большой ванне он бы плавал. Твёрдой поверхности у него нет.',
        'В атмосфере видны слабые полосы, струйные течения и бури жёлтого, коричневого и серого цвета. Ветры на экваторе достигают 500 м/с. У северного полюса есть шестиугольный облачный узор шириной около 32 000 км (20 000 миль), а у южного замечена десятиугольная волна.',
        'Сутки на Сатурне длятся 10,7 часа, а год составляет 29,4 земного года (10 756 суток). Наклон оси 26,73°.',
        'У Сатурна 274 подтверждённых спутника (на март 2025 года). Титан окутан дымкой и имеет метановые озёра, а Энцелад выбрасывает струи воды и скрывает внутри океан. Кольца простираются до 282 000 км от планеты, но основная их часть толщиной всего около 10 м: миллиарды кусков льда и камня, от пылинок до размеров гор. Главные кольца A, B и C разделены щелью Кассини шириной 4 700 км. Магнитное поле Сатурна в 578 раз мощнее земного.',
        'Сатурн изучал аппарат Cassini с 2004 года до 15 сентября 2017 года.',
      ],
    },
    facts: {
      uz: ["Saturn zichligi suvdan kam, shuning uchun suvda suzib yurardi.", "Halqalar 282 000 km gacha cho'zilgan, lekin atigi ~10 m qalinlikda.", "Enceladus yuzasidan suv fontanlarini otadi."],
      en: ['Saturn is less dense than water, so it would float.', 'The rings span up to 282,000 km but are only about 10 m thick.', 'Enceladus sprays jets of water from its surface.'],
      ru: ['Сатурн менее плотен, чем вода, поэтому он бы плавал.', 'Кольца простираются до 282 000 км, но толщиной всего около 10 м.', 'Энцелад выбрасывает с поверхности струи воды.'],
    },
  },

  uranus: {
    color: '#8fe0e6', tilt: 97.77, size: 51118,
    stats: { diameter: 51118, distance: 2900, au: 19, year: 30687, day: { v: 17, u: 'h' }, solar: null, tilt: 97.77, moons: 28, rings: true, temp: { min: -224.2 } },
    name: { uz: 'Uran', en: 'Uranus', ru: 'Уран' },
    tag: { uz: "Yonboshlab aylanadigan muz gigant.", en: 'An ice giant that rolls around the Sun on its side.', ru: 'Ледяной гигант, который вращается, «лёжа на боку».' },
    p: {
      uz: [
        "Uranning ekvatordagi diametri 51 118 km, ya'ni Yerdan 4 marta keng. Quyoshdan o'rtacha 2,9 mlrd km (19 astronomik birlik) uzoqlikda, nur unga 2 soat 40 daqiqada yetadi. Uni 1781 yilda Uilyam Gershel kashf etgan.",
        "Uran massasining 80% yoki undan ko'pi suv, metan va ammiakdan iborat issiq, zich suyuqlikdir. Yadro harorati taxminan 4 982 °C (9 000 °F).",
        "Atmosferasi asosan vodorod va geliydan, metan, suv va ammiak izlaridan iborat. Eng past harorat −224,2 °C (49 K).",
        "Uran Quyosh atrofida taxminan 84 Yer yilida (30 687 kun), o'z o'qi atrofida taxminan 17 soatda aylanadi. O'qi 97,77° og'gan, ya'ni deyarli orbita tekisligida yotib aylanadi.",
        "Uranning 28 ta ma'lum yo'ldoshi bor; ular Shekspir va Aleksandr Poup asarlari qahramonlari nomi bilan atalgan. Ikki halqa tizimida 13 ta halqa bor. Magnit maydoni aylanish o'qidan taxminan 60° og'gan va markazdan sayyora radiusining uchdan biriga siljigan.",
        "Uranga faqat Voyager 2 kosmik kemasi 1986 yilda uchib o'tgan.",
      ],
      en: [
        'Uranus has an equatorial diameter of 51,118 km, four times wider than Earth. It is on average 2.9 billion km (19 astronomical units) from the Sun, and sunlight takes 2 hours 40 minutes to reach it. William Herschel discovered it in 1781.',
        '80% or more of Uranus’s mass is a hot, dense fluid of water, methane and ammonia. The core temperature is about 4,982 °C (9,000 °F).',
        'The atmosphere is mostly hydrogen and helium with traces of methane, water and ammonia. The lowest temperature recorded is −224.2 °C (49 K).',
        'Uranus orbits the Sun in about 84 Earth years (30,687 days) and spins once in about 17 hours. Its axis is tilted 97.77°, so it rotates almost on its side relative to its orbit.',
        'Uranus has 28 known moons, named for characters from the works of William Shakespeare and Alexander Pope. Its two ring systems contain 13 rings. Its magnetic field is tilted nearly 60° from the rotation axis and offset from the center by one-third of the planet’s radius.',
        'Only the Voyager 2 spacecraft has flown by Uranus, in 1986.',
      ],
      ru: [
        'Диаметр Урана на экваторе 51 118 км, в четыре раза больше земного. В среднем он находится в 2,9 млрд км (19 астрономических единиц) от Солнца, свет идёт до него 2 часа 40 минут. Открыл его Уильям Гершель в 1781 году.',
        '80% и более массы Урана составляет горячая плотная жидкость из воды, метана и аммиака. Температура ядра около 4 982 °C (9 000 °F).',
        'Атмосфера состоит в основном из водорода и гелия со следами метана, воды и аммиака. Минимальная температура −224,2 °C (49 К).',
        'Уран обращается вокруг Солнца примерно за 84 земных года (30 687 суток), а оборот вокруг оси делает примерно за 17 часов. Ось наклонена на 97,77°, то есть планета вращается почти «лёжа на боку» относительно орбиты.',
        'У Урана 28 известных спутников, названных по героям произведений Уильяма Шекспира и Александра Попа. Две системы колец включают 13 колец. Магнитное поле наклонено почти на 60° к оси вращения и смещено от центра на треть радиуса планеты.',
        'К Урану подлетал только аппарат Voyager 2 в 1986 году.',
      ],
    },
    facts: {
      uz: ["Uran o'qi 97,77° og'gan: u deyarli yonboshlab aylanadi.", "Uranda bir yil taxminan 84 Yer yiliga teng.", "Eng past harorati −224,2 °C."],
      en: ['Uranus’s axis is tilted 97.77°: it spins nearly on its side.', 'A year on Uranus lasts about 84 Earth years.', 'Its lowest recorded temperature is −224.2 °C.'],
      ru: ['Ось Урана наклонена на 97,77°: он вращается почти «лёжа на боку».', 'Год на Уране длится около 84 земных лет.', 'Минимальная температура −224,2 °C.'],
    },
  },

  neptune: {
    color: '#4a6fe0', tilt: 28, size: 49528,
    stats: { diameter: 49528, distance: 4500, au: 30, year: 60190, day: { v: 16, u: 'h' }, solar: null, tilt: 28, moons: 16, rings: true, temp: null },
    name: { uz: 'Neptun', en: 'Neptune', ru: 'Нептун' },
    tag: { uz: "Eng uzoq sayyora: shiddatli shamollar va ko'k muz gigant.", en: 'The most distant planet: an ice giant with violent winds.', ru: 'Самая далёкая планета: ледяной гигант с яростными ветрами.' },
    p: {
      uz: [
        "Neptunning ekvatordagi diametri 49 528 km, ya'ni Yerdan 4 marta keng. Quyoshdan o'rtacha 4,5 mlrd km (30 astronomik birlik) uzoqlikda, nur unga 4 soatda yetadi. 1846 yilda Le Verrier hisob-kitobi asosida bashorat qilingan va Galle kuzatgan.",
        "Neptun gaz va muz gigant, qattiq yuzasi yo'q. Katta Qorong'i Dog' deb ataluvchi katta bo'ron 1989 yilda kuzatilgan, keyin yo'qolgan.",
        "Atmosferasi asosan vodorod va geliydan, metan bilan aralashgan. Shamol tezligi 1 200 milya/soatdan (taxminan 1 930 km/soat) oshadi.",
        "Neptunda yil taxminan 165 Yer yili (60 190 kun), kun esa taxminan 16 soat. O'qi orbita tekisligiga 28° og'gan va fasllar 40 yildan ortiq davom etadi.",
        "Neptunning 16 ta ma'lum yo'ldoshi bor. Eng yirigi Triton 1846 yil 10 oktyabrda kashf etilgan: yuzasi −235 °C, geyzerlar 8 km dan balandga muzli modda otadi va u Neptunning aylanishiga teskari (retrograd) orbitada aylanadi. Kamida 5 ta asosiy halqa bor (Galle, Leverrier, Lassell, Arago, Adams) va 4 ta yorqin yoy. Magnit maydoni Yernikidan 27 marta kuchli va aylanish o'qidan 47° og'gan.",
        "Neptunga faqat Voyager 2 kosmik kemasi 1989 yil avgustda uchib o'tgan, bu sayyorani ziyorat qilgan birinchi apparat bo'lgan.",
      ],
      en: [
        'Neptune has an equatorial diameter of 49,528 km, four times wider than Earth. It is on average 4.5 billion km (30 astronomical units) from the Sun, and sunlight takes 4 hours to reach it. It was predicted mathematically by Le Verrier in 1846 and observed by Galle.',
        'Neptune is a gas and ice giant with no solid surface. A large storm called the Great Dark Spot was seen in 1989 and has since disappeared.',
        'The atmosphere is mostly hydrogen and helium with methane. Wind speeds exceed 1,200 miles per hour (about 1,930 km/h).',
        'A year on Neptune lasts about 165 Earth years (60,190 days) and a day about 16 hours. Its axis is tilted 28° from its orbital plane, creating seasons that last over 40 years each.',
        'Neptune has 16 known moons. The largest, Triton, was discovered on October 10, 1846: its surface is −235 °C, geysers spew icy material more than 8 km high, and it orbits opposite to Neptune’s rotation (retrograde). There are at least 5 main rings (Galle, Leverrier, Lassell, Arago, Adams) and 4 prominent ring arcs. The magnetic field is 27 times more powerful than Earth’s and tilted 47° from the rotation axis.',
        'Only the Voyager 2 spacecraft has visited Neptune, in August 1989, the first spacecraft to do so.',
      ],
      ru: [
        'Диаметр Нептуна на экваторе 49 528 км, в четыре раза больше земного. В среднем он находится в 4,5 млрд км (30 астрономических единиц) от Солнца, свет идёт до него 4 часа. Его существование предсказал математически Леверье в 1846 году, а наблюдал Галле.',
        'Нептун газовый и ледяной гигант без твёрдой поверхности. Огромный шторм, названный Большим тёмным пятном, наблюдали в 1989 году, позже он исчез.',
        'Атмосфера состоит в основном из водорода и гелия с метаном. Скорость ветров превышает 1 200 миль в час (около 1 930 км/ч).',
        'Год на Нептуне длится около 165 земных лет (60 190 суток), а сутки около 16 часов. Ось наклонена на 28° к плоскости орбиты, времена года длятся более 40 лет каждое.',
        'У Нептуна 16 известных спутников. Крупнейший, Тритон, открыт 10 октября 1846 года: температура на его поверхности −235 °C, гейзеры выбрасывают ледяное вещество выше 8 км, а обращается он против вращения Нептуна (ретроградно). Есть не менее 5 основных колец (Галле, Леверье, Ласселл, Араго, Адамс) и 4 заметные дуги. Магнитное поле в 27 раз мощнее земного и наклонено на 47° к оси вращения.',
        'К Нептуну подлетал только аппарат Voyager 2 в августе 1989 года, он стал первым, посетившим планету.',
      ],
    },
    facts: {
      uz: ["Neptunda yil 165 Yer yilidan ortiq davom etadi.", "Shamollar 1 930 km/soatdan oshadi.", "Triton Neptunning aylanishiga teskari yo'nalishda aylanadi."],
      en: ['A year on Neptune lasts about 165 Earth years.', 'Winds exceed 1,930 km/h.', 'Triton orbits opposite to Neptune’s rotation.'],
      ru: ['Год на Нептуне длится около 165 земных лет.', 'Ветры превышают 1 930 км/ч.', 'Тритон обращается против вращения Нептуна.'],
    },
  },
}
