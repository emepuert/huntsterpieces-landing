// Carte de démo DYNAMIQUE - Géolocalisation + POI automatiques avec CACHE
document.addEventListener('DOMContentLoaded', () => {
    let map;
    const CACHE_KEY = 'treasure_hunt_poi_cache';
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures
    
    // Traductions par langue
    const translations = {
        fr: {
            enigma: { icon: '🧩', label: 'Énigme', explanation: 'Résolvez l\'énigme pour valider le checkpoint' },
            photo: { icon: '📸', label: 'Défi Photo', explanation: 'Prenez la photo demandée pour prouver votre passage' },
            validation: { icon: '✓', label: 'Validation', explanation: 'Faites valider votre réponse par l\'administrateur' },
            object: { icon: '🔍', label: 'Trouvez l\'objet', explanation: 'Trouvez et photographiez l\'objet demandé' },
            info: { icon: 'i', label: 'Information', explanation: 'Découvrez des informations sur ce lieu' }
        },
        en: {
            enigma: { icon: '🧩', label: 'Riddle', explanation: 'Solve the riddle to validate this checkpoint' },
            photo: { icon: '📸', label: 'Photo Challenge', explanation: 'Take the requested photo to prove your visit' },
            validation: { icon: '✓', label: 'Validation', explanation: 'Have your answer validated by the admin' },
            object: { icon: '🔍', label: 'Find the Object', explanation: 'Find and photograph the requested object' },
            info: { icon: 'i', label: 'Information', explanation: 'Discover information about this place' }
        },
        de: {
            enigma: { icon: '🧩', label: 'Rätsel', explanation: 'Lösen Sie das Rätsel, um diesen Checkpoint zu validieren' },
            photo: { icon: '📸', label: 'Foto-Challenge', explanation: 'Machen Sie das angeforderte Foto als Beweis' },
            validation: { icon: '✓', label: 'Validierung', explanation: 'Lassen Sie Ihre Antwort vom Admin validieren' },
            object: { icon: '🔍', label: 'Finden Sie das Objekt', explanation: 'Finden und fotografieren Sie das gesuchte Objekt' },
            info: { icon: 'i', label: 'Information', explanation: 'Entdecken Sie Informationen über diesen Ort' }
        },
        es: {
            enigma: { icon: '🧩', label: 'Enigma', explanation: 'Resuelve el enigma para validar este punto' },
            photo: { icon: '📸', label: 'Desafío Fotográfico', explanation: 'Toma la foto solicitada para probar tu visita' },
            validation: { icon: '✓', label: 'Validación', explanation: 'Haz validar tu respuesta por el administrador' },
            object: { icon: '🔍', label: 'Encuentra el Objeto', explanation: 'Encuentra y fotografía el objeto solicitado' },
            info: { icon: 'i', label: 'Información', explanation: 'Descubre información sobre este lugar' }
        },
        it: {
            enigma: { icon: '🧩', label: 'Enigma', explanation: 'Risolvi l\'enigma per convalidare questo checkpoint' },
            photo: { icon: '📸', label: 'Sfida Fotografica', explanation: 'Scatta la foto richiesta per provare la tua visita' },
            validation: { icon: '✓', label: 'Convalida', explanation: 'Fai convalidare la tua risposta dall\'amministratore' },
            object: { icon: '🔍', label: 'Trova l\'Oggetto', explanation: 'Trova e fotografa l\'oggetto richiesto' },
            info: { icon: 'i', label: 'Informazione', explanation: 'Scopri informazioni su questo luogo' }
        },
        zh: {
            enigma: { icon: '🧩', label: '谜题', explanation: '解决谜题以验证此检查点' },
            photo: { icon: '📸', label: '照片挑战', explanation: '拍摄要求的照片以证明您的访问' },
            validation: { icon: '✓', label: '验证', explanation: '让管理员验证您的答案' },
            object: { icon: '🔍', label: '找到物品', explanation: '找到并拍摄所需物品' },
            info: { icon: 'i', label: '信息', explanation: '了解有关此地点的信息' }
        },
        ja: {
            enigma: { icon: '🧩', label: '謎解き', explanation: 'このチェックポイントを検証するために謎を解いてください' },
            photo: { icon: '📸', label: '写真チャレンジ', explanation: '訪問を証明するために必要な写真を撮影してください' },
            validation: { icon: '✓', label: '検証', explanation: '管理者に答えを検証してもらってください' },
            object: { icon: '🔍', label: 'オブジェクトを見つける', explanation: '要求されたオブジェクトを見つけて撮影してください' },
            info: { icon: 'i', label: '情報', explanation: 'この場所に関する情報を発見してください' }
        },
        ko: {
            enigma: { icon: '🧩', label: '수수께끼', explanation: '이 체크포인트를 확인하려면 수수께끼를 풀어보세요' },
            photo: { icon: '📸', label: '사진 챌린지', explanation: '방문을 증명하기 위해 요청된 사진을 찍으세요' },
            validation: { icon: '✓', label: '검증', explanation: '관리자에게 답변을 확인받으세요' },
            object: { icon: '🔍', label: '물건 찾기', explanation: '요청된 물건을 찾아서 사진을 찍으세요' },
            info: { icon: 'i', label: '정보', explanation: '이 장소에 대한 정보를 알아보세요' }
        },
        ar: {
            enigma: { icon: '🧩', label: 'اللغز', explanation: 'حل اللغز للتحقق من نقطة التفتيش هذه' },
            photo: { icon: '📸', label: 'تحدي الصورة', explanation: 'التقط الصورة المطلوبة لإثبات زيارتك' },
            validation: { icon: '✓', label: 'التحقق', explanation: 'اطلب من المسؤول التحقق من إجابتك' },
            object: { icon: '🔍', label: 'ابحث عن الشيء', explanation: 'ابحث عن الشيء المطلوب والتقط صورته' },
            info: { icon: 'i', label: 'معلومات', explanation: 'اكتشف معلومات حول هذا المكان' }
        },
        pt: {
            enigma: { icon: '🧩', label: 'Enigma', explanation: 'Resolva o enigma para validar este ponto' },
            photo: { icon: '📸', label: 'Desafio Fotográfico', explanation: 'Tire a foto solicitada para provar sua visita' },
            validation: { icon: '✓', label: 'Validação', explanation: 'Peça ao administrador para validar sua resposta' },
            object: { icon: '🔍', label: 'Encontre o Objeto', explanation: 'Encontre e fotografe o objeto solicitado' },
            info: { icon: 'i', label: 'Informação', explanation: 'Descubra informações sobre este lugar' }
        },
        ru: {
            enigma: { icon: '🧩', label: 'Загадка', explanation: 'Решите загадку, чтобы подтвердить эту контрольную точку' },
            photo: { icon: '📸', label: 'Фото-челлендж', explanation: 'Сделайте запрошенное фото, чтобы подтвердить посещение' },
            validation: { icon: '✓', label: 'Проверка', explanation: 'Попросите администратора проверить ваш ответ' },
            object: { icon: '🔍', label: 'Найдите объект', explanation: 'Найдите и сфотографируйте запрошенный объект' },
            info: { icon: 'i', label: 'Информация', explanation: 'Узнайте информацию об этом месте' }
        },
        nl: {
            enigma: { icon: '🧩', label: 'Raadsel', explanation: 'Los het raadsel op om dit controlepunt te valideren' },
            photo: { icon: '📸', label: 'Foto-uitdaging', explanation: 'Neem de gevraagde foto om je bezoek te bewijzen' },
            validation: { icon: '✓', label: 'Validatie', explanation: 'Laat je antwoord valideren door de beheerder' },
            object: { icon: '🔍', label: 'Vind het Object', explanation: 'Vind en fotografeer het gevraagde object' },
            info: { icon: 'i', label: 'Informatie', explanation: 'Ontdek informatie over deze plaats' }
        }
    };
    
    // Fonction pour détecter le pays via reverse geocoding
    async function detectCountryAndLanguage(lat, lng) {
        try {
            // Utiliser BigDataCloud (gratuit, pas de CORS)
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            
            if (!response.ok) {
                throw new Error('Geocoding API error');
            }
            
            const data = await response.json();
            // BigDataCloud retourne "countryCode" en format ISO (ex: "DE")
            const countryCode = (data.countryCode || data.country_code)?.toLowerCase();
            const countryName = data.countryName || data.country || 'Unknown';
            
            // Mapping pays → langue (couverture mondiale)
            const languageMap = {
                // Europe
                'fr': 'fr', 'be': 'fr', 'ch': 'fr', 'ca': 'fr', 'mc': 'fr', 'lu': 'fr',  // Français
                'de': 'de', 'at': 'de', 'li': 'de',                                        // Allemand
                'es': 'es', 'mx': 'es', 'ar': 'es', 'co': 'es', 've': 'es', 'pe': 'es', 'cl': 'es',  // Espagnol
                'it': 'it', 'sm': 'it', 'va': 'it',                                        // Italien
                'gb': 'en', 'us': 'en', 'au': 'en', 'nz': 'en', 'ie': 'en', 'za': 'en',  // Anglais
                'nl': 'nl', 'be': 'nl', 'sr': 'nl',                                        // Néerlandais
                'pt': 'pt', 'br': 'pt', 'ao': 'pt', 'mz': 'pt',                           // Portugais
                'ru': 'ru', 'by': 'ru', 'kz': 'ru',                                        // Russe
                
                // Asie
                'cn': 'zh', 'tw': 'zh', 'hk': 'zh', 'sg': 'zh',   // Chinois
                'jp': 'ja',                                         // Japonais
                'kr': 'ko',                                         // Coréen
                
                // Moyen-Orient
                'sa': 'ar', 'ae': 'ar', 'qa': 'ar', 'kw': 'ar', 'bh': 'ar', 'om': 'ar', 'jo': 'ar', 'lb': 'ar', 'eg': 'ar', 'ma': 'ar', 'tn': 'ar', 'dz': 'ar'  // Arabe
            };
            
            const lang = languageMap[countryCode] || 'en';
            console.log(`🌍 Pays détecté: ${countryName} (${countryCode}) → Langue: ${lang}`);
            return lang;
        } catch (error) {
            console.warn('⚠️ Détection pays échouée, fallback anglais');
            return 'en';
        }
    }
    
    // Fonction pour vérifier si la position a changé significativement
    function hasPositionChanged(oldLat, oldLng, newLat, newLng) {
        if (!oldLat || !oldLng) return true;
        
        // Distance en degrés (~1km = 0.01 degré)
        const distance = Math.sqrt(
            Math.pow(newLat - oldLat, 2) + Math.pow(newLng - oldLng, 2)
        );
        
        return distance > 0.05; // ~5km
    }
    
    // Charger depuis le cache
    function loadFromCache() {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;
            
            const data = JSON.parse(cached);
            const now = Date.now();
            
            // Vérifier si le cache est expiré
            if (now - data.timestamp > CACHE_DURATION) {
                localStorage.removeItem(CACHE_KEY);
                return null;
            }
            
            console.log('📦 Données chargées depuis le cache');
            return data;
        } catch (error) {
            console.error('Erreur cache:', error);
            return null;
        }
    }
    
    // Sauvegarder dans le cache
    function saveToCache(lat, lng, pois) {
        try {
            const data = {
                lat,
                lng,
                pois,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            console.log('💾 Données mises en cache');
        } catch (error) {
            console.error('Erreur sauvegarde cache:', error);
        }
    }
    
    // Fonction pour détecter mobile
    function isMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Fonction pour initialiser la carte
    function initMap(lat, lng, zoom = null) {
        // Auto-détection du zoom si non spécifié
        if (zoom === null) {
            zoom = isMobile() ? 12 : 14; // Zoom plus large sur mobile
        }
        
        if (map) {
            map.remove();
        }
        
        map = L.map('demo-map', {
            center: [lat, lng],
            zoom: zoom,
            zoomControl: true,
            dragging: true,
            scrollWheelZoom: false,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true,
            touchZoom: true
        });

        // 🎨 CHOIX DU STYLE DE CARTE
        // Option 1: Thème sombre classique (CartoDB Dark Matter) - ACTIF
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '©OpenStreetMap, ©CartoDB',
            opacity: 1
        }).addTo(map);
        
        // Option 2: Style personnalisé avec les couleurs du site
        // L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        //     attribution: '©OpenStreetMap, ©CartoDB',
        //     opacity: 1,
        //     className: 'custom-map-tiles' // Classe CSS pour filtre personnalisé
        // }).addTo(map);
        
        // Option 3: CartoDB Voyager (style original)
        // L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        //     attribution: '©OpenStreetMap, ©CartoDB',
        //     opacity: 0.85
        // }).addTo(map);
        
        return map;
    }
    
    // Afficher une notification discrète
    function showLoader() {
        const notification = document.createElement('div');
        notification.className = 'map-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-spinner"></div>
                <span>Chargement des points d'intérêt...</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => notification.classList.add('show'), 10);
    }
    
    function hideLoader() {
        const notification = document.querySelector('.map-notification');
        if (notification) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }

    // Fonction pour calculer la distance entre deux points (en mètres)
    function calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371e3; // Rayon de la Terre en mètres
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lng2 - lng1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distance en mètres
    }

    // Fonction pour récupérer les POI via Overpass API (OpenStreetMap)
    async function fetchPointsOfInterest(lat, lng, radius = 3500, minRadius = 0) {
        // Requête ULTRA-simplifiée pour éviter les timeouts
        // On cherche jusqu'à 3.5km (radius), pas de minimum
        const query = `
            [out:json][timeout:20];
            (
                node["tourism"]["name"]["tourism"!="hotel"](around:${radius},${lat},${lng});
                node["historic"]["name"](around:${radius},${lat},${lng});
            );
            out center 20;
        `;
        
        // Liste d'instances Overpass (fallback si la principale est down)
        const overpassUrls = [
            'https://overpass-api.de/api/interpreter',
            'https://overpass.kumi.systems/api/interpreter',
            'https://overpass.openstreetmap.ru/api/interpreter'
        ];
        
        for (const url of overpassUrls) {
            try {
                console.log(`🔄 Tentative ${url.split('//')[1].split('/')[0]}...`);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 sec max
                
                const response = await fetch(url, {
                    method: 'POST',
                    body: query,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                const allElements = data.elements || [];
                
                // Filtrer pour garder uniquement les POI jusqu'à radius (3.5km)
                const filteredElements = allElements.filter(poi => {
                    const distance = calculateDistance(lat, lng, poi.lat, poi.lon);
                    return distance >= minRadius && distance <= radius;
                });
                
                console.log(`✅ ${allElements.length} POI trouvés, ${filteredElements.length} dans la zone 0-3.5km via ${url.split('//')[1].split('/')[0]}`);
                return filteredElements;
            } catch (error) {
                console.warn(`⚠️ ${url.split('//')[1].split('/')[0]} failed:`, error.message);
                // Continue vers l'instance suivante
            }
        }
        
        // Toutes les instances ont échoué
        console.error('❌ Toutes les instances Overpass ont échoué');
        return [];
    }
    
    // Fonction pour récupérer les infos Wikipedia
    async function fetchWikipediaInfo(name, lat, lng) {
        try {
            // Recherche par coordonnées pour être plus précis
            const response = await fetch(
                `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lng}&gsradius=100&gslimit=1&format=json&origin=*`
            );
            const data = await response.json();
            
            if (data.query?.geosearch?.[0]) {
                const pageId = data.query.geosearch[0].pageid;
                
                // Récupérer l'extrait de l'article
                const extractResponse = await fetch(
                    `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=extracts&exintro=1&explaintext=1&format=json&origin=*`
                );
                const extractData = await extractResponse.json();
                const extract = extractData.query?.pages?.[pageId]?.extract || '';
                
                return extract.split('.')[0] + '.'; // Premier phrase
            }
        } catch (error) {
            console.log('Pas d\'info Wikipedia pour', name);
        }
        return null;
    }
    
    // Générer une énigme basée sur le type de POI
    function generateChallenge(poi, wikiInfo, language = 'en') {
        const types = ['enigma', 'photo', 'validation', 'object', 'info'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        // Templates de challenges multilingues
        const challengeTemplates = {
            fr: {
                enigma: [
                    `Quelle est l'histoire de ce lieu ?`,
                    `En quelle année a été construit ce monument ?`,
                    `Qui a fondé cet endroit ?`
                ],
                photo: [
                    `Prenez une photo de l'entrée principale`,
                    `Photographiez une caractéristique unique de ce lieu`,
                    `Selfie d'équipe devant le monument`
                ],
                validation: [
                    `Comptez les éléments architecturaux et faites valider`,
                    `Trouvez une date gravée et faites-la valider`,
                    `Observez et décrivez un détail à l'admin`
                ],
                object: [
                    `Trouvez un objet lié à l'histoire du lieu`,
                    `Photographiez un symbole caractéristique`,
                    `Trouvez une plaque commémorative`
                ],
                info: [
                    wikiInfo || `Ce lieu fait partie du patrimoine local et mérite une visite !`,
                    `Point d'intérêt historique de la région`,
                    `Découvrez ce lieu emblématique`
                ]
            },
            en: {
                enigma: [
                    `What is the history of this place?`,
                    `In what year was this monument built?`,
                    `Who founded this place?`
                ],
                photo: [
                    `Take a photo of the main entrance`,
                    `Photograph a unique feature of this place`,
                    `Team selfie in front of the monument`
                ],
                validation: [
                    `Count the architectural elements and validate`,
                    `Find an engraved date and have it validated`,
                    `Observe and describe a detail to the admin`
                ],
                object: [
                    `Find an object related to the place's history`,
                    `Photograph a characteristic symbol`,
                    `Find a commemorative plaque`
                ],
                info: [
                    wikiInfo || `This place is part of the local heritage and worth a visit!`,
                    `Historic point of interest in the region`,
                    `Discover this iconic place`
                ]
            },
            de: {
                enigma: [
                    `Was ist die Geschichte dieses Ortes?`,
                    `In welchem Jahr wurde dieses Denkmal gebaut?`,
                    `Wer hat diesen Ort gegründet?`
                ],
                photo: [
                    `Machen Sie ein Foto vom Haupteingang`,
                    `Fotografieren Sie ein einzigartiges Merkmal dieses Ortes`,
                    `Team-Selfie vor dem Denkmal`
                ],
                validation: [
                    `Zählen Sie die architektonischen Elemente und lassen Sie validieren`,
                    `Finden Sie ein eingraviertes Datum und lassen Sie es validieren`,
                    `Beobachten Sie und beschreiben Sie ein Detail dem Admin`
                ],
                object: [
                    `Finden Sie ein Objekt zur Geschichte des Ortes`,
                    `Fotografieren Sie ein charakteristisches Symbol`,
                    `Finden Sie eine Gedenktafel`
                ],
                info: [
                    wikiInfo || `Dieser Ort ist Teil des lokalen Erbes und einen Besuch wert!`,
                    `Historischer Ort von Interesse in der Region`,
                    `Entdecken Sie diesen ikonischen Ort`
                ]
            },
            es: {
                enigma: [
                    `¿Cuál es la historia de este lugar?`,
                    `¿En qué año se construyó este monumento?`,
                    `¿Quién fundó este lugar?`
                ],
                photo: [
                    `Tome una foto de la entrada principal`,
                    `Fotografíe una característica única de este lugar`,
                    `Selfie de equipo frente al monumento`
                ],
                validation: [
                    `Cuente los elementos arquitectónicos y haga validar`,
                    `Encuentre una fecha grabada y hágala validar`,
                    `Observe y describa un detalle al administrador`
                ],
                object: [
                    `Encuentre un objeto relacionado con la historia del lugar`,
                    `Fotografíe un símbolo característico`,
                    `Encuentre una placa conmemorativa`
                ],
                info: [
                    wikiInfo || `¡Este lugar forma parte del patrimonio local y merece una visita!`,
                    `Punto de interés histórico de la región`,
                    `Descubra este lugar emblemático`
                ]
            },
            it: {
                enigma: [
                    `Qual è la storia di questo luogo?`,
                    `In che anno è stato costruito questo monumento?`,
                    `Chi ha fondato questo luogo?`
                ],
                photo: [
                    `Scatta una foto dell'ingresso principale`,
                    `Fotografa una caratteristica unica di questo luogo`,
                    `Selfie di gruppo davanti al monumento`
                ],
                validation: [
                    `Conta gli elementi architettonici e fai convalidare`,
                    `Trova una data incisa e falla convalidare`,
                    `Osserva e descrivi un dettaglio all'admin`
                ],
                object: [
                    `Trova un oggetto legato alla storia del luogo`,
                    `Fotografa un simbolo caratteristico`,
                    `Trova una targa commemorativa`
                ],
                info: [
                    wikiInfo || `Questo luogo fa parte del patrimonio locale e merita una visita!`,
                    `Punto d'interesse storico della regione`,
                    `Scopri questo luogo iconico`
                ]
            },
            zh: {
                enigma: [
                    `这个地方的历史是什么？`,
                    `这座纪念碑建于哪一年？`,
                    `谁创立了这个地方？`
                ],
                photo: [
                    `拍摄主入口的照片`,
                    `拍摄这个地方的独特特征`,
                    `在纪念碑前合影`
                ],
                validation: [
                    `计算建筑元素并验证`,
                    `找到刻的日期并验证`,
                    `观察并向管理员描述细节`
                ],
                object: [
                    `找到与该地历史相关的物品`,
                    `拍摄特征符号`,
                    `找到纪念牌匾`
                ],
                info: [
                    wikiInfo || `这个地方是当地遗产的一部分，值得一游！`,
                    `该地区的历史景点`,
                    `发现这个标志性地方`
                ]
            },
            ja: {
                enigma: [
                    `この場所の歴史は何ですか？`,
                    `この記念碑は何年に建てられましたか？`,
                    `誰がこの場所を設立しましたか？`
                ],
                photo: [
                    `正面玄関の写真を撮ってください`,
                    `この場所のユニークな特徴を撮影してください`,
                    `記念碑の前でチーム自撮り`
                ],
                validation: [
                    `建築要素を数えて検証してください`,
                    `刻まれた日付を見つけて検証してください`,
                    `詳細を観察して管理者に説明してください`
                ],
                object: [
                    `場所の歴史に関連する物を見つけてください`,
                    `特徴的なシンボルを撮影してください`,
                    `記念プレートを見つけてください`
                ],
                info: [
                    wikiInfo || `この場所は地元の遺産の一部であり、訪れる価値があります！`,
                    `地域の歴史的な名所`,
                    `この象徴的な場所を発見してください`
                ]
            },
            ko: {
                enigma: [
                    `이 장소의 역사는 무엇입니까?`,
                    `이 기념물은 몇 년에 건설되었습니까?`,
                    `누가 이곳을 세웠습니까?`
                ],
                photo: [
                    `정문 사진을 찍으세요`,
                    `이곳의 독특한 특징을 촬영하세요`,
                    `기념물 앞에서 팀 셀카`
                ],
                validation: [
                    `건축 요소를 세고 확인하세요`,
                    `새겨진 날짜를 찾아 확인하세요`,
                    `세부 사항을 관찰하고 관리자에게 설명하세요`
                ],
                object: [
                    `장소의 역사와 관련된 물건을 찾으세요`,
                    `특징적인 상징을 촬영하세요`,
                    `기념 명판을 찾으세요`
                ],
                info: [
                    wikiInfo || `이곳은 지역 유산의 일부이며 방문할 가치가 있습니다!`,
                    `지역의 역사적 명소`,
                    `이 상징적인 장소를 발견하세요`
                ]
            },
            ar: {
                enigma: [
                    `ما هو تاريخ هذا المكان؟`,
                    `في أي سنة تم بناء هذا النصب؟`,
                    `من أسس هذا المكان؟`
                ],
                photo: [
                    `التقط صورة للمدخل الرئيسي`,
                    `صور ميزة فريدة لهذا المكان`,
                    `سيلفي جماعي أمام النصب`
                ],
                validation: [
                    `عد العناصر المعمارية واطلب التحقق`,
                    `ابحث عن تاريخ منقوش واطلب التحقق منه`,
                    `لاحظ وصف تفصيل للمسؤول`
                ],
                object: [
                    `ابحث عن شيء متعلق بتاريخ المكان`,
                    `صور رمز مميز`,
                    `ابحث عن لوحة تذكارية`
                ],
                info: [
                    wikiInfo || `هذا المكان جزء من التراث المحلي ويستحق الزيارة!`,
                    `نقطة اهتمام تاريخية في المنطقة`,
                    `اكتشف هذا المكان الأيقوني`
                ]
            },
            pt: {
                enigma: [
                    `Qual é a história deste lugar?`,
                    `Em que ano foi construído este monumento?`,
                    `Quem fundou este lugar?`
                ],
                photo: [
                    `Tire uma foto da entrada principal`,
                    `Fotografe uma característica única deste lugar`,
                    `Selfie de equipe em frente ao monumento`
                ],
                validation: [
                    `Conte os elementos arquitetônicos e faça validar`,
                    `Encontre uma data gravada e faça validar`,
                    `Observe e descreva um detalhe ao administrador`
                ],
                object: [
                    `Encontre um objeto relacionado à história do lugar`,
                    `Fotografe um símbolo característico`,
                    `Encontre uma placa comemorativa`
                ],
                info: [
                    wikiInfo || `Este lugar faz parte do patrimônio local e merece uma visita!`,
                    `Ponto de interesse histórico da região`,
                    `Descubra este lugar emblemático`
                ]
            },
            ru: {
                enigma: [
                    `Какова история этого места?`,
                    `В каком году был построен этот памятник?`,
                    `Кто основал это место?`
                ],
                photo: [
                    `Сделайте фото главного входа`,
                    `Сфотографируйте уникальную особенность этого места`,
                    `Командное селфи перед памятником`
                ],
                validation: [
                    `Посчитайте архитектурные элементы и подтвердите`,
                    `Найдите выгравированную дату и подтвердите`,
                    `Наблюдайте и опишите деталь администратору`
                ],
                object: [
                    `Найдите объект, связанный с историей места`,
                    `Сфотографируйте характерный символ`,
                    `Найдите мемориальную доску`
                ],
                info: [
                    wikiInfo || `Это место является частью местного наследия и заслуживает посещения!`,
                    `Историческая достопримечательность региона`,
                    `Откройте для себя это знаковое место`
                ]
            },
            nl: {
                enigma: [
                    `Wat is de geschiedenis van deze plaats?`,
                    `In welk jaar werd dit monument gebouwd?`,
                    `Wie heeft deze plaats gesticht?`
                ],
                photo: [
                    `Neem een foto van de hoofdingang`,
                    `Fotografeer een uniek kenmerk van deze plaats`,
                    `Team selfie voor het monument`
                ],
                validation: [
                    `Tel de architectonische elementen en laat valideren`,
                    `Vind een gegraveerde datum en laat valideren`,
                    `Observeer en beschrijf een detail aan de beheerder`
                ],
                object: [
                    `Vind een object gerelateerd aan de geschiedenis van de plaats`,
                    `Fotografeer een kenmerkend symbool`,
                    `Vind een gedenkplaat`
                ],
                info: [
                    wikiInfo || `Deze plaats maakt deel uit van het lokale erfgoed en is een bezoek waard!`,
                    `Historisch interessepunt in de regio`,
                    `Ontdek deze iconische plaats`
                ]
            }
        };
        
        const challenges = challengeTemplates[language] || challengeTemplates['en'];
        const challengeList = challenges[randomType];
        const challenge = challengeList[Math.floor(Math.random() * challengeList.length)];
        
        return { type: randomType, challenge };
    }
    
    // Icône personnalisée pour les énigmes
    const enigmaIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: linear-gradient(135deg, #FF6B35 0%, #F7B801 100%); width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border: 3px solid white; font-size: 18px;">🎯</div>',
        iconSize: [35, 35],
        iconAnchor: [17, 17]
    });

    // Créer les marqueurs à partir des POI avec langue détectée
    async function createMarkersFromPOI(pois, mapInstance, language = 'en', useWikipedia = false) {
        // Utiliser les traductions de la langue détectée
        const challengeTypeConfig = translations[language] || translations['en'];
        
        // Filtrer les POI pour garder uniquement ceux avec des noms valides
        const filteredPois = pois.filter(poi => {
            const name = poi.tags?.name;
            if (!name) return false;
            
            // Exclure les noms trop courts ou génériques
            if (name.length < 3) return false;
            if (name.toLowerCase().includes('unnamed')) return false;
            
            // Exclure restos/bars (pas besoin d'exclure hôtels, déjà fait dans la query)
            const amenity = poi.tags?.amenity;
            if (amenity === 'restaurant' || amenity === 'cafe' || amenity === 'bar') {
                return false;
            }
            
            return true;
        });
        
        console.log(`🎯 ${filteredPois.length} POI valides sur ${pois.length} trouvés`);
        
        for (const poi of filteredPois) {
            const lat = poi.lat || poi.center?.lat;
            const lng = poi.lon || poi.center?.lon;
            
            if (!lat || !lng) continue;
            
            const name = poi.tags?.name;
            
                // Récupérer info Wikipedia seulement si demandé (pour aller plus vite)
                let wikiInfo = null;
                if (useWikipedia) {
                    wikiInfo = await fetchWikipediaInfo(name, lat, lng);
                }
                
                // Générer un challenge dans la bonne langue
                const { type, challenge } = generateChallenge(poi, wikiInfo, language);
                const config = challengeTypeConfig[type];
            
            // Créer le marqueur
            const marker = L.marker([lat, lng], { 
                icon: enigmaIcon
            }).addTo(mapInstance);
            
            // Créer la popup
            const popupContent = `
                <div class="popup-clean">
                    <div class="popup-type ${type}">
                        <span class="popup-icon">${config.icon}</span>
                        <span class="popup-label">${config.label}</span>
                    </div>
                    <div class="popup-location">${name}</div>
                    <div class="popup-challenge">${challenge}</div>
                    <div class="popup-explanation">${config.explanation}</div>
                </div>
            `;
            
            marker.bindPopup(popupContent, {
                className: 'custom-popup',
                closeButton: true,
                maxWidth: 280
            });
        }
    }
    
    // Fonction principale pour charger la carte avec géolocalisation et CACHE
    async function loadDynamicMap(forceRefresh = false) {
        showLoader();
        
        // Essayer la géolocalisation
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    console.log(`📍 Position détectée: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                    
                    // Vérifier le cache
                    const cached = loadFromCache();
                    
                    if (!forceRefresh && cached && !hasPositionChanged(cached.lat, cached.lng, lat, lng)) {
                        console.log('✨ Utilisation du cache (position similaire)');
                        
                        // Détecter la langue du pays
                        const language = await detectCountryAndLanguage(lat, lng);
                        
                        // Initialiser la carte avec données cachées
                        const mapInstance = initMap(cached.lat, cached.lng);
                        
                        // Ajouter marqueur utilisateur
                        L.marker([lat, lng], {
                            icon: L.divIcon({
                                className: 'user-marker',
                                html: '<div style="background: #4CAF50; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>',
                                iconSize: [20, 20],
                                iconAnchor: [10, 10]
                            })
                        }).addTo(mapInstance).bindPopup(`
                            <div class="popup-user-location">
                                <div class="user-location-icon">📍</div>
                                <div class="user-location-title">Vous êtes ici !</div>
                                <div class="user-location-subtitle">Position actuelle</div>
                            </div>
                        `, {
                            className: 'custom-popup user-popup',
                            closeButton: true
                        });
                        
                        // Utiliser POI cachés avec langue
                        await createMarkersFromPOI(cached.pois.slice(0, 15), mapInstance, language, false);
                        console.log('✅ Carte chargée depuis le cache');
                        hideLoader();
                        return;
                    }
                    
                    // Position a changé ou pas de cache → Charger les POI
                    console.log('🔄 Chargement des nouveaux POI...');
                    
                    // Détecter la langue du pays
                    const language = await detectCountryAndLanguage(lat, lng);
                    
                    // Initialiser la carte
                    const mapInstance = initMap(lat, lng);
                    
                    // Ajouter un marqueur pour la position de l'utilisateur
                    L.marker([lat, lng], {
                        icon: L.divIcon({
                            className: 'user-marker',
                            html: '<div style="background: #4CAF50; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>',
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]
                        })
                    }).addTo(mapInstance).bindPopup(`
                        <div class="popup-user-location">
                            <div class="user-location-icon">📍</div>
                            <div class="user-location-title">Vous êtes ici !</div>
                            <div class="user-location-subtitle">Position actuelle</div>
                        </div>
                    `, {
                        className: 'custom-popup user-popup',
                        closeButton: true
                    });
                    
                // Récupérer les POI (avec timeout de 18 secondes max)
                const poisPromise = fetchPointsOfInterest(lat, lng);
                const timeoutPromise = new Promise((resolve) => 
                    setTimeout(() => resolve([]), 18000)
                );
                    
                    const pois = await Promise.race([poisPromise, timeoutPromise]);
                    
                    if (pois.length > 0) {
                        console.log('🎯 Création des marqueurs...');
                        // Sauvegarder dans le cache
                        saveToCache(lat, lng, pois);
                        
                        // Ne pas appeler Wikipedia pour aller plus vite, mais utiliser la langue détectée
                        await createMarkersFromPOI(pois.slice(0, 15), mapInstance, language, false);
                        console.log('✅ Carte personnalisée chargée !');
                    } else {
                        console.log('⚠️ Aucun POI trouvé, fallback sur Paris');
                        loadFallbackPOI(mapInstance, language);
                    }
                    
                    hideLoader();
                },
                (error) => {
                    // Vérifier si l'utilisateur a explicitement refusé la géolocalisation
                    console.log(`❌ Erreur de géolocalisation détectée - Code: ${error.code}, Message: ${error.message}`);
                    
                    if (error.code === 1) { // PERMISSION_DENIED
                        console.log('⚠️ Géolocalisation refusée par l\'utilisateur → Fallback sur la ville correspondant à votre langue');
                        loadFallbackMap(); // Utilise la langue du navigateur
                    } else if (error.code === 2) { // POSITION_UNAVAILABLE
                        console.log('⚠️ Position indisponible → Fallback sur Paris');
                        loadFallbackMapParis(); // Fallback classique Paris
                    } else if (error.code === 3) { // TIMEOUT
                        console.log('⚠️ Timeout géolocalisation → Fallback sur Paris');
                        loadFallbackMapParis(); // Fallback classique Paris
                    } else {
                        console.log('⚠️ Erreur géolocalisation inconnue → Fallback sur Paris');
                        loadFallbackMapParis(); // Fallback classique Paris
                    }
                },
                {
                    enableHighAccuracy: false,
                    timeout: 3000, // 10 secondes max pour obtenir une réponse
                    maximumAge: 300000 // Accepter une position vieille de 5 min
                }
            );
        } else {
            console.log('⚠️ Géolocalisation non supportée → Fallback sur Paris');
            loadFallbackMapParis(); // Fallback classique Paris si pas de support
        }
    }
    
    // Preset de localisation par langue du navigateur
    function getDefaultLocationByLanguage() {
        const browserLang = navigator.language || navigator.userLanguage || 'en';
        const langCode = browserLang.toLowerCase().split('-')[0]; // Extraire le code langue (fr, en, ja, etc.)
        
        // Mapping langue → ville avec coordonnées
        const locationPresets = {
            'fr': { coords: [48.8566, 2.3522], city: 'Paris', country: 'France' },
            'en': { coords: [51.5074, -0.1278], city: 'London', country: 'UK' },
            'es': { coords: [40.4168, -3.7038], city: 'Madrid', country: 'Spain' },
            'de': { coords: [52.5200, 13.4050], city: 'Berlin', country: 'Germany' },
            'it': { coords: [41.9028, 12.4964], city: 'Rome', country: 'Italy' },
            'pt': { coords: [38.7223, -9.1393], city: 'Lisbon', country: 'Portugal' },
            'ja': { coords: [35.6762, 139.6503], city: 'Tokyo', country: 'Japan' },
            'zh': { coords: [39.9042, 116.4074], city: 'Beijing', country: 'China' },
            'ko': { coords: [37.5665, 126.9780], city: 'Seoul', country: 'South Korea' },
            'ar': { coords: [25.2048, 55.2708], city: 'Dubai', country: 'UAE' },
            'nl': { coords: [52.3676, 4.9041], city: 'Amsterdam', country: 'Netherlands' },
            'pl': { coords: [52.2297, 21.0122], city: 'Warsaw', country: 'Poland' },
            'ru': { coords: [55.7558, 37.6173], city: 'Moscow', country: 'Russia' },
            'sv': { coords: [59.3293, 18.0686], city: 'Stockholm', country: 'Sweden' },
            'tr': { coords: [41.0082, 28.9784], city: 'Istanbul', country: 'Turkey' },
            'el': { coords: [37.9838, 23.7275], city: 'Athens', country: 'Greece' },
            'cs': { coords: [50.0755, 14.4378], city: 'Prague', country: 'Czech Republic' },
            'da': { coords: [55.6761, 12.5683], city: 'Copenhagen', country: 'Denmark' },
            'no': { coords: [59.9139, 10.7522], city: 'Oslo', country: 'Norway' },
            'fi': { coords: [60.1699, 24.9384], city: 'Helsinki', country: 'Finland' },
            'hu': { coords: [47.4979, 19.0402], city: 'Budapest', country: 'Hungary' },
            'ro': { coords: [44.4268, 26.1025], city: 'Bucharest', country: 'Romania' },
            'bg': { coords: [42.6977, 23.3219], city: 'Sofia', country: 'Bulgaria' },
            'uk': { coords: [50.4501, 30.5234], city: 'Kiev', country: 'Ukraine' },
            'th': { coords: [13.7563, 100.5018], city: 'Bangkok', country: 'Thailand' },
            'vi': { coords: [21.0285, 105.8542], city: 'Hanoi', country: 'Vietnam' },
            'id': { coords: [-6.2088, 106.8456], city: 'Jakarta', country: 'Indonesia' },
            'hi': { coords: [28.6139, 77.2090], city: 'New Delhi', country: 'India' },
            'he': { coords: [32.0853, 34.7818], city: 'Tel Aviv', country: 'Israel' }
        };
        
        // Gestion spécifique pour les variantes régionales d'anglais
        if (browserLang.toLowerCase().startsWith('en-us')) {
            return { coords: [40.7128, -74.0060], city: 'New York', country: 'USA', lang: 'en' };
        } else if (browserLang.toLowerCase().startsWith('en-ca')) {
            return { coords: [43.6532, -79.3832], city: 'Toronto', country: 'Canada', lang: 'en' };
        } else if (browserLang.toLowerCase().startsWith('en-au')) {
            return { coords: [-33.8688, 151.2093], city: 'Sydney', country: 'Australia', lang: 'en' };
        }
        
        // Rechercher la langue correspondante ou fallback sur Londres (anglais)
        const preset = locationPresets[langCode] || locationPresets['en'];
        return { ...preset, lang: langCode in locationPresets ? langCode : 'en' };
    }
    
    // Fallback : Carte avec localisation par défaut basée sur la langue du navigateur (uniquement si refus explicite)
    async function loadFallbackMap() {
        try {
            const defaultLocation = getDefaultLocationByLanguage();
            console.log(`🌍 Langue détectée: ${navigator.language} → Localisation par défaut: ${defaultLocation.city}, ${defaultLocation.country}`);
            
            const [lat, lng] = defaultLocation.coords;
            const mapInstance = initMap(lat, lng);
            
            // Ajouter un marqueur pour indiquer que c'est une position par défaut
            L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'default-location-marker',
                    html: '<div style="background: #FF9800; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                })
            }).addTo(mapInstance).bindPopup(`
                <div class="popup-user-location">
                    <div class="user-location-icon">📍</div>
                    <div class="user-location-title">${defaultLocation.city}</div>
                    <div class="user-location-subtitle">Position par défaut</div>
                </div>
            `, {
                className: 'custom-popup user-popup',
                closeButton: true
            });
            
            loadFallbackPOI(mapInstance, defaultLocation.lang);
            hideLoader();
        } catch (error) {
            console.error('Erreur dans loadFallbackMap:', error);
            // Si erreur, fallback sur Paris
            loadFallbackMapParis();
        }
    }
    
    // Fallback classique : Carte de Paris (pour erreurs techniques ou géolocalisation non supportée)
    function loadFallbackMapParis() {
        try {
            console.log('🗼 Fallback classique sur Paris');
            const mapInstance = initMap(48.8566, 2.3522);
            
            // Marqueur classique pour Paris
            L.marker([48.8566, 2.3522], {
                icon: L.divIcon({
                    className: 'default-location-marker',
                    html: '<div style="background: #FF9800; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                })
            }).addTo(mapInstance).bindPopup(`
                <div class="popup-user-location">
                    <div class="user-location-icon">📍</div>
                    <div class="user-location-title">Paris</div>
                    <div class="user-location-subtitle">Position par défaut</div>
                </div>
            `, {
                className: 'custom-popup user-popup',
                closeButton: true
            });
            
            loadFallbackPOI(mapInstance, 'fr');
            hideLoader();
        } catch (error) {
            console.error('Erreur critique dans loadFallbackMapParis:', error);
            hideLoader();
        }
    }
    
    // POI statiques de Paris (fallback)
    function loadFallbackPOI(mapInstance, language = 'fr') {
        try {
            // Utiliser les traductions de la langue détectée
            const fallbackTypeConfig = translations[language] || translations['fr'];
            console.log(`📍 Chargement des POI statiques en langue: ${language}`);
            
            const checkpoints = [
        {
            coords: [48.8584, 2.2945], // Tour Eiffel
            name: "🗼 La Dame de Fer",
            type: "enigma",
            challenge: "Je mesure 330 mètres et illumine Paris depuis 1889. Combien d'étages me composent ?",
            answer: "3 étages"
        },
        {
            coords: [48.8606, 2.3376], // Louvre
            name: "🎨 Le Palais des Mystères",
            type: "photo",
            challenge: "Prenez une photo devant la pyramide de verre avec toute l'équipe formant la lettre 'L'"
        },
        {
            coords: [48.8530, 2.3499], // Notre-Dame
            name: "⛪ La Cathédrale",
            type: "info",
            challenge: "Victor Hugo a immortalisé cette cathédrale dans son roman. Elle a survécu à l'incendie de 2019 et sera restaurée."
        },
        {
            coords: [48.8738, 2.2950], // Arc de Triomphe
            name: "🏛️ L'Arc Monumental",
            type: "validation",
            challenge: "Comptez le nombre d'avenues qui partent de la place de l'Étoile. Faites valider votre réponse par l'admin."
        },
        {
            coords: [48.8867, 2.3431], // Sacré-Cœur
            name: "🕊️ La Basilique Blanche",
            type: "enigma",
            challenge: "Perchée sur la butte, je domine Paris du haut de mes... combien de marches ?",
            answer: "222 marches"
        },
        {
            coords: [48.8704, 2.3089], // Place de la Concorde
            name: "🎡 La Place Royale",
            type: "object",
            challenge: "Trouvez un objet en forme d'obélisque et montrez-le à la caméra"
        },
        {
            coords: [48.8566, 2.3522], // Hôtel de Ville
            name: "🏛️ Le Cœur de Paris",
            type: "photo",
            challenge: "Prenez un selfie d'équipe avec la façade en arrière-plan"
        },
        {
            coords: [48.8462, 2.3371], // Panthéon
            name: "🎓 Le Temple des Grands Hommes",
            type: "info",
            challenge: "Voltaire, Rousseau, Hugo, Curie... Les plus grands français reposent ici. Le Panthéon est aussi un pendule géant !"
        },
        {
            coords: [48.8607, 2.3376], // Palais Royal
            name: "👑 Le Jardin Secret",
            type: "enigma",
            challenge: "Les colonnes de Buren sont en noir et blanc. Combien y en a-t-il ?",
            answer: "260 colonnes"
        },
        {
            coords: [48.8630, 2.3282], // Opéra Garnier
            name: "🎭 Le Palais des Arts",
            type: "validation",
            challenge: "Mimez une scène d'opéra devant l'entrée et faites valider par l'admin"
        },
        {
            coords: [48.8756, 2.2945], // Parc Monceau
            name: "🌳 Le Jardin Anglais",
            type: "photo",
            challenge: "Photographiez le temple grec au bord de l'eau"
        },
        {
            coords: [48.8462, 2.3522], // Jardin des Plantes
            name: "🌺 Le Jardin Botanique",
            type: "object",
            challenge: "Trouvez une feuille d'arbre et identifiez son espèce"
        },
        {
            coords: [48.8411, 2.3215], // Luxembourg
            name: "🏰 Le Palais du Sénat",
            type: "info",
            challenge: "Le Sénat français siège ici. Les jardins du Luxembourg sont les préférés des Parisiens pour pique-niquer !"
        },
        {
            coords: [48.8792, 2.3598], // Parc des Buttes-Chaumont
            name: "⛰️ Le Parc Suspendu",
            type: "enigma",
            challenge: "Un temple grec trône sur une île. De quelle déesse est-il inspiré ?",
            answer: "Diane / Vesta"
        },
        {
            coords: [48.8465, 2.3712], // Bastille
            name: "🗽 Place de la Révolution",
            type: "validation",
            challenge: "Reconstituez la prise de la Bastille en équipe et faites valider votre performance"
        },
        {
            coords: [48.8534, 2.3488], // Île de la Cité
            name: "🏝️ Le Berceau de Paris",
            type: "info",
            challenge: "C'est ici que Paris est né ! Lutèce, fondée par les Parisii il y a 2000 ans."
        },
        {
            coords: [48.8629, 2.3292], // Tuileries
            name: "🌷 Le Jardin Royal",
            type: "photo",
            challenge: "Photographiez la perspective parfaite entre le Louvre et les Champs-Élysées"
        },
        {
            coords: [48.8698, 2.3072], // Grand Palais
            name: "🏛️ Le Palais de Verre",
            type: "enigma",
            challenge: "Ma verrière pèse combien de tonnes d'acier et de verre ?",
            answer: "8500 tonnes"
        },
        {
            coords: [48.8606, 2.3486], // Centre Pompidou
            name: "🎨 L'Usine à Art",
            type: "object",
            challenge: "Trouvez un objet d'art moderne dans les environs et photographiez-le"
        },
        {
            coords: [48.8584, 2.3638], // Place des Vosges
            name: "🏛️ La Plus Ancienne Place",
            type: "validation",
            challenge: "Comptez le nombre de pavillons autour de la place et faites valider par l'admin"
        }
        ];

        checkpoints.forEach((checkpoint) => {
            const marker = L.marker(checkpoint.coords, { 
                icon: enigmaIcon
            }).addTo(mapInstance);

            const config = fallbackTypeConfig[checkpoint.type];

            const popupContent = `
                <div class="popup-clean">
                    <div class="popup-type ${checkpoint.type}">
                        <span class="popup-icon">${config.icon}</span>
                        <span class="popup-label">${config.label}</span>
                    </div>
                    <div class="popup-location">${checkpoint.name}</div>
                    <div class="popup-challenge">${checkpoint.challenge}</div>
                    <div class="popup-explanation">${config.explanation}</div>
                </div>
            `;

            marker.bindPopup(popupContent, {
                className: 'custom-popup',
                closeButton: true,
                maxWidth: 280
            });
        });
        
        console.log(`✅ ${checkpoints.length} POI statiques chargés avec succès`);
        } catch (error) {
            console.error('Erreur lors du chargement des POI statiques:', error);
        }
    }
    
    // Lancer le chargement de la carte dynamique
    loadDynamicMap();
    
    // Bouton pour forcer le refresh (optionnel)
    window.refreshMap = () => {
        console.log('🔄 Refresh forcé...');
        localStorage.removeItem(CACHE_KEY);
        loadDynamicMap(true);
    };
});

