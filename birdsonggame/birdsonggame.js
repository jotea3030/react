import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RotateCcw, Play, Database } from 'lucide-react';

// Wingspan Birds - ALL birds from base game and all expansions
const WINGSPAN_BIRDS = [
  // Base Game - North America (170 birds)
  "Acorn Woodpecker", "American Avocet", "American Bittern", "American Coot",
  "American Crow", "American Goldfinch", "American Kestrel", "American Redstart",
  "American Robin", "American Tree Sparrow", "American White Pelican", "American Wigeon",
  "American Woodcock", "Anna's Hummingbird", "Bald Eagle", "Baltimore Oriole",
  "Band-tailed Pigeon", "Barn Owl", "Barn Swallow", "Barred Owl",
  "Belted Kingfisher", "Bewick's Wren", "Black Skimmer", "Black Vulture",
  "Black-bellied Plover", "Black-billed Magpie", "Black-capped Chickadee", "Black-chinned Hummingbird",
  "Blue Grosbeak", "Blue Jay", "Blue-gray Gnatcatcher", "Boat-tailed Grackle",
  "Brewer's Blackbird", "Broad-winged Hawk", "Brown Creeper", "Brown Pelican",
  "Brown-headed Cowbird", "Bushtit", "Cackling Goose", "California Condor",
  "California Gull", "Canada Goose", "Canvasback", "Carolina Wren",
  "Chestnut-backed Chickadee", "Chihuahuan Raven", "Chimney Swift", "Chipping Sparrow",
  "Clark's Grebe", "Common Grackle", "Common Loon", "Common Merganser",
  "Common Nighthawk", "Common Raven", "Common Yellowthroat", "Cooper's Hawk",
  "Dark-eyed Junco", "Dickcissel", "Double-crested Cormorant", "Downy Woodpecker",
  "Dunlin", "Eastern Bluebird", "Eastern Kingbird", "Eastern Meadowlark",
  "Eastern Phoebe", "Eastern Screech-Owl", "Eastern Towhee", "Eastern Wood-Pewee",
  "Evening Grosbeak", "Ferruginous Hawk", "Fish Crow", "Forster's Tern",
  "Fox Sparrow", "Franklin's Gull", "Gadwall", "Golden Eagle",
  "Golden-crowned Kinglet", "Gray Catbird", "Great Black-backed Gull", "Great Blue Heron",
  "Great Crested Flycatcher", "Great Egret", "Great Gray Owl", "Great Horned Owl",
  "Greater Prairie-Chicken", "Greater Roadrunner", "Greater Scaup", "Greater White-fronted Goose",
  "Greater Yellowlegs", "Green Heron", "Green-winged Teal", "Hairy Woodpecker",
  "Hermit Thrush", "Hooded Merganser", "Horned Grebe", "Horned Lark",
  "House Finch", "House Sparrow", "House Wren", "Indigo Bunting",
  "Killdeer", "Least Flycatcher", "Least Sandpiper", "Lesser Scaup",
  "Lesser Yellowlegs", "Lincoln's Sparrow", "Loggerhead Shrike", "Long-billed Curlew",
  "Long-billed Dowitcher", "Mallard", "Marbled Godwit", "Marsh Wren",
  "Mountain Bluebird", "Mourning Dove", "Mute Swan", "Northern Bobwhite",
  "Northern Cardinal", "Northern Flicker", "Northern Gannet", "Northern Harrier",
  "Northern Mockingbird", "Northern Pintail", "Northern Shoveler", "Osprey",
  "Painted Bunting", "Painted Whitestart", "Peregrine Falcon", "Pied-billed Grebe",
  "Pileated Woodpecker", "Prairie Falcon", "Purple Martin", "Pyrrhuloxia",
  "Red Crossbill", "Red Knot", "Red-bellied Woodpecker", "Red-breasted Merganser",
  "Red-breasted Nuthatch", "Red-headed Woodpecker", "Red-shouldered Hawk", "Red-tailed Hawk",
  "Red-winged Blackbird", "Ring-billed Gull", "Ring-necked Duck", "Ring-necked Pheasant",
  "Rock Pigeon", "Roseate Spoonbill", "Rose-breasted Grosbeak", "Royal Tern",
  "Ruby-crowned Kinglet", "Ruby-throated Hummingbird", "Ruddy Duck", "Ruddy Turnstone",
  "Ruffed Grouse", "Rufous Hummingbird", "Sanderling", "Sandhill Crane",
  "Savannah Sparrow", "Scaled Quail", "Scissor-tailed Flycatcher", "Sharp-shinned Hawk",
  "Short-eared Owl", "Snow Goose", "Snowy Egret", "Song Sparrow",
  "Spotted Sandpiper", "Spotted Towhee", "Steller's Jay", "Swainson's Hawk",
  "Tree Swallow", "Trumpeter Swan", "Tufted Titmouse", "Turkey Vulture",
  "Veery", "Vesper Sparrow", "Virginia Rail", "Western Grebe",
  "Western Gull", "Western Meadowlark", "Western Sandpiper", "Western Tanager",
  "White-breasted Nuthatch", "White-crowned Sparrow", "White-throated Sparrow", "Wild Turkey",
  "Willet", "Wilson's Snipe", "Wood Duck", "Wood Thrush",
  "Yellow Warbler", "Yellow-bellied Sapsucker", "Yellow-breasted Chat", "Yellow-rumped Warbler",
  
  // European Expansion (81 birds)
  "Audouin's Gull", "Black Redstart", "Black Woodpecker", "Black-headed Gull",
  "Black-tailed Godwit", "Black-throated Diver", "Bluethroat", "Bonelli's Eagle",
  "Bullfinch", "Carrion Crow", "Cetti's Warbler", "Coal Tit",
  "Common Blackbird", "Common Buzzard", "Common Chaffinch", "Common Chiffchaff",
  "Common Cuckoo", "Common Goldeneye", "Common Kingfisher", "Common Little Bittern",
  "Common Moorhen", "Common Nightingale", "Common Starling", "Common Swift",
  "Corsican Nuthatch", "Dunnock", "Eastern Imperial Eagle", "Eleonora's Falcon",
  "Eurasian Collared-Dove", "Eurasian Golden Oriole", "Eurasian Green Woodpecker", "Eurasian Hobby",
  "Eurasian Jay", "Eurasian Magpie", "Eurasian Nutcracker", "Eurasian Nuthatch",
  "Eurasian Sparrowhawk", "Eurasian Tree Sparrow", "European Bee-Eater", "European Goldfinch",
  "European Honey Buzzard", "European Robin", "European Roller", "European Turtle Dove",
  "Goldcrest", "Great Crested Grebe", "Great Tit", "Greater Flamingo",
  "Grey Heron", "Greylag Goose", "Griffon Vulture", "Hawfinch",
  "Hooded Crow", "House Sparrow", "Lesser Whitethroat", "Little Bustard",
  "Little Owl", "Long-tailed Tit", "Moltoni's Warbler", "Montagu's Harrier",
  "Mute Swan", "Northern Gannet", "Northern Goshawk", "Parrot Crossbill",
  "Red Kite", "Red Knot", "Red-backed Shrike", "Red-legged Partridge",
  "Ruff", "Savi's Warbler", "Short-toed Treecreeper", "Snow Bunting",
  "Snowy Owl", "Squacco Heron", "Thekla's Lark", "White Stork",
  "White Wagtail", "White-backed Woodpecker", "White-throated Dipper", "Wilson's Storm-Petrel",
  "Yellowhammer",
  
  // Oceania Expansion (95 birds)
  "Abbott's Booby", "Australasian Pipit", "Australasian Shoveler", "Australian Ibis",
  "Australian Magpie", "Australian Owlet-Nightjar", "Australian Raven", "Australian Reed Warbler",
  "Australian Shelduck", "Australian Zebra Finch", "Black Noddy", "Black Swan",
  "Black-shouldered Kite", "Blyth's Hornbill", "Brolga", "Brown Falcon",
  "Budgerigar", "Cockatiel", "Count Raggi's Bird-of-Paradise", "Crested Pigeon",
  "Crimson Chat", "Eastern Rosella", "Eastern Whipbird", "Emu",
  "Galah", "Golden-headed Cisticola", "Gould's Finch", "Green Pygmy-Goose",
  "Grey Butcherbird", "Grey Shrike-thrush", "Grey Teal", "Grey Warbler",
  "Grey-headed Mannikin", "Horsfield's Bronze-Cuckoo", "Horsfield's Bushlark", "Kakapo",
  "Kea", "Kelp Gull", "Kereru", "Korimako",
  "Laughing Kookaburra", "Lesser Frigatebird", "Lewin's Honeyeater", "Little Penguin",
  "Little Pied Cormorant", "Magpie-lark", "Major Mitchell's Cockatoo", "Malleefowl",
  "Maned Duck", "Many-colored Fruit-Dove", "Masked Lapwing", "Mistletoebird",
  "Musk Duck", "New Holland Honeyeater", "Noisy Miner", "North Island Brown Kiwi",
  "Orange-footed Scrubfowl", "Pacific Black Duck", "Peaceful Dove", "Pesquet's Parrot",
  "Pheasant Coucal", "Pink-eared Duck", "Plains-wanderer", "Princess Stephanie's Astrapia",
  "Pukeko", "Rainbow Lorikeet", "Red Wattlebird", "Red-backed Fairywren",
  "Red-capped Robin", "Red-necked Avocet", "Red-winged Parrot", "Regent Bowerbird",
  "Royal Spoonbill", "Rufous Banded Honeyeater", "Rufous Night Heron", "Rufous Owl",
  "Sacred Kingfisher", "Silvereye", "South Island Robin", "Southern Cassowary",
  "Spangled Drongo", "Splendid Fairywren", "Spotless Crake", "Stubble Quail",
  "Sulphur-crested Cockatoo", "Superb Lyrebird", "Tawny Frogmouth", "Tui",
  "Wedge-tailed Eagle", "Welcome Swallow", "White-bellied Sea-Eagle", "White-breasted Woodswallow",
  "White-faced Heron", "Willie Wagtail", "Wrybill",
  
  // Asia Expansion (90 birds)
  "Ashy Drongo", "Asian Barred Owlet", "Asian Emerald Cuckoo", "Asian Fairy-bluebird",
  "Asian Koel", "Asian Openbill", "Baikal Teal", "Bar-headed Goose",
  "Black Drongo", "Black Kite", "Black-crowned Night Heron", "Black-naped Monarch",
  "Black-naped Oriole", "Blue Rock Thrush", "Blue Whistling Thrush", "Cattle Egret",
  "Chinese Bamboo Partridge", "Chinese Grosbeak", "Cinereous Vulture", "Common Hoopoe",
  "Common Iora", "Common Kingfisher", "Common Myna", "Common Tailorbird",
  "Coppersmith Barbet", "Crested Serpent Eagle", "Crested Wood Partridge", "Dollarbird",
  "Eurasian Curlew", "Eurasian Hoopoe", "Forest Owlet", "Great Hornbill",
  "Great Indian Bustard", "Greater Adjutant", "Greater Coucal", "Greater Painted-Snipe",
  "Green Imperial Pigeon", "Hill Myna", "House Crow", "Indian Cormorant",
  "Indian Grey Hornbill", "Indian Peafowl", "Indian Pitta", "Indian Pond Heron",
  "Indian Roller", "Indian Vulture", "Japanese Bush Warbler", "Japanese Tit",
  "Jungle Crow", "Kalij Pheasant", "Large-billed Crow", "Long-tailed Minivet",
  "Long-tailed Shrike", "Mandarin Duck", "Narcissus Flycatcher", "Nutmeg Mannikin",
  "Oriental Magpie-Robin", "Oriental White-eye", "Pied Bushchat", "Pied Myna",
  "Pin-tailed Snipe", "Plain Prinia", "Puff-throated Babbler", "Purple Heron",
  "Purple Sunbird", "Red Junglefowl", "Red-billed Blue Magpie", "Red-vented Bulbul",
  "Red-wattled Lapwing", "Red-whiskered Bulbul", "Rock Pigeon", "Rook",
  "Rose-ringed Parakeet", "Rufous Treepie", "Scaly-breasted Munia", "Siberian Crane",
  "Spot-billed Duck", "Spotted Dove", "Striated Heron", "Tufted Duck",
  "Violet Cuckoo", "White Wagtail", "White-breasted Kingfisher", "White-rumped Shama",
  "White-throated Kingfisher", "Yellow-billed Babbler", "Yellow-browed Bunting", "Yellow-footed Green Pigeon",
];

// Azure Storage Configuration
const AZURE_CONFIG = {
  // Replace these with your actual Azure Storage credentials
  storageAccountName: 'YOUR_STORAGE_ACCOUNT_NAME',
  containerName: 'bird-recordings',
  sasToken: 'YOUR_SAS_TOKEN', // Generate a SAS token with read/write permissions
};

// Build Azure Blob Storage URL
const getAzureBlobUrl = (birdName, recordingId) => {
  const blobName = `${birdName.replace(/[^a-zA-Z0-9]/g, '_')}_${recordingId}.mp3`;
  return `https://${AZURE_CONFIG.storageAccountName}.blob.core.windows.net/${AZURE_CONFIG.containerName}/${blobName}`;
};

const App = () => {
  const [gameState, setGameState] = useState('config'); // config, welcome, loading, playing, answered
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentBird, setCurrentBird] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [recording, setRecording] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0 });
  const [useCache, setUseCache] = useState(true);
  const [azureConfigured, setAzureConfigured] = useState(false);
  const audioRef = useRef(null);

  // Configuration form state
  const [configForm, setConfigForm] = useState({
    storageAccountName: '',
    containerName: 'bird-recordings',
    sasToken: '',
  });

  const generateOptions = (correctBird) => {
    const opts = [correctBird];
    const shuffled = [...WINGSPAN_BIRDS].sort(() => Math.random() - 0.5);
    
    for (const bird of shuffled) {
      if (opts.length >= 4) break;
      if (bird !== correctBird) {
        opts.push(bird);
      }
    }
    
    return opts.sort(() => Math.random() - 0.5);
  };

  const checkAzureCache = async (birdName, recordingId) => {
    if (!useCache || !azureConfigured) return null;
    
    try {
      const blobName = `${birdName.replace(/[^a-zA-Z0-9]/g, '_')}_${recordingId}.mp3`;
      const blobUrl = `https://${configForm.storageAccountName}.blob.core.windows.net/${configForm.containerName}/${blobName}?${configForm.sasToken}`;
      
      console.log('Checking cache for:', blobName);
      
      // Try to fetch the blob - if it exists, it will download
      const response = await fetch(blobUrl);
      
      if (response.ok) {
        console.log('✓ Cache HIT:', blobName);
        setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } else {
        console.log('✗ Cache MISS:', blobName, 'Status:', response.status);
      }
    } catch (err) {
      console.log('✗ Cache MISS (error):', err.message);
    }
    
    setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
    return null;
  };

  const uploadToAzureCache = async (birdName, recordingId, audioBlob) => {
    if (!useCache || !azureConfigured) return;
    
    try {
      const blobName = `${birdName.replace(/[^a-zA-Z0-9]/g, '_')}_${recordingId}.mp3`;
      const blobUrl = `https://${configForm.storageAccountName}.blob.core.windows.net/${configForm.containerName}/${blobName}?${configForm.sasToken}`;
      
      console.log('Uploading to cache:', blobName);
      
      const response = await fetch(blobUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': 'audio/mpeg',
        },
        body: audioBlob,
      });
      
      if (response.ok) {
        console.log('✓ Successfully cached:', blobName);
      } else {
        console.error('✗ Cache upload failed:', response.status, await response.text());
      }
    } catch (err) {
      console.error('✗ Cache upload error:', err);
    }
  };

  const fetchRecording = async (birdName) => {
    const qualities = ['A', 'B', ''];
    
    for (const quality of qualities) {
      let query = birdName;
      if (quality) query += ` q:${quality}`;
      
      const url = `https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(query)}`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        const validRecordings = data.recordings?.filter(rec => 
          rec.file && rec.file.startsWith('http')
        ) || [];
        
        if (validRecordings.length > 0) {
          return validRecordings[Math.floor(Math.random() * validRecordings.length)];
        }
      } catch (err) {
        console.error('Error fetching recording:', err);
      }
    }
    
    return null;
  };

  const downloadAndCacheAudio = async (recording, birdName) => {
    try {
      // Fetch audio from Xeno-canto
      const response = await fetch(recording.file);
      const audioBlob = await response.blob();
      
      // Upload to Azure cache in background
      if (azureConfigured && useCache) {
        uploadToAzureCache(birdName, recording.id, audioBlob);
      }
      
      // Return blob URL for immediate playback
      return URL.createObjectURL(audioBlob);
    } catch (err) {
      console.error('Error downloading audio:', err);
      throw err;
    }
  };

  const startNewRound = async () => {
    setGameState('loading');
    setError(null);
    setStatusMessage('');
    setSelectedAnswer(null);
    
    const bird = WINGSPAN_BIRDS[Math.floor(Math.random() * WINGSPAN_BIRDS.length)];
    setCurrentBird(bird);
    
    const opts = generateOptions(bird);
    setOptions(opts);
    
    setLoading(true);
    
    try {
      setStatusMessage('Searching for bird recording...');
      const rec = await fetchRecording(bird);
      
      if (!rec || !rec.file) {
        setError(`Could not find recording for ${bird}. Starting new round...`);
        setTimeout(() => startNewRound(), 2000);
        return;
      }
      
      setRecording(rec);
      console.log('Found recording:', rec.id, 'for', bird);
      
      // Check Azure cache first
      let audioUrlToUse = null;
      if (azureConfigured && useCache) {
        setStatusMessage('Checking Azure cache...');
        audioUrlToUse = await checkAzureCache(bird, rec.id);
      }
      
      // If not in cache, download and cache
      if (!audioUrlToUse) {
        setStatusMessage(azureConfigured ? 'Downloading and caching...' : 'Downloading...');
        audioUrlToUse = await downloadAndCacheAudio(rec, bird);
      } else {
        setStatusMessage('Loaded from cache!');
      }
      
      setAudioUrl(audioUrlToUse);
      setGameState('playing');
      setStatusMessage('');
      
      // Auto-play audio
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(err => console.error('Autoplay failed:', err));
        }
      }, 100);
      
    } catch (err) {
      setError('Error loading bird call. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index) => {
    if (gameState === 'answered') return;
    
    setSelectedAnswer(index);
    setGameState('answered');
    setTotalQuestions(prev => prev + 1);
    
    if (options[index] === currentBird) {
      setScore(prev => prev + 1);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const resetGame = () => {
    setScore(0);
    setTotalQuestions(0);
    setGameState('welcome');
    setCurrentBird(null);
    setOptions([]);
    setSelectedAnswer(null);
    setRecording(null);
    setAudioUrl(null);
  };

  const saveAzureConfig = () => {
    if (configForm.storageAccountName && configForm.containerName && configForm.sasToken) {
      setAzureConfigured(true);
      setGameState('welcome');
    } else {
      alert('Please fill in all Azure Storage configuration fields');
    }
  };

  const skipConfig = () => {
    setAzureConfigured(false);
    setUseCache(false);
    setGameState('welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">
            🦅 Wingspan Bird Quiz 🦅
          </h1>
          <p className="text-center text-gray-600">
            Featuring birds from all Wingspan expansions!
          </p>
          <div className="text-center mt-4 text-lg font-semibold text-blue-700">
            Score: {score}/{totalQuestions}
          </div>
          {azureConfigured && (
            <div className="flex items-center justify-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <Database className="w-4 h-4" />
                <span>Cache: {cacheStats.hits} hits / {cacheStats.misses} misses</span>
              </div>
            </div>
          )}
        </div>

        {/* Azure Configuration Screen */}
        {gameState === 'config' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Azure Storage Configuration
            </h2>
            <p className="text-gray-600 mb-6">
              Configure Azure Blob Storage to cache bird recordings for faster loading.
              This is optional but highly recommended!
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Account Name
                </label>
                <input
                  type="text"
                  value={configForm.storageAccountName}
                  onChange={(e) => setConfigForm({...configForm, storageAccountName: e.target.value})}
                  placeholder="mystorageaccount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Container Name
                </label>
                <input
                  type="text"
                  value={configForm.containerName}
                  onChange={(e) => setConfigForm({...configForm, containerName: e.target.value})}
                  placeholder="bird-recordings"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SAS Token
                </label>
                <input
                  type="password"
                  value={configForm.sasToken}
                  onChange={(e) => setConfigForm({...configForm, sasToken: e.target.value})}
                  placeholder="sv=2021-06-08&ss=b&srt=sco&sp=rwdlac..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Generate a SAS token with read/write permissions
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 font-semibold mb-2">Setup Instructions:</p>
              <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                <li>Create an Azure Storage Account (Free tier available)</li>
                <li>Create a container named "bird-recordings"</li>
                <li>Generate a SAS token with read/write/list permissions</li>
                <li>Enable CORS for your storage account (allow * origin)</li>
              </ol>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={saveAzureConfig}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Save & Continue
              </button>
              <button
                onClick={skipConfig}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Skip (No Cache)
              </button>
            </div>
          </div>
        )}

        {/* Welcome Screen */}
        {gameState === 'welcome' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Welcome to the Bird Song Quiz!
            </h2>
            <p className="text-gray-600 mb-6">
              Listen to bird calls and guess the species from 4 options.
              Test your knowledge of birds from around the world!
            </p>
            {azureConfigured && (
              <p className="text-green-600 mb-4 flex items-center justify-center gap-2">
                <Database className="w-5 h-5" />
                Azure cache enabled - recordings will load faster!
              </p>
            )}
            <button
              onClick={startNewRound}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Start Quiz
            </button>
            {gameState === 'welcome' && (
              <button
                onClick={() => setGameState('config')}
                className="mt-3 text-sm text-gray-600 hover:text-gray-800 underline block mx-auto"
              >
                Reconfigure Azure Storage
              </button>
            )}
          </div>
        )}

        {/* Loading Screen */}
        {gameState === 'loading' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold mb-2">
              {statusMessage || 'Loading...'}
            </p>
            <p className="text-sm text-gray-500">
              {loading ? (azureConfigured ? 'Cache-enabled mode' : 'Direct download mode') : ''}
            </p>
            {error && (
              <p className="text-red-600 mt-4">{error}</p>
            )}
          </div>
        )}

        {/* Playing/Answered Screen */}
        {(gameState === 'playing' || gameState === 'answered') && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Audio Player */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Volume2 className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Listen to the bird call
                </h3>
              </div>
              
              {audioUrl && (
                <>
                  <audio ref={audioRef} src={audioUrl} className="w-full mb-4" controls />
                  <button
                    onClick={playAudio}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition inline-flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Replay
                  </button>
                </>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Which bird species is this?
              </h3>
              {options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = option === currentBird;
                const showResult = gameState === 'answered';
                
                let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition font-medium ';
                
                if (!showResult) {
                  buttonClass += 'border-gray-300 hover:border-blue-500 hover:bg-blue-50';
                } else if (isCorrect) {
                  buttonClass += 'border-green-500 bg-green-50 text-green-900';
                } else if (isSelected && !isCorrect) {
                  buttonClass += 'border-red-500 bg-red-50 text-red-900';
                } else {
                  buttonClass += 'border-gray-300 opacity-50';
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={gameState === 'answered'}
                    className={buttonClass}
                  >
                    <span className="font-semibold mr-2">{index + 1}.</span>
                    {option}
                    {showResult && isCorrect && <span className="float-right">✅</span>}
                    {showResult && isSelected && !isCorrect && <span className="float-right">❌</span>}
                  </button>
                );
              })}
            </div>

            {/* Result Info */}
            {gameState === 'answered' && recording && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-700">
                <p className="font-semibold mb-2">
                  {selectedAnswer !== null && options[selectedAnswer] === currentBird
                    ? '✅ Correct! Well done!'
                    : `❌ Incorrect! The correct answer was: ${currentBird}`}
                </p>
                {recording.loc && recording.cnt && (
                  <p>📍 Recording location: {recording.loc}, {recording.cnt}</p>
                )}
                {recording.q && (
                  <p>⭐ Quality: {recording.q} {recording.length && `| Length: ${recording.length}`}</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {gameState === 'answered' && (
              <div className="flex gap-3">
                <button
                  onClick={startNewRound}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
                >
                  Next Round
                </button>
                <button
                  onClick={resetGame}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  End Quiz
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>Audio recordings from Xeno-canto.org</p>
          <p className="mt-1">Total birds: {WINGSPAN_BIRDS.length}</p>
          {azureConfigured && (
            <p className="mt-1 text-green-600">
              ✓ Azure cache active - faster loading times
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
