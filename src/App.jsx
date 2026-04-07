import React, { useState, useEffect } from 'react';
import { AlertTriangle, Droplets, Wind, Thermometer, Cloud, Eye, TrendingUp, MapPin, RefreshCw, Gauge } from 'lucide-react';

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  // Dummy data simulating OneCall API 3.0
  const weatherData = {
    location: "Martapura, Kalimantan Selatan",
    lat: -3.417,
    lon: 114.850,
    current: {
      temp: 28.5,
      humidity: 85,
      wind_speed: 12.5,
      clouds: 75,
      rain_1h: 8.2,
      pressure: 1010,
      visibility: 8000
    },
    hourly: [
      { time: "00:00", rain: 2.5, temp: 27 },
      { time: "03:00", rain: 5.2, temp: 26 },
      { time: "06:00", rain: 8.5, temp: 26 },
      { time: "09:00", rain: 12.3, temp: 27 },
      { time: "12:00", rain: 15.8, temp: 28 },
      { time: "15:00", rain: 18.2, temp: 29 },
      { time: "18:00", rain: 14.5, temp: 28 },
      { time: "21:00", rain: 10.2, temp: 27 }
    ]
  };

  // Layerwise Flood Risk Calculation
  const calculateFloodRisk = () => {
    // Layer 1: Curah Hujan (40%)
    const rainfallScore = weatherData.current.rain_1h > 15 ? 100 : 
                         weatherData.current.rain_1h > 10 ? 75 :
                         weatherData.current.rain_1h > 5 ? 50 : 25;
    
    // Layer 2: Kelembaban (25%)
    const humidityScore = weatherData.current.humidity > 85 ? 100 :
                         weatherData.current.humidity > 75 ? 75 :
                         weatherData.current.humidity > 65 ? 50 : 25;
    
    // Layer 3: Tutupan Awan (20%)
    const cloudScore = weatherData.current.clouds > 80 ? 100 :
                      weatherData.current.clouds > 60 ? 75 :
                      weatherData.current.clouds > 40 ? 50 : 25;
    
    // Layer 4: Kecepatan Angin (15%)
    const windScore = weatherData.current.wind_speed > 20 ? 25 :
                     weatherData.current.wind_speed > 15 ? 50 :
                     weatherData.current.wind_speed > 10 ? 75 : 100;

    // Weighted average
    const totalScore = (rainfallScore * 0.4) + (humidityScore * 0.25) + 
                      (cloudScore * 0.2) + (windScore * 0.15);
    
    return {
      score: totalScore,
      level: totalScore > 75 ? 'TINGGI' : totalScore > 50 ? 'SEDANG' : 'RENDAH',
      color: totalScore > 75 ? '#dc2626' : totalScore > 50 ? '#f97316' : '#10b981',
      bgColor: totalScore > 75 ? '#fee2e2' : totalScore > 50 ? '#ffedd5' : '#dcfce7',
      layers: { rainfallScore, humidityScore, cloudScore, windScore }
    };
  };

  const floodRisk = calculateFloodRisk();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Top Date Bar */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 border-b border-white/20 py-2 px-6 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white">
            <span className="uppercase font-semibold">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <div className="flex items-center gap-4">
              <span className="font-semibold">Waktu Setempat</span>
              <span className="font-mono font-bold bg-white/20 px-3 py-1 rounded">
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WITA
              </span>
              <span className="text-white/60">|</span>
              <span className="font-mono text-white/80">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC', hour12: false })} UTC
              </span>
            </div>
          </div>
        </div>

        {/* Header with Logo */}
        <header className="bg-white/95 backdrop-blur-md shadow-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Team Logo */}
                <div className="w-20 h-20 flex-shrink-0">
                  <img 
                    src="https://i.imgur.com/Wryhn1q.png" 
                    alt="Layerwise Team Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                    Sistem Peringatan Dini
                  </div>
                  <div className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 font-bold uppercase">
                    Banjir Berbasis Layerwise
                  </div>
                </div>
              </div>
              
              <nav className="hidden lg:flex items-center gap-6 text-sm">
                <a href="#" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">Profil</a>
                <a href="#" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">Cuaca</a>
                <a href="#" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">Iklim</a>
                <a href="#" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">Kualitas Udara</a>
                <a href="#" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">Gempa Bumi</a>
                <a href="#" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">Geofisika</a>
              </nav>

              <button 
                onClick={handleRefresh}
                className="flex items-center gap-2 px-5 py-2.5 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
              >
                <RefreshCw size={16} className={isUpdating ? 'animate-spin' : ''} />
                Perbarui
              </button>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-white/30">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <a href="#" className="hover:text-cyan-600 font-medium">Beranda</a>
              <span className="text-gray-400">›</span>
              <a href="#" className="hover:text-cyan-600 font-medium">Cuaca Kalimantan Selatan</a>
              <span className="text-gray-400">›</span>
              <span className="text-gray-900 font-semibold">Kota Martapura</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Prakiraan Peringatan Banjir Kota Martapura
            </h1>
            <p className="text-white/90 text-lg drop-shadow">
              Prakiraan peringatan banjir kecamatan di Kota Martapura, Kalimantan Selatan
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Cari kelurahan/desa..."
                  className="w-full px-4 py-3 pl-12 bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-200/50 text-gray-900 shadow-lg"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Main Alert Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border-2 border-white/50">
              <div 
                className="px-8 py-6 border-l-8"
                style={{ 
                  borderLeftColor: floodRisk.color,
                  backgroundColor: floodRisk.bgColor
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl"
                      style={{ backgroundColor: floodRisk.color }}
                    >
                      <AlertTriangle size={40} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                        Status Peringatan Banjir
                      </h2>
                      <div className="text-5xl font-black tracking-tight" style={{ color: floodRisk.color }}>
                        {floodRisk.level}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div 
                      className="inline-block px-8 py-4 rounded-xl text-white font-bold text-xl shadow-xl" 
                      style={{ backgroundColor: floodRisk.color }}
                    >
                      {floodRisk.level === 'TINGGI' ? '⚠️ SIAGA' : 
                       floodRisk.level === 'SEDANG' ? '⚡ WASPADA' : '✓ AMAN'}
                    </div>
                    <p className="text-gray-650 font-semibold mt-3 text-lg">
                      Skor Risiko: <span style={{ color: floodRisk.color }}>{floodRisk.score.toFixed(1)}</span>/100
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="px-8 py-5 bg-white border-t border-gray-200">
                <p className="text-gray-700 text-sm leading-relaxed">
                  <strong className="text-gray-900">Keterangan:</strong> {
                    floodRisk.level === 'TINGGI' 
                      ? 'Potensi banjir sangat tinggi. Segera lakukan langkah antisipasi dan waspada terhadap peningkatan curah hujan.'
                      : floodRisk.level === 'SEDANG'
                      ? 'Potensi banjir pada tingkat menengah. Tetap waspada dan pantau perkembangan cuaca secara berkala.'
                      : 'Kondisi cuaca normal. Risiko banjir rendah, namun tetap monitor perkembangan cuaca.'
                  }
                </p>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-white/50">
              <div className="flex items-center gap-2 text-gray-800 mb-4">
                <MapPin size={20} className="text-cyan-600" />
                <span className="font-semibold text-lg">Lokasi Pemantauan</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">Kecamatan</div>
                  <div className="font-semibold text-gray-900">Martapura</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">Koordinat</div>
                  <div className="font-mono text-gray-900">{weatherData.lat}°, {weatherData.lon}°</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase mb-1">Pembaruan Terakhir</div>
                  <div className="font-semibold text-gray-900">
                    {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WITA
                  </div>
                </div>
              </div>
            </div>

            {/* Current Weather Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <WeatherCardColorful 
                icon={<Droplets />} 
                label="Curah Hujan"
                value={weatherData.current.rain_1h}
                unit="mm/jam"
                gradient="from-blue-500 to-cyan-400"
              />
              <WeatherCardColorful 
                icon={<Thermometer />} 
                label="Suhu Udara"
                value={weatherData.current.temp}
                unit="°C"
                gradient="from-orange-500 to-red-500"
              />
              <WeatherCardColorful 
                icon={<Wind />} 
                label="Kecepatan Angin"
                value={weatherData.current.wind_speed}
                unit="km/jam"
                gradient="from-teal-500 to-emerald-400"
              />
              <WeatherCardColorful 
                icon={<Cloud />} 
                label="Kelembaban"
                value={weatherData.current.humidity}
                unit="%"
                gradient="from-purple-500 to-pink-500"
              />
            </div>

            {/* Layerwise Analysis */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-white/50">
              <div className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 border-b border-white/20">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Gauge size={24} />
                  Analisis Metode Layerwise
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <LayerBarColorful 
                    label="Layer 1: Intensitas Curah Hujan"
                    score={floodRisk.layers.rainfallScore}
                    weight={0.4}
                    icon={<Droplets size={18} />}
                    gradient="from-blue-500 to-cyan-400"
                  />
                  <LayerBarColorful 
                    label="Layer 2: Kelembaban Udara"
                    score={floodRisk.layers.humidityScore}
                    weight={0.25}
                    icon={<Cloud size={18} />}
                    gradient="from-purple-500 to-pink-500"
                  />
                  <LayerBarColorful 
                    label="Layer 3: Tutupan Awan"
                    score={floodRisk.layers.cloudScore}
                    weight={0.2}
                    icon={<Eye size={18} />}
                    gradient="from-indigo-500 to-purple-500"
                  />
                  <LayerBarColorful 
                    label="Layer 4: Kecepatan Angin"
                    score={floodRisk.layers.windScore}
                    weight={0.15}
                    icon={<Wind size={18} />}
                    gradient="from-teal-500 to-emerald-500"
                  />
                </div>
                
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-600 p-5 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Metodologi Perhitungan</h4>
                  <p className="text-gray-700 text-xs leading-relaxed">
                    Sistem menggunakan pendekatan <strong>layerwise (berlapis)</strong> untuk menghitung risiko banjir 
                    berdasarkan empat parameter meteorologi utama dengan bobot berbeda sesuai tingkat pengaruhnya. 
                    Setiap layer memberikan kontribusi yang kemudian diagregasi menggunakan weighted average 
                    untuk menghasilkan skor risiko final (0-100).
                  </p>
                </div>
              </div>
            </div>

            {/* Rainfall Chart */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-white/50">
              <div className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 border-b border-white/20">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp size={24} />
                  Prakiraan Curah Hujan 24 Jam
                </h3>
              </div>
              <div className="p-6">
                <div className="h-64 flex items-end justify-between gap-2 mb-5">
                  {weatherData.hourly.map((hour, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full group">
                        <div 
                          className="w-full bg-gradient-to-t from-cyan-600 to-blue-400 hover:from-cyan-500 hover:to-blue-300 rounded-t-lg transition-all cursor-pointer shadow-lg"
                          style={{ height: `${Math.max((hour.rain / 20) * 100, 8)}%` }}
                        >
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl">
                            {hour.rain} mm
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-900">{hour.time}</div>
                        <div className="text-xs text-gray-500">{hour.temp}°C</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-cyan-600 to-blue-400 rounded"></div>
                    <span>Intensitas Hujan (mm/jam)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer size={16} className="text-orange-600" />
                    <span>Suhu (°C)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center border-2 border-white/50">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-lg">⚠️</span>
                </div>
                <p className="text-gray-900 font-bold text-lg">Status: Versi Demo</p>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Website ini menggunakan data simulasi untuk keperluan demonstrasi. 
                Sistem akan terhubung dengan <strong>OpenWeather OneCall API 3.0</strong> pada implementasi final.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-200">
                <span>📊 Metode: Layerwise</span>
                <span>•</span>
                <span>🌐 OpenWeather API</span>
                <span>•</span>
                <span>🎓 PKM 2025</span>
              </div>
              <p className="text-gray-400 text-xs mt-3">
                © 2025 Program Kreativitas Mahasiswa - Universitas Lambung Mangkurat
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeatherCardColorful({ icon, label, value, unit, gradient }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 border-2 border-white/50 hover:border-white/80 transition-all shadow-xl hover:shadow-2xl hover:scale-105 duration-200">
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
        {React.cloneElement(icon, { size: 28, className: 'text-white', strokeWidth: 2.5 })}
      </div>
      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="text-base font-semibold text-gray-500">{unit}</div>
      </div>
    </div>
  );
}

function LayerBarColorful({ label, score, weight, icon, gradient }) {
  const getColor = (score) => {
    if (score > 75) return { bar: '#dc2626', bg: '#fee2e2' };
    if (score > 50) return { bar: '#f97316', bg: '#ffedd5' };
    return { bar: '#10b981', bg: '#dcfce7' };
  };

  const colors = getColor(score);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border-2 border-gray-100 shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center text-white shadow-md`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-gray-900">{label}</div>
          <div className="text-xs text-gray-500">Bobot: {(weight * 100).toFixed(0)}%</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{score}</div>
          <div className="text-xs text-gray-500">/ 100</div>
        </div>
      </div>
      <div className="h-4 rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: colors.bg }}>
        <div 
          className="h-full rounded-full transition-all duration-700 shadow-sm"
          style={{ 
            width: `${score}%`,
            backgroundColor: colors.bar
          }}
        ></div>
      </div>
      <div className="text-xs font-semibold text-gray-600 mt-2">
        Kontribusi: <span style={{ color: colors.bar }}>{(score * weight).toFixed(1)}</span> poin
      </div>
    </div>
  );
}
