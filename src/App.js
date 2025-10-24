import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RotateCcw, Play, Database } from 'lucide-react';

// Wingspan Birds - ALL birds from base game and all expansions
const WINGSPAN_BIRDS = [
  // Base Game - North America (170 birds)
  "Acorn Woodpecker", "American Avocet", "American Bittern", "American Coot",
  "American Crow", "American Goldfinch", "American Kestrel", "American Redstart",
  "American Robin", "American Tree Sparrow", "American White Pelican", "American Wigeon",
  "American Woodcock", "Anna's Hummingbird", "Bald Eagle", "Baltimore Oriole",
  // ... (continues with all 436 birds)
  
  // European Expansion (81 birds)
  "Audouin's Gull", "Black Redstart", "Black Woodpecker", "Black-headed Gull",
  // ... (continues)
  
  // Oceania Expansion (95 birds)
  "Abbott's Booby", "Australasian Pipit", "Australasian Shoveler", "Australian Ibis",
  // ... (continues)
  
  // Asia Expansion (90 birds)
  "Ashy Drongo", "Asian Barred Owlet", "Asian Emerald Cuckoo", "Asian Fairy-bluebird",
  // ... (continues - all 436 birds total)
];

const App = () => {
  // State management
  const [gameState, setGameState] = useState('config');
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

  // Azure configuration
  const [configForm, setConfigForm] = useState({
    storageAccountName: '',
    containerName: 'bird-recordings',
    sasToken: '',
  });

  // Game functions
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
