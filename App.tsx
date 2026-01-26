import React, { useState, useEffect } from 'react';
import { Download, Layers, Monitor, Smartphone, Image as ImageIcon, Loader2, FileJson, CheckCircle2, Box, Moon, Sun } from 'lucide-react';
import Dropzone from './components/Dropzone';
import { IOS_APP_ICON_SPECS, MACOS_APP_ICON_SPECS, IMAGE_SET_SPECS, ANDROID_ICON_SPECS } from './constants';
import { generateAssets, downloadZip } from './utils/imageProcessor';
import { ProcessedImage } from './types';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'ios' | 'macos' | 'imageset' | 'android'>('ios');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<ProcessedImage[]>([]);
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Effect to generate assets whenever file or tab changes
  useEffect(() => {
    if (!file) {
      setGeneratedAssets([]);
      return;
    }

    const generate = async () => {
      setIsGenerating(true);
      try {
        let specs;
        if (activeTab === 'ios') specs = IOS_APP_ICON_SPECS;
        else if (activeTab === 'macos') specs = MACOS_APP_ICON_SPECS;
        else if (activeTab === 'android') specs = ANDROID_ICON_SPECS;
        else specs = IMAGE_SET_SPECS;

        // Artificial delay for better UX feeling
        await new Promise(r => setTimeout(r, 500));
        
        const assets = await generateAssets(file, specs, activeTab);
        setGeneratedAssets(assets);
      } catch (err) {
        console.error("Error generating assets:", err);
      } finally {
        setIsGenerating(false);
      }
    };

    generate();
  }, [file, activeTab]);

  // Effect to toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleDownload = async () => {
    if (generatedAssets.length === 0) return;
    await downloadZip(generatedAssets, activeTab);
  };

  const renderAssetLabel = (text: string) => {
    // Check for text followed by parentheses, e.g. "Name (Detail)"
    // Matches "Title (Detail)" but not "Title"
    const match = text.match(/^(.*?)\s*(\(.*\))$/);
    
    if (match) {
      return (
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 w-full break-words" title={text}>
          {match[1]}
          <span className="block text-[10px] text-gray-500 dark:text-gray-500 font-normal mt-0.5">
            {match[2]}
          </span>
        </p>
      );
    }
    
    return (
      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 w-full break-words" title={text}>
        {text}
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black text-[#1D1D1F] dark:text-[#F5F5F7] p-4 sm:p-8 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* Theme Toggle Button */}
        <div className="absolute top-0 right-0 z-20">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white dark:bg-[#1C1C1E] shadow-sm border border-gray-200 dark:border-[#2C2C2E] hover:bg-gray-50 dark:hover:bg-[#2C2C2E] text-gray-700 dark:text-gray-200 transition-all"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Header */}
        <div className="lg:col-span-12 flex flex-col items-center mb-8 pt-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] rounded-2xl flex items-center justify-center shadow-lg mb-4">
             <Layers className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Asset Generator</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg text-center max-w-2xl">
            Generate production-ready assets for iOS, macOS, and Android. 
            Drag & drop your master file to get started.
          </p>
        </div>

        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-[#2C2C2E] transition-colors">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-400" /> Source Image
            </h2>
            <Dropzone 
              currentFile={file} 
              onFileAccepted={setFile} 
              onClear={() => setFile(null)} 
            />
          </section>

          <section className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-[#2C2C2E] transition-colors">
             <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-gray-400" /> Export Settings
            </h2>
            
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  activeTab === 'ios' 
                    ? 'border-[#007AFF] bg-[#007AFF]/5 dark:bg-[#007AFF]/10' 
                    : 'border-transparent bg-gray-50 dark:bg-[#2C2C2E] hover:bg-gray-100 dark:hover:bg-[#3A3A3C]'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeTab === 'ios' ? 'bg-[#007AFF] text-white' : 'bg-gray-200 dark:bg-[#3A3A3C] text-gray-500 dark:text-gray-400'}`}>
                   <Smartphone className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className={`font-semibold ${activeTab === 'ios' ? 'text-[#007AFF] dark:text-[#5AC8FA]' : 'text-gray-700 dark:text-gray-200'}`}>iOS App Icon</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">iPhone, iPad, App Store</div>
                </div>
                {activeTab === 'ios' && <CheckCircle2 className="w-5 h-5 text-[#007AFF] ml-auto" />}
              </button>

              <button
                onClick={() => setActiveTab('macos')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  activeTab === 'macos' 
                    ? 'border-[#007AFF] bg-[#007AFF]/5 dark:bg-[#007AFF]/10' 
                    : 'border-transparent bg-gray-50 dark:bg-[#2C2C2E] hover:bg-gray-100 dark:hover:bg-[#3A3A3C]'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeTab === 'macos' ? 'bg-[#007AFF] text-white' : 'bg-gray-200 dark:bg-[#3A3A3C] text-gray-500 dark:text-gray-400'}`}>
                   <Monitor className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className={`font-semibold ${activeTab === 'macos' ? 'text-[#007AFF] dark:text-[#5AC8FA]' : 'text-gray-700 dark:text-gray-200'}`}>macOS App Icon</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">16pt - 512pt</div>
                </div>
                {activeTab === 'macos' && <CheckCircle2 className="w-5 h-5 text-[#007AFF] ml-auto" />}
              </button>

              <button
                onClick={() => setActiveTab('android')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  activeTab === 'android' 
                    ? 'border-[#3DDC84] bg-[#3DDC84]/5 dark:bg-[#3DDC84]/10' 
                    : 'border-transparent bg-gray-50 dark:bg-[#2C2C2E] hover:bg-gray-100 dark:hover:bg-[#3A3A3C]'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeTab === 'android' ? 'bg-[#3DDC84] text-white' : 'bg-gray-200 dark:bg-[#3A3A3C] text-gray-500 dark:text-gray-400'}`}>
                   <Box className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className={`font-semibold ${activeTab === 'android' ? 'text-[#3DDC84]' : 'text-gray-700 dark:text-gray-200'}`}>Android Icon</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Mipmap folders (mdpi - xxxhdpi)</div>
                </div>
                {activeTab === 'android' && <CheckCircle2 className="w-5 h-5 text-[#3DDC84] ml-auto" />}
              </button>

              <button
                onClick={() => setActiveTab('imageset')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  activeTab === 'imageset' 
                    ? 'border-[#007AFF] bg-[#007AFF]/5 dark:bg-[#007AFF]/10' 
                    : 'border-transparent bg-gray-50 dark:bg-[#2C2C2E] hover:bg-gray-100 dark:hover:bg-[#3A3A3C]'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeTab === 'imageset' ? 'bg-[#007AFF] text-white' : 'bg-gray-200 dark:bg-[#3A3A3C] text-gray-500 dark:text-gray-400'}`}>
                   <ImageIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className={`font-semibold ${activeTab === 'imageset' ? 'text-[#007AFF] dark:text-[#5AC8FA]' : 'text-gray-700 dark:text-gray-200'}`}>Image Set</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Universal 1x, 2x, 3x (Assumes 3x input)</div>
                </div>
                {activeTab === 'imageset' && <CheckCircle2 className="w-5 h-5 text-[#007AFF] ml-auto" />}
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Preview & Action */}
        <div className="lg:col-span-7 flex flex-col h-full space-y-6">
           <section className="bg-white dark:bg-[#1C1C1E] rounded-3xl shadow-sm border border-gray-100 dark:border-[#2C2C2E] flex-1 flex flex-col overflow-hidden min-h-[500px] transition-colors">
              <div className="p-6 border-b border-gray-100 dark:border-[#2C2C2E] flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-gray-400" /> Generated Assets
                  <span className="bg-gray-100 dark:bg-[#2C2C2E] text-gray-500 dark:text-gray-400 text-xs px-2 py-1 rounded-full font-mono">
                    {generatedAssets.length} items
                  </span>
                </h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50/50 dark:bg-black/20">
                {!file ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#2C2C2E] flex items-center justify-center mb-4 transition-colors">
                       <Layers className="w-8 h-8 opacity-20" />
                    </div>
                    <p>Upload an image to see generated assets</p>
                  </div>
                ) : isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-[#007AFF]">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p className="font-medium">Processing assets...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {generatedAssets.map((asset, idx) => (
                      <div key={idx} className="group relative bg-white dark:bg-[#2C2C2E] rounded-xl p-3 shadow-sm border border-gray-100 dark:border-[#3A3A3C] flex flex-col items-center hover:shadow-md transition-all">
                        <div className="relative w-full aspect-square flex items-center justify-center mb-3 bg-gray-50 dark:bg-[#1C1C1E] rounded-lg overflow-hidden border border-gray-100 dark:border-[#3A3A3C]">
                          <div 
                             className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
                             style={{
                               backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)',
                               backgroundSize: '20px 20px',
                               backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                             }}
                          />
                          <img 
                            src={asset.url} 
                            alt={asset.name} 
                            className="max-w-full max-h-full object-contain z-10" 
                          />
                        </div>
                        <div className="w-full text-center">
                          {renderAssetLabel(asset.spec.label || asset.name)}
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                             {activeTab === 'android' ? `${asset.spec.size}px` : (asset.spec.size > 0 ? `${asset.spec.size}pt` : 'Auto')} {activeTab !== 'android' && `@${asset.spec.scale}x`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-[#2C2C2E] bg-white dark:bg-[#1C1C1E] z-10 transition-colors">
                <button
                  onClick={handleDownload}
                  disabled={!file || isGenerating}
                  className={`
                    w-full py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-lg transition-all
                    ${!file || isGenerating 
                      ? 'bg-gray-100 dark:bg-[#2C2C2E] text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                      : (activeTab === 'android' ? 'bg-[#3DDC84] text-white hover:bg-[#32b56b]' : 'bg-[#007AFF] text-white hover:bg-[#0062cc]') + ' shadow-lg active:scale-[0.99]'
                    }
                  `}
                >
                  {isGenerating ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Download className="w-5 h-5" /> Download {activeTab === 'android' ? 'Resources' : 'Asset Catalog'} (.zip)
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
                   {activeTab === 'android' 
                    ? 'Includes res/mipmap-* folders' 
                    : <>Includes <code>Contents.json</code> compatible with Xcode 14+</>}
                </p>
              </div>
           </section>
        </div>

      </div>
    </div>
  );
}

export default App;