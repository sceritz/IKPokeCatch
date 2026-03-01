/**
 * Comprehensive Pokémon rarity tier list — Generations 1–9 (Pokédex #1–1025).
 *
 * Format per entry:  [id, rarity, evolutionStage]
 *
 *   rarity:         'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary'
 *   evolutionStage: 0 = base / unevolved
 *                   1 = first evolution
 *                   2 = second evolution, final stage, or Mega
 *
 * Spawn weight = speciesRarityWeight × evolutionStageMultiplier
 *
 * Species rarity weights:
 *   common     → 100
 *   uncommon   →  40
 *   rare       →  15
 *   very_rare  →   5
 *   legendary  →   1
 *
 * Evolution stage multipliers:
 *   stage 0    → 1.00
 *   stage 1    → 0.50
 *   stage 2    → 0.25
 */

// ─── Raw data ────────────────────────────────────────────────────────────────
// [id, rarity, stage]
const RAW = [
  // ══════════════════════════════════════════════════════════════════
  // GENERATION 1  (#001 – #151)
  // ══════════════════════════════════════════════════════════════════
  [1,   'uncommon',  0], // Bulbasaur
  [2,   'rare',      1], // Ivysaur
  [3,   'very_rare', 2], // Venusaur
  [4,   'uncommon',  0], // Charmander
  [5,   'rare',      1], // Charmeleon
  [6,   'very_rare', 2], // Charizard
  [7,   'uncommon',  0], // Squirtle
  [8,   'rare',      1], // Wartortle
  [9,   'very_rare', 2], // Blastoise
  [10,  'common',    0], // Caterpie
  [11,  'common',    1], // Metapod
  [12,  'uncommon',  2], // Butterfree
  [13,  'common',    0], // Weedle
  [14,  'common',    1], // Kakuna
  [15,  'uncommon',  2], // Beedrill
  [16,  'common',    0], // Pidgey
  [17,  'uncommon',  1], // Pidgeotto
  [18,  'rare',      2], // Pidgeot
  [19,  'common',    0], // Rattata
  [20,  'uncommon',  1], // Raticate
  [21,  'common',    0], // Spearow
  [22,  'uncommon',  1], // Fearow
  [23,  'common',    0], // Ekans
  [24,  'uncommon',  1], // Arbok
  [25,  'uncommon',  1], // Pikachu  (Pichu is pre-evo → Pikachu is stage 1)
  [26,  'rare',      2], // Raichu
  [27,  'common',    0], // Sandshrew
  [28,  'uncommon',  1], // Sandslash
  [29,  'common',    0], // Nidoran♀
  [30,  'uncommon',  1], // Nidorina
  [31,  'rare',      2], // Nidoqueen
  [32,  'common',    0], // Nidoran♂
  [33,  'uncommon',  1], // Nidorino
  [34,  'rare',      2], // Nidoking
  [35,  'uncommon',  1], // Clefairy  (Cleffa is pre-evo)
  [36,  'rare',      2], // Clefable
  [37,  'uncommon',  0], // Vulpix
  [38,  'rare',      1], // Ninetales
  [39,  'common',    1], // Jigglypuff  (Igglybuff is pre-evo)
  [40,  'uncommon',  2], // Wigglytuff
  [41,  'common',    0], // Zubat
  [42,  'uncommon',  1], // Golbat
  [43,  'common',    0], // Oddish
  [44,  'uncommon',  1], // Gloom
  [45,  'rare',      2], // Vileplume
  [46,  'common',    0], // Paras
  [47,  'uncommon',  1], // Parasect
  [48,  'common',    0], // Venonat
  [49,  'uncommon',  1], // Venomoth
  [50,  'common',    0], // Diglett
  [51,  'uncommon',  1], // Dugtrio
  [52,  'common',    0], // Meowth
  [53,  'uncommon',  1], // Persian
  [54,  'common',    0], // Psyduck
  [55,  'uncommon',  1], // Golduck
  [56,  'common',    0], // Mankey
  [57,  'uncommon',  1], // Primeape
  [58,  'uncommon',  0], // Growlithe
  [59,  'rare',      1], // Arcanine
  [60,  'common',    0], // Poliwag
  [61,  'uncommon',  1], // Poliwhirl
  [62,  'rare',      2], // Poliwrath
  [63,  'uncommon',  0], // Abra
  [64,  'rare',      1], // Kadabra
  [65,  'very_rare', 2], // Alakazam
  [66,  'common',    0], // Machop
  [67,  'uncommon',  1], // Machoke
  [68,  'rare',      2], // Machamp
  [69,  'common',    0], // Bellsprout
  [70,  'uncommon',  1], // Weepinbell
  [71,  'rare',      2], // Victreebel
  [72,  'common',    0], // Tentacool
  [73,  'uncommon',  1], // Tentacruel
  [74,  'common',    0], // Geodude
  [75,  'uncommon',  1], // Graveler
  [76,  'rare',      2], // Golem
  [77,  'uncommon',  0], // Ponyta
  [78,  'rare',      1], // Rapidash
  [79,  'common',    0], // Slowpoke
  [80,  'uncommon',  1], // Slowbro
  [81,  'common',    0], // Magnemite
  [82,  'uncommon',  1], // Magneton
  [83,  'uncommon',  0], // Farfetch'd
  [84,  'common',    0], // Doduo
  [85,  'uncommon',  1], // Dodrio
  [86,  'common',    0], // Seel
  [87,  'uncommon',  1], // Dewgong
  [88,  'common',    0], // Grimer
  [89,  'uncommon',  1], // Muk
  [90,  'common',    0], // Shellder
  [91,  'uncommon',  1], // Cloyster
  [92,  'common',    0], // Gastly
  [93,  'uncommon',  1], // Haunter
  [94,  'rare',      2], // Gengar
  [95,  'uncommon',  0], // Onix
  [96,  'common',    0], // Drowzee
  [97,  'uncommon',  1], // Hypno
  [98,  'common',    0], // Krabby
  [99,  'uncommon',  1], // Kingler
  [100, 'common',    0], // Voltorb
  [101, 'uncommon',  1], // Electrode
  [102, 'common',    0], // Exeggcute
  [103, 'uncommon',  1], // Exeggutor
  [104, 'common',    0], // Cubone
  [105, 'uncommon',  1], // Marowak
  [106, 'rare',      1], // Hitmonlee
  [107, 'rare',      1], // Hitmonchan
  [108, 'uncommon',  0], // Lickitung
  [109, 'common',    0], // Koffing
  [110, 'uncommon',  1], // Weezing
  [111, 'common',    0], // Rhyhorn
  [112, 'uncommon',  1], // Rhydon
  [113, 'rare',      0], // Chansey
  [114, 'uncommon',  0], // Tangela
  [115, 'rare',      0], // Kangaskhan
  [116, 'common',    0], // Horsea
  [117, 'uncommon',  1], // Seadra
  [118, 'common',    0], // Goldeen
  [119, 'uncommon',  1], // Seaking
  [120, 'common',    0], // Staryu
  [121, 'rare',      1], // Starmie
  [122, 'rare',      1], // Mr. Mime   (Mime Jr. is pre-evo)
  [123, 'rare',      0], // Scyther
  [124, 'rare',      1], // Jynx       (Smoochum is pre-evo)
  [125, 'rare',      1], // Electabuzz (Elekid is pre-evo)
  [126, 'rare',      1], // Magmar     (Magby is pre-evo)
  [127, 'rare',      0], // Pinsir
  [128, 'rare',      0], // Tauros
  [129, 'common',    0], // Magikarp
  [130, 'very_rare', 1], // Gyarados
  [131, 'rare',      0], // Lapras
  [132, 'rare',      0], // Ditto
  [133, 'uncommon',  0], // Eevee
  [134, 'rare',      1], // Vaporeon
  [135, 'rare',      1], // Jolteon
  [136, 'rare',      1], // Flareon
  [137, 'rare',      0], // Porygon
  [138, 'uncommon',  0], // Omanyte
  [139, 'rare',      1], // Omastar
  [140, 'uncommon',  0], // Kabuto
  [141, 'rare',      1], // Kabutops
  [142, 'very_rare', 0], // Aerodactyl
  [143, 'very_rare', 0], // Snorlax
  [144, 'legendary', 0], // Articuno
  [145, 'legendary', 0], // Zapdos
  [146, 'legendary', 0], // Moltres
  [147, 'rare',      0], // Dratini
  [148, 'very_rare', 1], // Dragonair
  [149, 'very_rare', 2], // Dragonite
  [150, 'legendary', 0], // Mewtwo
  [151, 'legendary', 0], // Mew

  // ══════════════════════════════════════════════════════════════════
  // GENERATION 2  (#152 – #251)
  // ══════════════════════════════════════════════════════════════════
  [152, 'uncommon',  0], // Chikorita
  [153, 'rare',      1], // Bayleef
  [154, 'very_rare', 2], // Meganium
  [155, 'uncommon',  0], // Cyndaquil
  [156, 'rare',      1], // Quilava
  [157, 'very_rare', 2], // Typhlosion
  [158, 'uncommon',  0], // Totodile
  [159, 'rare',      1], // Croconaw
  [160, 'very_rare', 2], // Feraligatr
  [161, 'common',    0], // Sentret
  [162, 'uncommon',  1], // Furret
  [163, 'common',    0], // Hoothoot
  [164, 'uncommon',  1], // Noctowl
  [165, 'common',    0], // Ledyba
  [166, 'uncommon',  1], // Ledian
  [167, 'common',    0], // Spinarak
  [168, 'uncommon',  1], // Ariados
  [169, 'rare',      2], // Crobat
  [170, 'common',    0], // Chinchou
  [171, 'uncommon',  1], // Lanturn
  [172, 'common',    0], // Pichu
  [173, 'common',    0], // Cleffa
  [174, 'common',    0], // Igglybuff
  [175, 'uncommon',  0], // Togepi
  [176, 'rare',      1], // Togetic
  [177, 'common',    0], // Natu
  [178, 'uncommon',  1], // Xatu
  [179, 'common',    0], // Mareep
  [180, 'uncommon',  1], // Flaaffy
  [181, 'rare',      2], // Ampharos
  [182, 'rare',      2], // Bellossom
  [183, 'common',    0], // Marill
  [184, 'uncommon',  1], // Azumarill
  [185, 'rare',      0], // Sudowoodo
  [186, 'rare',      2], // Politoed
  [187, 'common',    0], // Hoppip
  [188, 'uncommon',  1], // Skiploom
  [189, 'rare',      2], // Jumpluff
  [190, 'uncommon',  0], // Aipom
  [191, 'common',    0], // Sunkern
  [192, 'uncommon',  1], // Sunflora
  [193, 'uncommon',  0], // Yanma
  [194, 'common',    0], // Wooper
  [195, 'uncommon',  1], // Quagsire
  [196, 'rare',      1], // Espeon
  [197, 'rare',      1], // Umbreon
  [198, 'uncommon',  0], // Murkrow
  [199, 'rare',      1], // Slowking
  [200, 'uncommon',  0], // Misdreavus
  [201, 'uncommon',  0], // Unown
  [202, 'uncommon',  0], // Wobbuffet
  [203, 'uncommon',  0], // Girafarig
  [204, 'common',    0], // Pineco
  [205, 'rare',      1], // Forretress
  [206, 'common',    0], // Dunsparce
  [207, 'uncommon',  0], // Gligar
  [208, 'rare',      1], // Steelix
  [209, 'common',    0], // Snubbull
  [210, 'uncommon',  1], // Granbull
  [211, 'uncommon',  0], // Qwilfish
  [212, 'rare',      1], // Scizor
  [213, 'uncommon',  0], // Shuckle
  [214, 'rare',      0], // Heracross
  [215, 'uncommon',  0], // Sneasel
  [216, 'common',    0], // Teddiursa
  [217, 'uncommon',  1], // Ursaring
  [218, 'common',    0], // Slugma
  [219, 'uncommon',  1], // Magcargo
  [220, 'common',    0], // Swinub
  [221, 'uncommon',  1], // Piloswine
  [222, 'uncommon',  0], // Corsola
  [223, 'common',    0], // Remoraid
  [224, 'uncommon',  1], // Octillery
  [225, 'uncommon',  0], // Delibird
  [226, 'uncommon',  0], // Mantine
  [227, 'rare',      0], // Skarmory
  [228, 'uncommon',  0], // Houndour
  [229, 'rare',      1], // Houndoom
  [230, 'very_rare', 2], // Kingdra
  [231, 'common',    0], // Phanpy
  [232, 'uncommon',  1], // Donphan
  [233, 'rare',      1], // Porygon2
  [234, 'uncommon',  0], // Stantler
  [235, 'uncommon',  0], // Smeargle
  [236, 'uncommon',  0], // Tyrogue
  [237, 'rare',      1], // Hitmontop
  [238, 'uncommon',  0], // Smoochum
  [239, 'uncommon',  0], // Elekid
  [240, 'uncommon',  0], // Magby
  [241, 'rare',      0], // Miltank
  [242, 'very_rare', 1], // Blissey
  [243, 'legendary', 0], // Raikou
  [244, 'legendary', 0], // Entei
  [245, 'legendary', 0], // Suicune
  [246, 'rare',      0], // Larvitar
  [247, 'very_rare', 1], // Pupitar
  [248, 'very_rare', 2], // Tyranitar
  [249, 'legendary', 0], // Lugia
  [250, 'legendary', 0], // Ho-Oh
  [251, 'legendary', 0], // Celebi

  // ══════════════════════════════════════════════════════════════════
  // GENERATION 3  (#252 – #386)
  // ══════════════════════════════════════════════════════════════════
  [252, 'uncommon',  0], // Treecko
  [253, 'rare',      1], // Grovyle
  [254, 'very_rare', 2], // Sceptile
  [255, 'uncommon',  0], // Torchic
  [256, 'rare',      1], // Combusken
  [257, 'very_rare', 2], // Blaziken
  [258, 'uncommon',  0], // Mudkip
  [259, 'rare',      1], // Marshtomp
  [260, 'very_rare', 2], // Swampert
  [261, 'common',    0], // Poochyena
  [262, 'uncommon',  1], // Mightyena
  [263, 'common',    0], // Zigzagoon
  [264, 'uncommon',  1], // Linoone
  [265, 'common',    0], // Wurmple
  [266, 'common',    1], // Silcoon
  [267, 'uncommon',  2], // Beautifly
  [268, 'common',    1], // Cascoon
  [269, 'uncommon',  2], // Dustox
  [270, 'common',    0], // Lotad
  [271, 'uncommon',  1], // Lombre
  [272, 'rare',      2], // Ludicolo
  [273, 'common',    0], // Seedot
  [274, 'uncommon',  1], // Nuzleaf
  [275, 'rare',      2], // Shiftry
  [276, 'common',    0], // Taillow
  [277, 'uncommon',  1], // Swellow
  [278, 'common',    0], // Wingull
  [279, 'uncommon',  1], // Pelipper
  [280, 'uncommon',  0], // Ralts
  [281, 'rare',      1], // Kirlia
  [282, 'very_rare', 2], // Gardevoir
  [283, 'common',    0], // Surskit
  [284, 'uncommon',  1], // Masquerain
  [285, 'common',    0], // Shroomish
  [286, 'rare',      1], // Breloom
  [287, 'common',    0], // Slakoth
  [288, 'uncommon',  1], // Vigoroth
  [289, 'very_rare', 2], // Slaking
  [290, 'uncommon',  0], // Nincada
  [291, 'rare',      1], // Ninjask
  [292, 'rare',      1], // Shedinja
  [293, 'common',    0], // Whismur
  [294, 'uncommon',  1], // Loudred
  [295, 'rare',      2], // Exploud
  [296, 'common',    0], // Makuhita
  [297, 'uncommon',  1], // Hariyama
  [298, 'common',    0], // Azurill
  [299, 'uncommon',  0], // Nosepass
  [300, 'common',    0], // Skitty
  [301, 'uncommon',  1], // Delcatty
  [302, 'rare',      0], // Sableye
  [303, 'rare',      0], // Mawile
  [304, 'common',    0], // Aron
  [305, 'uncommon',  1], // Lairon
  [306, 'rare',      2], // Aggron
  [307, 'common',    0], // Meditite
  [308, 'uncommon',  1], // Medicham
  [309, 'common',    0], // Electrike
  [310, 'uncommon',  1], // Manectric
  [311, 'common',    0], // Plusle
  [312, 'common',    0], // Minun
  [313, 'common',    0], // Volbeat
  [314, 'common',    0], // Illumise
  [315, 'uncommon',  1], // Roselia  (Budew is pre-evo)
  [316, 'common',    0], // Gulpin
  [317, 'uncommon',  1], // Swalot
  [318, 'uncommon',  0], // Carvanha
  [319, 'rare',      1], // Sharpedo
  [320, 'common',    0], // Wailmer
  [321, 'rare',      1], // Wailord
  [322, 'common',    0], // Numel
  [323, 'uncommon',  1], // Camerupt
  [324, 'uncommon',  0], // Torkoal
  [325, 'common',    0], // Spoink
  [326, 'uncommon',  1], // Grumpig
  [327, 'common',    0], // Spinda
  [328, 'uncommon',  0], // Trapinch
  [329, 'rare',      1], // Vibrava
  [330, 'very_rare', 2], // Flygon
  [331, 'common',    0], // Cacnea
  [332, 'uncommon',  1], // Cacturne
  [333, 'common',    0], // Swablu
  [334, 'rare',      1], // Altaria
  [335, 'rare',      0], // Zangoose
  [336, 'rare',      0], // Seviper
  [337, 'rare',      0], // Lunatone
  [338, 'rare',      0], // Solrock
  [339, 'common',    0], // Barboach
  [340, 'uncommon',  1], // Whiscash
  [341, 'common',    0], // Corphish
  [342, 'uncommon',  1], // Crawdaunt
  [343, 'common',    0], // Baltoy
  [344, 'uncommon',  1], // Claydol
  [345, 'uncommon',  0], // Lileep
  [346, 'rare',      1], // Cradily
  [347, 'uncommon',  0], // Anorith
  [348, 'rare',      1], // Armaldo
  [349, 'rare',      0], // Feebas
  [350, 'very_rare', 1], // Milotic
  [351, 'uncommon',  0], // Castform
  [352, 'uncommon',  0], // Kecleon
  [353, 'common',    0], // Shuppet
  [354, 'rare',      1], // Banette
  [355, 'common',    0], // Duskull
  [356, 'uncommon',  1], // Dusclops
  [357, 'rare',      0], // Tropius
  [358, 'rare',      0], // Chimecho
  [359, 'very_rare', 0], // Absol
  [360, 'uncommon',  0], // Wynaut
  [361, 'uncommon',  0], // Snorunt
  [362, 'rare',      1], // Glalie
  [363, 'common',    0], // Spheal
  [364, 'uncommon',  1], // Sealeo
  [365, 'rare',      2], // Walrein
  [366, 'common',    0], // Clamperl
  [367, 'rare',      1], // Huntail
  [368, 'rare',      1], // Gorebyss
  [369, 'very_rare', 0], // Relicanth
  [370, 'common',    0], // Luvdisc
  [371, 'rare',      0], // Bagon
  [372, 'very_rare', 1], // Shelgon
  [373, 'very_rare', 2], // Salamence
  [374, 'rare',      0], // Beldum
  [375, 'very_rare', 1], // Metang
  [376, 'very_rare', 2], // Metagross
  [377, 'legendary', 0], // Regirock
  [378, 'legendary', 0], // Regice
  [379, 'legendary', 0], // Registeel
  [380, 'legendary', 0], // Latias
  [381, 'legendary', 0], // Latios
  [382, 'legendary', 0], // Kyogre
  [383, 'legendary', 0], // Groudon
  [384, 'legendary', 0], // Rayquaza
  [385, 'legendary', 0], // Jirachi
  [386, 'legendary', 0], // Deoxys

  // ══════════════════════════════════════════════════════════════════
  // GENERATION 4  (#387 – #493)
  // ══════════════════════════════════════════════════════════════════
  [387, 'uncommon',  0], // Turtwig
  [388, 'rare',      1], // Grotle
  [389, 'very_rare', 2], // Torterra
  [390, 'uncommon',  0], // Chimchar
  [391, 'rare',      1], // Monferno
  [392, 'very_rare', 2], // Infernape
  [393, 'uncommon',  0], // Piplup
  [394, 'rare',      1], // Prinplup
  [395, 'very_rare', 2], // Empoleon
  [396, 'common',    0], // Starly
  [397, 'uncommon',  1], // Staravia
  [398, 'rare',      2], // Staraptor
  [399, 'common',    0], // Bidoof
  [400, 'uncommon',  1], // Bibarel
  [401, 'common',    0], // Kricketot
  [402, 'uncommon',  1], // Kricketune
  [403, 'common',    0], // Shinx
  [404, 'uncommon',  1], // Luxio
  [405, 'rare',      2], // Luxray
  [406, 'common',    0], // Budew
  [407, 'rare',      2], // Roserade
  [408, 'uncommon',  0], // Cranidos
  [409, 'rare',      1], // Rampardos
  [410, 'uncommon',  0], // Shieldon
  [411, 'rare',      1], // Bastiodon
  [412, 'common',    0], // Burmy
  [413, 'uncommon',  1], // Wormadam
  [414, 'uncommon',  1], // Mothim
  [415, 'common',    0], // Combee
  [416, 'rare',      1], // Vespiquen
  [417, 'common',    0], // Pachirisu
  [418, 'common',    0], // Buizel
  [419, 'uncommon',  1], // Floatzel
  [420, 'common',    0], // Cherubi
  [421, 'uncommon',  1], // Cherrim
  [422, 'common',    0], // Shellos
  [423, 'uncommon',  1], // Gastrodon
  [424, 'uncommon',  1], // Ambipom
  [425, 'uncommon',  0], // Drifloon
  [426, 'rare',      1], // Drifblim
  [427, 'common',    0], // Buneary
  [428, 'uncommon',  1], // Lopunny
  [429, 'rare',      1], // Mismagius
  [430, 'rare',      1], // Honchkrow
  [431, 'common',    0], // Glameow
  [432, 'uncommon',  1], // Purugly
  [433, 'common',    0], // Chingling
  [434, 'common',    0], // Stunky
  [435, 'uncommon',  1], // Skuntank
  [436, 'common',    0], // Bronzor
  [437, 'rare',      1], // Bronzong
  [438, 'common',    0], // Bonsly
  [439, 'common',    0], // Mime Jr.
  [440, 'common',    0], // Happiny
  [441, 'uncommon',  0], // Chatot
  [442, 'very_rare', 0], // Spiritomb
  [443, 'rare',      0], // Gible
  [444, 'very_rare', 1], // Gabite
  [445, 'very_rare', 2], // Garchomp
  [446, 'uncommon',  0], // Munchlax
  [447, 'uncommon',  0], // Riolu
  [448, 'very_rare', 1], // Lucario
  [449, 'uncommon',  0], // Hippopotas
  [450, 'rare',      1], // Hippowdon
  [451, 'uncommon',  0], // Skorupi
  [452, 'rare',      1], // Drapion
  [453, 'common',    0], // Croagunk
  [454, 'uncommon',  1], // Toxicroak
  [455, 'uncommon',  0], // Carnivine
  [456, 'common',    0], // Finneon
  [457, 'uncommon',  1], // Lumineon
  [458, 'common',    0], // Mantyke
  [459, 'uncommon',  0], // Snover
  [460, 'rare',      1], // Abomasnow
  [461, 'rare',      1], // Weavile
  [462, 'rare',      2], // Magnezone
  [463, 'rare',      1], // Lickilicky
  [464, 'very_rare', 2], // Rhyperior
  [465, 'rare',      1], // Tangrowth
  [466, 'very_rare', 2], // Electivire
  [467, 'very_rare', 2], // Magmortar
  [468, 'very_rare', 2], // Togekiss
  [469, 'rare',      1], // Yanmega
  [470, 'rare',      1], // Leafeon
  [471, 'rare',      1], // Glaceon
  [472, 'rare',      1], // Gliscor
  [473, 'rare',      2], // Mamoswine
  [474, 'very_rare', 2], // Porygon-Z
  [475, 'very_rare', 2], // Gallade
  [476, 'rare',      1], // Probopass
  [477, 'very_rare', 2], // Dusknoir
  [478, 'rare',      1], // Froslass
  [479, 'rare',      0], // Rotom
  [480, 'legendary', 0], // Uxie
  [481, 'legendary', 0], // Mesprit
  [482, 'legendary', 0], // Azelf
  [483, 'legendary', 0], // Dialga
  [484, 'legendary', 0], // Palkia
  [485, 'legendary', 0], // Heatran
  [486, 'legendary', 0], // Regigigas
  [487, 'legendary', 0], // Giratina
  [488, 'legendary', 0], // Cresselia
  [489, 'very_rare', 0], // Phione
  [490, 'legendary', 0], // Manaphy
  [491, 'legendary', 0], // Darkrai
  [492, 'legendary', 0], // Shaymin
  [493, 'legendary', 0], // Arceus

  // ══════════════════════════════════════════════════════════════════
  // GENERATION 5  (#494 – #649)
  // ══════════════════════════════════════════════════════════════════
  [494, 'legendary', 0], // Victini
  [495, 'uncommon',  0], // Snivy
  [496, 'rare',      1], // Servine
  [497, 'very_rare', 2], // Serperior
  [498, 'uncommon',  0], // Tepig
  [499, 'rare',      1], // Pignite
  [500, 'very_rare', 2], // Emboar
  [501, 'uncommon',  0], // Oshawott
  [502, 'rare',      1], // Dewott
  [503, 'very_rare', 2], // Samurott
  [504, 'common',    0], // Patrat
  [505, 'uncommon',  1], // Watchog
  [506, 'common',    0], // Lillipup
  [507, 'uncommon',  1], // Herdier
  [508, 'rare',      2], // Stoutland
  [509, 'common',    0], // Purrloin
  [510, 'uncommon',  1], // Liepard
  [511, 'common',    0], // Pansage
  [512, 'uncommon',  1], // Simisage
  [513, 'common',    0], // Pansear
  [514, 'uncommon',  1], // Simisear
  [515, 'common',    0], // Panpour
  [516, 'uncommon',  1], // Simipour
  [517, 'common',    0], // Munna
  [518, 'uncommon',  1], // Musharna
  [519, 'common',    0], // Pidove
  [520, 'uncommon',  1], // Tranquill
  [521, 'rare',      2], // Unfezant
  [522, 'common',    0], // Blitzle
  [523, 'uncommon',  1], // Zebstrika
  [524, 'common',    0], // Roggenrola
  [525, 'uncommon',  1], // Boldore
  [526, 'rare',      2], // Gigalith
  [527, 'common',    0], // Woobat
  [528, 'uncommon',  1], // Swoobat
  [529, 'common',    0], // Drilbur
  [530, 'rare',      1], // Excadrill
  [531, 'common',    0], // Audino
  [532, 'common',    0], // Timburr
  [533, 'uncommon',  1], // Gurdurr
  [534, 'rare',      2], // Conkeldurr
  [535, 'common',    0], // Tympole
  [536, 'uncommon',  1], // Palpitoad
  [537, 'rare',      2], // Seismitoad
  [538, 'rare',      0], // Throh
  [539, 'rare',      0], // Sawk
  [540, 'common',    0], // Sewaddle
  [541, 'uncommon',  1], // Swadloon
  [542, 'rare',      2], // Leavanny
  [543, 'common',    0], // Venipede
  [544, 'uncommon',  1], // Whirlipede
  [545, 'rare',      2], // Scolipede
  [546, 'common',    0], // Cottonee
  [547, 'uncommon',  1], // Whimsicott
  [548, 'common',    0], // Petilil
  [549, 'uncommon',  1], // Lilligant
  [550, 'uncommon',  0], // Basculin
  [551, 'common',    0], // Sandile
  [552, 'uncommon',  1], // Krokorok
  [553, 'rare',      2], // Krookodile
  [554, 'uncommon',  0], // Darumaka
  [555, 'rare',      1], // Darmanitan
  [556, 'uncommon',  0], // Maractus
  [557, 'common',    0], // Dwebble
  [558, 'uncommon',  1], // Crustle
  [559, 'common',    0], // Scraggy
  [560, 'uncommon',  1], // Scrafty
  [561, 'uncommon',  0], // Sigilyph
  [562, 'uncommon',  0], // Yamask
  [563, 'rare',      1], // Cofagrigus
  [564, 'uncommon',  0], // Tirtouga
  [565, 'rare',      1], // Carracosta
  [566, 'uncommon',  0], // Archen
  [567, 'rare',      1], // Archeops
  [568, 'common',    0], // Trubbish
  [569, 'uncommon',  1], // Garbodor
  [570, 'rare',      0], // Zorua
  [571, 'very_rare', 1], // Zoroark
  [572, 'common',    0], // Minccino
  [573, 'uncommon',  1], // Cinccino
  [574, 'common',    0], // Gothita
  [575, 'uncommon',  1], // Gothorita
  [576, 'rare',      2], // Gothitelle
  [577, 'common',    0], // Solosis
  [578, 'uncommon',  1], // Duosion
  [579, 'rare',      2], // Reuniclus
  [580, 'common',    0], // Ducklett
  [581, 'uncommon',  1], // Swanna
  [582, 'common',    0], // Vanillite
  [583, 'uncommon',  1], // Vanillish
  [584, 'rare',      2], // Vanilluxe
  [585, 'common',    0], // Deerling
  [586, 'uncommon',  1], // Sawsbuck
  [587, 'uncommon',  0], // Emolga
  [588, 'common',    0], // Karrablast
  [589, 'rare',      1], // Escavalier
  [590, 'common',    0], // Foongus
  [591, 'uncommon',  1], // Amoonguss
  [592, 'common',    0], // Frillish
  [593, 'uncommon',  1], // Jellicent
  [594, 'uncommon',  0], // Alomomola
  [595, 'common',    0], // Joltik
  [596, 'rare',      1], // Galvantula
  [597, 'common',    0], // Ferroseed
  [598, 'rare',      1], // Ferrothorn
  [599, 'common',    0], // Klink
  [600, 'uncommon',  1], // Klang
  [601, 'rare',      2], // Klinklang
  [602, 'common',    0], // Tynamo
  [603, 'uncommon',  1], // Eelektrik
  [604, 'rare',      2], // Eelektross
  [605, 'common',    0], // Elgyem
  [606, 'uncommon',  1], // Beheeyem
  [607, 'common',    0], // Litwick
  [608, 'uncommon',  1], // Lampent
  [609, 'rare',      2], // Chandelure
  [610, 'rare',      0], // Axew
  [611, 'very_rare', 1], // Fraxure
  [612, 'very_rare', 2], // Haxorus
  [613, 'common',    0], // Cubchoo
  [614, 'uncommon',  1], // Beartic
  [615, 'uncommon',  0], // Cryogonal
  [616, 'common',    0], // Shelmet
  [617, 'rare',      1], // Accelgor
  [618, 'uncommon',  0], // Stunfisk
  [619, 'common',    0], // Mienfoo
  [620, 'rare',      1], // Mienshao
  [621, 'rare',      0], // Druddigon
  [622, 'common',    0], // Golett
  [623, 'rare',      1], // Golurk
  [624, 'uncommon',  0], // Pawniard
  [625, 'rare',      1], // Bisharp
  [626, 'rare',      0], // Bouffalant
  [627, 'uncommon',  0], // Rufflet
  [628, 'rare',      1], // Braviary
  [629, 'uncommon',  0], // Vullaby
  [630, 'rare',      1], // Mandibuzz
  [631, 'rare',      0], // Heatmor
  [632, 'rare',      0], // Durant
  [633, 'rare',      0], // Deino
  [634, 'very_rare', 1], // Zweilous
  [635, 'very_rare', 2], // Hydreigon
  [636, 'rare',      0], // Larvesta
  [637, 'very_rare', 1], // Volcarona
  [638, 'legendary', 0], // Cobalion
  [639, 'legendary', 0], // Terrakion
  [640, 'legendary', 0], // Virizion
  [641, 'legendary', 0], // Tornadus
  [642, 'legendary', 0], // Thundurus
  [643, 'legendary', 0], // Reshiram
  [644, 'legendary', 0], // Zekrom
  [645, 'legendary', 0], // Landorus
  [646, 'legendary', 0], // Kyurem
  [647, 'legendary', 0], // Keldeo
  [648, 'legendary', 0], // Meloetta
  [649, 'legendary', 0], // Genesect

  // ══════════════════════════════════════════════════════════════════
  // GENERATION 6  (#650 – #721)
  // ══════════════════════════════════════════════════════════════════
  [650, 'uncommon',  0], // Chespin
  [651, 'rare',      1], // Quilladin
  [652, 'very_rare', 2], // Chesnaught
  [653, 'uncommon',  0], // Fennekin
  [654, 'rare',      1], // Braixen
  [655, 'very_rare', 2], // Delphox
  [656, 'uncommon',  0], // Froakie
  [657, 'rare',      1], // Frogadier
  [658, 'very_rare', 2], // Greninja
  [659, 'common',    0], // Bunnelby
  [660, 'uncommon',  1], // Diggersby
  [661, 'common',    0], // Fletchling
  [662, 'uncommon',  1], // Fletchinder
  [663, 'rare',      2], // Talonflame
  [664, 'common',    0], // Scatterbug
  [665, 'common',    1], // Spewpa
  [666, 'uncommon',  2], // Vivillon
  [667, 'common',    0], // Litleo
  [668, 'uncommon',  1], // Pyroar
  [669, 'common',    0], // Flabébé
  [670, 'uncommon',  1], // Floette
  [671, 'rare',      2], // Florges
  [672, 'common',    0], // Skiddo
  [673, 'uncommon',  1], // Gogoat
  [674, 'common',    0], // Pancham
  [675, 'rare',      1], // Pangoro
  [676, 'uncommon',  0], // Furfrou
  [677, 'uncommon',  0], // Espurr
  [678, 'rare',      1], // Meowstic
  [679, 'uncommon',  0], // Honedge
  [680, 'rare',      1], // Doublade
  [681, 'very_rare', 2], // Aegislash
  [682, 'common',    0], // Spritzee
  [683, 'uncommon',  1], // Aromatisse
  [684, 'common',    0], // Swirlix
  [685, 'uncommon',  1], // Slurpuff
  [686, 'common',    0], // Inkay
  [687, 'rare',      1], // Malamar
  [688, 'common',    0], // Binacle
  [689, 'rare',      1], // Barbaracle
  [690, 'common',    0], // Skrelp
  [691, 'rare',      1], // Dragalge
  [692, 'common',    0], // Clauncher
  [693, 'rare',      1], // Clawitzer
  [694, 'common',    0], // Helioptile
  [695, 'uncommon',  1], // Heliolisk
  [696, 'uncommon',  0], // Tyrunt
  [697, 'rare',      1], // Tyrantrum
  [698, 'uncommon',  0], // Amaura
  [699, 'rare',      1], // Aurorus
  [700, 'very_rare', 1], // Sylveon
  [701, 'rare',      0], // Hawlucha
  [702, 'common',    0], // Dedenne
  [703, 'rare',      0], // Carbink
  [704, 'rare',      0], // Goomy
  [705, 'very_rare', 1], // Sliggoo
  [706, 'very_rare', 2], // Goodra
  [707, 'uncommon',  0], // Klefki
  [708, 'common',    0], // Phantump
  [709, 'rare',      1], // Trevenant
  [710, 'common',    0], // Pumpkaboo
  [711, 'uncommon',  1], // Gourgeist
  [712, 'common',    0], // Bergmite
  [713, 'rare',      1], // Avalugg
  [714, 'uncommon',  0], // Noibat
  [715, 'rare',      1], // Noivern
  [716, 'legendary', 0], // Xerneas
  [717, 'legendary', 0], // Yveltal
  [718, 'legendary', 0], // Zygarde
  [719, 'legendary', 0], // Diancie
  [720, 'legendary', 0], // Hoopa
  [721, 'legendary', 0], // Volcanion

  // ══════════════════════════════════════════════════════════════════
  // GENERATION 7  (#722 – #809)
  // ══════════════════════════════════════════════════════════════════
  [722, 'uncommon',  0], // Rowlet
  [723, 'rare',      1], // Dartrix
  [724, 'very_rare', 2], // Decidueye
  [725, 'uncommon',  0], // Litten
  [726, 'rare',      1], // Torracat
  [727, 'very_rare', 2], // Incineroar
  [728, 'uncommon',  0], // Popplio
  [729, 'rare',      1], // Brionne
  [730, 'very_rare', 2], // Primarina
  [731, 'common',    0], // Pikipek
  [732, 'uncommon',  1], // Trumbeak
  [733, 'rare',      2], // Toucannon
  [734, 'common',    0], // Yungoos
  [735, 'uncommon',  1], // Gumshoos
  [736, 'common',    0], // Grubbin
  [737, 'uncommon',  1], // Charjabug
  [738, 'rare',      2], // Vikavolt
  [739, 'common',    0], // Crabrawler
  [740, 'uncommon',  1], // Crabominable
  [741, 'common',    0], // Oricorio
  [742, 'common',    0], // Cutiefly
  [743, 'uncommon',  1], // Ribombee
  [744, 'common',    0], // Rockruff
  [745, 'rare',      1], // Lycanroc
  [746, 'common',    0], // Wishiwashi
  [747, 'common',    0], // Mareanie
  [748, 'rare',      1], // Toxapex
  [749, 'common',    0], // Mudbray
  [750, 'uncommon',  1], // Mudsdale
  [751, 'common',    0], // Dewpider
  [752, 'uncommon',  1], // Araquanid
  [753, 'common',    0], // Fomantis
  [754, 'uncommon',  1], // Lurantis
  [755, 'common',    0], // Morelull
  [756, 'uncommon',  1], // Shiinotic
  [757, 'common',    0], // Salandit
  [758, 'rare',      1], // Salazzle
  [759, 'common',    0], // Stufful
  [760, 'rare',      1], // Bewear
  [761, 'common',    0], // Bounsweet
  [762, 'uncommon',  1], // Steenee
  [763, 'rare',      2], // Tsareena
  [764, 'uncommon',  0], // Comfey
  [765, 'rare',      0], // Oranguru
  [766, 'rare',      0], // Passimian
  [767, 'uncommon',  0], // Wimpod
  [768, 'very_rare', 1], // Golisopod
  [769, 'common',    0], // Sandygast
  [770, 'rare',      1], // Palossand
  [771, 'uncommon',  0], // Pyukumuku
  [772, 'very_rare', 0], // Type: Null
  [773, 'very_rare', 1], // Silvally
  [774, 'uncommon',  0], // Minior
  [775, 'uncommon',  0], // Komala
  [776, 'rare',      0], // Turtonator
  [777, 'common',    0], // Togedemaru
  [778, 'very_rare', 0], // Mimikyu
  [779, 'uncommon',  0], // Bruxish
  [780, 'rare',      0], // Drampa
  [781, 'rare',      0], // Dhelmise
  [782, 'rare',      0], // Jangmo-o
  [783, 'very_rare', 1], // Hakamo-o
  [784, 'very_rare', 2], // Kommo-o
  [785, 'legendary', 0], // Tapu Koko
  [786, 'legendary', 0], // Tapu Lele
  [787, 'legendary', 0], // Tapu Bulu
  [788, 'legendary', 0], // Tapu Fini
  [789, 'legendary', 0], // Cosmog
  [790, 'legendary', 1], // Cosmoem
  [791, 'legendary', 2], // Solgaleo
  [792, 'legendary', 2], // Lunala
  [793, 'legendary', 0], // Nihilego
  [794, 'legendary', 0], // Buzzwole
  [795, 'legendary', 0], // Pheromosa
  [796, 'legendary', 0], // Xurkitree
  [797, 'legendary', 0], // Celesteela
  [798, 'legendary', 0], // Kartana
  [799, 'legendary', 0], // Guzzlord
  [800, 'legendary', 0], // Necrozma
  [801, 'legendary', 0], // Magearna
  [802, 'legendary', 0], // Marshadow
  [803, 'legendary', 0], // Poipole
  [804, 'legendary', 1], // Naganadel
  [805, 'legendary', 0], // Stakataka
  [806, 'legendary', 0], // Blacephalon
  [807, 'legendary', 0], // Zeraora
  [808, 'very_rare', 0], // Meltan
  [809, 'very_rare', 1], // Melmetal

  // ══════════════════════════════════════════════════════════════════
  // GENERATION 8  (#810 – #905)
  // ══════════════════════════════════════════════════════════════════
  [810, 'uncommon',  0], // Grookey
  [811, 'rare',      1], // Thwackey
  [812, 'very_rare', 2], // Rillaboom
  [813, 'uncommon',  0], // Scorbunny
  [814, 'rare',      1], // Raboot
  [815, 'very_rare', 2], // Cinderace
  [816, 'uncommon',  0], // Sobble
  [817, 'rare',      1], // Drizzile
  [818, 'very_rare', 2], // Inteleon
  [819, 'common',    0], // Skwovet
  [820, 'uncommon',  1], // Greedent
  [821, 'common',    0], // Rookidee
  [822, 'uncommon',  1], // Corvisquire
  [823, 'rare',      2], // Corviknight
  [824, 'common',    0], // Blipbug
  [825, 'uncommon',  1], // Dottler
  [826, 'rare',      2], // Orbeetle
  [827, 'common',    0], // Nickit
  [828, 'uncommon',  1], // Thievul
  [829, 'common',    0], // Gossifleur
  [830, 'uncommon',  1], // Eldegoss
  [831, 'common',    0], // Wooloo
  [832, 'uncommon',  1], // Dubwool
  [833, 'common',    0], // Chewtle
  [834, 'rare',      1], // Drednaw
  [835, 'common',    0], // Yamper
  [836, 'uncommon',  1], // Boltund
  [837, 'common',    0], // Rolycoly
  [838, 'uncommon',  1], // Carkol
  [839, 'rare',      2], // Coalossal
  [840, 'common',    0], // Applin
  [841, 'rare',      1], // Flapple
  [842, 'rare',      1], // Appletun
  [843, 'common',    0], // Silicobra
  [844, 'uncommon',  1], // Sandaconda
  [845, 'uncommon',  0], // Cramorant
  [846, 'common',    0], // Arrokuda
  [847, 'uncommon',  1], // Barraskewda
  [848, 'common',    0], // Toxel
  [849, 'rare',      1], // Toxtricity
  [850, 'common',    0], // Sizzlipede
  [851, 'rare',      1], // Centiskorch
  [852, 'common',    0], // Clobbopus
  [853, 'rare',      1], // Grapploct
  [854, 'uncommon',  0], // Sinistea
  [855, 'rare',      1], // Polteageist
  [856, 'common',    0], // Hatenna
  [857, 'uncommon',  1], // Hattrem
  [858, 'very_rare', 2], // Hatterene
  [859, 'common',    0], // Impidimp
  [860, 'uncommon',  1], // Morgrem
  [861, 'rare',      2], // Grimmsnarl
  [862, 'rare',      2], // Obstagoon
  [863, 'rare',      1], // Perrserker
  [864, 'rare',      1], // Cursola
  [865, 'rare',      1], // Sirfetch'd
  [866, 'rare',      2], // Mr. Rime
  [867, 'rare',      1], // Runerigus
  [868, 'common',    0], // Milcery
  [869, 'rare',      1], // Alcremie
  [870, 'rare',      0], // Falinks
  [871, 'uncommon',  0], // Pincurchin
  [872, 'common',    0], // Snom
  [873, 'rare',      1], // Frosmoth
  [874, 'rare',      0], // Stonjourner
  [875, 'uncommon',  0], // Eiscue
  [876, 'uncommon',  0], // Indeedee
  [877, 'uncommon',  0], // Morpeko
  [878, 'common',    0], // Cufant
  [879, 'rare',      1], // Copperajah
  [880, 'very_rare', 0], // Dracozolt
  [881, 'very_rare', 0], // Arctozolt
  [882, 'very_rare', 0], // Dracovish
  [883, 'very_rare', 0], // Arctovish
  [884, 'very_rare', 0], // Duraludon
  [885, 'rare',      0], // Dreepy
  [886, 'very_rare', 1], // Drakloak
  [887, 'very_rare', 2], // Dragapult
  [888, 'legendary', 0], // Zacian
  [889, 'legendary', 0], // Zamazenta
  [890, 'legendary', 0], // Eternatus
  [891, 'legendary', 0], // Kubfu
  [892, 'legendary', 1], // Urshifu
  [893, 'legendary', 0], // Zarude
  [894, 'legendary', 0], // Regieleki
  [895, 'legendary', 0], // Regidrago
  [896, 'legendary', 0], // Glastrier
  [897, 'legendary', 0], // Spectrier
  [898, 'legendary', 0], // Calyrex
  [899, 'rare',      1], // Wyrdeer
  [900, 'very_rare', 1], // Kleavor
  [901, 'rare',      2], // Ursaluna
  [902, 'rare',      1], // Basculegion
  [903, 'rare',      1], // Sneasler
  [904, 'rare',      1], // Overqwil
  [905, 'legendary', 0], // Enamorus

  // ══════════════════════════════════════════════════════════════════
  // GENERATION 9  (#906 – #1025)
  // ══════════════════════════════════════════════════════════════════
  [906,  'uncommon',  0], // Sprigatito
  [907,  'rare',      1], // Floragato
  [908,  'very_rare', 2], // Meowscarada
  [909,  'uncommon',  0], // Fuecoco
  [910,  'rare',      1], // Crocalor
  [911,  'very_rare', 2], // Skeledirge
  [912,  'uncommon',  0], // Quaxly
  [913,  'rare',      1], // Quaxwell
  [914,  'very_rare', 2], // Quaquaval
  [915,  'common',    0], // Lechonk
  [916,  'uncommon',  1], // Oinkologne
  [917,  'common',    0], // Tarountula
  [918,  'uncommon',  1], // Spidops
  [919,  'common',    0], // Nymble
  [920,  'uncommon',  1], // Lokix
  [921,  'common',    0], // Pawmi
  [922,  'uncommon',  1], // Pawmo
  [923,  'rare',      2], // Pawmot
  [924,  'uncommon',  0], // Tandemaus
  [925,  'rare',      1], // Maushold
  [926,  'common',    0], // Fidough
  [927,  'uncommon',  1], // Dachsbun
  [928,  'common',    0], // Smoliv
  [929,  'uncommon',  1], // Dolliv
  [930,  'rare',      2], // Arboliva
  [931,  'common',    0], // Squawkabilly
  [932,  'common',    0], // Nacli
  [933,  'uncommon',  1], // Naclstack
  [934,  'rare',      2], // Garganacl
  [935,  'uncommon',  0], // Charcadet
  [936,  'rare',      1], // Armarouge
  [937,  'rare',      1], // Ceruledge
  [938,  'common',    0], // Tadbulb
  [939,  'uncommon',  1], // Bellibolt
  [940,  'common',    0], // Wattrel
  [941,  'uncommon',  1], // Kilowattrel
  [942,  'common',    0], // Maschiff
  [943,  'rare',      1], // Mabosstiff
  [944,  'common',    0], // Shroodle
  [945,  'uncommon',  1], // Grafaiai
  [946,  'common',    0], // Bramblin
  [947,  'rare',      1], // Brambleghast
  [948,  'common',    0], // Toedscool
  [949,  'uncommon',  1], // Toedscruel
  [950,  'uncommon',  0], // Klawf
  [951,  'common',    0], // Capsakid
  [952,  'uncommon',  1], // Scovillain
  [953,  'common',    0], // Rellor
  [954,  'uncommon',  1], // Rabsca
  [955,  'common',    0], // Flittle
  [956,  'rare',      1], // Espathra
  [957,  'common',    0], // Tinkatink
  [958,  'uncommon',  1], // Tinkatuff
  [959,  'rare',      2], // Tinkaton
  [960,  'common',    0], // Wiglett
  [961,  'uncommon',  1], // Wugtrio
  [962,  'rare',      0], // Bombirdier
  [963,  'common',    0], // Finizen
  [964,  'rare',      1], // Palafin
  [965,  'common',    0], // Varoom
  [966,  'uncommon',  1], // Revavroom
  [967,  'uncommon',  0], // Cyclizar
  [968,  'uncommon',  0], // Orthworm
  [969,  'uncommon',  0], // Glimmet
  [970,  'rare',      1], // Glimmora
  [971,  'common',    0], // Greavard
  [972,  'rare',      1], // Houndstone
  [973,  'uncommon',  0], // Flamigo
  [974,  'common',    0], // Cetoddle
  [975,  'rare',      1], // Cetitan
  [976,  'uncommon',  0], // Veluza
  [977,  'very_rare', 0], // Dondozo
  [978,  'uncommon',  0], // Tatsugiri
  [979,  'rare',      2], // Annihilape
  [980,  'uncommon',  1], // Clodsire
  [981,  'rare',      1], // Farigiraf
  [982,  'rare',      1], // Dudunsparce
  [983,  'very_rare', 2], // Kingambit
  [984,  'very_rare', 0], // Great Tusk
  [985,  'very_rare', 0], // Scream Tail
  [986,  'very_rare', 0], // Brute Bonnet
  [987,  'very_rare', 0], // Flutter Mane
  [988,  'very_rare', 0], // Slither Wing
  [989,  'very_rare', 0], // Sandy Shocks
  [990,  'very_rare', 0], // Iron Treads
  [991,  'very_rare', 0], // Iron Bundle
  [992,  'very_rare', 0], // Iron Hands
  [993,  'very_rare', 0], // Iron Jugulis
  [994,  'very_rare', 0], // Iron Moth
  [995,  'very_rare', 0], // Iron Thorns
  [996,  'rare',      0], // Frigibax
  [997,  'very_rare', 1], // Arctibax
  [998,  'very_rare', 2], // Baxcalibur
  [999,  'rare',      0], // Gimmighoul
  [1000, 'very_rare', 1], // Gholdengo
  [1001, 'legendary', 0], // Wo-Chien
  [1002, 'legendary', 0], // Chien-Pao
  [1003, 'legendary', 0], // Ting-Lu
  [1004, 'legendary', 0], // Chi-Yu
  [1005, 'legendary', 0], // Roaring Moon
  [1006, 'legendary', 0], // Iron Valiant
  [1007, 'legendary', 0], // Koraidon
  [1008, 'legendary', 0], // Miraidon
  [1009, 'legendary', 0], // Walking Wake
  [1010, 'legendary', 0], // Iron Leaves
  [1011, 'rare',      2], // Dipplin
  [1012, 'uncommon',  0], // Poltchageist
  [1013, 'rare',      1], // Sinistcha
  [1014, 'legendary', 0], // Okidogi
  [1015, 'legendary', 0], // Munkidori
  [1016, 'legendary', 0], // Fezandipiti
  [1017, 'legendary', 0], // Ogerpon
  [1018, 'very_rare', 2], // Archaludon
  [1019, 'very_rare', 2], // Hydrapple
  [1020, 'legendary', 0], // Gouging Fire
  [1021, 'legendary', 0], // Raging Bolt
  [1022, 'legendary', 0], // Iron Boulder
  [1023, 'legendary', 0], // Iron Crown
  [1024, 'legendary', 0], // Terapagos
  [1025, 'legendary', 0], // Pecharunt
];

// ─── Spawn weights ────────────────────────────────────────────────────────────
export const RARITY_WEIGHTS = {
  common:    100,
  uncommon:   40,
  rare:       15,
  very_rare:   5,
  legendary:   1,
};

export const STAGE_MULTIPLIERS = {
  0: 1.00,
  1: 0.50,
  2: 0.25,
};

// ─── Base catch rates ─────────────────────────────────────────────────────────
export const BASE_CATCH_RATES = {
  common:    0.60,
  uncommon:  0.40,
  rare:      0.25,
  very_rare: 0.10,
  legendary: 0.03,
};

// ─── Rarity display labels ────────────────────────────────────────────────────
export const RARITY_LABELS = {
  common:    'Common',
  uncommon:  'Uncommon',
  rare:      'Rare',
  very_rare: 'Very Rare',
  legendary: 'Legendary',
};

export const STAGE_LABELS = {
  0: 'Base',
  1: 'Stage 1',
  2: 'Stage 2',
};

// ─── Rarity colours (CSS variables fallback strings) ─────────────────────────
export const RARITY_COLORS = {
  common:    '#9e9e9e',
  uncommon:  '#66bb6a',
  rare:      '#42a5f5',
  very_rare: '#ab47bc',
  legendary: '#ffa726',
};

// ─── Build the lookup map & weighted pool on module load ─────────────────────
const pokemonMap = new Map();

RAW.forEach(([id, rarity, stage]) => {
  pokemonMap.set(id, { id, rarity, stage });
});

export const getPokemonData = (id) => pokemonMap.get(id) ?? null;

/**
 * All Pokémon entries as a flat array, with their computed spawn weight.
 * spawnWeight = rarityWeight × stageMultiplier
 */
export const POKEMON_POOL = RAW.map(([id, rarity, stage]) => ({
  id,
  rarity,
  stage,
  spawnWeight: RARITY_WEIGHTS[rarity] * STAGE_MULTIPLIERS[stage],
}));
