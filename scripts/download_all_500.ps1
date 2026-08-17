# Master 500 Chinese Birds Downloader from Xeno-canto
$audioDir = Join-Path $PSScriptRoot "..\audio"
if (!(Test-Path $audioDir)) {
    New-Item -ItemType Directory -Path $audioDir -Force | Out-Null
}

# 500 valid species scientific slugs on Xeno-canto
$species = @(
    # --- 核心鸣禽 ---
    "Passer-montanus", "Pica-serica", "Spilopelia-chinensis", "Pycnonotus-sinensis", "Turdus-mandarinus",
    "Parus-minor", "Urocissa-erythroryncha", "Cyanopica-cyanus", "Upupa-epops", "Hirundo-rustica",
    "Chloris-sinica", "Anas-platyrhynchos", "Aix-galericulata", "Ardea-cinerea", "Egretta-garzetta",
    "Cuculus-canorus", "Alcedo-atthis", "Falco-tinnunculus", "Athene-noctua", "Otus-lettia",
    "Alauda-arvensis", "Troglodytes-troglodytes", "Phasianus-colchicus", "Lanius-schach", "Acridotheres-cristatellus",
    "Garrulax-canorus", "Sinosuthora-webbiana", "Motacilla-alba", "Phoenicurus-auroreus", "Copsychus-saularis",
    "Monticola-solitarius", "Phylloscopus-inornatus", "Acrocephalus-orientalis", "Dicrurus-macrocercus", "Bombycilla-garrulus",
    "Sitta-europaea", "Dendrocopos-major", "Podiceps-cristatus", "Tachybaptus-ruficollis", "Phalacrocorax-carbo",
    "Grus-japonensis", "Gallinula-chloropus", "Hydrophasianus-chirurgus", "Himantopus-himantopus", "Recurvirostra-avosetta",
    "Vanellus-vanellus", "Chroicocephalus-ridibundus", "Falco-peregrinus", "Aquila-chrysaetos", "Bubo-bubo",
    "Streptopelia-orientalis",

    # --- 雀科 & 鵐科 ---
    "Spinus-spinus", "Fringilla-montifringilla", "Fringilla-coelebs", "Eophona-migratoria", "Eophona-personata",
    "Coccothraustes-coccothraustes", "Carpodacus-erythrinus", "Carpodacus-vinaceus", "Loxia-curvirostra", "Loxia-leucoptera",
    "Pyrrhula-pyrrhula", "Pyrrhula-erythaca", "Carpodacus-sibiricus", "Carpodacus-rubicilla", "Carpodacus-rhodochlamys",
    "Carpodacus-roseus", "Carpodacus-trifasciatus", "Carpodacus-pulcherrimus", "Carpodacus-waltoni", "Carpodacus-roborowskii",
    "Emberiza-aureola", "Emberiza-rutila", "Emberiza-spodocephala", "Emberiza-tristrami", "Emberiza-elegans",
    "Emberiza-fucata", "Emberiza-rustica", "Emberiza-pusilla", "Emberiza-cioides", "Emberiza-schoeniclus",
    "Emberiza-pallasi", "Emberiza-leucocephalos", "Emberiza-citrinella", "Emberiza-chrysophrys", "Emberiza-godlewskii",
    "Emberiza-bruniceps", "Emberiza-melanocephala", "Emberiza-hortulana", "Emberiza-buchanani", "Emberiza-cia",
    "Calcarius-lapponicus", "Plectrophenax-nivalis", "Montifringilla-nivalis", "Pyrgilauda-davidiana", "Pyrgilauda-ruficolis",

    # --- 鹡鸰 & 鹨 & 百灵 ---
    "Motacilla-tschutschensis", "Motacilla-cinerea", "Motacilla-citreola", "Motacilla-grandis", "Dendronanthus-indicus",
    "Anthus-hodgsoni", "Anthus-spinoletta", "Anthus-richardi", "Anthus-rufulus", "Anthus-gustavi",
    "Anthus-cervinus", "Anthus-roseatus", "Anthus-pratensis", "Anthus-trivialis", "Anthus-campestris",
    "Alauda-gulgula", "Melanocorypha-mongolica", "Galerida-cristata", "Calandrella-brachydactyla", "Calandrella-cinerea",
    "Eremophila-alpestris", "Mirafra-javanica", "Melanocorypha-calandra", "Melanocorypha-leucoptera", "Melanocorypha-yeltoniensis",

    # --- 鸦科 ---
    "Pyrrhocorax-pyrrhocorax", "Pyrrhocorax-graculus", "Coloeus-dauuricus", "Coloeus-monedula", "Corvus-macrorhynchos",
    "Corvus-corone", "Corvus-corax", "Corvus-torquatus", "Corvus-frugilegus", "Garrulus-glandarius",
    "Nucifraga-caryocatactes", "Perisoreus-infaustus", "Perisoreus-internigrans", "Dendrocitta-formosae", "Dendrocitta-vagabunda",
    "Crypsirina-temia", "Platysmurus-leucopterus", "Podoces-biddulphi", "Podoces-hendersoni", "Pseudopodoces-humilis",

    # --- 山雀科 & 鹎科 ---
    "Pardaliparus-venustulus", "Parus-monticolus", "Machlolophus-spilonotus", "Periparus-ater", "Periparus-rubidiventris",
    "Periparus-rufonuchalis", "Poecile-montanus", "Poecile-palustris", "Poecile-superciliosus", "Poecile-davidi",
    "Cyanistes-cyanus", "Cyanistes-caeruleus", "Lophophanes-dichrous", "Sittiparus-varius", "Sittiparus-castaneoventris",
    "Aegithalos-glaucogularis", "Aegithalos-concinnus", "Aegithalos-caudatus", "Aegithalos-fuliginosus", "Aegithalos-bonvaloti",
    "Pycnonotus-jocosus", "Pycnonotus-xanthorrhous", "Pycnonotus-aurigaster", "Pycnonotus-taivanus", "Pycnonotus-striatus",
    "Hypsipetes-leucocephalus", "Hypsipetes-amaurotis", "Hypsipetes-mcclellandii", "Hemixos-castanonotus", "Hemixos-flavala",
    "Spizixos-semitorques", "Spizixos-canifrons", "Alophoixus-pallidus", "Ixos-mcclellandii", "Microscelis-amaurotis",

    # --- 鸫科 & 鹟科 ---
    "Turdus-obscurus", "Turdus-eunomus", "Turdus-naumanni", "Turdus-hortulorum", "Turdus-cardis",
    "Turdus-dissimilis", "Turdus-boulboul", "Turdus-merula", "Turdus-chrysolaus", "Turdus-pilaris",
    "Turdus-iliacus", "Turdus-philomelos", "Turdus-viscivorus", "Turdus-atrogularis", "Turdus-ruficollis",
    "Turdus-rubrocanus", "Turdus-feae", "Turdus-mupinensis", "Zoothera-aurea", "Zoothera-dauma",
    "Zoothera-monticola", "Geokichla-sibirica", "Geokichla-citrina", "Grandala-coelicolor", "Myophonus-caeruleus",
    "Tarsiger-cyanurus", "Tarsiger-rufilatus", "Tarsiger-chrysaeus", "Tarsiger-indicus", "Tarsiger-hyperythrus",
    "Phoenicurus-fuliginosus", "Phoenicurus-leucocephalus", "Phoenicurus-frontalis", "Phoenicurus-ochruros", "Phoenicurus-phoenicurus",
    "Phoenicurus-hodgsoni", "Phoenicurus-schisticeps", "Phoenicurus-erythrogastrus", "Phoenicurus-alaschanicus", "Phoenicurus-erythronotus",
    "Calliope-calliope", "Calliope-pectoralis", "Calliope-obscura", "Calliope-tschebaiewi", "Luscinia-svecica",
    "Luscinia-luscinia", "Luscinia-megarhynchos", "Luscinia-cyane", "Luscinia-brunnea", "Luscinia-ruficeps",
    "Monticola-cinclorhyncha", "Monticola-rufiventris", "Monticola-gularis", "Saxicola-maurus", "Saxicola-stejnegeri",
    "Saxicola-ferreus", "Saxicola-caprata", "Oenanthe-oenanthe", "Oenanthe-pleschanka", "Oenanthe-desertii",
    "Oenanthe-isabellina", "Oenanthe-picata", "Oenanthe-albonigra", "Eumyias-thalassinus", "Cyanoptila-cyanomelana",
    "Cyanoptila-cumatilis", "Ficedula-zanthopygia", "Ficedula-narcissina", "Ficedula-mugimaki", "Ficedula-albicilla",
    "Ficedula-parva", "Ficedula-strophiata", "Ficedula-sapphira", "Ficedula-westermanni", "Ficedula-superciliaris",
    "Ficedula-tricolor", "Ficedula-hyperythra", "Muscicapa-striata", "Muscicapa-dauurica", "Muscicapa-griseisticta",
    "Muscicapa-sibirica", "Muscicapa-ferruginea", "Muscicapa-muttui", "Niltava-sundara", "Niltava-macgrigoriae",
    "Niltava-grandis", "Niltava-davidi", "Cyornis-rubeculoides", "Cyornis-banyumas", "Cyornis-glaucicomans",

    # --- 噪鹛 & 鸦雀 & 画眉 ---
    "Garrulax-taewanus", "Garrulax-leucolophus", "Garrulax-monileger", "Garrulax-strepitans", "Garrulax-castanotis",
    "Pterorhinus-perspicillatus", "Pterorhinus-sannio", "Pterorhinus-berthemyi", "Pterorhinus-chinensis", "Pterorhinus-pectoralis",
    "Pterorhinus-courtoisi", "Pterorhinus-davidi", "Pterorhinus-albogularis", "Pterorhinus-ruficeps", "Pterorhinus-caerulatus",
    "Trochalopteron-elliotii", "Trochalopteron-squamatum", "Trochalopteron-subunicolor", "Trochalopteron-lineatum", "Trochalopteron-morrisonianum",
    "Trochalopteron-variegatum", "Trochalopteron-henrici", "Trochalopteron-milnei", "Trochalopteron-erythrocephalum", "Trochalopteron-chrysopterum",
    "Ianthocincla-cineracea", "Ianthocincla-lunulata", "Ianthocincla-bieti", "Ianthocincla-maxima", "Ianthocincla-ocellata",
    "Leiothrix-lutea", "Leiothrix-argentauris", "Minla-ignotincta", "Chrysominla-strigula", "Siva-cyanouroptera",
    "Liocichla-omeiensis", "Liocichla-steerii", "Liocichla-phoenicea", "Babax-lanceolatus", "Babax-waddelli",
    "Babax-koslowi", "Paradoxornis-heudei", "Paradoxornis-flavirostris", "Paradoxornis-guttaticollis", "Sinosuthora-conspicillata",
    "Sinosuthora-przewalskii", "Sinosuthora-zappeyi", "Sinosuthora-alphonsiana", "Psittiparus-gularis", "Psittiparus-margaritae",
    "Suthora-nipalensis", "Suthora-fulvifrons", "Suthora-verreauxi", "Neosuthora-davidiana", "Chleuasicus-atrosuperciliaris",
    "Pomatorhinus-superciliaris", "Pomatorhinus-erythrocnemis", "Pomatorhinus-gravivox", "Pomatorhinus-swinhoei", "Pomatorhinus-ruficollis",
    "Pomatorhinus-ochraceiceps", "Pomatorhinus-ferruginosus", "Megapomatorhinus-hypoleucos", "Megapomatorhinus-erythrogenys", "Spelaeornis-troglodytoides",

    # --- 柳莺 & 树莺 & 扇尾莺 ---
    "Phylloscopus-proregulus", "Phylloscopus-borealis", "Phylloscopus-fuscatus", "Phylloscopus-affinis", "Phylloscopus-occipitalis",
    "Phylloscopus-coronatus", "Phylloscopus-plumbeitarsus", "Phylloscopus-trochiloides", "Phylloscopus-magnirostris", "Phylloscopus-tenellipes",
    "Phylloscopus-borealoides", "Phylloscopus-castaniceps", "Phylloscopus-laetus", "Phylloscopus-ricketti", "Phylloscopus-cantator",
    "Phylloscopus-claudiae", "Phylloscopus-humei", "Phylloscopus-forresti", "Phylloscopus-chloronotus", "Phylloscopus-pulcher",
    "Seicercus-burkii", "Seicercus-tephrocephalus", "Seicercus-whistleri", "Seicercus-valentini", "Seicercus-soror",
    "Horornis-fortipes", "Horornis-diphone", "Horornis-canturians", "Horornis-flavolivaceus", "Horornis-acanthizoides",
    "Cettia-cetti", "Cettia-castaneocoronata", "Urosphena-squameiceps", "Abroscopus-albogularis", "Abroscopus-schisticeps",
    "Acrocephalus-bistrigiceps", "Acrocephalus-agricola", "Acrocephalus-tangorum", "Acrocephalus-arundinaceus", "Acrocephalus-stentoreus",
    "Acrocephalus-dumetorum", "Acrocephalus-schoenobaenus", "Acrocephalus-scirpaceus", "Locustella-lanceolata", "Locustella-certhiola",
    "Locustella-ochotensis", "Locustella-pleskei", "Locustella-fasciata", "Locustella-amnicola", "Locustella-luscinioides",
    "Prinia-inornata", "Prinia-flaviventris", "Prinia-socialis", "Prinia-hodgsonii", "Prinia-crinigera",
    "Prinia-atrogularis", "Orthotomus-sutorius", "Orthotomus-atrogularis", "Cisticola-juncidis", "Cisticola-exilis",

    # --- 伯劳 & 椋鸟 & 燕 & 卷尾 ---
    "Lanius-cristatus", "Lanius-isabellinus", "Lanius-tigrinus", "Lanius-bucephalus", "Lanius-sphenocercus",
    "Lanius-excubitor", "Lanius-collurio", "Lanius-minor", "Lanius-senator", "Lanius-nubicus",
    "Spodiopsar-sericeus", "Spodiopsar-cineraceus", "Sturnia-sinensis", "Sturnia-sturnina", "Sturnia-philippensis",
    "Gracula-religiosa", "Sturnus-vulgaris", "Pastor-roseus", "Acridotheres-fuscus", "Acridotheres-grandis",
    "Cecropis-daurica", "Hirundo-tahitica", "Riparia-riparia", "Riparia-diluta", "Ptyonoprogne-rupestris",
    "Delichon-urbicum", "Delichon-dasypus", "Delichon-nipalense", "Dicrurus-leucophaeus", "Dicrurus-annectens",
    "Dicrurus-aeneus", "Dicrurus-remifer", "Dicrurus-hottentottus", "Dicrurus-paradiseus", "Artamus-fuscus",

    # --- 太阳鸟 & 䴓 & 旋木雀 & 绣眼鸟 ---
    "Aethopyga-christinae", "Aethopyga-gouldiae", "Aethopyga-nipalensis", "Aethopyga-siparaja", "Aethopyga-ignicauda",
    "Cinnyris-asiaticus", "Arachnothera-longirostra", "Arachnothera-magna", "Dicaeum-cruentatum", "Dicaeum-ignipectus",
    "Dicaeum-concolor", "Dicaeum-melanozanthum", "Sitta-castanea", "Sitta-villosa", "Sitta-yunnanensis",
    "Sitta-krueperi", "Sitta-frontalis", "Sitta-formosa", "Tichodroma-muraria", "Certhia-familiaris",
    "Certhia-hodgsoni", "Certhia-himalayana", "Certhia-tianquanensis", "Certhia-discolor", "Certhia-manipurensis",
    "Zosterops-simplex", "Zosterops-erythropleurus", "Zosterops-japonicus", "Zosterops-palpebrosus", "Regulus-regulus",
    "Regulus-goodfellowi", "Leptopoecile-sophiae", "Leptopoecile-elegans", "Cinclus-cinclus", "Cinclus-pallasii",

    # --- 游禽 (鸭/雁/天鹅/䴙䴘/潜鸟/鸬鹚) ---
    "Anas-zonorhyncha", "Anas-crecca", "Spatula-querquedula", "Spatula-clypeata", "Anas-acuta",
    "Mareca-penelope", "Mareca-falcata", "Mareca-strepera", "Tadorna-ferruginea", "Tadorna-tadorna",
    "Nettapus-coromandelianus", "Sarkidiornis-melanotos", "Aythya-ferina", "Aythya-fuligula", "Aythya-nyroca",
    "Aythya-baeri", "Aythya-marila", "Bucephala-clangula", "Mergellus-albellus", "Mergus-squamatus",
    "Mergus-merganser", "Mergus-serrator", "Anser-cygnoides", "Anser-fabalis", "Anser-serrirostris",
    "Anser-anser", "Anser-indicus", "Anser-albifrons", "Anser-erythropus", "Anser-caerulescens",
    "Branta-bernicla", "Branta-ruficollis", "Cygnus-olor", "Cygnus-cygnus", "Cygnus-columbianus",
    "Podiceps-nigricollis", "Podiceps-auritus", "Podiceps-grisegena", "Gavia-stellata", "Gavia-arctica",
    "Gavia-pacifica", "Gavia-adamsii", "Pelecanus-crispus", "Pelecanus-onocrotalus", "Pelecanus-philippensis",
    "Phalacrocorax-capillatus", "Urile-pelagicus", "Urile-urile", "Microcarbo-niger", "Fregata-ariel",

    # --- 涉禽 (鹭/鹳/鹮/鹤/秧鸡/鸻/鹬/鸥) ---
    "Ardea-purpurea", "Ardea-alba", "Ardea-intermedia", "Egretta-eulophotes", "Egretta-sacra",
    "Bubulcus-ibis", "Ardeola-bacchus", "Butorides-striata", "Nycticorax-nycticorax", "Gorsachius-melanolophus",
    "Gorsachius-magnificus", "Ixobrychus-sinensis", "Ixobrychus-eurhythmus", "Ixobrychus-cinnamomeus", "Ixobrychus-flavicollis",
    "Botaurus-stellaris", "Ciconia-boyciana", "Ciconia-nigra", "Ciconia-ciconia", "Nipponia-nippon",
    "Plegadis-falcinellus", "Platalea-leucorodia", "Platalea-minor", "Threskiornis-melanocephalus", "Pseudibis-davisoni",
    "Leucogeranus-leucogeranus", "Antigone-vipio", "Grus-grus", "Grus-nigricollis", "Grus-monacha",
    "Anthropoides-virgo", "Antigone-antigone", "Rallus-aquaticus", "Rallus-indicus", "Hypotaenidia-striata",
    "Zapornia-fusca", "Zapornia-paykullii", "Zapornia-pusilla", "Porzana-porzana", "Gallicrex-cinerea",
    "Porphyrio-poliocephalus", "Amaurornis-phoenicurus", "Fulica-atra", "Vanellus-cinereus", "Vanellus-duvaucelii",
    "Charadrius-dubius", "Charadrius-alexandrinus", "Charadrius-mongolus", "Charadrius-leschenaultii", "Charadrius-veredus",
    "Pluvialis-fulva", "Pluvialis-squatarola", "Actitis-hypoleucos", "Tringa-ochropus", "Tringa-glareola",
    "Tringa-nebularia", "Tringa-guttifer", "Tringa-totanus", "Tringa-erythropus", "Tringa-stagnatilis",
    "Tringa-brevipes", "Limosa-limosa", "Limosa-lapponica", "Numenius-arquata", "Numenius-madagascariensis",
    "Numenius-phaeopus", "Calidris-tenuirostris", "Calidris-canutus", "Calidris-alba", "Calidris-ruficollis",
    "Calidris-temminckii", "Calidris-subminuta", "Calidris-alpina", "Calidris-ferruginea", "Calidris-falcinellus",
    "Calidris-pugnax", "Scolopax-rusticola", "Gallinago-solitaria", "Gallinago-hardwickii", "Gallinago-nemoricola",
    "Gallinago-stenura", "Gallinago-megala", "Gallinago-gallinago", "Lymnocryptes-minimus", "Hydrophasianus-chirurgus",
    "Metopidius-indicus", "Burhinus-oedicnemus", "Esacus-recurvirostris", "Haematopus-ostralegus", "Glareola-maldivarum",
    "Glareola-pratincola", "Larus-vegae", "Larus-mongolicus", "Larus-schistisagus", "Larus-crassirostris",
    "Larus-canus", "Larus-glaucescens", "Larus-hyperboreus", "Ichthyaetus-ichthyaetus", "Ichthyaetus-relictus",
    "Saundersilarus-saundersi", "Rissa-tridactyla", "Hydroprogne-caspia", "Gelochelidon-nilotica", "Thalasseus-bergii",
    "Thalasseus-bernsteini", "Sterna-hirundo", "Sterna-dougallii", "Sterna-sumatrana", "Sternula-albifrons",
    "Chlidonias-hybrida", "Chlidonias-leucopterus", "Chlidonias-niger", "Anous-stolidus", "Gygis-alba",

    # --- 猛禽 (鹰/雕/鵟/鹞/隼/鸮) ---
    "Aquila-heliaca", "Aquila-nipalensis", "Aquila-clanga", "Hieraaetus-pennatus", "Haliaeetus-albicilla",
    "Haliaeetus-leucogaster", "Haliaeetus-pelagicus", "Aegypius-monachus", "Gyps-fulvus", "Gyps-himalayensis",
    "Gypaetus-barbatus", "Circaetus-gallicus", "Spilornis-cheela", "Pandion-haliaetus", "Elanus-caeruleus",
    "Milvus-migrans", "Haliastur-indus", "Pernis-ptilorhynchus", "Buteo-japonicus", "Buteo-hemilasius",
    "Buteo-lagopus", "Buteo-rufinus", "Buteo-buteo", "Accipiter-gentilis", "Accipiter-nisus",
    "Accipiter-soloensis", "Accipiter-gularis", "Accipiter-virgatus", "Accipiter-trivirgatus", "Circus-aeruginosus",
    "Circus-spilonotus", "Circus-cyaneus", "Circus-melanoleucos", "Circus-pygargus", "Circus-macrourus",
    "Falco-subbuteo", "Falco-cherrug", "Falco-rusticolus", "Falco-naumanni", "Falco-amurensis",
    "Falco-columbarius", "Falco-severus", "Falco-cenchroides", "Microhierax-melanoleucos", "Microhierax-fringillarius",
    "Bubo-coromandus", "Ketupa-blakistoni", "Ketupa-zeylonensis", "Ketupa-flavipes", "Otus-sunia",
    "Otus-spilocephalus", "Otus-bakkamoena", "Glaucidium-cuculoides", "Glaucidium-brodiei", "Ninox-scutulata",
    "Asio-otus", "Asio-flammeus", "Aegolius-funereus", "Strix-aluco", "Strix-nivicolum",
    "Strix-uralensis", "Strix-nebulosa", "Strix-leptogrammica", "Tyto-alba", "Tyto-longimembris",

    # --- 攀禽 (啄木鸟/翠鸟/杜鹃/蜂虎/鹦鹉) ---
    "Dendrocopos-leucotos", "Dendrocopos-minor", "Dendrocopos-canicapillus", "Dendrocopos-atratus", "Dendrocopos-hyperythrus",
    "Picoides-tridactylus", "Picus-canus", "Picus-squamatus", "Picus-chlorolophus", "Dryocopus-martius",
    "Dryocopus-javensis", "Jynx-torquilla", "Picumnus-innominatus", "Sasia-ochracea", "Chrysocolaptes-guttacristatus",
    "Halcyon-smyrnensis", "Halcyon-pileata", "Megaceryle-lugubris", "Ceryle-rudis", "Alcedo-hercules",
    "Ceyx-erithaca", "Pelargopsis-capensis", "Cuculus-micropterus", "Cuculus-optatus", "Cuculus-poliocephalus",
    "Hierococcyx-sparverioides", "Hierococcyx-nisicolor", "Hierococcyx-fugax", "Eudynamys-scolopaceus", "Cacomantis-merulinus",
    "Cacomantis-sonneratii", "Surniculus-lugubris", "Chrysococcyx-maculatus", "Chrysococcyx-xanthorhynchus", "Centropus-sinensis",
    "Centropus-bengalensis", "Phaenicophaeus-tristis", "Eurystomus-orientalis", "Coracias-garrulus", "Merops-philippinus",
    "Merops-orientalis", "Merops-leschenaulti", "Merops-apiaster", "Psittacula-krameri", "Psittacula-alexandri",
    "Psittacula-derbiana", "Psittacula-roseata", "Loriculus-vernalis", "Rhyticeros-undulatus", "Buceros-bicornis",

    # --- 陆禽 (雉/鹧鸪/马鸡/锦鸡/鸠鸽/夜鹰/雨燕) ---
    "Chrysolophus-pictus", "Chrysolophus-amherstiae", "Syrmaticus-reevesii", "Syrmaticus-ellioti", "Syrmaticus-mikado",
    "Lophura-swinhoii", "Lophura-nycthemera", "Crossoptilon-mantchuricum", "Crossoptilon-auritum", "Crossoptilon-crossoptilon",
    "Crossoptilon-harmani", "Lophophorus-lhuysii", "Lophophorus-sclateri", "Lophophorus-impejanus", "Tragopan-caboti",
    "Tragopan-temminckii", "Tragopan-satyra", "Tragopan-blythii", "Tragopan-melanocephalus", "Arborophila-torqueola",
    "Arborophila-rufigularis", "Arborophila-gingica", "Arborophila-rufipectus", "Arborophila-ardens", "Bambusicola-thoracicus",
    "Bambusicola-fytchii", "Perdix-dauurica", "Perdix-hodgsoniae", "Coturnix-japonica", "Synoicus-chinensis",
    "Tetraogallus-himalayensis", "Tetraogallus-tibetanus", "Tetraogallus-altaicus", "Tetrao-urogallus", "Tetrao-urogalloides",
    "Lyrurus-tetrix", "Tetrastes-bonasia", "Tetrastes-sewerzowi", "Lagopus-lagopus", "Lagopus-muta",
    "Streptopelia-decaocto", "Streptopelia-turtur", "Streptopelia-tranquebarica", "Chalcophaps-indica", "Treron-bicinctus",
    "Treron-formosae", "Treron-curvirostra", "Treron-sphenurus", "Treron-sieboldii", "Ducula-aenea",
    "Ducula-badia", "Columba-livia", "Columba-rupestris", "Columba-leuconota", "Columba-oenas",
    "Columba-palumbus", "Columba-hodgsonii", "Columba-janthina", "Caprimulgus-jotaka", "Caprimulgus-europaeus",
    "Caprimulgus-affinis", "Caprimulgus-macrurus", "Apus-apus", "Apus-pacificus", "Apus-nipalensis",
    "Apus-cooki", "Aerodramus-germani", "Cypsiurus-balasiensis", "Hirundapus-caudacutus", "Hirundapus-cochinchinensis",
    "Syrrhaptes-paradoxus", "Syrrhaptes-tibetanus", "Pterocles-orientalis", "Otis-tarda", "Tetrax-tetrax",
    "Chlamydotis-macqueenii", "Turnix-suscitator", "Turnix-tanki", "Turnix-sylvaticus"
)

Write-Host "============================================================"
Write-Host "  Master 500 Chinese Birds Audio Downloader"
Write-Host "  Target species count: $($species.Count)"
Write-Host "  Audio Directory: $audioDir"
Write-Host "============================================================`n"

$total = $species.Count
$idx = 0
$downloaded = 0
$skipped = 0
$failed = 0

foreach ($slug in $species) {
    $idx++
    $id = $slug.ToLower().Replace("-", "_")
    $target = Join-Path $audioDir ($id + ".mp3")

    if (Test-Path $target) {
        $size = (Get-Item $target).Length
        if ($size -gt 20000) {
            Write-Host "[$idx/$total] [$slug] Exists ($([math]::Round($size/1KB, 1)) KB)" -ForegroundColor DarkGray
            $skipped++
            continue
        }
    }

    Write-Host "[$idx/$total] [$slug] Fetching..." -NoNewline
    try {
        $pageUrl = "https://xeno-canto.org/species/" + $slug
        $lines = curl.exe -s -L $pageUrl
        $text = $lines -join "`n"

        $downloadUrl = $null
        if ($text -match 'https://xeno-canto\.org/sounds/uploaded/[^\s''"]+\.mp3') {
            $downloadUrl = $matches[0]
        } elseif ($text -match 'xeno-canto\.org/(\d+)/download') {
            $downloadUrl = "https://xeno-canto.org/$($matches[1])/download"
        }

        if ($downloadUrl) {
            Write-Host " Downloading..." -NoNewline
            curl.exe -s -L -o $target $downloadUrl

            if (Test-Path $target) {
                $size = (Get-Item $target).Length
                if ($size -gt 20000) {
                    Write-Host " Done ($([math]::Round($size/1KB, 1)) KB)" -ForegroundColor Green
                    $downloaded++
                } else {
                    Write-Host " Incomplete ($size bytes)" -ForegroundColor Yellow
                    Remove-Item $target -Force -ErrorAction SilentlyContinue
                    $failed++
                }
            }
        } else {
            Write-Host " No direct link" -ForegroundColor Red
            $failed++
        }
    } catch {
        Write-Host " Error: $_" -ForegroundColor Red
        $failed++
    }

    Start-Sleep -Milliseconds 250
}

Write-Host "`n============================================================"
Write-Host "Finished batch download!"
Write-Host "Downloaded: $downloaded, Already Existed: $skipped, Failed/Unavailable: $failed"
Write-Host "Total Verified Audio: $($downloaded + $skipped) / $total"
Write-Host "============================================================"
